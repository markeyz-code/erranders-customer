<template>
  <div class="min-h-screen bg-gray-50 flex flex-col pt-6 md:pt-12 px-4 pb-10">
    <div class="w-full max-w-lg mx-auto">
      
      <!-- Top Action Bar -->
      <div class="flex items-center justify-between mb-6">
        <button @click="goBack" class="p-2 hover:bg-gray-200 rounded-full transition-colors">
          <svg class="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          @click="showCancelModal = true" 
          :disabled="cancelling"
          class="text-sm font-semibold text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
        >
          Cancel Order
        </button>
      </div>

      <!-- Cancel Confirmation Modal -->
      <div v-if="showCancelModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
        <div class="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
          <div class="p-6 text-center">
            <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">Cancel Order?</h3>
            <p class="text-sm text-gray-500 mb-6">
              Are you sure you want to cancel this order request? This action cannot be undone.
            </p>
            <div class="flex flex-col gap-3">
              <button 
                @click="confirmCancelOrder"
                :disabled="cancelling"
                class="w-full py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span v-if="cancelling" class="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Yes, Cancel Order</span>
              </button>
              <button 
                @click="showCancelModal = false"
                :disabled="cancelling"
                class="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 active:scale-95 transition-all disabled:opacity-50"
              >
                No, Keep Waiting
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Card -->
      <div class="bg-white rounded-[24px] shadow-sm border border-gray-50 overflow-hidden">
        
        <!-- Header Section -->
        <div class="p-8 text-center border-b border-gray-50 bg-gradient-to-b from-gray-50 to-white relative">
          <div class="absolute inset-x-0 top-0 h-1">
            <div class="h-full bg-parentPrimary animate-pulse"></div>
          </div>
          <div class="relative inline-flex items-center justify-center w-20 h-20 bg-parentPrimary/10 rounded-full mb-5">
            <svg class="w-10 h-10 text-parentPrimary animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 class="text-2xl font-black text-gray-900 tracking-tight">Finding Errand Ninjas 🥷</h2>
          <p class="text-gray-500 mt-2 text-sm max-w-[250px] mx-auto leading-relaxed">
            Please wait while erranders view your request and submit their delivery bids.
          </p>
          
          <div class="mt-6 flex items-center justify-center gap-6">
            <div class="flex flex-col items-center">
              <span class="text-3xl font-bold font-mono text-gray-900">{{ formattedTime }}</span>
              <span class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Time Left</span>
            </div>
            <div class="w-px h-10 bg-gray-200"></div>
            <div class="flex flex-col items-center">
              <span class="text-3xl font-bold font-mono text-parentPrimary">{{ viewerCount }}</span>
              <span class="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Viewing</span>
            </div>
          </div>
        </div>

        <!-- Bids Section -->
        <div class="p-6 bg-white min-h-[250px] max-h-[50vh] overflow-y-auto">
          <div v-if="bids.length === 0" class="h-full flex flex-col items-center justify-center py-10 opacity-60">
            <svg class="w-12 h-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p class="text-gray-500 font-medium">Waiting for the first bid...</p>
          </div>
          
          <div v-else class="space-y-4">
            <div 
              v-for="bid in bids" 
              :key="bid._id"
              class="group relative overflow-hidden bg-white border border-gray-50 rounded-2xl p-4 shadow-sm hover:shadow-md hover:border-parentPrimary/40 transition-all duration-300 flex flex-col gap-3"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-parentPrimary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <!-- Top Row: Profile & Price -->
              <div class="flex justify-between items-center relative z-10 w-full">
                <div class="flex items-center gap-3">
                  <img :src="bid.rider?.avatar || `https://ui-avatars.com/api/?name=${bid.rider?.firstName || 'Rider'}&background=random`" class="w-10 h-10 rounded-full object-cover shadow-sm ring-2 ring-white" />
                  <div>
                    <p class="text-sm font-bold text-gray-900">{{ bid.rider?.firstName }} {{ bid.rider?.lastName }}</p>
                    <div class="flex items-center gap-1 mt-0.5">
                      <span class="inline-flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-md">
                        <svg class="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        4.9
                      </span>
                    </div>
                  </div>
                </div>
                
                <p class="text-lg font-black text-gray-900">₦{{ bid.bidAmount?.toLocaleString() }}</p>
              </div>
              
              <!-- Bottom Row: Actions -->
              <div class="relative z-10 w-full pt-2 border-t border-gray-50">
                <div v-if="bid.lastNegotiatorRole === 'student'" class="text-sm text-center text-amber-500 font-bold bg-amber-50 px-3 py-2 rounded-xl animate-pulse w-full">Waiting for rider response...</div>
                <div v-else class="flex gap-2 w-full">
                  <button 
                    @click="rejectBid(bid)"
                    :disabled="accepting"
                    class="flex-1 py-2.5 bg-red-50 text-red-600 text-sm font-bold rounded-xl hover:bg-red-100 active:scale-95 transition-all disabled:opacity-50 border border-red-100"
                  >
                    Decline
                  </button>
                  <button 
                    @click="openCounterModal(bid)"
                    :disabled="accepting"
                    class="flex-1 py-2.5 bg-gray-50 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-100 active:scale-95 transition-all disabled:opacity-50 border border-gray-25"
                  >
                    Counter
                  </button>
                  <button 
                    @click="acceptBid(bid)"
                    :disabled="accepting"
                    class="flex-[1.2] py-2.5 bg-[#FF5C1A] text-white text-sm font-bold rounded-xl shadow-sm hover:bg-[#E04B12] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Loader2 v-if="accepting" class="w-4 h-4 animate-spin" />
                    <span v-else>Accept</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      <!-- Counter Offer Modal -->
      <div v-if="counterBidData" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
        <div class="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
          <div class="p-6 text-center">
            <h3 class="text-xl font-bold text-gray-900 mb-2">Counter Offer</h3>
            <p class="text-sm text-gray-500 mb-4">
              Enter a new proposed fee for this delivery.
            </p>
            <input 
              v-model.number="counterAmount"
              type="number" 
              class="w-full bg-gray-50 border border-gray-25 rounded-xl px-4 py-3 text-xl font-black text-center text-gray-900 mb-6 focus:ring-2 focus:ring-parentPrimary/50 outline-none"
              placeholder="₦ 0.00"
            />
            <div class="flex flex-col gap-3">
              <button 
                @click="submitCounterBid"
                :disabled="!counterAmount || counterAmount <= 0 || countering"
                class="w-full py-3 bg-parentPrimary text-white font-bold rounded-xl hover:bg-parentPrimary/90 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span v-if="countering" class="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>Send Counter Offer</span>
              </button>
              <button 
                @click="counterBidData = null"
                :disabled="countering"
                class="w-full py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 active:scale-95 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Full Screen Loading Modal for Accepting Bid -->
      <div v-if="accepting" class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gray-900/95 backdrop-blur-sm text-white transition-opacity">
        <Loader2 class="w-12 h-12 animate-spin text-[#FF5C1A] mb-4" />
        <h2 class="text-2xl font-bold tracking-tight mb-2">Accepting Offer...</h2>
        <p class="text-white/60 font-medium text-sm">Please wait while we secure this errand for you.</p>
      </div>
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { io, Socket } from 'socket.io-client';
import { orders_api } from '~/api_factory/modules/orders';
import { useCustomToast } from '~/composables/core/useCustomToast';
import { Loader2 } from 'lucide-vue-next';
import { usePayments } from '~/composables/modules/payments/index';
import { useUser } from '~/composables/modules/auth/user';

const route = useRoute();
const router = useRouter();
const { showToast } = useCustomToast();
const { initializePayment } = usePayments();
const { user } = useUser();
const config = useRuntimeConfig();

const orderIds = (route.query.orderIds as string)?.split(',') || [];
const primaryOrderId = orderIds[0];

const viewerCount = ref(0);
const bids = ref<any[]>([]);
const accepting = ref(false);
const countering = ref(false);
const counterBidData = ref<any>(null);
const counterAmount = ref<number | null>(null);
const cancelling = ref(false);
const showCancelModal = ref(false);
let socket: Socket | null = null;

// Timer Logic (5 minutes)
const timeLeft = ref(300); // 300 seconds = 5 minutes
let timerInterval: any = null;

const formattedTime = computed(() => {
  const m = Math.floor(timeLeft.value / 60);
  const s = timeLeft.value % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
});

const startTimer = () => {
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      clearInterval(timerInterval);
      handleTimeout();
    }
  }, 1000);
};

const handleTimeout = async () => {
  // If timer runs out, auto-cancel
  if (!primaryOrderId || cancelling.value) return;
  showToast({ title: 'Time Expired', message: 'No bids accepted in time. Order cancelled.', toastType: 'info' });
  await cancelOrder();
};

let statusPollingInterval: any = null;

onMounted(() => {
  if (!primaryOrderId) {
    showToast({ title: 'Error', message: 'No active negotiation.', toastType: 'error' });
    router.replace('/');
    return;
  }

  // Start the 5 min countdown
  startTimer();

  // Robust fallback: Poll the order status every 5 seconds to ensure we don't get stuck
  statusPollingInterval = setInterval(async () => {
    try {
      const res = await orders_api.getOrder(primaryOrderId);
      if (res?.data) {
        const status = res.data.status;
        if (['awaiting_payment', 'confirmed', 'in_progress', 'completed'].includes(status)) {
          if (accepting.value || cancelling.value) return;
          accepting.value = true;
          if (timerInterval) clearInterval(timerInterval);
          if (statusPollingInterval) clearInterval(statusPollingInterval);
          
          showToast({ title: 'Rider Found!', message: 'A rider accepted your offer. Redirecting to your order...', toastType: 'success' });
          
          setTimeout(() => {
            window.location.replace(`/dashboard/orders/${primaryOrderId}`);
          }, 100);
        }
      }
    } catch (e) {
      // Ignore polling errors
    }
  }, 5000);

  // Connect to negotiation namespace
  const wsUrl = config.public.apiBase.replace(/\/v1\/?$/, '').replace(/\/api\/?$/, '');
  socket = io(`${wsUrl}/negotiation`, {
    withCredentials: true,
    transports: ['polling'],
    reconnection: true
  });

  socket.on('connect', () => {
    socket?.emit('joinNegotiation', { orderId: primaryOrderId, role: 'student' });
  });

  socket.on('viewerCountUpdate', (data: { count: number }) => {
    viewerCount.value = data.count;
  });

  socket.on('newBid', (bid: any) => {
    // Check if bid from this rider already exists, if so update it
    const index = bids.value.findIndex(b => b.rider._id === bid.rider._id);
    if (index !== -1) {
      bids.value[index] = bid;
    } else {
      bids.value.unshift(bid);
    }
  });

  socket.on('orderAcceptedDirectly', async (payload: any) => {
    if (accepting.value || cancelling.value) return;
    accepting.value = true;
    if (timerInterval) clearInterval(timerInterval);
    if (statusPollingInterval) clearInterval(statusPollingInterval);
    
    showToast({ title: 'Rider Found!', message: 'A rider accepted your proposed fee. Redirecting to your order...', toastType: 'success' });
    
    // Aggressively redirect to order details page without using Nuxt router which causes crashes
    setTimeout(() => {
      window.location.replace(`/dashboard/orders/${primaryOrderId}`);
    }, 100);
  });
  
  socket.on('bidCountered', (bid: any) => {
    const index = bids.value.findIndex(b => b._id === bid._id);
    if (index !== -1) {
      bids.value[index] = { ...bids.value[index], ...bid };
    } else {
      // Just in case it's a new bid that we somehow missed
      bids.value.unshift(bid);
    }
  });

});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
  if (statusPollingInterval) clearInterval(statusPollingInterval);
  if (socket) {
    socket.emit('leaveNegotiation', { orderId: primaryOrderId, role: 'student' });
    socket.disconnect();
  }
});

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
};

const cancelOrder = () => {
  showCancelModal.value = true;
};

const confirmCancelOrder = async () => {
  if (cancelling.value) return;
  cancelling.value = true;
  try {
    const promises = orderIds.map(id => orders_api.cancelOrder(id, 'User cancelled negotiation'));
    await Promise.all(promises);
    showToast({ title: 'Cancelled', message: 'Your order request was cancelled.', toastType: 'success' });
    showCancelModal.value = false;
    
    // Redirect to the UI before order was placed
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  } catch (e: any) {
    showToast({ title: 'Error', message: e.response?.data?.message || 'Failed to cancel order.', toastType: 'error' });
    cancelling.value = false;
  }
};

const openCounterModal = (bid: any) => {
  counterBidData.value = bid;
  counterAmount.value = bid.bidAmount;
};

const submitCounterBid = async () => {
  if (!counterBidData.value || !counterAmount.value) return;
  if (countering.value) return;
  
  countering.value = true;
  try {
    await orders_api.counterBid(primaryOrderId, counterBidData.value._id, counterAmount.value, 'student');
    showToast({ title: 'Counter Offer Sent!', message: 'Waiting for rider to respond.', toastType: 'success' });
    
    // Update local state immediately before socket fires
    const index = bids.value.findIndex(b => b._id === counterBidData.value._id);
    if (index !== -1) {
      bids.value[index] = {
        ...bids.value[index],
        bidAmount: counterAmount.value,
        status: 'counter_offer',
        lastNegotiatorRole: 'student'
      };
    }
    
    counterBidData.value = null;
  } catch (e: any) {
    const msg = e.response?.data?.message || e.message || 'Failed to send counter offer.';
    showToast({ title: 'Error', message: msg, toastType: 'error' });
  } finally {
    countering.value = false;
  }
};

const acceptBid = async (bid: any) => {
  if (accepting.value) return;
  accepting.value = true;
  
  try {
    // Use the reliable REST API to accept the bid
    await orders_api.acceptBid(primaryOrderId, bid._id);
    
    showToast({ title: 'Bid Accepted!', message: 'Redirecting to your order...', toastType: 'success' });
    
    // Redirect immediately to order details page
    window.location.href = `/dashboard/orders/${primaryOrderId}`;
  } catch (e: any) {
    const msg = e.response?.data?.message || e.message || 'Failed to accept bid.';
    showToast({ title: 'Error', message: msg, toastType: 'error' });
    accepting.value = false;
  }
};

const rejectBid = async (bid: any) => {
  if (accepting.value) return;
  try {
    await orders_api.rejectBid(primaryOrderId, bid._id);
    showToast({ title: 'Offer Declined', message: 'You have declined this offer.', toastType: 'info' });
    // update local state
    bids.value = bids.value.filter(b => b._id !== bid._id);
  } catch (e: any) {
    const msg = e.response?.data?.message || e.message || 'Failed to decline offer.';
    showToast({ title: 'Error', message: msg, toastType: 'error' });
  }
};
</script>
