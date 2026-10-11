<template>
  <div class="min-h-screen w-full flex flex-col items-center justify-center bg-white overflow-hidden py-8 px-4 sm:px-4 lg:px-5">
    <!-- Form Card -->
    <div class="w-full max-w-sm flex flex-col justify-center px-0 sm:px-4 py-8 bg-white sm:rounded-[2rem] relative z-10 my-8">
      <div class="mb-8 text-center flex flex-col items-center">
        <NuxtLink to="/" class="flex items-center gap-2 mb-8 inline-block group">
          <div class="flex items-center justify-center group-hover:scale-110 transition-transform">
            <img src="@/assets/img/logo-light.png" class="w-auto h-9" alt="Errandr" />
          </div>
        </NuxtLink>
        <h1 class="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Create account</h1>
        <p class="text-gray-500 text-sm sm:text-base">Join the campus delivery community</p>
      </div>

      <!-- Google Sign Up Only -->
      <div class="space-y-4 max-w-sm w-full">
        <div v-if="error" class="p-3.5 rounded-xl bg-red-50 border border-red-200/80 text-red-600 text-xs font-semibold text-center leading-relaxed">
          {{ error }}
        </div>

        <button 
          type="button" 
          @click="handleGoogleSignUp" 
          :disabled="firebaseLoading" 
          class="w-full py-4 px-5 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-gray-300 rounded-2xl flex items-center justify-center gap-3.5 font-bold text-sm sm:text-base transition-all shadow-sm active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          <Loader2 v-if="firebaseLoading" class="animate-spin w-5 h-5 text-[#FF5C1A]" />
          <svg v-else class="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>{{ firebaseLoading ? 'Setting up account...' : 'Sign up with Google' }}</span>
        </button>

        <p class="text-center text-xs text-gray-400 font-medium pt-2">
          Instantly creates your verified student account using Google.
        </p>

        <p class="text-center text-gray-600 text-sm font-medium pt-4">
          Already have an account? <NuxtLink to="/auth/login" class="text-[#FF5C1A] font-bold hover:underline">Sign in with Google</NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'
import { ref } from 'vue'
import { useAuth } from '@/composables/modules/auth'

definePageMeta({ layout: false })

const { firebaseLogin, firebaseLoading } = useAuth()
const error = ref('')

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
