<template>
  <div class="min-h-screen bg-white" v-if="vendor" :style="vendor.brandColor ? { '--color-parent-primary': vendor.brandColor } : {}">
    <!-- MINI MART LAYOUT -->
    <template v-if="isMiniMart">
      <div class="max-w-2xl mx-auto p-4 md:p-4 pb-8 pt-8">
        <!-- Header -->
        <div class="flex items-center gap-3 mb-6">
          <button @click="router.back()" class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition-all">
            <ArrowLeft class="w-5 h-5 text-gray-900" />
          </button>
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full overflow-hidden border border-gray-100 bg-white shrink-0">
              <video v-if="vendor.logo && vendor.logo.match(/\.(mp4|webm|ogg|mov)$/i)" :src="vendor.logo" class="w-full h-full object-cover" autoplay loop muted playsinline></video>
              <img v-else :src="vendor.logo || '/placeholder-store.jpg'" class="w-full h-full object-cover" />
            </div>
            <div>
              <h2 class="text-base font-bold text-gray-900 leading-tight">{{ toTitleCase(vendor.storeName) }}</h2>
              <p class="text-xs text-gray-500 font-medium">Mini Mart</p>
            </div>
          </div>
        </div>

        <!-- Search Bar -->
        <div class="relative mb-6">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            v-model="searchQuery" 
            type="text" 
            :placeholder="`Search ${vendor?.storeName || 'Store'}`"
            class="w-full bg-gray-100 text-gray-900 border-none rounded-xl pl-12 pr-4 py-3.5 focus:ring-1 focus:ring-gray-200 outline-none placeholder-gray-500"
          />
        </div>

        <!-- Bundles -->
        <div class="mb-8" v-if="packs.length > 0">
          <h3 class="text-gray-900 font-bold mb-3 text-[17px]">Bundles</h3>
          <div class="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            <div 
              v-for="pack in packs" 
              :key="pack._id"
              @click="openProductModal(pack)"
              class="relative bg-gray-50 border border-gray-100 rounded-xl p-4 min-w-[200px] shrink-0 cursor-pointer hover:bg-gray-100 transition-colors flex flex-col justify-between overflow-hidden"
              :class="{ 'opacity-50 grayscale pointer-events-none': isProductOutOfStock(pack) }"
            >
              <!-- Promo Badge -->
              <div v-if="pack.isPrepaidByPlatform" class="absolute top-0 right-0 z-10 px-2 py-1 bg-indigo-500 text-white rounded-bl-lg shadow-sm text-[9px] font-bold uppercase tracking-widest">
                Promo
              </div>
              
              <div>
                <h4 class="font-bold text-gray-900 mb-1 text-[15px] pr-10">{{ pack.name }}</h4>
                <p class="text-xs text-gray-500 mb-2">{{ pack.description || 'Bundle items' }}</p>
              </div>
              <div class="text-sm font-bold text-gray-900 mt-auto flex items-center justify-between">
                <span>₦{{ (pack.bundlePrice || pack.price || 0).toLocaleString() }}</span>
                <span v-if="isProductOutOfStock(pack)" class="text-[10px] font-bold text-rose-500 uppercase tracking-wider bg-rose-50 px-2 py-1 rounded">Out of stock</span>
                <span v-else-if="pack.trackStock && pack.stockQuantity <= 5" class="text-[9px] font-bold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded">{{ pack.stockQuantity }} left</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Top picks -->
        <div class="mb-8" v-if="topPicks.length > 0">
          <h3 class="text-gray-900 font-bold mb-3 text-[17px]">Top picks</h3>
          <div class="flex flex-col">
            <div 
              v-for="product in topPicks" 
              :key="'top-' + product._id"
              @click="openProductModal(product)"
              class="flex items-center justify-between py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors px-2"
              :class="{ 'opacity-50 grayscale pointer-events-none': isProductOutOfStock(product) }"
            >
              <div class="flex flex-col">
                <div class="flex items-center gap-2 mb-0.5">
                  <span class="font-bold text-gray-900 text-[15px]">{{ product.name }}</span>
                  <span v-if="product.isPrepaidByPlatform" class="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded text-[9px] font-bold uppercase tracking-wider shrink-0">Promo</span>
                </div>
                <span class="font-bold text-gray-500 text-[15px]">₦{{ (product.discountPrice || product.pricePerPortion || product.price || 0).toLocaleString() }}</span>
              </div>
              
              <div @click.stop class="flex items-center gap-2">
                <div v-if="getProductCount(product._id) > 0" class="flex items-center gap-3 bg-gray-100 rounded-full px-2 py-1">
                  <button @click="removeFromCart(product._id)" class="text-gray-500 hover:text-gray-900 w-6 h-6 flex justify-center items-center">
                    <Minus class="w-4 h-4" />
                  </button>
                  <span class="font-bold text-gray-900 text-sm w-4 text-center">{{ getProductCount(product._id) }}</span>
                  <button @click="quickAddToCart(product)" class="text-parentPrimary hover:text-green-700 w-6 h-6 flex justify-center items-center">
                    <Plus class="w-4 h-4" />
                  </button>
                </div>
                <button v-else @click="quickAddToCart(product)" class="bg-gray-100 hover:bg-gray-200 text-parentPrimary rounded-full w-8 h-8 flex items-center justify-center transition-colors">
                  <Plus class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Full store toggle -->
        <button @click="showFullStore = !showFullStore" class="flex items-center gap-2 text-blue-400 font-medium text-[15px] mb-8 hover:text-blue-300 transition-colors">
          See full store <ChevronDown class="w-4 h-4 transition-transform" :class="{ 'rotate-180': showFullStore }" />
        </button>
        
        <!-- Full store -->
        <div v-if="showFullStore" class="mb-8">
          <div v-for="cat in categories" :key="cat" class="mb-6">
            <h3 class="text-gray-500 font-bold mb-2 text-xs uppercase tracking-widest px-2" v-if="groupedProducts[cat] && groupedProducts[cat].length > 0">{{ cat }}</h3>
            <div class="flex flex-col">
              <div 
                v-for="product in groupedProducts[cat]" 
                :key="product._id"
                @click="openProductModal(product)"
                class="flex items-center justify-between py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors px-2"
                :class="{ 'opacity-50 grayscale pointer-events-none': isProductOutOfStock(product) }"
              >
                <div class="flex flex-col">
                  <div class="flex items-center gap-2 mb-0.5">
                    <span class="font-bold text-gray-900 text-[15px]">{{ product.name }}</span>
                    <span v-if="product.isPrepaidByPlatform" class="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded text-[9px] font-bold uppercase tracking-wider shrink-0">Promo</span>
                  </div>
                  <span class="font-bold text-gray-500 text-[15px]">₦{{ (product.discountPrice || product.pricePerPortion || product.price || 0).toLocaleString() }}</span>
                </div>

                <div @click.stop class="flex items-center gap-2">
                  <div v-if="getProductCount(product._id) > 0" class="flex items-center gap-3 bg-gray-100 rounded-full px-2 py-1">
                    <button @click="removeFromCart(product._id)" class="text-gray-500 hover:text-gray-900 w-6 h-6 flex justify-center items-center">
                      <Minus class="w-4 h-4" />
                    </button>
                    <span class="font-bold text-gray-900 text-sm w-4 text-center">{{ getProductCount(product._id) }}</span>
                    <button @click="quickAddToCart(product)" class="text-parentPrimary hover:text-green-700 w-6 h-6 flex justify-center items-center">
                      <Plus class="w-4 h-4" />
                    </button>
                  </div>
                  <button v-else @click="quickAddToCart(product)" class="bg-gray-100 hover:bg-gray-200 text-parentPrimary rounded-full w-8 h-8 flex items-center justify-center transition-colors">
                    <Plus class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Anything else -->
        <div class="mt-4 px-2">
          <h3 class="text-gray-900 font-bold mb-3 text-[17px]">Anything else?</h3>
          <textarea 
            v-model="anythingElseNote"
            rows="2"
            placeholder="Tell the vendor what else to grab"
            class="w-full bg-gray-100 text-gray-900 border-none rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-gray-200 outline-none placeholder-gray-500 resize-none"
          ></textarea>
        </div>

        <!-- Spacer for Sticky Cart -->
        <div class="h-40 w-full shrink-0"></div>
      </div>
    </template>

    <template v-else>
    <!-- Collapsed Sticky Header (appears on scroll) -->
    <header 
      class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100 transition-all duration-500"
      :class="scrolled ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'"
    >
      <div class="max-w-[1400px] mx-auto flex items-center justify-between px-4 md:px-4 py-3">
        <div class="flex items-center gap-3">
          <button @click="router.back()" class="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 hover:bg-gray-100 transition-all">
            <ArrowLeft class="w-4 h-4 text-gray-900" />
          </button>
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg overflow-hidden border border-gray-100 bg-white shrink-0">
              <video v-if="vendor.logo && vendor.logo.match(/\\.(mp4|webm|ogg|mov)$/i)" :src="vendor.logo" class="w-full h-full object-cover" autoplay loop muted playsinline></video>
              <img v-else :src="vendor.logo || '/placeholder-store.jpg'" class="w-full h-full object-cover" />
            </div>
            <h2 class="text-sm font-medium text-gray-900 tracking-tight truncate max-w-[160px] md:max-w-none">{{ toTitleCase(vendor.storeName) }}</h2>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button 
            @click="toggleFavoriteVendor"
            class="w-9 h-9 rounded-xl flex items-center justify-center transition-all border"
            :class="isFavorited ? 'bg-rose-50 border-rose-100 text-rose-500' : 'bg-gray-50 border-gray-100 text-gray-400'"
          >
            <Heart class="w-4 h-4" :class="{ 'fill-rose-500': isFavorited }" />
          </button>
          <button 
            v-if="globalItemCount > 0"
            @click="showGlobalCartModal = true"
            class="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl transition-all border bg-gray-50 border-gray-100 text-gray-900 relative"
          >
            <ShoppingCart class="w-4 h-4" />
            <div class="absolute -top-1 -right-1 w-4 h-4 bg-parentPrimary text-white border-2 border-white rounded-full flex items-center justify-center">
              <span class="text-[8px] font-bold">{{ globalItemCount }}</span>
            </div>
          </button>
          <button 
            v-if="cart.getVendorStats(vendor._id).itemCount > 0"
            @click="showMobileCartDrawer = true" 
            class="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-medium transition-all shadow-sm border border-gray-100"
          >
            <ShoppingBag class="w-3.5 h-3.5" />
            <span class="bg-parentPrimary px-1.5 py-0.5 rounded-md text-[10px]">{{ cart.getVendorStats(vendor._id).itemCount }}</span>
          </button>
          <NuxtLink to="/cart" class="hidden lg:flex w-9 h-9 rounded-xl bg-gray-50 items-center justify-center border border-gray-100 hover:bg-gray-100 transition-all relative">
            <ShoppingCart class="w-4 h-4 text-gray-900" />
            <div v-if="globalItemCount > 0" class="absolute -top-1 -right-1 w-4 h-4 bg-parentPrimary text-white border-2 border-white rounded-full flex items-center justify-center">
              <span class="text-[8px] font-bold">{{ globalItemCount }}</span>
            </div>
          </NuxtLink>
        </div>
      </div>
    </header>

    <div class="animate-fade-in pb-32 lg:pb-8">
      <!-- ============================================ -->
      <!-- IMMERSIVE BANNER HERO                        -->
      <!-- ============================================ -->
      <section class="relative w-full h-[280px] md:h-[340px] overflow-hidden">
        <!-- Banner Image -->
        <video 
          v-if="vendor.coverVideo || vendor.video || (vendor.banner && vendor.banner.match(/\\.(mp4|webm|ogg|mov)$/i)) || (vendor.logo && vendor.logo.match(/\\.(mp4|webm|ogg|mov)$/i))"
          :src="vendor.coverVideo || vendor.video || vendor.banner || vendor.logo" 
          class="absolute inset-0 w-full h-full object-cover"
          autoplay loop muted playsinline>
        </video>
        <img 
          v-else
          :src="vendor.banner || vendor.image || vendor.logo || '/placeholder-store.jpg'" 
          class="absolute inset-0 w-full h-full object-cover"
          alt="Store Banner"
        />
        <!-- Closed Padlock Overlay -->
        <div v-if="!vendor.isOpen && route.query.schedule !== 'true'" class="absolute inset-0 bg-black/60 z-10 flex flex-col items-center justify-center">
          <Lock class="w-12 h-12 text-white mb-2" />
          <span class="text-white font-bold text-base tracking-wide text-center">STORE<br/>CLOSED</span>
        </div>
        <!-- Gradient Overlays -->
        <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-gray-900/20 z-[5]"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-gray-900/30 to-transparent z-[5]"></div>
        
        <!-- Top Navigation -->
        <div class="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 md:px-5 pt-safe-top pb-4 md:pb-6 mt-4 md:mt-6">
          <button @click="router.back()" class="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 text-white hover:bg-white/20 transition-all active:scale-95">
            <ArrowLeft class="w-4 h-4" />
          </button>
          <div class="flex items-center gap-2">
            <button 
              @click="showGlobalCartModal = true"
              class="relative w-10 h-10 rounded-2xl backdrop-blur-xl flex items-center justify-center border transition-all active:scale-95 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <ShoppingCart class="w-4 h-4" />
              <div v-if="globalItemCount > 0" class="absolute -top-1 -right-1 w-4 h-4 bg-parentPrimary text-white rounded-full flex items-center justify-center text-[9px] font-bold border border-white/20 shadow-sm">
                {{ globalItemCount }}
              </div>
            </button>
            <button 
              @click="isShareModalOpen = true"
              class="w-10 h-10 rounded-2xl backdrop-blur-xl flex items-center justify-center border transition-all active:scale-95 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <Share2 class="w-4 h-4" />
            </button>
            <button 
              @click="toggleFavoriteVendor"
              class="w-10 h-10 rounded-2xl backdrop-blur-xl flex items-center justify-center border transition-all active:scale-95"
              :class="isFavorited ? 'bg-rose-500/20 border-rose-400/30 text-rose-400' : 'bg-white/10 border-white/20 text-white'"
            >
              <Heart class="w-4 h-4" :class="{ 'fill-rose-400': isFavorited }" />
            </button>
            <button @click="showStoreInfo = true" class="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 text-white hover:bg-white/20 transition-all active:scale-95">
              <Info class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Hero Content -->
        <div class="absolute bottom-0 left-0 right-0 z-10 px-4 md:px-5 pb-6 md:pb-8">
          <div class="max-w-[1400px] mx-auto flex items-end gap-4">
            <!-- Vendor Logo -->
            <div class="w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 border-white/30 shadow-sm border border-gray-100 overflow-hidden bg-white shrink-0">
              <video v-if="vendor.logo && vendor.logo.match(/\\.(mp4|webm|ogg|mov)$/i)" :src="vendor.logo" class="w-full h-full object-cover" autoplay loop muted playsinline></video>
              <img v-else :src="vendor.logo || '/placeholder-store.jpg'" class="w-full h-full object-cover" />
            </div>
            <!-- Vendor Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1.5">
                <span 
                  class="px-2.5 py-1 rounded-lg text-[10px] font-medium flex items-center gap-1.5"
                  :class="vendor.isOpen !== false ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/20' : 'bg-red-400/20 text-red-300 border border-red-400/20'"
                >
                  <span class="w-1.5 h-1.5 rounded-full" :class="vendor.isOpen !== false ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'"></span>
                  {{ vendor.isOpen !== false ? 'Open Now' : 'Closed' }}
                </span>
                <span v-if="vendor.isInsideCampus" class="px-2.5 py-1 rounded-lg bg-white/10 border border-white/10 text-white/70 text-[10px] font-medium shrink-0">
                  On Campus
                </span>
                <span v-if="vendor.preOrderOnly" class="px-2.5 py-1 rounded-lg bg-purple-500/20 border border-purple-400/30 text-purple-300 text-[10px] font-medium shrink-0">
                  📅 PRE-ORDER ONLY
                </span>
              </div>
              <h1 class="text-2xl md:text-3xl font-medium text-white tracking-tight leading-tight truncate">{{ toTitleCase(vendor.storeName) }}</h1>
              <!-- Stats Row -->
              <div class="flex items-center gap-3 mt-2 text-white/70 text-xs font-bold flex-wrap">
                <button @click="showReviewsModal = true" class="flex items-center gap-1 hover:text-white transition-colors cursor-pointer active:scale-95 bg-white/10 px-2 py-1 rounded-lg border border-white/10">
                  <Star class="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span class="text-white font-medium">{{ vendor.rating?.toFixed(1) || '5.0' }}</span>
                  <span>({{ vendor.totalRatings || 0 }} reviews)</span>
                  <ChevronRight class="w-3 h-3 ml-1 opacity-50" />
                </button>
                <template v-if="vendor.preparationTime > 0">
                  <span class="w-1 h-1 rounded-full bg-white/30"></span>
                  <span class="flex items-center gap-1">
                    <Clock class="w-3 h-3" />
                    {{ vendor.preparationTime }} min
                  </span>
                </template>
                <template v-if="lowestProductPrice > 0">
                  <span class="w-1 h-1 rounded-full bg-white/30"></span>
                  <span class="flex items-center gap-1">
                    <Bike class="w-3 h-3" />
                    From ₦{{ lowestProductPrice.toLocaleString() }}
                  </span>
                </template>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================ -->
      <!-- ACTION CHIPS BAR                             -->
      <!-- ============================================ -->
      <div class="max-w-[1400px] mx-auto px-4 md:px-4 -mt-4 relative z-20">
        <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            @click="handleStartGroupOrder"
            class="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-medium transition-all whitespace-nowrap shrink-0 shadow-sm border border-gray-100 active:scale-95"
            :class="isGroupOrderActiveForThisVendor ? 'bg-emerald-500 text-white' : 'bg-white text-gray-900 border border-gray-100 shadow-sm border border-gray-100'"
          >
            <Users class="w-3.5 h-3.5" />
            {{ isGroupOrderActiveForThisVendor ? `Group: ${activeCode}` : 'Group Order' }}
          </button>
          
          <button 
            @click="showMobileCartDrawer = true" 
            class="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white text-gray-900 rounded-2xl text-xs font-medium transition-all whitespace-nowrap shadow-sm border border-gray-100 border border-gray-100 shrink-0 active:scale-95"
          >
            <ShoppingBag class="w-3.5 h-3.5" />
            <span v-if="cart.getVendorStats(vendor._id).itemCount > 0" class="bg-parentPrimary text-white px-1.5 py-0.5 rounded-md text-[10px]">{{ cart.getVendorStats(vendor._id).itemCount }}</span>
            <span v-else>My Cart</span>
          </button>
        </div>
      </div>

      <!-- ============================================ -->
      <!-- PROMO BANNERS (Horizontal Scroll)            -->
      <!-- ============================================ -->
      <div v-if="activeBanners.length" class="max-w-[1400px] mx-auto px-4 md:px-4 mt-6">
        <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
          <div 
            v-for="(banner, idx) in activeBanners" 
            :key="idx"
            class="flex-shrink-0 w-[85%] md:w-[400px] h-[140px] rounded-2xl overflow-hidden relative snap-start group cursor-pointer active:scale-[0.98] transition-transform"
            @click="handleBannerClick(banner)"
          >
            <img :src="banner.image" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent flex flex-col justify-end p-4">
              <span class="absolute top-3 right-3 px-2 py-0.5 bg-parentPrimary text-white rounded-md text-[9px] font-medium shadow-sm">Offer</span>
              <h3 class="text-sm font-medium text-white tracking-tight leading-tight">{{ toTitleCase(banner.title) }}</h3>
              <p class="text-xs font-bold text-white/70 mt-0.5 truncate">{{ banner.description }}</p>
              
              <div v-if="banner.endAt" class="flex items-center gap-1 mt-1.5">
                <Clock class="w-3 h-3 text-amber-400" />
                <span class="text-[10px] font-bold text-amber-400">{{ formatCountdown(banner.endAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pre-Order Batch Banner -->
      <div v-if="activeBatch" class="max-w-[1400px] mx-auto px-4 md:px-4 mt-6">
        <div class="bg-gray-900 rounded-2xl p-5 md:p-4 relative overflow-hidden group shadow-sm border border-gray-100">
          <div class="absolute -right-10 -top-10 w-40 h-40 bg-parentPrimary/20 rounded-full blur-[80px]"></div>
          <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="space-y-3">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-xl bg-parentPrimary text-white flex items-center justify-center shadow-sm border border-gray-100">
                  <Calendar class="w-4 h-4" />
                </div>
                <h3 class="text-xs font-medium text-white tracking-wider">{{ activeBatch.windowName }}</h3>
              </div>
              <div class="flex flex-wrap gap-4 text-xs">
                <div>
                  <p class="text-white/40 font-medium mb-0.5">Accepting until</p>
                  <p class="font-medium text-parentPrimary">{{ new Date(activeBatch.deadline).toLocaleString() }}</p>
                </div>
                <div>
                  <p class="text-white/40 font-medium mb-0.5">Delivery on</p>
                  <p class="font-medium text-emerald-400">{{ new Date(activeBatch.deliveryDate).toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' }) }}</p>
                </div>
              </div>
            </div>
            <span class="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-medium border border-emerald-500/20 self-start md:self-center">Live &amp; Open</span>
          </div>
        </div>
      </div>

      <!-- ============================================ -->
      <!-- STICKY CATEGORY PILLS                        -->
      <!-- ============================================ -->
      <div 
        class="sticky z-30 bg-white/95 backdrop-blur-xl border-b border-gray-50 transition-all duration-300"
        :class="scrolled ? 'top-[57px]' : 'top-0'"
      >
        <div class="max-w-[1400px] mx-auto px-4 md:px-4 py-2.5 flex flex-col md:flex-row items-center gap-3">
          <!-- Search Bar -->
          <div class="relative w-full md:w-1/2 lg:max-w-md">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search class="h-4 w-4 text-gray-400" />
            </div>
            <input 
              v-model="searchQuery"
              type="text" 
              :placeholder="`Search ${vendor?.storeName || 'Store'}...`"
              class="block w-full pl-10 pr-3 py-2 border border-gray-100 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-parentPrimary focus:border-parentPrimary sm:text-base transition-all shadow-sm"
            />
          </div>

          <!-- Category Tabs (Chowdeck Style) -->
          <div class="flex-1 w-full overflow-x-auto scrollbar-hide flex items-center gap-2 pb-1">
            <button 
              @click="scrollToCategory('')"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap shrink-0"
              :class="!activeCategory ? 'bg-parentPrimary/10 text-parentPrimary font-bold' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'"
            >
              All
            </button>
            <button 
              v-if="packs.length > 0 && !isMiniMart"
              @click="scrollToCategory('combos-promos')"
              class="px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap shrink-0"
              :class="activeCategory === 'combos-promos' ? 'bg-parentPrimary/10 text-parentPrimary font-bold' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'"
            >
              Combos
            </button>
            <template v-for="cat in categories" :key="cat">
              <button
                v-if="groupedProducts[cat] && groupedProducts[cat].length > 0"
                @click="scrollToCategory(cat)"
                class="px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap shrink-0"
                :class="activeCategory === cat ? 'bg-parentPrimary/10 text-parentPrimary font-bold' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'"
              >
                {{ toTitleCase(cat) }}
              </button>
            </template>
          </div>
        </div>
      </div>

      <!-- ============================================ -->
      <!-- MAIN CONTENT AREA                            -->
      <!-- ============================================ -->
      <div class="max-w-[1400px] mx-auto px-4 md:px-4 mt-6">
        
        <!-- LOADING SPINNER -->
        <div v-if="menuLoading" class="flex flex-col items-center justify-center py-24 min-h-[300px]">
          <div class="w-12 h-12 border-4 border-parentPrimary/20 border-t-parentPrimary rounded-full animate-spin mb-4"></div>
          <p class="text-sm font-medium text-gray-500">Loading menu...</p>
        </div>
        
        <template v-else>
        <!-- TOP PICKS FOR MINI-MART -->
        <div v-if="isMiniMart && topPicks.length > 0" class="mb-10">
          <div class="flex items-center gap-3 mb-5">
            <h2 class="text-lg font-bold text-gray-900 tracking-tight">Top Picks</h2>
            <div class="h-px bg-gray-100 flex-1"></div>
            <span class="text-[10px] uppercase font-bold text-parentPrimary tracking-wider bg-parentPrimary/10 px-2 py-0.5 rounded-full">Popular</span>
          </div>
          <div class="flex overflow-x-auto gap-4 pb-4 scrollbar-hide snap-x">
            <div 
              v-for="product in topPicks" 
              :key="'top-' + product._id"
              @click="openProductModal(product)"
              class="w-[140px] md:w-[160px] shrink-0 snap-start bg-white rounded-2xl border border-gray-100 p-3 hover:border-parentPrimary/30 hover:shadow-sm border border-gray-100 transition-all cursor-pointer relative"
            >
              <div class="w-full aspect-square rounded-xl bg-gray-50 mb-3 overflow-hidden">
                <img :src="getMediaItems(product)[0]?.url || '/placeholder-store.jpg'" class="w-full h-full object-cover" />
              </div>
              <h3 class="text-sm font-medium text-gray-900 leading-tight truncate mb-1">{{ product.name }}</h3>
              <p class="text-xs font-bold text-gray-900 mb-2">₦{{ (product.discountPrice || product.pricePerPortion || product.price || 0).toLocaleString() }}</p>
              
              <div v-if="isMiniMart && getProductCount(product._id) > 0" class="absolute bottom-3 right-3 flex items-center gap-1.5 bg-gray-100 rounded-xl px-1 py-1 h-8 shadow-sm">
                <button @click.stop="removeFromCart(product)" class="w-6 h-6 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-gray-50 active:scale-95 transition-all text-gray-700">
                  <Minus class="w-3 h-3" />
                </button>
                <span class="text-[10px] font-bold w-3 text-center text-gray-900">{{ getProductCount(product._id) }}</span>
                <button @click.stop="quickAddToCart(product)" class="w-6 h-6 flex items-center justify-center rounded-lg bg-parentPrimary shadow-sm hover:brightness-110 active:scale-95 transition-all text-white">
                  <Plus class="w-3 h-3" />
                </button>
              </div>
              <button 
                v-else-if="!isProductOutOfStock(product)"
                @click.stop="handleListAdd(product)"
                class="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-parentPrimary transition-colors shadow-sm"
              >
                <Plus class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div class="flex flex-col lg:flex-row gap-8">
          
          <!-- Products Column -->
          <div class="flex-1 space-y-10">
            <!-- Bundles / Packs for Restaurant Layout -->
            <section id="combos-promos" class="scroll-mt-32" v-if="packs.length > 0">
              <div class="flex items-center gap-3 mb-5">
                <h2 class="text-lg font-medium text-gray-900 tracking-tight">Combos &amp; Promos</h2>
                <div class="h-px bg-gray-100 flex-1"></div>
                <span class="text-xs font-bold text-gray-400">{{ packs.length }} items</span>
              </div>
              <div class="flex gap-3 overflow-x-auto scrollbar-hide pb-2 snap-x">
                <div 
                  v-for="pack in packs" 
                  :key="pack._id"
                  @click="openProductModal(pack)"
                  class="relative bg-gray-50 border border-gray-100 rounded-xl p-4 w-[280px] md:w-[320px] max-w-[85vw] shrink-0 snap-start cursor-pointer hover:bg-gray-100 hover:border-parentPrimary/20 hover:shadow-sm transition-all flex flex-col justify-between overflow-hidden"
                  :class="{ 'opacity-50 grayscale pointer-events-none': isProductOutOfStock(pack) }"
                >
                  <div v-if="pack.isPrepaidByPlatform" class="absolute top-0 right-0 z-10 px-2 py-1 bg-indigo-500 text-white rounded-bl-lg shadow-sm text-[9px] font-bold uppercase tracking-widest">
                    Promo
                  </div>
                  <div>
                    <h4 class="font-bold text-gray-900 mb-1 text-[15px] pr-10 leading-tight">{{ pack.name }}</h4>
                    <p class="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">{{ pack.description || 'Bundle items' }}</p>
                  </div>
                  <div class="text-sm font-bold text-gray-900 mt-auto flex items-center justify-between">
                    <span>₦{{ (pack.bundlePrice || pack.price || 0).toLocaleString() }}</span>
                    <span v-if="isProductOutOfStock(pack)" class="text-[10px] font-bold text-rose-500 uppercase tracking-wider bg-rose-50 px-2 py-1 rounded">Out of stock</span>
                    <span v-else-if="pack.trackStock && pack.stockQuantity <= 5" class="text-[9px] font-bold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded">{{ pack.stockQuantity }} left</span>
                    <div v-else class="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-sm">
                      <Plus class="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <template v-for="cat in categories" :key="cat">
              <section 
                v-if="groupedProducts[cat] && groupedProducts[cat].length > 0"
                :id="cat.toLowerCase().replace(/\s+/g, '-')"
                class="scroll-mt-32"
              >
              <!-- Category Header -->
              <div class="flex items-center gap-3 mb-5">
                <h2 class="text-lg font-medium text-gray-900 tracking-tight">{{ toTitleCase(cat) }}</h2>
                <div class="h-px bg-gray-100 flex-1"></div>
                <span class="text-xs font-bold text-gray-400">{{ groupedProducts[cat]?.length || 0 }} items</span>
              </div>

              <!-- MOBILE: Horizontal List Cards -->
              <div class="md:hidden space-y-3">
                <div 
                  v-for="product in (isMiniMart && !expandedCategories[cat] ? groupedProducts[cat].slice(0, 10) : groupedProducts[cat])" 
                  :key="product._id"
                  @click="openProductModal(product)"
                  class="group flex items-center gap-3 p-2.5 bg-white rounded-2xl border border-gray-100 hover:border-parentPrimary/20 hover:shadow-sm transition-all cursor-pointer active:scale-[0.98]"
                  :class="{ 'opacity-50 grayscale pointer-events-none': isProductOutOfStock(product) }"
                >
                  <!-- Square Image / Mini Carousel -->
                  <div class="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 shrink-0 relative" @click.stop="getMediaItems(product).length ? openLightbox(getMediaItems(product), 0) : null">
                    <video v-if="getMediaItems(product)[0]?.type === 'video'" :src="getMediaItems(product)[0]?.url" class="w-full h-full object-cover" autoplay loop muted playsinline></video>
                    <img v-else :src="getMediaItems(product)[0]?.url || (isFoodVendor ? '/placeholder-food.jpg' : '/placeholder-store.jpg')" class="w-full h-full object-cover" />
                    <!-- Play icon if it's a video -->
                    <div v-if="getMediaItems(product)[0]?.type === 'video'" class="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                      <Play class="w-6 h-6 text-white" fill="currentColor" />
                    </div>
                    <!-- Indicator for multiple media -->
                    <div v-if="getMediaItems(product).length > 1" class="absolute bottom-1 right-1 bg-black/50 text-white rounded px-1 flex items-center justify-center text-[8px] font-bold">
                      +{{ getMediaItems(product).length - 1 }}
                    </div>
                    
                    <div v-if="getProductCount(product._id) > 0" class="absolute top-1 right-1 bg-parentPrimary text-white w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-medium shadow-sm">
                      {{ getProductCount(product._id) }}
                    </div>
                  </div>
                  <!-- Info -->
                  <div class="flex-1 min-w-0 py-0.5">
                    <div class="flex items-center gap-2 mb-0.5">
                      <h3 class="text-sm font-medium text-gray-900 tracking-tight leading-tight truncate">{{ product.name }}</h3>
                      <span v-if="product.isPrepaidByPlatform" class="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded text-[9px] font-bold uppercase tracking-wider shrink-0">Promo</span>
                    </div>
                    <p class="text-[11px] text-gray-400 font-medium line-clamp-1 mt-0.5 leading-relaxed">{{ product.description || defaultProductDescription }}</p>
                    <div class="flex items-center justify-between mt-2">
                      <div>
                        <span v-if="product.discountPrice" class="text-[10px] text-gray-300 line-through mr-1">₦{{ (product.pricePerPortion || product.price || 0).toLocaleString() }}</span>
                        <span class="text-sm font-medium text-gray-900">₦{{ (product.discountPrice || product.pricePerPortion || product.price || 0).toLocaleString() }}</span>
                        <span v-if="product.portionUnit" class="text-[10px] text-gray-500 ml-1">per {{ product.portionUnit }}</span>
                      </div>
                    </div>
                  </div>
                  <!-- Out of Stock / Add Button -->
                  <div v-if="isProductOutOfStock(product)" class="flex flex-col items-center gap-1 shrink-0">
                    <button 
                      @click.stop="notifyRestock(product._id)"
                      class="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-amber-100 hover:text-amber-600 transition-colors shadow-sm"
                      title="Notify when restocked"
                    >
                      <Bell class="w-3.5 h-3.5" />
                    </button>
                    <span class="text-[8px] font-bold text-red-500 uppercase tracking-wider">Out of stock</span>
                  </div>
                  <div v-if="isMiniMart && getProductCount(product._id) > 0" class="flex items-center justify-between w-[88px] bg-gray-100 rounded-xl px-1.5 py-1 h-10 shrink-0">
                    <button @click.stop="removeFromCart(product)" class="w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-gray-50 text-gray-700 active:scale-95 transition-transform">
                      <Minus class="w-3 h-3" />
                    </button>
                    <span class="text-[13px] font-bold text-gray-900">{{ getProductCount(product._id) }}</span>
                    <button @click.stop="quickAddToCart(product)" class="w-7 h-7 flex items-center justify-center rounded-lg bg-parentPrimary shadow-sm hover:brightness-110 text-white active:scale-95 transition-transform">
                      <Plus class="w-3 h-3" />
                    </button>
                  </div>
                  <button 
                    v-else
                    @click.stop="handleListAdd(product)"
                    class="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center hover:bg-parentPrimary active:scale-90 transition-all shadow-sm border border-gray-100 shrink-0"
                  >
                    <Plus class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <!-- DESKTOP: Grid Cards -->
              <div class="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div 
                  v-for="product in (isMiniMart && !expandedCategories[cat] ? groupedProducts[cat].slice(0, 10) : groupedProducts[cat])" 
                  :key="product._id"
                  @click="openProductModal(product)"
                  class="group relative bg-white rounded-2xl border border-gray-100 hover:border-parentPrimary/20 hover:shadow-sm transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
                  :class="{ 'opacity-50 grayscale pointer-events-none': isProductOutOfStock(product) }"
                >
                  <!-- Promo Badge -->
                  <div v-if="product.isPrepaidByPlatform" class="absolute top-3 left-3 z-20 px-2 py-1 bg-indigo-500 text-white border-indigo-600 rounded shadow text-[10px] font-bold uppercase tracking-wider">Promo</div>
                  
                  <!-- Media Carousel -->
                  <MediaCarousel 
                    :media-items="getMediaItems(product)" 
                    :default-placeholder="isFoodVendor ? '/placeholder-food.jpg' : '/placeholder-store.jpg'"
                    aspect-ratio="aspect-[4/3]"
                    :show-arrows="true"
                    :hover-scale="true"
                    @click-media="(idx) => openLightbox(getMediaItems(product), idx)"
                  >
                    <template #overlay="{ item }">
                      <!-- Item Count overlay -->
                      <div v-if="getProductCount(product._id) > 0" class="absolute top-3 right-3 flex items-center gap-1.5 bg-parentPrimary text-white px-2.5 py-1 rounded-lg text-xs font-medium shadow-sm border border-gray-100 z-20">
                        <ShoppingBag class="w-3 h-3" />
                        {{ getProductCount(product._id) }}
                      </div>
                    </template>
                  </MediaCarousel>
                  
                  
                  <!-- Content -->
                  <div class="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 class="text-sm font-medium text-gray-900 tracking-tight leading-tight mb-1 group-hover:text-parentPrimary transition-colors">{{ product.name }}</h3>
                      <p class="text-[11px] font-medium text-gray-400 line-clamp-2 leading-relaxed">{{ product.description || defaultProductDescription }}</p>
                    </div>
                    
                    <div class="flex items-end justify-between mt-4 pt-3 border-t border-gray-50">
                      <div>
                        <span v-if="product.discountPrice" class="text-xs text-gray-300 line-through block mb-0.5">₦{{ (product.pricePerPortion || product.price || 0).toLocaleString() }}</span>
                        <div class="flex items-baseline gap-1">
                          <span class="text-base font-medium text-gray-900">₦{{ (product.discountPrice || product.pricePerPortion || product.price || 0).toLocaleString() }}</span>
                          <span v-if="product.portionUnit" class="text-[10px] text-gray-500">per {{ product.portionUnit }}</span>
                        </div>
                      </div>
                      
                      <div v-if="isProductOutOfStock(product)" class="flex flex-col items-end gap-1">
                        <span class="text-[9px] font-bold text-red-500 uppercase tracking-wider">Out of stock</span>
                        <button 
                          @click.stop="notifyRestock(product._id)"
                          class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-amber-100 hover:text-amber-700 transition-colors"
                        >
                          <Bell class="w-3 h-3" />
                          <span class="text-[10px] font-medium">Notify me</span>
                        </button>
                      </div>
                      <div v-if="isMiniMart && getProductCount(product._id) > 0" class="flex items-center gap-2 bg-gray-100 rounded-xl px-1.5 h-10 shadow-inner shrink-0">
                        <button @click.stop="removeFromCart(product)" class="w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-gray-50 active:scale-95 transition-all text-gray-700">
                          <Minus class="w-3.5 h-3.5" />
                        </button>
                        <span class="text-xs font-bold w-4 text-center text-gray-900">{{ getProductCount(product._id) }}</span>
                        <button @click.stop="quickAddToCart(product)" class="w-7 h-7 flex items-center justify-center rounded-lg bg-parentPrimary shadow-sm hover:brightness-110 active:scale-95 transition-all text-white">
                          <Plus class="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <button 
                        v-else
                        @click.stop="handleListAdd(product)"
                        class="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center hover:bg-parentPrimary hover:scale-105 active:scale-95 transition-all shadow-sm border border-gray-100 hover:shadow-parentPrimary/30 shadow-black/5 shrink-0"
                      >
                        <Plus class="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mini-mart Expand Category Button -->
              <div v-if="isMiniMart && !expandedCategories[cat] && groupedProducts[cat].length > 10" class="mt-4 flex justify-center">
                <button 
                  @click="expandedCategories[cat] = true"
                  class="px-5 py-2.5 bg-gray-50 text-gray-700 hover:bg-gray-100 rounded-xl text-sm font-bold border border-gray-200 transition-all active:scale-[0.98]"
                >
                  See all {{ groupedProducts[cat].length }} items
                </button>
              </div>

            </section>
            </template>
          </div>


          <!-- ============================================ -->
          <!-- SERVICES COLUMN                              -->
          <!-- ============================================ -->
          <div v-if="vendorServices.length > 0" class="flex-1 space-y-10 mt-10 lg:mt-0">
            <section id="services" class="scroll-mt-32">
              <div class="flex items-center gap-3 mb-5">
                <h2 class="text-lg font-medium text-gray-900 tracking-tight">Services</h2>
                <div class="h-px bg-gray-100 flex-1"></div>
              </div>
              <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div 
                  v-for="service in vendorServices" 
                  :key="service._id"
                  class="group relative bg-white rounded-2xl border border-gray-100 hover:border-parentPrimary/20 hover:shadow-sm border border-gray-100 transition-all cursor-pointer overflow-hidden flex flex-col"
                >
                  <div class="w-full aspect-[4/3] overflow-hidden bg-gray-50 relative">
                    <img :src="service.image || '/placeholder-service.jpg'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div class="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 class="text-sm font-medium text-gray-900 mb-1">{{ service.name }}</h3>
                      <p class="text-[11px] text-gray-400 line-clamp-2">{{ service.description }}</p>
                    </div>
                    <div class="flex items-end justify-between mt-4 pt-3 border-t border-gray-50">
                      <div>
                        <span class="text-base font-medium text-gray-900">₦{{ service.price.toLocaleString() }}</span>
                        <span class="text-xs text-gray-500 block">{{ service.durationInMinutes }} mins</span>
                      </div>
                      <button 
                        @click.stop="openBookingModal(service)"
                        class="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-parentPrimary transition-all shadow-sm border border-gray-100"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <!-- ============================================ -->
          <!-- DESKTOP CART SIDEBAR                         -->
          <!-- ============================================ -->
          <aside class="hidden lg:block lg:w-[360px] shrink-0">
            <div class="sticky top-24 space-y-6">
              
              <!-- Group Participants -->
              <div v-if="groupOrder && groupOrder.participants" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div class="flex items-center justify-between px-5 py-4 bg-gray-50/50 border-b border-gray-100">
                  <h3 class="text-xs font-medium text-gray-400 tracking-widest">Participants ({{ groupOrder.participants?.length || 0 }})</h3>
                  <button v-if="isHost" @click="copyInviteLink" class="text-[10px] font-medium text-parentPrimary hover:underline">Copy Link</button>
                </div>
                <div class="p-3 space-y-2">
                  <div v-for="p in groupOrder.participants" :key="p.user?._id || p.user" class="p-3 bg-gray-50 rounded-xl flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-medium text-xs text-gray-500 overflow-hidden shrink-0">
                      <img v-if="p.user?.avatar" :src="p.user.avatar" class="w-full h-full object-cover" />
                      <span v-else>{{ p.user?.firstName?.[0] || 'G' }}</span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <p class="text-xs font-medium text-gray-900 truncate">{{ p.user?.firstName || 'Guest' }} {{ p.user?.lastName || '' }}</p>
                        <span v-if="p.user?._id === groupOrder.host?._id || p.user === groupOrder.host" class="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded text-[8px] font-medium">Host</span>
                      </div>
                      <p class="text-[10px] font-bold text-gray-400">{{ p.items?.length || 0 }} items · ₦{{ (p.total || 0).toLocaleString() }}</p>
                    </div>
                    <div class="flex items-center gap-1.5">
                      <div :class="p.isReady ? 'bg-emerald-500' : 'bg-gray-200'" class="w-1.5 h-1.5 rounded-full"></div>
                      <span class="text-[9px] font-medium" :class="p.isReady ? 'text-emerald-600' : 'text-gray-400'">{{ p.isReady ? 'Ready' : 'Carting' }}</span>
                    </div>
                  </div>
                  <!-- Group Actions -->
                  <div class="pt-2 flex flex-col gap-2">
                    <button 
                      @click="toggleReady(!getMyStatus?.isReady)"
                      class="w-full py-2.5 rounded-xl text-xs font-medium transition-all border"
                      :class="getMyStatus?.isReady ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white text-gray-400 border-gray-100 hover:text-gray-900'"
                    >
                      {{ getMyStatus?.isReady ? 'You are Ready' : 'Mark as Ready' }}
                    </button>
                    <button 
                      v-if="isHost && groupOrder.status === 'open'"
                      @click="handleCheckoutGroupOrder"
                      :disabled="!canCheckout"
                      class="w-full py-3 bg-gray-900 text-white rounded-xl text-xs font-medium hover:bg-parentPrimary transition-all shadow-sm border border-gray-100 disabled:opacity-50"
                    >
                      Checkout Everything
                    </button>
                    <button @click="showLeaveConfirmationModal = true" class="w-full py-2 text-[10px] font-medium text-rose-400 hover:text-rose-600 transition-all">
                      Leave Group
                    </button>
                  </div>
                </div>
              </div>

              <!-- Cart Summary Card -->
              <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div class="flex items-center justify-between px-5 py-4 bg-gray-50/50 border-b border-gray-100">
                  <h3 class="text-xs font-medium text-gray-900 tracking-tight">Your {{ packsTerm }}</h3>
                  <ShoppingCart class="w-4 h-4 text-parentPrimary" />
                </div>

                <div v-if="cart.getVendorStats(vendor._id).itemCount > 0" class="p-4 space-y-4">
                  <div v-for="(pack, pIndex) in cart.getVendorStats(vendor._id).packs" :key="pack.id" class="space-y-3">
                    <!-- Pack Header -->
                    <div v-if="isFoodVendor" class="flex items-center justify-between">
                      <span class="text-[10px] font-medium bg-gray-900 text-white px-3 py-1 rounded-lg">{{ pack.name || `${packTerm} ${pIndex + 1}` }}</span>
                      <div class="flex items-center gap-1">
                        <button @click="duplicatePack(vendor._id, pack)" class="p-1.5 text-gray-400 hover:text-parentPrimary transition-all" :title="`Duplicate ${packTerm.toLowerCase()}`">
                          <Copy class="w-3.5 h-3.5" />
                        </button>
                        <button @click="cart.removePack(vendor._id, pack.id)" class="p-1.5 text-gray-400 hover:text-rose-500 transition-all" :title="`Remove ${packTerm.toLowerCase()}`">
                          <Trash2 class="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <!-- Desktop Pack Size Selector -->
                    <div v-if="vendor.packs && vendor.packs.length > 0 && vendor.requiresTakeawayPack" class="mt-2 relative">
                      <div
                        @click="openPackDropdowns[pack.id + 'desktop'] = !openPackDropdowns[pack.id + 'desktop']"
                        class="w-full bg-gray-50/50 text-[10px] py-1.5 px-2 rounded-lg border border-gray-200 cursor-pointer flex items-center justify-between hover:border-parentPrimary/50 transition-colors"
                      >
                        <span class="font-medium text-gray-700">
                          {{ pack.packType?.name || pack.name }} · ₦{{ pack.packType?.price?.toLocaleString() || vendor.packs.find((p: any) => p.name === (pack.packType?.name || pack.name))?.price?.toLocaleString() }}
                        </span>
                        <ChevronDown class="w-3 h-3 text-gray-400" />
                      </div>
                      <div v-if="openPackDropdowns[pack.id + 'desktop']" class="absolute z-10 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                        <div
                          v-for="(vp, vpIdx) in vendor.packs.filter((p: any) => p.isActive !== false)"
                          :key="vpIdx"
                          @click="cart.setPackType(vendor._id, pack.id, { name: vp.name, price: vp.price }); openPackDropdowns[pack.id + 'desktop'] = false"
                          class="px-2 py-1.5 text-[10px] font-medium text-gray-700 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                          :class="{ 'bg-parentPrimary/5 text-parentPrimary': (pack.packType?.name || pack.name) === vp.name }"
                        >
                          <span>{{ vp.name }}</span>
                          <span class="text-gray-400">₦{{ vp.price?.toLocaleString() }}</span>
                        </div>
                      </div>
                    </div>
                    <!-- Pack Items -->
                    <div class="space-y-2">
                      <div v-for="(item, iIndex) in pack.items" :key="item.productId + iIndex" class="flex items-center gap-3">
                        <div class="w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-gray-100 bg-gray-50 relative">
                          <video v-if="item.image && item.image.match(/\.(mp4|webm|ogg|mov)/i)" :src="item.image" class="w-full h-full object-cover" autoplay loop muted playsinline></video>
                          <img v-else :src="item.image || (isFoodVendor ? '/placeholder-food.jpg' : '/placeholder-store.jpg')" class="w-full h-full object-cover" />
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-xs font-medium text-gray-900 truncate">{{ toTitleCase(item.name) }}</p>
                          <div v-if="item.customizations && item.customizations.length > 0" class="mt-0.5 space-y-0.5 mb-1">
                            <p v-for="(c, cIdx) in item.customizations" :key="cIdx" class="text-[10px] font-medium text-gray-400 leading-tight line-clamp-1">
                              + {{ c.name }} <span v-if="c.price > 0">(₦{{ c.price.toLocaleString() }})</span>
                            </p>
                          </div>
                          <div class="text-right">
                            <p class="text-xs font-medium text-parentPrimary">₦{{ ((item.subtotal || item.price || 0) / (item.quantity || 1)).toLocaleString() }}</p>
                          </div>
                        </div>
                        <div class="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border border-gray-100 shrink-0">
                          <button @click="cart.updateItemQuantity(vendor._id, pack.id, iIndex, item.quantity - 1)" class="w-6 h-6 rounded-md bg-white text-gray-500 flex items-center justify-center hover:text-rose-500 transition-all text-xs font-bold shadow-sm">−</button>
                          <span class="text-xs font-medium min-w-[16px] text-center">{{ item.quantity }}</span>
                          <button @click="cart.updateItemQuantity(vendor._id, pack.id, iIndex, item.quantity + 1)" class="w-6 h-6 rounded-md bg-white text-gray-500 flex items-center justify-center hover:text-parentPrimary transition-all text-xs font-bold shadow-sm">+</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Add Pack -->
                  <button v-if="isFoodVendor" @click="addNewPack(vendor._id)" class="w-full py-3 border border-dashed border-gray-200 rounded-xl text-xs font-medium text-gray-400 hover:border-parentPrimary hover:text-parentPrimary transition-all flex items-center justify-center gap-2">
                    <Plus class="w-3.5 h-3.5" /> New {{ packTerm }}
                  </button>
                  
                  <!-- Leave Note (Desktop) -->
                  <div class="pt-4 mt-4 border-t border-gray-100">
                    <button @click="openVendorNoteModal" class="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
                      <div class="flex items-center gap-3 text-left">
                        <FileText class="w-5 h-5 text-gray-600 stroke-[2]" />
                        <div class="min-w-0">
                          <p class="text-xs font-bold text-gray-900 mb-0.5">Leave a note</p>
                          <p class="text-[10px] font-medium text-gray-400 truncate w-32">{{ cart.vendorNotes.value[vendor._id] || 'Any requests...' }}</p>
                        </div>
                      </div>
                      <ChevronRight class="w-4 h-4 text-gray-400" />
                    </button>
                  </div>

                  <!-- Checkout -->
                  <div class="pt-4 border-t border-gray-100 space-y-4 mt-4">
                    <div class="flex justify-between items-center">
                      <span class="text-xs font-medium text-gray-400 tracking-wider">Subtotal</span>
                      <span class="text-xl font-medium text-gray-900 tracking-tighter">₦{{ (cart.getVendorStats(vendor._id).subtotal + cart.getVendorStats(vendor._id).packagingFee).toLocaleString() }}</span>
                    </div>
                    <NuxtLink 
                      v-if="vendor.isOpen !== false || route.query.schedule === 'true'"
                      :to="canProceedToCheckout ? (isGroupOrderActiveForThisVendor ? `/cart?group=${activeCode}` : '/cart') : ''" 
                      @click="!canProceedToCheckout ? $event.preventDefault() : null"
                      :class="!canProceedToCheckout ? 'opacity-50 cursor-not-allowed' : 'hover:bg-parentPrimary/90 active:scale-[0.98] shadow-sm border border-gray-100 shadow-parentPrimary/20'"
                      class="block w-full py-4 bg-parentPrimary text-white rounded-2xl text-center text-xs font-medium tracking-wider transition-all"
                    >
                      {{ isGroupOrderActiveForThisVendor ? 'Finalize Order' : 'Proceed to Checkout' }}
                    </NuxtLink>
                  </div>
                </div>
                
                <!-- Empty Cart -->
                <div v-else class="p-5 text-center">
                  <div class="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">🛒</div>
                  <p class="text-sm font-medium text-gray-900 mb-1">Your cart is empty</p>
                  <p class="text-xs font-medium text-gray-400">Tap + on any item to start your order</p>
                </div>
              </div>
            </div>
          </aside>
        </div>
        </template>
      </div>
    </div>
    </template>

    <!-- Media Lightbox Modal -->
    <MediaLightbox 
      :is-open="isLightboxOpen" 
      :media-items="lightboxMediaItems" 
      :initial-index="lightboxInitialIndex" 
      @close="isLightboxOpen = false" 
    />

    <!-- ============================================ -->
    <!-- MOBILE CART DRAWER (Bottom Sheet)            -->
    <!-- ============================================ -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-transform duration-300 ease-out"
        enter-from-class="translate-y-full"
        enter-to-class="translate-y-0"
        leave-active-class="transition-transform duration-200 ease-in"
        leave-from-class="translate-y-0"
        leave-to-class="translate-y-full"
      >
        <div v-if="showMobileCartDrawer" class="fixed inset-0 z-[101] bg-white overflow-y-auto lg:hidden flex flex-col">
          <!-- Header -->
          <div class="sticky top-0 bg-white border-b border-gray-100 z-10 shadow-sm">
            <div class="flex items-center justify-between px-5 py-4">
              <button @click="showMobileCartDrawer = false" class="w-10 h-10 bg-parentPrimary rounded-full flex items-center justify-center text-white shrink-0 hover:bg-parentPrimary/90 active:scale-95 transition-all">
                <ArrowLeft class="w-5 h-5"/>
              </button>
              <div class="text-center">
                <p class="text-[10px] font-bold text-gray-900 tracking-widest uppercase mb-0.5">Your Cart From</p>
                <h2 class="text-[17px] font-bold text-gray-900 leading-none">{{ vendor.storeName }}</h2>
              </div>
              <button @click="showMobileCartDrawer = false" class="w-10 h-10 bg-gray-50 hover:bg-gray-100 transition-colors rounded-full flex items-center justify-center text-gray-400 shrink-0 active:scale-95">
                <X class="w-4 h-4"/>
              </button>
            </div>
          </div>
          
          <div class="flex-1 flex flex-col bg-white">
            <!-- Group Participants (if in group) -->
            <div v-if="groupOrder" class="p-5 space-y-3 border-b border-gray-50">
              <h3 class="text-xs font-medium text-gray-400 tracking-widest">Participants ({{ groupOrder.participants?.length || 0 }})</h3>
              <div v-for="p in groupOrder.participants" :key="p.user?._id || p.user" class="p-3 bg-gray-50 rounded-xl flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-medium text-xs text-gray-500 overflow-hidden shrink-0">
                  <img v-if="p.user?.avatar" :src="p.user?.avatar" class="w-full h-full object-cover" />
                  <span v-else>{{ p.user?.firstName?.[0] || 'G' }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-medium text-gray-900 truncate">{{ p.user?.firstName || 'Guest' }} {{ p.user?.lastName || '' }}</p>
                  <p class="text-[10px] font-bold text-gray-400">{{ p.items?.length || 0 }} items · ₦{{ (p.total || 0).toLocaleString() }}</p>
                </div>
                <div :class="p.isReady ? 'bg-emerald-500' : 'bg-gray-200'" class="w-2 h-2 rounded-full"></div>
              </div>
              <div class="flex flex-col gap-2 pt-1">
                <button 
                  @click="toggleReady(!getMyStatus?.isReady)"
                  class="w-full py-2.5 rounded-xl text-xs font-medium transition-all border"
                  :class="getMyStatus?.isReady ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-white text-gray-400 border-gray-100'"
                >
                  {{ getMyStatus?.isReady ? 'You are Ready' : 'Mark as Ready' }}
                </button>
                <button v-if="isHost && groupOrder.status === 'open'" @click="handleCheckoutGroupOrder" :disabled="!canCheckout" class="w-full py-3 bg-gray-900 text-white rounded-xl text-xs font-medium hover:bg-parentPrimary transition-all shadow-sm border border-gray-100 disabled:opacity-50">
                  Checkout Everything
                </button>
                <button @click="showLeaveConfirmationModal = true; showMobileCartDrawer = false" class="w-full py-2 text-[10px] font-medium text-rose-400">Leave Group</button>
              </div>
            </div>

            <!-- Pack Items -->
            <div v-if="cart.getVendorStats(vendor._id).itemCount > 0" class="flex-1 flex flex-col">
              <div class="p-5 space-y-6 flex-1">
                <div v-for="(pack, pIndex) in cart.getVendorStats(vendor._id).packs" :key="pack.id" class="bg-white border border-gray-100 rounded-[1.5rem] shadow-sm overflow-hidden flex flex-col">
                  <!-- Pack Header -->
                  <div class="flex items-center justify-between px-5 py-4 bg-gray-50/50 border-b border-gray-100">
                    <div class="flex items-center gap-2">
                      <div class="w-7 h-7 bg-white rounded-lg flex items-center justify-center border border-gray-200 shadow-sm text-gray-700">
                        <Package class="w-3.5 h-3.5" />
                      </div>
                      <span class="text-sm font-bold text-gray-900">{{ pack.name || `Pack ${pIndex + 1}` }}</span>
                    </div>
                    <button @click="cart.removePack(vendor._id, pack.id)" class="w-8 h-8 bg-white hover:bg-red-50 text-red-500 rounded-lg flex items-center justify-center border border-gray-200 hover:border-red-100 transition-colors shadow-sm">
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </div>
                  
                  <!-- Pack Size Selector -->
                  <div v-if="vendor.packs && vendor.packs.length > 0 && vendor.requiresTakeawayPack" class="px-5 py-3 bg-amber-50/60 border-b border-amber-100/50 relative z-10">
                    <label class="block text-[10px] font-bold text-amber-700 tracking-wider mb-2 uppercase">Pack Size</label>
                    <div
                      @click="openPackDropdowns[pack.id + 'mobile'] = !openPackDropdowns[pack.id + 'mobile']"
                      class="w-full bg-white text-xs p-2.5 rounded-xl border border-amber-200 cursor-pointer flex items-center justify-between hover:border-parentPrimary/50 transition-colors shadow-sm"
                    >
                      <span class="font-medium text-gray-700">
                        {{ pack.packType?.name || pack.name }} · ₦{{ pack.packType?.price?.toLocaleString() || vendor.packs.find((p: any) => p.name === (pack.packType?.name || pack.name))?.price?.toLocaleString() }}
                      </span>
                      <ChevronDown class="w-4 h-4 text-gray-400" />
                    </div>
                    <div v-if="openPackDropdowns[pack.id + 'mobile']" class="absolute z-20 left-5 right-5 mt-1 bg-white border border-gray-100 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                      <div
                        v-for="(vp, vpIdx) in vendor.packs.filter((p: any) => p.isActive !== false)"
                        :key="vpIdx"
                        @click="cart.setPackType(vendor._id, pack.id, { name: vp.name, price: vp.price }); openPackDropdowns[pack.id + 'mobile'] = false"
                        class="px-4 py-3 text-xs font-medium text-gray-700 hover:bg-gray-50 cursor-pointer flex justify-between items-center border-b border-gray-50 last:border-0"
                        :class="{ 'bg-parentPrimary/5 text-parentPrimary': (pack.packType?.name || pack.name) === vp.name }"
                      >
                        <span>{{ vp.name }}</span>
                        <span class="text-gray-400 font-bold">₦{{ vp.price?.toLocaleString() }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Items inside Pack -->
                  <div class="p-4 space-y-0 flex-1">
                    <div v-for="(item, iIndex) in pack.items" :key="item.productId + iIndex" class="flex gap-3 border-b border-gray-100/60 py-3 last:border-0 last:pb-1 first:pt-1">
                      <div class="flex-1 min-w-0">
                        <div class="flex justify-between items-start gap-3">
                          <!-- Left: Name & Customizations -->
                          <div class="flex-1 min-w-0 pr-1">
                            <p class="text-sm font-bold text-gray-900 leading-tight">{{ toTitleCase(item.name) }}</p>
                            
                            <div v-if="item.customizations && item.customizations.length > 0" class="mt-1 space-y-0.5">
                              <p v-for="(c, cIdx) in getGroupedCustomizations(item.customizations)" :key="cIdx" class="text-[11px] font-medium text-gray-500 leading-tight">
                                <span class="truncate">{{ c.quantity > 1 ? c.quantity + 'x ' : '' }}{{ c.name }}</span>
                                <span v-if="c.price > 0" class="text-gray-400 shrink-0">+₦{{ c.price.toLocaleString() }}</span>
                              </p>
                              <button @click="editCartItem(vendor._id, pack.id, iIndex, item)" class="text-[10px] font-bold text-parentPrimary hover:underline mt-1 pt-0.5 block">Edit</button>
                            </div>
                          </div>
                          
                          <!-- Right: Price & Quantity Pill -->
                          <div class="flex flex-col items-end gap-2 shrink-0">
                            <p class="text-sm font-bold text-gray-900 shrink-0">₦{{ ((item.subtotal || item.price || 0) / (item.quantity || 1)).toLocaleString() }}</p>
                            
                            <!-- Compact Quantity Control -->
                            <div class="flex items-center bg-gray-50 border border-gray-200 rounded-full overflow-hidden shadow-sm">
                              <button @click="cart.updateItemQuantity(vendor._id, pack.id, iIndex, item.quantity - 1)" class="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
                                <Minus class="w-3 h-3" />
                              </button>
                              <span class="text-[13px] font-bold text-gray-900 w-6 text-center select-none">{{ item.quantity }}</span>
                              <button @click="cart.updateItemQuantity(vendor._id, pack.id, iIndex, item.quantity + 1)" class="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors">
                                <Plus class="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Pack Actions -->
                  <div v-if="isFoodVendor" class="px-5 pb-5 pt-3 bg-gray-50/30 flex items-center gap-3">
                    <button @click="cart.setActivePack(vendor._id, pack.id); showMobileCartDrawer = false" class="flex-1 py-2 bg-parentPrimary/10 text-parentPrimary rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-parentPrimary/20 transition-colors">
                      <Plus class="w-3.5 h-3.5" /> Add Item
                    </button>
                    <button @click="cart.duplicatePack(vendor._id, pack.id)" class="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
                      <Copy class="w-4 h-4" /> Duplicate
                    </button>
                  </div>
                </div>

                <!-- Global Cart Actions -->
                <div class="flex items-center gap-3 pt-2 mb-4 relative z-30">
                  <button @click="showMobileCartDrawer = false" class="flex-1 py-3.5 bg-gray-100 text-gray-900 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors active:scale-[0.98]">
                    <Plus class="w-4 h-4" /> Add More
                  </button>
                  <button @click="cart.clearCart(vendor._id)" class="flex-1 py-3.5 bg-red-50 text-red-500 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-red-100 transition-colors active:scale-[0.98]">
                    <Trash2 class="w-4 h-4" /> Clear Cart
                  </button>
                </div>
              </div>
              
              <!-- Leave Note -->
              <div class="border-y border-gray-100 bg-white relative z-30 mb-4">
                <button @click="openVendorNoteModal" class="w-full flex items-center justify-between px-5 py-5 hover:bg-gray-50 transition-colors">
                  <div class="flex items-center gap-4 text-left">
                    <FileText class="w-[22px] h-[22px] text-gray-900 stroke-[2]" />
                    <div>
                      <p class="text-[15px] font-bold text-gray-900 mb-0.5">Leave a note for the vendor</p>
                      <p class="text-[13px] font-medium text-gray-400 truncate max-w-[260px]">{{ cart.vendorNotes.value[vendor._id] || 'Any requests, special vendor instructions etc.' }}</p>
                    </div>
                  </div>
                  <ChevronRight class="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <!-- Fixed Bottom Bar -->
              <div class="p-5 bg-white space-y-4 sticky bottom-0 border-t border-gray-50 z-40 shadow-[0_-10px_20px_rgba(255,255,255,0.9)]">
                <div class="flex justify-between items-center px-1 mb-2">
                  <span class="text-[15px] font-medium text-gray-900">Subtotal</span>
                  <span class="text-lg font-bold text-gray-900 tracking-tight">₦{{ (cart.getVendorStats(vendor._id).subtotal + cart.getVendorStats(vendor._id).packagingFee).toLocaleString() }}</span>
                </div>
                <NuxtLink 
                  v-if="vendor.isOpen !== false || route.query.schedule === 'true'"
                  :to="canProceedToCheckout ? (isGroupOrderActiveForThisVendor ? `/cart?group=${activeCode}` : '/cart') : ''"
                  @click="!canProceedToCheckout ? $event.preventDefault() : null"
                  :class="!canProceedToCheckout ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#FF5C1A] active:scale-[0.98]'"
                  class="w-full h-14 bg-parentPrimary text-white rounded-[14px] font-bold text-base transition-colors flex items-center justify-center"
                >
                  {{ isGroupOrderActiveForThisVendor ? 'Finalize Order' : 'Continue to checkout' }}
                </NuxtLink>
              </div>
            </div>
            
            <div v-else class="flex-1 flex flex-col items-center justify-center p-5 text-center min-h-[50vh]">
              <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🛒</div>
              <p class="text-lg font-bold text-gray-900 mb-2">Your cart is empty</p>
              <p class="text-[15px] font-medium text-gray-400 mb-8 max-w-[220px]">Tap + on any item to start building your order.</p>
              <button @click="showMobileCartDrawer = false" class="px-5 h-12 bg-parentPrimary text-white rounded-[14px] font-bold text-[15px] hover:bg-parentPrimary/90 transition-all active:scale-[0.98]">
                Browse Menu
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ============================================ -->
    <!-- FLOATING CART BAR (Mobile)                   -->
    <!-- ============================================ -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="translate-y-full opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-full opacity-0"
    >
      <div 
        v-if="(cart.getVendorStats(vendor._id).itemCount > 0 || groupOrder) && !showMobileCartDrawer"
        class="fixed bottom-24 lg:bottom-6 left-0 right-0 z-[50] max-w-2xl mx-auto px-4"
        :class="{ 'lg:hidden': !isMiniMart }"
      >
        <button 
          @click="showMobileCartDrawer = true"
          class="w-full flex items-center justify-between bg-parentPrimary text-white rounded-2xl pl-5 pr-[72px] py-4 shadow-sm border border-gray-100 shadow-parentPrimary/30 active:scale-[0.97] transition-all"
        >
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white text-sm font-medium">
              {{ groupOrder ? totalGroupItems : cart.getVendorStats(vendor._id).itemCount }}
            </div>
            <div class="text-left">
              <div class="flex items-center gap-2">
                <p class="text-sm font-medium tracking-tight">View Cart</p>
                <span v-if="groupOrder" class="px-1.5 py-0.5 bg-white/20 rounded text-[9px] font-bold text-white whitespace-nowrap">
                  👥 Group Order
                </span>
              </div>
              <p v-if="isFoodVendor" class="text-[10px] font-bold text-white/70">{{ cart.getVendorStats(vendor._id).packs.length }} {{ cart.getVendorStats(vendor._id).packs.length > 1 ? packsTerm.toLowerCase() : packTerm.toLowerCase() }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-lg font-medium tracking-tighter">
              ₦{{ 
                groupOrder 
                  ? (groupOrder.participants?.reduce((sum, p) => sum + (p.total || 0), 0) || 0).toLocaleString() 
                  : (cart.getVendorStats(vendor._id).subtotal + cart.getVendorStats(vendor._id).packagingFee).toLocaleString() 
              }}
            </p>
          </div>
        </button>
      </div>
    </Transition>

    <!-- ============================================ -->
    <!-- STORE INFO MODAL                             -->
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
        <div v-if="showStoreInfo" class="fixed inset-0 z-[110] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/50 backdrop-blur-sm" @click.self="showStoreInfo = false">
          <div class="bg-white w-full md:max-w-lg rounded-t-[2rem] md:rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden animate-slide-up-mobile md:animate-zoom-in">
            <!-- Banner -->
            <div class="relative h-44">
              <video v-if="(vendor.banner || vendor.logo) && (vendor.banner || vendor.logo).match(/\\.(mp4|webm|ogg|mov)$/i)" :src="vendor.banner || vendor.logo" class="w-full h-full object-cover" autoplay loop muted playsinline></video>
              <img v-else :src="vendor.banner || vendor.logo || '/placeholder-store.jpg'" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
              <button @click="showStoreInfo = false" class="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all">
                <X class="w-5 h-5" />
              </button>
              <div class="absolute bottom-4 left-6 right-6">
                <h2 class="text-xl font-medium text-white tracking-tight">{{ toTitleCase(vendor.storeName) }}</h2>
                <p class="text-xs font-bold text-white/70 mt-1">{{ vendor.category || 'Restaurant' }}</p>
              </div>
            </div>
            <!-- Info -->
            <div class="p-4 md:p-5 space-y-6 max-h-[50vh] overflow-y-auto">
              <div>
                <h3 class="text-[10px] font-medium text-gray-400 tracking-widest mb-2">About</h3>
                <p class="text-sm text-gray-600 leading-relaxed font-medium">{{ vendor.description || 'No description available.' }}</p>
              </div>
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <div class="flex items-center gap-2 text-[10px] font-medium text-gray-400 tracking-widest mb-2">
                    <Clock class="w-3 h-3" /> Hours
                  </div>
                  <div class="space-y-0.5">
                    <p v-for="(hours, day) in vendor.availability" :key="day" class="text-xs font-bold text-gray-900">
                      <span class="text-gray-400 w-14 inline-block">{{ day }}:</span> {{ hours }}
                    </p>
                    <p v-if="!vendor.availability" class="text-xs font-bold text-gray-900">Open 24/7</p>
                  </div>
                </div>
                <div>
                  <div class="flex items-center gap-2 text-[10px] font-medium text-gray-400 tracking-widest mb-2">
                    <MapPin class="w-3 h-3" /> Location
                  </div>
                  <p class="text-xs font-bold text-gray-900 leading-relaxed">{{ vendor.address || 'University Main Campus' }}</p>
                </div>
              </div>
              <button @click="showStoreInfo = false" class="w-full py-3.5 bg-gray-900 text-white rounded-2xl font-medium text-xs hover:bg-parentPrimary transition-all shadow-sm border border-gray-100 active:scale-[0.98]">
                Got it
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ============================================ -->
    <!-- APPOINTMENT BOOKING MODAL                    -->
    <!-- ============================================ -->
    <AppointmentBookingModal 
      :isOpen="showBookingModal" 
      :service="selectedServiceToBook" 
      :vendorId="vendor._id"
      @close="showBookingModal = false"
      @booked="fetchAppointmentsOrSomething"
    />

    <!-- ============================================ -->
    <!-- GROUP ORDER NAMING MODAL                     -->
    <!-- ============================================ -->
    <UiModal :isOpen="showGroupNamingModal" @close="showGroupNamingModal = false" title="Start a Group Order">
      <div class="space-y-4">
        <p class="text-sm text-gray-500">Give your group order a name so friends know what they're joining.</p>
        <UiAnimatedInput v-model="groupName" label="Group Name"  />
        <button 
          @click="confirmStartGroupOrder"
          :disabled="!groupName.trim() || groupLoading"
          class="w-full py-4 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-sm border border-gray-100 hover:bg-parentPrimary hover:shadow-sm border border-gray-100 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Loader2 v-if="groupLoading" class="w-4 h-4 animate-spin" />
          <span v-else>Create Group Order</span>
        </button>
      </div>
    </UiModal>

    <!-- HOST INSTRUCTIONS MODAL -->
    <UiModal :isOpen="showHostInstructionsModal" @close="showHostInstructionsModal = false" title="Group Order Created! 🎉">
      <div class="space-y-6 text-center pt-2">
        <div class="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
          <Users class="w-8 h-8 text-emerald-500" />
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">You're the Host!</h3>
          <p class="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
            Your group order <span class="font-bold text-gray-900">"{{ groupOrder?.name }}"</span> is live. Share the invite link with your friends so they can add items to the cart. 
            <br><br>
            Once everyone is ready, you will pay for the combined order and checkout!
          </p>
        </div>
        <div class="p-4 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between gap-3">
          <div class="flex flex-col items-start truncate">
            <span class="text-[10px] font-bold text-gray-400 tracking-wider">Invite Code</span>
            <span class="text-sm font-bold text-gray-900 tracking-widest">{{ activeCode }}</span>
          </div>
          <button @click="copyInviteLink" class="px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-lg text-xs font-bold text-gray-700 hover:text-parentPrimary hover:border-parentPrimary transition-colors flex items-center gap-2 shrink-0">
            <Copy class="w-3.5 h-3.5" /> Copy Link
          </button>
        </div>
        <button 
          @click="showHostInstructionsModal = false"
          class="w-full py-4 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-sm border border-gray-100 hover:bg-parentPrimary hover:shadow-sm border border-gray-100 transition-all"
        >
          Start Adding Items
        </button>
      </div>
    </UiModal>

    <!-- GUEST INSTRUCTIONS MODAL -->
    <UiModal :isOpen="showGuestInstructionsModal" @close="showGuestInstructionsModal = false" title="You've Joined the Group! 🎊">
      <div class="space-y-6 text-center pt-2">
        <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto border border-blue-100">
          <ShoppingBag class="w-8 h-8 text-blue-500" />
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">Welcome to "{{ groupOrder?.name }}"</h3>
          <p class="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
            You are now shopping together with your friends at <span class="font-bold text-gray-900">{{ vendor?.storeName }}</span>.
            <br><br>
            Add the food you want to the cart. Your items will automatically sync with the host's cart, and the host will handle the final checkout!
          </p>
        </div>
        <button 
          @click="showGuestInstructionsModal = false"
          class="w-full py-4 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-sm border border-gray-100 hover:bg-parentPrimary hover:shadow-sm border border-gray-100 transition-all"
        >
          START SHOPPING
        </button>
      </div>
    </UiModal>

    <!-- ============================================ -->
    <!-- LEAVE CONFIRMATION MODAL                     -->
    <!-- ============================================ -->
    <UiModal :isOpen="showLeaveConfirmationModal" @close="!isLeaving && (showLeaveConfirmationModal = false)" title="Leave Group Order?">
      <div class="space-y-6 pt-2">
        <div class="text-center">
          <div class="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto border border-rose-100 mb-4">
            <LogOut class="w-8 h-8 text-rose-500" />
          </div>
          <h3 class="text-lg font-bold text-gray-900 mb-2">Are you sure?</h3>
          <p class="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">
            You are about to leave this group order. All your cart items will be removed from the host's cart. This action cannot be undone.
          </p>
        </div>
        <div class="flex gap-3 pt-2">
          <button 
            @click="showLeaveConfirmationModal = false"
            :disabled="isLeaving"
            class="flex-1 py-3.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            @click="confirmLeaveGroup"
            :disabled="isLeaving"
            class="flex-1 py-3.5 bg-rose-500 text-white rounded-xl text-sm font-bold shadow-sm border border-gray-100 hover:bg-rose-600 hover:shadow-sm border border-gray-100 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span v-if="isLeaving" class="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            {{ isLeaving ? 'Leaving...' : 'Leave Group' }}
          </button>
        </div>
      </div>
    </UiModal>

    <!-- ============================================ -->
    <!-- SHARE MODAL                                  -->
    <!-- ============================================ -->
    <ShareModal v-model:isOpen="isShareModalOpen" :vendor="vendor" />

    <!-- REVIEWS MODAL                                -->
    <VendorReviewsModal 
      :isOpen="showReviewsModal" 
      :vendor="vendor" 
      @close="showReviewsModal = false" 
      @review-added="fetchVendorDetails"
    />

    <GlobalCartModal :isOpen="showGlobalCartModal" @close="showGlobalCartModal = false" />

    <!-- ============================================ -->
    <!-- PRODUCT DETAIL MODAL                         -->
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
        <div v-if="selectedProduct" class="fixed inset-0 z-[110] flex flex-col md:items-center md:justify-center p-0 md:p-4 bg-black/50 backdrop-blur-sm" @click.self="selectedProduct = null; editingCartItem = null">
          <div class="bg-white flex-1 md:flex-initial md:rounded-[2rem] w-full md:max-w-sm overflow-y-auto shadow-sm border border-gray-100 animate-slide-up-mobile md:animate-zoom-in flex flex-col">
            <!-- Product Media Carousel -->
            <div class="h-56 md:h-64 relative group">
              <div 
                class="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                v-if="getMediaItems(selectedProduct).length > 1"
              >
                <div 
                  v-for="(media, idx) in getMediaItems(selectedProduct)" 
                  :key="'media-'+idx" 
                  class="w-full h-full flex-shrink-0 snap-center relative"
                  :class="media.type === 'video' ? 'bg-black flex items-center justify-center' : ''"
                >
                  <video v-if="media.type === 'video'" :src="media.url" class="w-full h-full object-cover" controls playsinline></video>
                  <img v-else :src="media.url" class="w-full h-full object-cover" />
                </div>
              </div>
              <div v-else class="w-full h-full relative flex items-center justify-center bg-black">
                <template v-if="getMediaItems(selectedProduct).length === 1">
                  <video v-if="getMediaItems(selectedProduct)[0].type === 'video'" :src="getMediaItems(selectedProduct)[0].url" class="w-full h-full object-cover" controls playsinline></video>
                  <img v-else :src="getMediaItems(selectedProduct)[0].url" class="w-full h-full object-cover" />
                </template>
                <img v-else :src="isFoodVendor ? '/placeholder-food.jpg' : '/placeholder-store.jpg'" class="w-full h-full object-cover" />
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
              <button @click="selectedProduct = null; editingCartItem = null" class="absolute top-4 right-4 w-9 h-9 bg-black/30 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-black/50 transition-all border border-white/10 shadow-sm border border-gray-100 z-10">
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Content -->
            <div class="p-4 space-y-5 pb-8">
              <!-- Chowdeck style header -->
              <div class="flex flex-col space-y-1 pb-4 border-b border-gray-100">
                <h2 class="text-xl font-bold text-gray-900">{{ selectedProduct.name }}</h2>
                <span class="text-xs text-gray-400 font-medium">{{ selectedProduct.category?.name || selectedProduct.category }}</span>
                <div class="mt-2">
                  <span class="text-sm font-bold text-gray-900">₦{{ (selectedProduct.discountPrice || selectedProduct.pricePerPortion || selectedProduct.bundlePrice || selectedProduct.price || 0).toLocaleString() }}</span>
                  <span v-if="selectedProduct.portionUnit || isFoodVendor" class="text-xs text-gray-900 font-bold ml-1">{{ selectedProduct.portionUnit ? `per ${selectedProduct.portionUnit}` : (selectedProduct.bundlePrice ? 'per pack' : 'per portion') }}</span>
                </div>
              </div>

              <p v-if="selectedProduct.description || defaultProductDescription" class="text-gray-500 font-medium text-sm leading-relaxed">
                {{ selectedProduct.description || defaultProductDescription }}
              </p>

              <!-- CUSTOMIZATIONS -->
              <div class="space-y-6 mt-4">
                <!-- Modifiers -->
                <div v-for="mod in selectedProduct.modifiers" :key="mod._id" class="space-y-3">
                  <div class="flex items-center justify-between">
                    <h4 class="text-sm font-bold text-gray-900">{{ mod.name }}</h4>
                    <span v-if="mod.isRequired" class="text-[10px] font-bold px-2 py-1 bg-amber-50 text-amber-600 rounded-md uppercase tracking-wider">Required</span>
                    <span v-else class="text-[10px] font-medium text-gray-500">Select 1</span>
                  </div>
                  
                  <div class="space-y-2">
                    <div 
                      v-for="item in mod.options" 
                      :key="item.name" 
                      @click="handleCustomizationChange(mod, item, true, true)"
                      class="flex items-center justify-between p-4 border rounded-xl transition-all cursor-pointer select-none"
                      :class="selectedCustomizations[mod._id]?.[item.name] ? 'border-parentPrimary bg-parentPrimary/5 shadow-sm ring-1 ring-parentPrimary/20' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'"
                    >
                      <div class="flex flex-col">
                        <span class="text-sm font-medium text-gray-700" :class="selectedCustomizations[mod._id]?.[item.name] ? 'text-gray-900 font-bold' : ''">{{ item.name }}</span>
                        <span v-if="formatModifierPrice(item, mod, selectedProduct)" class="text-xs mt-0.5" :class="selectedCustomizations[mod._id]?.[item.name] ? 'text-parentPrimary font-bold' : 'text-gray-500'">{{ formatModifierPrice(item, mod, selectedProduct) }}</span>
                      </div>
                      
                      <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0" :class="selectedCustomizations[mod._id]?.[item.name] ? 'border-parentPrimary' : 'border-gray-200'">
                        <div v-if="selectedCustomizations[mod._id]?.[item.name]" class="w-2.5 h-2.5 bg-parentPrimary rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Add Ons -->
                <div v-for="addon in selectedProduct.addOnGroupIds" :key="addon._id" class="space-y-3">
                  <div class="flex items-center justify-between">
                    <h4 class="text-sm font-bold text-gray-900">{{ addon.name }}</h4>
                    <span v-if="addon.selectionType === 'single'" class="text-[10px] font-medium text-gray-500">Select 1</span>
                    <span v-else-if="addon.minSelect > 0" class="text-[10px] font-bold px-2 py-1 bg-amber-50 text-amber-600 rounded-md uppercase tracking-wider">Required</span>
                    <span v-else-if="addon.maxSelect > 1" class="text-[10px] font-medium text-gray-500">Select up to {{ addon.maxSelect }}</span>
                  </div>
                  
                  <div class="space-y-2">
                    <div 
                      v-for="item in addon.options" 
                      :key="item.name" 
                      @click="addon.selectionType === 'single' ? handleCustomizationChange(addon, item, true, false) : (!selectedCustomizations[addon._id]?.[item.name] ? handleCustomizationChange(addon, item, true, false) : null)"
                      class="flex items-center justify-between p-4 border rounded-xl transition-all cursor-pointer select-none"
                      :class="selectedCustomizations[addon._id]?.[item.name] ? 'border-parentPrimary bg-parentPrimary/5 shadow-sm ring-1 ring-parentPrimary/20' : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'"
                    >
                      <div class="flex flex-col">
                        <span class="text-sm font-medium text-gray-700" :class="selectedCustomizations[addon._id]?.[item.name] ? 'text-gray-900 font-bold' : ''">{{ item.name }}</span>
                        <span v-if="formatModifierPrice(item, addon, selectedProduct)" class="text-xs mt-0.5" :class="selectedCustomizations[addon._id]?.[item.name] ? 'text-parentPrimary font-bold' : 'text-gray-500'">{{ formatModifierPrice(item, addon, selectedProduct) }}</span>
                      </div>
                      
                      <!-- Single Select Radio -->
                      <div v-if="addon.selectionType === 'single'" class="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0" :class="selectedCustomizations[addon._id]?.[item.name] ? 'border-parentPrimary' : 'border-gray-200'">
                        <div v-if="selectedCustomizations[addon._id]?.[item.name]" class="w-2.5 h-2.5 bg-parentPrimary rounded-full"></div>
                      </div>

                      <!-- Multi Select Controls -->
                      <div v-else class="flex items-center gap-3 shrink-0">
                        <button v-if="selectedCustomizations[addon._id]?.[item.name]" @click.stop="handleCustomizationChange(addon, item, false, false)" class="w-8 h-8 flex items-center justify-center rounded-full bg-white text-gray-600 shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors active:scale-95">
                          <Minus class="w-4 h-4" />
                        </button>
                        
                        <span v-if="selectedCustomizations[addon._id]?.[item.name]" class="text-sm font-bold w-5 text-center text-gray-900">
                          {{ selectedCustomizations[addon._id][item.name].quantity }}
                        </span>
                        
                        <button @click.stop="handleCustomizationChange(addon, item, true, false)" class="w-8 h-8 flex items-center justify-center rounded-full transition-colors active:scale-95 shadow-sm" :class="selectedCustomizations[addon._id]?.[item.name] ? 'bg-parentPrimary text-white shadow-parentPrimary/30' : 'bg-parentPrimary/10 text-parentPrimary hover:bg-parentPrimary hover:text-white'">
                          <Plus class="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Product Note / Special Instructions -->
              <div class="mt-6 border-t border-gray-100 pt-6">
                <h4 class="text-sm font-bold text-gray-900 mb-2">Special Instructions</h4>
                <textarea 
                  v-model="productNote" 
                  rows="2" 
                  class="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-base focus:outline-none focus:ring-1 focus:ring-parentPrimary focus:bg-white transition-all resize-none placeholder-gray-400"
                  :placeholder="isFoodVendor ? 'E.g. No onions, extra spicy...' : 'E.g. Specific color, custom message...'"
                ></textarea>
                <p class="text-xs text-gray-600 mt-1">Special requests are subject to the vendor's approval and may incur extra charges.</p>
              </div>

              <!-- Quantity & Add -->
              <div class="flex items-center justify-between pt-6 border-t border-gray-100 mt-6 sticky bottom-0 bg-white z-10 pb-2">
                <div>
                  <p class="text-[10px] font-medium text-gray-400 tracking-wider mb-1">Total Price</p>
                  <div>
                    <span v-if="selectedProduct.discountPrice && dynamicPrice === selectedProduct.discountPrice" class="text-sm text-gray-300 line-through">₦{{ selectedProduct.price.toLocaleString() }}</span>
                    <div class="flex items-baseline gap-1">
                      <span class="text-2xl font-medium text-gray-900 tracking-tighter">₦{{ dynamicPrice.toLocaleString() }}</span>
                      <span v-if="selectedProduct.portionUnit || isFoodVendor" class="text-xs text-gray-500 font-medium">{{ selectedProduct.portionUnit ? `per ${selectedProduct.portionUnit}` : 'per portion' }}</span>
                    </div>
                  </div>
                </div>
                
                <div v-if="isProductOutOfStock(selectedProduct)" class="flex items-center gap-3">
                  <span class="text-xs font-bold text-red-500 uppercase tracking-wider">Out of stock</span>
                  <button 
                    @click="notifyRestock(selectedProduct._id)"
                    class="h-12 px-5 bg-gray-100 hover:bg-amber-100 text-gray-700 hover:text-amber-700 rounded-xl font-bold transition-all flex items-center gap-2"
                  >
                    <Bell class="w-5 h-5" /> Notify Me
                  </button>
                </div>
                <button 
                  v-else
                  :disabled="!isProductModalValid"
                  @click="addToCart(selectedProduct)"
                  class="h-12 px-5 bg-gray-900 hover:bg-parentPrimary text-white rounded-xl font-bold transition-all shadow-sm border border-gray-100 active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus class="w-5 h-5" /> {{ editingCartItem ? 'Update Cart' : 'Add to cart' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
    <!-- ============================================ -->
    <!-- VENDOR NOTE MODAL                            -->
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
        <div v-if="showVendorNoteModal" class="fixed inset-0 z-[150] bg-black/50 backdrop-blur-sm flex flex-col items-center justify-end sm:justify-center sm:p-4" @click.self="showVendorNoteModal = false">
          <div 
            class="bg-white w-full h-full sm:h-auto sm:max-w-md rounded-none sm:rounded-[2rem] shadow-sm border border-gray-100 flex flex-col animate-slide-up-mobile sm:animate-zoom-in relative"
          >
            <!-- Close button floating -->
            <button @click="showVendorNoteModal = false" class="absolute top-4 right-4 w-10 h-10 bg-gray-50 hover:bg-gray-100 transition-colors rounded-full flex items-center justify-center text-gray-500 hover:text-gray-900 shadow-sm z-10 active:scale-95">
              <X class="w-5 h-5" />
            </button>
            
            <div class="p-4 md:p-5 pt-16 sm:pt-8 flex-1 flex flex-col">
              <h3 class="text-[22px] font-bold text-gray-900 text-center mb-6">Vendor Instruction</h3>
              
              <div class="space-y-4 flex-1 flex flex-col">
                <div class="flex-1 flex flex-col">
                  <p class="text-xs font-bold text-gray-900 mb-3">Instructions For Vendor</p>
                  <textarea 
                    v-model="tempVendorNote"
                    placeholder="Example: Please I want extra pepper"
                    class="w-full flex-1 bg-[#f9f9f9] border-none focus:ring-0 rounded-2xl px-5 py-4 text-[15px] font-medium text-gray-900 outline-none transition-all resize-none placeholder:text-gray-400"
                  ></textarea>
                </div>
                
                <div class="flex items-center gap-3 py-2">
                  <div class="relative flex items-center">
                    <input type="checkbox" id="saveForLater" class="w-5 h-5 border-2 border-gray-900 rounded-[4px] appearance-none checked:bg-gray-900 checked:border-gray-900 transition-colors peer cursor-pointer" />
                    <svg class="absolute w-3.5 h-3.5 text-white pointer-events-none left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <label for="saveForLater" class="text-[15px] font-medium text-gray-900 cursor-pointer select-none">Save for later</label>
                </div>
                
                <button 
                  @click="saveVendorNote"
                  class="w-full h-14 mt-4 bg-[#FF5C1A] text-white rounded-[14px] font-bold text-base hover:bg-[#004020] transition-colors flex items-center justify-center active:scale-[0.98]"
                >
                  Add instructions
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>

  <!-- Loading State -->
  <div v-else class="min-h-screen bg-white flex items-center justify-center">
    <div class="flex flex-col items-center gap-4">
      <div class="w-10 h-10 border-2 border-gray-100 border-t-parentPrimary rounded-full animate-spin"></div>
      <p class="text-xs font-bold text-gray-400">Loading store...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  Share2, Heart, ShoppingCart, ShoppingBag, ArrowLeft, ArrowRight, Clock, Star, MapPin, Search, Info, ChevronRight, ChevronDown, Users, Calendar, Copy, Trash2, X, Bike, Plus, Minus, Loader2, LogOut, Bell, FileText, RefreshCw, Lock
} from 'lucide-vue-next';
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

const openPackDropdowns = ref<Record<string, boolean>>({});

import { useRoute, useHead, navigateTo, useRouter } from '#imports';
import { useNow, onClickOutside } from '@vueuse/core';
import { useCart } from '@/composables/modules/cart';
import { useUser } from '@/composables/modules/auth/user';
import { useGroupOrder } from '@/composables/modules/group-order';
import { useFavorites } from '@/composables/modules/favorites';
import { vendors_api } from '@/api_factory/modules/vendors';
import { products_api } from '@/api_factory/modules/products';
import { menu_items_api } from '@/api_factory/modules/menu-items';
import { services_api } from '@/api_factory/modules/services';
import AnimatedInput from '@/components/ui/AnimatedInput.vue';
import ShareModal from "@/components/ui/ShareModal.vue";
import UiModal from '@/components/ui/UiModal.vue';
import MediaCarousel from '@/components/ui/MediaCarousel.vue';
import MediaLightbox from '@/components/ui/MediaLightbox.vue';
import AppointmentBookingModal from '@/components/vendors/AppointmentBookingModal.vue';
import VendorReviewsModal from '@/components/vendors/VendorReviewsModal.vue';
import GlobalCartModal from '@/components/GlobalCartModal.vue';

const isShareModalOpen = ref(false);
import { useToast } from '@/composables/useToast';

definePageMeta({
  layout: false
})

const route = useRoute();
const router = useRouter();
const cart = useCart();
const { itemCount: globalItemCount } = cart;
const { user } = useUser();
const { 
  groupOrder, activeCode, isLoading: groupLoading, createGroupOrder, 
  joinGroupOrder, fetchGroupOrder, syncWithCart, leaveGroupOrder,
  toggleReady, checkout, isHost, cleanupEventListeners, totalGroupItems
} = useGroupOrder();
const { showToast } = useToast();

const scrolled = ref(false);
const showMobileCartDrawer = ref(false);
const showGlobalCartModal = ref(false);
const props = defineProps<{ vendor: any }>();
const vendor = computed(() => props.vendor);

const isFoodVendor = computed(() => {
  const type = (vendor.value?.businessType || vendor.value?.storeType || '').toLowerCase();
  const category = (vendor.value?.category || '').toLowerCase();
  
  const foodCategories = ['restaurant', 'eatery', 'snacks', 'drinks', 'bakery', 'food'];
  return foodCategories.includes(category) || type === 'food' || type === 'restaurant';
});

const isMiniMart = computed(() => {
  const cat = (vendor.value?.category || '').toLowerCase();
  const type = (vendor.value?.vendorType || '').toLowerCase();
  return type === 'mini-mart' || 
         cat === 'mini-mart' || 
         cat === 'groceries' || 
         cat === 'provisions' ||
         cat.includes('mini-mart') ||
         cat.includes('minimart') ||
         vendor.value?.tags?.some((t: string) => ['mini-mart', 'groceries', 'provisions'].includes(t.toLowerCase()));
});

const packTerm = computed(() => isFoodVendor.value ? 'Pack' : 'Cart');
const packsTerm = computed(() => isFoodVendor.value ? 'Packs' : 'Carts');

const isGroupOrderActiveForThisVendor = computed(() => {
  if (!activeCode.value || !groupOrder.value || !vendor.value) return false;
  const vendorId = vendor.value._id;
  const goVendorId = groupOrder.value.vendor?._id || groupOrder.value.vendor;
  return vendorId === goVendorId;
});

const products = ref<any[]>([]);
const topPicks = ref<any[]>([]);
const packs = ref<any[]>([]);
const menuLoading = ref(true);
const expandedCategories = ref<Record<string, boolean>>({});
const showFullStore = ref(true);
const anythingElseNote = ref('');
const searchQuery = ref('');
const vendorServices = ref<any[]>([]);
const showBookingModal = ref(false);
const showReviewsModal = ref(false);
const isLightboxOpen = ref(false);
const lightboxMediaItems = ref<any[]>([]);
const lightboxInitialIndex = ref(0);

const getMediaItems = (product: any) => {
  const items = [];
  const isVideo = (url: string) => url && typeof url === 'string' && !!url.match(/\.(mp4|webm|ogg|mov)/i);
  
  if (product.videos && product.videos.length > 0) {
    items.push(...product.videos.map((url: string) => ({ type: 'video', url })));
  }
  if (product.images && product.images.length > 0) {
    items.push(...product.images.map((url: string) => ({ type: isVideo(url) ? 'video' : 'image', url })));
  } else if (product.imageUrl) {
    items.push({ type: isVideo(product.imageUrl) ? 'video' : 'image', url: product.imageUrl });
  } else if (product.image) {
    items.push({ type: isVideo(product.image) ? 'video' : 'image', url: product.image });
  } else if (product.components?.[0]?.itemId?.image) {
    items.push({ type: 'image', url: product.components[0].itemId.image });
  }

  // Fallback to vendor logo or banner for combos
  if (items.length === 0 && vendor.value) {
    if (vendor.value.logo) items.push({ type: isVideo(vendor.value.logo) ? 'video' : 'image', url: vendor.value.logo });
    else if (vendor.value.bannerUrl) items.push({ type: isVideo(vendor.value.bannerUrl) ? 'video' : 'image', url: vendor.value.bannerUrl });
  }
  
  return items;
};

const lowestProductPrice = computed(() => {
  if (!products.value || products.value.length === 0) return 0;
  return Math.min(...products.value.map((p: any) => p.discountPrice || p.price));
});

const openLightbox = (mediaItems: any[], index: number = 0) => {
  lightboxMediaItems.value = mediaItems;
  lightboxInitialIndex.value = index;
  isLightboxOpen.value = true;
};
const selectedServiceToBook = ref<any>(null);

const openBookingModal = (service: any) => {
  selectedServiceToBook.value = service;
  showBookingModal.value = true;
};
const categories = computed(() => Object.keys(groupedProducts.value));
const activeCategory = ref('');
const isFavorited = ref(false);

const showMenuCatDropdown = ref(false);
const menuCatDropdownRef = ref(null);
onClickOutside(menuCatDropdownRef, () => {
  showMenuCatDropdown.value = false;
});
const activeBatch = computed(() => {
  if (!vendor.value?.batchSchedule) return null;
  return vendor.value.batchSchedule.find((b: any) => b.isActive && new Date(b.deadline) > new Date());
});
const showStoreInfo = ref(false);
const showGroupNamingModal = ref(false);
const showHostInstructionsModal = ref(false);
const showGuestInstructionsModal = ref(false);
const showLeaveConfirmationModal = ref(false);
const showVendorNoteModal = ref(false);
const tempVendorNote = ref('');
const isLeaving = ref(false);
const groupName = ref('');
const selectedProduct = ref<any>(null);
const editingCartItem = ref<{ vendorId: string; packId: string; itemIndex: number; quantity: number } | null>(null);
const selectedCustomizations = ref<Record<string, Record<string, { price: number; quantity: number; name: string; groupName: string }>>>({});
const productNote = ref('');

const openProductModal = (product: any) => {
  selectedProduct.value = product;
  selectedCustomizations.value = {};
  productNote.value = '';
  
  // Pre-select defaults for required options
  if (product.modifiers && product.modifiers.length > 0) {
    product.modifiers.forEach((mod: any) => {
      if (mod.isRequired && mod.options && mod.options.length > 0) {
        handleCustomizationChange(mod, mod.options[0], true, true);
      }
    });
  }
  
  if (product.addOnGroupIds && product.addOnGroupIds.length > 0) {
    product.addOnGroupIds.forEach((addon: any) => {
      if (addon.minSelect > 0 && addon.options && addon.options.length > 0) {
        // Pre-select the minimum required amount
        for (let i = 0; i < Math.min(addon.minSelect, addon.options.length); i++) {
          handleCustomizationChange(addon, addon.options[i], true, false);
        }
      } else if (addon.selectionType === 'single' && addon.options && addon.options.length > 0) {
        // If it's a single selection add-on, it's often meant to be required, but 
        // we'll stick to explicitly required add-ons only based on minSelect.
      }
    });
  }
};

const handleListAdd = (product: any) => {
  const hasOptions = (product.modifiers && product.modifiers.length > 0) || 
                     (product.addOnGroupIds && product.addOnGroupIds.length > 0);
  
  if (hasOptions) {
    openProductModal(product);
  } else {
    quickAddToCart(product);
  }
};

const getBasePrice = (product: any) => {
  if (!product) return 0;
  return product.discountPrice || product.pricePerPortion || product.bundlePrice || product.price || 0;
};

const isAbsolutePricingGroup = (group: any, product: any) => {
  if (!group || !group.options || !product) return false;
  const base = getBasePrice(product);
  if (base === 0) return false;
  return group.options.some((opt: any) => opt.price === base);
};

const getModifierPriceDelta = (option: any, group: any, product: any) => {
  if (isAbsolutePricingGroup(group, product)) {
    return option.price - getBasePrice(product);
  }
  return option.priceDelta || option.price || 0;
};

const formatModifierPrice = (option: any, group: any, product: any) => {
  if (isAbsolutePricingGroup(group, product)) {
    return `₦${option.price.toLocaleString()}`;
  } else {
    const p = option.priceDelta || option.price || 0;
    return p > 0 ? `+₦${p.toLocaleString()}` : '';
  }
};

const handleCustomizationChange = (group: any, option: any, isAdd: boolean, isModifier: boolean = false) => {
  if (!selectedCustomizations.value[group._id]) {
    selectedCustomizations.value[group._id] = {};
  }
  
  const currentSelections = selectedCustomizations.value[group._id];
  const optionName = option.name;
  
  if (isAdd) {
    const totalInGroup = Object.values(currentSelections).reduce((sum: number, item: any) => sum + item.quantity, 0);
    const isSingleSelect = isModifier || group.selectionType === 'single';
    const maxSel = isSingleSelect ? 1 : (group.maxSelect || 99);
    
    if (totalInGroup >= maxSel) {
      if (isSingleSelect) {
        selectedCustomizations.value[group._id] = {};
        selectedCustomizations.value[group._id][optionName] = { price: getModifierPriceDelta(option, group, selectedProduct.value), quantity: 1, name: optionName, groupName: group.name };
        return;
      }
      showToast(`You can only select up to ${maxSel} for ${group.name}`, 'error');
      return;
    }
    
    if (!currentSelections[optionName]) {
      currentSelections[optionName] = { price: getModifierPriceDelta(option, group, selectedProduct.value), quantity: 1, name: optionName, groupName: group.name };
    } else {
      currentSelections[optionName].quantity += 1;
    }
  } else {
    if (currentSelections[optionName]) {
      currentSelections[optionName].quantity -= 1;
      if (currentSelections[optionName].quantity <= 0) {
        delete currentSelections[optionName];
      }
    }
  }
};

const dynamicPrice = computed(() => {
  if (!selectedProduct.value) return 0;
  let basePrice = selectedProduct.value.discountPrice || selectedProduct.value.pricePerPortion || selectedProduct.value.bundlePrice || selectedProduct.value.price || 0;
  let extras = 0;
  Object.values(selectedCustomizations.value).forEach(group => {
    Object.values(group).forEach((item: any) => {
      extras += item.price * item.quantity;
    });
  });
  return basePrice + extras;
});

const isProductModalValid = computed(() => {
  if (!selectedProduct.value) return false;
  
  // Check required modifiers
  const modifiers = selectedProduct.value.modifiers || [];
  for (const mod of modifiers) {
    if (mod.isRequired) {
      const selected = selectedCustomizations.value[mod._id] || {};
      const totalSelected = Object.values(selected).reduce((sum: number, i: any) => sum + i.quantity, 0);
      if (totalSelected < 1) return false;
    }
  }
  
  // Check required add-ons
  const addOns = selectedProduct.value.addOnGroupIds || [];
  for (const addOn of addOns) {
    if (addOn.minSelect > 0) {
      const selected = selectedCustomizations.value[addOn._id] || {};
      const totalSelected = Object.values(selected).reduce((sum: number, i: any) => sum + i.quantity, 0);
      if (totalSelected < addOn.minSelect) return false;
    }
  }
  
  return true;
});

const openVendorNoteModal = () => {
  tempVendorNote.value = cart.vendorNotes.value[props.vendor._id] || '';
  showVendorNoteModal.value = true;
};

const saveVendorNote = () => {
  cart.vendorNotes.value[props.vendor._id] = tempVendorNote.value;
  showVendorNoteModal.value = false;
};

const hasMultipleMedia = (product: any) => {
  if (!product) return false;
  const imageCount = product.images?.length || 1;
  const videoCount = product.videos?.length || 0;
  return (imageCount + videoCount) > 1;
};

const getAllMedia = (product: any) => {
  if (!product) return [];
  const imgs = product.images?.length ? product.images : [product.image || (isFoodVendor.value ? '/placeholder-food.jpg' : '/placeholder-store.jpg')];
  const vids = product.videos || [];
  return [...imgs, ...vids];
};

const getMyStatus = computed(() => {
  if (!groupOrder.value) return null;
  const userId = user.value?._id;
  const guestId = typeof window !== 'undefined' ? localStorage.getItem('errandr_guest_id') : null;
  return groupOrder.value.participants?.find((p: any) => {
    const pId = p.user?._id || p.user;
    return (userId && pId === userId) || (guestId && pId === guestId);
  });
});

const canCheckout = computed(() => {
  if (!groupOrder.value) return false;
  return groupOrder.value.participants?.some((p: any) => (p.items?.length || 0) > 0) || false;
});

const canProceedToCheckout = computed(() => {
  if (!vendor.value) return false;
  const stats = cart.getVendorStats(vendor.value._id);
  if (stats.itemCount === 0) return false;
  if (vendor.value.requiresTakeawayPack && vendor.value.packs && vendor.value.packs.length > 0) {
    return stats.packs.every((p: any) => p.packType && p.packType.name);
  }
  return true;
});

watch(() => vendor.value ? cart.getVendorStats(vendor.value._id)?.packs : null, (packs) => {
  if (vendor.value?.packs?.length > 0 && vendor.value.requiresTakeawayPack && packs) {
    packs.forEach((pack: any) => {
      if (!pack.packType || (!pack.packType.name && !pack.name)) {
        const defaultPack = vendor.value.packs[0];
        if (defaultPack) {
          cart.setPackType(vendor.value._id, pack.id, { name: defaultPack.name || 'Pack', price: defaultPack.price });
        }
      }
    });
  }
}, { deep: true, immediate: true });

const getVendorColor = (name: string) => {
  if (!name) return 'bg-gray-400';
  const colors = ['bg-indigo-600', 'bg-rose-500', 'bg-emerald-500', 'bg-orange-500', 'bg-parentPrimary', 'bg-red-600', 'bg-blue-600', 'bg-amber-600', 'bg-purple-600'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const now = useNow();

const formatCountdown = (endAt: Date | string) => {
  if (!endAt) return '';
  const end = new Date(endAt).getTime();
  const diff = end - now.value.getTime();
  if (diff <= 0) return 'Expired';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / 1000 / 60) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  
  if (days > 0) return `Ends in ${days}d ${hours}h`;
  if (hours > 0) return `Ends in ${hours}h ${mins}m`;
  return `Ends in ${mins}m ${secs}s`;
};

const activeBanners = computed(() => {
  if (!vendor.value?.banners) return [];
  return vendor.value.banners.filter((b: any) => {
    if (b.isActive === false) return false;
    const now = new Date();
    if (b.startAt && new Date(b.startAt) > now) return false;
    if (b.endAt && new Date(b.endAt) < now) return false;
    return true;
  });
});

const getInitials = (name: string) => {
  if (!name) return '??';
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
};

const getProductCount = (productId: string) => {
  if (!vendor.value) return 0;
  const vendorCart = cart.carts.value[vendor.value._id];
  if (!vendorCart) return 0;
  const activePack = vendorCart.packs.find(p => p.id === vendorCart.activePackId);
  if (!activePack) return 0;
  const item = activePack.items.find(i => i.productId === productId);
  return item?.quantity || 0;
};

const toTitleCase = (str: string) => {
  if (!str) return '';
  return str.split(' ').map(word => {
    if (!word) return '';
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  }).join(' ');
};

const groupedProducts = computed(() => {
  const groups: Record<string, any[]> = {};
  
  // Filter products by search query
  const filteredProducts = products.value.filter(p => {
    if (!searchQuery.value) return true;
    const query = searchQuery.value.toLowerCase();
    const nameMatch = (p.name || '').toLowerCase().includes(query);
    const descMatch = (p.description || '').toLowerCase().includes(query);
    return nameMatch || descMatch;
  });

  filteredProducts.forEach(p => {
    let cat = 'Other';
    
    // Explicitly check for isAddOn and use categoryId.name
    if (p.isAddOn) {
       cat = p.categoryId?.name || 'Add-ons';
    } else if (p.categoryId) {
       cat = typeof p.categoryId === 'object' ? (p.categoryId.name || 'Other') : 'Other';
    } else if (p.category) {
       cat = typeof p.category === 'object' ? (p.category.name || 'Other') : p.category;
    }
    
    // Capitalize category name for consistency
    cat = toTitleCase(cat);

    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(p);
  });
  return groups;
});

const removeFromCart = (product: any) => {
  if (!vendor.value) return;
  const vendorId = vendor.value._id;
  const vendorCart = cart.carts.value[vendorId];
  if (!vendorCart) return;
  const packId = vendorCart.activePackId;
  const pack = vendorCart.packs.find(p => p.id === packId);
  if (!pack) return;
  const itemIndex = pack.items.findIndex(i => i.productId === product._id);
  if (itemIndex > -1) {
    const item = pack.items[itemIndex];
    if (item.quantity > 1) {
      cart.updateItemQuantity(vendorId, packId, itemIndex, item.quantity - 1);
    } else {
      cart.removeItemFromPack(vendorId, packId, itemIndex);
    }
  }
  if (isGroupOrderActiveForThisVendor.value) {
    setTimeout(() => syncWithCart(vendorId), 100);
  }
};

const addToCart = (product: any) => {
  if (!isProductModalValid.value) {
    showToast('Please select all required options', 'error');
    return;
  }
  
  const customItems: any[] = [];
  Object.values(selectedCustomizations.value).forEach(group => {
    Object.values(group).forEach((item: any) => {
      for (let i = 0; i < item.quantity; i++) {
        customItems.push({ name: item.name, price: item.price, selected: item.groupName });
      }
    });
  });

  if (editingCartItem.value) {
    const { vendorId, packId, itemIndex, quantity } = editingCartItem.value;
    const vendorCart = cart.carts.value[vendorId];
    if (vendorCart) {
      const pack = vendorCart.packs.find(p => p.id === packId);
      if (pack && pack.items[itemIndex]) {
        pack.items[itemIndex].customizations = customItems;
        pack.items[itemIndex].note = productNote.value;
        const customTotal = customItems.reduce((s, c) => s + c.price, 0);
        pack.items[itemIndex].subtotal = (pack.items[itemIndex].price + customTotal) * pack.items[itemIndex].quantity;
        cart.saveToStorage();
        if (typeof (window as any).showToast === 'function') (window as any).showToast('Item updated', 'success');
      }
    }
    editingCartItem.value = null;
    selectedProduct.value = null;
    showMobileCartDrawer.value = true;
    return;
  }

  cart.addItem({
    productId: product._id,
    vendorId: vendor.value._id,
    name: product.name,
    price: product.discountPrice || product.pricePerPortion || product.bundlePrice || product.price || 0,
    image: getMediaItems(product)[0]?.url || product.image,
    quantity: 1,
    customizations: customItems,
    note: productNote.value,
    isPrepaidByPlatform: !!product.isPrepaidByPlatform,
    isPackagingFeeIncluded: !!product.isPackagingFeeIncluded
  });
  
  if (isGroupOrderActiveForThisVendor.value) {
    setTimeout(() => syncWithCart(vendor.value._id), 100);
  }
  
  selectedProduct.value = null;
};

const quickAddToCart = (product: any) => {
  if (!vendor.value) return;
  cart.addItem({
    productId: product._id,
    vendorId: vendor.value._id,
    name: product.name,
    price: product.discountPrice || product.pricePerPortion || product.bundlePrice || product.price || 0,
    image: getMediaItems(product)[0]?.url || product.image,
    quantity: 1,
    customizations: [],
    note: '',
    isPrepaidByPlatform: !!product.isPrepaidByPlatform,
    isPackagingFeeIncluded: !!product.isPackagingFeeIncluded
  });
  
  if (isGroupOrderActiveForThisVendor.value) {
    setTimeout(() => syncWithCart(vendor.value._id), 100);
  }
};

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

const editCartItem = (vendorId: string, packId: string, itemIndex: number, item: any) => {
  const originalProduct = products.value.find(p => p._id === item.productId);
  if (!originalProduct) return;
  
  editingCartItem.value = { vendorId, packId, itemIndex, quantity: item.quantity };
  
  selectedCustomizations.value = {};
  productNote.value = item.note || '';
  if (item.customizations && item.customizations.length > 0) {
    item.customizations.forEach((c: any) => {
      const groupName = c.selected;
      let matchedGroup = null;
      originalProduct.modifiers?.forEach((m: any) => { if (m.name === groupName) matchedGroup = m; });
      originalProduct.addOnGroupIds?.forEach((m: any) => { if (m.name === groupName) matchedGroup = m; });
      
      if (matchedGroup) {
        if (!selectedCustomizations.value[matchedGroup._id]) {
          selectedCustomizations.value[matchedGroup._id] = {};
        }
        if (!selectedCustomizations.value[matchedGroup._id][c.name]) {
          selectedCustomizations.value[matchedGroup._id][c.name] = { price: c.price, quantity: 1, name: c.name, groupName: groupName };
        } else {
          selectedCustomizations.value[matchedGroup._id][c.name].quantity += 1;
        }
      }
    });
  }
  
  selectedProduct.value = originalProduct;
  showMobileCartDrawer.value = false;
  // Trigger modal visibility via selectedProduct
};

const { toggleFavorite, fetchFavorites: checkFavs, isFavorited: checkIsFav } = useFavorites();

const toggleFavoriteVendor = async () => {
  if (!user.value) {
    showToast('Please log in to save favorites', 'error');
    return;
  }
  const success = await toggleFavorite({ vendorId: vendor.value._id });
  if (success) {
    isFavorited.value = !isFavorited.value;
    showToast(isFavorited.value ? 'Saved to favorites ❤️' : 'Removed from favorites', 'success');
  } else {
    showToast('Could not update favorites', 'error');
  }
};

const checkIfFavorited = async () => {
  if (!user.value) return;
  await checkFavs();
  isFavorited.value = checkIsFav(vendor.value?._id);
};

const handleBannerClick = (banner: any) => {
  const productsToProcess = banner.products && banner.products.length > 0 
    ? banner.products 
    : (banner.productId ? [banner.productId] : []);

  if (productsToProcess && productsToProcess.length > 0) {
    let addedCount = 0;
    productsToProcess.forEach((p: any) => {
      const productObj = typeof p === 'string' || (p && !p.name) 
        ? products.value.find(prod => prod._id === p || prod._id === p?.toString()) 
        : p;
        
      if (productObj) {
        addToCart(productObj);
        addedCount++;
      }
    });
    
    if (addedCount > 0) {
      showToast(`${addedCount} item${addedCount > 1 ? 's' : ''} from ${banner.title} added to cart!`, 'success');
      showMobileCartDrawer.value = true;
    } else {
      showToast(`${banner.title} — ${banner.description}`, 'success');
    }
  } else if (banner.link) {
    navigateTo(banner.link, { external: true });
  } else {
    showToast(`${banner.title} — ${banner.description}`, 'success');
  }
};

const addNewPack = (vendorId: string) => {
  cart.addPack(vendorId);
  showToast(`New ${packTerm.value.toLowerCase()} added`, 'success');
};

const duplicatePack = (vendorId: string, pack: any) => {
  cart.duplicatePack(vendorId, pack.id);
  showToast(`${packTerm.value} duplicated`, 'success');
};

const scrollToCategory = (cat: string) => {
  activeCategory.value = cat;
  if (!cat) {
    window.scrollTo({ top: 350, behavior: 'smooth' });
    return;
  }
  const element = document.getElementById(cat.toLowerCase().replace(/\s+/g, '-'));
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const handleStartGroupOrder = () => {
  if (isGroupOrderActiveForThisVendor.value) {
    if (isHost.value) {
      showHostInstructionsModal.value = true;
    } else {
      showGuestInstructionsModal.value = true;
    }
  } else {
    groupName.value = '';
    showGroupNamingModal.value = true;
  }
};

const confirmStartGroupOrder = async () => {
  if (!groupName.value.trim() || groupLoading.value) return;
  try {
    await createGroupOrder(vendor.value._id, groupName.value);
    showGroupNamingModal.value = false;
    showHostInstructionsModal.value = true;
    syncWithCart(vendor.value._id);
  } catch (e) {
    console.error('Failed to start group order', e);
    showToast('Failed to start group order', 'error');
  }
};

const copyInviteLink = () => {
  const link = `${window.location.origin}/vendors/${route.params.id}?group=${activeCode.value}`;
  navigator.clipboard.writeText(link);
  showToast('Invite link copied to clipboard!', 'success');
};

const confirmLeaveGroup = async () => {
  if (isLeaving.value) return;
  isLeaving.value = true;
  try {
    await leaveGroupOrder();
    showToast('You have successfully left the group order', 'success');
    showLeaveConfirmationModal.value = false;
  } catch (e: any) {
    showToast(e.response?.data?.message || 'Failed to leave the group order', 'error');
  } finally {
    isLeaving.value = false;
  }
};

const isProductOutOfStock = (product: any) => {
  return product.isAvailable === false || (product.trackStock && (product.stockQuantity || product.inStock || 0) <= 0) || product.publishItem === false;
};

const notifyRestock = async (productId: string) => {
  if (!user.value) {
    showToast('Please log in to receive restock notifications', 'error');
    return;
  }
  try {
    const res = await menu_items_api.notifyRestock(productId);
    showToast(res?.data?.message || 'We will notify you when this is restocked', 'success');
  } catch (err: any) {
    showToast(err?.response?.data?.message || 'Failed to set restock notification', 'error');
  }
};

const handleScroll = () => {
  scrolled.value = window.scrollY > 200;
  
  const sections = categories.value.map(cat => ({
    id: cat,
    el: document.getElementById(cat.toLowerCase().replace(/\s+/g, '-'))
  }));
  const scrollPosition = window.scrollY + 180;
  for (const section of sections) {
    if (section.el && section.el.offsetTop <= scrollPosition && (section.el.offsetTop + section.el.offsetHeight) > scrollPosition) {
      activeCategory.value = section.id;
      break;
    }
  }
};

onMounted(async () => {
  cart.initCart();
  menuLoading.value = true;
  try {
    const paramId = route.params.id as string;
    let productsRes, topPicksRes, packsRes;
    if (isFoodVendor.value) {
      productsRes = await menu_items_api.getByVendor(vendor.value._id);
      topPicksRes = await menu_items_api.getTopPicks(vendor.value._id);
      
      try {
        const addOnsRes = await menu_items_api.getAddOns(vendor.value._id);
        if (addOnsRes && addOnsRes.data && Array.isArray(addOnsRes.data)) {
          addOnsRes.data.forEach((group: any) => {
            if (group.options && Array.isArray(group.options)) {
              group.options.forEach((opt: any) => {
                if (!productsRes.data) productsRes.data = [];
                productsRes.data.push({
                  _id: opt._id,
                  name: opt.name,
                  price: opt.price,
                  categoryId: { name: group.name },
                  isAvailable: opt.isAvailable !== false,
                  image: '/placeholder-food.jpg',
                  description: `Add-on from ${group.name}`,
                  isAddOn: true
                });
              });
            }
          });
        }
      } catch (e) {
        console.error('Failed to fetch add-ons', e);
      }
      
      try {
        packsRes = await menu_items_api.getPacks(vendor.value._id);
      } catch (e) {
        console.error('Failed to fetch packs', e);
      }
      
    } else {
      productsRes = await products_api.getByVendor(vendor.value._id);
      topPicksRes = await products_api.getTopPicks(vendor.value._id);
      packsRes = await products_api.getPacks(vendor.value._id);
    }
    products.value = productsRes.data || [];
    topPicks.value = topPicksRes.data || [];
    packs.value = packsRes?.data || [];
    const uniqueCats = [...new Set(products.value.map((p: any) => {
      if (p.isAddOn) return p.categoryId?.name ? toTitleCase(p.categoryId.name) : 'Add-ons';
      const catObj = p.categoryId || p.category;
      let catName = 'Other';
      if (typeof catObj === 'object' && catObj !== null) {
        catName = catObj.name || 'Other';
      } else if (catObj) {
        catName = catObj;
      }
      return toTitleCase(catName);
    }).filter(Boolean))];
    // categories are now computed dynamically
    if (uniqueCats.length > 0) activeCategory.value = uniqueCats[0] as string;
    
    // Auto-open product or pack modal if query param is present (for landing page promos)
    if (route.query.packId) {
      const pId = route.query.packId as string;
      const foundPack = packs.value.find((p: any) => p._id === pId);
      if (foundPack) {
        setTimeout(() => openProductModal(foundPack), 300);
      }
    } else if (route.query.productId) {
      const pId = route.query.productId as string;
      const foundProd = products.value.find((p: any) => p._id === pId) || topPicks.value.find((p: any) => p._id === pId);
      if (foundProd) {
        setTimeout(() => openProductModal(foundProd), 300);
      }
    }
    window.addEventListener('scroll', handleScroll);
    checkIfFavorited();
    if (route.query.group) {
      handleJoinGroup(route.query.group as string);
    } else if (activeCode.value && !groupOrder.value) {
      try {
        await fetchGroupOrder(activeCode.value);
      } catch (e) {
        console.error('Failed to fetch active group order', e);
      }
    }

    // Clean up the URL visually if loaded via subdomain
    if (process.client && paramId) {
      const host = window.location.hostname;
      const parts = host.split('.');
      if (parts.length >= 3 && parts[0] === paramId) {
        window.history.replaceState(window.history.state, '', '/');
      }
    }
  } catch (e) {
    console.error('API Error in Detail page, using MOCK data', e);
    vendor.value = {
      _id: route.params.id,
      storeName: 'Mavise Restaurant (Demo)',
      rating: 4.8,
      totalRatings: 1250,
      about: 'Authentic flavors, delivered fast.',
      description: 'Mavise brings you the best of local and continental cuisine with a focus on freshness and speed.',
      availability: { Mon: '24/7', Tue: '24/7', Wed: '24/7', Thu: '24/7', Fri: '24/7', Sat: '24/7', Sun: '24/7' },
      logo: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=200&q=80',
      banner: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200',
      banners: [
        { title: 'Selling Hot Moi Moi', description: '5$ discount on sales', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200', isActive: true, products: ['p1', 'p2'], endAt: new Date(Date.now() + 1000 * 60 * 60 * 4) },
        { title: 'Student Night', description: 'Late night snacks for study sessions.', image: 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=1200', isActive: true, endAt: new Date(Date.now() + 1000 * 60 * 25) }
      ]
    };
    products.value = [
      { _id: 'p1', name: 'Jollof Rice Special', price: 2500, discountPrice: 2000, discountPercentage: 20, category: 'Main Dishes', image: 'https://images.unsplash.com/photo-1567051752256-66a8361e72a1?w=400' },
      { _id: 'p2', name: 'Chicken Suya', price: 1500, category: 'Snacks', image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400' },
      { _id: 'p3', name: 'Zobo Drink', price: 500, category: 'Beverages', image: 'https://images.unsplash.com/photo-1544380903-5339f408272a?w=400' }
    ];
    // categories are now computed dynamically
    activeCategory.value = 'Main Dishes';
  } finally {
    menuLoading.value = false;
  }
});

const handleJoinGroup = async (code: string) => {
  try {
    await joinGroupOrder(code);
    showGuestInstructionsModal.value = true;
    syncWithCart(vendor.value._id);
  } catch (e) {
    console.error('Failed to join group order', e);
    showToast('Failed to join group order. Invalid or expired code.', 'error');
  }
};

const handleCheckoutGroupOrder = async () => {
  if (!isHost.value || groupLoading.value) return;
  try {
    await checkout();
    showToast('Group order placed successfully!', 'success');
  } catch (e) {
    console.error('Checkout failed', e);
    showToast('Failed to checkout. Ensure payment is settled.', 'error');
  }
};

// shareStore has been replaced by the ShareModal

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  cleanupEventListeners();
});


</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }

.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-slide-up-mobile {
  animation: slideUpMobile 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes slideUpMobile {
  from { opacity: 0; transform: translateY(100%); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-zoom-in {
  animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes zoomIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}
</style>
