<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-md transition-opacity" @click="$emit('close')"></div>
      
      <div class="relative bg-white rounded-3xl max-w-md w-full overflow-hidden transform transition-all group">
        <!-- Header Image / Pattern -->
        <div class="relative h-32 bg-[#171310] overflow-hidden flex items-center justify-center">
          <div class="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
          <div class="absolute top-0 right-0 w-32 h-32 bg-[#FF5C1A]/20 rounded-full blur-[40px] -mr-10 -mt-10"></div>
          
          <div class="relative z-10 w-16 h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center rotate-12 group-hover:rotate-6 transition-transform">
            <Coins class="w-8 h-8 text-[#FF5C1A]" />
          </div>
        </div>

        <!-- Content -->
        <div class="p-6">
          <div class="text-center mb-6">
            <h3 class="ff-display text-2xl font-bold text-[#171310] tracking-tight mb-1">Redeem Your Points</h3>
            <p class="text-[13px] text-[#9C968E] font-medium leading-relaxed">
              Convert your hard-earned points into real cash! Use it to buy food or run errands instantly.
            </p>
          </div>

          <!-- Points Balance -->
          <div class="bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl p-4 flex items-center justify-between mb-6">
            <div>
              <p class="ff-mono text-[9px] font-bold text-[#9C968E] uppercase tracking-widest mb-1">Available Points</p>
              <p class="ff-display text-2xl font-bold text-[#171310] leading-none">{{ currentPoints.toLocaleString() }} <span class="text-sm text-[#FF5C1A]">pts</span></p>
            </div>
            <div class="w-10 h-10 bg-white border border-[#E7E2DA] rounded-lg flex items-center justify-center">
              <Wallet class="w-5 h-5 text-[#9C968E]" />
            </div>
          </div>

          <div v-if="currentPoints < 500" class="flex items-start gap-3 p-3 bg-rose-50 border border-rose-100 rounded-xl mb-6">
            <AlertCircle class="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
            <p class="text-xs font-medium text-rose-700 leading-relaxed">
              You need a minimum of 500 points to redeem cash into your wallet. Complete more errands to earn points!
            </p>
          </div>

          <!-- Redemption Input -->
          <div v-else class="space-y-4 mb-6">
            <div>
              <label class="block text-xs font-bold text-[#171310] mb-2">Points to Convert</label>
              <div class="relative">
                <input 
                  type="number" 
                  v-model="pointsToRedeem"
                  :max="currentPoints"
                  min="500"
                  class="w-full bg-white border border-[#E7E2DA] rounded-xl px-4 py-3 text-sm font-bold text-[#171310] focus:outline-none focus:border-[#FF5C1A] focus:ring-2 focus:ring-[#FF5C1A]/10 transition-all"
                  placeholder="Enter amount (min. 500)"
                />
                <button 
                  @click="pointsToRedeem = currentPoints"
                  class="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#FAF8F5] text-[10px] font-bold text-[#FF5C1A] rounded-lg hover:bg-[#FF5C1A]/10 transition-colors uppercase tracking-wider"
                >
                  Max
                </button>
              </div>
            </div>

            <!-- Conversion Preview -->
            <div class="flex items-center justify-center gap-4 text-sm font-bold text-[#9C968E]">
              <span class="flex items-center gap-1"><Coins class="w-4 h-4" /> {{ (pointsToRedeem || 0).toLocaleString() }}</span>
              <ArrowRight class="w-4 h-4 text-[#E7E2DA]" />
              <span class="flex items-center gap-1 text-[#FF5C1A]"><Wallet class="w-4 h-4" /> ₦{{ (pointsToRedeem || 0).toLocaleString() }}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-col sm:flex-row gap-3">
            <button 
              type="button" 
              class="flex-1 py-3 px-4 bg-white border border-[#E7E2DA] text-[#171310] text-[13px] font-bold rounded-xl hover:bg-[#FAF8F5] transition-all active:scale-95"
              @click="$emit('close')"
            >
              Maybe Later
            </button>
            <button 
              type="button" 
              class="flex-1 py-3 px-4 bg-[#FF5C1A] text-white text-[13px] font-bold rounded-xl hover:bg-[#e6511a] transition-all shadow-lg shadow-[#FF5C1A]/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              :disabled="loading || currentPoints < 500 || pointsToRedeem < 500 || pointsToRedeem > currentPoints"
              @click="handleRedeem"
            >
              <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
              <span v-else>Convert to Cash</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Coins, Wallet, ArrowRight, AlertCircle, Loader2 } from 'lucide-vue-next';
import { useNuxtApp } from '#app';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { rewards_api } from '@/api_factory/modules/rewards';

const props = defineProps<{
  isOpen: boolean;
  currentPoints: number;
}>();

const emit = defineEmits(['close', 'redeemed']);
const { showToast } = useCustomToast();

const pointsToRedeem = ref<number | ''>('');
const loading = ref(false);

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    pointsToRedeem.value = '';
  }
});

const handleRedeem = async () => {
  if (!pointsToRedeem.value || pointsToRedeem.value < 500 || pointsToRedeem.value > props.currentPoints) {
    return;
  }

  loading.value = true;
  try {
    const res = await rewards_api.redeemPoints(Number(pointsToRedeem.value)) as any;

    if (res?.type === 'ERROR') {
      showToast({
        title: "Error",
        message: res?.data?.message || 'Failed to redeem points',
        toastType: "error",
        duration: 3000
      });
      return;
    }

    showToast({
        title: "Success",
        message: res?.data?.message || 'Points redeemed successfully!',
        toastType: "success",
        duration: 3000
      });
    emit('redeemed', res?.data?.remainingPoints);
    emit('close');
  } catch (error: any) {
    console.error("Redeem error:", error);
    showToast({
        title: "Error",
        message: error?.response?.data?.message || error?.message || 'Failed to redeem points',
        toastType: "error",
        duration: 3000
      });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}
</style>
