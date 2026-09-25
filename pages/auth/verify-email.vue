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
        <h1 class="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Check your inbox</h1>
        <p class="text-gray-500 text-lg">We sent a verification code to <span class="font-semibold text-gray-900">{{ email }}</span></p>
      </div>

      <form @submit.prevent="handleVerify" class="space-y-8 max-w-sm">
        <div class="space-y-4">
          <label class="text-sm font-bold text-gray-700 ml-1">Verification code</label>
          <UiOtpInput v-model="otp" @complete="handleVerify" />
        </div>

        <p v-if="error" class="text-red-500 text-sm font-medium">{{ error }}</p>

        <button type="submit" :disabled="loading || !otp"
          class="w-full py-2 bg-[#FF5C1A] hover:bg-[#E54D12] text-white rounded-[1.2rem] font-medium text-sm  transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm border border-gray-100 shadow-[#FF5C1A]/20 active:scale-95">
          <Loader2 v-if="loading" class="animate-spin w-4 h-4" />
          {{ loading ? 'Verifying...' : 'Verify email' }}
        </button>
      </form>

      <!-- Welcome Modal -->
      <WelcomeModal 
        :is-open="showWelcome" 
        :first-name="firstName" 
        @close="handleWelcomeClose" 
      />

      <div class="mt-auto pt-12 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400 font-medium">
        <p>&copy; {{ new Date().getFullYear() }} Errandr</p>
        <NuxtLink to="/terms" class="hover:text-gray-600">Terms</NuxtLink>
        <NuxtLink to="/terms" class="hover:text-gray-600">Privacy</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2, ShoppingBag } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'
import { useAuth } from '@/composables/modules/auth'

definePageMeta({ layout: false })

const route = useRoute()
const { verifyOTP, loading } = useAuth()

const email = ref('')
const otp = ref('')
const error = ref('')
const showWelcome = ref(false)
const firstName = ref('')

onMounted(() => {
  if (route.query.email) {
    email.value = route.query.email as string
  } else {
    navigateTo('/auth/login')
  }
})

const handleVerify = async () => {
  error.value = ''
  try {
    const res = await verifyOTP(email.value, otp.value.trim(), { redirect: false })
    firstName.value = res?.user?.firstName || 'Errander'
    showWelcome.value = true
  } catch (e: any) {
    error.value = e.data?.message || 'Invalid code or it has expired. Please double-check.'
  }
}

const handleWelcomeClose = () => {
  showWelcome.value = false
  navigateTo('/dashboard')
}

useHead({ title: 'Verify Email - Errandr' })
</script>
