<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 animate-fade-in" @click.self="$emit('close')">
      <div class="bg-white w-full md:w-[480px] rounded-t-3xl md:rounded-3xl shadow-sm border border-gray-50 overflow-hidden flex flex-col animate-slide-up-modal">
        
        <div class="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 class="text-lg font-bold text-gray-900">Join Waitlist</h2>
          <button @click="$emit('close')" class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100">
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="p-4 overflow-y-auto space-y-4">
          <p class="text-sm text-gray-600">
            This time slot ({{ time }}) on {{ date }} is currently booked. Join the waitlist, and if a spot opens up, we'll notify you!
          </p>

          <div v-if="user" class="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm font-medium">
            You will be added to the waitlist using your account: {{ user.email }}.
          </div>

          <div v-else class="space-y-3">
            <h3 class="font-bold text-sm">Your Details</h3>
            <input v-model="form.name" type="text" placeholder="Full Name" class="w-full px-4 py-3 rounded-xl border border-gray-25 focus:outline-none focus:border-gray-25focus:ring-1 focus:ring-gray-900 transition-all text-sm" />
            <input v-model="form.email" type="email" placeholder="Email Address" class="w-full px-4 py-3 rounded-xl border border-gray-25 focus:outline-none focus:border-gray-25focus:ring-1 focus:ring-gray-900 transition-all text-sm" />
            <input v-model="form.phone" type="tel" placeholder="Phone Number (Optional)" class="w-full px-4 py-3 rounded-xl border border-gray-25 focus:outline-none focus:border-gray-25focus:ring-1 focus:ring-gray-900 transition-all text-sm" />
          </div>
        </div>

        <div class="p-4 border-t border-gray-100">
          <button 
            @click="submit"
            :disabled="loading || (!user && (!form.name || !form.email))"
            class="w-full py-3 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
            <template v-else>Join Waitlist</template>
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { X, Loader2 } from 'lucide-vue-next';
import { waitlist_api } from '@/api_factory/modules/waitlist';
import { useUser } from '@/composables/modules/auth/user';
import { useCustomToast } from '@/composables/core/useCustomToast';

const props = defineProps<{
  vendor: any;
  date: string;
  time: string;
  service: any;
}>();

const emit = defineEmits(['close', 'joined']);
const { user } = useUser();
const { showToast } = useCustomToast();

const loading = ref(false);
const form = ref({
  name: '',
  email: '',
  phone: ''
});

const submit = async () => {
  loading.value = true;
  try {
    // time is like "2:00 pm". convert to 24h
    const [t, modifier] = props.time.split(' ');
    let [hours, minutes] = t.split(':').map(Number);
    if (modifier === 'pm' && hours !== 12) hours += 12;
    if (modifier === 'am' && hours === 12) hours = 0;
    const startTime24 = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    const payload = {
      vendor: props.vendor._id,
      date: props.date,
      time: startTime24,
      serviceId: props.service._id,
      userEmail: user.value ? user.value.email : form.value.email,
      userName: user.value ? `${user.value.firstName} ${user.value.lastName}` : form.value.name,
      userPhone: user.value ? user.value.phone : form.value.phone
    };

    await waitlist_api.join(payload);
    showToast({ title: 'Success', message: 'You have been added to the waitlist.', toastType: 'success' });
    emit('joined');
  } catch (error: any) {
    showToast({ title: 'Error', message: error.response?.data?.message || 'Failed to join waitlist', toastType: 'error' });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.2s ease-out; }
.animate-slide-up-modal { animation: slideUpModal 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUpModal { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
</style>
