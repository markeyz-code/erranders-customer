<template>
  <div class="relative w-full overflow-hidden group" :class="aspectRatio">
    <!-- Scroll Container -->
    <div 
      ref="scrollContainer"
      class="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-full w-full"
      @scroll="handleScroll"
    >
      <div 
        v-for="(item, idx) in mediaItems" 
        :key="idx"
        class="w-full h-full flex-shrink-0 snap-center relative cursor-pointer"
        @click.stop="$emit('click-media', idx)"
      >
        <template v-if="item.type === 'video'">
          <!-- Video Thumbnail/Player -->
          <video 
            :src="item.url" 
            class="w-full h-full object-cover" 
            autoplay
            muted 
            loop 
            playsinline 
            preload="auto"
          ></video>
        </template>
        <template v-else>
          <img :src="item.url || defaultPlaceholder" class="w-full h-full object-cover transition-transform duration-700" :class="hoverScale ? 'group-hover:scale-105' : ''" />
        </template>
        
        <!-- Gradient overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-gray-900/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
        <slot name="overlay" :item="item" :index="idx"></slot>
      </div>
    </div>

    <!-- Navigation Arrows -->
    <button 
      v-if="showArrows && mediaItems.length > 1 && currentIndex > 0"
      @click.stop="scrollTo(currentIndex - 1)"
      class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center shadow-sm border border-gray-50 text-gray-800 opacity-0 group-hover:opacity-100 transition-all hover:bg-white active:scale-95"
    >
      <ChevronLeft class="w-4 h-4" />
    </button>
    <button 
      v-if="showArrows && mediaItems.length > 1 && currentIndex < mediaItems.length - 1"
      @click.stop="scrollTo(currentIndex + 1)"
      class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 backdrop-blur-md flex items-center justify-center shadow-sm border border-gray-50 text-gray-800 opacity-0 group-hover:opacity-100 transition-all hover:bg-white active:scale-95"
    >
      <ChevronRight class="w-4 h-4" />
    </button>

    <!-- Carousel Dots -->
    <div v-if="mediaItems.length > 1" class="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5 pointer-events-none z-10">
      <div 
        v-for="(_, idx) in mediaItems" 
        :key="idx"
        class="w-1.5 h-1.5 rounded-full transition-all duration-300 shadow-sm"
        :class="idx === currentIndex ? 'bg-white w-3' : 'bg-white/50'"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { ChevronLeft, ChevronRight, Play } from 'lucide-vue-next';

interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

const props = defineProps<{
  mediaItems: MediaItem[];
  aspectRatio?: string;
  defaultPlaceholder?: string;
  showArrows?: boolean;
  hoverScale?: boolean;
}>();

const emit = defineEmits(['click-media']);

const scrollContainer = ref<HTMLElement | null>(null);
const currentIndex = ref(0);

const handleScroll = () => {
  if (!scrollContainer.value) return;
  const scrollLeft = scrollContainer.value.scrollLeft;
  const width = scrollContainer.value.offsetWidth;
  currentIndex.value = Math.round(scrollLeft / width);
};

const scrollTo = (index: number) => {
  if (!scrollContainer.value) return;
  const width = scrollContainer.value.offsetWidth;
  scrollContainer.value.scrollTo({
    left: width * index,
    behavior: 'smooth'
  });
};
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
    display: none;
}
.scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
