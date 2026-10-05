<template>
  <section class="py-12 bg-white overflow-hidden border-t border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-4 lg:px-5 mb-8">
      <div class="flex items-end justify-between">
        <div>
          <div class="inline-flex items-center gap-2 text-parentPrimary font-bold text-sm mb-2 text-center">
            <component :is="icon" class="w-4 h-4" /> {{ subtitle }}
          </div>
          <h2 class="text-3xl lg:text-4xl font-bold text-gray-900 -tight">{{ title }}</h2>
        </div>
        <div class="flex items-center gap-4">
          <NuxtLink to="/vendors" class="text-sm font-bold text-parentPrimary hover:underline underline-offset-4 hidden sm:block">View All Vendors &rarr;</NuxtLink>
          <div class="flex gap-2">
            <button @click="scrollCarousel('left')" class="w-10 h-10 rounded-full border border-gray-25 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-parentPrimary hover:border-parentPrimary transition-colors shadow-sm bg-white z-10">
              <ChevronLeft class="w-5 h-5" />
            </button>
            <button @click="scrollCarousel('right')" class="w-10 h-10 rounded-full border border-gray-25 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-parentPrimary hover:border-parentPrimary transition-colors shadow-sm bg-white z-10">
              <ChevronRight class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <NuxtLink to="/vendors" class="text-sm font-bold text-parentPrimary hover:underline underline-offset-4 sm:hidden mt-4 inline-block">View All Vendors &rarr;</NuxtLink>
    </div>

    <div class="max-w-7xl mx-auto pl-4 sm:pl-6 lg:pl-8 pr-4 sm:pr-0">
      <div :id="carouselId" class="flex overflow-x-auto gap-6 pb-8 hide-scrollbar snap-x snap-mandatory">
        
        <!-- Skeleton loaders -->
        <template v-if="loading">
          <div v-for="i in 4" :key="i" class="min-w-[280px] sm:min-w-[320px] h-[280px] bg-gray-50 rounded-3xl animate-pulse shadow-sm border border-gray-50 snap-start shrink-0" />
        </template>

        <!-- NO VENDORS (Only for all vendors block, else hide section?) We just show empty text -->
        <div v-else-if="vendors.length === 0" class="min-w-full px-5 py-10 flex items-center justify-center text-gray-400 font-medium">
          No vendors found for this section.
        </div>

        <template v-else>
          <div
            v-for="vendor in vendors"
            :key="vendor._id"
            @click="$emit('select-vendor', vendor)"
            class="min-w-[280px] sm:min-w-[320px] w-[280px] sm:w-[320px] snap-start shrink-0 group cursor-pointer relative flex flex-col bg-white rounded-3xl hover:-translate-y-1 transition-all duration-300"
          >
            <!-- TOP IMAGE AREA -->
            <div class="relative h-[200px] w-full overflow-hidden rounded-3xl border border-gray-50 shadow-sm">
              <!-- Closed State Overlay -->
              <template v-if="!vendor.isOpen">
                <video
                  v-if="(vendor.banner || vendor.image || vendor.logo) && (vendor.banner || vendor.image || vendor.logo).match(/\\.(mp4|webm|ogg|mov)$/i)"
                  :src="vendor.banner || vendor.image || vendor.logo"
                  class="w-full h-full object-cover grayscale opacity-50"
                  autoplay loop muted playsinline
                ></video>
                <img
                  v-else
                  :src="vendor.banner || vendor.image || vendor.logo || 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop'"
                  class="w-full h-full object-cover grayscale opacity-50"
                  alt="Vendor Banner"
                />
                <div class="absolute inset-0 bg-black/60 z-10 flex flex-col items-center justify-center">
                  <Lock class="w-10 h-10 text-white mb-2" />
                  <span class="text-white font-bold text-sm tracking-wide text-center leading-tight">STORE<br/>CLOSED</span>
                </div>
              </template>
              
              <!-- Open State -->
              <template v-else>
                <video
                  v-if="(vendor.banner || vendor.image || vendor.logo) && (vendor.banner || vendor.image || vendor.logo).match(/\\.(mp4|webm|ogg|mov)$/i)"
                  :src="vendor.banner || vendor.image || vendor.logo"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  autoplay loop muted playsinline
                ></video>
                <img
                  v-else
                  :src="vendor.banner || vendor.image || vendor.logo || 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop'"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  alt="Vendor Banner"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </template>

              <!-- TOP LEFT BADGES -->
              <div class="absolute top-3 left-3 flex flex-col gap-2">
                <span v-if="vendor.isFeatured" class="px-2.5 py-1 bg-white shadow-sm border border-gray-50 rounded-lg text-gray-900 text-[10px] font-extrabold tracking-wide uppercase">
                  Featured
                </span>
                <span v-else-if="vendor.businessType === 'service_provider'" class="px-2.5 py-1 bg-white shadow-sm border border-gray-50 rounded-lg text-purple-700 text-[10px] font-extrabold tracking-wide uppercase">
                  Service
                </span>
                <span v-else-if="vendor.businessType === 'hybrid'" class="px-2.5 py-1 bg-white shadow-sm border border-gray-50 rounded-lg text-indigo-700 text-[10px] font-extrabold tracking-wide uppercase">
                  Hybrid
                </span>
                <span v-if="vendor.preOrderOnly" class="px-2.5 py-1 bg-white shadow-sm border border-gray-50 rounded-lg text-rose-600 text-[10px] font-extrabold tracking-wide uppercase">
                  Pre-order
                </span>
              </div>

              <!-- HEART ICON (TOP RIGHT) -->
              <button
                @click.stop="handleToggleFavorite(vendor._id)"
                class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center text-gray-400 hover:text-rose-500 hover:bg-white transition-all hover:scale-110"
                :class="isVendorFavorited(vendor._id) ? 'text-rose-500' : ''"
              >
                <Heart :class="['w-4 h-4', isVendorFavorited(vendor._id) ? 'fill-current' : '']" />
              </button>
            </div>

            <!-- BOTTOM DETAILS AREA -->
            <div class="pt-3 pb-1 px-1 flex-1 flex flex-col">
              <div class="flex items-start justify-between gap-3 mb-1">
                <h3 class="text-[17px] font-bold text-gray-900 group-hover:text-parentPrimary transition-colors truncate">
                  {{ vendor.storeName }}
                </h3>
                <div class="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg shrink-0">
                  <Star class="w-3.5 h-3.5 text-amber-500 fill-current" />
                  <span class="text-[13px] font-bold text-gray-900">{{ vendor.rating ? vendor.rating.toFixed(1) : '5.0' }}</span>
                </div>
              </div>

              <!-- Address/Location -->
              <p class="text-[13px] text-gray-500 font-medium line-clamp-1 mb-2">
                {{ vendor.address || vendor.location?.address || 'Campus Location' }}
              </p>

              <!-- Category and Review Count -->
              <div class="flex items-center gap-2 text-[12px] font-medium text-gray-400 mt-auto flex-wrap">
                <span class="px-2 py-0.5 bg-gray-100 rounded-md text-gray-600 truncate max-w-[120px]">
                  {{ vendor.category || 'Vendor' }}
                </span>
                <span>•</span>
                <span>{{ vendor.totalRatings || 0 }} reviews</span>
                <template v-if="showStats && vendor.totalOrders">
                  <span>•</span>
                  <span class="text-parentPrimary font-bold flex items-center gap-1"><Flame class="w-3 h-3"/> {{ vendor.totalOrders }} orders</span>
                </template>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight, Store, Star, Clock, Bike, ArrowUpRight, Bell, Sparkles, TrendingUp, Flame, Share2, Heart, Lock } from 'lucide-vue-next'
import { useFavorites } from '@/composables/modules/favorites'

const { isVendorFavorited, toggleFavorite } = useFavorites()


const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  icon: { type: [Object, Function], required: true },
  vendors: { type: Array as () => any[], required: true },
  loading: { type: Boolean, default: false },
  carouselId: { type: String, required: true },
  showStats: { type: Boolean, default: false }
})

defineEmits(['select-vendor', 'notify', 'share-vendor'])

const scrollCarousel = (direction: 'left' | 'right') => {
  const container = document.getElementById(props.carouselId)
  if (container) {
    const scrollAmount = direction === 'left' ? -340 : 340
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
  }
}

const handleToggleFavorite = async (vendorId: string) => {
  await toggleFavorite({ vendorId })
}

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
