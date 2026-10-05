<template>
  <div class="relative inline-block text-left" v-click-outside="close">
    <button
      ref="triggerRef"
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-4 py-3 rounded-full border border-gray-50 transition-all hover:bg-gray-50 active:scale-95 whitespace-nowrap"
      :class="[
        isOpen ? 'bg-gray-900 text-white border-gray-25shadow-sm border border-gray-50' : 'bg-white text-gray-600',
        active ? 'bg-parentPrimary/10 text-parentPrimary border-parentPrimary/20' : ''
      ]"
    >
      <span class="text-sm font-bold">{{ label }}</span>
      <ChevronDown class="w-4 h-4 transition-transform" :class="{ 'rotate-180': isOpen }" />
    </button>

    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-y-1 opacity-0 scale-95"
        enter-to-class="translate-y-0 opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100 scale-100"
        leave-to-class="translate-y-1 opacity-0 scale-95"
      >
        <div 
          v-if="isOpen" 
          class="fixed z-[9999] w-80 bg-white rounded-[2rem] shadow-sm border border-gray-50 border border-gray-50 p-5"
          :style="{
            top: `${y + height + 12}px`,
            left: `${x}px`
          }"
        >
          <div class="flex items-center justify-between mb-8">
            <h3 class="text-2xl font-medium text-gray-900 tracking-tight">{{ label }}</h3>
            <button @click="close" class="p-2 hover:bg-gray-50 rounded-full transition-colors order-2">
              <X class="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div class="mb-10">
            <slot></slot>
          </div>

          <div class="flex items-center justify-between gap-4 pt-6 border-t border-gray-50">
            <button
              @click="reset"
              class="text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors"
            >
              Reset
            </button>
            <button
              @click="apply"
              class="px-10 py-4 bg-gray-900 text-white rounded-2xl text-sm font-bold shadow-sm border border-gray-50 hover:bg-parentPrimary transition-all active:scale-95"
            >
              Apply
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useElementBounding } from '@vueuse/core';
import { ChevronDown, X } from 'lucide-vue-next';

const props = defineProps<{
  label: string;
  active?: boolean;
}>();

const triggerRef = ref<HTMLElement | null>(null);
const { x, y, width, height } = useElementBounding(triggerRef);

const emit = defineEmits(['apply', 'reset']);

const isOpen = ref(false);

const close = () => {
  isOpen.value = false;
};

const reset = () => {
  emit('reset');
  close();
};

const apply = () => {
  emit('apply');
  close();
};

// Simple click outside directive implementation
const vClickOutside = {
  mounted(el: any, binding: any) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value();
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el: any) {
    document.removeEventListener('click', el.clickOutsideEvent);
  },
};
</script>
