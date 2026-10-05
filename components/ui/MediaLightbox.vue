<template>
  <Teleport to="body">
    <Transition name="fade">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex flex-col"
        @keydown.esc="close"
        tabindex="0"
        ref="container"
      >
        <!-- Header / Close Button -->
        <div class="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/60 to-transparent">
          <div class="text-white/70 font-medium text-sm">
            {{ currentIndex + 1 }} / {{ mediaItems.length }}
          </div>
          <button 
            @click="close"
            class="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all active:scale-95"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Main Media Viewer -->
        <div 
          class="flex-1 relative flex items-center justify-center overflow-hidden touch-none"
          @touchstart="handleTouchStart"
          @touchend="handleTouchEnd"
        >
          <Transition name="slide" mode="out-in">
            <div :key="currentIndex" class="w-full h-full flex items-center justify-center p-4 md:p-12">
              <template v-if="currentItem.type === 'video'">
                <video 
                  :src="currentItem.url" 
                  class="max-w-full max-h-full object-contain rounded-lg shadow-sm border border-gray-50" 
                  controls 
                  autoplay 
                  playsinline
                ></video>
              </template>
              <template v-else>
                <img 
                  :src="currentItem.url" 
                  class="max-w-full max-h-full object-contain rounded-lg shadow-sm border border-gray-50" 
                />
              </template>
            </div>
          </Transition>

          <!-- Navigation Arrows -->
          <button 
            v-if="mediaItems.length > 1"
            @click.stop="prev"
            class="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-white/10 flex items-center justify-center text-white transition-all active:scale-95 disabled:opacity-20"
            :disabled="currentIndex === 0"
          >
            <ChevronLeft class="w-6 h-6" />
          </button>
          <button 
            v-if="mediaItems.length > 1"
            @click.stop="next"
            class="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/50 hover:bg-white/10 flex items-center justify-center text-white transition-all active:scale-95 disabled:opacity-20"
            :disabled="currentIndex === mediaItems.length - 1"
          >
            <ChevronRight class="w-6 h-6" />
          </button>
        </div>

        <!-- Thumbnail Strip -->
        <div v-if="mediaItems.length > 1" class="p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-center overflow-x-auto gap-2 scrollbar-hide">
          <button 
            v-for="(item, idx) in mediaItems" 
            :key="idx"
            @click="currentIndex = idx"
            class="w-16 h-16 shrink-0 rounded-lg overflow-hidden border transition-all relative"
            :class="idx === currentIndex ? 'border-white opacity-100 scale-105' : 'border-transparent opacity-50 hover:opacity-80'"
          >
            <template v-if="item.type === 'video'">
              <video :src="item.url" class="w-full h-full object-cover" muted></video>
              <div class="absolute inset-0 flex items-center justify-center bg-black/20">
                <Play class="w-4 h-4 text-white" fill="currentColor" />
              </div>
            </template>
            <template v-else>
              <img :src="item.url" class="w-full h-full object-cover" />
            </template>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-vue-next';

interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

const props = defineProps<{
  isOpen: boolean;
  mediaItems: MediaItem[];
  initialIndex: number;
}>();

const emit = defineEmits(['close']);

const currentIndex = ref(0);
const container = ref<HTMLElement | null>(null);

const currentItem = computed(() => props.mediaItems[currentIndex.value] || null);

watch(() => props.isOpen, (val) => {
  if (val) {
    currentIndex.value = props.initialIndex || 0;
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      container.value?.focus();
    }, 100);
  } else {
    document.body.style.overflow = '';
  }
});

const close = () => {
  emit('close');
};

const next = () => {
  if (currentIndex.value < props.mediaItems.length - 1) {
    currentIndex.value++;
  }
};

const prev = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

// Touch handling for mobile swipe
let touchStartX = 0;
const handleTouchStart = (e: TouchEvent) => {
  touchStartX = e.changedTouches[0].screenX;
};
const handleTouchEnd = (e: TouchEvent) => {
  const touchEndX = e.changedTouches[0].screenX;
  if (touchStartX - touchEndX > 50) {
    next();
  } else if (touchEndX - touchStartX > 50) {
    prev();
  }
};

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
  if (!props.isOpen) return;
  if (e.key === 'ArrowRight') next();
  if (e.key === 'ArrowLeft') prev();
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from {
  opacity: 0;
  transform: scale(0.95);
}
.slide-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
