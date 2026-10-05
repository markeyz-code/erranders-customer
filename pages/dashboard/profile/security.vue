<template>
 <div class="max-w-xl mx-auto space-y-6 pb-20 animate-fade-in selection:bg-parentPrimary/10 selection:text-parentPrimary pt-8 px-0">
 <div class="flex items-center gap-4">
 <NuxtLink to="/dashboard/profile" class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-50 hover:bg-gray-900 hover:text-white transition-all ">
 <ArrowLeft class="w-5 h-5" />
 </NuxtLink>
 <div class="space-y-0.5">
 <h1 class="text-xl font-medium text-gray-900 tracking-tight tracking-tighter">Security</h1>
 <p class="text-sm font-bold text-gray-400 ">Protect your account</p>
 </div>
 </div>

 <div class="bg-white p-4 md:p-5 rounded-3xl border border-gray-50  space-y-6 relative overflow-hidden group">
 <div class="absolute inset-0 bg-gradient-to-br from-parentPrimary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
 <div class="space-y-4 relative z-10">
 <div class="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-50/50 hover:bg-white transition-all duration-300">
 <div>
 <p class="text-[11px] font-medium text-gray-900 ">Password</p>
 <p class="text-sm text-gray-400 font-bold tracking-[0.2em] mt-1.5">Last updated 2 months ago</p>
 </div>
 <button class="px-4 py-2 bg-white text-gray-900 border border-gray-50 rounded-lg text-sm font-medium  hover:bg-gray-900 hover:text-white transition-all">Update</button>
 </div>
 
 <div class="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-50/50 hover:bg-white transition-all duration-300">
 <div>
 <p class="text-[11px] font-medium text-gray-900 ">Two-Factor Auth</p>
 <p class="text-sm text-gray-400 font-bold tracking-[0.2em] mt-1.5">Enhance Security</p>
 </div>
 <button class="px-4 py-2 bg-white text-gray-900 border border-gray-50 rounded-lg text-sm font-medium  hover:bg-gray-900 hover:text-white transition-all">Enable</button>
 </div>

 <div class="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-50/50 hover:bg-white transition-all duration-300">
 <div>
 <p class="text-[11px] font-medium text-gray-900 ">Authorized Devices</p>
 <p class="text-sm text-gray-400 font-bold tracking-[0.2em] mt-1.5">Active sessions</p>
 </div>
 <button class="px-4 py-2 bg-white text-gray-900 border border-gray-50 rounded-lg text-sm font-medium  hover:bg-gray-900 hover:text-white transition-all">Review</button>
 </div>
 </div>
 </div>
 </div>
</template>

<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
definePageMeta({ layout: 'student' })
</script>
