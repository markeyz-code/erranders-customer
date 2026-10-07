<template>
  <div class="bg-gray-100 min-h-screen py-10 px-4 flex flex-col items-center">
    
    <!-- Action Bar (Hidden when printing) -->
    <div class="w-full max-w-md flex justify-between items-center mb-6 print:hidden">
      <button @click="$router.push('/market-pool/orders')" class="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors">
        <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
      </button>
      <button @click="printReceipt" class="px-5 py-2 bg-primary text-white text-sm font-bold rounded-full shadow-sm hover:bg-primary/90 transition-colors flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
        Download PDF
      </button>
    </div>

    <!-- Receipt Card -->
    <div class="bg-white w-full max-w-md rounded-xl shadow-md overflow-hidden relative">
      <!-- Watermark -->
      <div v-if="order?.status === 'PAID' || order?.status === 'DELIVERED'" class="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none z-0">
        <div class="transform -rotate-45 text-6xl font-black text-green-500 border-4 border-green-500 rounded-lg px-8 py-2">
          PAID
        </div>
      </div>

      <div class="p-8 relative z-10">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900">Erranders</h1>
          <p class="text-sm text-gray-500 uppercase  font-semibold mt-1">Market Pool Receipt</p>
        </div>

        <div v-if="loading" class="flex justify-center py-10">
          <div class="w-8 h-8 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
        </div>

        <div v-else-if="order" class="space-y-6">
          <!-- Order Info -->
          <div class="flex justify-between items-end border-b border-gray-100 pb-4">
            <div>
              <p class="text-[10px] text-gray-400 font-semibold uppercase">Order ID</p>
              <p class="font-bold text-gray-800 uppercase">#{{ order._id.slice(-8) }}</p>
            </div>
            <div class="text-right">
              <p class="text-[10px] text-gray-400 font-semibold uppercase">Date</p>
              <p class="font-semibold text-gray-800">{{ new Date(order.createdAt).toLocaleDateString() }}</p>
            </div>
          </div>

          <!-- Items Table -->
          <div>
            <div class="flex justify-between text-[10px] text-gray-400 font-bold uppercase border-b border-gray-100 pb-2 mb-3">
              <span>Item</span>
              <span>Amount</span>
            </div>
            
            <div class="space-y-3">
              <div v-for="item in order.items" :key="item.itemId" class="flex justify-between items-start">
                <div>
                  <p class="font-semibold text-gray-800 text-sm">{{ item.itemDetails?.name || 'Item' }}</p>
                  <p class="text-sm text-gray-500">Qty: {{ item.quantity }}</p>
                </div>
                <p class="font-semibold text-gray-800 text-sm">₦{{ (item.priceAtPurchase * item.quantity).toLocaleString() }}</p>
              </div>
            </div>
          </div>

          <!-- Summary -->
          <div class="border-t border-gray-100 pt-4 space-y-2">
            <div class="flex justify-between items-center text-sm text-gray-500">
              <span>Subtotal</span>
              <span>₦{{ order.totalItemCost.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between items-center text-sm text-gray-500">
              <span>Service & Delivery</span>
              <span>₦{{ order.deliveryFee.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between items-center pt-2 mt-2 border-t border-gray-100">
              <span class="font-bold text-gray-900">Total Paid</span>
              <span class="font-black text-xl text-primary">₦{{ (order.totalItemCost + order.deliveryFee).toLocaleString() }}</span>
            </div>
          </div>

          <!-- Footer Note -->
          <div class="pt-6 text-center">
            <p class="text-[10px] text-gray-400">Thank you for participating in the Erranders Market Pool.</p>
            <p class="text-[10px] text-gray-400">support@erranders.com</p>
          </div>
        </div>
        
        <div v-else class="text-center py-10">
          <p class="text-sm text-gray-500">Receipt not found.</p>
        </div>
      </div>
      
      <!-- Zigzag bottom border -->
      <div class="h-3 w-full" style="background-image: radial-gradient(circle at 10px 0, transparent 10px, #ffffff 11px); background-size: 20px 20px; background-repeat: repeat-x; transform: rotate(180deg);"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'

const route = useRoute()
const orderId = route.params.id

const loading = ref(true)
const order = ref(null)

onMounted(async () => {
  try {
    const res = await api.get('/market-pool/orders')
    order.value = res.data.find(o => o._id === orderId)
  } catch (err) {
    console.error('Error fetching order', err)
  } finally {
    loading.value = false
  }
})

const printReceipt = () => {
  window.print()
}
</script>

<style>
@media print {
  @page { margin: 0; }
  body { 
    background-color: white !important; 
    -webkit-print-color-adjust: exact; 
    print-color-adjust: exact;
  }
}
</style>
