<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <header class="bg-white px-4 py-3 shadow-sm sticky top-0 z-50 flex items-center gap-3">
      <button @click="$router.push('/market-pool')" class="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
        <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 class="text-lg font-bold text-gray-900 leading-tight">Make Payment</h1>
    </header>

    <div class="p-4 space-y-6" v-if="!loading">
      <!-- Amount to Pay -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
        <p class="text-sm text-gray-500 font-medium mb-1">Total Amount Due</p>
        <h2 class="text-4xl font-black text-primary tracking-tight">₦{{ totalAmount.toLocaleString() }}</h2>
      </div>

      <!-- Payment Methods -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="bg-gray-50/50 px-5 py-4 border-b border-gray-100">
          <h3 class="font-bold text-gray-900 flex items-center gap-2">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Select Payment Method
          </h3>
        </div>
        <div class="p-5 space-y-4">
          <button 
            @click="payViaPaystack"
            :disabled="isInitializingPayment || isPayingWithWallet"
            class="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
              </div>
              <div class="text-left">
                <p class="font-bold text-gray-900">Pay with Card / Bank</p>
                <p class="text-xs text-gray-500">Secured by Paystack</p>
              </div>
            </div>
            <div v-if="isInitializingPayment" class="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <svg v-else class="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
          
          <button 
            @click="payWithWallet"
            :disabled="isInitializingPayment || isPayingWithWallet"
            class="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div class="text-left">
                <p class="font-bold text-gray-900">Pay with Wallet</p>
                <p class="text-xs text-gray-500">Use your Errander balance</p>
              </div>
            </div>
            <div v-if="isPayingWithWallet" class="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <svg v-else class="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
          </button>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <div class="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
      <p class="text-gray-500 font-medium">Loading details...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'
import { payments_api } from '@/api_factory/modules/payments'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useUser } from '@/composables/modules/auth/user'

const route = useRoute()
const router = useRouter()
const { showToast } = useCustomToast()
const { user } = useUser()

const orderId = route.params.id
const loading = ref(true)
const isInitializingPayment = ref(false)
const isPayingWithWallet = ref(false)

const totalAmount = ref(0)
const orderData = ref(null)

onMounted(async () => {
  await fetchPaymentDetails()
})

const fetchPaymentDetails = async () => {
  try {
    const ordersRes = await api.get('/market-pool/orders')
    const order = ordersRes.data.find(o => o._id === orderId)
    if (order) {
      orderData.value = order
      totalAmount.value = order.totalItemCost + order.deliveryFee
    } else {
      showToast({ title: 'Error', message: 'Order not found', toastType: 'error' })
      router.push('/market-pool')
    }
  } catch (error) {
    showToast({ title: 'Error', message: 'Failed to load details', toastType: 'error' })
  } finally {
    loading.value = false
  }
}

const payViaPaystack = async () => {
  if (!orderData.value) return;
  try {
    isInitializingPayment.value = true;
    const res = await payments_api.initialize({
      amount: totalAmount.value,
      email: user.value?.email || 'student@erranders.com',
      callback_url: `${window.location.origin}/market-pool/payment/success?orderId=${orderId}`,
      metadata: {
        type: 'market_pool',
        orderId: orderData.value._id
      }
    });

    const authUrl = res?.data?.authorization_url || res?.data?.data?.authorization_url;
    if (authUrl) {
      window.location.href = authUrl;
    } else {
      showToast({ title: 'Error', message: 'Payment gateway unavailable', toastType: 'error' });
    }
  } catch(e) {
    showToast({ title: 'Error', message: 'Could not initialize payment', toastType: 'error' });
  } finally {
    isInitializingPayment.value = false;
  }
}

const payWithWallet = async () => {
  try {
    isPayingWithWallet.value = true;
    await api.post(`/market-pool/orders/${orderId}/wallet-pay`);
    showToast({ title: 'Success', message: 'Payment successful via Wallet', toastType: 'success' });
    router.push(`/market-pool/payment/success?orderId=${orderId}`);
  } catch (error) {
    showToast({ 
      title: 'Payment Failed', 
      message: error?.response?.data?.message || 'Insufficient wallet balance', 
      toastType: 'error' 
    });
  } finally {
    isPayingWithWallet.value = false;
  }
}
</script>
