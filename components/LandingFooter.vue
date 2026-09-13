<template>
  <footer class="relative bg-white overflow-hidden pt-24 border-t border-slate-100">
    <!-- Background geometric decor -->
    <div class="absolute top-0 right-0 w-[800px] h-[800px] bg-parentPrimary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 lg:px-10 relative z-10">
      
      <!-- Big Bold CTA inside Footer -->
      <div class="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div class="min-h-[160px]">
          <h2 class="text-6xl md:text-8xl font-medium text-slate-900 tracking-tighter leading-[0.9]">
            {{ dynamicHeading }}<span class="text-slate-800">?</span><span class="animate-pulse text-parentPrimary font-light ml-1">|</span> <br/> <span class="text-parentPrimary">Let's fix that.</span>
          </h2>
        </div>
        <NuxtLink to="/vendors" class="inline-flex flex justify-center items-center items-center gap-4 px-10 py-3 bg-parentPrimary text-white rounded-full font-medium text-lg shadow-[0_20px_50px_rgba(255,92,26,0.3)] hover:scale-105 transition-transform group">
          Get Started
          <ArrowUpRight class="w-6 h-6 group-hover:rotate-45 transition-transform duration-300" />
        </NuxtLink>
      </div>

      <!-- Main Footer Grid -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 mb-16">
        
        <!-- Left: Branding & Info -->
        <div class="md:col-span-5 space-y-8">
          <NuxtLink to="/" class="block group">
            <img src="@/assets/img/erranders.png" alt="Errander Logo" class="h-12 w-auto object-contain transition-transform duration-500 group-hover:scale-105" />
          </NuxtLink>
          <p class="text-slate-500 text-lg leading-relaxed font-medium max-w-md">
            The premium lifestyle, logistics, and delivery network built exclusively for the modern student community. Fast, reliable, and perfectly tailored to your campus life.
          </p>
          <div class="flex items-center gap-4 pt-4">
            <a href="#" class="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-white hover:bg-parentPrimary hover:border-parentPrimary hover:scale-110 transition-all shadow-sm">
              <Twitter class="w-5 h-5"/>
            </a>
            <a href="#" class="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-white hover:bg-parentPrimary hover:border-parentPrimary hover:scale-110 transition-all shadow-sm">
              <Instagram class="w-5 h-5"/>
            </a>
            <a href="#" class="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-white hover:bg-parentPrimary hover:border-parentPrimary hover:scale-110 transition-all shadow-sm">
              <Facebook class="w-5 h-5"/>
            </a>
          </div>
        </div>

        <!-- Right: Links Grid -->
        <div class="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div class="space-y-6">
            <h4 class="font-medium text-slate-900 tracking-tight text-lg">Platform</h4>
            <ul class="space-y-4">
              <li><NuxtLink to="/" class="text-slate-500 font-medium hover:text-parentPrimary hover:translate-x-1 inline-block transition-all">Home</NuxtLink></li>
              <li><NuxtLink to="/about" class="text-slate-500 font-medium hover:text-parentPrimary hover:translate-x-1 inline-block transition-all">About Us</NuxtLink></li>
              <li><NuxtLink to="/contact" class="text-slate-500 font-medium hover:text-parentPrimary hover:translate-x-1 inline-block transition-all">Contact Support</NuxtLink></li>
            </ul>
          </div>

          <div class="space-y-6">
            <h4 class="font-medium text-slate-900 tracking-tight text-lg">Legal</h4>
            <ul class="space-y-4">
              <li><NuxtLink to="/terms" class="text-slate-500 font-medium hover:text-parentPrimary hover:translate-x-1 inline-block transition-all">Terms of Service</NuxtLink></li>
              <li><NuxtLink to="/privacy" class="text-slate-500 font-medium hover:text-parentPrimary hover:translate-x-1 inline-block transition-all">Privacy Policy</NuxtLink></li>
              <li><NuxtLink to="/refund" class="text-slate-500 font-medium hover:text-parentPrimary hover:translate-x-1 inline-block transition-all">Refund Policy</NuxtLink></li>
              <li><NuxtLink to="/faq" class="text-slate-500 font-medium hover:text-parentPrimary hover:translate-x-1 inline-block transition-all">FAQ</NuxtLink></li>
            </ul>
          </div>

          <div class="space-y-6">
            <h4 class="font-medium text-slate-900 tracking-tight text-lg">Partners</h4>
            <ul class="space-y-4">
              <li>
                <a href="http://vendor.erranders.org" class="group flex items-center gap-2 text-slate-500 font-medium hover:text-parentPrimary transition-colors">
                  <div class="w-8 h-8 rounded-lg bg-parentPrimary/10 flex items-center justify-center text-parentPrimary group-hover:scale-110 transition-transform">
                    <Store class="w-4 h-4" />
                  </div>
                  Become a Vendor
                </a>
              </li>
              <li>
                <a href="http://dispatch.erranders.org" class="group flex items-center gap-2 text-slate-500 font-medium hover:text-parentPrimary transition-colors">
                  <div class="w-8 h-8 rounded-lg bg-parentPrimary/10 flex items-center justify-center text-parentPrimary group-hover:scale-110 transition-transform">
                    <Bike class="w-4 h-4" />
                  </div>
                  Become a Rider
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="py-5 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <p class="text-slate-400 font-bold tracking-tight">
          &copy; {{ new Date().getFullYear() }} Errander Inc. Delivering happiness.
        </p>
        <div class="flex items-center gap-6">
          <a href="https://www.instagram.com/erranders.official1/">
            <img src="@/assets/img/instagram.jpeg" class="h-6 object-contain rounded-lg transition-all cursor-pointer"/>
          </a>
          <!-- <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1200px-Mastercard-logo.svg.png" class="h-6 object-contain grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer"/> -->
        </div>
      </div>
      
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Twitter, Instagram, Facebook, Store, Bike, ArrowUpRight } from 'lucide-vue-next'

// Easily configure these phrases to showcase what Erranders stands for!
const headings = [
  "Hungry",
  "Ready",
  "Need Groceries", 
  "Out of Cash", 
  "Running Late", 
  "Need a Ride",
  "Got Errands",
  "Craving Snacks"
]

const dynamicHeading = ref('')
let headingIndex = 0

const typeHeading = async () => {
  while (true) {
    const currentWord = headings[headingIndex]
    
    // Type word
    for (let i = 0; i <= currentWord.length; i++) {
      dynamicHeading.value = currentWord.substring(0, i)
      await new Promise(r => setTimeout(r, 80))
    }
    
    // Pause at end
    await new Promise(r => setTimeout(r, 2000))
    
    // Delete word
    for (let i = currentWord.length; i >= 0; i--) {
      dynamicHeading.value = currentWord.substring(0, i)
      await new Promise(r => setTimeout(r, 40))
    }
    
    // Next word
    headingIndex = (headingIndex + 1) % headings.length
    await new Promise(r => setTimeout(r, 500))
  }
}

onMounted(() => {
  // Start the heading typewriter
  typeHeading()
})
</script>
