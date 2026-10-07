<template>
  <Transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" @click="closeModal"></div>
      
      <!-- Modal Content -->
      <div class="relative bg-white w-full max-w-sm rounded-3xl shadow-sm border border-gray-50 border border-gray-50 flex flex-col overflow-hidden animate-zoom-in">
        <!-- Close Button -->
        <button 
          @click="closeModal"
          class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all z-10"
        >
          <X class="w-5 h-5" />
        </button>

        <div class="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <!-- Header -->
          <div class="text-center mb-6">
            <div class="w-12 h-12 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle class="w-6 h-6" />
            </div>
            <h2 class="text-xl font-bold text-gray-900 tracking-tight leading-none mb-2">
              Delete Account
            </h2>
            <p class="text-sm font-medium text-gray-500 leading-relaxed px-2">
              We're sad to see you go! Please let us know why you are leaving so we can improve.
            </p>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="mb-4 p-3 bg-rose-50 rounded-xl flex items-start gap-2">
            <AlertCircle class="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <p class="text-[11px] font-bold text-rose-600 text-left">{{ error }}</p>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Reason for leaving (Optional)</label>
              <textarea 
                v-model="reason" 
                placeholder="Tell us what went wrong..."
                class="w-full px-4 py-3 bg-gray-50 border border-gray-25 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none min-h-[100px]"
                :disabled="loading"
              ></textarea>
            </div>

            <div class="p-3 bg-rose-50/50 rounded-xl border border-rose-100 mb-4">
              <p class="text-[11px] font-medium text-rose-600 leading-relaxed text-center">
                This action is permanent and cannot be undone. All your data will be securely removed.
              </p>
            </div>

            <button 
              type="submit" 
              :disabled="loading"
              class="w-full py-3 bg-rose-500 text-white rounded-xl text-sm font-bold hover:bg-rose-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
              <span>{{ loading ? 'Deleting Account...' : 'Yes, Delete Account' }}</span>
            </button>
            
            <button 
              type="button" 
              @click="closeModal"
              :disabled="loading"
              class="w-full py-3 bg-white text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all border border-gray-25"
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X, AlertTriangle, Loader2, AlertCircle } from 'lucide-vue-next'
import { users_api } from '@/api_factory/modules/users'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useAuth } from '@/composables/modules/auth'
import { useRouter } from 'vue-router'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const { showToast } = useCustomToast()
const { logOut } = useAuth()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const reason = ref('')

const resetForm = () => {
  reason.value = ''
  error.value = ''
}

const closeModal = () => {
  if (loading.value) return
  resetForm()
  emit('update:modelValue', false)
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await users_api.deleteAccount({ reason: reason.value })
    
    showToast({
      title: 'Account Deleted',
      message: response.data?.message || 'Your account has been successfully deleted.',
      toastType: 'success'
    })
    
    closeModal()
    
    // Log the user out and redirect
    logOut()
    router.push('/')
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Failed to delete account. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-zoom-in {
  animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #f3f4f6;
  border-radius: 4px;
}
.custom-scrollbar:hover::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
}
</style>
