<template>
  <div class="space-y-6 animate-fade-in pb-32 px-3 sm:px-4 md:px-4">
    <!-- Header -->
    <header class="pt-6 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-0 sm:px-0">
      <div>
        <h1 class="text-2xl md:text-3xl font-medium text-gray-900 tracking-tight leading-none mb-1">Campus Quests</h1>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Missions & Rewards Program</p>
      </div>
      <div class="flex items-center gap-2 px-3 py-1.5 bg-parentPrimary/5 border border-parentPrimary/10 rounded-xl self-start sm:self-auto">
        <span class="text-[10px] font-medium text-parentPrimary uppercase tracking-wider">Active Season: Semester 1</span>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Quest List -->
      <div class="lg:col-span-2 space-y-6">
        <RewardsQuestsView />
        
        <!-- Legend Card -->
        <div class="bg-gradient-to-br from-amber-50 to-white border-0 sm:border border-amber-100 shadow-none sm:shadow-sm rounded-none sm:rounded-2xl p-4 sm:p-4 relative overflow-hidden group">
          <div class="absolute -right-20 -top-20 w-64 h-64 bg-parentPrimary/10 rounded-full blur-[80px] group-hover:scale-110 transition-transform duration-1000"></div>
          
          <div class="relative z-10">
            <h3 class="text-lg font-medium tracking-tight text-gray-900 mb-2">The Errandr Legend</h3>
            <p class="text-gray-600 text-xs font-medium leading-relaxed mb-6 max-w-md">
              Complete all seasonal quests to unlock the <span class="font-bold text-gray-900">Legendary Errandr</span> badge and get exclusive 50% delivery discounts for an entire month!
            </p>
            <div class="flex items-center gap-4">
              <div class="flex -space-x-2">
                <div v-for="i in 4" :key="i" class="w-7 h-7 rounded-full border border-white bg-amber-100 flex items-center justify-center text-[10px] font-medium text-amber-700">?</div>
              </div>
              <p class="text-[10px] font-medium text-parentPrimary uppercase tracking-wider">4 Badges Remaining</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar Info -->
      <div class="space-y-6">
        <!-- How Quests Work -->
        <div class="bg-white border-0 sm:border border-gray-50 shadow-none sm:shadow-sm rounded-none sm:rounded-2xl p-4 sm:p-4">
          <h4 class="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-5">How Quests Work</h4>
          <ul class="space-y-4">
             <li v-for="(step, i) in steps" :key="i" class="flex gap-3">
                <div class="w-6 h-6 rounded-lg bg-gray-50 border border-gray-50 flex items-center justify-center text-[10px] font-medium text-gray-900 shrink-0">{{ i + 1 }}</div>
                <div>
                   <p class="text-xs font-medium text-gray-900 tracking-tight mb-0.5">{{ step.title }}</p>
                   <p class="text-[11px] font-bold text-gray-500 leading-relaxed">{{ step.desc }}</p>
                </div>
             </li>
          </ul>
        </div>

        <!-- Callout block -->
        <div class="bg-white border-0 sm:border border-gray-50 shadow-none sm:shadow-sm rounded-none sm:rounded-2xl p-4 sm:p-4">
          <div class="w-8 h-8 rounded-xl bg-parentPrimary/10 flex items-center justify-center mb-4 text-parentPrimary">
            <Trophy class="w-4 h-4" />
          </div>
          <h4 class="text-base font-medium tracking-tight text-gray-900 mb-2 leading-tight">Climb the Hall of Fame</h4>
          <p class="text-xs font-medium text-gray-500 mb-5 leading-relaxed">Top erranders and customers get special perks every weekend.</p>
          
          <NuxtLink to="/dashboard/leaderboard" class="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider bg-gray-50 hover:bg-gray-100 text-gray-900 px-4 py-2 rounded-xl transition-colors active:scale-95 border border-gray-50">
            View Rankings <ArrowRight class="w-3 h-3" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Trophy, ArrowRight } from 'lucide-vue-next';

definePageMeta({
  layout: 'student'
});

const steps = [
  { title: 'Pick a Quest', desc: 'Browse active missions tailored to your campus journey.' },
  { title: 'Complete Tasks', desc: 'Order from specific vendors or hit delivery milestones.' },
  { title: 'Earn Points', desc: 'Points are added instantly to your balance upon completion.' },
  { title: 'Redeem Prizes', desc: 'Use points for airtime, discounts, or exclusive merch.' }
];

useHead({
  title: 'Campus Quests - Errandr',
  meta: [{ name: 'description', content: 'Complete missions and earn rewards on campus.' }]
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
