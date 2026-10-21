<template>
  <section class="relative border-b border-slate-100 min-h-[calc(100dvh-3.5rem)] flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 overflow-hidden bg-gradient-to-b from-slate-50/70 via-white to-white">
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
      <!-- ═══ DESKTOP-ONLY FLOATING ORGANIC HERO IMAGES (Strictly hidden on Mobile) ═══ -->
      <!-- Card 1: Top Right Floating Photo (Student receiving hot food delivery in hostel) -->
      <div class="hidden lg:block absolute top-12 right-4 xl:right-12 z-20 group cursor-pointer transition-all duration-500 hover:scale-105">
        <div class="relative w-44 h-44 xl:w-52 xl:h-52 drop-shadow-2xl">
          <div class="w-full h-full overflow-hidden rounded-[2.5rem] border-4 border-white shadow-xl bg-slate-100">
            <img
              src="/img/hero_student_delivery.jpg"
              alt="Student receiving food delivery in hostel"
              class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-115"
            />
          </div>
          <!-- Cute Top Badge -->
          <div class="absolute -top-3 -right-2 px-2.5 py-1 rounded-full bg-[#FF5C1A] text-white text-[10px] font-black shadow-md flex items-center gap-1">
            <span>🛵</span> Doorstep Delivery
          </div>
          <!-- Micro Caption Pill -->
          <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3.5 py-1.5 bg-white/95 backdrop-blur-md rounded-full border border-slate-200/90 shadow-md text-xs font-black text-slate-800 flex items-center gap-1.5 transition-transform group-hover:scale-105">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>🍲 Jollof Pack Delivered</span>
          </div>
        </div>
      </div>

      <!-- Card 2: Bottom Left Floating Photo (You Stay, We Run) -->
      <div class="hidden lg:block absolute bottom-8 left-4 xl:left-12 z-20 group cursor-pointer transition-all duration-500 hover:scale-105">
        <div class="relative w-36 h-36 xl:w-44 xl:h-44 drop-shadow-xl">
          <div class="w-full h-full overflow-hidden rounded-[2.2rem] border-3 border-white shadow-lg bg-slate-100">
            <img
              src="/img/hero_student_delivery.jpg"
              alt="You Stay, We Run on campus"
              class="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-110"
            />
          </div>
          <!-- Micro Caption Pill -->
          <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 bg-white/95 backdrop-blur-md rounded-full border border-slate-200/90 shadow-md text-[11px] font-black text-slate-800 flex items-center gap-1.5">
            <span class="text-amber-500">✨</span>
            <span>You Stay, We Run</span>
          </div>
        </div>
      </div>

      <div class="hidden lg:block">
        <div class="absolute left-[5%] top-[16%] h-24 w-24 bg-[#FF5C1A]/15 [clip-path:url(#hero-flower-12)] animate-[float_7s_ease-in-out_infinite]" />
        <div class="absolute right-[6%] top-[20%] h-20 w-20 bg-amber-200/60 [clip-path:url(#hero-flower-8)] animate-[float_9s_ease-in-out_infinite_reverse]" />
        <div class="absolute left-[10%] bottom-[14%] h-16 w-16 bg-sky-200/60 [clip-path:url(#hero-flower-8)] animate-[float_8s_ease-in-out_infinite]" />
        <div class="absolute right-[12%] bottom-[18%] h-20 w-20 bg-rose-200/50 [clip-path:url(#hero-flower-12)] animate-[float_10s_ease-in-out_infinite_reverse]" />
      </div>
    </div>

    <div class="relative z-10 mx-auto w-full max-w-5xl text-center space-y-6">
      <!-- Top Eyebrow: Relatable Campus Hook + Language Selector -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
        <div class="inline-flex items-center gap-2 rounded-full border border-[#FF5C1A]/25 bg-[#FF5C1A]/10 px-4 py-1.5 text-xs font-bold text-[#FF5C1A] shadow-2xs">
          <span class="h-2 w-2 animate-pulse rounded-full bg-[#FF5C1A]" />
          <span>The sun is outside fighting everybody? 😭☀️ Omo, rest!</span>
          <span class="hidden md:inline text-slate-400 font-mono">•</span>
          <span class="hidden md:inline font-black text-slate-900">YOU STAY, WE RUN 🧡</span>
        </div>

        <!-- Interactive Multilingual Tabs -->
        <div class="flex items-center gap-1 bg-slate-100/90 p-1 rounded-full border border-slate-200/80 backdrop-blur-xs">
          <button
            v-for="lang in languageOptions"
            :key="lang.id"
            @click="selectLanguage(lang.id)"
            :class="[
              activeLangFilter === lang.id
                ? 'bg-slate-900 text-white shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900 font-semibold hover:bg-white/60'
            ]"
            class="px-2.5 py-1 rounded-full text-[11px] sm:text-xs transition-all flex items-center gap-1 cursor-pointer"
          >
            <span>{{ lang.flag }}</span>
            <span>{{ lang.label }}</span>
          </button>
        </div>
      </div>

      <!-- Main Headline: Student Relatable Question & Solution -->
      <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight text-slate-900 max-w-4xl mx-auto">
        Why stress yourself on campus?
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5C1A] via-amber-500 to-[#FF4500] block sm:inline">
          Just Errand It! 🛵💨
        </span>
      </h1>

      <!-- Dynamic Typewriter Showcase Box -->
      <div class="max-w-3xl mx-auto py-1">
        <!-- Live Badges: Language + Feature Indicator -->
        <div class="flex flex-wrap items-center justify-center gap-2 mb-2.5">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs" :class="currentPhrase.badgeClass">
            <span>{{ currentPhrase.flag }}</span>
            <span class="uppercase tracking-wider font-mono text-[10px]">{{ currentPhrase.lang }}</span>
          </span>
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
            <span>{{ currentPhrase.icon }}</span>
            <span>{{ currentPhrase.feature }}</span>
          </span>
        </div>

        <!-- Question Prompt -->
        <p class="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">
          👀 {{ currentPhrase.question }}
        </p>

        <!-- Typed Answer Text -->
        <div class="min-h-[4rem] sm:min-h-[3.5rem] flex items-center justify-center px-4">
          <p class="text-lg sm:text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight font-heading leading-snug">
            <span>{{ typedText }}</span>
            <span class="inline-block w-0.5 sm:w-1 h-6 sm:h-7 bg-[#FF5C1A] ml-1.5 animate-pulse align-middle"></span>
          </p>
        </div>
      </div>

      <!-- Feature Pill Quick Links -->
      <div class="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto pt-1">
        <NuxtLink
          to="/vendors"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50/80 hover:bg-orange-100/90 text-orange-800 border border-orange-200/80 text-xs font-bold transition-all hover:scale-105"
        >
          <span>🛵</span>
          <span>Normal Errands</span>
        </NuxtLink>
        <NuxtLink
          to="/errands/custom"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50/80 hover:bg-indigo-100/90 text-indigo-800 border border-indigo-200/80 text-xs font-bold transition-all hover:scale-105"
        >
          <span>🤝</span>
          <span>Custom Errands</span>
        </NuxtLink>
        <NuxtLink
          to="/orders/group"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50/80 hover:bg-emerald-100/90 text-emerald-800 border border-emerald-200/80 text-xs font-bold transition-all hover:scale-105"
        >
          <span>👥</span>
          <span>Group Orders (Split Fee)</span>
        </NuxtLink>
        <NuxtLink
          to="/meal-desk"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50/80 hover:bg-amber-100/90 text-amber-800 border border-amber-200/80 text-xs font-bold transition-all hover:scale-105"
        >
          <span>🍱</span>
          <span>Meal Desk</span>
        </NuxtLink>
        <NuxtLink
          to="/meal-schedule"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50/80 hover:bg-purple-100/90 text-purple-800 border border-purple-200/80 text-xs font-bold transition-all hover:scale-105"
        >
          <span>⏰</span>
          <span>Meal Schedule</span>
        </NuxtLink>
        <NuxtLink
          to="/declutter"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold transition-all hover:scale-105"
        >
          <span>✨</span>
          <span>Declutter Room</span>
        </NuxtLink>
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

      <!-- Trust Social Proof -->
      <div class="mt-8 pt-6 border-t border-slate-200/70 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div class="p-2">
          <p class="text-lg sm:text-xl font-black text-slate-900 font-mono tracking-tight">15 - 25 Mins</p>
          <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Hostel Door Delivery</p>
        </div>
        <div class="p-2">
          <p class="text-lg sm:text-xl font-black text-[#FF5C1A] font-mono tracking-tight">Active Ninjas</p>
          <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Ready on Every Campus</p>
        </div>
        <div class="p-2">
          <p class="text-lg sm:text-xl font-black text-emerald-600 font-mono tracking-tight">₦0 Queue</p>
          <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Skip Long Cafeteria Lines</p>
        </div>
        <div class="p-2">
          <p class="text-lg sm:text-xl font-black text-slate-900 font-mono tracking-tight">50% Split Fee</p>
          <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">With Group Orders</p>
        </div>
      </div>
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
  },
);

interface StudentPhrase {
  question: string;
  answer: string;
  lang: 'Pidgin' | 'Yorùbá' | 'Igbo' | 'Hausa';
  feature: 'Normal Errands' | 'Custom Errands' | 'Group Orders' | 'Meal Desk' | 'Meal Schedule';
  flag: string;
  badgeClass: string;
  icon: string;
}

const languageOptions = [
  { id: 'all', label: 'All Vibes', flag: '🔥' },
  { id: 'Pidgin', label: 'Pidgin', flag: '🇳🇬' },
  { id: 'Yorùbá', label: 'Yorùbá', flag: '🟢' },
  { id: 'Igbo', label: 'Igbo', flag: '🟡' },
  { id: 'Hausa', label: 'Hausa', flag: '🔵' },
];

const activeLangFilter = ref<'all' | 'Pidgin' | 'Yorùbá' | 'Igbo' | 'Hausa'>('all');

const studentPhrases: StudentPhrase[] = [
  // Pidgin
  {
    question: "Sun dey fight everybody outside? 😭☀️",
    answer: "Omo, rest! You stay, we run — hot food & pickups to your hostel door! 🛵💨",
    lang: "Pidgin",
    feature: "Normal Errands",
    flag: "🇳🇬",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    icon: "🛵",
  },
  {
    question: "Why bother coming downstairs to pick up an item? 🏃🏽‍♂️",
    answer: "Just Errand It! Ninjas dey run custom errands anywhere on campus! 🤝",
    lang: "Pidgin",
    feature: "Custom Errands",
    flag: "🇳🇬",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    icon: "🤝",
  },
  {
    question: "Delivery fee dey choke you and your roommates? 😩",
    answer: "Order together with Group Orders & split delivery fee sharp-sharp! 👥",
    lang: "Pidgin",
    feature: "Group Orders",
    flag: "🇳🇬",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    icon: "👥",
  },
  {
    question: "Tired of queuing for 45 minutes at campus cafeteria? 🍱",
    answer: "Use Meal Desk: pre-order your favorite meal, pickup or delivered hot! 😋",
    lang: "Pidgin",
    feature: "Meal Desk",
    flag: "🇳🇬",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    icon: "🍱",
  },
  {
    question: "Entering 8am class on an empty stomach? 😭",
    answer: "Set Meal Schedule! Auto-pilot your daily breakfast & lunch without stress! ⏰",
    lang: "Pidgin",
    feature: "Meal Schedule",
    flag: "🇳🇬",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    icon: "⏰",
  },

  // Yorùbá
  {
    question: "Oòrùn ń jó gbogbo èèyàn níta campus? ☀️",
    answer: "Omo, má ṣe yọ ara ẹ lẹ́nu! Ìwọ jókòó sínú yàrá, Erranders ó sáré fún ẹ! 🧡",
    lang: "Yorùbá",
    feature: "Normal Errands",
    flag: "🟢",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200/80",
    icon: "🛵",
  },
  {
    question: "Kí ló dé tí wàá fi sọ̀kalẹ̀ láti gba nǹkan ní hostel? 🚪",
    answer: "Kàn 'Errand It'! Àwọn Ninjas wa yóò gbé Custom Errand ẹ wá sí ẹnu-ọ̀nà! 🤝",
    lang: "Yorùbá",
    feature: "Custom Errands",
    flag: "🟢",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200/80",
    icon: "🤝",
  },
  {
    question: "Ṣé ìwọ àti àwọn roommates ẹ fẹ́ jẹun pọ̀? 🥘",
    answer: "Lo Group Orders kí ẹ pín owó delivery kù sí pẹ́tẹ́pẹ́tẹ́! 👥",
    lang: "Yorùbá",
    feature: "Group Orders",
    flag: "🟢",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200/80",
    icon: "👥",
  },
  {
    question: "Báwo l’o ṣe máa jẹun láìsí wàhálà queue lórí campus? 🍱",
    answer: "Meal Desk wà fún ẹ: oúnjẹ dídùn tó ń jò, lẹ́sẹ̀kẹsẹ̀ láìsí delay! ✨",
    lang: "Yorùbá",
    feature: "Meal Desk",
    flag: "🟢",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200/80",
    icon: "🍱",
  },
  {
    question: "Ṣé o fẹ́ kí oúnjẹ rẹ dé kíákíá kí kíláàsì tó bẹ̀rẹ̀? ⏰",
    answer: "Ṣètò Meal Schedule rẹ, jẹun bí ọba lojoojúmọ́ láìsí ìkùnà! 👑",
    lang: "Yorùbá",
    feature: "Meal Schedule",
    flag: "🟢",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200/80",
    icon: "⏰",
  },

  // Igbo
  {
    question: "Anwụ na-eti mmadụ niile na campus taa? ☀️",
    answer: "Nwanne, nọrọ na hostel zuru ike! Anyị ga-agbara gị ọsọ weta nri ụtọ! 🛵💨",
    lang: "Igbo",
    feature: "Normal Errands",
    flag: "🟡",
    badgeClass: "bg-purple-50 text-purple-800 border-purple-200/80",
    icon: "🛵",
  },
  {
    question: "Gịnị mere ị ga-eji rịdata steepụ iji buru ngwugwu? 📦",
    answer: "Kọwaa Custom Errand gi, Errand Ninja ga-aga ebe ọbụla zụtara gị ya! 🤝",
    lang: "Igbo",
    feature: "Custom Errands",
    flag: "🟡",
    badgeClass: "bg-purple-50 text-purple-800 border-purple-200/80",
    icon: "🤝",
  },
  {
    question: "Gị na ndị roommates gị chọrọ ịchekwa ego delivery? 💰",
    answer: "Jiri Group Orders tụkọta ọnụ, wee kewaa ego n'ụzọ dị mfe! 👥",
    lang: "Igbo",
    feature: "Group Orders",
    flag: "🟡",
    badgeClass: "bg-purple-50 text-purple-800 border-purple-200/80",
    icon: "👥",
  },
  {
    question: "Ikwụ n'ahịrị nri na cafeteria na-agwụ gị ike? 🍱",
    answer: "Pịa Meal Desk: hazie nri gị ozugbo, buru ya n'enweghị igbu oge! 😋",
    lang: "Igbo",
    feature: "Meal Desk",
    flag: "🟡",
    badgeClass: "bg-purple-50 text-purple-800 border-purple-200/80",
    icon: "🍱",
  },
  {
    question: "Iji afọ efu aga klaasị 8am kacha ewute mmadụ? ⏰",
    answer: "Hazie Meal Schedule gị taa, ka nri na-erute gị n'oge oge ọbụla! 🚀",
    lang: "Igbo",
    feature: "Meal Schedule",
    flag: "🟡",
    badgeClass: "bg-purple-50 text-purple-800 border-purple-200/80",
    icon: "⏰",
  },

  // Hausa
  {
    question: "Rana tana kona mutane a waje sosai? ☀️",
    answer: "Huta a daki, Erranders zasu yi maka hidimar abinci da kaya har kofa! 🛵💨",
    lang: "Hausa",
    feature: "Normal Errands",
    flag: "🔵",
    badgeClass: "bg-blue-50 text-blue-800 border-blue-200/80",
    icon: "🛵",
  },
  {
    question: "Me zai sa ka wahalar da kanka saukowa kasa? 🏃🏽‍♂️",
    answer: "Kawai 'Errand It'! Ninja zai je ko ina a makaranta ko gari ya siyo maka! 🤝",
    lang: "Hausa",
    feature: "Custom Errands",
    flag: "🔵",
    badgeClass: "bg-blue-50 text-blue-800 border-blue-200/80",
    icon: "🤝",
  },
  {
    question: "Kuna so ku rage kudin aikawa tare da abokan daki? 👥",
    answer: "Ku hada Group Orders, kowa ya biya 'yan canji kadan a saukake! 💰",
    lang: "Hausa",
    feature: "Group Orders",
    flag: "🔵",
    badgeClass: "bg-blue-50 text-blue-800 border-blue-200/80",
    icon: "👥",
  },
  {
    question: "Gajiya da dogon layi a cafeteria na makaranta? 🍱",
    answer: "Yi amfani da Meal Desk: karbi abincinka mai dumi ba tare da jira ba! ✨",
    lang: "Hausa",
    feature: "Meal Desk",
    flag: "🔵",
    badgeClass: "bg-blue-50 text-blue-800 border-blue-200/80",
    icon: "🍱",
  },
  {
    question: "Kar ka taba shiga aji da yunwa da sassafe! ⏰",
    answer: "Saita Meal Schedule dinka, a kawo maka karin kumallo a kan lokaci! 🌟",
    lang: "Hausa",
    feature: "Meal Schedule",
    flag: "🔵",
    badgeClass: "bg-blue-50 text-blue-800 border-blue-200/80",
    icon: "⏰",
  },
];

const activePhrases = computed(() => {
  if (activeLangFilter.value === 'all') return studentPhrases;
  return studentPhrases.filter(p => p.lang === activeLangFilter.value);
});

const currentPhraseIndex = ref(0);
const typedText = ref('');
const isDeleting = ref(false);
let typewriterTimeout: any = null;

const currentPhrase = computed<StudentPhrase>(() => {
  const list = activePhrases.value;
  return list[currentPhraseIndex.value % list.length] || studentPhrases[0];
});

const selectLanguage = (langId: any) => {
  activeLangFilter.value = langId;
  currentPhraseIndex.value = 0;
  typedText.value = '';
  isDeleting.value = false;
  if (typewriterTimeout) clearTimeout(typewriterTimeout);
  runTypewriter();
};

const runTypewriter = () => {
  const phrase = currentPhrase.value.answer;
  const currentLength = typedText.value.length;

  if (!isDeleting.value) {
    if (currentLength < phrase.length) {
      typedText.value = phrase.slice(0, currentLength + 1);
      typewriterTimeout = setTimeout(runTypewriter, 32);
    } else {
      typewriterTimeout = setTimeout(() => {
        isDeleting.value = true;
        runTypewriter();
      }, 2500);
    }
  } else {
    if (currentLength > 0) {
      typedText.value = phrase.slice(0, currentLength - 1);
      typewriterTimeout = setTimeout(runTypewriter, 18);
    } else {
      isDeleting.value = false;
      currentPhraseIndex.value = (currentPhraseIndex.value + 1) % activePhrases.value.length;
      typewriterTimeout = setTimeout(runTypewriter, 350);
    }
  }
};

onMounted(() => {
  runTypewriter();
});

onBeforeUnmount(() => {
  if (typewriterTimeout) {
    clearTimeout(typewriterTimeout);
    typewriterTimeout = null;
  }
});
</script>
