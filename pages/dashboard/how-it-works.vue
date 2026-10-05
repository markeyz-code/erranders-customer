<template>
  <div class="space-y-12 animate-fade-in pb-32 max-w-5xl mx-auto px-2">
    <!-- Header Hero -->
    <div class="text-center space-y-4 pt-10">
      <div class="inline-flex items-center gap-2 px-3 py-1 bg-parentPrimary/10 border border-parentPrimary/20 rounded-full text-parentPrimary text-sm font-medium uppercase ">
         New to Errandr?
      </div>
      <h1 class="text-4xl md:text-5xl font-medium text-gray-900 tracking-tight leading-none">Your Campus <br /><span class="text-parentPrimary">Power Up.</span></h1>
      <p class="text-gray-400 text-sm font-bold max-w-lg mx-auto leading-relaxed ">Everything you need to know about navigating your campus with speed and extra income.</p>
    </div>

    <!-- Core Steps -->
    <section class="grid grid-cols-1 md:grid-cols-3 gap-8">
       <div v-for="(step, i) in mainSteps" :key="i" class="bg-white border border-gray-50 p-5 rounded-[3rem]  hover: transition-all group relative overflow-hidden">
          <div class="absolute -right-10 -top-10 w-32 h-32 bg-gray-50 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
          <div class="relative z-10">
             <div class="w-14 h-14 rounded-2xl bg-gray-900 text-white flex items-center justify-center text-3xl mb-8  group-hover:rotate-12 group-hover:bg-parentPrimary transition-all">
                {{ step.icon }}
             </div>
             <h3 class="text-xl font-medium text-gray-900 tracking-tighter mb-2">{{ step.title }}</h3>
             <p class="text-sm font-bold text-gray-400 leading-relaxed">{{ step.desc }}</p>
          </div>
       </div>
    </section>

    <!-- Detailed Modules -->
    <section class="space-y-6">
       <div v-for="(module, i) in modules" :key="i" 
          class="flex flex-col lg:flex-row gap-8 p-10 rounded-[3rem] border border-gray-50  transition-all"
          :class="i % 2 === 0 ? 'bg-white' : 'bg-gray-900 text-white lg:flex-row-reverse border-gray-800 '"
       >
          <div class="flex-1 space-y-6">
             <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-parentPrimary/10 border border-parentPrimary/20 text-parentPrimary">
                {{ module.icon }}
             </div>
             <h2 class="text-3xl font-medium tracking-tight leading-none mb-4 ">{{ module.title }}</h2>
             <p class="text-sm font-medium leading-relaxed" :class="i % 2 === 0 ? 'text-gray-500' : 'text-gray-400'">{{ module.content }}</p>
             <div class="space-y-4 pt-4">
                <div v-for="point in module.points" :key="point" class="flex items-center gap-4">
                   <div class="w-2 h-2 rounded-full bg-parentPrimary"></div>
                   <span class="text-[11px] font-medium uppercase ">{{ point }}</span>
                </div>
             </div>
          </div>
          <div class="flex-1 min-h-[300px] rounded-[2rem] overflow-hidden bg-gray-100 relative group">
             <img :src="module.image" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
             <div class="absolute inset-0 bg-gradient-to-t from-black/20 text-white p-5 flex items-end">
                <span class="text-sm font-medium uppercase tracking-[0.3em] bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">Pro Tip Inside</span>
             </div>
          </div>
       </div>
    </section>

    <!-- FAQ CTA -->
    <div class="bg-parentPrimary rounded-[4rem] p-12 text-center text-white  Primary/20 relative overflow-hidden group">
       <div class="absolute -left-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-[100px] group-hover:scale-150 transition-transform duration-1000"></div>
       <div class="relative z-10 space-y-6">
          <h2 class="text-3xl font-medium tracking-tight leading-none ">Still got questions?</h2>
          <p class="text-white/80 text-sm font-bold max-w-sm mx-auto leading-relaxed">Our support team is here for you 24/7. Whether it's a refund issue or a vendor request, we've got you covered.</p>
          <div class="flex flex-wrap items-center justify-center gap-4 mt-8">
             <NuxtLink to="/support" class="bg-white text-parentPrimary px-5 py-4 rounded-2xl font-medium text-sm uppercase  hover:scale-105 active:scale-95 transition-all ">Contact Support</NuxtLink>
             <NuxtLink to="/dashboard" class="bg-parentPrimary/20 backdrop-blur-md border border-white/20 px-5 py-4 rounded-2xl font-medium text-sm uppercase  hover:bg-white/10 transition-all">Go to Dashboard</NuxtLink>
          </div>
       </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'student'
})

const mainSteps = [
  { icon: '🛒', title: 'Order Anything', desc: 'From late-night snacks to pharmacy essentials, we bring the campus to you.' },
  { icon: '🚴', title: 'Swift Dispatch', desc: 'Our student providers (Riders) navigate campus shortcuts to reach you in 20 mins or less.' },
  { icon: '💎', title: 'Level Up', desc: 'Complete quests, earn points, and climb the rankings for exclusive monthly perks.' }
]

const modules = [
  {
    icon: '🍕',
    title: 'The Vendor Market',
    content: 'Errandr partners with your favorite on-campus and near-campus vendors. Simply browse their menus, add your items to the cart, and pay via our secure student-friendly payment systems.',
    points: ['Secure Payments', 'Live Delivery Tracking', 'Faculty Milestones'],
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop',
    imageAlt: 'Ordering food on campus'
  },
  {
    icon: '📍',
    title: 'Custom Errands',
    content: "Need someone to pick up a document from the Dean's office or get your laundry? Use our 'Custom Errand' tool. Just describe the task, pin the location, and an Errandr Provider will handle the rest.",
    points: ['Variable Pricing', 'Specific Instructions', 'One-to-One Chat'],
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop',
    imageAlt: 'Custom campus errands'
  },
  {
    icon: '💰',
    title: 'Join the Network',
    content: "Want to turn your campus stroll into a paycheck? Become an Errandr Dispatcher. You choose your hours, navigate your routes, and earn money for every delivery made within your community.",
    points: ['Student Flexibility', 'Instant Payouts', 'Leaderboard Bonuses'],
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
    imageAlt: 'Working on campus'
  }
]

useHead({
  title: 'How it Works - Errandr',
  meta: [{ name: 'description', content: 'Step-by-step guide to using Errandr on campus.' }]
})
</script>
