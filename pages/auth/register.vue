<template>
  <div class="min-h-screen w-full flex flex-col items-center justify-center bg-white overflow-hidden py-8 px-4 sm:px-4 lg:px-5">
    <!-- Form Card -->
    <div class="w-full max-w-sm flex flex-col justify-center px-0 sm:px-4 py-8 bg-white sm:rounded-[2rem] relative z-10 my-8">
      <div class="mb-6 text-center flex flex-col items-center">
        <NuxtLink to="/" class="flex items-center gap-2 mb-8 inline-block group">
          <div class="flex items-center justify-center group-hover:scale-110 transition-transform">
            <img src="@/assets/img/logo-light.png" class="w-auto h-9" alt="Errandr" />
          </div>
        </NuxtLink>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Create account</h1>
        <p class="text-gray-500 text-sm sm:text-base">Join the campus delivery community</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4 max-w-sm w-full mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UiAnimatedInput v-model="form.firstName" type="text" label="First name" required />
          <UiAnimatedInput v-model="form.lastName" type="text" label="Last name" required />
        </div>
        <UiAnimatedInput v-model="form.email" type="email" label="Email address" required />
        <UiAnimatedInput v-model="form.phone" type="tel" label="Phone number" placeholder="" />
        <UiAnimatedInput v-model="form.matricNumber" type="text" label="Matric number (optional)" placeholder="" />
        <UiAnimatedInput v-model="form.password" type="password" label="Password" required minlength="6" />
        <UiAnimatedInput v-model="form.dateOfBirth" type="date" label="Birthday" placeholder="" />
        <UiSelectInput v-model="form.gender" label="Gender" :options="['Male', 'Female', 'Other']" />
        <UiAnimatedInput v-model="form.referredBy" type="text" label="Referral code (optional)" @input="formatReferralCode" />

        <div v-if="error" class="p-3.5 rounded-xl bg-red-50 border border-red-200/80 text-red-600 text-xs font-semibold text-center leading-relaxed">
          {{ error }}
        </div>

        <button 
          type="submit" 
          :disabled="loading || validatingReferral"
          class="w-full py-3.5 bg-[#FF5C1A] hover:bg-[#E54D12] text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm border border-transparent shadow-[#FF5C1A]/20 mt-4"
        >
          <Loader2 v-if="loading || validatingReferral" class="animate-spin w-5 h-5" />
          <span>{{ loading || validatingReferral ? 'Creating account...' : 'Create account' }}</span>
        </button>
      </form>

      <div class="flex items-center gap-3 mb-6">
        <div class="flex-1 h-px bg-gray-100" />
        <span class="text-xs text-gray-400 font-bold uppercase tracking-wider">or</span>
        <div class="flex-1 h-px bg-gray-100" />
      </div>

      <div class="max-w-sm w-full mt-2">
        <button 
          type="button" 
          @click="handleGoogleSignUp" 
          :disabled="firebaseLoading" 
          class="w-full py-3.5 px-4 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 hover:border-gray-300 rounded-xl flex items-center justify-center gap-3 font-bold text-sm transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <Loader2 v-if="firebaseLoading" class="animate-spin w-4 h-4 text-[#FF5C1A]" />
          <svg v-else class="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>{{ firebaseLoading ? 'Connecting...' : 'Sign up with Google' }}</span>
        </button>

        <p class="text-center text-gray-600 font-medium text-sm mt-6">
          Already have an account? <NuxtLink to="/auth/login" class="text-[#FF5C1A] font-bold hover:underline">Sign in</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import { ref, reactive } from 'vue'
import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config'
import { useAuth } from '@/composables/modules/auth'

definePageMeta({ layout: false })

const { register, firebaseLogin, loading, firebaseLoading } = useAuth()
const error = ref('')
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  matricNumber: '',
  referredBy: '',
  dateOfBirth: '',
  gender: ''
})

const validatingReferral = ref(false)

const formatReferralCode = () => {
  if (!form.referredBy) return;
  let val = form.referredBy;
  let formatted = val.toUpperCase().replace(/[^A-Z0-9-]/g, '');
  if (formatted.startsWith('ERR-')) {
    formatted = formatted.substring(4);
  } else if (formatted.startsWith('ERR')) {
    formatted = formatted.substring(3);
  } else if (formatted.startsWith('ER')) {
    formatted = formatted.substring(2);
  } else if (formatted.startsWith('E')) {
    formatted = formatted.substring(1);
  }
  
  if (formatted.length > 0) {
    form.referredBy = 'ERR-' + formatted.replace(/-/g, '');
  } else if (val.length > 0 && !['ERR', 'ER', 'E'].includes(val.toUpperCase())) {
     form.referredBy = 'ERR-';
  } else {
    form.referredBy = val.toUpperCase();
  }
}

const handleRegister = async () => {
  error.value = ''
  
  if (form.referredBy) {
    validatingReferral.value = true
    try {
      const res = await GATEWAY_ENDPOINT.get(`/referrals/validate-code/${form.referredBy}`)
      if (res?.data?.type === 'ERROR' || res?.type === 'ERROR') throw res;
    } catch (e: any) {
      error.value = e?.response?.data?.message || e?.data?.message || 'Invalid referral code.'
      return
    } finally {
      validatingReferral.value = false
    }
  }

  try {
    await register(form)
  } catch (e: any) {
    error.value = e?.response?.data?.message || e?.data?.message || e?.message || 'Registration failed'
  }
}

const handleGoogleSignUp = async () => {
  error.value = ''
  try {
    await firebaseLogin({ redirect: true, isSignUp: true })
  } catch (e: any) {
    error.value = e?.data?.message || e?.message || 'Google sign-up failed. Please try again.'
  }
}

useHead({ title: 'Register - Errandr' })
</script>
