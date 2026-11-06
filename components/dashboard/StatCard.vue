<template>
  <div class="rounded-[1.25rem] border border-[#EDE9E3] bg-white p-4">
    <div class="mb-3 flex items-center justify-between">
      <div class="flex h-9 w-9 items-center justify-center rounded-xl" :class="tint">
        <component :is="icon" v-if="icon" class="h-4 w-4" />
      </div>
      <span v-if="badge" class="rounded-full bg-[#F6F3EF] px-2 py-0.5 text-[10px] font-bold text-[#6B655D]">
        {{ badge }}
      </span>
    </div>
    <p class="text-[10px] font-bold uppercase tracking-wider text-[#9C968E]">{{ label }}</p>
    <h3 class="mt-0.5 text-xl font-black tracking-tight text-[#171310]">{{ value }}</h3>
    <p v-if="hint" class="mt-0.5 text-[11px] text-[#9C968E]">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string;
    value: string | number;
    icon?: any;
    tint?: string;
    badge?: string;
    hint?: string;
  }>(),
  { tint: 'bg-[#FFF1E8] text-[#FF5C1A]' },
);
</script>
