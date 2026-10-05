<template>
  <div class="flex flex-col gap-2 w-full">
    <label class="text-xs font-extrabold tracking-widest text-gray-900 uppercase">
      Birthday
    </label>
    
    <div class="relative">
      <!-- Custom Input Display -->
      <button 
        type="button"
        @click="isOpen = !isOpen"
        class="w-full flex items-center justify-between px-4 py-4 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF5C1A] transition-all hover:bg-gray-100"
      >
        <span :class="modelValue ? 'text-gray-900 font-medium' : 'text-gray-400'">
          {{ formattedDate }}
        </span>
        <CalendarDays class="w-5 h-5 text-[#008950]" />
      </button>

      <!-- Dropdown for Month/Day Selection -->
      <div 
        v-if="isOpen"
        class="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-sm border border-gray-50 border border-gray-50 p-4 z-50 animate-fade-in-up"
      >
        <div class="flex gap-3">
          <div class="flex-1">
            <label class="block text-xs font-bold text-gray-500 mb-1">Month</label>
            <select 
              v-model="selectedMonth" 
              class="w-full p-2 bg-gray-50 border border-gray-25 rounded-lg focus:outline-none focus:border-[#FF5C1A]"
            >
              <option value="" disabled>Select</option>
              <option v-for="(month, index) in months" :key="month" :value="index">
                {{ month }}
              </option>
            </select>
          </div>
          <div class="flex-1">
            <label class="block text-xs font-bold text-gray-500 mb-1">Day</label>
            <select 
              v-model="selectedDay" 
              class="w-full p-2 bg-gray-50 border border-gray-25 rounded-lg focus:outline-none focus:border-[#FF5C1A]"
              :disabled="selectedMonth === ''"
            >
              <option value="" disabled>Select</option>
              <option v-for="day in daysInMonth" :key="day" :value="day">
                {{ day }}
              </option>
            </select>
          </div>
        </div>
        <button 
          type="button" 
          @click="confirmDate"
          class="w-full mt-4 py-2 bg-[#FF5C1A] text-white rounded-lg font-bold text-sm hover:bg-[#E54D12] transition-colors"
          :disabled="selectedMonth === '' || selectedDay === ''"
        >
          Confirm
        </button>
      </div>
    </div>

    <!-- Info Message -->
    <div class="flex items-center gap-2 mt-1">
      <Info class="w-4 h-4 text-[#008950]" />
      <span class="text-sm text-[#008950] font-medium">
        Celebrate your birthday with free delivery and discounts.
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { CalendarDays, Info } from 'lucide-vue-next';

const props = defineProps({
  modelValue: {
    type: String, // Expecting ISO string or null
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);

const isOpen = ref(false);
const selectedMonth = ref<number | ''>('');
const selectedDay = ref<number | ''>('');

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Initialize if modelValue exists
if (props.modelValue) {
  const date = new Date(props.modelValue);
  if (!isNaN(date.getTime())) {
    selectedMonth.value = date.getMonth();
    selectedDay.value = date.getDate();
  }
}

const daysInMonth = computed(() => {
  if (selectedMonth.value === '') return 31;
  // Year 2000 is a leap year, so February has 29 days. 
  return new Date(2000, (selectedMonth.value as number) + 1, 0).getDate();
});

const formattedDate = computed(() => {
  if (selectedMonth.value !== '' && selectedDay.value !== '') {
    return `${months[selectedMonth.value as number]} ${selectedDay.value}`;
  }
  return 'Select your birthday (Month & Day)';
});

const confirmDate = () => {
  if (selectedMonth.value !== '' && selectedDay.value !== '') {
    const date = new Date(2000, selectedMonth.value as number, selectedDay.value as number);
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - tzOffset);
    emit('update:modelValue', localDate.toISOString());
    isOpen.value = false;
  }
};
</script>
