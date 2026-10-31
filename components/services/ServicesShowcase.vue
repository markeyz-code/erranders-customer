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
          {{ filteredServices.length }} {{ filteredServices.length === 1 ? 'Service' : 'Services' }} Available
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
    <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      <div v-for="i in 8" :key="i" class="bg-white rounded-3xl border border-slate-200 p-4 space-y-3 animate-pulse">
        <div class="w-full h-44 bg-slate-100 rounded-2xl"></div>
        <div class="h-4 bg-slate-100 rounded w-3/4"></div>
        <div class="h-3 bg-slate-100 rounded w-1/2"></div>
      </div>
    </div>

    <!-- Services Grid -->
    <div v-else-if="filteredServices.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      <div
        v-for="service in filteredServices"
        :key="service._id"
        @click="openService(service)"
        class="group cursor-pointer bg-white rounded-3xl border border-slate-200/90 hover:border-[#FF5C1A] hover:shadow-xl hover:shadow-[#FF5C1A]/5 transition-all duration-300 p-3 sm:p-3.5 flex flex-col justify-between"
      >
        <!-- Top Media Area -->
        <div class="relative w-full aspect-[16/11] rounded-2xl overflow-hidden bg-slate-100 mb-3 shadow-inner">
          <img
            v-if="service.image || service.images?.[0] || service.vendor?.banner || service.vendor?.logo"
            :src="service.image || service.images?.[0] || service.vendor?.banner || service.vendor?.logo"
            :alt="service.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            loading="lazy"
          />
          <div v-else class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 to-slate-100 text-slate-400">
            <Wrench class="w-8 h-8 text-[#FF5C1A]/40 mb-1" />
            <span class="text-[10px] font-bold text-slate-500 uppercase">Erranders Pro</span>
          </div>

          <!-- Badges Overlay -->
          <div class="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            <span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-slate-950/80 backdrop-blur text-white flex items-center gap-1 shadow-xs">
              <Sparkles class="w-2.5 h-2.5 text-[#FF5C1A]" />
              <span>{{ formatCategory(service.category) }}</span>
            </span>
            <span v-if="service.vendor?.serviceLocation === 'mobile_operator'" class="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-600/90 backdrop-blur text-white shadow-xs">
              Comes to you
            </span>
          </div>

          <!-- Duration Pill -->
          <div class="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 z-10 shadow-xs">
            <Clock class="w-3 h-3 text-[#FF5C1A]" />
            <span>{{ service.durationInMinutes || 30 }} mins</span>
          </div>
        </div>

        <!-- Service Details -->
        <div class="flex-1 flex flex-col justify-between">
          <div>
            <!-- Provider Info -->
            <div class="flex items-center gap-2 mb-1.5">
              <div class="w-5 h-5 rounded-full overflow-hidden bg-slate-200 shrink-0">
                <img v-if="service.vendor?.logo" :src="service.vendor.logo" class="w-full h-full object-cover" />
                <span v-else class="w-full h-full flex items-center justify-center text-[9px] font-black text-slate-600">
                  {{ (service.vendor?.storeName || 'P').charAt(0) }}
                </span>
              </div>
              <span class="text-xs font-semibold text-slate-500 truncate">
                {{ service.vendor?.storeName || 'Campus Vendor' }}
              </span>
              <span v-if="service.vendor?.rating" class="ml-auto text-[11px] font-bold text-amber-600 flex items-center gap-0.5 shrink-0">
                ★ {{ service.vendor.rating.toFixed(1) }}
              </span>
            </div>

            <!-- Service Title -->
            <h3 class="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-[#FF5C1A] transition-colors leading-snug line-clamp-1">
              {{ service.name }}
            </h3>

            <!-- Description -->
            <p v-if="service.description" class="text-xs text-slate-500 font-medium line-clamp-2 mt-1 leading-relaxed">
              {{ service.description }}
            </p>
          </div>

          <!-- Price & Action Button -->
          <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <div>
              <span class="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">Session Fee</span>
              <span class="text-base font-black text-slate-900 group-hover:text-[#FF5C1A] transition-colors">
                ₦{{ service.price?.toLocaleString() }}
              </span>
            </div>

            <button
              type="button"
              class="px-4 py-2 rounded-xl bg-slate-900 group-hover:bg-[#FF5C1A] text-white font-black text-xs transition-colors flex items-center gap-1 shadow-xs"
            >
              <span>Book Slot</span>
              <ArrowRight class="w-3.5 h-3.5" />
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
  Search, X, Sparkles, Navigation, Clock, Wrench, ArrowRight
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
