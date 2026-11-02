<template>
  <div class="w-full max-w-7xl mx-auto px-4 lg:px-10 py-6 sm:py-8 space-y-8 animate-fade-in">
    <!-- Header with Spotlight -->
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF5C1A]/10 border border-[#FF5C1A]/20 text-[#FF5C1A] text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles class="w-3.5 h-3.5" />
          <span>Campus Pros & Gigs</span>
        </div>
        <h2 class="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
          Book Campus Services & Skills
        </h2>
        <p class="text-xs sm:text-sm text-slate-500 font-medium mt-1 max-w-2xl">
          Barbers, stylists, hostel movers, cleaners, fumigators, phone repairers & academic tutors — verified student providers ready to deliver.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
          {{ groupedProviders.length }} {{ groupedProviders.length === 1 ? 'provider' : 'providers' }}
          · {{ filteredServices.length }} {{ filteredServices.length === 1 ? 'service' : 'services' }}
        </span>
      </div>
    </div>

    <!-- Search & Filters Toolbar -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
      <!-- Search Input -->
      <div class="relative flex-1">
        <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search barbers, hostel movers, fumigators, tutors..."
          class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#FF5C1A] focus:bg-white rounded-xl text-xs sm:text-sm font-semibold text-slate-900 placeholder:text-slate-400 outline-none transition-all"
        />
        <button
          v-if="searchQuery"
          @click="searchQuery = ''"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Quick Location / Type Toggle -->
      <button
        type="button"
        @click="comesToYouOnly = !comesToYouOnly"
        class="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all border shrink-0 cursor-pointer"
        :class="comesToYouOnly ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'"
      >
        <Navigation class="w-3.5 h-3.5 text-emerald-600" />
        <span>Comes to your hostel</span>
        <span
          class="w-2 h-2 rounded-full"
          :class="comesToYouOnly ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'"
        ></span>
      </button>

      <!-- Reset Filter Button if active -->
      <button
        v-if="searchQuery || selectedCategory !== 'all' || comesToYouOnly"
        @click="resetFilters"
        class="px-3 py-2 text-xs font-bold text-[#FF5C1A] hover:bg-[#FF5C1A]/10 rounded-xl transition-colors shrink-0"
      >
        Reset
      </button>
    </div>

    <!-- Category Pills -->
    <div class="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
      <button
        v-for="cat in categoryList"
        :key="cat.id"
        @click="selectedCategory = cat.id"
        class="px-4 py-2 rounded-full text-xs font-black transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer shrink-0"
        :class="selectedCategory === cat.id
          ? 'bg-[#FF5C1A] text-white shadow-md shadow-[#FF5C1A]/20 scale-102'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'"
      >
        <span>{{ cat.icon }}</span>
        <span>{{ cat.label }}</span>
      </button>
    </div>

    <!-- Loading Skeletons -->
    <div v-if="loading" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
      <div v-for="i in 8" :key="i" class="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-2.5 sm:p-4 space-y-2 sm:space-y-3 animate-pulse">
        <div class="w-full aspect-[16/11] bg-slate-100 rounded-xl sm:rounded-2xl"></div>
        <div class="h-3 sm:h-4 bg-slate-100 rounded w-3/4"></div>
        <div class="h-2.5 sm:h-3 bg-slate-100 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Services Grid -->
    <div v-else-if="groupedProviders.length > 0" class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
      <div
        v-for="provider in groupedProviders"
        :key="provider.key"
        @click="provider.vendorId ? router.push(`/vendors/${provider.vendorId}`) : openService(provider.services[0])"
        class="group cursor-pointer bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 hover:border-[#FF5C1A] hover:shadow-xl hover:shadow-[#FF5C1A]/5 transition-all duration-300 p-2.5 sm:p-3.5 flex flex-col justify-between"
      >
        <!-- Top Media Area -->
        <div class="relative w-full aspect-[16/11] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 mb-2 sm:mb-3 shadow-inner">
          <img
            v-if="provider.image"
            :src="provider.image"
            :alt="provider.vendor.storeName"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
          <div v-else class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-slate-100 text-slate-400">
            <Wrench class="w-6 h-6 sm:w-8 sm:h-8 text-[#FF5C1A]/40 mb-1" />
            <span class="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase">Erranders Pro</span>
          </div>

          <div class="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 flex flex-col gap-1 sm:gap-1.5 z-10 max-w-[85%]">
            <span class="px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-slate-950/80 backdrop-blur text-white inline-flex items-center gap-1 shadow-xs truncate">
              <Sparkles class="w-2 h-2 sm:w-2.5 sm:h-2.5 text-[#FF5C1A] shrink-0" />
              <span class="truncate">{{ provider.categories.length === 1 ? formatCategory(provider.categories[0]) : `${provider.count} services` }}</span>
            </span>
            <span v-if="provider.vendor?.serviceLocation === 'mobile_operator'" class="px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black bg-emerald-600/90 backdrop-blur text-white shadow-xs inline-block truncate">
              Comes to you
            </span>
          </div>

          <div class="absolute bottom-1.5 right-1.5 sm:bottom-2.5 sm:right-2.5 bg-black/75 backdrop-blur text-white px-1.5 sm:px-2.5 py-0.5 rounded-full text-[8px] sm:text-[10px] font-bold flex items-center gap-1 z-10 shadow-xs">
            <Layers class="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FF5C1A]" />
            <span>{{ provider.count }}</span>
          </div>
        </div>

        <div class="flex-1 flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-1.5 mb-1 sm:mb-1.5">
              <div class="w-4 h-4 sm:w-5 sm:h-5 rounded-full overflow-hidden bg-slate-200 shrink-0">
                <img v-if="provider.vendor?.logo" :src="provider.vendor.logo" class="w-full h-full object-cover" />
                <span v-else class="w-full h-full flex items-center justify-center text-[8px] sm:text-[9px] font-black text-slate-600">
                  {{ (provider.vendor?.storeName || 'P').charAt(0) }}
                </span>
              </div>
              <span class="text-[11px] sm:text-xs font-semibold text-slate-500 truncate">
                {{ provider.count }} {{ provider.count === 1 ? 'service' : 'services' }}
              </span>
              <span v-if="provider.vendor?.rating" class="ml-auto text-[10px] sm:text-[11px] font-bold text-amber-600 flex items-center gap-0.5 shrink-0">
                ★ {{ provider.vendor.rating.toFixed(1) }}
              </span>
            </div>

            <!-- The business is the headline, not each individual treatment -->
            <h3 class="font-extrabold text-xs sm:text-base text-slate-900 group-hover:text-[#FF5C1A] transition-colors leading-snug line-clamp-2">
              {{ provider.vendor.storeName || 'Campus Provider' }}
            </h3>

            <p v-if="provider.names.length" class="text-[10px] sm:text-xs text-slate-500 font-medium line-clamp-2 mt-0.5 sm:mt-1 leading-relaxed">
              {{ provider.names.join(' · ') }}
            </p>
          </div>

          <div class="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
            <div>
              <span class="text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-slate-400 block">From</span>
              <span class="text-xs sm:text-base font-black text-slate-900 group-hover:text-[#FF5C1A] transition-colors">
                ₦{{ provider.fromPrice.toLocaleString() }}
              </span>
            </div>

            <button
              type="button"
              class="w-full sm:w-auto px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-slate-900 group-hover:bg-[#FF5C1A] text-white font-black text-[10px] sm:text-xs transition-colors flex items-center justify-center gap-1 shadow-xs whitespace-nowrap"
            >
              <span>View services</span>
              <ArrowRight class="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16 px-4 bg-slate-50 rounded-3xl border border-dashed border-slate-200 space-y-3">
      <div class="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto text-2xl">
        🛠️
      </div>
      <h3 class="text-lg font-bold text-slate-900">No Services Found</h3>
      <p class="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
        We couldn't find any services matching your current filters. Try searching for a different skill or reset filters.
      </p>
      <button
        @click="resetFilters"
        class="mt-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-[#FF5C1A] transition-colors"
      >
        View All Services
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {
  Search, X, Sparkles, Navigation, Clock, Wrench, ArrowRight, Layers
} from 'lucide-vue-next';
import { services_api } from '@/api_factory/modules/services';

const router = useRouter();
const loading = ref(true);
const services = ref<any[]>([]);
const searchQuery = ref('');
const selectedCategory = ref('all');
const comesToYouOnly = ref(false);

const categoryList = [
  { id: 'all', label: 'All Services', icon: '⚡' },
  { id: 'barbing', label: 'Barber & Grooming', icon: '💈' },
  { id: 'hair_salon', label: 'Hair & Braids', icon: '💇🏽‍♀️' },
  { id: 'moving', label: 'Movers & Porters', icon: '📦' },
  { id: 'fumigation', label: 'Fumigation & Cleaning', icon: '🧪' },
  { id: 'laundry', label: 'Laundry & Ironing', icon: '🧺' },
  { id: 'tech_repair', label: 'Gadget & Tech Repair', icon: '📱' },
  { id: 'tutoring', label: 'Tutoring & Academic', icon: '📚' },
  { id: 'nails', label: 'Nails & Beauty', icon: '💅🏽' },
];

const fetchServices = async () => {
  loading.value = true;
  try {
    const res = await services_api.getAllServices();
    services.value = res.data || [];
  } catch (err) {
    console.error('Failed to load services', err);
    services.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchServices();
});

const formatCategory = (cat?: string) => {
  if (!cat) return 'Service';
  return cat.replace(/_/g, ' ');
};

const filteredServices = computed(() => {
  let list = services.value || [];

  if (selectedCategory.value !== 'all') {
    list = list.filter((s: any) => {
      const c = (s.category || '').toLowerCase();
      return c === selectedCategory.value.toLowerCase() || c.includes(selectedCategory.value.toLowerCase());
    });
  }

  if (comesToYouOnly.value) {
    list = list.filter((s: any) => s.vendor?.serviceLocation === 'mobile_operator');
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter((s: any) =>
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.description && s.description.toLowerCase().includes(q)) ||
      (s.category && s.category.toLowerCase().includes(q)) ||
      (s.vendor?.storeName && s.vendor.storeName.toLowerCase().includes(q))
    );
  }

  return list;
});

const resetFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = 'all';
  comesToYouOnly.value = false;
};

/**
 * One card per provider, not per service.
 *
 * A single brand with three treatments filled three of the four columns, which reads as
 * duplicated listings rather than one business offering three things. Grouping also gives
 * the student a price to compare ("from ₦5,000") instead of three separate starting points.
 */
const groupedProviders = computed(() => {
  const byVendor = new Map<string, any>();

  for (const service of filteredServices.value || []) {
    const vendor = service.vendor || {};
    const key = String(vendor._id || vendor.storeName || service._id);
    if (!byVendor.has(key)) {
      byVendor.set(key, {
        key,
        vendor,
        vendorId: vendor._id || null,
        services: [],
      });
    }
    byVendor.get(key).services.push(service);
  }

  return Array.from(byVendor.values()).map((group: any) => {
    const prices = group.services.map((sv: any) => Number(sv.price) || 0).filter((n: number) => n > 0);
    const categories = Array.from(
      new Set(group.services.map((sv: any) => sv.category).filter(Boolean)),
    );
    const lead = group.services[0];
    return {
      ...group,
      count: group.services.length,
      fromPrice: prices.length ? Math.min(...prices) : 0,
      categories,
      image:
        group.vendor.banner ||
        group.vendor.logo ||
        lead.image ||
        (Array.isArray(lead.images) ? lead.images[0] : ''),
      names: group.services.map((sv: any) => sv.name).filter(Boolean),
    };
  });
});

const openService = (service: any) => {
  // If service has vendor id, go to the vendor service booking page
  const vendorId = service.vendor?._id || service.vendor;
  if (vendorId) {
    router.push(`/vendors/${vendorId}?serviceId=${service._id}`);
  } else {
    router.push(`/services/${service._id}`);
  }
};
</script>
