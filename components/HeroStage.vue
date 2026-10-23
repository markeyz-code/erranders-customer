<template>
  <section
    :class="[
      isElevated ? 'z-40' : 'z-20',
      'relative border-b border-slate-100 min-h-[calc(100dvh-3.5rem)] flex flex-col justify-start sm:justify-center px-4 sm:px-6 lg:px-8 pt-28 pb-12 sm:pt-36 sm:pb-16 md:pt-40 md:pb-20 overflow-visible bg-gradient-to-b from-slate-50/70 via-white to-white'
    ]"
  >
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

    <!-- Soft dot grid background -->
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(#e2e8f0_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-70" />

    <!-- Ambient Glows & Floating shapes -->
    <div class="pointer-events-none absolute inset-0 overflow-hidden">
      <div class="absolute -top-32 -left-32 w-96 h-96 bg-[#FF5C1A]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="hidden lg:block">
        <div class="absolute left-[5%] top-[16%] h-24 w-24 bg-[#FF5C1A]/15 [clip-path:url(#hero-flower-12)] animate-[float_7s_ease-in-out_infinite]" />
        <div class="absolute right-[6%] top-[20%] h-20 w-20 bg-amber-200/60 [clip-path:url(#hero-flower-8)] animate-[float_9s_ease-in-out_infinite_reverse]" />
        <div class="absolute left-[10%] bottom-[14%] h-16 w-16 bg-sky-200/60 [clip-path:url(#hero-flower-8)] animate-[float_8s_ease-in-out_infinite]" />
        <div class="absolute right-[12%] bottom-[18%] h-20 w-20 bg-rose-200/50 [clip-path:url(#hero-flower-12)] animate-[float_10s_ease-in-out_infinite_reverse]" />
      </div>
    </div>

    <div class="relative z-10 mx-auto w-full mt-6 max-w-5xl text-center space-y-6">
      <!-- Dynamic Multilingual Rotating Content with Slow Fade-in / Fade-out -->
      <div class="min-h-[200px] sm:min-h-[220px] md:min-h-[240px] flex flex-col justify-center items-center">
        <Transition name="slow-fade" mode="out-in">
          <div :key="currentPhraseIndex" class="space-y-4 max-w-4xl mx-auto flex flex-col items-center">
            <!-- Top Eyebrow Badge (Relatable Hook) -->
            <div class="inline-flex items-center gap-2 rounded-full border border-[#FF5C1A]/25 bg-[#FF5C1A]/10 px-4 py-1.5 text-xs font-bold text-[#FF5C1A] shadow-2xs">
              <span class="h-2 w-2 animate-pulse rounded-full bg-[#FF5C1A]" />
              <span>{{ currentMessage.eyebrow }}</span>
            </div>

            <!-- Bolder Main Headline (Changes across languages and campus slang) -->
            <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.12] tracking-tight text-slate-900 max-w-4xl mx-auto">
              {{ currentMessage.headlinePrefix }}
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5C1A] via-amber-500 to-[#FF4500] block sm:inline">
                {{ currentMessage.headlineHighlight }}
              </span>
            </h1>

            <!-- Cute Marketing Catch Text (Changes smoothly with headline) -->
            <p class="text-base sm:text-xl md:text-2xl font-bold text-slate-600 tracking-tight leading-relaxed max-w-3xl mx-auto">
              {{ currentMessage.subtext }}
            </p>
          </div>
        </Transition>
      </div>

      <!-- Quick Action CTA Buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <NuxtLink
          to="/vendors"
          class="group inline-flex w-full sm:w-auto items-center justify-center gap-3 rounded-full bg-[#FF5C1A] px-7 py-3.5 text-sm font-bold text-white shadow-md shadow-[#FF5C1A]/25 transition-all hover:bg-[#E54D12] active:scale-[0.98]"
        >
          <span>Browse Active Food & Vendors</span>
          <span class="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition-colors group-hover:bg-white/30">
            <ArrowUpRight class="h-4 w-4 text-white transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </NuxtLink>
        <NuxtLink
          to="/errands/custom"
          class="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3.5 text-sm font-bold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
        >
          <span>Send a Custom Errand</span>
          <span class="text-xs">🏃🏽‍♂️💨</span>
        </NuxtLink>
      </div>

      <!-- Slot for Search Bar, Omnibox, Suggestions & Filter tabs -->
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { ArrowUpRight } from 'lucide-vue-next';

withDefaults(
  defineProps<{
    title?: string;
    lines?: string[];
    subtitle?: string;
    eyebrow?: string;
    eyebrowHref?: string;
    primaryLabel?: string;
    primaryTo?: string;
    secondaryLabel?: string;
    secondaryTo?: string;
    isElevated?: boolean;
  }>(),
  {
    title: 'Erranders',
    lines: () => [
      'Order food from the vendor next door',
      'Book a barber, a tutor or a mover',
      'Get it delivered to your hostel door',
      'Every campus hustle, one place',
    ],
    subtitle: 'Campus services, delivery and student vendors in one place.',
    eyebrow: 'Now on campus',
    eyebrowHref: '/vendors',
    primaryLabel: 'Browse vendors',
    primaryTo: '/vendors',
    secondaryLabel: 'Send Custom Errand',
    secondaryTo: '/errands/custom',
    isElevated: false,
  },
);

interface HeroMessage {
  eyebrow: string;
  headlinePrefix: string;
  headlineHighlight: string;
  subtext: string;
}

const heroMessages: HeroMessage[] = [
  // 1. Pidgin (Campus Heat / Chill)
  {
    eyebrow: 'The sun is outside fighting everybody? 😭☀️ Omo, rest!',
    headlinePrefix: 'Sun dey bake everybody outside?',
    headlineHighlight: 'Omo, Rest & Just Errand It! 🛵💨',
    subtext: 'You stay cool in your hostel, we run the trek — hot food, cold drinks & packages delivered to your room! 🧡',
  },
  // 2. Campus Slang (Downstairs Trek / Urgent Items)
  {
    eyebrow: 'Why bother trekking downstairs to pick up anything? 📦🚪',
    headlinePrefix: 'Trek downstairs under this sun?',
    headlineHighlight: 'Just Errand It to Your Door! 🏃🏽‍♂️✨',
    subtext: 'Some errands can wait, but that urgent package or warm meal? Errand Ninjas deliver straight to your floor.',
  },
  // 3. Yorùbá (Comfort & Doorstep Service)
  {
    eyebrow: 'Oòrùn ń jó gbogbo èèyàn níta campus? ☀️',
    headlinePrefix: 'Kí ló dé tí wàá fi fìyà jẹ ara ẹ?',
    headlineHighlight: 'Jókòó, Kàn Errand It! 🛵💨',
    subtext: 'Má ṣe yọ ara ẹ lẹ́nu rárá. Ìwọ fọkàn balẹ̀ sínú hostel, àwọn Ninjas wa yóò gbé oúnjẹ dídùn dé bá ẹ!',
  },
  // 4. Campus Slang (8am Lecture Hunger / Meal Schedule)
  {
    eyebrow: 'Entering 8am class on an empty stomach? Never again! ⏰🍱',
    headlinePrefix: 'Hungry for 8am lecture?',
    headlineHighlight: 'Auto-pilot with Meal Schedule! ⚡😋',
    subtext: 'Schedule breakfast and lunch ahead of time. Hot meals arrive right on cue before your first lecture starts.',
  },
  // 5. Igbo (Rest & Rapid Errands)
  {
    eyebrow: 'Anwụ na-eti mmadụ niile na campus taa? ☀️',
    headlinePrefix: 'Gịnị mere ị ga-eji gbaa ọsọ n\'anwụ?',
    headlineHighlight: 'Nọrọ Hostel, Just Errand It! 🛵✨',
    subtext: 'Nwanne, zuru ike na hostel! Anyị ga-agbara gị ọsọ weta nri ụtọ na ngwugwu ọbụla bịarute gị aka.',
  },
  // 6. Pidgin (Roommates / Group Orders)
  {
    eyebrow: 'Delivery fee dey choke you and your roommates? 😩',
    headlinePrefix: 'Why pay solo delivery fee?',
    headlineHighlight: 'Split Am With Group Orders! 👥🍕',
    subtext: 'Team up with your roomies or course mates, order together from your favorite vendors, and divide the cost sharp-sharp!',
  },
  // 7. Hausa (Peace of Mind & Hot Meals)
  {
    eyebrow: 'Rana tana kona mutane a harabar makaranta? ☀️',
    headlinePrefix: 'Kada ka wahalar da kanka a waje,',
    headlineHighlight: 'Kawai Errand It! 🛵💨',
    subtext: 'Huta a daki lafiya! Ninjas zasu kawo maka abinci mai dumi da dukkan kayan bukata har kofar dakinka.',
  },
  // 8. Campus Relatable (The Classic Erranders Promise)
  {
    eyebrow: 'Why trek from New Hall to Gate under scorching sun? 🏃🏽‍♂️🔥',
    headlinePrefix: 'Why stress yourself on campus?',
    headlineHighlight: 'Just Errand It! 🛵💨',
    subtext: 'From cafeteria meals to boutique items, pharmacy runs, and market pickups — consider it handled with speed.',
  },
];

const currentPhraseIndex = ref(0);
let rotationInterval: ReturnType<typeof setInterval> | null = null;

const currentMessage = computed<HeroMessage>(() => {
  return heroMessages[currentPhraseIndex.value % heroMessages.length];
});

onMounted(() => {
  rotationInterval = setInterval(() => {
    currentPhraseIndex.value = (currentPhraseIndex.value + 1) % heroMessages.length;
  }, 5000);
});

onBeforeUnmount(() => {
  if (rotationInterval) {
    clearInterval(rotationInterval);
    rotationInterval = null;
  }
});
</script>

<style scoped>
.slow-fade-enter-active,
.slow-fade-leave-active {
  transition: opacity 0.85s ease-in-out, transform 0.85s cubic-bezier(0.16, 1, 0.3, 1);
}

.slow-fade-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.slow-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
