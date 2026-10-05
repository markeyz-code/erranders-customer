<template>
  <div class="relative flex flex-col items-center justify-center p-5 bg-white rounded-[3rem] shadow-sm border border-gray-50 border border-gray-50 overflow-hidden group">
    <!-- Animated background -->
    <div class="absolute inset-0 bg-gradient-to-br from-parentPrimary/5 via-transparent to-secondary/5 opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
    
    <div class="relative z-10 text-center mb-8">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-parentPrimary/10 border border-parentPrimary/20 text-parentPrimary text-sm font-medium  uppercase mb-4">
        <Sparkles class="w-3.5 h-3.5" /> Campus Luck
      </div>
      <h2 class="text-3xl font-medium text-gray-900 tracking-tighter mb-2">Spin & Win</h2>
      <p class="text-sm font-bold text-gray-400 max-w-[250px] mx-auto">Win free delivery or meal discounts every day!</p>
    </div>

    <!-- The Wheel -->
    <div class="relative w-72 h-72 sm:w-80 sm:h-80 mb-10 perspective-1000">
      <!-- Pointer -->
      <div class="absolute -top-4 left-1/2 -translate-x-1/2 z-30 drop-shadow-sm border border-gray-50">
        <div class="w-8 h-10 bg-gray-900 rounded-b-full flex items-center justify-center pt-2">
          <div class="w-2 h-2 rounded-full bg-parentPrimary animate-pulse"></div>
        </div>
      </div>

      <!-- Outer Ring -->
      <div class="absolute inset-0 rounded-full border-[12px] border-gray-25shadow-sm border border-gray-50 z-20 pointer-events-none">
        <div v-for="i in 12" :key="i" 
          class="absolute w-2 h-2 rounded-full bg-white/30"
          :style="{ 
            left: '50%', top: '50%', 
            transform: `rotate(${i * 30}deg) translateY(-145px) translateX(-50%)`
          }"
        ></div>
      </div>

      <!-- Spinner -->
      <div 
        ref="wheel"
        class="w-full h-full rounded-full bg-white shadow-inner relative overflow-hidden transition-transform duration-[5s] cubic-bezier(0.15, 0, 0.15, 1)"
        :style="{ transform: `rotate(${rotation}deg)` }"
      >
        <div 
          v-for="(segment, index) in segments" 
          :key="index"
          class="absolute top-0 right-0 w-1/2 h-1/2 origin-bottom-left"
          :style="{ 
            transform: `rotate(${index * (360 / segments.length)}deg) skewY(${90 - (360 / segments.length)}deg)`,
            backgroundColor: segment.color
          }"
        >
          <div 
            class="absolute bottom-0 left-0 w-[200%] h-[200%] flex items-center justify-center p-12 text-center"
            :style="{ 
              transform: `skewY(-${90 - (360 / segments.length)}deg) rotate(${(360 / segments.length) / 2}deg) translate(25%, -25%)`,
            }"
          >
            <div class="flex flex-col items-center gap-1 transform -rotate-90 origin-center">
              <component :is="segment.icon" class="w-6 h-6 text-white/50" />
              <span class="text-sm font-medium text-white uppercase tracking-tighter leading-none">{{ segment.label }}</span>
            </div>
          </div>
        </div>

        <!-- Center Hub -->
        <div class="absolute inset-0 m-auto w-16 h-16 bg-gray-900 rounded-full z-10 shadow-sm border border-gray-50 flex items-center justify-center border-4 border-white/10">
          <div class="w-4 h-4 bg-parentPrimary rounded-full animate-ping opacity-40"></div>
          <Zap class="absolute w-6 h-6 text-parentPrimary fill-current" />
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="relative z-10 w-full px-4">
      <button 
        @click="spinPlan"
        :disabled="isSpinning"
        class="w-full py-5 bg-gray-900 text-white rounded-[2rem] font-medium text-sm tracking-[0.2em] uppercase hover:bg-parentPrimary hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale disabled:scale-100 shadow-sm border border-gray-50 shadow-black/20"
      >
        {{ isSpinning ? 'Spinning...' : 'Spin the Wheel' }}
      </button>
      
      <p class="mt-4 text-sm font-medium text-gray-300 uppercase ">
        1 free spin per day
      </p>
    </div>

    <!-- Result Modal (Simplified) -->
    <Transition name="fade-scale">
      <div v-if="result" class="absolute inset-0 z-40 bg-gray-900/95 backdrop-blur-xl flex flex-col items-center justify-center p-5 text-center">
        <div class="w-24 h-24 bg-parentPrimary/20 rounded-[2.5rem] flex items-center justify-center text-parentPrimary mb-6 shadow-sm border border-gray-50 border border-parentPrimary/30 animate-bounce-slow">
          <Gift class="w-12 h-12" />
        </div>
        <h3 class="text-3xl font-medium text-white tracking-tighter mb-2">{{ result.success ? 'Congratulations!' : 'Aww, Shoot!' }}</h3>
        <p class="text-lg font-bold text-parentPrimary mb-8">{{ result.label }}</p>
        
        <div v-if="result.success" class="bg-white/5 border border-white/10 rounded-3xl p-4 mb-10 w-full">
          <p class="text-sm font-medium text-gray-500 uppercase  mb-2">Your Reward Code</p>
          <div class="flex items-center justify-between gap-4 bg-gray-900 p-4 rounded-2xl border border-white/5">
            <span class="text-xl font-mono font-medium text-white">{{ result.reward?.code || 'ERR-LUCK-2026' }}</span>
            <button @click="copyCode(result.reward?.code)" class="p-2 hover:bg-white/10 rounded-xl text-parentPrimary transition-colors">
              <Copy class="w-5 h-5" />
            </button>
          </div>
          <p class="mt-3 text-sm text-gray-400 font-bold">Applied automatically at checkout</p>
        </div>

        <button @click="result = null" class="px-10 py-4 bg-white text-gray-900 rounded-2xl font-medium text-sm  uppercase hover:bg-parentPrimary hover:text-white transition-all">
          Awesome
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Sparkles, Zap, Gift, GiftIcon, Utensils, Bike, XCircle, Star, Copy } from 'lucide-vue-next';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';

const { showToast } = useCustomToast();

const isSpinning = ref(false);
const rotation = ref(0);
const result = ref<any>(null);

const segments = [
  { label: 'Free Delivery', color: '#FF5C1A', icon: Bike },
  { label: '₦500 Off', color: '#f43f5e', icon: Utensils },
  { label: 'Try Again', color: '#111827', icon: XCircle },
  { label: '₦200 Off', color: '#FF5C1A', icon: GiftIcon },
  { label: 'Free Delivery', color: '#f43f5e', icon: Bike },
  { label: 'Better luck', color: '#111827', icon: XCircle },
];

const spinPlan = async () => {
  if (isSpinning.value) return;
  
  const deviceId = getDeviceId();
  isSpinning.value = true;
  
  try {
    const response = await api.post('/rewards/spin-the-wheel', { deviceId });
    const res = response.data;

    // Determine target rotation based on result
    let targetIndex = 2; // Default to 'Try Again' (index 2)
    
    if (res.success && res.reward) {
      // Find matching segment for the reward type/value
      if (res.reward.type === 'free_delivery') {
        targetIndex = 0; // First 'Free Delivery'
      } else if (res.reward.value === 500) {
        targetIndex = 1;
      } else if (res.reward.value === 200) {
        targetIndex = 3;
      }
    } else if (res.alreadyWon) {
      showToast({
        title: "Daily Limit Reached",
        message: res.label,
        toastType: "info"
      });
      isSpinning.value = false;
      return;
    }

    // Spin animation
    const segmentWidth = 360 / segments.length;
    const extraDegrees = (360 * 5) + (targetIndex * segmentWidth) + (segmentWidth / 2);
    // Since wheel starts at 0, we need to adjust for the fact that index 0 is at -90deg (top) etc.
    // Actually the segments are rotated index * 60.
    // The pointer is at top (270deg in standard coord, or 0 relative to our rotation).
    // If we rotate the wheel by R, the segment at the top is the one that was at -R.
    // Let's just use a simpler offset.
    rotation.value += extraDegrees;
    
    setTimeout(() => {
      isSpinning.value = false;
      result.value = res;
    }, 5000);

  } catch(e) {
    console.error(e);
    isSpinning.value = false;
  }
};

const getDeviceId = () => {
  let id = localStorage.getItem('errandr_device_id');
  if (!id) {
    id = 'dev-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('errandr_device_id', id);
  }
  return id;
};

const copyCode = (code: string) => {
  if (!code) return;
  navigator.clipboard.writeText(code);
  showToast({
    title: "Copied!",
    message: "Coupon code copied to clipboard",
    toastType: "success"
  });
};
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}
.cubic-bezier {
  transition-timing-function: cubic-bezier(0.15, 0, 0.15, 1);
}
.animate-bounce-slow {
  animation: bounce-slow 3s infinite;
}
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.fade-scale-enter-active, .fade-scale-leave-active {
  transition: all 0.5s ease;
}
.fade-scale-enter-from, .fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
