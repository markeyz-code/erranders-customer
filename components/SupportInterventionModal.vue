<template>
  <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
    <div class="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
      <!-- Header -->
      <div class="bg-[#FF5C1A]/5 p-6 text-center border-b border-[#FF5C1A]/10">
        <button v-if="mode !== 'cancel-intercept'" @click="$emit('update:show', false)" class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white rounded-full text-gray-400 hover:text-gray-900 shadow-sm transition-colors border border-gray-50 z-10">
          <X class="w-4 h-4" />
        </button>
        <div class="w-16 h-16 bg-[#FF5C1A] text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#FF5C1A]/30">
          <Headset class="w-8 h-8" />
        </div>
        <h3 class="text-xl font-black text-gray-900 tracking-tight mb-2">
          {{ mode === 'cancel-intercept' ? 'Wait! Let us fix this 🚀' : mode === 'delayed-proactive' ? 'Experiencing Delays?' : 'Priority Support' }}
        </h3>
        <p class="text-sm text-gray-600 font-medium leading-relaxed max-w-[280px] mx-auto">
          {{ mode === 'cancel-intercept' ? 'Before you cancel, our support team can escalate your order immediately. Chat with us now!' : mode === 'delayed-proactive' ? 'Your order is taking longer than usual. Let us intervene for you right now.' : 'Need help with your order? Our support team is online 24/7.' }}
        </p>
      </div>

      <!-- Content -->
      <div class="p-5 space-y-3 bg-white">
        <a v-for="contact in contacts" :key="contact.name" :href="getWhatsAppLink(contact.phone)" target="_blank" class="flex items-center gap-4 w-full p-4 rounded-[1rem] border border-gray-50 bg-gray-50 hover:bg-[#25D366]/5 hover:border-[#25D366]/20 transition-all group cursor-pointer shadow-sm">
          <div class="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#25D366] group-hover:scale-110 group-hover:bg-[#25D366] group-hover:text-white transition-all">
             <MessageCircle class="w-5 h-5" />
          </div>
          <div class="flex-1 text-left">
            <p class="text-sm font-bold text-gray-900">Chat with {{ contact.name }}</p>
            <p class="text-[11px] text-gray-500 mt-0.5 font-medium uppercase tracking-wide">Typically replies instantly</p>
          </div>
          <ChevronRight class="w-5 h-5 text-gray-400 group-hover:text-[#25D366] transition-colors" />
        </a>
      </div>

      <!-- Footer for Cancel Intercept -->
      <div v-if="mode === 'cancel-intercept'" class="p-4 bg-gray-50 text-center border-t border-gray-100">
        <button @click="$emit('confirmCancel')" class="text-sm font-bold text-gray-400 hover:text-red-500 transition-colors py-2 px-4 rounded-lg hover:bg-red-50 w-full">
          No thanks, I still want to cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { X, Headset, MessageCircle, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  show: Boolean,
  orderId: String,
  mode: {
    type: String,
    default: 'standard' // 'standard', 'cancel-intercept', 'delayed-proactive'
  }
})

const emit = defineEmits(['update:show', 'confirmCancel'])

const contacts = [
  { name: 'Goodness', phone: '2348052854256' },
  { name: 'Ruth', phone: '2348139908262' },
  { name: 'Marquis', phone: '2348147626503' }
]

const getWhatsAppLink = (phone) => {
  const text = `Hi, I need urgent help with my order ${props.orderId ? '#' + props.orderId.slice(-6).toUpperCase() : ''}. Can you please assist me?`
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}
</script>
