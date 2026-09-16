<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-[100]">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-sm border border-gray-100 transition-all sm:my-8 w-full"
              :class="order ? 'max-w-2xl' : 'max-w-4xl'"
            >
              <!-- Close Button -->
              <button
                @click="closeModal"
                class="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center transition-colors"
                :class="!order ? 'text-white' : 'text-gray-900 bg-gray-100 hover:bg-gray-200'"
              >
                <XIcon class="w-5 h-5" />
              </button>

              <!-- State 1: Login Form -->
              <div v-if="!order" class="flex flex-col md:flex-row min-h-[500px]">
                <!-- Left Side: Form -->
                <div class="flex-1 p-5 md:p-12 flex flex-col justify-center bg-white">
                  <div class="max-w-md w-full mx-auto">
                    <h2 class="text-2xl font-bold text-[#1a1a1a] mb-2">Manage your order</h2>
                    <p class="text-sm text-gray-500 mb-8">
                      If you have an existing order with us please enter your order details below to get tailored advice
                    </p>

                    <form @submit.prevent="handleTrackOrder" class="space-y-5">
                      <div>
                        <div class="relative">
                          <input
                            id="orderNumber"
                            v-model="form.orderNumber"
                            type="text"
                            required
                            class="peer w-full border border-gray-200 rounded-xl px-4 py-3.5 text-base placeholder-transparent focus:border-parentPrimary focus:ring-1 focus:ring-parentPrimary outline-none transition-all"
                            placeholder="Order reference"
                          />
                          <label
                            for="orderNumber"
                            class="absolute left-4 -top-2.5 bg-white px-1 text-xs text-gray-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-parentPrimary"
                          >
                            Order reference
                          </label>
                          <InfoIcon class="absolute right-4 top-3.5 w-5 h-5 text-gray-300" />
                        </div>
                      </div>

                      <div>
                        <div class="relative">
                          <input
                            id="email"
                            v-model="form.email"
                            type="email"
                            required
                            class="peer w-full border border-gray-200 rounded-xl px-4 py-3.5 text-base placeholder-transparent focus:border-parentPrimary focus:ring-1 focus:ring-parentPrimary outline-none transition-all"
                            placeholder="Email address"
                          />
                          <label
                            for="email"
                            class="absolute left-4 -top-2.5 bg-white px-1 text-xs text-gray-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-parentPrimary"
                          >
                            Email address
                          </label>
                        </div>
                      </div>

                      <button
                        type="submit"
                        :disabled="loading"
                        class="w-full mt-4 bg-parentPrimary hover:bg-orange-600 text-white py-3.5 rounded-xl font-medium transition-colors flex items-center justify-center shadow-sm border border-gray-100 shadow-orange-200"
                      >
                        <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
                        <span v-else>Login</span>
                      </button>
                    </form>
                  </div>
                </div>

                <!-- Right Side: Promotional Carousel -->
                <div class="flex-1 bg-gradient-to-br from-parentPrimary to-orange-600 p-5 md:p-12 flex flex-col justify-center items-center text-white relative overflow-hidden">
                  <!-- Background Pattern/Image placeholder if needed -->
                  <div class="absolute inset-0 opacity-20 mix-blend-overlay"></div>
                  
                  <div class="relative z-10 w-full max-w-sm text-center">
                    <p class="text-sm font-medium mb-6">Benefits of manage my order</p>

                    <div class="relative w-full min-h-[160px] overflow-hidden">
                      <Transition
                        enter-active-class="transition duration-500 ease-out absolute inset-0"
                        enter-from-class="transform translate-x-12 opacity-0"
                        enter-to-class="transform translate-x-0 opacity-100"
                        leave-active-class="transition duration-500 ease-in absolute inset-0"
                        leave-from-class="transform translate-x-0 opacity-100"
                        leave-to-class="transform -translate-x-12 opacity-0"
                      >
                        <div :key="currentSlide" class="bg-white rounded-2xl p-5 text-left shadow-sm border border-gray-100 hover:scale-[1.02] duration-300 w-full h-full flex flex-col justify-center">
                          <h3 class="text-xl font-bold text-gray-900 mb-2">{{ slides[currentSlide].title }}</h3>
                          <p class="text-sm text-gray-500">{{ slides[currentSlide].desc }}</p>
                        </div>
                      </Transition>
                    </div>

                    <!-- Carousel indicators -->
                    <div class="flex justify-center gap-2 mt-8 z-20 relative">
                      <button 
                        v-for="(_, index) in slides" 
                        :key="index"
                        @click="setSlide(index)"
                        class="h-1.5 rounded-full transition-all duration-300 focus:outline-none"
                        :class="currentSlide === index ? 'w-6 bg-white' : 'w-1.5 bg-white/50'"
                      ></button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- State 2: Order Details -->
              <div v-else class="bg-white p-4 md:p-5">
                <!-- Vendor Info Header -->
                <div class="flex items-center justify-between mb-6 pb-6 border-b border-gray-100">
                  <div class="flex items-center gap-4">
                    <div class="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                      <video v-if="order.vendor?.logo && order.vendor.logo.match(/\\.(mp4|webm|ogg|mov)$/i)" :src="order.vendor.logo" class="w-full h-full object-cover" autoplay loop muted playsinline></video>
                      <img v-else-if="order.vendor?.logo" :src="order.vendor.logo" class="w-full h-full object-cover" />
                      <PackageIcon v-else class="w-6 h-6 text-gray-400" />
                    </div>
                    <div>
                      <h3 class="font-bold text-gray-900 text-lg">{{ order.vendor?.storeName || 'Custom Errands' }}</h3>
                      <p class="text-sm text-gray-500">{{ order.type === 'custom_errand' ? 'Erranders Delivery' : order.vendor?.address }}</p>
                    </div>
                  </div>
                  <button @click="order = null" class="text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50">
                    Back
                  </button>
                </div>

                <div class="space-y-6">
                  <!-- Status and Total -->
                  <div class="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div>
                      <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Status</p>
                      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium" :class="statusClass(order.status)">
                        {{ order.status.replace(/_/g, ' ') }}
                      </span>
                    </div>
                    <div class="text-right">
                      <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total</p>
                      <p class="text-xl font-extrabold text-parentPrimary">NGN {{ order.total?.toLocaleString() }}</p>
                    </div>
                  </div>

                  <!-- Date & Location -->
                  <div class="grid grid-cols-2 gap-4">
                    <div class="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-50 text-parentPrimary">
                        <CalendarIcon class="w-5 h-5" />
                      </div>
                      <div>
                        <p class="text-xs font-bold text-gray-500 mb-0.5">Order Date</p>
                        <p class="text-sm font-bold text-gray-900">{{ formatDate(order.createdAt) }}</p>
                      </div>
                    </div>
                    <div class="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-50 text-parentPrimary">
                        <MapPinIcon class="w-5 h-5" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-xs font-bold text-gray-500 mb-0.5">Delivery Address</p>
                        <p class="text-sm font-bold text-gray-900 line-clamp-2" :title="order.deliveryAddress || order.customDetails?.dropoffLocation || 'Not provided'">
                          {{ order.deliveryAddress || order.customDetails?.dropoffLocation || 'Not provided' }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Items List -->
                  <div>
                    <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Order Items</h4>
                    <div v-if="order.type === 'custom_errand'" class="text-sm text-gray-900 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <p><span class="font-bold">Pickup:</span> {{ order.customDetails?.pickupLocation }}</p>
                      <p class="mt-2"><span class="font-bold">Details:</span> {{ order.customDetails?.description }}</p>
                    </div>
                    
                    <div v-else class="space-y-3">
                      <div v-for="(item, idx) in order.items" :key="idx" class="flex justify-between items-start bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div>
                          <p class="text-sm font-bold text-gray-900">{{ item.name }} x{{ item.quantity }}</p>
                          <div v-if="item.customizations?.length" class="mt-2 space-y-1">
                            <p v-for="ext in item.customizations" :key="ext.name" class="text-xs text-gray-500 flex items-center gap-1">
                              <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                              {{ ext.name }}: {{ ext.selected }} (+NGN {{ ext.price }})
                            </p>
                          </div>
                        </div>
                        <p class="text-sm font-bold text-gray-900">NGN {{ item.subtotal?.toLocaleString() }}</p>
                      </div>
                      <div v-for="(pack, pIdx) in order.packs" :key="'pack'+pIdx" class="flex justify-between items-start bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div>
                          <p class="text-sm font-bold text-gray-900">Pack: {{ pack.name || 'Custom Pack' }}</p>
                          <div class="mt-2 space-y-1">
                            <p v-for="item in pack.items" :key="item.name" class="text-xs text-gray-500 flex items-center gap-1">
                              <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                              {{ item.name }} x{{ item.quantity }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="pt-2">
                    <template v-if="canCancel">
                      <button 
                        @click="handleCancel" 
                        :disabled="cancelling"
                        class="w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
                      >
                        <Loader2 v-if="cancelling" class="w-5 h-5 animate-spin mr-2" />
                        <span>Cancel Order</span>
                      </button>
                    </template>
                    <div v-else class="text-center text-sm text-gray-500 bg-gray-50 rounded-xl py-3.5 border border-gray-100">
                      This order cannot be cancelled because it is {{ order.status.replace(/_/g, ' ') }}.
                    </div>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue';
import { X as XIcon, Info as InfoIcon, Loader2, Calendar as CalendarIcon, MapPin as MapPinIcon, Package as PackageIcon } from 'lucide-vue-next';
import { orders_api } from '@/api_factory/modules/orders';
import { useCustomToast } from '@/composables/core/useCustomToast';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close']);

const { showToast } = useCustomToast();
import { useConfirmModal } from '@/composables/core/useConfirmModal';
const { confirm } = useConfirmModal();

const form = ref({
  orderNumber: '',
  email: ''
});

const loading = ref(false);
const cancelling = ref(false);
const order = ref<any>(null);

const slides = [
  {
    title: 'Track your errand',
    desc: 'See exactly where Your Errand Ninja is on the map.'
  },
  {
    title: 'Modify your order',
    desc: 'Easily cancel or adjust your order before it ships.'
  },
  {
    title: 'Your receipt',
    desc: 'View, download and print your receipt for records.'
  }
];

const currentSlide = ref(0);
let slideInterval: any = null;

const setSlide = (index: number) => {
  currentSlide.value = index;
  resetSlideTimer();
};

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
};

const resetSlideTimer = () => {
  if (slideInterval) clearInterval(slideInterval);
  slideInterval = setInterval(nextSlide, 3500);
};

// Only start the carousel if the modal is open to save resources
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    resetSlideTimer();
  } else {
    if (slideInterval) clearInterval(slideInterval);
    // Optional: reset state
    // order.value = null;
    // form.value = { orderNumber: '', email: '' };
  }
});

onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval);
});

const closeModal = () => {
  emit('close');
};

const handleTrackOrder = async () => {
  loading.value = true;
  try {
    const res = await orders_api.trackOrder(form.value.orderNumber, form.value.email);
    order.value = res.data;
    showToast({ title: 'Success', message: 'Order found successfully.', toastType: 'success' });
  } catch (e: any) {
    showToast({ title: 'Error', message: e.response?.data?.message || 'Could not find order with those details.', toastType: 'error' });
    order.value = null;
  } finally {
    loading.value = false;
  }
};

const handleCancel = async () => {
  const isConfirmed = await confirm({
    title: 'Cancel Order',
    message: 'Are you sure you want to cancel this order? This action cannot be undone.',
    variant: 'danger',
    confirmText: 'Yes, Cancel'
  });
  if (!isConfirmed) return;
  
  cancelling.value = true;
  try {
    await orders_api.cancelTrackedOrder(form.value.orderNumber, form.value.email);
    order.value.status = 'cancelled';
    showToast({ title: 'Cancelled', message: 'Your order has been cancelled.', toastType: 'success' });
  } catch (e: any) {
    showToast({ title: 'Error', message: e.response?.data?.message || 'Could not cancel order.', toastType: 'error' });
  } finally {
    cancelling.value = false;
  }
};

const canCancel = computed(() => {
  if (!order.value) return false;
  return ['pending', 'awaiting_payment', 'negotiating', 'scheduled'].includes(order.value.status);
});

const formatDate = (iso: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const statusClass = (status: string) => {
  switch (status) {
    case 'pending':
    case 'awaiting_payment': return 'bg-amber-100 text-amber-800';
    case 'confirmed':
    case 'preparing': return 'bg-emerald-100 text-emerald-800';
    case 'ready_for_pickup':
    case 'picked_up':
    case 'in_transit': return 'bg-purple-100 text-purple-800';
    case 'delivered': return 'bg-blue-100 text-blue-800';
    case 'cancelled':
    case 'refunded': return 'bg-rose-100 text-rose-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
</script>
