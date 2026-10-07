<template>
  <!-- Navbar Wrapper -->
  <nav 
    class="fixed w-[95%] left-1/2 -translate-x-1/2 z-[60] transition-all duration-500 rounded-[2rem] mt-4"
    :class="[
      scrolled 
        ? 'bg-white border border-gray-50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] py-3' 
        : 'bg-transparent py-5'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 lg:px-10">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-3 group">
          <img src="@/assets/img/logo-light.png" alt="Errander Logo" class="h-8 lg:h-8 w-auto object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
        </NuxtLink>
        
        <!-- Actions & Menu -->
        <div class="flex items-center gap-2 md:gap-4">
          <!-- Auth Links (Desktop Only) -->
          <div class="hidden md:flex items-center gap-3">
            <template v-if="!user">
              <!-- Manage Buttons for Guests -->
              <NuxtLink to="/errands/custom" class="px-5 py-2 text-sm font-bold text-white bg-parentPrimary hover:bg-orange-600 transition-colors rounded-full shadow-sm border border-gray-50 hover:shadow-sm whitespace-nowrap">
                Request Custom Errand
              </NuxtLink>
              <NuxtLink to="/dashboard/recurring-orders" class="px-5 py-2 text-sm font-bold text-parentPrimary bg-orange-50 hover:bg-orange-100 transition-colors rounded-full shadow-sm border border-orange-200 hover:shadow-sm whitespace-nowrap flex items-center gap-1.5">
                <Repeat class="w-4 h-4" />
                Meal Autopilot
              </NuxtLink>
              <div class="w-px h-4 bg-gray-300 mx-2"></div>
              <NuxtLink to="/auth/login" class="px-5 py-2 text-sm font-medium text-gray-900 hover:text-parentPrimary transition-colors rounded-full hover:bg-gray-50 whitespace-nowrap">
                Log In
              </NuxtLink>
              <NuxtLink to="/auth/register" class="px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-full shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:bg-gray-800 transition-all whitespace-nowrap">
                Sign Up
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink to="/errands/custom" class="px-5 py-2 text-sm font-bold text-white bg-parentPrimary hover:bg-orange-600 transition-colors rounded-full shadow-sm border border-gray-50 hover:shadow-sm whitespace-nowrap">
                Request Custom Errand
              </NuxtLink>
              <NuxtLink to="/dashboard/recurring-orders" class="px-5 py-2 text-sm font-bold text-parentPrimary bg-orange-50 hover:bg-orange-100 transition-colors rounded-full shadow-sm border border-orange-200 hover:shadow-sm whitespace-nowrap flex items-center gap-1.5">
                <Repeat class="w-4 h-4" />
                Meal Autopilot
              </NuxtLink>
              <div class="w-px h-4 bg-gray-300 mx-2"></div>
              
              <!-- Streak Gamification UI -->
              <div v-if="user.currentStreak > 0" class="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-full cursor-help relative group" title="Your Errand Streak!">
                <span class="text-base leading-none">🔥</span>
                <span class="text-sm font-bold text-orange-600">{{ user.currentStreak }} Wk</span>
                <div v-if="user.freeDeliveryTokens > 0" class="absolute -top-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                  🎟 {{ user.freeDeliveryTokens }}
                </div>
              </div>
              
              <NuxtLink to="/dashboard" class="px-5 py-2 text-sm font-medium text-gray-900 hover:text-parentPrimary transition-colors rounded-full hover:bg-gray-50 whitespace-nowrap">
                Dashboard
              </NuxtLink>
            </template>
          </div>

          <!-- Cart Icon -->
          <NuxtLink to="/cart" class="relative p-2.5 rounded-full bg-white border border-gray-25 hover:shadow-sm hover:border-gray-300 transition-all flex items-center justify-center ml-2">
            <ShoppingCart class="w-5 h-5 text-gray-900" />
            <span v-if="cartItemCount > 0" class="absolute top-0 right-0 bg-parentPrimary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center translate-x-1/4 -translate-y-1/4 shadow-sm">
              {{ cartItemCount }}
            </span>
          </NuxtLink>

          <!-- Fresha-style Menu Dropdown -->
          <Menu as="div" class="relative">
            <MenuButton class="flex items-center gap-2 rounded-full bg-white border border-gray-25 hover:shadow-sm border border-gray-50 hover:border-gray-300 transition-all px-4 py-2 focus:outline-none focus:ring-2 focus:ring-parentPrimary/20 ml-2">
              <span class="text-sm font-medium text-gray-900 hidden sm:block">Menu</span>
              <MenuIcon class="w-5 h-5 text-gray-900" />
            </MenuButton>
            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <MenuItems class="absolute right-0 md:-right-2 mt-3 w-[calc(100vw-2rem)] sm:w-80 max-w-sm origin-top-right rounded-3xl bg-white/80 backdrop-blur-3xl shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-white/50 focus:outline-none z-[100] overflow-hidden">
                <!-- User Section -->
                <div v-if="user" class="px-5 py-4 bg-gradient-to-br from-gray-50 to-white border-b border-gray-100/50 flex items-center gap-4">
                  <div class="w-10 h-10 rounded-full bg-parentPrimary text-white flex items-center justify-center font-bold text-lg shadow-inner">
                    {{ user.firstName?.[0] || user.email?.[0] }}
                  </div>
                  <div>
                    <p class="text-sm font-bold text-gray-400 uppercase  mb-0.5">Signed in</p>
                    <p class="text-sm font-black text-gray-900 truncate">{{ user.firstName }} {{ user.lastName }}</p>
                  </div>
                </div>
                
                <div class="p-4 grid grid-cols-2 gap-2">
                  <!-- Explore Section Commented Out -->
                  <!-- 
                  <div class="col-span-2 text-[10px] font-black text-gray-400 uppercase  mb-1 mt-1 px-2">Explore</div>
                  
                  <MenuItem v-slot="{ active }">
                    <NuxtLink to="/" :class="[active ? 'bg-orange-50/50 scale-95' : 'bg-gray-50/50 hover:bg-gray-100/50', 'group flex flex-col items-center justify-center rounded-2xl p-4 transition-all']">
                      <Home class="w-5 h-5 mb-2" :class="active ? 'text-parentPrimary' : 'text-gray-600'" />
                      <span class="text-sm font-bold text-gray-700">Home</span>
                    </NuxtLink>
                  </MenuItem>
                  
                  <MenuItem v-slot="{ active }">
                    <NuxtLink to="/faq" :class="[active ? 'bg-orange-50/50 scale-95' : 'bg-gray-50/50 hover:bg-gray-100/50', 'group flex flex-col items-center justify-center rounded-2xl p-4 transition-all']">
                      <Info class="w-5 h-5 mb-2" :class="active ? 'text-parentPrimary' : 'text-gray-600'" />
                      <span class="text-sm font-bold text-gray-700">FAQ</span>
                    </NuxtLink>
                  </MenuItem> 
                  -->

                  <!-- Services Section -->
                  <div class="col-span-2 text-[10px] font-black text-gray-400 uppercase  mb-1 mt-3 px-2">Services</div>

                  <MenuItem v-slot="{ active }">
                    <NuxtLink to="/errands/custom" :class="[active ? 'bg-orange-50 scale-95' : 'bg-orange-50/30 hover:bg-orange-50', 'group flex items-center gap-3 rounded-2xl p-3 col-span-2 transition-all border border-orange-100/50']">
                      <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                        <Zap class="w-4 h-4 text-parentPrimary" />
                      </div>
                      <div class="flex-1">
                        <span class="block text-sm font-bold text-gray-900">Custom Errand</span>
                        <span class="block text-[10px] text-gray-500 font-medium">Request anything you need</span>
                      </div>
                    </NuxtLink>
                  </MenuItem>

                  <MenuItem v-slot="{ active }">
                    <button @click="isBookingModalOpen = true" :class="[active ? 'bg-gray-100 scale-95' : 'bg-gray-50/50 hover:bg-gray-100/50', 'group flex items-center gap-3 rounded-2xl p-3 transition-all text-left']">
                      <Calendar class="w-4 h-4 text-gray-600" />
                      <span class="text-sm font-bold text-gray-700">Bookings</span>
                    </button>
                  </MenuItem>

                  <MenuItem v-slot="{ active }">
                    <button @click="isOrderModalOpen = true" :class="[active ? 'bg-gray-100 scale-95' : 'bg-gray-50/50 hover:bg-gray-100/50', 'group flex items-center gap-3 rounded-2xl p-3 transition-all text-left']">
                      <Package class="w-4 h-4 text-gray-600" />
                      <span class="text-sm font-bold text-gray-700">Orders</span>
                    </button>
                  </MenuItem>

                  <MenuItem v-slot="{ active }">
                    <NuxtLink to="/dashboard/recurring-orders" :class="[active ? 'bg-orange-50 scale-95' : 'bg-gray-50/50 hover:bg-orange-50/50', 'group flex items-center gap-3 rounded-2xl p-3 col-span-2 transition-all border border-transparent hover:border-orange-100/50 text-left']">
                      <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-parentPrimary">
                        <Repeat class="w-4 h-4" />
                      </div>
                      <div class="flex-1">
                        <span class="block text-sm font-bold text-gray-900 group-hover:text-parentPrimary transition-colors">Meal Autopilot</span>
                        <span class="block text-[10px] text-gray-500 font-medium">Set your meals on a weekly schedule</span>
                      </div>
                    </NuxtLink>
                  </MenuItem>

                  <!-- Partners & Actions -->
                  <div class="col-span-2 text-[10px] font-black text-gray-400 uppercase  mb-1 mt-3 px-2">Partner with us</div>
                  
                  <MenuItem v-slot="{ active }">
                    <a href="https://vendor.erranders.org/auth/register" :class="[active ? 'bg-gray-900 text-white scale-95' : 'bg-gray-800 text-white hover:bg-gray-900', 'group flex items-center justify-center gap-2 rounded-2xl p-3 transition-all shadow-sm']">
                      <Store class="w-4 h-4" />
                      <span class="text-sm font-bold">Vendor</span>
                    </a>
                  </MenuItem>

                  <MenuItem v-slot="{ active }">
                    <a href="https://dispatch.erranders.org/auth/register" :class="[active ? 'bg-gray-900 text-white scale-95' : 'bg-gray-800 text-white hover:bg-gray-900', 'group flex items-center justify-center gap-2 rounded-2xl p-3 transition-all shadow-sm']">
                      <Bike class="w-4 h-4" />
                      <span class="text-sm font-bold">Errand Ninja</span>
                    </a>
                  </MenuItem>
                </div>

                <!-- Footer Auth / Account -->
                <div class="p-3 bg-gray-50/80 border-t border-gray-100 flex flex-col gap-2">
                  <template v-if="!user">
                    <div class="grid grid-cols-2 gap-2">
                      <MenuItem v-slot="{ active }">
                        <NuxtLink to="/auth/login" :class="[active ? 'bg-white scale-95' : 'bg-transparent hover:bg-white', 'flex justify-center rounded-xl py-2.5 text-sm font-bold text-gray-900 transition-all border border-transparent hover:border-gray-200']">
                          Log in
                        </NuxtLink>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                        <NuxtLink to="/auth/register" :class="[active ? 'bg-parentPrimary scale-95' : 'bg-gray-900 hover:bg-parentPrimary', 'flex justify-center rounded-xl py-2.5 text-sm font-bold text-white transition-all shadow-sm']">
                          Sign up
                        </NuxtLink>
                      </MenuItem>
                    </div>
                  </template>
                  <template v-else>
                    <div class="grid grid-cols-2 gap-2">
                      <MenuItem v-slot="{ active }">
                        <NuxtLink to="/dashboard" :class="[active ? 'bg-white scale-95' : 'bg-transparent hover:bg-white', 'flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-gray-900 transition-all border border-transparent hover:border-gray-200']">
                          <LayoutDashboard class="w-3.5 h-3.5" />
                          Dashboard
                        </NuxtLink>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                        <button @click="handleLogout" :class="[active ? 'bg-white scale-95' : 'bg-transparent hover:bg-white', 'flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-rose-600 transition-all border border-transparent hover:border-rose-100']">
                          <LogOut class="w-3.5 h-3.5" />
                          Log out
                        </button>
                      </MenuItem>
                    </div>
                  </template>
                </div>

              </MenuItems>
            </Transition>
          </Menu>

        </div>
      </div>



    </div>
    <CoreManageBookingModal :isOpen="isBookingModalOpen" @close="isBookingModalOpen = false" />
    <CoreManageOrderModal :isOpen="isOrderModalOpen" @close="isOrderModalOpen = false" />
    <CoreLogoutModal :isOpen="isLogoutModalOpen" @close="isLogoutModalOpen = false" />
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useUser } from "@/composables/modules/auth/user"
import { useCart } from "@/composables/modules/cart"
import { Home, User, LogOut, Menu as MenuIcon, Filter, ChevronDown, ShoppingCart, Info, Zap, Package, Calendar, Store, Bike, LayoutDashboard, Repeat } from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import { useGlobalFilter } from '@/composables/core/useGlobalFilter'

const isBookingModalOpen = ref(false)
const isOrderModalOpen = ref(false)
const scrolled = ref(false)

const $route = useRoute()
const { user, logOut } = useUser()
const { itemCount: cartItemCount } = useCart()
const { globalFilter, setFilter, globalFiltersList, fetchCategories } = useGlobalFilter()

const activeFilterLabel = computed(() => {
  const list = globalFiltersList.value || globalFiltersList
  const f = list.find((f: any) => f.keyword === globalFilter.value)
  return f ? f.label : ''
})

const activeFilterIcon = computed(() => {
  const list = globalFiltersList.value || globalFiltersList
  const f = list.find((f: any) => f.keyword === globalFilter.value)
  return f ? f.icon : ''
})

const isLogoutModalOpen = ref(false)

const handleLogout = () => {
  isLogoutModalOpen.value = true
}

const handleScroll = () => {
  scrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  fetchCategories()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

