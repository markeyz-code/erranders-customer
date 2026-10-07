<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-[100]">
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
            <DialogPanel class="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-sm border border-gray-50 transition-all">
              
              <!-- Header -->
              <div class="bg-gradient-to-r from-orange-50 to-white px-4 py-4 border-b border-orange-100 flex justify-between items-center">
                <div>
                  <DialogTitle as="h3" class="text-xl font-bold text-gray-900 leading-tight">
                    Request a Custom Errand
                  </DialogTitle>
                  <p class="text-sm text-orange-600 font-medium mt-1">Get anything done on campus.</p>
                </div>
                <button @click="closeModal" class="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div class="px-4 py-4 max-h-[70vh] overflow-y-auto">
                
                <!-- Step 1: Details -->
                <div v-if="step === 1" class="space-y-5 animate-fade-in">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">What do you need done?</label>
                    <textarea 
                      v-model="form.description" 
                      rows="3" 
                      placeholder="e.g. Go to Yaba market and buy me 3 yards of black velvet material."
                      class="w-full border-[0.5px] border-gray-100 rounded-xl px-4 py-3 focus:ring-[0.5px] focus:ring-parentPrimary focus:border-parentPrimary transition-colors outline-none resize-none"
                    ></textarea>
                    
                    <div class="mt-2 flex flex-wrap gap-2">
                      <button 
                        @click="form.description = 'Get drugs from the pharmacy'"
                        class="text-sm font-medium px-3 py-1.5 bg-gray-50 border border-gray-50 rounded-full text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors"
                      >
                        💊 Get drugs from the pharmacy
                      </button>
                      <button 
                        @click="form.description = 'Buy energy drinks and snacks for exam prep'"
                        class="text-sm font-medium px-3 py-1.5 bg-gray-50 border border-gray-50 rounded-full text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors"
                      >
                        ⚡ Buy energy drinks/snacks
                      </button>
                      <button 
                        @click="form.description = 'Print assignment and submit'"
                        class="text-sm font-medium px-3 py-1.5 bg-gray-50 border border-gray-50 rounded-full text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors"
                      >
                        🖨️ Print assignment
                      </button>
                      <button 
                        @click="form.description = 'Pick up a package'"
                        class="text-sm font-medium px-3 py-1.5 bg-gray-50 border border-gray-50 rounded-full text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200 transition-colors"
                      >
                        📦 Pick up a package
                      </button>
                    </div>
                  </div>
                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-1">Pick-up Location</label>
                      <input 
                        v-model="form.pickupLocation" 
                        type="text" 
                        placeholder="e.g. Yaba Market"
                        class="w-full border-[0.5px] border-gray-100 rounded-xl px-4 py-3 focus:ring-[0.5px] focus:ring-parentPrimary focus:border-parentPrimary transition-colors outline-none"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-1">Drop-off Location</label>
                      <input 
                        v-model="form.dropoffLocation" 
                        type="text" 
                        placeholder="e.g. Moremi Hall"
                        class="w-full border-[0.5px] border-gray-100 rounded-xl px-4 py-3 focus:ring-[0.5px] focus:ring-parentPrimary focus:border-parentPrimary transition-colors outline-none"
                      />
                    </div>
                  </div>

                  <div class="pt-4 flex justify-end">
                    <button 
                      @click="step = 2" 
                      :disabled="!isStep1Valid"
                      class="bg-parentPrimary text-white font-bold py-3 px-5 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next: Set Your Price
                    </button>
                  </div>
                </div>

                <!-- Step 2: Financials -->
                <div v-if="step === 2" class="space-y-6 animate-fade-in">
                  
                  <div class="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
                    <div class="text-blue-500 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <p class="text-sm text-blue-800 leading-relaxed">
                      You are completely in control. Set how much the items will cost to lock in escrow, and how much you are willing to pay a runner to do this for you.
                    </p>
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Estimated Item Cost (₦)</label>
                    <p class="text-sm text-gray-500 mb-2">How much do you think the items you are asking the runner to buy will cost? This goes directly to the runner.</p>
                    <div class="relative">
                      <span class="absolute left-4 top-3 text-gray-500 font-bold">₦</span>
                      <input 
                        v-model.number="form.estimatedItemCost" 
                        type="number" 
                        placeholder="0"
                        class="w-full border-[0.5px] border-gray-100 rounded-xl pl-8 pr-4 py-3 focus:ring-[0.5px] focus:ring-parentPrimary focus:border-parentPrimary transition-colors outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Runner Fee (₦)</label>
                    <p class="text-sm text-gray-500 mb-2">How much are you offering the runner for their time and effort?</p>
                    <div class="relative">
                      <span class="absolute left-4 top-3 text-gray-500 font-bold">₦</span>
                      <input 
                        v-model.number="form.runnerFee" 
                        type="number" 
                        placeholder="1000"
                        class="w-full border-[0.5px] border-gray-100 rounded-xl pl-8 pr-4 py-3 focus:ring-[0.5px] focus:ring-parentPrimary focus:border-parentPrimary transition-colors outline-none"
                      />
                    </div>
                    <div class="flex gap-2 mt-3">
                      <button @click="form.runnerFee = 500" class="px-3 py-1.5 text-sm font-semibold border border-gray-25 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">₦500</button>
                      <button @click="form.runnerFee = 1000" class="px-3 py-1.5 text-sm font-semibold border border-gray-25 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">₦1,000</button>
                      <button @click="form.runnerFee = 2000" class="px-3 py-1.5 text-sm font-semibold border border-gray-25 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">₦2,000</button>
                    </div>
                  </div>

                  <div class="pt-4 flex justify-between items-center border-t border-gray-100">
                    <button @click="step = 1" class="text-gray-500 font-semibold hover:text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">Back</button>
                    <button 
                      @click="step = 3" 
                      :disabled="!isStep2Valid"
                      class="bg-parentPrimary text-white font-bold py-3 px-5 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Review & Pay
                    </button>
                  </div>
                </div>

                <!-- Step 3: Summary -->
                <div v-if="step === 3" class="space-y-6 animate-fade-in">
                  
                  <div class="bg-gray-50 rounded-2xl p-4 border border-gray-50">
                    <h4 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Request Summary</h4>
                    
                    <div class="space-y-3">
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Estimated Item Cost (Pay Rider Directly)</span>
                        <span class="font-bold text-gray-900">₦{{ formatMoney(form.estimatedItemCost) }}</span>
                      </div>
                      <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Runner Fee (Labor)</span>
                        <span class="font-bold text-gray-900">₦{{ formatMoney(form.runnerFee) }}</span>
                      </div>
                      <div class="flex justify-between text-sm border-b border-gray-200 pb-3">
                        <span class="text-gray-600">Platform Convenience Fee</span>
                        <span class="font-bold text-gray-900">₦50</span>
                      </div>
                      <div class="flex justify-between pt-1">
                        <span class="text-base font-bold text-gray-900">Due on Acceptance</span>
                        <span class="text-xl font-extrabold text-parentPrimary">₦{{ formatMoney(form.runnerFee + 50) }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="bg-orange-50 text-orange-800 text-sm p-4 rounded-xl border border-orange-100 leading-relaxed font-medium">
                    You do not need to pay yet. Once a rider accepts your errand, you will pay them directly for both the Item Cost and the Runner Fee.
                  </div>

                  <div class="pt-2 flex flex-col gap-3">
                    <div v-if="justAuthenticated" class="bg-green-50 text-green-800 text-sm p-4 rounded-xl border border-green-200 flex items-start gap-3 mb-2 animate-pulse-once">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p class="font-bold">Authentication Successful!</p>
                        <p class="font-medium opacity-90 mt-0.5">Thank you for logging in. Your errand details are perfectly saved! Please review them and click "Broadcast to Riders" when you're ready.</p>
                      </div>
                    </div>

                    <button 
                      @click="submitErrand" 
                      :disabled="isSubmitting"
                      class="w-full bg-parentPrimary text-white font-bold py-3.5 px-4 rounded-full hover:bg-orange-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <svg v-if="isSubmitting" class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {{ isSubmitting ? 'Broadcasting...' : 'Broadcast to Riders' }}
                    </button>
                    <button @click="step = 2" :disabled="isSubmitting" class="w-full text-gray-500 font-semibold hover:text-gray-800 py-2 transition-colors">Edit Details</button>
                  </div>
                </div>

              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

  <CoreAuthModal :is-open="isAuthModalOpen" @update:is-open="isAuthModalOpen = $event" @success="handleAuthSuccess" />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useRouter } from 'vue-router'
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'
import { useUser } from '@/composables/modules/auth/user'

const router = useRouter()

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits(['update:isOpen', 'success'])
const { showToast } = useCustomToast()

const closeModal = () => {
  if (isSubmitting.value) return
  emit('update:isOpen', false)
  // Reset form after close animation
  setTimeout(() => {
    step.value = 1
    form.value = {
      description: '',
      pickupLocation: '',
      dropoffLocation: '',
      estimatedItemCost: 0,
      runnerFee: 0,
    }
  }, 300)
}

const step = ref(1)
const isSubmitting = ref(false)
const isAuthModalOpen = ref(false)
const justAuthenticated = ref(false)
const { isLoggedIn } = useUser()

const form = ref({
  description: '',
  pickupLocation: '',
  dropoffLocation: '',
  estimatedItemCost: 0,
  runnerFee: 0,
})

const isStep1Valid = computed(() => {
  return form.value.description.trim().length > 5 && 
         form.value.pickupLocation.trim().length > 2 && 
         form.value.dropoffLocation.trim().length > 2
})

const isStep2Valid = computed(() => {
  return form.value.runnerFee >= 200 // Minimum 200 NGN runner fee
})

const formatMoney = (amount: number) => {
  return amount.toLocaleString()
}

// Dummy submission function for now
const submitErrand = async () => {
  if (!isLoggedIn.value) {
    isAuthModalOpen.value = true
    return
  }

  isSubmitting.value = true
  
  try {
    const response = await api.post('/orders', {
      type: 'custom_errand',
      pickupLocation: form.value.pickupLocation,
      dropoffLocation: form.value.dropoffLocation,
      description: form.value.description,
      estimatedItemCost: form.value.estimatedItemCost,
      runnerFee: form.value.runnerFee,
      urgency: 'standard'
    })

    if (response.data) {
      showToast({ title: 'success', message: 'Your custom errand has been broadcasted to all riders!', toastType: 'success' })
      emit('success')
      closeModal()
      router.push(`/dashboard/orders/${response.data._id}`)
    }
  } catch (error: any) {
    console.error(error)
    showToast({ title: 'error', message: error.response?.data?.message || 'Failed to submit errand', toastType: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

const handleAuthSuccess = () => {
  justAuthenticated.value = true
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
/* Hide number input spinners */
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}
input[type=number] {
  -moz-appearance: textfield;
}
</style>
