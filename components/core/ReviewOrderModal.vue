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
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-[2rem] bg-white p-6 text-left align-middle shadow-xl transition-all border border-gray-50 relative">
              <button @click="closeModal" class="absolute top-4 right-4 p-2 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-full transition-colors z-10">
                <X class="w-5 h-5" />
              </button>

              <div class="flex flex-col items-center text-center mt-4">
                <div class="w-16 h-16 rounded-full bg-green-50 border-4 border-green-100 flex items-center justify-center mb-4">
                  <Star class="w-7 h-7 text-green-500 fill-current" />
                </div>
                
                <DialogTitle as="h3" class="text-xl font-bold text-gray-900 tracking-tight">
                  Rate your experience
                </DialogTitle>
                <p class="text-sm text-gray-500 mt-2 max-w-[16rem]">
                  Your recent order from <span class="font-bold text-gray-700">{{ order?.vendor?.storeName || 'the vendor' }}</span> was delivered! How was it?
                </p>

                <!-- Rating Stars -->
                <div class="flex justify-center gap-2 mt-6">
                  <button 
                    v-for="star in 5" 
                    :key="star"
                    @click="rating = star"
                    @mouseenter="hoverRating = star"
                    @mouseleave="hoverRating = 0"
                    class="p-2 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star 
                      class="w-10 h-10 transition-colors duration-200"
                      :class="[
                        (hoverRating || rating) >= star 
                          ? 'text-yellow-400 fill-current drop-shadow-sm' 
                          : 'text-gray-200'
                      ]"
                    />
                  </button>
                </div>

                <div class="w-full mt-6">
                  <textarea 
                    v-model="review" 
                    rows="3" 
                    placeholder="Tell us what you liked (or didn't like)..." 
                    class="w-full p-4 rounded-xl border border-gray-25 bg-gray-50 focus:bg-white focus:border-gray-25focus:ring-0 text-sm transition-all resize-none"
                  ></textarea>
                </div>

                <div class="w-full mt-6">
                  <button 
                    @click="submitReview" 
                    :disabled="submitting || rating === 0" 
                    class="w-full py-4 bg-gray-900 hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-2xl text-sm font-bold tracking-wide transition-colors"
                  >
                    {{ submitting ? 'Submitting...' : 'Submit Review' }}
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
import { X, Star } from 'lucide-vue-next'
import { orders_api } from '@/api_factory/modules/orders'
import { useCustomToast } from '@/composables/core/useCustomToast'

const props = defineProps<{
  isOpen: boolean
  order: any | null
}>()

const emit = defineEmits(['close'])

const rating = ref(0)
const hoverRating = ref(0)
const review = ref('')
const submitting = ref(false)
const { showToast } = useCustomToast()

const closeModal = () => {
  emit('close')
  setTimeout(() => {
    rating.value = 0
    hoverRating.value = 0
    review.value = ''
  }, 300)
}

const submitReview = async () => {
  if (rating.value === 0 || !props.order?._id) return

  submitting.value = true
  try {
    await orders_api.rateOrder(props.order._id, {
      rating: rating.value,
      review: review.value,
      vendorRating: rating.value,
      erranderRating: rating.value
    })
    showToast({
      title: 'Review Submitted',
      message: 'Thank you for your feedback!',
      toastType: 'success'
    })
    closeModal()
  } catch (error: any) {
    showToast({
      title: 'Error',
      message: error.response?.data?.message || 'Failed to submit review.',
      toastType: 'error'
    })
  } finally {
    submitting.value = false
  }
}
</script>
