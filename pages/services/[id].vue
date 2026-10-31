<template>
  <main class="min-h-screen bg-slate-50/50 pb-28 lg:pb-16 font-sans">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
      <!-- Breadcrumb navigation -->
      <button
        @click="$router.back()"
        type="button"
        class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors mb-6 group cursor-pointer"
      >
        <ChevronLeft class="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
        <span>Back to services</span>
      </button>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        <div class="lg:col-span-7 space-y-4">
          <div class="h-64 sm:h-80 rounded-3xl bg-slate-200/70 animate-pulse" />
          <div class="h-8 w-3/4 rounded-xl bg-slate-200/70 animate-pulse" />
          <div class="h-4 w-1/2 rounded-lg bg-slate-200/70 animate-pulse" />
        </div>
        <div class="lg:col-span-5 h-96 rounded-3xl bg-slate-200/70 animate-pulse" />
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="py-16 text-center max-w-lg mx-auto bg-white rounded-3xl border border-red-100 p-8 shadow-sm">
        <div class="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4 text-red-500">
          <AlertTriangle class="w-7 h-7" />
        </div>
        <h2 class="text-xl font-extrabold text-slate-900">We couldn't load this service</h2>
        <p class="text-sm text-slate-500 mt-2">{{ error }}</p>
        <button
          type="button"
          class="mt-6 px-6 py-2.5 bg-[#FF5C1A] text-white rounded-xl text-sm font-bold hover:bg-[#E54D12] transition-colors"
          @click="loadService"
        >
          Try again
        </button>
      </div>

      <!-- Main Service Content -->
      <div v-else-if="service" class="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <!-- ── Left Column: Media & Service Details ── -->
        <div class="lg:col-span-7 space-y-6">
          <!-- Image Showcase -->
          <div class="relative w-full rounded-3xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200/80">
            <div class="aspect-[16/10] sm:aspect-[16/9] w-full">
              <img
                :src="service.image || service.vendor?.banner || '/placeholder-service.jpg'"
                :alt="service.name"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Badges -->
            <div class="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
              <span class="px-3 py-1 rounded-full bg-slate-950/85 backdrop-blur text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                {{ service.category?.replace(/_/g, ' ') || 'Service' }}
              </span>
              <span v-if="service.vendor?.serviceLocation === 'mobile_operator'" class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-600/90 backdrop-blur text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                <Navigation class="w-3 h-3" /> Comes to you
              </span>
            </div>

            <div
              v-if="service.vendor?.address"
              class="absolute bottom-3 left-3 max-w-[85%] inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/95 backdrop-blur text-slate-700 border border-slate-200 shadow-sm"
            >
              <MapPin class="w-3.5 h-3.5 text-[#FF5C1A] shrink-0" />
              <span class="truncate">{{ service.vendor.address }}</span>
            </div>
          </div>

          <!-- Service Core Card -->
          <div class="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-7 shadow-2xs space-y-5">
            <div>
              <h1 class="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {{ service.name }}
              </h1>

              <div class="mt-3 flex flex-wrap items-center gap-2.5 text-xs sm:text-sm">
                <span class="font-black text-[#FF5C1A] bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-200 text-base sm:text-lg">
                  ₦{{ calculatedTotal.toLocaleString() }}
                </span>
                <span class="inline-flex items-center gap-1 text-slate-600 font-bold bg-slate-100 px-3 py-1.5 rounded-xl">
                  <Clock class="w-4 h-4 text-slate-500" /> {{ durationMinutes }} mins session
                </span>
              </div>
            </div>

            <!-- Session Duration Stepper -->
            <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-orange-50/50 via-white to-slate-50 border border-orange-200/70 space-y-3">
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-[10px] font-black uppercase tracking-wider text-[#FF5C1A]">Customize Session</span>
                  <p class="text-xs sm:text-sm font-extrabold text-slate-800">Choose session duration</p>
                </div>
                <span class="text-base font-black text-[#FF5C1A]">
                  ₦{{ calculatedTotal.toLocaleString() }}
                </span>
              </div>

              <!-- Quick Hours Buttons -->
              <div class="flex flex-wrap items-center gap-2">
                <button
                  v-for="mins in [30, 60, 90, 120]"
                  :key="mins"
                  type="button"
                  @click="durationMinutes = mins"
                  class="px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer"
                  :class="durationMinutes === mins ? 'bg-[#FF5C1A] text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:border-orange-300'"
                >
                  {{ mins >= 60 ? `${mins / 60} hr${mins > 60 ? 's' : ''}` : `${mins} mins` }}
                </button>
              </div>
            </div>

            <!-- Description -->
            <div v-if="service.description" class="pt-3 border-t border-slate-100">
              <h3 class="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">About This Service</h3>
              <p class="text-slate-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                {{ service.description }}
              </p>
            </div>
          </div>

          <!-- Provider Card -->
          <div v-if="service.vendor" class="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs">
            <p class="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3">Service Provider</p>
            <div class="flex items-start gap-3.5">
              <div class="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                <img v-if="service.vendor.logo" :src="service.vendor.logo" class="w-full h-full object-cover" />
                <span v-else class="w-full h-full flex items-center justify-center font-black text-slate-500">
                  {{ service.vendor.storeName?.charAt(0) }}
                </span>
              </div>

              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <h4 class="font-extrabold text-slate-900 text-base truncate">{{ service.vendor.storeName }}</h4>
                  <span class="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 shrink-0">
                    Verified
                  </span>
                </div>
                <p v-if="service.vendor.address" class="text-xs text-slate-500 font-medium truncate mt-0.5">
                  📍 {{ service.vendor.address }}
                </p>
                <div v-if="service.vendor.rating" class="text-xs font-bold text-amber-600 mt-1">
                  ★ {{ service.vendor.rating.toFixed(1) }} Rating
                </div>
              </div>

              <NuxtLink
                :to="`/vendors/${service.vendor._id || service.vendor.id}`"
                class="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shrink-0"
              >
                Store Page
              </NuxtLink>
            </div>
          </div>
        </div>

        <!-- ── Right Column: Booking Slot & Escrow Breakdown ── -->
        <aside class="lg:col-span-5 w-full">
          <div class="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-sm lg:sticky lg:top-6 space-y-4">
            <div>
              <span class="text-[10px] font-black uppercase tracking-wider text-[#FF5C1A] bg-orange-50 px-2 py-0.5 rounded-md">
                Direct Booking
              </span>
              <h2 class="text-lg sm:text-xl font-black text-slate-900 mt-1">
                Select Date &amp; Time
              </h2>
              <p class="text-xs text-slate-500 font-medium">
                Choose an appointment date and preferred time slot.
              </p>
            </div>

            <!-- Date Picker -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Appointment Date</label>
              <input
                v-model="bookingDate"
                type="date"
                :min="todayDate"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#FF5C1A]"
              />
            </div>

            <!-- Quick Time Slots -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">Preferred Time Window</label>
              <div class="grid grid-cols-3 gap-2">
                <button
                  v-for="time in timeSlots"
                  :key="time"
                  type="button"
                  @click="bookingTime = time"
                  class="py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer"
                  :class="bookingTime === time ? 'bg-[#FF5C1A] text-white border-[#FF5C1A] shadow-xs' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white hover:border-slate-300'"
                >
                  {{ time }}
                </button>
              </div>
            </div>

            <!-- Notes -->
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Hostel Room or Instructions (Optional)</label>
              <textarea
                v-model="bookingNotes"
                rows="2"
                placeholder="e.g. Moremi Hall, Room 204. Porter lodge pickup..."
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#FF5C1A] resize-none"
              />
            </div>

            <!-- Financial Breakdown (Escrow & Deposit) -->
            <div class="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-100 space-y-2 text-xs">
              <div class="flex items-center justify-between text-slate-600 font-medium">
                <span>Total Service Price</span>
                <span class="font-bold text-slate-900">₦{{ calculatedTotal.toLocaleString() }}</span>
              </div>
              <div class="flex items-center justify-between text-slate-600 font-medium pt-1 border-t border-orange-100/60">
                <span>Commitment Deposit (30%)</span>
                <span class="font-bold text-slate-800">₦{{ calculatedCommitmentFee.toLocaleString() }}</span>
              </div>
              <div class="flex items-center justify-between text-slate-600 font-medium pt-1 border-t border-orange-100/60">
                <span>Campus Escrow Protection Fee</span>
                <span class="font-bold text-[#FF5C1A]">₦{{ calculatedEscrowFee.toLocaleString() }}</span>
              </div>
              <div class="flex items-center justify-between pt-1.5 border-t border-orange-200 text-slate-900 font-black">
                <span>Total Due Now</span>
                <span class="text-sm text-[#FF5C1A]">₦{{ totalPayNow.toLocaleString() }}</span>
              </div>
              <div class="flex items-center justify-between pt-1 border-t border-orange-100/60 text-[11px] text-slate-500 font-semibold">
                <span>Balance upon completion</span>
                <span>₦{{ remainingBalance.toLocaleString() }}</span>
              </div>
            </div>

            <p v-if="bookingError" class="text-xs font-bold text-red-600">{{ bookingError }}</p>

            <!-- Book Button -->
            <button
              type="button"
              :disabled="submitting || !bookingDate || !bookingTime"
              @click="submitBooking"
              class="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-[#FF5C1A] text-white font-black text-sm transition-all shadow-md active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              <Loader2 v-if="submitting" class="w-4 h-4 animate-spin" />
              <span>{{ submitting ? 'Confirming Booking…' : (bookingTime ? `Confirm & Book Slot` : 'Select Date & Time Above') }}</span>
            </button>
          </div>
        </aside>
      </div>

      <!-- Confirmation Modal -->
      <div v-if="confirmed" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center space-y-4 shadow-2xl animate-fade-in">
          <div class="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-3xl border border-emerald-100">
            ✓
          </div>
          <h3 class="text-xl font-black text-slate-900">Booking Confirmed!</h3>
          <p class="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Your appointment has been submitted. The provider will receive your details and dispatch will follow up.
          </p>
          <div class="pt-2 flex flex-col gap-2">
            <NuxtLink
              to="/dashboard/activity"
              class="w-full py-3 rounded-xl bg-[#FF5C1A] text-white text-xs font-bold shadow-sm"
            >
              View in My Activity
            </NuxtLink>
            <button
              type="button"
              @click="$router.push('/vendors')"
              class="w-full py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  ChevronLeft, AlertTriangle, Navigation, MapPin, Clock, Loader2
} from 'lucide-vue-next';
import { services_api } from '@/api_factory/modules/services';
import { appointments_api } from '@/api_factory/modules/appointments';

definePageMeta({ layout: 'default' });

const route = useRoute();
const service = ref<any>(null);
const loading = ref(true);
const error = ref('');
const durationMinutes = ref(30);

const bookingDate = ref('');
const bookingTime = ref('');
const bookingNotes = ref('');
const submitting = ref(false);
const confirmed = ref(false);
const bookingError = ref('');

const timeSlots = [
  '09:00', '10:30', '12:00', '14:00', '15:30', '17:00'
];

const todayDate = computed(() => {
  return new Date().toISOString().split('T')[0];
});

const loadService = async () => {
  const id = route.params.id as string;
  if (!id) return;
  loading.value = true;
  error.value = '';
  try {
    const res = await services_api.getServiceById(id);
    service.value = res.data;
    if (service.value?.durationInMinutes) {
      durationMinutes.value = service.value.durationInMinutes;
    }
  } catch (err: any) {
    error.value = err?.message || 'Could not load service details.';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadService();
  bookingDate.value = todayDate.value;
});

const calculatedTotal = computed(() => {
  const basePrice = service.value?.price || 0;
  const baseDuration = service.value?.durationInMinutes || 30;
  if (durationMinutes.value <= baseDuration) return basePrice;
  // Scaled duration
  return Math.round(basePrice * (durationMinutes.value / baseDuration));
});

const calculatedCommitmentFee = computed(() => {
  return Math.round(calculatedTotal.value * 0.3);
});

const calculatedEscrowFee = computed(() => {
  return Math.round(calculatedTotal.value * 0.03);
});

const totalPayNow = computed(() => {
  return calculatedCommitmentFee.value + calculatedEscrowFee.value;
});

const remainingBalance = computed(() => {
  return Math.max(0, calculatedTotal.value - calculatedCommitmentFee.value);
});

const submitBooking = async () => {
  if (!bookingDate.value || !bookingTime.value) return;
  submitting.value = true;
  bookingError.value = '';

  try {
    const payload = {
      serviceId: service.value?._id,
      vendorId: service.value?.vendor?._id || service.value?.vendor,
      scheduledDate: bookingDate.value,
      startTime: bookingTime.value,
      durationInMinutes: durationMinutes.value,
      notes: bookingNotes.value,
      amount: calculatedTotal.value,
      commitmentFee: calculatedCommitmentFee.value,
    };

    await appointments_api.createAppointment(payload);
    confirmed.value = true;
  } catch (err: any) {
    bookingError.value = err?.response?.data?.message || err?.message || 'Failed to submit appointment.';
  } finally {
    submitting.value = false;
  }
};
</script>
