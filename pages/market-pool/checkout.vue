<template>
  <div class="min-h-screen bg-gray-50 pb-20">
    <!-- Header -->
    <header class="bg-white px-4 py-3 shadow-sm sticky top-0 z-50 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button @click="$router.back()" class="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors">
          <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-lg font-bold text-gray-900 leading-tight">Checkout</h1>
      </div>
    </header>

    <div class="p-4" v-if="marketStore.cart.length > 0">
      <!-- Order Summary -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden mb-4">
        <div class="p-4 border-b border-gray-100">
          <h2 class="font-bold text-gray-900">Your Pool Order</h2>
        </div>
        <div class="p-4 space-y-4">
          <div v-for="item in marketStore.cart" :key="item.cartId" class="flex justify-between items-center">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                <img v-if="item.imageUrl" :src="item.imageUrl" class="w-full h-full object-cover" />
              </div>
              <div>
                <p class="font-medium text-sm text-gray-900">{{ item.name }}</p>
                <p class="text-[10px] text-gray-500">{{ item.studentQuantity }} x {{ item.quantity }}</p>
                <p v-if="item.preferences" class="text-[10px] text-primary bg-primary/5 px-1.5 py-0.5 rounded mt-0.5 max-w-[150px] truncate" :title="item.preferences">
                  {{ item.preferences }}
                </p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-sm text-gray-900">₦{{ (item.appPrice * item.quantity).toLocaleString() }}</p>
              <div class="flex items-center gap-2 mt-1 justify-end">
                <button @click="marketStore.updateQuantity(item.cartId, item.quantity - 1)" class="w-5 h-5 rounded bg-gray-100 flex items-center justify-center text-gray-600">-</button>
                <span class="text-xs font-medium w-3 text-center">{{ item.quantity }}</span>
                <button @click="marketStore.updateQuantity(item.cartId, item.quantity + 1)" class="w-5 h-5 rounded bg-gray-100 flex items-center justify-center text-gray-600">+</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Breakdown -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden mb-6">
        <div class="p-4 space-y-3">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Items Total</span>
            <span class="font-medium text-gray-900">₦{{ marketStore.cartTotal.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500">Delivery Fee</span>
            <span class="font-medium text-gray-900">₦{{ deliveryFee.toLocaleString() }}</span>
          </div>
          <div class="pt-3 border-t border-gray-100 flex justify-between">
            <span class="font-bold text-gray-900">Total to Pay</span>
            <span class="font-bold text-primary text-lg">₦{{ (marketStore.cartTotal + deliveryFee).toLocaleString() }}</span>
          </div>
        </div>
      </div>

      <!-- Delivery Preferences -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden mb-6 p-5">
        <h3 class="font-bold text-gray-900 mb-4">Delivery Preferences</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Select Saturday Time Slot</label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
              <label v-for="(slot, idx) in availableSlots" :key="idx" class="flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-colors" :class="deliveryDetails.deliverySlot === slot ? 'border-primary bg-primary/5' : 'border-gray-200 hover:bg-gray-50'">
                <span class="text-sm font-medium text-gray-900">{{ slot }}</span>
                <input type="radio" v-model="deliveryDetails.deliverySlot" :value="slot" class="text-primary focus:ring-primary hidden">
                <div class="w-4 h-4 rounded-full border flex items-center justify-center shrink-0" :class="deliveryDetails.deliverySlot === slot ? 'border-primary' : 'border-gray-300'">
                  <div v-if="deliveryDetails.deliverySlot === slot" class="w-2 h-2 rounded-full bg-primary"></div>
                </div>
              </label>
            </div>
          </div>

          <div class="pt-2">
            <label class="flex items-center gap-2 mb-3 cursor-pointer">
              <input type="checkbox" v-model="useProxy" class="rounded text-primary focus:ring-primary w-4 h-4">
              <span class="text-sm font-semibold text-gray-700">Someone else will receive this (Proxy)</span>
            </label>
            
            <div v-if="useProxy" class="space-y-3 p-3 bg-gray-50 rounded-xl border border-gray-50">
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1">Receiver Name</label>
                <input v-model="deliveryDetails.proxyName" type="text" placeholder="e.g. John Doe (Roommate)" class="w-full bg-white border-gray-200 text-gray-900 rounded-lg focus:ring-primary px-3 py-2 border outline-none text-sm">
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1">Receiver Phone Number</label>
                <input v-model="deliveryDetails.proxyPhone" type="tel" placeholder="080..." class="w-full bg-white border-gray-200 text-gray-900 rounded-lg focus:ring-primary px-3 py-2 border outline-none text-sm">
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action -->
      <button 
        @click="processCheckout" 
        :disabled="loading"
        class="w-full bg-primary text-white font-bold rounded-xl py-4 flex items-center justify-center gap-2 shadow-lg shadow-primary/30 disabled:opacity-70"
      >
        <div v-if="loading" class="w-5 h-5 border border-white/30 border-t-white rounded-full animate-spin"></div>
        <span v-else>Confirm Order & Proceed to Payment</span>
      </button>
      <p class="text-center text-[10px] text-gray-400 mt-3 px-4">
        By joining the pool, you agree to our Market Pool terms. Delivery will be made on Saturday.
      </p>
    </div>

    <!-- Empty Cart -->
    <div v-else class="p-8 flex flex-col items-center justify-center text-center space-y-3 mt-10">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h3 class="font-bold text-gray-900 text-lg">Your Pool Cart is Empty</h3>
      <p class="text-sm text-gray-500 mb-4">Add some items from the market pool to proceed with checkout.</p>
      <button @click="$router.push('/market-pool')" class="bg-primary/10 text-primary font-bold px-6 py-2 rounded-lg">
        Browse Pool
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMarketPoolStore } from '~/stores/marketPool'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'

const router = useRouter()
const marketStore = useMarketPoolStore()
const { showToast } = useCustomToast()
const loading = ref(false)
const useProxy = ref(false)
const marketConfig = ref(null)

const deliveryDetails = ref({
  deliverySlot: '',
  proxyName: '',
  proxyPhone: ''
})

const availableSlots = computed(() => {
  return marketConfig.value?.slots || ['Morning (8am - 12pm)', 'Afternoon (1pm - 5pm)']
})

const deliveryFee = computed(() => {
  if (!marketConfig.value) return 500
  if (marketConfig.value.feeType === 'percentage') {
    return Math.round((marketStore.cartTotal * marketConfig.value.feeValue) / 100)
  }
  return marketConfig.value.feeValue
})

onMounted(async () => {
  try {
    const res = await api.get('/settings/market-pool/config')
    marketConfig.value = res.data
    if (availableSlots.value.length > 0) {
      deliveryDetails.value.deliverySlot = availableSlots.value[0]
    }
  } catch (error) {
    console.error('Failed to load market config', error)
  }
})

const processCheckout = async () => {
  try {
    loading.value = true
    const payload = {
      deliverySlot: deliveryDetails.value.deliverySlot,
      ...(useProxy.value && {
        proxyName: deliveryDetails.value.proxyName,
        proxyPhone: deliveryDetails.value.proxyPhone
      })
    }
    const order = await marketStore.checkout(payload)
    showToast({ title: 'Success', message: 'Order created! Please proceed to payment.', toastType: 'success' })
    if (order && order._id) {
      router.push(`/market-pool/payment/${order._id}`)
    } else {
      router.push('/market-pool')
    }
  } catch (error) {
    showToast({ title: 'Checkout Failed', message: error.response?.data?.message || 'Please ensure you have sufficient wallet balance.', toastType: 'error' })
  } finally {
    loading.value = false
  }
}
</script>
