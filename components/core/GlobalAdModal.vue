<template>
  <Transition name="modal-fade">
    <div v-if="isOpen" class="fixed inset-0 z-[999999] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="closeAd"></div>
      
      <div class="relative w-full max-w-sm bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden animate-in zoom-in-95 duration-300">
        <button 
          @click="closeAd"
          class="absolute top-4 right-4 z-10 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-all"
        >
          <X class="w-4 h-4" />
        </button>

        <!-- Variant 1: Vendor Ad -->
        <div v-if="currentAd.type === 'vendor' && currentAd.data" class="relative cursor-pointer bg-white" @click="handleCta">
          <div class="h-32 w-full bg-gradient-to-r from-[#FF5C1A] to-orange-400 relative overflow-hidden">
            <!-- Decorative overlay -->
            <div class="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
            <div class="absolute -top-10 -right-10 w-32 h-32 bg-white/30 rounded-full blur-2xl"></div>
            <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-yellow-300/30 rounded-full blur-2xl"></div>
          </div>
          
          <div class="px-4 pb-6 pt-0 text-center relative">
            <!-- Vendor Logo floating over the header -->
            <div class="w-24 h-24 mx-auto -mt-12 rounded-2xl shadow-sm border border-gray-50 border-4 border-white overflow-hidden bg-white relative z-10 transform group-hover:scale-105 transition-transform duration-300">
              <img 
                :src="currentAd.data.logo || currentAd.data.bannerImage || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80'" 
                alt="Vendor Logo"
                class="w-full h-full object-cover"
              />
            </div>
            
            <div class="mt-4">
              <span class="text-[#FF5C1A] text-[10px] font-black  uppercase mb-1 block">
                🔥 Hot on Campus
              </span>
              <h3 class="text-2xl font-black text-gray-900 leading-tight mb-2 truncate">
                {{ currentAd.data.businessName }}
              </h3>
              <p class="text-sm text-gray-500 mb-5 line-clamp-2 leading-relaxed font-medium">
                {{ currentAd.data.description || 'Order the best items around campus. Fresh, fast, and exactly what you need!' }}
              </p>
              
              <button class="w-full py-3.5 bg-gray-900 text-white font-bold rounded-2xl shadow-sm border border-gray-50 hover:bg-black hover:shadow-sm border border-gray-50 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 group">
                Check Them Out 
                <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <!-- Variant 2: Feature Ad (Custom Errand) -->
        <div v-else-if="currentAd.type === 'feature'" class="relative cursor-pointer" @click="handleCta">
          <div class="h-48 w-full bg-[#FF5C1A] relative overflow-hidden">
            <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586880244406-556ebe35f282?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
            <div class="absolute inset-0 bg-gradient-to-br from-[#FF5C1A]/90 to-orange-600/90"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center animate-pulse shadow-sm border border-gray-50">
                <Box class="w-10 h-10 text-white" />
              </div>
            </div>
          </div>
          <div class="p-4 bg-white text-center">
            <span class="px-3 py-1 bg-orange-100 text-[#FF5C1A] rounded-full text-sm font-bold mb-3 inline-block uppercase tracking-wider">
              Special Feature
            </span>
            <h3 class="text-2xl font-bold text-gray-900 mb-2">Need Something Else?</h3>
            <p class="text-sm text-gray-500 mb-5">Can't find what you are looking for? Request a custom errand and we'll handle the rest.</p>
            <button class="w-full py-3 bg-[#FF5C1A] text-white font-bold rounded-xl shadow-sm border border-gray-50 hover:bg-orange-600 transition-all flex items-center justify-center gap-2">
              Book Custom Errand <ArrowRight class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Variant 3: Dispatcher Showcase -->
        <div v-else-if="currentAd.type === 'dispatcher' && currentAd.data" class="relative cursor-pointer" @click="handleCta">
          <div class="p-4 bg-gradient-to-br from-amber-400 to-orange-500 text-center relative overflow-hidden">
            <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            <div class="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-black/10 rounded-full blur-xl"></div>
            
            <div class="relative z-10 flex flex-col items-center">
              <span class="px-3 py-1 bg-black/20 text-white backdrop-blur-md rounded-full text-sm font-bold mb-5 inline-block uppercase tracking-wider">
                Meet Your Errander
              </span>
              <div class="relative w-24 h-24 mb-4">
                <img 
                  :src="currentAd.data.user?.profileImage || `https://ui-avatars.com/api/?name=${currentAd.data.user?.firstName || 'E'}&background=fff&color=f59e0b`" 
                  alt="Dispatcher"
                  class="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm border border-gray-50"
                />
                <div class="absolute -bottom-2 -right-2 bg-white text-amber-500 text-sm font-bold px-2 py-1 rounded-lg shadow-sm border border-gray-50 flex items-center gap-1">
                  <Star class="w-3 h-3 fill-current" />
                  {{ currentAd.data.rating || '5.0' }}
                </div>
              </div>
              <h3 class="text-2xl font-bold text-white mb-1">{{ currentAd.data.user?.firstName || 'Our Dispatcher' }}</h3>
              <p class="text-amber-100 text-sm font-medium mb-1">Fast & Reliable Deliveries</p>
            </div>
          </div>
          <div class="p-5 bg-white">
            <p class="text-center text-sm text-gray-500 mb-4">
              {{ currentAd.data.user?.firstName || 'This Errander' }} is online and ready to handle your custom requests anywhere on campus.
            </p>
            <button class="w-full py-3 bg-gray-900 text-white font-bold rounded-xl shadow-sm border border-gray-50 hover:bg-black transition-all flex items-center justify-center gap-2">
              Book with an Errander <ArrowRight class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Variant 4: Custom Ad -->
        <div v-else-if="currentAd.type === 'custom' && currentAd.data" class="relative cursor-pointer bg-white" @click="handleCta">
          <div class="h-44 w-full bg-gradient-to-r from-orange-500 to-amber-500 relative overflow-hidden" v-if="currentAd.data.imageUrl">
            <img :src="currentAd.data.imageUrl" alt="Ad Banner" class="absolute inset-0 w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
            <div class="absolute bottom-3 left-4 right-4 flex items-center justify-between">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/95 text-[#FF5C1A] backdrop-blur-md shadow-sm">
                {{ currentAd.data.badgeText || '🔥 Featured Deal' }}
              </span>
              <span v-if="currentAd.data.advertiserName" class="text-[10px] font-bold text-white/90 bg-black/50 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                {{ currentAd.data.advertiserName }}
              </span>
            </div>
          </div>
          <div class="h-28 w-full bg-gradient-to-r from-[#FF5C1A] to-amber-500 relative overflow-hidden p-4 flex flex-col justify-end" v-else>
            <div class="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white text-[#FF5C1A] w-max shadow-sm">
              {{ currentAd.data.badgeText || '🔥 Special Offer' }}
            </span>
          </div>
          
          <div class="p-5 text-center">
            <h3 class="text-xl sm:text-2xl font-black text-gray-900 mb-2 leading-tight">
              {{ currentAd.data.title || 'Special Campus Offer' }}
            </h3>
            <p class="text-xs sm:text-sm text-gray-500 mb-5 leading-relaxed font-medium">
              {{ currentAd.data.description }}
            </p>
            <button class="w-full py-3.5 bg-[#FF5C1A] text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 hover:bg-[#e65318] hover:shadow-orange-500/30 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group">
              <span>{{ currentAd.data.ctaText || 'Check It Out' }}</span>
              <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { X, ArrowRight, Box, Star, ExternalLink } from 'lucide-vue-next';
import { useRoute, useRouter } from 'vue-router';
import { useVendors } from '@/composables/modules/vendors';
import { GATEWAY_ENDPOINT_WITH_AUTH, GATEWAY_ENDPOINT_WITHOUT_VERSION } from '@/api_factory/axios.config';

const route = useRoute();
const router = useRouter();
const { popularVendors, fetchPopularVendors } = useVendors();

const isOpen = ref(false);
const currentAd = ref<{ type: 'vendor' | 'feature' | 'dispatcher' | 'custom', data?: any }>({ type: 'feature' });
let adInterval: NodeJS.Timeout;
let autoCloseTimeout: NodeJS.Timeout;

const DEFAULT_FALLBACK_ADS = [
  {
    id: 'ad-erranders-barter',
    title: 'Trade Unused Items on Barter',
    description: 'Swap textbooks, gadgets, calculators, and room appliances safely with students on campus.',
    badgeText: '🔄 Erranders Barter',
    imageUrl: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&q=80',
    ctaText: 'Start Trading on Barter',
    ctaLink: 'https://barter.erranders.org',
    advertiserName: 'Erranders Barter',
    isActive: true,
  },
  {
    id: 'ad-waris-kitchen',
    title: 'Waris Kitchen Weekend Special',
    description: 'Smoky Jollof rice, peppered turkey & chilled Chapman delivered directly to your hostel block.',
    badgeText: '🔥 20% Student Discount',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    ctaText: 'Order from Waris',
    ctaLink: '/vendors',
    advertiserName: 'Waris Kitchen',
    isActive: true,
  }
];

// Default 15 minutes interval
let AD_INTERVAL_MS = 15 * 60 * 1000;
let advertConfig = {
  enabled: true,
  intervalMinutes: 15,
  autoCloseSeconds: 0,
  contentType: 'custom',
  customAd: DEFAULT_FALLBACK_ADS[0],
  customAds: [...DEFAULT_FALLBACK_ADS]
};

// Sensitive routes where we shouldn't pop up an ad
const SENSITIVE_ROUTES = ['cart', 'chat-id'];

const fetchAdvertConfig = async () => {
  try {
    const res = await GATEWAY_ENDPOINT_WITHOUT_VERSION.get('/api/v1/settings/advert/public');
    if (res.data) {
      advertConfig = {
        ...res.data,
        customAds: (res.data.customAds && res.data.customAds.length > 0) ? res.data.customAds : DEFAULT_FALLBACK_ADS,
        customAd: res.data.customAd || DEFAULT_FALLBACK_ADS[0]
      };
      AD_INTERVAL_MS = (advertConfig.intervalMinutes || 15) * 60 * 1000;
    }
  } catch (e) {
    console.error('Failed to load global advert settings, using fallback', e);
  }
};

const pickRandomAd = async () => {
  // Check if globally disabled
  if (!advertConfig.enabled) {
    return;
  }

  // If user is on a sensitive route, skip this interval cycle
  if (SENSITIVE_ROUTES.includes(String(route.name))) {
    return;
  }

  const activeCustomAds = (advertConfig.customAds || []).filter((a: any) => a.isActive !== false);

  if (advertConfig.contentType === 'custom') {
    if (activeCustomAds.length > 0) {
      const randomAd = activeCustomAds[Math.floor(Math.random() * activeCustomAds.length)];
      currentAd.value = { type: 'custom', data: randomAd };
    } else if (advertConfig.customAd && advertConfig.customAd.title) {
      currentAd.value = { type: 'custom', data: advertConfig.customAd };
    } else {
      currentAd.value = { type: 'feature' };
    }
  } else if (advertConfig.contentType === 'hybrid') {
    // 50% chance custom ad, 50% dynamic
    const showCustom = Math.random() < 0.5 && activeCustomAds.length > 0;
    if (showCustom) {
      const randomAd = activeCustomAds[Math.floor(Math.random() * activeCustomAds.length)];
      currentAd.value = { type: 'custom', data: randomAd };
    } else {
      await pickDynamicAd();
    }
  } else {
    // Dynamic Mode
    await pickDynamicAd();
  }

  isOpen.value = true;

  // Track impression if it's a custom ad with an ID
  if (currentAd.value.type === 'custom' && currentAd.value.data?.id) {
    GATEWAY_ENDPOINT_WITHOUT_VERSION.post(`/api/v1/settings/advert/${currentAd.value.data.id}/impression`).catch(() => {});
  }
  
  // Auto-close handling
  if (autoCloseTimeout) clearTimeout(autoCloseTimeout);
  if (advertConfig.autoCloseSeconds > 0) {
    autoCloseTimeout = setTimeout(() => {
      closeAd();
    }, advertConfig.autoCloseSeconds * 1000);
  }
};

const pickDynamicAd = async () => {
  const rand = Math.floor(Math.random() * 3);

  if (rand === 0) {
    // Vendor Ad
    if (!popularVendors.value.length) {
      await fetchPopularVendors();
    }
    if (popularVendors.value.length > 0) {
      const randomVendor = popularVendors.value[Math.floor(Math.random() * popularVendors.value.length)];
      currentAd.value = { type: 'vendor', data: randomVendor };
    } else {
      currentAd.value = { type: 'feature' };
    }
  } else if (rand === 1) {
    // Dispatcher Ad
    try {
      const res = await GATEWAY_ENDPOINT_WITH_AUTH.get('/erranders/available');
      const erranders = res.data?.data || res.data || [];
      if (erranders.length > 0) {
        const randomErrander = erranders[Math.floor(Math.random() * erranders.length)];
        currentAd.value = { type: 'dispatcher', data: randomErrander };
      } else {
        currentAd.value = { type: 'feature' };
      }
    } catch (e) {
      currentAd.value = { type: 'feature' };
    }
  } else {
    // Feature Ad
    currentAd.value = { type: 'feature' };
  }
};

const closeAd = () => {
  isOpen.value = false;
};

const handleCta = () => {
  isOpen.value = false;
  if (currentAd.value.type === 'custom' && currentAd.value.data) {
    // Track click
    if (currentAd.value.data.id) {
      GATEWAY_ENDPOINT_WITHOUT_VERSION.post(`/api/v1/settings/advert/${currentAd.value.data.id}/click`).catch(() => {});
    }

    const link = currentAd.value.data.ctaLink;
    if (link && link.startsWith('http')) {
      window.open(link, '_blank');
    } else {
      router.push(link || '/');
    }
  } else if (currentAd.value.type === 'vendor' && currentAd.value.data) {
    router.push(`/vendors/${currentAd.value.data._id}`);
  } else if (currentAd.value.type === 'feature' || currentAd.value.type === 'dispatcher') {
    router.push('/errands/custom');
  }
};

onMounted(async () => {
  await fetchAdvertConfig();

  // Trigger immediately on mount if enabled
  if (advertConfig.enabled) {
    pickRandomAd();
  }
  
  // Set interval to repeat
  if (advertConfig.enabled) {
    adInterval = setInterval(() => {
      pickRandomAd();
    }, AD_INTERVAL_MS);
  }
});

onUnmounted(() => {
  if (adInterval) clearInterval(adInterval);
  if (autoCloseTimeout) clearTimeout(autoCloseTimeout);
});
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
