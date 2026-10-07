<template>
  <UiModal :isOpen="isOpen" @close="$emit('close')" title="Book Appointment">
    <div class="space-y-5">
      <div v-if="service" class="bg-gray-50 p-4 rounded-xl flex items-start gap-4">
        <div class="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 shrink-0">
          <img :src="service.image || '/placeholder-service.jpg'" class="w-full h-full object-cover" />
        </div>
        <div>
          <h3 class="font-bold text-gray-900">{{ service.name }}</h3>
          <p class="text-sm text-gray-500 mt-1">{{ service.description }}</p>
          <div class="flex items-center gap-2 mt-2 font-medium text-sm">
            <span class="text-parentPrimary">₦{{ service.price?.toLocaleString() }}</span>
            <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span class="text-gray-500">{{ service.durationInMinutes }} mins</span>
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-1.5">Select Date</label>
          <input 
            type="datetime-local" 
            v-model="bookingForm.scheduledDate" 
            :min="new Date().toISOString().split('T')[0]"
            class="w-full bg-gray-50 border border-gray-25 text-gray-900 text-base rounded-xl focus:ring-parentPrimary focus:border-parentPrimary block p-3 outline-none transition-all"
          />
        </div>
        
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-1.5">Select Time</label>
          <input 
            type="time" 
            v-model="bookingForm.startTime" 
            class="w-full bg-gray-50 border border-gray-25 text-gray-900 text-base rounded-xl focus:ring-parentPrimary focus:border-parentPrimary block p-3 outline-none transition-all"
          />
        </div>

        <div>
          <label class="block text-sm font-bold text-gray-700 mb-1.5">Notes (Optional)</label>
          <textarea 
            v-model="bookingForm.notes" 
            rows="3"
            placeholder="Any special requests?"
            class="w-full bg-gray-50 border border-gray-25 text-gray-900 text-base rounded-xl focus:ring-parentPrimary focus:border-parentPrimary block p-3 outline-none transition-all"
          ></textarea>
        </div>
      </div>

      <button 
        @click="submitBooking"
        :disabled="!isValid || loading"
        class="w-full py-3.5 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-sm border border-gray-50 hover:bg-parentPrimary hover:shadow-sm border border-gray-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <span v-if="loading" class="w-4 h-4 border border-white/20 border-t-white rounded-full animate-spin"></span>
        <span v-else>Confirm Booking</span>
      </button>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { appointments_api } from '@/api_factory/modules/appointments';
import { useCustomToast } from '@/composables/core/useCustomToast';
import UiModal from '@/components/ui/UiModal.vue';

const props = defineProps<{
  isOpen: boolean;
  service: any;
  vendorId: string;
}>();

const emit = defineEmits(['close', 'booked']);
const { showToast } = useCustomToast();

const loading = ref(false);
const bookingForm = ref({
  scheduledDate: '',
  startTime: '',
  notes: ''
});

const isValid = computed(() => !!bookingForm.value.scheduledDate && !!bookingForm.value.startTime);

const submitBooking = async () => {
  if (!isValid.value) return;
  loading.value = true;
  
  try {
    // Calculate end time
    const [hours, minutes] = bookingForm.value.startTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes + (props.service.durationInMinutes || 30));
    const endTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

    const payload = {
      vendor: props.vendorId,
      items: [{
        service: props.service._id,
        price: props.service.price,
        durationInMinutes: props.service.durationInMinutes || 30
      }],
      scheduledDate: bookingForm.value.scheduledDate,
      startTime: bookingForm.value.startTime,
      endTime,
      notes: bookingForm.value.notes
    };

    await appointments_api.createAppointment(payload);
    
    showToast({
      title: "Appointment Booked! 🎉",
      message: `Your appointment for ${props.service.name} is confirmed.`,
      toastType: "success"
    });
    
    emit('booked');
    emit('close');
  } catch (e: any) {
    showToast({
      title: "Booking Failed",
      message: e?.response?.data?.message || "An error occurred",
      toastType: "error"
    });
  } finally {
    loading.value = false;
  }
};
</script>
