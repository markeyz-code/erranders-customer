<template>
  <div class="min-h-screen bg-white flex flex-col lg:flex-row selection:bg-[#FF5C1A]/15 selection:text-[#FF5C1A] w-full overflow-x-hidden pt-safe">
    <CorePromoBanner />
    <FullScreenLoader></FullScreenLoader>
    <Toast ref="toastRef"></Toast>

    <!-- Desktop Sidebar: ID Badge -->
    <aside class="hidden lg:flex flex-col w-72 h-[calc(100vh-2rem)] fixed left-4 top-4 bottom-4 z-50">
      <div class="h-full bg-[#FAF8F5] rounded-2xl flex flex-col overflow-hidden border border-[#E7E2DA] relative">

        <!-- Brand row -->
        <div class="px-5 pt-5 pb-4 flex items-center justify-between">
          <NuxtLink to="/" class="flex items-center gap-2">
            <img src="@/assets/img/logo-light.png" class="h-8 w-auto" />
          </NuxtLink>
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>

        <!-- ID Badge card -->
        <div class="mx-4 mb-4 rounded-xl bg-white border border-[#E7E2DA] p-4">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-lg bg-[#171310] text-white flex items-center justify-center font-bold text-base uppercase shrink-0">
              {{ userInitials }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="text-[13px] font-bold text-[#171310] truncate leading-tight">{{ userDisplayName }}</p>
              <p class="ff-mono text-[9.5px] font-bold text-[#FF5C1A] tracking-[0.1em] mt-1">STUDENT · VERIFIED</p>
            </div>
          </div>

          <!-- Perforated tear line -->
          <div class="flex items-center gap-1.5 my-4">
            <span class="w-1.5 h-1.5 rounded-full bg-[#FAF8F5] border border-[#E7E2DA] shrink-0"></span>
            <div class="flex-1 border-t border-dashed border-[#D9D2C7]"></div>
            <span class="w-1.5 h-1.5 rounded-full bg-[#FAF8F5] border border-[#E7E2DA] shrink-0"></span>
          </div>

          <!-- Mode switcher: dispatch stamps -->
          <div class="grid grid-cols-2 gap-2">
            <button
              @click="setMode('errands')"
              class="py-2 rounded-lg text-[11px] font-bold uppercase tracking-wide border transition-all flex items-center justify-center gap-1.5"
              :class="mode === 'errands' ? 'bg-[#171310] text-white border-[#171310]' : 'text-[#9C968E] border-[#E7E2DA] hover:border-[#171310]/30 hover:text-[#171310]'"
            >
              <Package class="w-3.5 h-3.5" />
              Errands
            </button>
            <button
              @click="setMode('services')"
              class="py-2 rounded-lg text-[11px] font-bold uppercase tracking-wide border transition-all flex items-center justify-center gap-1.5"
              :class="mode === 'services' ? 'bg-[#171310] text-white border-[#171310]' : 'text-[#9C968E] border-[#E7E2DA] hover:border-[#171310]/30 hover:text-[#171310]'"
            >
              <Scissors class="w-3.5 h-3.5" />
              Services
            </button>
          </div>
        </div>

        <!-- Manifest Navigation -->
        <nav class="flex-1 relative z-10 overflow-y-auto hide-scrollbar px-4 pb-2 space-y-0.5">
          <TransitionGroup name="nav-list" tag="div" class="space-y-0.5 relative">
            <NuxtLink
              v-for="item in activeNavItems"
              :key="item.path"
              :to="item.path"
              class="flex items-center gap-3 pl-3.5 pr-3 py-3 rounded-lg text-[13px] font-bold transition-all relative"
              :class="isActive(item.path)
                ? 'bg-white text-[#171310] shadow-[0_1px_3px_rgba(23,19,16,0.06)]'
                : 'text-[#9C968E] hover:text-[#171310] hover:bg-white/70'"
            >
              <span
                class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full transition-colors"
                :class="isActive(item.path) ? 'bg-[#FF5C1A]' : 'bg-transparent'"
              ></span>
              <component :is="item.icon" class="w-[18px] h-[18px] shrink-0" :class="isActive(item.path) ? 'text-[#FF5C1A]' : ''"></component>
              <span class="flex-1">{{ item.label }}</span>
              <span class="ff-mono text-[9px] font-bold tracking-widest opacity-40">{{ item.code }}</span>
            </NuxtLink>
          </TransitionGroup>
        </nav>

        <!-- Shared bottom nav -->
        <div class="mt-auto p-4 border-t border-dashed border-[#E7E2DA] space-y-0.5">
          <NuxtLink
            v-for="item in sharedNavItems"
            :key="item.path"
            :to="item.path"
            class="flex items-center gap-3 pl-3.5 pr-3 py-3 rounded-lg text-[13px] font-bold transition-all relative"
            :class="isActive(item.path)
              ? 'bg-white text-[#171310] shadow-[0_1px_3px_rgba(23,19,16,0.06)]'
              : 'text-[#9C968E] hover:text-[#171310] hover:bg-white/70'"
          >
            <span
              class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full transition-colors"
              :class="isActive(item.path) ? 'bg-[#FF5C1A]' : 'bg-transparent'"
            ></span>
            <component :is="item.icon" class="w-[18px] h-[18px] shrink-0" :class="isActive(item.path) ? 'text-[#FF5C1A]' : ''"></component>
            <span class="flex-1">{{ item.label }}</span>
            <span class="ff-mono text-[9px] font-bold tracking-widest opacity-40">{{ item.code }}</span>
          </NuxtLink>
        </div>
      </div>
    </aside>

    <!-- Mobile Header -->
    <header class="lg:hidden bg-white/95 backdrop-blur-2xl border-b border-gray-100 sticky top-0 z-40 w-full shrink-0">
      <div class="flex items-center justify-between px-4 py-3 sm:py-4">
        
        <!-- Left: Menu & Logo -->
        <div class="flex items-center gap-3">
          <button
            v-if="isDashboard"
            @click="isMobileSidebarOpen = true"
            class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition-colors active:scale-95"
          >
            <Menu class="w-5 h-5 text-gray-700" />
          </button>
          <div v-else @click="router.back()" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 cursor-pointer active:scale-95 transition-colors">
            <ArrowLeft class="w-5 h-5 text-gray-700"></ArrowLeft>
          </div>
          
          <NuxtLink to="/" class="flex items-center" v-if="isDashboard">
            <img src="@/assets/img/logo-light.png" class="h-6 sm:h-7 w-auto object-contain" alt="Errandr Logo" />
          </NuxtLink>
          <span v-else class="text-base sm:text-lg font-bold text-gray-900 tracking-tight">{{ pageTitle }}</span>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Search Icon -->
          <NuxtLink to="/dashboard/search" class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition-all active:scale-95">
            <Search class="w-4 h-4 sm:w-4.5 sm:h-4.5 text-gray-700" />
          </NuxtLink>

          <!-- Cart Icon -->
          <NuxtLink to="/cart" class="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition-all active:scale-95">
            <ShoppingBag class="w-4 h-4 sm:w-4.5 sm:h-4.5 text-gray-700"></ShoppingBag>
            <div v-if="totalCartItems > 0" class="absolute top-0 right-0 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-parentPrimary border-2 border-white rounded-full flex items-center justify-center shadow-sm">
              <span class="text-[7px] sm:text-[8px] font-bold text-white">{{ totalCartItems > 9 ? '9+' : totalCartItems }}</span>
            </div>
          </NuxtLink>

          <!-- Notifications Icon -->
          <NuxtLink to="/notifications" class="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition-all active:scale-95">
            <Bell class="w-4 h-4 sm:w-4.5 sm:h-4.5 text-gray-700"></Bell>
            <div v-if="unreadCount > 0" class="absolute top-0 right-0 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-parentPrimary border-2 border-white rounded-full flex items-center justify-center shadow-sm">
              <span class="text-[7px] sm:text-[8px] font-bold text-white">{{ unreadCount > 9 ? '9+' : unreadCount }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Mobile Sidebar Drawer -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="isMobileSidebarOpen" class="lg:hidden fixed inset-0 z-[100] bg-[#171310]/50 backdrop-blur-sm" @click="isMobileSidebarOpen = false"></div>
      </Transition>
      <Transition
        enter-active-class="transition-transform duration-300 ease-out"
        enter-from-class="-translate-x-full"
        enter-to-class="translate-x-0"
        leave-active-class="transition-transform duration-200 ease-in"
        leave-from-class="translate-x-0"
        leave-to-class="-translate-x-full"
      >
        <div v-if="isMobileSidebarOpen" class="lg:hidden fixed inset-y-0 left-0 w-[85%] max-w-sm z-[101] bg-[#FAF8F5] shadow-sm border border-gray-100 flex flex-col overflow-hidden">

          <!-- Brand row -->
          <div class="px-5 pt-5 pb-4 flex items-center justify-between">
            <NuxtLink to="/" @click="isMobileSidebarOpen = false" class="flex items-center gap-2">
              <img src="@/assets/img/logo-light.png" class="h-8 w-auto" />
            </NuxtLink>
            <button @click="isMobileSidebarOpen = false" class="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-[#E7E2DA]">
              <X class="w-4.5 h-4.5 text-[#171310]" />
            </button>
          </div>

          <!-- ID Badge -->
          <div class="mx-4 mb-4 rounded-xl bg-white border border-[#E7E2DA] p-4">
            <div class="flex items-center gap-3">
              <div class="w-11 h-11 rounded-lg bg-[#171310] text-white flex items-center justify-center font-bold text-base uppercase shrink-0">
                {{ userInitials }}
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-[13px] font-bold text-[#171310] truncate leading-tight">{{ userDisplayName }}</p>
                <p class="ff-mono text-[9.5px] font-bold text-[#FF5C1A] tracking-[0.1em] mt-1">STUDENT · VERIFIED</p>
              </div>
            </div>

            <div class="flex items-center gap-1.5 my-4">
              <span class="w-1.5 h-1.5 rounded-full bg-[#FAF8F5] border border-[#E7E2DA] shrink-0"></span>
              <div class="flex-1 border-t border-dashed border-[#D9D2C7]"></div>
              <span class="w-1.5 h-1.5 rounded-full bg-[#FAF8F5] border border-[#E7E2DA] shrink-0"></span>
            </div>

            <div class="grid grid-cols-2 gap-2">
              <button
                @click="setMode('errands')"
                class="py-2 rounded-lg text-[11px] font-bold uppercase tracking-wide border transition-all flex items-center justify-center gap-1.5"
                :class="mode === 'errands' ? 'bg-[#171310] text-white border-[#171310]' : 'text-[#9C968E] border-[#E7E2DA]'"
              >
                <Package class="w-3.5 h-3.5" />
                Errands
              </button>
              <button
                @click="setMode('services')"
                class="py-2 rounded-lg text-[11px] font-bold uppercase tracking-wide border transition-all flex items-center justify-center gap-1.5"
                :class="mode === 'services' ? 'bg-[#171310] text-white border-[#171310]' : 'text-[#9C968E] border-[#E7E2DA]'"
              >
                <Scissors class="w-3.5 h-3.5" />
                Services
              </button>
            </div>
          </div>

          <!-- Nav -->
          <nav class="flex-1 space-y-0.5 overflow-y-auto hide-scrollbar px-4">
            <TransitionGroup name="nav-list" tag="div" class="space-y-0.5 relative">
              <NuxtLink
                v-for="item in activeNavItems"
                :key="item.path"
                :to="item.path"
                @click="isMobileSidebarOpen = false"
                class="flex items-center gap-3 pl-3.5 pr-3 py-3 rounded-lg text-[13px] font-bold transition-all relative"
                :class="isActive(item.path)
                  ? 'bg-white text-[#171310] shadow-[0_1px_3px_rgba(23,19,16,0.06)]'
                  : 'text-[#9C968E] hover:text-[#171310] hover:bg-white/70'"
              >
                <span
                  class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full transition-colors"
                  :class="isActive(item.path) ? 'bg-[#FF5C1A]' : 'bg-transparent'"
                ></span>
                <component :is="item.icon" class="w-[18px] h-[18px] shrink-0" :class="isActive(item.path) ? 'text-[#FF5C1A]' : ''"></component>
                <span class="flex-1">{{ item.label }}</span>
                <span class="ff-mono text-[9px] font-bold tracking-widest opacity-40">{{ item.code }}</span>
              </NuxtLink>
            </TransitionGroup>
          </nav>

          <!-- Shared bottom nav + Sign out -->
          <div class="mt-auto p-4 border-t border-dashed border-[#E7E2DA] space-y-0.5">
            <NuxtLink
              v-for="item in sharedNavItems"
              :key="item.path"
              :to="item.path"
              @click="isMobileSidebarOpen = false"
              class="flex items-center gap-3 pl-3.5 pr-3 py-3 rounded-lg text-[13px] font-bold transition-all relative"
              :class="isActive(item.path)
                ? 'bg-white text-[#171310] shadow-[0_1px_3px_rgba(23,19,16,0.06)]'
                : 'text-[#9C968E] hover:text-[#171310] hover:bg-white'"
            >
              <span
                class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full transition-colors"
                :class="isActive(item.path) ? 'bg-[#FF5C1A]' : 'bg-transparent'"
              ></span>
              <component :is="item.icon" class="w-[18px] h-[18px] shrink-0" :class="isActive(item.path) ? 'text-[#FF5C1A]' : ''"></component>
              <span class="flex-1">{{ item.label }}</span>
              <span class="ff-mono text-[9px] font-bold tracking-widest opacity-40">{{ item.code }}</span>
            </NuxtLink>

            <button
              @click="handleLogoutClick(); isMobileSidebarOpen = false"
              class="w-full py-3.5 mt-2 border border-rose-200 text-rose-500 bg-white hover:bg-rose-50 rounded-lg text-[13px] font-bold transition-all flex items-center justify-center gap-2"
            >
              <LogOut class="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Main Content -->
    <main class="flex-1 w-full lg:w-auto lg:ml-72 transition-all duration-700 py-2.5 px-0 sm:p-4 lg:p-10 pb-16 lg:pb-32 overflow-x-hidden">

      <!-- Desktop manifest header -->
      <div v-if="!route.path.startsWith('/vendors')" class="hidden lg:block mb-8 animate-fade-in">
        <div class="flex items-center justify-between bg-white rounded-2xl px-5 py-4 border border-[#E7E2DA]">
          <div class="flex items-center gap-5">
            <button v-if="!isDashboard" @click="router.back()" class="w-10 h-10 rounded-lg bg-[#FAF8F5] flex items-center justify-center border border-[#E7E2DA] hover:bg-[#171310] hover:text-white hover:border-[#171310] transition-all group">
              <ArrowLeft class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"></ArrowLeft>
            </button>
            <div>
              <div class="flex items-center gap-2 mb-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-[#FF5C1A] animate-pulse"></span>
                <span class="ff-mono text-[10px] font-bold tracking-[0.15em] uppercase text-[#9C968E]">Route · {{ pageTitle }}</span>
              </div>
              <h1 class="ff-display text-[26px] font-bold text-[#171310] tracking-tight leading-none">{{ pageTitle }}</h1>
              <p class="text-[13px] font-bold text-[#9C968E] mt-1.5">{{ pageDescription }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <NuxtLink to="/cart" class="relative w-11 h-11 bg-[#FAF8F5] rounded-lg flex items-center justify-center text-[#9C968E] hover:bg-[#171310] hover:text-white transition-all border border-[#E7E2DA]">
              <ShoppingBag class="w-[18px] h-[18px]"></ShoppingBag>
              <div v-if="totalCartItems > 0" class="absolute top-2.5 right-2.5 w-2 h-2 bg-[#FF5C1A] border border-white rounded-full"></div>
            </NuxtLink>

            <NuxtLink to="/notifications" class="relative w-11 h-11 bg-[#FAF8F5] rounded-lg flex items-center justify-center text-[#9C968E] hover:bg-[#171310] hover:text-white transition-all border border-[#E7E2DA]">
              <Bell class="w-[18px] h-[18px]"></Bell>
              <div v-if="unreadCount > 0" class="absolute top-2.5 right-2.5 w-2 h-2 bg-[#FF5C1A] border border-white rounded-full"></div>
            </NuxtLink>

            <div class="w-px h-8 border-l border-dashed border-[#E7E2DA]"></div>

            <button @click="handleLogoutClick" class="flex items-center gap-2 text-[#171310] bg-white hover:bg-rose-50 hover:text-rose-500 border border-[#E7E2DA] hover:border-rose-200 px-4 py-2.5 rounded-lg text-[13px] font-bold transition-all">
              <LogOut class="w-4 h-4"></LogOut>
              Sign out
            </button>
          </div>
        </div>
      </div>

      <!-- Live Workspace -->
      <div class="rounded-3xl min-h-[calc(100vh-12rem)] relative">
        <slot></slot>
      </div>
      
      <!-- Footer -->
      <!-- <footer class="mt-10 pt-6 border-t border-[#E7E2DA] flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in">
        <p class="text-xs font-bold text-[#9C968E]">© {{ new Date().getFullYear() }} Errandr</p>
        <div class="flex items-center gap-4">
          <NuxtLink to="/terms" class="text-xs font-bold text-[#9C968E] hover:text-[#171310] transition-colors">Terms</NuxtLink>
          <NuxtLink to="/privacy" class="text-xs font-bold text-[#9C968E] hover:text-[#171310] transition-colors">Privacy</NuxtLink>
          <NuxtLink to="/refund" class="text-xs font-bold text-[#9C968E] hover:text-[#171310] transition-colors">Refunds</NuxtLink>
          <NuxtLink to="/contact" class="text-xs font-bold text-[#9C968E] hover:text-[#171310] transition-colors">Contact</NuxtLink>
        </div>
      </footer> -->
    </main>

    <!-- Logout Modal -->
    <CoreLogoutModal :isOpen="logoutModalOpen" @close="logoutModalOpen = false" />

    <!-- Global Modals -->
    <PendingOrderModal
      :isOpen="pendingOrderModalOpen"
      :order="pendingOrder"
      @close="pendingOrderModalOpen = false"
    />

    <ReviewOrderModal
      :isOpen="reviewOrderModalOpen"
      :order="reviewOrder"
      @close="reviewOrderModalOpen = false"
    />
    <CoreWhatsAppWidget />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useUser } from '@/composables/modules/auth/user'
import { useRouter, useRoute } from 'vue-router'
import ExamPromoBanner from '@/components/core/ExamPromoBanner.vue'
import {
  Home,
  Search,
  ShoppingBag,
  Heart,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  ArrowLeft,
  Target,
  Wallet,
  Users,
  Calendar,
  MessageSquare,
  ClipboardList,
  Settings,
  Package,
  Scissors,
  Sparkles,
  Repeat
} from 'lucide-vue-next'
import { useRealtimeNotifications } from '@/composables/core/useRealtimeNotifications'
import { useNotifications } from '@/composables/modules/notifications/useNotifications'
import { useAuth } from '@/composables/modules/auth'
import { useCart } from '@/composables/modules/cart'
import { useStudentOrders } from '@/composables/modules/orders'
import PendingOrderModal from '@/components/core/PendingOrderModal.vue'
import ReviewOrderModal from '@/components/core/ReviewOrderModal.vue'

const { unreadCount } = useNotifications()
useRealtimeNotifications() // Initialize listener

const route = useRoute()
const router = useRouter()
const { user } = useUser()
const { logOut } = useAuth()
const cartStore = useCart()
const { orders: studentOrders, fetchOrders: fetchStudentOrders } = useStudentOrders()

const totalCartItems = computed(() => {
  return cartStore.allPacks.value.reduce((total, pack) => total + pack.items.length, 0);
})

const isMobileSidebarOpen = ref(false)
const logoutModalOpen = ref(false)
const pendingOrderModalOpen = ref(false)
const pendingOrder = ref<any>(null)
const reviewOrderModalOpen = ref(false)
const reviewOrder = ref<any>(null)

// Mode toggle: 'errands' or 'services'
const mode = ref<'errands' | 'services'>('errands')

const setMode = (newMode: 'errands' | 'services') => {
  mode.value = newMode
}

// `code` is a short manifest-style tag rendered on the right of each nav
// row (visual only, mirrors the courier/dispatch waybill language used
// elsewhere in the app) — it does not affect routing or active-state logic.
const errandsNavItems = [
  { path: '/dashboard', label: 'Home', icon: Home, code: 'HM' },
  { path: '/dashboard/search', label: 'Search', icon: Search, code: 'SR' },
  { path: '/dashboard/orders', label: 'Orders', icon: ShoppingBag, code: 'OR' },
  { path: '/dashboard/recurring-orders', label: 'Meal Autopilot', icon: Repeat, code: 'RO' },
  { path: '/dashboard/group-orders', label: 'Group Orders', icon: Users, code: 'GO' },
  { path: '/dashboard/quests', label: 'Campus Quests', icon: Target, code: 'CQ' },
]

const servicesNavItems = [
  { path: '/dashboard/activity', label: 'Activity', icon: Calendar, code: 'AC' },
  { path: '/dashboard/chat', label: 'Messages', icon: MessageSquare, code: 'MS' },
  { path: '/dashboard/favorites', label: 'Favorites', icon: Heart, code: 'FV' },
  { path: '/dashboard/forms', label: 'Forms', icon: ClipboardList, code: 'FR' },
]

const sharedNavItems = [
  { path: '/dashboard/prime', label: 'Campus Prime', icon: Sparkles, code: 'CP' },
  { path: '/dashboard/profile', label: 'Profile', icon: User, code: 'PR' },
  { path: '/dashboard/wallet', label: 'Wallet', icon: Wallet, code: 'WL' },
  { path: '/dashboard/settings', label: 'Settings', icon: Settings, code: 'ST' },
]

const activeNavItems = computed(() => {
  return mode.value === 'errands' ? errandsNavItems : servicesNavItems
})

const isDashboard = computed(() => route.path === '/dashboard' || route.path === '/')

const pageTitles: Record<string, { title: string; description: string }> = {
  '/': { title: 'Dashboard', description: 'Welcome back to Errandr' },
  '/dashboard': { title: 'Dashboard', description: 'Welcome back to Errandr' },
  '/dashboard/search': { title: 'Search', description: 'Find anything on campus' },
  '/dashboard/orders': { title: 'My Errands', description: 'Track your active and past orders' },
  '/dashboard/recurring-orders': { title: 'Meal Autopilot', description: 'Set it, forget it — your meals, on schedule' },
  '/dashboard/group-orders': { title: 'Group Orders', description: 'Manage your multiplayer carts and order history' },
  '/dashboard/favorites': { title: 'My Favorites', description: 'Your most loved items and venues' },
  '/dashboard/profile': { title: 'My Profile', description: 'Manage your Errandr account' },
  '/dashboard/activity': { title: 'My Activity', description: 'Manage your appointments and bookings' },
  '/dashboard/chat': { title: 'Messages', description: 'Your conversations with venues' },
  '/dashboard/forms': { title: 'Forms', description: 'Consultation forms and waivers' },
  '/dashboard/settings': { title: 'Settings', description: 'App preferences and security' },
  '/dashboard/wallet': { title: 'My Wallet', description: 'Manage payment methods and gift cards' },
}

const pageTitle = computed(() => {
  if (route.path.startsWith('/dashboard/orders/')) return 'Order Tracker'
  return pageTitles[route.path]?.title || 'Store'
})
const pageDescription = computed(() => {
  if (route.path.startsWith('/dashboard/orders/')) return 'Live tracking & updates'
  return pageTitles[route.path]?.description || 'Errandr Companion'
})

const userDisplayName = computed(() => {
  if (!user.value) return 'Student'
  return `${user.value.firstName || ''} ${user.value.lastName || ''}`.trim() || user.value.email || 'Student'
})

const userInitials = computed(() => {
  if (!user.value) return 'S'
  const first = user.value.firstName || ''
  const last = user.value.lastName || ''
  return (first[0] || last[0] || user.value.email?.[0] || 'S').toUpperCase()
})

const handleLogoutClick = () => {
  logoutModalOpen.value = true
}

const isActive = (path: string) => {
  if (path === '/dashboard') return route.path === '/dashboard' || route.path === '/';
  return route.path.startsWith(path);
}

const confirmLogout = async () => {
  await logOut()
  logoutModalOpen.value = false
  window.location.href = '/'
}

watch(() => route.path, () => {
  isMobileSidebarOpen.value = false
})

// Add redirection logic
watch(mode, (newMode) => {
  // When switching modes, if on a mode-specific page, redirect to the root of that mode
  if (newMode === 'errands' && route.path.startsWith('/dashboard/activity')) {
    router.push('/dashboard')
  } else if (newMode === 'services' && (route.path === '/dashboard' || route.path.startsWith('/dashboard/orders'))) {
    router.push('/dashboard/activity')
  }
})

const checkOrders = () => {
  // 1. Check for Pending Orders (Abandoned Cart)
  const pending = studentOrders.value.find((o: any) => 
    o.type !== 'custom_errand' && 
    (o.status === 'pending' || o.status === 'awaiting_payment' || o.status === 'PENDING' || o.status === 'AWAITING_PAYMENT')
  )
  if (pending && route.path !== `/dashboard/orders/${pending._id}` && route.path !== '/cart' && !pendingOrderModalOpen.value) {
    pendingOrder.value = pending
    pendingOrderModalOpen.value = true
  }
  
  // 2. Check for Recently Delivered Orders (Unrated)
  const delivered = studentOrders.value.find((o: any) => 
    o.type !== 'custom_errand' &&
    (o.status === 'delivered' || o.status === 'picked_up' || o.status === 'DELIVERED' || o.status === 'COMPLETED') && 
    (!o.hasRatedVendor || !o.hasRatedErrander)
  )
  if (delivered && !pendingOrderModalOpen.value && route.path !== `/dashboard/orders/${delivered._id}` && !reviewOrderModalOpen.value) {
    reviewOrder.value = delivered
    reviewOrderModalOpen.value = true
  }
}

onMounted(async () => {
  await fetchStudentOrders()
  checkOrders()
})

watch(() => studentOrders.value, () => {
  checkOrders()
}, { deep: true })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap');

.ff-display {
  font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
}
.ff-mono {
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
}

.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.25s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.animate-fade-in-left {
  animation: fadeInLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeInLeft {
  from { opacity: 0; transform: translateX(-8px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Nav list transitions */
.nav-list-enter-active,
.nav-list-leave-active {
  transition: all 0.3s ease;
}
.nav-list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.nav-list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
.nav-list-leave-active {
  position: absolute;
  width: 100%;
}
</style>