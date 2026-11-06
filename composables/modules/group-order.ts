import { ref, computed, watch, onUnmounted } from 'vue'
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'
import { useCart } from '@/composables/modules/cart'
import { useUser } from '@/composables/modules/auth/user'
import { useRealtimeSocket } from '@/composables/core/useRealtimeSocket'
import { useToast } from '@/composables/useToast'

const groupOrder = ref<any>(null)
const activeCode = ref<string | null>(null)
const isLoading = ref(false)

// Initialize from localStorage immediately
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('errandr_active_group_code')
  if (saved) activeCode.value = saved
}

/**
 * Generate or retrieve a persistent guest ID for unauthenticated users.
 * This ensures the same guest is recognized across join, updateItems,
 * and toggleReady calls within the same browser session.
 */
const getGuestId = (): string => {
  if (typeof window === 'undefined') return ''
  let guestId = localStorage.getItem('errandr_guest_id')
  if (!guestId) {
    // Generate a 24-char hex string that looks like a valid MongoDB ObjectId
    const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0')
    const random = Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
    guestId = timestamp + random
    localStorage.setItem('errandr_guest_id', guestId)
  }
  return guestId
}

export const useGroupOrder = () => {
  const cart = useCart()
  const { user } = useUser()
  const { socket, isConnected, connectSocket } = useRealtimeSocket()
  const { showToast } = useToast()

  // Ensure socket connects immediately
  if (typeof window !== 'undefined') {
    connectSocket()
  }

  /** Returns { guestId } payload only when the user is NOT logged in */
  const guestPayload = () => {
    if (user.value?._id) return {}
    return { guestId: getGuestId() }
  }

  const isHost = computed(() => {
    if (!groupOrder.value) return false
    const uId = user.value?._id
    const gId = typeof window !== 'undefined' ? localStorage.getItem('errandr_guest_id') : null
    const hostId = groupOrder.value.host?._id || groupOrder.value.host
    return Boolean((uId && hostId === uId) || (gId && hostId === gId))
  })
  
  const getMyStatus = computed(() => {
    if (!groupOrder.value) return null
    const uId = user.value?._id
    const gId = typeof window !== 'undefined' ? localStorage.getItem('errandr_guest_id') : null
    return groupOrder.value.participants.find((p: any) => {
      const pId = p.user?._id || p.user
      return (uId && pId === uId) || (gId && pId === gId)
    })
  })

  const isSponsor = computed(() => {
    if (!groupOrder.value || groupOrder.value.splitType !== 'sponsor') return false
    const uId = user.value?._id
    const gId = typeof window !== 'undefined' ? localStorage.getItem('errandr_guest_id') : null
    const sId = groupOrder.value.sponsorId?._id || groupOrder.value.sponsorId
    return Boolean((uId && sId === uId) || (gId && sId === gId))
  })
  const createGroupOrder = async (vendorId?: string, name?: string) => {
    isLoading.value = true
    try {
      const { data } = await api.post('/group-orders', { vendorId, name, ...guestPayload() })
      groupOrder.value = data
      activeCode.value = data.inviteCode
      if (socket.value) {
        socket.value.emit('join-room', data.inviteCode)
      }
      return data
    } finally {
      isLoading.value = false
    }
  }

  const joinGroupOrder = async (code: string) => {
    isLoading.value = true
    try {
      const { data } = await api.post(`/group-orders/join/${code}`, { ...guestPayload() })
      groupOrder.value = data
      activeCode.value = code
      if (socket.value) {
        socket.value.emit('join-room', code)
      }
      return data
    } finally {
      isLoading.value = false
    }
  }

  const fetchGroupOrder = async (code: string) => {
    try {
      const res = await api.get(`/group-orders/${code}`) as any
      if (res?.type === 'ERROR') throw res
      
      const { data } = res
      groupOrder.value = data
      activeCode.value = code
      if (socket.value) {
        socket.value.emit('join-room', code)
      }
      return data
    } catch (e) {
      activeCode.value = null
      groupOrder.value = null
      throw e
    }
  }

  const updateItems = async (items: any[]) => {
    if (!activeCode.value) return
    try {
      const { data } = await api.patch(`/group-orders/${activeCode.value}/items`, { items, ...guestPayload() })
      groupOrder.value = data
    } catch (e) {
      console.error('Failed to update group items', e)
    }
  }

  const toggleReady = async (isReady: boolean) => {
    if (!activeCode.value) return
    try {
      const { data } = await api.patch(`/group-orders/${activeCode.value}/toggle-ready`, { isReady, ...guestPayload() })
      groupOrder.value = data
    } catch (e) {
      console.error('Failed to toggle ready state', e)
    }
  }

  const initiateCheckout = async (splitType: string) => {
    if (!activeCode.value) return
    isLoading.value = true
    try {
      const { data } = await api.post(`/group-orders/${activeCode.value}/checkout-initiate`, { splitType, ...guestPayload() })
      groupOrder.value = data
      return data
    } finally {
      isLoading.value = false
    }
  }

  const checkout = async (paymentReference?: string) => {
    if (!activeCode.value) return
    isLoading.value = true
    try {
      const { data } = await api.post(`/group-orders/${activeCode.value}/checkout`, { paymentReference, ...guestPayload() })
      groupOrder.value = data
      return data
    } finally {
      isLoading.value = false
    }
  }

  const leaveGroupOrder = async () => {
    if (activeCode.value) {
      try {
        await api.post(`/group-orders/leave/${activeCode.value}`, guestPayload())
      } catch (e) {
        console.error('Failed to leave group on backend', e)
        throw e
      }
      if (socket.value) {
        socket.value.emit('leave-room', activeCode.value)
      }
    }
    groupOrder.value = null
    activeCode.value = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('errandr_active_group_code')
    }
  }

  const syncWithCart = (_vendorId?: string) => {
    const allItems: any[] = []
    const vendorIds = cart.allVendorIds.value || []
    
    vendorIds.forEach(vId => {
      const packsByVendor = cart.getPacksByVendor(vId)
      const packs = packsByVendor.value || packsByVendor
      if (packs && packs.length > 0) {
        packs.forEach((pack: any) => {
          (pack.items || []).forEach((item: any) => {
            allItems.push({
              productId: item.productId || item._id,
              vendorId: item.vendorId || vId,
              vendorName: item.vendorName || '',
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              customizations: item.customizations || [],
              image: item.image || ''
            })
          })
        })
      }
    })
    
    updateItems(allItems)
  }

  const totalGroupItems = computed(() => {
    if (!groupOrder.value) return 0
    return groupOrder.value.participants?.reduce((sum: number, p: any) => sum + (p.items?.reduce((s: number, i: any) => s + i.quantity, 0) || 0), 0) || 0
  })

  // Socket event listeners
  const setupEventListeners = () => {
    if (!socket.value) return

    socket.value.on('group-order-updated', (data: any) => {
      groupOrder.value = data
    })

    socket.value.on('member-joined', (memberData: any) => {
      if (memberData && memberData._id !== user.value?._id) {
        showToast(`New Participant: ${memberData.firstName || 'A guest'} joined the group order!`, 'info')
      }
    })

    socket.value.on('items-updated', (data: { userId: string, items: any[], total: number }) => {
      if (groupOrder.value) {
        const participant = groupOrder.value.participants.find((p: any) => p.user?._id === data.userId || p.user === data.userId)
        if (participant) {
          participant.items = data.items
          participant.total = data.total
        }
      }
    })

      socket.value.on('group-order-status-changed', (data: any) => {
        if (groupOrder.value && groupOrder.value.inviteCode === data.inviteCode) {
          groupOrder.value.status = data.status
        }
      })

      socket.value.on('group-order-payment-progress', (data: any) => {
        if (groupOrder.value && groupOrder.value.inviteCode === data.inviteCode) {
          groupOrder.value = data
        }
      })

    socket.value.on('status-changed', (status: string) => {
      if (groupOrder.value) {
        groupOrder.value.status = status
        let message = ''
        if (status === 'locked') message = 'The host has locked the order. No more changes allowed.'
        if (status === 'completed') message = 'Success! The group order has been placed.'
        if (status === 'cancelled') message = 'The group order was cancelled by the host.'

        if (message) {
          showToast(`Group Order Status: ${message}`, status === 'completed' ? 'success' : 'warning')
        }
      }
    })
  }

  const cleanupEventListeners = () => {
    if (!socket.value) return
    socket.value.off('group-order-updated')
    socket.value.off('member-joined')
    socket.value.off('items-updated')
    socket.value.off('status-changed')
  }

  // Auto-connect socket if code is available and persist code
  watch([socket, activeCode, isConnected], ([newSocket, newCode, newIsConnected]) => {
    if (typeof window !== 'undefined') {
      if (newCode) localStorage.setItem('errandr_active_group_code', newCode)
      else localStorage.removeItem('errandr_active_group_code')
    }

    if (newSocket && newCode && newIsConnected) {
      cleanupEventListeners()
      newSocket.emit('join-room', newCode)
      setupEventListeners()
    }
  }, { immediate: true })

  // If there's a cached code but no groupOrder data, fetch it
  if (activeCode.value && !groupOrder.value) {
    fetchGroupOrder(activeCode.value).catch(() => {
      // If the group order is not found (e.g. cancelled), clear the cache
      activeCode.value = null
      if (typeof window !== 'undefined') localStorage.removeItem('errandr_active_group_code')
    })
  }

  const fetchHistory = async () => {
    try {
      const { data } = await api.get('/group-orders/history', { params: guestPayload() })
      return data
    } catch (e) {
      console.error('Failed to fetch group order history', e)
      return []
    }
  }

  return {
    groupOrder,
    activeCode,
    isLoading,
    isHost,
    isSponsor,
    getMyStatus,
    totalGroupItems,
    initiateCheckout,
    createGroupOrder,
    joinGroupOrder,
    fetchGroupOrder,
    fetchHistory,
    updateItems,
    toggleReady,
    checkout,
    leaveGroupOrder,
    syncWithCart,
    cleanupEventListeners
  }
}

