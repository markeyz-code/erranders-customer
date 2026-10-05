<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 animate-fade-in" @click.self="$emit('close')">
      <div class="bg-white w-full md:w-[480px] rounded-t-3xl md:rounded-3xl shadow-sm border border-gray-50 overflow-hidden flex flex-col max-h-[85vh] animate-slide-up-modal">
        
        <!-- Header -->
        <div class="p-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <h2 class="text-base font-bold text-gray-900">Add extra service</h2>
          <button @click="$emit('close')" class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Scrollable Options -->
        <div class="p-4 overflow-y-auto space-y-3 flex-1">
          <button 
            v-for="(extra, idx) in service.extras" 
            :key="idx"
            @click="$emit('add', extra)"
            class="w-full flex items-center text-left justify-between p-4 rounded-xl border-[0.5px] border-gray-100 hover:border-gray-300 transition-all bg-white group cursor-pointer"
          >
            <div>
              <p class="font-bold text-gray-900">{{ extra.name }}</p>
              <div class="flex items-center gap-2 mt-1">
                <span class="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                  + {{ extra.durationInMinutes }} mins
                </span>
                <span class="text-sm font-bold text-gray-900">
                  NGN {{ extra.price.toLocaleString() }}
                </span>
              </div>
            </div>
            <div 
              class="w-10 h-10 rounded-full border-[0.5px] border-gray-100 flex items-center justify-center group-hover:bg-gray-50 group-hover:border-gray-300 transition-all shrink-0"
            >
              <Plus class="w-5 h-5 text-gray-900" />
            </div>
          </button>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-gray-100 bg-white shrink-0">
          <button 
            @click="$emit('close')"
            class="w-full py-3 bg-gray-100 text-gray-900 rounded-xl font-bold text-sm shadow-sm hover:bg-gray-200 transition-all"
          >
            Skip for now
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { X, Plus } from 'lucide-vue-next';

const props = defineProps<{
  service: any;
}>();

const emit = defineEmits(['close', 'add']);
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.2s ease-out; }
.animate-slide-up-modal { animation: slideUpModal 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUpModal { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
</style>
