<template>
  <Transition name="modal-fade">
    <div v-if="showPrompt" class="fixed inset-0 z-[1000000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-sm border border-gray-50 p-4 w-full max-w-sm flex flex-col gap-4 animate-in zoom-in-95">
        <div class="flex items-start gap-4">
          <div class="bg-orange-100 p-3 rounded-2xl text-[#FF5C1A] shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell-ring"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/><path d="M4 2C2.8 3.7 2 5.7 2 8"/><path d="M22 8c0-2.3-.8-4.3-2-6"/></svg>
          </div>
          <div>
            <h4 class="text-xl font-bold text-gray-900 leading-tight">Enable Push Notifications</h4>
            <p class="text-sm text-gray-500 mt-2 leading-relaxed">Get real-time updates about your orders and exclusive Errander offers!</p>
          </div>
        </div>
        <div class="flex items-center justify-end gap-3 mt-4">
          <button @click="dismiss" class="px-5 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors">
            Later
          </button>
          <button @click="enable" :disabled="loading" class="px-5 py-2.5 text-sm font-bold text-white bg-[#FF5C1A] hover:bg-orange-600 rounded-xl transition-all shadow-sm border border-gray-50 hover:shadow-sm border border-gray-50 flex items-center gap-2">
            <span v-if="loading" class="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin"></span>
            {{ loading ? 'Enabling...' : 'Enable Now' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStudentNotifications } from '@/composables/useStudentNotifications'

const showPrompt = ref(false)
const loading = ref(false)
const { requestPermissionAndRegister } = useStudentNotifications()

onMounted(() => {
  // Only show the prompt if push messaging is supported and permission hasn't been asked yet
  if ('Notification' in window && 'serviceWorker' in navigator) {
    if (Notification.permission === 'default') {
      // Don't show immediately, give them a few seconds to settle in
      setTimeout(() => {
        showPrompt.value = true
      }, 3000)
    }
  }
})

const dismiss = () => {
  showPrompt.value = false
}

const enable = async () => {
  loading.value = true
  try {
    // Aggressive iOS fix: Request permission instantly before any other wrappers or async delays
    if ('Notification' in window) {
      await Notification.requestPermission();
    }

    // Add a race condition so it doesn't hang indefinitely (e.g. 5 seconds)
    await Promise.race([
      requestPermissionAndRegister(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 5000))
    ])
  } catch (err) {
    console.warn('Push notification prompt timeout or error:', err)
  } finally {
    loading.value = false
    showPrompt.value = false
  }
}
</script>
