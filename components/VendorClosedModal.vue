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
        <div class="fixed inset-0 bg-gray-950/60 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto p-4 sm:p-6 flex min-h-full items-center justify-center text-center">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0 scale-95 translate-y-3"
          enter-to="opacity-100 scale-100 translate-y-0"
          leave="duration-200 ease-in"
          leave-from="opacity-100 scale-100 translate-y-0"
          leave-to="opacity-0 scale-95 translate-y-3"
        >
          <DialogPanel class="w-full max-w-md transform overflow-hidden bg-white rounded-3xl p-5 sm:p-6 text-left align-middle shadow-2xl border border-gray-100 transition-all flex flex-col relative">
            <!-- Close Button -->
            <button 
              @click="closeModal" 
              class="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 transition-colors z-20"
              aria-label="Close"
            >
              <X class="w-4 h-4" />
            </button>

            <!-- Compact Header -->
            <div class="flex items-start gap-3.5 pr-8">
              <!-- Animated Sleeping Badge -->
              <div class="relative shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 border border-purple-200/50 flex items-center justify-center text-2xl shadow-xs">
                <span>😴</span>
                <span class="absolute -top-1.5 -right-1 text-[10px] font-black text-indigo-500 animate-pulse">z</span>
                <span class="absolute -top-3 right-0.5 text-[9px] font-black text-purple-500 animate-pulse delay-150">Z</span>
              </div>

              <!-- Title & Status -->
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2 flex-wrap">
                  <DialogTitle as="h3" class="text-lg font-extrabold text-gray-900 tracking-tight leading-snug truncate">
                    {{ vendor?.storeName || 'Vendor' }}
                  </DialogTitle>
                  <span class="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200/60">
                    Closed Now
                  </span>
                </div>
                <p class="text-xs text-gray-500 font-medium mt-0.5 leading-relaxed">
                  Kitchen is currently resting. Schedule ahead or get notified at open.
                </p>
              </div>
            </div>

            <!-- Prominent Today's Schedule Card -->
            <div class="mt-4 p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-purple-50/60 to-orange-50/50 border border-indigo-100/80 flex items-center justify-between gap-3">
              <div class="flex items-center gap-2.5 min-w-0">
                <div class="w-8 h-8 rounded-xl bg-white shadow-2xs flex items-center justify-center text-indigo-600 shrink-0">
                  <Clock class="w-4 h-4" />
                </div>
                <div class="min-w-0">
                  <p class="text-[11px] font-bold uppercase tracking-wider text-indigo-900/70">
                    Today ({{ currentDayName }})
                  </p>
                  <p class="text-sm font-black text-indigo-950 truncate">
                    {{ todayStatusText }}
                  </p>
                </div>
              </div>

              <!-- Toggle Full Week Link -->
              <button 
                type="button"
                @click="showFullSchedule = !showFullSchedule"
                class="shrink-0 px-2.5 py-1.5 rounded-xl bg-white/80 hover:bg-white text-xs font-bold text-gray-700 hover:text-gray-900 border border-gray-200/80 shadow-2xs flex items-center gap-1 transition-all"
              >
                <span>{{ showFullSchedule ? 'Hide' : 'Full Week' }}</span>
                <ChevronDown class="w-3.5 h-3.5 transition-transform duration-200" :class="{ 'rotate-180': showFullSchedule }" />
              </button>
            </div>

            <!-- Collapsible Weekly Schedule -->
            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="transform -translate-y-2 opacity-0"
              enter-to-class="transform translate-y-0 opacity-100"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="transform translate-y-0 opacity-100"
              leave-to-class="transform -translate-y-2 opacity-0"
            >
              <div v-if="showFullSchedule" class="mt-3 rounded-2xl bg-gray-50/90 border border-gray-100 overflow-hidden divide-y divide-gray-100/70 max-h-48 overflow-y-auto">
                <div 
                  v-for="hour in sortedBusinessHours" 
                  :key="hour.day"
                  class="flex items-center justify-between px-3.5 py-2 text-xs transition-colors"
                  :class="isToday(hour.day) ? 'bg-indigo-50/80 font-bold text-indigo-900' : 'text-gray-600'"
                >
                  <div class="flex items-center gap-2">
                    <span class="capitalize">{{ hour.day }}</span>
                    <span v-if="isToday(hour.day)" class="px-1.5 py-0.2 rounded-md bg-indigo-100 text-indigo-700 text-[9px] uppercase font-black">
                      Today
                    </span>
                  </div>

                  <div class="text-right font-semibold">
                    <span v-if="hour.isClosed" class="text-gray-400 font-bold uppercase text-[10px]">Closed</span>
                    <span v-else class="text-gray-800">
                      {{ formatTime(hour.open) }} - {{ formatTime(hour.close) }}
                    </span>
                  </div>
                </div>
              </div>
            </Transition>

            <!-- Action Buttons (Side by Side) -->
            <div class="mt-5 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                class="py-3 px-3.5 bg-white text-gray-900 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98] rounded-xl font-bold text-xs sm:text-sm transition-all focus:outline-none flex items-center justify-center gap-1.5 shadow-2xs"
                @click="$emit('schedule', vendor)"
              >
                <Calendar class="w-4 h-4 text-gray-600 shrink-0" />
                <span>Schedule Later</span>
              </button>

              <button
                type="button"
                class="py-3 px-3.5 bg-gray-950 hover:bg-[#FF5C1A] text-white active:scale-[0.98] rounded-xl font-bold text-xs sm:text-sm transition-all focus:outline-none flex items-center justify-center gap-1.5 shadow-sm"
                @click="$emit('notify', vendor)"
              >
                <Bell class="w-4 h-4 text-white shrink-0" />
                <span>Notify When Open</span>
              </button>
            </div>

            <!-- Compact Helper Note -->
            <p class="text-[11px] font-medium text-gray-400 text-center leading-normal mt-3 px-2">
              <span class="font-bold text-gray-600">Note:</span> Scheduled orders are queued immediately and prepared right at opening time.
            </p>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  </TransitionRoot>
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
import { X, Bell, Calendar, Clock, ChevronDown } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
  vendor: any
}>()

const emit = defineEmits(['close', 'schedule', 'notify'])

const showFullSchedule = ref(false)

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

const currentDayName = computed(() => {
  return new Date().toLocaleDateString('en-US', { weekday: 'long' })
})

const isToday = (day: string) => {
  return day.toLowerCase() === currentDayName.value.toLowerCase()
}

const todayHour = computed(() => {
  return sortedBusinessHours.value.find(h => isToday(h.day))
})

const todayStatusText = computed(() => {
  if (!todayHour.value || todayHour.value.isClosed) {
    return 'Closed for today'
  }
  return `${formatTime(todayHour.value.open)} – ${formatTime(todayHour.value.close)}`
})

const formatTime = (time: string) => {
  if (!time) return ''
  const [hours, minutes] = time.split(':')
  const h = parseInt(hours)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const formattedH = h % 12 || 12
  return `${formattedH}:${minutes} ${ampm}`
}
</script>
