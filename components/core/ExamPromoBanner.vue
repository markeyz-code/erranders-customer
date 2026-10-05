<template>
  <div class="bg-[#FF5C1A] text-white overflow-hidden py-2 relative z-50 shadow-sm">
    <div class="marquee-container">
      <div class="marquee-content animate-marquee flex items-center gap-12 text-sm font-semibold tracking-wide h-6">
        <!-- We repeat it a few times for the marquee effect, ensuring they stay inline -->
        <div class="flex items-center gap-12 shrink-0">
          <span v-for="i in 5" :key="i" class="flex items-center gap-2 whitespace-nowrap">
            <span class="text-base">🎓</span>
            <span>Erranders Exam Combo!</span>
            <span class="bg-white/20 px-2 py-0.5 rounded text-white font-bold">₦1,000 OFF Food Vendors</span>
            <span>&amp;</span>
            <span class="bg-white/20 px-2 py-0.5 rounded text-white font-bold">₦500 OFF Chips by Motee</span>
            <span class="text-base">🍟</span>
            <span class=" font-bold">Limited offer available!</span>
            <Sparkles class="w-4 h-4 text-yellow-300" />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Sparkles } from 'lucide-vue-next'
</script>

<style scoped>
.marquee-container {
  overflow: hidden;
  position: relative;
  width: 100%;
}
.marquee-content {
  display: inline-block;
  padding-left: 100%;
  animation: marquee 45s linear infinite;
}
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-100%); }
}
</style>
