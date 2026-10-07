<template>
  <div class="min-h-screen bg-white text-[#14110F] font-sans pb-14">
    <!-- Hero Banner -->
    <div class="relative w-full h-[300px] md:h-[440px] overflow-hidden bg-[#14110F]">
      <video 
        v-if="vendor.coverVideo || vendor.video || (vendor.banner && vendor.banner.match(/\\.(mp4|webm|ogg|mov)$/i)) || (vendor.logo && vendor.logo.match(/\\.(mp4|webm|ogg|mov)$/i))"
        :src="vendor.coverVideo || vendor.video || vendor.banner || vendor.logo" 
        class="absolute inset-0 w-full h-full object-cover opacity-90"
        autoplay loop muted playsinline>
      </video>
      <img v-else-if="vendor.banner || vendor.logo" :src="vendor.banner || vendor.logo" class="absolute inset-0 w-full h-full object-cover opacity-90" />
      <div class="absolute inset-0 bg-[#0B0906] bg-opacity-20" v-else></div>
      <!-- Closed Padlock Overlay -->
      <div v-if="!vendor.isOpen && route.query.schedule !== 'true'" class="absolute inset-0 bg-black/60 z-10 flex flex-col items-center justify-center">
        <Lock class="w-12 h-12 text-white mb-2" />
        <span class="text-white font-bold text-base tracking-wide text-center">STORE<br/>CLOSED</span>
      </div>
      <div class="absolute inset-0 bg-gradient-to-t from-[#0B0906] via-[#0B0906]/45 to-[#0B0906]/5 z-[5]"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-[#0B0906]/50 via-transparent to-transparent z-[5]"></div>

      <!-- Floating Navigation -->
      <div class="absolute top-0 inset-x-0 z-30 px-4 md:px-5 py-4 flex items-center justify-between">
        <button @click="$router.back()" class="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors border border-white/15 active:scale-90">
          <ArrowLeft class="w-4.5 h-4.5 text-white" />
        </button>
        <div class="flex items-center gap-2.5">
          <button @click="showDetailsDrawer = true" title="Store details" aria-label="Store details" class="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors border border-white/15 active:scale-90">
            <Info class="w-4.5 h-4.5 text-white" />
          </button>
          <button @click="showShareModal = true" class="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors border border-white/15 active:scale-90">
            <Share2 class="w-4.5 h-4.5 text-white" />
          </button>
          <button @click="handleToggleFavorite" :disabled="togglingFavorite" class="w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all border border-white/15 active:scale-90" :class="isFavorited ? 'bg-rose-500 hover:bg-rose-600' : 'bg-white/10 hover:bg-white/20'">
            <Heart class="w-4.5 h-4.5 transition-all" :class="isFavorited ? 'text-white fill-white' : 'text-white'" />
          </button>
        </div>
      </div>

      <!-- Store Identity -->
      <div class="absolute bottom-0 inset-x-0 p-4 md:p-5 max-w-7xl mx-auto animate-hero-in z-20">
        <div class="flex items-center gap-2 mb-3">
          <span class="w-1.5 h-1.5 rounded-full" :class="vendor.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'"></span>
          <span class="text-[11px] font-bold uppercase tracking-[0.14em]" :class="vendor.isOnline ? 'text-emerald-300' : 'text-rose-300'">
            {{ vendor.isOnline ? 'Open now' : 'Closed' }}
          </span>
        </div>
        <h1 class="text-3xl md:text-5xl font-black text-white tracking-tight leading-none">{{ vendor.storeName }}</h1>
        <div class="flex flex-wrap items-center gap-2 mb-8">
          <button @click="showReviewsModal = true" class="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/15 transition-colors active:scale-95">
            <Star class="w-3.5 h-3.5 text-amber-400" :class="vendor.rating ? 'fill-amber-400' : 'fill-transparent'" />
            <template v-if="vendor.rating">
              <span class="font-bold text-sm text-white font-mono tabular-nums">{{ vendor.rating?.toFixed(1) }}</span>
              <span class="text-white/60 text-sm font-mono">({{ vendor.totalRatings || 0 }})</span>
            </template>
            <span v-else class="font-bold text-sm text-white">See reviews</span>
            <ChevronRight class="w-3 h-3 text-white/50" />
          </button>
          <div v-if="vendor.category" class="flex items-center gap-1.5 text-[11px] font-semibold text-white/85 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/15 capitalize">
            <Sparkles class="w-3.5 h-3.5 text-white/60" />
            {{ vendor.category.replace(/_/g, ' ') }}
          </div>
          <div v-if="vendor.address" class="flex items-center gap-1.5 text-[11px] font-semibold text-white/85 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/15">
            <MapPin class="w-3.5 h-3.5 text-white/60" />
            <span class="truncate max-w-[200px]">{{ vendor.address }}</span>
          </div>
          <div v-if="vendor.serviceLocation" class="flex items-center gap-1.5 text-[11px] font-semibold text-white/85 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/15 capitalize">
            <Navigation class="w-3.5 h-3.5 text-white/60" />
            {{ vendor.serviceLocation === 'mobile_operator' ? 'Comes to you' : vendor.serviceLocation.replace(/_/g, ' ') }}
          </div>
        </div>
      </div>
    </div>

    <main class="max-w-7xl mx-auto px-0 md:px-5 relative z-10">

      <!-- Identity strip: bridges hero and content, standard marketplace pattern -->
      <div class="flex items-end gap-4 -mt-10 md:-mt-12 mb-6 relative z-20 px-4 md:px-0">
        <div class="w-20 h-20 md:w-24 md:h-24 rounded-2xl ring-[5px] ring-white bg-white shadow-[0_4px_20px_rgba(20,17,15,0.12)] overflow-hidden shrink-0">
          <img v-if="vendor.logo" :src="vendor.logo" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center bg-parentPrimary/10 text-parentPrimary font-black text-2xl">{{ initials }}</div>
        </div>
        <!-- <div class="pb-1.5 min-w-0">
          <div class="flex items-center gap-1.5">
            <h2 class="text-base md:text-lg font-black text-[#14110F] truncate">{{ vendor.storeName }}</h2>
            <CheckCircle2 v-if="vendor.verified" class="w-4 h-4 text-blue-500 fill-blue-500/15 shrink-0" />
          </div>
          <p class="text-sm text-[#6B6558] font-semibold mt-0.5">On Errandr since {{ memberSince }}</p>
        </div> -->
      </div>

      <div class="flex flex-col lg:flex-row gap-6 lg:gap-8 relative">

        <!-- Left Content Column -->
        <div ref="aboutSectionRef" class="flex-1 min-w-0 space-y-8 bg-[#FDFBF8] rounded-none md:rounded-3xl px-4 py-4 md:p-5 border-y md:border border-[#ECE6DC]">

          <!-- About Section -->
          <section v-if="vendor.description">
            <div class="flex items-center gap-2 mb-3">
              <span class="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6B6558]">About us</span>
              <span class="h-px flex-1 bg-[#ECE6DC]"></span>
            </div>
            <p class="text-[#3A352E] leading-relaxed text-sm">
              {{ vendor.description }}
            </p>
          </section>

          <!-- Services Section -->
          <section>
            <div class="flex items-center gap-2 mb-4">
              <span class="text-[11px] font-bold uppercase tracking-[0.14em] text-[#6B6558]">Our services</span>
              <span class="h-px flex-1 bg-[#ECE6DC]"></span>
              <span v-if="vendorServices.length" class="text-[11px] font-mono font-bold text-[#6B6558]">{{ vendorServices.length }} total</span>
            </div>

            <template v-if="filteredServices.length > 0">
              <!-- Category Tabs (underline style) -->
              <div class="flex gap-6 overflow-x-auto pb-px scrollbar-hide border-b border-[#ECE6DC] mb-1">
                <button 
                  v-for="cat in categories" 
                  :key="cat"
                  @click="activeCategory = cat"
                  class="whitespace-nowrap pb-3 text-[13px] font-bold border-b-2 -mb-px transition-all"
                  :class="activeCategory === cat ? 'border-parentPrimary text-[#14110F]' : 'border-transparent text-[#9A9284] hover:text-[#3A352E]'"
                >
                  {{ cat }}
                </button>
              </div>

              <!-- Service List -->
              <div class="divide-y divide-[#ECE6DC]">
                <div 
                  v-for="service in filteredServices" 
                  :key="service._id"
                  class="group relative flex items-center justify-between gap-4 py-5 pl-4 -ml-4 pr-2 rounded-lg hover:bg-white transition-colors"
                >
                  <span class="absolute left-0 top-2 bottom-2 w-[3px] rounded-full bg-transparent group-hover:bg-parentPrimary transition-colors"></span>

                  <div class="min-w-0">
                    <h3 class="font-bold text-sm text-[#14110F] leading-snug">{{ service.name }}</h3>
                    <p class="text-sm font-medium text-[#9A9284] mt-1 flex items-center gap-1.5 font-mono">
                      <Clock class="w-3.5 h-3.5 text-[#B8AF9F]" />
                      {{ service.variants?.length ? `${service.durationInMinutes}\u2013${Math.max(...service.variants.map((v:any)=>v.durationInMinutes))} mins` : `${service.durationInMinutes} mins` }}
                    </p>
                    <p class="text-sm font-bold text-[#14110F] mt-2 font-mono tabular-nums">
                      <span v-if="service.variants?.length" class="font-sans font-semibold text-[#9A9284] text-sm mr-1">from</span>₦{{ service.price.toLocaleString() }}
                    </p>
                  </div>
                  <div class="flex items-center gap-2 shrink-0">
                    <button 
                      @click="messageVendor(service)"
                      class="px-4 py-2 rounded-full bg-white text-[#3A352E] font-bold text-sm transition-colors border border-[#E2DCD1] hover:border-[#14110F]"
                    >
                      Message
                    </button>
                    <button 
                      @click="openBookingFlow(service)"
                      class="px-4 py-2 rounded-full bg-[#14110F] text-white font-bold text-sm transition-all hover:bg-black active:scale-95"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>

              <!-- View All -->
              <div v-if="vendorServices.length > 5 && activeCategory === 'Featured'" class="mt-6 flex justify-center">
                <NuxtLink 
                  :to="`/vendors/${vendor._id}/services`"
                  class="inline-flex items-center gap-1.5 text-sm font-bold text-[#3A352E] hover:text-parentPrimary transition-colors"
                >
                  View all {{ vendorServices.length }} services
                  <ChevronRight class="w-4 h-4" />
                </NuxtLink>
              </div>
            </template>
            <div v-else class="text-[#9A9284] text-sm py-10 bg-white rounded-2xl text-center border border-dashed border-[#E2DCD1] flex flex-col items-center justify-center">
              <div class="w-12 h-12 bg-[#FDFBF8] rounded-full flex items-center justify-center mb-3 border border-[#ECE6DC]">
                <Sparkles class="w-5 h-5 text-parentPrimary" />
              </div>
              <p class="font-bold text-[#14110F] text-sm">No services yet</p>
              <p class="mt-1 text-sm">This vendor hasn't listed anything to book.</p>
            </div>
          </section>
        </div>

        <!-- Right Sidebar: Booking Pass -->
        <div class="hidden lg:block w-[320px] shrink-0">
          <div class="sticky top-8 bg-[#FDFBF8] border border-[#ECE6DC] rounded-3xl overflow-hidden">

            <div class="p-4 pb-5">
              <button 
                @click="openBookingFlow()"
                class="w-full py-3.5 bg-parentPrimary text-white rounded-xl font-bold text-sm hover:brightness-105 active:scale-[0.98] transition-all flex justify-center items-center gap-2"
              >
                Book Appointment
              </button>
            </div>

            <!-- Ticket perforation -->
            <div class="relative px-4">
              <div class="border-t border-dashed border-[#D8D0C2]"></div>
              <span class="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-white border border-[#ECE6DC]"></span>
              <span class="absolute -right-3 -top-3 w-6 h-6 rounded-full bg-white border border-[#ECE6DC]"></span>
            </div>

            <div class="p-4 space-y-5">
              <div class="flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                  <Clock class="w-4 h-4 text-emerald-500" />
                </div>
                <div class="w-full">
                  <h4 class="text-[10px] font-bold text-[#9A9284] uppercase tracking-wider mb-0.5">Availability</h4>
                  <p v-if="vendor.isOnline" class="text-sm font-bold text-emerald-600 mb-3">Currently open</p>
                  <p v-else class="text-sm font-bold text-rose-600 mb-3">Closed right now</p>

                  <div v-if="vendor.businessHours && vendor.businessHours.length > 0" class="mt-2 space-y-2 border-t border-[#ECE6DC] pt-3 pr-2">
                    <div v-for="day in vendor.businessHours" :key="day.day" class="flex flex-col gap-1 border-b border-[#ECE6DC]/50 pb-2 last:border-0 last:pb-0">
                      <div class="flex justify-between items-center text-sm">
                        <span class="text-[#3A352E] capitalize font-medium">{{ day.day.slice(0,3) }}</span>
                        <span v-if="day.isClosed" class="text-rose-500 font-bold">Closed</span>
                        <span v-else class="text-[#6B6558] font-mono tabular-nums">{{ day.open || '09:00' }} - {{ day.close || '17:00' }}</span>
                      </div>
                      <div v-if="!day.isClosed && day.breaks && day.breaks.length > 0" class="flex flex-col gap-1 pl-4 mt-1 border-l-2 border-orange-200">
                        <div v-for="(b, i) in day.breaks" :key="i" class="flex justify-between items-center text-[10px]">
                          <span class="text-orange-600/80  font-medium truncate max-w-[80px]">{{ b.title || 'Break' }}</span>
                          <span class="text-orange-500 font-mono font-medium opacity-80">{{ b.start }} - {{ b.end }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex items-start gap-3" v-if="vendor.address">
                <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                  <MapPin class="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <h4 class="text-[10px] font-bold text-[#9A9284] uppercase tracking-wider mb-0.5">Location</h4>
                  <p class="text-sm font-bold text-[#14110F] leading-relaxed">
                    {{ vendor.address }}
                  </p>
                </div>
              </div>

              <div class="flex items-start gap-3" v-if="vendor.serviceLocation">
                <div class="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                  <Navigation class="w-4 h-4 text-purple-500" />
                </div>
                <div>
                  <h4 class="text-[10px] font-bold text-[#9A9284] uppercase tracking-wider mb-0.5">Service type</h4>
                  <p class="text-sm font-bold text-[#14110F] capitalize">
                    {{ vendor.serviceLocation === 'mobile_operator' ? 'Mobile \u2013 comes to you' : vendor.serviceLocation.replace(/_/g, ' ') }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Ticket perforation -->
            <div class="relative px-4">
              <div class="border-t border-dashed border-[#D8D0C2]"></div>
              <span class="absolute -left-3 -top-3 w-6 h-6 rounded-full bg-white border border-[#ECE6DC]"></span>
              <span class="absolute -right-3 -top-3 w-6 h-6 rounded-full bg-white border border-[#ECE6DC]"></span>
            </div>

            <div class="p-4 pt-5">
              <p class="text-[10px] font-bold text-[#9A9284] uppercase tracking-wider mb-3">Share this vendor</p>
              <div class="flex items-center gap-2">
                <a :href="whatsappShareUrl" target="_blank" rel="noopener" class="w-9 h-9 rounded-full bg-[#25D366]/10 flex items-center justify-center hover:bg-[#25D366]/20 transition-colors" title="Share on WhatsApp">
                  <svg class="w-4 h-4 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492a.5.5 0 00.611.611l4.458-1.495A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-2.387 0-4.588-.826-6.32-2.207l-.44-.352-3.265 1.094 1.094-3.265-.352-.44A9.956 9.956 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/></svg>
                </a>
                <a :href="twitterShareUrl" target="_blank" rel="noopener" class="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center hover:bg-black/10 transition-colors" title="Share on X">
                  <svg class="w-4 h-4 text-[#14110F]" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a :href="facebookShareUrl" target="_blank" rel="noopener" class="w-9 h-9 rounded-full bg-[#1877F2]/10 flex items-center justify-center hover:bg-[#1877F2]/20 transition-colors" title="Share on Facebook">
                  <svg class="w-4 h-4 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <button @click="copyShareLink" class="w-9 h-9 rounded-full bg-[#F0EBE2] flex items-center justify-center hover:bg-[#E7E0D3] transition-colors" title="Copy Link">
                  <LinkIcon v-if="!linkCopied" class="w-4 h-4 text-[#6B6558]" />
                  <Check v-else class="w-4 h-4 text-emerald-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Mobile Sticky Book Button -->
    <div class="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-[#ECE6DC] lg:hidden z-40">
      <button 
        @click="openBookingFlow()"
        class="w-full py-3.5 bg-parentPrimary text-white rounded-xl font-bold text-sm active:scale-[0.98] transition-transform"
      >
        Book Appointment
      </button>
    </div>

    <!-- Booking Flow Full-Screen Overlay -->
    <BookingFlow 
      v-if="isBookingFlowOpen"
      :vendor="vendor"
      :services="vendorServices"
      :initialService="selectedServiceForBooking"
      @close="isBookingFlowOpen = false"
    />

    <!-- Reviews Modal -->
    <VendorReviewsModal 
      :isOpen="showReviewsModal" 
      :vendor="vendor" 
      @close="showReviewsModal = false" 
      @review-added="fetchVendorDetails"
    />

    <!-- Vendor Chat Sidebar Drawer -->
    <VendorChatDrawer
      :isOpen="isChatDrawerOpen"
      :vendorOwnerId="String(vendor.owner?._id || vendor.owner || '')"
      :vendorName="vendor.storeName || vendor.businessName || 'Vendor'"
      :vendorAvatar="vendor.profilePicture || vendor.logo || ''"
      :prefillMessage="chatPrefill"
      :serviceId="chatServiceId"
      :serviceName="chatServiceName"
      @close="isChatDrawerOpen = false"
    />
    
    <!-- Share Modal -->
    <ShareModal 
      :isOpen="showShareModal"
      @update:isOpen="showShareModal = $event"
      :vendor="vendor" 
    />
    
    <!-- Store Details Drawer (Mobile view for Info) -->
    <UiSideDrawer :isOpen="showDetailsDrawer" @close="showDetailsDrawer = false">
      <div class="p-2 space-y-6">
        <h2 class="text-xl font-bold text-[#14110F]">Store Details</h2>
        
        <div v-if="vendor.description">
          <h4 class="text-[10px] font-bold text-[#9A9284] uppercase tracking-wider mb-2">About us</h4>
          <p class="text-sm text-[#3A352E] leading-relaxed">{{ vendor.description }}</p>
        </div>

        <div class="flex items-start gap-3">
          <div class="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
            <Clock class="w-4 h-4 text-emerald-500" />
          </div>
          <div class="w-full">
            <h4 class="text-[10px] font-bold text-[#9A9284] uppercase tracking-wider mb-0.5">Availability</h4>
            <p v-if="vendor.isOnline" class="text-sm font-bold text-emerald-600 mb-3">Currently open</p>
            <p v-else class="text-sm font-bold text-rose-600 mb-3">Closed right now</p>
            
            <div v-if="vendor.businessHours && vendor.businessHours.length > 0" class="mt-2 space-y-2 border-t border-[#ECE6DC] pt-3">
              <div v-for="day in vendor.businessHours" :key="day.day" class="flex flex-col gap-1 border-b border-[#ECE6DC]/50 pb-2 last:border-0 last:pb-0">
                <div class="flex justify-between items-center text-sm">
                  <span class="text-[#3A352E] capitalize font-medium">{{ day.day.slice(0,3) }}</span>
                  <span v-if="day.isClosed" class="text-rose-500 font-bold">Closed</span>
                  <span v-else class="text-[#6B6558] font-mono tabular-nums">{{ day.open || '09:00' }} - {{ day.close || '17:00' }}</span>
                </div>
                <div v-if="!day.isClosed && day.breaks && day.breaks.length > 0" class="flex flex-col gap-1 pl-4 mt-1 border-l-2 border-orange-200">
                  <div v-for="(b, i) in day.breaks" :key="i" class="flex justify-between items-center text-[10px]">
                    <span class="text-orange-600/80  font-medium truncate max-w-[80px]">{{ b.title || 'Break' }}</span>
                    <span class="text-orange-500 font-mono font-medium opacity-80">{{ b.start }} - {{ b.end }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-start gap-3" v-if="vendor.address">
          <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
            <MapPin class="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h4 class="text-[10px] font-bold text-[#9A9284] uppercase tracking-wider mb-0.5">Location</h4>
            <p class="text-sm font-bold text-[#14110F] leading-relaxed">{{ vendor.address }}</p>
          </div>
        </div>

        <div class="flex items-start gap-3" v-if="vendor.serviceLocation">
          <div class="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
            <Navigation class="w-4 h-4 text-purple-500" />
          </div>
          <div>
            <h4 class="text-[10px] font-bold text-[#9A9284] uppercase tracking-wider mb-0.5">Service type</h4>
            <p class="text-sm font-bold text-[#14110F] capitalize">
              {{ vendor.serviceLocation === 'mobile_operator' ? 'Mobile \u2013 comes to you' : vendor.serviceLocation.replace(/_/g, ' ') }}
            </p>
          </div>
        </div>
        
        <div class="pt-6 border-t border-[#ECE6DC]">
          <p class="text-sm text-center text-[#9A9284] font-medium">Joined Errandr {{ memberSince }}</p>
        </div>
      </div>
    </UiSideDrawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ArrowLeft, Share2, Heart, Star, Clock, MapPin, Sparkles, Navigation, Link as LinkIcon, Check, ChevronRight, CheckCircle2, Info, Lock } from 'lucide-vue-next';
import { services_api } from '@/api_factory/modules/services';
import { vendors_api } from '@/api_factory/modules/vendors';
import { useFavorites } from '@/composables/modules/favorites';
import { useToast } from '@/composables/useToast';
import BookingFlow from '@/components/vendors/booking/BookingFlow.vue';
import VendorReviewsModal from '@/components/vendors/VendorReviewsModal.vue';
import VendorChatDrawer from '@/components/vendors/VendorChatDrawer.vue';
import ShareModal from '@/components/ui/ShareModal.vue';
import UiSideDrawer from '@/components/ui/SideDrawer.vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
  vendor: any;
  isHybrid?: boolean;
}>();

const { toggleFavorite, isVendorFavorited, fetchFavorites, favoriteVendorIds } = useFavorites();
const { showToast } = useToast();

const vendorServices = ref<any[]>([]);
const activeCategory = ref('Featured');
const isBookingFlowOpen = ref(false);
const showReviewsModal = ref(false);
const showShareModal = ref(false);
const showDetailsDrawer = ref(false);
const selectedServiceForBooking = ref<any>(null);
const togglingFavorite = ref(false);
const aboutSectionRef = ref<HTMLElement | null>(null);

const isFavorited = computed(() => isVendorFavorited(props.vendor._id));

const initials = computed(() => {
  const name = props.vendor?.storeName || '';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w: string) => w[0]?.toUpperCase())
    .join('') || 'S';
});

const memberSince = computed(() => {
  const raw = props.vendor?.createdAt;
  if (!raw) return 'day one';
  const d = new Date(raw);
  if (isNaN(d.getTime())) return 'day one';
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
});

const fetchVendorDetails = async () => {
  try {
    const res = await vendors_api.getVendorById(props.vendor._id);
    if (res.data) {
      Object.assign(props.vendor, res.data);
    }
  } catch (err) {
    console.error('Failed to fetch updated vendor details', err);
  }
};

const handleToggleFavorite = async () => {
  togglingFavorite.value = true;
  try {
    await toggleFavorite({ vendorId: props.vendor._id });
    if (isFavorited.value) {
      showToast('Added to favorites', 'success');
    } else {
      showToast('Removed from favorites', 'info');
    }
  } finally {
    togglingFavorite.value = false;
  }
};

const categories = computed(() => {
  const cats = ['Featured'];
  vendorServices.value.forEach(s => {
    if (s.category && !cats.includes(s.category)) cats.push(s.category);
  });
  return cats;
});

const filteredServices = computed(() => {
  if (activeCategory.value === 'Featured') return vendorServices.value.slice(0, 5);
  return vendorServices.value.filter(s => s.category === activeCategory.value);
});

const router = useRouter();

const isChatDrawerOpen = ref(false);
const chatPrefill = ref('');
const chatServiceId = ref('');
const chatServiceName = ref('');

const messageVendor = (service: any) => {
  chatPrefill.value = `Hi, I have a question about the service: ${service.name}.`;
  chatServiceId.value = service._id;
  chatServiceName.value = service.name;
  isChatDrawerOpen.value = true;
};

const openBookingFlow = (service: any = null) => {
  selectedServiceForBooking.value = service;
  isBookingFlowOpen.value = true;
};

onMounted(async () => {
  fetchFavorites();

  try {
    const res = await services_api.getVendorServices(props.vendor._id);
    vendorServices.value = res.data || [];
  } catch(e) {
    console.error('Failed to load services', e);
  }
});
</script>

<style scoped>
.animate-hero-in {
  animation: heroIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes heroIn {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>