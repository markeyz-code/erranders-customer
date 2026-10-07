<template>
  <div class="space-y-6 animate-fade-in pb-32 px-3 md:px-4">
    <!-- Header -->
    <header class="pt-6 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-medium text-gray-900 tracking-tight leading-none mb-1">Campus Hall of Fame</h1>
        <p class="text-[10px] font-bold text-gray-400 uppercase ">Top Orderers & Hustlers this Month</p>
      </div>
      <div class="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-xl self-start sm:self-auto">
        <Trophy class="w-3.5 h-3.5 text-amber-600 animate-pulse" />
        <span class="text-[10px] font-medium text-amber-700 uppercase tracking-wider">Next Update: Sunday 12PM</span>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Top 3 Podium -->
      <div class="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
        <div 
          v-for="(leader, idx) in podium" 
          :key="idx" 
          class="relative bg-white border border-gray-50 p-5 rounded-2xl flex flex-col items-center text-center group hover:-translate-y-0.5 transition-all duration-300"
          :class="idx === 0 ? 'bg-gradient-to-b from-amber-50/30 to-white border-amber-200/50 shadow-sm' : ''"
        >
          <!-- Ranking Badge -->
          <div class="absolute top-3 right-3 w-7 h-7 rounded-xl flex items-center justify-center text-sm font-medium shadow-sm" :class="getPodiumBadge(idx)">
            #{{ idx + 1 }}
          </div>
          
          <div class="w-14 h-14 rounded-2xl bg-gray-50 mb-3 overflow-hidden border border-white shadow-sm relative">
             <img v-if="leader.avatar" :src="leader.avatar" class="w-full h-full object-cover" />
             <div v-else class="w-full h-full flex items-center justify-center text-base font-medium bg-parentPrimary/10 text-parentPrimary uppercase">
                {{ leader.firstName?.[0] }}{{ leader.lastName?.[0] }}
             </div>
          </div>
          
          <h3 class="text-sm font-medium text-gray-900 tracking-tight mb-0.5">{{ leader.firstName }} {{ leader.lastName }}</h3>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">{{ leader.faculty || 'Campus' }}</p>
          
          <div class="px-2.5 py-1 bg-gray-50 border border-gray-50 rounded-lg text-[10px] font-medium text-parentPrimary tracking-tight">
             {{ leader.points }} PTS
          </div>
        </div>
      </div>

      <!-- Main Leaderboard List -->
      <div class="lg:col-span-8">
        <RewardsLeaderboard />
      </div>

      <!-- Rewards Info Side -->
      <div class="lg:col-span-4 space-y-6">
        <div class="bg-white rounded-2xl p-4 border border-gray-50 shadow-sm relative overflow-hidden group">
          <div class="absolute -right-10 -top-10 w-40 h-40 bg-parentPrimary/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700"></div>
          
          <div class="relative z-10">
            <h4 class="text-sm font-medium uppercase  text-gray-400 mb-5">Hall of Fame Perks</h4>
            <div class="space-y-4">
               <div v-for="perk in perks" :key="perk.title" class="flex items-start gap-3">
                  <div class="w-7 h-7 rounded-lg bg-gray-50 border border-gray-50 flex items-center justify-center text-sm shrink-0">{{ perk.icon }}</div>
                  <div>
                     <p class="text-sm font-medium tracking-tight text-gray-900 mb-0.5">{{ perk.title }}</p>
                     <p class="text-[11px] font-bold text-gray-500 leading-relaxed">{{ perk.desc }}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        <div class="bg-parentPrimary/5 border border-parentPrimary/10 rounded-2xl p-4">
           <p class="text-[10px] font-medium uppercase tracking-wider text-gray-500 leading-relaxed">
             The Hall of Fame resets every 30 days. Top earners within each faculty receive a specialized badge and a digital certificate of accomplishment as an Errandr Top Performer.
           </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Trophy } from 'lucide-vue-next';
import { ref, onMounted, computed } from 'vue';
import { useRewards } from '@/composables/modules/rewards';

definePageMeta({
  layout: 'student'
});

const { leaders, fetchLeaderboard } = useRewards();

onMounted(async () => {
  await fetchLeaderboard('points');
});

const podium = computed(() => {
  return leaders.value.slice(0, 3).map(l => ({
    ...l,
    firstName: l.firstName || 'Student',
    lastName: l.lastName || '',
    faculty: l.faculty || 'Campus',
    points: l.points || 0,
    avatar: l.avatar
  }));
});

const perks = [
  { icon: '🚀', title: 'Priority Dispatch', desc: 'Orders are prioritized by top-tier errands.' },
  { icon: '🏦', title: 'Zero Service Fees', desc: 'No service charges for top-3 performers.' },
  { icon: '🎁', title: 'VIP Merch', desc: 'Exclusive Errandr hoodies and swag kits.' }
];

const getPodiumBadge = (idx: number) => {
  if (idx === 0) return 'bg-amber-100 text-amber-800 border border-amber-200/50';
  if (idx === 1) return 'bg-gray-100 text-gray-800 border border-gray-25/50';
  return 'bg-amber-50 text-amber-700 border border-amber-100/50';
};

useHead({
  title: 'Hall of Fame - Errandr',
  meta: [{ name: 'description', content: 'See the top performers on your campus hall of fame.' }]
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
