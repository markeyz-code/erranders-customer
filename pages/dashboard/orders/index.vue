<template>
  <div class="space-y-6 animate-fade-in pb-32 selection:bg-parentPrimary/10 selection:text-parentPrimary px-4 md:px-4">
    <!-- Header -->
    <header class="pt-6 pb-2">
      <h1 class="text-2xl md:text-3xl font-medium text-gray-900 tracking-tight leading-none mb-1">
        My Errands
      </h1>
      <p class="text-[10px] font-bold text-gray-400 uppercase ">
        Track and manage your orders
      </p>
    </header>

    <!-- Reschedule Requests Section -->
    <div v-if="rescheduleRequests.length > 0" class="bg-amber-50 rounded-2xl p-4 border border-amber-200 shadow-sm space-y-3">
      <div class="flex items-center gap-2 mb-2">
        <span class="text-xl">📅</span>
        <h3 class="font-bold text-amber-900 text-sm">Action Required: Reschedule Requests</h3>
      </div>
      <div v-for="req in rescheduleRequests" :key="req._id" class="bg-white rounded-xl p-3 border border-amber-100 flex flex-col sm:flex-row gap-3 justify-between sm:items-center">
        <div>
          <p class="text-sm text-gray-900 font-medium">Order #{{ req.orderId?.orderNumber || '...' }} from <span class="font-bold">{{ req.orderId?.vendor?.storeName || 'Vendor' }}</span></p>
          <p class="text-[11px] text-gray-500 mt-0.5">They are away in Exam Mode and suggested delivery on: <span class="font-bold text-gray-900">{{ formatDate(req.suggestedDate) }}</span></p>
        </div>
        <div class="flex gap-2 shrink-0">
          <button @click="resolveRequest(req._id, 'reject')" class="px-3 py-1.5 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-100 transition-colors border border-gray-25">
            Cancel Order
          </button>
          <button @click="resolveRequest(req._id, 'accept')" class="px-3 py-1.5 rounded-lg text-sm font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors">
            Accept Date
          </button>
        </div>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div class="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
        <button
          v-for="status in filters" 
          :key="status.key" 
          @click="activeFilter = status.key"
          class="px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap active:scale-95"
          :class="activeFilter === status.key ? 'bg-parentPrimary text-white shadow-sm border border-gray-50 shadow-parentPrimary/20' : 'text-gray-500 bg-white border border-gray-50 hover:border-parentPrimary/30'"
        >
          {{ status.label }}
        </button>
      </div>

      <div class="relative group z-20 w-full md:w-72">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-parentPrimary transition-colors" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search by vendor or ID..." 
          class="w-full pl-10 pr-4 py-3 bg-white border border-gray-50 rounded-xl text-base font-bold text-gray-900 focus:ring-4 focus:ring-parentPrimary/10 focus:border-parentPrimary transition-all placeholder:text-gray-300 outline-none shadow-sm"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 6" :key="i" class="h-20 bg-gray-50 rounded-2xl animate-pulse border border-gray-50" />
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredOrders.length === 0">
      <div class="bg-white rounded-[2rem] text-center py-20 px-4 border border-dashed border-gray-200">
        <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-gray-50">📋</div>
        <h2 class="text-xl font-medium text-gray-900 mb-1 tracking-tight">No orders found</h2>
        <p class="text-sm font-medium text-gray-500 mb-8 max-w-xs mx-auto">You haven't placed any orders matching this criteria yet.</p>
        <NuxtLink to="/vendors" class="inline-flex px-5 py-3.5 bg-gray-900 text-white rounded-xl font-medium text-sm uppercase tracking-wider hover:bg-parentPrimary transition-colors shadow-sm border border-gray-50 active:scale-95">
          Start Shopping
        </NuxtLink>
      </div>
    </div>

    <!-- Data Grid -->
    <div v-else class="space-y-3">
      <div 
        v-for="order in filteredOrders" 
        :key="order._id" 
        class="group bg-white rounded-2xl p-4 border border-gray-50 hover:border-parentPrimary/30 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between gap-4"
        @click="selectedOrder = order"
      >
        <div class="flex items-center gap-4 flex-1 min-w-0">
          <div class="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-xl shrink-0 group-hover:bg-parentPrimary/5 transition-colors border border-gray-50">
            {{ statusEmoji(order.status) }}
          </div>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 mb-0.5">
              <h3 class="font-medium text-gray-900 text-sm tracking-tight truncate">#{{ order.orderNumber }}</h3>
              <span :class="getStatusBadge(order.status)" class="sm:hidden text-[9px] font-medium uppercase px-2 py-0.5 rounded-md border shrink-0">
                {{ formatStatus(order.status) }}
              </span>
            </div>
            <p class="text-[11px] font-bold text-gray-500 truncate">{{ order.vendor?.storeName || 'Custom Errand' }}</p>
          </div>
        </div>

        <div class="text-right px-2 shrink-0">
          <p class="text-sm font-medium text-gray-900 leading-none mb-1">₦{{ order.total?.toLocaleString() }}</p>
          <p class="text-[10px] font-bold text-gray-400">{{ timeAgo(order.createdAt) }}</p>
        </div>

        <div class="shrink-0 flex items-center gap-2">
          <span :class="getStatusBadge(order.status)" class="hidden sm:block text-[9px] font-medium uppercase px-2.5 py-1 rounded-md border">
            {{ formatStatus(order.status) }}
          </span>
          <ChevronRight class="w-4 h-4 text-gray-300 group-hover:text-parentPrimary transition-colors" />
        </div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- ORDER DETAILS BOTTOM SHEET                   -->
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
        <div v-if="selectedOrder" class="fixed inset-0 z-[110] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/50 backdrop-blur-sm" @click.self="selectedOrder = null">
          <div class="bg-white w-full md:max-w-md rounded-t-[2rem] md:rounded-2xl overflow-hidden shadow-sm border border-gray-50 animate-slide-up-mobile md:animate-zoom-in">
            
            <!-- Premium Header -->
            <div class="relative bg-gray-900 px-4 py-4 md:py-5 text-center overflow-hidden">
              <div class="absolute top-0 right-0 w-40 h-40 bg-parentPrimary/20 rounded-full blur-[60px] -mr-16 -mt-16"></div>
              
              <!-- Mobile handle -->
              <div class="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4 md:hidden"></div>
              
              <button @click="selectedOrder = null" class="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-xl transition-colors">
                <X class="w-4 h-4 text-white/60" />
              </button>
              
              <div class="relative z-10">
                <div class="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-3 border border-white/10 text-2xl">
                  {{ statusEmoji(selectedOrder.status) }}
                </div>
                <h3 class="text-xl font-medium text-white tracking-tight mb-2">Order #{{ selectedOrder.orderNumber }}</h3>
                <span :class="getStatusBadge(selectedOrder.status)" class="inline-block text-[10px] font-medium uppercase px-3 py-1 rounded-lg border bg-gray-900/50 backdrop-blur-md">
                  {{ formatStatus(selectedOrder.status) }}
                </span>
              </div>
            </div>

            <!-- Body -->
            <div class="p-4 space-y-6 max-h-[60vh] md:max-h-none overflow-y-auto">
              <div class="bg-gray-50 rounded-2xl p-5 space-y-4 border border-gray-50">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl bg-white border border-gray-50 flex items-center justify-center text-sm shrink-0">🏪</div>
                  <div class="flex-1 min-w-0">
                    <p class="text-[9px] font-bold uppercase tracking-wider text-gray-400">Vendor</p>
                    <p class="text-sm font-medium text-gray-900 truncate">{{ selectedOrder.vendor?.storeName || 'Unknown Vendor' }}</p>
                  </div>
                </div>
                
                <div class="pt-4 border-t border-gray-200 flex justify-between items-end">
                  <div>
                    <p class="text-[9px] font-bold uppercase tracking-wider text-gray-400">Total Amount</p>
                    <p class="text-xl font-medium text-gray-900 tracking-tight">₦{{ selectedOrder.total?.toLocaleString() }}</p>
                  </div>
                  <div class="text-[10px] font-bold text-gray-300">NGN</div>
                </div>
              </div>

              <!-- Actions -->
              <div class="space-y-2.5">
                <p class="text-[10px] font-medium uppercase  text-gray-400 pl-1 mb-2">Actions</p>
                
                <button 
                  @click="navigateTo(`/dashboard/orders/${selectedOrder._id}`)" 
                  class="w-full py-3.5 bg-parentPrimary text-white rounded-xl text-sm font-medium uppercase tracking-wider hover:bg-parentPrimary/90 transition-all flex items-center justify-center gap-2 shadow-sm border border-gray-50 shadow-parentPrimary/20 active:scale-95"
                >
                  Track Errand <ArrowRight class="w-3.5 h-3.5" />
                </button>

                <!-- <button
                  @click="handleReorder(selectedOrder)"
                  class="w-full py-3.5 bg-white text-gray-900 rounded-xl text-sm font-medium uppercase tracking-wider border border-gray-25 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  Order Again
                </button> -->
                
                <button
                  v-if="['pending', 'confirmed'].includes(selectedOrder.status)"
                  @click="cancelOrder(selectedOrder._id); selectedOrder = null;"
                  class="w-full py-3.5 bg-rose-50 text-rose-500 rounded-xl text-sm font-medium uppercase tracking-wider hover:bg-rose-100 hover:text-rose-600 border border-rose-100 transition-all active:scale-95"
                >
                  Cancel Errand
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ClipboardList, ChevronRight, Search, ArrowRight, X } from 'lucide-vue-next';
import { useStudentOrders } from '@/composables/modules/orders';
import { exam_mode_api } from '@/api_factory/modules/exam-mode';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { ref, computed, onMounted } from 'vue';

definePageMeta({
  layout: 'student'
})

const { loading, orders, fetchOrders, cancelOrder } = useStudentOrders();
const { pushToast } = useCustomToast();

const searchQuery = ref('');
const activeFilter = ref('all');
const selectedOrder = ref<any>(null);

const rescheduleRequests = ref<any[]>([]);

const fetchRescheduleRequests = async () => {
  try {
    const res = await exam_mode_api.getCustomerRescheduleRequests();
    if (res?.data) rescheduleRequests.value = res.data;
  } catch (error) {
    console.error('Failed to fetch reschedule requests', error);
  }
};

const resolveRequest = async (id: string, action: 'accept' | 'reject') => {
  try {
    await exam_mode_api.resolveRescheduleRequest(id, action);
    pushToast('Success', action === 'accept' ? 'Delivery date updated.' : 'Order cancelled.', 'SUCCESS');
    rescheduleRequests.value = rescheduleRequests.value.filter(r => r._id !== id);
    fetchOrders(); // Refresh orders to see the updated date or cancelled status
  } catch (error) {
    console.error(error);
    pushToast('Error', 'Failed to process request.', 'ERROR');
  }
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric'
  });
};

const filters = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'delivered', label: 'Completed' },
];

const filteredOrders = computed(() => {
  let list = orders.value;
  if (activeFilter.value !== 'all') {
    if (activeFilter.value === 'active') {
      list = list.filter(o => !['delivered', 'cancelled'].includes(o.status));
    } else {
      list = list.filter(o => o.status === activeFilter.value);
    }
  }
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(o => 
      o.orderNumber?.toLowerCase().includes(q) ||
      o.vendor?.storeName?.toLowerCase().includes(q)
    );
  }
  return list;
});

const statusEmoji = (status: string) => {
  const map: Record<string, string> = {
    pending: '⏳', confirmed: '✅', preparing: '👨‍🍳', ready_for_pickup: '📦',
    picked_up: '🏃', in_transit: '🛵', delivered: '🎉', cancelled: '❌',
  };
  return map[status] || '📋';
};

const formatStatus = (status: string) => status?.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());

const timeAgo = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const getStatusBadge = (s: string) => {
  if (['delivered', 'confirmed'].includes(s)) return 'text-emerald-600 border-emerald-200/50';
  if (['in_transit', 'picked_up'].includes(s)) return 'text-blue-500 border-blue-200/50';
  if (['pending', 'preparing', 'ready_for_pickup'].includes(s)) return 'text-amber-500 border-amber-200/50';
  if (['cancelled'].includes(s)) return 'text-rose-500 border-rose-200/50';
  return 'text-gray-400 border-gray-200/50';
}

const handleReorder = (order: any) => {
  navigateTo(`/vendors/${order.vendor?._id}`);
};

onMounted(() => {
  fetchOrders();
  fetchRescheduleRequests();
});
useHead({ title: 'My Errands - Errandr' });
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
.animate-zoom-in { animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes zoomIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
</style>
