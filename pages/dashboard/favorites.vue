<template>
  <div class="space-y-6 animate-fade-in pb-32">
    <div class="mb-8 px-2 md:px-0">
      <h1 class="text-2xl font-bold text-gray-900 mb-1">Favorites</h1>
      <p class="text-sm text-gray-500">Your saved venues and services.</p>
    </div>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 md:px-0">
      <div v-for="i in 6" :key="i" class="h-80 bg-white border border-gray-50 rounded-3xl animate-pulse" />
    </div>

    <div v-else-if="favorites.length === 0" class="px-2 md:px-0">
      <div class="bg-white rounded-3xl text-center p-16 border border-gray-50 shadow-sm animate-fade-in">
        <div class="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6">❤️</div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">No favorites yet</h2>
        <p class="text-sm text-gray-500 mb-8 max-w-sm mx-auto">Tap the heart icon on any venue or service to save it here for quick access.</p>
        <NuxtLink to="/dashboard/search" class="inline-flex px-5 py-3.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-all shadow-sm">Explore Services</NuxtLink>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2 md:px-0">
      <div 
        v-for="fav in favorites" 
        :key="fav._id" 
        class="group bg-white rounded-3xl border border-gray-50 shadow-sm hover:shadow-sm border border-gray-50 hover:border-gray-200 transition-all cursor-pointer overflow-hidden flex flex-col relative"
        @click="router.push(`/vendors/${fav.vendor?._id}`)"
      >
        <button
          @click.stop="removeFavorite(fav)"
          class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md text-rose-500 flex items-center justify-center shadow-sm hover:bg-rose-500 hover:text-white transition-all border border-gray-50"
        >
          <Heart class="w-5 h-5 fill-current" />
        </button>

        <div class="relative h-48 w-full bg-gray-100 overflow-hidden shrink-0">
          <img
            :src="fav.vendor?.banner || fav.product?.image || '/placeholder-store.jpg'"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <!-- Padlock -->
          <div v-if="fav.vendor && !fav.vendor.isOpen" class="absolute inset-0 bg-black/60 z-10 flex flex-col items-center justify-center">
            <Lock class="w-10 h-10 text-white mb-2" />
            <span class="text-white font-bold text-sm tracking-wide text-center leading-tight">STORE<br/>CLOSED</span>
          </div>
        </div>
        
        <div class="p-5 flex-1 flex flex-col">
          <div class="flex items-start justify-between gap-4 mb-2">
            <h4 class="font-bold text-gray-900 text-lg truncate">{{ fav.vendor?.storeName || 'Venue Name' }}</h4>
            <div class="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg shrink-0">
              <Star class="w-3.5 h-3.5 text-amber-500 fill-current" />
              <span class="text-xs font-bold text-gray-900">{{ fav.vendor?.rating?.toFixed(1) || '5.0' }}</span>
            </div>
          </div>
          <p class="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">{{ fav.vendor?.description || 'Great service provider in your area.' }}</p>
          
          <div class="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">{{ fav.vendor?.category || 'Service' }}</span>
            <span class="text-sm font-bold text-parentPrimary group-hover:translate-x-1 transition-transform inline-block">Book Now &rarr;</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Heart, Star, Lock } from 'lucide-vue-next';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { favorites_api } from '@/api_factory/modules/favorites';
import { useToast } from '@/composables/useToast';

definePageMeta({
 layout: 'student'
});

const router = useRouter();
const { showToast } = useToast();

const loading = ref(true);
const favorites = ref<any[]>([]);

const removeFavorite = async (fav: any) => {
 try {
  await favorites_api.toggle({ productId: fav.product?._id, vendorId: fav.vendor?._id });
  favorites.value = favorites.value.filter((f) => f._id !== fav._id);
  showToast('Removed from favorites', 'success');
 } catch (e) { 
  console.error(e);
  showToast('Failed to remove from favorites', 'error');
 }
};

onMounted(async () => {
 try {
  const res = await favorites_api.getFavorites();
  favorites.value = res.data || [];
 } catch (e) { console.error(e); }
 finally { loading.value = false; }
});

useHead({ title: 'Favorites - Errandr' });
</script>
