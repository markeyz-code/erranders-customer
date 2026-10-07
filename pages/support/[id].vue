<template>
  <main class="min-h-screen pb-24 flex flex-col">
    <div class="max-w-2xl mx-auto px-0 sm:px-4 pt-6 md:pt-8 w-full flex-1 flex flex-col space-y-6">
      
      <!-- Report Header -->
      <div class="px-4 sm:px-0">
        <div class="bg-white border border-gray-50 shadow-sm p-4 sm:p-5 rounded-2xl flex flex-col gap-4">
          <div class="flex items-center gap-3">
            <button @click="$router.back()" class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center border border-gray-50 hover:bg-gray-100">
              <ArrowLeft class="w-4 h-4 text-gray-900" />
            </button>
            <div class="flex-1 min-w-0">
              <h2 class="text-gray-900 font-semibold text-sm truncate">{{ report?.title }}</h2>
              <p class="text-sm text-gray-400 capitalize mt-0.5">
                {{ report?.category?.replace(/_/g, ' ') }} • {{ report?.vendor?.storeName || 'general support' }}
              </p>
            </div>
            <span 
              :class="statusBadgeClass(report?.status)" 
              class="text-[10px] font-bold px-2 py-0.5 rounded-md border capitalize shrink-0"
            >
              {{ report?.status }}
            </span>
          </div>
          <p class="text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-50 leading-relaxed font-medium">
            {{ report?.description }}
          </p>
        </div>
      </div>

      <!-- Chat Thread with Admin -->
      <div class="flex-1 min-h-[300px] flex flex-col bg-white border-0 sm:border border-gray-50 rounded-none sm:rounded-[2rem] overflow-hidden shadow-none sm:shadow-sm">
        <div ref="threadContainer" class="flex-1 overflow-y-auto p-4 sm:p-4 space-y-4">
          <div 
            v-for="msg in report?.thread" 
            :key="msg.timestamp" 
            class="flex" 
            :class="msg.isAdmin ? 'justify-start' : 'justify-end'"
          >
            <div class="max-w-[80%] space-y-1">
              <div 
                class="rounded-2xl px-4 py-2.5 text-sm font-medium leading-relaxed" 
                :class="msg.isAdmin 
                  ? 'bg-gray-50 border border-gray-50 text-gray-900 rounded-bl-sm' 
                  : 'bg-parentPrimary text-white shadow-sm rounded-br-sm'"
              >
                <div v-if="msg.isAdmin" class="flex items-center gap-1 mb-1">
                  <span class="text-[10px] font-bold text-parentPrimary uppercase tracking-wider">Errandr Support</span>
                </div>
                <p>{{ msg.message }}</p>
              </div>
              <p 
                class="text-[10px] font-bold text-gray-400 px-1" 
                :class="msg.isAdmin ? 'text-left' : 'text-right'"
              >
                {{ new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
              </p>
            </div>
          </div>
          
          <div v-if="!report?.thread?.length" class="text-center py-16 space-y-3">
            <div class="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto text-gray-400 border border-gray-50">
              <MessageSquare class="w-5 h-5" />
            </div>
            <div>
              <p class="text-gray-900 text-sm font-bold">our support team is looking into this</p>
              <p class="text-gray-400 text-sm font-medium mt-1">An admin will review and message you shortly.</p>
            </div>
          </div>
        </div>

        <!-- Message Input -->
        <div class="p-3 bg-gray-50/50 border-t border-gray-100 flex gap-2 items-center">
          <input
            v-model="newMessage"
            type="text"
            placeholder="Type your message to support..."
            class="flex-1 bg-white rounded-xl border border-gray-50 px-4 py-3 text-base font-medium focus:outline-none focus:border-parentPrimary transition-colors"
            @keyup.enter="sendMessage"
          />
          <button 
            @click="sendMessage" 
            :disabled="!newMessage.trim() || sending" 
            class="w-10 h-10 shrink-0 bg-parentPrimary text-white rounded-xl flex items-center justify-center hover:bg-parentPrimary/90 active:scale-95 transition-all disabled:opacity-30"
          >
            <Send class="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  </main>
</template>

<script setup lang="ts">
import { ArrowLeft, MessageSquare, Send } from 'lucide-vue-next';
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, useHead } from '#imports';
import { reports_api } from '@/api_factory/modules/reports';

const route = useRoute();
const report = ref<any>(null);
const newMessage = ref('');
const sending = ref(false);
const threadContainer = ref<HTMLElement | null>(null);

const statusBadgeClass = (status: string) => {
  switch (status) {
    case 'pending': 
      return 'text-amber-500 bg-amber-50 border-amber-100';
    case 'investigating': 
      return 'text-blue-500 bg-blue-50 border-blue-100';
    case 'resolved': 
      return 'text-emerald-500 bg-emerald-50 border-emerald-100';
    case 'closed': 
    case 'dismissed': 
      return 'text-gray-500 bg-gray-50 border-gray-100';
    default: 
      return 'text-gray-500 bg-gray-50 border-gray-100';
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    if (threadContainer.value) {
      threadContainer.value.scrollTop = threadContainer.value.scrollHeight;
    }
  });
};

const sendMessage = async () => {
  if (!newMessage.value.trim() || sending.value) return;
  sending.value = true;
  try {
    const res = await reports_api.addMessage(route.params.id as string, newMessage.value.trim());
    report.value = res.data;
    newMessage.value = '';
    scrollToBottom();
  } catch (e) { 
    console.error('Failed to send message:', e); 
  } finally {
    sending.value = false;
  }
};

onMounted(async () => {
  try { 
    const res = await reports_api.getById(route.params.id as string);
    report.value = res.data;
    scrollToBottom();
  }
  catch (e) { 
    console.error('Failed to load support thread:', e); 
  }
});

useHead({ title: 'Report Detail - Errandr' });
</script>

<style scoped>
/* Scoped styles */
</style>
