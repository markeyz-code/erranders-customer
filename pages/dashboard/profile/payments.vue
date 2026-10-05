<template>
 <div class="max-w-xl mx-auto space-y-6 pb-20 animate-fade-in selection:bg-parentPrimary/10 selection:text-parentPrimary pt-8 px-0">
 <div class="flex items-center gap-4">
 <NuxtLink to="/dashboard/profile" class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-50 hover:bg-gray-900 hover:text-white transition-all ">
 <ArrowLeft class="w-5 h-5" />
 </NuxtLink>
 <div class="space-y-0.5">
 <h1 class="text-xl font-medium text-gray-900 tracking-tight tracking-tighter">Payment Methods</h1>
 <p class="text-sm font-bold text-gray-400 ">Manage your cards & billing</p>
 </div>
 </div>

 <div class="bg-white p-12 rounded-3xl border border-gray-50  text-center space-y-6 relative overflow-hidden group">
 <div class="absolute inset-0 bg-gradient-to-br from-parentPrimary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
 <div class="relative z-10 w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto text-gray-300 transform rotate-12 group-hover:rotate-0 transition-transform duration-700">
 <CreditCard class="w-10 h-10" />
 </div>
 <div class="relative z-10 space-y-2">
 <p class="text-sm font-bold text-gray-900 tracking-tight">No payment methods saved</p>
 <p class="text-sm font-bold text-gray-400  max-w-[200px] mx-auto leading-relaxed">Save your cards for faster checkout on your next order.</p>
 </div>
 <button class="relative z-10 w-full py-4 bg-gray-900 text-white rounded-xl text-sm font-medium tracking-[0.2em]  -900/10 hover:bg-parentPrimary transition-all active:scale-95">Add Payment Method</button>
 </div>
 </div>
</template>

<script setup lang="ts">
import { ArrowLeft, CreditCard } from 'lucide-vue-next'
definePageMeta({ layout: 'student' })
</script>
