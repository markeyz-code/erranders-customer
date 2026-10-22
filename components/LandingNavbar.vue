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
        <!-- Logo & Features Dropdown -->
        <div class="flex items-center gap-3 sm:gap-6">
          <NuxtLink to="/" class="flex items-center gap-3 group">
            <img src="@/assets/img/logo-light.png" alt="Errander Logo" class="h-8 lg:h-8 w-auto object-contain transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
          </NuxtLink>

          <!-- Features Dropdown (Desktop) -->
          <Menu as="div" class="relative hidden md:block">
            <MenuButton class="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-gray-800 hover:text-parentPrimary bg-gray-50/90 hover:bg-orange-50/80 border border-gray-200/80 hover:border-orange-200 rounded-full transition-all focus:outline-none cursor-pointer shadow-2xs">
              <Sparkles class="w-3.5 h-3.5 text-parentPrimary" />
              <span>Features</span>
              <ChevronDown class="w-3.5 h-3.5 text-gray-400 group-hover:text-parentPrimary transition-transform" />
            </MenuButton>

            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="transform scale-95 opacity-0 -translate-y-1"
              enter-to-class="transform scale-100 opacity-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="transform scale-100 opacity-100 translate-y-0"
              leave-to-class="transform scale-95 opacity-0 -translate-y-1"
            >
              <MenuItems class="absolute left-0 mt-3 w-80 sm:w-96 origin-top-left rounded-3xl bg-white/95 backdrop-blur-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.18)] border border-gray-100 p-3 focus:outline-none z-[100] divide-y divide-gray-100/60">
                <div class="px-3 py-2 flex items-center justify-between">
                  <p class="text-[10px] font-black uppercase tracking-wider text-gray-400">Student Platform Features</p>
                  <span class="text-[9px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">ALL SERVICES</span>
                </div>

                <div class="p-1.5 space-y-1 max-h-[75vh] overflow-y-auto">
                  <!-- Custom Errands -->
                  <MenuItem v-slot="{ active }">
                    <NuxtLink to="/errands/custom" :class="[active ? 'bg-orange-50/80 scale-[0.99]' : 'hover:bg-gray-50', 'flex items-center gap-3 p-2.5 rounded-2xl transition-all group']">
                      <div class="w-9 h-9 rounded-xl bg-orange-100 text-parentPrimary flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                        <Zap class="w-4 h-4" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2">
                          <span class="text-xs font-bold text-gray-900 group-hover:text-parentPrimary transition-colors">Custom Errands</span>
                          <span class="text-[9px] font-bold text-orange-700 bg-orange-100/70 px-1.5 py-0.2 rounded-full">POPULAR</span>
                        </div>
                        <p class="text-[11px] text-gray-500 truncate mt-0.5">Pickups, deliveries, shopping & custom runs</p>
                      </div>
                    </NuxtLink>
                  </MenuItem>

                  <!-- Meal Autopilot -->
                  <MenuItem v-slot="{ active }">
                    <NuxtLink to="/dashboard/recurring-orders" :class="[active ? 'bg-purple-50/80 scale-[0.99]' : 'hover:bg-gray-50', 'flex items-center gap-3 p-2.5 rounded-2xl transition-all group']">
                      <div class="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                        <Repeat class="w-4 h-4" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2">
                          <span class="text-xs font-bold text-gray-900 group-hover:text-purple-700 transition-colors">Meal Autopilot</span>
                          <span class="text-[9px] font-bold text-purple-700 bg-purple-100/70 px-1.5 py-0.2 rounded-full">AUTOMATED</span>
                        </div>
                        <p class="text-[11px] text-gray-500 truncate mt-0.5">Automate daily breakfast & lunch delivery</p>
                      </div>
                    </NuxtLink>
                  </MenuItem>

                  <!-- Food & Vendors -->
                  <MenuItem v-slot="{ active }">
                    <NuxtLink to="/vendors" :class="[active ? 'bg-amber-50/80 scale-[0.99]' : 'hover:bg-gray-50', 'flex items-center gap-3 p-2.5 rounded-2xl transition-all group']">
                      <div class="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                        <Store class="w-4 h-4" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2">
                          <span class="text-xs font-bold text-gray-900 group-hover:text-amber-700 transition-colors">Food & Campus Vendors</span>
                        </div>
                        <p class="text-[11px] text-gray-500 truncate mt-0.5">Cafeteria food, meals, snacks & drinks</p>
                      </div>
                    </NuxtLink>
                  </MenuItem>

                  <!-- Group Orders -->
                  <MenuItem v-slot="{ active }">
                    <NuxtLink to="/dashboard/group-orders" :class="[active ? 'bg-emerald-50/80 scale-[0.99]' : 'hover:bg-gray-50', 'flex items-center gap-3 p-2.5 rounded-2xl transition-all group']">
                      <div class="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                        <Users class="w-4 h-4" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2">
                          <span class="text-xs font-bold text-gray-900 group-hover:text-emerald-700 transition-colors">Group Orders</span>
                          <span class="text-[9px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.2 rounded-full">SPLIT FEE</span>
                        </div>
                        <p class="text-[11px] text-gray-500 truncate mt-0.5">Order together with roomies & split delivery</p>
                      </div>
                    </NuxtLink>
                  </MenuItem>

                  <!-- Wholesale Market Pool -->
                  <MenuItem v-slot="{ active }">
                    <NuxtLink to="/market-pool" :class="[active ? 'bg-blue-50/80 scale-[0.99]' : 'hover:bg-gray-50', 'flex items-center gap-3 p-2.5 rounded-2xl transition-all group']">
                      <div class="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                        <ShoppingBag class="w-4 h-4" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2">
                          <span class="text-xs font-bold text-gray-900 group-hover:text-blue-700 transition-colors">Wholesale Market Pool</span>
                          <span class="text-[9px] font-bold text-blue-700 bg-blue-100/70 px-1.5 py-0.2 rounded-full">SAVE 40%</span>
                        </div>
                        <p class="text-[11px] text-gray-500 truncate mt-0.5">Bulk staples & groceries at direct prices</p>
                      </div>
                    </NuxtLink>
                  </MenuItem>

                  <!-- Campus Services & Bookings -->
                  <MenuItem v-slot="{ active }">
                    <button type="button" @click="isBookingModalOpen = true" :class="[active ? 'bg-teal-50/80 scale-[0.99]' : 'hover:bg-gray-50', 'w-full text-left flex items-center gap-3 p-2.5 rounded-2xl transition-all group']">
                      <div class="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                        <Calendar class="w-4 h-4" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2">
                          <span class="text-xs font-bold text-gray-900 group-hover:text-teal-700 transition-colors">Campus Services</span>
                        </div>
                        <p class="text-[11px] text-gray-500 truncate mt-0.5">Barbers, tutors, laundry, movers & more</p>
                      </div>
                    </button>
                  </MenuItem>

                  <!-- Barter Campus Trade -->
                  <MenuItem v-slot="{ active }">
                    <a href="https://decluttered.erranders.org/" target="_blank" rel="noopener noreferrer" :class="[active ? 'bg-rose-50/80 scale-[0.99]' : 'hover:bg-gray-50', 'flex items-center gap-3 p-2.5 rounded-2xl transition-all group']">
                      <div class="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                        <ArrowLeftRight class="w-4 h-4" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2">
                          <span class="text-xs font-bold text-gray-900 group-hover:text-rose-700 transition-colors">Barter & Declutter</span>
                          <span class="text-[9px] font-bold text-rose-700 bg-rose-100/70 px-1.5 py-0.2 rounded-full">NEW</span>
                        </div>
                        <p class="text-[11px] text-gray-500 truncate mt-0.5">Buy, sell & swap pre-owned student gear</p>
                      </div>
                    </a>
                  </MenuItem>
                </div>
              </MenuItems>
            </Transition>
          </Menu>
        </div>
        
        <!-- Actions & Menu -->
        <div class="flex items-center gap-2 md:gap-4">
          <!-- Auth Links (Desktop Only) -->
          <div class="hidden md:flex items-center gap-3">
            <template v-if="!user">
              <!-- Manage Buttons for Guests -->
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

          <!-- Fresha-style Menu Dropdown (Desktop Only) -->
          <Menu as="div" class="relative hidden md:block">
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
                    <p class="text-sm font-bold text-gray-400 uppercase mb-0.5">Signed in</p>
                    <p class="text-sm font-black text-gray-900 truncate">{{ user.firstName }} {{ user.lastName }}</p>
                  </div>
                </div>
                
                <div class="p-4 grid grid-cols-2 gap-2">
                  <!-- Services Section -->
                  <div class="col-span-2 text-[10px] font-black text-gray-400 uppercase mb-1 mt-3 px-2">Services</div>

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
                    <NuxtLink to="/dashboard/group-orders" :class="[active ? 'bg-gray-100 scale-95' : 'bg-gray-50/50 hover:bg-gray-100/50', 'group flex items-center gap-3 rounded-2xl p-3 transition-all text-left']">
                      <Users class="w-4 h-4 text-gray-600" />
                      <span class="text-sm font-bold text-gray-700">Group Orders</span>
                    </NuxtLink>
                  </MenuItem>

                  <MenuItem v-slot="{ active }">
                    <NuxtLink to="/market-pool" :class="[active ? 'bg-gray-100 scale-95' : 'bg-gray-50/50 hover:bg-gray-100/50', 'group flex items-center gap-3 rounded-2xl p-3 transition-all text-left']">
                      <ShoppingBag class="w-4 h-4 text-gray-600" />
                      <span class="text-sm font-bold text-gray-700">Market Pool</span>
                    </NuxtLink>
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

                  <MenuItem v-slot="{ active }">
                    <a href="https://decluttered.erranders.org/" target="_blank" rel="noopener noreferrer" :class="[active ? 'bg-orange-50 scale-95' : 'bg-orange-50/40 hover:bg-orange-50', 'group flex items-center gap-3 rounded-2xl p-3 col-span-2 transition-all border border-orange-200/50 text-left']">
                      <div class="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-[#FF5C1A]">
                        <ArrowLeftRight class="w-4 h-4" />
                      </div>
                      <div class="flex-1">
                        <div class="flex items-center gap-1.5">
                          <span class="block text-sm font-bold text-gray-900 group-hover:text-[#FF5C1A] transition-colors">Barter Campus Trade</span>
                          <span class="text-[9px] bg-[#FF5C1A] text-white font-black px-1.5 py-0.2 rounded-full">NEW</span>
                        </div>
                        <span class="block text-[10px] text-gray-500 font-medium">Buy, sell &amp; swap student items</span>
                      </div>
                    </a>
                  </MenuItem>

                  <!-- Partners & Actions -->
                  <div class="col-span-2 text-[10px] font-black text-gray-400 uppercase mb-1 mt-3 px-2">Partner with us</div>
                  
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

          <!-- Mobile Menu Trigger Button (Mobile Only: md:hidden) -->
          <button 
            type="button"
            @click="isMobileMenuOpen = true"
            class="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200/90 hover:border-gray-300 shadow-xs active:scale-90 transition-transform text-gray-900 ml-1 focus:outline-none"
            aria-label="Open Mobile Menu"
          >
            <MenuIcon class="w-5 h-5 text-gray-900" />
          </button>

        </div>
      </div>

    </div>

    <!-- Full-Screen Mobile Menu Drawer (Teleported to Body) -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-2 scale-[0.99]"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 -translate-y-2 scale-[0.99]"
      >
        <div 
          v-if="isMobileMenuOpen"
          class="fixed inset-0 z-[120] bg-[#FAF8F5] flex flex-col h-[100dvh] w-screen overflow-hidden text-gray-900 selection:bg-[#FF5C1A]/15 selection:text-[#FF5C1A]"
        >
          <!-- Top Header Row -->
          <div class="px-5 py-3.5 border-b border-[#E7E2DA]/90 bg-white/90 backdrop-blur-xl flex items-center justify-between shrink-0">
            <NuxtLink to="/" @click="closeMobileMenu" class="flex items-center gap-2 group">
              <img src="@/assets/img/logo-light.png" alt="Errander Logo" class="h-7 w-auto object-contain" />
              <span class="text-[9.5px] font-bold text-[#FF5C1A] tracking-wider px-2 py-0.5 rounded-full bg-orange-50 border border-orange-200/70 uppercase">STUDENT</span>
            </NuxtLink>

            <div class="flex items-center gap-2">
              <NuxtLink 
                to="/cart" 
                @click="closeMobileMenu" 
                class="relative w-10 h-10 rounded-full bg-white border border-[#E7E2DA] flex items-center justify-center text-gray-900 shadow-xs active:scale-95 transition-transform"
                aria-label="View Cart"
              >
                <ShoppingCart class="w-4.5 h-4.5" />
                <span v-if="cartItemCount > 0" class="absolute -top-1 -right-1 bg-parentPrimary text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {{ cartItemCount }}
                </span>
              </NuxtLink>

              <button 
                type="button"
                @click="closeMobileMenu" 
                class="w-10 h-10 rounded-full bg-white border border-[#E7E2DA] flex items-center justify-center text-gray-800 shadow-xs hover:border-gray-400 active:scale-90 transition-all"
                aria-label="Close Menu"
              >
                <X class="w-5 h-5 text-gray-800" />
              </button>
            </div>
          </div>

          <!-- Main Scrollable Navigation Area -->
          <div class="flex-1 overflow-y-auto px-5 py-5 space-y-6 overscroll-contain">
            
            <!-- User Profile / ID Badge (When Logged In) -->
            <div v-if="user" class="rounded-2xl bg-white border border-[#E7E2DA] p-4 shadow-xs">
              <div class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-11 h-11 rounded-xl bg-[#171310] text-white flex items-center justify-center font-bold text-base uppercase shrink-0 shadow-inner">
                    {{ user.firstName?.[0] || user.email?.[0] }}
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs text-gray-500 font-semibold">Signed in as</p>
                    <p class="text-sm font-bold text-gray-900 truncate">{{ user.firstName }} {{ user.lastName }}</p>
                  </div>
                </div>
                <NuxtLink 
                  to="/dashboard" 
                  @click="closeMobileMenu"
                  class="shrink-0 px-3 py-1.5 text-xs font-bold text-[#FF5C1A] hover:bg-orange-50 rounded-lg transition-colors flex items-center gap-1 border border-orange-200/50"
                >
                  Dashboard
                  <ChevronRight class="w-3.5 h-3.5" />
                </NuxtLink>
              </div>

              <!-- Streak & Rewards Badges -->
              <div v-if="user.currentStreak > 0 || user.freeDeliveryTokens > 0" class="flex items-center gap-2 mt-3 pt-3 border-t border-dashed border-[#E7E2DA]">
                <div v-if="user.currentStreak > 0" class="flex items-center gap-1.5 px-2.5 py-1 bg-orange-50 border border-orange-200/60 rounded-full text-xs font-bold text-orange-700">
                  <span>🔥</span>
                  <span>{{ user.currentStreak }} Wk Streak</span>
                </div>
                <div v-if="user.freeDeliveryTokens > 0" class="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200/60 rounded-full text-xs font-bold text-emerald-700">
                  <span>🎟</span>
                  <span>{{ user.freeDeliveryTokens }} Delivery Tokens</span>
                </div>
              </div>
            </div>

            <!-- Guest Welcome Banner (When Not Logged In) -->
            <div v-else class="rounded-2xl bg-gradient-to-br from-orange-500/10 via-amber-50 to-white border border-orange-200/70 p-4 shadow-xs relative overflow-hidden">
              <div class="flex items-start justify-between gap-3">
                <div>
                  <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 text-[10px] font-bold text-parentPrimary mb-2 border border-orange-200/50">
                    <Sparkles class="w-3 h-3" />
                    <span>CAMPUS LIFE SIMPLIFIED</span>
                  </div>
                  <h3 class="text-base font-extrabold text-gray-900 leading-snug">Everything you need, delivered on campus.</h3>
                  <p class="text-xs text-gray-600 mt-1 leading-relaxed">Order food, request custom errands, or swap gear with students safely.</p>
                </div>
              </div>
            </div>

            <!-- Spotlight Creative Actions ("Simple but Creative") -->
            <div class="space-y-2.5">
              <div class="flex items-center justify-between px-1">
                <span class="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider">Spotlight Services</span>
                <span class="text-[10px] font-bold text-[#FF5C1A]">Tap to launch</span>
              </div>

              <!-- 1. Request Custom Errand -->
              <NuxtLink 
                to="/errands/custom" 
                @click="closeMobileMenu"
                class="block p-4 rounded-2xl bg-[#171310] text-white shadow-sm active:scale-[0.98] transition-all relative overflow-hidden group"
              >
                <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-parentPrimary/20 rounded-full blur-2xl pointer-events-none"></div>
                <div class="flex items-start justify-between gap-3 relative z-10">
                  <div class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-xl bg-parentPrimary text-white flex items-center justify-center shrink-0 shadow-md">
                      <Zap class="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div class="flex items-center gap-1.5">
                        <span class="text-sm font-bold text-white">Request Custom Errand</span>
                        <span class="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-white/20 text-white">Instant</span>
                      </div>
                      <p class="text-xs text-white/70 mt-0.5 leading-snug">Hostel drops, off-campus pickups, laundry & printing</p>
                    </div>
                  </div>
                  <div class="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight class="w-3.5 h-3.5" />
                  </div>
                </div>
              </NuxtLink>

              <!-- 2. Meal Autopilot -->
              <NuxtLink 
                to="/dashboard/recurring-orders" 
                @click="closeMobileMenu"
                class="block p-4 rounded-2xl bg-white border border-orange-200/80 shadow-xs active:scale-[0.98] transition-all relative overflow-hidden group hover:border-[#FF5C1A]/50"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-xl bg-orange-50 text-parentPrimary border border-orange-100 flex items-center justify-center shrink-0">
                      <Repeat class="w-5 h-5" />
                    </div>
                    <div>
                      <div class="flex items-center gap-1.5">
                        <span class="text-sm font-bold text-gray-900">Meal Autopilot</span>
                        <span class="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-orange-100 text-parentPrimary">Weekly</span>
                      </div>
                      <p class="text-xs text-gray-500 mt-0.5 leading-snug">Set your daily lunches and dinners on auto-schedule</p>
                    </div>
                  </div>
                  <div class="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 shrink-0 group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight class="w-3.5 h-3.5" />
                  </div>
                </div>
              </NuxtLink>

              <!-- 3. Barter Campus Trade -->
              <a 
                href="https://decluttered.erranders.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                @click="closeMobileMenu"
                class="block p-4 rounded-2xl bg-gradient-to-br from-amber-50/70 to-orange-50/40 border border-orange-200/70 shadow-xs active:scale-[0.98] transition-all relative overflow-hidden group"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-start gap-3">
                    <div class="w-10 h-10 rounded-xl bg-orange-100 text-[#FF5C1A] flex items-center justify-center shrink-0">
                      <ArrowLeftRight class="w-5 h-5" />
                    </div>
                    <div>
                      <div class="flex items-center gap-1.5">
                        <span class="text-sm font-bold text-gray-900">Barter Campus Trade</span>
                        <span class="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-[#FF5C1A] text-white">NEW</span>
                      </div>
                      <p class="text-xs text-gray-600 mt-0.5 leading-snug">Buy, sell & swap student gadgets, dorm gear & books</p>
                    </div>
                  </div>
                  <div class="w-7 h-7 rounded-full bg-white/80 border border-orange-200/60 flex items-center justify-center text-orange-600 shrink-0 group-hover:translate-x-0.5 transition-transform">
                    <ArrowRight class="w-3.5 h-3.5" />
                  </div>
                </div>
              </a>
            </div>

            <!-- Core Activity Grid (2x2) -->
            <div class="space-y-1.5">
              <span class="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider px-1 block">Campus Essentials</span>
              <div class="grid grid-cols-2 gap-2">
                
                <!-- Track Orders -->
                <button 
                  type="button"
                  @click="openOrderModalFromMobile" 
                  class="p-2.5 rounded-xl bg-white border border-[#E7E2DA] hover:border-[#FF5C1A]/40 text-left transition-all active:scale-95 shadow-2xs flex items-center gap-2.5 group"
                >
                  <div class="w-7 h-7 rounded-lg bg-orange-50 border border-orange-100/80 flex items-center justify-center text-[#FF5C1A] shrink-0 group-hover:scale-105 transition-transform">
                    <Package class="w-3.5 h-3.5" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <span class="block text-xs font-bold text-gray-900 truncate group-hover:text-[#FF5C1A] transition-colors">Track Orders</span>
                    <span class="block text-[10px] text-gray-500 font-medium truncate">Live status</span>
                  </div>
                </button>

                <!-- Bookings -->
                <button 
                  type="button"
                  @click="openBookingModalFromMobile" 
                  class="p-2.5 rounded-xl bg-white border border-[#E7E2DA] hover:border-[#FF5C1A]/40 text-left transition-all active:scale-95 shadow-2xs flex items-center gap-2.5 group"
                >
                  <div class="w-7 h-7 rounded-lg bg-purple-50 border border-purple-100/80 flex items-center justify-center text-purple-700 shrink-0 group-hover:scale-105 transition-transform">
                    <Calendar class="w-3.5 h-3.5" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <span class="block text-xs font-bold text-gray-900 truncate group-hover:text-purple-700 transition-colors">Bookings</span>
                    <span class="block text-[10px] text-gray-500 font-medium truncate">Services & slots</span>
                  </div>
                </button>

                <!-- Group Orders -->
                <NuxtLink 
                  to="/dashboard/group-orders" 
                  @click="closeMobileMenu"
                  class="p-2.5 rounded-xl bg-white border border-[#E7E2DA] hover:border-[#FF5C1A]/40 text-left transition-all active:scale-95 shadow-2xs flex items-center gap-2.5 group"
                >
                  <div class="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100/80 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-105 transition-transform">
                    <Users class="w-3.5 h-3.5" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <span class="block text-xs font-bold text-gray-900 truncate group-hover:text-blue-600 transition-colors">Group Orders</span>
                    <span class="block text-[10px] text-gray-500 font-medium truncate">Pool with friends</span>
                  </div>
                </NuxtLink>

                <!-- Market Pool -->
                <NuxtLink 
                  to="/market-pool" 
                  @click="closeMobileMenu"
                  class="p-2.5 rounded-xl bg-white border border-[#E7E2DA] hover:border-[#FF5C1A]/40 text-left transition-all active:scale-95 shadow-2xs flex items-center gap-2.5 group"
                >
                  <div class="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100/80 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-105 transition-transform">
                    <ShoppingBag class="w-3.5 h-3.5" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <span class="block text-xs font-bold text-gray-900 truncate group-hover:text-emerald-600 transition-colors">Market Pool</span>
                    <span class="block text-[10px] text-gray-500 font-medium truncate">Bulk price drops</span>
                  </div>
                </NuxtLink>

              </div>
            </div>

            <!-- Partner With Erranders -->
            <div class="space-y-2.5">
              <span class="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider px-1 block">Partner With Erranders</span>
              <div class="grid grid-cols-2 gap-2.5">
                <a 
                  href="https://vendor.erranders.org/auth/register" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  @click="closeMobileMenu"
                  class="p-3 rounded-xl bg-white border border-[#E7E2DA] hover:border-gray-400 transition-all flex items-center gap-2.5 active:scale-95 shadow-xs"
                >
                  <div class="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center shrink-0">
                    <Store class="w-4 h-4" />
                  </div>
                  <div class="min-w-0">
                    <span class="block text-xs font-bold text-gray-900 truncate">Become Vendor</span>
                    <span class="block text-[10px] text-gray-500">Sell to students</span>
                  </div>
                </a>

                <a 
                  href="https://dispatch.erranders.org/auth/register" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  @click="closeMobileMenu"
                  class="p-3 rounded-xl bg-white border border-[#E7E2DA] hover:border-gray-400 transition-all flex items-center gap-2.5 active:scale-95 shadow-xs"
                >
                  <div class="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center shrink-0">
                    <Bike class="w-4 h-4" />
                  </div>
                  <div class="min-w-0">
                    <span class="block text-xs font-bold text-gray-900 truncate">Errand Ninja</span>
                    <span class="block text-[10px] text-gray-500">Deliver & earn</span>
                  </div>
                </a>
              </div>
            </div>

            <!-- Quick Links Footer -->
            <div class="pt-2 pb-1 border-t border-[#E7E2DA]/80 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-semibold text-gray-500">
              <NuxtLink to="/faq" @click="closeMobileMenu" class="hover:text-gray-900 transition-colors">FAQ</NuxtLink>
              <span class="text-gray-300">·</span>
              <NuxtLink to="/about" @click="closeMobileMenu" class="hover:text-gray-900 transition-colors">About Us</NuxtLink>
              <span class="text-gray-300">·</span>
              <NuxtLink to="/contact" @click="closeMobileMenu" class="hover:text-gray-900 transition-colors">Contact</NuxtLink>
              <span class="text-gray-300">·</span>
              <NuxtLink to="/terms" @click="closeMobileMenu" class="hover:text-gray-900 transition-colors">Terms & Privacy</NuxtLink>
            </div>

          </div>

          <!-- Bottom Sticky Auth Bar -->
          <div class="p-4 bg-white/95 backdrop-blur-xl border-t border-[#E7E2DA] shrink-0">
            <template v-if="!user">
              <div class="grid grid-cols-2 gap-3">
                <NuxtLink 
                  to="/auth/login" 
                  @click="closeMobileMenu"
                  class="py-3 px-4 rounded-xl border border-gray-300 text-center text-sm font-bold text-gray-900 bg-white hover:bg-gray-50 active:scale-95 transition-all shadow-xs flex items-center justify-center"
                >
                  Log In
                </NuxtLink>
                <NuxtLink 
                  to="/auth/register" 
                  @click="closeMobileMenu"
                  class="py-3 px-4 rounded-xl text-center text-sm font-bold text-white bg-parentPrimary hover:bg-orange-600 active:scale-95 transition-all shadow-sm flex items-center justify-center"
                >
                  Create Account
                </NuxtLink>
              </div>
            </template>
            <template v-else>
              <div class="grid grid-cols-2 gap-3">
                <NuxtLink 
                  to="/dashboard" 
                  @click="closeMobileMenu"
                  class="py-3 px-4 rounded-xl text-center text-sm font-bold text-white bg-parentPrimary hover:bg-orange-600 active:scale-95 transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <LayoutDashboard class="w-4 h-4" />
                  Dashboard
                </NuxtLink>
                <button 
                  @click="handleLogoutFromMobile"
                  class="py-3 px-4 rounded-xl border border-rose-200 text-center text-sm font-bold text-rose-600 bg-rose-50/50 hover:bg-rose-50 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <LogOut class="w-4 h-4" />
                  Log Out
                </button>
              </div>
            </template>
          </div>

        </div>
      </Transition>
    </Teleport>

    <CoreManageBookingModal :isOpen="isBookingModalOpen" @close="isBookingModalOpen = false" />
    <CoreManageOrderModal :isOpen="isOrderModalOpen" @close="isOrderModalOpen = false" />
    <CoreLogoutModal :isOpen="isLogoutModalOpen" @close="isLogoutModalOpen = false" />
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { useUser } from "@/composables/modules/auth/user"
import { useCart } from "@/composables/modules/cart"
import { 
  Home, User, LogOut, Menu as MenuIcon, Filter, ChevronDown, ShoppingCart, 
  Info, Zap, Package, Calendar, Store, Bike, LayoutDashboard, Repeat, Users, 
  ShoppingBag, ArrowLeftRight, X, ChevronRight, ArrowRight, Sparkles
} from 'lucide-vue-next'
import { useRoute } from 'vue-router'
import { useGlobalFilter } from '@/composables/core/useGlobalFilter'

const isBookingModalOpen = ref(false)
const isOrderModalOpen = ref(false)
const isMobileMenuOpen = ref(false)
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

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const openBookingModalFromMobile = () => {
  closeMobileMenu()
  isBookingModalOpen.value = true
}

const openOrderModalFromMobile = () => {
  closeMobileMenu()
  isOrderModalOpen.value = true
}

const handleLogoutFromMobile = () => {
  closeMobileMenu()
  handleLogout()
}

// Lock body scrolling when mobile full-screen menu is open
watch(isMobileMenuOpen, (isOpen) => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  }
})

// Close mobile menu on page route change
watch(() => $route.fullPath, () => {
  isMobileMenuOpen.value = false
})

const handleScroll = () => {
  scrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  fetchCategories()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (typeof document !== 'undefined') {
    document.body.style.overflow = ''
  }
})
</script>

