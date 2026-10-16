<template>
  <Transition name="drawer">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex justify-end" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
      <!-- Backdrop -->
      <Transition name="fade">
        <div 
          v-if="isOpen" 
          class="fixed inset-0 bg-gray-900/20 backdrop-blur-sm transition-opacity" 
          @click="$emit('close')"
          aria-hidden="true"
        ></div>
      </Transition>

      <!-- Drawer panel -->
      <div class="relative w-full max-w-md h-full bg-white shadow-sm border border-gray-50 flex flex-col pointer-events-auto transform transition-transform duration-500 ease-in-out">
        
        <!-- Header area for Close Button -->
        <div class="absolute top-0 right-0 pt-6 pr-6 flex items-center z-10">
          <button 
            type="button" 
            class="rounded-full flex items-center justify-center w-10 h-10 bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-parentPrimary/20 transition-all" 
            @click="$emit('close')"
          >
            <span class="sr-only">Close panel</span>
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Scrollable Content slot -->
        <div class="flex-1 overflow-y-auto hide-scrollbar p-5 pt-12">
          <!-- Campus row: the campus that scopes everything the app shows -->
          <div
            v-if="campus"
            class="mb-4 flex items-center gap-3 rounded-xl border border-[#E7E2DA] bg-white p-3"
          >
            <span
              class="flex h-9 min-w-[2.25rem] shrink-0 items-center justify-center rounded-lg bg-[#171310] px-2 text-[10px] font-bold uppercase tracking-wide text-white"
            >
              {{ campus.shortName || campus.slug }}
            </span>
            <div class="min-w-0 flex-1">
              <p class="truncate text-[12px] font-bold leading-tight text-[#171310]">{{ campus.name }}</p>
              <p class="ff-mono mt-0.5 text-[9.5px] font-bold uppercase tracking-[0.12em] text-[#FF5C1A]">Current campus</p>
            </div>
            <button
              type="button"
              class="shrink-0 rounded-lg border border-[#E7E2DA] px-2.5 py-1.5 text-[11px] font-bold text-[#171310] transition-all hover:border-[#171310] hover:bg-[#171310] hover:text-white active:scale-95"
              @click="onChangeCampus"
            >
              Change
            </button>
          </div>

          <slot></slot>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { X } from 'lucide-vue-next';
import { useInstitution, isVendorSubdomainHost } from '@/composables/useInstitution';

defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits(['close']);

const { institution, openPicker } = useInstitution();

/**
 * The campus row shows which campus is scoping the app and offers a switch.
 * It is hidden on a vendor storefront subdomain, where the whole page belongs to
 * one vendor and the chooser is deliberately suppressed.
 */
const campusRowVisible = computed(() => !!institution.value && !isVendorSubdomainHost());
const campus = computed(() => (campusRowVisible.value ? institution.value : null));

const onChangeCampus = () => {
  openPicker();
  // The chooser is a full-screen overlay: let the drawer get out of its way.
  emit('close');
};
</script>

<style scoped>
.ff-mono {
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
}

.drawer-enter-from,
.drawer-leave-to {
  transform: translateX(100%);
}

.drawer-enter-to,
.drawer-leave-from {
  transform: translateX(0);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
