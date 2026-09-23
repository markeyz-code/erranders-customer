<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-[200]">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95 translate-y-4"
            enter-to="opacity-100 scale-100 translate-y-0"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100 translate-y-0"
            leave-to="opacity-0 scale-95 translate-y-4"
          >
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-[2rem] bg-white p-6 text-left align-middle shadow-xl transition-all border border-gray-100 relative">
              <button @click="closeModal" class="absolute top-4 right-4 p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full transition-colors z-10">
                <X class="w-5 h-5" />
              </button>

              <div class="flex flex-col items-center text-center mt-4">
                <div class="w-16 h-16 rounded-full bg-orange-50 border-4 border-orange-100 flex items-center justify-center mb-4">
                  <ShoppingCart class="w-7 h-7 text-orange-500" />
                </div>
                
                <DialogTitle as="h3" class="text-xl font-bold text-gray-900 tracking-tight">
                  You have a pending order!
                </DialogTitle>
                <p class="text-sm text-gray-500 mt-2 max-w-[16rem]">
                  It looks like you started an order but didn't complete the payment.
                </p>

                <div v-if="order" class="w-full bg-gray-50 rounded-2xl p-4 mt-6 border border-gray-100 text-left">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-bold text-gray-400 tracking-wider uppercase">Order Total</span>
                    <span class="text-sm font-bold text-gray-900">₦{{ order.total?.toLocaleString() }}</span>
                  </div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-bold text-gray-400 tracking-wider uppercase">Items</span>
                    <span class="text-sm font-medium text-gray-700">{{ order.items?.length || 0 }} items</span>
                  </div>
                  
                  <div v-if="order.items && order.items.length" class="mt-3 pt-3 border-t border-gray-200/50 max-h-32 overflow-y-auto space-y-2">
                    <div v-for="(item, idx) in order.items" :key="idx" class="flex justify-between items-start text-sm">
                      <div class="flex items-start gap-2">
                        <span class="font-bold text-gray-800 bg-white px-1.5 py-0.5 rounded text-xs border border-gray-100 shadow-sm">{{ item.quantity }}x</span>
                        <div class="flex flex-col">
                          <span class="text-gray-700 font-medium">{{ item.name }}</span>
                          <span v-if="item.customizations && item.customizations.length" class="text-[10px] text-gray-400 leading-tight">
                            {{ item.customizations.map(c => c.selected).join(', ') }}
                          </span>
                        </div>
                      </div>
                      <span class="font-bold text-gray-900 text-xs mt-0.5">₦{{ (item.subtotal || (item.price * item.quantity)).toLocaleString() }}</span>
                    </div>
                  </div>
                </div>

                <div class="w-full mt-6 space-y-3">
                  <button @click="payForOrder" :disabled="processingPayment" class="w-full flex items-center justify-center gap-2 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl text-sm font-bold tracking-wide transition-all shadow-md shadow-gray-900/20 active:scale-[0.98] disabled:opacity-50">
                    <Loader2 v-if="processingPayment" class="w-4 h-4 animate-spin" />
                    <span>{{ processingPayment ? 'Initializing...' : 'Complete Payment Now' }}</span>
                  </button>
                  
                  <button @click="editOrder" class="w-full py-3.5 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-2xl text-sm font-bold tracking-wide transition-all border border-orange-100 active:scale-[0.98]">
                    Edit Order
                  </button>

                  <button @click="cancelPendingOrder" :disabled="cancellingOrder" class="w-full py-3.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl text-sm font-bold tracking-wide transition-all border border-red-100 active:scale-[0.98]">
                    <Loader2 v-if="cancellingOrder" class="w-4 h-4 animate-spin inline mr-2" />
                    <span>{{ cancellingOrder ? 'Cancelling...' : 'Cancel Order' }}</span>
                  </button>
                  
                  <button @click="showFeedback = !showFeedback" class="w-full py-3 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                    Having issues? Let us know
                  </button>
                </div>

                <div v-if="showFeedback" class="w-full mt-4 animate-in fade-in slide-in-from-top-2">
                  <textarea 
                    v-model="feedback" 
                    rows="3" 
                    placeholder="Tell us what went wrong..." 
                    class="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-gray-900 focus:ring-0 text-sm transition-all resize-none mb-3"
                  ></textarea>
                  <button @click="submitFeedback" :disabled="submitting || !feedback.trim()" class="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl text-sm font-bold tracking-wide transition-colors">
                    {{ submitting ? 'Submitting...' : 'Submit Feedback' }}
                  </button>
                </div>

              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { X, ShoppingCart, Loader2 } from 'lucide-vue-next'
import { orders_api } from '@/api_factory/modules/orders'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useCart } from '@/composables/modules/cart'
import { usePayments } from '@/composables/modules/payments'
import { useUser } from '@/composables/modules/auth/user'

const props = defineProps<{
  isOpen: boolean
  order: any | null
}>()

const emit = defineEmits(['close'])

const showFeedback = ref(false)
const feedback = ref('')
const submitting = ref(false)
const processingPayment = ref(false)
const cancellingOrder = ref(false)
const { showToast } = useCustomToast()
const cartStore = useCart()
const { initializePayment } = usePayments()
const { user } = useUser()

const closeModal = () => {
  emit('close')
  setTimeout(() => {
    showFeedback.value = false
    feedback.value = ''
  }, 300)
}

const payForOrder = async () => {
  if (!props.order?._id) return;
  processingPayment.value = true;
  try {
    const amount = Math.round(props.order.total || 0);
    const data = await initializePayment({
      amount,
      customer: { 
        name: user.value?.firstName || 'Student', 
        email: user.value?.email || 'user@example.com' 
      },
      callback_url: `${window.location.origin}/orders/${props.order._id}`,
      metadata: { orderIds: [props.order._id] }
    });
    
    const authUrl = data?.data?.authorization_url || data?.authorization_url;
    if (authUrl) {
      window.location.href = authUrl;
    } else {
      showToast({ title: 'Error', message: 'Could not initialize payment gateway', toastType: 'error' });
      navigateTo(`/orders/${props.order._id}`);
      closeModal();
    }
  } catch (e) {
    showToast({ title: 'Error', message: 'Failed to initialize payment', toastType: 'error' });
    navigateTo(`/orders/${props.order._id}`);
    closeModal();
  } finally {
    processingPayment.value = false;
  }
}

const editOrder = () => {
  if (!props.order) return
  
  const vendorId = props.order.vendor?._id || props.order.vendor
  
  // Clear any existing cart for this vendor to avoid conflicts
  if (vendorId) {
    cartStore.clearCart(vendorId)
  }

  // Restore items into cart
  if (props.order.items && props.order.items.length) {
    props.order.items.forEach((item: any) => {
      cartStore.addItem({
        productId: item.product?._id || item.product,
        vendorId: vendorId,
        name: item.name,
        price: item.price,
        image: item.image || '',
        quantity: item.quantity,
        customizations: item.customizations || []
      })
    })
  }
  
  closeModal()
  navigateTo('/cart')
}

const cancelPendingOrder = async () => {
  if (!props.order?._id) return
  
  cancellingOrder.value = true
  try {
    await orders_api.cancelOrder(props.order._id)
    showToast({
      title: 'Order Cancelled',
      message: 'Your pending order has been cancelled.',
      toastType: 'success'
    })
    closeModal()
  } catch (error: any) {
    showToast({
      title: 'Error',
      message: error.response?.data?.message || 'Failed to cancel order.',
      toastType: 'error'
    })
  } finally {
    cancellingOrder.value = false
  }
}

const submitFeedback = async () => {
  if (!feedback.value.trim() || !props.order?._id) return

  submitting.value = true
  try {
    await orders_api.submitFeedback(props.order._id, { feedback: feedback.value })
    showToast({
      title: 'Feedback Submitted',
      message: 'Thank you! We will review your issue to improve the experience.',
      toastType: 'success'
    })
    closeModal()
  } catch (error: any) {
    showToast({
      title: 'Error',
      message: error.response?.data?.message || 'Failed to submit feedback.',
      toastType: 'error'
    })
  } finally {
    submitting.value = false
  }
}
</script>
