<template>
  <section class="relative border-b border-slate-100 min-h-[calc(100dvh-4rem)] flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-10 overflow-hidden">
    <!-- Organic shapes, defined once and reused as clip paths. -->
    <svg class="absolute h-0 w-0 overflow-hidden" aria-hidden="true">
      <defs>
        <clipPath id="hero-flower-12" clipPathUnits="objectBoundingBox">
          <path d="M 0.5 0.02 C 0.5345 0.02, 0.5635 0.1029, 0.6035 0.1136 C 0.6435 0.1243, 0.7101 0.067, 0.74 0.0843 C 0.7699 0.1016, 0.7535 0.1879, 0.7828 0.2172 C 0.8121 0.2465, 0.8984 0.2301, 0.9157 0.26 C 0.933 0.2899, 0.8757 0.3565, 0.8864 0.3965 C 0.8971 0.4365, 0.98 0.4655, 0.98 0.5 C 0.98 0.5345, 0.8971 0.5635, 0.8864 0.6035 C 0.8757 0.6435, 0.933 0.7101, 0.9157 0.74 C 0.8984 0.7699, 0.8121 0.7535, 0.7828 0.7828 C 0.7535 0.8121, 0.7699 0.8984, 0.74 0.9157 C 0.7101 0.933, 0.6435 0.8757, 0.6035 0.8864 C 0.5635 0.8971, 0.5345 0.98, 0.5 0.98 C 0.4655 0.98, 0.4365 0.8971, 0.3965 0.8864 C 0.3565 0.8757, 0.2899 0.933, 0.26 0.9157 C 0.2301 0.8984, 0.2465 0.8121, 0.2172 0.7828 C 0.1879 0.7535, 0.1016 0.7699, 0.0843 0.74 C 0.067 0.7101, 0.1243 0.6435, 0.1136 0.6035 C 0.1029 0.5635, 0.02 0.5345, 0.02 0.5 C 0.02 0.4655, 0.1029 0.4365, 0.1136 0.3965 C 0.1243 0.3565, 0.067 0.2899, 0.0843 0.26 C 0.1016 0.2301, 0.1879 0.2465, 0.2172 0.2172 C 0.2465 0.1879, 0.2301 0.1016, 0.26 0.0843 C 0.2899 0.067, 0.3565 0.1243, 0.3965 0.1136 C 0.4365 0.1029, 0.4655 0.02, 0.5 0.02 Z" />
        </clipPath>
        <clipPath id="hero-flower-8" clipPathUnits="objectBoundingBox">
          <path d="M 0.5 0.02 C 0.5485 0.02, 0.5888 0.1255, 0.6454 0.1489 C 0.702 0.1723, 0.8051 0.1263, 0.8394 0.1606 C 0.8737 0.1949, 0.8277 0.298, 0.8511 0.3546 C 0.8745 0.4112, 0.98 0.4515, 0.98 0.5 C 0.98 0.5485, 0.8745 0.5888, 0.8511 0.6454 C 0.8277 0.702, 0.8737 0.8051, 0.8394 0.8394 C 0.8051 0.8737, 0.702 0.8277, 0.6454 0.8511 C 0.5888 0.8745, 0.5485 0.98, 0.5 0.98 C 0.4515 0.98, 0.4112 0.8745, 0.3546 0.8511 C 0.298 0.8277, 0.1949 0.8737, 0.1606 0.8394 C 0.1263 0.8051, 0.1723 0.702, 0.1489 0.6454 C 0.1255 0.5888, 0.02 0.5485, 0.02 0.5 C 0.02 0.4515, 0.1255 0.4112, 0.1489 0.3546 C 0.1723 0.298, 0.1263 0.1949, 0.1606 0.1606 C 0.1949 0.1263, 0.298 0.1723, 0.3546 0.1489 C 0.4112 0.1255, 0.4515 0.02, 0.5 0.02 Z" />
        </clipPath>
      </defs>
    </svg>

    <!-- Soft dot grid, the same seeding pattern used across the network. -->
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-70" />

    <!-- Floating organic badges. Decorative only, hidden from screen readers. -->
    <div class="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden="true">
      <div class="absolute left-[6%] top-[18%] h-28 w-28 bg-[#FF5C1A]/15 [clip-path:url(#hero-flower-12)] animate-[float_7s_ease-in-out_infinite]" />
      <div class="absolute right-[8%] top-[24%] h-20 w-20 bg-amber-200/70 [clip-path:url(#hero-flower-8)] animate-[float_9s_ease-in-out_infinite_reverse]" />
      <div class="absolute left-[14%] bottom-[16%] h-16 w-16 bg-sky-200/70 [clip-path:url(#hero-flower-8)] animate-[float_8s_ease-in-out_infinite]" />
      <div class="absolute right-[16%] bottom-[20%] h-24 w-24 bg-rose-200/60 [clip-path:url(#hero-flower-12)] animate-[float_10s_ease-in-out_infinite_reverse]" />
    </div>

    <div class="relative z-10 mx-auto w-full max-w-4xl text-center">
      <!-- Eyebrow pill -->
      <div v-if="eyebrow">
        <NuxtLink
          :to="eyebrowHref"
          class="group inline-flex items-center gap-2 rounded-full border border-[#FF5C1A]/25 bg-[#FF5C1A]/10 px-4 py-1.5 text-xs font-bold text-[#FF5C1A] shadow-2xs transition-colors hover:bg-[#FF5C1A]/15"
        >
          <span class="h-2 w-2 animate-pulse rounded-full bg-[#FF5C1A]/100" />
          <span>{{ eyebrow }}</span>
          <ArrowUpRight class="h-3.5 w-3.5 text-[#FF5C1A] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </NuxtLink>
      </div>

      <!-- Big heading plus the rotating line -->
      <h1 class="mt-6 text-4xl font-black leading-[1.08] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
        {{ title }}
      </h1>

      <div class="relative mt-3 flex h-11 items-center justify-center overflow-hidden sm:h-14">
        <TransitionGroup name="hero-slide" tag="div" class="w-full">
          <p
            :key="activeIndex"
            class="absolute inset-0 flex items-center justify-center px-4 text-lg font-black tracking-tight text-[#FF5C1A] sm:text-2xl"
          >
            {{ lines[activeIndex] }}
          </p>
        </TransitionGroup>
      </div>

      <p class="mx-auto mt-5 max-w-xl text-sm font-medium leading-relaxed text-slate-600 sm:text-base">
        <slot name="subtitle">{{ subtitle }}</slot>
      </p>

      <!-- Pill actions with circular arrow badges -->
      <div class="mt-8 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
        <NuxtLink
          :to="primaryTo"
          class="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-[#FF5C1A] px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-[#FF5C1A]/25 transition-all hover:bg-[#E54D12] active:scale-[0.98] sm:w-auto"
        >
          <span>{{ primaryLabel }}</span>
          <span class="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition-colors group-hover:bg-white/30">
            <ArrowUpRight class="h-4 w-4 text-white transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </NuxtLink>
        <NuxtLink
          v-if="secondaryLabel"
          :to="secondaryTo"
          class="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-bold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50 sm:w-auto"
        >
          {{ secondaryLabel }}
        </NuxtLink>
      </div>

      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { ArrowUpRight } from 'lucide-vue-next';

/**
 * The network-wide hero.
 *
 * Erranders For Business, Declutter and the Erranders marketplace share one hero design so
 * the products read as parts of the same company: a dot-grid stage, an eyebrow pill, one
 * bold statement, a rotating line that says what the product is for, and pill actions with
 * circular arrow badges.
 *
 * Only the copy and the link targets differ per product.
 */
const props = withDefaults(
  defineProps<{
    title: string;
    lines?: string[];
    subtitle?: string;
    eyebrow?: string;
    eyebrowHref?: string;
    primaryLabel?: string;
    primaryTo?: string;
    secondaryLabel?: string;
    secondaryTo?: string;
    /** How long each rotating line holds, in ms. */
    interval?: number;
  }>(),
  {
    lines: () => [],
    subtitle: '',
    eyebrow: '',
    eyebrowHref: '/declutter',
    primaryLabel: 'Get started',
    primaryTo: '/signup',
    secondaryLabel: '',
    secondaryTo: '/',
    interval: 3200,
  },
);

const activeIndex = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  if (props.lines.length < 2) return;
  timer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % props.lines.length;
  }, props.interval);
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
});

const lines = computed(() => (props.lines.length ? props.lines : ['']));
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-14px) rotate(6deg); }
}

.hero-slide-enter-active,
.hero-slide-leave-active {
  transition: opacity 0.45s ease, transform 0.45s ease;
}
.hero-slide-enter-from {
  opacity: 0;
  transform: translateY(18px);
}
.hero-slide-leave-to {
  opacity: 0;
  transform: translateY(-18px);
}
</style>
