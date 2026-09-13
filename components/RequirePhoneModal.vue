<template>
  <div v-if="showModal && !forceClosed" class="fixed inset-0 z-[9999999] flex items-center justify-center md:p-4">
    <!-- Backdrop overlay with intense blur -->
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click.stop></div>

    <!-- Modal Content -->
    <div class="relative bg-white w-full h-full md:h-auto md:max-w-md md:rounded-3xl flex flex-col shadow-2xl animate-scale-up overflow-hidden">
      
      <!-- Close Button -->
      <button 
        @click="attemptClose" 
        class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-colors z-10"
      >
        <X class="w-4 h-4" />
      </button>

      <!-- Main Content -->
      <div v-if="!showClosePrompt" class="p-6 md:p-8 flex flex-col justify-center h-full flex-1 overflow-y-auto hide-scrollbar">
        <div class="w-16 h-16 bg-parentPrimary/10 text-parentPrimary rounded-full flex items-center justify-center mb-6 mx-auto shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
          </svg>
        </div>
        
        <h2 class="text-2xl font-bold text-gray-900 text-center mb-3">Just One Quick Thing!</h2>
        <p class="text-sm text-gray-500 text-center mb-8 leading-relaxed px-2">
          To make sure your orders reach you without any hiccups, we'd love to have a number to reach you on. It really helps your Erranders!
        </p>

        <form @submit.prevent="submitPhoneNumber" class="space-y-5">
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-2 tracking-wide uppercase">Your Phone Number (Whatsapp)</label>
            <div class="flex relative rounded-xl bg-white border border-gray-300 focus-within:border-parentPrimary focus-within:ring-4 focus-within:ring-parentPrimary/10 transition-all">
              
              <!-- Custom Dropdown -->
              <div class="relative flex-shrink-0 border-r border-gray-200" ref="dropdownRef">
                <button
                  type="button"
                  @click="dropdownOpen = !dropdownOpen"
                  class="h-full flex items-center justify-between gap-2 pl-4 pr-3 py-4 hover:bg-gray-50 rounded-l-xl transition-colors min-w-[100px]"
                >
                  <div class="flex items-center gap-2">
                    <span class="text-lg">{{ selectedCountry.flag }}</span>
                    <span class="text-sm font-bold text-gray-700">{{ selectedCountry.code }}</span>
                  </div>
                  <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                
                <Transition
                  enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95"
                  enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75"
                  leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95"
                >
                  <div v-if="dropdownOpen" class="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-[240px] overflow-y-auto hide-scrollbar">
                    <button
                      v-for="country in countries"
                      :key="country.code"
                      type="button"
                      @click="selectCountry(country)"
                      class="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                      :class="{ 'bg-gray-50': selectedCountry.code === country.code }"
                    >
                      <span class="text-lg">{{ country.flag }}</span>
                      <span class="text-sm font-bold text-gray-900">{{ country.code }}</span>
                      <span class="text-xs font-medium text-gray-500 ml-auto">{{ country.name }}</span>
                    </button>
                  </div>
                </Transition>
              </div>

              <!-- Phone Input -->
              <input
                v-model="phoneNumber"
                @input="onPhoneInput"
                type="tel"
                placeholder="801 234 5678"
                class="flex-1 px-4 py-4 bg-transparent text-lg font-bold text-gray-900 outline-none w-full rounded-r-xl min-w-0"
                required
              />
            </div>
            <p v-if="phoneError" class="text-rose-500 text-[12px] mt-2 font-bold px-1">{{ phoneError }}</p>
          </div>

          <button
            type="submit"
            :disabled="isSubmitting || !isValidPhone"
            class="w-full py-4 bg-gray-900 text-white rounded-xl text-sm font-bold tracking-wider hover:bg-parentPrimary transition-all flex items-center justify-center gap-2 shadow-xl shadow-gray-900/10 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-900 mt-2"
          >
            <span v-if="isSubmitting" class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
            <span v-else>Save My Number</span>
          </button>
        </form>
      </div>

      <!-- Close Prompt Content -->
      <div v-else class="p-6 md:p-8 flex flex-col justify-center items-center h-full flex-1 animate-fade-in text-center">
        <div class="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-5 text-rose-500 mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-3">Are you sure?</h2>
        <p class="text-gray-500 text-sm mb-8 leading-relaxed">
          Without a phone number, Erranders won't be able to call you when they arrive with your items. We highly recommend adding one!
        </p>
        
        <div class="flex flex-col gap-3 w-full">
          <button 
            @click="showClosePrompt = false" 
            class="w-full py-3.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors"
          >
            Okay, I'll add it
          </button>
          <button 
            @click="forceClose" 
            class="w-full py-3.5 bg-white text-gray-500 rounded-xl text-sm font-bold hover:bg-gray-50 border border-gray-200 transition-colors"
          >
            I'll add it later
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUser } from '@/composables/modules/auth/user'
import { users_api } from '@/api_factory/modules/users'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { onClickOutside } from '@vueuse/core'
import { X } from 'lucide-vue-next'

const { user, isLoggedIn } = useUser()
const { showToast } = useCustomToast()

const forceClosed = ref(false)
const showClosePrompt = ref(false)

const showModal = computed(() => {
  return isLoggedIn.value && user.value && (!user.value.phone || user.value.phone.trim() === '');
});

const attemptClose = () => {
  if (!showClosePrompt.value) {
    showClosePrompt.value = true
  } else {
    forceClose()
  }
}

const forceClose = () => {
  forceClosed.value = true
}

const countries = [
  { code: '+234', flag: '🇳🇬', name: 'NG' },
  { code: '+1', flag: '🇺🇸', name: 'US' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+233', flag: '🇬🇭', name: 'GH' },
  { code: '+254', flag: '🇰🇪', name: 'KE' },
  { code: '+27', flag: '🇿🇦', name: 'SA' }
]

const selectedCountry = ref(countries[0])
const dropdownOpen = ref(false)
const dropdownRef = ref(null)

onClickOutside(dropdownRef, () => {
  dropdownOpen.value = false
})

const selectCountry = (country: any) => {
  selectedCountry.value = country
  dropdownOpen.value = false
}

const phoneNumber = ref('')
const isSubmitting = ref(false)
const phoneError = ref('')

const onPhoneInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  // Strip all non-numeric characters immediately
  let cleaned = target.value.replace(/\D/g, '');
  phoneNumber.value = cleaned;
  
  if (cleaned.length > 0 && cleaned.length < 10) {
    phoneError.value = "Hmm, this number seems a bit too short.";
  } else if (cleaned.length > 15) {
    phoneError.value = "Whoops, this number is a bit too long.";
  } else {
    phoneError.value = '';
  }
}

const isValidPhone = computed(() => {
  return phoneNumber.value.length >= 10 && phoneNumber.value.length <= 15;
})

const submitPhoneNumber = async () => {
  if (!isValidPhone.value) return;
  isSubmitting.value = true;
  
  try {
    let formattedPhone = phoneNumber.value;
    if (formattedPhone.startsWith('0')) {
      formattedPhone = formattedPhone.substring(1);
    }
    const finalPhone = selectedCountry.value.code + formattedPhone;

    await users_api.updateProfile({ phone: finalPhone });
    
    // Update local user state instantly
    if (user.value) {
      user.value.phone = finalPhone;
    }
    
    showToast({
      title: 'Awesome!',
      message: 'Your phone number has been saved.',
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
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
@keyframes scaleUp {
  0% { opacity: 0; transform: scale(0.95) translateY(10px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes fadeIn {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
