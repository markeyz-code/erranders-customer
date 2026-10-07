<template>
  <div class="bg-gray-50 min-h-screen flex flex-col pb-10">
    <!-- Header -->
    <div class="bg-primary px-4 pt-12 pb-6 rounded-b-3xl shadow-sm text-white sticky top-0 z-10 flex items-center justify-center">
      <h1 class="text-xl font-bold">Proof Submitted</h1>
    </div>

    <!-- Success Content -->
    <div class="flex-1 flex flex-col items-center justify-center p-6 text-center mt-10">
      <div class="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-sm border-4 border-white">
        <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h2 class="text-2xl font-bold text-gray-900 mb-2">We've Received It!</h2>
      <p class="text-gray-500 mb-8 max-w-sm">
        Your payment proof for Market Pool Order <span class="font-bold text-gray-700 uppercase">#{{ orderId?.slice(-6) }}</span> has been submitted. Our team will verify it shortly.
      </p>

      <div class="w-full max-w-sm space-y-3">
        <button @click="$router.push('/market-pool/orders')" class="w-full py-3.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Track My Order Status
        </button>
        
        <button @click="$router.push('/market-pool')" class="w-full py-3.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-bold transition-all border border-gray-25">
          Back to Market Pool
        </button>
      </div>

      <!-- Support Section -->
      <div class="mt-12 p-5 bg-white rounded-2xl shadow-sm border border-gray-50 w-full max-w-sm">
        <h3 class="text-sm font-bold text-gray-800 mb-1">Need Support?</h3>
        <p class="text-sm text-gray-500 mb-4">Got questions about your order? We're here to help.</p>
        <button @click="showSupportModal = true" class="flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold transition-colors border border-gray-25 w-full">
          <svg class="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          Contact Support
        </button>
      </div>
    </div>

    <!-- Support Modal -->
    <div v-if="showSupportModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4 animate-fade-in" @click="showSupportModal = false">
      <div class="bg-white rounded-t-3xl sm:rounded-3xl shadow-xl w-full max-w-sm overflow-hidden animate-slide-up pb-safe" @click.stop>
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 class="font-black text-lg text-gray-900">Contact Support</h3>
            <p class="text-sm text-gray-500 mt-1">We typically reply within minutes.</p>
          </div>
          <button @click="showSupportModal = false" class="bg-gray-100 text-gray-500 hover:bg-gray-200 p-2 rounded-full transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div class="p-4 space-y-3">
          <a href="https://wa.me/2340000000000" target="_blank" class="flex items-center gap-4 p-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 rounded-2xl transition-colors group border border-[#25D366]/20">
            <div class="w-10 h-10 bg-[#25D366] text-white rounded-full flex items-center justify-center shrink-0 shadow-sm">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z"/></svg>
            </div>
            <div>
              <h4 class="font-bold text-gray-900">WhatsApp</h4>
              <p class="text-sm text-gray-500">Fastest response time</p>
            </div>
          </a>

          <button @click="copyEmail" class="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors border border-gray-25">
            <div class="w-10 h-10 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center shrink-0">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <div class="text-left">
              <h4 class="font-bold text-gray-900">Email Support</h4>
              <p class="text-sm text-gray-500">support@erranders.com</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCustomToast } from '@/composables/core/useCustomToast'

const route = useRoute()
const router = useRouter()
const { showToast } = useCustomToast()

const orderId = computed(() => route.query.orderId || '')
const showSupportModal = ref(false)

const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText('support@erranders.com')
    showToast({ title: 'Email Copied', message: 'Support email copied to clipboard.', toastType: 'success' })
    showSupportModal.value = false
  } catch (err) {
    showToast({ title: 'Error', message: 'Failed to copy email', toastType: 'error' })
  }
}
</script>
