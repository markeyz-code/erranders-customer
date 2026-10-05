<template>
  <section id="contact" class="py-24 px-4 lg:px-10 bg-white relative overflow-hidden">
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-parentPrimary/[0.03] rounded-full blur-[120px] pointer-events-none"></div>

    <div class="max-w-4xl mx-auto relative z-10">
      <div class="text-center space-y-6 mb-16">
        <div class="inline-flex items-center gap-2 px-3 py-1 bg-parentPrimary/10 border border-parentPrimary/20 rounded-lg text-parentPrimary text-sm font-medium uppercase ">
           ✉️ Direct Connect
        </div>
        <h2 class="text-4xl md:text-6xl font-medium text-gray-900 tracking-tighter leading-[0.9] ">
          Tell us what's on your <span class="text-parentPrimary">mind</span> <br/> and how we can reach you.
        </h2>
        <p class="text-gray-400 font-bold  uppercase text-sm">Reach out for partnerships, complaints, or just to say hi!</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="space-y-2">
            <input 
              v-model="form.firstName"
              type="text" 
              placeholder="First Name" 
              required
              class="w-full px-5 py-5 bg-gray-50 border border-gray-50 rounded-[1.5rem] text-base font-bold text-gray-900 focus:bg-white focus:border-parentPrimary transition-all outline-none"
            />
          </div>
          <div class="space-y-2">
            <input 
              v-model="form.lastName"
              type="text" 
              placeholder="Last Name" 
              required
              class="w-full px-5 py-5 bg-gray-50 border border-gray-50 rounded-[1.5rem] text-base font-bold text-gray-900 focus:bg-white focus:border-parentPrimary transition-all outline-none"
            />
          </div>
        </div>

        <div class="relative group">
          <select 
            v-model="form.inquiryType"
            required
            class="w-full px-5 py-5 bg-gray-50 border border-gray-50 rounded-[1.5rem] text-base font-bold text-gray-900 focus:bg-white focus:border-parentPrimary transition-all outline-none appearance-none cursor-pointer"
          >
            <option value="" disabled selected>Select Inquiry Type</option>
            <option value="vendor">Become a Vendor</option>
            <option value="errandr">Become an Errandr</option>
            <option value="support">Order Support</option>
            <option value="partner">Partnership / Campus Launch</option>
            <option value="other">Other Inquiry</option>
          </select>
          <div class="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-parentPrimary transition-colors">
            <ChevronDown class="w-5 h-5" />
          </div>
        </div>

        <div class="relative group">
          <select 
            v-model="form.contactMethod"
            required
            class="w-full px-5 py-5 bg-gray-50 border border-gray-50 rounded-[1.5rem] text-base font-bold text-gray-900 focus:bg-white focus:border-parentPrimary transition-all outline-none appearance-none cursor-pointer"
          >
            <option value="" disabled selected>Choose Preferred Contact Method</option>
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="phone">Phone Call</option>
          </select>
          <div class="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-parentPrimary transition-colors">
            <ChevronDown class="w-5 h-5" />
          </div>
        </div>

        <div class="space-y-2">
          <textarea 
            v-model="form.note"
            placeholder="Add a Note (How can we help?)" 
            rows="5"
            required
            class="w-full px-5 py-4 bg-gray-50 border border-gray-50 rounded-[2rem] text-base font-bold text-gray-900 focus:bg-white focus:border-parentPrimary transition-all outline-none resize-none"
          ></textarea>
        </div>

        <div class="pt-6">
          <button 
            type="submit"
            :disabled="loading"
            class="px-10 py-5 bg-gray-900 text-white rounded-[2rem] font-medium text-sm uppercase tracking-[0.2em] shadow-sm border border-gray-50 hover:bg-parentPrimary hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex items-center gap-3 mx-auto lg:mx-0"
          >
            <span v-if="loading">Sending...</span>
            <span v-else>Send Request</span>
            <Send class="w-4 h-4" />
          </button>
        </div>
      </form>

      <div v-if="success" class="mt-8 p-4 bg-emerald-50 border border-emerald-100 rounded-[2rem] text-center text-emerald-600 font-medium animate-fade-in">
        ✨ Sent sharp-sharp! We'll hit you up on email soon.
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ChevronDown, Send } from 'lucide-vue-next'

const loading = ref(false)
const success = ref(false)
const form = reactive({
  firstName: '',
  lastName: '',
  inquiryType: '',
  contactMethod: '',
  note: ''
})

const handleSubmit = async () => {
  loading.value = true
  // Mock sending logic - integrating with EmailJS would happen here if configured
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    success.value = true
    Object.keys(form).forEach(key => form[key] = '')
    setTimeout(() => success.value = false, 5000)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
