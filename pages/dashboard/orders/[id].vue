<template>
  <div class="min-h-screen w-full bg-white pb-24 font-sans" v-if="order">
    <div class="w-full max-w-7xl mx-auto px-4 md:px-4 pt-8">

      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div class="inline-flex items-center gap-1.5 mb-2">
            <span class="w-1.5 h-1.5 rounded-full bg-[#FF5C1A] animate-pulse"></span>
            <span class="text-[11px] font-bold tracking-widest uppercase text-[#FF5C1A]">Order #{{ order._id?.slice(-8) }}</span>
          </div>
          <h1 class="text-xl font-bold text-gray-900 tracking-tight capitalize leading-none">
            {{ order.status?.replace(/_/g, ' ') }}
          </h1>
          <p class="text-gray-400 text-xs mt-1">We're updating your delivery status in real-time.</p>
        </div>

        <div v-if="order.status !== 'pending' && order.status !== 'delivered' && order.status !== 'cancelled' && order.status !== 'awaiting_payment' && order.status !== 'negotiating'" class="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-[#FF5C1A] text-white self-start sm:self-auto">
           <Clock class="w-5 h-5 text-white/80" />
           <div>
             <p class="text-[9px] font-bold text-white/70 uppercase tracking-widest leading-none mb-1">Status</p>
             <p class="text-base font-bold tracking-tight leading-none capitalize">{{ order.status?.replace(/_/g, ' ') }}</p>
           </div>
        </div>
      </div>

      <!-- Stepper -->
      <div class="border border-gray-100 rounded-2xl p-4 mb-6">
        <div class="flex items-center justify-between min-w-full gap-2 overflow-x-auto hide-scrollbar">
           <template v-for="(step, idx) in orderSteps" :key="idx">
             <div class="flex flex-col items-center gap-2 relative z-10 flex-1 min-w-[86px]">
               <div :class="[
                 'w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0',
                 step._completed ? 'bg-gray-900 text-white' :
                 step._current ? 'bg-[#FF5C1A] text-white' : 'bg-gray-100 text-gray-400'
               ]">
                 <Check v-if="step._completed" class="w-3.5 h-3.5" />
                 <Loader2 v-else-if="step._current" class="w-3.5 h-3.5 animate-spin" />
                 <span v-else class="text-[11px] font-bold">{{ idx + 1 }}</span>
               </div>
               <h4 :class="[
                 'text-[11px] font-bold text-center leading-tight transition-colors',
                 (step._completed || step._current) ? 'text-gray-900' : 'text-gray-300'
               ]">{{ step.label }}</h4>
             </div>

             <div v-if="idx < orderSteps.length - 1" class="flex-1 h-0.5 w-full hidden md:block rounded-full bg-gray-100 -mt-6">
                <div class="h-full transition-all duration-700 bg-[#FF5C1A]" :style="{ width: (orderSteps[idx + 1]._completed || orderSteps[idx + 1]._current) ? '100%' : '0%' }"></div>
             </div>
           </template>
        </div>
      </div>

      <!-- Main Content -->
      <div class="space-y-5">

             <!-- Status Communication Banners -->
             <div v-if="order.type !== 'custom_errand' && order.status !== 'pending' && order.status !== 'delivered' && order.status !== 'cancelled'" class="animate-fade-in">
                <!-- Vendor ready, no errander yet -->
                <div v-if="!order.errander && order.status === 'ready_for_pickup'" class="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-4 items-start shadow-sm mb-4">
                  <div class="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                    <AlertCircle class="w-5 h-5" />
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-amber-900">Food is hot and ready! 🍲</h4>
                    <p class="text-[13px] text-amber-800 mt-1 leading-relaxed">
                      The vendor is done preparing your order! We're just matching you with a rider to swing by and pick it up. It won't be long!
                    </p>
                  </div>
                </div>

                <!-- Errander assigned, vendor working or ready -->
                <div v-else-if="order.errander && (order.status === 'preparing' || order.status === 'ready_for_pickup')" class="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-4 items-start shadow-sm mb-4">
                  <div class="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Bike class="w-5 h-5" />
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-blue-900">Rider Assigned!</h4>
                    <p class="text-[13px] text-blue-800 mt-1 leading-relaxed">
                      <span v-if="order.status === 'ready_for_pickup'">Your order is ready! We're waiting for your rider, {{ order.errander.firstName || 'your errander' }}, to pick it up from the store.</span>
                      <span v-else>Your rider, {{ order.errander.firstName || 'your errander' }}, has been assigned and is heading to the store while your order is being prepared.</span>
                    </p>
                  </div>
                </div>

                <!-- Errander picked up (in transit) -->
                <div v-else-if="order.status === 'in_transit'" class="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex gap-4 items-start shadow-sm mb-4">
                  <div class="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
                    <Check class="w-5 h-5" />
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-emerald-900">Order Picked Up!</h4>
                    <p class="text-[13px] text-emerald-800 mt-1 leading-relaxed">
                      Your Errand Ninja has successfully picked up your order and is currently on their way to deliver it to you. Keep an eye out!
                    </p>
                  </div>
                </div>

                <!-- Interception Pending (hand-off requested) -->
                <div v-else-if="order.status === 'interception_pending'" class="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex gap-4 items-start shadow-sm mb-4">
                  <div class="w-10 h-10 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                    🤝
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-purple-900">Package Hand-off In Progress</h4>
                    <p class="text-[13px] text-purple-800 mt-1 leading-relaxed">
                      Your Errand Ninja has arrived at a hand-off point<span v-if="order.interception?.point"> ({{ order.interception.point }})</span> and is waiting for a second rider to continue the delivery to you.
                    </p>
                  </div>
                </div>

                <!-- Interception In Progress (second errander accepted) -->
                <div v-else-if="order.status === 'interception_in_progress'" class="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex gap-4 items-start shadow-sm mb-4">
                  <div class="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                    <Bike class="w-5 h-5" />
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-indigo-900">New Rider On The Way!</h4>
                    <p class="text-[13px] text-indigo-800 mt-1 leading-relaxed">
                      Your package has been handed off to a new rider who is now on the way to deliver it to you. Almost there!
                    </p>
                  </div>
                </div>
             </div>



             <!-- RESUME NEGOTIATION -->
             <div v-if="order.status === 'negotiating'" class="p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                <div class="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center mb-4">
                   <Zap class="w-6 h-6 text-[#FF5C1A]" />
                </div>
                <h3 class="text-lg font-bold text-gray-900 tracking-tight mb-1">Active Negotiation</h3>
                <p class="text-gray-400 text-xs max-w-sm mb-5">You are currently negotiating the delivery fee with a rider. Don't leave them waiting!</p>

                <button @click="router.push({ path: '/negotiation', query: { orderIds: order._id } })" class="w-full max-w-sm bg-[#FF5C1A] text-white font-bold px-5 h-12 rounded-xl hover:bg-[#e6511a] transition-colors shadow-sm flex items-center justify-center gap-2">
                   Resume Negotiation <ArrowRight class="w-4 h-4" />
                </button>
             </div>

             <!-- PENDING NEGOTIATION -->
             <div v-if="order.type === 'custom_errand' && order.status === 'pending'" class="p-4 rounded-2xl border border-gray-100 flex flex-col items-center text-center">
                <div class="w-12 h-12 rounded-xl bg-gray-900 flex items-center justify-center mb-4">
                   <Bike class="w-6 h-6 text-white" />
                </div>
                <h3 class="text-lg font-bold text-gray-900 tracking-tight mb-1">Searching for a Rider</h3>
                <p class="text-gray-400 text-xs max-w-sm mb-5">Your errand is broadcasted to nearby riders. Increase the fee to make your request more attractive.</p>

                <div class="w-full max-w-sm flex gap-2">
                   <div class="relative flex-1">
                     <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">₦</span>
                     <input v-model="formattedNewFee" type="text" @input="handleFeeInput" class="w-full pl-7 pr-3 py-2.5 rounded-lg border border-gray-200 outline-none font-bold text-gray-900 text-sm focus:border-[#FF5C1A] transition-colors" placeholder="New fee amount" />
                   </div>
                   <button @click="increaseFee" :disabled="isIncreasingFee || newFee <= order.deliveryFee" class="bg-[#FF5C1A] text-white font-bold px-5 py-2.5 rounded-lg hover:bg-[#e6511a] transition-colors disabled:opacity-40 shrink-0 text-xs">
                      {{ isIncreasingFee ? 'Updating...' : 'Boost Fee' }}
                   </button>
                </div>

                <div v-if="order.viewers && order.viewers.length > 0" class="w-full mt-6 pt-5 border-t border-gray-100 text-left">
                   <h4 class="text-[11px] font-bold text-gray-900 uppercase flex items-center gap-1.5 mb-3">
                     <span class="w-1.5 h-1.5 rounded-full bg-[#FF5C1A] animate-pulse"></span>
                     {{ order.viewers.length }} Rider{{ order.viewers.length > 1 ? 's' : '' }} viewing right now
                   </h4>
                   <div class="flex flex-wrap gap-2">
                      <div v-for="viewer in order.viewers" :key="viewer._id" class="flex items-center gap-2 border border-gray-100 px-2.5 py-1.5 rounded-lg">
                         <div class="w-7 h-7 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-gray-500 font-bold text-[10px] uppercase shrink-0">
                            <img v-if="viewer.errander?.avatar" :src="viewer.errander.avatar" class="w-full h-full object-cover" />
                            <span v-else>{{ viewer.errander?.firstName?.[0] || 'R' }}{{ viewer.errander?.lastName?.[0] || '' }}</span>
                         </div>
                         <p class="text-xs font-bold text-gray-900">{{ viewer.errander?.firstName || 'Rider' }} {{ viewer.errander?.lastName || '' }}</p>
                      </div>
                   </div>
                </div>

                <!-- Bids -->
                <div v-if="pendingBids.length > 0" class="w-full mt-6 pt-5 border-t border-gray-100 text-left">
                   <h4 class="text-[11px] font-bold text-gray-900 mb-3 uppercase flex items-center gap-1.5">
                     <Zap class="w-3.5 h-3.5 text-[#FF5C1A]" /> Received Offers
                   </h4>
                   <div class="space-y-2">
                      <div v-for="bid in pendingBids" :key="bid._id" class="p-3 rounded-xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                         <div class="flex items-center gap-3 w-full sm:w-auto">
                            <div class="w-9 h-9 rounded-full bg-gray-100 overflow-hidden shrink-0 flex items-center justify-center">
                               <img v-if="bid.errander?.avatar" :src="bid.errander.avatar" class="w-full h-full object-cover" />
                               <User v-else class="w-4 h-4 text-gray-400" />
                            </div>
                            <div>
                               <p class="text-sm font-bold text-gray-900">{{ bid.errander?.firstName || 'Rider' }} {{ bid.errander?.lastName || '' }}</p>
                               <p class="text-[#FF5C1A] text-xs font-bold">Offer: ₦{{ bid.amount?.toLocaleString() }}</p>
                            </div>
                         </div>
                         <button @click="promptAcceptBid(bid._id, bid)" :disabled="isAcceptingBid === bid._id" class="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-900 text-white text-xs font-bold hover:bg-black transition-colors disabled:opacity-50">
                            {{ isAcceptingBid === bid._id ? 'Accepting...' : 'Accept Offer' }}
                         </button>
                      </div>
                   </div>
                </div>
             </div>

             <!-- AWAITING PAYMENT -->
             <div v-if="order.status === 'awaiting_payment'" class="p-4 rounded-2xl bg-gray-900 text-white flex flex-col items-center text-center">
                <div class="w-12 h-12 rounded-xl bg-[#FF5C1A] flex items-center justify-center mb-4">
                   <Check class="w-6 h-6 text-white" />
                </div>
                <h3 class="text-lg font-bold tracking-tight mb-1">Rider Accepted</h3>

                  <p class="text-gray-400 text-xs max-w-sm mb-5">Secure the rider by paying the escrow fee. This covers their labor and our platform convenience fee.</p>
                  <div class="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm">
                    <button @click="payForErrand" :disabled="isInitializingPayment || isPayingWithWallet" class="w-full sm:flex-1 h-12 bg-[#FF5C1A] text-white font-bold px-4 rounded-lg hover:bg-[#e6511a] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-xs shrink-0">
                       <Zap v-if="!isInitializingPayment" class="w-3.5 h-3.5" />
                       {{ isInitializingPayment ? 'Processing...' : 'Pay with Paystack' }}
                    </button>
                    <button 
                      @click="payForErrandWithWallet" 
                      :disabled="isInitializingPayment || isPayingWithWallet"
                      class="w-full sm:flex-1 h-12 bg-white text-gray-900 border border-gray-200 font-bold px-4 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center justify-between text-xs relative group shadow-sm shrink-0"
                    >
                      <div class="flex flex-col items-start text-left">
                         <span class="font-bold flex items-center gap-1.5 leading-none mt-1">Wallet</span>
                         <span class="text-[10px] font-medium text-gray-500 mt-0.5 uppercase tracking-widest leading-none">₦{{ walletBalance?.toLocaleString() || balance?.toLocaleString() || '0' }}</span>
                      </div>
                      <ArrowRight class="w-4 h-4 text-gray-400 group-hover:-translate-x-0.5 transition-transform" />
                    </button>
                  </div>
             </div>

             <!--
               Bento cluster: every card below is a natural-height block inside a
               CSS multi-column flow. The browser packs each one into whichever
               column is currently shortest, so if a card is missing (e.g. no
               rider assigned yet) nothing is left hollow underneath it — the
               next card simply slots into the gap. This is what closes the
               dead space from the old fixed 7/5 split.
             -->
             <div class="columns-1 sm:columns-2 gap-4 [&>*]:mb-4 [&>*]:break-inside-avoid">

                <!-- Delivery Address -->
                <div class="p-5 rounded-2xl bg-gray-900 text-white">
                   <div class="flex items-center gap-2 mb-4">
                      <MapPin class="w-4 h-4 text-[#FF5C1A]" />
                      <h4 class="text-[11px] font-bold text-white/50 uppercase tracking-widest">Delivery Address</h4>
                   </div>
                   <h3 class="text-base font-bold leading-snug mb-4">{{ order.deliveryAddress || 'Campus Residency' }}</h3>

                   <div class="inline-flex items-center gap-2">
                      <div class="relative flex h-1.5 w-1.5">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </div>
                      <span class="text-[10px] font-bold tracking-widest uppercase text-emerald-400">Live Tracking Active</span>
                   </div>
                </div>

                <!-- Errandr Tracking (Live Location) -->
                <div v-if="order.status !== 'pending' && order.status !== 'awaiting_payment'" class="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden relative group h-[300px]">
                   <MapboxMap 
                      v-if="mapboxToken" 
                      :order="order"
                      :mapbox-token="mapboxToken" 
                      :errander-location="erranderLocation" 
                   />
                   <div v-else class="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                      <Loader2 class="w-8 h-8 animate-spin text-gray-400 mb-2" />
                      <p class="text-sm font-bold text-gray-400">Loading map...</p>
                   </div>
                </div>

                <!-- Verification Code -->
                <div v-if="order.status !== 'pending' && order.status !== 'awaiting_payment'" class="p-5 rounded-2xl border border-gray-100 flex flex-col">
                   <div class="flex items-center justify-between mb-5">
                      <div class="flex items-center gap-2">
                         <ShieldCheck class="w-4 h-4 text-emerald-600" />
                         <h4 class="text-[11px] font-bold text-gray-700 uppercase tracking-widest">Verification Code</h4>
                      </div>
                      <button @click="copyVerificationCode" class="text-gray-400 hover:text-gray-900 transition-colors" title="Copy Code">
                         <Copy class="w-4 h-4" />
                      </button>
                   </div>
                   <div class="flex items-center justify-center gap-2 mb-4">
                      <div v-for="(digit, idx) in (order.deliveryPin || '0000').split('')" :key="idx" class="w-10 h-12 rounded-lg bg-gray-900 flex items-center justify-center text-lg font-bold text-white">
                        {{ digit }}
                      </div>
                   </div>
                   <p class="text-[10px] font-bold text-gray-400 text-center uppercase tracking-wide">Present code upon delivery</p>
                </div>

                <!-- Rider -->
                <div v-if="order.status !== 'pending' && order.status !== 'awaiting_payment' && order.errander" class="p-5 rounded-2xl border border-gray-100 flex flex-col justify-between">
                   <div class="flex items-center justify-between mb-4">
                      <h4 class="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Your Rider</h4>
                      <div class="inline-flex items-center gap-1 text-blue-600 text-[10px] font-bold">
                         <Check class="w-3 h-3" /> Verified
                      </div>
                   </div>
                   <div class="flex items-center gap-3 mb-4">
                      <div class="w-11 h-11 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center text-gray-500 font-bold text-sm shrink-0">
                         <img v-if="order.errander.avatar" :src="order.errander.avatar" class="w-full h-full object-cover" />
                         <span v-else>{{ order.errander.firstName?.[0] }}{{ order.errander.lastName?.[0] }}</span>
                      </div>
                      <h3 class="text-base font-bold text-gray-900">{{ order.errander.firstName }} {{ order.errander.lastName }}</h3>
                   </div>
                   <div class="flex flex-col gap-2">
                      <div class="flex gap-2">
                        <a :href="`tel:${order.errander.phone}`" class="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-700 text-xs font-bold text-center hover:bg-gray-50 transition-colors">
                          Call
                        </a>
                        <a v-if="order.errander.phone" :href="getWhatsAppLink(order.errander.phone, 'rider')" target="_blank" class="flex-1 py-2.5 rounded-lg bg-[#25D366]/10 text-[#25D366] text-xs font-bold text-center hover:bg-[#25D366]/20 transition-colors flex justify-center items-center gap-1.5">
                          <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413z" />
                          </svg>
                          WhatsApp
                        </a>
                      </div>
                      <button @click="openChat(String(order.errander?.user?._id || order.errander?.user || order.errander._id), (order.errander?.user?.firstName || order.errander?.firstName) + ' (Rider)', order.errander?.user?.avatar)" class="flex-1 py-2.5 rounded-lg bg-gray-900 text-white text-xs font-bold text-center hover:bg-black transition-colors flex items-center justify-center gap-1.5">
                        <MessageSquare class="w-3.5 h-3.5" /> In-App Message
                      </button>
                   </div>
                </div>

                <!-- Second Rider (Interception) -->
                <div v-if="order.interception?.secondErrander && (order.status === 'interception_in_progress' || order.interception?.status === 'accepted' || order.interception?.status === 'completed')" class="p-5 rounded-2xl border-2 border-purple-200 bg-purple-50/30 flex flex-col justify-between">
                   <div class="flex items-center justify-between mb-4">
                      <h4 class="text-[11px] font-bold text-purple-500 uppercase tracking-widest">Second Rider (Hand-off)</h4>
                      <div class="inline-flex items-center gap-1 text-purple-600 text-[10px] font-bold">
                         🤝 Active
                      </div>
                   </div>
                   <div class="flex items-center gap-3 mb-4">
                      <div class="w-11 h-11 rounded-full bg-purple-100 overflow-hidden flex items-center justify-center text-purple-600 font-bold text-sm shrink-0">
                         <img v-if="order.interception.secondErrander.avatar" :src="order.interception.secondErrander.avatar" class="w-full h-full object-cover" />
                         <span v-else>{{ order.interception.secondErrander.firstName?.[0] }}{{ order.interception.secondErrander.lastName?.[0] }}</span>
                      </div>
                      <div>
                        <h3 class="text-base font-bold text-gray-900">{{ order.interception.secondErrander.firstName }} {{ order.interception.secondErrander.lastName }}</h3>
                        <p class="text-[10px] text-purple-600 font-medium">Completing your delivery</p>
                      </div>
                   </div>
                   <div class="flex gap-2">
                     <a :href="`tel:${order.interception.secondErrander.phone}`" class="flex-1 py-2.5 rounded-lg border border-purple-200 text-purple-700 text-xs font-bold text-center hover:bg-purple-50 transition-colors">
                       Call
                     </a>
                     <a v-if="order.interception.secondErrander.phone" :href="getWhatsAppLink(order.interception.secondErrander.phone, 'rider')" target="_blank" class="flex-1 py-2.5 rounded-lg bg-[#25D366]/10 text-[#25D366] text-xs font-bold text-center hover:bg-[#25D366]/20 transition-colors flex justify-center items-center gap-1.5">
                       <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                         <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413z" />
                       </svg>
                       WhatsApp
                     </a>
                   </div>
                </div>
                <!-- Vendor -->
                <div v-if="order.status !== 'pending' && order.status !== 'awaiting_payment' && order.type !== 'custom_errand' && order.vendor" class="p-5 rounded-2xl border border-gray-100 flex flex-col justify-between">
                   <div class="flex items-center justify-between mb-4">
                      <h4 class="text-[11px] font-bold text-gray-400 uppercase tracking-widest">The Vendor</h4>
                      <div class="inline-flex items-center gap-1 text-[#FF5C1A] text-[10px] font-bold">
                         <ShieldCheck class="w-3 h-3" /> Verified Partner
                      </div>
                   </div>
                   <div class="flex items-center gap-3 mb-4">
                      <div class="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden shrink-0">
                         <video v-if="order.vendor?.logo && order.vendor.logo.match(/\.(mp4|webm|ogg|mov)$/i)" :src="order.vendor.logo" class="w-full h-full object-cover" autoplay loop muted playsinline></video>
                         <img v-else-if="order.vendor?.logo" :src="order.vendor.logo" class="w-full h-full object-cover" />
                         <Store v-else class="w-5 h-5" />
                      </div>
                      <h3 class="text-base font-bold text-gray-900">{{ order.vendor?.storeName || 'Vendor' }}</h3>
                   </div>
                   <div class="flex flex-col gap-2">
                     <div v-if="vendorPhone" class="flex gap-2">
                       <a :href="`tel:${vendorPhone}`" class="flex-1 py-2.5 rounded-lg border border-gray-200 text-gray-700 text-xs font-bold text-center hover:bg-gray-50 transition-colors">
                         Call
                       </a>
                       <a :href="getWhatsAppLink(vendorPhone, 'vendor')" target="_blank" class="flex-1 py-2.5 rounded-lg bg-[#25D366]/10 text-[#25D366] text-xs font-bold text-center hover:bg-[#25D366]/20 transition-colors flex justify-center items-center gap-1.5">
                         <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                           <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413z" />
                         </svg>
                         WhatsApp
                       </a>
                     </div>
                     <button @click="openChat((order.vendor?.owner?._id || order.vendor?.owner || '') + ',' + (order.vendor?._id || ''), order.vendor?.storeName || 'Vendor', order.vendor?.logo)" class="w-full py-2.5 rounded-lg bg-gray-900 text-white text-xs font-bold text-center hover:bg-black transition-colors flex items-center justify-center gap-1.5">
                       <MessageSquare class="w-3.5 h-3.5" /> In-App Message Store
                     </button>
                   </div>
                </div>

                <!-- Receipt Summary -->
                <div v-if="order.type !== 'custom_errand'" class="p-5 rounded-2xl border border-gray-100">
                   <h4 class="text-[11px] font-bold text-gray-400 mb-4 tracking-widest uppercase flex items-center gap-1.5">
                     <Utensils class="w-3.5 h-3.5" /> Receipt Summary
                   </h4>

                   <div class="space-y-3">
                     <div v-for="item in order.items" :key="item._id" class="flex items-center justify-between gap-3">
                       <div class="flex items-center gap-2.5">
                         <div class="w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 overflow-hidden shrink-0 relative">
                           <img v-if="item.image" :src="item.image" class="w-full h-full object-cover" />
                           <div v-else class="w-full h-full bg-gray-100 flex items-center justify-center"><Utensils class="w-4 h-4 text-gray-300" /></div>
                         </div>
                         <div>
                            <h5 v-if="item.status === 'substituted'" class="text-xs font-bold text-gray-900 flex flex-col gap-1">
                              <div class="flex items-center gap-2 flex-wrap">
                                <span class="text-gray-400 line-through">{{ item.substitutedWith?.originalName }}</span>
                                <span class="text-[10px] text-gray-400">➔</span>
                                <span class="text-blue-600 font-bold">{{ item.name }}</span>
                                <span class="px-1.5 py-0.5 rounded text-[8px] font-bold bg-blue-100 text-blue-600">Substituted</span>
                              </div>
                            </h5>
                            <h5 v-else class="text-xs font-bold text-gray-900 line-clamp-1 flex items-center gap-2">
                              {{ item.name }}
                              <span v-if="item.status === 'pending_substitute'" class="px-1.5 py-0.5 rounded text-[8px] font-bold bg-amber-100 text-amber-600">Substitute Pending</span>
                            </h5>
                            <p class="text-[11px] text-gray-400 mt-0.5">Qty: <span class="text-gray-700 font-bold">{{ item.quantity }}</span></p>
                            
                            <button v-if="item.status === 'pending_substitute'" @click="resumeSubstitute(item)" class="mt-2 text-[10px] font-bold bg-[#FF5C1A] text-white px-2 py-1 rounded shadow-sm hover:bg-[#E04D12] active:scale-95 transition-all w-fit block">
                              Review Substitute Option
                            </button>
                            
                            <div v-if="item.status === 'substituted' && item.substitutedWith?.note" class="mt-1.5 bg-amber-50 rounded p-1.5 border border-amber-100">
                              <p class="text-[10px] text-amber-700 italic">"{{ item.substitutedWith.note }}"</p>
                            </div>
                         </div>
                       </div>
                       <p class="text-xs font-bold text-gray-900 shrink-0">₦{{ (item.price * item.quantity).toLocaleString() }}</p>
                     </div>
                   </div>

                   <div class="mt-4 pt-4 border-t border-gray-100 space-y-2">
                     <div class="flex justify-between text-xs">
                       <span class="text-gray-400">Subtotal</span>
                       <span class="text-gray-900 font-bold">₦{{ order.subtotal?.toLocaleString() }}</span>
                     </div>
                     <div v-if="order.deliveryFee" class="flex justify-between text-xs">
                       <span class="text-gray-400">Delivery Fee</span>
                       <span class="text-gray-900 font-bold">₦{{ order.deliveryFee?.toLocaleString() }}</span>
                     </div>
                     <div v-if="order.serviceFee" class="flex justify-between text-xs">
                       <span class="text-gray-400">Service Fee</span>
                       <span class="text-gray-900 font-bold">₦{{ order.serviceFee?.toLocaleString() }}</span>
                     </div>
                     <div v-if="order.packagingFee" class="flex justify-between text-xs">
                       <span class="text-gray-400">Packaging Fee</span>
                       <span class="text-gray-900 font-bold">₦{{ order.packagingFee?.toLocaleString() }}</span>
                     </div>
                     <div v-if="order.platformProcessingFee" class="flex justify-between text-xs">
                       <span class="text-gray-400">Processing Fee</span>
                       <span class="text-gray-900 font-bold">₦{{ order.platformProcessingFee?.toLocaleString() }}</span>
                     </div>
                     <div v-if="order.discount && order.discount > 0" class="flex justify-between text-xs">
                       <span class="text-emerald-600">Discount</span>
                       <span class="text-emerald-600 font-bold">-₦{{ order.discount?.toLocaleString() }}</span>
                     </div>
                     <div v-if="order.promoDiscount && order.promoDiscount > 0" class="flex justify-between text-xs">
                       <span class="text-emerald-600">Promo Discount</span>
                       <span class="text-emerald-600 font-bold">-₦{{ order.promoDiscount?.toLocaleString() }}</span>
                     </div>
                   </div>

                   <div class="mt-4 p-3.5 rounded-xl bg-[#FF5C1A] text-white flex justify-between items-center">
                     <span class="text-[10px] font-bold text-white/80 tracking-widest uppercase">Grand Total</span>
                     <span class="text-lg font-bold">₦{{ order.total?.toLocaleString() }}</span>
                   </div>
                </div>

                <!-- Errand Details -->
                <div v-if="order.type === 'custom_errand'" class="p-5 rounded-2xl border border-gray-100">
                   <h4 class="text-[11px] font-bold text-gray-400 mb-4 tracking-widest uppercase flex items-center gap-1.5">
                     <ClipboardList class="w-3.5 h-3.5" /> Errand Details
                   </h4>
                   <div class="space-y-3">
                     <div class="p-3 bg-gray-50 rounded-lg text-gray-700 text-xs">
                       {{ order.description || 'No description provided.' }}
                     </div>

                     <div class="flex justify-between items-center pt-1">
                       <span class="text-gray-400 text-xs">Urgency</span>
                       <span class="px-2 py-0.5 rounded border border-gray-200 text-gray-700 font-bold capitalize text-[11px]">{{ order.urgency || 'standard' }}</span>
                     </div>
                     <div v-if="order.estimatedItemCost" class="flex justify-between items-center">
                       <span class="text-gray-400 text-xs">Est. Item Cost</span>
                       <span class="text-gray-900 font-bold text-xs">₦{{ order.estimatedItemCost?.toLocaleString() }}</span>
                     </div>
                     <div v-if="order.customDetails?.itemCostBuffer" class="flex justify-between items-center">
                       <span class="text-gray-400 text-xs">Safety Buffer</span>
                       <span class="text-gray-900 font-bold text-xs">₦{{ order.customDetails.itemCostBuffer?.toLocaleString() }}</span>
                     </div>
                     <div class="flex justify-between items-center">
                       <span class="text-gray-400 text-xs">Rider Fee</span>
                       <span class="text-gray-900 font-bold text-xs">₦{{ order.deliveryFee?.toLocaleString() }}</span>
                     </div>
                     <div class="flex justify-between items-center">
                       <span class="text-gray-400 text-xs">Service Fee</span>
                       <span class="text-gray-900 font-bold text-xs">₦{{ (order.serviceFee || 0)?.toLocaleString() }}</span>
                     </div>
                     <!-- <div class="flex justify-between items-center pb-3 border-b border-gray-100">
                       <span class="text-gray-400 text-xs">Transfer Fee</span>
                       <span class="text-gray-900 font-bold text-xs">₦{{ Math.max(0, Math.round(order.total - order.subtotal - (order.customDetails?.itemCostBuffer || 0) - order.deliveryFee - (order.serviceFee || 0)))?.toLocaleString() }}</span>
                     </div> -->
                   </div>

                   <div class="mt-4 p-3.5 rounded-xl bg-[#FF5C1A] text-white flex justify-between items-center">
                     <span class="text-[10px] font-bold text-white/80 tracking-widest uppercase">Total Escrow</span>
                     <span class="text-lg font-bold">₦{{ order.total?.toLocaleString() }}</span>
                   </div>
                </div>

                <!-- Rider Account Details removed -->

                <!-- Proof of Items Photo -->
                <div v-if="order.type === 'custom_errand' && order.itemsPhoto" class="p-5 rounded-2xl border border-gray-100 flex flex-col items-center">
                   <h4 class="text-[11px] font-bold text-gray-400 mb-4 tracking-widest uppercase flex items-center gap-1.5 w-full">
                     <Camera class="w-3.5 h-3.5" /> Proof of Purchased Items
                   </h4>
                   <div class="w-full h-48 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 mb-3 cursor-pointer" @click="window.open(order.itemsPhoto, '_blank')">
                     <img :src="order.itemsPhoto" class="w-full h-full object-cover hover:scale-105 transition-transform" />
                   </div>
                   <p class="text-xs text-gray-500 text-center">Your rider has uploaded a photo of the items purchased from the vendor.</p>
                </div>

                <!-- Support -->
                <NuxtLink to="/support" class="flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors group">
                   <div class="flex items-center gap-3">
                      <LifeBuoy class="w-4 h-4 text-gray-400 group-hover:text-[#FF5C1A] transition-colors" />
                      <div>
                         <h4 class="text-xs font-bold text-gray-900">Need help?</h4>
                         <p class="text-[11px] text-gray-400 mt-0.5">Contact 24/7 support</p>
                      </div>
                   </div>
                   <ArrowRight class="w-4 h-4 text-gray-300 group-hover:text-[#FF5C1A] group-hover:translate-x-0.5 transition-all" />
                </NuxtLink>

             </div>

             <!-- Rating -->
             <div v-if="order && order.status === 'DELIVERED' && (!order.hasRatedVendor || !order.hasRatedErrander)" class="pt-6 border-t border-gray-100">
                   <div class="text-center mb-5">
                      <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-50 text-yellow-600 text-[10px] font-bold tracking-wide mb-3">
                         <Sparkles class="w-3 h-3" /> Earn 20 Reward Points
                      </div>
                      <h2 class="text-lg font-bold tracking-tight text-gray-900 mb-1">How was your experience?</h2>
                      <p class="text-gray-400 text-xs">Your feedback helps us maintain top quality service.</p>
                   </div>

                   <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div v-if="order.type !== 'custom_errand' && !order.hasRatedVendor" class="p-5 rounded-2xl border border-gray-100 flex flex-col items-center">
                         <Utensils class="w-4 h-4 text-gray-300 mb-3" />
                         <h4 class="font-bold text-sm text-gray-900 mb-0.5">The Meal</h4>
                         <p class="text-[11px] text-gray-400 mb-4">Rate the vendor</p>

                         <div class="flex gap-1.5 mb-4">
                            <button v-for="i in 5" :key="i" @click="ratingForm.vendorRating = i" class="transition-transform focus:outline-none hover:scale-110">
                               <Star :class="['w-6 h-6 transition-colors', ratingForm.vendorRating >= i ? 'text-[#FF5C1A] fill-[#FF5C1A]' : 'text-gray-200']" />
                            </button>
                         </div>
                         <textarea v-model="ratingForm.vendorReview" placeholder="Feedback on the food..." class="w-full p-3 rounded-lg border border-gray-100 text-xs focus:outline-none focus:border-[#FF5C1A] resize-none h-20 transition-colors"></textarea>
                      </div>

                      <div v-if="!order.hasRatedErrander" class="p-5 rounded-2xl border border-gray-100 flex flex-col items-center" :class="{ 'md:col-span-2 max-w-sm mx-auto w-full': order.type === 'custom_errand' || order.hasRatedVendor }">
                         <Bike class="w-4 h-4 text-gray-300 mb-3" />
                         <h4 class="font-bold text-sm text-gray-900 mb-0.5">The Delivery</h4>
                         <p class="text-[11px] text-gray-400 mb-4">Rate your rider</p>

                         <div class="flex gap-1.5 mb-4">
                            <button v-for="i in 5" :key="i" @click="ratingForm.erranderRating = i" class="transition-transform focus:outline-none hover:scale-110">
                               <Star :class="['w-6 h-6 transition-colors', ratingForm.erranderRating >= i ? 'text-[#FF5C1A] fill-[#FF5C1A]' : 'text-gray-200']" />
                            </button>
                         </div>
                         <textarea v-model="ratingForm.erranderReview" placeholder="How was the service?" class="w-full p-3 rounded-lg border border-gray-100 text-xs focus:outline-none focus:border-[#FF5C1A] resize-none h-20 transition-colors"></textarea>
                      </div>
                   </div>

                   <div class="mt-5 max-w-xs mx-auto">
                      <button @click="submitRatings" :disabled="isSubmittingRating || (!ratingForm.vendorRating && !ratingForm.erranderRating)" class="w-full py-3 rounded-lg bg-[#FF5C1A] text-white text-sm font-bold hover:bg-[#e6511a] transition-colors disabled:opacity-50 disabled:bg-gray-300 flex items-center justify-center gap-2">
                         <Loader2 v-if="isSubmittingRating" class="w-4 h-4 animate-spin" />
                         {{ isSubmittingRating ? 'Submitting...' : 'Submit Feedback' }}
                      </button>
                   </div>
                </div>

      </div>

    </div>
  </div>

  <!-- Loading State -->
  <div v-else class="min-h-screen bg-white flex flex-col items-center justify-center p-4">
    <div class="relative mb-6">
       <div class="w-16 h-16 border-4 border-gray-100 border-t-[#FF5C1A] rounded-full animate-spin"></div>
       <div class="absolute inset-0 m-auto w-7 h-7 flex items-center justify-center">
          <Zap class="w-4 h-4 text-[#FF5C1A]" />
       </div>
    </div>
    <h3 class="font-bold text-gray-900 text-base mb-1">Loading your order</h3>
    <p class="text-sm text-gray-400">Syncing live logistics data...</p>
  </div>

  <!-- OrderChat Drawer -->
  <OrderChat
    v-if="order"
    :is-open="isChatOpen"
    :receiver-id="chatReceiverId"
    :receiver-name="chatReceiverName"
    :receiver-avatar="chatReceiverAvatar"
    @close="isChatOpen = false"
    :current-user-id="user?._id || ''"
    :order-id="order._id"
  />

  <!-- Fund Wallet Modal -->
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isFundModalOpen" class="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click.self="isFundModalOpen = false">
        <div class="bg-white w-full max-w-sm rounded-2xl p-6 shadow-xl relative animate-zoom-in">
          <button @click="isFundModalOpen = false" class="absolute top-4 right-4 text-gray-400 hover:text-gray-900">
            <X class="w-5 h-5" />
          </button>
          
          <div class="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4 mx-auto">
            <CreditCard class="w-6 h-6 text-[#FF5C1A]" />
          </div>
          
          <h3 class="text-lg font-bold text-center mb-2">Fund Your Wallet</h3>
          <p class="text-sm text-gray-600 text-center mb-6">
            You need <strong class="text-gray-900">₦{{ fundAmountNeeded.toLocaleString() }}</strong> more to pay for this errand. Fund your wallet now to proceed.
          </p>

          <button
            @click="initiateWalletTopup"
            :disabled="isInitializingPayment"
            class="w-full bg-[#FF5C1A] text-white font-bold py-3 rounded-xl hover:bg-[#e6511a] transition-all flex justify-center items-center gap-2"
          >
            <Loader2 v-if="isInitializingPayment" class="w-4 h-4 animate-spin" />
            <span>Fund ₦{{ fundAmountNeeded.toLocaleString() }}</span>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- P2P Payment Confirmation Modal removed -->

    <!-- Order Completed Modal -->
    <UiModal
      :is-open="isOrderCompletedModalOpen"
      title="Errand Completed!"
      description="Your custom errand has been successfully delivered."
      size="sm"
      @close="isOrderCompletedModalOpen = false"
    >
      <div class="flex flex-col items-center text-center py-4">
        <div class="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
          <Check class="w-8 h-8 text-emerald-500" />
        </div>
        <h4 class="text-lg font-bold text-gray-900 mb-2">Delivery Successful</h4>
        <p class="text-sm text-gray-500 leading-relaxed max-w-[260px]">
          Your errander has completed the request. Thank you for using Erranders!
        </p>
      </div>

      <template #footer>
        <button 
          @click="router.replace('/dashboard')" 
          class="px-6 py-3 w-full justify-center text-center rounded-xl bg-[#FF5C1A] text-white font-bold text-sm hover:bg-[#e6511a] transition-all flex items-center gap-2"
        >
          Return to Dashboard
        </button>
      </template>
    </UiModal>

    <!-- Accept Bid Confirmation Modal -->
    <UiModal
      :is-open="isAcceptBidModalOpen"
      title="Accept Offer"
      description="Confirm your selected rider"
      size="sm"
      @close="isAcceptBidModalOpen = false"
    >
      <div class="flex flex-col items-center text-center py-4">
        <div class="w-16 h-16 rounded-full bg-[#FF5C1A]/10 border border-[#FF5C1A]/20 flex items-center justify-center mb-4">
          <Zap class="w-8 h-8 text-[#FF5C1A]" />
        </div>
        <h4 class="text-lg font-bold text-gray-900 mb-2">Ready to proceed?</h4>
        <p class="text-sm text-gray-500 leading-relaxed max-w-[260px]">
          You are about to accept an offer of 
          <strong class="text-gray-900">₦{{ selectedBid?.amount?.toLocaleString() }}</strong> 
          from <strong class="text-gray-900">{{ selectedBid?.errander?.firstName || 'this rider' }}</strong>.
        </p>
      </div>

      <template #footer>
        <button 
          @click="isAcceptBidModalOpen = false" 
          class="px-5 py-2.5 rounded-xl text-gray-500 font-bold text-sm hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
        <button 
          @click="executeAcceptBid" 
          :disabled="isAcceptingBid !== null"
          class="px-6 py-2.5 rounded-xl bg-[#FF5C1A] text-white font-bold text-sm hover:bg-[#e6511a] transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <Loader2 v-if="isAcceptingBid !== null" class="w-4 h-4 animate-spin" />
          <span>Accept & Pay</span>
        </button>
      </template>
    </UiModal>

  <!-- Substitute Review Modal -->
  <div v-if="showSubstituteReviewModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showSubstituteReviewModal = false"></div>
    <div class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col p-6">
      <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <RefreshCw class="w-8 h-8 text-[#FF5C1A]" />
      </div>
      
      <h3 class="text-xl font-black text-gray-900 mb-2 tracking-tight text-center">Review Substitutes</h3>
      <p class="text-sm font-medium text-gray-500 mb-6 leading-relaxed text-center">
        Your Errander noticed that <strong class="text-gray-900">{{ substituteData?.originalItemName }}</strong> is out of stock. Please select a substitute option below:
      </p>
      
      <div class="space-y-3 mb-6 max-h-[40vh] overflow-y-auto pr-2">
        <button 
          v-for="opt in substituteData?.substituteOptions || []" 
          :key="opt._id"
          @click="selectedSubstituteOptionId = opt._id"
          class="w-full flex flex-col p-4 bg-white border rounded-xl transition-all text-left"
          :class="selectedSubstituteOptionId === opt._id ? 'border-[#FF5C1A] bg-orange-50 ring-2 ring-orange-200' : 'border-gray-200 hover:border-gray-300'"
        >
          <div class="flex items-center justify-between w-full">
            <p class="text-sm font-bold text-gray-900">{{ opt.name }}</p>
            <div class="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full border"
                 :class="selectedSubstituteOptionId === opt._id ? 'bg-[#FF5C1A] border-[#FF5C1A] text-white' : 'border-gray-300 text-transparent'">
              <Check class="w-3 h-3" />
            </div>
          </div>
          <div class="mt-2 flex items-center gap-2">
            <span v-if="getSubstitutePriceDiff(opt.price) > 0" class="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded">
              Pay ₦{{ getSubstitutePriceDiff(opt.price).toLocaleString() }} Extra
            </span>
            <span v-else-if="getSubstitutePriceDiff(opt.price) < 0" class="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
              Refund ₦{{ Math.abs(getSubstitutePriceDiff(opt.price)).toLocaleString() }}
            </span>
            <span v-else class="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">
              Same Price
            </span>
          </div>
        </button>
      </div>
      
      <div class="mb-6">
        <label class="block text-xs font-bold text-gray-700 mb-2">Optional Note for Errander</label>
        <textarea 
          v-model="substituteNote" 
          rows="2" 
          placeholder="E.g. Please ask the vendor to slice it" 
          class="w-full bg-gray-50 text-sm py-3 px-4 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none"
        ></textarea>
      </div>

      <div class="flex gap-3 mt-2">
        <button 
          @click="resolveSubstitute(false)" 
          :disabled="isResolvingSubstitute"
          class="flex-1 py-3.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all disabled:opacity-50"
        >
          Decline All & Refund
        </button>
        <button 
          @click="resolveSubstitute(true)" 
          :disabled="isResolvingSubstitute || !selectedSubstituteOptionId"
          class="flex-1 py-3.5 bg-[#FF5C1A] text-white rounded-xl text-sm font-bold hover:bg-[#FF5C1A]/90 transition-all disabled:opacity-50 shadow-lg shadow-[#FF5C1A]/20"
        >
          {{ getSubstituteSubmitText() }}
        </button>
      </div>
    </div>
  </div>

  <!-- Custom Errand Topup Modal -->
  <div v-if="showTopupModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showTopupModal = false"></div>
    <div class="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 text-center">
      <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CreditCard class="w-8 h-8 text-blue-600" />
      </div>
      <h3 class="text-xl font-black text-gray-900 mb-2">Extra Funds Required</h3>
      <p class="text-sm font-medium text-gray-500 mb-6 leading-relaxed">
        Your Errander needs an extra <strong class="text-blue-600">₦{{ topupAmount.toLocaleString() }}</strong> to complete your custom errand.
      </p>
      
      <div class="flex gap-3">
        <button 
          @click="showTopupModal = false"
          class="flex-1 py-3.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all"
        >
          Cancel
        </button>
        <button 
          @click="payTopup"
          :disabled="isPayingTopup"
          class="flex-1 py-3.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
        >
          {{ isPayingTopup ? 'Paying...' : 'Pay from Wallet' }}
        </button>
      </div>
    </div>
  </div>

</template>
<script setup lang="ts">
import {
  ShieldCheck,
  Star,
  Sparkles,
  Utensils,
  Clock,
  MapPin,
  Bike,
  Navigation,
  Check,
  Zap,
  Eye,
  User,
  MessageSquare,
  Copy,
  Store,
  CreditCard,
  LifeBuoy,
  ArrowRight,
  Loader2,
  ClipboardList,
  X,
  ImagePlus,
  Camera,
  RefreshCw
} from 'lucide-vue-next';
import { ref, onMounted, onUnmounted, reactive, computed, watch } from 'vue';
import { useRoute, useRouter, useHead, useRuntimeConfig } from '#imports';
import OrderChat from '@/components/core/OrderChat.vue';
import { orders_api } from '@/api_factory/modules/orders';
import { upload_api } from '@/api_factory/modules/upload';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { usePayments } from '@/composables/modules/payments';
import { useUser } from '@/composables/modules/auth/user';
import { useWallet } from '@/composables/modules/wallets';
import { useRealtimeSocket } from '@/composables/core/useRealtimeSocket';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import MapboxMap from '@/components/ui/MapboxMap.vue';

definePageMeta({
  layout: 'student'
})

// Chat state
const isChatOpen = ref(false);
const chatReceiverId = ref<string>('');
const chatReceiverName = ref('');
const chatReceiverAvatar = ref('');

const openChat = (receiverId: string | undefined, name: string, avatar?: string) => {
   if (!receiverId) return;
   chatReceiverId.value = receiverId;
   chatReceiverName.value = name;
   chatReceiverAvatar.value = avatar || '';
   isChatOpen.value = true;
};

const mapboxToken = ref(useRuntimeConfig().public.mapboxToken);
const erranderLocation = ref<[number, number] | undefined>(undefined);
const { connect: connectTracking, on: onTracking, emit: emitTracking, disconnect: disconnectTracking } = useSocket('/tracking');

const startTracking = () => {
  connectTracking();
  emitTracking('trackOrder', { orderId: route.params.id });
  onTracking('locationUpdate', (data: any) => {
    if (data.orderId === route.params.id && data.coordinates) {
      erranderLocation.value = data.coordinates;
    }
  });
};

const getWhatsAppLink = (phone: string, type: 'vendor' | 'rider') => {
  if (!phone || !order.value) return '#';
  const cleanPhone = phone.replace(/[^0-9]/g, '').replace(/^0/, '234');
  const o = order.value;
  let message = '';
  
  if (type === 'vendor') {
    const total = o.totalAmount || 0;
    message = `Hello, I am the customer for order #${o.orderNumber}.

My order includes ${o.items?.length || 0} item(s) for a total of ₦${total.toLocaleString('en-US')}.

I just wanted to check on the status or provide some additional instructions:`;
  } else if (type === 'rider') {
    const deliveryAddress = o.type === 'custom_errand' ? (o.customDetails?.deliveryAddress || 'my address') : (o.customerAddress?.address || 'my address');
    message = `Hello ${o.errander?.firstName || 'Rider'}, I am the customer for order #${o.orderNumber}.

My delivery address is: *${deliveryAddress}*.

Please let me know if you need any directions or when you are close!`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

const checkAutoOpenChat = () => {
  if (route.query.openChat && order.value) {
    const targetId = route.query.openChat as string;

    // Check if it's the vendor
    if (order.value.vendor && (targetId === order.value.vendor.owner || targetId === order.value.vendor._id || targetId === 'vendor')) {
      openChat((order.value.vendor?.owner?._id || order.value.vendor?.owner || '') + ',' + (order.value.vendor?._id || ''), order.value.vendor.storeName || 'Vendor', order.value.vendor.logo);
    }
    // Check if it's the rider
    else if (order.value.errander && (targetId === order.value.errander._id || targetId === order.value.errander.user?._id || targetId === 'errander')) {
      openChat(order.value.errander?.user?._id || order.value.errander?.user || order.value.errander._id, order.value.errander.firstName + ' (Rider)', order.value.errander.avatar || order.value.errander.user?.avatar);
    }

    // Clean up query param so it doesn't reopen if they refresh
    router.replace({ query: { ...route.query, openChat: undefined } });
  }
};

const route = useRoute();
const router = useRouter();
const order = ref<any>(null);
const { showToast } = useCustomToast();
const { user } = useUser();
const { balance, fetchWallet } = useWallet();
const { initializePayment, verifyPayment, payWithWallet } = usePayments();
const isSubmittingRating = ref(false);
const isApprovingReconciliation = ref(false);
const newFee = ref(0);
const formattedNewFee = ref('');

const handleFeeInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const rawValue = target.value.replace(/[^\d]/g, '');
  const numericValue = parseInt(rawValue, 10);

  if (isNaN(numericValue)) {
    newFee.value = 0;
    formattedNewFee.value = '';
  } else {
    newFee.value = numericValue;
    formattedNewFee.value = numericValue.toLocaleString('en-US');
  }
};
const isIncreasingFee = ref(false);
const isInitializingPayment = ref(false);
const viewersCount = ref(0);

const pendingBids = computed(() => {
  if (!order.value?.bids) return [];
  return order.value.bids.filter((b: any) => b.status === 'pending');
});

// Resolve vendor phone: try vendor.phone → vendor.owner.phone → whatsappLinks
const vendorPhone = computed(() => {
  if (!order.value?.vendor) return null;
  return order.value.vendor.phone || order.value.vendor.owner?.phone || null;
});

const { socket } = useRealtimeSocket();

const ratingForm = reactive({
  vendorRating: 0,
  vendorReview: '',
  erranderRating: 0,
  erranderReview: ''
});

const fetchOrder = async () => {
    const res = await orders_api.getOrder(route.params.id as string);
    order.value = res.data;
    if (order.value.type === 'custom_errand') {
        if (order.value.deliveryFee) {
            newFee.value = order.value.deliveryFee + 100;
            formattedNewFee.value = newFee.value.toLocaleString('en-US');
        }
    }
}

onMounted(async () => {
  startPolling();
  fetchWallet();
  try {
    await fetchOrder();
    
    if (order.value?.erranderLocation?.coordinates) {
      erranderLocation.value = order.value.erranderLocation.coordinates;
    }
    
    startTracking();
    
    checkAutoOpenChat();

    if (route.query.reference && (order.value.status === 'awaiting_payment' || route.query.trxref)) {
       try {
         // Any order in awaiting_payment with a reference needs payForCustomErrand to confirm
         if (order.value.status === 'awaiting_payment') {
           await api.post(`/orders/${order.value._id}/custom/pay`, { paymentReference: route.query.reference });
         } else {
           await verifyPayment(route.query.reference as string);
         }
         showToast({ title: 'Payment Successful', message: 'Payment confirmed! Your order is being processed.', toastType: 'success' });
       } catch (e: any) {
         console.error('Payment verification error:', e);
         // Try the other method as fallback
         try {
           await verifyPayment(route.query.reference as string);
           showToast({ title: 'Payment Successful', message: 'Payment confirmed!', toastType: 'success' });
         } catch (e2) {
           console.error('Fallback verification also failed:', e2);
         }
       }
       // Reload order to get updated status
       const res2 = await orders_api.getOrder(route.params.id as string);
       order.value = res2.data;
       const url = new URL(window.location.href);
       url.searchParams.delete('reference');
       url.searchParams.delete('trxref');
       window.history.replaceState({}, '', url.toString());
    }
  } catch (e) {
    console.error(e);
  }
});

let currentSocket: any = null;
let pollingInterval: ReturnType<typeof setInterval> | null = null;

// Polling fallback: re-fetch order every 15 seconds to catch any missed events
const startPolling = () => {
  if (pollingInterval) return;
  pollingInterval = setInterval(async () => {
    try {
      const res = await orders_api.getOrder(route.params.id as string);
      const newOrder = res.data;
      // Only update if status changed
      if (newOrder && newOrder.status !== order.value?.status) {
        order.value = newOrder;
        showToast({ title: 'Order Updated', message: `Status: ${newOrder.status?.replace(/_/g, ' ')}`, toastType: 'info' });
      } else if (newOrder) {
        // Silently update data without toast
        order.value = newOrder;
      }
    } catch (e) {
      // Silently fail
    }
  }, 15000);
};

watch(() => socket.value, (newSocket) => {
  if (currentSocket) {
    currentSocket.off('errand:viewers_update');
    currentSocket.off('notification:new');
    currentSocket.off('notification:order-status-update');
    currentSocket.off('notification:order-accepted');
  }

  if (newSocket) {
    currentSocket = newSocket;

    newSocket.on('errand:viewers_update', (data: any) => {
      if (data.orderId === route.params.id) {
        viewersCount.value = data.viewersCount;
      }
    });

    // Listen for ALL notification types that could affect this order
    newSocket.on('notification:new', async (payload: any) => {
      const { type, data, title, body } = payload;
      const orderIdMatch = data?.orderId === route.params.id || data?.order?._id === route.params.id || payload.orderId === route.params.id;
      
      if (!orderIdMatch) return;
      
      if (type === 'SUBSTITUTE_REQUEST') {
          substituteData.value = data;
          showSubstituteReviewModal.value = true;
          return;
      }
      
      if (type !== 'ERRAND_VIEWER_ADDED') {
        showToast({ title: title || 'Order Updated', message: body || 'Your order has been updated.', toastType: 'info' });
      }
      const res = await orders_api.getOrder(route.params.id as string);
      order.value = res.data;
    });

    const refreshOrder = async (payload: any) => {
      const orderId = payload?.orderId || payload?.order?._id || payload?.data?.orderId;
      if (orderId === route.params.id) {
         const res = await orders_api.getOrder(route.params.id as string);
         order.value = res.data;
      }
    };

    newSocket.on('notification:order-status-update', refreshOrder);
    newSocket.on('notification:order-accepted', refreshOrder);
  }

  // Start polling as a fallback regardless of socket state
  startPolling();
}, { immediate: true });

// startPolling already called in main onMounted

onUnmounted(() => {
  disconnectTracking();
  if (currentSocket) {
    currentSocket.off('errand:viewers_update');
    currentSocket.off('notification:new');
    currentSocket.off('notification:order-status-update');
    currentSocket.off('notification:order-accepted');
  }
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
});

const increaseFee = async () => {
  if (newFee.value <= order.value.deliveryFee) return;
  isIncreasingFee.value = true;
  try {
     await api.put(`/orders/${order.value._id}/custom/fee`, { newFee: newFee.value });
     showToast({ title: 'Success', message: 'Fee updated successfully', toastType: 'success' });
     const res = await orders_api.getOrder(route.params.id as string);
     order.value = res.data;
  } catch (e: any) {
     showToast({ title: 'Error', message: e.response?.data?.message || 'Could not update fee', toastType: 'error' });
  } finally {
     isIncreasingFee.value = false;
  }
};

const isAcceptingBid = ref<string | null>(null);

const isOrderCompletedModalOpen = ref(false);

watch(() => order.value?.status, (newStatus) => {
  if (order.value?.type === 'custom_errand' && newStatus === 'delivered') {
    isOrderCompletedModalOpen.value = true;
  }
}, { immediate: true });
const isAcceptBidModalOpen = ref(false);
const selectedBidId = ref<string | null>(null);
const selectedBid = ref<any>(null);

const promptAcceptBid = (bidId: string, bidObj: any) => {
  selectedBidId.value = bidId;
  selectedBid.value = bidObj;
  isAcceptBidModalOpen.value = true;
};

const executeAcceptBid = async () => {
  if (!selectedBidId.value) return;
  isAcceptingBid.value = selectedBidId.value;
  try {
    const res = await api.put(`/orders/${order.value._id}/custom/bid/${selectedBidId.value}/accept`);
    showToast({ title: 'Success', message: 'Counter-offer accepted! Please complete payment.', toastType: 'success' });
    const freshOrder = await orders_api.getOrder(route.params.id as string);
    order.value = freshOrder.data;
  } catch (e: any) {
    showToast({ title: 'Error', message: e.response?.data?.message || 'Could not accept bid', toastType: 'error' });
  } finally {
    isAcceptingBid.value = null;
    isAcceptBidModalOpen.value = false;
  }
};



const payForErrand = async () => {
  isInitializingPayment.value = true;
  try {
     // Use order.total which was already correctly set by acceptBid
     const amount = order.value.total;
     const data = await initializePayment({
        amount,
        customer: { name: user.value?.firstName || 'Student', email: user.value?.email || 'student@erranders.com' },
        callback_url: `${window.location.origin}/dashboard/orders/${order.value._id}`,
        metadata: { isCustomErrand: order.value.type === 'custom_errand', orderId: order.value._id, orderIds: [order.value._id] }
     });
     const authUrl = data?.data?.authorization_url || data?.authorization_url;
     if (authUrl) window.location.href = authUrl;
     else showToast({ title: 'Error', message: 'Payment gateway unavailable', toastType: 'error' });
  } catch(e) {
     showToast({ title: 'Error', message: 'Could not initialize payment', toastType: 'error' });
  } finally {
     isInitializingPayment.value = false;
  }
};

const isPayingWithWallet = ref(false);


const showSubstituteReviewModal = ref(false);
const substituteData = ref<any>(null);

const resumeSubstitute = (item: any) => {
  if (!item || !item.substituteOptions || item.substituteOptions.length === 0) return;
  substituteData.value = {
    orderId: order.value._id,
    itemId: item._id,
    substituteItemId: item.substituteOptions[0]._id,
    substituteItemIds: item.substituteOptions.map((opt: any) => opt._id),
    substituteOptions: item.substituteOptions,
    originalItemName: item.name,
    substituteName: item.substituteOptions[0].name
  };
  showSubstituteReviewModal.value = true;
};
const isResolvingSubstitute = ref(false);
const selectedSubstituteOptionId = ref<string | null>(null);
const substituteNote = ref('');

const originalSubstituteItem = computed(() => {
  if (!substituteData.value || !order.value) return null;
  const id = substituteData.value.itemId;
  const matches = (i: any) => i._id === id || i.menuItem === id || i.product === id;
  let found = order.value.menuItems?.find(matches) || order.value.items?.find(matches);
  if (!found) {
    for (const pack of (order.value.packs || [])) {
      found = pack.items?.find(matches);
      if (found) break;
    }
  }
  return found;
});

const originalSubstituteItemPrice = computed(() => originalSubstituteItem.value?.price || 0);
const originalSubstituteItemQty = computed(() => originalSubstituteItem.value?.quantity || 1);

const getSubstitutePriceDiff = (optPrice: number) => {
  const originalSubtotal = originalSubstituteItemPrice.value * originalSubstituteItemQty.value;
  const newSubtotal = optPrice * originalSubstituteItemQty.value;
  return newSubtotal - originalSubtotal;
};

const getSubstituteSubmitText = () => {
  if (!selectedSubstituteOptionId.value) return 'Select an Option';
  const opt = substituteData.value?.substituteOptions?.find((o: any) => o._id === selectedSubstituteOptionId.value);
  if (!opt) return 'Accept Swap';
  const diff = getSubstitutePriceDiff(opt.price);
  if (diff > 0) {
    if (balance.value < diff) return 'Fund Wallet & Accept';
    return `Accept (Pay ₦${diff.toLocaleString()})`;
  }
  return 'Accept Swap';
};

const resolveSubstitute = async (accept: boolean) => {
  if (!substituteData.value) return;
  
  if (accept && !selectedSubstituteOptionId.value) {
    showToast({ title: 'Select an Option', message: 'Please select a substitute option to accept.', toastType: 'error' });
    return;
  }

  if (accept) {
    const opt = substituteData.value?.substituteOptions?.find((o: any) => o._id === selectedSubstituteOptionId.value);
    if (opt) {
      const diff = getSubstitutePriceDiff(opt.price);
      if (diff > 0 && balance.value < diff) {
        showToast({ title: 'Insufficient Funds', message: 'Redirecting to fund your wallet...', toastType: 'info' });
        fundAmountNeeded.value = diff - balance.value;
        showSubstituteReviewModal.value = false;
        initiateWalletTopup(); 
        return;
      }
    }
  }

  isResolvingSubstitute.value = true;
  try {
    await api.post(`/orders/${order.value._id}/substitute/resolve`, {
      itemId: substituteData.value.itemId,
      accept,
      substituteItemId: accept ? selectedSubstituteOptionId.value : '',
      note: accept ? substituteNote.value : undefined,
      itemName: substituteData.value.originalItemName
    });
    showToast({ 
      title: accept ? 'Substitute Accepted' : 'Substitute Declined', 
      message: accept ? 'The rider will pick up the new item.' : 'You will be refunded for this item.', 
      toastType: 'success' 
    });
    showSubstituteReviewModal.value = false;
    substituteData.value = null;
    selectedSubstituteOptionId.value = null;
    substituteNote.value = '';
    const res = await orders_api.getOrder(route.params.id as string);
    order.value = res.data;
  } catch (e: any) {
    showToast({ title: 'Error', message: e.response?.data?.message || 'Action failed', toastType: 'error' });
  } finally {
    isResolvingSubstitute.value = false;
  }
};

const showTopupModal = ref(false);
const topupAmount = ref(0);
const isPayingTopup = ref(false);

const payTopup = async () => {
  if (balance.value < topupAmount.value) {
     showToast({ title: 'Insufficient Funds', message: 'Please fund your wallet first.', toastType: 'error' });
     initiateWalletTopup(); // Reuse the same flow
     return;
  }
  isPayingTopup.value = true;
  try {
     // call topup endpoint, guessing the path based on backend
     await api.post(`/orders/${order.value._id}/custom/topup/pay`);
     showToast({ title: 'Success', message: 'Extra funds paid from wallet', toastType: 'success' });
     showTopupModal.value = false;
     const res = await orders_api.getOrder(route.params.id as string);
     order.value = res.data;
  } catch(e: any) {
     showToast({ title: 'Error', message: e.response?.data?.message || 'Topup failed', toastType: 'error' });
  } finally {
     isPayingTopup.value = false;
  }
};

const isFundModalOpen = ref(false);
const fundAmountNeeded = ref(0);

const initiateWalletTopup = async () => {
  try {
    // Redirect to wallet with topup query param so it automatically triggers Paystack and returns here
    router.push({
      path: '/dashboard/wallet',
      query: {
        topup: fundAmountNeeded.value.toString(),
        redirect: `/dashboard/orders/${route.params.id}`
      }
    });
  } catch (e) {
    showToast({ title: 'Error', message: 'Could not initiate top-up', toastType: 'error' });
  }
};

const payForErrandWithWallet = async () => {
  if (balance.value < order.value.total) {
    fundAmountNeeded.value = order.value.total - balance.value;
    isFundModalOpen.value = true;
    return;
  }

  isPayingWithWallet.value = true;
  try {
    const res = await payWithWallet(order.value._id);
    showToast({ title: 'Payment Successful', message: 'Errand paid via wallet successfully!', toastType: 'success' });
    order.value = res; // update order from response
    
    // Auto-refresh user balance
    try {
      await fetchWallet();
    } catch(e) {}
  } catch (e: any) {
    showToast({ title: 'Error', message: e.response?.data?.message || 'Could not pay with wallet', toastType: 'error' });
  } finally {
    isPayingWithWallet.value = false;
  }
};

const submitRatings = async () => {
  isSubmittingRating.value = true;
  try {
    await orders_api.rateOrder(order.value._id, ratingForm);
    showToast({
      title: "Feedback Saved! 🎉",
      message: "You've earned 20 points! Thank you for helping us improve campus deliveries.",
      toastType: "success"
    });
    const res = await orders_api.getOrder(route.params.id as string);
    order.value = res.data;
  } catch (e) {
    showToast({
      title: "Rating Failed",
      message: "We couldn't save your feedback. Please try again later.",
      toastType: "error"
    });
  } finally {
    isSubmittingRating.value = false;
  }
};

const approveReconciliation = async () => {
  isApprovingReconciliation.value = true;
  try {
    await orders_api.approveReconciliation(order.value._id);
    showToast({ title: 'Approved!', message: 'Reconciliation approved successfully.', toastType: 'success' });
    const res = await orders_api.getOrder(route.params.id as string);
    order.value = res.data;
    try {
      await fetchWallet();
    } catch(e) {}
  } catch (e: any) {
    showToast({ title: 'Error', message: e.response?.data?.message || 'Could not approve reconciliation', toastType: 'error' });
  } finally {
    isApprovingReconciliation.value = false;
  }
};

const copyAccountDetails = () => {
  if (!order.value?.erranderDetails) return;
  const { bankName, accountNumber, accountName } = order.value.erranderDetails;
  const text = `${bankName}\n${accountNumber}\n${accountName}`;
  navigator.clipboard.writeText(text);
  showToast({ title: 'Copied!', message: 'Account details copied to clipboard.', toastType: 'success' });
};

const copyVerificationCode = async () => {
  if (!order.value?.deliveryPin) return;
  try {
    await navigator.clipboard.writeText(order.value.deliveryPin);
    showToast({ title: 'Copied!', message: 'Verification code copied to clipboard.', toastType: 'success' });
  } catch (err) {
    showToast({ title: 'Failed', message: 'Could not copy code.', toastType: 'error' });
  }
};

// Order Tracking Stepper Logic
const CUSTOM_ERRAND_STEPS = [
  { status: 'pending', label: 'Errand Broadcasted', description: 'Waiting for riders to respond' },
  { status: 'awaiting_payment', label: 'Rider Negotiated', description: 'Waiting for payment' },
  { status: 'confirmed', label: 'In Progress', description: 'Rider is currently running your errand' },
  { status: 'picked_up', label: 'Picked Up', description: 'Rider has picked up the items' },
  { status: 'in_transit', label: 'Heading to you', description: 'Rider is on their way with the items' },
  { status: 'delivered', label: 'Delivered', description: 'Errand completed successfully' }
];

const getStatusIndex = (status: string, stepsArray: any[]) => {
  const mappedStatus = status === 'awaiting_payment_confirmation' ? 'awaiting_payment' : status;
  return stepsArray.findIndex(s => s.status === mappedStatus);
};

const isStepCompletedCustom = (stepStatus: string, stepsArray: any[]) => {
  if (!order.value?.status) return false;
  if (stepStatus === 'delivered' && order.value.status === 'delivered') return true;
  const currentIdx = getStatusIndex(order.value.status, stepsArray);
  const stepIdx = getStatusIndex(stepStatus, stepsArray);
  return stepIdx < currentIdx;
};

const isStepCurrentCustom = (stepStatus: string) => {
  if (!order.value?.status) return false;
  const currentMappedStatus = order.value.status === 'awaiting_payment_confirmation' ? 'awaiting_payment' : order.value.status;
  return stepStatus === currentMappedStatus;
};

const orderSteps = computed(() => {
  if (order.value?.type === 'custom_errand') {
    return CUSTOM_ERRAND_STEPS.map(s => ({
      ...s,
      _completed: isStepCompletedCustom(s.status, CUSTOM_ERRAND_STEPS),
      _current: isStepCurrentCustom(s.status)
    }));
  }
  
  const status = order.value?.status;
  const isNegotiated = order.value?.locationType === 'campus_environs' || order.value?.proposedDeliveryFee;
  const hasErrander = !!order.value?.errander;
  
  // For negotiated marketplace orders, the flow includes awaiting_payment
  const completedStatuses = ['confirmed', 'preparing', 'ready_for_pickup', 'picked_up', 'in_transit', 'delivered'];
  const isCompleted = (s: string) => {
    const statusOrder = ['pending', 'negotiating', 'awaiting_payment', 'confirmed', 'preparing', 'ready_for_pickup', 'picked_up', 'in_transit', 'delivered'];
    const currentIdx = statusOrder.indexOf(status);
    const stepIdx = statusOrder.indexOf(s);
    return stepIdx < currentIdx;
  };
  
  return [
    { 
      label: 'Order Placed', 
      _completed: true, 
      _current: false 
    },
    { 
      label: 'Preparing', 
      _completed: ['ready_for_pickup', 'picked_up', 'in_transit', 'delivered'].includes(status),
      _current: ['confirmed', 'preparing'].includes(status)
    },
    {
      label: hasErrander ? 'Rider Assigned' : (isNegotiated && ['negotiating', 'awaiting_payment'].includes(status) ? 'Finding Rider...' : 'Rider Assigned'),
      _completed: hasErrander && completedStatuses.includes(status),
      _current: (hasErrander && ['confirmed', 'preparing'].includes(status)) || ['negotiating', 'awaiting_payment'].includes(status)
    },
    { 
      label: 'On Way', 
      _completed: ['delivered'].includes(status),
      _current: ['picked_up', 'in_transit'].includes(status)
    },
    { 
      label: 'Delivered', 
      _completed: status === 'delivered',
      _current: status === 'delivered'
    }
  ];
});

useHead({ title: 'Order Details - Errandr' });
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>