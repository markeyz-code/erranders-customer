<template>
  <div class="min-h-screen bg-white font-sans text-gray-900 scroll-smooth">
    <!-- Navbar -->
    <LandingNavbar />

    <!-- Hero Section -->
    <section class="relative pt-40 pb-20 overflow-hidden">
      <div class="absolute inset-0 z-0 pointer-events-none">
        <div class="absolute top-0 left-0 w-[500px] h-[500px] bg-parentPrimary/5 rounded-full blur-[100px] -translate-x-1/4"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-10 relative z-10 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gray-50 border border-gray-50 text-sm font-medium tracking-[0.2em] uppercase text-gray-400 mb-8">
          <span class="w-2 h-2 rounded-full bg-parentPrimary"></span>
          Direct Support
        </div>
        <h1 class="text-5xl md:text-7xl font-medium tracking-tighter leading-[0.9] text-gray-900 mb-6 max-w-4xl mx-auto">
          We're here for <br />
          <span class="text-parentPrimary  bg-parentPrimary/5 px-4 rounded-3xl">every student.</span>
        </h1>
        <p class="text-xl text-gray-500 font-bold max-w-2xl mx-auto leading-relaxed tracking-tight">
          Have a question about an order? Want to bring Errandr to your campus? Reach out to our dedicated support team.
        </p>
      </div>
    </section>

    <!-- Contact Cards -->
    <section class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-10">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Support Card -->
          <div class="bg-gray-50/50 p-5 rounded-[2.5rem] border border-gray-50 hover:bg-white hover:shadow-sm border border-gray-50 hover:-translate-y-2 transition-all duration-500 group">
            <div class="w-14 h-14 bg-parentPrimary/10 rounded-2xl flex items-center justify-center text-parentPrimary mb-8 group-hover:scale-110 transition-transform">
              <Mail class="w-7 h-7" />
            </div>
            <h3 class="text-xl font-medium text-gray-900 tracking-tight mb-3">Email Support</h3>
            <p class="text-[13px] text-gray-500 font-bold leading-relaxed mb-6">General inquiries and order issues.</p>
            <a href="mailto:support@erranders.org" class="text-sm font-medium text-parentPrimary hover:underline">support@erranders.org</a>
          </div>

          <!-- Expansion Card -->
          <div class="bg-gray-50/50 p-5 rounded-[2.5rem] border border-gray-50 hover:bg-white hover:shadow-sm border border-gray-50 hover:-translate-y-2 transition-all duration-500 group">
            <div class="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 group-hover:scale-110 transition-transform">
              <Building class="w-7 h-7" />
            </div>
            <h3 class="text-xl font-medium text-gray-900 tracking-tight mb-3">Campus Launch</h3>
            <p class="text-[13px] text-gray-500 font-bold leading-relaxed mb-6">Bring Errandr to your school environment.</p>
            <a href="mailto:expansion@erranders.org" class="text-sm font-medium text-emerald-600 hover:underline">expansion@erranders.org</a>
          </div>

          <!-- Phone Card -->
          <div class="bg-gray-50/50 p-5 rounded-[2.5rem] border border-gray-50 hover:bg-white hover:shadow-sm border border-gray-50 hover:-translate-y-2 transition-all duration-500 group">
            <div class="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-8 group-hover:scale-110 transition-transform">
              <Phone class="w-7 h-7" />
            </div>
            <h3 class="text-xl font-medium text-gray-900 tracking-tight mb-3">Instant Hotline</h3>
            <p class="text-[13px] text-gray-500 font-bold leading-relaxed mb-6">Mon–Sat, 8AM–9PM local time.</p>
            <a href="tel:09040303103" class="text-sm font-medium text-indigo-600 hover:underline">09040303103</a>
          </div>

          <!-- Social Card -->
          <div class="bg-gray-50/50 p-5 rounded-[2.5rem] border border-gray-50 hover:bg-white hover:shadow-sm border border-gray-50 hover:-translate-y-2 transition-all duration-500 group">
            <div class="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-8 group-hover:scale-110 transition-transform">
              <Instagram class="w-7 h-7" />
            </div>
            <h3 class="text-xl font-medium text-gray-900 tracking-tight mb-3">Social Pulse</h3>
            <p class="text-[13px] text-gray-500 font-bold leading-relaxed mb-6">Updates and campus giveaways.</p>
            <div class="flex gap-4">
              <a href="#" class="text-sm font-medium text-amber-600 hover:underline uppercase tracking-tight">IG</a>
              <a href="#" class="text-sm font-medium text-amber-600 hover:underline uppercase tracking-tight">TW</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Office Section -->
    <section class="py-24 bg-gray-50/30">
      <div class="max-w-7xl mx-auto px-4 sm:px-10">
        <div class="bg-white p-12 md:p-20 rounded-[4rem] border border-gray-50 flex flex-col md:flex-row items-center gap-16 shadow-sm">
          <div class="flex-1 space-y-8">
            <h2 class="text-4xl font-medium text-gray-900 tracking-tight leading-[0.95]">Our Base of <br/><span class="text-parentPrimary">Operations.</span></h2>
            <p class="text-lg text-gray-500 font-bold leading-relaxed">Currently scaling from the CMUL campus to universities across Nigeria. Our core team is based in the heart of Lagos innovation.</p>
            <div class="space-y-4">
              <div class="flex items-center gap-4 text-gray-900 font-medium">
                <MapPin class="w-5 h-5 text-parentPrimary" />
                38, Immam memudu Coker, Lagos.
              </div>
            </div>
          </div>
          <div class="flex-1 w-full h-[400px] bg-gray-100 rounded-[3rem] overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000 shadow-inner">
             <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1000&auto=format&fit=crop" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <LandingFooter class="mt-20" />
  </div>
</template>

<script setup lang="ts">
import { Mail, Phone, MapPin, Building, Instagram, ArrowRight } from 'lucide-vue-next'
definePageMeta({ layout: false })
useHead({ 
  title: 'Contact Errandr - Student Support',
  meta: [{ name: 'description', content: 'Reach out to Errandr for order support, partnerships, or campus expansion.' }] 
})
</script>
