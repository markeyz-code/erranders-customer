<template>
 <div class="min-h-screen bg-[#FDFDFD] pb-32 font-sans selection:bg-parentPrimary/10">
 <!-- Immersive Header -->
 <div class="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
 <div class="max-w-5xl w-full mx-auto px-4 py-6 sm:py-0 sm:h-16 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
 <div class="flex items-center gap-3">
 <button 
 @click="router.push('/')" 
 class="w-9 h-9 bg-white rounded-xl flex items-center justify-center border border-gray-100 hover: hover:border-gray-200 transition-all group active:scale-95 shrink-0"
 >
 <ArrowLeft class="w-4 h-4 text-gray-900 group-hover:-translate-x-1 transition-transform" />
 </button>
 <div class="flex flex-col min-w-0">
 <h1 class="text-base sm:text-lg font-medium text-gray-900 tracking-tight leading-none">Order Status</h1>
 <div v-if="order" class="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1 sm:mt-1.5">
 <span class="text-xs sm:text-sm font-medium text-gray-400 truncate">ID: {{ order.orderNumber }}</span>
 <span class="w-1 h-1 bg-gray-300 rounded-full shrink-0"></span>
 <span class="text-xs sm:text-sm font-bold text-gray-400 whitespace-nowrap">{{ formatDate(order.createdAt) }}</span>
 </div>
 </div>
 </div>
 
 <div class="flex items-center justify-end sm:justify-start">
 <!-- <button 
         v-if="order?.type !== 'custom_errand'"
         @click="reorder" 
         :disabled="reordering"
         class="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-gray-900 text-white rounded-xl text-xs sm:text-sm font-medium hover:bg-parentPrimary hover: hover:shadow-parentPrimary/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
         >
         <RefreshCw v-if="reordering" class="w-3.5 h-3.5 animate-spin" />
         <span>{{ reordering ? 'Processing' : 'Reorder Items' }}</span>
         </button> -->
 </div>
 </div>
 </div>

 <div v-if="loading" class="max-w-5xl w-full mx-auto px-4 md:px-4 py-12 space-y-5 md:space-y-8">
 <div class="h-40 bg-gray-50 rounded-[2.5rem] animate-pulse"></div>
 <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
 <div class="lg:col-span-2 h-96 bg-gray-50 rounded-[2.5rem] animate-pulse"></div>
 <div class="h-80 bg-gray-50 rounded-[2.5rem] animate-pulse"></div>
 </div>
 </div>
 <main class="max-w-7xl w-full mx-auto px-4 py-4 md:py-5">
 <div v-if="loading" class="flex flex-col items-center justify-center py-32 space-y-4">
 <div class="w-10 h-10 border-2 border-gray-100 border-t-parentPrimary rounded-full animate-spin" />
 <p class="text-sm font-bold text-gray-400 animate-pulse">Retrieving order details...</p>
 </div>

 <div v-else-if="order" class="space-y-4 md:space-y-6">
 <!-- Status Communication Banner -->
 <div v-if="order.type !== 'custom_errand' && order.status !== 'pending' && order.status !== 'delivered' && order.status !== 'cancelled'" class="animate-fade-in">
 
 <!-- Vendor ready, no errander yet -->
 <div v-if="!order.errander && order.status === 'ready_for_pickup'" class="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-4 items-start ">
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
 <div v-else-if="order.errander && (order.status === 'preparing' || order.status === 'ready_for_pickup')" class="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-4 items-start ">
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
 <div v-else-if="order.status === 'in_transit'" class="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex gap-4 items-start ">
 <div class="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
 <CheckCircle2 class="w-5 h-5" />
 </div>
 <div>
 <h4 class="text-sm font-bold text-emerald-900">Order Picked Up!</h4>
 <p class="text-[13px] text-emerald-800 mt-1 leading-relaxed">
 Your Errand Ninja has successfully picked up your order and is currently on their way to deliver it to you. Keep an eye out!
 </p>
 </div>
 </div>

 </div>

 <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-8 items-start">
 
 <!-- LEFT COLUMN (8 cols): Journey, Items, Delivery -->
 <div class="md:col-span-12 lg:col-span-8 space-y-5 md:space-y-8">
 
 <!-- Timeline Card -->
 <div class="bg-white rounded-2xl border border-gray-100 p-4 md:p-4 space-y-4 md:space-y-6">
 <div class="flex items-center justify-between border-b border-gray-50 pb-4">
 <h3 class="text-sm font-medium text-gray-900 r">Journey Progress</h3>
 <Clock class="w-4 h-4 text-gray-300" />
 </div>

 <div class="space-y-4 md:space-y-6 md:space-y-10 relative pl-4">
 <!-- Vertical Line -->
 <div class="absolute left-[31px] top-6 bottom-6 w-[2px] bg-gray-100" />

 <div v-for="(step, idx) in trackSteps" :key="step.label" class="flex gap-3 md:gap-6 items-start relative z-10">
 <div 
 class="w-8 h-8 rounded-xl flex items-center justify-center border-2 border-white transition-all duration-500"
 :class="step.active ? 'bg-parentPrimary text-white scale-110' : 'bg-gray-100 text-gray-400'"
 >
 <component :is="step.icon" class="w-3.5 h-3.5" />
 </div>
 <div class="flex-1">
 <div class="flex items-center justify-between group">
 <h4 class="text-[11px] font-medium transition-colors" :class="step.active ? 'text-gray-900' : 'text-gray-300'">
 {{ step.label }}
 </h4>
 <span v-if="step.timestamp" class="text-sm font-bold text-gray-400 ">{{ formatTime(step.timestamp) }}</span>
 </div>
 <p v-if="step.active" class="text-sm font-bold text-parentPrimary/60 mt-0.5" :class="{'animate-pulse': step.current}">
 {{ step.current ? 'Current Status' : 'Completed' }}
 </p>
 </div>
 </div>
 </div>
 </div>

 <!-- Items Breakdown -->
 <div class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
 <div class="px-4 md:px-4 py-4 border-b border-gray-50 flex items-center justify-between">
 <div>
 <h3 class="text-sm font-medium text-gray-900 r">{{ order.type === 'custom_errand' ? 'Errand Summary' : 'Order Breakdown' }}</h3>
 <p v-if="order.type !== 'custom_errand'" class="text-sm font-bold text-gray-400 mt-0.5">{{ order.items?.length || 0 }} Items Ordered</p>
 <p v-else class="text-sm font-bold text-gray-400 mt-0.5">Custom Errand Details</p>
 </div>
 <div class="flex items-center gap-2">
 <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
 <span class="text-sm font-bold text-emerald-600 r">Confirmed Receipt</span>
 </div>
 </div>

 <div class="p-4 md:p-4">
 <!-- Custom Errand details -->
 <div v-if="order.type === 'custom_errand'" class="space-y-4">
 <div class="p-4 bg-gray-50/50 rounded-xl text-sm text-gray-700 leading-relaxed whitespace-pre-line">
 {{ order.customDetails?.description }}
 <div v-if="order.customDetails?.attachedVoiceNote" class="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-2">
 <span class="text-xs font-medium text-gray-500 uppercase tracking-widest">Attached Voice Note</span>
 <audio :src="order.customDetails.attachedVoiceNote" controls class="w-full h-10 bg-white rounded-full " preload="metadata" />
 </div>
 <div class="mt-3 pt-3 border-t border-gray-200 flex justify-between items-center text-xs">
 <span class="font-medium text-gray-500">Estimated Item Cost</span>
 <span class="font-bold text-gray-900">₦{{ (order.customDetails?.estimatedItemCost || 0).toLocaleString() }}</span>
 </div>

 <!-- Proof of Items Photo -->
 <div v-if="order.itemsPhoto" class="mt-4 pt-4 border-t border-gray-200">
   <div class="p-4 rounded-xl border border-gray-100 flex flex-col items-center">
     <h4 class="text-[11px] font-bold text-gray-400 mb-4 tracking-widest uppercase flex items-center gap-1.5 w-full">
       <Camera class="w-3.5 h-3.5" /> Proof of Purchased Items
     </h4>
     <div class="w-full h-48 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 mb-3 cursor-pointer" @click="window.open(order.itemsPhoto, '_blank')">
       <img :src="order.itemsPhoto" class="w-full h-full object-cover hover:scale-105 transition-transform" />
     </div>
     <p class="text-xs text-gray-500 text-center">Your rider has uploaded a photo of the items purchased from the vendor.</p>
   </div>
 </div>

 <!-- Reconciliation Status / Approval -->
 <div v-if="order.reconciliationStatus && order.reconciliationStatus !== 'not_applicable'" class="mt-4 pt-4 border-t border-gray-200">
 <div v-if="order.reconciliationStatus === 'pending'" class="text-xs font-medium text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100 flex items-center gap-2">
 <Clock class="w-4 h-4" /> Rider will submit actual item cost after purchase.
 </div>
 
 <div v-else-if="order.reconciliationStatus === 'submitted'" class="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-3">
 <div class="flex items-start gap-3">
 <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
 🧾
 </div>
 <div>
 <h4 class="text-sm font-bold text-blue-900">Approve Actual Cost</h4>
 <p class="text-xs text-blue-700 mt-1">The rider reported spending <strong>₦{{ order.actualItemCost?.toLocaleString() }}</strong>.</p>
 <p v-if="order.refundAmount > 0" class="text-[11px] font-bold text-emerald-600 mt-1">
 You will be refunded ₦{{ order.refundAmount.toLocaleString() }} to your wallet.
 </p>
 <p v-else-if="order.actualItemCost > order.customDetails?.estimatedItemCost" class="text-[11px] font-bold text-blue-600 mt-1">
 The rider covered the extra ₦{{ (order.actualItemCost - order.customDetails.estimatedItemCost).toLocaleString() }}.
 </p>
 </div>
 </div>
 <button 
 @click="approveReconciliation"
 :disabled="approvingReconciliation"
 class="w-full py-2.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
 >
 <Loader2 v-if="approvingReconciliation" class="w-4 h-4 animate-spin" />
 <span v-else>👍</span>
 {{ approvingReconciliation ? 'Approving...' : 'Approve & Confirm' }}
 </button>
 </div>

 <div v-else-if="order.reconciliationStatus === 'approved'" class="text-xs font-bold text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-100 flex items-center justify-between">
 <div class="flex items-center gap-2">
 <CheckCircle class="w-4 h-4" /> Actual Cost: ₦{{ order.actualItemCost?.toLocaleString() }}
 </div>
 <span v-if="order.refundAmount > 0" class="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full">Refunded ₦{{ order.refundAmount.toLocaleString() }}</span>
 </div>
 </div>
 </div>
 </div>
 <!-- If packs exist -->
 <div v-else-if="order.packs?.length > 0" class="space-y-5 md:space-y-8">
 <div v-for="(pack, pIdx) in order.packs" :key="pack._id || pIdx" class="space-y-4">
 <div class="flex items-center gap-3">
 <div class="w-6 h-6 rounded-lg bg-gray-900 text-white flex items-center justify-center text-sm font-medium ">
 {{ Number(pIdx) + 1 }}
 </div>
 <h4 class="text-sm font-medium text-gray-900 tracking-tight">{{ pack.name || `Pack ${Number(pIdx) + 1}` }}</h4>
 <div class="flex-1 h-px bg-gray-100" />
 </div>

 <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
 <div v-for="item in pack.items" :key="item.product" class="flex items-start gap-3 p-3 rounded-xl border border-gray-50 hover:bg-gray-50/50 transition-colors">
 <div class="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
 <img :src="item.image || '/placeholder-food.jpg'" class="w-full h-full object-cover" />
 </div>
 <div class="flex-1 min-w-0">
 <div class="flex justify-between items-start mb-1">
 <div>
 <p class="text-sm font-bold text-gray-900 truncate tracking-tight">{{ item.name }}</p>
 <p v-if="item.customizations?.length" class="text-[10px] font-medium text-gray-400 mt-0.5">Base: ₦{{ item.price?.toLocaleString() }}</p>
 </div>
 <p class="text-xs font-bold text-gray-900 shrink-0">₦{{ item.price?.toLocaleString() }} <span class="text-gray-400 ml-0.5">×{{ item.quantity }}</span></p>
 </div>
 
 <div v-if="item.customizations?.length" class="mt-1.5 mb-2 pl-2 border-l-2 border-gray-100 space-y-1">
 <p v-for="(c, cIdx) in getGroupedCustomizations(item.customizations)" :key="cIdx" class="text-[10px] font-medium text-gray-500 flex justify-between">
 <span class="truncate pr-2">{{ c.quantity > 1 ? c.quantity + 'x ' : '' }}{{ c.name }}</span>
 <span v-if="c.price > 0" class="text-gray-400 shrink-0">+₦{{ c.price.toLocaleString() }}</span>
 </p>
 </div>
 
 <div class="flex justify-end mt-1">
 <span class="text-xs font-bold text-parentPrimary">Total: ₦{{ (item.subtotal || (item.price * item.quantity)).toLocaleString() }}</span>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
 <div v-for="item in order.items" :key="item.product" class="flex items-start gap-3 p-3 rounded-xl border border-gray-50 hover:bg-gray-50/50 transition-colors">
 <div class="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
 <img :src="item.image || '/placeholder-food.jpg'" class="w-full h-full object-cover" />
 </div>
 <div class="flex-1 min-w-0">
 <div class="flex justify-between items-start mb-1">
 <div>
 <p class="text-sm font-bold text-gray-900 truncate tracking-tight">{{ item.name }}</p>
 <p v-if="item.customizations?.length" class="text-[10px] font-medium text-gray-400 mt-0.5">Base: ₦{{ item.price?.toLocaleString() }}</p>
 </div>
 <p class="text-xs font-bold text-gray-900 shrink-0">₦{{ item.price?.toLocaleString() }} <span class="text-gray-400 ml-0.5">×{{ item.quantity }}</span></p>
 </div>
 
 <div v-if="item.customizations?.length" class="mt-1.5 mb-2 pl-2 border-l-2 border-gray-100 space-y-1">
 <p v-for="(c, cIdx) in getGroupedCustomizations(item.customizations)" :key="cIdx" class="text-[10px] font-medium text-gray-500 flex justify-between">
 <span class="truncate pr-2">{{ c.quantity > 1 ? c.quantity + 'x ' : '' }}{{ c.name }}</span>
 <span v-if="c.price > 0" class="text-gray-400 shrink-0">+₦{{ c.price.toLocaleString() }}</span>
 </p>
 </div>
 
 <div class="flex justify-end mt-1">
 <span class="text-xs font-bold text-parentPrimary">Total: ₦{{ (item.subtotal || (item.price * item.quantity)).toLocaleString() }}</span>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>

 <!-- Delivery Destination -->
 <div class="bg-gray-900 rounded-2xl p-4 md:p-4 text-white relative overflow-hidden group">
 <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-parentPrimary/20 rounded-full blur-2xl opacity-50 group-hover:bg-parentPrimary/40 transition-all duration-1000" />
 
 <div class="relative z-10 space-y-5">
 <div class="flex items-center justify-between">
 <h3 class="text-sm font-medium text-white/40 r">Shipping To</h3>
 <div class="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-md border border-white/10 ">
 <MapPin class="w-4 h-4 text-parentPrimary" />
 </div>
 </div>

 <div class="space-y-2">
 <h4 class="text-xl font-bold tracking-tight">{{ order.type === 'custom_errand' ? order.customDetails?.dropoffLocation : (order.recipientName || 'Student Resident') }}</h4>
 <p class="text-[11px] text-white/60 font-medium leading-relaxed line-clamp-2">
 {{ order.type === 'custom_errand' ? 'Custom Dropoff Point' : (order.deliveryAddress || order.specificAddress || 'No specific address provided') }}
 </p>
 </div>

 <div class="pt-6 border-t border-white/10 flex items-center gap-4">
 <div class="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
 <Truck class="w-5 h-5 text-gray-400" />
 </div>
 <div class="flex-1">
 <p class="text-sm font-medium text-white/40 ">Method</p>
 <p class="text-[11px] font-bold text-white r">{{ order.deliveryOption?.replace(/_/g, ' ') || 'Use an Errandr' }}</p>
 </div>
 </div>
 </div>
 </div>
 </div>

 <!-- RIGHT COLUMN (4 cols): Status, Provider, Payment, Helpful links -->
 <div class="md:col-span-12 lg:col-span-4 space-y-5 md:space-y-8">
 
 <!-- Status Overview Card (Compact) -->
 <div class="bg-white rounded-2xl p-4 md:p-4 border border-gray-100 overflow-hidden relative group">
 <div class="absolute top-0 right-0 w-24 h-24 bg-parentPrimary/5 rounded-full -translate-y-12 translate-x-12 blur-xl group-hover:bg-parentPrimary/10 transition-all duration-700" />
 
 <div class="flex flex-col items-start gap-4 relative z-10">
 <div class="flex items-center gap-4">
 <div :class="[getStatusTheme(order.status).bg, getStatusTheme(order.status).text]" class="w-12 h-12 rounded-xl flex items-center justify-center border border-white transition-transform hover:scale-105">
 <component :is="getStatusTheme(order.status).icon" class="w-6 h-6" />
 </div>
 <div>
 <p class="text-sm font-medium text-gray-400 r mb-0.5">Live Status</p>
 <h2 class="text-xl font-medium text-gray-900 tracking-tight transition-all ">{{ order.status.replace(/_/g, ' ') }}</h2>
 </div>
 </div>
 <div v-if="order.status === 'pending' || order.status === 'awaiting_payment'" class="mt-4">
    <button @click="payForOrder" :disabled="processingPayment" class="w-full py-3 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-bold tracking-wide transition-all shadow-md shadow-gray-900/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2">
      <Loader2 v-if="processingPayment" class="w-4 h-4 animate-spin" />
      <span>{{ processingPayment ? 'Initializing...' : 'Complete Payment Now' }}</span>
    </button>
 </div>
 </div>

 <template v-if="order.deliveryPin">
  <div class="flex items-center gap-3 mt-6 bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100 min-w-full relative z-10">
  <div class="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
  <ShieldCheck class="w-4 h-4" />
  </div>
  <div class="flex-1 min-w-0">
  <p class="text-[8px] font-medium text-emerald-600 r mb-0.5 truncate">Delivery PIN</p>
  <p class="text-lg font-medium text-gray-900 truncate">{{ order.deliveryPin }}</p>
  </div>
  <div class="text-[8px] font-bold text-emerald-600 bg-white px-1.5 py-0.5 rounded border border-emerald-100 flex-shrink-0">Give to Rider</div>
  </div>
  <p class="text-sm font-medium text-gray-400 mt-3 relative z-10">Share this PIN with the rider upon delivery to confirm receipt.</p>
  </template>
 </div>

 <!-- Service Provider Info -->
 <div v-if="order.type !== 'custom_errand' || order.errander?._id" class="bg-white rounded-2xl border border-gray-100 overflow-hidden">
 <div class="p-4 md:p-4">
 <h3 class="text-sm font-medium text-gray-400 r mb-4">{{ order.type === 'custom_errand' ? 'Assigned Errander' : 'Service Provider' }}</h3>
 
 <div class="flex items-center gap-4 mb-8">
 <div class="w-16 h-16 rounded-2xl border border-gray-100 overflow-hidden flex items-center justify-center bg-gray-50 flex-shrink-0">
 <template v-if="order.type !== 'custom_errand'">
 <video v-if="order.vendor?.logo && order.vendor.logo.match(/\.(mp4|webm|ogg|mov)$/i)" :src="order.vendor.logo" class="w-full h-full object-cover" autoplay loop muted playsinline></video>
 <img v-else-if="order.vendor?.logo" :src="order.vendor.logo" class="w-full h-full object-cover" />
 <Store v-else class="w-8 h-8 text-gray-300" />
 </template>
 <template v-else>
 <img v-if="order.errander?.user?.avatar || order.errander?.avatar" :src="order.errander?.user?.avatar || order.errander?.avatar" class="w-full h-full object-cover" />
 <img v-else-if="order.errander?.firstName || order.errander?.user?.firstName" :src="`https://ui-avatars.com/api/?name=${order.errander?.user?.firstName || order.errander?.firstName}+${order.errander?.user?.lastName || order.errander?.lastName || ''}&background=F3F4F6&color=9CA3AF&bold=true`" class="w-full h-full object-cover" />
 <User v-else class="w-8 h-8 text-gray-300" />
 </template>
 </div>
 <div class="flex-1 min-w-0">
 <h4 class="text-lg font-medium text-gray-900 tracking-tight truncate">
 {{ order.type === 'custom_errand' ? (order.errander?.user?.firstName || order.errander?.firstName) + ' ' + (order.errander?.user?.lastName || order.errander?.lastName || '') : (order.vendor?.storeName || 'Vendor') }}
 </h4>
 <p class="text-sm font-bold text-parentPrimary flex items-center gap-1 truncate">
 <ShieldCheck class="w-3 h-3 flex-shrink-0" /> Verified {{ order.type === 'custom_errand' ? 'Errander' : 'Errandr Vendor' }}
 </p>
 </div>
 </div>

 <div class="space-y-3">
 <button 
 v-if="order.type !== 'custom_errand'"
 @click="openChat((order.vendor?.owner?._id || order.vendor?.owner || '') + ',' + (order.vendor?._id || ''), order.vendor?.storeName || 'Vendor', order.vendor?.logo)"
 class="w-full py-4 bg-gray-50 hover:bg-gray-100 text-gray-900 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border border-gray-100"
 >
 <MessageSquare class="w-3.5 h-3.5" /> Message Store (In-App)
 </button>

 <a 
 v-if="order.type !== 'custom_errand'"
 :href="getWhatsAppLink(order.vendor?.phone || order.vendor?.owner?.phone || '2348000000000')"
 target="_blank"
 class="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm shadow-[#25D366]/30"
 >
 <MessageSquare class="w-3.5 h-3.5" /> WhatsApp Store
 </a>

 <button 
 v-if="order.errander?._id"
 @click="openChat(order.errander?.user?._id || order.errander?.user || order.errander._id, (order.errander?.user?.firstName || order.errander?.firstName) + ' (Rider)', order.errander?.user?.avatar)"
 class="w-full py-4 bg-parentPrimary/5 hover:bg-parentPrimary/10 text-parentPrimary rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 border border-parentPrimary/10"
 >
 <MessageSquare class="w-3.5 h-3.5" /> Message Rider (In-App)
 </button>

 <a 
 v-if="order.errander?._id"
 :href="getWhatsAppLink(order.errander?.user?.phone || order.errander?.phone || '2348000000000')"
 target="_blank"
 class="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm shadow-[#25D366]/30"
 >
 <MessageSquare class="w-3.5 h-3.5" /> WhatsApp Rider
 </a>
 <button 
 v-if="order.type !== 'custom_errand'"
 @click="navigateTo(`/vendors/${order.vendor?._id}`)"
 class="w-full py-4 text-gray-400 hover:text-gray-900 text-sm font-bold transition-colors"
 >
 View Store Details
 </button>
 <button 
 v-if="order.status === 'pending' || order.status === 'awaiting_payment' || order.status === 'negotiating' || order.status === 'scheduled'"
 @click="handleCancelOrderClick"
 class="w-full py-4 text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 rounded-xl text-sm font-bold transition-colors mt-2"
 >
 Cancel Order
 </button>
 </div>
 </div>
 </div>

 <!-- Payment Summary -->
 <div class="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 md:p-4">
 <h3 class="text-sm font-medium text-gray-900 r mb-4">Payment Summary</h3>
 <div class="space-y-2.5">
 <div class="flex justify-between items-center text-sm font-bold text-gray-500 r">
 <span>Cart Subtotal</span>
 <span class="text-gray-900">₦{{ order.subtotal?.toLocaleString() }}</span>
 </div>
 <div class="flex justify-between items-center text-sm font-bold text-gray-500 r">
 <span>Delivery Charge</span>
 <span class="text-gray-900">₦{{ order.deliveryFee?.toLocaleString() || 0 }}</span>
 </div>
 <div class="flex justify-between items-center text-sm font-bold text-gray-500 r">
 <span>Packaging Fee</span>
 <span class="text-gray-900">₦{{ order.packagingFee?.toLocaleString() || 0 }}</span>
 </div>
 <div class="flex justify-between items-center text-sm font-bold text-gray-500 r">
 <span>Service Charge</span>
 <span class="text-gray-900">₦{{ ((order.serviceFee || 0) + (order.platformProcessingFee || 0)).toLocaleString() }}</span>
 </div>
 <div v-if="order.discount > 0" class="flex justify-between items-center text-sm font-bold text-parentPrimary r">
 <span>Discount Applied</span>
 <span class="font-bold">-₦{{ order.discount?.toLocaleString() }}</span>
 </div>
 <div v-if="order.promoCode" class="flex justify-between items-center text-[10px] font-bold text-gray-400 r mt-1">
 <span>Promo Code Used</span>
 <span>{{ order.promoCode }}</span>
 </div>
 <div class="h-px bg-gray-200 my-3" />
 <div class="flex justify-between items-center pt-1">
 <div>
 <span class="text-sm font-medium text-gray-900 r">Grand Total</span>
 <p class="text-[8px] font-bold text-emerald-600 border border-emerald-100 bg-emerald-50 px-1.5 py-0.5 rounded mt-0.5 inline-block r">
 <CreditCard class="w-2.5 h-2.5 inline-block -mt-0.5 mr-0.5" /> Paid via Card
 </p>
 </div>
 <span class="text-2xl font-medium text-gray-900 tracking-tighter">₦{{ order.total?.toLocaleString() }}</span>
 </div>
 </div>
 </div>

 <!-- Already Rated State / Rate Button -->
 <div v-if="order.status === 'delivered'" class="bg-white rounded-[2rem] border border-gray-100 p-4 md:p-4 text-center">
 <div v-if="order.rating">
 <div class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4">
 <Star class="w-6 h-6 text-yellow-400 fill-yellow-400" />
 </div>
 <p class="text-[11px] font-medium text-emerald-600 ">You rated this delivery {{ order.rating }} stars</p>
 <p v-if="order.review" class="text-sm font-bold text-gray-400 mt-2">"{{ order.review }}"</p>
 </div>
 <div v-else>
 <h3 class="text-base font-medium text-gray-900 tracking-tight mb-4">How was your delivery?</h3>
 <button 
 @click="showRatingModal = true"
 class="w-full py-4 bg-gray-900 text-white rounded-2xl text-[11px] font-medium tracking-[0.2em] hover:bg-gray-800 transition-all shadow-black/10"
 >
 RATE YOUR EXPERIENCE
 </button>
 </div>
 </div>

 <!-- Help Section -->
 <div class="bg-parentPrimary rounded-2xl p-4 md:p-4 text-white relative overflow-hidden group">
 <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
 <div class="relative z-10 flex flex-col items-center text-center space-y-3">
 <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-1 transition-transform group-hover:rotate-12">
 <LifeBuoy class="w-5 h-5 text-parentPrimary" />
 </div>
 <h3 class="text-base font-medium tracking-tight">Need Assistance?</h3>
 <p class="text-sm font-bold text-white/80 r">
 Our agents are online 24/7 to resolve issues.
 </p>
 <button 
 @click="showSupportModal = true"
 class="w-full mt-2 py-3 bg-white text-parentPrimary rounded-lg text-sm font-medium r hover:scale-[1.02] active:scale-95 transition-all "
 >
 Join Support Chat
 </button>
 </div>
 </div>
 </div>

 </div>
 </div>

 <!-- Not Found State -->
 <div v-else class="text-center py-40 animate-fade-in">
 <div class="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-gray-100 ">
 <Inbox class="w-10 h-10 text-gray-300" />
 </div>
 <h2 class="text-4xl font-medium text-gray-900 tracking-tighter mb-4">Order Lost in Space</h2>
 <p class="text-sm font-bold text-gray-400 mb-10 ">We couldn't find the order details you're looking for.</p>
 <button @click="navigateTo('/orders')" class="px-10 py-5 bg-gray-900 text-white rounded-[2rem] text-sm font-medium tracking-[0.2em] shadow-black/20 hover:scale-105 active:scale-95 transition-all">
 Back to My Orders
 </button>
 </div>
 </main>

 <!-- Footer Space -->
 <div class="h-20" />

 <OrderChat
 v-if="order"
 :is-open="isChatOpen"
 :order-id="order._id"
 :current-user-id="user?._id || ''"
 :receiver-id="chatReceiverId"
 :receiver-name="chatReceiverName"
 :receiver-avatar="chatReceiverAvatar"
 @close="isChatOpen = false"
 />

 <UiModal :isOpen="showSupportModal" @close="showSupportModal = false" title="Need Help?">
 <div class="space-y-4 pt-4">
 <p class="text-sm text-gray-500 font-medium px-1">Please select who you would like to speak with regarding this order.</p>
 
 <div class="space-y-2">
 <button 
 v-if="order?.vendor"
 @click="triggerSupportChat(order.vendor.owner || order.vendor._id, order.vendor.storeName || 'Vendor', order.vendor.logo)"
 class="w-full p-4 rounded-xl border border-gray-100 hover:border-parentPrimary hover:bg-parentPrimary/5 flex items-center gap-4 transition-all bg-white"
 >
 <div class="w-10 h-10 rounded-full border border-gray-100 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
 <video v-if="order.vendor.logo && order.vendor.logo.match(/\.(mp4|webm|ogg|mov)$/i)" :src="order.vendor.logo" class="w-full h-full object-cover" autoplay loop muted playsinline></video>
 <img v-else-if="order.vendor.logo" :src="order.vendor.logo" class="w-full h-full object-cover" />
 <Store v-else class="w-5 h-5 text-gray-400" />
 </div>
 <div class="text-left flex-1 min-w-0">
 <h4 class="text-sm font-bold text-gray-900 truncate">Message the Store</h4>
 <p class="text-sm text-gray-400 font-medium mt-0.5 truncate">{{ order.vendor.storeName }}</p>
 </div>
 <MessageSquare class="w-4 h-4 text-parentPrimary shrink-0" />
 </button>

 <button 
 v-if="order?.errander"
 @click="triggerSupportChat(order.errander._id, order.errander.firstName + ' (Rider)', order.errander.avatar)"
 class="w-full p-4 rounded-xl border border-gray-100 hover:border-parentPrimary hover:bg-parentPrimary/5 flex items-center gap-4 transition-all bg-white"
 >
 <div class="w-10 h-10 rounded-full border border-gray-100 bg-indigo-50 flex items-center justify-center overflow-hidden shrink-0">
 <img v-if="order.errander.avatar" :src="order.errander.avatar" class="w-full h-full object-cover" />
 <Truck v-else class="w-5 h-5 text-indigo-400" />
 </div>
 <div class="text-left flex-1 min-w-0">
 <h4 class="text-sm font-bold text-gray-900 truncate">Message your Rider</h4>
 <p class="text-sm text-gray-400 font-medium mt-0.5 truncate">{{ order.errander.firstName }} - Dispatch</p>
 </div>
 <MessageSquare class="w-4 h-4 text-parentPrimary shrink-0" />
 </button>

 <button 
 @click="triggerSupportChat('admin_support_channel', 'Errandr Support', '')"
 class="w-full p-4 rounded-xl border border-gray-100 hover:border-rose-500 hover:bg-rose-50 flex items-center gap-4 transition-all group bg-white"
 >
 <div class="w-10 h-10 rounded-full border border-rose-100 bg-rose-50 flex items-center justify-center overflow-hidden text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-colors shrink-0">
 <LifeBuoy class="w-5 h-5" />
 </div>
 <div class="text-left flex-1 min-w-0">
 <h4 class="text-sm font-bold text-gray-900 truncate">Errandr Support</h4>
 <p class="text-sm text-gray-400 font-medium mt-0.5 truncate">Chat with an admin</p>
 </div>
 <MessageSquare class="w-4 h-4 text-rose-500 shrink-0" />
 </button>
 </div>
 </div>
 </UiModal>

 <Teleport to="body">
 <Transition name="fade">
 <div v-if="showSupportModal" class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center px-4 pb-4 sm:p-0">
 <div class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" @click="showSupportModal = false" />
 
 <div class="relative w-full max-w-sm bg-white rounded-[2rem] overflow-hidden transform transition-all animate-slide-up sm:animate-fade-in">
 <div class="p-4 md:p-4">
 <div class="flex items-center justify-between mb-6">
 <div>
 <h3 class="text-xl font-medium text-gray-900 tracking-tight">Support</h3>
 <p class="text-[13px] text-gray-400 mt-1">How can we help you today?</p>
 </div>
 <button 
 @click="showSupportModal = false"
 class="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-400 transition-colors"
 >
 <X class="w-5 h-5" />
 </button>
 </div>

 <div class="space-y-3">
 <a :href="'tel:' + (order?.errander?.phoneNumber || '')" class="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors group">
 <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-parentPrimary transition-colors">
 <Phone class="w-5 h-5" />
 </div>
 <div class="text-left flex-1">
 <span class="block text-sm font-medium text-gray-900">Call Dispatcher</span>
 <span class="block text-[11px] text-gray-400 mt-0.5">Speak with your rider</span>
 </div>
 <ChevronRight class="w-5 h-5 text-gray-300 group-hover:translate-x-1 transition-transform" />
 </a>

 <a href="tel:+2348000000000" class="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors group">
 <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-400 group-hover:text-parentPrimary transition-colors">
 <HeadphonesIcon class="w-5 h-5" />
 </div>
 <div class="text-left flex-1">
 <span class="block text-sm font-medium text-gray-900">Contact Support</span>
 <span class="block text-[11px] text-gray-400 mt-0.5">Get help from our team</span>
 </div>
 <ChevronRight class="w-5 h-5 text-gray-300 group-hover:translate-x-1 transition-transform" />
 </a>
 </div>
 </div>
 </div>
 </div>
 </Transition>
 
 <Transition name="fade">
 <div v-if="showRatingModal" class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center px-4 pb-4 sm:p-0">
 <div class="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" @click="showRatingModal = false" />
 
 <div class="relative w-full max-w-sm bg-white rounded-[2rem] overflow-hidden transform transition-all animate-slide-up sm:animate-fade-in">
 <div class="p-4 md:p-5 relative">
 <button 
 @click="showRatingModal = false"
 class="absolute top-4 right-4 w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center text-gray-400 transition-colors z-10"
 >
 <X class="w-5 h-5" />
 </button>
 
 <div class="text-center mb-6">
 <div class="w-16 h-16 bg-parentPrimary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
 <Star class="w-8 h-8 text-parentPrimary fill-parentPrimary" />
 </div>
 <h3 class="text-xl font-medium text-gray-900 tracking-tight">Rate your experience</h3>
 <p class="text-[13px] text-gray-500 mt-2">How was your delivery with Erranders?</p>
 </div>

 <div class="flex justify-center gap-2 mb-6" @mouseleave="hoverRating = 0">
 <button 
 v-for="star in 5" 
 :key="star"
 @click="rating = star"
 @mouseover="hoverRating = star"
 class="p-2 transition-transform hover:scale-110 focus:outline-none"
 >
 <Star 
 class="w-10 h-10 transition-colors"
 :class="(hoverRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-100 fill-gray-100 hover:text-gray-200'"
 />
 </button>
 </div>

 <div class="space-y-4">
 <textarea
 v-model="reviewText"
 rows="3"
 placeholder="Tell us what you loved (or what needs improvement)..."
 class="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 text-sm font-medium focus:border-parentPrimary focus:ring-1 focus:ring-parentPrimary transition-all outline-none resize-none placeholder:text-gray-400 "
 ></textarea>

 <button 
 @click="submitRating"
 :disabled="submittingRating || rating === 0"
 class="w-full py-4 bg-gray-900 text-white rounded-2xl text-[11px] font-medium tracking-[0.2em] hover:bg-parentPrimary active:scale-95 transition-all shadow-black/10 flex items-center justify-center gap-3 disabled:opacity-50"
 >
 <div v-if="submittingRating" class="w-4 h-4 border border-white/20 border-t-white rounded-full animate-spin" />
 <span v-else>SUBMIT REVIEW</span>
 </button>
 </div>
 </div>
 </div>
 </div>
 </Transition>
 
 <Transition name="fade">
 <div v-if="showThankYouModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
 <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" @click="showThankYouModal = false" />
 
 <div class="relative w-full max-w-sm bg-white rounded-[2rem] overflow-hidden p-4 md:p-5 text-center transform transition-all animate-fade-in scale-in">
 <div class="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6">
 <Heart class="w-10 h-10 text-emerald-500 fill-emerald-500 animate-pulse" />
 </div>
 
 <h3 class="text-2xl font-medium text-gray-900 tracking-tight mb-2">Thank You!</h3>
 <p class="text-sm text-gray-500 mb-8 leading-relaxed">
 Your feedback is incredibly valuable. It helps our vendors and riders provide the best experience possible.
 </p>
 
 <button 
 @click="showThankYouModal = false"
 class="w-full py-4 bg-gray-100 text-gray-900 rounded-2xl text-[11px] font-medium tracking-[0.2em] hover:bg-gray-200 active:scale-95 transition-all"
 >
 CLOSE
 </button>
 </div>
 </div>
 </Transition>
 
 <SupportInterventionModal 
 v-model:show="showSupportInterventionModal" 
 :order-id="order?.orderNumber" 
 :mode="supportInterventionMode" 
 @confirmCancel="executeCancelOrder" 
 />
 </Teleport>

 </div>
</template>

<script setup lang="ts">
import { 
 ArrowLeft, Phone, MapPin, Truck, ShoppingBag, 
 Package, CheckCircle2, AlertCircle, RefreshCw,
 Search, CreditCard, MessageSquare, Clock, LayoutGrid, Star, Inbox, LifeBuoy, Store, ShieldCheck, User, X, ChevronRight, HeadphonesIcon, Heart, Bike, Camera
} from 'lucide-vue-next';
import { useRoute, useRouter } from '#imports';
import { ref, computed, onMounted, watch } from 'vue';
import { orders_api } from '@/api_factory/modules/orders';
import OrderChat from '@/components/core/OrderChat.vue';
import UiModal from '@/components/ui/UiModal.vue';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { useConfirmModal } from '@/composables/core/useConfirmModal';
import { useUser } from '@/composables/modules/auth/user';
import { usePayments } from '@/composables/modules/payments';
import { Loader2 } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();

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
const order = ref<any>(null);
const loading = ref(true);
const reordering = ref(false);
const processingPayment = ref(false);
const isChatOpen = ref(false);
const chatReceiverId = ref<string>('');
const chatReceiverName = ref('');
const chatReceiverAvatar = ref('');

const getWhatsAppLink = (phone: string) => {
  if (!phone) return '#';
  let formattedPhone = phone;
  if (phone.startsWith('0')) {
    formattedPhone = '234' + phone.slice(1);
  } else if (!phone.startsWith('+')) {
    formattedPhone = '+' + phone;
  }
  
  let text = `Hi, I am reaching out regarding my Erranders order #${order.value?.orderNumber || order.value?._id}.\n\n`;
  if (order.value) {
    if (order.value.type !== 'custom_errand') {
       const itemsCount = order.value.items?.length || order.value.packs?.reduce((acc: number, p: any) => acc + (p.items?.length || 0), 0) || 0;
       text += `Order Type: Normal Order\n`;
       text += `Items: ${itemsCount} items\n`;
       text += `Total: ₦${(order.value.total || 0).toLocaleString()}\n`;
    } else {
       text += `Order Type: Custom Errand\n`;
       text += `Details: ${order.value.customDetails?.description}\n`;
    }
    if (order.value.deliveryAddress) {
       text += `Delivery Address: ${order.value.deliveryAddress}\n`;
    }
  }
  
  return `https://wa.me/${formattedPhone.replace(/\+/g, '')}?text=${encodeURIComponent(text)}`;
};
const showSupportModal = ref(false);
const { user } = useUser();
const { initializePayment } = usePayments();
const { showToast } = useCustomToast();

const payForOrder = async () => {
  if (!order.value?._id) return;
  processingPayment.value = true;
  try {
    const amount = Math.round(order.value.total || 0);
    const data = await initializePayment({
      amount,
      customer: { 
        name: user.value?.firstName || 'Student', 
        email: user.value?.email || 'user@example.com' 
      },
      callback_url: `${window.location.origin}/orders/${order.value._id}`,
      metadata: { orderIds: [order.value._id] }
    });
    
    const authUrl = data?.data?.authorization_url || data?.authorization_url;
    if (authUrl) {
      window.location.href = authUrl;
    } else {
      showToast({ title: 'Error', message: 'Could not initialize payment gateway', toastType: 'error' });
    }
  } catch (e) {
    showToast({ title: 'Error', message: 'Failed to initialize payment', toastType: 'error' });
  } finally {
    processingPayment.value = false;
  }
};

const handleMarkAsPaid = async () => {
  if (!order.value?._id) return;
  const isConfirmed = await confirm({
    title: 'Confirm Payment Transfer',
    message: 'Are you sure you have transferred the money to the errander?',
    variant: 'warning',
    confirmText: 'Yes, I transferred'
  });
  if (!isConfirmed) return;

  processingPayment.value = true;
  try {
    const { $api } = useNuxtApp();
    const res = await $api.post(`/orders/${order.value._id}/custom/p2p-pay`);
    if (res.data) {
      order.value = res.data;
      showToast({ title: 'Success', message: 'Payment marked as sent. Awaiting errander confirmation.', toastType: 'success' });
    }
  } catch (e) {
    showToast({ title: 'Error', message: 'Failed to mark as paid', toastType: 'error' });
  } finally {
    processingPayment.value = false;
  }
};

import SupportInterventionModal from '@/components/SupportInterventionModal.vue';
const showSupportInterventionModal = ref(false);
const supportInterventionMode = ref('standard');

const rating = ref(0);
const hoverRating = ref(0);
const reviewText = ref('');
const submittingRating = ref(false);
const cancelling = ref(false);
const approvingReconciliation = ref(false);
const showRatingModal = ref(false);
const showThankYouModal = ref(false);

const approveReconciliation = async () => {
 approvingReconciliation.value = true;
 try {
 const res = await api.put(`/orders/${order.value._id}/reconcile/approve`);
 if (res && (res as any).type !== 'ERROR') {
 order.value = (res as any).data;
 showToast({
 title: 'Approved!',
 message: 'Reconciliation approved successfully.',
 toastType: 'success'
 });
 } else {
 showToast({
 title: 'Error',
 message: (res as any)?.data?.message || 'Could not approve reconciliation',
 toastType: 'error'
 });
 }
 } catch (e: any) {
 showToast({
 title: 'Error',
 message: e?.response?.data?.message || 'Something went wrong',
 toastType: 'error'
 });
 } finally {
 approvingReconciliation.value = false;
 }
};

const executeCancelOrder = async () => {
 showSupportInterventionModal.value = false;
 cancelling.value = true;
 try {
 await orders_api.cancelOrder(route.params.id as string);
 fetchOrder();
 } catch (error) {
 console.error('Cancellation failed', error);
 showToast({ title: 'Error', message: 'Failed to cancel order. Please try again later.', toastType: 'error' });
 } finally {
 cancelling.value = false;
 }
};

const handleCancelOrderClick = () => {
 supportInterventionMode.value = 'cancel-intercept';
 showSupportInterventionModal.value = true;
};

const submitRating = async () => {
 if (rating.value === 0) return;
 submittingRating.value = true;
 try {
 const payload: any = {
 erranderRating: rating.value,
 erranderReview: reviewText.value
 };
 if (order.value.type !== 'custom_errand') {
 payload.vendorRating = rating.value;
 payload.vendorReview = reviewText.value;
 }
 const res = await orders_api.rateOrder(route.params.id as string, payload);
 order.value = res.data;
 showRatingModal.value = false;
 showThankYouModal.value = true;
 } catch (error) {
 console.error('Failed to submit rating', error);
 } finally {
 submittingRating.value = false;
 }
};

const openChat = (receiverId: string | undefined, name: string, avatar?: string) => {
 if (!receiverId) return;
 chatReceiverId.value = receiverId;
 chatReceiverName.value = name;
 chatReceiverAvatar.value = avatar || '';
 isChatOpen.value = true;
};

const triggerSupportChat = (id: string, name: string, avatar?: string) => {
 openChat(id, name, avatar);
 showSupportModal.value = false;
};

const fetchOrder = async () => {
 loading.value = true;
 try {
 const res = await orders_api.getOrder(route.params.id as string);
 order.value = res.data;
 setupSupportTimer();
 } catch (e) {
 console.error('Failed to fetch order', e);
 } finally {
 loading.value = false;
 }
};

let supportTimer: any;
const setupSupportTimer = () => {
 clearTimeout(supportTimer);
 if (order.value && (order.value.status === 'pending' || order.value.status === 'accepted')) {
 const timeSinceCreation = Date.now() - new Date(order.value.createdAt).getTime();
 const waitTime = Math.max(0, 5 * 60 * 1000 - timeSinceCreation);
 
 supportTimer = setTimeout(() => {
 if (order.value && (order.value.status === 'pending' || order.value.status === 'accepted')) {
 supportInterventionMode.value = 'delayed-proactive';
 showSupportInterventionModal.value = true;
 }
 }, waitTime);
 }
};

watch(() => order.value?.status, (newStatus) => {
 if (newStatus === 'pending' || newStatus === 'accepted') {
 setupSupportTimer();
 } else {
 clearTimeout(supportTimer);
 }
});

import { useSocket } from '@/composables/useSocket';

const { connect, on, emit } = useSocket('realtime');

const checkAutoOpenChat = () => {
 if (route.query.openChat && order.value) {
 const targetId = route.query.openChat as string;
 
 // Check if it's the vendor
 if (order.value.vendorRating) {
 rating.value = order.value.vendorRating;
 }
 
 // Automatically show rating modal if order is delivered and unrated
 if (order.value.status === 'delivered' && !order.value.rating && !order.value.hasRatedVendor) {
 showRatingModal.value = true;
 }

 if (order.value.vendor && (targetId === order.value.vendor.owner || targetId === order.value.vendor._id)) {
 openChat(targetId, order.value.vendor.storeName || 'Vendor', order.value.vendor.logo);
 } 
 // Check if it's the rider
 else if (order.value.errander && (targetId === order.value.errander._id || targetId === order.value.errander.user?._id)) {
 openChat(targetId, order.value.errander.firstName + ' (Rider)', order.value.errander.avatar || order.value.errander.user?.avatar);
 }
 // Admin or unknown, open the support modal
 else if (targetId === 'admin_support_channel') {
 triggerSupportChat('admin_support_channel', 'Errandr Support', '');
 } else if (targetId === 'true') {
 showSupportModal.value = true;
 }
 
 // Clean up query param so it doesn't reopen if they refresh
 router.replace({ query: { ...route.query, openChat: undefined } });
 }
}

onMounted(() => {
 fetchOrder();
 connect();
 
 // Explicitly register user with the realtime gateway for targeted notifications
 if (user.value?._id) {
 emit('register', { userId: user.value._id });
 }

 on('notification:new', (payload: any) => {
 if (payload.data?.orderId === route.params.id || ['ORDER_STATUS_UPDATE', 'NEW_ORDER'].includes(payload.type)) {
 fetchOrder();
 }
 });
 
 on('notification:order-status-update', (payload: any) => {
 if (!payload.orderId || payload.orderId === route.params.id) {
 fetchOrder();
 }
 });
});

watch(order, () => {
 checkAutoOpenChat();
});

const formatDate = (dateStr: string) => {
 if (!dateStr) return '';
 const date = new Date(dateStr);
 return date.toLocaleDateString('en-GB', { 
 day: 'numeric', 
 month: 'long', 
 year: 'numeric' 
 });
};

const formatTime = (dateStr: string) => {
 if (!dateStr) return '';
 const date = new Date(dateStr);
 return date.toLocaleTimeString('en-GB', { 
 hour: '2-digit', 
 minute: '2-digit'
 });
};

const reorder = async () => {
 if (!order.value) return;
 reordering.value = true;
 try {
 await orders_api.reorder(order.value._id);
 navigateTo('/cart');
 } catch (e) {
 console.error('Reorder failed', e);
 } finally {
 reordering.value = false;
 }
};

const getStatusTheme = (status: string) => {
 switch (status?.toLowerCase()) {
 case 'pending': return { icon: Clock, bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-600' };
 case 'confirmed': return { icon: CheckCircle2, bg: 'bg-blue-50', border: 'border-blue-100', text: 'text-blue-600' };
 case 'preparing': return { icon: Package, bg: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-600' };
 case 'ready_for_pickup': return { icon: LayoutGrid, bg: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-600' };
 case 'picked_up':
 case 'in_transit': return { icon: Truck, bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-600' };
 case 'delivered': return { icon: CheckCircle2, bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-600' };
 case 'cancelled': return { icon: AlertCircle, bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-600' };
 default: return { icon: ShoppingBag, bg: 'bg-gray-50', border: 'border-gray-100', text: 'text-gray-400' };
 }
};

const trackSteps = computed(() => {
 if (!order.value) return [];
 const status = order.value.status;
 const history = order.value.statusHistory || [];
 
 const getTimestamp = (s: string) => {
 return history.find((h: any) => h.status === s)?.timestamp;
 };

 return [
 { 
 label: 'Order Created', 
 icon: ShoppingBag, 
 active: true, 
 current: false,
 timestamp: order.value.createdAt 
 },
 { 
 label: 'Preparing', 
 icon: Package, 
 active: ['confirmed', 'preparing', 'ready_for_pickup', 'picked_up', 'in_transit', 'delivered'].includes(status),
 current: ['confirmed', 'preparing'].includes(status),
 timestamp: getTimestamp('preparing') || getTimestamp('confirmed')
 },
 {
 label: !order.value.errander ? 'Finding Rider...' : 'Rider Assigned',
 icon: Bike,
 active: !!order.value.errander || ['confirmed', 'preparing', 'ready_for_pickup'].includes(status),
 current: !order.value.errander && ['confirmed', 'preparing', 'ready_for_pickup'].includes(status),
 timestamp: order.value.errander ? (getTimestamp('errander_assigned') || getTimestamp('preparing')) : null
 },
 { 
 label: 'On Way', 
 icon: Truck, 
 active: ['picked_up', 'in_transit', 'delivered'].includes(status),
 current: ['picked_up', 'in_transit'].includes(status),
 timestamp: getTimestamp('picked_up') || getTimestamp('in_transit')
 },
 { 
 label: 'Delivered', 
 icon: CheckCircle2, 
 active: status === 'delivered',
 current: false, // It's completed
 timestamp: getTimestamp('delivered')
 }
 ];
});
</script>

<style scoped>
@keyframes float {
 0%, 100% { transform: translateY(0); }
 50% { transform: translateY(-10px); }
}

.animate-float {
 animation: float 5s ease-in-out infinite;
}

.selection\:bg-parentPrimary\/10 ::selection {
 background-color: rgba(6, 95, 219, 0.1);
}
</style>
