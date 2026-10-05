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
        <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-[2.5rem] bg-white p-5 text-left align-middle shadow-sm border border-gray-50 transition-all border border-gray-50">
              <div class="relative">
                <!-- Close Button -->
                <button 
                  @click="closeModal"
                  class="absolute -top-2 -right-2 p-2 rounded-full bg-gray-50 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <X class="w-5 h-5" />
                </button>

                <!-- Icon -->
                <div class="w-20 h-20 bg-parentPrimary/10 text-parentPrimary rounded-3xl flex items-center justify-center mb-6 mx-auto">
                  <Bell class="w-8 h-8" />
                </div>

                <DialogTitle as="h3" class="text-2xl font-bold text-center text-gray-900 leading-tight mb-2 tracking-tight">
                  Notify Me
                </DialogTitle>
                
                <p class="text-sm font-medium text-gray-500 text-center mb-6 px-4 leading-relaxed">
                  {{ vendor?.storeName || 'This vendor' }} is currently closed. Enter your email and we'll let you know as soon as they're open!
                </p>

                <form @submit.prevent="submit" class="space-y-4">
                  <div>
                    <input
                      v-model="email"
                      type="email"
                      required
                      placeholder="Enter your email address"
                      class="w-full px-4 py-3.5 bg-gray-50 border border-gray-25 rounded-xl text-base focus:ring-2 focus:ring-parentPrimary/20 focus:border-parentPrimary outline-none transition-all"
                    />
                  </div>

                  <div v-if="success" class="p-3 bg-green-50 text-green-700 text-sm font-medium rounded-xl text-center border border-green-100">
                    {{ successMessage || "We'll notify you when they're open!" }}
                  </div>
                  <div v-if="error" class="p-3 bg-red-50 text-red-700 text-sm font-medium rounded-xl text-center border border-red-100">
                    {{ error }}
                  </div>

                  <button
                    type="submit"
                    :disabled="loading"
                    class="w-full py-3.5 bg-parentPrimary text-white rounded-xl font-bold text-sm hover:bg-parentPrimary/90 transition-all shadow-sm border border-gray-50 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
                    <span v-else>Notify Me</span>
                  </button>
                </form>
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
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import { X, Bell, Loader2 } from 'lucide-vue-next'
import { vendors_api } from '@/api_factory/modules/vendors'
import { useNotifications } from '@/composables/modules/notifications/useNotifications'

const props = defineProps<{
  isOpen: boolean
  vendor: any
}>()

const emit = defineEmits(['close'])

const email = ref('')
const loading = ref(false)
const success = ref(false)
const successMessage = ref('')
const error = ref('')

const { subscribeToPushNotifications } = useNotifications()

const closeModal = () => {
  emit('close')
  setTimeout(() => {
    email.value = ''
    success.value = false
    error.value = ''
    successMessage.value = ''
  }, 300)
}

const submit = async () => {
  if (!email.value) return
  
  loading.value = true
  error.value = ''
  success.value = false

  try {
    // Attempt to get push subscription
    let pushSub = null;
    try {
      pushSub = await subscribeToPushNotifications();
    } catch (e) {
      console.log('User declined or push not supported');
    }

    const res = await vendors_api.notifyWhenOnline(props.vendor._id, email.value, pushSub)
    success.value = true
    successMessage.value = res.data?.message || "We'll notify you when they're open!"
    
    // Auto close after 2.5s
    setTimeout(() => {
      closeModal()
    }, 2500)
  } catch (err: any) {
    error.value = err?.response?.data?.message || 'Failed to submit request. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
