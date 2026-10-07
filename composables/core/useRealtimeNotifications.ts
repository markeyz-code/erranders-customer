import { onMounted, onBeforeUnmount } from 'vue'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useRealtimeSocket } from '@/composables/core/useRealtimeSocket'
import { useNotifications } from '@/composables/modules/notifications/useNotifications'

const LISTENERS_KEY = 'realtime_notification_listeners'

const playSound = (path: string) => {
  try {
    const audio = new Audio(path)
    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise.catch(e => console.warn('Audio playback failed', e))
    }
  } catch (error) {
    console.error(error)
  }
}

const playNotificationSound = () => playSound('/sounds/new_notification.m4a')
const playOrderAcceptedSound = () => playSound('/sounds/order_accepted.m4a')
const playOrderStatusUpdateSound = () => playSound('/sounds/order_status_update.m4a')
const playCounterOfferSound = () => playSound('/sounds/counter_offer.m4a')

if (typeof document !== 'undefined') {
  const unlockAudio = () => {
    const audio = new Audio('/sounds/new_notification.m4a')
    audio.volume = 0;
    audio.play().catch(() => {});
    document.removeEventListener('click', unlockAudio);
  };
  document.addEventListener('click', unlockAudio);
}

const playPingAlertSound = () => {
  // Play the urgent alert sound immediately
  playSound('/sounds/order-alert.mp3');
  // Play it again after 1.5 seconds for emphasis
  setTimeout(() => playSound('/sounds/order-alert.mp3'), 1500);
}

export const useRealtimeNotifications = () => {
  const { showToast } = useCustomToast()
  const { socket, connectSocket } = useRealtimeSocket()
  const { addNotification } = useNotifications()
  const listenersAttached = useState<boolean>(LISTENERS_KEY, () => false)

  const handleNotification = (payload: any) => {
    if (!payload) return

    // Special aggressive handling for PING_NOTIFICATION
    if (payload.type === 'PING_NOTIFICATION') {
      playPingAlertSound()

      addNotification({
        id: payload.id || `ping_${Date.now()}`,
        ...payload
      })

      const senderName = payload.data?.senderName || 'Someone'
      const orderNum = payload.data?.orderNumber || ''

      showToast({
        title: `🔔 ${senderName} is pinging you!`,
        message: payload.body || `Regarding order #${orderNum}. Please check your order now!`,
        toastType: 'warning',
        duration: 10000,
        action: payload.data?.orderId ? () => {
          window.location.href = `/orders/${payload.data.orderId}`
        } : undefined
      })

      // Emit a custom browser event so the order page can react with a visible banner
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('errandr:ping-received', {
          detail: { ...payload.data, body: payload.body, title: payload.title }
        }))
      }
      return
    }

    if (payload.type === 'ORDER_BIDS_UPDATE' || payload.type === 'BID_COUNTERED') {
      playCounterOfferSound()
    } else {
      playNotificationSound()
    }

    // Aggressively push student to details page if their order was accepted
    if (payload.type === 'ORDER_ACCEPTED' && payload.data?.orderId) {
      setTimeout(() => {
        window.location.href = `/dashboard/orders/${payload.data.orderId}`
      }, 500)
    }

    addNotification({
      id: payload.id || `notif_${Date.now()}`,
      ...payload
    })

    showToast({
      title: payload.title || 'Notification',
      message: payload.body || payload.message || payload.type || 'You have a new update',
      toastType: payload.priority === 'high' || payload.type === 'NEW_CHAT_MESSAGE' ? 'warning' : 'info',
      duration: 5000,
      action: payload.type === 'NEW_CHAT_MESSAGE' && payload.data?.orderId ? () => {
        // Navigate to the order page with a query parameter indicating we should open the chat
        // We also pass the senderId to ensure the correct chat room opens
        window.location.href = `/orders/${payload.data.orderId}?openChat=${payload.data.senderId || 'true'}`
      } : undefined
    })
  }

  const handleAudit = (payload: any) => {
    if (!payload) return

    playNotificationSound()

    showToast({
      title: payload.action ? `Audit: ${payload.action}` : 'Audit Update',
      message: payload.description || 'A new audit log was recorded',
      toastType: 'info',
      duration: 5000,
    })
  }

  const handleOrderAccepted = (payload: any) => {
    if (!payload) return

    playOrderAcceptedSound()
    addNotification({
      id: payload.id || `accepted_${Date.now()}`,
      title: 'Order Accepted',
      body: `Your order #${payload.orderNumber || payload.data?.orderId || ''} has been accepted`,
      ...payload
    })

    showToast({
      title: '✅ Order Accepted!',
      message: `${payload.errander?.firstName || 'A rider'} has accepted your order #${payload.orderNumber || ''}!`,
      toastType: 'success',
      duration: 6000,
    })

    const orderId = payload.data?.orderId || payload.orderId || payload.orderNumber;
    if (orderId) {
      setTimeout(() => {
        window.location.href = `/dashboard/orders/${orderId}`
      }, 500)
    }
  }

  const handleOrderStatusUpdate = (payload: any) => {
    if (!payload) return

    playOrderStatusUpdateSound()
    addNotification({
      id: payload.id || `status_${Date.now()}`,
      title: 'Order Update',
      body: `Order #${payload.orderNumber} status changed`,
      ...payload
    })

    showToast({
      title: '📦 Order Update',
      message: `Your order #${payload.orderNumber} is now ${payload.status?.replace(/_/g, ' ').toLowerCase()}`,
      toastType: 'info',
      duration: 6000,
    })
  }

  onMounted(() => {
    connectSocket()

    if (listenersAttached.value || !socket.value) return
    listenersAttached.value = true

    socket.value.on('notification:new', handleNotification)
    socket.value.on('audit:log', handleAudit)
    socket.value.on('notification:order-accepted', handleOrderAccepted)
    socket.value.on('notification:order-status-update', handleOrderStatusUpdate)
  })

  onBeforeUnmount(() => {
    if (!socket.value || !listenersAttached.value) return

    socket.value.off('notification:new', handleNotification)
    socket.value.off('audit:log', handleAudit)
    socket.value.off('notification:order-accepted', handleOrderAccepted)
    socket.value.off('notification:order-status-update', handleOrderStatusUpdate)
    listenersAttached.value = false
  })
}
