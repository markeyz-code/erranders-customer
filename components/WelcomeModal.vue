<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-[100]">
      <TransitionChild
        as="template"
        enter="duration-500 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-300 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-900/60 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="template"
            enter="duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275)"
            enter-from="opacity-0 scale-95 translate-y-8"
            enter-to="opacity-100 scale-100 translate-y-0"
            leave="duration-300 ease-in"
            leave-from="opacity-100 scale-100 translate-y-0"
            leave-to="opacity-0 scale-95 translate-y-8"
          >
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-[3rem] bg-white p-5 md:p-12 text-center align-middle transition-all border border-gray-50">
              <!-- Animated Icon -->
              <div class="mb-8 relative inline-block">
                <div class="w-24 h-24 bg-parentPrimary/10 rounded-full flex items-center justify-center text-5xl animate-bounce-slow">
                   🎉
                </div>
                <div class="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-sm animate-pulse">
                   ✨
                </div>
              </div>

              <DialogTitle as="h3" class="text-3xl font-medium text-gray-900 tracking-tighter leading-none mb-4">
                Welcome home,<br/>
                <span class="text-parentPrimary ">{{ firstName }}!</span>
              </DialogTitle>
              
              <div class="mt-4">
                <p class="text-gray-500 font-medium leading-relaxed">
                  You're officially part of the Errandr family. We're here to make your campus life faster, easier, and a lot more exciting.
                </p>
              </div>

              <div class="mt-12 space-y-4">
                <button
                  type="button"
                  class="w-full inline-flex justify-center items-center gap-2 rounded-2xl bg-gray-900 px-5 py-5 text-sm font-medium uppercase tracking-[0.2em] text-white hover:bg-parentPrimary transition-all duration-300 active:scale-95 transition-all"
                  @click="closeModal"
                >
                  Let's get started <ArrowRight class="w-4 h-4" />
                </button>
                <p class="text-sm font-medium text-gray-300 uppercase ">Errandr — Campus Life, Elevated.</p>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import { ArrowRight } from 'lucide-vue-next'
import confetti from 'canvas-confetti'
import { watch } from 'vue'

const props = defineProps<{
  isOpen: boolean
  firstName: string
}>()

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}

const triggerConfetti = () => {
  const duration = 3500;
  const end = Date.now() + duration;

  const frame = () => {
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 65,
      origin: { x: 0, y: 0.6 },
      colors: ['#FF5C1A', '#FFA785', '#FFF', '#FFD700', '#FF69B4']
    });
    confetti({
      particleCount: 7,
      angle: 120,
      spread: 65,
      origin: { x: 1, y: 0.6 },
      colors: ['#FF5C1A', '#FFA785', '#FFF', '#FFD700', '#FF69B4']
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };
  frame();
};

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    triggerConfetti();
  }
})
</script>

<style scoped>
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.animate-bounce-slow {
  animation: bounce-slow 3s ease-in-out infinite;
}
</style>
