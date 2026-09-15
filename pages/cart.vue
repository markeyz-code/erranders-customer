<template>
  <div class="min-h-screen bg-white selection:bg-parentPrimary/10 selection:text-parentPrimary font-sans">

    <!-- ===== EMPTY STATE ===== -->
    <div v-if="cartStore.isEmpty.value" class="min-h-screen flex flex-col">
      <!-- Header -->
      <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-50">
        <div class="max-w-5xl mx-auto flex items-center justify-between px-4 md:px-4 py-4">
          <NuxtLink to="/" class="flex items-center gap-2.5 group">
            <!-- <div class="w-9 h-9 bg-gray-900 rounded-xl flex items-center justify-center text-white shadow-sm border border-gray-100 group-hover:bg-parentPrimary transition-all">
              <ShoppingBag class="w-4 h-4" />
            </div>
            <span class="text-lg font-bold text-gray-900 tracking-tighter">Errandr</span> -->
            <img src="@/assets/img/logo-light.png" class="w-32" />
          </NuxtLink>
          
          <NuxtLink to="/dashboard/search" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition-all active:scale-95 text-gray-900">
            <Search class="w-4.5 h-4.5" />
          </NuxtLink>
        </div>
      </header>

      <div class="flex-1 flex flex-col items-center justify-center p-4 max-w-lg mx-auto text-center">
        <div class="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center text-5xl mb-8 animate-float">🛒</div>
        <h2 class="text-3xl font-medium text-gray-900 mb-3 tracking-tight">Your cart is empty</h2>
        <p class="text-sm font-medium text-gray-400 mb-8 leading-relaxed">Discover your favorite campus meals and start building your order.</p>
        <NuxtLink to="/vendors" class="px-5 py-4 bg-gray-900 text-white rounded-2xl font-medium text-xs tracking-wider hover:bg-parentPrimary transition-all active:scale-95 flex items-center gap-2 shadow-sm border border-gray-100">
          <ShoppingBag class="w-4 h-4" /> Browse Vendors
        </NuxtLink>
      </div>

      <!-- Campus Favorites -->
      <div v-if="loadingVendors || popularVendors.length > 0" class="max-w-5xl mx-auto w-full px-4 md:px-4 pb-12">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-medium text-gray-900 tracking-tight">Campus Favorites 🔥</h3>
          <NuxtLink to="/vendors" class="text-xs font-medium text-parentPrimary hover:underline px-3 py-1.5 rounded-lg bg-parentPrimary/5">See all</NuxtLink>
        </div>
        <div v-if="loadingVendors" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div v-for="i in 3" :key="i" class="h-48 bg-gray-50 rounded-2xl animate-pulse"></div>
        </div>
        <div v-else-if="popularVendors.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <NuxtLink
            v-for="vendor in popularVendors.slice(0, 6)"
            :key="vendor._id"
            :to="`/vendors/${vendor._id}`"
            class="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all group hover:-translate-y-0.5 hover:shadow-sm border border-gray-100 block"
          >
            <div class="h-28 w-full bg-gray-50 relative overflow-hidden">
              <video v-if="(vendor.banner || vendor.logo) && (vendor.banner || vendor.logo).match(/\\.(mp4|webm|ogg|mov)/i)" :src="vendor.banner || vendor.logo" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" autoplay loop muted playsinline></video>
              <img v-else :src="vendor.banner || vendor.logo || '/placeholder-store.jpg'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <!-- Padlock -->
              <div v-if="vendor.isOpen === false" class="absolute inset-0 bg-black/60 z-10 flex flex-col items-center justify-center">
                <Lock class="w-6 h-6 text-white mb-1" />
                <span class="text-white font-bold text-[9px] tracking-wide text-center leading-tight">STORE<br/>CLOSED</span>
              </div>
              <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
              <div class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 z-20">
                <Star class="w-3 h-3 text-amber-500 fill-current" />
                <span class="text-xs font-medium text-gray-900">{{ vendor.rating?.toFixed(1) || '5.0' }}</span>
              </div>
            </div>
            <div class="p-4 flex items-center justify-between gap-3">
              <div class="min-w-0">
                <h4 class="text-sm font-medium text-gray-900 truncate tracking-tight">{{ vendor.storeName }}</h4>
                <p class="text-xs font-bold text-gray-400 mt-0.5">{{ vendor.preparationTime || 20 }} min · {{ vendor.category }}</p>
              </div>
              <div class="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-parentPrimary group-hover:text-white transition-colors shrink-0">
                <ArrowRight class="w-3.5 h-3.5" />
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- ===== ACTIVE CART + CHECKOUT ===== -->
    <div v-else class="min-h-screen flex flex-col">
      
      <!-- Sticky Header -->
      <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-xl border-b border-gray-50">
        <div class="max-w-[1200px] mx-auto flex items-center justify-between px-4 md:px-4 py-3">
          <div class="flex items-center gap-3">
            <button @click="checkoutStep === 'checkout' ? checkoutStep = 'cart' : goBack()" class="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition-all active:scale-95">
              <ArrowLeft class="w-4 h-4 text-gray-900" />
            </button>
            <div>
              <h1 class="text-base font-medium text-gray-900 tracking-tight leading-none">{{ checkoutStep === 'cart' ? 'Your Cart' : 'Checkout' }}</h1>
              <p class="text-xs font-bold text-gray-400 mt-0.5">{{ cartStore.itemCount }} items</p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <NuxtLink to="/dashboard/search" class="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition-all active:scale-95 text-gray-900">
              <Search class="w-4 h-4" />
            </NuxtLink>
            
            <button 
              v-if="checkoutStep === 'checkout'"
              @click="showOrderBreakdown = true"
              class="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs font-medium text-gray-900 hover:bg-gray-100 transition-all lg:hidden active:scale-95"
            >
              <ShoppingCart class="w-3.5 h-3.5" />
              Review
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <div class="flex-1 max-w-[1200px] mx-auto w-full px-0 sm:px-4 md:px-4 py-4 pb-60 lg:pb-10">
        <div class="flex flex-col lg:flex-row gap-6">

          <!-- LEFT: Delivery + Payment -->
          <div class="flex-1 space-y-5">
            <div v-show="checkoutStep === 'checkout'" class="space-y-5">
            
            <!-- Split Bill Payment Progress -->
            <div v-if="groupOrder && groupOrder.status === 'locked' && groupOrder.splitType === 'split_bill'" class="bg-white rounded-none sm:rounded-2xl border-y sm:border-x border-gray-100 overflow-hidden">
              <div class="flex items-center gap-3 px-5 py-4 bg-indigo-50/50 border-b border-indigo-100">
                <div class="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                  <Users class="w-4 h-4" />
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-900 tracking-tight">Payment Progress</h3>
                  <p class="text-xs font-bold text-gray-400">Waiting for everyone to pay their share</p>
                </div>
              </div>
              <div class="p-4 space-y-2">
                <div v-for="p in groupOrder.participants" :key="p.user?._id || p.user" class="flex items-center justify-between p-3 rounded-xl border border-gray-50 bg-gray-50/50">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                      <img v-if="p.user?.avatar" :src="p.user.avatar" class="w-full h-full object-cover" />
                      <div v-else class="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">{{ p.user?.firstName?.[0] || 'G' }}</div>
                    </div>
                    <div>
                      <p class="text-xs font-medium text-gray-900 leading-none mb-1">{{ p.user?.firstName || 'Guest' }} {{ p.user?.lastName || '' }}</p>
                      <p class="text-xs font-bold text-gray-400">₦{{ p.total?.toLocaleString() }}</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <div v-if="p.hasPaid" class="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-1 rounded-md">
                      <CheckCircle class="w-3.5 h-3.5" />
                      <span class="text-xs font-bold">Paid</span>
                    </div>
                    <div v-else class="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-1 rounded-md">
                      <Loader2 class="w-3.5 h-3.5 animate-spin" />
                      <span class="text-xs font-bold">Waiting</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 1: Delivery Details -->
            <div class="bg-white rounded-none sm:rounded-2xl border-y sm:border-x border-gray-100 overflow-visible">
              <div class="flex items-center gap-3 px-4 sm:px-5 py-4 bg-gray-50/50 border-b border-gray-100 sm:rounded-t-2xl">
                <div class="w-8 h-8 bg-parentPrimary/10 rounded-xl flex items-center justify-center text-parentPrimary">
                  <MapPin class="w-4 h-4" />
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-900 tracking-tight">Delivery Details</h3>
                  <p class="text-xs font-bold text-gray-400">Where should we drop it?</p>
                </div>
              </div>
              <div class="p-4 sm:p-5 space-y-4">
                <AnimatedInput v-model="recipientName" label="Full Name"  />
                <AnimatedInput v-model="recipientPhone" label="Phone Number" type="tel" />
                <!-- Delivery Option is fixed to use_an_errander -->
                <div class="mb-5 space-y-3">
                  <label class="text-xs font-medium text-gray-400 tracking-wider block mb-1 pl-1">Delivery Method</label>
                  <div class="grid grid-cols-2 gap-3">
                    <button 
                      @click="deliveryMode = 'room_delivery'"
                      class="flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all"
                      :class="deliveryMode === 'room_delivery' ? 'border-parentPrimary bg-parentPrimary/5 text-parentPrimary' : 'border-gray-100 bg-white hover:border-gray-200'"
                    >
                      <span class="text-xs font-bold" :class="deliveryMode === 'room_delivery' ? 'text-parentPrimary' : 'text-gray-900'">Room Delivery</span>
                    </button>
                    <button 
                      @click="deliveryMode = 'dropoff_service'"
                      class="flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all"
                      :class="deliveryMode === 'dropoff_service' ? 'border-parentPrimary bg-parentPrimary/5 text-parentPrimary' : 'border-gray-100 bg-white hover:border-gray-200'"
                    >
                      <span class="text-xs font-bold" :class="deliveryMode === 'dropoff_service' ? 'text-parentPrimary' : 'text-gray-900'">Drop-off Service</span>
                    </button>
                  </div>
                  <!-- Explanatory note for delivery types -->
                  <div class="bg-gray-50 p-3 rounded-xl mt-2">
                    <p class="text-[11px] font-medium text-gray-600 leading-relaxed">
                      <span class="font-bold text-gray-900">Room Delivery:</span> Hand-delivered directly to your room or exact location. <br/>
                      <span class="font-bold text-gray-900">Drop-off Service:</span> Delivered to a central drop-off point at your location (e.g. hostel porter, gate).
                    </p>
                  </div>
                </div>

                <div class="animate-fade-in relative z-30">
                  <div class="mb-5 space-y-3">
                    <label class="text-xs font-medium text-gray-400 tracking-wider block mb-1 pl-1">Order Location Type</label>
                    <div class="grid grid-cols-2 gap-3">
                      <button 
                        @click="isWithinLuth = true"
                        class="flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all"
                        :class="isWithinLuth ? 'border-parentPrimary bg-parentPrimary/5 text-parentPrimary' : 'border-gray-100 bg-white hover:border-gray-200'"
                      >
                        <span class="text-xs font-bold" :class="isWithinLuth ? 'text-parentPrimary' : 'text-gray-900'">Inside Campus</span>
                      </button>
                      <button 
                        @click="isWithinLuth = false"
                        class="flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all"
                        :class="!isWithinLuth ? 'border-parentPrimary bg-parentPrimary/5 text-parentPrimary' : 'border-gray-100 bg-white hover:border-gray-200'"
                      >
                        <span class="text-xs font-bold" :class="!isWithinLuth ? 'text-parentPrimary' : 'text-gray-900'">Outside Campus</span>
                      </button>
                    </div>
                  </div>
                  
                  <div v-if="isWithinLuth">
                    <label class="text-xs font-medium text-gray-400 tracking-wider block mb-2 pl-1">Hostel / Campus Location</label>
                    <input 
                      v-model="specificAddress"
                      type="text"
                      placeholder="e.g. Block 4 Common Room"
                      class="w-full bg-white border border-gray-100 focus:border-parentPrimary/50 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all shadow-sm"
                    />
                  </div>
                  
                  <div v-else class="space-y-4">
                    <div class="mb-4">
                      <label class="text-xs font-medium text-gray-400 tracking-wider block mb-2 pl-1">Distance / Area</label>
                      <div class="grid grid-cols-2 gap-3">
                        <button 
                          @click="outsideCampusLocation = 'campus_environs'"
                          class="flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all"
                          :class="outsideCampusLocation === 'campus_environs' ? 'border-parentPrimary bg-parentPrimary/5 text-parentPrimary' : 'border-gray-100 bg-white hover:border-gray-200'"
                        >
                          <span class="text-[11px] font-bold" :class="outsideCampusLocation === 'campus_environs' ? 'text-parentPrimary' : 'text-gray-900'">Campus Environs</span>
                          <span class="text-[9px]" :class="outsideCampusLocation === 'campus_environs' ? 'text-parentPrimary' : 'text-gray-500'">Just Outside</span>
                        </button>
                        <button 
                          @click="outsideCampusLocation = 'outside_campus'"
                          class="flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all"
                          :class="outsideCampusLocation === 'outside_campus' ? 'border-parentPrimary bg-parentPrimary/5 text-parentPrimary' : 'border-gray-100 bg-white hover:border-gray-200'"
                        >
                          <span class="text-[11px] font-bold" :class="outsideCampusLocation === 'outside_campus' ? 'text-parentPrimary' : 'text-gray-900'">Far Off-Campus</span>
                          <span class="text-[9px]" :class="outsideCampusLocation === 'outside_campus' ? 'text-parentPrimary' : 'text-gray-500'">City / Town</span>
                        </button>
                      </div>
                    </div>
                    <div>
                      <label class="text-xs font-medium text-gray-400 tracking-wider block mb-2 pl-1">Full Delivery Address</label>
                      <!-- <UiMapboxAutocomplete 
                        v-model="specificAddress" 
                        @select="handleAddressSelect" 
                        placeholder="e.g. Moremi Hall, Room 302, Unilag" 
                      /> -->
                      <input 
                        v-model="specificAddress"
                        type="text"
                        placeholder="e.g. 123 Main Street, Phase 2, Yaba, Lagos"
                        class="w-full bg-white border border-gray-100 focus:border-parentPrimary/50 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all shadow-sm"
                      />
                    </div>
                    <div>
                      <div class="flex items-center justify-between mb-2 pl-1">
                        <label class="text-xs font-medium text-gray-400 tracking-wider block">Proposed Delivery Fee (₦)</label>
                        <span class="text-[10px] font-bold text-parentPrimary">Min: ₦{{ activeMinOutsideFee }}</span>
                      </div>
                      <input 
                        v-model.number="proposedDeliveryFee"
                        type="number"
                        :min="activeMinOutsideFee"
                        @blur="() => { if (!proposedDeliveryFee || proposedDeliveryFee < activeMinOutsideFee) proposedDeliveryFee = activeMinOutsideFee }"
                        placeholder="Enter your offer"
                        class="w-full bg-white border border-gray-100 focus:border-parentPrimary/50 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all shadow-sm"
                      />
                      <p class="text-[10px] text-gray-500 mt-1 pl-1">Enter a fair amount. Riders will bid based on this offer.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 1.5: Pre-order Schedule -->
            <div v-if="isPreOrderCart" class="bg-white rounded-none sm:rounded-2xl border-y sm:border-x border-gray-100 overflow-visible animate-fade-in">
              <div class="flex items-center gap-3 px-4 sm:px-5 py-4 bg-purple-50/50 border-b border-purple-100 sm:rounded-t-2xl">
                <div class="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                  <Calendar class="w-4 h-4" />
                </div>
                <div>
                  <h3 class="text-sm font-medium text-gray-900 tracking-tight">Delivery Schedule</h3>
                  <p class="text-xs font-bold text-gray-400">When do you want this pre-order?</p>
                </div>
              </div>
              <div class="p-4 sm:p-5">
                <label class="text-xs font-medium text-gray-400 tracking-wider block mb-2 pl-1">Select Delivery Date</label>
                <input 
                  v-model="scheduledDate"
                  type="datetime-local"
                  :min="minPreOrderDate"
                  class="w-full bg-gray-50 border-2 border-transparent focus:border-parentPrimary/20 rounded-xl px-4 py-3 text-base font-bold text-gray-900 outline-none transition-all"
                />
                <div class="mt-3 text-xs font-bold text-gray-400 space-y-1">
                  <p>• Requires a minimum of {{ maxLeadTime }} hours notice.</p>
                  <p v-if="allowedDays && allowedDays.length > 0">• Deliveries available only on: {{ allowedDays.join(', ') }}</p>
                </div>

                <div class="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                  <p class="text-[11px] font-medium text-blue-800 leading-relaxed">
                    <strong>Note:</strong> Your payment will be processed immediately upon checkout. The vendor will receive and prepare your order exactly at their opening time on your selected date.
                  </p>
                </div>

                <div class="mt-4">
                  <label class="flex items-center gap-2 cursor-pointer group">
                    <div class="relative flex items-center justify-center">
                      <input type="checkbox" v-model="wantsNotification" class="w-4 h-4 rounded border-gray-300 text-parentPrimary focus:ring-parentPrimary/20 transition-all cursor-pointer z-10 opacity-0 peer" />
                      <div class="absolute inset-0 bg-white border-2 border-gray-200 rounded peer-checked:bg-parentPrimary peer-checked:border-parentPrimary peer-focus:ring-2 peer-focus:ring-parentPrimary/20 transition-all flex items-center justify-center">
                        <Check class="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <span class="text-xs font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Also notify me when the vendor opens</span>
                  </label>
                  
                  <Transition
                    enter-active-class="transition-all duration-300 ease-out"
                    enter-from-class="opacity-0 -translate-y-2 max-h-0"
                    enter-to-class="opacity-100 translate-y-0 max-h-[100px]"
                    leave-active-class="transition-all duration-200 ease-in"
                    leave-from-class="opacity-100 translate-y-0 max-h-[100px]"
                    leave-to-class="opacity-0 -translate-y-2 max-h-0"
                  >
                    <div v-if="wantsNotification" class="mt-3 overflow-hidden">
                      <input 
                        v-model="notifyEmail"
                        type="email"
                        placeholder="Enter your email address"
                        class="w-full bg-white border border-gray-200 focus:border-parentPrimary/50 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all shadow-sm"
                      />
                    </div>
                  </Transition>
                </div>
              </div>
            </div>

            <!-- Step 2: Payment -->
            <div class="bg-white rounded-none sm:rounded-2xl border-y sm:border-x border-gray-100 overflow-visible mt-5">
              <div class="flex items-center gap-3 px-4 sm:px-5 py-4 bg-gray-50/50 border-b border-gray-100 sm:rounded-t-2xl">
                <div class="w-9 h-9 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                  <CreditCard class="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 class="text-sm font-semibold text-gray-900 tracking-tight">Payment Method</h3>
                  <p class="text-xs font-medium text-gray-400">Choose how to pay</p>
                </div>
              </div>
              <div class="p-3">
                <div class="flex flex-col gap-2">
                  <button 
                    @click="paymentMethod = 'card'"
                    :class="paymentMethod === 'card' ? 'border-parentPrimary bg-parentPrimary/5 ring-1 ring-parentPrimary/30' : 'border-gray-100 hover:border-gray-200 bg-white'"
                    class="p-3 rounded-xl border transition-all text-left flex items-center justify-between w-full active:scale-[0.98]"
                  >
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-7 flex items-center justify-center bg-white rounded border border-gray-100">
                        <img src="~/assets/img/paystack.png" class="h-4 object-contain" alt="Paystack" />
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900 leading-none mb-0.5">Pay with Paystack</p>
                        <p class="text-xs font-medium text-gray-400">Instant & Secure</p>
                      </div>
                    </div>
                    <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center" :class="paymentMethod === 'card' ? 'border-parentPrimary bg-parentPrimary text-white' : 'border-gray-300'">
                      <div v-if="paymentMethod === 'card'" class="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                  </button>

                  <button 
                    @click="paymentMethod = 'wallet'"
                    :class="paymentMethod === 'wallet' ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500/30' : 'border-gray-100 hover:border-gray-200 bg-white'"
                    class="p-3 rounded-xl border transition-all text-left flex items-center justify-between w-full active:scale-[0.98]"
                  >
                    <div class="flex items-center gap-3">
                      <div class="w-9 h-9 bg-white rounded-lg flex items-center justify-center border border-gray-100">
                        <Wallet :class="paymentMethod === 'wallet' ? 'text-emerald-500' : 'text-gray-300'" class="w-5 h-5 transition-colors" />
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-900 leading-none mb-1">My Wallet</p>
                        <p :class="balance < finalTotal ? 'text-rose-500' : 'text-emerald-600'" class="text-xs font-semibold flex items-center gap-1">
                          ₦{{ (balance || 0).toLocaleString() }}
                          <span @click.stop="fetchWallet" class="p-0.5 hover:bg-emerald-100 rounded transition-colors inline-block ml-1 cursor-pointer">
                            <RefreshCw :class="loadingPayment ? 'animate-spin' : ''" class="w-3 h-3 text-emerald-500" />
                          </span>
                        </p>
                      </div>
                    </div>
                    <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center" :class="paymentMethod === 'wallet' ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-gray-300'">
                      <div v-if="paymentMethod === 'wallet'" class="w-2 h-2 rounded-full bg-white"></div>
                    </div>
                  </button>
                </div>
              </div>

                <!-- Insufficient Funds -->
                <div v-if="paymentMethod === 'wallet' && balance < finalTotal" class="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-2xl animate-fade-in text-center">
                  <p class="text-xs font-bold text-rose-500 mb-3">Your balance is too low for this order</p>
                  <div class="flex flex-col gap-2">
                    <input 
                      v-model="formattedTopupAmount"
                      type="text"
                      placeholder="e.g. 5,000"
                      class="w-full px-5 py-4 bg-white border border-rose-200 rounded-xl text-xl font-bold text-gray-900 outline-none focus:border-parentPrimary transition-all placeholder:text-gray-300"
                    />
                    <button 
                      @click="startTopup"
                      :disabled="loadingPayment || topupAmount <= 0"
                      class="w-full py-3 bg-gray-900 text-white rounded-xl text-xs font-medium hover:bg-parentPrimary transition-all disabled:opacity-50"
                    >
                      {{ loadingPayment ? 'Initializing...' : 'Top-up with Paystack' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- MOBILE: Group Order Banner -->
            <div v-if="!groupOrder" class="lg:hidden relative overflow-hidden bg-gray-900 sm:rounded-[1.5rem] p-5 mb-4 flex items-center justify-between cursor-pointer shadow-lg shadow-black/20 active:scale-[0.98] transition-all group border border-gray-800" @click="router.push('/dashboard/group-orders')">
              <div class="absolute -right-4 -top-4 w-32 h-32 bg-parentPrimary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              <div class="flex-1 relative z-10">
                <h4 class="text-sm font-black text-white mb-1 drop-shadow-sm flex items-center gap-2">Save on delivery? <span class="text-lg">💰</span></h4>
                <p class="text-sm font-medium text-white leading-relaxed">Invite roommates to this order and split the fee!</p>
              </div>
              <div class="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center shrink-0 ml-4 shadow-sm relative z-10">
                <Users class="w-4 h-4" />
              </div>
            </div>



            <!-- MOBILE: Order Summary -->
            <div class="lg:hidden bg-white rounded-none sm:rounded-2xl border-y sm:border-x border-gray-100 overflow-hidden shadow-xl shadow-black/5">
              <div class="px-4 sm:px-5 py-4 bg-gray-50/50 border-b border-gray-100 flex items-center gap-3">
                <div class="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-200">
                  <Receipt class="w-4 h-4 text-gray-700" />
                </div>
                <h3 class="text-sm font-bold text-gray-900 tracking-tight">Order Summary</h3>
              </div>
              <div class="p-4 sm:p-5 space-y-3">
                <div class="flex justify-between items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                  <span>Subtotal</span>
                  <span class="text-gray-900 font-bold">₦{{ (groupOrder ? groupSubtotal : cartStore.subtotal.value)?.toLocaleString() }}</span>
                </div>
                <div v-if="computedTotalDeliveryFee > 0" class="flex justify-between items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                  <span>Delivery</span>
                  <span :class="isBirthday ? 'line-through text-gray-400' : 'text-gray-900 font-bold'">₦{{ computedTotalDeliveryFee.toLocaleString() }}</span>
                </div>
                <div v-if="computedTotalPackagingFee > 0" class="flex justify-between items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                  <span>Pack</span>
                  <span class="text-gray-900 font-bold">₦{{ computedTotalPackagingFee.toLocaleString() }}</span>
                </div>
                <div class="flex justify-between items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                  <span>Service Charge</span>
                  <span class="text-gray-900 font-bold">₦{{ (computedTotalServiceFee + computedPaystackFee).toLocaleString() }}</span>
                </div>
                <div v-if="isBirthday" class="flex justify-between items-center text-xs font-bold text-[#008950]">
                  <span class="flex items-center gap-1">🎂 Birthday Treat</span>
                  <span class="font-bold">-₦{{ computedBirthdayDiscount.toLocaleString() }}</span>
                </div>
                <div v-if="computedTokenDiscount > 0" class="flex justify-between items-center text-xs font-bold text-orange-500">
                  <span class="flex items-center gap-1">🎟 Streak Free Delivery</span>
                  <span class="font-bold">-₦{{ computedTokenDiscount.toLocaleString() }}</span>
                </div>
                <div v-if="computedComboPromoDiscount > 0" class="flex justify-between items-center text-xs font-bold text-emerald-600">
                  <span class="flex items-center gap-1">✨ Exam Combo Discount</span>
                  <span class="font-bold">-₦{{ computedComboPromoDiscount.toLocaleString() }}</span>
                </div>
                <div v-if="computedBrethrenDiscount > 0" class="flex justify-between items-center text-xs font-bold text-parentPrimary">
                  <span class="flex items-center gap-1"><Users class="w-3 h-3" /> Brethren Split</span>
                  <span class="font-bold">-₦{{ computedBrethrenDiscount.toLocaleString() }}</span>
                </div>
                <div v-if="computedPromoDiscount > 0" class="flex justify-between items-center text-xs font-bold text-blue-500">
                  <span class="flex items-center gap-1"><Tag class="w-3 h-3" /> Promo ({{ promoCodeObj.code }})</span>
                  <span class="font-bold">-₦{{ computedPromoDiscount.toLocaleString() }}</span>
                </div>
              </div>
              <div class="px-4 sm:px-5 pb-5 pt-3 border-t border-dashed border-gray-300 space-y-5">
                <div v-if="isNightOwl" class="p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-3">
                  <span class="text-lg">🦉</span>
                  <div>
                    <p class="text-xs font-bold text-indigo-700">Night Owl Active!</p>
                    <p class="text-xs font-medium text-indigo-600">Enjoy free delivery till 2 AM</p>
                  </div>
                </div>

                <div v-if="!promoCodeObj" class="flex gap-2">
                  <input 
                    v-model="promoCodeInput"
                    @input="handlePromoInput"
                    type="text"
                    placeholder="Enter Promo Code"
                    class="flex-1 px-4 py-3 bg-white border border-gray-200 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 rounded-xl text-xs font-bold text-gray-900 placeholder-gray-400 outline-none uppercase transition-all shadow-sm"
                  />
                  <button 
                    @click="validatePromo"
                    :disabled="isValidatingPromo || !promoCodeInput"
                    class="px-5 py-3 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black disabled:opacity-50 transition-colors shadow-sm active:scale-95"
                  >
                    <Loader2 v-if="isValidatingPromo" class="w-3 h-3 animate-spin" />
                    <span v-else>Apply</span>
                  </button>
                </div>

                <div v-if="debugPromoMsg" class="mt-2 p-2 bg-yellow-50 border border-yellow-200 text-yellow-800 text-[10px] rounded">
                  {{ debugPromoMsg }}
                </div>

                <!-- Mobile Promo Preview Area -->
                <div v-if="isPreviewingPromo" class="flex justify-center mt-2">
                   <Loader2 class="w-4 h-4 text-parentPrimary animate-spin" />
                </div>
                <div v-else-if="promoPreview && !promoCodeObj" class="mt-3 p-4 rounded-xl" :class="promoPreview.eligibility.isEligible ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'">
                  <div class="flex items-start gap-3">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" :class="promoPreview.eligibility.isEligible ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'">
                      <CheckCircle v-if="promoPreview.eligibility.isEligible" class="w-4 h-4" />
                      <XCircle v-else class="w-4 h-4" />
                    </div>
                    <div>
                      <p class="text-sm font-bold" :class="promoPreview.eligibility.isEligible ? 'text-emerald-800' : 'text-red-800'">
                        {{ promoPreview.eligibility.isEligible ? 'Promo Code Eligible!' : 'Promo Code Not Eligible' }}
                      </p>
                      <p class="text-xs mt-1 leading-relaxed" :class="promoPreview.eligibility.isEligible ? 'text-emerald-700' : 'text-red-700'">
                        <template v-if="promoPreview.eligibility.isEligible">
                          Use code <strong>{{ promoPreview.promo.code }}</strong> to get 
                          <strong>{{ promoPreview.promo.discountType === 'percentage' ? promoPreview.promo.value + '% off' : '₦' + promoPreview.promo.value?.toLocaleString() + ' off' }}</strong> your order{{ promoPreview.promo.minOrderAmount ? '. Minimum order of ₦' + promoPreview.promo.minOrderAmount?.toLocaleString() + ' required' : '' }}.
                          {{ promoPreview.promo.maxDiscount ? 'Maximum discount: ₦' + promoPreview.promo.maxDiscount?.toLocaleString() + '.' : '' }}
                        </template>
                        <template v-else>
                          {{ promoPreviewReason }}
                        </template>
                      </p>
                    </div>
                  </div>
                </div>
                <div v-if="user && user.freeDeliveryTokens > 0 && !isBirthday" class="flex items-center justify-between p-3 bg-orange-50 border border-orange-100 rounded-xl cursor-pointer hover:bg-orange-100/50 transition-colors" @click="useFreeDeliveryToken = !useFreeDeliveryToken">
                  <div class="flex flex-col">
                    <span class="text-xs font-bold text-orange-600 flex items-center gap-1">🎟 Use Free Delivery</span>
                    <span class="text-[9px] text-orange-500 font-medium">You have {{ user.freeDeliveryTokens }} left</span>
                  </div>
                  <div class="w-8 h-4 rounded-full transition-colors relative" :class="useFreeDeliveryToken ? 'bg-orange-500' : 'bg-orange-200'">
                    <div class="absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all shadow-sm" :class="useFreeDeliveryToken ? 'left-[18px]' : 'left-0.5'"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Order Items (Step 1) - PREMIUM REDESIGN -->
            <div v-if="checkoutStep === 'cart'" class="w-full mx-auto space-y-6">
              <div class="flex items-center justify-between px-2">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 bg-orange-500 text-white rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-orange-500/30">
                    <ShoppingCart class="w-5 h-5" />
                  </div>
                  <div>
                    <h3 class="text-lg font-bold text-gray-900 tracking-tight">Your Order</h3>
                    <p class="text-xs text-gray-500 font-medium">Review your items before checkout</p>
                  </div>
                </div>
                <button @click="goBack" class="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-xs font-bold transition-all shadow-sm border border-gray-100 active:scale-95">Edit Selection</button>
              </div>
              <div class="space-y-6">
                <div v-for="vendorId in cartStore.allVendorIds.value" :key="vendorId" class="relative group bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-6 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
                  <!-- Vendor Header -->
                  <div class="flex items-center justify-between mb-6 pb-4 border-b border-gray-100/50">
                    <div class="flex items-center gap-4">
                      <div class="w-12 h-12 bg-gradient-to-br from-gray-50 to-gray-100 rounded-[1rem] flex items-center justify-center border border-gray-200/50 shadow-inner">
                        <Store class="w-5 h-5 text-gray-700" />
                      </div>
                      <div>
                        <h4 class="text-base font-bold text-gray-900 tracking-tight">{{ toTitleCase(vendorsMetadata[vendorId]?.storeName || 'Loading...') }}</h4>
                        <p class="text-xs font-medium text-parentPrimary flex items-center gap-1 mt-0.5"><ShoppingBag class="w-3 h-3"/> {{ cartStore.getVendorStats(vendorId).itemCount }} items selected</p>
                      </div>
                    </div>
                    <button @click="cartStore.clearCart(vendorId)" class="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-[1rem] transition-all bg-gray-50/50 border border-transparent hover:border-rose-100" title="Remove Store">
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                  
                  <!-- Pack Items -->
                  <div v-for="(pack, pIndex) in cartStore.getVendorStats(vendorId).packs" :key="pack.id" class="space-y-3 mb-6 relative">
                    <div class="flex items-center gap-3 relative z-10">
                      <div class="h-7 px-3 bg-gray-900 text-white rounded-lg flex items-center justify-center text-xs font-black tracking-wider shadow-sm whitespace-nowrap">{{ pack.name || `P${pIndex + 1}` }}</div>
                      <div class="h-px flex-1 bg-gray-100"></div>
                    </div>
                    
                    <div class="space-y-3">
                      <div v-for="(item, iIndex) in pack.items" :key="item.productId + iIndex" class="group/item flex items-start gap-4 p-3 bg-gray-50/50 rounded-2xl hover:bg-gray-50 transition-colors border border-gray-100 hover:border-gray-200">
                        <div class="w-14 h-14 rounded-[1rem] overflow-hidden shrink-0 border border-gray-200/60 bg-white shadow-sm relative group-hover/item:shadow-md transition-shadow">
                          <video v-if="item.image && item.image.match(/\.(mp4|webm|ogg|mov)/i)" :src="item.image" class="w-full h-full object-cover" autoplay loop muted playsinline></video>
                          <img v-else :src="item.image || '/placeholder-store.jpg'" @error="$event.target.src = '/placeholder-store.jpg'" class="w-full h-full object-cover transform group-hover/item:scale-105 transition-transform duration-500" />
                          <div class="absolute top-0 right-0 bg-gray-900/80 backdrop-blur-sm text-white text-[9px] font-black px-1.5 py-0.5 rounded-bl-lg">x{{ item.quantity }}</div>
                        </div>
                        <div class="flex-1 min-w-0 pt-0.5">
                          <div class="flex justify-between items-start mb-1 gap-2">
                            <div class="flex-1 min-w-0">
                              <h5 class="text-sm font-bold text-gray-900 truncate">{{ toTitleCase(item.name) }}</h5>
                              <p v-if="item.customizations && item.customizations.length > 0" class="text-xs font-bold text-parentPrimary mt-0.5 bg-parentPrimary/10 inline-block px-2 py-0.5 rounded-full">Base: ₦{{ item.price?.toLocaleString() }}</p>
                            </div>
                            <div class="text-right shrink-0">
                              <p class="text-sm font-black text-gray-900 leading-none">₦{{ ((item.subtotal || (item.price * item.quantity)) / item.quantity).toLocaleString() }}</p>
                              <p class="text-[9px] font-medium text-gray-400 mt-1">Each</p>
                            </div>
                          </div>

                          <div v-if="item.customizations && item.customizations.length > 0" class="mt-3 pl-3 border-l-2 border-parentPrimary/20 space-y-1.5">
                            <p v-for="(c, cIdx) in getGroupedCustomizations(item.customizations)" :key="cIdx" class="text-xs font-medium text-gray-600 flex justify-between items-center group/cust">
                              <span class="truncate pr-2 flex items-center gap-1.5">
                                <div class="w-1 h-1 rounded-full bg-gray-300 group-hover/cust:bg-parentPrimary transition-colors"></div>
                                {{ c.quantity > 1 ? c.quantity + 'x ' : '' }}{{ c.name }}
                              </span>
                              <span v-if="c.price > 0" class="text-gray-900 font-bold bg-white px-1.5 rounded shadow-sm border border-gray-100 text-xs shrink-0">+₦{{ c.price.toLocaleString() }}</span>
                            </p>
                          </div>
                          
                          <div class="flex justify-between items-end mt-3 pt-3 border-t border-gray-100/50">
                            <div class="text-xs text-gray-400 font-medium flex items-center gap-1"><Info class="w-3 h-3"/> Subtotal</div>
                            <span class="text-sm font-black text-parentPrimary drop-shadow-sm">₦{{ (item.subtotal || (item.price * item.quantity)).toLocaleString() }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT: Order Summary Sidebar -->
          <div class="hidden lg:block w-[340px] shrink-0">
            <div class="sticky top-[65px] space-y-6">
              
              <!-- DESKTOP: Group Order Banner -->
              <div v-if="!groupOrder" class="relative overflow-hidden bg-gray-900 rounded-[1.5rem] p-5 flex items-center justify-between cursor-pointer hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1 transition-all group border border-gray-800" @click="router.push('/dashboard/group-orders')">
                <div class="absolute -right-4 -top-4 w-32 h-32 bg-parentPrimary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div class="flex-1 relative z-10">
                  <h4 class="text-sm font-black text-white mb-1 drop-shadow-sm flex items-center gap-2">Save on delivery? <span class="text-lg">💰</span></h4>
                  <p class="text-sm font-medium text-white leading-relaxed">Invite roommates to this order and split the fee!</p>
                </div>
                <div class="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md text-white flex items-center justify-center shrink-0 ml-4 group-hover:bg-parentPrimary transition-colors shadow-sm relative z-10">
                  <Users class="w-4 h-4" />
                </div>
              </div>
              
              <!-- Top Notice Banner -->
              <div v-if="computedComboPromoDiscount > 0" class="bg-emerald-50 border border-emerald-100 rounded-xl p-3 flex items-start gap-3">
                <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <span class="text-emerald-600 text-lg">✨</span>
                </div>
                <div>
                  <h4 class="text-sm font-bold text-emerald-800">Exam Combo Promo Applied!</h4>
                  <p class="text-xs text-emerald-600 mt-0.5">A ₦1,000 discount has been applied to your checkout for selecting a promo vendor combo.</p>
                </div>
              </div>

              <!-- Premium Order Summary -->
              <div class="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-black/5 overflow-hidden relative">

                <div class="px-6 py-5 border-b border-gray-100 relative z-10 flex items-center gap-3 bg-gray-50/50">
                  <div class="w-8 h-8 rounded-full bg-gray-200/50 flex items-center justify-center backdrop-blur-sm">
                    <Receipt class="w-4 h-4 text-gray-700" />
                  </div>
                  <h3 class="text-base font-bold text-gray-900 tracking-tight">Order Summary</h3>
                </div>
                
                <div class="p-6 space-y-4 relative z-10">
                  <div class="flex justify-between items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                    <span>Subtotal</span>
                    <span class="text-gray-900 font-bold">₦{{ (groupOrder ? groupSubtotal : cartStore.subtotal.value)?.toLocaleString() }}</span>
                  </div>
                  <div v-if="computedTotalDeliveryFee > 0" class="flex justify-between items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                    <span>Delivery</span>
                    <span :class="isBirthday ? 'line-through text-gray-400' : 'text-gray-900 font-bold'">₦{{ computedTotalDeliveryFee.toLocaleString() }}</span>
                  </div>
                  <div v-if="computedTotalPackagingFee > 0" class="flex justify-between items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                    <span>Packaging Fee</span>
                    <span class="text-gray-900 font-bold">₦{{ computedTotalPackagingFee.toLocaleString() }}</span>
                  </div>
                  <div class="flex justify-between items-center text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                    <span>Service Charge</span>
                    <span class="text-gray-900 font-bold">₦{{ (computedTotalServiceFee + computedPaystackFee).toLocaleString() }}</span>
                  </div>
                  
                  <!-- Discounts Area -->
                  <div class="pt-4 mt-4 border-t border-white/10 border-dashed space-y-3">
                    <div v-if="isBirthday" class="flex justify-between items-center text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-2 rounded-lg">
                      <span class="flex items-center gap-2"><span class="text-base">🎂</span> Birthday Treat</span>
                      <span class="font-black">-₦{{ computedBirthdayDiscount.toLocaleString() }}</span>
                    </div>
                    <div v-if="computedTokenDiscount > 0" class="flex justify-between items-center text-xs font-bold text-orange-400 bg-orange-500/10 px-3 py-2 rounded-lg">
                      <span class="flex items-center gap-2">🎟 Streak Free Delivery</span>
                      <span class="font-black">-₦{{ computedTokenDiscount.toLocaleString() }}</span>
                    </div>
                    <div v-if="computedComboPromoDiscount > 0" class="flex justify-between items-center text-xs font-bold text-teal-400 bg-teal-500/10 px-3 py-2 rounded-lg">
                      <span class="flex items-center gap-2">✨ Exam Combo Discount</span>
                      <span class="font-black">-₦{{ computedComboPromoDiscount.toLocaleString() }}</span>
                    </div>
                    <div v-if="computedBrethrenDiscount > 0" class="flex justify-between items-center text-xs font-bold text-parentPrimary bg-parentPrimary/10 px-3 py-2 rounded-lg">
                      <span class="flex items-center gap-2"><Users class="w-3.5 h-3.5" /> Brethren Split</span>
                      <span class="font-black">-₦{{ computedBrethrenDiscount.toLocaleString() }}</span>
                    </div>
                    <div v-if="computedPromoDiscount > 0" class="flex justify-between items-center text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-2 rounded-lg">
                      <span class="flex items-center gap-2"><Tag class="w-3.5 h-3.5" /> Promo ({{ promoCodeObj.code }})</span>
                      <span class="font-black">-₦{{ computedPromoDiscount.toLocaleString() }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="px-6 pb-6 pt-4 border-t border-gray-100 space-y-6 relative z-10 bg-gray-50/50">
                  <div v-if="isNightOwl" class="p-3 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-3">
                    <span class="text-lg">🦉</span>
                    <div>
                      <p class="text-xs font-bold text-indigo-700">Night Owl Active!</p>
                      <p class="text-xs font-medium text-indigo-600">Enjoy free delivery till 2 AM</p>
                    </div>
                  </div>

                  <div v-if="!promoCodeObj" class="flex gap-2 relative group/promo">
                    <div class="absolute inset-0 bg-gradient-to-r from-parentPrimary/20 to-purple-500/20 rounded-xl blur transition-opacity opacity-0 group-hover/promo:opacity-100"></div>
                    <input 
                      v-model="promoCodeInput"
                      @input="handlePromoInput"
                      type="text"
                      placeholder="Enter Promo Code"
                      class="relative flex-1 px-4 py-3.5 bg-white border border-gray-200 focus:border-parentPrimary/50 focus:ring-2 focus:ring-parentPrimary/20 rounded-xl text-sm font-bold text-gray-900 outline-none uppercase placeholder:text-gray-400 placeholder:normal-case transition-all shadow-sm"
                    />
                    <button 
                      @click="validatePromo"
                      :disabled="isValidatingPromo || !promoCodeInput"
                      class="relative px-5 py-3.5 bg-gray-900 text-white rounded-xl text-sm font-black hover:bg-gray-800 disabled:opacity-50 transition-all shadow-sm active:scale-95"
                    >
                      <Loader2 v-if="isValidatingPromo" class="w-4 h-4 animate-spin" />
                      <span v-else>Apply</span>
                    </button>
                  </div>
                  
                  <div v-if="debugPromoMsg" class="mt-2 p-2 bg-yellow-50 border border-yellow-200 text-yellow-800 text-[10px] rounded">
                    {{ debugPromoMsg }}
                  </div>

                  <!-- Promo Preview Area -->
                  <div v-if="isPreviewingPromo" class="flex justify-center mt-2">
                     <Loader2 class="w-4 h-4 text-parentPrimary animate-spin" />
                  </div>
                  <div v-else-if="promoPreview && !promoCodeObj" class="mt-3 p-4 rounded-xl border" :class="promoPreview.eligibility.isEligible ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-red-500/10 border-red-500/30'">
                    <div class="flex items-start gap-3">
                      <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" :class="promoPreview.eligibility.isEligible ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'">
                        <CheckCircle v-if="promoPreview.eligibility.isEligible" class="w-4 h-4" />
                        <XCircle v-else class="w-4 h-4" />
                      </div>
                      <div>
                        <p class="text-sm font-bold" :class="promoPreview.eligibility.isEligible ? 'text-emerald-400' : 'text-red-400'">
                          {{ promoPreview.eligibility.isEligible ? 'Promo Code Eligible!' : 'Promo Code Not Eligible' }}
                        </p>
                        <p class="text-xs mt-1 leading-relaxed" :class="promoPreview.eligibility.isEligible ? 'text-emerald-300/80' : 'text-red-300/80'">
                          <template v-if="promoPreview.eligibility.isEligible">
                            Use code <strong>{{ promoPreview.promo.code }}</strong> to get 
                            <strong>{{ promoPreview.promo.discountType === 'percentage' ? promoPreview.promo.value + '% off' : '₦' + promoPreview.promo.value?.toLocaleString() + ' off' }}</strong> your order{{ promoPreview.promo.minOrderAmount ? '. Minimum order of ₦' + promoPreview.promo.minOrderAmount?.toLocaleString() + ' required' : '' }}.
                            {{ promoPreview.promo.maxDiscount ? 'Maximum discount: ₦' + promoPreview.promo.maxDiscount?.toLocaleString() + '.' : '' }}
                          </template>
                          <template v-else>
                            {{ promoPreviewReason }}
                          </template>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div v-if="user && user.freeDeliveryTokens > 0 && !isBirthday" class="flex items-center justify-between p-3 bg-gradient-to-r from-orange-500/20 to-orange-600/10 border border-orange-500/30 rounded-xl cursor-pointer hover:bg-orange-500/30 transition-all backdrop-blur-md" @click="useFreeDeliveryToken = !useFreeDeliveryToken">
                    <div class="flex flex-col">
                      <span class="text-sm font-bold text-orange-400 flex items-center gap-1.5"><Ticket class="w-4 h-4"/> Use Free Delivery</span>
                      <span class="text-xs text-orange-300/80 font-medium mt-0.5">You have {{ user.freeDeliveryTokens }} left</span>
                    </div>
                    <div class="w-10 h-5 rounded-full transition-all relative border" :class="useFreeDeliveryToken ? 'bg-orange-500 border-orange-400' : 'bg-black/40 border-white/20'">
                      <div class="absolute top-[3px] w-3 h-3 rounded-full bg-white transition-all shadow-sm" :class="useFreeDeliveryToken ? 'left-[22px]' : 'left-1'"></div>
                    </div>
                  </div>
                  
                  <div class="flex justify-between items-end pt-2">
                    <div>
                      <p class="text-[9px] font-black text-gray-400 tracking-[0.2em] uppercase mb-1.5">Total Amount</p>
                      <h3 class="text-2xl font-black text-white tracking-tighter drop-shadow-lg">₦{{ finalTotal.toLocaleString() }}</h3>
                    </div>
                    <span class="text-[9px] font-bold text-gray-500 text-right leading-tight uppercase flex flex-col items-end gap-1">
                      <Lock class="w-3 h-3" />
                      Secure<br/>Gateway
                    </span>
                  </div>
                  <button 
                    v-if="canCheckout"
                    @click="checkoutStep === 'cart' ? checkoutStep = 'checkout' : startPayment()"
                    :disabled="placing || (checkoutStep === 'checkout' && paymentMethod === 'wallet' && balance < finalTotal)"
                    class="w-full py-4 bg-parentPrimary text-white rounded-2xl text-xs font-medium tracking-wider hover:bg-parentPrimary/90 transition-all disabled:opacity-40 flex items-center justify-center gap-2 shadow-sm border border-gray-100 shadow-parentPrimary/20 active:scale-[0.98]"
                  >
                    <Loader2 v-if="placing" class="w-4 h-4 animate-spin" />
                    <span>{{ placing ? 'Processing...' : (checkoutStep === 'cart' ? 'Proceed to Checkout' : 'Complete Checkout') }}</span>
                    <ArrowRight v-if="!placing" class="w-4 h-4" />
                  </button>
                  <div v-else class="w-full py-4 bg-gray-100 text-gray-500 rounded-2xl text-xs font-medium tracking-wider text-center">
                    {{ groupOrder?.status === 'open' ? 'Waiting for host to checkout' : (getMyStatus?.hasPaid ? 'You have paid' : 'Waiting for Sponsor to pay') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== MOBILE FLOATING CHECKOUT BAR ===== -->
      <div v-if="!cartStore.isEmpty.value" class="fixed bottom-[85px] left-4 right-4 z-40 lg:hidden">
        <div class="bg-gray-900 rounded-2xl px-5 py-4 text-white flex items-center justify-between shadow-sm border border-gray-100 shadow-black/30">
          <div>
            <p class="text-[9px] font-bold text-white/40 tracking-wider mb-0.5">Total</p>
            <h3 class="text-xl font-medium text-white tracking-tighter leading-none">₦{{ finalTotal.toLocaleString() }}</h3>
          </div>
          <button 
            v-if="canCheckout"
            @click="checkoutStep === 'cart' ? checkoutStep = 'checkout' : startPayment()"
            :disabled="placing || (checkoutStep === 'checkout' && paymentMethod === 'wallet' && balance < finalTotal)"
            class="px-4 py-3.5 bg-parentPrimary text-white rounded-xl text-xs font-medium tracking-wider hover:scale-105 active:scale-95 transition-all disabled:opacity-30 flex items-center gap-2 shadow-sm border border-gray-100 shadow-parentPrimary/30"
          >
            <div v-if="placing" class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            <span v-else>{{ checkoutStep === 'cart' ? 'Checkout' : 'Pay Now' }}</span>
            <ArrowRight v-if="!placing" class="w-3.5 h-3.5" />
          </button>
          <div v-else class="px-4 py-3.5 bg-gray-100 text-gray-500 rounded-xl text-xs font-medium tracking-wider text-center flex items-center justify-center">
            {{ groupOrder?.status === 'open' ? 'Waiting for Host' : (getMyStatus?.hasPaid ? 'Paid' : 'Waiting for Sponsor') }}
          </div>
        </div>
      </div>
    </div>

    <!-- ===== MOBILE DRAWER: Review Items ===== -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showOrderBreakdown" class="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm lg:hidden" @click="showOrderBreakdown = false"></div>
      </Transition>
      <Transition
        enter-active-class="transition-transform duration-300 ease-out"
        enter-from-class="translate-y-full"
        enter-to-class="translate-y-0"
        leave-active-class="transition-transform duration-200 ease-in"
        leave-from-class="translate-y-0"
        leave-to-class="translate-y-full"
      >
        <div v-if="showOrderBreakdown" class="fixed inset-x-0 bottom-0 z-[101] bg-white rounded-t-[2rem] max-h-[85vh] overflow-hidden flex flex-col lg:hidden shadow-sm border border-gray-100">
          <div class="sticky top-0 bg-white pt-3 pb-2 px-5 border-b border-gray-50 z-10 rounded-t-[2rem]">
            <div class="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-3"></div>
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-lg font-medium text-gray-900 tracking-tight">Review Items</h2>
                <p class="text-xs font-bold text-gray-400">Check your packs & quantities</p>
              </div>
              <button @click="showOrderBreakdown = false" class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div class="flex-1 overflow-y-auto px-5 py-4 space-y-6 pb-8 scrollbar-hide">
            <div v-for="vendorId in cartStore.allVendorIds.value" :key="'mb-' + vendorId" class="space-y-4">
              <div class="flex items-center gap-2.5">
                <div class="w-7 h-7 bg-parentPrimary/10 rounded-lg flex items-center justify-center">
                  <ShoppingBag class="w-3.5 h-3.5 text-parentPrimary" />
                </div>
                <h4 class="text-xs font-medium text-gray-900">{{ toTitleCase(vendorsMetadata[vendorId]?.storeName || '') }}</h4>
              </div>
              
              <div v-if="vendorsMetadata[vendorId]?.packs?.length > 0 && !cartStore.getVendorStats(vendorId).packs.flatMap(p => p.items).every(i => i.isPackagingFeeIncluded)" class="pl-3 border-l-2 border-gray-50 space-y-1">
                <label class="block text-xs font-bold text-gray-400">Packaging Type</label>
                <select v-model="selectedPacks[vendorId]" class="w-full bg-white text-xs p-2 rounded-lg border border-gray-200 focus:outline-none focus:border-parentPrimary text-gray-700 font-medium">
                  <option v-for="(packOption, idx) in vendorsMetadata[vendorId].packs" :key="idx" :value="packOption">
                    {{ packOption.name }} (₦{{ packOption.price }})
                  </option>
                </select>
              </div>
              <div v-for="(pack, pIndex) in cartStore.getVendorStats(vendorId).packs" :key="'mb-pack-' + pack.id" class="pl-3 border-l-2 border-gray-50 space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-[9px] font-medium bg-gray-900 text-white px-2.5 py-1 rounded-md">{{ pack.name || `Pack ${pIndex + 1}` }}</span>
                  <button @click="cartStore.removePack(vendorId, pack.id)" class="text-xs font-medium text-rose-400 hover:text-rose-500">Remove</button>
                </div>
                <div v-for="(item, iIndex) in pack.items" :key="'mb-item-'+iIndex" class="flex items-start gap-3">
                  <div class="w-11 h-11 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 shrink-0 mt-1">
                    <video v-if="item.image && item.image.match(/\.(mp4|webm|ogg|mov)/i)" :src="item.image" class="w-full h-full object-cover" autoplay loop muted playsinline></video>
                    <img v-else :src="item.image || '/placeholder-store.jpg'" @error="$event.target.src = '/placeholder-store.jpg'" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-start mb-1 gap-2">
                      <div class="flex-1 min-w-0">
                        <h5 class="text-xs font-medium text-gray-900 truncate">{{ toTitleCase(item.name) }}</h5>
                        <p v-if="item.customizations && item.customizations.length > 0" class="text-xs font-medium text-gray-400 mt-0.5">Base: ₦{{ item.price?.toLocaleString() }}</p>
                      </div>
                      <p class="text-xs font-bold text-gray-900 shrink-0">₦{{ ((item.subtotal || (item.price * item.quantity)) / item.quantity).toLocaleString() }}</p>
                    </div>
                    
                    <div v-if="item.customizations && item.customizations.length > 0" class="mt-1.5 mb-2 pl-2 border-l-2 border-gray-100 space-y-1">
                      <p v-for="(c, cIdx) in getGroupedCustomizations(item.customizations)" :key="cIdx" class="text-xs font-medium text-gray-500 flex justify-between">
                        <span class="truncate pr-2">{{ c.quantity > 1 ? c.quantity + 'x ' : '' }}{{ c.name }}</span>
                        <span v-if="c.price > 0" class="text-gray-400 shrink-0">+₦{{ c.price.toLocaleString() }}</span>
                      </p>
                    </div>

                    <div class="flex items-center justify-between mt-2">
                      <p class="text-xs font-bold text-parentPrimary">Total: ₦{{ (item.subtotal || (item.price * item.quantity)).toLocaleString() }}</p>
                      <div class="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border border-gray-100 shrink-0">
                        <button @click="cartStore.updateItemQuantity(vendorId, pack.id, iIndex, item.quantity - 1)" class="w-6 h-6 rounded-md bg-white text-gray-500 flex items-center justify-center text-sm font-bold shadow-sm hover:text-rose-500">−</button>
                        <span class="text-xs font-medium min-w-[16px] text-center">{{ item.quantity }}</span>
                        <button @click="cartStore.updateItemQuantity(vendorId, pack.id, iIndex, item.quantity + 1)" class="w-6 h-6 rounded-md bg-white text-gray-500 flex items-center justify-center text-sm font-bold shadow-sm hover:text-parentPrimary">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="px-5 py-4 border-t border-gray-100 bg-white">
            <button @click="showOrderBreakdown = false" class="w-full py-3.5 bg-gray-900 text-white rounded-2xl text-xs font-medium tracking-wider active:scale-[0.98] transition-transform">
              Done Reviewing
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Top-up Wallet Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showTopupModal" class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="showTopupModal = false">
          <div class="bg-white rounded-[2rem] w-full max-w-sm p-5 text-center animate-zoom-in">
            <div class="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-100">
              <Wallet class="w-7 h-7" />
            </div>
            <h2 class="text-xl font-medium text-gray-900 mb-2 tracking-tight">Fund Wallet</h2>
            <p class="text-xs font-medium text-gray-400 mb-6">Enter the amount to add. You'll be redirected to Paystack.</p>
            <div class="space-y-4">
              <div class="text-left">
                <p class="text-xs font-medium text-gray-400 tracking-wider mb-2 pl-1">Amount (NGN)</p>
                <input 
                  v-model="formattedTopupAmount" 
                  type="text"
                  placeholder="e.g. 5,000"
                  class="w-full px-5 py-4 bg-gray-50 border-2 border-transparent focus:border-emerald-500/20 rounded-xl text-xl font-bold text-gray-900 outline-none transition-all"
                />
              </div>
              <button 
                @click="startTopup" 
                :disabled="loadingPayment || topupAmount <= 0"
                class="w-full py-4 bg-gray-900 text-white rounded-xl text-xs font-medium hover:bg-emerald-500 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Loader2 v-if="loadingPayment" class="w-4 h-4 animate-spin" />
                <span>Fund Wallet Now</span>
              </button>
            </div>
            <button @click="showTopupModal = false" class="mt-5 text-xs font-medium text-gray-300 hover:text-gray-900 transition-colors">Maybe Later</button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Split Mode Modal -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showSplitModeModal" class="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="showSplitModeModal = false">
          <div class="bg-white rounded-[2rem] w-full max-w-md p-5 animate-zoom-in">
            <h2 class="text-xl font-medium text-gray-900 mb-2 tracking-tight text-center">How would you like to pay?</h2>
            <p class="text-xs font-medium text-gray-400 mb-6 text-center">Decide who is paying for the group order.</p>
            <div class="space-y-4">
              <label 
                class="flex items-center p-4 rounded-2xl border-2 transition-all cursor-pointer"
                :class="splitGroupType === 'split_bill' ? 'border-parentPrimary bg-parentPrimary/5' : 'border-gray-100 hover:border-gray-200'"
              >
                <input type="radio" v-model="splitGroupType" value="split_bill" class="hidden" />
                <div class="flex-1">
                  <h4 class="text-sm font-bold text-gray-900 mb-1">Split the Bill</h4>
                  <p class="text-xs text-gray-500 font-medium">Everyone pays for their own items. The order completes when all participants pay.</p>
                </div>
                <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ml-4" :class="splitGroupType === 'split_bill' ? 'border-parentPrimary' : 'border-gray-200'">
                  <div v-if="splitGroupType === 'split_bill'" class="w-3 h-3 bg-parentPrimary rounded-full"></div>
                </div>
              </label>

              <label 
                class="flex items-center p-4 rounded-2xl border-2 transition-all cursor-pointer"
                :class="splitGroupType === 'sponsor' ? 'border-parentPrimary bg-parentPrimary/5' : 'border-gray-100 hover:border-gray-200'"
              >
                <input type="radio" v-model="splitGroupType" value="sponsor" class="hidden" />
                <div class="flex-1">
                  <h4 class="text-sm font-bold text-gray-900 mb-1">I'm Sponsoring</h4>
                  <p class="text-xs text-gray-500 font-medium">You will pay the full amount for everyone in the group order.</p>
                </div>
                <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ml-4" :class="splitGroupType === 'sponsor' ? 'border-parentPrimary' : 'border-gray-200'">
                  <div v-if="splitGroupType === 'sponsor'" class="w-3 h-3 bg-parentPrimary rounded-full"></div>
                </div>
              </label>
            </div>
            
            <button 
              @click="submitSplitMode"
              :disabled="placing"
              class="w-full py-4 mt-6 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-parentPrimary transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Loader2 v-if="placing" class="w-4 h-4 animate-spin" />
              <span>Confirm & Lock Order</span>
            </button>
            <button @click="showSplitModeModal = false" class="w-full mt-4 text-xs font-medium text-gray-400 hover:text-gray-900 transition-colors text-center">Cancel</button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Placing Order Loader -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="placing" class="fixed inset-0 z-[200] bg-gray-900/95 backdrop-blur-xl flex flex-col items-center justify-center text-center p-4 text-white">
          <div class="w-20 h-20 mb-8 relative">
            <div class="absolute inset-0 border-4 border-white/10 rounded-full"></div>
            <div class="absolute inset-0 border-4 border-t-parentPrimary rounded-full animate-spin"></div>
          </div>
          <h2 class="text-2xl font-medium mb-2 tracking-tight">Finalizing order...</h2>
          <p class="text-white/40 font-bold text-xs">Redirecting to payment...</p>
        </div>
      </Transition>
    </Teleport>

    <!-- Auth Modal -->
    <CheckoutAuthModal
      v-model="showAuthModal"
      @authenticated="handleAuthenticated"
      @guest-checkout="handleGuestCheckout"
    />
  </div>
</template>

<script setup lang="ts">
import { ShoppingCart, Repeat, ArrowLeft, Moon, ArrowRight, Home, Building2, MapPin, Search, Plus, Calendar, Clock, Lock, CreditCard, ChevronDown, Check, FileText, Gift, Wallet, Loader2, RefreshCw, Trash2, Tag, Percent, Users, Package, Ticket, Store, Receipt, Box, Info, ShoppingBag } from 'lucide-vue-next';
import AnimatedInput from '@/components/ui/AnimatedInput.vue';
import SelectInput from '@/components/ui/SelectInput.vue';
import CheckoutAuthModal from '@/components/CheckoutAuthModal.vue';
import { useUser } from '@/composables/modules/auth/user';
import { useCart } from '@/composables/modules/cart';
import { useGroupOrder } from '@/composables/modules/group-order';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { useVendors } from '@/composables/modules/vendors';
import { usePayments } from '@/composables/modules/payments';
import { useStudentOrders } from '@/composables/modules/orders';
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from '#app';
import { useWallet } from '@/composables/modules/wallets';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { orders_api } from '@/api_factory/modules/orders';
import { settings_api } from '@/api_factory/modules/settings';
import { useChat } from '@/composables/modules/chat/useChat';
import { useDebounceFn } from '@vueuse/core';

definePageMeta({ layout: false });

const cartStore = useCart();
const { user } = useUser();
const { balance, fetchWallet } = useWallet();
const { initializePayment, verifyPayment, loading: loadingPayment, payWithWallet } = usePayments();

const paymentMethod = ref<'card' | 'wallet'>('card');
const { groupOrder, activeCode, fetchGroupOrder, isHost, isSponsor, getMyStatus, initiateCheckout, checkout: submitGroupCheckout, syncWithCart } = useGroupOrder();
const { showToast } = useCustomToast();
const { popularVendors, vendorsMetadata, fetchPopularVendors, fetchBulkMetadata, loading: loadingVendors } = useVendors();
const { createOrder } = useStudentOrders();
const { triggerOrderSuccessChat } = useChat();

watch(() => groupOrder.value?.status, (newStatus) => {
  if (newStatus === 'completed') {
    cartStore.allVendorIds.value.forEach(vId => cartStore.clearCart(vId));
    cartStore.clearCart();
    if (typeof window !== 'undefined') {
      localStorage.removeItem('errandr_active_group_code');
      localStorage.removeItem('errandr_checkout_data');
      localStorage.removeItem('errandr_pending_order_ids');
    }
    groupOrder.value = null;
    activeCode.value = null;
    navigateTo('/orders');
  }
});
const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();

const recipientName = ref('');
const recipientPhone = ref('');
const isWithinLuth = ref(true);
const proposedDeliveryFee = ref<number | null>(null);
const minOutsideCampusFee = ref(450);
const minCampusEnvironsFee = ref(350);
const outsideCampusLocation = ref('campus_environs');

const activeMinOutsideFee = computed(() => outsideCampusLocation.value === 'campus_environs' ? minCampusEnvironsFee.value : minOutsideCampusFee.value);
const specificAddress = ref('');
const deliveryCoordinates = ref<[number, number] | null>(null);

const handleAddressSelect = (data: { address: string, coordinates: [number, number] }) => {
  specificAddress.value = data.address;
  deliveryCoordinates.value = data.coordinates;
};

const guestEmail = ref('');
const guestName = ref('');

const handleGuestCheckout = (guestData: any) => {
  guestEmail.value = guestData.email;
  guestName.value = `${guestData.firstName} ${guestData.lastName}`.trim();
  if (!recipientName.value) recipientName.value = guestName.value;
  if (!recipientPhone.value) recipientPhone.value = guestData.phone;
  showAuthModal.value = false;
  startPayment();
};

const deliveryOption = ref('use_an_errander');
const checkoutStep = ref<'cart' | 'checkout'>('cart');
const placing = ref(false);
const showAuthModal = ref(false);
const showOrderBreakdown = ref(false);
const showTopupModal = ref(false);
const topupAmount = ref<number>(0);

const formattedTopupAmount = computed({
  get: () => {
    if (!topupAmount.value) return '';
    return topupAmount.value.toLocaleString('en-US');
  },
  set: (val: string) => {
    const raw = val.replace(/[^0-9]/g, '');
    const num = Number(raw);
    topupAmount.value = isNaN(num) ? 0 : num;
  }
});
const paymentError = ref('');

const promoCodeInput = ref('');
const promoCodeObj = ref<any>(null);
const promoDiscount = ref(0);
const isValidatingPromo = ref(false);

const promoPreview = ref<any>(null);
const isPreviewingPromo = ref(false);
const debugPromoMsg = ref('');

// Generate a human-readable reason for why a promo code is not eligible
const promoPreviewReason = computed(() => {
  if (!promoPreview.value?.eligibility) return 'This promo code cannot be applied to your order.';
  const elig = promoPreview.value.eligibility;
  if (!elig.isActive) return 'This promo code is currently inactive and cannot be used.';
  if (elig.isExpired) return 'This promo code has expired and is no longer valid.';
  if (!elig.minAmountMet) return `Your order subtotal doesn't meet the minimum of ₦${promoPreview.value.promo?.minOrderAmount?.toLocaleString() || 0} required for this promo.`;
  if (elig.usageLimitReached) return 'This promo code has reached its maximum usage limit.';
  if (!elig.vendorAllowed) return 'This promo code is not valid for the vendor you are ordering from.';
  if (!elig.userAllowed) return 'This promo code is restricted and not available for your account.';
  if (!elig.orderTypeAllowed) return 'This promo code does not apply to this type of order.';
  return 'This promo code cannot be applied to your order.';
});
let previewTimeout: any = null;

const handlePromoInput = () => {
  const newVal = promoCodeInput.value;
  if (!newVal || !newVal.trim()) {
    promoPreview.value = null;
    debugPromoMsg.value = '';
    return;
  }
  
  if (previewTimeout) clearTimeout(previewTimeout);
  
  previewTimeout = setTimeout(async () => {
    isPreviewingPromo.value = true;
    debugPromoMsg.value = `Checking ${newVal}...`;
    try {
      const firstVendorId = cartStore.allVendorIds.value[0] || '';
      const isGroupOrderQuery = (groupOrder.value && !!groupId.value) ? 'true' : 'false';
      const locType = isWithinLuth.value ? 'inside_campus' : 'outside_campus';
      const isCustomErrandQuery = 'false';
      
      const res = await api.get(`/promo-codes/preview?code=${encodeURIComponent(newVal.trim())}&subtotal=${currentSubtotal.value}&vendorId=${firstVendorId}&isGroupOrder=${isGroupOrderQuery}&locationType=${locType}&isCustomErrand=${isCustomErrandQuery}`);
      
      const previewData = res?.data;
      if (previewData && previewData.found && previewData.promo) {
        promoPreview.value = previewData;
        debugPromoMsg.value = ''; // Clear debug if success
      } else {
        promoPreview.value = null;
        debugPromoMsg.value = 'Promo code not found.';
      }
    } catch (e: any) {
      promoPreview.value = null;
      debugPromoMsg.value = 'Promo code not found or invalid.';
    } finally {
      isPreviewingPromo.value = false;
    }
  }, 500);
};

watch(promoCodeInput, () => {
  handlePromoInput();
});

const showSplitModeModal = ref(false);
const splitGroupType = ref('split_bill');
const selectedPacks = ref<Record<string, any>>({});
const isMysteryBox = ref(false);
const isDormDelivery = ref(false);
const scheduledDate = ref('');
const wantsNotification = ref(false);
const notifyEmail = ref('');
const useFreeDeliveryToken = ref(false);

const getGroupedCustomizations = (customizations: any[]) => {
  if (!customizations) return [];
  const grouped: Record<string, any> = {};
  customizations.forEach(c => {
    if (grouped[c.name]) {
      grouped[c.name].quantity += 1;
      grouped[c.name].price += c.price;
    } else {
      grouped[c.name] = { ...c, quantity: 1 };
    }
  });
  return Object.values(grouped);
};

const deliveryMode = ref('room_delivery');
const platformProcessingFee = ref(0);
const platformServiceFeePercentage = ref(5);
const platformConvenienceFee = ref(50);
const platformBaseFee = ref(350);
const platformRoomDeliveryFee = ref(350);
const platformDropoffServiceFee = ref(300);

const fetchPlatformSettings = async () => {
  try {
    const res = await orders_api.getCustomErrandSettings();
    if (res?.data) {
      platformProcessingFee.value = res.data.platformProcessingFee ?? 0;
      platformServiceFeePercentage.value = res.data.platformServiceFeePercentage ?? 5;
      platformConvenienceFee.value = res.data.convenienceFee ?? 50;
      platformBaseFee.value = res.data.baseFee ?? 350;
      platformRoomDeliveryFee.value = res.data.roomDeliveryFee ?? 350;
      platformDropoffServiceFee.value = res.data.dropoffServiceFee ?? 300;
    }
    
    try {
      const brethrenRes = await settings_api.getExamBrethrenSettings();
      if (brethrenRes?.data) {
        examBrethrenActive.value = brethrenRes.data.isActive ?? false;
      }
    } catch (e) {
      console.warn('Failed to fetch exam brethren settings (might not be deployed yet)', e);
      examBrethrenActive.value = false;
    }
  } catch (error) {
    console.error('Failed to fetch platform settings:', error);
  }
};

const isPreOrderCart = computed(() => {
  return cartStore.allVendorIds.value.some(id => {
    const meta = vendorsMetadata.value[id];
    return meta?.preOrderOnly || (meta && meta.isOpen === false);
  });
});

const hasFoodVendor = computed(() => {
  return cartStore.allVendorIds.value.some(id => {
    const cat = vendorsMetadata.value[id]?.category?.toLowerCase() || '';
    const foodCats = ['restaurant', 'eatery', 'snacks', 'drinks', 'bakery', 'chinese', 'indian', 'pizza', 'sushi', 'food'];
    return foodCats.includes(cat);
  });
});

const maxLeadTime = computed(() => {
  let max = 0;
  cartStore.allVendorIds.value.forEach(id => {
    const time = vendorsMetadata.value[id]?.preOrderLeadTime || 0;
    if (time > max) max = time;
  });
  return max;
});

const minPreOrderDate = computed(() => {
  const date = new Date();
  date.setHours(date.getHours() + maxLeadTime.value);
  return date.toISOString().split('T')[0];
});

const allowedDays = computed(() => {
  let days: string[] | null = null;
  cartStore.allVendorIds.value.forEach(id => {
    const vDays = vendorsMetadata.value[id]?.preOrderDays || [];
    if (vDays.length > 0) {
      if (days === null) days = [...vDays];
      else days = days.filter(d => vDays.includes(d));
    }
  });
  return days;
});

const toTitleCase = (str: string) => {
  if (!str) return '';
  return str.split(' ').map(w => w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : '').join(' ');
};

const currentSubtotal = computed(() => {
  if (groupOrder.value && groupOrder.value.status === 'locked' && groupOrder.value.splitType === 'split_bill') {
    const base = getMyStatus.value?.items.reduce((s: number, i: any) => s + (i.price * i.quantity), 0) || 0;
    return isMysteryBox.value ? base + 800 : base;
  }
  const base = groupOrder.value ? groupSubtotal.value : cartStore.subtotal.value;
  return isMysteryBox.value ? base + 800 : base;
});

const isBirthday = computed(() => {
  if (!user.value || !user.value.dateOfBirth) return false;
  const today = new Date();
  const dob = new Date(user.value.dateOfBirth);
  return today.getMonth() === dob.getMonth() && today.getDate() === dob.getDate();
});

const canCheckout = computed(() => {
  if (!groupOrder.value) return true;
  if (groupOrder.value.status === 'open') return isHost.value;
  if (groupOrder.value.status === 'locked') {
    if (groupOrder.value.splitType === 'sponsor') return isSponsor.value;
    if (groupOrder.value.splitType === 'split_bill') {
      const myStatus = getMyStatus.value;
      if (!myStatus) return false;
      return !myStatus.hasPaid;
    }
  }
  return false;
});

const dynamicDeliveryFees = ref<Record<string, number>>({});
const isFetchingFees = ref(false);

const fetchDeliveryFees = useDebounceFn(async () => {
  // (legacy pickup check removed)
  const address = isDormDelivery.value ? (specificAddress.value || user.value?.deliveryAddress) : user.value?.deliveryAddress;
  
  if (!address) return; // Wait until address is known

  isFetchingFees.value = true;
  try {
    for (const vId of cartStore.allVendorIds.value) {
      const { data } = await api.get('/orders/calculate-fee', {
        params: {
          vendorId: vId,
          deliveryAddress: address,
          deliveryLocation: deliveryCoordinates.value ? JSON.stringify({ type: 'Point', coordinates: deliveryCoordinates.value }) : undefined,
          customerId: user.value?._id
        }
      });
      if (data && data.success) {
        dynamicDeliveryFees.value[vId] = data.deliveryFee;
      }
    }
  } catch(e) {
    console.error('Failed to calculate dynamic delivery fee', e);
  } finally {
    isFetchingFees.value = false;
  }
}, 800);

watch(
  [() => cartStore.allVendorIds.value, specificAddress, isDormDelivery, deliveryOption], 
  () => { fetchDeliveryFees(); }, 
  { deep: true }
);

onMounted(() => {
  fetchDeliveryFees();
  fetchPlatformSettings();
});

const validatePromo = async () => {
  if (!promoCodeInput.value.trim()) return;
  isValidatingPromo.value = true;
  promoPreview.value = null;
  promoCodeObj.value = null;
  try {
    const firstVendorId = cartStore.allVendorIds.value[0] || '';
    const isGroupOrderQuery = (groupOrder.value && !!groupId.value) ? 'true' : 'false';
    const locType = isWithinLuth.value ? 'inside_campus' : 'outside_campus';
    const isCustomErrandQuery = 'false';

    // Step 1: Call preview endpoint first to get eligibility details
    isPreviewingPromo.value = true;
    const previewRes = await api.get(`/promo-codes/preview?code=${encodeURIComponent(promoCodeInput.value.trim())}&subtotal=${currentSubtotal.value}&vendorId=${firstVendorId}&isGroupOrder=${isGroupOrderQuery}&locationType=${locType}&isCustomErrand=${isCustomErrandQuery}`) as any;
    isPreviewingPromo.value = false; console.log("PROMO DEBUG FINISHED", promoPreview.value);

    if (previewRes?.data) {
      promoPreview.value = previewRes.data;

      // Step 2: If eligible, auto-apply via validate endpoint
      if (previewRes.data.eligibility?.isEligible) {
        const res = await api.get(`/promo-codes/validate?code=${encodeURIComponent(promoCodeInput.value.trim())}&subtotal=${currentSubtotal.value}&vendorId=${firstVendorId}&isGroupOrder=${isGroupOrderQuery}&locationType=${locType}&isCustomErrand=${isCustomErrandQuery}`) as any;
        
        if (res?.data && !res?.data?.error) {
          promoCodeObj.value = res.data;
          showToast({ title: 'Promo Applied!', message: `${res.data.code} applied successfully.`, toastType: 'success' });
        }
      } else {
        // Show why it's not eligible
        const reasons: string[] = [];
        const elig = previewRes.data.eligibility;
        if (!elig.isActive) reasons.push('This promo code is not active');
        if (elig.isExpired) reasons.push('This promo code has expired');
        if (!elig.minAmountMet) reasons.push(`Minimum order of ₦${previewRes.data.promo?.minOrderAmount || 0} not met`);
        if (elig.usageLimitReached) reasons.push('Usage limit has been reached');
        if (!elig.vendorAllowed) reasons.push('Not valid for this vendor');
        if (!elig.userAllowed) reasons.push('Not valid for your account');
        if (!elig.orderTypeAllowed) reasons.push('Not valid for this order type');
        showToast({ title: 'Code Not Eligible', message: reasons[0] || 'This promo code cannot be applied.', toastType: 'error' });
      }
    }
  } catch (e: any) {
    isPreviewingPromo.value = false; console.log("PROMO DEBUG FINISHED", promoPreview.value);
    showToast({ title: 'Invalid Code', message: e.response?.data?.message || 'Code is invalid or expired', toastType: 'error' });
    promoCodeObj.value = null;
    promoPreview.value = null;
  } finally {
    isValidatingPromo.value = false;
  }
};

const examBrethrenActive = ref(false);

const isNightOwl = computed(() => false);

const computedTotalDeliveryFee = computed(() => {
  if (!isWithinLuth.value) return proposedDeliveryFee.value || 0;
  if (isNightOwl.value) return 0;
  const currentUser = user.value as any;
  if (currentUser?.campusPrimeActive && currentUser?.campusPrimeExpiry && new Date(currentUser.campusPrimeExpiry) > new Date()) return 0;
  if (deliveryOption.value === 'batch_run') return 150;
  
  const perVendorFee = deliveryMode.value === 'dropoff_service' ? platformDropoffServiceFee.value : platformRoomDeliveryFee.value;
  let total = 0;
  
  cartStore.allVendorIds.value.forEach(vId => {
    total += perVendorFee;
  });
  
  if (groupOrder.value && groupOrder.value.status === 'locked' && groupOrder.value.splitType === 'split_bill') {
     const activeParticipants = groupOrder.value.participants.filter((p: any) => p.items.length > 0).length || 1;
     total = total / activeParticipants;
  }
  
  const addrLower = (specificAddress.value || '').toLowerCase();
  if (
    addrLower.includes('college of medicine') || 
    addrLower.includes('luth') || 
    addrLower.includes('idi araba') || 
    addrLower.includes('idi-araba') ||
    addrLower.includes('cmul') ||
    addrLower.includes('unilag')
  ) {
    total = perVendorFee;
  }

  return isDormDelivery.value ? Math.round(total * 0.5) : Math.round(total);
});

const getVendorPackagingFee = (vId: string, stats: any, vendorMeta: any) => {

  const cartItems = stats.packs.flatMap((p: any) => p.items) || [];
  const nonMoteeItems = cartItems.filter((i: any) => !i.name.toLowerCase().includes('motee chip'));
  if (nonMoteeItems.length === 0) {
    return 0; // Pack does not apply if they only order Motee Chips
  }

  const fallbackPack = selectedPacks.value[vId];
  const fallbackPrice = fallbackPack ? fallbackPack.price : (vendorMeta?.packagingFee ?? 0);
  
  let total = 0;
  if (stats.packs.length > 0) {
    stats.packs.forEach((pack: any) => {
      const hasFeeIncluded = pack.items.some((i: any) => i.isPackagingFeeIncluded === true);
      if (!hasFeeIncluded) {
        total += pack.packType?.price ?? fallbackPrice;
      }
    });
  } else {
    const hasFeeIncluded = cartItems.some((i: any) => i.isPackagingFeeIncluded === true);
    if (!hasFeeIncluded) {
      total += fallbackPrice;
    }
  }
  return total;
};

const computedTotalPackagingFee = computed(() => {
  let total = 0;
  cartStore.allVendorIds.value.forEach(vId => {
    const stats = cartStore.getVendorStats(vId);
    const vendorMeta = vendorsMetadata.value[vId];
    total += getVendorPackagingFee(vId, stats, vendorMeta);
  });
  if (groupOrder.value && groupOrder.value.status === 'locked' && groupOrder.value.splitType === 'split_bill') {
     const activeParticipants = groupOrder.value.participants.filter((p: any) => p.items.length > 0).length || 1;
     total = total / activeParticipants;
  }
  return Math.round(total);
});

const computedTotalServiceFee = computed(() => cartStore.allVendorIds.value.length === 0 ? 0 : platformConvenienceFee.value);

const computedBirthdayDiscount = computed(() => {
  if (!isBirthday.value) return 0;
  // 100% free delivery + 10% off subtotal
  return computedTotalDeliveryFee.value + Math.round(currentSubtotal.value * 0.10);
});

const computedComboPromoDiscount = computed(() => {
  let discount = 0;
  const isGroupOrderCart = !!groupOrder.value;
  const vendorIds = isGroupOrderCart ? [groupOrder.value.vendor?._id] : cartStore.allVendorIds.value;

  for (const vId of vendorIds) {
    if (!vId) continue;
    const vendor = vendorsMetadata.value[vId];
    const vendorName = vendor?.storeName?.toLowerCase() || '';
    const stats = cartStore.getVendorStats(vId) as any;
    const subtotal = isGroupOrderCart ? groupSubtotal.value : (stats?.subtotal || 0);

    // Check if promo is explicitly disabled for this vendor
    if (vendor?.prepaidPromo && vendor.prepaidPromo.enabled === false) {
      continue;
    }

    // Check new prepaidPromo logic first
    if (vendor?.prepaidPromo?.enabled) {
      if (vendor.prepaidPromo.usedOrders < vendor.prepaidPromo.maxOrders) {
        if (subtotal >= vendor.prepaidPromo.budgetPerOrder) {
          let vendorDiscount = (vendor.prepaidPromo && vendor.prepaidPromo.discountValue) ? vendor.prepaidPromo.discountValue : 1000;
          // Ensure discount doesn't exceed subtotal to prevent negative totals
          if (vendorDiscount > subtotal) {
            vendorDiscount = subtotal;
          }
          discount += vendorDiscount;
          continue;
        }
      }
    }

    // Fallback old logic (only applies if prepaidPromo is NOT explicitly disabled)
    if (vendorName.includes('iyabo') || vendorName.includes('hvip') || vendorName.includes('waris') || vendorName.includes('chijioke')) {
      if (vendorName.includes('waris')) {
        // Waris Kitchen new rule: ₦1000 off for orders >= ₦2000
        if (subtotal >= 2000) {
          // Verify it hasn't exceeded limits (if tracked manually here, but we rely on backend mainly)
          const used = vendor?.prepaidPromo?.usedOrders || 0;
          const max = vendor?.prepaidPromo?.maxOrders || 20;
          if (used < max) {
            discount += (vendor.prepaidPromo && vendor.prepaidPromo.discountValue) ? vendor.prepaidPromo.discountValue : 1000;
          }
        }
      } else {
        if (stats && stats.packs && stats.packs.length > 0) {
          const hasComboItem = stats.packs.some((p: any) => p.items && p.items.some((i: any) => i.isPrepaidByPlatform));
          if (hasComboItem) discount += (vendor.prepaidPromo && vendor.prepaidPromo.discountValue) ? vendor.prepaidPromo.discountValue : 1000;
        }
      }
    }
  }
  
  return discount;
});

const computedBrethrenDiscount = computed(() => {
  if (groupOrder.value && examBrethrenActive.value) {
    return Math.round(currentSubtotal.value * 0.10);
  }
  return 0;
});

const computedPromoDiscount = computed(() => {
  if (!promoCodeObj.value) return 0;
  
  const discountTarget = promoCodeObj.value.appliesToDeliveryFeeOnly ? computedTotalDeliveryFee.value : currentSubtotal.value;
  let pDiscount = 0;

  if (promoCodeObj.value.discountType === 'percentage') {
    pDiscount = Math.round(discountTarget * (promoCodeObj.value.value / 100));
    if (promoCodeObj.value.maxDiscountAmount && pDiscount > promoCodeObj.value.maxDiscountAmount) {
      pDiscount = promoCodeObj.value.maxDiscountAmount;
    }
  } else {
    pDiscount = promoCodeObj.value.value;
  }

  // Cap at the target it applies to
  if (pDiscount > discountTarget) {
    pDiscount = discountTarget;
  }

  return pDiscount;
});

const computedTokenDiscount = computed(() => {
  if (useFreeDeliveryToken.value && user.value && user.value.freeDeliveryTokens > 0 && !isBirthday.value) {
    return computedTotalDeliveryFee.value;
  }
  return 0;
});

const groupSubtotal = computed(() => {
  if (!groupOrder.value) return 0;
  return groupOrder.value.participants.reduce((acc: number, p: any) =>
    acc + p.items.reduce((sum: number, i: any) => sum + (i.price * i.quantity), 0), 0);
});

const subtotalBeforeFee = computed(() =>
  currentSubtotal.value + computedTotalDeliveryFee.value + computedTotalPackagingFee.value + computedTotalServiceFee.value - computedBirthdayDiscount.value - computedTokenDiscount.value - computedPromoDiscount.value - computedBrethrenDiscount.value - computedComboPromoDiscount.value
);

const computedPaystackFee = computed(() => {
  return platformProcessingFee.value;
});

const finalTotal = computed(() => subtotalBeforeFee.value + computedPaystackFee.value);

const goBack = () => {
  const router = useRouter();
  if (typeof window !== 'undefined' && window.history.length > 1) {
    router.back();
  } else {
    const lastVendorId = cartStore.allVendorIds.value[cartStore.allVendorIds.value.length - 1];
    navigateTo(lastVendorId ? `/vendors/${lastVendorId}` : '/');
  }
};

const handleAuthenticated = async () => {
  if (user.value) {
    recipientName.value = recipientName.value || `${user.value.firstName} ${user.value.lastName}`;
    recipientPhone.value = recipientPhone.value || user.value.phone || '';
  }
  showAuthModal.value = false;
  await startPayment();
};

onMounted(async () => {
  cartStore.initCart();
  if (cartStore.isEmpty.value) fetchPopularVendors();
  
  try {
    const res = await orders_api.getCustomErrandSettings();
    if (res?.data?.minCampusEnvironsFee) {
      minCampusEnvironsFee.value = res.data.minCampusEnvironsFee;
    }
    if (res?.data?.minOutsideCampusFee) {
      minOutsideCampusFee.value = res.data.minOutsideCampusFee;
    }
  } catch (e) {
    console.error('Failed to fetch custom errand settings:', e);
  }
  
  watch(() => user.value, (u) => {
    if (u) fetchWallet();
  }, { immediate: true });

  // Aggressively fetch wallet balance when the user returns to the tab
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible' && user.value) {
      fetchWallet();
    }
  };
  document.addEventListener('visibilitychange', handleVisibilityChange);
  onUnmounted(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  });

  if (route.query.group) {
    try { await fetchGroupOrder(route.query.group as string); } catch (e) { console.error(e); }
  }

  // Handle return from payment (Standard Redirect Flow verification)
  if (route.query.reference) {
    placing.value = true;
    try {
      const res = await verifyPayment(route.query.reference as string);
      const data = res?.data || res;
      if (data?.metadata?.type === 'wallet_topup' || data?.data?.metadata?.type === 'wallet_topup') {
        showToast({ title: 'Wallet funded!', message: 'Your balance has been updated.', toastType: 'success' });
        await fetchWallet();
        paymentMethod.value = 'wallet';
        placing.value = false;
        const url = new URL(window.location.href);
        url.searchParams.delete('reference');
        window.history.replaceState({}, '', url.toString());
        return;
      }

      if (data?.status === 'success' || (data as any)?.status === 'success') {
        if (data?.metadata?.isGroupCheckout || data?.data?.metadata?.isGroupCheckout) {
           await submitGroupCheckout(route.query.reference as string);
           showToast({ title: 'Payment Successful', message: 'Group Order updated!', toastType: 'success' });
           // Clear cart aggressively after successful group checkout payment
           cartStore.allVendorIds.value.forEach(vId => cartStore.clearCart(vId));
           cartStore.clearCart();
           localStorage.removeItem('errandr_checkout_data');
           localStorage.removeItem('errandr_pending_order_ids');
           placing.value = false;
           const url = new URL(window.location.href);
           url.searchParams.delete('reference');
           window.history.replaceState({}, '', url.toString());
           return;
        }

        // Try multiple sources for orderIds: metadata from Paystack, or our localStorage fallback
        let orderIds = data?.metadata?.orderIds || data?.data?.metadata?.orderIds || [];
        if ((!orderIds || orderIds.length === 0) && typeof window !== 'undefined') {
          try {
            const fallback = localStorage.getItem('errandr_pending_order_ids');
            if (fallback) orderIds = JSON.parse(fallback);
          } catch (_) {}
        }

        // AGGRESSIVELY clear cart — both per-vendor and full reset
        cartStore.allVendorIds.value.forEach(vId => cartStore.clearCart(vId));
        cartStore.clearCart();
        localStorage.removeItem('errandr_checkout_data');
        localStorage.removeItem('errandr_pending_order_ids');

        // Always navigate away from cart after successful payment
        triggerOrderSuccessChat();
        if (orderIds && orderIds.length > 0) {
          navigateTo(`/orders/${orderIds[0]}`);
        } else {
          navigateTo('/orders');
        }
      } else {
        paymentError.value = 'Payment failed. Please try again.';
        placing.value = false;
      }
    } catch (e) {
      paymentError.value = 'Could not verify payment.';
      placing.value = false;
    }
  }

  await fetchBulkMetadata(cartStore.allVendorIds.value);

  // Initialize selected packs
  cartStore.allVendorIds.value.forEach(vId => {
    const vendor = vendorsMetadata.value[vId];
    if (vendor?.packs?.length > 0 && !selectedPacks.value[vId]) {
      const activePack = vendor.packs.find((p: any) => p.isActive) || vendor.packs[0];
      selectedPacks.value[vId] = activePack;
    }
  });

  const cachedData = localStorage.getItem('errandr_checkout_data');
  if (cachedData) {
    const data = JSON.parse(cachedData);
    recipientName.value = data.name || '';
    recipientPhone.value = data.phone || '';
    specificAddress.value = data.address || '';
    deliveryOption.value = 'use_an_errander'; // pickup no longer supported
    deliveryMode.value = data.deliveryMode || 'room_delivery';
    isMysteryBox.value = data.mystery || false;
    isDormDelivery.value = data.dorm || false;
    paymentMethod.value = data.paymentMethod || 'card';
    scheduledDate.value = data.scheduledDate || '';
  } else if (user.value) {
    recipientName.value = `${user.value.firstName || ''} ${user.value.lastName || ''}`.trim();
    recipientPhone.value = user.value.phone || '';
  }
});

watch([recipientName, recipientPhone, specificAddress, deliveryOption, deliveryMode, isMysteryBox, isDormDelivery, paymentMethod, scheduledDate], ([name, phone, address, delivery, dMode, mystery, dorm, method, date]) => {
  localStorage.setItem('errandr_checkout_data', JSON.stringify({ name, phone, address, delivery, deliveryMode: dMode, mystery, dorm, paymentMethod: method, scheduledDate: date }));
});

watch([isWithinLuth, outsideCampusLocation], ([inside, loc]) => {
  if (!inside) {
    proposedDeliveryFee.value = activeMinOutsideFee.value;
  }
});

let syncTimeout: any;
watch(
  () => cartStore.carts.value,
  () => {
    if (groupOrder.value && groupOrder.value.status === 'open') {
      const vendorId = groupOrder.value.vendor?._id || groupOrder.value.vendor;
      if (vendorId) {
        clearTimeout(syncTimeout);
        syncTimeout = setTimeout(() => {
          syncWithCart(vendorId);
        }, 800);
      }
    }
  },
  { deep: true }
);

const submitSplitMode = async () => {
  showSplitModeModal.value = false;
  try {
    placing.value = true;
    await initiateCheckout(splitGroupType.value);
    showToast({ title: 'Order Locked!', message: 'Group order is now ready for payment.', toastType: 'success' });
    // If sponsor, they can just pay now. Otherwise everyone gets notified.
  } catch (e: any) {
    showToast({ title: 'Error', message: e.message || 'Failed to lock group order', toastType: 'error' });
  } finally {
    placing.value = false;
  }
};

const startPayment = async () => {
  if (placing.value) return;
  paymentError.value = '';

  if (isPreOrderCart.value) {
    if (!scheduledDate.value) {
      return showToast({ title: 'Schedule Required', message: 'Please select a delivery date for your pre-order.', toastType: 'error' });
    }
    if (allowedDays.value && allowedDays.value.length > 0) {
      const dayOfWeek = new Date(scheduledDate.value).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      if (!allowedDays.value.includes(dayOfWeek)) {
        return showToast({ title: 'Invalid Schedule', message: `Delivery is only available on: ${allowedDays.value.join(', ')}`, toastType: 'error' });
      }
    }
  }

  if (groupOrder.value) {
     if (groupOrder.value.status === 'open') {
        if (!isHost.value) return showToast({ title: 'Error', message: 'Only the host can checkout.', toastType: 'error' });
        showSplitModeModal.value = true;
        return;
     }
     if (groupOrder.value.status === 'locked') {
        if (groupOrder.value.splitType === 'sponsor' && !isSponsor.value) {
           return showToast({ title: 'Wait', message: 'The sponsor is paying for this order.', toastType: 'info' });
        }
        if (groupOrder.value.splitType === 'split_bill' && getMyStatus.value?.hasPaid) {
           return showToast({ title: 'Already Paid', message: 'You have already paid your share.', toastType: 'info' });
        }
     }
  }

  // AT THIS POINT, THE USER IS ABOUT TO ACTUALLY PAY
  // Require delivery details and authentication
  if (!recipientName.value?.trim() || !recipientPhone.value?.trim()) return showToast({ title: 'Missing Info', message: 'Name and phone required', toastType: 'error' });
  if (!specificAddress.value?.trim()) return showToast({ title: 'Missing Info', message: 'Delivery address required', toastType: 'error' });
  if (!user.value && !guestEmail.value) return (showAuthModal.value = true);

  if (!isWithinLuth.value) {
    if (!proposedDeliveryFee.value || proposedDeliveryFee.value < activeMinOutsideFee.value) {
      return showToast({ title: 'Invalid Fee', message: `Proposed delivery fee must be at least ₦${activeMinOutsideFee.value}`, toastType: 'error' });
    }
  }

  if (!isWithinLuth.value && !groupOrder.value) {
    placing.value = true;
    try {
      const orderIds = await preCreateOrders();
      if (!orderIds || orderIds.length === 0) throw new Error('Failed to create order');
      cartStore.allVendorIds.value.forEach(vId => cartStore.clearCart(vId));
      cartStore.clearCart();
      localStorage.removeItem('errandr_checkout_data');
      localStorage.removeItem('errandr_pending_order_ids');
      navigateTo(`/negotiation?orderIds=${orderIds.join(',')}`);
    } catch (e: any) {
      showToast({ title: 'Error', message: e.message || 'Failed to submit order', toastType: 'error' });
    } finally {
      placing.value = false;
    }
    return;
  }

  if (paymentMethod.value === 'wallet') {
    placing.value = true;
    try {
      await fetchWallet();
    } finally {
      placing.value = false;
    }
    if (balance.value < finalTotal.value) {
      showTopupModal.value = true;
      topupAmount.value = Math.ceil(finalTotal.value - balance.value);
      return;
    }
  }



  placing.value = true;
  try {
    let orderIds: string[] = [];
    if (!groupOrder.value) {
       orderIds = await preCreateOrders();
       if (!orderIds || orderIds.length === 0) throw new Error('Failed to create order');
       // Persist orderIds as fallback in case Paystack metadata doesn't round-trip
       if (typeof window !== 'undefined') {
         localStorage.setItem('errandr_pending_order_ids', JSON.stringify(orderIds));
       }
    }

    if (paymentMethod.value === 'wallet') {
      if (groupOrder.value) {
         await submitGroupCheckout('WALLET_PAYMENT');
         showToast({ title: 'Success', message: 'Group Order payment successful!', toastType: 'success' });
         // Clear cart aggressively after successful group wallet payment
         cartStore.allVendorIds.value.forEach(vId => cartStore.clearCart(vId));
         cartStore.clearCart();
         localStorage.removeItem('errandr_checkout_data');
         localStorage.removeItem('errandr_pending_order_ids');
      } else {
         for (const orderId of orderIds) await payWithWallet(orderId);
         showToast({ title: 'Success', message: 'Order placed using wallet!', toastType: 'success' });
         // Clear cart aggressively — both per-vendor and full reset
         cartStore.allVendorIds.value.forEach(vId => cartStore.clearCart(vId));
         cartStore.clearCart();
         localStorage.removeItem('errandr_checkout_data');
         localStorage.removeItem('errandr_pending_order_ids');
         triggerOrderSuccessChat();
         navigateTo(`/orders/${orderIds[0]}`);
      }
    } else {
      const amount = Math.round(finalTotal.value);
      const metadata = groupOrder.value 
         ? { isGroupCheckout: true, activeCode: activeCode.value, deliveryOption: deliveryOption.value, recipientName: recipientName.value, recipientPhone: recipientPhone.value, specificAddress: specificAddress.value }
         : { orderIds, vendorIds: cartStore.allVendorIds.value, deliveryOption: deliveryOption.value, recipientName: recipientName.value, recipientPhone: recipientPhone.value, specificAddress: specificAddress.value, isMysteryBox: isMysteryBox.value, isDormDelivery: isDormDelivery.value, isPreOrder: isPreOrderCart.value, scheduledDate: scheduledDate.value };
         
      const data = await initializePayment({
        amount,
        customer: { name: recipientName.value || guestName.value, email: user.value?.email || guestEmail.value || 'guest@errandr.com' },
        callback_url: `${window.location.origin}/cart${route.query.group ? '?group=' + route.query.group : ''}`,
        metadata,
      });
      const authUrl = data?.data?.authorization_url || data?.authorization_url;
      if (authUrl) window.location.href = authUrl;
      else {
        placing.value = false;
        paymentError.value = 'Initialization failed.';
        showToast({ title: 'Error', message: 'Payment gateway unavailable', toastType: 'error' });
      }
    }
  } catch (e: any) { 
    placing.value = false; 
    paymentError.value = 'Checkout failed.'; 
    showToast({ title: 'Error', message: e.message || 'Payment initiation failed', toastType: 'error' });
  }
};

const startTopup = async () => {
  console.log('Initiating topup to dashboard...', topupAmount.value);
  if (!topupAmount.value || Number(topupAmount.value) <= 10) {
    showToast({ title: 'Invalid Amount', message: 'Please enter a valid amount', toastType: 'error' });
    return;
  }
  try {
    const target = `/dashboard/wallet?topup=${topupAmount.value}&redirect=/cart`;
    await router.push(target);
    setTimeout(() => {
       if (window.location.pathname !== '/dashboard/wallet') window.location.href = target;
    }, 500);
  } catch (e) {
    console.error('Redirection failed:', e);
    window.location.href = `/dashboard/wallet?topup=${topupAmount.value}&redirect=/cart`;
  }
};

const preCreateOrders = async (): Promise<string[]> => {
  const createdIds: string[] = [];
  let isFirstOrder = true;
  if (groupOrder.value) {
    const vendorId = groupOrder.value.vendor._id;
    for (const participant of groupOrder.value.participants) {
      if (!participant.items.length) continue;
      const vendorMeta = vendorsMetadata.value[vendorId];
      const subtotal = participant.items.reduce((s: number, i: any) => s + (i.price * i.quantity), 0);
      const deliveryFee = vendorMeta?.deliveryFee ?? 150;
      const sFee = isFirstOrder ? platformConvenienceFee.value : 0;
      const pFee = isFirstOrder ? platformProcessingFee.value : 0;
      const actualPackFee = getVendorPackagingFee(vendorId, { packs: [] }, vendorMeta);
      const res = await createOrder({
        vendorId, customer: participant.user._id, items: participant.items.map((i: any) => ({ product: i.productId, name: i.name, price: i.price, image: i.image, quantity: i.quantity, subtotal: i.price * i.quantity, customizations: i.customizations || [] })),
        subtotal, deliveryFee, serviceFee: sFee, platformProcessingFee: pFee, packagingFee: actualPackFee, total: subtotal + sFee + actualPackFee + deliveryFee + pFee,
        deliveryOption: deliveryOption.value, deliveryMode: deliveryMode.value, recipientName: recipientName.value, recipientPhone: recipientPhone.value, specificAddress: specificAddress.value, deliveryAddress: specificAddress.value, deliveryLocation: deliveryCoordinates.value ? { type: 'Point', coordinates: deliveryCoordinates.value } : undefined, isGroupOrder: true, groupId: activeCode.value, isGroupLeader: participant.user._id === groupOrder.value.host._id,
        isPreOrder: isPreOrderCart.value, scheduledDate: scheduledDate.value,
        vendorNote: cartStore.vendorNotes.value[vendorId] || '',
        promoCode: promoCodeObj.value?.code || undefined,
        locationType: isWithinLuth.value ? 'inside_campus' : outsideCampusLocation.value,
        proposedDeliveryFee: !isWithinLuth.value ? proposedDeliveryFee.value : undefined,
      });
      if (res?._id || res?.data?._id) createdIds.push(res?._id || res?.data?._id);
      isFirstOrder = false;
    }
  } else {
    for (const vId of [...cartStore.allVendorIds.value]) {
      const stats = cartStore.getVendorStats(vId) as any;
      const vendor = vendorsMetadata.value[vId];
      const deliveryFee = !isWithinLuth.value ? (proposedDeliveryFee.value || 0) : (vendor?.deliveryFee ?? 150);
      const sFee = isFirstOrder ? platformConvenienceFee.value : 0;
      const pFee = isFirstOrder ? platformProcessingFee.value : 0;
      const actualPackFee = getVendorPackagingFee(vId, stats, vendor);
      const res = await createOrder({
        vendorId: vId, packs: stats.packs.map((p: any, i: number) => ({ packId: p.id, name: p.name || `Pack ${i + 1}`, packType: p.packType, items: p.items.map((item: any) => ({ product: item.productId, name: item.name, price: item.price, image: item.image, quantity: item.quantity, subtotal: item.subtotal, customizations: item.customizations || [] })) })),
        subtotal: stats.subtotal, deliveryFee, serviceFee: sFee, platformProcessingFee: pFee, packagingFee: actualPackFee, selectedPack: selectedPacks.value[vId] || { name: 'Standard', price: actualPackFee },
        isMysteryBox: isMysteryBox.value, isDormDelivery: isDormDelivery.value, deliveryOption: deliveryOption.value, deliveryMode: deliveryMode.value, recipientName: recipientName.value, recipientPhone: recipientPhone.value, specificAddress: specificAddress.value, deliveryAddress: specificAddress.value, deliveryLocation: deliveryCoordinates.value ? { type: 'Point', coordinates: deliveryCoordinates.value } : undefined, weight: 1.0,
        isPreOrder: isPreOrderCart.value, scheduledDate: scheduledDate.value, wantsNotification: wantsNotification.value, notifyEmail: notifyEmail.value, useFreeDeliveryToken: useFreeDeliveryToken.value,
        vendorNote: cartStore.vendorNotes.value[vId] || '',
        promoCode: promoCodeObj.value?.code || undefined,
        locationType: isWithinLuth.value ? 'inside_campus' : outsideCampusLocation.value,
        proposedDeliveryFee: !isWithinLuth.value ? proposedDeliveryFee.value : undefined,
      });
      if (res?._id || res?.data?._id) { 
        createdIds.push(res?._id || res?.data?._id); 
      }

      isFirstOrder = false;
    }
  }
  return createdIds;
};
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.animate-float { animation: float 6s ease-in-out infinite; }
@keyframes float { 0%, 100% { transform: translateY(0) rotate(-6deg); } 50% { transform: translateY(-15px) rotate(0); } }
.animate-fade-in { animation: fadeIn 0.4s ease-out both; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.animate-zoom-in { animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes zoomIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
</style>
