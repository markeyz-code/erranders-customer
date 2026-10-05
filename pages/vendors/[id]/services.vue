<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 font-sans pb-12">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 md:px-5 py-3 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button @click="$router.back()" class="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-25">
          <ArrowLeft class="w-4 h-4 text-gray-700" />
        </button>
        <h1 class="font-bold text-lg">All Services</h1>
      </div>
    </header>

    <main class="max-w-3xl mx-auto px-4 py-5">
      <div v-if="loading" class="flex justify-center py-12">
        <Loader2 class="w-8 h-8 animate-spin text-parentPrimary" />
      </div>

      <template v-else>
        <!-- Category Filter -->
        <div class="flex gap-2 overflow-x-auto pb-6 scrollbar-hide">
          <button 
            @click="activeCategory = 'All'"
            class="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-bold border transition-all"
            :class="activeCategory === 'All' ? 'bg-parentPrimary text-white border-parentPrimary' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'"
          >
            All
          </button>
          <button 
            v-for="cat in categories" 
            :key="cat"
            @click="activeCategory = cat"
            class="whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-bold border transition-all"
            :class="activeCategory === cat ? 'bg-parentPrimary text-white border-parentPrimary' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'"
          >
            {{ cat }}
          </button>
        </div>

        <!-- Services List -->
        <div class="space-y-3">
          <div 
            v-for="service in filteredServices" 
            :key="service._id"
            class="flex items-center justify-between p-4 rounded-xl bg-white border border-gray-50 hover:border-parentPrimary/30 transition-all group"
          >
            <div class="pr-4">
              <div class="flex items-center gap-2 mb-1">
                <span v-if="service.category" class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{{ service.category }}</span>
              </div>
              <h3 class="font-bold text-base text-gray-900 group-hover:text-parentPrimary transition-colors">{{ service.name }}</h3>
              <p class="text-xs font-medium text-gray-500 mt-1 flex items-center gap-1.5">
                <Clock class="w-3.5 h-3.5 text-gray-400" />
                {{ service.variants?.length ? `${service.durationInMinutes} mins - ${Math.max(...service.variants.map((v:any)=>v.durationInMinutes))} mins` : `${service.durationInMinutes} mins` }}
              </p>
              <p class="text-sm font-bold text-gray-900 mt-2">
                {{ service.variants?.length ? 'from ' : '' }}₦{{ service.price.toLocaleString() }}
              </p>
            </div>
            <div class="flex items-center gap-2">
              <button 
                @click="messageVendor(service)"
                class="px-5 py-2 rounded-full bg-white text-gray-700 font-bold text-xs hover:bg-gray-100 transition-colors shrink-0 border border-gray-25"
              >
                Message
              </button>
              <button 
                @click="handleBookService(service)"
                class="px-5 py-2 rounded-full bg-gray-50 text-parentPrimary font-bold text-xs hover:bg-parentPrimary hover:text-white transition-colors shrink-0 border border-gray-25 hover:border-parentPrimary"
              >
                Book
              </button>
            </div>
          </div>
        </div>

        <div v-if="filteredServices.length === 0" class="text-center py-12">
          <p class="text-gray-500 text-sm">No services found.</p>
        </div>
      </template>
    </main>

    <!-- Booking Flow Overlay -->
    <BookingFlow 
      v-if="isBookingFlowOpen"
      :vendor="vendor"
      :services="services"
      :initialService="selectedServiceForBooking"
      @close="isBookingFlowOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft, Clock, Loader2 } from 'lucide-vue-next';
import { services_api } from '@/api_factory/modules/services';
import { vendors_api } from '@/api_factory/modules/vendors';
import BookingFlow from '@/components/vendors/booking/BookingFlow.vue';

definePageMeta({ layout: 'student' });

const route = useRoute();
const vendorId = route.params.id as string;

const loading = ref(true);
const services = ref<any[]>([]);
const vendor = ref<any>(null);
const activeCategory = ref('All');

const isBookingFlowOpen = ref(false);
const selectedServiceForBooking = ref<any>(null);

const categories = computed(() => {
  const cats = new Set<string>();
  services.value.forEach(s => {
    if (s.category) cats.add(s.category);
  });
  return Array.from(cats);
});

const filteredServices = computed(() => {
  if (activeCategory.value === 'All') return services.value;
  return services.value.filter(s => s.category === activeCategory.value);
});

const fetchData = async () => {
  loading.value = true;
  try {
    const [vendorRes, servicesRes] = await Promise.all([
      vendors_api.getById(vendorId),
      services_api.getVendorServices(vendorId)
    ]);
    
    vendor.value = vendorRes.data;
    services.value = servicesRes.data || [];
  } catch (error) {
    console.error('Failed to fetch data', error);
  } finally {
    loading.value = false;
  }
};

const router = useRouter();

const messageVendor = (service: any) => {
  if (vendor.value && vendor.value.owner) {
    router.push({
      path: '/dashboard/chat',
      query: {
        vendorId: vendor.value.owner?._id || vendor.value.owner, // This is the user ID
        vendorDocId: vendor.value._id, // This is the vendor doc ID
        prefill: `Hi, I have a question about the service: ${service.name}.`
      }
    });
  }
};

const handleBookService = (service: any) => {
  selectedServiceForBooking.value = service;
  isBookingFlowOpen.value = true;
};

onMounted(() => {
  fetchData();
});
</script>
