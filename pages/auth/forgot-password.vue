<template>
  <div class="min-h-screen w-full flex flex-col items-center justify-center bg-white overflow-hidden py-8 px-4 sm:px-4 lg:px-5">
    <!-- Form Card -->
    <div class="w-full max-w-md flex flex-col justify-center px-0 sm:px-4 py-8 bg-white sm:rounded-[2rem] relative z-10 my-8">
      <div class="mb-6 text-center flex flex-col items-center">
        <NuxtLink to="/auth/login" class="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors mb-6 group self-start absolute top-8 left-8 sm:static sm:mb-8 sm:self-center">
          <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to login
        </NuxtLink>
        <NuxtLink to="/" class="flex items-center gap-2 mb-8 inline-block group">
                <div class="flex items-center justify-center group-hover:scale-110 transition-transform">
            <img src="@/assets/img/logo-light.png" class="w-auto h-10" alt="Errandr" />
          </div>
        </NuxtLink>
        <h1 class="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">forgot password</h1>
        <p class="text-gray-500 text-lg">Enter your email and we'll send a code to reset your password</p>
      </div>

      <form @submit.prevent="handleForgot" class="space-y-6 max-w-md">
        <UiAnimatedInput v-model="email" type="email" label="email address" required placeholder="" />

        <p v-if="error" class="text-red-500 text-sm font-medium">{{ error }}</p>

        <button type="submit" :disabled="loading"
          class="w-full py-2.5 bg-[#FF5C1A] hover:bg-[#E54D12] text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm border border-gray-100 shadow-[#FF5C1A]/20">
          <Loader2 v-if="loading" class="animate-spin w-5 h-5" />
          {{ loading ? 'sending code...' : 'send reset code' }}
        </button>
      </form>

      <div class="mt-auto pt-12 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400 font-medium">
        <p>&copy; {{ new Date().getFullYear() }} Errandr</p>
        <NuxtLink to="/terms" class="hover:text-gray-600">Terms</NuxtLink>
        <NuxtLink to="/terms" class="hover:text-gray-600">Privacy</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loader2, ShoppingBag, ArrowLeft } from 'lucide-vue-next'
import { ref } from 'vue'
import { useAuth } from '@/composables/modules/auth'

definePageMeta({ layout: false })

const { forgotPassword, loading } = useAuth()
const email = ref('')
const error = ref('')

const handleForgot = async () => {
  error.value = ''
  try {
    await forgotPassword(email.value.trim().toLowerCase())
  } catch (e: any) {
    error.value = e.data?.message || 'failed to send reset code'
  }
}

useHead({ title: 'forgot password - Errandr' })
</script>
