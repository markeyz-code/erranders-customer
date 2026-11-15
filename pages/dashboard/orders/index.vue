<template>
  <div class="wrap">
    <header class="head">
      <div class="min-w-0">
        <h1>My Errands</h1>
        <p>Everything you have ordered, and where each one stands.</p>
      </div>
    </header>

    <!-- Reschedule requests keep their urgency, in the same language as everything else. -->
    <section v-if="rescheduleRequests.length > 0" class="notice">
      <p class="notice-title">A store wants to move your delivery</p>
      <div v-for="req in rescheduleRequests" :key="req._id" class="notice-row">
        <div class="min-w-0">
          <p class="notice-line">
            #{{ req.orderId?.orderNumber || '…' }} from
            <strong>{{ req.orderId?.vendor?.storeName || 'Vendor' }}</strong>
          </p>
          <p class="notice-sub">
            They are in Exam Mode and suggest {{ formatDate(req.suggestedDate) }}.
          </p>
        </div>
        <div class="notice-actions">
          <button type="button" class="btn btn-quiet" @click="resolveRequest(req._id, 'reject')">Cancel order</button>
          <button type="button" class="btn btn-accent" @click="resolveRequest(req._id, 'accept')">Accept date</button>
        </div>
      </div>
    </section>

    <!-- Filters -->
    <div class="bar">
      <div class="chips" role="tablist" aria-label="Filter orders">
        <button
          v-for="status in filters"
          :key="status.key"
          type="button"
          role="tab"
          :aria-selected="activeFilter === status.key"
          class="chip"
          :class="{ on: activeFilter === status.key }"
          @click="activeFilter = status.key"
        >
          {{ status.label }}
        </button>
      </div>

      <label class="search">
        <Search class="search-icon" aria-hidden="true" />
        <input
          v-model="searchQuery"
          type="search"
          class="search-input"
          placeholder="Search by store or order number"
          aria-label="Search orders"
        />
      </label>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="rows">
      <div v-for="i in 5" :key="i" class="row-skel" />
    </div>

    <!-- Empty -->
    <div v-else-if="filteredOrders.length === 0" class="empty">
      <Package class="w-6 h-6" aria-hidden="true" />
      <p class="empty-title">{{ searchQuery || activeFilter !== 'all' ? 'Nothing matches that' : 'No orders yet' }}</p>
      <p class="empty-body">
        {{ searchQuery || activeFilter !== 'all'
          ? 'Try a different filter, or clear the search.'
          : 'When you order, it will appear here with its status and PIN.' }}
      </p>
      <NuxtLink to="/vendors" class="btn btn-dark">Browse stores</NuxtLink>
    </div>

    <!-- Rows -->
    <div v-else class="rows">
      <button
        v-for="order in filteredOrders"
        :key="order._id"
        type="button"
        class="row"
        @click="selectedOrder = order"
      >
        <span class="row-mark" :class="statusTone(order.status)" aria-hidden="true"></span>

        <span class="row-main">
          <span class="row-top">
            <span class="row-id">#{{ order.orderNumber }}</span>
            <span class="pill" :class="statusTone(order.status)">{{ formatStatus(order.status) }}</span>
          </span>
          <span class="row-store">{{ order.vendor?.storeName || (order.type === 'custom_errand' ? 'Custom errand' : 'Errand') }}</span>
        </span>

        <span class="row-side">
          <span class="row-total">₦{{ order.total?.toLocaleString() }}</span>
          <span class="row-when">{{ timeAgo(order.createdAt) }}</span>
        </span>

        <span v-if="isDeliveryPinActive(order)" class="pin">PIN {{ order.deliveryPin }}</span>
        <ChevronRight class="row-caret" aria-hidden="true" />
      </button>
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
            <div class="p-4 space-y-4 max-h-[60vh] md:max-h-none overflow-y-auto">
              <!-- Security PIN Card (Instantly visible upon opening active order) -->
              <div v-if="isDeliveryPinActive(selectedOrder)" class="bg-gradient-to-r from-gray-900 via-gray-900 to-[#1f1612] rounded-2xl p-4 text-white border-2 border-[#FF5C1A]/50 flex items-center justify-between shadow-md">
                <div>
                  <div class="flex items-center gap-1.5 text-[10px] font-bold text-[#FF5C1A] uppercase tracking-wider mb-1">
                    <ShieldCheck class="w-3.5 h-3.5" /> Security Delivery PIN
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span v-for="(digit, idx) in (selectedOrder.deliveryPin || '').split('')" :key="idx" class="w-8 h-10 rounded-lg bg-black/60 text-[#FF5C1A] text-xl font-black flex items-center justify-center border border-white/10 shadow-inner">
                      {{ digit }}
                    </span>
                  </div>
                  <p class="text-[10px] text-gray-300 font-medium mt-1">Give this code to your rider upon arrival</p>
                </div>
                <button 
                  @click.stop="copyPin(selectedOrder.deliveryPin)" 
                  class="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 border border-white/10"
                >
                  <Copy class="w-3.5 h-3.5" /> Copy
                </button>
              </div>

              <div class="bg-gray-50 rounded-2xl p-5 space-y-4 border border-gray-50">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-xl bg-white border border-gray-50 flex items-center justify-center text-sm shrink-0">🏪</div>
                  <div class="flex-1 min-w-0">
                    <p class="text-[9px] font-bold uppercase tracking-wider text-gray-400">Vendor / Request</p>
                    <p class="text-sm font-medium text-gray-900 truncate">{{ selectedOrder.vendor?.storeName || (selectedOrder.type === 'custom_errand' ? 'Custom Errand' : 'Errand') }}</p>
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
import { ClipboardList, ChevronRight, Search, ArrowRight, X, ShieldCheck, Copy } from 'lucide-vue-next';
import { useStudentOrders } from '@/composables/modules/orders';
import { exam_mode_api } from '@/api_factory/modules/exam-mode';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { ref, computed, onMounted } from 'vue';

definePageMeta({
  layout: 'student'
})

const { loading, orders, fetchOrders, cancelOrder } = useStudentOrders();
const { pushToast } = useCustomToast();

const copyPin = (pin: string) => {
  if (!pin) return;
  navigator.clipboard.writeText(pin);
  pushToast({ title: 'PIN Copied!', message: 'Give this 4-digit code to your Errand Ninja.', toastType: 'success' });
};

const isDeliveryPinActive = (order: any) => {
  if (!order?.deliveryPin) return false;
  const status = String(order.status || '').toLowerCase();
  const validStatuses = ['confirmed', 'preparing', 'ready_for_pickup', 'picked_up', 'in_transit', 'interception_in_progress'];
  const invalidStatuses = ['awaiting_payment', 'awaiting_payment_confirmation', 'pending', 'negotiating', 'draft', 'delivered', 'cancelled', 'refunded', 'disputed', 'failed'];
  if (invalidStatuses.includes(status)) return false;
  return validStatuses.includes(status);
};

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

const statusTone = (status?: string) => {
  const st = String(status || '').toLowerCase();
  if (['delivered', 'completed'].includes(st)) return 'ok';
  if (['cancelled', 'refunded', 'failed', 'disputed'].includes(st)) return 'bad';
  if (['awaiting_payment', 'awaiting_payment_confirmation'].includes(st)) return 'wait';
  if (['picked_up', 'in_transit', 'confirmed', 'preparing', 'ready_for_pickup'].includes(st)) return 'live';
  return '';
};

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

<style scoped>
/* PAGE STYLES — tokens come from assets/css/dashboard.css. */
.wrap { display: flex; flex-direction: column; gap: 18px; padding-bottom: 96px; }

.head h1 { margin: 0; font-size: clamp(26px, 5vw, 34px); font-weight: 800; letter-spacing: -0.035em; color: var(--dash-ink); }
.head p { margin: 4px 0 0; font-size: 15px; color: var(--dash-muted); }

.notice { border: 1px solid #f5c9a8; background: #fff4ec; border-radius: var(--dash-radius); padding: 16px; }
html.dark .notice { background: rgba(242, 106, 46, 0.1); border-color: rgba(242, 106, 46, 0.36); }
.notice-title { margin: 0 0 10px; font-size: 16px; font-weight: 800; color: var(--dash-ink); }
.notice-row { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 0; border-top: 1px solid rgba(20, 17, 16, 0.08); }
.notice-row:first-of-type { border-top: 0; }
.notice-line { margin: 0; font-size: 15px; color: var(--dash-ink); }
.notice-sub { margin: 2px 0 0; font-size: 14px; color: var(--dash-muted); }
.notice-actions { display: flex; gap: 8px; }

.bar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px; }
.chips { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 2px; scrollbar-width: none; }
.chips::-webkit-scrollbar { display: none; }
.chip { flex: none; padding: 9px 15px; border-radius: 999px; border: 1px solid var(--dash-line); background: var(--dash-surface); color: var(--dash-muted); font-size: 14.5px; font-weight: 700; cursor: pointer; }
.chip.on { background: var(--dash-accent); border-color: var(--dash-accent); color: #fff; }

.search { display: flex; align-items: center; gap: 9px; padding: 4px 4px 4px 14px; border: 1px solid var(--dash-line); border-radius: 14px; background: var(--dash-surface); min-width: min(320px, 100%); }
.search:focus-within { border-color: var(--dash-accent); box-shadow: 0 0 0 3px rgba(242, 106, 46, 0.16); }
.search-icon { width: 17px; height: 17px; color: var(--dash-faint); flex: none; }
.search-input { flex: 1; min-width: 0; border: 0; background: transparent; outline: none; color: var(--dash-ink); font-size: 15px; padding: 10px 0; }
.search-input::placeholder { color: var(--dash-faint); }

.rows { display: flex; flex-direction: column; gap: 8px; }

.row { display: flex; align-items: center; gap: 14px; width: 100%; text-align: left; padding: 14px 16px; border: 1px solid var(--dash-line); border-radius: var(--dash-radius); background: var(--dash-surface); cursor: pointer; transition: border-color 0.15s ease, box-shadow 0.15s ease; }
.row:hover { border-color: var(--dash-accent); box-shadow: 0 1px 0 rgba(20, 17, 16, 0.04); }

.row-mark { width: 10px; height: 34px; border-radius: 999px; flex: none; background: var(--dash-line); }
.row-mark.ok { background: #16a34a; }
.row-mark.live { background: var(--dash-accent); }
.row-mark.bad { background: #dc2626; }
.row-mark.wait { background: #d97706; }

.row-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.row-top { display: flex; align-items: center; gap: 8px; min-width: 0; }
.row-id { font-size: 15.5px; font-weight: 750; color: var(--dash-ink); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.row-store { font-size: 14px; color: var(--dash-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.pill { flex: none; padding: 3px 9px; border-radius: 999px; font-size: 12.5px; font-weight: 750; background: var(--dash-page); color: var(--dash-muted); border: 1px solid var(--dash-line); }
.pill.ok { color: #15803d; background: rgba(22, 163, 74, 0.1); border-color: rgba(22, 163, 74, 0.25); }
.pill.live { color: var(--dash-accent); background: rgba(242, 106, 46, 0.12); border-color: rgba(242, 106, 46, 0.3); }
.pill.bad { color: #b91c1c; background: rgba(220, 38, 38, 0.1); border-color: rgba(220, 38, 38, 0.25); }
.pill.wait { color: #b45309; background: rgba(217, 119, 6, 0.1); border-color: rgba(217, 119, 6, 0.25); }

.row-side { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; flex: none; }
.row-total { font-size: 15.5px; font-weight: 750; color: var(--dash-ink); }
.row-when { font-size: 13px; color: var(--dash-faint); }

.pin { flex: none; padding: 5px 10px; border-radius: 9px; background: var(--dash-ink); color: var(--dash-page); font-size: 13px; font-weight: 800; letter-spacing: 0.06em; }
.row-caret { width: 18px; height: 18px; color: var(--dash-faint); flex: none; }

.row-skel { height: 72px; border-radius: var(--dash-radius); background: var(--dash-surface); border: 1px solid var(--dash-line); animation: pulse 1.5s ease-in-out infinite; }

.empty { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 46px 20px; border: 1px dashed var(--dash-line); border-radius: var(--dash-radius); background: var(--dash-surface); color: var(--dash-muted); text-align: center; }
.empty-title { margin: 4px 0 0; font-size: 17px; font-weight: 750; color: var(--dash-ink); }
.empty-body { margin: 0; font-size: 15px; max-width: 36ch; }

.btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 11px 16px; border-radius: 12px; font-size: 15px; font-weight: 700; border: 1px solid transparent; cursor: pointer; text-decoration: none; }
.btn-accent { background: var(--dash-accent); color: #fff; }
.btn-dark { background: var(--dash-ink); color: var(--dash-page); }
.btn-quiet { background: transparent; border-color: currentColor; color: inherit; opacity: 0.8; }

@media (max-width: 520px) {
  .row { flex-wrap: wrap; }
  .pin { order: 5; }
}
</style>
