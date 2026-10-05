<template>
  <Transition name="fade">
    <div v-if="loading" class="fixed inset-0 z-[1000000] bg-white flex flex-col items-center justify-center">
      <div class="relative">
        <!-- Outer Glow -->
        <div class="absolute inset-0 bg-[#FF5C1A] rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
        
        <!-- Logo Container -->
        <div class="relative bg-white w-24 h-24 rounded-[2rem] shadow-sm border border-gray-50 flex items-center justify-center border border-gray-50 overflow-hidden group">
          <ShoppingBag class="w-10 h-10 text-[#FF5C1A] animate-bounce-slow" />
          
          <!-- Glossy overlay -->
          <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent"></div>
        </div>
      </div>
      
      <!-- Text -->
      <div class="mt-8 flex flex-col items-center">
        <h2 class="text-xl font-medium text-gray-900 tracking-tighter animate-pulse">Errandr</h2>
        <div class="mt-2 flex gap-1">
          <div class="w-1.5 h-1.5 bg-[#FF5C1A] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div class="w-1.5 h-1.5 bg-[#FF5C1A] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div class="w-1.5 h-1.5 bg-[#FF5C1A] rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ShoppingBag } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'
import { useRouter } from '#imports'

const loading = ref(false)
const router = useRouter()

// Use Nuxt hooks for page transitions
if (process.client) {
  const nuxtApp = useNuxtApp()
  
  nuxtApp.hook('page:start', () => {
    loading.value = true
  })
  
  nuxtApp.hook('page:finish', () => {
    // Small delay for smooth feel
    setTimeout(() => {
      loading.value = false
    }, 400)
  })
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.animate-bounce-slow {
  animation: bounce-slow 2s infinite ease-in-out;
}
</style>
