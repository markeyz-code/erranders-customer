<template>
  <div class="min-h-screen bg-white font-sans text-gray-900 scroll-smooth">
    <!-- Navbar -->
    <LandingNavbar />

    <!-- Hero Section -->
    <section class="relative pt-40 pb-20 overflow-hidden bg-gray-50/20">
      <div class="absolute inset-0 z-0 pointer-events-none">
        <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-parentPrimary/5 rounded-full blur-[120px] translate-x-1/8"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-10 relative z-10 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-gray-50 text-sm font-medium tracking-[0.2em] uppercase text-gray-400 mb-8 shadow-sm">
          <HelpCircle class="w-3.5 h-3.5 text-parentPrimary" />
          Common Inquiries
        </div>
        <h1 class="text-5xl md:text-7xl font-medium tracking-tighter leading-[0.9] text-gray-900 mb-6 max-w-4xl mx-auto">
          Answers for the <br />
          <span class="text-parentPrimary  bg-parentPrimary/5 px-4 rounded-3xl">curious mind.</span>
        </h1>
        <p class="text-xl text-gray-500 font-bold max-w-2xl mx-auto leading-relaxed tracking-tight">
          Everything you need to know about the Errandr ecosystem, from ordering your first meal to becoming a campus dispatcher.
        </p>
      </div>
    </section>

    <!-- FAQ Accordions -->
    <section class="py-24 bg-white">
      <div class="max-w-4xl mx-auto px-4 sm:px-10">
        <div class="space-y-4">
          <div v-for="(faq, i) in faqs" :key="i" 
               class="group border border-gray-50 rounded-[2rem] overflow-hidden hover:border-parentPrimary/30 transition-all duration-500 shadow-sm hover:shadow-sm border border-gray-50"
               :class="{ 'bg-gray-50/50 border-parentPrimary/20': openIndex === i }">
            <button @click="openIndex = openIndex === i ? -1 : i" 
                    class="w-full flex items-center justify-between p-5 text-left group">
              <span class="text-xl font-medium text-gray-900 tracking-tight transition-colors" :class="{ 'text-parentPrimary': openIndex === i }">
                {{ faq.q }}
              </span>
              <div class="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-parentPrimary/10 group-hover:text-parentPrimary transition-all duration-500"
                   :class="{ 'rotate-180 bg-parentPrimary text-white group-hover:bg-parentPrimary group-hover:text-white': openIndex === i }">
                <ChevronDown class="w-5 h-5" />
              </div>
            </button>
            <transition name="expand">
              <div v-if="openIndex === i" class="px-5 pb-8 text-lg text-gray-500 font-bold leading-relaxed tracking-tight border-t border-gray-100 pt-6 animate-fade-in">
                {{ faq.a }}
              </div>
            </transition>
          </div>
        </div>

        <div class="mt-20 bg-gray-900 overflow-hidden relative p-12 md:p-16 rounded-[4rem] text-center shadow-sm border border-gray-50 group">
          <div class="absolute inset-0 bg-parentPrimary opacity-0 group-hover:opacity-10 transition-opacity duration-1000"></div>
          <div class="relative z-10 space-y-6">
            <h3 class="text-3xl font-medium text-white tracking-tight">Still seeking clarity?</h3>
            <p class="text-gray-400 font-bold max-w-md mx-auto">Our support team is active Mon–Sat, 8AM–9PM. We're always a message away.</p>
            <div class="pt-4">
              <NuxtLink to="/contact" class="inline-flex items-center gap-4 px-10 py-5 bg-white text-gray-900 rounded-[2rem] font-medium text-sm uppercase  shadow-sm border border-gray-50 hover:bg-parentPrimary hover:text-white transition-all group">
                Contact Support
                <ArrowRight class="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <LandingFooter class="mt-20" />
  </div>
</template>

<script setup lang="ts">
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-vue-next'
import { ref } from 'vue'

definePageMeta({ layout: false })
useHead({ 
  title: 'FAQ - Errandr Support',
  meta: [{ name: 'description', content: 'Answers to frequently asked questions about Errandr campus delivery.' }] 
})

const openIndex = ref(0)
const faqs = [
  { q: 'How does Errandr work?', a: 'Browse menus from campus restaurants and vendors, add items to your cart, and place an order. A nearby student rider picks up your food and delivers it directly to your location on campus — hostel, library, or lecture hall.' },
  { q: 'Is Errandr available on my campus?', a: 'We are currently live at CMUL (College of Medicine, UNILAG), and expanding to other campuses. We focus on hyper-local logistics to ensure the fastest delivery within school environs.' },
  { q: 'How much does delivery cost?', a: 'Delivery fees are set by each vendor and typically range from ₦100 to ₦500 depending on distance within campus. We optimize for high-yield, low-cost deliveries.' },
  { q: 'How do I pay for my order?', a: 'We support bank transfers, card payments via Paystack, and your Errandr wallet balance. You can top up your wallet at any time for faster checkouts.' },
  { q: 'How long does delivery take?', a: 'Since all deliveries are within campus, most orders arrive within 15–30 minutes. Estimated delivery time is shown before you place your order.' },
  { q: 'Can I track my order in real-time?', a: 'Yes! Once a rider accepts your order, you can track their status live. During batch windows, orders are optimized for group efficiency.' },
  { q: 'What if there is a problem with my order?', a: 'You can report any issue directly from your order history page. Our support team reviews complaints within 1 hour during operating hours.' },
  { q: 'Can I become an Errandr dispatcher?', a: 'Absolutely! Our walk-to-earn model allows any student to earn while they commute. Just register on the Dispatch app to get started.' }
]
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>

