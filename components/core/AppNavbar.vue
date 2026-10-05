<template>
  <header class="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-gray-50 flex-shrink-0">
    <div class="max-w-[1400px] mx-auto flex items-center justify-between px-4 sm:px-4 py-2.5 sm:py-3">
      <!-- Left Side -->
      <div class="flex items-center gap-3">
        <button v-if="showBack" @click="router.back()" class="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-50 hover:bg-gray-100 transition-all">
          <ArrowLeft class="w-4 h-4 text-gray-900" />
        </button>
        <NuxtLink to="/" class="flex items-center -ml-12 gap-2 group">
          <img src="@/assets/img/erranders.png" alt="Errandr Logo" class="h-7 w-32 sm:h-9 object-contain transition-transform duration-500 group-hover:scale-105" />
        </NuxtLink>
      </div>

      <!-- Right Side Actions -->
      <div class="flex items-center gap-2 lg:gap-4">
        <!-- Search (Optional) -->
        <slot name="search" />

        <!-- Static Links for Visitors -->
        <div v-if="!user" class="hidden sm:flex items-center gap-4 mr-2">
          <NuxtLink to="/auth/login" class="text-sm font-medium text-gray-400 uppercase  hover:text-gray-900 transition-colors">Log in</NuxtLink>
          <NuxtLink to="/auth/register" class="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium uppercase  rounded-xl shadow-sm border border-gray-50 shadow-black/5 hover:bg-parentPrimary transition-all">Join</NuxtLink>
        </div>

        <!-- Notification Bell -->
        <button 
          v-if="user" 
          @click="openNotificationsDrawer" 
          class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-all relative active:scale-95"
        >
          <Bell class="w-4 h-4 sm:w-4.5 sm:h-4.5 text-gray-950" />
          <div v-if="unreadCount > 0" class="absolute top-2 right-2 w-2 h-2 bg-parentPrimary rounded-full border border-white shadow-sm"></div>
        </button>

        <!-- Cart (Always visible if relevant) -->
        <NuxtLink v-if="showCart" to="/cart" class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-50 hover:bg-gray-100 transition-all relative">
          <ShoppingCart class="w-4 h-4 sm:w-4.5 sm:h-4.5 text-gray-900" />
          <div v-if="totalCartItems > 0" class="absolute -top-1 -right-1 w-4 h-4 bg-gray-900 text-white border border-white rounded-full flex items-center justify-center">
             <span class="text-[8px] font-bold">{{ totalCartItems }}</span>
          </div>
        </NuxtLink>

        <!-- Profile Dropdown -->
        <Menu v-if="user" as="div" class="relative">
          <MenuButton class="flex items-center gap-2.5 p-1 sm:p-1.5 rounded-xl bg-gray-50 border border-gray-50 hover:bg-gray-100 transition-all focus:outline-none">
            <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center font-bold text-xs sm:text-sm uppercase shadow-sm">
              {{ user.firstName?.[0] || user.email?.[0] }}
            </div>
            <ChevronDown class="w-3.5 h-3.5 text-gray-400 hidden lg:block" />
          </MenuButton>
          <Transition
            enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <MenuItems class="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-50 rounded-2xl bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-50 focus:outline-none z-[75] overflow-hidden">
              <div class="px-5 py-4">
                <p class="text-sm font-medium text-gray-400 uppercase  mb-1">Signed in as</p>
                <p class="text-sm font-medium text-gray-900 truncate tracking-tight">{{ user.firstName }} {{ user.lastName }}</p>
              </div>
              <div class="p-1.5">
                <MenuItem v-slot="{ active }">
                  <NuxtLink to="/dashboard" :class="[active ? 'bg-gray-50 text-parentPrimary' : 'text-gray-600', 'flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-bold transition-colors']">
                    <Home class="w-4 h-4 mr-3" /> Dashboard
                  </NuxtLink>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <NuxtLink to="/dashboard/wallet" :class="[active ? 'bg-gray-50 text-parentPrimary' : 'text-gray-600', 'flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-bold transition-colors']">
                    <Wallet class="w-4 h-4 mr-3" /> My Wallet
                  </NuxtLink>
                </MenuItem>
                <MenuItem v-slot="{ active }">
                  <NuxtLink to="/dashboard/profile" :class="[active ? 'bg-gray-50 text-parentPrimary' : 'text-gray-600', 'flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-bold transition-colors']">
                    <User class="w-4 h-4 mr-3" /> My Profile
                  </NuxtLink>
                </MenuItem>
              </div>
              <div class="p-1.5">
                <MenuItem v-slot="{ active }">
                  <button @click="handleLogout" :class="[active ? 'bg-rose-50 text-rose-500' : 'text-rose-500', 'flex w-full items-center rounded-xl px-3 py-2.5 text-sm font-bold transition-colors uppercase ']">
                    <LogOut class="w-4 h-4 mr-3" /> Log out
                  </button>
                </MenuItem>
              </div>
            </MenuItems>
          </Transition>
        </Menu>
      </div>
    </div>
  </header>

  <!-- ============================================ -->
  <!-- NOTIFICATIONS SIDEDRAWER                      -->
  <!-- ============================================ -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showNotificationsDrawer" class="fixed inset-0 z-[110] flex justify-end bg-black/55 backdrop-blur-sm" @click.self="showNotificationsDrawer = false">
        <div class="bg-white w-full max-w-md h-full overflow-hidden shadow-sm border border-gray-50 animate-slide-in-right p-4 flex flex-col justify-between">
          <!-- Header -->
          <div class="flex items-center justify-between pb-4 border-b border-gray-100 shrink-0">
            <div>
              <h3 class="text-xl font-bold text-gray-900 tracking-tight">notifications</h3>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                stay updated on your orders
              </p>
            </div>
            <div class="flex items-center gap-2">
              <button 
                v-if="notifications.length > 0 && unreadCount > 0"
                @click="markAllAsRead"
                class="text-xs font-bold text-parentPrimary hover:underline px-3 py-1.5 bg-parentPrimary/10 rounded-xl active:scale-95 transition-transform"
              >
                mark all as read
              </button>
              <button @click="showNotificationsDrawer = false" class="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X class="w-4.5 h-4.5 text-gray-500" />
              </button>
            </div>
          </div>

          <!-- Content Area -->
          <div class="flex-1 overflow-y-auto no-scrollbar py-4 space-y-4">
            <!-- Loading state -->
            <div v-if="loading" class="space-y-4">
              <div v-for="i in 4" :key="i" class="h-20 bg-gray-50 rounded-2xl animate-pulse" />
            </div>

            <!-- Empty State -->
            <div v-else-if="notifications.length === 0" class="flex flex-col items-center justify-center text-center py-20 space-y-4">
              <div class="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center shadow-sm border border-gray-50">
                <BellOff class="w-6 h-6 text-gray-300" />
              </div>
              <div class="space-y-1">
                <h4 class="text-sm font-bold text-gray-900 leading-none">No new alerts</h4>
                <p class="text-xs text-gray-400 max-w-[200px] mt-2 leading-relaxed">We'll alert you here for order updates and rewards.</p>
              </div>
            </div>

            <!-- Notifications List -->
            <div v-else class="space-y-3">
              <div 
                v-for="notif in notifications" 
                :key="notif.id"
                @click="handleNotificationClick(notif)"
                :class="[
                  'p-4 rounded-2xl border transition-all cursor-pointer group flex gap-3',
                  notif.read ? 'bg-white border-gray-100 hover:border-gray-200' : 'bg-[#FF5C1A]/[0.02] border-[#FF5C1A]/10 hover:border-[#FF5C1A]/20'
                ]"
              >
                <div :class="[
                  'w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0',
                  getBgColor(notif.type)
                ]">
                  {{ getEmoji(notif.type) }}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start gap-2">
                    <h4 class="font-bold text-gray-900 text-xs tracking-tight leading-tight group-hover:text-parentPrimary transition-colors">{{ notif.title }}</h4>
                    <span class="text-[9px] font-medium text-gray-400 whitespace-nowrap">{{ formatTime(notif.createdAt) }}</span>
                  </div>
                  <p class="text-xs text-gray-500 mt-1 leading-relaxed">{{ notif.body }}</p>
                  
                  <div v-if="notif.data?.orderId" class="mt-2">
                    <span class="inline-flex items-center text-[10px] font-bold text-parentPrimary gap-0.5 hover:gap-1 transition-all">
                      View order details
                      <span class="text-xs">→</span>
                    </span>
                  </div>
                </div>
                <div v-if="!notif.read" class="shrink-0 flex items-center">
                  <span class="w-2 h-2 bg-parentPrimary rounded-full shadow-sm shadow-[#FF5C1A]/40" />
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="pt-4 border-t border-gray-100 shrink-0">
            <NuxtLink 
              to="/notifications" 
              @click="showNotificationsDrawer = false"
              class="flex items-center justify-center w-full py-3 bg-gray-950 text-white rounded-xl text-xs font-bold hover:bg-gray-900 transition-colors uppercase tracking-wider shadow-sm border border-gray-50 active:scale-98"
            >
              go to notification center
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
  <CoreLogoutModal :isOpen="isLogoutModalOpen" @close="isLogoutModalOpen = false" />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useUser } from '@/composables/modules/auth/user'
import { useCart } from '@/composables/modules/cart'
import { useNotifications } from '@/composables/modules/notifications/useNotifications'
import { useRealtimeNotifications } from '@/composables/core/useRealtimeNotifications'
import { 
  ShoppingCart, Bell, BellOff, Home, User, LogOut, ChevronDown, ArrowLeft, Wallet, X
} from 'lucide-vue-next'
import { computed } from 'vue'
import { useGroupOrder } from '@/composables/modules/group-order'

defineProps({
  showBack: { type: Boolean, default: true },
  showCart: { type: Boolean, default: true }
})

const router = useRouter()
const { user, logOut } = useUser()
const cart = useCart()
const { groupOrder } = useGroupOrder()
const { notifications, loading, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useNotifications()
useRealtimeNotifications()

const totalCartItems = computed(() => {
  if (groupOrder.value) {
    return groupOrder.value.participants?.reduce((sum: number, p: any) => sum + (p.items?.reduce((s: number, i: any) => s + i.quantity, 0) || 0), 0) || 0;
  }
  return cart.itemCount.value;
})

const showNotificationsDrawer = ref(false)

const openNotificationsDrawer = () => {
  showNotificationsDrawer.value = true
  fetchNotifications()
}

const getEmoji = (notifType: string) => {
  switch (notifType) {
    case 'ORDER_ACCEPTED': return '✅'
    case 'ORDER_STATUS_UPDATE': return '📦'
    case 'NEW_ORDER_AVAILABLE': return '🚀'
    default: return '🔔'
  }
}

const getBgColor = (notifType: string) => {
  switch (notifType) {
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
  showNotificationsDrawer.value = false
  if (notif.data?.orderId) {
    router.push(`/orders/${notif.data.orderId}`)
  }
}

const isLogoutModalOpen = ref(false)

const handleLogout = () => {
  isLogoutModalOpen.value = true
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.animate-slide-in-right {
  animation: slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(100%); }
  to { opacity: 1; transform: translateX(0); }
}
</style>

