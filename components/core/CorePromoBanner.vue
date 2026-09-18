<template>
  <div v-if="isVisible" class="bg-gradient-to-r from-orange-500 to-red-500 text-white relative z-[999] w-full">
    <div class="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
      <div class="pr-16 sm:text-center sm:px-16 flex flex-col md:flex-row items-center justify-center gap-2">
        <p class="font-medium text-sm text-center">
          <span class="md:hidden">🎉 One Month Anniversary!</span>
          <span class="hidden md:inline">🎉 Celebrating our One Month Anniversary!</span>
          <span class="block sm:inline sm:ml-2">
            Use code <strong class="font-bold px-1.5 py-0.5 bg-white text-orange-600 rounded text-xs">NEW75</strong> for 75% off (New Users) or <strong class="font-bold px-1.5 py-0.5 bg-white text-orange-600 rounded text-xs">ERRAND50</strong> for 50% off!
          </span>
        </p>
      </div>
      <div class="absolute inset-y-0 right-0 pt-1 pr-1 flex items-start sm:pt-1 sm:pr-2 sm:items-start">
        <button @click="isVisible = false" type="button" class="flex p-2 rounded-md hover:bg-white/20 focus:outline-none transition-colors">
          <span class="sr-only">Dismiss</span>
          <X class="h-5 w-5 text-white" aria-hidden="true" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'

const isVisible = ref(true)
</script>
