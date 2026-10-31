<template>
  <!-- HERO ─────────────────────────────────────────────────────────────── -->
  <section v-if="type === 'hero'" class="relative isolate overflow-hidden bg-slate-950 text-white py-24 sm:py-32">
    <img
      v-if="p.image"
      :src="p.image"
      alt=""
      class="absolute inset-0 -z-10 h-full w-full object-cover opacity-60"
    />
    <div class="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/30" />
    
    <div class="mx-auto max-w-4xl px-6 text-center space-y-6">
      <div v-if="vendor.category" class="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur border border-white/15 text-xs font-bold text-orange-400">
        <Sparkles class="w-3.5 h-3.5" />
        <span>{{ vendor.category }}</span>
      </div>

      <h1 class="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
        {{ p.headline || vendor.storeName }}
      </h1>

      <p v-if="p.subheadline" class="mx-auto max-w-2xl text-base sm:text-lg leading-relaxed text-slate-300">
        {{ p.subheadline }}
      </p>

      <div class="pt-4 flex flex-wrap items-center justify-center gap-3">
        <a
          v-if="p.ctaLabel"
          :href="p.ctaHref || '#offerings'"
          class="rounded-full px-7 py-3.5 text-sm font-black text-white shadow-lg transition-transform hover:scale-105 active:scale-95 bg-[#FF5C1A]"
        >
          {{ p.ctaLabel }}
        </a>
        <a
          v-if="vendor.phone"
          :href="`tel:${vendor.phone}`"
          class="rounded-full border border-white/20 bg-white/10 px-7 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
        >
          Call Store
        </a>
      </div>
    </div>
  </section>

  <!-- ABOUT ────────────────────────────────────────────────────────────── -->
  <section v-else-if="type === 'about'" class="mx-auto max-w-4xl px-6 py-16 sm:py-20">
    <div class="space-y-3">
      <span class="text-xs font-black uppercase tracking-wider text-[#FF5C1A]">About</span>
      <h2 class="text-2xl sm:text-4xl font-black tracking-tight text-slate-900">
        {{ p.title || 'About us' }}
      </h2>
      <p class="mt-4 whitespace-pre-line text-base sm:text-lg leading-relaxed text-slate-600">
        {{ p.body || vendor.description }}
      </p>
    </div>
  </section>

  <!-- SERVICES ─────────────────────────────────────────────────────────── -->
  <section v-else-if="type === 'services'" id="offerings" class="bg-slate-50/80 border-y border-slate-100 py-16 sm:py-20">
    <div class="mx-auto max-w-6xl px-6">
      <div class="space-y-2 mb-10 text-center sm:text-left">
        <span class="text-xs font-black uppercase tracking-wider text-[#FF5C1A]">Offerings</span>
        <h2 class="text-2xl sm:text-4xl font-black tracking-tight text-slate-900">
          {{ p.title || 'Our Services' }}
        </h2>
        <p v-if="p.note" class="text-sm text-slate-500 font-medium">{{ p.note }}</p>
      </div>

      <div v-if="servicesList.length === 0" class="rounded-2xl border border-dashed border-slate-300 p-12 text-center bg-white">
        <p class="text-sm font-semibold text-slate-500">No services listed yet.</p>
      </div>

      <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="s in servicesList"
          :key="s._id"
          class="group rounded-3xl border border-slate-200 bg-white p-5 transition-all hover:shadow-lg hover:border-[#FF5C1A] flex flex-col justify-between"
        >
          <div class="space-y-2">
            <div class="flex items-start justify-between gap-3">
              <h3 class="text-base font-extrabold text-slate-900 leading-snug group-hover:text-[#FF5C1A] transition-colors">
                {{ s.name }}
              </h3>
              <span class="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-black bg-orange-50 text-[#FF5C1A] border border-orange-100">
                ₦{{ s.price?.toLocaleString() }}
              </span>
            </div>
            <p v-if="s.description" class="line-clamp-2 text-xs leading-relaxed text-slate-500 font-medium">
              {{ s.description }}
            </p>
            <p v-if="s.durationInMinutes" class="text-[11px] font-bold text-slate-400 flex items-center gap-1">
              <Clock class="w-3 h-3 text-[#FF5C1A]" /> {{ s.durationInMinutes }} mins
            </p>
          </div>

          <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              @click="$emit('book-service', s)"
              type="button"
              class="w-full py-2.5 rounded-xl bg-slate-900 group-hover:bg-[#FF5C1A] text-white text-xs font-black transition-colors"
            >
              Book Appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- PRODUCTS / SHOP ──────────────────────────────────────────────────── -->
  <section v-else-if="type === 'products'" id="shop" class="mx-auto max-w-6xl px-6 py-16 sm:py-20">
    <div class="space-y-2 mb-10 text-center sm:text-left">
      <span class="text-xs font-black uppercase tracking-wider text-[#FF5C1A]">Catalogue</span>
      <h2 class="text-2xl sm:text-4xl font-black tracking-tight text-slate-900">
        {{ p.title || 'Products' }}
      </h2>
      <p v-if="p.note" class="text-sm text-slate-500 font-medium">{{ p.note }}</p>
    </div>

    <div v-if="productsList.length === 0" class="rounded-2xl border border-dashed border-slate-300 p-12 text-center bg-slate-50">
      <p class="text-sm font-semibold text-slate-500">No products available at the moment.</p>
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      <div
        v-for="prod in productsList"
        :key="prod._id"
        class="group rounded-3xl border border-slate-200 bg-white overflow-hidden transition-all hover:shadow-md hover:border-slate-300 flex flex-col justify-between"
      >
        <div class="aspect-square bg-slate-100 overflow-hidden relative">
          <img
            v-if="prod.image || prod.images?.[0]"
            :src="prod.image || prod.images?.[0]"
            :alt="prod.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div v-else class="w-full h-full flex items-center justify-center text-slate-300">
            <Package class="w-8 h-8" />
          </div>
        </div>

        <div class="p-3.5 space-y-1">
          <h4 class="text-xs sm:text-sm font-bold text-slate-900 truncate">{{ prod.name }}</h4>
          <p class="text-sm font-black text-[#FF5C1A]">₦{{ prod.price?.toLocaleString() }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- GALLERY ──────────────────────────────────────────────────────────── -->
  <section v-else-if="type === 'gallery'" class="mx-auto max-w-6xl px-6 py-16 sm:py-20">
    <div class="space-y-2 mb-8 text-center sm:text-left">
      <span class="text-xs font-black uppercase tracking-wider text-[#FF5C1A]">Showcase</span>
      <h2 class="text-2xl sm:text-4xl font-black tracking-tight text-slate-900">
        {{ p.title || 'Our Work' }}
      </h2>
    </div>

    <div v-if="!galleryImages.length" class="rounded-2xl border border-dashed border-slate-300 p-12 text-center bg-slate-50">
      <p class="text-sm font-semibold text-slate-500">No gallery photos uploaded yet.</p>
    </div>

    <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
      <div
        v-for="(img, i) in galleryImages"
        :key="i"
        class="rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 shadow-sm border border-slate-200"
      >
        <img :src="img" alt="" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
      </div>
    </div>
  </section>

  <!-- OPENING HOURS ────────────────────────────────────────────────────── -->
  <section v-else-if="type === 'hours'" class="mx-auto max-w-4xl px-6 py-16 sm:py-20 border-t border-slate-100">
    <div class="space-y-2 mb-6">
      <span class="text-xs font-black uppercase tracking-wider text-[#FF5C1A]">Schedule</span>
      <h2 class="text-2xl sm:text-3xl font-black text-slate-900">
        {{ p.title || 'Opening Hours' }}
      </h2>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden">
      <div
        v-for="(row, i) in hoursRows"
        :key="i"
        class="px-5 py-3 flex items-center justify-between text-xs sm:text-sm font-semibold"
      >
        <span class="text-slate-800 capitalize">{{ row.day }}</span>
        <span class="text-slate-500 font-mono">{{ row.hours }}</span>
      </div>
    </div>
  </section>

  <!-- FAQ ──────────────────────────────────────────────────────────────── -->
  <section v-else-if="type === 'faq'" class="mx-auto max-w-4xl px-6 py-16 sm:py-20 border-t border-slate-100">
    <div class="space-y-2 mb-8 text-center sm:text-left">
      <span class="text-xs font-black uppercase tracking-wider text-[#FF5C1A]">Help</span>
      <h2 class="text-2xl sm:text-3xl font-black text-slate-900">
        {{ p.title || 'Frequently Asked Questions' }}
      </h2>
    </div>

    <div class="space-y-3">
      <div
        v-for="(item, i) in faqItems"
        :key="i"
        class="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white space-y-1.5"
      >
        <h4 class="font-extrabold text-sm sm:text-base text-slate-900">{{ item.q }}</h4>
        <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">{{ item.a }}</p>
      </div>
    </div>
  </section>

  <!-- TESTIMONIALS ─────────────────────────────────────────────────────── -->
  <section v-else-if="type === 'testimonials'" class="mx-auto max-w-6xl px-6 py-16 sm:py-20 bg-slate-50/60 rounded-3xl my-8">
    <div class="space-y-2 mb-8 text-center">
      <span class="text-xs font-black uppercase tracking-wider text-[#FF5C1A]">Reviews</span>
      <h2 class="text-2xl sm:text-3xl font-black text-slate-900">
        {{ p.title || 'What Students Say' }}
      </h2>
    </div>

    <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="(item, i) in testimonialItems"
        :key="i"
        class="bg-white p-5 rounded-2xl border border-slate-200 space-y-3 shadow-2xs"
      >
        <div class="text-amber-500 text-xs">★★★★★</div>
        <p class="text-xs sm:text-sm text-slate-700 italic leading-relaxed">“{{ item.quote }}”</p>
        <p class="text-xs font-extrabold text-slate-900">— {{ item.name }}</p>
      </div>
    </div>
  </section>

  <!-- CONTACT ──────────────────────────────────────────────────────────── -->
  <section v-else-if="type === 'contact'" class="mx-auto max-w-4xl px-6 py-16 sm:py-20 border-t border-slate-100">
    <div class="space-y-2 mb-6">
      <span class="text-xs font-black uppercase tracking-wider text-[#FF5C1A]">Get in touch</span>
      <h2 class="text-2xl sm:text-3xl font-black text-slate-900">
        {{ p.title || 'Contact Information' }}
      </h2>
    </div>

    <div class="grid sm:grid-cols-2 gap-4">
      <div v-if="vendor.phone" class="p-4 rounded-2xl border border-slate-200 bg-white flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-orange-50 text-[#FF5C1A] flex items-center justify-center shrink-0">
          <Phone class="w-5 h-5" />
        </div>
        <div>
          <span class="text-[10px] font-bold text-slate-400 uppercase">Call Store</span>
          <p class="text-sm font-bold text-slate-900">{{ vendor.phone }}</p>
        </div>
      </div>

      <div v-if="vendor.address" class="p-4 rounded-2xl border border-slate-200 bg-white flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <MapPin class="w-5 h-5" />
        </div>
        <div>
          <span class="text-[10px] font-bold text-slate-400 uppercase">Location</span>
          <p class="text-sm font-bold text-slate-900">{{ vendor.address }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- CALL TO ACTION ───────────────────────────────────────────────────── -->
  <section v-else-if="type === 'cta'" class="mx-auto max-w-5xl px-6 py-16">
    <div class="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white text-center space-y-4 shadow-xl">
      <h2 class="text-2xl sm:text-4xl font-black tracking-tight">
        {{ p.headline || 'Ready to order or book?' }}
      </h2>
      <p v-if="p.body" class="max-w-xl mx-auto text-sm sm:text-base text-slate-300">
        {{ p.body }}
      </p>
      <div class="pt-2">
        <a
          :href="p.buttonHref || '#offerings'"
          class="inline-block px-8 py-3.5 rounded-full bg-[#FF5C1A] hover:bg-[#E54D12] text-white font-black text-sm transition-all shadow-md active:scale-95"
        >
          {{ p.buttonLabel || 'Get Started' }}
        </a>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  Sparkles, Clock, Package, MapPin, Phone
} from 'lucide-vue-next';

const props = defineProps<{
  block: {
    id: string;
    type: string;
    props: Record<string, any>;
    isVisible: boolean;
  };
  vendor: any;
  servicesList?: any[];
  productsList?: any[];
}>();

defineEmits<{
  (e: 'book-service', service: any): void;
}>();

const type = computed(() => props.block.type);
const p = computed(() => props.block.props || {});
const servicesList = computed(() => props.servicesList || []);
const productsList = computed(() => props.productsList || []);

const galleryImages = computed(() => {
  if (Array.isArray(p.value.images)) {
    return p.value.images.map((item: any) => typeof item === 'object' ? item.value : item).filter(Boolean);
  }
  return [];
});

const hoursRows = computed(() => {
  if (Array.isArray(p.value.rows) && p.value.rows.length) {
    return p.value.rows;
  }
  if (Array.isArray(props.vendor?.businessHours) && props.vendor.businessHours.length) {
    return props.vendor.businessHours.map((bh: any) => ({
      day: bh.day,
      hours: bh.isClosed ? 'Closed' : `${bh.open || '09:00'} - ${bh.close || '18:00'}`
    }));
  }
  return [
    { day: 'Monday - Friday', hours: '08:00 - 20:00' },
    { day: 'Saturday - Sunday', hours: '10:00 - 18:00' },
  ];
});

const faqItems = computed(() => {
  if (Array.isArray(p.value.items) && p.value.items.length) {
    return p.value.items;
  }
  return [
    { q: 'How does payment and booking work?', a: 'Book your slot with campus escrow protection. Payment is held securely until the service is delivered.' },
    { q: 'Can the provider come to my hostel room?', a: 'Yes, providers with the "Comes to you" tag provide mobile hostel visits across campus halls.' },
  ];
});

const testimonialItems = computed(() => {
  if (Array.isArray(p.value.items) && p.value.items.length) {
    return p.value.items;
  }
  return [
    { name: 'Tolani A., New Hall', quote: 'Super fast delivery and very professional. 10/10 campus experience!' },
    { name: 'Emeka O., CMUL Hostel', quote: 'Saved me the long trek under the sun. Definitely using again.' },
  ];
});
</script>
