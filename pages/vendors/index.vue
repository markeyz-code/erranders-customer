<template>
  <div class="stores">
    <!-- Slim sticky header: search and cart, nothing else competing. -->
    <header class="top">
      <button type="button" class="icon-btn" aria-label="Back" @click="routerBack()">
        <ArrowLeft class="w-5 h-5" aria-hidden="true" />
      </button>

      <label class="search">
        <Search class="search-icon" aria-hidden="true" />
        <input
          v-model="searchQuery"
          type="search"
          class="search-input"
          placeholder="Search stores or food"
          aria-label="Search stores"
        />
      </label>

      <NuxtLink to="/cart" class="icon-btn cart-btn" aria-label="Cart">
        <ShoppingBag class="w-5 h-5" aria-hidden="true" />
        <span v-if="cartCount > 0" class="cart-dot">{{ cartCount }}</span>
      </NuxtLink>
    </header>

    <main class="inner">
      <!-- Services stays reachable; it is no longer a tab competing with the store list. -->
      <div class="tabs">
        <button type="button" class="tab" :class="{ on: activeDirectoryTab === 'stores' }" @click="activeDirectoryTab = 'stores'">
          Stores
        </button>
        <button type="button" class="tab" :class="{ on: activeDirectoryTab === 'services' }" @click="activeDirectoryTab = 'services'">
          Services
        </button>
      </div>

      <ServicesShowcase v-if="activeDirectoryTab === 'services'" />

      <template v-else>
        <section class="head">
          <h1>Stores at {{ campusName }}</h1>
          <p class="head-sub">{{ openCount }} open now, {{ closedCount }} closed</p>
        </section>

        <!-- One row of categories, one sort menu. -->
        <div class="controls">
          <div class="chips" role="tablist" aria-label="Categories">
            <button
              v-for="cat in categories"
              :key="cat.key"
              type="button"
              role="tab"
              :aria-selected="selectedCategory === cat.key"
              class="chip"
              :class="{ on: selectedCategory === cat.key }"
              @click="selectedCategory = cat.key"
            >
              {{ cat.label }}
            </button>
          </div>

          <div class="sort-wrap" ref="sortDropdownRef">
            <button type="button" class="sort-btn" :aria-expanded="showSortDropdown" @click="showSortDropdown = !showSortDropdown">
              {{ sortLabel }}
              <ChevronDown class="w-4 h-4" aria-hidden="true" />
            </button>
            <div v-if="showSortDropdown" class="sort-menu">
              <button v-for="opt in sortOptions" :key="opt.value" type="button" class="sort-item" :class="{ on: sortBy === opt.value }" @click="sortBy = opt.value; showSortDropdown = false">
                {{ opt.label }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="loading" class="grid">
          <div v-for="i in 6" :key="i" class="skel" />
        </div>

        <template v-else>
          <div v-if="openVendors.length" class="grid">
            <article v-for="vendor in openVendors" :key="vendor._id" class="card">
              <button type="button" class="card-hit" @click="handleVendorClick(vendor)">
                <div class="card-media">
                  <video v-if="isVideo(vendor.banner || vendor.logo)" :src="vendor.banner || vendor.logo" class="card-img" autoplay loop muted playsinline />
                  <img v-else :src="vendor.banner || vendor.logo || '/placeholder-store.jpg'" class="card-img" alt="" loading="lazy" />
                  <span class="open-tag">Open now</span>
                  <span v-if="vendor.preOrderOnly" class="floating-tag">Pre-order</span>
                  <span v-if="vendor.vendorType === 'service_provider' || vendor.type === 'service'" class="floating-tag">Service</span>
                </div>
                <div class="card-body">
                  <div class="card-row">
                    <p class="card-name">{{ cleanName(vendor.storeName) }}</p>
                    <span v-if="hasReviews(vendor)" class="rating">
                      <Star class="w-3.5 h-3.5" aria-hidden="true" />
                      {{ vendor.rating?.toFixed(1) }} <span class="rating-count">({{ reviewCount(vendor) }})</span>
                    </span>
                    <span v-else class="new-tag">New</span>
                  </div>
                  <p class="card-meta">
                    {{ vendor.category || 'Store' }}
                    <span aria-hidden="true">·</span>
                    {{ vendor.preparationTime || 20 }} min
                    <template v-if="areaOf(vendor)">
                      <span aria-hidden="true">·</span> {{ areaOf(vendor) }}
                    </template>
                  </p>
                </div>
              </button>

              <button type="button" class="heart" :aria-pressed="isVendorFavorited(vendor._id)" aria-label="Save store" @click="toggleFavorite(vendor._id)">
                <Heart class="w-4 h-4" :class="{ filled: isVendorFavorited(vendor._id) }" aria-hidden="true" />
              </button>
            </article>
          </div>

          <div v-else class="empty">
            <p class="empty-title">Nothing open in {{ activeCategoryLabel }}</p>
            <p class="empty-body">
              {{ closedCount > 0 ? 'Everything in this category is closed right now. You can still order ahead.' : 'No store matches this yet. Try another category.' }}
            </p>
          </div>

          <!-- Closed stores are hidden until asked for. -->
          <button v-if="closedCount > 0 && !showClosed" type="button" class="closed-line" @click="showClosed = true">
            {{ closedCount }} closed {{ closedCount === 1 ? 'store is' : 'stores are' }} hidden. Show closed stores
          </button>

          <section v-if="showClosed && closedVendors.length" class="closed-sec">
            <h2>Closed right now</h2>
            <div class="grid">
              <article v-for="vendor in closedVendors" :key="vendor._id" class="card closed">
                <button type="button" class="card-hit" @click="handleVendorClick(vendor)">
                  <div class="card-media">
                    <img :src="vendor.banner || vendor.logo || '/placeholder-store.jpg'" class="card-img dim" alt="" loading="lazy" />
                    <span class="closed-tag">Closed</span>
                    <span v-if="vendor.preOrderOnly" class="floating-tag order-ahead">Order ahead</span>
                  </div>
                  <div class="card-body">
                    <p class="card-name">{{ cleanName(vendor.storeName) }}</p>
                    <p class="card-meta">{{ vendor.category || 'Store' }}</p>
                  </div>
                </button>
              </article>
            </div>
          </section>
        </template>
      </template>
    </main>

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
              <p class="text-[10px] font-medium uppercase  text-gray-400">Quick Filters</p>
              <div class="grid grid-cols-2 gap-3">
                <button
                  @click="showOnlyOffers = !showOnlyOffers"
                  class="flex items-center justify-center gap-2 px-3 py-3 rounded-xl border transition-all text-sm font-medium"
                  :class="showOnlyOffers ? 'bg-parentPrimary text-white border-parentPrimary shadow-sm border border-gray-50' : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'"
                >
                  <Tag class="w-3.5 h-3.5" />
                  Special Offers
                </button>

                <button
                  @click="showQuickDelivery = !showQuickDelivery"
                  class="flex items-center justify-center gap-2 px-3 py-3 rounded-xl border transition-all text-sm font-medium"
                  :class="showQuickDelivery ? 'bg-parentPrimary text-white border-parentPrimary shadow-sm border border-gray-50' : 'bg-white text-gray-600 border-gray-100 hover:bg-gray-50'"
                >
                  <Clock class="w-3.5 h-3.5" />
                  Under 30 min
                </button>
              </div>
            </div>

            <!-- Rating Selector -->
            <div class="space-y-2">
              <p class="text-[10px] font-medium uppercase  text-gray-400">Minimum Rating</p>
              <UiSelectInput 
                v-model="minRating" 
                :options="ratingOptions"
              />
            </div>

            <!-- Delivery Fee slider -->
            <div class="space-y-3">
              <div class="flex justify-between text-[10px] font-medium uppercase  text-gray-400">
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
                class="flex-1 py-3.5 border border-gray-25 text-gray-700 rounded-xl text-sm font-medium uppercase tracking-wider hover:bg-gray-50 active:scale-95"
              >
                Reset All
              </button>
              <button 
                @click="showMobileFilters = false" 
                class="flex-1 py-3.5 bg-parentPrimary text-white rounded-xl text-sm font-medium uppercase tracking-wider hover:bg-parentPrimary/90 active:scale-95 shadow-sm border border-gray-50 shadow-parentPrimary/10"
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

import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useHead } from '#imports';
import { Search, Tag, Clock, Star, Heart, Filter, X, Share2, Bell, SlidersHorizontal, ChevronDown, Lock, Store, Sparkles, ArrowLeft, ShoppingBag } from 'lucide-vue-next';
import { onClickOutside } from '@vueuse/core';
import VendorNotifyModal from '@/components/vendors/VendorNotifyModal.vue';
import { useFavorites } from '@/composables/modules/favorites';
import UiSelectInput from '@/components/ui/SelectInput.vue';
import VendorClosedModal from '@/components/VendorClosedModal.vue';
import ServicesShowcase from '@/components/services/ServicesShowcase.vue';

import { useGlobalFilter } from '@/composables/core/useGlobalFilter';

definePageMeta({
  layout: false
})

const route = useRoute();
const activeDirectoryTab = ref<'stores' | 'services'>((route.query.tab as string) === 'services' ? 'services' : 'stores');

watch(() => route.query.tab, (t) => {
  if (t === 'services') activeDirectoryTab.value = 'services';
  else if (t === 'stores') activeDirectoryTab.value = 'stores';
});
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




// ─── Listing helpers ───
const routerBack = () => {
  if (typeof window !== 'undefined' && window.history.length > 1) window.history.back();
  else navigateTo('/dashboard');
};

const { itemCount } = useCart();
const cartCount = computed(() => itemCount?.value ?? 0);

const campusName = computed(() => {
  try {
    const { institution } = useInstitution();
    return institution.value?.shortName || institution.value?.name || 'your campus';
  } catch {
    return 'your campus';
  }
});

const openVendors = computed(() => filteredVendors.value.filter((v: any) => v?.isOpen !== false));
const closedVendors = computed(() => filteredVendors.value.filter((v: any) => v?.isOpen === false));
const openCount = computed(() => openVendors.value.length);
const closedCount = computed(() => closedVendors.value.length);
const showClosed = ref(false);

const categories = [
  { key: 'all', label: 'All' },
  { key: 'food', label: 'Food' },
  { key: 'snacks', label: 'Snacks' },
  { key: 'pharmacy', label: 'Pharmacy' },
  { key: 'services', label: 'Services' },
];

const sortOptions = [
  { value: 'latest', label: 'Best match' },
  { value: 'rating', label: 'Top rated' },
  { value: 'fastest', label: 'Fastest' },
  { value: 'popularity', label: 'Most ordered' },
];

const sortLabel = computed(() => sortOptions.find((o) => o.value === sortBy.value)?.label || 'Best match');

const activeCategoryLabel = computed(() => categories.find((c) => c.key === selectedCategory.value)?.label || 'this');

/** "(Demo)" is an internal marker; it should not be part of a store's public name. */
const cleanName = (name?: string) => String(name || 'Store').replace(/\s*\(demo\)\s*/i, '').trim();

const reviewCount = (vendor: any) =>
  Number(vendor?.reviewCount ?? vendor?.totalReviews ?? vendor?.reviewsCount ?? vendor?.reviews ?? 0);

const hasReviews = (vendor: any) => reviewCount(vendor) > 0 && Number(vendor?.rating) > 0;

const areaOf = (vendor: any) => vendor?.area || vendor?.location?.area || vendor?.campusArea || '';

const isVideo = (src?: string) => Boolean(src && String(src).match(/\.(mp4|webm|ogg|mov)$/i));

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

<style scoped>
/* STORES — open first, closed on request, one accent. */
.stores {
  min-height: 100vh;
  background: var(--bg);
  color: var(--ink);
  padding-bottom: 96px;
}

.top {
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: color-mix(in srgb, var(--bg) 92%, transparent);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--line);
}

.icon-btn {
  position: relative;
  flex: none;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--card);
  color: inherit;
  display: grid;
  place-items: center;
  cursor: pointer;
}

.cart-dot {
  position: absolute;
  top: 4px;
  right: 4px;
  min-width: 17px;
  height: 17px;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  display: grid;
  place-items: center;
  padding: 0 4px;
}

.search {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 4px 4px 4px 14px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--card);
}

.search:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(242, 106, 46, 0.16);
}

.search-icon {
  width: 17px;
  height: 17px;
  color: #97908a;
  flex: none;
}

.search-input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  color: inherit;
  font-size: 15px;
  padding: 9px 0;
  outline: none;
}

.inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 18px 16px 0;
}

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
}

.tab {
  padding: 9px 16px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: transparent;
  color: var(--mute);
  font-size: 14.5px;
  font-weight: 700;
  cursor: pointer;
}

.tab.on {
  background: var(--ink);
  border-color: var(--ink);
  color: var(--bg);
}

.head h1 {
  margin: 0;
  font-size: clamp(26px, 5vw, 36px);
  font-weight: 800;
  letter-spacing: -0.035em;
}

.head-sub {
  margin: 5px 0 18px;
  font-size: 15px;
  color: var(--mute);
}

.controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 18px;
  min-width: 0;
}

.chips {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 2px;
  /* Without this the row forces the toolbar wider than the screen, and the sort menu ends up
     positioned against an edge that is off-canvas. */
  min-width: 0;
  flex: 1 1 auto;
}

.chips::-webkit-scrollbar {
  display: none;
}

.chip {
  flex: none;
  padding: 9px 15px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--card);
  color: var(--mute);
  font-size: 14.5px;
  font-weight: 700;
  cursor: pointer;
}

.chip.on {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.sort-wrap {
  position: relative;
  flex: none;
  z-index: 20;
}

.sort-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 9px 14px;
  border-radius: 12px;
  border: 1px solid var(--line);
  background: var(--card);
  color: inherit;
  font-size: 14.5px;
  font-weight: 700;
  cursor: pointer;
}

.sort-menu {
  position: absolute;
  right: 0;
  left: auto;
  top: calc(100% + 6px);
  z-index: 40;
  min-width: 100%;
  width: max-content;
  max-width: min(260px, calc(100vw - 32px));
  border-radius: 14px;
  border: 1px solid var(--line);
  background: var(--card);
  padding: 6px;
  box-shadow: 0 18px 40px rgba(20, 17, 16, 0.14);
}

.sort-item {
  display: block;
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: inherit;
  font-size: 14.5px;
  font-weight: 650;
  cursor: pointer;
}

.sort-item:hover {
  background: rgba(242, 106, 46, 0.1);
}

.sort-item.on {
  color: var(--accent);
  font-weight: 800;
}

.grid {
  display: grid;
  /* Two per row on a phone: one card per screen made the list feel endless. */
  gap: 10px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (min-width: 560px) {
  .grid {
    gap: 14px;
  }
}



@media (min-width: 900px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1200px) {
  .grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.card {
  position: relative;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: var(--card);
  overflow: hidden;
  transition: border-color 0.15s ease, transform 0.15s ease;
}

.card:hover {
  border-color: var(--accent);
  transform: translateY(-1px);
}

.card-hit {
  display: block;
  width: 100%;
  text-align: left;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  padding: 0;
}

.card-media {
  position: relative;
  height: 152px;
  background: #f5f4f0;
  overflow: hidden;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-img.dim {
  filter: grayscale(0.6);
  opacity: 0.6;
}

.open-tag,
.closed-tag,
.floating-tag {
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 9px;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 750;
  background: var(--card);
  color: var(--ink);
}

.closed-tag {
  background: rgba(20, 17, 16, 0.82);
  color: #fff;
}

.floating-tag {
  top: auto;
  bottom: 10px;
  left: 10px;
}

.floating-tag.order-ahead {
  background: var(--accent);
  color: #fff;
}

.card-body {
  padding: 12px 14px 14px;
}

.card-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.card-name {
  margin: 0;
  font-size: 16px;
  font-weight: 750;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-meta {
  margin: 4px 0 0;
  font-size: 14px;
  color: var(--mute);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.rating {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex: none;
  font-size: 14px;
  font-weight: 750;
  color: var(--ink);
}

.rating-count {
  color: var(--mute);
  font-weight: 650;
}

.new-tag {
  flex: none;
  padding: 3px 9px;
  border-radius: 999px;
  background: rgba(242, 106, 46, 0.12);
  color: #b3400b;
  font-size: 12.5px;
  font-weight: 750;
}

.heart {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 0;
  background: rgba(255, 255, 255, 0.94);
  color: var(--ink);
  display: grid;
  place-items: center;
  cursor: pointer;
}

.heart .filled {
  fill: #f26a2e;
  color: var(--accent);
}

.closed-line {
  display: block;
  width: 100%;
  margin-top: 18px;
  padding: 15px 18px;
  border-radius: 14px;
  border: 1px dashed var(--line);
  background: transparent;
  color: var(--mute);
  font-size: 15px;
  font-weight: 650;
  text-align: left;
  cursor: pointer;
}

.closed-line:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.closed-sec {
  margin-top: 22px;
}

.closed-sec h2 {
  margin: 0 0 12px;
  font-size: 19px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.empty {
  border: 1px dashed var(--line);
  border-radius: 16px;
  padding: 40px 20px;
  text-align: center;
}

.empty-title {
  margin: 0;
  font-size: 17px;
  font-weight: 750;
}

.empty-body {
  margin: 6px 0 0;
  font-size: 15px;
  color: var(--mute);
}

.skel {
  height: 232px;
  border-radius: 16px;
  background: var(--card);
  border: 1px solid var(--line);
  animation: pulse 1.5s ease-in-out infinite;
}

.stores :where(a, button, input):focus-visible {
  outline: 3px solid #f26a2e;
  outline-offset: 2px;
  border-radius: 10px;
}

@media (prefers-reduced-motion: reduce) {
  .stores * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}

@media (max-width: 559px) {
  .card-media {
    height: 108px;
  }

  .card-body {
    padding: 10px 11px 12px;
  }

  .card-name {
    font-size: 14px;
  }

  .card-meta {
    font-size: 12.5px;
  }

  .open-tag,
  .closed-tag {
    top: 7px;
    left: 7px;
    padding: 3px 7px;
    font-size: 11px;
  }

  .floating-tag {
    left: 7px;
    bottom: 7px;
    padding: 3px 7px;
    font-size: 11px;
  }

  .heart {
    top: 7px;
    right: 7px;
    width: 28px;
    height: 28px;
  }

  .rating {
    font-size: 12.5px;
  }

  .new-tag {
    padding: 2px 7px;
    font-size: 11px;
  }
}
</style>
