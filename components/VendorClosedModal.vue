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
 <div class="flex min-h-full items-end sm:items-center justify-center text-center">
 <TransitionChild
 as="template"
 enter="duration-300 ease-out"
 enter-from="opacity-0 translate-y-full sm:translate-y-0 sm:scale-95"
 enter-to="opacity-100 translate-y-0 sm:scale-100"
 leave="duration-200 ease-in"
 leave-from="opacity-100 translate-y-0 sm:scale-100"
 leave-to="opacity-0 translate-y-full sm:translate-y-0 sm:scale-95"
 >
 <DialogPanel class="w-full h-[100dvh] sm:h-auto sm:max-w-[22rem] transform overflow-hidden bg-white sm:rounded-[2rem] p-0 text-left align-middle shadow-2xl transition-all border-0 sm:border border-gray-50 flex flex-col">
    <!-- Header Illustration Area -->
    <div class="relative bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-pink-50/50 pt-20 sm:pt-10 pb-8 sm:pb-6 px-6 flex flex-col items-center border-b border-gray-50 overflow-hidden flex-shrink-0">
      <!-- Decorative background blur -->
      <div class="absolute -top-10 -right-10 w-32 h-32 bg-purple-200/40 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-200/40 rounded-full blur-3xl"></div>
      
      <button @click="closeModal" class="absolute top-6 sm:top-4 right-4 sm:right-4 p-2 sm:p-2 rounded-full bg-white/60 hover:bg-white text-gray-500 hover:text-gray-900 transition-all shadow-sm backdrop-blur-md z-20">
        <X class="w-5 h-5 sm:w-4 sm:h-4" />
      </button>

      <div class="relative w-28 h-28 sm:w-24 sm:h-24 mb-6 sm:mb-4 z-10 mt-6 sm:mt-0">
        <!-- Abstract sleeping elements -->
        <div class="absolute inset-0 bg-white/80 rounded-[1.5rem] backdrop-blur-xl border border-white shadow-sm rotate-3 transition-transform hover:rotate-6"></div>
        <div class="absolute inset-0 bg-indigo-500/5 rounded-[1.5rem] rotate-[-3deg]"></div>
        <div class="absolute inset-0 flex items-center justify-center text-5xl sm:text-[2.5rem] animate-bounce-subtle z-10">
          😴
        </div>
        <!-- Zzz particles -->
        <div class="absolute top-0 right-2 text-sm sm:text-[10px] font-black text-indigo-400/80 animate-pulse -translate-y-1 translate-x-2 rotate-12">z</div>
        <div class="absolute top-[-8px] right-[-4px] text-sm sm:text-sm font-black text-purple-400/80 animate-pulse delay-150 -translate-y-3 translate-x-4 rotate-12">z</div>
        <div class="absolute top-[-20px] right-[-14px] text-base sm:text-sm font-black text-pink-400/80 animate-pulse delay-300 -translate-y-5 translate-x-6 rotate-12">Z</div>
      </div>

      <DialogTitle as="h3" class="text-2xl sm:text-xl font-black text-center text-gray-900 tracking-tight leading-tight relative z-10">
        {{ vendor?.storeName || 'Vendor' }} is Resting
      </DialogTitle>
      <p class="text-sm sm:text-sm font-medium text-gray-500 text-center mt-3 sm:mt-2 max-w-[280px] sm:max-w-[240px] leading-relaxed relative z-10">
        Our kitchen is currently closed. Take a look at our schedule below to catch us next time!
      </p>
    </div>

    <!-- Business Hours -->
    <div class="px-6 sm:px-5 py-8 sm:py-6 bg-white flex-1 overflow-y-auto flex flex-col justify-between">
      <div>
        <h4 class="text-sm sm:text-[10px] font-black text-gray-400 uppercase  mb-4 sm:mb-3 pl-1">Weekly Schedule</h4>
        
        <div class="bg-gray-50/50 rounded-2xl border border-gray-50 overflow-hidden">
          <div v-for="(hour, index) in sortedBusinessHours" :key="hour.day" 
            class="flex items-center justify-between px-5 sm:px-4 py-4 sm:py-3 text-sm sm:text-sm font-bold border-b border-gray-100/50 last:border-0 transition-colors"
            :class="isToday(hour.day) ? 'bg-indigo-50/50 relative overflow-hidden' : ''">
            
            <!-- Highlight for today -->
            <div v-if="isToday(hour.day)" class="absolute left-0 top-0 bottom-0 w-1 sm:w-1 bg-indigo-500 rounded-r-full"></div>

            <div class="flex items-center gap-2 sm:gap-2 relative z-10">
              <span class="capitalize" :class="isToday(hour.day) ? 'text-indigo-900' : 'text-gray-500'">{{ hour.day }}</span>
              <span v-if="isToday(hour.day)" class="px-2 sm:px-1.5 py-0.5 sm:py-[1px] rounded-md bg-indigo-100 text-indigo-700 text-[10px] sm:text-[8px] uppercase tracking-wider font-black ml-1 sm:ml-1">Today</span>
            </div>

            <div class="relative z-10 text-right">
              <span v-if="hour.isClosed" class="text-sm sm:text-[9px] uppercase tracking-wider font-black" :class="isToday(hour.day) ? 'text-indigo-400' : 'text-gray-400'">Closed</span>
              <span v-else class="text-sm sm:text-[11px]" :class="isToday(hour.day) ? 'text-indigo-700' : 'text-gray-900'">
                {{ formatTime(hour.open) }} <span class="text-gray-300 mx-1 sm:mx-0.5">-</span> {{ formatTime(hour.close) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="mt-8 sm:mt-5 pb-safe pb-4 sm:pb-0 flex flex-col gap-3">
        <button
          type="button"
          class="w-full py-4 sm:py-3.5 bg-gray-950 text-white rounded-[1.25rem] sm:rounded-xl font-bold text-sm sm:text-sm hover:bg-parentPrimary hover:shadow-md hover:shadow-parentPrimary/20 transition-all focus:outline-none flex items-center justify-center gap-2"
          @click="$emit('notify', vendor)"
        >
          <Bell class="w-4 h-4" /> Notify me when open
        </button>
        <button
          type="button"
          class="w-full py-4 sm:py-3.5 bg-white text-gray-950 border border-gray-25 rounded-[1.25rem] sm:rounded-xl font-bold text-sm sm:text-sm hover:bg-gray-50 hover:border-gray-200 transition-all focus:outline-none"
          @click="$emit('schedule', vendor)"
        >
          Schedule for Later
        </button>
        
        <p class="text-sm font-medium text-gray-400 text-center leading-relaxed px-2 mt-1">
          <span class="font-bold text-gray-900">Note:</span> By choosing to schedule, your payment will be processed immediately. The vendor will receive and prepare your order exactly at their opening time.
        </p>
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
import { computed } from 'vue'
import {
 TransitionRoot,
 TransitionChild,
 Dialog,
 DialogPanel,
 DialogTitle,
} from '@headlessui/vue'
import { X, Bell } from 'lucide-vue-next'

const props = defineProps<{
 isOpen: boolean
 vendor: any
}>()

const emit = defineEmits(['close', 'schedule', 'notify'])

const closeModal = () => {
 emit('close')
}

const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const sortedBusinessHours = computed(() => {
 if (!props.vendor?.businessHours) return []
 return [...props.vendor.businessHours].sort((a, b) => {
 return dayOrder.indexOf(a.day.toLowerCase()) - dayOrder.indexOf(b.day.toLowerCase())
 })
})

const isToday = (day: string) => {
 const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
 return day.toLowerCase() === today
}

const formatTime = (time: string) => {
 if (!time) return ''
 const [hours, minutes] = time.split(':')
 const h = parseInt(hours)
 const ampm = h >= 12 ? 'PM' : 'AM'
 const formattedH = h % 12 || 12
 return `${formattedH}:${minutes} ${ampm}`
}
</script>

<style scoped>
@keyframes bounce-subtle {
 0%, 100% { transform: translateY(0); }
 50% { transform: translateY(-10px); }
}
.animate-bounce-subtle {
 animation: bounce-subtle 3s ease-in-out infinite;
}
</style>
