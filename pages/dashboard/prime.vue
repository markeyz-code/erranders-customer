<template>
  <div class="max-w-3xl mx-auto py-5 px-4">
    <div class="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-5 text-white shadow-sm border border-gray-50 relative overflow-hidden">
      <!-- Decor -->
      <div class="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-900/40 rounded-full blur-3xl"></div>
      
      <div class="relative z-10">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-bold uppercase tracking-wider mb-6">
          <i class="lucide-sparkles"></i>
          Student Exclusive
        </div>
        
        <h1 class="text-4xl lg:text-5xl font-black mb-4 tracking-tight">Campus Prime</h1>
        <p class="text-indigo-100 text-lg max-w-lg leading-relaxed mb-8">
          Unlock unlimited free delivery across campus for an entire month. No delivery fees, no minimums, no stress.
        </p>

        <div v-if="isActive" class="bg-green-500/20 border border-green-400/30 rounded-xl p-5 mb-8 backdrop-blur-md flex items-start gap-4">
          <div class="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shrink-0">
            <i class="lucide-check text-white text-xl"></i>
          </div>
          <div>
            <h3 class="font-bold text-white text-lg">You are a Prime Member!</h3>
            <p class="text-green-100 mt-1">Your free deliveries are active until {{ formattedExpiry }}.</p>
          </div>
        </div>
        
        <div v-else class="bg-white rounded-2xl p-4 text-gray-900 shadow-sm border border-gray-50 max-w-md">
          <div class="flex items-end gap-2 mb-4">
            <span class="text-4xl font-black">₦1,500</span>
            <span class="text-gray-500 font-medium mb-1">/ month</span>
          </div>
          
          <ul class="space-y-3 mb-6">
            <li class="flex items-center gap-3">
              <i class="lucide-check-circle-2 text-indigo-600"></i>
              <span class="font-medium text-gray-700">Unlimited Free Delivery</span>
            </li>
            <li class="flex items-center gap-3">
              <i class="lucide-check-circle-2 text-indigo-600"></i>
              <span class="font-medium text-gray-700">Priority order matching</span>
            </li>
            <li class="flex items-center gap-3">
              <i class="lucide-check-circle-2 text-indigo-600"></i>
              <span class="font-medium text-gray-700">Cancel anytime</span>
            </li>
          </ul>

          <button 
            @click="subscribe"
            :disabled="loading"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 flex justify-center items-center gap-2"
          >
            <i v-if="loading" class="lucide-loader-2 animate-spin"></i>
            <span>{{ loading ? 'Processing...' : 'Subscribe Now' }}</span>
          </button>
          <p class="text-center text-[10px] text-gray-400 mt-3 font-medium uppercase tracking-widest">Deducted from Wallet</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUser } from '@/composables/modules/auth/user';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { useAuth } from '@/composables/modules/auth';
import { wallets_api } from '@/api_factory/modules/wallets';

definePageMeta({
  layout: 'student',
  middleware: ['auth']
});

const { user } = useUser();
const { showToast } = useCustomToast();
const { fetchProfile } = useAuth();
const loading = ref(false);

const isActive = computed(() => {
  if (!user.value) return false;
  const currentUser = user.value as any;
  return currentUser.campusPrimeActive && currentUser.campusPrimeExpiry && new Date(currentUser.campusPrimeExpiry) > new Date();
});

const formattedExpiry = computed(() => {
  const currentUser = user.value as any;
  if (!currentUser?.campusPrimeExpiry) return '';
  return new Date(currentUser.campusPrimeExpiry).toLocaleDateString('en-NG', {
    day: 'numeric', month: 'long', year: 'numeric'
  });
});

const subscribe = async () => {
  try {
    loading.value = true;
    const res = await wallets_api.subscribePrime();
    if (res.data) {
      showToast({
        title: 'Welcome to Campus Prime! 🚀',
        message: 'Your unlimited free delivery is now active.',
        toastType: 'success'
      });
      // Refresh user profile to get updated prime status
      await fetchProfile();
    }
  } catch (err: any) {
    const errorMsg = err.response?.data?.message || 'Failed to subscribe. Please check your wallet balance.';
    showToast({
      title: 'Subscription Failed',
      message: errorMsg,
      toastType: 'error'
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProfile(); // Ensure latest state
});
</script>
