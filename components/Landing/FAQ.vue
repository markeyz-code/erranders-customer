<template>
  <section id="faq" class="py-24 px-4 lg:px-10 bg-gray-50/30 overflow-hidden">
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
      <!-- Left side: content -->
      <div class="space-y-8 text-center lg:text-left">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-parentPrimary/10 border border-parentPrimary/20 rounded-lg text-parentPrimary text-sm font-medium uppercase ">
           🤔 Got Questions?
        </div>
        <h2 class="text-4xl md:text-6xl font-medium text-gray-900 tracking-tighter leading-none ">
          Clear answers to <br/> <span class="text-parentPrimary">common questions</span> <br/> about the Hub.
        </h2>
        <div class="pt-4">
          <NuxtLink to="/contact" class="inline-flex items-center gap-2 text-parentPrimary font-medium text-sm hover:gap-4 transition-all group">
            Speak to an Errandr <ArrowUpRight class="w-5 h-5 group-hover:rotate-45 transition-transform" />
          </NuxtLink>
        </div>
      </div>

      <!-- Right side: Accordion -->
      <div class="space-y-4">
        <div 
          v-for="(faq, i) in faqs" 
          :key="i"
          class="group bg-white rounded-[2rem] border border-gray-50 overflow-hidden transition-all duration-500 hover:shadow-sm border border-gray-50 hover:border-parentPrimary/20"
          :class="{ 'ring-1 ring-parentPrimary/10 shadow-sm border border-gray-50': openIndex === i }"
        >
          <button 
            @click="openIndex = openIndex === i ? -1 : i"
            class="w-full flex items-center justify-between p-5 text-left"
          >
            <span 
              class="text-lg font-medium text-gray-900 tracking-tight transition-colors"
              :class="{ 'text-parentPrimary': openIndex === i }"
            >
              {{ faq.q }}
            </span>
            <div 
              class="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500"
              :class="openIndex === i ? 'bg-parentPrimary text-white rotate-180' : 'bg-gray-50 text-gray-400 group-hover:bg-parentPrimary/10 group-hover:text-parentPrimary'"
            >
              <Minus v-if="openIndex === i" class="w-5 h-5" />
              <Plus v-else class="w-5 h-5" />
            </div>
          </button>
          
          <div 
            v-show="openIndex === i"
            class="px-5 pb-8 text-gray-500 font-bold text-sm leading-relaxed tracking-tight animate-fade-in"
          >
            {{ faq.a }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Minus, ArrowUpRight } from 'lucide-vue-next'

const openIndex = ref(0)

const faqs = [
  { 
    q: 'How does Errandr work?', 
    a: 'Find your fav school spots and see what is cooking. We plug you to Mavise, Iya Chidera and more. A student Errander handles your run, dropping it off sharp-sharp at your hostel door.' 
  },
  { 
    q: 'How do I pay for my chop?', 
    a: 'We support bank transfers, card payments via Paystack, and your Errandr wallet. You can top up your wallet any time for faster checkout when hunger kicks in.' 
  },
  { 
    q: 'Can I be a dispatcher even if I don\'t have a bike?', 
    a: 'Yes! Our "Walk-to-Earn" model is built for students who can handle short-distance hostel runs between their lectures. You just need the Dispatch app and good vibes.' 
  },
  { 
    q: 'How long does delivery take?', 
    a: 'Since all deliveries are within the campus and its immediate environs, most orders arrive within 15–30 minutes. We focus on speed so your food doesn\'t get cold.' 
  },
  { 
    q: 'What if there\'s Sapa? Are there deals?', 
    a: 'Absolutely. Check the "Sapa Friendly" tag for meals under ₦1,500 and look out for "Awoof" promos from your favorite vendors.' 
  }
]
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
