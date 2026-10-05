<template>
  <div class="space-y-6 pb-24 animate-fade-in px-3 selection:bg-parentPrimary/10 selection:text-parentPrimary">
    <div class="mb-8  md:px-0">
      <h1 class="text-2xl font-bold text-gray-900 mb-1">Forms & Waivers</h1>
      <p class="text-sm text-gray-500">Manage your consultation forms, waivers, and documents.</p>
    </div>

    <div class="px-0 md:px-0">
      <div class="bg-white rounded-3xl text-center p-16 border border-gray-50 shadow-sm animate-fade-in">
        <div class="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-6 mx-auto">
          <ClipboardList class="w-8 h-8 text-gray-300" />
        </div>
        <h2 class="text-xl font-bold text-gray-900 mb-2">No pending forms</h2>
        <p class="text-sm text-gray-500 max-w-sm mx-auto">You're all caught up! Any required consultation forms or waivers for your upcoming appointments will appear here.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ClipboardList } from 'lucide-vue-next';

definePageMeta({
  layout: 'student'
});

useHead({ title: 'Forms - Errandr' });
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
