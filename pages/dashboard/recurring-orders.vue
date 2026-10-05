<template>
  <div class="bg-white min-h-screen pb-24 animate-fade-in selection:bg-parentPrimary/15 selection:text-parentPrimary px-3 md:px-4 pt-6">
    <!-- Header -->
    <header class="mb-8">
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-6">
        <div>
          <p class="ff-mono text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] flex items-center gap-1.5 mb-2">
            <Repeat class="w-3.5 h-3.5 text-parentPrimary" />
            Meal Autopilot
          </p>
          <h1 class="ff-display text-2xl md:text-3xl font-bold text-gray-900 tracking-tight leading-none">
            Set It. <span class="text-parentPrimary">Forget It.</span>
          </h1>
          <p class="text-sm font-medium text-gray-500 mt-2 max-w-md">Schedule your weekly meals across different vendors and we'll handle the rest — on autopilot.</p>
        </div>
      </div>
    </header>

    <!-- Day Selector (Custom Dropdown) -->
    <div class="relative mb-8 z-20">
      <div 
        @click="isDropdownOpen = !isDropdownOpen"
        class="flex items-center justify-between bg-white  rounded-2xl p-2 pl-4  relative cursor-pointer hover:border-parentPrimary/30 transition-colors"
      >
        <div class="flex flex-col">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Viewing Schedule For</span>
          <div class="flex items-center gap-2">
            <h2 class="text-lg md:text-xl font-black text-gray-900 capitalize">{{ selectedDay }}</h2>
            <ChevronDown class="w-4 h-4 text-parentPrimary transition-transform" :class="isDropdownOpen ? 'rotate-180' : ''" />
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="hidden md:flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full text-xs font-bold text-gray-500">
            <div class="w-1.5 h-1.5 rounded-full bg-parentPrimary"></div>
            {{ activeDayMealsCount }} Scheduled
          </div>
        </div>
      </div>
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="isDropdownOpen" class="absolute top-full left-0 w-full mt-2 bg-white  rounded-2xl shadow-xl overflow-hidden py-2 z-30">
          <button 
            v-for="day in daysOfWeek" 
            :key="day.value"
            @click="selectDayFromDropdown(day.value)"
            class="w-full text-left px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors group"
            :class="selectedDay === day.value ? 'bg-parentPrimary/5' : ''"
          >
            <span class="font-bold capitalize transition-colors" :class="selectedDay === day.value ? 'text-parentPrimary' : 'text-gray-700 group-hover:text-gray-900'">Every {{ day.value }}</span>
            <div v-if="getDayMealsCount(day.value) > 0" class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-parentPrimary/10 text-parentPrimary border border-parentPrimary/20">
              {{ getDayMealsCount(day.value) }} Scheduled
            </div>
          </button>
        </div>
      </Transition>
    </div>

    <!-- Time Slots for Selected Day -->
    <div class="space-y-4">
      <div class="flex items-center justify-between mb-2 px-1">
        <h3 class="text-base font-bold text-gray-900 capitalize">{{ selectedDay }}'s Schedule</h3>
        <span class="text-xs font-semibold text-parentPrimary bg-parentPrimary/10 px-2.5 py-1 rounded-full">{{ activeDayMealsCount }} Scheduled</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TimeSlotCard 
          v-for="slot in timeSlots" :key="slot.key"
          :timeLabel="slot.label"
          :slotKey="slot.key"
          :day="selectedDay"
          :order="getScheduledOrderForSlot(selectedDay, slot.key)"
          @add="openAddMealModal(selectedDay, slot.key)"
          @edit="openEditMealModal(selectedDay, slot.key, $event)"
          @delete="confirmDelete"
        />
      </div>
    </div>

    <!-- ========================== -->
    <!-- MAIN MULTI-STEP MODAL      -->
    <!-- ========================== -->
    <Teleport to="body">
      <div v-if="showAddModal" class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-gray-900/40 backdrop-blur-sm sm:p-4 animate-fade-in" @click.self="closeModal">
        <div class="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[90dvh] sm:h-[88vh] animate-slide-up relative">
          
          <!-- Modal Header -->
          <div class="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 shrink-0">
            <div>
              <h3 class="font-bold text-gray-900 flex items-center gap-2">
                <button v-if="modalView !== 'vendors'" @click="goBack" class="w-6 h-6 flex items-center justify-center bg-white rounded-full text-gray-600 hover:text-gray-900   transition-colors">
                  <ChevronLeft class="w-4 h-4"/>
                </button>
                <span v-if="modalView === 'vendors'">Select a Vendor</span>
                <span v-else-if="modalView === 'menu'">Build Your Meal</span>
                <span v-else-if="modalView === 'delivery'">Delivery Details</span>
                <span v-else>Review & Confirm</span>
              </h3>
              <p class="text-xs font-medium text-parentPrimary mt-1">For {{ activeModalContext?.day }} • {{ activeModalContext?.time }}</p>
            </div>
            <button @click="closeModal" class="w-8 h-8 flex items-center justify-center bg-white rounded-full text-gray-400 hover:text-gray-900   transition-colors">
              <X class="w-4 h-4"/>
            </button>
          </div>
          
          <!-- Modal Body -->
          <div class="p-4 sm:p-5 flex-1 overflow-y-auto bg-gray-50/30">
            
            <!-- Loading State -->
            <div v-if="modalLoading" class="flex flex-col items-center justify-center py-10 space-y-3">
              <Loader2 class="w-8 h-8 text-parentPrimary animate-spin" />
              <p class="text-sm font-medium text-gray-500">Loading...</p>
            </div>

            <!-- ========== STEP 1: VENDOR SELECTION ========== -->
            <div v-else-if="modalView === 'vendors'" class="space-y-3">
              <div 
                v-for="vendor in vendors" 
                :key="vendor._id"
                @click="selectVendor(vendor)"
                class="bg-white p-4 rounded-2xl  hover:border-parentPrimary/30 hover: cursor-pointer transition-all flex items-center gap-4 group"
              >
                <img :src="vendor.logo || vendor.banner || 'https://via.placeholder.com/150'" class="w-12 h-12 rounded-xl object-cover" />
                <div class="flex-1">
                  <h4 class="font-bold text-gray-900 group-hover:text-parentPrimary transition-colors">{{ vendor.storeName || vendor.businessName || 'Vendor' }}</h4>
                  <p class="text-xs text-gray-500 line-clamp-1">{{ vendor.description || 'Quality meals' }}</p>
                </div>
                <ChevronRight class="w-5 h-5 text-gray-300 group-hover:text-parentPrimary transition-colors"/>
              </div>
              <div v-if="!vendors.length" class="text-center py-10 text-gray-500 text-sm">No active vendors found.</div>
            </div>

            <!-- ========== STEP 2: MENU & PACK SELECTION ========== -->
            <div v-else-if="modalView === 'menu'">
              
              <!-- Menu Packs (from menu_items_api.getPacks) -->
              <div v-if="vendorPacks.length" class="mb-6">
                <h4 class="text-sm font-bold text-gray-900 mb-3 px-1">Meal Combos / Packs</h4>
                <div class="space-y-3">
                  <div 
                    v-for="pack in vendorPacks" 
                    :key="pack._id"
                    class="bg-white p-4 rounded-2xl  transition-all flex items-center gap-3 cursor-pointer hover:border-parentPrimary/30"
                    @click="updatePackQty(pack, 1)"
                  >
                    <div class="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500 shrink-0">
                      <Package class="w-6 h-6"/>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h4 class="font-bold text-gray-900 text-sm line-clamp-1">{{ pack.name }}</h4>
                      <p class="text-xs text-gray-500 line-clamp-1">{{ pack.description || 'Curated meal pack' }}</p>
                      <p class="font-black text-gray-900 mt-1 text-sm">₦{{ pack.price?.toLocaleString() || 0 }}</p>
                    </div>
                    <div class="flex items-center gap-2 bg-gray-50 rounded-lg p-1   shrink-0" v-if="getPackQty(pack) > 0">
                      <button @click.stop="updatePackQty(pack, -1)" class="w-7 h-7 flex items-center justify-center bg-white rounded  text-gray-600 hover:text-parentPrimary font-bold">-</button>
                      <span class="w-4 text-center text-xs font-bold">{{ getPackQty(pack) }}</span>
                      <button @click.stop="updatePackQty(pack, 1)" class="w-7 h-7 flex items-center justify-center bg-white rounded  text-gray-600 hover:text-parentPrimary font-bold">+</button>
                    </div>
                    <div v-else class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400  shrink-0">
                      <Plus class="w-4 h-4"/>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Individual Meals -->
              <div v-if="menuItems.length">
                <h4 class="text-sm font-bold text-gray-900 mb-3 px-1">Individual Meals</h4>
                <div class="space-y-3">
                  <div 
                    v-for="item in menuItems" 
                    :key="item._id"
                    class="bg-white p-3 rounded-2xl  transition-all flex items-center gap-3"
                  >
                    <!-- Tappable image to preview -->
                    <img 
                      :src="item.image || (item.images && item.images.length ? item.images[0] : 'https://via.placeholder.com/150')" 
                      class="w-14 h-14 rounded-xl object-cover cursor-pointer ring-2 ring-transparent hover:ring-parentPrimary/30 transition-all shrink-0"
                      @click.stop="openItemPreview(item)" 
                    />
                    <div class="flex-1 min-w-0 cursor-pointer" @click="updateItemQty(item, 1)">
                      <h4 class="font-bold text-gray-900 text-sm line-clamp-1">{{ item.name }}</h4>
                      <p v-if="item.description" class="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{{ item.description }}</p>
                      <div class="flex items-center gap-2 mt-1">
                        <p class="font-black text-gray-900 text-sm">₦{{ (item.pricePerPortion || item.price || 0).toLocaleString() }}</p>
                        <span v-if="item.portionUnit" class="text-[10px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-full ">per {{ item.portionUnit }}</span>
                      </div>
                    </div>
                    <div class="flex items-center gap-2 bg-gray-50 rounded-lg p-1   shrink-0" v-if="getItemQty(item) > 0">
                      <button @click.stop="updateItemQty(item, -1)" class="w-7 h-7 flex items-center justify-center bg-white rounded  text-gray-600 hover:text-parentPrimary font-bold">-</button>
                      <span class="w-4 text-center text-xs font-bold">{{ getItemQty(item) }}</span>
                      <button @click.stop="updateItemQty(item, 1)" class="w-7 h-7 flex items-center justify-center bg-white rounded  text-gray-600 hover:text-parentPrimary font-bold">+</button>
                    </div>
                    <div v-else @click="updateItemQty(item, 1)" class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400  cursor-pointer hover:bg-parentPrimary/10 hover:text-parentPrimary transition-colors shrink-0">
                      <Plus class="w-4 h-4"/>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="!menuItems.length && !vendorPacks.length" class="text-center py-10 text-gray-500 text-sm">No items found for this vendor.</div>
            </div>

            <!-- ========== STEP 3: DELIVERY DETAILS ========== -->
            <div v-else-if="modalView === 'delivery'" class="space-y-5">
              
              <div class="bg-white  rounded-2xl p-4">
                <label class="text-sm font-bold text-gray-900 block mb-3">Recipient Info</label>
                <div class="space-y-3">
                  <input 
                    v-model="recipientName" type="text" placeholder="Full Name"
                    class="w-full bg-gray-50 border border-gray-50 focus:border-parentPrimary/50 rounded-xl px-4 py-4 text-sm font-medium text-gray-900 outline-none transition-all"
                  />
                  <input 
                    v-model="recipientPhone" type="tel" placeholder="Phone Number"
                    class="w-full bg-gray-50 border border-gray-50 focus:border-parentPrimary/50 rounded-xl px-4 py-4 text-sm font-medium text-gray-900 outline-none transition-all"
                  />
                </div>
              </div>

              <div class="bg-white  rounded-2xl p-4">
                <label class="text-sm font-bold text-gray-900 block mb-3">Delivery Method</label>
                <div class="grid grid-cols-2 gap-3">
                  <button 
                    @click="deliveryMode = 'room_delivery'"
                    class="flex flex-col items-center justify-center p-3 rounded-xl border transition-all"
                    :class="deliveryMode === 'room_delivery' ? 'border-parentPrimary bg-parentPrimary/5' : 'border-gray-100 bg-white hover:border-gray-200'"
                  >
                    <MapPin class="w-4 h-4 mb-1" :class="deliveryMode === 'room_delivery' ? 'text-parentPrimary' : 'text-gray-400'" />
                    <span class="text-xs font-bold" :class="deliveryMode === 'room_delivery' ? 'text-parentPrimary' : 'text-gray-900'">Room Delivery</span>
                  </button>
                  <button 
                    @click="deliveryMode = 'dropoff_service'"
                    class="flex flex-col items-center justify-center p-3 rounded-xl border transition-all"
                    :class="deliveryMode === 'dropoff_service' ? 'border-parentPrimary bg-parentPrimary/5' : 'border-gray-100 bg-white hover:border-gray-200'"
                  >
                    <Building class="w-4 h-4 mb-1" :class="deliveryMode === 'dropoff_service' ? 'text-parentPrimary' : 'text-gray-400'" />
                    <span class="text-xs font-bold" :class="deliveryMode === 'dropoff_service' ? 'text-parentPrimary' : 'text-gray-900'">Drop-off</span>
                  </button>
                </div>
                <div class="bg-gray-50 p-3 rounded-xl mt-3">
                  <p class="text-[11px] font-medium text-gray-600 leading-relaxed">
                    <span class="font-bold text-gray-900">Room Delivery:</span> Delivered to your exact door. <br/>
                    <span class="font-bold text-gray-900">Drop-off:</span> Left at a central point (porter, gate).
                  </p>
                </div>
              </div>

              <div class="bg-white  rounded-2xl p-4">
                <label class="text-sm font-bold text-gray-900 block mb-3">Location Type</label>
                <div class="grid grid-cols-2 gap-3 mb-4">
                  <button 
                    @click="locationType = 'inside_campus'"
                    class="flex flex-col items-center justify-center p-3 rounded-xl border transition-all"
                    :class="locationType === 'inside_campus' ? 'border-parentPrimary bg-parentPrimary/5' : 'border-gray-100 bg-white hover:border-gray-200'"
                  >
                    <span class="text-xs font-bold" :class="locationType === 'inside_campus' ? 'text-parentPrimary' : 'text-gray-900'">Inside Campus</span>
                  </button>
                  <button 
                    @click="locationType = 'outside_campus'"
                    class="flex flex-col items-center justify-center p-3 rounded-xl border transition-all"
                    :class="locationType !== 'inside_campus' ? 'border-parentPrimary bg-parentPrimary/5' : 'border-gray-100 bg-white hover:border-gray-200'"
                  >
                    <span class="text-xs font-bold" :class="locationType !== 'inside_campus' ? 'text-parentPrimary' : 'text-gray-900'">Outside Campus</span>
                  </button>
                </div>
                <input 
                  v-model="specificAddress" type="text"
                  :placeholder="locationType === 'inside_campus' ? 'e.g. Block 4 Common Room' : 'e.g. 123 Main Street, Yaba, Lagos'"
                  class="w-full bg-gray-50 border border-gray-50 focus:border-parentPrimary/50 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all"
                />
              </div>

              <div class="bg-white  rounded-2xl p-4">
                <label class="text-sm font-bold text-gray-900 block mb-3">Note for Vendor (Optional)</label>
                <textarea 
                  v-model="vendorNote" rows="2" placeholder="e.g. Extra spicy, no onions..."
                  class="w-full bg-gray-50 border border-gray-50 focus:border-parentPrimary/50 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all resize-none"
                ></textarea>
              </div>

              <div class="flex items-center gap-3 px-1">
                <div 
                  @click="saveDeliveryAsDefault = !saveDeliveryAsDefault"
                  class="w-5 h-5 rounded flex items-center justify-center border transition-all cursor-pointer"
                  :class="saveDeliveryAsDefault ? 'bg-parentPrimary border-parentPrimary' : 'bg-white border-gray-200'"
                >
                  <svg v-if="saveDeliveryAsDefault" xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </div>
                <span class="text-sm text-gray-600 font-medium cursor-pointer" @click="saveDeliveryAsDefault = !saveDeliveryAsDefault">Save this delivery info for next time</span>
              </div>
            </div>

            <!-- ========== STEP 4: REVIEW & CONFIRM ========== -->
            <div v-else-if="modalView === 'confirm'" class="space-y-5">
              
              <!-- Items Summary -->
              <div class="bg-white  rounded-2xl p-4">
                <h4 class="text-sm font-bold text-gray-900 mb-3 border-b border-gray-50 pb-2">Selected Items</h4>
                <div class="space-y-3">
                  <div v-for="pack in selectedPacks" :key="`rp-${pack._id}`" class="flex justify-between items-center">
                    <div class="flex-1 min-w-0">
                      <h5 class="font-bold text-gray-900 text-sm line-clamp-1">{{ pack.name }}</h5>
                      <p class="text-[10px] text-gray-400 font-bold">PACK</p>
                    </div>
                    <div class="flex items-center gap-2 bg-gray-50 rounded-lg p-1   shrink-0">
                      <button @click.stop="updatePackQty(pack, -1)" class="w-7 h-7 flex items-center justify-center bg-white rounded  text-gray-600 hover:text-parentPrimary font-bold">-</button>
                      <span class="w-4 text-center text-xs font-bold">{{ pack.cartQty }}</span>
                      <button @click.stop="updatePackQty(pack, 1)" class="w-7 h-7 flex items-center justify-center bg-white rounded  text-gray-600 hover:text-parentPrimary font-bold">+</button>
                    </div>
                    <span class="font-bold text-gray-900 text-sm ml-3 w-16 text-right shrink-0">₦{{ ((pack.price || 0) * pack.cartQty).toLocaleString() }}</span>
                  </div>
                  <div v-for="item in selectedItems" :key="`ri-${item._id}`" class="flex justify-between items-center">
                    <div class="flex-1 min-w-0">
                      <h5 class="font-bold text-gray-900 text-sm line-clamp-1">{{ item.name }}</h5>
                      <p class="text-[10px] text-gray-400 font-bold">{{ item.portionUnit ? `PER ${item.portionUnit.toUpperCase()}` : 'MEAL' }}</p>
                    </div>
                    <div class="flex items-center gap-2 bg-gray-50 rounded-lg p-1   shrink-0">
                      <button @click.stop="updateItemQty(item, -1)" class="w-7 h-7 flex items-center justify-center bg-white rounded  text-gray-600 hover:text-parentPrimary font-bold">-</button>
                      <span class="w-4 text-center text-xs font-bold">{{ item.cartQty }}</span>
                      <button @click.stop="updateItemQty(item, 1)" class="w-7 h-7 flex items-center justify-center bg-white rounded  text-gray-600 hover:text-parentPrimary font-bold">+</button>
                    </div>
                    <span class="font-bold text-gray-900 text-sm ml-3 w-16 text-right shrink-0">₦{{ ((item.pricePerPortion || item.price || 0) * item.cartQty).toLocaleString() }}</span>
                  </div>
                </div>
              </div>

              <!-- Packaging Selector -->
              <div v-if="vendorPackagingPacks.length > 0" class="bg-white rounded-2xl p-4 relative z-30">
                <h4 class="text-sm font-bold text-gray-900 mb-2">Packaging Type</h4>
                <div class="relative z-30">
                  <div @click="isPackagingDropdownOpen = !isPackagingDropdownOpen" class="w-full bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 flex justify-between items-center cursor-pointer transition-all">
                    <span :class="selectedPackagingPackName ? 'text-gray-900' : 'text-gray-500'">{{ selectedPackagingPackName || 'Select Packaging' }}</span>
                    <ChevronDown class="w-4 h-4 text-gray-400" />
                  </div>
                  <!-- Dropdown Modal -->
                  <div v-if="isPackagingDropdownOpen" class="absolute top-full left-0 w-full mt-2 bg-white/95 backdrop-blur-xl rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-50/50 py-2 max-h-48 overflow-y-auto z-50">
                    <div v-for="vp in vendorPackagingPacks" :key="vp.name" @click="selectPackaging(vp)" class="px-4 py-3 text-sm font-bold cursor-pointer transition-colors flex justify-between items-center" :class="selectedPackagingPackName === vp.name ? 'text-parentPrimary bg-parentPrimary/5' : 'text-gray-700 hover:bg-gray-50'">
                      <div class="flex items-center gap-2">
                        <span>{{ vp.name }}</span>
                        <Check v-if="selectedPackagingPackName === vp.name" class="w-4 h-4 text-parentPrimary"/>
                      </div>
                      <span>₦{{ vp.price }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="isPackagingDropdownOpen" @click="isPackagingDropdownOpen = false" class="fixed inset-0 z-20"></div>

              <!-- Exact Time Picker -->
              <div class="bg-white  rounded-2xl p-4 relative z-20">
                <div class="flex items-center justify-between mb-2">
                  <div>
                    <h4 class="text-sm font-bold text-gray-900">Meal Delivery Time</h4>
                    <p class="text-xs text-gray-500 mt-0.5">Pick the exact time we should process this order.</p>
                  </div>
                  <Clock class="w-4 h-4 text-gray-400" />
                </div>
                
                <!-- Backdrop for closing custom dropdowns -->
                <div v-if="showHourDropdown || showMinuteDropdown" @click="showHourDropdown = false; showMinuteDropdown = false" class="fixed inset-0 z-40"></div>

                <div class="flex items-center gap-3 mt-2 relative z-50">
                  <div class="relative flex-1">
                    <div @click="showHourDropdown = !showHourDropdown; showMinuteDropdown = false" class="w-full bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 flex justify-between items-center cursor-pointer transition-all">
                      <span :class="selectedHour ? 'text-gray-900' : 'text-gray-500'">{{ selectedHour || 'Hour' }}</span>
                      <ChevronDown class="w-4 h-4 text-gray-400" />
                    </div>
                    <!-- Custom Hour Dropdown -->
                    <div v-if="showHourDropdown" class="absolute top-full left-0 w-full mt-2 bg-white/95 backdrop-blur-xl rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-50/50 py-2 max-h-48 overflow-y-auto z-50">
                      <div v-for="h in availableHours" :key="h" @click="selectedHour = h; showHourDropdown = false" class="px-4 py-2.5 text-sm font-bold cursor-pointer transition-colors flex justify-between items-center" :class="selectedHour === h ? 'text-parentPrimary bg-parentPrimary/5' : 'text-gray-700 hover:bg-gray-50'">
                        <span>{{ h }}</span>
                        <Check v-if="selectedHour === h" class="w-4 h-4 text-parentPrimary"/>
                      </div>
                    </div>
                  </div>
                  
                  <span class="font-bold text-gray-900 text-lg">:</span>
                  
                  <div class="relative flex-1">
                    <div @click="showMinuteDropdown = !showMinuteDropdown; showHourDropdown = false" class="w-full bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 flex justify-between items-center cursor-pointer transition-all">
                      <span :class="selectedMinute ? 'text-gray-900' : 'text-gray-500'">{{ selectedMinute || 'Min' }}</span>
                      <ChevronDown class="w-4 h-4 text-gray-400" />
                    </div>
                    <!-- Custom Minute Dropdown -->
                    <div v-if="showMinuteDropdown" class="absolute top-full left-0 w-full mt-2 bg-white/95 backdrop-blur-xl rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-50/50 py-2 max-h-48 overflow-y-auto z-50">
                      <div v-for="m in availableMinutes" :key="m" @click="selectedMinute = m; showMinuteDropdown = false" class="px-4 py-2.5 text-sm font-bold cursor-pointer transition-colors flex justify-between items-center" :class="selectedMinute === m ? 'text-parentPrimary bg-parentPrimary/5' : 'text-gray-700 hover:bg-gray-50'">
                        <span>{{ m }}</span>
                        <Check v-if="selectedMinute === m" class="w-4 h-4 text-parentPrimary"/>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Delivery Summary -->
              <div class="bg-white  rounded-2xl p-4">
                <h4 class="text-sm font-bold text-gray-900 mb-3">Delivery Summary</h4>
                <div class="space-y-3 text-sm">
                  <div class="flex justify-between"><span class="text-gray-500 flex items-center gap-1.5"><User class="w-4 h-4"/> Recipient</span><span class="font-bold text-gray-900">{{ recipientName || 'Not set' }}</span></div>
                  <div class="flex justify-between"><span class="text-gray-500 flex items-center gap-1.5"><Phone class="w-4 h-4"/> Phone</span><span class="font-bold text-gray-900">{{ recipientPhone || 'Not set' }}</span></div>
                  <div class="flex justify-between"><span class="text-gray-500 flex items-center gap-1.5"><Navigation class="w-4 h-4"/> Method</span><span class="font-bold text-gray-900 capitalize">{{ deliveryMode.replace('_', ' ') }}</span></div>
                  <div class="flex justify-between"><span class="text-gray-500 flex items-center gap-1.5"><Building class="w-4 h-4"/> Location</span><span class="font-bold text-gray-900 capitalize">{{ locationType.replace('_', ' ') }}</span></div>
                  <div class="flex justify-between"><span class="text-gray-500 flex items-center gap-1.5"><Map class="w-4 h-4"/> Address</span><span class="font-bold text-gray-900 text-right max-w-[200px]">{{ specificAddress || 'Not set' }}</span></div>
                </div>
              </div>

              <!-- Price Breakdown -->
              <div class="bg-white  rounded-2xl p-4">
                <div class="flex items-center justify-between text-sm mb-3 text-gray-500">
                  <span class="flex items-center gap-1.5"><Receipt class="w-4 h-4"/> Subtotal</span>
                  <span class="font-bold text-gray-900">₦{{ cartSubtotal.toLocaleString() }}</span>
                </div>
                <div v-if="deliveryFee > 0" class="flex items-center justify-between text-sm mb-3 text-gray-500">
                  <span class="flex items-center gap-1.5"><Truck class="w-4 h-4"/> Delivery</span>
                  <span class="font-bold text-gray-900">₦{{ deliveryFee.toLocaleString() }}</span>
                </div>
                <div v-if="packagingFee > 0" class="flex items-center justify-between text-sm mb-3 text-gray-500">
                  <span class="flex items-center gap-1.5"><Package class="w-4 h-4"/> Packaging Fee</span>
                  <span class="font-bold text-gray-900">₦{{ packagingFee.toLocaleString() }}</span>
                </div>
                <div class="flex items-center justify-between text-sm mb-3 text-gray-500">
                  <span class="flex items-center gap-1.5"><ShieldCheck class="w-4 h-4"/> Service Charge</span>
                  <span class="font-bold text-gray-900">₦{{ serviceFee.toLocaleString() }}</span>
                </div>
                <div class="flex items-center justify-between text-lg mt-4 pt-3 border-t border-gray-100">
                  <span class="font-bold text-gray-900 flex items-center gap-1.5"><Banknote class="w-5 h-5 text-parentPrimary"/> Total per run</span>
                  <span class="font-black text-parentPrimary">₦{{ orderTotal.toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- ========== STICKY FOOTER BUTTONS ========== -->
          <!-- Menu -> Delivery -->
          <div v-if="modalView === 'menu' && totalCartItems > 0" class="shrink-0 w-full p-4 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
            <button @click="modalView = 'delivery'" class="w-full bg-parentPrimary hover:bg-parentPrimary/90 text-white font-bold py-4 rounded-2xl transition-all flex justify-between items-center px-6">
              <div class="flex items-center gap-2">
                <span class="bg-white/20 px-2 py-0.5 rounded-full text-sm">{{ totalCartItems }}</span>
                <span>Continue</span>
              </div>
              <span>₦{{ cartSubtotal.toLocaleString() }}</span>
            </button>
          </div>

          <!-- Delivery -> Review -->
          <div v-if="modalView === 'delivery'" class="shrink-0 w-full p-4 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
            <button @click="goToConfirm" :disabled="!recipientName || !specificAddress" class="w-full bg-parentPrimary hover:bg-parentPrimary/90 disabled:opacity-40 text-white font-bold py-4 rounded-2xl transition-all flex justify-center items-center gap-2">
              <span>Review Automation</span>
              <ChevronRight class="w-4 h-4"/>
            </button>
          </div>

          <!-- Confirm -> Submit -->
          <div v-if="modalView === 'confirm'" class="shrink-0 w-full p-4 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
            <div class="flex items-start gap-2 mb-3 px-1 text-orange-600 bg-orange-50 p-2 rounded-lg border border-orange-100">
              <Info class="w-4 h-4 shrink-0 mt-0.5" />
              <p class="text-[11px] font-bold leading-tight">Your wallet will be automatically charged ₦{{ orderTotal.toLocaleString() }} on the day of the delivery. Ensure you have sufficient balance.</p>
            </div>
            <button 
              @click="submitAutomation"
              :disabled="isSubmitting || !exactTime || !isTimeValid"
              class="w-full bg-parentPrimary hover:bg-parentPrimary/90 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-parentPrimary/30 flex justify-center items-center gap-2"
            >
              <Loader2 v-if="isSubmitting" class="w-5 h-5 animate-spin" />
              <span v-else>{{ activeModalContext?.editOrderId ? 'Update Automation' : 'Confirm Automation' }} — ₦{{ orderTotal.toLocaleString() }}</span>
            </button>
          </div>

        </div>
      </div>
    </Teleport>

    <!-- ========================== -->
    <!-- ITEM PREVIEW MODAL         -->
    <!-- ========================== -->
    <Teleport to="body">
      <div v-if="previewItem" class="fixed inset-0 z-[110] flex items-center justify-center bg-gray-900/50 backdrop-blur-sm p-4 animate-fade-in" @click.self="previewItem = null">
        <div class="bg-white w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
          <img 
            :src="previewItem.image || (previewItem.images && previewItem.images.length ? previewItem.images[0] : 'https://via.placeholder.com/400x300')"
            class="w-full h-48 object-cover"
          />
          <div class="p-5">
            <h3 class="text-lg font-bold text-gray-900 mb-1">{{ previewItem.name }}</h3>
            <p v-if="previewItem.description" class="text-sm text-gray-500 mb-3 leading-relaxed">{{ previewItem.description }}</p>
            <div class="flex items-center gap-3 mb-4">
              <span class="text-xl font-black text-parentPrimary">₦{{ (previewItem.pricePerPortion || previewItem.price || 0).toLocaleString() }}</span>
              <span v-if="previewItem.portionUnit" class="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full ">per {{ previewItem.portionUnit }}</span>
            </div>
            <div v-if="previewItem.prepTimeMinutes" class="text-xs text-gray-500 mb-4 flex items-center gap-1">
              <Clock class="w-3 h-3"/>
              <span>~{{ previewItem.prepTimeMinutes }} min prep time</span>
            </div>
            <div class="flex gap-3">
              <button @click="previewItem = null" class="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">Close</button>
              <button @click="addPreviewItemToCart" class="flex-1 py-3 bg-parentPrimary hover:bg-parentPrimary/90 text-white font-bold rounded-xl transition-colors shadow-lg shadow-parentPrimary/20">Add to Meal</button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- ========================== -->
    <!-- DELETE CONFIRMATION MODAL  -->
    <!-- ========================== -->
    <Teleport to="body">
      <div v-if="showDeleteModal" class="fixed inset-0 z-[110] flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-fade-in" @click.self="showDeleteModal = false">
        <div class="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 text-center animate-slide-up">
          <div class="w-16 h-16 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 class="w-8 h-8" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Cancel Automation?</h3>
          <p class="text-sm text-gray-500 mb-6">Are you sure you want to cancel this automated meal? This action cannot be undone.</p>
          <div class="flex gap-3">
            <button @click="showDeleteModal = false" class="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors">Keep It</button>
            <button @click="executeDelete" :disabled="isDeleting" class="flex-1 py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-rose-500/20">
              <Loader2 v-if="isDeleting" class="w-4 h-4 animate-spin" />
              <span v-else>Yes, Cancel</span>
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Repeat, X, Plus, Clock, Trash2, Store, ChevronRight, ChevronLeft, Loader2, ChevronDown, Package, MapPin, Building, Check, Info, User, Phone, Navigation, Map, Receipt, Truck, ShieldCheck, Banknote } from 'lucide-vue-next'
import { orders_api } from '@/api_factory/modules/orders'
import { vendors_api } from '@/api_factory/modules/vendors'
import { menu_items_api } from '@/api_factory/modules/menu-items'
import { auth_api } from '@/api_factory/modules/auth'
import { users_api } from '@/api_factory/modules/users'
import TimeSlotCard from '@/components/automations/TimeSlotCard.vue'
import { useCustomToast } from '@/composables/core/useCustomToast'

definePageMeta({ layout: 'student' })

const { showToast } = useCustomToast()
const loading = ref(true)
const orders = ref([])

// Time Slots
const timeSlots = [
  { key: '08:00 AM - 10:00 AM', label: '08:00 AM - 10:00 AM (Breakfast)' },
  { key: '12:00 PM - 02:00 PM', label: '12:00 PM - 02:00 PM (Lunch)' },
  { key: '05:00 PM - 07:00 PM', label: '05:00 PM - 07:00 PM (Dinner)' },
  { key: '08:00 PM - 10:00 PM', label: '08:00 PM - 10:00 PM (Late Night)' },
]

// Modal State
const showAddModal = ref(false)
const showDeleteModal = ref(false)
const orderToDelete = ref(null)
const isDeleting = ref(false)
const modalView = ref('vendors') // 'vendors' | 'menu' | 'delivery' | 'confirm'
const activeModalContext = ref(null)
const modalLoading = ref(false)
const isSubmitting = ref(false)

// Data State
const vendors = ref([])
const menuItems = ref([])
const vendorPacks = ref([])
const selectedVendor = ref(null)

// Mini-Cart State
const selectedItems = ref([])
const selectedPacks = ref([])

// Delivery State
const recipientName = ref('')
const recipientPhone = ref('')
const deliveryMode = ref('room_delivery')
const locationType = ref('inside_campus')
const specificAddress = ref('')
const vendorNote = ref('')
const saveDeliveryAsDefault = ref(false)
const userProfile = ref(null)

// Admin Config State (populated purely from /settings/errands/custom API)
const platformBaseFee = ref(0)
const platformConvenienceFee = ref(0)
const platformProcessingFee = ref(0)
const selectedPackagingPackName = ref('')
const isPackagingDropdownOpen = ref(false)

const vendorPackagingPacks = ref([])
const selectedPackagingPack = ref(null)

// Exact Time Custom Picker
const selectedHour = ref('')
const selectedMinute = ref('')
const showHourDropdown = ref(false)
const showMinuteDropdown = ref(false)

const availableHours = computed(() => {
  if (!activeModalContext.value?.time) return []
  const slot = activeModalContext.value.time
  if (slot.includes('08:00 AM')) return ['08', '09', '10', '11', '12']
  if (slot.includes('12:00 PM')) return ['12', '13', '14']
  if (slot.includes('05:00 PM')) return ['17', '18', '19']
  return ['20', '21', '22']
})

const availableMinutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'))

const exactTime = computed(() => {
  if (selectedHour.value && selectedMinute.value) {
    return `${selectedHour.value}:${selectedMinute.value}`
  }
  return ''
})

const isTimeValid = computed(() => {
  return !!exactTime.value
})

// Item Preview
const previewItem = ref(null)

// Day Selector
const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
const selectedDay = ref(today)
const isDropdownOpen = ref(false)

const daysOfWeek = computed(() => {
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return days.map(dayName => ({ value: dayName, short: dayName.substring(0, 3) }))
})

const selectDayFromDropdown = (day) => {
  selectedDay.value = day
  isDropdownOpen.value = false
}

// ============ DATA FETCHING ============

const fetchOrders = async () => {
  try {
    loading.value = true
    const res = await orders_api.getRecurringOrders()
    const data = res?.data?.data || res?.data || []
    orders.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Failed to fetch recurring orders', error)
    orders.value = []
  } finally {
    loading.value = false
  }
}

const getScheduledOrderForSlot = (day, timeWindow) => {
  for (const order of orders.value) {
    if (order.status === 'active' || order.status === 'paused') {
      const match = order.schedules?.find(s => s.day === day && s.timeWindow === timeWindow)
      if (match) {
        let displayItems = []
        if (order.packs && order.packs.length > 0) displayItems = displayItems.concat(order.packs)
        if (order.menuItems && order.menuItems.length > 0) displayItems = displayItems.concat(order.menuItems)
        if (displayItems.length === 0 && order.items) displayItems = displayItems.concat(order.items)
        return {
          _id: order._id,
          vendor: order.vendor,
          items: displayItems,
          status: order.status,
          total: order.total,
          scheduleId: match._id || match.id
        }
      }
    }
  }
  return null
}

const getDayMealsCount = (day) => {
  let count = 0
  orders.value.forEach(o => {
    if (o.status === 'active' || o.status === 'paused') {
      count += o.schedules?.filter(s => s.day === day).length || 0
    }
  })
  return count
}

const activeDayMealsCount = computed(() => getDayMealsCount(selectedDay.value))

// ============ MODAL LIFECYCLE ============

const openAddMealModal = async (day, time) => {
  resetModalState()
  activeModalContext.value = { day, time, editOrderId: null }
  modalView.value = 'vendors'
  showAddModal.value = true
  
  if (vendors.value.length === 0) {
    modalLoading.value = true
    try {
      const res = await vendors_api.getOnline()
      vendors.value = res.data?.data || res.data || []
    } catch (e) { console.error(e) } finally { modalLoading.value = false }
  }
}

const openEditMealModal = async (day, time, order) => {
  resetModalState()
  activeModalContext.value = { day, time, editOrderId: order._id }
  showAddModal.value = true
  modalLoading.value = true

  try {
    if (vendors.value.length === 0) {
      const res = await vendors_api.getOnline()
      vendors.value = res.data?.data || res.data || []
    }

    const vId = order.vendor?._id || order.vendor
    const foundVendor = vendors.value.find(v => v._id === vId)
    if (foundVendor) {
      selectedVendor.value = foundVendor
      modalView.value = 'menu'

      // Load vendor packaging packs
      vendorPackagingPacks.value = (foundVendor.packs || []).filter(p => p.isActive !== false)
      if (vendorPackagingPacks.value.length > 0) {
        selectedPackagingPack.value = vendorPackagingPacks.value[0]
      }

      const [menuRes, packRes] = await Promise.all([
        menu_items_api.getByVendor(vId),
        menu_items_api.getPacks(vId)
      ])
      menuItems.value = menuRes.data?.data || menuRes.data || []
      vendorPacks.value = packRes.data?.data || packRes.data || []

      // Pre-populate cart from existing order
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          if (item.packId) {
            const matchingPack = vendorPacks.value.find(p => p._id === item.packId)
            if (matchingPack) selectedPacks.value.push({ ...matchingPack, cartQty: 1 })
          } else if (item.menuItem) {
            const matchingMenu = menuItems.value.find(m => m._id === (item.menuItem._id || item.menuItem))
            if (matchingMenu) selectedItems.value.push({ ...matchingMenu, cartQty: item.quantity || 1 })
          }
        })
      }

      // Pre-populate delivery from the raw order
      const rawOrder = orders.value.find(o => o._id === order._id)
      if (rawOrder) {
        recipientName.value = rawOrder.recipientName || ''
        recipientPhone.value = rawOrder.recipientPhone || ''
        deliveryMode.value = rawOrder.deliveryMode || 'room_delivery'
        locationType.value = rawOrder.locationType || 'inside_campus'
        specificAddress.value = rawOrder.specificAddress || rawOrder.deliveryAddress || ''
        vendorNote.value = rawOrder.vendorNote || ''
        const scheduleForDay = (rawOrder.schedules || []).find(s => s.day === day)
        if (scheduleForDay && scheduleForDay.exactTime) {
          exactTime.value = scheduleForDay.exactTime
        } else {
          exactTime.value = '12:00'
        }
      }
    } else {
      modalView.value = 'vendors'
      exactTime.value = '12:00'
    }
  } catch (e) {
    console.error(e)
    modalView.value = 'vendors'
  } finally {
    modalLoading.value = false
  }
}

const resetModalState = () => {
  selectedVendor.value = null
  selectedItems.value = []
  selectedPacks.value = []
  
  if (userProfile.value?.deliveryPreferences) {
    const prefs = userProfile.value.deliveryPreferences
    recipientName.value = prefs.recipientName || (userProfile.value.firstName ? `${userProfile.value.firstName} ${userProfile.value.lastName || ''}` : '')
    recipientPhone.value = prefs.recipientPhone || userProfile.value.phone || ''
    deliveryMode.value = prefs.deliveryMode || 'room_delivery'
    locationType.value = prefs.locationType || 'inside_campus'
    specificAddress.value = prefs.specificAddress || ''
  } else {
    recipientName.value = userProfile.value?.firstName ? `${userProfile.value.firstName} ${userProfile.value.lastName || ''}` : ''
    recipientPhone.value = userProfile.value?.phone || ''
    deliveryMode.value = 'room_delivery'
    locationType.value = 'inside_campus'
    specificAddress.value = ''
  }

  vendorNote.value = ''
  vendorPackagingPacks.value = []
  selectedPackagingPack.value = null
  selectedPackagingPackName.value = ''
  isPackagingDropdownOpen.value = false
  previewItem.value = null
  saveDeliveryAsDefault.value = false
  exactTime.value = '12:00'
}

const closeModal = () => {
  showAddModal.value = false
  setTimeout(resetModalState, 200)
}

const goBack = () => {
  if (modalView.value === 'confirm') modalView.value = 'delivery'
  else if (modalView.value === 'delivery') modalView.value = 'menu'
  else if (modalView.value === 'menu') modalView.value = 'vendors'
}

const goToConfirm = () => {
  // Load packaging options from vendor
  if (selectedVendor.value) {
    vendorPackagingPacks.value = (selectedVendor.value.packs || []).filter(p => p.isActive !== false)
    if (vendorPackagingPacks.value.length > 0 && !selectedPackagingPack.value) {
      selectedPackagingPack.value = vendorPackagingPacks.value[0]
      selectedPackagingPackName.value = vendorPackagingPacks.value[0].name
    }
  }
  modalView.value = 'confirm'
}

// ============ VENDOR SELECTION ============

const selectVendor = async (vendor) => {
  selectedVendor.value = vendor
  modalView.value = 'menu'
  modalLoading.value = true
  selectedItems.value = []
  selectedPacks.value = []

  // Get vendor packaging packs
  vendorPackagingPacks.value = (vendor.packs || []).filter(p => p.isActive !== false)
  if (vendorPackagingPacks.value.length > 0) {
    selectedPackagingPack.value = vendorPackagingPacks.value[0]
  }

  try {
    const [menuRes, packRes] = await Promise.all([
      menu_items_api.getByVendor(vendor._id),
      menu_items_api.getPacks(vendor._id)
    ])
    menuItems.value = menuRes.data?.data || menuRes.data || []
    vendorPacks.value = packRes.data?.data || packRes.data || []
  } catch (e) {
    console.error(e)
    menuItems.value = []
    vendorPacks.value = []
  } finally {
    modalLoading.value = false
  }
}

// ============ CART LOGIC ============

const getItemQty = (item) => {
  const match = selectedItems.value.find(i => i._id === item._id)
  return match ? match.cartQty : 0
}

const getPackQty = (pack) => {
  const match = selectedPacks.value.find(p => p._id === pack._id)
  return match ? match.cartQty : 0
}

const updateItemQty = (item, delta) => {
  const index = selectedItems.value.findIndex(i => i._id === item._id)
  if (index >= 0) {
    const newQty = selectedItems.value[index].cartQty + delta
    if (newQty <= 0) {
      selectedItems.value.splice(index, 1)
      if (totalCartItems.value === 0 && (modalView.value === 'confirm' || modalView.value === 'delivery')) modalView.value = 'menu'
    } else {
      selectedItems.value[index].cartQty = newQty
    }
  } else if (delta > 0) {
    selectedItems.value.push({ ...item, cartQty: 1 })
  }
}

const updatePackQty = (pack, delta) => {
  const index = selectedPacks.value.findIndex(p => p._id === pack._id)
  if (index >= 0) {
    const newQty = selectedPacks.value[index].cartQty + delta
    if (newQty <= 0) {
      selectedPacks.value.splice(index, 1)
      if (totalCartItems.value === 0 && (modalView.value === 'confirm' || modalView.value === 'delivery')) modalView.value = 'menu'
    } else {
      selectedPacks.value[index].cartQty = newQty
    }
  } else if (delta > 0) {
    selectedPacks.value.push({ ...pack, cartQty: 1 })
  }
}

const totalCartItems = computed(() => {
  let count = 0
  selectedItems.value.forEach(i => count += i.cartQty)
  selectedPacks.value.forEach(p => count += p.cartQty)
  return count
})

const cartSubtotal = computed(() => {
  let sum = 0
  selectedItems.value.forEach(i => sum += (i.pricePerPortion || i.price || 0) * i.cartQty)
  selectedPacks.value.forEach(p => sum += (p.price || 0) * p.cartQty)
  return sum
})

// Fee Calculations (matching cart.vue exactly — all from admin config)
const serviceFee = computed(() => platformConvenienceFee.value + platformProcessingFee.value)
const packagingFee = computed(() => selectedPackagingPack.value?.price || 0)
const deliveryFee = computed(() => platformBaseFee.value)
const orderTotal = computed(() => cartSubtotal.value + serviceFee.value + packagingFee.value + deliveryFee.value)

const onPackagingSelect = () => {
  const match = vendorPackagingPacks.value.find(p => p.name === selectedPackagingPackName.value)
  selectedPackagingPack.value = match || null
}

const selectPackaging = (vp) => {
  selectedPackagingPackName.value = vp.name
  selectedPackagingPack.value = vp
  isPackagingDropdownOpen.value = false
}

// ============ ITEM PREVIEW ============

const openItemPreview = (item) => {
  previewItem.value = item
}

const addPreviewItemToCart = () => {
  if (previewItem.value) {
    updateItemQty(previewItem.value, 1)
    previewItem.value = null
  }
}

// ============ SUBMISSION ============

const submitAutomation = async () => {
  isSubmitting.value = true
  try {
    const payload = {
      vendor: selectedVendor.value._id,
      schedules: [{
        day: activeModalContext.value.day,
        timeWindow: activeModalContext.value.time,
        exactTime: exactTime.value
      }],
      menuItems: selectedItems.value.map(item => ({
        menuItem: item._id,
        name: item.name,
        price: item.pricePerPortion || item.price || 0,
        quantity: item.cartQty,
        subtotal: (item.pricePerPortion || item.price || 0) * item.cartQty,
        variation: null,
        selectedModifiers: [],
        selectedAddOns: []
      })),
      packs: selectedPacks.value.map(pack => ({
        packId: pack._id,
        name: pack.name,
        items: pack.items?.map(pi => ({
           product: pi.product?._id || pi.product,
           name: pi.name,
           price: pi.price,
           image: pi.image,
           quantity: (pi.quantity || 1) * pack.cartQty,
           subtotal: (pi.price || 0) * (pi.quantity || 1) * pack.cartQty
        })) || []
      })),
      subtotal: cartSubtotal.value,
      serviceFee: serviceFee.value,
      packagingFee: packagingFee.value,
      deliveryFee: deliveryFee.value,
      total: orderTotal.value,
      paymentMethod: 'wallet',
      deliveryOption: 'use_an_errander',
      deliveryMode: deliveryMode.value,
      locationType: locationType.value,
      recipientName: recipientName.value,
      recipientPhone: recipientPhone.value,
      specificAddress: specificAddress.value,
      deliveryAddress: specificAddress.value,
      vendorNote: vendorNote.value,
    }
    
    if (saveDeliveryAsDefault.value) {
      users_api.updateProfile({
        deliveryPreferences: {
          recipientName: recipientName.value,
          recipientPhone: recipientPhone.value,
          deliveryMode: deliveryMode.value,
          locationType: locationType.value,
          specificAddress: specificAddress.value,
        }
      }).catch(err => console.error('Failed to save delivery preferences', err))
    }

    if (activeModalContext.value.editOrderId) {
      await orders_api.updateRecurringOrder(activeModalContext.value.editOrderId, payload)
      showToast({ title: 'Success', message: 'Meal automation updated!', toastType: 'success' })
    } else {
      await orders_api.createRecurringOrder(payload)
      showToast({ title: 'Success', message: 'Meal automation created!', toastType: 'success' })
    }
    
    closeModal()
    fetchOrders()
  } catch (e) {
    console.error('Failed to create/update automation', e)
    showToast({ title: 'Error', message: 'Could not complete automation request', toastType: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

// ============ DELETE ============

const confirmDelete = (orderId) => {
  orderToDelete.value = orderId
  showDeleteModal.value = true
}

const executeDelete = async () => {
  if (!orderToDelete.value) return
  isDeleting.value = true
  try {
    await orders_api.cancelRecurringOrder(orderToDelete.value)
    orders.value = orders.value.filter(o => o._id !== orderToDelete.value)
    showToast({ title: 'Success', message: 'Meal automation cancelled', toastType: 'success' })
    showDeleteModal.value = false
  } catch (e) {
    console.error(e)
    showToast({ title: 'Error', message: 'Failed to cancel automation', toastType: 'error' })
  } finally {
    isDeleting.value = false
    orderToDelete.value = null
  }
}

const fetchUserProfile = async () => {
  try {
    const res = await auth_api.getProfile()
    userProfile.value = res.data?.data || res.data || null
  } catch (error) {
    console.error('Failed to fetch user profile', error)
  }
}

const fetchPlatformSettings = async () => {
  try {
    const res = await orders_api.getCustomErrandSettings()
    if (res?.data) {
      const data = res.data.data || res.data
      platformBaseFee.value = data.baseFee ?? 350
      platformConvenienceFee.value = data.convenienceFee ?? 50
      platformProcessingFee.value = data.platformProcessingFee ?? 0
    }
  } catch (error) {
    console.error('Failed to fetch platform settings', error)
    // Fallbacks if API fails
    platformBaseFee.value = 350
    platformConvenienceFee.value = 50
  }
}

onMounted(() => {
  fetchOrders()
  fetchUserProfile()
  fetchPlatformSettings()
})
</script>

<style scoped>
@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.animate-slide-up {
  animation: slideUp 0.3s ease-out forwards;
}
</style>
