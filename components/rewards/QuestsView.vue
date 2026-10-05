<template>
  <div class="bg-white rounded-none sm:rounded-2xl border-0 sm:border border-gray-50 p-4 sm:p-4 shadow-none sm:shadow-sm">
    <div class="flex items-center justify-between mb-6">
      <div>
        <h3 class="text-lg font-medium text-gray-900 tracking-tight">Active Quests</h3>
        <p class="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Complete missions to earn bonus points</p>
      </div>
      <div class="w-10 h-10 bg-parentPrimary/10 rounded-xl flex items-center justify-center text-parentPrimary">
        <Target class="w-5 h-5" />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
      <div v-for="i in 3" :key="i" class="h-24 bg-gray-50 rounded-2xl animate-pulse"></div>
    </div>

    <!-- Empty state -->
    <div v-else-if="quests.length === 0" class="py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
      <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl mx-auto mb-3 shadow-sm border border-gray-50">🏆</div>
      <p class="text-xs font-bold text-gray-400">No active quests right now. Check back later!</p>
    </div>

    <!-- Quests list -->
    <div v-else class="space-y-3">
      <div 
        v-for="quest in quests" 
        :key="quest._id"
        class="group relative p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-parentPrimary/20 hover:bg-white hover:shadow-sm transition-all duration-300"
      >
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform border border-gray-50">
            {{ quest.icon || '🎯' }}
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2 mb-1.5">
              <div>
                <h4 class="font-medium text-gray-900 text-xs tracking-tight truncate">{{ quest.title }}</h4>
                <p class="text-[10px] font-bold text-gray-400 line-clamp-2 mt-0.5">{{ quest.description }}</p>
              </div>
              <div class="text-right shrink-0">
                <span class="text-xs font-medium text-emerald-600">+{{ quest.rewardPoints }} pts</span>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="mt-3">
              <div class="flex items-center justify-between text-[9px] font-medium uppercase tracking-wider text-gray-400 mb-1">
                <span>{{ quest.isCompleted ? 'Completed' : 'In Progress' }}</span>
                <span>{{ quest.progress }} / {{ quest.targetValue }}</span>
              </div>
              <div class="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-parentPrimary transition-all duration-500 ease-out"
                  :style="{ width: `${Math.min((quest.progress / quest.targetValue) * 100, 100)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Completion Overlay -->
        <div v-if="quest.isCompleted" class="absolute inset-0 bg-white/70 backdrop-blur-[1px] rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div class="px-4 py-1.5 bg-emerald-500 text-white text-[10px] font-medium uppercase tracking-wider rounded-lg shadow-sm border border-gray-50">
            ✓ Accomplished
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Target } from 'lucide-vue-next';
import { rewards_api } from '@/api_factory/modules/rewards';

const loading = ref(true);
const quests = ref<any[]>([]);

const fetchQuests = async () => {
  try {
    const res = await rewards_api.getQuests();
    if (res.data) {
      quests.value = res.data as any[];
    }
  } catch (e) {
    console.error('Failed to fetch quests:', e);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchQuests);
</script>

<style scoped>
</style>
