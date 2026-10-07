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
            <div class="w-12 h-12 bg-gray-50 text-gray-900 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Lock class="w-6 h-6" />
            </div>
            <h2 class="text-xl font-bold text-gray-900 tracking-tight leading-none mb-2">
              Change Password
            </h2>
            <p class="text-sm font-medium text-gray-500 leading-relaxed px-2">
              Enter your current password and choose a strong new password.
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
              <label class="block text-sm font-bold text-gray-700 mb-1.5 ml-1">Current Password</label>
              <div class="relative">
                <input 
                  v-model="form.currentPassword" 
                  :type="showCurrentPassword ? 'text' : 'password'"
                  placeholder="Enter current password"
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-25 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-parentPrimary/20 focus:border-parentPrimary transition-all pr-12"
                  required
                  :disabled="loading"
                >
                <button 
                  type="button"
                  @click="showCurrentPassword = !showCurrentPassword"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <EyeOff v-if="showCurrentPassword" class="w-4 h-4" />
                  <Eye v-else class="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-1.5 ml-1">New Password</label>
              <div class="relative">
                <input 
                  v-model="form.newPassword" 
                  :type="showNewPassword ? 'text' : 'password'"
                  placeholder="Enter new password"
                  class="w-full px-4 py-3 bg-gray-50 border border-gray-25 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-parentPrimary/20 focus:border-parentPrimary transition-all pr-12"
                  required
                  minlength="8"
                  :disabled="loading"
                >
                <button 
                  type="button"
                  @click="showNewPassword = !showNewPassword"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <EyeOff v-if="showNewPassword" class="w-4 h-4" />
                  <Eye v-else class="w-4 h-4" />
                </button>
              </div>
              <p class="text-[10px] text-gray-500 mt-1.5 ml-1 font-medium">Must be at least 8 characters long</p>
            </div>

            <button 
              type="submit" 
              :disabled="loading || !isFormValid"
              class="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
              <span>{{ loading ? 'Updating Password...' : 'Update Password' }}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { X, Lock, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-vue-next'
import { auth_api } from '@/api_factory/modules/auth'
import { useCustomToast } from '@/composables/core/useCustomToast'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const { showToast } = useCustomToast()

const loading = ref(false)
const error = ref('')
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)

const form = reactive({
  currentPassword: '',
  newPassword: ''
})

const isFormValid = computed(() => {
  return form.currentPassword.length > 0 && form.newPassword.length >= 8
})

const resetForm = () => {
  form.currentPassword = ''
  form.newPassword = ''
  error.value = ''
  showCurrentPassword.value = false
  showNewPassword.value = false
}

const closeModal = () => {
  if (loading.value) return
  resetForm()
  emit('update:modelValue', false)
}

const handleSubmit = async () => {
  if (!isFormValid.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    const response = await auth_api.changePassword({
      currentPassword: form.currentPassword,
      newPassword: form.newPassword
    })
    
    showToast({
      title: 'Success',
      message: response.data?.message || 'Password securely updated!',
      toastType: 'success'
    })
    
    closeModal()
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Failed to change password. Please try again.'
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
