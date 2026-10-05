<template>
  <div class="bg-white rounded-2xl border border-gray-50 p-4 shadow-sm relative overflow-hidden">
    <!-- Background Accents -->
    <div class="absolute -right-24 -top-24 w-64 h-64 bg-parentPrimary/5 rounded-full blur-[100px]"></div>

    <div class="relative z-10 flex flex-col h-full">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 class="text-lg font-medium tracking-tight text-gray-900 leading-none">Campus Leaderboard</h3>
          <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">Top orderers and riders this month</p>
        </div>
        
        <!-- Toggle Types -->
        <div class="flex bg-gray-50 p-1 rounded-xl border border-gray-50 shrink-0">
          <button 
            v-for="t in types" 
            :key="t.key"
            @click="activeType = t.key"
            class="px-3 py-1.5 rounded-lg text-xs font-medium uppercase transition-all"
            :class="activeType === t.key ? 'bg-parentPrimary text-white shadow-sm' : 'text-gray-400 hover:text-gray-700'"
          >
            {{ t.label }}
          </button>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex-1 space-y-3">
        <div v-for="i in 5" :key="i" class="h-14 bg-gray-50 rounded-xl animate-pulse"></div>
      </div>

      <!-- Empty state -->
      <div v-else-if="leaders.length === 0" class="flex-1 flex flex-col items-center justify-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl mb-3 shadow-sm border border-gray-50">🏆</div>
        <p class="text-xs font-bold text-gray-400">Leaderboard is being updated...</p>
      </div>

      <!-- Leaders list -->
      <div v-else class="flex-1 space-y-2">
        <div 
          v-for="(user, index) in leaders" 
          :key="user._id"
          class="flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-gray-100 hover:bg-gray-50/50 transition-all group"
        >
          <div class="w-7 h-7 flex items-center justify-center font-medium text-xs shrink-0 rounded-lg" :class="getRankClass(index)">
            #{{ index + 1 }}
          </div>
          
          <div class="w-9 h-9 rounded-xl bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-50 relative">
            <img v-if="user.avatar" :src="user.avatar" class="w-full h-full object-cover" />
            <div v-else class="w-full h-full flex items-center justify-center uppercase text-xs font-medium text-parentPrimary bg-parentPrimary/10">
              {{ user.firstName?.[0] }}{{ user.lastName?.[0] }}
            </div>
          </div>

          <div class="flex-1 min-w-0">
            <h4 class="font-bold text-xs truncate text-gray-900">{{ user.firstName }} {{ user.lastName }}</h4>
            <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider truncate mt-0.5">{{ user.faculty || 'Campus' }}</p>
          </div>

          <div class="text-right shrink-0">
            <p class="text-xs font-medium text-parentPrimary tracking-tight">{{ getScoreLabel(user) }}</p>
            <p class="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Points: {{ user.points }}</p>
          </div>
        </div>
      </div>

      <!-- Footer action -->
      <div class="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between text-[10px] font-medium text-gray-400 uppercase tracking-wider">
        <span>Updated real-time</span>
        <NuxtLink to="/dashboard/leaderboard" class="text-parentPrimary hover:underline flex items-center gap-1">
          View Podium →
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRewards } from '@/composables/modules/rewards';

const { loading, leaders, fetchLeaderboard } = useRewards();
const activeType = ref<'points' | 'orders' | 'deliveries'>('points');

const types = [
  { key: 'points', label: 'Ranks' },
  { key: 'orders', label: 'Hunger' },
  { key: 'deliveries', label: 'Hustle' }
];

const loadLeaderboard = () => {
  fetchLeaderboard(activeType.value);
};

const getRankClass = (idx: number) => {
  if (idx === 0) return 'bg-amber-100 text-amber-800';
  if (idx === 1) return 'bg-gray-100 text-gray-800';
  if (idx === 2) return 'bg-amber-50 text-amber-700';
  return 'text-gray-400';
};

const getScoreLabel = (user: any) => {
  if (activeType.value === 'orders') return `${user.totalOrders || 0} Orders`;
  if (activeType.value === 'deliveries') return `${user.totalDeliveries || 0} Hustles`;
  return `${user.points || 0} PTS`;
};

watch(activeType, loadLeaderboard);
onMounted(loadLeaderboard);
</script>

<style scoped>
</style>
