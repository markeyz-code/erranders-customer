<template>
 <div class="space-y-5 md:space-y-8 pb-24 animate-fade-in selection:bg-[#FF5C1A]/15 selection:text-[#FF5C1A] px-3 md:px-4 md:px-4">

 <!-- Header -->
 <header class="pt-6">
 <div class="flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-6">
 <div>
 <p class="ff-mono text-[10px] font-bold text-[#9C968E] uppercase tracking-[0.15em] flex items-center gap-1.5 mb-2">
 <ShieldCheck class="w-3.5 h-3.5 text-[#FF5C1A]" />
 {{ user?.isPro ? 'Pro Member' : 'Campus Member' }}
 </p>
 <h1 class="ff-display text-2xl md:text-3xl font-bold text-[#171310] tracking-tight leading-none">
 Welcome back, <span class="text-[#FF5C1A]">{{ user?.firstName || 'Student' }}.</span>
 </h1>
 </div>
 </div>
 </header>

 <!-- Quick Stats: manifest tiles -->
 <section class="grid grid-cols-2 lg:grid-cols-4 gap-3">
 <div v-for="stat in quickStats" :key="stat.label"
 class="relative bg-white border border-[#E7E2DA] rounded-xl p-4 flex items-center gap-3 hover:border-[#FF5C1A]/40 hover:bg-[#FAF8F5] transition-all cursor-pointer group overflow-hidden"
 @click="router.push(stat.link || '/dashboard')"
 >
 <div class="absolute left-0 top-0 bottom-0 w-[3px] bg-[#E7E2DA] group-hover:bg-[#FF5C1A] transition-colors"></div>
 <div class="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" :class="stat.bgColor">
 <component :is="stat.icon" class="w-4 h-4" :class="stat.iconColor" />
 </div>
 <div class="min-w-0">
 <p class="ff-mono text-[9px] font-bold text-[#9C968E] uppercase tracking-widest mb-0.5">{{ stat.label }}</p>
 <div class="flex items-baseline gap-1">
 <p class="text-sm font-bold text-[#171310] tracking-tight">{{ stat.value }}</p>
 <span v-if="stat.suffix" class="ff-mono text-[9px] font-bold text-[#9C968E]">{{ stat.suffix }}</span>
 </div>
 </div>
 </div>
 </section>

 <!-- Custom Errands Promo -->
 <section class="relative overflow-hidden rounded-2xl bg-[#171310] p-4 md:p-4 md:p-4 md:p-5 flex items-center justify-between group shadow-[#171310]/10">
 <div class="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:22px_22px] opacity-[0.04]"></div>
 <div class="absolute right-0 top-0 w-64 h-64 bg-[#FF5C1A]/20 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-[#FF5C1A]/30 transition-colors duration-700"></div>

 <div class="relative z-10 flex-1 max-w-xl">
 <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/10 text-white ff-mono text-[10px] font-bold uppercase tracking-widest mb-4">
 <Rocket class="w-3.5 h-3.5 text-[#FF5C1A]" /> Now with Negotiable Fees
 </div>
 <h2 class="ff-display text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">
 Need an <span class="text-[#FF5C1A]">Errand</span> Run?
 </h2>
 <p class="text-sm md:text-base text-white/60 font-medium mb-6 leading-relaxed">
 Don't just order food. Send an Errander to pick up your laundry, deliver documents, or buy groceries. Set your own price and get it done fast!
 </p>
 <NuxtLink to="/errands/custom" class="inline-flex items-center justify-center gap-2 px-4 md:px-4 py-3.5 bg-[#FF5C1A] text-white rounded-lg text-sm font-bold hover:bg-[#e6511a] transition-colors shadow-[#FF5C1A]/20 active:scale-95">
 Request an Errand <ArrowRight class="w-4 h-4" />
 </NuxtLink>
 </div>

 <div class="hidden md:flex relative z-10 w-48 h-48 shrink-0 items-center justify-center">
 <div class="absolute inset-0 bg-[#FF5C1A]/20 rounded-full blur-[30px] animate-pulse"></div>
 <div class="relative w-32 h-32 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl rotate-12 flex items-center justify-center group-hover:rotate-6 transition-transform duration-500">
 <PackageSearch class="w-16 h-16 text-white drop-" stroke-width="1.5" />
 </div>
 </div>
 </section>

  <!-- Redeem Points Promo -->
  <section class="relative overflow-hidden rounded-2xl bg-[#FF5C1A] p-4 md:p-5 flex flex-col md:flex-row items-center justify-between group shadow-lg shadow-[#FF5C1A]/20">
  <div class="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:22px_22px] opacity-10"></div>
  <div class="absolute right-0 top-0 w-64 h-64 bg-white/20 rounded-full blur-[80px] -mr-20 -mt-20"></div>

  <div class="relative z-10 flex-1 w-full md:max-w-xl text-center md:text-left">
  <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-lg text-white ff-mono text-[10px] font-bold uppercase tracking-widest mb-3 md:mb-4 mx-auto md:mx-0">
  <Trophy class="w-3.5 h-3.5 text-white" /> Turn Points into Cash
  </div>
  <h2 class="ff-display text-2xl md:text-3xl font-bold text-white tracking-tight mb-2 leading-tight">
  Got Points? <br class="md:hidden" /> Redeem Them Now!
  </h2>
  <p class="text-sm md:text-base text-white/80 font-medium mb-6 md:mb-0 leading-relaxed max-w-sm mx-auto md:mx-0">
  Convert your hard-earned Erranders points into real cash in your wallet and enjoy free meals.
  </p>
  </div>

  <div class="relative z-10 w-full md:w-auto mt-4 md:mt-0 flex flex-col items-center">
  <button @click="isRedeemModalOpen = true" class="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-white text-[#FF5C1A] rounded-xl text-sm font-bold hover:bg-[#FAF8F5] transition-all shadow-xl active:scale-95 whitespace-nowrap">
  Redeem {{ user?.points || 0 }} pts <ArrowRight class="w-4 h-4" />
  </button>
  <p class="text-[10px] text-white/70 font-medium mt-2">Min. 500 points to redeem</p>
  </div>
  </section>

  <!-- Quick Actions -->
  <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
 <NuxtLink to="/meal-planner" class="bg-white border border-[#E7E2DA] rounded-xl p-4 md:p-4 flex items-center justify-between group hover:border-[#FF5C1A]/30 transition-all">
 <div>
 <div class="w-10 h-10 bg-[#FAF8F5] border border-[#E7E2DA] rounded-lg flex items-center justify-center mb-3">
 <UtensilsCrossed class="w-5 h-5 text-[#9C968E] group-hover:text-[#FF5C1A] transition-colors" />
 </div>
 <h3 class="ff-display text-base font-bold text-[#171310] tracking-tight mb-1">Meal Planner</h3>
 <p class="text-xs text-[#9C968E] font-bold">Plan your week and save up to 25%</p>
 </div>
 <div class="w-10 h-10 bg-[#FAF8F5] text-[#9C968E] rounded-lg flex items-center justify-center shrink-0 group-hover:text-[#FF5C1A] group-hover:bg-[#FF5C1A]/10 transition-colors">
 <ArrowRight class="w-4 h-4" />
 </div>
 </NuxtLink>

  <NuxtLink to="/dashboard/group-orders" class="bg-white border border-[#E7E2DA] rounded-xl p-4 md:p-4 flex items-center justify-between group hover:border-[#FF5C1A]/30 transition-all">
  <div>
  <div class="w-10 h-10 bg-[#FAF8F5] border border-[#E7E2DA] rounded-lg flex items-center justify-center mb-3">
  <Users class="w-5 h-5 text-[#9C968E] group-hover:text-[#FF5C1A] transition-colors" />
  </div>
  <h3 class="ff-display text-base font-bold text-[#171310] tracking-tight mb-1">Group Orders</h3>
  <p class="text-xs text-[#9C968E] font-bold">Order with friends and split the bill</p>
  </div>
  <div class="w-10 h-10 bg-[#FAF8F5] text-[#9C968E] rounded-lg flex items-center justify-center shrink-0 group-hover:text-[#FF5C1A] group-hover:bg-[#FF5C1A]/10 transition-colors">
  <ArrowRight class="w-4 h-4" />
  </div>
  </NuxtLink>

  <NuxtLink to="/market-pool" class="bg-white border border-[#E7E2DA] rounded-xl p-4 md:p-4 flex items-center justify-between group hover:border-[#FF5C1A]/30 transition-all">
  <div>
  <div class="w-10 h-10 bg-[#FAF8F5] border border-[#E7E2DA] rounded-lg flex items-center justify-center mb-3">
  <ShoppingCart class="w-5 h-5 text-[#9C968E] group-hover:text-[#FF5C1A] transition-colors" />
  </div>
  <h3 class="ff-display text-base font-bold text-[#171310] tracking-tight mb-1">Market Pool</h3>
  <p class="text-xs text-[#9C968E] font-bold">Buy food in bulk at wholesale prices</p>
  </div>
  <div class="w-10 h-10 bg-[#FAF8F5] text-[#9C968E] rounded-lg flex items-center justify-center shrink-0 group-hover:text-[#FF5C1A] group-hover:bg-[#FF5C1A]/10 transition-colors">
  <ArrowRight class="w-4 h-4" />
  </div>
  </NuxtLink>

  <NuxtLink to="/market-pool/orders" class="bg-white border border-[#E7E2DA] rounded-xl p-4 md:p-4 flex items-center justify-between group hover:border-[#FF5C1A]/30 transition-all">
  <div>
  <div class="w-10 h-10 bg-[#FAF8F5] border border-[#E7E2DA] rounded-lg flex items-center justify-center mb-3">
  <Package class="w-5 h-5 text-[#9C968E] group-hover:text-[#FF5C1A] transition-colors" />
  </div>
  <h3 class="ff-display text-base font-bold text-[#171310] tracking-tight mb-1">Pool Orders</h3>
  <p class="text-xs text-[#9C968E] font-bold">Track and manage your market pool requests</p>
  </div>
  <div class="w-10 h-10 bg-[#FAF8F5] text-[#9C968E] rounded-lg flex items-center justify-center shrink-0 group-hover:text-[#FF5C1A] group-hover:bg-[#FF5C1A]/10 transition-colors">
  <ArrowRight class="w-4 h-4" />
  </div>
  </NuxtLink>
  </section>

 <!-- Popular Vendors -->
 <section class="space-y-4 pt-4">
 <div class="flex items-center justify-between">
 <div>
 <h2 class="ff-display text-lg font-bold text-[#171310] tracking-tight">Campus Favorites</h2>
 <p class="ff-mono text-[9px] font-bold text-[#9C968E] uppercase tracking-widest mt-0.5">Top picks for you</p>
 </div>
 <NuxtLink to="/vendors" class="text-xs font-bold text-[#FF5C1A] hover:underline px-3 py-1.5 bg-[#FF5C1A]/5 rounded-lg">
 View All
 </NuxtLink>
 </div>

 <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 <div v-for="i in 3" :key="i" class="bg-[#FAF8F5] rounded-xl h-32 animate-pulse border border-[#E7E2DA]" />
 </div>

 <div v-else-if="onlineVendors.length === 0" class="relative overflow-hidden rounded-2xl border border-[#E7E2DA] bg-white py-16 px-4 md:px-4 text-center group">
 <div class="absolute inset-0 bg-[radial-gradient(#E7E2DA_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
 <div class="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#FF5C1A]/5 rounded-full blur-[50px] transition-all duration-700 group-hover:bg-[#FF5C1A]/10"></div>

 <div class="relative z-10 w-20 h-20 bg-[#FAF8F5] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#E7E2DA] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
 <MoonStar class="w-10 h-10 text-[#9C968E]" stroke-width="1.5" />
 </div>

 <div class="relative z-10 space-y-3 mb-8 max-w-[280px] mx-auto">
 <h3 class="ff-display text-2xl font-bold text-[#171310] tracking-tight">Campus is Asleep</h3>
 <p class="text-[13px] text-[#9C968E] font-bold leading-relaxed">
 All our partner vendors are currently closed. Catch some rest and we'll be back serving hot meals soon!
 </p>
 </div>

 <div class="relative z-10 flex flex-col items-center gap-4">
 <div class="ff-mono inline-flex items-center gap-2 px-4 py-2 bg-[#FAF8F5] border border-[#E7E2DA] rounded-lg text-[10px] font-bold text-[#9C968E] uppercase tracking-widest">
 <Clock class="w-3.5 h-3.5 text-[#9C968E]" />
 Opens at 8:00 AM
 </div>

 <div class="flex items-center gap-3 w-full sm:w-auto justify-center mt-2">
 <button
 @click="fetchHomeData"
 class="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 md:px-4 py-3 bg-[#171310] text-white rounded-lg text-[13px] font-bold hover:bg-black transition-colors shadow-[#171310]/10 active:scale-95"
 >
 <RefreshCw class="w-4 h-4" />
 Refresh
 </button>
 <NuxtLink
 to="/vendors"
 class="flex-1 sm:flex-none inline-flex items-center justify-center px-4 md:px-4 py-3 bg-white border border-[#E7E2DA] text-[#171310] rounded-lg text-[13px] font-bold hover:bg-[#FAF8F5] transition-colors active:scale-95"
 >
 All Vendors
 </NuxtLink>
 </div>

 <div v-if="fetchError === 'network'" class="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-rose-50 border border-rose-100 rounded-lg">
 <WifiOff class="w-3.5 h-3.5 text-rose-500 shrink-0" />
 <p class="ff-mono text-[10px] font-bold text-rose-600 uppercase tracking-widest">No Connection</p>
 </div>
 </div>
 </div>

 <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 <NuxtLink
 v-for="vendor in onlineVendors.slice(0, 6)"
 :key="vendor._id"
 :to="`/vendors/${vendor._id}`"
 class="bg-white border border-[#E7E2DA] rounded-xl p-3 flex items-center gap-4 hover:border-[#FF5C1A]/30 transition-all group"
 >
 <div class="relative w-20 h-20 shrink-0 overflow-hidden rounded-lg">
  <video v-if="(vendor.logo || vendor.banner) && (vendor.logo || vendor.banner).match(/\.(mp4|webm|ogg|mov)$/i)" :src="vendor.logo || vendor.banner" class="w-full h-full object-cover bg-[#FAF8F5]" autoplay loop muted playsinline></video>
  <img v-else :src="vendor.logo || vendor.banner || '/placeholder-store.jpg'" class="w-full h-full object-cover bg-[#FAF8F5]" />
  <div v-if="vendor.isOpen === false" class="absolute inset-0 bg-black/60 z-10 flex flex-col items-center justify-center">
    <Lock class="w-5 h-5 text-white mb-1" />
    <span class="text-white font-bold text-[8px] tracking-wide px-1 text-center leading-tight">STORE<br/>CLOSED</span>
  </div>
  <div v-else class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" title="Active" />
 </div>
 <div class="flex-1 min-w-0 py-1">
 <h3 class="text-sm font-bold text-[#171310] group-hover:text-[#FF5C1A] truncate tracking-tight mb-1 transition-colors">{{ vendor.storeName }}</h3>
 <p class="text-xs text-[#9C968E] font-bold truncate mb-2">{{ vendor.category || 'Restaurant' }}</p>
 <div class="flex items-center gap-3">
 <div class="flex items-center gap-1">
 <Star class="w-3.5 h-3.5 text-amber-500 fill-current" />
 <span class="text-[10px] font-bold text-[#171310]">{{ vendor.rating?.toFixed(1) || '5.0' }}</span>
 </div>
 <div class="flex items-center gap-1 text-[#9C968E]">
 <Timer class="w-3.5 h-3.5" />
 <span class="ff-mono text-[10px] font-bold">{{ vendor.preparationTime || '20' }} min</span>
 </div>
 </div>
 </div>
 </NuxtLink>
 </div>
 </section>

 <RedeemPointsModal 
  :is-open="isRedeemModalOpen"
  :current-points="user?.points || 0"
  @close="isRedeemModalOpen = false"
  @redeemed="handlePointsRedeemed"
 />

 </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/modules/auth';
import { useLandingPage } from '@/composables/modules/landing';
import { useUser } from '@/composables/modules/auth/user';
import { MapPin, Search, ArrowRight, PackageSearch, Tag, Star, Clock, Heart, Users, UtensilsCrossed, ShoppingCart, ShieldCheck, Trophy, Flame, BarChart3, RefreshCw, WifiOff, MoonStar, Rocket, Lock, Package, Coins } from 'lucide-vue-next';
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCustomToast } from '@/composables/core/useCustomToast';
import RedeemPointsModal from '@/components/core/RedeemPointsModal.vue';

definePageMeta({
 layout: 'student'
})

const router = useRouter();
const { user } = useUser();
const { fetchProfile } = useAuth();
const { loading, onlineVendors, fetchError, fetchHomeData } = useLandingPage();
const { showToast } = useCustomToast();

onMounted(async () => {
  await fetchProfile();
});

const searchQuery = ref('');
const isRedeemModalOpen = ref(false);

const handlePointsRedeemed = (newPoints: number) => {
  if (user.value) {
    user.value.points = newPoints;
  }
};

const quickStats = computed(() => [
 { 
 label: 'Rewards', 
 value: `${user.value?.points || 0}`, 
 suffix: 'PTS',
 icon: Trophy, 
 iconColor: 'text-amber-500',
 bgColor: 'bg-amber-50',
 link: '/dashboard/quests'
 },
 { 
 label: 'Streak', 
 value: `${user.value?.streakCount || 0}`, 
 suffix: 'DAYS',
 icon: Flame, 
 iconColor: 'text-orange-500',
 bgColor: 'bg-orange-50'
 },
 { 
 label: 'Rank', 
 value: `#${(user.value?.points || 0) > 1000 ? '1' : '42'}`, 
 icon: BarChart3, 
 iconColor: 'text-blue-500',
 bgColor: 'bg-blue-50',
 link: '/dashboard/leaderboard'
 },
 { 
 label: 'Status', 
 value: user.value?.isPro ? 'Pro' : 'Standard', 
 icon: ShieldCheck, 
 iconColor: user.value?.isPro ? 'text-white' : 'text-gray-400',
 bgColor: user.value?.isPro ? 'bg-[#FF5C1A]' : 'bg-gray-50'
 }
])

const handleSearch = () => {
 if (searchQuery.value.trim()) {
 router.push({ path: '/search', query: { q: searchQuery.value } });
 }
};

onMounted(async () => {
 await fetchHomeData();
});

useHead({
 title: 'Dashboard - Errandr',
 meta: [
 { name: 'description', content: 'Campus life, elevated. Manage your orders, rewards, and meal plans.' },
 ],
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700;800&family=JetBrains+Mono:wght@500;600;700&display=swap');

.ff-display {
 font-family: 'Space Grotesk', ui-sans-serif, system-ui, sans-serif;
}
.ff-mono {
 font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
}

.animate-fade-in {
 animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
 from { opacity: 0; transform: translateY(10px); }
 to { opacity: 1; transform: translateY(0); }
}

.animate-float {
 animation: float 3s ease-in-out infinite;
}
@keyframes float {
 0%, 100% { transform: translateY(0px); }
 50% { transform: translateY(-6px); }
}
</style>