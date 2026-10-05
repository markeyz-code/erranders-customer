<template>
  <div class="bg-gray-50 min-h-screen pb-24">
    <!-- Header -->
    <div class="bg-primary px-4 pt-12 pb-6 shadow-sm text-white sticky top-0 z-50">
      <div class="max-w-4xl mx-auto flex items-center gap-3">
        <button @click="$router.back()" class="p-2 hover:bg-white/20 rounded-full transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-xl font-bold">My Pool Orders</h1>
      </div>
    </div>

    <div class="max-w-4xl mx-auto w-full">

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-3">
      <div class="w-10 h-10 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
      <p class="text-sm text-gray-500 font-medium">Loading your orders...</p>
    </div>

    <!-- Orders List -->
    <div v-else-if="orders.length > 0" class="p-4 space-y-4 mt-2">
      <div v-for="order in orders" :key="order._id" class="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
        
        <div class="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
          <div>
            <p class="text-xs text-gray-500 mb-0.5">Order ID</p>
            <p class="font-bold text-gray-900 text-sm uppercase">#{{ order._id.slice(-6) }}</p>
          </div>
          <div class="text-right">
            <p class="text-xs text-gray-500 mb-0.5">Total</p>
            <p class="font-bold text-primary">₦{{ (order.totalItemCost + order.deliveryFee).toLocaleString() }}</p>
          </div>
        </div>

        <!-- Milestone Tracker -->
        <div class="px-5 py-6">
          <div class="relative flex justify-between">
            <div class="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0 rounded-full"></div>
            <div class="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 rounded-full transition-all duration-500" :style="`width: ${getMilestoneProgress(order.status)}%`"></div>
            
            <div v-for="(milestone, idx) in milestones" :key="milestone.value" class="relative z-10 flex flex-col items-center gap-2">
              <div class="w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300"
                   :class="hasReachedMilestone(order.status, milestone.value) ? 'bg-primary text-white shadow-md shadow-primary/30' : 'bg-gray-200 text-gray-400 border border-white'">
                <svg v-if="hasReachedMilestone(order.status, milestone.value)" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                <span v-else class="text-[10px] font-bold">{{ idx + 1 }}</span>
              </div>
              <span class="text-[9px] font-bold text-center uppercase tracking-wider w-16" 
                    :class="hasReachedMilestone(order.status, milestone.value) ? 'text-primary' : 'text-gray-400'">
                {{ milestone.label }}
              </span>
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-gray-50 space-y-3">
          <div v-for="item in order.items" :key="item.itemId" class="flex gap-3 items-center">
            <div class="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
              <img v-if="item.itemDetails?.imageUrl" :src="item.itemDetails?.imageUrl" class="w-full h-full object-cover" />
            </div>
            <div class="flex-1">
              <h4 class="text-sm font-bold text-gray-900 leading-tight">{{ item.itemDetails?.name || 'Unknown Item' }}</h4>
              <p class="text-xs text-gray-500">{{ item.quantity }} x {{ item.itemDetails?.studentQuantity || 'Qty' }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-bold text-gray-900">₦{{ (item.priceAtPurchase * item.quantity).toLocaleString() }}</p>
            </div>
          </div>
        </div>

        <!-- Delivery Details -->
        <div class="p-4 bg-gray-50/50 border-t border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-end gap-3">
          <div class="text-xs text-gray-600">
            <p><span class="font-medium">Delivery Slot:</span> {{ order.deliverySlot }}</p>
            <p v-if="order.proxyName"><span class="font-medium">Receiver:</span> {{ order.proxyName }} ({{ order.proxyPhone }})</p>
            <p v-else><span class="font-medium">Receiver:</span> You</p>
            <p class="text-[10px] text-gray-400 mt-1">{{ new Date(order.createdAt).toLocaleDateString() }}</p>
          </div>
          <button 
            v-if="['pending_payment', 'paid', 'procuring', 'repackaging'].includes(order.status)"
            @click="openEditModal(order)" 
            class="text-xs font-bold text-primary hover:underline"
          >
            Edit Preferences
          </button>
        </div>

      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="p-8 flex flex-col items-center justify-center text-center space-y-3 mt-10 bg-white mx-4 rounded-3xl shadow-sm border border-gray-50 py-16">
      <div class="w-20 h-20 bg-[#FF5C1A]/10 rounded-full flex items-center justify-center mb-2">
        <svg class="w-10 h-10 text-[#FF5C1A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      </div>
      <h3 class="font-black text-gray-900 text-2xl tracking-tight">No Pool Orders</h3>
      <p class="text-sm font-medium text-gray-500 mb-6 max-w-sm">You haven't participated in any market pool campaigns yet. Buy in bulk and save up to 40%!</p>
      <button @click="$router.push('/market-pool')" class="bg-gradient-to-r from-[#FF5C1A] to-[#E54D12] text-white font-extrabold px-8 py-3 rounded-xl shadow-lg shadow-orange-500/30 hover:scale-105 transition-all">
        Explore Market Pool
      </button>
    </div>
    
    </div>

    <!-- Edit Preferences Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h3 class="font-bold text-lg text-gray-900 mb-4">Edit Delivery Preference</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Delivery Time Slot</label>
            <div class="space-y-2">
              <label v-for="(slot, idx) in availableSlots" :key="idx" class="flex items-center gap-3 p-3 border rounded-xl cursor-pointer" :class="editForm.deliverySlot === slot ? 'border-primary bg-primary/5' : 'border-gray-200 hover:bg-gray-50'">
                <input type="radio" v-model="editForm.deliverySlot" :value="slot" class="text-primary focus:ring-primary">
                <span class="text-sm font-medium text-gray-900">{{ slot }}</span>
              </label>
            </div>
          </div>
          
          <div class="pt-2">
            <label class="flex items-center gap-2 mb-3 cursor-pointer">
              <input type="checkbox" v-model="editForm.useProxy" class="rounded text-primary focus:ring-primary w-4 h-4">
              <span class="text-sm font-semibold text-gray-700">Someone else will receive this (Proxy)</span>
            </label>
            
            <div v-if="editForm.useProxy" class="space-y-3 p-3 bg-gray-50 rounded-xl border border-gray-50">
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1">Receiver Name</label>
                <input v-model="editForm.proxyName" type="text" placeholder="e.g. John Doe" class="w-full bg-white border-gray-200 text-gray-900 rounded-lg focus:ring-primary px-3 py-2 border outline-none text-sm">
              </div>
              <div>
                <label class="block text-xs font-semibold text-gray-600 mb-1">Receiver Phone</label>
                <input v-model="editForm.proxyPhone" type="tel" placeholder="080..." class="w-full bg-white border-gray-200 text-gray-900 rounded-lg focus:ring-primary px-3 py-2 border outline-none text-sm">
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 mt-6">
          <button @click="showEditModal = false" class="px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
          <button @click="submitEditPreference" :disabled="saving" class="px-5 py-2 text-sm font-bold bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50">
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'
import { useCustomToast } from '@/composables/core/useCustomToast'

const { showToast } = useCustomToast()
const orders = ref([])
const loading = ref(true)
const marketConfig = ref(null)

const availableSlots = computed(() => {
  return marketConfig.value?.slots || ['Morning (8am - 12pm)', 'Afternoon (1pm - 5pm)']
})

const showEditModal = ref(false)
const saving = ref(false)
const activeOrder = ref(null)
const editForm = ref({
  deliverySlot: '',
  useProxy: false,
  proxyName: '',
  proxyPhone: ''
})

const openEditModal = (order) => {
  activeOrder.value = order
  editForm.value = {
    deliverySlot: order.deliverySlot,
    useProxy: !!order.proxyName,
    proxyName: order.proxyName || '',
    proxyPhone: order.proxyPhone || ''
  }
  showEditModal.value = true
}

const submitEditPreference = async () => {
  if (!activeOrder.value) return
  try {
    saving.value = true
    const payload = {
      deliverySlot: editForm.value.deliverySlot,
      proxyName: editForm.value.useProxy ? editForm.value.proxyName : '',
      proxyPhone: editForm.value.useProxy ? editForm.value.proxyPhone : ''
    }
    await api.put(`/market-pool/orders/${activeOrder.value._id}/delivery-details`, payload)
    showToast({ title: 'Success', message: 'Delivery preference updated', toastType: 'success' })
    showEditModal.value = false
    await fetchOrders()
  } catch (err) {
    showToast({ title: 'Error', message: err.response?.data?.message || 'Update failed', toastType: 'error' })
  } finally {
    saving.value = false
  }
}

const milestones = [
  { value: 'paid', label: 'Paid' },
  { value: 'procuring', label: 'Procuring' },
  { value: 'repackaging', label: 'Packing' },
  { value: 'out_for_delivery', label: 'On Way' },
  { value: 'delivered', label: 'Delivered' }
]

const hasReachedMilestone = (currentStatus, targetMilestone) => {
  const currentIndex = milestones.findIndex(m => m.value === currentStatus)
  const targetIndex = milestones.findIndex(m => m.value === targetMilestone)
  return currentIndex >= targetIndex
}

const getMilestoneProgress = (currentStatus) => {
  const currentIndex = milestones.findIndex(m => m.value === currentStatus)
  if (currentIndex === -1) return 0
  return (currentIndex / (milestones.length - 1)) * 100
}

const fetchOrders = async () => {
  try {
    loading.value = true
    const res = await api.get('/market-pool/orders')
    orders.value = res.data
  } catch (error) {
    console.error('Failed to fetch orders', error)
  } finally {
    loading.value = false
  }
}

const fetchConfig = async () => {
  try {
    const res = await api.get('/settings/market-pool/config')
    marketConfig.value = res.data
  } catch (error) {
    console.error('Failed to load config', error)
  }
}

onMounted(() => {
  fetchConfig()
  fetchOrders()
})
</script>
