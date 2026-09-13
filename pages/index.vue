<template>
  <div class="min-h-screen bg-white font-sans text-gray-900 scroll-smooth pb-24">
  <!-- <CoreExamPromoBanner /> -->
  <BatchDeliveryBanner />
  <MarketPoolBanner />
  <ActivePoolOrdersWidget />
 
 <!-- Birthday Banner -->
 <div v-if="isBirthday" class="bg-gradient-to-r from-[#FF5C1A] to-[#E54D12] text-white py-3 px-4 text-center shadow-sm border border-gray-100 relative z-[51]">
   <div class="max-w-7xl mx-auto flex items-center justify-center gap-2 animate-bounce">
     <span class="text-xl">🎂</span>
     <p class="text-sm md:text-base font-bold tracking-wide">
       Happy Birthday, {{ user?.firstName }}! Enjoy <span class="text-[#008950] bg-white px-2 py-0.5 rounded-md mx-1 shadow-sm">100% Free Delivery</span> and 10% off your orders today!
     </p>
     <span class="text-xl">🎉</span>
   </div>
 </div>

    <!-- Navbar -->
    <LandingNavbar />

    <!-- Search Overlay (Invisible, just for catching clicks to close) -->
    <Teleport to="body">
      <div 
        v-if="showSuggestions"
        class="fixed inset-0 bg-transparent z-[9998]"
        @click="showSuggestions = false"
      ></div>
    </Teleport>

    <!-- Hero Section -->
    <section 
      class="relative pt-44 pb-16 md:pt-40 lg:pt-48 lg:pb-24 overflow-visible bg-gradient-to-b from-slate-50/80 via-white to-white border-b border-slate-100"
    >
      <!-- Soft Minimalist Grid Dot Overlay -->
      <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-70 z-0 pointer-events-none"></div>

      <div class="max-w-7xl mx-auto sm:px-4  relative text-center" :class="showSuggestions ? 'z-[9999]' : 'z-10'">
        <div class="max-w-3xl mx-auto space-y-6">
          
          <!-- Badge -->
          <NuxtLink to="/vendors" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-parentPrimary/5 border border-parentPrimary/10 text-parentPrimary text-sm font-medium -[0.2em] hover:bg-parentPrimary/10 transition-colors">
            <Zap class="w-3.5 h-3.5 fill-current" /> Campus Services & Delivery, Redefined
          </NuxtLink>
          
          <!-- Rotating Hero Heading (Optimized Size) -->
          <div class="relative h-[120px] md:h-[180px] lg:h-[220px] overflow-hidden flex items-center justify-center">
            <TransitionGroup name="hero-slide" tag="div" class="w-full">
              <h1 
                :key="currentHeadingIndex"
                class="absolute inset-0 flex flex-col items-center justify-center text-3xl md:text-5xl lg:text-6xl font-extrabold -tighter leading-[1.1] text-gray-900 px-4 font-onest"
              >
                <div class="max-w-max mx-auto text-center" v-html="heroHeadings[currentHeadingIndex].text"></div>
                <!-- <div class="inline-flex items-center gap-2 mt-3 px-3 py-1 rounded-full bg-gray-50 border border-gray-100 shadow-sm transition-all duration-500">
                  <span class="w-1.5 h-1.5 rounded-full bg-parentPrimary animate-pulse"></span>
                  <span class="text-sm md:text-sm font-medium -[0.2em]  text-gray-400">
                    {{ heroHeadings[currentHeadingIndex].lang }}
                  </span>
                </div> -->
              </h1>
            </TransitionGroup>
          </div>

          <!-- Rotating Slang Subtitle -->
          <div class="h-8 overflow-hidden text-sm md:text-lg font-bold text-gray-400 -tight flex items-center justify-center">
             <span :key="currentSlangIndex" class="animate-vertical-marquee">{{ slangSlogans[currentSlangIndex] }}</span>
          </div>

          <!-- Search Bar -->
          <!-- Search Bar Redesign -->
          <div 
            class="mt-10 max-w-3xl mx-auto group relative transition-all duration-700 w-full px-4 sm:px-0"
            style="isolation: isolate;"
            :class="showSuggestions ? 'z-[200]' : 'z-20'"
          >
            <!-- Search Input Wrapper -->
            <div class="relative z-[70]">
              <!-- Main Search Input -->
            <div class="relative bg-white border border-gray-200 focus-within:border-parentPrimary/50 p-2 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] focus-within:shadow-[0_20px_50px_rgb(0,0,0,0.12)] transition-all duration-500 flex items-center group-hover:shadow-[0_12px_40px_rgb(0,0,0,0.08)]">
              <div class="absolute -inset-1 bg-parentPrimary opacity-0 group-focus-within:opacity-10 blur-xl transition-opacity duration-500 rounded-full"></div>
              <div class="w-12 h-12 flex items-center justify-center text-gray-500 shrink-0 ml-2 relative z-10">
                <Search class="w-5 h-5 text-gray-400 group-focus-within:text-parentPrimary transition-colors" />
              </div>
              <input 
                type="text" 
                v-model="heroSearchQuery"
                @keyup.enter="handleHeroSearch"
                @focus="showSuggestions = true"
                @blur="handleSearchBlur"
                placeholder="Search vendor name, meals, groceries..." 
                class="w-full bg-transparent border-none outline-none text-base md:text-lg font-medium text-gray-900 placeholder:text-gray-400 px-2 min-w-0 relative z-10"
              />
              <button 
                @click="handleHeroSearch"
                class="h-12 md:h-14 px-4 md:px-5 bg-gray-900 text-white rounded-full text-sm md:text-base font-semibold hover:bg-parentPrimary hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0 relative z-10 shadow-sm border border-gray-100"
              >
                <span>Search</span>
              </button>
            </div>

           <Transition name="fade-up">
  <div
    v-if="showSuggestions && (heroSearchSuggestions.length > 0 || isSearching || hasSearched || timeOfDaySuggestions.length > 0)"
    class="absolute top-full left-0 right-0 mt-4 bg-white border border-gray-200 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden z-[75] p-2"
  >
    <div class="px-4 py-4 border-b border-gray-50 flex justify-between items-center">
      <span class="text-sm font-medium text-gray-400 tracking-tight">
        {{ heroSearchQuery ? 'Matching Results' : `Suggested for ${suggestionTimeText}` }}
      </span>
      <div v-if="isSearching" class="w-4 h-4 border-2 border-parentPrimary border-t-transparent rounded-full animate-spin"></div>
    </div>

    <div class="max-h-[350px] overflow-y-auto hide-scrollbar space-y-1 mt-1">

      <!-- Search results -->
      <div
        v-for="product in heroSearchSuggestions"
        :key="product._id"
        @click="router.push(`/vendors/${product.itemType === 'vendor' ? product._id : (product.vendor._id || product.vendor)}`)"
        class="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl cursor-pointer transition-all group"
      >
        <div class="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden relative border border-gray-100 flex-shrink-0">
          <img v-if="product.image || product.imageUrl || product.logo" :src="product.image || product.imageUrl || product.logo" class="w-full h-full object-cover group-hover:scale-110 transition-transform" />
          <div v-else class="w-full h-full flex items-center justify-center bg-parentPrimary/10 text-parentPrimary">
            <Store class="w-5 h-5" />
          </div>
        </div>
        <div class="flex-1 text-left">
          <h4 class="text-sm font-medium text-gray-900 group-hover:text-parentPrimary transition-colors">{{ product.name || product.storeName }}</h4>
          <p class="text-sm font-bold text-gray-400">
            {{ product.itemType === 'vendor' ? (product.category?.name || product.category || 'Vendor') : (product.vendor?.storeName || 'Campus Vendor') }}
          </p>
        </div>
        <div class="text-right" v-if="product.price">
          <span class="text-sm font-medium text-gray-900">₦{{ product.price?.toLocaleString() }}</span>
        </div>
      </div>

      <div
        v-if="!isSearching && hasSearched && heroSearchSuggestions.length === 0"
        class="m-2"
      >
        <div class="flex items-center gap-4 px-5 py-5 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <!-- Empty State Icon -->
          <div class="relative flex-shrink-0 w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm text-gray-400">
            <SearchX class="w-5 h-5" />
          </div>

          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-gray-900 mb-0.5 truncate">
              No results for "{{ heroSearchQuery }}"
            </p>
            <p class="text-xs font-medium text-gray-500 leading-relaxed mb-3">
              We couldn't find what you were looking for. Try a different search!
            </p>
            <!-- Suggestion tags -->
            <div class="flex flex-wrap gap-1.5">
              <button
                v-for="tag in ['Rice & Stew', 'Sharwama', 'Pepper Soup', 'Amala', 'Fried Rice']"
                :key="tag"
                @click="heroSearchQuery = tag; fetchSuggestions()"
                class="px-3 py-1 text-[11px] font-bold bg-white border border-gray-100 rounded-full text-gray-500 hover:border-parentPrimary/30 hover:text-parentPrimary hover:bg-parentPrimary/5 transition-all active:scale-95"
              >
                {{ tag }}
              </button>
            </div>
          </div>
        </div>

        <!-- Time-of-day fallback suggestions -->
        <div v-if="timeOfDaySuggestions.length > 0" class="mt-3">
          <p class="px-4 pb-2 text-[11px] font-medium text-gray-300 tracking-widest uppercase">Popular for {{ suggestionTimeText }}</p>
          <div
            v-for="product in timeOfDaySuggestions.slice(0, 3)"
            :key="'tod-' + product._id"
            @click="router.push(`/vendors/${typeof product.vendor === 'string' ? product.vendor : product.vendor?._id}`)"
            class="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-all group"
          >
            <div class="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100 flex items-center justify-center">
              <img v-if="product.image" :src="product.image" class="w-full h-full object-cover" />
              <Store v-else class="w-4 h-4 text-parentPrimary/30" />
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="text-xs font-medium text-gray-900 truncate group-hover:text-parentPrimary transition-colors">{{ product.name }}</h4>
              <p class="text-[11px] font-bold text-gray-400">{{ product.vendor?.storeName || 'Campus Vendor' }}</p>
            </div>
            <span class="text-xs font-medium text-gray-900 flex-shrink-0">₦{{ product.price?.toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <!-- Time-of-day suggestions (when no query) -->
      <div v-if="!heroSearchQuery && timeOfDaySuggestions.length > 0">
        <div
          v-for="product in timeOfDaySuggestions"
          :key="'focus-' + product._id"
          @click="router.push(`/vendors/${typeof product.vendor === 'string' ? product.vendor : product.vendor?._id}`)"
          class="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl cursor-pointer transition-all group"
        >
          <div class="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden relative border border-gray-100 flex-shrink-0">
            <img v-if="product.image" :src="product.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform" />
            <div v-else class="w-full h-full flex items-center justify-center bg-parentPrimary/10 text-parentPrimary">
              <Store class="w-5 h-5" />
            </div>
          </div>
          <div class="flex-1 text-left">
            <h4 class="text-sm font-medium text-gray-900 group-hover:text-parentPrimary transition-colors">{{ product.name }}</h4>
            <p class="text-sm font-bold text-gray-400">{{ product.vendor?.storeName || 'Campus Vendor' }}</p>
          </div>
          <div class="text-right">
            <span class="text-sm font-medium text-gray-900">₦{{ product.price?.toLocaleString() }}</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</Transition>
            </div>

            <!-- Filters Row -->
            <div class="flex flex-wrap items-center justify-center gap-2 md:gap-3 mt-4 relative z-10">
              <!-- Category Pill -->
              <div class="relative" ref="categoryDropdownRef">
                <div 
                  @click="showCategoryDropdown = !showCategoryDropdown"
                  class="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-full px-4 py-2 shadow-sm flex items-center gap-2 hover:border-parentPrimary/50 hover:bg-white cursor-pointer transition-all h-10"
                >
                  <Filter class="w-4 h-4" :class="globalFilter ? 'text-parentPrimary' : 'text-gray-400'" />
                  <span class="text-xs md:text-sm font-medium" :class="globalFilter ? 'text-gray-900' : 'text-gray-600'">
                    {{ globalFilter ? globalFiltersList.find(f => f.keyword === globalFilter)?.label || globalFilter : 'Any category' }}
                  </span>
                  <ChevronDown class="w-3.5 h-3.5 text-gray-400 transition-transform ml-0.5" :class="{ 'rotate-180': showCategoryDropdown }" />
                </div>
                
                <!-- Category Dropdown -->
                <Transition name="fade-up">
                  <div v-if="showCategoryDropdown" class="absolute top-full left-0 sm:left-1/2 sm:-translate-x-1/2 mt-2 bg-white border border-gray-100 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] z-[80] overflow-hidden max-h-[300px] overflow-y-auto w-56">
                    <button 
                      @click="setFilter(''); showCategoryDropdown = false; showSuggestions = true"
                      class="w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-3"
                      :class="!globalFilter ? 'text-parentPrimary bg-parentPrimary/5' : 'text-gray-700'"
                    >
                      <span class="text-base leading-none">✨</span>
                      <span>Any category</span>
                    </button>
                    <button 
                      v-for="catFilter in globalFiltersList" 
                      :key="catFilter.keyword"
                      @click="setFilter(catFilter.keyword); showCategoryDropdown = false; showSuggestions = true"
                      class="w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-3"
                      :class="globalFilter === catFilter.keyword ? 'text-parentPrimary bg-parentPrimary/5' : 'text-gray-700'"
                    >
                      <span class="text-base leading-none">{{ catFilter.icon }}</span>
                      <span>{{ catFilter.label }}</span>
                    </button>
                  </div>
                </Transition>
              </div>

              <!-- Location Pill (Commented out as per request) -->
              <!--
              <div class="relative" ref="locationDropdownRef">
                <div class="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 shadow-sm flex items-center gap-2 hover:border-parentPrimary/50 hover:bg-white transition-all h-10 group/loc cursor-pointer" @click="showLocationDropdown = !showLocationDropdown">
                  <MapPin class="w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    v-model="searchLocation"
                    @keyup.enter="handleHeroSearch"
                    @focus="showLocationDropdown = true; showSuggestions = true"
                    @input="showLocationDropdown = true"
                    placeholder="Current location" 
                    class="bg-transparent border-none outline-none text-base md:text-sm font-medium text-gray-900 placeholder:text-gray-600 w-24 md:w-28 cursor-pointer group-hover/loc:placeholder:text-gray-900 transition-colors"
                  />
                  <ChevronDown class="w-3.5 h-3.5 text-gray-400 transition-transform ml-0.5" :class="{ 'rotate-180': showLocationDropdown }" />
                </div>
                
                <Transition name="fade-up">
                  <div v-if="showLocationDropdown" class="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-gray-100 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] z-[80] overflow-hidden py-2 w-56">
                    <div class="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Popular Locations</div>
                    <button 
                      @click="searchLocation = 'UNILAG'; showLocationDropdown = false; fetchSuggestions()"
                      class="w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors text-gray-700 flex items-center gap-3"
                    >
                      <MapPin class="w-4 h-4 text-gray-400" />
                      UNILAG
                    </button>
                    <button 
                      @click="searchLocation = 'YABATECH'; showLocationDropdown = false; fetchSuggestions()"
                      class="w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors text-gray-700 flex items-center gap-3"
                    >
                      <MapPin class="w-4 h-4 text-gray-400" />
                      YABATECH
                    </button>
                    <button 
                      @click="searchLocation = 'LUTH'; showLocationDropdown = false; fetchSuggestions()"
                      class="w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors text-gray-700 flex items-center gap-3"
                    >
                      <MapPin class="w-4 h-4 text-gray-400" />
                      LUTH
                    </button>
                  </div>
                </Transition>
              </div>
              -->

              <!-- Time Pill (Commented out as per request) -->
              <!--
              <div class="relative" ref="timeDropdownRef">
                <div 
                  @click="showTimeDropdown = !showTimeDropdown"
                  class="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 shadow-sm flex items-center gap-2 hover:border-parentPrimary/50 hover:bg-white cursor-pointer transition-all h-10"
                >
                  <Calendar class="w-4 h-4 text-gray-400" />
                  <span class="text-xs md:text-sm font-medium text-gray-600 whitespace-nowrap">
                    {{ searchTime === 'any' ? 'Any time' : searchTime === 'now' ? 'Now' : 'Scheduled' }}
                  </span>
                  <ChevronDown class="w-3.5 h-3.5 text-gray-400 transition-transform ml-0.5" :class="{ 'rotate-180': showTimeDropdown }" />
                </div>
                
                <Transition name="fade-up">
                  <div v-if="showTimeDropdown" class="absolute top-full right-0 sm:left-1/2 sm:-translate-x-1/2 mt-2 bg-white border border-gray-100 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] z-[80] overflow-hidden w-48">
                    <button 
                      @click="searchTime = 'any'; showTimeDropdown = false; showSuggestions = true"
                      class="w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
                      :class="searchTime === 'any' ? 'text-parentPrimary bg-parentPrimary/5' : 'text-gray-700'"
                    >
                      Any time
                    </button>
                    <button 
                      @click="searchTime = 'now'; showTimeDropdown = false; showSuggestions = true"
                      class="w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
                      :class="searchTime === 'now' ? 'text-parentPrimary bg-parentPrimary/5' : 'text-gray-700'"
                    >
                      Now
                    </button>
                    <button 
                      @click="searchTime = 'scheduled'; showTimeDropdown = false; showSuggestions = true"
                      class="w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors"
                      :class="searchTime === 'scheduled' ? 'text-parentPrimary bg-parentPrimary/5' : 'text-gray-700'"
                    >
                      Scheduled
                    </button>
                  </div>
                </Transition>
              </div>
              -->
            </div>


          </div>

          <!-- Removed Global Filters Bar (Moved to LandingNavbar.vue) -->
        </div>
      </div>
    </section>






  <!-- Promo Carousel -->
  <!-- <CorePromoCarousel @open-closed-modal="navigateToVendor" /> -->

  <!-- Book Again -->
  <VendorGroupCarousel
    v-if="user && bookAgainVendors.length > 0"
    title="Book again"
    subtitle="Past Bookings & Orders"
    :icon="Clock"
    :vendors="bookAgainVendors"
    carouselId="carousel-book-again"
    @select-vendor="navigateToVendor"
    @notify="handleNotifyVendor"
    @share-vendor="handleShareVendor"
  />

  <!-- The one most students use -->
  <VendorGroupCarousel
    title="Most Ordered"
    subtitle="Highest Order Volume"
    :icon="TrendingUp"
    :vendors="trendingVendors"
    :loading="loadingVendors"
    :showStats="true"
    carouselId="carousel-trending"
    @select-vendor="navigateToVendor"
    @notify="handleNotifyVendor"
    @share-vendor="handleShareVendor"
  />

  <!-- Favorites by You -->
  <VendorGroupCarousel
    v-if="user && favoriteVendors.length > 0"
    title="Favorites by You"
    subtitle="Your Saved Spots"
    :icon="Heart"
    :vendors="favoriteVendors"
    :loading="loadingFavorites"
    carouselId="carousel-favourites"
    @select-vendor="navigateToVendor"
    @notify="handleNotifyVendor"
    @share-vendor="handleShareVendor"
  />

  <!-- New to Erranders -->
  <VendorGroupCarousel
    title="New to Erranders"
    subtitle="Fresh Arrivals"
    :icon="Sparkles"
    :vendors="newVendors"
    :loading="loadingVendors"
    carouselId="carousel-new"
    @select-vendor="navigateToVendor"
    @notify="handleNotifyVendor"
    @share-vendor="handleShareVendor"
  />

 <!-- Vendor Closed Modal -->
 <VendorClosedModal 
 :isOpen="isClosedModalOpen" 
 :vendor="selectedVendorForModal" 
 @close="isClosedModalOpen = false" 
 @schedule="handleScheduleVendor"
 @notify="handleNotifyVendor"
 />

  <!-- Share Modal -->
  <UiShareModal 
    v-model:isOpen="isShareModalOpen" 
    :vendor="selectedVendorForShare" 
  />

  <!-- How it works (Redesigned & Condensed) -->
  <section id="how-it-works" class="py-20 bg-white overflow-hidden border-t border-slate-100">
    <div class="max-w-7xl mx-auto px-4 lg:px-10">
      <div class="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <p class="text-sm font-medium -[0.2em]  text-parentPrimary">How It Works</p>
        <h2 class="text-3xl md:text-5xl font-medium text-slate-900 -tighter leading-tight">
          Three steps to <span class="text-parentPrimary">satisfaction.</span>
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
        <div class="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-slate-100 -z-10"></div>
        <div v-for="(step, i) in [
          { title: 'Search & Select', desc: 'Find your favorite campus spot and browse their menu.', icon: '🔍', color: 'bg-emerald-50 text-emerald-600' },
          { title: 'Order & Pay', desc: 'Securely place your order with a few taps.', icon: '💳', color: 'bg-blue-50 text-blue-600' },
          { title: 'Receive', desc: 'Your Errander delivers directly to your hostel door.', icon: '📦', color: 'bg-parentPrimary/10 text-parentPrimary' }
        ]" :key="i" class="text-center space-y-4 bg-white rounded-[2rem] p-5 border border-slate-100 shadow-sm hover:-translate-y-1 transition-transform group">
          <div :class="`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-sm border border-slate-50 ${step.color} group-hover:scale-110 transition-transform`">
            {{ step.icon }}
          </div>
          <h3 class="text-xl font-medium text-slate-900 -tight">{{ i + 1 }}. {{ step.title }}</h3>
          <p class="text-sm text-slate-500 font-bold leading-relaxed">{{ step.desc }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Meal Autopilot Section -->
  <section class="py-20 bg-gradient-to-br from-orange-50/50 to-white overflow-hidden border-t border-slate-100 relative">
    <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-50 z-0 pointer-events-none"></div>
    <div class="max-w-7xl mx-auto px-4 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
      <!-- Left: Text -->
      <div class="space-y-6 max-w-xl">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-parentPrimary/10 border border-parentPrimary/20 text-parentPrimary text-sm font-bold shadow-sm">
          <Repeat class="w-4 h-4 animate-spin-slow" /> New Feature
        </div>
        <h2 class="text-3xl md:text-5xl font-medium text-slate-900 -tighter leading-tight">
          Meal <span class="text-parentPrimary">Autopilot.</span><br/> Set it & forget it.
        </h2>
        <p class="text-slate-500 text-lg font-medium leading-relaxed -tight">
          Tired of deciding what to eat every day? Schedule your weekly meals across different campus vendors. We'll automatically place the orders and deliver them to your hostel, right on schedule. 
        </p>
        <div class="pt-4 flex flex-col sm:flex-row gap-4">
          <NuxtLink to="/dashboard/recurring-orders" class="inline-flex items-center justify-center gap-2 px-5 py-4 bg-parentPrimary text-white rounded-2xl font-bold text-sm -wide hover:bg-orange-600 transition-colors shadow-sm shadow-parentPrimary/20 active:scale-95">
            Setup Meal Autopilot <ArrowRight class="w-4 h-4" />
          </NuxtLink>
        </div>
      </div>

      <!-- Right: Visual -->
      <div class="relative">
        <div class="absolute inset-0 bg-parentPrimary/5 rounded-3xl transform rotate-3 scale-105"></div>
        <div class="bg-white p-6 md:p-8 rounded-3xl border border-slate-100 shadow-xl relative z-10 space-y-4">
          <div class="flex items-center justify-between border-b border-gray-100 pb-4">
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Scheduled for</p>
              <p class="text-lg font-black text-gray-900">Tomorrow, 1:00 PM</p>
            </div>
            <div class="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
              <Check class="w-5 h-5" />
            </div>
          </div>
          <div class="flex items-center gap-4 py-2">
            <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">🍛</div>
            <div class="flex-1">
              <p class="font-bold text-gray-900">Jollof Rice & Chicken</p>
              <p class="text-sm font-medium text-gray-500">From Korede Spaghetti</p>
            </div>
          </div>
          <div class="flex items-center gap-4 py-2">
            <div class="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">🥤</div>
            <div class="flex-1">
              <p class="font-bold text-gray-900">Chilled Coke</p>
              <p class="text-sm font-medium text-gray-500">Added to order</p>
            </div>
          </div>
          <div class="pt-4 mt-2 border-t border-gray-100 flex items-center justify-between">
            <span class="text-sm font-bold text-gray-500 flex items-center gap-1">
              <Repeat class="w-3.5 h-3.5" /> Recurs every Tuesday
            </span>
            <span class="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">Active</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Custom Errands + Why Choose Us (Merged & Condensed) -->
  <section class="py-20 bg-slate-50 overflow-hidden border-t border-slate-100">
    <div class="max-w-7xl mx-auto px-4 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <!-- Left: Errands Pitch -->
      <div class="space-y-6 max-w-xl">
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-parentPrimary/10 border border-parentPrimary/20 text-parentPrimary text-sm font-bold shadow-sm">
          <Rocket class="w-4 h-4 animate-bounce" /> Now with Negotiable Fees!
        </div>
        <h2 class="text-3xl md:text-5xl font-medium text-slate-900 -tighter leading-tight">
          Set your price. <br/> <span class="text-parentPrimary">Get it done.</span>
        </h2>
        <p class="text-slate-500 text-lg font-medium leading-relaxed -tight">
          Don't just order food. Send an Errander to pick up your laundry, deliver documents to class, or buy groceries. Set the fee you want to pay, let riders accept, and chat with them instantly!
        </p>
        <div class="pt-4 flex flex-col sm:flex-row gap-4">
          <NuxtLink to="/errands/custom" class="inline-flex items-center justify-center gap-2 px-5 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm -wide hover:bg-parentPrimary transition-colors shadow-sm border border-gray-100 shadow-slate-900/10 active:scale-95">
            Request an Errand <ArrowRight class="w-4 h-4" />
          </NuxtLink>
        </div>
      </div>

      <!-- Right: Advantages Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="feat in [
          { title: 'Set Your Price', desc: 'You decide how much you want to pay the rider for the trip.', icon: 'CircleDollarSign', color: 'text-emerald-500 bg-emerald-50' },
          { title: 'Student Riders', desc: 'Dispatchers who know every corner of your campus.', icon: 'Target', color: 'text-parentPrimary bg-parentPrimary/10' },
          { title: 'Escrow Protected', desc: 'We hold the fee safely until a rider accepts your errand.', icon: 'ShieldCheck', color: 'text-blue-500 bg-blue-50' },
          { title: 'Real-time Chat', desc: 'Directly chat with your dispatcher to arrange details.', icon: 'MessageCircle', color: 'text-purple-500 bg-purple-50' }
        ]" :key="feat.title" class="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm hover:shadow-sm border border-gray-100 hover:-translate-y-1 transition-all group">
          <div :class="`w-10 h-10 mb-4 rounded-xl flex items-center justify-center ${feat.color}`">
            <component :is="feat.icon === 'CircleDollarSign' ? CircleDollarSign : feat.icon === 'Target' ? Target : feat.icon === 'ShieldCheck' ? ShieldCheck : MessageCircle" class="w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <h4 class="text-base font-medium text-slate-900 -tight mb-2">{{ feat.title }}</h4>
          <p class="text-sm text-slate-500 font-medium leading-relaxed">{{ feat.desc }}</p>
        </div>
      </div>
    </div>
  </section>  

  <!-- CTA Section — Light Theme -->
  <section class="relative py-20 overflow-hidden bg-gradient-to-b from-slate-50/80 via-white to-white border-t border-slate-100">
    <div class="absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-70 z-0 pointer-events-none"></div>
    <div class="max-w-3xl mx-auto px-4 lg:px-10 relative z-10 text-center space-y-6">
      <h2 class="text-4xl md:text-5xl font-medium text-slate-900 -tighter leading-tight">
        Ready to <span class="text-parentPrimary">chop?</span>
      </h2>
      <p class="text-lg text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">
        Join thousands of students who trust Errander for their daily meals and hostel runs. Zero stress, 100% vibes.
      </p>
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        <NuxtLink to="/auth/register" class="px-5 py-4 bg-parentPrimary text-white rounded-2xl font-medium text-sm  -wide shadow-sm border border-gray-100 shadow-parentPrimary/20 hover:scale-105 active:scale-95 transition-all">
          Join Errander Now
        </NuxtLink>
        <NuxtLink to="/auth/login" class="px-5 py-4 bg-white text-slate-600 rounded-2xl font-medium text-sm  -wide border border-slate-200 hover:border-parentPrimary hover:text-parentPrimary transition-all">
          Login
        </NuxtLink>
      </div>
    </div>
  </section>



  <!-- Footer -->
  <LandingFooter />
    <!-- NOTIFY MODAL -->
    <VendorNotifyModal
      :is-open="isNotifyModalOpen"
      :vendor="selectedVendorForNotify"
      @close="isNotifyModalOpen = false"
    />
 </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted, watch } from 'vue'
import VendorNotifyModal from '@/components/vendors/VendorNotifyModal.vue'
import { useRouter } from 'vue-router'
import { onClickOutside } from '@vueuse/core'
import { useNotifications } from '@/composables/modules/notifications/useNotifications'
import { useRealtimeNotifications } from '@/composables/core/useRealtimeNotifications'
import BatchDeliveryBanner from '@/components/BatchDeliveryBanner.vue'
import { useUser } from "@/composables/modules/auth/user"
import { 
  ArrowRight, Twitter, Instagram, Facebook,
  Utensils, Check,
  Clock, Star, Store, Bike, ChevronLeft, ChevronRight,
  ShieldCheck, Rocket, Megaphone,
  Menu as MenuIcon, X, Search, ArrowUpRight,
  Layers, Target, MessageCircle, Home, User, Bell, BellOff, LogOut, ChevronDown,
  Sparkles, TrendingUp, Flame, CircleDollarSign, SearchX, MapPin, Calendar, Heart, Filter, Zap, Repeat
} from 'lucide-vue-next'
import { vendors_api } from '@/api_factory/modules/vendors';
import { products_api } from '@/api_factory/modules/products';
import { search_api } from '@/api_factory/modules/search';
import { orders_api } from '@/api_factory/modules/orders';
import { useFavorites } from '@/composables/modules/favorites';
import { useRecentlyViewed } from '@/composables/modules/vendors/useRecentlyViewed';
import { useGlobalFilter } from '@/composables/core/useGlobalFilter';

import hero1 from '@/assets/img/hero1.webp'
import hero2 from '@/assets/img/hero2.webp'
import hero12 from '@/assets/img/hero12.webp'
import hero14 from '@/assets/img/hero14.webp'

definePageMeta({
 layout: false
})

useHead({
 title: 'Errander - Making Campus Life Easier, One Errand at a time',
 meta: [
{ name: 'description', content: 'Official Errander Student Portal. Order food, track deliveries, and manage your student campus services.' }
 ]
})

import { useCart } from '@/composables/modules/cart';

const scrolled = ref(false)
const router = useRouter()
const showMobileMenu = ref(false)

const { user, isLoggedIn, logOut } = useUser();

const isBirthday = computed(() => {
  if (!user.value || !user.value.dateOfBirth) return false;
  const today = new Date();
  const dob = new Date(user.value.dateOfBirth);
  return today.getMonth() === dob.getMonth() && today.getDate() === dob.getDate();
});

const heroSearchQuery = ref('')
const searchLocation = ref('')
const searchTime = ref('any')
const loadingVendors = ref(true)
const recommendedVendors = ref<any[]>([])
const trendingVendors = ref<any[]>([])
const newVendors = ref<any[]>([])
const topRatedVendors = ref<any[]>([])
const vendors = ref<any[]>([]) // Combined list for active promotions
const selectedVendorForModal = ref(null);
const isClosedModalOpen = ref(false);
const isShareModalOpen = ref(false);
const selectedVendorForShare = ref(null);
const cartStore = useCart()
const { unreadCount } = useNotifications()
const { favorites, fetchFavorites, loading: loadingFavorites } = useFavorites()
const { globalFilter, setFilter, globalFiltersList } = useGlobalFilter();

watch(globalFilter, () => {
  fetchVendors();
});

const { recentlyViewedVendors, addRecent } = useRecentlyViewed()
useRealtimeNotifications() // Listen for real-time updates

const bookAgainVendors = ref<any[]>([])

const favoriteVendors = computed(() => {
  const map = new Map()
  favorites.value.forEach((f: any) => {
    if (f.vendor && !map.has(f.vendor._id || f.vendor)) {
      map.set(f.vendor._id || f.vendor, f.vendor)
    }
  })
  return Array.from(map.values())
})

const fetchBookAgain = async () => {
  if (!user.value) return;
  try {
    const res = await orders_api.getOrders();
    const payload = res.data?.data || res.data;
    const orders = Array.isArray(payload) ? payload : (Array.isArray(payload?.orders) ? payload.orders : (Array.isArray(payload?.docs) ? payload.docs : []));
    
    if (Array.isArray(orders)) {
      const map = new Map();
      orders.forEach((o: any) => {
        if (o.vendor && !map.has(o.vendor._id || o.vendor)) {
          map.set(o.vendor._id || o.vendor, o.vendor);
        }
      });
      bookAgainVendors.value = Array.from(map.values()).slice(0, 10);
    }
  } catch (e) {
    console.error('Failed to fetch book again vendors:', e);
  }
}

const handleLogout = async () => {
  await logOut()
  window.location.reload()
}

// Search Suggestions
const heroSearchSuggestions = ref<any[]>([])
const timeOfDaySuggestions = ref<any[]>([])
const showSuggestions = ref(false)
const isSearching = ref(false)
const hasSearched = ref(false)

const showTimeDropdown = ref(false)
const timeDropdownRef = ref(null)

const showLocationDropdown = ref(false)
const locationDropdownRef = ref(null)

const showCategoryDropdown = ref(false)
const categoryDropdownRef = ref(null)

onClickOutside(timeDropdownRef, () => {
  showTimeDropdown.value = false
})

onClickOutside(locationDropdownRef, () => {
  showLocationDropdown.value = false
})

onClickOutside(categoryDropdownRef, () => {
  showCategoryDropdown.value = false
})



const suggestionTimeText = computed(() => {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Breakfast'
  if (hour >= 12 && hour < 17) return 'Lunch'
  if (hour >= 17 && hour < 22) return 'Dinner'
  return 'Late Night'
})

const fetchSuggestions = async () => {
  const hasQuery = heroSearchQuery.value.trim().length > 0;
  const hasLocation = searchLocation.value.trim().length > 0;
  const hasTimeFilter = searchTime.value !== 'any';

  if (!hasQuery && !hasLocation && !hasTimeFilter) {
    hasSearched.value = false
    // Fetch popular/recommended if empty
    try {
      const res = await products_api.getPopular()
      const data = res.data?.products || res.data?.data || []
      timeOfDaySuggestions.value = data
      heroSearchSuggestions.value = []
    } catch (e) {
      timeOfDaySuggestions.value = []
    }
    return
  }

  isSearching.value = true
  try {
    const res = await search_api.globalSearch({ 
      q: heroSearchQuery.value, 
      location: searchLocation.value, 
      time: searchTime.value 
    })
    
    // Combine vendors, products, menuItems, and services from the new search endpoint
    const searchData = res.data?.data || res.data || {}
    const combined = [
      ...(searchData.vendors || []).map((v: any) => ({ ...v, itemType: 'vendor' })),
      ...(searchData.menuItems || []).map((m: any) => ({ ...m, itemType: 'menuItem' })),
      ...(searchData.products || []).map((p: any) => ({ ...p, itemType: 'product' })),
      ...(searchData.services || []).map((s: any) => ({ ...s, itemType: 'service' }))
    ]
    
    // Limit to 6 items for the dropdown
    heroSearchSuggestions.value = combined.slice(0, 6)
  } catch (e) {
    heroSearchSuggestions.value = []
  } finally {
    isSearching.value = false
    hasSearched.value = true
  }
}

const handleSearchBlur = () => {
  setTimeout(() => {
    showSuggestions.value = false
  }, 200)
}

// Debounce search
let searchTimeout: any
watch([heroSearchQuery, searchLocation, searchTime], () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    fetchSuggestions()
  }, 300)
})

const navLinks = [
  { label: 'Featured', href: '#featured' },
  { label: 'Works', href: '#how-it-works' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' }
]

const handleHeroSearch = () => {
  if (!heroSearchQuery.value.trim() && !searchLocation.value.trim()) return
  
  let queryUrl = `/vendors?`
  if (heroSearchQuery.value.trim()) queryUrl += `search=${encodeURIComponent(heroSearchQuery.value.trim())}&`
  if (searchLocation.value.trim()) queryUrl += `location=${encodeURIComponent(searchLocation.value.trim())}&`
  if (searchTime.value !== 'any') queryUrl += `time=${encodeURIComponent(searchTime.value)}`
  
  if (queryUrl.endsWith('&') || queryUrl.endsWith('?')) {
    queryUrl = queryUrl.slice(0, -1)
  }
  
  navigateTo(queryUrl)
}

const handleScroll = () => {
 scrolled.value = window.scrollY > 50
}

const fetchVendors = async () => {
  loadingVendors.value = true
  try {
    const queryParams: any = { limit: 12 };
    if (globalFilter.value) {
      queryParams.search = globalFilter.value;
    }

    const [recRes, trendRes, newRes, topRes] = await Promise.all([
      vendors_api.getAll({ ...queryParams, sortBy: 'recommended' }),
      vendors_api.getAll({ ...queryParams, sortBy: 'trending' }),
      vendors_api.getAll({ ...queryParams, sortBy: 'newest' }),
      vendors_api.getAll({ ...queryParams, sortBy: 'rating' })
    ])
    
    recommendedVendors.value = recRes.data?.vendors || recRes.data?.data?.vendors || recRes.data || []
    trendingVendors.value = trendRes.data?.vendors || trendRes.data?.data?.vendors || trendRes.data || []
    newVendors.value = newRes.data?.vendors || newRes.data?.data?.vendors || newRes.data || []
    topRatedVendors.value = topRes.data?.vendors || topRes.data?.data?.vendors || topRes.data || []
    
    // Combine for promotions fallback
    vendors.value = [...recommendedVendors.value, ...trendingVendors.value, ...newVendors.value, ...topRatedVendors.value]
  } catch (e) {
    console.error('Failed to fetch vendors:', e)
  } finally {
    loadingVendors.value = false
  }
}

const isNotifyModalOpen = ref(false)
const selectedVendorForNotify = ref<any>(null)

const handleNotifyVendor = (vendor: any) => {
  isClosedModalOpen.value = false;
  selectedVendorForNotify.value = vendor
  isNotifyModalOpen.value = true
}

const activePromotions = computed(() => {
 const promos: any[] = []
 vendors.value.forEach(v => {
 if (v.banners && v.banners.length > 0) {
 v.banners.forEach((b: any) => {
 if (b.isActive) {
 promos.push({
 ...b,
 vendorName: v.storeName,
 vendorId: v._id,
 vendorAvatar: v.owner?.avatar
 })
 }
 })
 }
 })
 // Shuffle items for variety
 return promos.sort(() => Math.random() - 0.5)
})

const currentSlangIndex = ref(0)
const currentHeadingIndex = ref(0)

// const heroHeadings = [
//   { text: '<span class="text-parentPrimary ">Sapa</span> dey finish.<br/>Have you eaten?', lang: '🇳🇬 Pidgin' },
//   { text: 'Ebi ń pa mí.<br/><span class="text-parentPrimary ">Jẹun</span> ti tó!', lang: '🟢 Yoruba' },
//   { text: '<span class="text-parentPrimary ">Agụụ</span> na-agụ m.<br/>Kedu ihe ị ga-eri?', lang: '🔴 Igbo' },
//   { text: 'Yunwa ta kashe ni.<br/><span class="text-parentPrimary ">Abinci</span> ya zo!', lang: '🟡 Hausa' },
//   { text: 'Hair dey rough?<br/>Book a <span class="text-parentPrimary ">stylist</span> sharp!', lang: '🇳🇬 Pidgin' },
//   { text: 'Don\'t <span class="text-parentPrimary ">do over!</span><br/>Order sharp sharp.', lang: '🇳🇬 Pidgin' },
//   { text: 'Oúnjẹ campus...<br/><span class="text-parentPrimary ">zero stress</span> delivery.', lang: '🇳🇬 Pidgin' },
//   { text: 'Body go tell you<br/>if you <span class="text-parentPrimary ">no chop.</span>', lang: '🇳🇬 Pidgin' },
//   { text: 'Need groceries?<br/><span class="text-parentPrimary ">We deliver</span> to your hostel.', lang: '🇬🇧 English' },
//   { text: 'Ẹ̀wà mà jẹ́ <br/>kó <span class="text-parentPrimary ">dùn.</span> Chop now!', lang: '🟢 Yoruba' },
//   { text: 'Need a fresh <span class="text-parentPrimary ">haircut?</span><br/>Book a barber now.', lang: '🇬🇧 English' },
//   { text: 'Ciwon <span class="text-parentPrimary ">ciki</span> <br/>ba wasa bane.', lang: '🟡 Hausa' },
//   { text: 'Laundry piling up?<br/>Get a <span class="text-parentPrimary ">washer</span> sharp!', lang: '🇳🇬 Pidgin' },
// ]

// const slangSlogans = [
//   "Sapa is real, but hunger is realer. 💸",
//   "No leave, no transfer—just chop. 🍽️",
//   "Awoof dey run belle, but Errander dey save life. 🏃‍♂️",
//   "Body go tell you if you no chop. 💪",
//   "E choke! Best meals and services on campus. 🔥",
//   "Who no chop, no fit read. 📚",
//   "Fresh cut? Beautiful nails? Errander got you. 💅",
//   "Ẹ̀wà mà jẹ́ kó dùn. Errander got you. 🫡",
//   "Nwanne, order nri gị ugbu a! 🍛",
//   "Abinci mai kyau — cikin dakika! ⚡",
//   "Level up your food and lifestyle game. No capping. 🧢"
// ]

// ERRANDERS: UNILAG, YABATECH, CMUL - REAL LANDING PAGE CONTENT

const heroHeadings = [
  // THE VALUE PROP - ONE APP FOR EVERYTHING
  { text: 'Food. Laundry. Nail Tech.<br/>Everything you need on <span class="text-parentPrimary">campus.</span>', lang: '🇳🇬 Pidgin' },
  { text: 'Stop calling 10 vendors.<br/><span class="text-parentPrimary">One app solves</span> everything.', lang: '🇳🇬 Pidgin' },

  // SERVICES FOCUS (Nail Tech, Laundry, etc.)
  { text: 'Need a fresh fade or nails done?<br/>Book a <span class="text-parentPrimary">pro right to your hostel.</span>', lang: '🇬🇧 English' },
  { text: 'Dirty clothes piling up?<br/>Laundry pickup in <span class="text-parentPrimary">15 mins.</span>', lang: '🇬🇧 English' },
  { text: 'Nail tech, barbers, cleaners.<br/>Your campus <span class="text-parentPrimary">services on speed dial.</span>', lang: '🇬🇧 English' },

  // FEATURES (Meal Autopilot, Market Pool)
  { text: 'Tired of deciding what to eat?<br/>Set <span class="text-parentPrimary">Meal Autopilot</span> and forget it.', lang: '🇬🇧 English' },
  { text: 'Group orders save money.<br/>Use <span class="text-parentPrimary">Market Pool</span> to cut delivery fees.', lang: '🇬🇧 English' },
  { text: 'Schedule your meals for the week.<br/><span class="text-parentPrimary">Meal Autopilot</span> got you.', lang: '🇬🇧 English' },

  // LOCAL LANGUAGES / SLANG
  { text: 'Sapa hold you?<br/>₦500 chow waiting on <span class="text-parentPrimary">Erranders.</span>', lang: '🇳🇬 Pidgin' },
  { text: 'Ebi n pa e?<br/>Order real food on <span class="text-parentPrimary">Erranders now.</span>', lang: '🇳🇬 Yoruba' },
  { text: 'Agụụ na-agụ gị?<br/>Get your chow fast on <span class="text-parentPrimary">Erranders.</span>', lang: '🇳🇬 Igbo' },
  { text: 'Kuna jin yunwa?<br/>Your food is ready on <span class="text-parentPrimary">Erranders.</span>', lang: '🇳🇬 Hausa' },
  { text: 'Allowance drop?<br/>Time to chop life with <span class="text-parentPrimary">Erranders.</span>', lang: '🇳🇬 Pidgin' },
  
  // SPEED & CONVENIENCE
  { text: 'Your Errander is on the way.<br/>Check <span class="text-parentPrimary">real-time tracking</span> now.', lang: '🇬🇧 English' },
  { text: 'Ordering takes 60 seconds.<br/>Delivery in <span class="text-parentPrimary">30 mins max.</span>', lang: '🇬🇧 English' },

  // VENDOR VARIETY - THE MULTI-VENDOR ANGLE
  { text: 'Tired of suya guy today?<br/>Pick from <span class="text-parentPrimary">5 vendors right now.</span>', lang: '🇳🇬 Pidgin' },
  { text: 'Choose your meal guy.<br/>Change tomorrow. That\'s the <span class="text-parentPrimary">Erranders vibe.</span>', lang: '🇳🇬 Pidgin' },

  // HOSTEL LIFE - SPECIFIC PAIN POINTS
  { text: 'Hostel kitchen ban?<br/>Food comes to <span class="text-parentPrimary">your room discreet.</span>', lang: '🇳🇬 Pidgin' },
  { text: 'Warden watching.<br/>Erranders deliver so <span class="text-parentPrimary">smooth.</span> No drama.', lang: '🇳🇬 Pidgin' },
  { text: 'Roommate fighting over chop?<br/>Order from <span class="text-parentPrimary">5 vendors</span> at once!', lang: '🇳🇬 Pidgin' },

  // CUSTOM ERRANDS - UNIQUE VALUE
  { text: 'Need to send package home?<br/>Set the price, <span class="text-parentPrimary">rider accepts,</span> done.', lang: '🇬🇧 English' },
  { text: 'Pick up laundry from class?<br/>Send an <span class="text-parentPrimary">Errander</span> now. Done in 15.', lang: '🇬🇧 English' },

  // CAMPUS-SPECIFIC
  { text: '🎓 UNILAG to LEKKI express.<br/>Erranders your <span class="text-parentPrimary">campus plug.</span>', lang: '🇳🇬 Pidgin' },
  { text: '🏢 YabaTech campus?<br/><span class="text-parentPrimary">Erranders here too.</span> Full service.', lang: '🇳🇬 Pidgin' },
  { text: '📚 CMUL students?<br/><span class="text-parentPrimary">Your app is ready.</span> Everything covered.', lang: '🇳🇬 Pidgin' },

  // EXAM PERIOD / STRESS
  { text: '3AM final assignment?<br/>Food + coffee <span class="text-parentPrimary">incoming now.</span> You got this!', lang: '🇬🇧 English' },
]

const slangSlogans = [
  // PIDGIN / SLANG
  "Sapa hold you? ₦500 chow dey here. 🚀",
  "Nails need doing? Book a Nail Tech on Erranders now. 💅",
  "Dirty laundry? Schedule a pickup instantly. 🧺",
  "No capping. We deliver food, services & more. 💯",
  "Stop WhatsApp-ing 10 vendors. Use Erranders. 📱",
  "Group order? Use Market Pool to save delivery fees! 🤝",
  "Hostel kitchen ban? We dey your back. 🔐",
  "Roommate fighting over chop? Order 5 vendors at once. 🍽️",
  "Money drop? Chop life with proper chow. 🎉",
  "Awoof deals everywhere. Don't dull. 💸",
  
  // YORUBA
  "Ebi n pa e? Order now. 🏃‍♂️",
  "Sise logun ise. Food logun sapa. 🍲",
  "Set Meal Autopilot and relax! We feed you all week. 🤖",
  "O ti lo! Your order is on the way. ⚡",
  
  // IGBO
  "Agụụ na-agụ gị? Get chow fast. 🏃‍♂️",
  "Nri dị ụtọ. Fresh food delivery. 🍛",
  "Ngwa ngwa! 30 mins delivery. ⚡",
  
  // HAUSA
  "Kuna jin yunwa? Food is ready. 🏃‍♂️",
  "Abinci mai dadi. Sweet food inside. 🍛",
  "Maza maza! Fast delivery. ⚡",

  // WEB APP VIBE
  "Just login. Order. Chop. Repeat. 🔄",
  "From Meal Autopilot to Nail Techs, we got it all. ✨",
  "No space for apps? Our web app is super light. 🌐",
  "From browser to your door. Real quick. ⚡"
]



const floatingSlang = [
  "DON'T DO OVER", "SAPA NICE ONE", "NO CAPPING", "CHOP LIFE", "E CHOKE", "AWOOF"
]

const slangStyle = (i: number) => {
  const positions = [
    { top: '15%', left: '5%' },
    { top: '25%', right: '8%' },
    { bottom: '20%', left: '10%' },
    { bottom: '15%', right: '12%' },
    { top: '60%', left: '2%' },
    { top: '50%', right: '4%' }
  ]
  return positions[i]
}

const quickTags = [
  { label: 'Sapa Friendly', icon: '💸', desc: 'Meals under ₦1,500' },
  { label: 'Awoof Deals', icon: '🎁', desc: 'Buy 1 Get 1 Free' },
  { label: 'Fast Dispatch', icon: '⚡', desc: 'Delivery in < 15 mins' },
  { label: 'Late Night', icon: '🌙', desc: 'Open till 2AM' },
]

const heroVisuals = [hero1, hero14, hero12, hero2]

const startSlangRotation = () => {
  setInterval(() => {
    currentSlangIndex.value = (currentSlangIndex.value + 1) % slangSlogans.length
    currentHeadingIndex.value = (currentHeadingIndex.value + 1) % heroHeadings.length
  }, 4000)
}

const handlePromoClick = async (promo: any) => {
  // If promo has a link to a specific product (format: product:ID)
  if (promo.link && promo.link.startsWith('product:')) {
    const productId = promo.link.split(':')[1];
    try {
      const res = await products_api.getProduct(productId);
      const product = res.data?.data || res.data;
      if (product) {
        // Clear cart for "Special Direct Order"
        cartStore.clearCart();
        cartStore.addItem({
          productId: product._id,
          vendorId: promo.vendorId,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
          customizations: []
        });
        navigateTo('/cart');
        return;
      }
    } catch (e) {
      console.error('Failed to quick-buy product', e);
    }
  }
  
  // Default: Go to vendor
  const mockVendor = { _id: promo.vendorId, storeName: promo.vendorName, image: promo.image };
  addRecent(mockVendor);
  navigateTo(`/vendors/${promo.vendorId}`);
}

const handleScheduleVendor = (vendor: any) => {
  isClosedModalOpen.value = false;
  const vendorId = typeof vendor === 'string' ? vendor : vendor?._id || vendor?.id;
  if (!vendorId) return;
  navigateTo({ path: `/vendors/${vendorId}`, query: { schedule: 'true' } });
};

const navigateToVendor = (vendor: any) => {
  const vendorId = typeof vendor === 'string' ? vendor : vendor?._id || vendor?.id;
  if (!vendorId) return;

  if (typeof vendor === 'object' && vendor.isOpen === false && vendor.statusMessage !== 'open') {
    selectedVendorForModal.value = vendor;
    isClosedModalOpen.value = true;
    return;
  }
  
  if (typeof vendor === 'object') {
    addRecent(vendor);
  } else {
    addRecent({ _id: vendorId });
  }
  
  router.push(`/vendors/${vendorId}`);
};

const handleShareVendor = (vendor: any) => {
  selectedVendorForShare.value = vendor;
  isShareModalOpen.value = true;
};

onMounted(() => {
 window.addEventListener('scroll', handleScroll)
 fetchVendors()
 fetchSuggestions()
 startSlangRotation()
 if (user.value) {
   fetchFavorites()
   fetchBookAgain()
 }
})

onUnmounted(() => {
 window.removeEventListener('scroll', handleScroll)
})

const scrollCarousel = (direction: 'left' | 'right', id: string) => {
 const container = document.getElementById(id)
 if (container) {
 const scrollAmount = direction === 'left' ? -340 : 340
 container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
 }
}

// Data
const getVendorColor = (name: string) => {
 if (!name) return 'bg-gray-400';
 const colors = ['bg-parentPrimary', 'bg-accent', 'bg-secondary', 'bg-gray-900', 'bg-parentPrimary', 'bg-emerald-500', 'bg-rose-500', 'bg-blue-800', 'bg-indigo-900'];
 let hash = 0;
 for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
 return colors[Math.abs(hash) % colors.length];
};

const getInitials = (name: string) => {
 if (!name) return '??';
 return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
};

</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
 display: none;
}
.hide-scrollbar {
 -ms-overflow-style: none;
 scrollbar-width: none;
}
.animate-float {
 animation: float 6s ease-in-out infinite;
}
@keyframes float {
 0%, 100% { transform: translateY(0) rotate(0); }
 50% { transform: translateY(-20px) rotate(5deg); }
}
.animate-spin-slow {
 animation: spin 8s linear infinite;
}
@keyframes spin {
 from { transform: rotate(0deg); }
 to { transform: rotate(360deg); }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 1s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* New Modern Transitions */
.fade-up-enter-active, .fade-up-leave-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-up-enter-from { opacity: 0; transform: translateY(20px); }
.fade-up-leave-to { opacity: 0; transform: translateY(-20px); }

.scale-fade-enter-active, .scale-fade-leave-active {
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.scale-fade-enter-from { opacity: 0; transform: scale(0.95) rotate(-2deg); }
.scale-fade-leave-to { opacity: 0; transform: scale(1.05) rotate(2deg); }

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-slide-enter-from { opacity: 0; transform: translateX(100%); }
.fade-slide-leave-to { opacity: 0; transform: translateX(100%); }

.animate-pulse-slow {
  animation: pulse-slow 8s ease-in-out infinite;
}
@keyframes pulse-slow {
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(1.1); }
}

.animate-vertical-marquee {
  display: block;
  animation: vertical-marquee 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes vertical-marquee {
  0% { transform: translateY(100%); opacity: 0; }
  10%, 90% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(-100%); opacity: 0; }
}

.animate-draw {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: draw 1.5s ease-out forwards 1s;
}

@keyframes draw {
  to { stroke-dashoffset: 0; }
}

.animate-float-various {
  animation: float-various 10s ease-in-out infinite alternate;
}

@keyframes float-various {
  0% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(20px, -10px) rotate(2deg); }
  66% { transform: translate(-10px, 20px) rotate(-2deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

.animate-fade-in-up {
  animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
/* Hero Heading Rotation */
.hero-slide-enter-active,
.hero-slide-leave-active {
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.hero-slide-enter-from {
  opacity: 0;
  transform: translateY(40px);
}
.hero-slide-leave-to {
  opacity: 0;
  transform: translateY(-40px);
}

@keyframes wiggle {
  0%, 100% { transform: rotate(0deg); }
  20% { transform: rotate(-8deg); }
  40% { transform: rotate(8deg); }
  60% { transform: rotate(-4deg); }
  80% { transform: rotate(4deg); }
}

@keyframes moonPulse {
  0%, 100% { transform: scale(1); box-shadow: 0 0 0 8px rgba(30,30,46,0.08); }
  50% { transform: scale(1.04); box-shadow: 0 0 0 16px rgba(30,30,46,0.04); }
}

</style>
