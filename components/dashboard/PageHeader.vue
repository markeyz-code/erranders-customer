<template>
  <header class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
    <div class="min-w-0">
      <div v-if="eyebrow" class="mb-1.5 flex items-center gap-1.5">
        <span class="h-1.5 w-1.5 rounded-full bg-[#FF5C1A]" />
        <p class="ff-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[#9C968E]">
          {{ eyebrow }}
        </p>
      </div>
      <h1 class="ff-display truncate text-2xl font-bold leading-tight tracking-tight text-[#171310] md:text-3xl">
        {{ title }}<span v-if="highlight" class="text-[#FF5C1A]"> {{ highlight }}</span>
      </h1>
      <p v-if="description" class="mt-1 text-sm font-medium text-[#6B655D]">{{ description }}</p>
    </div>

    <div v-if="$slots.actions" class="flex shrink-0 items-center gap-2">
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  highlight?: string;
  eyebrow?: string;
  description?: string;
}>();
</script>
