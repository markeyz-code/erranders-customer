<template>
  <div class="min-h-screen w-full flex flex-col items-center justify-center bg-white overflow-hidden py-8 px-4 sm:px-4 lg:px-5">
    <!-- Form Card -->
    <div class="w-full max-w-md flex flex-col justify-center px-0 sm:px-4 py-8 bg-white sm:rounded-[2rem] relative z-10 my-8">
      <div class="mb-6 text-center flex flex-col items-center">
        <NuxtLink to="/" class="flex items-center gap-2 mb-8 inline-block group">
                 <div class="flex items-center justify-center group-hover:scale-110 transition-transform">
            <img src="@/assets/img/logo-light.png" class="w-auto h-10" alt="Errandr" />
          </div>
        </NuxtLink>
        <h1 class="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">create account</h1>
        <p class="text-gray-500 text-lg">Join the campus delivery community</p>
      </div>

      <!-- <form @submit.prevent="handleRegister" class="space-y-5 max-w-md w-full">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UiAnimatedInput v-model="form.firstName" type="text" label="first name" required placeholder="" />
          <UiAnimatedInput v-model="form.lastName" type="text" label="last name" required placeholder="" />
        </div>
        <UiAnimatedInput v-model="form.email" type="email" label="email address" required placeholder="" />
        <UiAnimatedInput v-model="form.phone" type="tel" label="phone number" placeholder="" />
        <UiAnimatedInput v-model="form.matricNumber" type="text" label="matric number" placeholder="" />
        <UiAnimatedInput v-model="form.password" type="password" label="password" required minlength="6" placeholder="" />
        <UiAnimatedInput v-model="form.dateOfBirth" type="date" label="birthday" placeholder="" />
        <UiSelectInput v-model="form.gender" label="gender" :options="['Male', 'Female', 'Other']" placeholder="Select your gender" />
        <UiAnimatedInput v-model="form.referredBy" type="text" label="referral code (optional)" @input="formatReferralCode" />

        <p v-if="error" class="text-red-500 text-sm font-medium">{{ error }}</p>

        <button type="submit" :disabled="loading || validatingReferral"
          class="w-full py-2 bg-[#FF5C1A] hover:bg-[#E54D12] text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm border border-gray-100 shadow-[#FF5C1A]/20 mt-4">
          <Loader2 v-if="loading || validatingReferral" class="animate-spin w-6 h-6" />
          {{ loading || validatingReferral ? 'validating...' : 'create account' }}
        </button>
      </form> -->

      <div class="max-w-md w-full mt-6">
        <button type="button" @click="firebaseLogin()" :disabled="firebaseLoading" class="w-full py-2.5 border border-gray-100 rounded-xl flex items-center justify-center gap-3 font-bold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          <Loader2 v-if="firebaseLoading" class="animate-spin w-5 h-5" />
          <svg v-else class="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {{ firebaseLoading ? 'Connecting...' : 'Sign up with Google' }}
        </button>

        <p class="text-center text-gray-600 font-medium mt-5">
          Already have an account? <NuxtLink to="/auth/login" class="text-[#FF5C1A] font-bold hover:underline">Sign in</NuxtLink>
        </p>
      </div>

      <div class="mt-12 pt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400 font-medium border-t border-gray-50">
        <p>&copy; {{ new Date().getFullYear() }} Errandr</p>
        <NuxtLink to="/terms" class="hover:text-gray-600">Terms</NuxtLink>
        <NuxtLink to="/terms" class="hover:text-gray-600">Privacy</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2, ShoppingBag } from 'lucide-vue-next'
import { ref, reactive, watch } from 'vue'
import { GATEWAY_ENDPOINT } from '@/api_factory/axios.config'
import { useAuth } from '@/composables/modules/auth'
definePageMeta({ layout: false })
const { register, firebaseLogin, loading, firebaseLoading } = useAuth()
const error = ref('')
const form = reactive({ firstName: '', lastName: '', email: '', password: '', phone: '', matricNumber: '', referredBy: '', dateOfBirth: '', gender: '' })

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

  try { await register(form) }
  catch (e: any) { error.value = e.data?.message || 'Registration failed' }
}
useHead({ title: 'Register - Errandr' })
</script>
