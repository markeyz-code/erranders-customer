<template>
  <div class="animate-fade-in pb-32 selection:bg-parentPrimary/10 selection:text-parentPrimary px-4 md:px-4">
    <!-- Header -->
    <header class="pt-6 pb-4">
      <h1 class="text-2xl md:text-3xl font-medium text-gray-900 tracking-tight leading-none mb-1">
        Search Catalog
      </h1>
      <p class="text-[10px] font-bold text-gray-400 uppercase ">
        Find food, snacks, and products on campus
      </p>
    </header>

    <!-- Search Section -->
    <div class="relative group z-30 max-w-3xl mb-6">
      <div class="relative shadow-sm hover:shadow-sm border border-gray-50 transition-shadow duration-300 rounded-2xl">
        <input
          v-model="query"
          type="text"
          placeholder="Search for items or vendors..."
          class="w-full pl-14 pr-12 py-4 bg-white border border-gray-25 rounded-2xl focus:ring-4 focus:ring-parentPrimary/10 focus:border-parentPrimary transition-all text-base font-medium text-gray-900 placeholder:text-gray-400 outline-none"
          autofocus
          @input="debouncedSearch"
        />
        <div class="absolute left-5 top-1/2 -translate-y-1/2">
          <Search class="w-5 h-5 text-gray-400 group-focus-within:text-parentPrimary transition-all" />
        </div>
        
        <!-- Indicator spinner -->
        <div v-if="searching" class="absolute right-5 top-1/2 -translate-y-1/2">
          <div class="w-5 h-5 border-[3px] border-parentPrimary/20 border-t-parentPrimary rounded-full animate-spin" />
        </div>
      </div>
    </div>

    <!-- Results Section -->
    <div v-if="query && results.length > 0">
      <div class="flex items-center gap-4 mb-4">
        <h2 class="text-sm font-medium uppercase tracking-wider text-gray-400 shrink-0">Results for "{{ query }}"</h2>
        <div class="flex-1 h-px bg-gray-100" />
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
        <div
          v-for="item in results"
          :key="item._id"
          class="bg-white rounded-2xl p-2.5 md:p-3 border border-gray-50 hover:border-parentPrimary/30 hover:shadow-sm border border-gray-50 transition-all duration-300 group relative overflow-hidden flex flex-col h-full justify-between"
          :class="{ 'cursor-pointer': item.isOpen !== false && item.vendor?.isOpen !== false, 'opacity-75 cursor-not-allowed': item.isOpen === false || item.vendor?.isOpen === false }"
          @click="handleItemClick(item)"
        >
          <div>
            <div class="relative aspect-square rounded-xl overflow-hidden mb-3 md:mb-4 bg-gray-50">
              <img :src="item.image || item.logo || item.banner || 'https://images.unsplash.com/photo-1543362906-acfc16c67564?w=400&h=400&fit=crop'" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <!-- Padlock for closed vendors or products from closed vendors -->
              <div v-if="item.isOpen === false || item.vendor?.isOpen === false" class="absolute inset-0 bg-black/60 z-10 flex flex-col items-center justify-center">
                <Lock class="w-8 h-8 text-white mb-1" />
                <span class="text-white font-bold text-[10px] tracking-wide text-center leading-tight">STORE<br/>CLOSED</span>
              </div>
              <!-- Price Badge -->
              <div v-if="item.price !== undefined" class="absolute bottom-2 left-2">
                <span class="px-2.5 py-1 bg-white/95 backdrop-blur-md rounded-lg text-sm font-bold text-gray-900 border border-gray-50 shadow-sm">
                  ₦{{ item.price?.toLocaleString() }}
                </span>
              </div>
            </div>
            
            <div class="space-y-1">
              <h4 class="font-semibold text-gray-900 text-[13px] tracking-tight leading-tight line-clamp-2 group-hover:text-parentPrimary transition-colors">{{ item.name || item.storeName }}</h4>
            </div>
          </div>

          <div class="flex items-center gap-1.5 pt-3 mt-3 border-t border-gray-50">
            <div :class="(item.vendor?.isOnline || item.isOnline) ? 'bg-emerald-500' : 'bg-gray-300'" class="w-1.5 h-1.5 rounded-full shrink-0" />
            <p class="text-[10px] font-medium text-gray-500 truncate capitalize">
              {{ item.vendor?.storeName || item.category || 'Vendor' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty/Initial States -->
    <div v-else-if="query && !searching && results.length === 0" class="bg-white border border-dashed border-gray-200 rounded-2xl text-center py-20 px-4 mt-6">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4 border border-gray-50">
        <span class="text-3xl">🔭</span>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-1 tracking-tight">No results found</h3>
      <p class="text-sm font-medium text-gray-500 max-w-xs mx-auto">We couldn't find anything matching your keywords. Try again with a different term.</p>
    </div>

    <div v-if="!query" class="bg-white border border-dashed border-gray-200 rounded-2xl text-center py-20 px-4 mt-6">
      <div class="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4 border border-gray-50">
        <span class="text-3xl">🔍</span>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-1 tracking-tight">Start searching</h3>
      <p class="text-sm font-medium text-gray-500 max-w-xs mx-auto">Type above to find meals, grocery items, snacks, or stationery instantenously.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, Lock } from 'lucide-vue-next';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { search_api } from '@/api_factory/modules/search';

definePageMeta({
  layout: 'student'
});

const router = useRouter();
const route = useRoute();
const query = ref('');
const results = ref<any[]>([]);
const searching = ref(false);

const performSearch = async () => {
  if (!query.value.trim()) {
    results.value = [];
    return;
  }
  searching.value = true;
  try {
    const res = await search_api.globalSearch({ q: query.value });
    const searchData = (res.data as any)?.data || res.data || {};
    results.value = [
      ...(searchData.products || []),
      ...(searchData.services || []),
      ...(searchData.menuItems || []),
      ...(searchData.vendors || [])
    ];
  } catch (e) { 
    console.error(e); 
  } finally { 
    searching.value = false; 
  }
};

let timeout: any = null;
const debouncedSearch = () => {
  clearTimeout(timeout);
  timeout = setTimeout(performSearch, 300);
};

onMounted(() => {
  if (route.query.q) {
    query.value = route.query.q as string;
    performSearch();
  }
});

const handleItemClick = (item: any) => {
  if (item.isOpen === false || item.vendor?.isOpen === false) {
    return;
  }
  router.push(`/vendors/${item.vendor?._id || item._id}`);
};

useHead({ title: 'Search - Errandr' });
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
