<template>
  <Transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" @click="close"></div>
      
      <!-- Modal -->
      <div class="relative bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-sm border border-gray-50 transform transition-all">
        <!-- Close button -->
        <button 
          @click="close"
          class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors z-10"
        >
          <X class="w-4 h-4" />
        </button>

        <div class="p-4 pt-8 text-center">
          <div class="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4" :class="isEnabled ? 'bg-parentPrimary/10 text-parentPrimary' : 'bg-red-50 text-red-500'">
            <Bell v-if="isEnabled" class="w-8 h-8" />
            <BellOff v-else class="w-8 h-8" />
          </div>
          
          <h3 class="text-xl font-bold text-gray-900 mb-2">
            {{ isEnabled ? 'Enable' : 'Disable' }} {{ preferenceTitle }}?
          </h3>
          <p class="text-sm text-gray-500 mb-8">
            Are you sure you want to {{ isEnabled ? 'enable' : 'disable' }} this preference? You can always change this later in your settings.
          </p>

          <div class="flex flex-col gap-3">
            <button 
              @click="confirm"
              :disabled="loading"
              class="w-full py-3.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Loader2 v-if="loading" class="w-5 h-5 animate-spin" />
              <span>{{ loading ? 'Saving...' : (isEnabled ? 'Yes, Enable' : 'Yes, Disable') }}</span>
            </button>
            <button 
              @click="close"
              :disabled="loading"
              class="w-full py-3.5 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-50 transition-colors border border-gray-25"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { X, Bell, BellOff, Loader2 } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: boolean
  preferenceTitle: string
  isEnabled: boolean
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm'): void
}>()

const close = () => {
  if (props.loading) return
  emit('update:modelValue', false)
}

const confirm = () => {
  emit('confirm')
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
</style>
