<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[100] bg-[#fafafa] flex flex-col overflow-hidden animate-slide-up">
      <!-- Header -->
      <header class="bg-white border-b border-gray-100/60 shrink-0">
        <div class="max-w-[1400px] mx-auto px-4 md:px-5 py-3 flex items-center justify-between">
          <button @click="handleBack" class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <ArrowLeft class="w-5 h-5 text-gray-700" />
          </button>
          
          <div class="flex items-center gap-2 md:gap-4 text-xs font-bold text-gray-400">
            <span :class="{'text-gray-900': step === 'services'}">Services</span>
            <ChevronRight class="w-3 h-3" />
            <span :class="{'text-gray-900': step === 'time'}">Time</span>
            <ChevronRight class="w-3 h-3" />
            <span :class="{'text-gray-900': step === 'confirm'}">Confirm</span>
          </div>

          <button @click="$emit('close')" class="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
            <X class="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </header>

      <!-- Main Content -->
      <main class="flex-1 overflow-y-auto">
        <div class="max-w-[1400px] mx-auto px-4 md:px-4 py-5 lg:py-5 flex flex-col lg:flex-row gap-6 lg:gap-16 pb-44 lg:pb-8">
          
          <!-- LEFT COLUMN (Dynamic steps) -->
          <div class="flex-1 max-w-3xl">
            
            <!-- STEP 1: SERVICES -->
            <div v-show="step === 'services'" class="space-y-5">
              <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Select services</h1>
              
              <!-- Category Pills -->
              <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <button 
                  v-for="cat in categories" 
                  :key="cat"
                  @click="activeCategory = cat"
                  class="whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-bold border-[0.5px] transition-all"
                  :class="activeCategory === cat ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-500 border-gray-200/80 hover:border-gray-300'"
                >
                  {{ cat }}
                </button>
              </div>

              <!-- Services List -->
              <div class="space-y-2.5">
                <div 
                  v-for="service in filteredServices" 
                  :key="service._id"
                  @click="handleAddClick(service)"
                  class="bg-white p-4 rounded-xl border border-gray-100/80 transition-all flex justify-between gap-4 cursor-pointer hover:border-gray-300 hover:shadow-sm text-left group"
                >
                  <div>
                    <h3 class="font-bold text-gray-900 text-sm group-hover:text-parentPrimary transition-colors">{{ service.name }}</h3>
                    <p class="text-xs text-gray-400 mt-0.5">
                      {{ service.variants?.length ? `${service.durationInMinutes} – ${Math.max(...service.variants.map((v:any)=>v.durationInMinutes))} mins` : `${service.durationInMinutes} mins` }}
                    </p>
                    <p class="text-[11px] text-gray-400 mt-1.5 line-clamp-2 leading-relaxed max-w-xl">{{ service.description }}</p>
                    <p class="text-sm font-bold text-gray-900 mt-3">
                      {{ service.variants?.length ? 'from ' : '' }}NGN {{ service.price.toLocaleString() }}
                    </p>
                  </div>
                  <div 
                    class="w-9 h-9 rounded-full border border-gray-200/80 flex items-center justify-center group-hover:bg-gray-50 group-hover:border-gray-300 transition-colors shrink-0 self-center"
                  >
                    <Plus class="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
                  </div>
                </div>
              </div>

              <!-- Mobile: Cart preview on services step -->
              <div v-if="cart.length" class="lg:hidden bg-white rounded-xl border border-gray-100/80 overflow-hidden mt-4">
                <div class="px-4 py-3 border-b border-gray-50 flex justify-between items-center">
                  <span class="text-xs font-bold text-gray-500">Cart ({{ cart.length }})</span>
                  <span class="text-xs font-bold text-gray-900">NGN {{ cartTotal.toLocaleString() }}</span>
                </div>
                <div class="px-4 py-2.5 space-y-2">
                  <div v-for="(item, idx) in cart" :key="idx" class="flex justify-between items-center text-xs">
                    <div class="flex-1">
                      <span class="font-semibold text-gray-900">{{ item.variantName || item.service.name }}</span>
                      <span class="text-gray-400 ml-1">· {{ item.durationInMinutes }}m</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="font-semibold text-gray-900">NGN {{ getItemTotal(item).toLocaleString() }}</span>
                      <button @click="removeFromCart(idx)" class="text-rose-400 hover:text-rose-600 font-bold text-[10px]">✕</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- STEP 2: TIME -->
            <div v-show="step === 'time'" class="space-y-5 animate-fade-in">
              <div class="flex items-center justify-between">
                <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Select date & time</h1>
                <div class="relative">
                  <button @click="showCalendar = !showCalendar" class="w-9 h-9 rounded-full border-[0.5px] border-gray-200/80 flex items-center justify-center bg-white hover:bg-gray-50 transition-colors">
                    <Calendar class="w-4 h-4 text-gray-500"/>
                  </button>
                  
                  <!-- Custom Calendar Dropdown -->
                  <div v-if="showCalendar" class="absolute right-0 top-12 w-[280px] bg-white rounded-xl border-[0.5px] border-gray-100/80 p-4 z-50" style="box-shadow: 0 4px 16px rgba(0,0,0,0.06);">
                    <div class="flex justify-between items-center mb-3">
                      <h3 class="font-bold text-gray-900 text-sm">{{ formatMonthYear(calendarDate) }}</h3>
                      <div class="flex gap-1">
                        <button @click="prevMonth" class="p-1.5 hover:bg-gray-50 rounded-full transition-colors"><ChevronLeft class="w-4 h-4"/></button>
                        <button @click="nextMonth" class="p-1.5 hover:bg-gray-50 rounded-full transition-colors"><ChevronRight class="w-4 h-4"/></button>
                      </div>
                    </div>
                    
                    <div class="grid grid-cols-7 gap-1 mb-2">
                      <span v-for="d in ['Su','Mo','Tu','We','Th','Fr','Sa']" :key="d" class="text-[10px] font-bold text-gray-400 text-center uppercase">{{d}}</span>
                    </div>
                    
                    <div class="grid grid-cols-7 gap-1">
                      <div v-for="blank in blankDays" :key="'blank-'+blank" class="h-8"></div>
                      <button 
                        v-for="day in daysInMonth" :key="day"
                        @click="isCalendarDayClosed(day) ? null : selectDateFromCalendar(day)"
                        class="h-8 w-full rounded-full flex items-center justify-center text-xs font-bold transition-all"
                        :class="getCalendarDayClass(day)"
                        :disabled="isCalendarDayClosed(day)"
                      >
                        {{ day }}
                      </button>
                    </div>
                    
                    <div class="mt-3 flex justify-between border-t border-gray-50 pt-3">
                      <button @click="selectedDate = ''; showCalendar = false" class="text-xs font-bold text-gray-400 hover:text-gray-600">Clear</button>
                      <button @click="goToToday" class="text-xs font-bold text-parentPrimary hover:brightness-110">Today</button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-3">
                <h3 class="font-semibold text-gray-900 text-sm">Select a date</h3>
                <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  <button 
                    v-for="date in availableDates" 
                    :key="date.iso"
                    @click="selectedDate = date.iso"
                    class="relative min-w-[60px] h-[70px] rounded-full flex flex-col items-center justify-center border-[0.5px] transition-all shrink-0 overflow-hidden"
                    :class="selectedDate === date.iso ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200/60 hover:border-gray-300'"
                  >
                    <div v-if="selectedDate === date.iso && fetchingAvailability" class="absolute inset-0 z-10 flex items-center justify-center bg-gray-900/80 rounded-full">
                      <Loader2 class="w-5 h-5 text-white animate-spin" />
                    </div>
                    <span class="text-[10px] font-medium opacity-70">{{ date.dayStr }}</span>
                    <span class="text-lg font-bold mt-0.5">{{ date.dayNum }}</span>
                    <span class="text-[9px] font-medium opacity-70">{{ date.monthStr }}</span>
                  </button>
                </div>
              </div>

              <div class="space-y-3 relative min-h-[200px] mt-4">
                <h3 class="font-semibold text-gray-900 text-sm">Pick a time</h3>
                
                <div v-if="fetchingAvailability" class="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl">
                  <Loader2 class="w-8 h-8 text-parentPrimary animate-spin mb-2" />
                  <span class="text-xs font-bold text-gray-600">Loading availability...</span>
                </div>

                <div v-if="availableTimes.length" class="flex flex-col space-y-2 max-h-[350px] overflow-y-auto pr-2">
                  <button 
                    v-for="time in availableTimes" 
                    :key="time"
                    @click="handleTimeSelection(time)"
                    :disabled="!selectedDate || isTimeBooked(time)"
                    class="text-left px-4 py-3.5 rounded-xl border transition-all text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
                    :class="[
                      selectedTime === time 
                        ? 'bg-parentPrimary border-parentPrimary text-white shadow-sm' 
                        : (isTimeBooked(time) 
                            ? 'bg-gray-50 border-gray-100 text-gray-400' 
                            : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300')
                    ]"
                  >
                    <div class="flex items-center justify-between w-full">
                      <div>
                        {{ time }}
                        <span v-if="isTimeBooked(time) && selectedTime === time" class="block text-[10px] mt-0.5">Waitlist</span>
                      </div>
                      <span class="text-[9px] px-2 py-1 rounded-full font-bold uppercase tracking-wider opacity-90" :class="getTimeTagColor(time, selectedTime === time)">
                        {{ getTimeTag(time) }}
                      </span>
                    </div>
                  </button>
                </div>
                <div v-else class="flex flex-col items-center justify-center py-10 px-4 text-center bg-gray-50/50 rounded-[2rem] border border-gray-100/80 border-dashed">
                  <div class="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                    <CalendarX class="w-6 h-6 text-gray-400" />
                  </div>
                  <h4 class="text-gray-900 font-semibold text-sm mb-1">Fully Booked</h4>
                  <p class="text-xs text-gray-500 max-w-[200px]">There are no available time slots on this date. Please try selecting another day.</p>
                </div>
              </div>
            </div>

            <!-- STEP 3: CONFIRM -->
            <div v-show="step === 'confirm'" class="space-y-4 animate-fade-in max-w-xl mx-auto lg:mx-0">
              <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Confirm & Pay</h1>
              
              <!-- Mobile Cart Summary -->
              <div class="lg:hidden bg-white rounded-xl border-[0.5px] border-gray-100 overflow-hidden">
                <div class="px-4 py-3 border-b border-gray-50 flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    <video v-if="vendor.logo && vendor.logo.match(/\\.(mp4|webm|ogg|mov)$/i)" :src="vendor.logo" class="w-full h-full object-cover" autoplay loop muted playsinline></video>
                    <img v-else :src="vendor.logo || '/placeholder-store.jpg'" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-1">
                    <h3 class="font-bold text-gray-900 text-xs">{{ vendor.storeName }}</h3>
                    <p class="text-[11px] text-gray-400 mt-0.5">{{ formatDate(selectedDate) }} · {{ selectedTime }}</p>
                  </div>
                </div>
                <div class="px-4 py-2.5 space-y-2">
                  <div v-for="(item, idx) in cart" :key="idx" class="flex justify-between items-center">
                    <div class="flex-1">
                      <p class="text-xs font-semibold text-gray-900">{{ item.variantName || item.service.name }}</p>
                      <p class="text-[10px] text-gray-400">{{ item.durationInMinutes }}m{{ item.variantName ? ` · ${item.service.name}` : '' }}</p>
                      <div v-if="item.extras?.length" class="mt-1 space-y-0.5">
                        <div v-for="ext in item.extras" :key="ext.name" class="flex justify-between text-[10px] text-gray-400">
                          <span>+ {{ ext.name }}</span>
                          <span>₦{{ ext.price.toLocaleString() }}</span>
                        </div>
                      </div>
                    </div>
                    <span class="text-xs font-bold text-gray-900 ml-3">₦{{ getItemTotal(item).toLocaleString() }}</span>
                  </div>
                </div>
                <div class="px-4 py-3 border-t border-gray-50 bg-gray-50/50 flex flex-col gap-2">
                  <div class="flex justify-between items-center text-gray-500">
                    <span class="text-sm">Total Price</span>
                    <span class="text-sm font-semibold">NGN {{ cartTotal.toLocaleString() }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm font-bold text-gray-900">Commitment Fee (To Pay Now)</span>
                    <span class="text-sm font-bold text-parentPrimary">NGN {{ commitmentFee.toLocaleString() }}</span>
                  </div>
                  <div class="flex justify-between items-center text-gray-500">
                    <span class="text-sm font-medium">Balance to Pay in Person</span>
                    <span class="text-sm font-medium">NGN {{ pendingBalance.toLocaleString() }}</span>
                  </div>
                </div>
              </div>

              <div class="bg-white p-4 rounded-xl border-[0.5px] border-gray-100 space-y-3">
                <h3 class="font-semibold text-gray-900 text-sm">Booking Notes</h3>
                <textarea 
                  v-model="bookingNotes" 
                  rows="2" 
                  placeholder="Any special requests?"
                  class="w-full bg-gray-50 border border-gray-100/80 rounded-lg p-3 text-base outline-none focus:border-parentPrimary focus:ring-1 focus:ring-parentPrimary/20 transition-all resize-none"
                ></textarea>
              </div>

              <!-- Payment Method -->
              <div class="bg-white p-4 rounded-xl border border-gray-100/80 space-y-4">
                <h3 class="font-semibold text-gray-900 text-sm">Payment Method</h3>
                
                <div class="flex flex-col gap-3">
                  <!-- Paystack Option -->
                  <label class="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors" :class="paymentMethod === 'paystack' ? 'border-parentPrimary bg-parentPrimary/5' : 'border-gray-100 hover:border-gray-200'">
                    <input type="radio" v-model="paymentMethod" value="paystack" class="hidden" />
                    <div class="w-4 h-4 rounded-full border flex items-center justify-center shrink-0" :class="paymentMethod === 'paystack' ? 'border-parentPrimary' : 'border-gray-300'">
                      <div v-if="paymentMethod === 'paystack'" class="w-2 h-2 rounded-full bg-parentPrimary"></div>
                    </div>
                    <div class="flex-1">
                      <h4 class="text-sm font-semibold text-gray-900">Pay Online (Paystack)</h4>
                      <p class="text-xs text-gray-500 mt-0.5">Pay securely with your card or bank transfer.</p>
                    </div>
                  </label>


              </div>
            </div>

          </div>

          <!-- RIGHT COLUMN (Cart Summary) -->
          <div class="hidden lg:block w-[400px] shrink-0">
            <div class="sticky top-8 bg-white rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-8rem)] border border-gray-100/80">
              
              <!-- Vendor Info -->
              <div class="p-4 border-b border-gray-50 flex gap-4 items-center shrink-0">
                <div class="w-14 h-14 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                  <video v-if="vendor.logo && vendor.logo.match(/\\.(mp4|webm|ogg|mov)$/i)" :src="vendor.logo" class="w-full h-full object-cover" autoplay loop muted playsinline></video>
                  <img v-else :src="vendor.logo || '/placeholder-store.jpg'" class="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 truncate">{{ vendor.storeName }}</h3>
                  <div class="flex items-center gap-1 text-xs font-bold text-gray-900 mt-1">
                    {{ vendor.rating?.toFixed(1) || '5.0' }} <Star class="w-3 h-3 text-amber-400 fill-amber-400" /> 
                    <span class="text-gray-400 font-normal">({{ vendor.totalRatings || 0 }})</span>
                  </div>
                  <p class="text-xs text-gray-500 mt-0.5 truncate">{{ vendor.address }}</p>
                </div>
              </div>

              <!-- Selected Time (if Time step passed) -->
              <div v-if="selectedDate && selectedTime && step !== 'services'" class="p-4 border-b border-gray-50 bg-gray-50/50 shrink-0 space-y-2">
                <div class="flex items-center gap-3 text-sm text-gray-900 font-medium">
                  <Calendar class="w-4 h-4 text-gray-400" />
                  {{ formatDate(selectedDate) }}
                </div>
                <div class="flex items-center gap-3 text-sm text-gray-900 font-medium">
                  <Clock class="w-4 h-4 text-gray-400" />
                  {{ selectedTime }} ({{ totalDurationMins }} mins duration)
                </div>
              </div>

              <!-- Cart Items -->
              <div class="flex-1 overflow-y-auto p-4 space-y-4">
                <template v-if="cart.length">
                  <div v-for="(item, idx) in cart" :key="idx" class="flex justify-between items-start gap-4">
                    <div class="flex-1">
                      <p class="text-sm font-bold text-gray-900">{{ item.variantName ? item.variantName : item.service.name }}</p>
                      <p class="text-xs text-gray-500 font-medium mt-0.5">{{ item.durationInMinutes }} mins {{ item.variantName ? `with ${item.service.name}` : '' }}</p>
                      
                      <!-- Extras -->
                      <div v-if="item.extras?.length" class="mt-2 space-y-1">
                        <div v-for="ext in item.extras" :key="ext.name" class="flex justify-between text-xs text-gray-500">
                          <span>+ {{ ext.name }}</span>
                          <span class="font-medium">NGN {{ ext.price.toLocaleString() }}</span>
                        </div>
                      </div>
                      
                      <button @click="removeFromCart(idx)" class="text-[10px] font-bold text-rose-500 hover:underline mt-2">Remove</button>
                    </div>
                    <span class="text-sm font-bold text-gray-900">NGN {{ getItemTotal(item).toLocaleString() }}</span>
                  </div>
                </template>
                <div v-else class="text-sm text-gray-500 py-4">No services selected</div>
              </div>

              <!-- Footer -->
              <div class="p-4 border-t border-gray-100 bg-white shrink-0">
                <div class="flex justify-between items-center mb-1 text-gray-500">
                  <span class="text-sm">Total Price</span>
                  <span class="text-sm font-semibold text-gray-900">{{ cart.length ? `NGN ${cartTotal.toLocaleString()}` : 'free' }}</span>
                </div>
                <div class="flex justify-between items-center mb-1">
                  <span class="font-bold text-gray-900">Commitment Fee (Pay Now)</span>
                  <span class="font-bold text-parentPrimary text-lg">{{ cart.length ? `NGN ${commitmentFee.toLocaleString()}` : 'free' }}</span>
                </div>
                <div class="flex justify-between items-center mb-4 text-gray-500">
                  <span class="text-xs font-medium">Balance (Pay in Person)</span>
                  <span class="text-xs font-medium text-gray-900">{{ cart.length ? `NGN ${pendingBalance.toLocaleString()}` : 'free' }}</span>
                </div>
                <button 
                  @click="handleContinue"
                  :disabled="!canContinue"
                  class="w-full py-3 bg-[#1a1a1a] text-white rounded-xl font-bold text-sm shadow-sm border border-gray-100 hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
                  <template v-else-if="step === 'time' && isTimeBooked(selectedTime)">Join Waitlist <ArrowRight class="w-4 h-4" /></template>
                  <template v-else>Continue <ArrowRight class="w-4 h-4" /></template>
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>

      <!-- Mobile Footer (Bottom Sheet) -->
      <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100/60 z-50 flex flex-col rounded-t-[24px] shadow-[0_-4px_30px_rgba(0,0,0,0.06)] transition-all duration-300 transform translate-y-0">
        
        <!-- Pull tab / Handle -->
        <div v-if="cart.length" @click="showMobileSummary = !showMobileSummary" class="w-full flex justify-center pt-3 pb-2 cursor-pointer active:bg-gray-50/50 rounded-t-[24px]">
          <div class="w-10 h-1.5 bg-gray-200 rounded-full"></div>
        </div>

        <div class="px-5 pb-6 pt-1 flex flex-col gap-3">
          <!-- Expanded Cart Summary -->
          <div v-show="showMobileSummary && cart.length" class="animate-slide-up border-b border-gray-100 pb-4 mb-2 max-h-[50vh] overflow-y-auto pr-2">
            <div class="flex justify-between items-center mb-4">
              <h3 class="font-bold text-gray-900 text-[15px]">Booking Summary</h3>
            </div>
            
            <div class="space-y-4">
              <div v-for="(item, idx) in cart" :key="idx" class="flex justify-between items-start gap-4 bg-gray-50/50 p-3 rounded-xl border border-gray-50">
                <div class="flex-1">
                  <p class="text-sm font-bold text-gray-900">{{ item.variantName ? item.variantName : item.service.name }}</p>
                  <p class="text-[11px] text-gray-500 font-medium mt-0.5">{{ item.durationInMinutes }} mins {{ item.variantName ? `with ${item.service.name}` : '' }}</p>
                  
                  <!-- Extras -->
                  <div v-if="item.extras?.length" class="mt-2 space-y-1 bg-white p-2 rounded-lg border border-gray-100">
                    <div v-for="ext in item.extras" :key="ext.name" class="flex justify-between text-[11px] text-gray-500">
                      <span>+ {{ ext.name }}</span>
                      <span class="font-semibold text-gray-700">₦{{ ext.price.toLocaleString() }}</span>
                    </div>
                  </div>
                  <button @click="removeFromCart(idx)" class="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-1 rounded-md mt-2">Remove</button>
                </div>
                <span class="text-sm font-bold text-gray-900">₦{{ getItemTotal(item).toLocaleString() }}</span>
              </div>
            </div>
            
            <div class="mt-4 pt-4 border-t border-gray-100 flex flex-col gap-2.5">
              <div class="flex justify-between items-center text-gray-500 text-sm">
                <span>Total Service Price</span>
                <span class="font-bold text-gray-700">₦{{ cartTotal.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between items-center font-bold text-gray-900 text-sm bg-parentPrimary/5 p-2 rounded-lg">
                <span>Commitment Fee (Pay Now)</span>
                <span class="text-parentPrimary">₦{{ commitmentFee.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between items-center text-gray-500 text-xs">
                <span>Balance (Pay in Person)</span>
                <span class="font-bold text-gray-600">₦{{ pendingBalance.toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <!-- Collapsed view / Always visible action row -->
          <div class="flex items-center gap-4">
            <div v-if="cart.length && step !== 'confirm'" class="flex-1 cursor-pointer select-none" @click="showMobileSummary = !showMobileSummary">
              <p class="text-[11px] font-bold text-gray-400 mb-0.5 flex items-center gap-1">
                {{ cart.length }} service(s) 
                <ChevronUp class="w-3.5 h-3.5 text-gray-400 transition-transform duration-300" :class="{'rotate-180': showMobileSummary}" />
              </p>
              <p class="text-lg font-black text-gray-900 leading-none">₦{{ commitmentFee.toLocaleString() }} <span class="text-[10px] font-semibold text-gray-400 ml-0.5">fee</span></p>
            </div>
            
            <button 
              @click="handleContinue"
              :disabled="!canContinue"
              class="py-3.5 bg-[#1a1a1a] text-white rounded-2xl font-bold text-[15px] hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm border border-gray-100 shadow-black/10"
              :class="cart.length && step !== 'confirm' ? 'flex-[1.2]' : 'w-full'"
            >
              <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
              <template v-else-if="step === 'confirm'">
                <span v-if="paymentMethod === 'direct_transfer'">Submit Booking</span>
                <span v-else>Pay ₦{{ commitmentFee.toLocaleString() }}</span> 
                <ArrowRight class="w-4 h-4" />
              </template>
              <template v-else-if="step === 'time' && isTimeBooked(selectedTime)">Waitlist <ArrowRight class="w-4 h-4" /></template>
              <template v-else>Continue <ArrowRight class="w-4 h-4" /></template>
            </button>
          </div>
        </div>
      </div>

      <!-- Full Screen Loading Overlay -->
      <div v-if="showFullLoadingOverlay" class="fixed inset-0 z-[200] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in">
        <div class="relative w-24 h-24 flex items-center justify-center">
          <div class="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
          <div class="absolute inset-0 border-[3px] border-parentPrimary rounded-full border-t-transparent animate-spin"></div>
          <div class="w-12 h-12 bg-parentPrimary/10 rounded-full flex items-center justify-center animate-pulse">
            <CreditCard class="w-6 h-6 text-parentPrimary" />
          </div>
        </div>
        <h2 class="mt-8 text-2xl font-bold text-gray-900 tracking-tight animate-pulse">Securing your booking</h2>
        <p class="text-sm text-gray-500 mt-2 font-medium">Preparing secure checkout via Paystack...</p>
      </div>

      <!-- Modals -->
      <VariantSelectionModal 
        v-if="showVariantModal" 
        :service="selectedServiceToAdd" 
        @close="showVariantModal = false"
        @add="handleAddServiceToCart"
      />

      <ExtraServiceModal 
        v-if="showExtraModal" 
        :service="cart[cart.length - 1]?.service" 
        @close="handleExtraModalClose"
        @add="handleAddExtraToLastItem"
      />

      <CheckoutAuthModal
        v-model="showAuthModal"
        @authenticated="processBooking"
        @guest-checkout="processGuestBooking"
      />

      <WaitlistModal
        v-if="showWaitlistModal"
        :vendor="vendor"
        :date="selectedDate"
        :time="selectedTime"
        :service="cart[0]?.service"
        @close="showWaitlistModal = false"
        @joined="showWaitlistModal = false; emit('close')"
      />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ArrowLeft, ChevronLeft, ChevronRight, ChevronUp, X, Calendar, Plus, Clock, MapPin, Star, ArrowRight, Loader2, CreditCard, CalendarX, Copy, Share2 } from 'lucide-vue-next';
import { appointments_api } from '@/api_factory/modules/appointments';
import { upload_api } from '@/api_factory/modules/upload';
import VariantSelectionModal from './VariantSelectionModal.vue';
import ExtraServiceModal from './ExtraServiceModal.vue';
import CheckoutAuthModal from '@/components/CheckoutAuthModal.vue';
import WaitlistModal from './WaitlistModal.vue';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { useUser } from '@/composables/modules/auth/user';

const props = defineProps<{
  vendor: any;
  services: any[];
  initialService?: any;
}>();

const emit = defineEmits(['close']);
const { showToast } = useCustomToast();
const { user } = useUser();
const router = useRouter();

const step = ref<'services'|'time'|'confirm'>('services');
const loading = ref(false);
const showFullLoadingOverlay = ref(false);
const activeCategory = ref('Featured');
const bookingNotes = ref('');
const commitmentFeePercentage = ref(30);
const showMobileSummary = ref(false);

const paymentMethod = ref<'paystack'|'direct_transfer'>('paystack');
const proofOfPaymentFile = ref<File | null>(null);
const proofOfPaymentPreview = ref<string | null>(null);

// Cart State
const cart = ref<any[]>([]);

// Modals State
const showVariantModal = ref(false);
const selectedServiceToAdd = ref<any>(null);
const showExtraModal = ref(false);
const showAuthModal = ref(false);

// Date/Time State
const selectedDate = ref('');
const selectedTime = ref('');
const bookedTimes = ref<string[]>([]);
const fetchingAvailability = ref(false);

// Waitlist State
const showWaitlistModal = ref(false);

// Guest State
const guestData = ref<any>(null);

// Computed
const categories = computed(() => {
  const cats = ['Featured'];
  props.services.forEach(s => {
    if (s.category && !cats.includes(s.category)) cats.push(s.category);
  });
  return cats;
});

const filteredServices = computed(() => {
  if (activeCategory.value === 'Featured') return props.services.slice(0, 5);
  return props.services.filter(s => s.category === activeCategory.value);
});

const cartTotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + getItemTotal(item), 0);
});

const commitmentFee = computed(() => {
  return Math.round(cartTotal.value * (commitmentFeePercentage.value / 100));
});

const pendingBalance = computed(() => {
  return cartTotal.value - commitmentFee.value;
});

const totalDurationMins = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.durationInMinutes + (item.extras?.reduce((s:number, e:any)=>s+e.durationInMinutes,0)||0), 0);
});

const canContinue = computed(() => {
  if (step.value === 'services') return cart.value.length > 0;
  if (step.value === 'time') return !!selectedDate.value && !!selectedTime.value;
  if (step.value === 'confirm') {
    if (paymentMethod.value === 'direct_transfer' && !proofOfPaymentFile.value) {
      return false;
    }
    return true;
  }
  return false;
});

// Methods
const handleBack = () => {
  if (step.value === 'confirm') step.value = 'time';
  else if (step.value === 'time') step.value = 'services';
  else emit('close');
};

const handleAddClick = (service: any) => {
  if (service.variants && service.variants.length > 0) {
    selectedServiceToAdd.value = service;
    showVariantModal.value = true;
  } else {
    // Add base service
    cart.value.push({
      service,
      variantName: '',
      price: service.price,
      durationInMinutes: service.durationInMinutes,
      extras: []
    });
    checkExtrasAndPrompt(service);
  }
};

const handleAddServiceToCart = (payload: any) => {
  cart.value.push(payload);
  showVariantModal.value = false;
  checkExtrasAndPrompt(payload.service);
};

const checkExtrasAndPrompt = (service: any) => {
  if (service.extras && service.extras.length > 0) {
    showExtraModal.value = true;
  }
};

const handleExtraModalClose = () => {
  showExtraModal.value = false;
};

const handleAddExtraToLastItem = (extra: any) => {
  const lastItem = cart.value[cart.value.length - 1];
  if (lastItem) {
    lastItem.extras.push(extra);
  }
  showExtraModal.value = false;
};

const removeFromCart = (idx: number) => {
  cart.value.splice(idx, 1);
};

const getItemTotal = (item: any) => {
  let total = item.price;
  if (item.extras) {
    total += item.extras.reduce((sum: number, ext: any) => sum + ext.price, 0);
  }
  return total;
};

const isDayClosed = (dateObj: Date) => {
  if (!props.vendor?.businessHours || props.vendor.businessHours.length === 0) return false;
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const schedule = props.vendor.businessHours.find((b: any) => b.day.toLowerCase() === dayName);
  return schedule?.isClosed || false;
};

// Date Generation
const availableDates = computed(() => {
  const dates = [];
  let baseDate = new Date();
  
  if (selectedDate.value) {
    const [y, m, d] = selectedDate.value.split('-');
    baseDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
  }

  let i = 0;
  while (dates.length < 14 && i < 60) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);
    
    if (!isDayClosed(d)) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      
      dates.push({
        iso: `${year}-${month}-${day}`,
        dayStr: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: d.getDate(),
        monthStr: d.toLocaleDateString('en-US', { month: 'short' })
      });
    }
    i++;
  }
  return dates;
});

// Custom Calendar Logic
const showCalendar = ref(false);
const calendarDate = ref(new Date());

const formatMonthYear = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

const prevMonth = () => {
  calendarDate.value = new Date(calendarDate.value.getFullYear(), calendarDate.value.getMonth() - 1, 1);
};

const nextMonth = () => {
  calendarDate.value = new Date(calendarDate.value.getFullYear(), calendarDate.value.getMonth() + 1, 1);
};

const goToToday = () => {
  calendarDate.value = new Date();
  selectDateFromCalendar(calendarDate.value.getDate(), calendarDate.value.getMonth(), calendarDate.value.getFullYear());
};

const blankDays = computed(() => {
  const firstDay = new Date(calendarDate.value.getFullYear(), calendarDate.value.getMonth(), 1).getDay();
  return firstDay;
});

const daysInMonth = computed(() => {
  return new Date(calendarDate.value.getFullYear(), calendarDate.value.getMonth() + 1, 0).getDate();
});

const selectDateFromCalendar = (day: number, month?: number, year?: number) => {
  const y = year ?? calendarDate.value.getFullYear();
  const m = month ?? calendarDate.value.getMonth();
  const d = new Date(y, m, day);
  
  const isoYear = d.getFullYear();
  const isoMonth = String(d.getMonth() + 1).padStart(2, '0');
  const isoDay = String(d.getDate()).padStart(2, '0');
  
  selectedDate.value = `${isoYear}-${isoMonth}-${isoDay}`;
  showCalendar.value = false;
};

const isCalendarDayClosed = (day: number) => {
  const d = new Date(calendarDate.value.getFullYear(), calendarDate.value.getMonth(), day);
  return isDayClosed(d);
};

const getCalendarDayClass = (day: number) => {
  const d = new Date(calendarDate.value.getFullYear(), calendarDate.value.getMonth(), day);
  if (isDayClosed(d)) return 'text-gray-300 bg-gray-50/50 cursor-not-allowed opacity-50';

  const isoYear = d.getFullYear();
  const isoMonth = String(d.getMonth() + 1).padStart(2, '0');
  const isoDay = String(d.getDate()).padStart(2, '0');
  const iso = `${isoYear}-${isoMonth}-${isoDay}`;
  
  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  if (selectedDate.value === iso) return 'bg-parentPrimary text-white shadow-sm border border-gray-100 font-bold';
  if (todayIso === iso) return 'bg-gray-100 text-gray-900 font-bold border border-gray-200';
  return 'text-gray-600 hover:bg-gray-50 border border-transparent';
};

const availableTimes = computed(() => {
  try {
    if (!selectedDate.value) return [];
    const dateObj = new Date(selectedDate.value);
    const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    let schedule = undefined;
    if (Array.isArray(props.vendor?.businessHours)) {
      schedule = props.vendor.businessHours.find((b: any) => b.day?.trim().toLowerCase() === dayName);
    }
    
    if (!schedule) {
      schedule = { day: dayName, open: '00:00', close: '23:59', isClosed: false };
    }
    
    if (schedule.isClosed) return [];

    const openTime = String(schedule.open || '00:00');
    const closeTime = String(schedule.close || '23:59');

    const [openHourStr, openMinStr] = openTime.split(':');
    const [closeHourStr, closeMinStr] = closeTime.split(':');

    const openHour = parseInt(openHourStr || '0', 10);
    const openMin = parseInt(openMinStr || '0', 10);
    const closeHour = parseInt(closeHourStr || '23', 10);
    const closeMin = parseInt(closeMinStr || '59', 10);

    const startTotalMins = (isNaN(openHour) ? 0 : openHour) * 60 + (isNaN(openMin) ? 0 : openMin);
    let endTotalMins = (isNaN(closeHour) ? 23 : closeHour) * 60 + (isNaN(closeMin) ? 59 : closeMin);
    
    if (endTotalMins < startTotalMins) {
      endTotalMins = 1439; // Fallback if close time is somehow before open time
    }

    const interval = 10; // Split times by 10 minutes as requested

    const times = [];
    for (let mins = startTotalMins; mins + interval <= endTotalMins; mins += interval) {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      
      const modifier = h >= 12 ? 'pm' : 'am';
      let displayHour = h > 12 ? h - 12 : h;
      if (displayHour === 0) displayHour = 12;
      const displayMin = String(m).padStart(2, '0');

      times.push(`${displayHour}:${displayMin} ${modifier}`);
    }

    if (times.length === 0) {
      // If for some reason we generated 0 times (e.g. interval > difference between open and close)
      // let's push at least one fallback time so it's not totally empty if they are technically open.
      times.push('12:00 pm');
    }

    return times;
  } catch (err) {
    console.error('Error computing availableTimes:', err);
    return ['09:00 am', '10:00 am', '11:00 am', '12:00 pm', '01:00 pm', '02:00 pm']; // Emergency fallback
  }
});

const isTimeBooked = (timeStr: string) => {
  if (!selectedDate.value || !timeStr) return false;
  const parts = timeStr.split(' ');
  if (parts.length < 1) return false;
  const time = parts[0];
  const modifier = parts[1];
  
  const timeParts = time.split(':');
  if (timeParts.length < 2) return false;
  
  let [hours, minutes] = timeParts.map(Number);
  if (isNaN(hours) || isNaN(minutes)) return false;

  if (modifier === 'pm' && hours !== 12) hours += 12;
  if (modifier === 'am' && hours === 12) hours = 0;
  
  const slotStartMins = hours * 60 + minutes;
  const slotEndMins = slotStartMins + (totalDurationMins.value || 10);

  for (const booked of bookedTimes.value) {
    if (typeof booked === 'string') {
      const [h, m] = booked.split(':').map(Number);
      const bookedStartMins = h * 60 + m;
      const bookedEndMins = bookedStartMins + 10; // Fallback
      if (slotStartMins < bookedEndMins && slotEndMins > bookedStartMins) return true;
      continue;
    }

    if (booked.startTime && booked.endTime) {
      const [startH, startM] = booked.startTime.split(':').map(Number);
      const [endH, endM] = booked.endTime.split(':').map(Number);
      const bookedStartMins = startH * 60 + startM;
      const bookedEndMins = endH * 60 + endM;
      
      // Two intervals [A_start, A_end] and [B_start, B_end] overlap if A_start < B_end and A_end > B_start
      if (slotStartMins < bookedEndMins && slotEndMins > bookedStartMins) {
        return true;
      }
    }
  }

  return false;
};

const getTimeTag = (timeStr: string) => {
  if (isTimeBooked(timeStr)) return 'Booked';
  const parts = timeStr.split(' ');
  if (parts.length < 2) return '';
  const time = parts[0];
  const modifier = parts[1].toLowerCase();
  
  const [hourStr] = time.split(':');
  let hour = parseInt(hourStr, 10);
  
  if (modifier === 'pm' && hour !== 12) hour += 12;
  if (modifier === 'am' && hour === 12) hour = 0;
  
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
};

const getTimeTagColor = (timeStr: string, isSelected: boolean) => {
  if (isSelected) return 'bg-white/20 text-white';
  
  const tag = getTimeTag(timeStr);
  if (tag === 'Booked') return 'bg-red-50 text-red-600 border border-red-100';
  if (tag === 'Morning') return 'bg-amber-50 text-amber-600 border border-amber-100';
  if (tag === 'Afternoon') return 'bg-orange-50 text-orange-600 border border-orange-100';
  return 'bg-indigo-50 text-indigo-600 border border-indigo-100';
};

import { watch } from 'vue';

watch(selectedDate, async (newDate) => {
  selectedTime.value = '';
  if (!newDate) {
    bookedTimes.value = [];
    return;
  }
  
  fetchingAvailability.value = true;
  try {
    const [res] = await Promise.all([
      appointments_api.getVendorAvailability(props.vendor._id, newDate),
      new Promise(resolve => setTimeout(resolve, 800)) // Ensure spinner is visible for at least 800ms
    ]);
    const apiBookings = res.data?.data || res.data || [];
    
    // Inject vendor breaks for the selected day
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const selectedDayName = dayNames[new Date(newDate).getDay()];
    
    let breaks = [];
    if (props.vendor && props.vendor.businessHours) {
      const schedule = props.vendor.businessHours.find(h => h.day === selectedDayName);
      if (schedule && schedule.breaks) {
        breaks = schedule.breaks.map(b => ({
          startTime: b.start,
          endTime: b.end
        }));
      }
    }
    
    bookedTimes.value = [...apiBookings, ...breaks];
  } catch (err) {
    console.error('Failed to fetch availability', err);
    bookedTimes.value = [];
  } finally {
    fetchingAvailability.value = false;
  }
}, { immediate: true });

const handleTimeSelection = (time: string) => {
  if (!selectedDate.value) {
    showToast({ title: 'Notice', message: 'Please select a date first.', toastType: 'warning' });
    return;
  }
  selectedTime.value = time;
};

const formatDate = (iso: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
};

// Submission
const handleContinue = async () => {
  if (step.value === 'services') {
    step.value = 'time';
  } else if (step.value === 'time') {
    if (isTimeBooked(selectedTime.value)) {
      showWaitlistModal.value = true;
      return;
    }
    step.value = 'confirm';
  } else if (step.value === 'confirm') {
    if (!user.value) {
      showAuthModal.value = true;
      return;
    }
    await processBooking();
  }
};

const processBooking = async () => {
  loading.value = true;
  showFullLoadingOverlay.value = true;
  try {
    // Calculate end time
    const parts = (selectedTime.value || '12:00 am').split(' ');
    const timeStr = parts[0];
    const modifier = parts[1];
    
    const timeParts = timeStr.split(':');
    let hours = parseInt(timeParts[0] || '12', 10);
    let minutes = parseInt(timeParts[1] || '0', 10);

    if (modifier === 'pm' && hours !== 12) hours += 12;
    if (modifier === 'am' && hours === 12) hours = 0;
    
    const endD = new Date(selectedDate.value);
    endD.setHours(hours, minutes + totalDurationMins.value);
    const endTime = `${endD.getHours().toString().padStart(2, '0')}:${endD.getMinutes().toString().padStart(2, '0')}`;
    
    const startTime24 = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    const payload: any = {
      vendor: props.vendor._id,
      scheduledDate: selectedDate.value,
      startTime: startTime24,
      endTime: endTime,
      notes: bookingNotes.value,
      paymentMethod: paymentMethod.value,
      items: cart.value.map(item => ({
        service: item.service._id,
        variantName: item.variantName,
        price: item.price,
        durationInMinutes: item.durationInMinutes,
        extras: item.extras?.map((e:any) => ({ name: e.name, price: e.price, durationInMinutes: e.durationInMinutes }))
      }))
    };

    if (paymentMethod.value === 'direct_transfer' && proofOfPaymentFile.value) {
      const uploadRes = await upload_api.uploadFile(proofOfPaymentFile.value, 'image');
      payload.proofOfPayment = uploadRes.data.url;
    }

    const res = await appointments_api.createAppointment(payload);
    if (res.data?.authorization_url) {
      window.location.href = res.data.authorization_url;
    } else {
      showToast({ title: 'Success', message: 'Appointment submitted successfully.', toastType: 'success' });
      emit('close');
      router.push('/dashboard');
    }
  } catch (e: any) {
    showFullLoadingOverlay.value = false;
    showToast({ title: 'Error', message: e.response?.data?.message || 'Payment initialization failed', toastType: 'error' });
  } finally {
    loading.value = false;
  }
};

const processGuestBooking = async (guestDetails: any) => {
  guestData.value = guestDetails;
  loading.value = true;
  showFullLoadingOverlay.value = true;
  showAuthModal.value = false;
  try {
    // Calculate end time
    const parts = (selectedTime.value || '12:00 am').split(' ');
    const timeStr = parts[0];
    const modifier = parts[1];
    
    const timeParts = timeStr.split(':');
    let hours = parseInt(timeParts[0] || '12', 10);
    let minutes = parseInt(timeParts[1] || '0', 10);

    if (modifier === 'pm' && hours !== 12) hours += 12;
    if (modifier === 'am' && hours === 12) hours = 0;
    
    const endD = new Date(selectedDate.value);
    endD.setHours(hours, minutes + totalDurationMins.value);
    const endTime = `${endD.getHours().toString().padStart(2, '0')}:${endD.getMinutes().toString().padStart(2, '0')}`;
    
    const startTime24 = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    const payload: any = {
      vendor: props.vendor._id,
      scheduledDate: selectedDate.value,
      startTime: startTime24,
      endTime: endTime,
      notes: bookingNotes.value,
      guestInfo: guestData.value,
      paymentMethod: paymentMethod.value,
      items: cart.value.map(item => ({
        service: item.service._id,
        variantName: item.variantName,
        price: item.price,
        durationInMinutes: item.durationInMinutes,
        extras: item.extras?.map((e:any) => ({ name: e.name, price: e.price, durationInMinutes: e.durationInMinutes }))
      }))
    };

    if (paymentMethod.value === 'direct_transfer' && proofOfPaymentFile.value) {
      const uploadRes = await upload_api.uploadFile(proofOfPaymentFile.value, 'image');
      payload.proofOfPayment = uploadRes.data.url;
    }

    const res = await appointments_api.createGuestAppointment(payload);
    if (res.data?.authorization_url) {
      window.location.href = res.data.authorization_url;
    } else {
      showToast({ title: 'Success', message: 'Appointment submitted successfully. Please wait for the vendor to verify.', toastType: 'success' });
      emit('close');
      router.push('/dashboard');
    }
  } catch (e: any) {
    showFullLoadingOverlay.value = false;
    showToast({ title: 'Error', message: e.response?.data?.message || 'Payment initialization failed', toastType: 'error' });
  } finally {
    loading.value = false;
  }
};

const copyAccountDetails = async () => {
  const bankName = props.vendor.bankDetails?.bankName || props.vendor.bankName || 'Not specified';
  const accNo = props.vendor.bankDetails?.accountNumber || props.vendor.accountNumber || 'Not specified';
  const accName = props.vendor.bankDetails?.accountName || props.vendor.accountName || 'Not specified';
  const text = `Bank: ${bankName}\nAccount No: ${accNo}\nAccount Name: ${accName}`;
  
  try {
    await navigator.clipboard.writeText(text);
    showToast({ title: 'Copied!', description: 'Account details copied to clipboard.', type: 'success' });
  } catch (err) {
    showToast({ title: 'Failed to copy', description: 'Could not copy account details.', type: 'error' });
  }
};

const shareAccountDetails = async () => {
  const bankName = props.vendor.bankDetails?.bankName || props.vendor.bankName || 'Not specified';
  const accNo = props.vendor.bankDetails?.accountNumber || props.vendor.accountNumber || 'Not specified';
  const accName = props.vendor.bankDetails?.accountName || props.vendor.accountName || 'Not specified';
  const text = `Please pay to ${props.vendor.storeName}:\n\nBank: ${bankName}\nAccount No: ${accNo}\nAccount Name: ${accName}`;
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: `${props.vendor.storeName} Account Details`,
        text: text
      });
    } catch (err) {
      console.log('Error sharing:', err);
    }
  } else {
    copyAccountDetails();
  }
};

const handleProofUpload = (e: any) => {
  const file = e.target.files[0];
  if (file) {
    proofOfPaymentFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      proofOfPaymentPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const clearProof = () => {
  proofOfPaymentFile.value = null;
  proofOfPaymentPreview.value = null;
};

onMounted(async () => {
  if (props.initialService) {
    handleAddClick(props.initialService);
  }

  // By default, select today's date
  if (!selectedDate.value) {
    const today = new Date();
    selectedDate.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  }

  try {
    const { data } = await appointments_api.getSettings();
    if (data?.commitmentFeePercentage) {
      commitmentFeePercentage.value = data.commitmentFeePercentage;
    }
  } catch (error) {
    console.error('Failed to load appointment settings', error);
  }
});
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.animate-slide-up-fast { animation: slideUpFast 0.2s ease-out; }
@keyframes slideUpFast { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
