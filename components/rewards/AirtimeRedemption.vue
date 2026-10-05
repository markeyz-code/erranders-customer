<template>
  <div class="bg-white rounded-[2rem] border border-gray-50 p-5 shadow-sm h-full flex flex-col">
    <div class="flex items-center gap-4 mb-8">
      <div class="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl shadow-inner">📱</div>
      <div>
        <h3 class="text-xl font-bold text-gray-900 tracking-tight">Convert to Airtime</h3>
        <p class="text-sm font-bold text-gray-400 uppercase  mt-1">1 Point = ₦1 Airtime</p>
      </div>
    </div>

    <div class="space-y-6 flex-1">
      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-400 uppercase  ml-1">Phone Number</label>
        <div class="relative group">
          <input 
            v-model="phone" 
            type="tel" 
            placeholder="08123456789"
            class="w-full bg-gray-50 border border-gray-50 rounded-2xl px-4 py-4 text-base font-bold text-gray-900 outline-none focus:border-parentPrimary/20 focus:bg-white transition-all group-hover:bg-gray-100/50"
          />
          <div class="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-parentPrimary bg-parentPrimary/10 px-2 py-1 rounded-lg">MTN/GLO/AIRTEL</div>
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium text-gray-400 uppercase  ml-1">Amount to Convert (Points)</label>
        <div class="relative group">
          <input 
            v-model.number="points" 
            type="number" 
            :placeholder="`Max: ${user?.points || 0}`"
            class="w-full bg-gray-50 border border-gray-50 rounded-2xl px-4 py-4 text-base font-bold text-gray-900 outline-none focus:border-parentPrimary/20 focus:bg-white transition-all group-hover:bg-gray-100/50"
          />
          <div class="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-900">pts</div>
        </div>
        <div class="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            v-for="amt in [200, 500, 1000, 2000]" 
            :key="amt"
            @click="points = amt"
            class="px-4 py-2 rounded-xl border border-gray-50 text-sm font-medium  hover:border-parentPrimary hover:text-parentPrimary transition-all whitespace-nowrap"
            :class="points === amt ? 'bg-parentPrimary/10 border-parentPrimary text-parentPrimary' : 'bg-white text-gray-400'"
          >
            ₦{{ amt }}
          </button>
        </div>
      </div>
    </div>

    <div class="mt-8 pt-6 border-t border-gray-50 flex flex-col gap-4">
      <div class="flex justify-between items-center px-1">
        <span class="text-sm font-medium text-gray-400 uppercase ">You will receive</span>
        <span class="text-xl font-medium text-gray-900 tracking-tighter">₦{{ points || 0 }} Airtime</span>
      </div>

      <button 
        @click="handleRedeem"
        :disabled="loading || !isValid"
        class="w-full py-4 bg-gray-900 text-white rounded-2xl text-sm font-medium tracking-[0.2em] hover:bg-parentPrimary transition-all disabled:opacity-50 flex items-center justify-center gap-2 group shadow-sm border border-gray-50 hover:-translate-y-1 active:translate-y-0"
      >
        <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
        <template v-else>
          <span>REDEEM NOW</span>
          <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </template>
      </button>
      
      <p v-if="error" class="text-center text-sm font-medium text-rose-500 uppercase  mt-2">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Loader2, ArrowRight } from 'lucide-vue-next';
import { useUser } from '@/composables/modules/auth/user';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';

const { user } = useUser();
const { showToast } = useCustomToast();

const phone = ref(user.value?.phone || '');
const points = ref<number | null>(null);
const loading = ref(false);
const error = ref('');

const isValid = computed(() => {
  return phone.value.length >= 10 && 
         points.value && 
         points.value >= 100 && 
         points.value <= (user.value?.points || 0);
});

const handleRedeem = async () => {
  if (!isValid.value) return;
  
  loading.value = true;
  error.value = '';
  
  try {
    const res = await api.post('/rewards/convert-airtime', {
      points: points.value,
      phoneNumber: phone.value
    });
    
    if (res.data?.success) {
      showToast({
        title: 'Success! 🚀',
        message: res.data.message || 'Airtime sent successfully!',
        toastType: 'success'
      });
      // Update local user points (the user cookie should be updated by the server or we do it here)
      if (user.value && points.value) {
        user.value.points = (user.value.points || 0) - points.value;
      }
      points.value = null;
    }
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Transaction failed. Try again later.';
    showToast({
      title: 'Failed',
      message: error.value,
      toastType: 'error'
    });
  } finally {
    loading.value = false;
  }
};
</script>
