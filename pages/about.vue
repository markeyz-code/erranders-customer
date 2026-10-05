<template>
  <div class="min-h-screen bg-white font-sans text-gray-900 scroll-smooth">
    <!-- Navbar -->
    <LandingNavbar />

    <!-- Hero Section -->
    <section class="relative pt-40 pb-24 overflow-hidden">
      <div class="absolute inset-0 z-0 pointer-events-none">
        <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-parentPrimary/5 rounded-full blur-[120px] translate-x-1/4"></div>
        <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50 rounded-full blur-[100px] -translate-x-1/4"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-10 relative z-10 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-50 border border-gray-50 text-sm font-medium tracking-[0.2em] uppercase text-gray-400 mb-8">
          <span class="w-2 h-2 rounded-full bg-parentPrimary animate-pulse"></span>
          Our Mission & Vision
        </div>
        <h1 class="text-6xl md:text-8xl font-medium tracking-tighter leading-[0.9] text-gray-900 mb-10 max-w-4xl mx-auto">
          Delivering value to <br />
          <span class="text-parentPrimary  bg-parentPrimary/5 px-4 rounded-3xl">every heart</span> on campus.
        </h1>
        <p class="text-xl text-gray-500 font-bold max-w-2xl mx-auto leading-relaxed tracking-tight">
          Starting from the <span class="text-gray-900">College of Medicine, University of Lagos (CMUL)</span>, Errandr is revolutionizing how campus communities eat, work, and thrive.
        </p>
      </div>
    </section>

    <!-- Value Propositions -->
    <section class="py-24 bg-gray-50/50">
      <div class="max-w-7xl mx-auto px-4 sm:px-10">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- For Students -->
          <div class="bg-white p-10 rounded-[3rem] border border-gray-50 shadow-sm hover:shadow-sm border border-gray-50 hover:-translate-y-2 transition-all duration-500 group">
            <div class="w-16 h-16 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-parentPrimary mb-8 group-hover:scale-110 transition-transform">
              <GraduationCap class="w-8 h-8" />
            </div>
            <h3 class="text-2xl font-medium text-gray-900 tracking-tight mb-4">For Students</h3>
            <p class="text-gray-500 font-bold leading-relaxed mb-6">Access your favorite meals within and outside school environs instantly. Focus on your studies while we handle the logistics.</p>
            <div class="flex items-center gap-2 text-sm font-medium text-parentPrimary uppercase ">
              <div class="h-px flex-1 bg-parentPrimary/10"></div>
              Seamless Access
            </div>
          </div>

          <!-- For Entrepreneurs -->
          <div class="bg-white p-10 rounded-[3rem] border border-gray-50 shadow-sm hover:shadow-sm border border-gray-50 hover:-translate-y-2 transition-all duration-500 group">
            <div class="w-16 h-16 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center text-emerald-600 mb-8 group-hover:scale-110 transition-transform">
              <Store class="w-8 h-8" />
            </div>
            <h3 class="text-2xl font-medium text-gray-900 tracking-tight mb-4">Entrepreneurs</h3>
            <p class="text-gray-500 font-bold leading-relaxed mb-6">Empowering student vendors and local kitchens with a digital platform to scale their businesses and reach more customers.</p>
            <div class="flex items-center gap-2 text-sm font-medium text-emerald-600 uppercase ">
              <div class="h-px flex-1 bg-emerald-500/10"></div>
              Growth Engine
            </div>
          </div>

          <!-- For Erranders -->
          <div class="bg-white p-10 rounded-[3rem] border border-gray-50 shadow-sm hover:shadow-sm border border-gray-50 hover:-translate-y-2 transition-all duration-500 group">
            <div class="w-16 h-16 bg-indigo-50 rounded-[1.5rem] flex items-center justify-center text-indigo-600 mb-8 group-hover:scale-110 transition-transform">
              <Zap class="w-8 h-8" />
            </div>
            <h3 class="text-2xl font-medium text-gray-900 tracking-tight mb-4">Erranders</h3>
            <p class="text-gray-500 font-bold leading-relaxed mb-6">Creating high-yield earning opportunities for student riders. Earn while you walk or ride between your lectures.</p>
            <div class="flex items-center gap-2 text-sm font-medium text-indigo-600 uppercase ">
              <div class="h-px flex-1 bg-indigo-500/10"></div>
              Walk to Earn
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission Focus -->
    <section class="py-32 bg-white overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-10">
        <div class="flex flex-col lg:flex-row items-center gap-20">
          <div class="flex-1 space-y-10 text-center lg:text-left">
            <h2 class="text-5xl md:text-6xl font-medium tracking-tighter leading-[0.95] text-gray-900">
              Meals accessible <br />
              <span class="text-parentPrimary">wherever you are.</span>
            </h2>
            <p class="text-xl text-gray-500 font-bold leading-relaxed tracking-tight max-w-2xl">
              From the halls of CMUL to every corner of the university environs, we bridge the gap. Our hyper-local network ensures that distance is never a barrier to quality nutrition and essential services.
            </p>
            <div class="pt-6">
              <NuxtLink to="/auth/register" class="inline-flex items-center gap-4 px-10 py-5 bg-gray-900 text-white rounded-[2rem] font-medium text-sm uppercase  shadow-sm border border-gray-50 hover:bg-parentPrimary transition-all group">
                Join our community
                <ArrowRight class="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </NuxtLink>
            </div>
          </div>
          <div class="flex-1 relative">
            <div class="absolute -inset-10 bg-parentPrimary/10 blur-[100px] rounded-full animate-pulse-slow"></div>
            <img 
              src="@/assets/img/hero2.webp" 
              alt="Campus Delivery" 
              class="relative z-10 rounded-[4rem] shadow-3xl border-8 border-white object-cover aspect-[5/4]"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <LandingFooter />
  </div>
</template>

<script setup lang="ts">
import { GraduationCap, Store, Zap, ArrowRight } from 'lucide-vue-next'
definePageMeta({ layout: false })
useHead({ 
  title: 'About Errandr - Community Driven Delivery',
  meta: [{ name: 'description', content: 'Errandr is focused on delivering value to students, entrepreneurs, and dispatchers, starting from CMUL, Lagos.' }] 
})
</script>

<style scoped>
.animate-pulse-slow {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 0.1; transform: scale(1); }
  50% { opacity: 0.2; transform: scale(1.1); }
}
</style>
