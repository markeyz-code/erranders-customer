<template>
  <main class="min-h-screen pb-24">
    <div class="max-w-2xl mx-auto px-0 sm:px-4 pt-6 md:pt-8 space-y-6">
      
      <!-- Header -->
      <div class="flex items-center gap-3 px-4 sm:px-0">
        <button @click="router.back()" class="w-9 h-9 bg-white rounded-xl border border-gray-50 flex items-center justify-center hover:bg-gray-50 transition-all active:scale-95">
          <ArrowLeft class="w-4 h-4 text-gray-900" />
        </button>
        <div>
          <h1 class="text-xl font-medium text-gray-900 tracking-tight">support & reports</h1>
          <p class="text-sm font-bold text-gray-400">Need help or want to report an issue?</p>
        </div>
      </div>

      <!-- Active Tickets List -->
      <div v-if="reports.length > 0" class="space-y-4 px-4 sm:px-0">
        <h2 class="text-sm font-bold text-gray-400 tracking-wider">active support tickets</h2>
        
        <div class="space-y-3">
          <NuxtLink
            v-for="report in reports"
            :key="report._id"
            :to="`/support/${report._id}`"
            class="block bg-white border border-gray-50 hover:border-parentPrimary/30 p-5 rounded-2xl shadow-sm hover:shadow-sm border border-gray-50 transition-all group relative overflow-hidden"
          >
            <div class="flex justify-between items-start gap-4 mb-3">
              <div class="space-y-2">
                <span 
                  :class="statusBadgeClass(report.status)" 
                  class="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border capitalize"
                >
                  {{ report.status }}
                </span>
                <h3 class="font-medium text-gray-900 text-base tracking-tight group-hover:text-parentPrimary transition-colors">
                  {{ report.title }}
                </h3>
              </div>
              <span class="text-xs font-bold text-gray-400 shrink-0">
                {{ new Date(report.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) }}
              </span>
            </div>
            
            <p class="text-gray-500 text-sm font-medium line-clamp-2 leading-relaxed">
              {{ report.description }}
            </p>
            
            <div class="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between text-xs font-bold text-gray-400">
              <span class="capitalize">
                {{ report.category?.replace(/_/g, ' ') }} • {{ report.vendor?.storeName || 'general support' }}
              </span>
              <span class="text-parentPrimary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                view thread <ChevronRight class="w-3.5 h-3.5" />
              </span>
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- New Report Form Card -->
      <div class="px-0 sm:px-4">
        <div class="bg-white p-4 sm:p-5 rounded-none sm:rounded-[2.5rem] border-0 sm:border border-gray-50 shadow-none sm:shadow-sm relative overflow-hidden group">
          <div class="absolute -right-6 -top-6 p-5 opacity-5 text-gray-900 pointer-events-none">
            <MessageSquare class="w-24 h-24" />
          </div>
          
          <h2 class="text-lg font-medium text-gray-900 tracking-tight mb-6">file a new support ticket</h2>
          
          <form @submit.prevent="submitReport" class="space-y-5">
            <!-- Category Custom Dropdown -->
            <SelectInput
              v-model="form.category"
              label="Category"
              placeholder="Select an issue category"
              :options="categoryOptions"
            />

            <!-- Related Order Custom Dropdown -->
            <SelectInput
              v-if="orders.length > 0"
              v-model="form.order"
              label="Related Order (Optional)"
              placeholder="Select a related order"
              :options="orderOptions"
              @update:modelValue="handleOrderChange"
            />

            <!-- Subject Title -->
            <div class="space-y-2">
              <label class="block text-xs font-bold text-gray-400 tracking-wider">Subject Title</label>
              <input 
                v-model="form.title" 
                type="text" 
                placeholder="Brief summary of the issue" 
                class="w-full bg-white rounded-xl border border-gray-50 p-3.5 text-base font-medium focus:outline-none focus:border-parentPrimary transition-colors" 
                required 
              />
            </div>

            <!-- Detailed Description -->
            <div class="space-y-2">
              <label class="block text-xs font-bold text-gray-400 tracking-wider">Details</label>
              <textarea 
                v-model="form.description" 
                rows="5" 
                placeholder="Describe your issue in detail..." 
                class="w-full bg-white rounded-xl border border-gray-50 p-4 text-base font-medium focus:outline-none focus:border-parentPrimary transition-colors resize-none" 
                required 
              />
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              :disabled="submitting || !form.category || !form.title || !form.description" 
              class="w-full py-4 bg-parentPrimary text-white rounded-xl text-xs font-medium hover:bg-parentPrimary/90 active:scale-[0.98] transition-all shadow-sm border border-gray-50 shadow-parentPrimary/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Send class="w-3.5 h-3.5" />
              {{ submitting ? 'submitting ticket...' : 'submit support ticket' }}
            </button>
          </form>
        </div>
      </div>
      
    </div>
  </main>
</template>

<script setup lang="ts">
import { 
  ArrowLeft, ChevronRight, MessageSquare, Send 
} from 'lucide-vue-next';
import { ref, onMounted, computed } from 'vue';
import { useRouter, useHead } from '#imports';
import { reports_api } from '@/api_factory/modules/reports';
import { orders_api } from '@/api_factory/modules/orders';
import { useCustomToast } from '@/composables/core/useCustomToast';
import SelectInput from '@/components/ui/SelectInput.vue';

const router = useRouter();
const { showToast } = useCustomToast();

const reports = ref<any[]>([]);
const orders = ref<any[]>([]);
const submitting = ref(false);

const form = ref({
  category: '',
  title: '',
  description: '',
  order: null as string | null,
  vendor: null as string | null
});

const categoryOptions = [
  { label: '🍽️ Food Quality Issue', value: 'food_quality' },
  { label: '⏰ Late Delivery / Delay', value: 'late_delivery' },
  { label: '❌ Wrong Order / Missing Items', value: 'wrong_order' },
  { label: '😤 Rider or Vendor Behavior', value: 'rude_behavior' },
  { label: '💰 Overcharging / Refund Request', value: 'overcharging' },
  { label: '🧹 Hygiene or Pack Concerns', value: 'hygiene' },
  { label: '📋 General Platform Support', value: 'other' }
];

const orderOptions = computed(() => {
  const options = [
    { label: 'None / General Feedback', value: '' }
  ];
  orders.value.forEach(order => {
    options.push({
      label: `Order #${order._id?.slice(-8).toUpperCase()} - ${order.items?.[0]?.name || 'Errand'} (₦${order.total?.toLocaleString()})`,
      value: order._id
    });
  });
  return options;
});

const statusBadgeClass = (status: string) => {
  switch (status) {
    case 'pending': 
      return 'text-amber-500 bg-amber-50 border-amber-100';
    case 'investigating': 
      return 'text-blue-500 bg-blue-50 border-blue-100';
    case 'resolved': 
      return 'text-emerald-500 bg-emerald-50 border-emerald-100';
    case 'closed': 
    case 'dismissed': 
      return 'text-gray-500 bg-gray-50 border-gray-100';
    default: 
      return 'text-gray-500 bg-gray-50 border-gray-100';
  }
};

const handleOrderChange = (val: string | number) => {
  if (!val) {
    form.value.order = null;
    form.value.vendor = null;
    return;
  }
  form.value.order = val as string;
  const selectedOrder = orders.value.find(o => o._id === val);
  if (selectedOrder) {
    form.value.vendor = selectedOrder.vendor?._id || selectedOrder.vendor;
  } else {
    form.value.vendor = null;
  }
};

const submitReport = async () => {
  submitting.value = true;
  try {
    const payload: any = {
      category: form.value.category,
      title: form.value.title,
      description: form.value.description,
    };
    if (form.value.order) payload.order = form.value.order;
    if (form.value.vendor) payload.vendor = form.value.vendor;

    await reports_api.create(payload);
    
    // Reset form
    form.value = {
      category: '',
      title: '',
      description: '',
      order: null,
      vendor: null
    };
    
    // Refresh tickets list
    await loadReports();
    
    showToast({
      title: 'Report Submitted! 📩',
      message: 'We will review your support ticket shortly.',
      toastType: 'success'
    });
  } catch (e: any) {
    showToast({
      title: 'Submission Failed',
      message: e.data?.message || 'Could not send support report.',
      toastType: 'error'
    });
  } finally {
    submitting.value = false;
  }
};

const loadReports = async () => {
  try {
    const res = await reports_api.getMine();
    reports.value = res.data || [];
  } catch (e) {
    console.error('Failed to load reports:', e);
  }
};

const loadOrders = async () => {
  try {
    const res = await orders_api.getOrders();
    orders.value = (res.data?.data || res.data || []).slice(0, 10);
  } catch (e) {
    console.error('Failed to load orders:', e);
  }
};

onMounted(() => {
  loadReports();
  loadOrders();
});

useHead({ title: 'Support - Errandr' });
</script>

<style scoped>
/* Modern styling additions */
.glass-input {
  transition: all 0.3s ease;
}
.glass-input:focus {
  border-color: #FF5C1A;
  box-shadow: 0 0 0 3px rgba(255, 92, 26, 0.1);
}
</style>
