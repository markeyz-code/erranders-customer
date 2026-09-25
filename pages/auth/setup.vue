<template>
  <div class="min-h-screen w-full flex flex-col items-center justify-center bg-white overflow-hidden py-8 px-4 sm:px-4 lg:px-5">
    <div class="w-full max-w-xl flex flex-col justify-center px-4 sm:px-8 py-8 bg-white sm:rounded-[2rem] relative z-10 my-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
      
      <div class="mb-6 text-center flex flex-col items-center">
        <NuxtLink to="/" class="flex items-center gap-2 mb-6 inline-block group">
          <div class="flex items-center justify-center group-hover:scale-110 transition-transform">
            <img src="@/assets/img/logo-light.png" class="w-auto h-8" alt="Errandr" />
          </div>
        </NuxtLink>
        <h1 class="text-lg font-extrabold text-gray-900 mb-2 tracking-tight">Complete your profile</h1>
        <p class="text-gray-500 text-sm">Just a few more details to get you started.</p>
      </div>

      <!-- Step Indicator -->
      <div class="flex items-center justify-center mb-8 gap-2">
        <div v-for="step in 3" :key="step" class="flex items-center">
          <div :class="[
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors',
            currentStep === step ? 'bg-[#FF5C1A] text-white' : currentStep > step ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
          ]">
            <Check v-if="currentStep > step" class="w-4 h-4" />
            <span v-else>{{ step }}</span>
          </div>
          <div v-if="step < 3" :class="[
            'w-12 h-1 transition-colors',
            currentStep > step ? 'bg-green-500' : 'bg-gray-100'
          ]"></div>
        </div>
      </div>

      <form @submit.prevent="nextStep" class="space-y-6 w-full">
        <!-- Step 1: Personal Details -->
        <div v-if="currentStep === 1" class="space-y-4 animate-fade-in">
          <h2 class="text-lg font-bold text-gray-900 mb-4">Personal Information</h2>
          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-700">Phone Number *</label>
            <input v-model="form.phone" type="tel" required placeholder="+234..." class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#FF5C1A] focus:ring-4 focus:ring-[#FF5C1A]/10 transition-all text-sm outline-none" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-700">Date of Birth</label>
            <input v-model="form.dateOfBirth" type="date" class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#FF5C1A] focus:ring-4 focus:ring-[#FF5C1A]/10 transition-all text-sm outline-none" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-700">Gender</label>
            <select v-model="form.gender" class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#FF5C1A] focus:ring-4 focus:ring-[#FF5C1A]/10 transition-all text-sm outline-none appearance-none">
              <option value="" disabled>Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Prefer not to say</option>
            </select>
          </div>
        </div>

        <!-- Step 2: Preferences -->
        <div v-if="currentStep === 2" class="space-y-4 animate-fade-in">
          <h2 class="text-lg font-bold text-gray-900 mb-4">Notification Preferences</h2>
          
          <label class="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
            <input type="checkbox" v-model="form.preferences.emailNotifications" class="w-5 h-5 accent-[#FF5C1A] rounded border-gray-300" />
            <div class="flex-1">
              <p class="font-bold text-gray-900">Email Notifications</p>
              <p class="text-xs text-gray-500">Receive order updates and receipts via email</p>
            </div>
          </label>
          
          <label class="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
            <input type="checkbox" v-model="form.preferences.smsNotifications" class="w-5 h-5 accent-[#FF5C1A] rounded border-gray-300" />
            <div class="flex-1">
              <p class="font-bold text-gray-900">SMS Notifications</p>
              <p class="text-xs text-gray-500">Get text messages when your order arrives</p>
            </div>
          </label>

          <label class="flex items-center gap-4 p-4 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
            <input type="checkbox" v-model="form.preferences.marketingPromos" class="w-5 h-5 accent-[#FF5C1A] rounded border-gray-300" />
            <div class="flex-1">
              <p class="font-bold text-gray-900">Promotions & Offers</p>
              <p class="text-xs text-gray-500">Receive special discounts and campus deals</p>
            </div>
          </label>
        </div>

        <!-- Step 3: Review -->
        <div v-if="currentStep === 3" class="space-y-4 animate-fade-in">
          <h2 class="text-lg font-bold text-gray-900 mb-4">Review Your Info</h2>
          <div class="bg-gray-50 p-5 rounded-xl border border-gray-100 space-y-3">
            <div class="flex justify-between border-b border-gray-200 pb-2">
              <span class="text-gray-500 text-sm">Phone</span>
              <span class="font-bold text-gray-900">{{ form.phone || 'Not provided' }}</span>
            </div>
            <div class="flex justify-between border-b border-gray-200 pb-2">
              <span class="text-gray-500 text-sm">Gender</span>
              <span class="font-bold text-gray-900 capitalize">{{ form.gender || 'Not provided' }}</span>
            </div>
            <div class="flex justify-between border-b border-gray-200 pb-2">
              <span class="text-gray-500 text-sm">DOB</span>
              <span class="font-bold text-gray-900">{{ form.dateOfBirth || 'Not provided' }}</span>
            </div>
            <div class="pt-2">
              <span class="text-gray-500 text-sm block mb-1">Active Notifications</span>
              <div class="flex gap-2 flex-wrap">
                <span v-if="form.preferences.emailNotifications" class="px-2 py-1 bg-[#FF5C1A]/10 text-[#FF5C1A] text-xs font-bold rounded-md">Email</span>
                <span v-if="form.preferences.smsNotifications" class="px-2 py-1 bg-[#FF5C1A]/10 text-[#FF5C1A] text-xs font-bold rounded-md">SMS</span>
                <span v-if="form.preferences.marketingPromos" class="px-2 py-1 bg-[#FF5C1A]/10 text-[#FF5C1A] text-xs font-bold rounded-md">Promos</span>
                <span v-if="!form.preferences.emailNotifications && !form.preferences.smsNotifications && !form.preferences.marketingPromos" class="text-gray-400 text-xs font-medium">None selected</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Buttons -->
        <div class="flex items-center gap-4 mt-5 pt-6 border-t border-gray-100">
          <button v-if="currentStep > 1" type="button" @click="prevStep" :disabled="saving" class="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-colors disabled:opacity-50">
            Back
          </button>
          
          <button v-if="currentStep < 3" type="submit" class="flex-1 py-2 bg-[#FF5C1A] hover:bg-[#E54D12] text-white rounded-xl font-bold text-sm transition-colors">
            Continue
          </button>
          
          <button v-if="currentStep === 3" type="button" @click="handleSave" :disabled="saving" class="flex-1 py-2 bg-[#008950] hover:bg-[#007040] text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
            <Loader2 v-if="saving" class="animate-spin w-4 h-4" />
            {{ saving ? 'Saving...' : 'Finish Setup' }}
          </button>
        </div>
      </form>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Check, Loader2 } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import { useUser } from '@/composables/modules/auth/user'
import { users_api } from '@/api_factory/modules/users'
import { useCustomToast } from '@/composables/core/useCustomToast'

definePageMeta({ layout: false })
useHead({ title: 'Complete Setup - Errandr' })

const router = useRouter()
const { user, setUser } = useUser()
const { showToast } = useCustomToast()

const currentStep = ref(1)
const saving = ref(false)

const form = reactive({
  phone: '',
  gender: '',
  dateOfBirth: '',
  preferences: {
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: true,
    marketingPromos: true
  }
})

onMounted(() => {
  if (user.value) {
    if (user.value.phone) {
      // If they already have a phone, they don't need to be here
      router.push('/dashboard')
    }
    form.gender = user.value.gender || ''
    if (user.value.dateOfBirth) {
      const d = new Date(user.value.dateOfBirth)
      if (!isNaN(d.getTime())) {
        form.dateOfBirth = d.toISOString().split('T')[0]
      }
    }
    if (user.value.preferences) {
      form.preferences = { ...form.preferences, ...user.value.preferences }
    }
  }
})

const nextStep = () => {
  if (currentStep.value === 1 && !form.phone) {
    showToast({ title: 'Error', message: 'Phone number is required', toastType: 'error' })
    return
  }
  if (currentStep.value < 3) currentStep.value++
}

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--
}

const handleSave = async () => {
  saving.value = true
  try {
    const payload: any = { 
      phone: form.phone,
      gender: form.gender,
      preferences: form.preferences
    }
    if (form.dateOfBirth) payload.dateOfBirth = form.dateOfBirth

    const res = await users_api.updateProfile(payload)
    setUser(res.data?.user || res.data)
    
    showToast({
      title: 'Setup Complete',
      message: 'Your profile has been updated successfully. Welcome aboard!',
      toastType: 'success'
    })
    
    router.push('/dashboard')
  } catch (err: any) {
    showToast({
      title: 'Update Failed',
      message: err.response?.data?.message || err.message || 'Failed to update profile',
      toastType: 'error'
    })
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
