<template>
  <div 
    :class="[
      'relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-[#0B0F19] via-[#131D31] to-[#1E293B] border border-slate-800 shadow-xl text-white group transition-all duration-300',
      compact ? 'p-4 sm:p-5' : 'p-5 sm:p-7 md:p-8'
    ]"
  >
    <!-- Ambient Background Glows -->
    <div class="absolute -right-16 -top-16 w-64 h-64 bg-[#FF5C1A]/15 rounded-full blur-3xl pointer-events-none group-hover:bg-[#FF5C1A]/25 transition-all duration-700"></div>
    <div class="absolute -left-16 -bottom-16 w-64 h-64 bg-[#FF5C1A]/15 rounded-full blur-3xl pointer-events-none group-hover:bg-[#FF5C1A]/25 transition-all duration-700"></div>
    <div class="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none"></div>

    <div class="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
      <!-- Left Content -->
      <div class="flex-1 text-center lg:text-left space-y-3 max-w-2xl">
        <!-- Tag / Badge -->
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF5C1A]/10 border border-[#FF5C1A]/25 text-[#FF7A3D] text-xs font-bold uppercase tracking-wider backdrop-blur-md">
          <span class="w-2 h-2 rounded-full bg-[#FF5C1A] animate-pulse"></span>
          <span class="flex items-center gap-1.5">
            <Repeat class="w-3.5 h-3.5 text-[#FF5C1A]" />
            Campus Marketplace &amp; Swaps
          </span>
        </div>

        <!-- Headline -->
        <h3 
          :class="[
            'font-black tracking-tight text-white leading-tight',
            compact ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl md:text-4xl'
          ]"
        >
          Decluttering or Moving? 
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#FF8C55] via-[#FF5C1A] to-[#FF4500]">
            Trade on Barter
          </span>
        </h3>

        <!-- Description -->
        <p 
          :class="[
            'text-slate-300 font-medium leading-relaxed',
            compact ? 'text-xs sm:text-sm max-w-xl' : 'text-sm sm:text-base max-w-xl'
          ]"
        >
          Turn your old fan, textbooks, mattress, gadgets, or fridge into cash, or swap for what you need with verified students on campus.
        </p>

        <!-- Feature Pills -->
        <div class="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-[11px] sm:text-xs font-semibold text-slate-400">
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
            <ShieldCheck class="w-3.5 h-3.5 text-emerald-400" />
            Escrow Protected
          </span>
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
            <Sparkles class="w-3.5 h-3.5 text-[#FF7A3D]" />
            Direct Student Deals
          </span>
          <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
            <CheckCircle2 class="w-3.5 h-3.5 text-blue-400" />
            Zero Listing Fees
          </span>
        </div>
      </div>

      <!-- Right Action & Showcase -->
      <div class="w-full lg:w-auto flex flex-col sm:flex-row items-center justify-center gap-3 shrink-0">
        <!-- Floating category preview cards (visible on wider screens) -->
        <!-- <div v-if="!compact" class="hidden xl:flex items-center gap-2 mr-2">
          <div class="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center backdrop-blur-sm transform -rotate-3 hover:rotate-0 transition-transform">
            <span class="text-xl block mb-0.5">📚</span>
            <span class="text-[10px] font-bold text-slate-300">Books</span>
          </div>
          <div class="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center backdrop-blur-sm transform rotate-3 hover:rotate-0 transition-transform">
            <span class="text-xl block mb-0.5">💻</span>
            <span class="text-[10px] font-bold text-slate-300">Tech</span>
          </div>
          <div class="p-2.5 rounded-xl bg-white/5 border border-white/10 text-center backdrop-blur-sm transform -rotate-2 hover:rotate-0 transition-transform">
            <span class="text-xl block mb-0.5">❄️</span>
            <span class="text-[10px] font-bold text-slate-300">Dorm</span>
          </div>
        </div> -->

        <!-- Primary CTA -->
        <a 
          href="https://decluttered.erranders.org/" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FF5C1A] hover:bg-[#E54D12] text-white font-black rounded-xl sm:rounded-2xl text-sm sm:text-base shadow-lg shadow-[#FF5C1A]/25 hover:shadow-[#FF5C1A]/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 group/btn"
        >
          <span>Explore Barter</span>
          <ArrowUpRight class="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Repeat, ShieldCheck, Sparkles, CheckCircle2, ArrowUpRight } from 'lucide-vue-next';

defineProps<{
  compact?: boolean;
}>();
</script>
