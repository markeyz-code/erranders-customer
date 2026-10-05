<template>
  <div v-if="loading" class="min-h-screen bg-white flex items-center justify-center">
    <div class="flex flex-col items-center gap-4">
      <div class="w-12 h-12 border-4 border-parentPrimary/20 border-t-parentPrimary rounded-full animate-spin"></div>
      <p class="text-sm font-medium text-gray-500">Loading store...</p>
    </div>
  </div>
  <template v-else-if="vendor">
    <div v-if="vendor.businessType === 'hybrid'" class="bg-white">
      <!-- Hybrid Toggle -->
      <div class="fixed top-0 inset-x-0 z-[60] bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex gap-2 justify-center shadow-sm">
        <button 
          @click="activeHybridView = 'products'" 
          class="px-4 py-2 rounded-full text-sm font-bold transition-all"
          :class="activeHybridView === 'products' ? 'bg-parentPrimary text-white shadow-sm border border-gray-50' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >Products</button>
        <button 
          @click="activeHybridView = 'services'" 
          class="px-4 py-2 rounded-full text-sm font-bold transition-all"
          :class="activeHybridView === 'services' ? 'bg-parentPrimary text-white shadow-sm border border-gray-50' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
        >Services</button>
      </div>
      <div class="pt-14">
        <ProductVendorProfile v-if="activeHybridView === 'products'" :vendor="vendor" />
        <ServiceVendorProfile v-else :vendor="vendor" :is-hybrid="true" />
      </div>
    </div>
    <ServiceVendorProfile v-else-if="vendor.businessType === 'service_provider' || vendor.businessType === 'service'" :vendor="vendor" :is-hybrid="false" />
    <ProductVendorProfile v-else :vendor="vendor" />
  </template>
  <div v-else class="min-h-screen flex items-center justify-center bg-white p-4">
    <div class="text-center max-w-md">
      <div class="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 relative">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-orange-500 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      </div>
      <h2 class="text-xl font-bold text-gray-900 mb-2">Store Not Found</h2>
      <p class="text-gray-500 text-sm mb-6 leading-relaxed px-4">
        Oops! Looks like this spot is empty. Want to claim it and start selling to thousands of students on campus today?
      </p>
      <div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <a href="https://vendor.erranders.org/auth/register" target="_blank" rel="noopener noreferrer" class="px-5 py-2.5 bg-parentPrimary hover:bg-orange-600 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-sm border border-gray-50 flex items-center justify-center gap-2 text-sm">
          <span>Sign Up as Vendor</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </a>
        <button @click="$router.push('/')" class="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg font-medium transition-colors text-sm border border-gray-25">
          Go Home
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '#imports';
import { vendors_api } from '@/api_factory/modules/vendors';
import ProductVendorProfile from '@/components/vendors/ProductVendorProfile.vue';
import ServiceVendorProfile from '@/components/vendors/ServiceVendorProfile.vue';

definePageMeta({ layout: 'default' });

const route = useRoute();
const loading = ref(true);
const vendor = ref<any>(null);
const activeHybridView = ref<'products'|'services'>('services');

const fetchVendorData = async () => {
  const paramId = route.params.id as string;
  if (!paramId) return;
  
  loading.value = true;
  try {
    let vendorRes;
    if (paramId.match(/^[0-9a-fA-F]{24}$/)) {
      vendorRes = await vendors_api.getById(paramId);
    } else {
      vendorRes = await vendors_api.getBySubdomain(paramId);
    }
    
    // Ensure we don't treat an error payload as a valid vendor
    if (vendorRes?.type === 'ERROR' || !vendorRes?.data || vendorRes?.data?.error) {
      vendor.value = null;
    } else {
      vendor.value = vendorRes.data;
    }
  } catch (e) {
    console.error('Failed to fetch vendor routing logic', e);
    vendor.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchVendorData();
});

watch(vendor, (val) => {
  if (val) {
    useHead({
      title: `${val.storeName} | Errander`,
      meta: [
        { name: 'description', content: val.description || `Order from ${val.storeName} on Errander!` }
      ],
      link: [
        { rel: 'icon', href: val.logo || '/favicon.ico', type: 'image/png' },
        { rel: 'shortcut icon', href: val.logo || '/favicon.ico', type: 'image/png' },
        { rel: 'apple-touch-icon', href: val.logo || '/apple-touch-icon.png' }
      ]
    });
  }
}, { immediate: true });
</script>
