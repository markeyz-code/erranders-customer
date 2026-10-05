<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <button @click="$router.push('/')" class="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
            <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 class="text-lg font-bold text-gray-900 leading-tight">{{ campaign?.title || 'Market Pool' }}</h1>
            <p class="text-[10px] text-green-600 font-medium flex items-center gap-1 uppercase tracking-wide">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Pool is Open
            </p>
          </div>
        </div>
      <div class="flex items-center gap-2">
        <button @click="$router.push('/market-pool/orders')" class="text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition-colors hidden sm:block">
          My Orders
        </button>
        <button @click="$router.push('/market-pool/orders')" class="p-2 rounded-full hover:bg-gray-100 transition-colors sm:hidden" title="My Orders">
          <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
        </button>
        <button @click="$router.push('/market-pool/checkout')" class="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <svg class="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span v-if="cartStore.itemCount > 0" class="absolute top-0 right-0 h-4 w-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
            {{ cartStore.itemCount }}
          </span>
        </button>
      </div>
      </div>
    </header>

    <!-- Banner -->
    <div class="bg-[#171721] text-white relative overflow-hidden">
      <!-- Decorative background accent -->
      <div class="absolute -right-10 -top-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
      
      <div class="max-w-7xl mx-auto px-4 py-5 relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-extrabold mb-1">Buy Bulk, Pay Less</h2>
          <p class="text-xs text-white/70 leading-relaxed max-w-md">
            Join this week's pool to get food items at wholesale prices. We buy in bulk and repackage for you.
          </p>
        </div>
        <div class="bg-white/10 rounded-xl p-3 backdrop-blur-md border border-white/10 inline-block w-full md:w-auto md:min-w-[250px]">
          <div class="flex items-center justify-between gap-4">
            <span class="text-xs font-medium text-white/80">Pool Closes In:</span>
            <span class="text-sm font-bold font-mono tracking-widest bg-white text-primary px-3 py-1.5 rounded-lg shadow-sm">
              {{ timeRemainingText }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-6 flex flex-col items-center justify-center space-y-4">
      <div class="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
      <p class="text-sm text-gray-500 font-medium">Loading Market Pool...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!campaign" class="p-8 flex flex-col items-center justify-center text-center space-y-3">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>
      <h3 class="font-bold text-gray-900 text-lg">Pool is Closed</h3>
      <p class="text-sm text-gray-500">The market pool is currently closed. We usually open the pool on Mondays at 8 AM. Check back then!</p>
    </div>

    <!-- Products List -->
    <div v-else class="p-4 max-w-7xl mx-auto">
      <div class="flex items-center justify-between mb-2">
        <h3 class="font-bold text-gray-800">Available Items</h3>
        <span class="text-xs text-gray-500">{{ items.length }} items</span>
      </div>

      <!-- Categories Tab Bar -->
      <div class="flex overflow-x-auto gap-2 pb-4 mb-2 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <button 
          @click="activeCategory = 'All'"
          :class="['px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap snap-start transition-colors border', activeCategory === 'All' ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50']"
        >
          All
        </button>
        <button 
          v-for="cat in categories" 
          :key="cat"
          @click="activeCategory = cat"
          :class="['px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap snap-start transition-colors border', activeCategory === cat ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50']"
        >
          {{ cat }}
        </button>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
        <div v-for="item in filteredItems" :key="item._id" class="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden flex flex-col hover:shadow-md transition-shadow cursor-pointer" @click="openProductModal(item)">
          <div class="h-40 bg-gray-50 relative overflow-hidden group">
            <template v-if="(item.images && item.images.length > 0) || item.imageUrl">
              <div class="flex overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full h-full" @scroll="handleScroll($event, item._id)">
                <div v-for="(img, idx) in (item.images?.length ? item.images : [item.imageUrl])" :key="idx" class="min-w-full h-full snap-center relative flex-shrink-0">
                  <img :src="typeof img === 'string' ? img : img?.url" :alt="item.name" class="w-full h-full object-cover" />
                </div>
              </div>
              <div v-if="(item.images?.length || 0) > 1" class="absolute top-2 left-2 flex gap-1 z-10 bg-black/40 px-2 py-1.5 rounded-full backdrop-blur-sm items-center">
                <div v-for="(img, idx) in item.images" :key="'dot-'+idx" 
                     class="w-1.5 h-1.5 rounded-full transition-all duration-300" 
                     :class="(activeIndices[item._id] || 0) === idx ? 'bg-white w-3' : 'bg-white/40'"></div>
              </div>
            </template>
            <div v-else class="w-full h-full flex items-center justify-center">
              <svg class="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div v-if="item.sourceLocation" class="absolute top-2 right-2 bg-green-500/90 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              {{ item.sourceLocation }}
            </div>
            <!-- Standard Quantity Badge -->
            <div class="absolute bottom-2 left-2 flex flex-col gap-1">
              <div class="bg-black/60 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-1 rounded-md w-max">
                {{ item.studentQuantity }}
              </div>
              <div v-if="item.weightEstimate" class="bg-primary/90 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-1 rounded-md w-max">
                {{ item.weightEstimate }}
              </div>
            </div>
          </div>
          
          <div class="p-3 flex-1 flex flex-col">
            <h4 class="text-sm font-bold text-gray-900 leading-tight mb-1 line-clamp-1">{{ item.name }}</h4>
            <p class="text-[10px] text-gray-500 line-clamp-2 mb-2 flex-1">{{ item.description }}</p>
            
            <!-- Gamified Progress Bar -->
            <div v-if="item.targetQuantity > 0" class="mb-3 mt-1">
              <div class="flex justify-between text-[9px] mb-1 font-bold text-gray-700 uppercase tracking-wide">
                <span>{{ Math.min(Math.round((item.currentQuantity / item.targetQuantity) * 100), 100) }}% Funded</span>
                <span v-if="item.targetQuantity - item.currentQuantity > 0" class="text-orange-500">{{ item.targetQuantity - item.currentQuantity }} more needed!</span>
                <span v-else class="text-green-500">Unlocked!</span>
              </div>
              <div class="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div class="bg-gradient-to-r from-orange-400 to-green-500 h-1.5 rounded-full transition-all duration-500" :style="`width: ${Math.min((item.currentQuantity / item.targetQuantity) * 100, 100)}%`"></div>
              </div>
            </div>
            
            <div class="flex items-end justify-between mt-auto pt-2 border-t border-gray-50">
              <div>
                <p class="text-[9px] text-gray-400 line-through">₦{{ (item.appPrice * 1.3).toLocaleString() }}</p>
                <p class="text-sm font-extrabold text-primary">₦{{ item.appPrice.toLocaleString() }}</p>
              </div>
              <button 
                @click.stop="openAddToCartModal(item)"
                class="bg-primary/10 hover:bg-primary/20 text-primary p-1.5 rounded-lg transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Custom Request CTA -->
      <div class="mt-8 p-5 bg-orange-50 rounded-2xl border border-orange-100 flex flex-col items-center text-center">
        <h3 class="font-bold text-gray-900 mb-1">Don't see what you want?</h3>
        <p class="text-xs text-gray-600 mb-4">Request a custom item and we'll try to add it to the pool or source it for you.</p>
        <button @click="showRequestModal = true" class="px-5 py-2.5 bg-primary text-white text-sm font-bold rounded-xl shadow-sm hover:bg-primary/90 transition-colors w-full sm:w-auto">
          Request Custom Item
        </button>
      </div>
    </div>

    <!-- Request Modal -->
    <div v-if="showRequestModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fade-in" @click="showRequestModal = false">
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden" @click.stop>
        <div class="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 class="font-bold text-gray-900">Request Custom Item</h3>
          <button @click="showRequestModal = false" class="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-full transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div class="p-5 space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Item Name</label>
            <input v-model="requestForm.itemName" type="text" placeholder="e.g. Sweet Potatoes" class="w-full bg-gray-50 text-gray-900 rounded-xl focus:ring-primary px-3 py-2.5 border border-gray-25 outline-none">
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Target Quantity/Measurement</label>
            <input v-model="requestForm.desiredQuantity" type="text" placeholder="e.g. 1 Paint Bucket" class="w-full bg-gray-50 text-gray-900 rounded-xl focus:ring-primary px-3 py-2.5 border border-gray-25 outline-none">
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5">Additional Details</label>
            <textarea v-model="requestForm.description" placeholder="Any specific brand or preference?" class="w-full bg-gray-50 text-gray-900 rounded-xl focus:ring-primary px-3 py-2.5 border border-gray-25 outline-none resize-none h-20"></textarea>
          </div>
        </div>
        <div class="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
          <button @click="showRequestModal = false" class="flex-1 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-25 hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
          <button @click="submitRequest" :disabled="submittingRequest" class="flex-1 py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-sm disabled:opacity-50">
            {{ submittingRequest ? 'Sending...' : 'Submit Request' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Add To Cart Modal -->
    <div v-if="showAddToCartModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4 animate-fade-in" @click="closeAddToCartModal">
      <div class="bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up" @click.stop>
        <div class="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h3 class="font-bold text-gray-900">Add to Cart</h3>
          <button @click="closeAddToCartModal" class="text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-200 rounded-full transition-colors bg-white shadow-sm border border-gray-50">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div v-if="selectedItem" class="p-5 space-y-5">
          <div class="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-50">
            <img :src="selectedItem.imageUrl" class="w-16 h-16 object-cover rounded-lg shadow-sm" />
            <div>
              <h4 class="font-bold text-gray-900 leading-tight">{{ selectedItem.name }}</h4>
              <p class="text-xs text-gray-500 mt-0.5">{{ selectedItem.studentQuantity }}</p>
              <p class="text-sm font-bold text-primary mt-1">₦{{ selectedItem.appPrice.toLocaleString() }}</p>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
            <div class="flex items-center gap-4">
              <button @click="cartForm.quantity > 1 ? cartForm.quantity-- : null" class="w-10 h-10 rounded-full border border-gray-25 bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 font-bold text-xl" :disabled="cartForm.quantity <= 1">-</button>
              <span class="font-bold text-xl w-8 text-center">{{ cartForm.quantity }}</span>
              <button @click="cartForm.quantity++" class="w-10 h-10 rounded-full border border-gray-25 bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors font-bold text-xl">+</button>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1.5 flex justify-between">
              <span>Additional Information</span>
              <span class="text-xs text-gray-400 font-normal">Optional</span>
            </label>
            <textarea 
              v-model="cartForm.preferences" 
              placeholder="e.g. Golden Penny brand, Big sizes only, etc." 
              class="w-full bg-gray-50 text-gray-900 rounded-xl focus:ring-primary px-3 py-2.5 border border-gray-25 outline-none resize-none h-20 text-sm"
            ></textarea>
          </div>
        </div>
        
        <div class="p-4 border-t border-gray-100">
          <button @click="confirmAddToCart" class="w-full py-3.5 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2">
            <span>Add {{ cartForm.quantity }} to Cart</span>
            <span class="w-1 h-1 rounded-full bg-white/40"></span>
            <span>₦{{ (selectedItem?.appPrice * cartForm.quantity || 0).toLocaleString() }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Product Details Modal (Full Screen) -->
    <div v-if="showProductModal" class="fixed inset-0 bg-white z-[110] flex flex-col animate-slide-up overflow-hidden">
      <div class="flex items-center justify-between p-4 bg-white/80 backdrop-blur-md absolute top-0 left-0 right-0 z-10 border-b border-gray-100">
        <button @click="showProductModal = false" class="p-2 -ml-2 rounded-full hover:bg-gray-100 bg-white shadow-sm transition-colors text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <span class="font-bold text-sm text-gray-900 truncate max-w-[200px]">{{ selectedProduct?.name }}</span>
        <button @click="openAddToCartModal(selectedProduct); showProductModal = false" class="text-sm font-bold text-primary bg-primary/10 px-4 py-1.5 rounded-full">
          Add
        </button>
      </div>

      <div class="flex-1 overflow-y-auto pb-24 pt-16">
        <!-- Interactive Zoom Image Container -->
        <div class="w-full h-80 bg-gray-50 relative group cursor-zoom-in" @mousemove="handleZoom" @mouseleave="resetZoom" @touchstart="handleTouchZoom" @touchmove="handleTouchZoom" @touchend="resetZoom">
          <img v-if="selectedProduct?.imageUrl" :src="selectedProduct.imageUrl" class="w-full h-full object-cover transition-transform duration-200" :style="zoomStyle" />
          <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
            <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <!-- Hint -->
          <div class="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium px-3 py-1.5 rounded-full pointer-events-none opacity-80 flex items-center gap-1.5">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
            Touch or hover to zoom
          </div>
        </div>

        <div class="p-6">
          <div class="flex items-start justify-between mb-2">
            <div>
              <h2 class="text-2xl font-black text-gray-900 leading-tight">{{ selectedProduct?.name }}</h2>
              <p class="text-sm text-gray-500 mt-1 font-medium">{{ selectedProduct?.category || 'Market Item' }}</p>
            </div>
            <div class="text-right">
              <p class="text-[11px] text-gray-400 line-through">₦{{ (selectedProduct?.appPrice * 1.3).toLocaleString() }}</p>
              <p class="text-xl font-black text-primary">₦{{ selectedProduct?.appPrice.toLocaleString() }}</p>
            </div>
          </div>

          <div class="flex flex-wrap gap-2 mb-6">
            <span class="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
              {{ selectedProduct?.studentQuantity }}
            </span>
            <span v-if="selectedProduct?.weightEstimate" class="bg-orange-50 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-lg">
              Est. Weight: {{ selectedProduct?.weightEstimate }}
            </span>
          </div>

          <div class="prose prose-sm max-w-none text-gray-600">
            <h3 class="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Product Description</h3>
            <p class="leading-relaxed whitespace-pre-wrap">{{ selectedProduct?.description || 'No detailed description provided for this item.' }}</p>
          </div>
          
          <div v-if="selectedProduct?.targetQuantity > 0" class="mt-8 p-5 bg-gray-50 rounded-2xl border border-gray-50">
            <h3 class="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
              <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              Pool Progress
            </h3>
            <div class="flex justify-between text-[10px] mb-2 font-bold text-gray-700 uppercase tracking-wide">
              <span>{{ Math.min(Math.round((selectedProduct.currentQuantity / selectedProduct.targetQuantity) * 100), 100) }}% Funded</span>
              <span v-if="selectedProduct.targetQuantity - selectedProduct.currentQuantity > 0" class="text-orange-500">{{ selectedProduct.targetQuantity - selectedProduct.currentQuantity }} more needed!</span>
              <span v-else class="text-green-500">Milestone Unlocked!</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div class="bg-gradient-to-r from-orange-400 to-green-500 h-2 rounded-full transition-all duration-500" :style="`width: ${Math.min((selectedProduct.currentQuantity / selectedProduct.targetQuantity) * 100, 100)}%`"></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Fixed Bottom Bar -->
      <div class="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] pb-safe">
        <button @click="openAddToCartModal(selectedProduct); showProductModal = false" class="w-full py-4 text-base font-black text-white bg-primary hover:bg-primary/90 rounded-2xl transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
          <span>Add to Pool Cart</span>
          <span class="w-1 h-1 rounded-full bg-white/40"></span>
          <span>₦{{ selectedProduct?.appPrice.toLocaleString() }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useMarketPoolStore } from '~/stores/marketPool'
import { useCustomToast } from '@/composables/core/useCustomToast'

const { showToast } = useCustomToast()
const marketStore = useMarketPoolStore()
const loading = ref(true)
const campaign = ref(null)
const items = ref([])
const activeIndices = ref({})
const activeCategory = ref('All')

const categories = computed(() => {
  const cats = new Set(items.value.map(item => item.category || 'Foodstuffs'))
  return Array.from(cats).sort()
})

const filteredItems = computed(() => {
  if (activeCategory.value === 'All') return items.value
  return items.value.filter(item => (item.category || 'Foodstuffs') === activeCategory.value)
})

const handleScroll = (event, itemId) => {
  const container = event.target
  const scrollPosition = container.scrollLeft
  const itemWidth = container.clientWidth
  const currentIndex = Math.round(scrollPosition / itemWidth)
  activeIndices.value[itemId] = currentIndex
}

const timeRemainingText = ref('--D : --H : --M : --S')
let timerInterval = null

const updateTimer = () => {
  if (!campaign.value || !campaign.value.endDate) return
  const end = new Date(campaign.value.endDate).getTime()
  const now = new Date().getTime()
  const distance = end - now

  if (distance < 0) {
    timeRemainingText.value = 'CLOSED'
    if (timerInterval) clearInterval(timerInterval)
    return
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24))
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((distance % (1000 * 60)) / 1000)
  
  timeRemainingText.value = `${days}D : ${hours}H : ${minutes}M : ${seconds}S`
}

onMounted(async () => {
  try {
    loading.value = true
    const route = useRoute()
    const campaignId = route.query.campaignId || null
    const data = await marketStore.fetchActiveCampaign(campaignId)
    if (data && data.campaign) {
      campaign.value = data.campaign
      items.value = data.items
      updateTimer()
      timerInterval = setInterval(updateTimer, 1000)
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

// Quick inline cart simulation for the component, wait I should use a real store.
const cartStore = ref({ itemCount: marketStore.cartItemCount }) 

const showAddToCartModal = ref(false)
const showProductModal = ref(false)
const selectedItem = ref(null)
const selectedProduct = ref(null)
const cartForm = ref({ quantity: 1, preferences: '' })

// Zoom State
const zoomStyle = ref({ transformOrigin: 'center center', transform: 'scale(1)' })

const openProductModal = (item) => {
  selectedProduct.value = item
  showProductModal.value = true
}

const handleZoom = (e) => {
  if (!e.target) return
  const { left, top, width, height } = e.target.getBoundingClientRect()
  const x = ((e.clientX - left) / width) * 100
  const y = ((e.clientY - top) / height) * 100
  zoomStyle.value = {
    transformOrigin: `${x}% ${y}%`,
    transform: 'scale(2.5)'
  }
}

const handleTouchZoom = (e) => {
  if (!e.target || !e.touches[0]) return
  const { left, top, width, height } = e.target.getBoundingClientRect()
  const x = ((e.touches[0].clientX - left) / width) * 100
  const y = ((e.touches[0].clientY - top) / height) * 100
  zoomStyle.value = {
    transformOrigin: `${x}% ${y}%`,
    transform: 'scale(2.5)'
  }
}

const resetZoom = () => {
  zoomStyle.value = {
    transformOrigin: 'center center',
    transform: 'scale(1)'
  }
}

const openAddToCartModal = (item) => {
  selectedItem.value = item
  cartForm.value = { quantity: 1, preferences: '' }
  showAddToCartModal.value = true
}

const closeAddToCartModal = () => {
  showAddToCartModal.value = false
  setTimeout(() => { selectedItem.value = null }, 200) // wait for animation
}

const confirmAddToCart = () => {
  if (!selectedItem.value) return
  marketStore.addToCart(selectedItem.value, cartForm.value.preferences, cartForm.value.quantity)
  cartStore.value.itemCount = marketStore.cartItemCount
  showToast({ title: 'Added to Cart', message: `Added ${cartForm.value.quantity}x ${selectedItem.value.name} to cart.`, toastType: 'success' })
  closeAddToCartModal()
}

import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'

const showRequestModal = ref(false)
const submittingRequest = ref(false)
const requestForm = ref({ itemName: '', desiredQuantity: '', description: '' })

const submitRequest = async () => {
  if (!requestForm.value.itemName || !requestForm.value.desiredQuantity) {
    showToast({ title: 'Missing Info', message: 'Please provide the item name and desired quantity.', toastType: 'error' })
    return
  }
  
  try {
    submittingRequest.value = true
    await api.post(`/market-pool/campaigns/${campaign.value._id}/custom-requests`, requestForm.value)
    showToast({ title: 'Success', message: 'Request submitted successfully! We will review it shortly.', toastType: 'success' })
    showRequestModal.value = false
    requestForm.value = { itemName: '', desiredQuantity: '', description: '' }
  } catch (error) {
    console.error('Failed to submit request', error)
    showToast({ title: 'Error', message: 'Failed to submit request. Please try again.', toastType: 'error' })
  } finally {
    submittingRequest.value = false
  }
}
</script>
