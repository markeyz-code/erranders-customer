<template>
  <div class="min-h-screen bg-white text-slate-900 font-sans pb-20">
    <!-- Top Floating Navbar -->
    <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <button
          @click="$router.back()"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition-colors"
        >
          <ArrowLeft class="w-3.5 h-3.5" /> Back
        </button>

        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
            <img v-if="vendor.logo" :src="vendor.logo" class="w-full h-full object-cover" />
            <span v-else class="w-full h-full flex items-center justify-center font-black text-xs text-slate-700">
              {{ vendor.storeName?.charAt(0) }}
            </span>
          </div>
          <span class="font-extrabold text-sm text-slate-900 truncate max-w-[180px] sm:max-w-xs">
            {{ vendor.storeName }}
          </span>
        </div>

        <div class="flex items-center gap-2">
          <a
            v-if="vendor.phone"
            :href="`tel:${vendor.phone}`"
            class="px-3.5 py-1.5 rounded-xl bg-[#FF5C1A] text-white text-xs font-bold hover:bg-[#E54D12] transition-colors"
          >
            Call
          </a>
        </div>
      </div>
    </header>

    <!-- Blocks Renderer -->
    <main>
      <StorefrontBlock
        v-for="block in visibleBlocks"
        :key="block.id"
        :block="block"
        :vendor="vendor"
        :services-list="vendorServices"
        :products-list="vendorProducts"
        @book-service="handleBookService"
      />
    </main>

    <!-- Booking Modal if user clicks 'Book' on a service -->
    <AppointmentBookingModal
      v-if="selectedService"
      :is-open="isBookingModalOpen"
      :service="selectedService"
      :vendor="vendor"
      @close="isBookingModalOpen = false; selectedService = null"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ArrowLeft } from 'lucide-vue-next';
import StorefrontBlock from '@/components/vendors/StorefrontBlock.vue';
import AppointmentBookingModal from '@/components/vendors/AppointmentBookingModal.vue';
import { services_api } from '@/api_factory/modules/services';
import { products_api } from '@/api_factory/modules/products';

const props = defineProps<{
  vendor: any;
}>();

const vendorServices = ref<any[]>([]);
const vendorProducts = ref<any[]>([]);
const isBookingModalOpen = ref(false);
const selectedService = ref<any>(null);

const visibleBlocks = computed(() => {
  if (!Array.isArray(props.vendor?.pageBlocks)) return [];
  return props.vendor.pageBlocks.filter((b: any) => b.isVisible !== false);
});

onMounted(async () => {
  const vendorId = props.vendor?._id || props.vendor?.id;
  if (!vendorId) return;

  // Load services
  try {
    const res = await services_api.getVendorServices(vendorId);
    vendorServices.value = res.data || [];
  } catch (err) {
    console.warn('Could not fetch services for storefront', err);
  }

  // Load products
  try {
    if (products_api?.getProductsByVendor) {
      const res = await products_api.getProductsByVendor(vendorId);
      vendorProducts.value = res.data?.products || res.data || [];
    }
  } catch (err) {
    console.warn('Could not fetch products for storefront', err);
  }
});

const handleBookService = (service: any) => {
  selectedService.value = service;
  isBookingModalOpen.value = true;
};
</script>
