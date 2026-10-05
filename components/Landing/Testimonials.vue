<template>
  <section class="py-24 px-4 lg:px-10 bg-white overflow-hidden">
    <div class="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
      <!-- Left side: Content -->
      <div class="space-y-8 text-center lg:text-left">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-parentPrimary/10 border border-parentPrimary/20 rounded-lg text-parentPrimary text-sm font-medium uppercase ">
           💬 Words on the Street
        </div>
        <h2 class="text-4xl md:text-6xl font-medium text-gray-900 tracking-tighter leading-none ">
          Trusted by <span class="text-parentPrimary">thousands</span> of <br/> students on campus.
        </h2>
        <p class="text-gray-500 text-lg font-bold leading-relaxed tracking-tight max-w-md mx-auto lg:mx-0">
          From late-night study sessions to lazy Sunday mornings in the hostel, we've got your back. Join the community of smart chop-ers.
        </p>
        <div class="pt-4">
          <NuxtLink to="/auth/register" class="inline-flex items-center gap-2 text-parentPrimary font-medium text-sm hover:gap-4 transition-all group">
            Speak to an Errandr <ArrowUpRight class="w-5 h-5 group-hover:rotate-45 transition-transform" />
          </NuxtLink>
        </div>
      </div>

      <!-- Right side: Staggered Dynamic Testimonials -->
      <div class="relative min-h-[450px] flex items-center justify-center lg:justify-end">
        <div class="space-y-6 w-full max-w-md">
          <div 
            v-for="(t, i) in testimonials" 
            :key="i"
            class="transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
            :class="[
              activeIndex === i 
                ? 'opacity-100 scale-100 translate-x-0 z-20 shadow-sm border border-gray-50 border-parentPrimary/20' 
                : 'opacity-40 scale-90 translate-x-12 z-10 grayscale blur-[2px] pointer-events-none'
            ]"
          >
            <div 
              class="bg-white p-5 rounded-[2.5rem] border border-gray-50 flex items-start gap-6 relative"
              :class="{ 'ring-1 ring-parentPrimary/5': activeIndex === i }"
            >
              <!-- Indicator Line (from image style) -->
              <div 
                v-if="activeIndex === i"
                class="absolute -left-12 top-1/2 -translate-y-1/2 w-8 h-[2px] bg-parentPrimary hidden lg:block"
              ></div>

              <div class="w-16 h-16 rounded-2xl bg-gray-50 flex-shrink-0 flex items-center justify-center text-3xl shadow-sm">
                {{ t.emoji }}
              </div>
              <div class="space-y-3">
                <div class="flex items-center gap-2">
                  <h4 class="font-medium text-gray-900 tracking-tight text-lg">{{ t.name }}</h4>
                  <span class="w-1 h-1 rounded-full bg-gray-300"></span>
                  <p class="text-sm font-medium text-parentPrimary uppercase ">{{ t.tag }}</p>
                </div>
                <p class="text-gray-500 font-bold text-sm leading-relaxed ">
                  "{{ t.quote }}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ArrowUpRight } from 'lucide-vue-next'

const activeIndex = ref(1)
let interval: any = null

const testimonials = [
  {
    name: "Bolaji",
    tag: "Hostel 3 Resident",
    emoji: "😴",
    quote: "Mavise's Jollof is the only reason I wake up. Now that it comes to my door, I don't even have to put on shoes. This app is dangerously convenient!"
  },
  {
    name: "Chijioke",
    tag: "Engineering Student",
    emoji: "📄",
    quote: "Iya Chidera's Egusi was calling my name but the assignment was pending. Errandr helped me bridge the gap – food reached me while I was still debuging code. Pure lifesaver!"
  },
  {
    name: "Chioma",
    tag: "Economics Major",
    emoji: "📊",
    quote: "Tasty Delight never fails, but the distance was a pain. Now with Errandr, I plan my meals weekly and save so much time. The meal planner is a budget-saver!"
  }
]

onMounted(() => {
  interval = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % testimonials.length
  }, 5000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<style scoped>
</style>
