<template>
  <div class="min-h-screen bg-white">
    <CoreAppNavbar />

    <div class="max-w-[1400px] mx-auto px-4 md:px-4 pt-6 pb-32 animate-fade-in">
      
      <!-- Top Header Row -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 class="text-2xl md:text-3xl font-medium text-gray-900 tracking-tight leading-none">
            {{ filteredVendors.length }} Campus Stores
          </h2>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Available in your campus area
          </p>
        </div>
        
        <!-- Search & Filter buttons -->
        <div class="flex flex-wrap items-center gap-3">
          <div class="relative group z-20 w-full md:w-64">
            <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-parentPrimary transition-colors" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search stores, food..."
              class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-50 rounded-xl text-base font-bold text-gray-900 focus:bg-white focus:border-parentPrimary transition-all outline-none shadow-sm placeholder:text-gray-400"
            />
          </div>

          <!-- Category Dropdown -->
          <div class="relative z-30" ref="categoryDropdownRef">
            <button 
              @click="showCategoryDropdown = !showCategoryDropdown"
              class="flex items-center gap-2 px-4 py-2.5 border border-gray-50 rounded-xl text-xs font-medium transition-all shadow-sm shrink-0 active:scale-95 bg-white"
              :class="globalFilter ? 'text-parentPrimary border-parentPrimary/30' : 'text-gray-700 hover:bg-gray-50'"
            >
              <span v-if="globalFilter">{{ globalFiltersList.find(f => f.keyword === globalFilter)?.icon || '📌' }}</span>
              <Filter v-else class="w-3.5 h-3.5" />
              <span class="truncate max-w-[100px]">{{ globalFilter ? (globalFiltersList.find(f => f.keyword === globalFilter)?.label || globalFilter) : 'Category' }}</span>
              <ChevronDown class="w-3 h-3 ml-1 transition-transform" :class="{ 'rotate-180': showCategoryDropdown }" />
            </button>

            <!-- Dropdown Menu -->
            <Transition name="fade-up">
              <div v-if="showCategoryDropdown" class="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-50 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden max-h-[300px] overflow-y-auto">
                <button 
                  @click="setFilter(''); showCategoryDropdown = false; selectedCategory = 'all'"
                  class="w-full text-left px-4 py-3 text-xs font-bold hover:bg-gray-50 transition-colors flex items-center gap-3"
                  :class="!globalFilter ? 'text-parentPrimary bg-parentPrimary/5' : 'text-gray-600'"
                >
                  <Filter class="w-3.5 h-3.5" />
                  <span>All Categories</span>
                </button>
                <button 
                  v-for="filter in globalFiltersList" 
                  :key="filter.keyword"
                  @click="setFilter(filter.keyword); showCategoryDropdown = false; selectedCategory = 'all'"
                  class="w-full text-left px-4 py-3 text-xs font-bold hover:bg-gray-50 transition-colors flex items-center gap-3"
                  :class="globalFilter === filter.keyword ? 'text-parentPrimary bg-parentPrimary/5' : 'text-gray-600'"
                >
                  <span class="text-sm leading-none">{{ filter.icon }}</span>
                  <span>{{ filter.label }}</span>
                </button>
              </div>
            </Transition>
          </div>
          
          <button 
            @click="showMobileFilters = true" 
            class="flex items-center gap-2 px-4 py-2.5 border border-gray-50 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors bg-white shadow-sm shrink-0 active:scale-95"
          >
            <SlidersHorizontal class="w-3.5 h-3.5" /> Filters
          </button>
          
          <!-- Sort Dropdown -->
          <div class="relative z-30" ref="sortDropdownRef">
            <button 
              @click="showSortDropdown = !showSortDropdown"
              class="flex items-center gap-2 px-4 py-2.5 border border-gray-50 rounded-xl text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors bg-white shadow-sm shrink-0 active:scale-95"
            >
              Sort By
              <ChevronDown class="w-3 h-3 ml-1 transition-transform" :class="{ 'rotate-180': showSortDropdown }" />
            </button>
            
            <Transition name="fade-up">
              <div v-if="showSortDropdown" class="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-50 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] overflow-hidden">
                <button 
                  @click="sortBy = 'latest'; showSortDropdown = false"
                  class="w-full text-left px-4 py-3 text-xs font-bold hover:bg-gray-50 transition-colors"
                  :class="sortBy === 'latest' ? 'text-parentPrimary bg-parentPrimary/5' : 'text-gray-600'"
                >
                  Latest Added
                </button>
                <button 
                  @click="sortBy = 'alphabetical'; showSortDropdown = false"
                  class="w-full text-left px-4 py-3 text-xs font-bold hover:bg-gray-50 transition-colors"
                  :class="sortBy === 'alphabetical' ? 'text-parentPrimary bg-parentPrimary/5' : 'text-gray-600'"
                >
                  Alphabetical (A-Z)
                </button>
                <button 
                  @click="sortBy = 'popularity'; showSortDropdown = false"
                  class="w-full text-left px-4 py-3 text-xs font-bold hover:bg-gray-50 transition-colors"
                  :class="sortBy === 'popularity' ? 'text-parentPrimary bg-parentPrimary/5' : 'text-gray-600'"
                >
                  Most Popular
                </button>
              </div>
            </Transition>
          </div>
          
          <button 
            v-if="hasActiveFilters"
            @click="resetAllFilters" 
            class="text-xs font-medium text-parentPrimary hover:underline px-3 py-2.5 bg-parentPrimary/10 rounded-xl shrink-0 active:scale-95"
          >
            Reset
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        <div v-for="i in 8" :key="i" class="space-y-4 animate-pulse">
          <div class="bg-gray-100 aspect-[16/10] rounded-2xl"></div>
          <div class="space-y-2">
            <div class="h-4 bg-gray-100 rounded-full w-3/4"></div>
            <div class="h-3 bg-gray-100 rounded-full w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Vendors Grid -->
      <div v-else-if="filteredVendors.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        <div
          v-for="vendor in filteredVendors"
          :key="vendor._id"
          @click="handleVendorClick(vendor)"
          class="group cursor-pointer relative flex flex-col bg-white rounded-3xl hover:-translate-y-1 transition-all duration-300"
        >
            <!-- TOP IMAGE AREA -->
            <div class="relative h-[200px] w-full overflow-hidden rounded-3xl border border-gray-50 shadow-sm">
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
                  <span class="text-white font-bold text-sm tracking-wide text-center">STORE<br/>CLOSED</span>
                </div>
              </template>
              <template v-else>
                <video
                  v-if="(vendor.banner || vendor.image || vendor.logo) && (vendor.banner || vendor.image || vendor.logo).match(/\.(mp4|webm|ogg|mov)$/i)"
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

              <!-- HEART ICON -->
              <button
                @click.stop="toggleFavoriteVendor(vendor)"
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

              <p class="text-[13px] text-gray-500 font-medium line-clamp-1 mb-2">
                {{ vendor.address || vendor.location?.address || 'Campus Location' }}
              </p>

              <div class="flex items-center gap-2 text-[12px] font-medium text-gray-400 mt-auto">
                <span class="px-2 py-0.5 bg-gray-100 rounded-md text-gray-600 truncate max-w-[120px]">
                  {{ vendor.category || 'Vendor' }}
                </span>
                <span>•</span>
                <span>{{ vendor.totalRatings || 0 }} reviews</span>
              </div>
            </div>
          </div>
      </div>

      <!-- Empty State: No filter results -->
      <div v-else class="relative w-full overflow-hidden rounded-2xl border border-dashed border-gray-200 py-20 px-4 text-center">
        <!-- Background layers -->
        <div class="absolute inset-0 bg-gradient-to-b from-slate-50/80 to-white pointer-events-none"></div>
        <div class="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-64 bg-parentPrimary/5 rounded-full blur-[80px] pointer-events-none"></div>

        <!-- Emoji icon -->
        <div class="relative z-10 w-16 h-16 bg-white rounded-2xl shadow-sm border border-gray-50 border border-gray-50 flex items-center justify-center text-3xl mx-auto mb-5" style="animation: float 3s ease-in-out infinite;">
          🔍
        </div>

        <!-- Copy -->
        <div class="relative z-10 space-y-2 mb-6">
          <h3 class="text-xl font-medium text-gray-900 tracking-tight">Nothing Matches</h3>
          <p class="text-sm text-gray-400 font-medium max-w-xs mx-auto leading-relaxed">
            We couldn't find stores for your current filters. Try broadening your search!
          </p>
        </div>

        <!-- Active filter chips (visual hint) -->
        <div class="relative z-10 flex flex-wrap items-center justify-center gap-2 mb-8">
          <span v-if="searchQuery" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
            🔍 "{{ searchQuery }}"
          </span>
          <span v-if="selectedCategory !== 'all'" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
            📌 <span class="capitalize">{{ selectedCategory }}</span>
          </span>
          <span v-if="showOnlyOffers" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
            🏷️ Offers only
          </span>
          <span v-if="showQuickDelivery" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-bold text-gray-600">
            ⚡ Under 30 min
          </span>
        </div>

        <!-- Actions -->
        <div class="relative z-10 flex items-center justify-center gap-3">
          <button
            @click="resetAllFilters"
            class="inline-flex items-center gap-2 px-4 py-2.5 bg-parentPrimary text-white rounded-xl text-xs font-medium hover:scale-105 transition-transform shadow-sm border border-gray-50 shadow-parentPrimary/20 active:scale-95"
          >
            Reset Filters
          </button>
          <NuxtLink
            to="/dashboard"
            class="inline-flex items-center px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-xs font-medium hover:bg-gray-200 transition-colors active:scale-95"
          >
            Go Home
          </NuxtLink>
        </div>
      </div>

    </div>

    <!-- Closed Store Modal -->
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

    <!-- ============================================ -->
    <!-- FILTERS BOTTOM SHEET                         -->
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
        <div v-if="showMobileFilters" class="fixed inset-0 z-[110] flex justify-end bg-black/50 backdrop-blur-sm" @click.self="showMobileFilters = false">
          <div class="bg-white w-full max-w-sm h-full overflow-y-auto shadow-sm border border-gray-50 animate-slide-in-right p-4 space-y-6 flex flex-col">
            
            <div class="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 class="text-lg font-medium text-gray-900 tracking-tight">Refine Options</h3>
              <button @click="showMobileFilters = false" class="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X class="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <!-- Offers & Quick Delivery toggles -->
            <div class="space-y-3">
              <p class="text-[10px] font-medium uppercase tracking-widest text-gray-400">Quick Filters</p>
              <div class="grid grid-cols-2 gap-3">
                <button
                  @click="showOnlyOffers = !showOnlyOffers"
                  class="flex items-center justify-center gap-2 px-3 py-3 rounded-xl border transition-all text-xs font-medium"
                  :class="showOnlyOffers ? 'bg-parentPrimary text-white border-parentPrimary shadow-sm border border-gray-50' : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'"
                >
                  <Tag class="w-3.5 h-3.5" />
                  Special Offers
                </button>

                <button
                  @click="showQuickDelivery = !showQuickDelivery"
                  class="flex items-center justify-center gap-2 px-3 py-3 rounded-xl border transition-all text-xs font-medium"
                  :class="showQuickDelivery ? 'bg-parentPrimary text-white border-parentPrimary shadow-sm border border-gray-50' : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'"
                >
                  <Clock class="w-3.5 h-3.5" />
                  Under 30 min
                </button>
              </div>
            </div>

            <!-- Rating Selector -->
            <div class="space-y-2">
              <p class="text-[10px] font-medium uppercase tracking-widest text-gray-400">Minimum Rating</p>
              <UiSelectInput 
                v-model="minRating" 
                :options="ratingOptions"
              />
            </div>

            <!-- Delivery Fee slider -->
            <div class="space-y-3">
              <div class="flex justify-between text-[10px] font-medium uppercase tracking-widest text-gray-400">
                <span>Max Delivery Fee</span>
                <span class="text-parentPrimary">₦{{ maxDeliveryFee }}</span>
              </div>
              <input 
                v-model="maxDeliveryFee" 
                type="range" 
                min="0" 
                max="1000" 
                step="50" 
                class="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-parentPrimary"
              />
            </div>

            <!-- Actions -->
            <div class="pt-4 mt-auto border-t border-gray-100 flex gap-3">
              <button 
                @click="resetAllFilters" 
                class="flex-1 py-3.5 border border-gray-25 text-gray-700 rounded-xl text-xs font-medium uppercase tracking-wider hover:bg-gray-50 active:scale-95"
              >
                Reset All
              </button>
              <button 
                @click="showMobileFilters = false" 
                class="flex-1 py-3.5 bg-parentPrimary text-white rounded-xl text-xs font-medium uppercase tracking-wider hover:bg-parentPrimary/90 active:scale-95 shadow-sm border border-gray-50 shadow-parentPrimary/10"
              >
                Apply
              </button>
            </div>

          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- NOTIFY MODAL -->
    <VendorNotifyModal
      :is-open="isNotifyModalOpen"
      :vendor="selectedVendorForNotify"
      @close="isNotifyModalOpen = false"
    />

  </div>
</template>

<script setup lang="ts">

import { ref, computed, onMounted } from 'vue';
import { useRoute, useHead } from '#imports';
import { Search, Tag, Clock, Star, Heart, Filter, X, Share2, Bell, SlidersHorizontal, ChevronDown, Lock } from 'lucide-vue-next';
import { onClickOutside } from '@vueuse/core';
import VendorNotifyModal from '@/components/vendors/VendorNotifyModal.vue';
import { useFavorites } from '@/composables/modules/favorites';
import UiSelectInput from '@/components/ui/SelectInput.vue';
import VendorClosedModal from '@/components/VendorClosedModal.vue';

import { useGlobalFilter } from '@/composables/core/useGlobalFilter';

definePageMeta({
  layout: false
})

const route = useRoute();
const { globalFilter, setFilter, globalFiltersList } = useGlobalFilter();

const loading = ref(true);
const vendors = ref<any[]>([]);
const searchQuery = ref(globalFilter.value || '');
const selectedCategory = ref(route.query.category as string || 'all');
const showOnlyOffers = ref(false);
const showQuickDelivery = ref(false);
const showMobileFilters = ref(false);
const maxDeliveryFee = ref(1000);
const minRating = ref('0');
const sortBy = ref('latest');
const { favoriteVendorIds, fetchFavorites, toggleFavorite, isVendorFavorited } = useFavorites();

const showCategoryDropdown = ref(false);
const categoryDropdownRef = ref(null);
const showSortDropdown = ref(false);
const sortDropdownRef = ref(null);

onClickOutside(categoryDropdownRef, () => {
  showCategoryDropdown.value = false;
});

onClickOutside(sortDropdownRef, () => {
  showSortDropdown.value = false;
});

watch(globalFilter, (newVal) => {
  searchQuery.value = newVal;
});

const ratingOptions = [
  { label: 'All ratings', value: '0' },
  { label: '3.0+', value: '3' },
  { label: '3.5+', value: '3.5' },
  { label: '4.0+', value: '4' },
  { label: '4.5+', value: '4.5' },
  { label: '5.0 Only', value: '5' }
];

const isClosedModalOpen = ref(false);
const selectedVendorForModal = ref<any>(null);

// Add logic to handle notify click
const isNotifyModalOpen = ref(false)
const selectedVendorForNotify = ref<any>(null)

const handleNotifyVendor = (vendor: any) => {
  isClosedModalOpen.value = false;
  selectedVendorForNotify.value = vendor
  isNotifyModalOpen.value = true
}

const handleVendorClick = (vendor: any) => {
  const vendorId = typeof vendor === 'string' ? vendor : vendor?._id || vendor?.id;
  if (!vendorId) return;

  if (typeof vendor === 'object' && vendor.isOpen === false && vendor.statusMessage !== 'open') {
    selectedVendorForModal.value = vendor;
    isClosedModalOpen.value = true;
    return;
  }
  
  navigateTo(`/vendors/${vendorId}`);
}

const handleScheduleVendor = (vendor: any) => {
  isClosedModalOpen.value = false;
  const vendorId = typeof vendor === 'string' ? vendor : vendor?._id || vendor?.id;
  if (!vendorId) return;
  navigateTo({ path: `/vendors/${vendorId}`, query: { schedule: 'true' } });
};

const isShareModalOpen = ref(false);
const selectedVendorForShare = ref<any>(null);

const handleShareVendor = (vendor: any) => {
  selectedVendorForShare.value = vendor;
  isShareModalOpen.value = true;
};



const hasActiveFilters = computed(() => {
  return searchQuery.value !== '' ||
    selectedCategory.value !== 'all' ||
    showOnlyOffers.value ||
    showQuickDelivery.value ||
    maxDeliveryFee.value !== 1000 ||
    minRating.value !== '0';
});

const filteredVendors = computed(() => {
  let filtered = vendors.value;

  // We no longer do text search here because the backend handles it via searchQuery watcher

  // Category
  if (selectedCategory.value === 'favorites') {
    filtered = filtered.filter((v) => isVendorFavorited(v._id));
  } else if (selectedCategory.value !== 'all') {
    filtered = filtered.filter((v) => v.category === selectedCategory.value);
  }

  // Offers
  if (showOnlyOffers.value) {
    filtered = filtered.filter(v => v.offers && v.offers.length > 0);
  }

  // Quick Delivery (Under 30 min)
  if (showQuickDelivery.value) {
    filtered = filtered.filter(v => (v.preparationTime || 20) < 30);
  }

  // Delivery Fee
  filtered = filtered.filter(v => (v.deliveryFee || 0) <= maxDeliveryFee.value);

  // Rating
  if (parseFloat(minRating.value) > 0) {
    filtered = filtered.filter(v => (v.rating || 5) >= parseFloat(minRating.value));
  }

  // Sorting
  filtered = [...filtered].sort((a, b) => {
    if (sortBy.value === 'latest') {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    } else if (sortBy.value === 'alphabetical') {
      return (a.storeName || '').localeCompare(b.storeName || '');
    } else { // 'popularity'
      return (b.totalOrders || 0) - (a.totalOrders || 0);
    }
  });

  return filtered;
});

const toggleFavoriteVendor = async (vendor: any) => {
  await toggleFavorite({ vendorId: vendor._id });
};

const resetAllFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = 'all';
  showOnlyOffers.value = false;
  showQuickDelivery.value = false;
  maxDeliveryFee.value = 1000;
  minRating.value = '0';
  sortBy.value = 'latest';
};

import { vendors_api } from '@/api_factory/modules/vendors';

const fetchVendorsData = async () => {
  loading.value = true;
  try {
    const queryParams: any = { limit: 100 };
    if (searchQuery.value) {
      queryParams.search = searchQuery.value;
    }

    const [recRes, trendRes, newRes] = await Promise.all([
      vendors_api.getAll({ ...queryParams, sortBy: 'recommended' }),
      vendors_api.getAll({ ...queryParams, sortBy: 'trending' }),
      vendors_api.getAll({ ...queryParams, sortBy: 'newest' })
    ]);
    
    const recommended = recRes.data?.vendors || recRes.data?.data?.vendors || recRes.data || [];
    const trending = trendRes.data?.vendors || trendRes.data?.data?.vendors || trendRes.data || [];
    const newest = newRes.data?.vendors || newRes.data?.data?.vendors || newRes.data || [];
    
    const combined = [...recommended, ...trending, ...newest];
    const rawVendors = Array.from(new Map(combined.map((v: any) => [v._id, v])).values());
    
    vendors.value = rawVendors.map((v: any) => ({ 
      ...v, 
      offers: v.offers?.length > 0 ? v.offers : (Math.random() > 0.7 ? ['Special Discount'] : []) 
    }));
  } catch (e) {
    console.error('API failed', e);
  } finally {
    loading.value = false;
  }
};

let searchTimeout: any;
watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchVendorsData();
  }, 400);
});

onMounted(() => {
  fetchVendorsData();
  fetchFavorites();
});

useHead({ title: 'Vendors - Errandr' });

const getVendorColor = (name: string) => {
  if (!name) return 'bg-gray-400';
  const colors = ['bg-indigo-600', 'bg-rose-500', 'bg-emerald-500', 'bg-orange-500', 'bg-parentPrimary', 'bg-red-600', 'bg-blue-600', 'bg-amber-600', 'bg-purple-600'];
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
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-slide-up-mobile {
  animation: slideUpMobile 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes slideUpMobile {
  from { opacity: 0; transform: translateY(100%); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-slide-in-right {
  animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes slideInRight {
  from { opacity: 0; transform: translateX(100%); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
}
</style>
