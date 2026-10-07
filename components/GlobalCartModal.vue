<template>
  <UiModal :isOpen="isOpen" @close="$emit('close')" title="Your Cart">
    <div class="space-y-4 pt-2 max-h-[70vh] overflow-y-auto hide-scrollbar">
      <div v-if="cart.isEmpty.value" class="text-center py-8">
        <ShoppingCart class="w-12 h-12 text-gray-200 mx-auto mb-3" />
        <p class="text-sm font-medium text-gray-500">Your cart is empty.</p>
      </div>
      
      <div v-else class="space-y-4">
        <!-- List vendors currently in cart -->
        <div v-for="vendorId in cart.allVendorIds.value" :key="vendorId" class="bg-gray-50 rounded-2xl p-4 border border-gray-50">
          <div class="flex items-center justify-between mb-3 border-b border-gray-200/50 pb-2">
            <h4 class="text-sm font-bold text-gray-900">{{ getVendorName(vendorId) }}</h4>
            <button @click="clearVendorCart(vendorId)" class="text-[10px] font-bold text-rose-500 bg-rose-50 px-2.5 py-1.5 rounded-lg hover:bg-rose-100 transition-colors">
              Remove Vendor
            </button>
          </div>
          
          <div class="space-y-3">
            <div v-for="pack in cart.getPacksByVendor(vendorId).value" :key="pack.id" class="space-y-2">
              <div v-if="pack.name && pack.name !== 'Pack 1'" class="text-[10px] font-bold text-gray-400 tracking-wider uppercase">{{ pack.name }}</div>
              <div v-for="(item, idx) in pack.items" :key="idx" class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-bold text-gray-500">{{ item.quantity }}x</span>
                  <p class="text-sm font-medium text-gray-700 truncate max-w-[140px]">{{ item.name }}</p>
                </div>
                <div class="flex items-center gap-3">
                  <span class="text-sm font-bold text-gray-900">₦{{ item.subtotal.toLocaleString() }}</span>
                  <button @click="removeItem(vendorId, pack.id, idx)" class="w-6 h-6 rounded-full bg-white border border-gray-25 flex items-center justify-center text-rose-500 hover:bg-rose-50 active:scale-95 transition-all">
                    <X class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="pt-2 flex flex-col gap-2 sticky bottom-0 bg-white">
          <NuxtLink to="/cart" class="w-full py-3.5 bg-gray-900 text-white rounded-xl text-sm font-bold text-center hover:bg-parentPrimary shadow-sm border border-gray-50 transition-all active:scale-[0.98]" @click="$emit('close')">
            Go to Checkout
          </NuxtLink>
        </div>
      </div>
    </div>
  </UiModal>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useCart } from '@/composables/modules/cart'
import { useVendors } from '@/composables/modules/vendors'
import { ShoppingCart, X } from 'lucide-vue-next'
import UiModal from '@/components/ui/UiModal.vue'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['close'])

const cart = useCart()
const { vendorsMetadata, fetchBulkMetadata } = useVendors()

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    fetchBulkMetadata(cart.allVendorIds.value)
  }
}, { immediate: true })

const getVendorName = (vendorId: string) => {
  return vendorsMetadata.value[vendorId]?.storeName || 'Loading...'
}

const clearVendorCart = (vendorId: string) => {
  cart.clearCart(vendorId)
  if (cart.isEmpty.value) {
    emit('close')
  }
}

const removeItem = (vendorId: string, packId: string, itemIndex: number) => {
  cart.removeItemFromPack(vendorId, packId, itemIndex)
  if (cart.isEmpty.value) {
    emit('close')
  }
}
</script>
