<template>
  <div v-if="campaigns.length > 0" class="fixed bottom-0 left-0 right-0 z-[100] flex flex-col shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
    <div v-for="pool in campaigns" :key="pool.campaign._id" class="bg-gradient-to-r from-[#FF5C1A] to-[#E54D12] text-white border-t border-[#D8450F] overflow-hidden relative">
    <div class="max-w-7xl mx-auto px-4 py-2 sm:py-2.5 flex flex-col md:flex-row items-center gap-3">
      
      <!-- CTA Section -->
      <div class="flex-shrink-0 flex items-center gap-3 w-full md:w-auto justify-center md:justify-start">
        <div class="bg-white/20 p-1.5 rounded-full animate-pulse">
          <ShoppingCart class="w-4 h-4 text-white" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h3 class="font-black text-sm sm:text-base tracking-tight leading-none uppercase text-[#FFE066] drop-shadow-sm">
              {{ pool.campaign.title }}
            </h3>
            <button @click="showInfoModal = true" class="p-1 bg-white/20 hover:bg-white/30 rounded-full transition-colors" title="Learn More">
              <Info class="w-3 h-3 text-white" />
            </button>
          </div>
          <p class="text-[9px] sm:text-[10px] font-bold text-white/90 mt-0.5 uppercase ">
            Don't buy retail. Buy Bulk & Save 40%
          </p>
        </div>
      </div>

      <!-- Carousel Section -->
      <div class="flex-1 overflow-hidden w-full relative group hidden sm:block h-[45px]">
        <!-- Mask for smooth fade edges -->
        <div class="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#FF5C1A] to-transparent z-10"></div>
        <div class="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#E54D12] to-transparent z-10"></div>
        
        <div class="flex items-center gap-2.5 animate-carousel hover:[animation-play-state:paused] min-w-max absolute top-1/2 -translate-y-1/2">
          <!-- Render items twice for seamless loop -->
          <div v-for="item in [...pool.items, ...pool.items]" :key="Math.random().toString()" class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-1.5 flex items-center gap-2 hover:bg-white/20 transition-all cursor-pointer">
            <div class="w-7 h-7 rounded-md bg-white/20 flex items-center justify-center text-sm shadow-inner shrink-0">
              {{ getEmoji(item.name) }}
            </div>
            <div class="flex flex-col pr-1">
              <span class="text-sm font-bold truncate max-w-[100px] leading-tight">{{ item.name }}</span>
              <div class="flex items-center gap-1.5">
                <span class="text-[10px] font-black text-[#FFE066]">₦{{ item.appPrice.toLocaleString() }}</span>
                <span class="text-[9px] text-white/60 line-through">₦{{ (item.appPrice * 1.3).toLocaleString() }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Button -->
      <button @click="navigateToPool(pool.campaign._id)" class="flex-shrink-0 w-full md:w-auto bg-white text-[#FF5C1A] font-extrabold px-4 py-2 md:py-1.5 rounded-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-1.5 uppercase tracking-wide text-[10px]">
        Join the Pool <ArrowRight class="w-3.5 h-3.5" />
      </button>

    </div>

    </div>
    
    <!-- Info Modal -->
    <Teleport to="body">
      <div v-if="showInfoModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center sm:p-6 animate-fade-in" @click="showInfoModal = false">
        <div class="bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:rounded-3xl sm:max-w-lg shadow-2xl overflow-hidden relative flex flex-col" @click.stop>
          <div class="bg-gradient-to-r from-[#FF5C1A] to-[#E54D12] px-6 py-8 text-center text-white relative shrink-0">
            <button @click="showInfoModal = false" class="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors">
              <X class="w-5 h-5" />
            </button>
            <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-12 shadow-inner">
              <ShoppingCart class="w-8 h-8 text-white" />
            </div>
            <h2 class="text-2xl font-black tracking-tight text-[#FFE066]">Wholesale Market Pool</h2>
            <p class="text-sm font-bold text-white/90 mt-2">Why pay retail when you can pay wholesale?</p>
          </div>
          
          <div class="p-6 overflow-y-auto space-y-6 flex-1">
            <div class="flex gap-4 items-start">
              <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                <Users class="w-5 h-5 text-[#FF5C1A]" />
              </div>
              <div>
                <h4 class="font-bold text-gray-900 text-lg">Group Buying Power</h4>
                <p class="text-gray-600 text-sm mt-1">We aggregate orders from hundreds of students across campus to unlock massive wholesale discounts directly from major distributors.</p>
              </div>
            </div>
            
            <div class="flex gap-4 items-start">
              <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                <TrendingDown class="w-5 h-5 text-[#FF5C1A]" />
              </div>
              <div>
                <h4 class="font-bold text-gray-900 text-lg">Save Up to 40%</h4>
                <p class="text-gray-600 text-sm mt-1">Because we cut out the middleman and buy in extreme bulk, you pay significantly less for your everyday staples like Rice, Beans, Garri, and Noodles.</p>
              </div>
            </div>
            
            <div class="flex gap-4 items-start">
              <div class="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                <CalendarCheck class="w-5 h-5 text-[#FF5C1A]" />
              </div>
              <div>
                <h4 class="font-bold text-gray-900 text-lg">Weekly Delivery</h4>
                <p class="text-gray-600 text-sm mt-1">Place your order during the active campaign window. Once the pool closes, we fulfill the entire batch and deliver it straight to your hostel.</p>
              </div>
            </div>
          </div>
          
          <div class="p-4 sm:p-6 bg-gray-50 border-t border-gray-100 shrink-0 mb-4 sm:mb-0">
            <button @click="showInfoModal = false" class="w-full flex items-center justify-center gap-2 bg-[#FF5C1A] text-white py-3.5 rounded-xl font-bold tracking-wide hover:bg-[#E54D12] active:scale-95 transition-all shadow-lg shadow-orange-500/30">
              Close <ArrowRight class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ShoppingCart, ArrowRight, Info, X, Users, TrendingDown, CalendarCheck } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'

const router = useRouter()
const campaigns = ref([])
const showInfoModal = ref(false)

const navigateToPool = (id) => {
  showInfoModal.value = false
  router.push(`/market-pool?campaignId=${id}`)
}

const getEmoji = (name) => {
  const n = name.toLowerCase()
  if (n.includes('rice')) return '🍚'
  if (n.includes('bean')) return '🫘'
  if (n.includes('egg')) return '🥚'
  if (n.includes('garri')) return '🥣'
  if (n.includes('indomie') || n.includes('noodle')) return '🍜'
  return '📦'
}

onMounted(async () => {
  try {
    const res = await api.get('/market-pool/active-campaigns')
    if (res.data && Array.isArray(res.data)) {
      campaigns.value = res.data
    }
  } catch (e) {
    console.error(e)
  }
})
</script>

<style scoped>
@keyframes carousel {
  0% { transform: translate(0, -50%); }
  100% { transform: translate(-50%, -50%); }
}
.animate-carousel {
  animation: carousel 25s linear infinite;
}
</style>
