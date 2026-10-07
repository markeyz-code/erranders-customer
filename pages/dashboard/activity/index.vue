<template>
  <div class="h-[calc(100vh-12rem)] relative bg-white rounded-3xl border-[0.5px] border-gray-100 overflow-hidden animate-fade-in">

    <!-- Slider: on mobile this is a 200%-wide track that translates between the list and detail panes.
         On md+ it resets to a normal side-by-side flex row. -->
    <div
      class="flex h-full w-[200%] md:w-full"
      :style="sliderStyle"
    >

      <!-- Left Panel: Appointment List -->
      <div class="w-1/2 md:w-[350px] lg:w-[400px] shrink-0 border-r-[0.5px] border-gray-50 flex flex-col bg-white h-full overflow-hidden">
        <div class="p-4 pb-0 border-b-[0.5px] border-gray-50">
          <h1 class="text-2xl font-bold text-gray-900 mb-4">Activity</h1>

          <!-- Activity Categories -->
          <div class="flex items-center gap-6 overflow-x-auto hide-scrollbar border-b-[0.5px] border-gray-100">
            <button 
              v-for="tab in ['All', 'Appointments', 'Gift cards', 'Memberships', 'Products', 'Packages']" 
              :key="tab"
              class="pb-3 text-sm font-bold whitespace-nowrap transition-colors relative"
              :class="selectedCategory === tab ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'"
              @click="selectedCategory = tab"
            >
              {{ tab }}
              <div v-if="selectedCategory === tab" class="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900 rounded-t-full"></div>
            </button>
          </div>
        </div>

        <!-- Upcoming / Past Toggle -->
        <div class="px-4 py-4 border-b-[0.5px] border-gray-50">
          <div class="bg-gray-50 p-1 rounded-xl flex">
            <button 
              @click="timeFilter = 'upcoming'"
              class="flex-1 py-2 text-sm font-bold rounded-lg transition-all"
              :class="timeFilter === 'upcoming' ? 'bg-white text-gray-900 border-[0.5px] border-gray-100' : 'text-gray-500 hover:text-gray-700'"
            >
              Upcoming
            </button>
            <button 
              @click="timeFilter = 'past'"
              class="flex-1 py-2 text-sm font-bold rounded-lg transition-all"
              :class="timeFilter === 'past' ? 'bg-white text-gray-900 border-[0.5px] border-gray-100' : 'text-gray-500 hover:text-gray-700'"
            >
              Past
            </button>
          </div>
        </div>

        <!-- List -->
        <div class="flex-1 overflow-y-auto hide-scrollbar p-3">
          <div v-if="loading" class="space-y-3">
            <div v-for="i in 3" :key="i" class="h-24 bg-gray-50 rounded-2xl animate-pulse border-[0.5px] border-gray-100"></div>
          </div>

          <div v-else-if="filteredAppointments.length === 0" class="h-full flex flex-col items-center justify-center text-center p-4">
            <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Calendar class="w-8 h-8 text-gray-300" />
            </div>
            <h3 class="text-gray-900 font-bold mb-1">No {{ timeFilter }} activity</h3>
            <p class="text-sm text-gray-500">You don't have any {{ timeFilter }} appointments yet.</p>
          </div>

          <div v-else class="space-y-2">
            <button 
              v-for="apt in filteredAppointments" 
              :key="apt._id"
              @click="selectAppointment(apt)"
              class="w-full text-left p-4 rounded-2xl border-[0.5px] transition-all duration-150 active:scale-[0.97] active:bg-gray-100"
              :class="selectedAppointment?._id === apt._id ? 'border-gray-25bg-gray-50' : 'border-transparent hover:bg-gray-50'"
            >
              <div class="flex justify-between items-start mb-2">
                <span class="text-sm font-bold text-gray-500 uppercase tracking-wider">{{ formatDate(apt.scheduledDate) }}</span>
                <span 
                  class="px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider"
                  :class="{
                    'bg-emerald-100 text-emerald-700': apt.status === 'confirmed' || apt.status === 'completed',
                    'bg-amber-100 text-amber-700': apt.status === 'pending',
                    'bg-rose-100 text-rose-700': apt.status === 'cancelled'
                  }"
                >
                  {{ apt.status }}
                </span>
              </div>
              <h4 class="font-bold text-gray-900 truncate">{{ apt.vendor?.storeName || 'Venue' }}</h4>
              <p class="text-sm text-gray-500 truncate mt-0.5">{{ getServiceNames(apt) }}</p>
            </button>
          </div>
        </div>
      </div>

      <!-- Right Panel: Details -->
      <div
        class="w-1/2 md:flex-1 shrink-0 bg-gray-50/50 overflow-y-auto hide-scrollbar relative h-full touch-pan-y"
        :class="{ 'shadow-[-8px_0_24px_-4px_rgba(0,0,0,0.08)]': selectedAppointment }"
        @touchstart="onTouchStart"
        @touchmove="onTouchMove"
        @touchend="onTouchEnd"
        @touchcancel="onTouchEnd"
      >
        <div v-if="!selectedAppointment" class="absolute inset-0 flex flex-col items-center justify-center text-center p-5">
          <div class="w-20 h-20 bg-white rounded-3xl border-[0.5px] border-gray-100 flex items-center justify-center mb-6">
            <CalendarSearch class="w-10 h-10 text-gray-300" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">Select an activity</h3>
          <p class="text-sm text-gray-500 max-w-sm">Choose an appointment from the list to view its full details, modify your booking, or contact the venue.</p>
        </div>

        <div v-else class="h-full flex flex-col">
          <!-- Detail Header Image -->
          <div class="h-48 bg-gray-200 relative shrink-0">
            <!-- Back button on Mobile -->
            <button @click="selectedAppointment = null" class="absolute top-4 left-4 z-10 w-10 h-10 bg-black/40 hover:bg-black/60 transition-colors backdrop-blur-md rounded-full flex items-center justify-center text-white md:hidden border border-white/20 active:scale-90">
              <ArrowLeft class="w-5 h-5" />
            </button>

            <img :src="selectedAppointment.vendor?.banner || selectedAppointment.vendor?.logo || 'https://placehold.co/800x400/eeeeee/999999?text=Store+Banner'" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div class="absolute bottom-6 left-6 text-white">
              <span class="px-2.5 py-1 bg-emerald-500 rounded-lg text-sm font-bold uppercase tracking-wider mb-2 inline-block">
                {{ selectedAppointment.status }}
              </span>
              <h2 class="text-3xl font-bold">{{ selectedAppointment.vendor?.storeName || 'Venue' }}</h2>
            </div>
          </div>

          <div class="p-5 max-w-3xl mx-auto w-full flex-1">
            <!-- Date & Time -->
            <div class="flex items-center gap-4 bg-white p-5 rounded-2xl border-[0.5px] border-gray-100 mb-6">
              <div class="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center text-white shrink-0">
                <CalendarClock class="w-6 h-6" />
              </div>
              <div>
                <p class="text-lg font-bold text-gray-900">{{ formatFullDate(selectedAppointment.scheduledDate) }}</p>
                <p class="text-sm text-gray-500">at {{ formatTime(selectedAppointment.startTime) }}</p>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="grid grid-cols-4 gap-3 mb-8">
              <button v-if="['pending', 'confirmed'].includes(selectedAppointment.status)" @click="openReschedule" class="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border-[0.5px] border-gray-100 hover:border-gray-25hover:bg-gray-50 transition-all group active:scale-95">
                <CalendarPlus class="w-6 h-6 text-gray-400 group-hover:text-gray-900 transition-colors" />
                <span class="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Reschedule</span>
              </button>
              <button class="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border-[0.5px] border-gray-100 hover:border-gray-25hover:bg-gray-50 transition-all group active:scale-95">
                <MapPin class="w-6 h-6 text-gray-400 group-hover:text-gray-900 transition-colors" />
                <span class="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Directions</span>
              </button>
              <button @click="openChat" class="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border-[0.5px] border-gray-100 hover:border-gray-25hover:bg-gray-50 transition-all group active:scale-95">
                <MessageSquare class="w-6 h-6 text-gray-400 group-hover:text-gray-900 transition-colors" />
                <span class="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Message</span>
              </button>
              <button v-if="['pending', 'confirmed'].includes(selectedAppointment.status)" @click="showCancelModal = true" class="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border-[0.5px] border-red-100 hover:border-red-500 hover:bg-red-50 transition-all group active:scale-95">
                <XCircle class="w-6 h-6 text-red-400 group-hover:text-red-500 transition-colors" />
                <span class="text-sm font-bold text-red-500 group-hover:text-red-600 transition-colors">Cancel</span>
              </button>
              <NuxtLink v-else :to="`/vendors/${typeof selectedAppointment.vendor === 'string' ? selectedAppointment.vendor : selectedAppointment.vendor?._id}`" class="flex flex-col items-center justify-center gap-2 p-4 bg-white rounded-2xl border-[0.5px] border-gray-100 hover:border-gray-25hover:bg-gray-50 transition-all group text-center active:scale-95">
                <Store class="w-6 h-6 text-gray-400 group-hover:text-gray-900 transition-colors" />
                <span class="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Venue</span>
              </NuxtLink>
            </div>

            <!-- Order Details -->
            <h3 class="text-lg font-bold text-gray-900 mb-4">Order Details</h3>
            <div class="bg-white rounded-3xl border-[0.5px] border-gray-100 overflow-hidden">
              <div class="divide-y divide-gray-50">
                <div v-for="item in selectedAppointment.items" :key="item._id" class="p-5 flex justify-between gap-4">
                  <div class="flex-1">
                    <h4 class="font-bold text-gray-900">{{ item.service?.name }}</h4>
                    <p class="text-sm text-gray-500 mt-1" v-if="item.variant">{{ item.variant.name }}</p>

                    <div v-if="item.extras?.length" class="mt-2 space-y-1">
                      <p v-for="ext in item.extras" :key="ext.name" class="text-sm text-gray-400 flex items-center gap-1.5">
                        <Plus class="w-3 h-3" /> {{ ext.name }} (+₦{{ ext.price }})
                      </p>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="font-bold text-gray-900">₦{{ calculateItemPrice(item).toLocaleString() }}</p>
                    <p class="text-sm text-gray-400 mt-1">{{ item.durationInMinutes || item.service?.durationInMinutes || 30 }} min</p>
                  </div>
                </div>
              </div>

              <div class="p-5 bg-gray-50 border-t-[0.5px] border-gray-100">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-sm text-gray-500 font-bold">Subtotal</span>
                  <span class="text-sm text-gray-900 font-bold">₦{{ selectedAppointment.price?.toLocaleString() || 0 }}</span>
                </div>
                <div class="flex justify-between items-center text-lg">
                  <span class="font-bold text-gray-900">Total</span>
                  <span class="font-bold text-gray-900">₦{{ selectedAppointment.price?.toLocaleString() || 0 }}</span>
                </div>
              </div>
            </div>

            <!-- Cancellation Policy -->
            <div class="mt-8 p-5 bg-orange-50 border-[0.5px] border-orange-100 rounded-2xl">
              <div class="flex items-start gap-3">
                <Info class="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <h4 class="text-sm font-bold text-orange-900 mb-1">Cancellation Policy</h4>
                  <p class="text-sm text-orange-700/80 leading-relaxed">Cancel up to 24 hours before your appointment for a full refund. Cancellations within 24 hours will incur a cancellation fee equal to 50% of the total appointment cost.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>

  <!-- Cancel Confirmation Modal -->
  <div v-if="showCancelModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
    <div class="bg-white w-full max-w-sm rounded-3xl p-4 border-[0.5px] border-gray-100 animate-slide-up-modal">
      <div class="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <XCircle class="w-6 h-6 text-red-500" />
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-2">Cancel Appointment?</h3>
      <p class="text-sm text-gray-500 mb-6 leading-relaxed">Are you sure you want to cancel this booking with {{ selectedAppointment?.vendor?.storeName }}? Please check the cancellation policy for any fees.</p>

      <div class="flex gap-3">
        <button @click="showCancelModal = false" class="flex-1 py-3 bg-gray-100 text-gray-900 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all" :disabled="processing">
          Keep Booking
        </button>
        <button @click="confirmCancel" class="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 transition-all" :disabled="processing">
          {{ processing ? 'Cancelling...' : 'Yes, Cancel' }}
        </button>
      </div>
    </div>
  </div>

  <!-- Reschedule Modal -->
  <div v-if="showRescheduleModal" class="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-gray-900/40 backdrop-blur-sm animate-fade-in">
    <div class="bg-white w-full md:w-[480px] rounded-t-3xl md:rounded-3xl border-[0.5px] border-gray-100 flex flex-col max-h-[85vh] animate-slide-up-modal">
      <div class="p-4 border-b-[0.5px] border-gray-100 flex items-center justify-between shrink-0">
        <h2 class="text-base font-bold text-gray-900">Reschedule Booking</h2>
        <button @click="showRescheduleModal = false" class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
          <X class="w-4 h-4" />
        </button>
      </div>

      <div class="p-4 overflow-y-auto space-y-6 flex-1 hide-scrollbar">
        <!-- Date Selection -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-bold text-gray-900 text-sm">Select next available date</h3>
          </div>
          <div class="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
            <button 
              v-for="date in availableDates" 
              :key="date.iso"
              @click="selectedDate = date.iso"
              class="min-w-[60px] h-[70px] rounded-2xl flex flex-col items-center justify-center border-[0.5px] transition-all shrink-0"
              :class="selectedDate === date.iso ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'"
            >
              <span class="text-[10px] font-medium opacity-70">{{ date.dayStr }}</span>
              <span class="text-lg font-bold">{{ date.dayNum }}</span>
            </button>
          </div>
        </div>

        <!-- Time Selection -->
        <div>
          <h3 class="font-bold text-gray-900 text-sm mb-3">Select time</h3>
          <div class="grid grid-cols-3 gap-2">
            <button 
              v-for="time in availableTimes" 
              :key="time"
              @click="selectedTime = time"
              class="text-center px-3 py-2.5 rounded-xl border-[0.5px] transition-all text-sm font-semibold"
              :class="selectedTime === time ? 'bg-gray-900 border-gray-25text-white' : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'"
            >
              {{ time }}
            </button>
          </div>
        </div>
      </div>

      <div class="p-4 border-t-[0.5px] border-gray-100 bg-white shrink-0">
        <button 
          @click="confirmReschedule"
          :disabled="!selectedDate || !selectedTime || processing"
          class="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-all disabled:opacity-50"
        >
          {{ processing ? 'Updating...' : 'Confirm Reschedule' }}
        </button>
      </div>
    </div>
  </div>

  <!-- Chat Modal -->
  <AppointmentChatModal 
    v-if="selectedAppointment"
    :is-open="showChatModal"
    :appointment-id="selectedAppointment._id"
    :vendor-id="typeof selectedAppointment.vendor === 'object' ? selectedAppointment.vendor?._id : selectedAppointment.vendor"
    :vendor-owner-id="typeof selectedAppointment.vendor?.owner === 'object' ? selectedAppointment.vendor?.owner?._id : selectedAppointment.vendor?.owner"
    :vendor-name="selectedAppointment.vendor?.storeName || 'Venue'"
    :vendor-avatar="selectedAppointment.vendor?.logo"
    @close="showChatModal = false"
  />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { 
  Calendar, CalendarSearch, CalendarClock, CalendarPlus, 
  MapPin, MessageSquare, Store, Plus, Info, XCircle, X, ArrowLeft
} from 'lucide-vue-next';
import AppointmentChatModal from '@/components/core/AppointmentChatModal.vue';
import { useCustomToast } from "@/composables/core/useCustomToast";
import { appointments_api } from '@/api_factory/modules/appointments';
import { useRealtimeSocket } from '@/composables/core/useRealtimeSocket';

definePageMeta({
  layout: 'student',
});

useHead({ title: 'My Activity - Errandr' });

const loading = ref(true);
const appointments = ref<any[]>([]);
const selectedCategory = ref('Appointments');
const timeFilter = ref('upcoming'); // 'upcoming' | 'past'
const selectedAppointment = ref<any>(null);

const showCancelModal = ref(false);
const showRescheduleModal = ref(false);
const showChatModal = ref(false);
const processing = ref(false);
const selectedDate = ref('');
const selectedTime = ref('');

const { showToast } = useCustomToast();
const { socket, connectSocket } = useRealtimeSocket();

const isMobileView = ref(true);

onMounted(() => {
  if (typeof window !== 'undefined') {
    isMobileView.value = window.innerWidth < 768;
    window.addEventListener('resize', () => {
      isMobileView.value = window.innerWidth < 768;
    });
  }
});

/* ---------------------------------------------------------
   Mobile list -> detail "push" transition + swipe-to-go-back
--------------------------------------------------------- */
const isDragging = ref(false);
const dragAxis = ref<'x' | 'y' | null>(null);
const dragPx = ref(0);
const touchStartX = ref(0);
const touchStartY = ref(0);

const selectAppointment = (apt: any) => {
  selectedAppointment.value = apt;
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try { navigator.vibrate(8); } catch (e) { /* no-op */ }
  }
};

const onTouchStart = (e: TouchEvent) => {
  if (!selectedAppointment.value) return;
  const t = e.touches[0];
  touchStartX.value = t.clientX;
  touchStartY.value = t.clientY;
  isDragging.value = true;
  dragAxis.value = null;
  dragPx.value = 0;
};

const onTouchMove = (e: TouchEvent) => {
  if (!isDragging.value) return;
  const t = e.touches[0];
  const dx = t.clientX - touchStartX.value;
  const dy = t.clientY - touchStartY.value;

  if (!dragAxis.value) {
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
    dragAxis.value = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
  }

  if (dragAxis.value !== 'x') return;
  if (dx < 0) {
    dragPx.value = 0;
    return;
  }
  // We're dragging right to go "back" - take over from vertical scroll
  e.preventDefault();
  dragPx.value = Math.min(dx, typeof window !== 'undefined' ? window.innerWidth : dx);
};

const onTouchEnd = () => {
  if (!isDragging.value) return;
  isDragging.value = false;
  const width = typeof window !== 'undefined' ? window.innerWidth : 0;
  const threshold = width * 0.28;
  if (dragAxis.value === 'x' && dragPx.value > threshold) {
    selectedAppointment.value = null;
  }
  dragPx.value = 0;
  dragAxis.value = null;
};

const sliderStyle = computed(() => {
  if (!isMobileView.value) return {};
  const base = selectedAppointment.value ? -50 : 0;
  const dragging = isDragging.value && dragAxis.value === 'x';
  return {
    transform: `translate3d(calc(${base}% + ${dragPx.value}px), 0, 0)`,
    transition: dragging ? 'none' : 'transform 0.38s cubic-bezier(0.32, 0.72, 0, 1)',
  };
});

const availableDates = computed(() => {
  const dates = [];
  let baseDate = new Date();
  for(let i=0; i<14; i++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    dates.push({
      iso: `${year}-${month}-${day}`,
      dayStr: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getDate(),
      monthStr: d.toLocaleDateString('en-US', { month: 'short' })
    });
  }
  return dates;
});

const availableTimes = computed(() => {
  const times = [];
  for(let i=9; i<=17; i++) {
    times.push(`${i > 12 ? i-12 : i}:00 ${i >= 12 ? 'pm' : 'am'}`);
    if (i !== 17) {
      times.push(`${i > 12 ? i-12 : i}:30 ${i >= 12 ? 'pm' : 'am'}`);
    }
  }
  return times;
});

const openReschedule = () => {
  if (selectedAppointment.value) {
    selectedDate.value = selectedAppointment.value.scheduledDate.split('T')[0] || '';
    // map 24h to 12h for initial selection if possible, or just leave blank
    selectedTime.value = '';
  }
  showRescheduleModal.value = true;
};

const openChat = () => {
  if (!selectedAppointment.value?.vendor) {
    showToast({ title: 'Error', message: 'Vendor information is incomplete. Cannot start chat.', toastType: 'error' });
    return;
  }
  showChatModal.value = true;
};

const confirmCancel = async () => {
  if (!selectedAppointment.value) return;
  processing.value = true;
  try {
    await appointments_api.cancelAppointment(selectedAppointment.value._id);
    showToast({ title: 'Success', message: 'Booking cancelled successfully', toastType: 'success' });
    showCancelModal.value = false;
    await fetchAppointments();
    // Update the selected appointment so the UI refreshes
    selectedAppointment.value = appointments.value.find((a: any) => a._id === selectedAppointment.value._id) || null;
  } catch (error: any) {
    showToast({ title: 'Error', message: error?.response?.data?.message || 'Failed to cancel', toastType: 'error' });
  } finally {
    processing.value = false;
  }
};

const confirmReschedule = async () => {
  if (!selectedAppointment.value || !selectedDate.value || !selectedTime.value) return;
  processing.value = true;
  try {
    const [timeStr, modifier] = selectedTime.value.split(' ');
    let [hours, minutes] = timeStr.split(':').map(Number);
    if (modifier === 'pm' && hours !== 12) hours += 12;
    if (modifier === 'am' && hours === 12) hours = 0;

    // Default duration approx 60 min if total not easily calculated from here
    let totalDurationMins = selectedAppointment.value.items?.reduce((sum: number, item: any) => sum + (item.durationInMinutes || 30), 0) || 60;

    const endD = new Date(selectedDate.value);
    endD.setHours(hours, minutes + totalDurationMins);
    const endTime = `${endD.getHours().toString().padStart(2, '0')}:${endD.getMinutes().toString().padStart(2, '0')}`;
    const startTime24 = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    await appointments_api.rescheduleAppointment(selectedAppointment.value._id, {
      scheduledDate: selectedDate.value,
      startTime: startTime24,
      endTime
    });

    showToast({ title: 'Success', message: 'Booking rescheduled successfully', toastType: 'success' });
    showRescheduleModal.value = false;
    await fetchAppointments();
    selectedAppointment.value = appointments.value.find((a: any) => a._id === selectedAppointment.value._id) || null;
  } catch (error: any) {
    showToast({ title: 'Error', message: error?.response?.data?.message || 'Failed to reschedule', toastType: 'error' });
  } finally {
    processing.value = false;
  }
};

const fetchAppointments = async () => {
  loading.value = true;
  try {
    const res = await appointments_api.getMyAppointments();
    appointments.value = res.data;
  } catch (error) {
    console.error('Error fetching appointments', error);
  } finally {
    loading.value = false;
  }
};

const filteredAppointments = computed(() => {
  const now = new Date();

  let filtered = appointments.value;

  if (selectedCategory.value === 'Appointments') {
    // Already appointments
  } else if (selectedCategory.value === 'All') {
    // All activities
  } else {
    // Empty array for unsupported categories for now
    return [];
  }

  return filtered.filter(apt => {
    const aptDate = new Date(`${apt.scheduledDate}T${apt.startTime || '00:00'}`);
    if (timeFilter.value === 'upcoming') {
      return aptDate >= now || apt.status === 'pending' || apt.status === 'confirmed';
    } else {
      return aptDate < now || apt.status === 'completed' || apt.status === 'cancelled';
    }
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
});

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatFullDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
};

const formatTime = (timeStr: string) => {
  if (!timeStr) return '';
  // Convert 24h to 12h
  const [h, m] = timeStr.split(':');
  const hour = parseInt(h);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
};

const getServiceNames = (apt: any) => {
  if (!apt.items || apt.items.length === 0) return 'Service Booking';
  return apt.items.map((i: any) => i.service?.name || 'Service').join(', ');
};

const calculateItemPrice = (item: any) => {
  let total = item.price || 0;
  if (item.extras && item.extras.length) {
    total += item.extras.reduce((acc: number, ext: any) => acc + (ext.price || 0), 0);
  }
  return total;
};

onMounted(() => {
  fetchAppointments();

  if (!socket.value) {
    connectSocket();
  }

  if (socket.value) {
    socket.value.on('notification', (payload: any) => {
      if (payload && (payload.type === 'BOOKING_CONFIRMED' || payload.type === 'BOOKING_UPDATE')) {
        fetchAppointments();
      }
    });
  }
});

onUnmounted(() => {
  if (socket.value) {
    socket.value.off('notification');
  }
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>