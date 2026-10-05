<template>
  <div class="space-y-6 px-3">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Group Orders</h1>
        <p class="text-sm text-gray-500 mt-1">Manage your active and past multiplayer carts.</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-20 gap-4">
      <div class="w-8 h-8 border border-gray-25 border-t-parentPrimary rounded-full animate-spin"></div>
      <p class="text-xs font-bold text-gray-400">Loading your history...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!history.length" class="bg-white rounded-3xl border border-gray-50 shadow-sm p-12 text-center">
      <div class="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <Users class="w-10 h-10 text-gray-300" />
      </div>
      <h3 class="text-lg font-bold text-gray-900 mb-2">No group orders yet</h3>
      <p class="text-sm text-gray-500 max-w-sm mx-auto mb-8">
        You haven't hosted or joined any group orders yet. Start one from a vendor's page to shop together with friends!
      </p>
      <NuxtLink to="/dashboard/search" class="inline-flex items-center justify-center px-4 py-3 bg-parentPrimary text-white text-sm font-bold rounded-xl shadow-sm border border-gray-50 hover:bg-parentPrimary/90 transition-all">
        Find a Vendor
      </NuxtLink>
    </div>

    <!-- History List -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div v-for="order in history" :key="order._id" class="bg-white rounded-2xl border border-gray-50 shadow-sm overflow-hidden hover:shadow-sm border border-gray-50 transition-all flex flex-col">
        
        <div class="p-5 flex-1">
          <div class="flex justify-between items-start mb-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl overflow-hidden bg-gray-50 border border-gray-50">
                <video v-if="order.vendor?.logo && order.vendor.logo.match(/\\.(mp4|webm|ogg|mov)$/i)" :src="order.vendor.logo" class="w-full h-full object-cover" autoplay loop muted playsinline></video>
                <img v-else-if="order.vendor?.logo" :src="order.vendor.logo" class="w-full h-full object-cover" />
                <span v-else class="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">{{ order.vendor?.storeName?.[0] }}</span>
              </div>
              <div>
                <h3 class="text-sm font-bold text-gray-900 line-clamp-1">{{ order.name }}</h3>
                <p class="text-xs text-gray-500">{{ order.vendor?.storeName }}</p>
              </div>
            </div>
            
            <div class="flex flex-col items-end">
              <span 
                class="px-2.5 py-1 text-[10px] font-bold rounded-lg tracking-wide uppercase"
                :class="{
                  'bg-emerald-50 text-emerald-600': order.status === 'open',
                  'bg-amber-50 text-amber-600': order.status === 'locked',
                  'bg-gray-100 text-gray-600': order.status === 'completed',
                  'bg-rose-50 text-rose-600': order.status === 'cancelled'
                }"
              >
                {{ order.status }}
              </span>
              <span class="text-[10px] text-gray-400 font-medium mt-1">
                {{ useDateFormat(order.createdAt, 'MMM DD, YYYY').value }}
              </span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 py-4 border-y border-gray-50">
            <div>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Participants</p>
              <div class="flex items-center gap-2">
                <Users class="w-3.5 h-3.5 text-gray-600" />
                <span class="text-sm font-bold text-gray-900">{{ order.participants?.length || 0 }}</span>
              </div>
            </div>
            <div>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Host</p>
              <div class="flex items-center gap-1.5">
                <img v-if="order.host?.avatar" :src="order.host.avatar" class="w-4 h-4 rounded-full" />
                <div v-else class="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-500">
                  {{ order.host?.firstName?.[0] || 'G' }}
                </div>
                <span class="text-xs font-medium text-gray-700 truncate max-w-[100px]">
                  {{ order.host?.firstName || 'Guest' }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="px-5 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center gap-3">
          <button 
            @click="handleReuse(order)"
            class="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold shadow-sm border border-gray-50 hover:bg-parentPrimary hover:shadow-sm border border-gray-50 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw class="w-3.5 h-3.5" /> Re-use Order
          </button>
          
          <NuxtLink
            v-if="order.status === 'open'"
            :to="`/vendors/${order.vendor?._id}?group=${order.inviteCode}`"
            class="flex-1 py-2.5 bg-white border border-gray-25 text-gray-900 rounded-xl text-xs font-bold shadow-sm hover:border-parentPrimary hover:text-parentPrimary transition-all flex items-center justify-center gap-2"
          >
            Go to Cart
          </NuxtLink>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Users, RefreshCw, ShoppingBag } from 'lucide-vue-next'
import { useGroupOrder } from '@/composables/modules/group-order'
import { useDateFormat } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'

definePageMeta({
  layout: 'student'
})

const { fetchHistory, createGroupOrder } = useGroupOrder()
const router = useRouter()
const { showToast } = useToast()

const loading = ref(true)
const history = ref<any[]>([])

const loadHistory = async () => {
  loading.value = true
  try {
    history.value = await fetchHistory()
  } finally {
    loading.value = false
  }
}

const handleReuse = async (order: any) => {
  if (!order.vendor?._id) {
    showToast('Cannot reuse this order: Vendor missing', 'error')
    return
  }
  try {
    const newGroup = await createGroupOrder(order.vendor._id, order.name)
    showToast('Re-used group order! Redirecting...', 'success')
    router.push(`/vendors/${order.vendor._id}?group=${newGroup.inviteCode}`)
  } catch (error) {
    showToast('Failed to re-use order', 'error')
  }
}

onMounted(() => {
  loadHistory()
})
</script>
