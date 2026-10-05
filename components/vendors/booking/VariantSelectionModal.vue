<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-[110] bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 animate-fade-in" @click.self="$emit('close')">
      <div class="bg-white w-full md:w-[480px] rounded-t-3xl md:rounded-3xl shadow-sm border border-gray-50 overflow-hidden flex flex-col max-h-[85vh] animate-slide-up-modal">
        
        <!-- Header -->
        <div class="p-4 border-b border-gray-50 flex items-center justify-between shrink-0">
          <h2 class="text-base font-bold text-gray-900">Select an option</h2>
          <button @click="$emit('close')" class="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors">
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Scrollable Options -->
        <div class="p-4 overflow-y-auto space-y-3 flex-1">
          <label 
            v-for="(variant, idx) in service.variants" 
            :key="idx"
            class="flex items-center justify-between p-4 rounded-xl border-[0.5px] cursor-pointer transition-all hover:bg-gray-25"
            :class="selectedVariant === variant ? 'border-parentPrimary bg-parentPrimary/5 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300'"
          >
            <input type="radio" :value="variant" v-model="selectedVariant" class="hidden" />
            <div class="flex items-center gap-3">
              <div class="w-4 h-4 rounded-full border-[0.5px] flex items-center justify-center shrink-0 transition-colors"
                   :class="selectedVariant === variant ? 'border-parentPrimary bg-white' : 'border-gray-300 bg-white'">
                <div v-if="selectedVariant === variant" class="w-2.5 h-2.5 bg-parentPrimary rounded-full"></div>
              </div>
              <div>
                <p class="font-bold text-sm text-gray-900">{{ variant.name }}</p>
                <p class="text-xs text-gray-500 font-medium">{{ variant.durationInMinutes }} mins</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-bold text-sm text-gray-900">₦{{ variant.price.toLocaleString() }}</p>
            </div>
          </label>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-gray-50 bg-white shrink-0">
          <button 
            @click="handleContinue"
            :disabled="!selectedVariant"
            class="w-full py-3 bg-parentPrimary text-white rounded-xl font-bold text-sm shadow-sm border border-gray-50 hover:brightness-110 transition-all disabled:opacity-50"
          >
            Continue
          </button>
        </div>

      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { X } from 'lucide-vue-next';

const props = defineProps<{
  service: any;
}>();

const emit = defineEmits(['close', 'add']);

const selectedVariant = ref<any>(null);

const handleContinue = () => {
  if (selectedVariant.value) {
    emit('add', {
      service: props.service,
      variantName: selectedVariant.value.name,
      price: selectedVariant.value.price,
      durationInMinutes: selectedVariant.value.durationInMinutes,
      extras: []
    });
  }
};
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.2s ease-out; }
.animate-slide-up-modal { animation: slideUpModal 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes slideUpModal { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
</style>
