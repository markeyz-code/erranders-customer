<template>
  <div v-if="showModal" class="fixed inset-0 z-[9999999] flex items-center justify-center md:p-4">
    <!-- Backdrop overlay with intense blur -->
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click.stop></div>

    <!-- Modal Content -->
    <div class="relative bg-white w-full h-full md:h-auto md:max-w-md md:rounded-3xl flex flex-col shadow-2xl animate-scale-up overflow-hidden">
      
      <!-- Main Content -->
      <div class="p-6 md:p-8 flex flex-col justify-center h-full flex-1 overflow-y-auto hide-scrollbar">
        <div class="w-16 h-16 bg-parentPrimary/10 text-parentPrimary rounded-full flex items-center justify-center mb-6 mx-auto shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a5 5 0 0 0-5 5v2a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z"></path>
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
          </svg>
        </div>
        
        <h2 class="text-2xl font-bold text-gray-900 text-center mb-3">Quick Setup!</h2>
        <p class="text-sm text-gray-500 text-center mb-8 leading-relaxed px-2">
          To ensure your safety and comfort, please tell us your gender and if you have a preference for who delivers your items.
        </p>

        <form @submit.prevent="submitPreferences" class="space-y-6">
          <!-- User Gender -->
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-3 tracking-wide uppercase">Your Gender</label>
            <div class="grid grid-cols-2 gap-3">
              <button 
                type="button"
                @click="selectedGender = 'Male'"
                :class="[
                  'py-3 px-4 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2',
                  selectedGender === 'Male' ? 'border-parentPrimary bg-parentPrimary/5 text-parentPrimary' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                ]"
              >
                <span>🙋🏽‍♂️</span> Male
              </button>
              <button 
                type="button"
                @click="selectedGender = 'Female'"
                :class="[
                  'py-3 px-4 rounded-xl text-sm font-bold border transition-all flex items-center justify-center gap-2',
                  selectedGender === 'Female' ? 'border-parentPrimary bg-parentPrimary/5 text-parentPrimary' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                ]"
              >
                <span>🙋🏽‍♀️</span> Female
              </button>
            </div>
          </div>

          <!-- Errander Preference -->
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-3 tracking-wide uppercase">Preferred Errander Gender</label>
            <div class="grid grid-cols-3 gap-2">
              <button 
                type="button"
                @click="selectedPreference = 'Male'"
                :class="[
                  'py-3 px-2 rounded-xl text-[13px] font-bold border transition-all flex flex-col items-center justify-center gap-1',
                  selectedPreference === 'Male' ? 'border-parentPrimary bg-parentPrimary/5 text-parentPrimary' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                ]"
              >
                <span class="text-lg">🏃🏽‍♂️</span>
                Male
              </button>
              <button 
                type="button"
                @click="selectedPreference = 'Female'"
                :class="[
                  'py-3 px-2 rounded-xl text-[13px] font-bold border transition-all flex flex-col items-center justify-center gap-1',
                  selectedPreference === 'Female' ? 'border-parentPrimary bg-parentPrimary/5 text-parentPrimary' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                ]"
              >
                <span class="text-lg">🏃🏽‍♀️</span>
                Female
              </button>
              <button 
                type="button"
                @click="selectedPreference = 'Any'"
                :class="[
                  'py-3 px-2 rounded-xl text-[13px] font-bold border transition-all flex flex-col items-center justify-center gap-1',
                  selectedPreference === 'Any' ? 'border-parentPrimary bg-parentPrimary/5 text-parentPrimary' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                ]"
              >
                <span class="text-lg">⚡️</span>
                Any
              </button>
            </div>
            <p class="text-[11px] text-gray-400 mt-2 text-center">
              "Any" ensures the fastest delivery by broadcasting to all Erranders.
            </p>
          </div>

          <button
            type="submit"
            :disabled="isSubmitting || !selectedGender || !selectedPreference"
            class="w-full py-4 bg-gray-900 text-white rounded-xl text-sm font-bold tracking-wider hover:bg-parentPrimary transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-900/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900 mt-4"
          >
            <span v-if="isSubmitting" class="w-5 h-5 border border-white/20 border-t-white rounded-full animate-spin"></span>
            <span v-else>Save Preferences</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUser } from '@/composables/modules/auth/user'
import { users_api } from '@/api_factory/modules/users'
import { useCustomToast } from '@/composables/core/useCustomToast'

const { user, isLoggedIn } = useUser()
const { showToast } = useCustomToast()

const selectedGender = ref(user.value?.gender || '')
const selectedPreference = ref(user.value?.erranderGenderPreference || '')

const showModal = computed(() => {
  if (!isLoggedIn.value || !user.value) return false;
  const missingGender = !user.value.gender || user.value.gender.trim() === '';
  const missingPreference = !user.value.erranderGenderPreference || user.value.erranderGenderPreference.trim() === '';
  return missingGender || missingPreference;
});

const isSubmitting = ref(false)

const submitPreferences = async () => {
  if (!selectedGender.value || !selectedPreference.value) return;
  isSubmitting.value = true;
  
  try {
    const payload = {
      gender: selectedGender.value,
      erranderGenderPreference: selectedPreference.value
    };

    await users_api.updateProfile(payload);
    
    // Update local user state instantly
    if (user.value) {
      user.value.gender = selectedGender.value;
      user.value.erranderGenderPreference = selectedPreference.value;
    }
    
    showToast({
      title: 'Awesome!',
      message: 'Your preferences have been saved.',
      toastType: 'success'
    });
  } catch (err: any) {
    showToast({
      title: 'Oops',
      message: err.response?.data?.message || 'We had trouble saving that. Please try again.',
      toastType: 'error'
    });
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.animate-scale-up {
  animation: scaleUp 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}
@keyframes scaleUp {
  0% { opacity: 0; transform: scale(0.95) translateY(10px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
