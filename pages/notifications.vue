<template>
  <div class="max-w-7xl mx-auto px-4 py-5">
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Notifications</h1>
        <p class="text-gray-500 text-sm mt-1">Updates about your orders and errands</p>
      </div>
      <button 
        v-if="notifications.length > 0 && unreadCount > 0"
        @click="markAllAsRead"
        class="text-sm font-semibold text-[#FF5C1A] hover:bg-blue-50 px-4 py-2 rounded-xl transition-all"
      >
        Mark all as read
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 5" :key="i" class="h-24 bg-white rounded-2xl border border-gray-50 animate-pulse" />
    </div>

    <!-- Empty State -->
    <div v-else-if="notifications.length === 0" class="bg-white rounded-3xl p-12 text-center border border-gray-50 shadow-sm">
      <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🔔</div>
      <h3 class="text-lg font-bold text-gray-900 mb-2">No notifications yet</h3>
      <p class="text-gray-500 max-w-xs mx-auto">We'll let you know when there's an update on your orders or errands.</p>
    </div>

    <!-- Notifications List -->
    <div v-else class="space-y-3">
      <div 
        v-for="notif in notifications" 
        :key="notif.id"
        @click="handleNotificationClick(notif)"
        :class="[
          'p-5 rounded-2xl border transition-all cursor-pointer group',
          notif.read ? 'bg-white border-gray-100' : 'bg-[#FF5C1A]/[0.02] border-[#FF5C1A]/10'
        ]"
      >
        <div class="flex gap-4">
          <div :class="[
            'w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0',
            getBgColor(notif.type)
          ]">
            {{ getEmoji(notif.type) }}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex justify-between items-start gap-4">
              <div>
                <h4 class="font-bold text-gray-900 text-base leading-tight">{{ notif.title }}</h4>
                <p class="text-gray-500 text-sm mt-1 leading-relaxed">{{ notif.body }}</p>
              </div>
              <div class="flex flex-col items-end gap-2">
                <span class="text-[11px] font-medium text-gray-400 whitespace-nowrap">{{ formatTime(notif.createdAt) }}</span>
                <div v-if="!notif.read" class="w-2.5 h-2.5 bg-[#FF5C1A] rounded-full shadow-sm shadow-blue-400" />
              </div>
            </div>
            
            <!-- Quick Action -->
            <div v-if="notif.data?.orderId" class="mt-4">
              <NuxtLink 
                :to="`/orders/${notif.data.orderId}`"
                class="inline-flex items-center text-sm font-bold text-[#FF5C1A] hover:gap-2 transition-all gap-1"
              >
                View Order Details
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useNotifications } from '@/composables/modules/notifications/useNotifications'

definePageMeta({
  layout: 'student'
})

const { notifications, loading, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useNotifications()

const getEmoji = (type: string) => {
  switch (type) {
    case 'ORDER_ACCEPTED': return '✅'
    case 'ORDER_STATUS_UPDATE': return '📦'
    case 'NEW_ORDER_AVAILABLE': return '🚀'
    default: return '🔔'
  }
}

const getBgColor = (type: string) => {
  switch (type) {
    case 'ORDER_ACCEPTED': return 'bg-emerald-50 text-emerald-600'
    case 'ORDER_STATUS_UPDATE': return 'bg-blue-50 text-[#FF5C1A]'
    case 'NEW_ORDER_AVAILABLE': return 'bg-purple-50 text-purple-600'
    default: return 'bg-gray-50 text-gray-600'
  }
}

const formatTime = (date: string) => {
  if (!date) return ''
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(mins / 60)
  const days = Math.floor(hours / 24)

  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'Yesterday'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const handleNotificationClick = async (notif: any) => {
  if (!notif.read) {
    await markAsRead(notif.id)
  }
  if (notif.data?.orderId) {
    navigateTo(`/orders/${notif.data.orderId}`)
  }
}

onMounted(() => {
  fetchNotifications()
})
</script>
