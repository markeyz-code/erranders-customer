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
              class="relative transform overflow-hidden rounded-3xl bg-white text-left shadow-sm border border-gray-50 transition-all sm:my-8 w-full"
              :class="appointment ? 'max-w-2xl' : 'max-w-4xl'"
            >
              <!-- Close Button -->
              <button
                @click="closeModal"
                class="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center transition-colors"
                :class="!appointment ? 'text-white' : 'text-gray-900 bg-gray-100 hover:bg-gray-200'"
              >
                <XIcon class="w-5 h-5" />
              </button>

              <!-- State 1: Login Form -->
              <div v-if="!appointment" class="flex flex-col md:flex-row min-h-[500px]">
                <!-- Left Side: Form -->
                <div class="flex-1 p-5 md:p-12 flex flex-col justify-center bg-white">
                  <div class="max-w-md w-full mx-auto">
                    <h2 class="text-2xl font-bold text-[#1a1a1a] mb-2">Manage your booking</h2>
                    <p class="text-sm text-gray-500 mb-8">
                      If you have an existing booking with us please enter your booking details below to get tailored advice
                    </p>

                    <form @submit.prevent="handleTrackBooking" class="space-y-5">
                      <div>
                        <div class="relative">
                          <input
                            id="reference"
                            v-model="form.reference"
                            type="text"
                            required
                            class="peer w-full border border-gray-25 rounded-xl px-4 py-3.5 text-base placeholder-transparent focus:border-parentPrimary focus:ring-1 focus:ring-parentPrimary outline-none transition-all"
                            placeholder="Booking reference"
                          />
                          <label
                            for="reference"
                            class="absolute left-4 -top-2.5 bg-white px-1 text-xs text-gray-400 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-parentPrimary"
                          >
                            Booking reference
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
                            class="peer w-full border border-gray-25 rounded-xl px-4 py-3.5 text-base placeholder-transparent focus:border-parentPrimary focus:ring-1 focus:ring-parentPrimary outline-none transition-all"
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
                        class="w-full mt-4 bg-parentPrimary hover:bg-parentPrimary/90 text-white py-3.5 rounded-xl font-medium transition-colors flex items-center justify-center shadow-sm border border-gray-50 shadow-parentPrimary/20"
                      >
                        <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
                        <span v-else>Login</span>
                      </button>
                    </form>
                  </div>
                </div>

                <!-- Right Side: Promotional Carousel -->
                <div class="flex-1 bg-gradient-to-br from-[#6f7ea2] to-[#a292aa] p-5 md:p-12 flex flex-col justify-center items-center text-white relative overflow-hidden">
                  <!-- Background Pattern/Image placeholder if needed -->
                  <div class="absolute inset-0 opacity-20 mix-blend-overlay"></div>
                  
                  <div class="relative z-10 w-full max-w-sm text-center">
                    <p class="text-sm font-medium mb-6">Benefits of manage my booking</p>

                    <div class="bg-white rounded-2xl p-5 text-left shadow-sm border border-gray-50 transform transition-transform hover:scale-105 duration-300">
                      <h3 class="text-xl font-bold text-gray-900 mb-2">Your invoice</h3>
                      <p class="text-sm text-gray-500">View, download and print your invoice</p>
                    </div>

                    <!-- Carousel indicators -->
                    <div class="flex justify-center gap-2 mt-8">
                      <div class="w-1.5 h-1.5 rounded-full bg-white/50"></div>
                      <div class="w-1.5 h-1.5 rounded-full bg-white/50"></div>
                      <div class="w-6 h-1.5 rounded-full bg-white"></div>
                      <div class="w-1.5 h-1.5 rounded-full bg-white/50"></div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- State 2: Booking Details -->
              <div v-else class="bg-white p-4 md:p-5">
                <div class="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                  <div class="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-50 overflow-hidden shrink-0">
                    <img :src="appointment.vendor?.logo || '/placeholder-store.jpg'" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-1">
                    <h3 class="font-bold text-gray-900 text-lg">{{ appointment.vendor?.storeName }}</h3>
                    <p class="text-sm text-gray-500">{{ appointment.vendor?.address }}</p>
                  </div>
                  <button @click="appointment = null" class="text-xs font-bold text-gray-400 hover:text-gray-900 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50">
                    Back
                  </button>
                </div>

                <div class="space-y-6">
                  <!-- Status and Total -->
                  <div class="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-50">
                    <div>
                      <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Status</p>
                      <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium" :class="statusClass(appointment.status)">
                        {{ appointment.status }}
                      </span>
                    </div>
                    <div class="text-right">
                      <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total</p>
                      <p class="text-xl font-extrabold text-[#5b52e6]">NGN {{ appointment.price?.toLocaleString() }}</p>
                    </div>
                  </div>

                  <!-- Date & Time -->
                  <div class="grid grid-cols-2 gap-4">
                    <div class="bg-gray-50 rounded-2xl p-4 border border-gray-50 flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-50 text-[#5b52e6]">
                        <CalendarIcon class="w-5 h-5" />
                      </div>
                      <div>
                        <p class="text-xs font-bold text-gray-500 mb-0.5">Date</p>
                        <p class="text-sm font-bold text-gray-900">{{ formatDate(appointment.scheduledDate) }}</p>
                      </div>
                    </div>
                    <div class="bg-gray-50 rounded-2xl p-4 border border-gray-50 flex items-center gap-3">
                      <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-50 text-[#5b52e6]">
                        <ClockIcon class="w-5 h-5" />
                      </div>
                      <div>
                        <p class="text-xs font-bold text-gray-500 mb-0.5">Time</p>
                        <p class="text-sm font-bold text-gray-900">{{ appointment.startTime }} - {{ appointment.endTime }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Services -->
                  <div>
                    <h4 class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Services Booked</h4>
                    <div class="space-y-3">
                      <div v-for="(item, idx) in appointment.items" :key="idx" class="flex justify-between items-start bg-gray-50 p-4 rounded-xl border border-gray-50">
                        <div>
                          <p class="text-sm font-bold text-gray-900">{{ item.variantName || item.service?.name }}</p>
                          <p class="text-xs text-gray-500 mt-0.5">{{ item.durationInMinutes }} mins</p>
                          <div v-if="item.extras?.length" class="mt-2 space-y-1">
                            <p v-for="ext in item.extras" :key="ext.name" class="text-xs text-gray-500 flex items-center gap-1">
                              <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                              {{ ext.name }}
                            </p>
                          </div>
                        </div>
                        <p class="text-sm font-bold text-gray-900">NGN {{ getItemTotal(item).toLocaleString() }}</p>
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
                        <span>Cancel Appointment</span>
                      </button>
                    </template>
                    <div v-else class="text-center text-sm text-gray-500 bg-gray-50 rounded-xl py-3.5 border border-gray-50">
                      This appointment cannot be cancelled because it is {{ appointment.status }}.
                    </div>
                    <p class="text-xs text-center text-gray-400 mt-3">To reschedule, please cancel this booking and create a new one.</p>
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
import { ref, computed } from 'vue';
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue';
import { X as XIcon, Info as InfoIcon, Loader2, Calendar as CalendarIcon, Clock as ClockIcon } from 'lucide-vue-next';
import { appointments_api } from '@/api_factory/modules/appointments';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { useConfirmModal } from '@/composables/core/useConfirmModal';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  }
});

const emit = defineEmits(['close']);

const { showToast } = useCustomToast();
const { confirm } = useConfirmModal();

const form = ref({
  reference: '',
  email: ''
});

const loading = ref(false);
const cancelling = ref(false);
const appointment = ref<any>(null);

const closeModal = () => {
  emit('close');
  // Optional: reset state on close
  // appointment.value = null;
  // form.value = { reference: '', email: '' };
};

const handleTrackBooking = async () => {
  loading.value = true;
  try {
    const res = await appointments_api.trackAppointment(form.value.reference, form.value.email);
    appointment.value = res.data;
    showToast({ title: 'Success', message: 'Booking found successfully.', toastType: 'success' });
  } catch (e: any) {
    showToast({ title: 'Error', message: e.response?.data?.message || 'Could not find booking with those details.', toastType: 'error' });
    appointment.value = null;
  } finally {
    loading.value = false;
  }
};

const handleCancel = async () => {
  const isConfirmed = await confirm({
    title: 'Cancel Appointment',
    message: 'Are you sure you want to cancel this appointment? This action cannot be undone.',
    variant: 'danger',
    confirmText: 'Yes, Cancel'
  });
  if (!isConfirmed) return;
  
  cancelling.value = true;
  try {
    const res = await appointments_api.cancelTrackedAppointment(form.value.reference, form.value.email);
    appointment.value.status = 'cancelled';
    showToast({ title: 'Cancelled', message: 'Your appointment has been cancelled.', toastType: 'success' });
  } catch (e: any) {
    showToast({ title: 'Error', message: e.response?.data?.message || 'Could not cancel booking.', toastType: 'error' });
  } finally {
    cancelling.value = false;
  }
};

const canCancel = computed(() => {
  if (!appointment.value) return false;
  return ['pending', 'confirmed'].includes(appointment.value.status);
});

const formatDate = (iso: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
};

const getItemTotal = (item: any) => {
  let total = item.price;
  if (item.extras) {
    total += item.extras.reduce((sum: number, ext: any) => sum + ext.price, 0);
  }
  return total;
};

const statusClass = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-amber-100 text-amber-800';
    case 'confirmed': return 'bg-emerald-100 text-emerald-800';
    case 'completed': return 'bg-blue-100 text-blue-800';
    case 'cancelled': return 'bg-rose-100 text-rose-800';
    case 'no_show': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
</script>
