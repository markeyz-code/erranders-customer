<template>
  <div v-if="isOpen" class="fixed inset-0 z-[200] flex justify-end font-sans">
    <!-- Backdrop -->
    <div @click="$emit('close')" class="absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity animate-fade-in"></div>
    
    <!-- Chat Panel -->
    <div class="relative w-full max-w-md bg-[#E5DDD5] h-full flex flex-col animate-slide-left overflow-hidden min-h-0">
      <!-- Header -->
      <div class="px-4 py-3 bg-[#075E54] text-white flex items-center gap-3 sticky top-0 z-20 shadow-sm flex-shrink-0">
        <button @click="$emit('close')" class="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
          <ArrowLeft class="w-5 h-5 text-white" />
        </button>
        <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold overflow-hidden border border-white/10">
          <img v-if="vendorAvatar" :src="vendorAvatar" class="w-full h-full object-cover" />
          <span v-else class="text-white">{{ vendorInitials }}</span>
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-base font-bold truncate leading-tight">{{ vendorName }}</h3>
          <p class="text-[11px] text-white/70 font-medium truncate">
            <span v-if="serviceName" class="text-emerald-100">Enquiry: {{ serviceName }}</span>
            <span v-else-if="isTyping" class="text-emerald-300 ">typing...</span>
            <span v-else>Vendor • Tap here for info</span>
          </p>
        </div>
      </div>

      <!-- Messages Area -->
      <div 
        class="flex-1 overflow-y-auto p-4 space-y-2" 
        style="background-color: #ECE5DD; background-image: url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22%3E%3Ccircle cx=%2210%22 cy=%2210%22 r=%221%22 fill=%22%23d4cfc6%22 fill-opacity=%220.2%22/%3E%3C/svg%3E'); background-repeat: repeat;"
        ref="messagesContainer"
      >
        <div v-if="loading" class="flex justify-center py-5">
          <Loader2 class="w-8 h-8 text-gray-400 animate-spin" />
        </div>
        
        <template v-else-if="messages.length > 0">
          <!-- Date chip -->
          <div class="flex justify-center mb-3">
            <span class="px-3 py-1 bg-white/80 rounded-lg text-[11px] font-medium text-gray-500 shadow-sm">Today</span>
          </div>

          <div 
            v-for="msg in messages" 
            :key="msg._id"
            class="flex flex-col max-w-[85%] animate-msg-in"
            :class="isMe(msg) ? 'ml-auto items-end' : 'mr-auto items-start'"
          >
            <div 
              class="px-3 py-2 rounded-lg text-[14px] shadow-[0_1px_0.5px_rgba(0,0,0,0.13)] relative leading-relaxed"
              :class="isMe(msg) 
                ? 'bg-[#dcf8c6] text-[#303030] rounded-tr-none' 
                : 'bg-white text-[#303030] rounded-tl-none'"
            >
              <div class="break-words pr-14">{{ msg.message || msg.content }}</div>
              <span class="text-[10px] text-gray-500 absolute bottom-1 right-2 flex items-center gap-1">
                {{ formatTime(msg.createdAt) }}
                <CheckCheck v-if="isMe(msg)" class="w-3.5 h-3.5" :class="msg.isRead ? 'text-[#34B7F1]' : 'text-gray-400'" />
              </span>
            </div>
          </div>
        </template>

        <!-- Empty state -->
        <div v-else class="h-full flex flex-col items-center justify-center text-gray-500 space-y-3">
          <div class="bg-white/60 p-4 rounded-xl shadow-sm backdrop-blur-sm text-center">
            <MessageSquare class="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p class="text-sm font-medium">Send a message to {{ vendorName }}</p>
            <p class="text-sm text-gray-400 mt-1">They'll receive it instantly.</p>
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <div class="px-2 py-2 bg-[#f0f0f0] flex items-end gap-2 border-t border-gray-200 flex-shrink-0">
        <div class="flex-1 bg-white rounded-3xl flex items-end shadow-sm">
          <textarea
            v-model="newMessage"
            rows="1"
            placeholder="Type a message"
            class="w-full bg-transparent border-0 px-4 py-3 text-[15px] focus:outline-none resize-none max-h-32 text-gray-800 placeholder-gray-500"
            @keydown.enter.exact.prevent="submitMessage"
            ref="inputRef"
            @input="adjustHeight"
          ></textarea>
        </div>
        <button 
          @click.prevent="submitMessage"
          :disabled="!newMessage.trim() || sending"
          class="w-12 h-12 bg-[#00a884] text-white rounded-full flex items-center justify-center flex-shrink-0 hover:bg-[#008f6f] disabled:opacity-50 transition-colors shadow-sm active:scale-95"
        >
          <Send class="w-5 h-5 ml-0.5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted, computed } from 'vue';
import { ArrowLeft, Send, Loader2, MessageSquare, CheckCheck } from 'lucide-vue-next';
import { useDirectChat } from '@/composables/useDirectChat';
import { useUser } from '@/composables/modules/auth/user';

const props = defineProps<{
  isOpen: boolean;
  vendorOwnerId: string;
  vendorName: string;
  vendorAvatar?: string;
  prefillMessage?: string;
  serviceId?: string;
  serviceName?: string;
}>();

const emit = defineEmits(['close']);

const { user } = useUser();
const currentUserId = computed(() => user.value?._id || '');

const newMessage = ref('');
const sending = ref(false);
const loading = ref(false);
const inputRef = ref<HTMLTextAreaElement | null>(null);
const messagesContainer = ref<HTMLElement | null>(null);

let chatTracker: any = null;
const messages = ref<any[]>([]);
const isTyping = ref(false);

const vendorInitials = computed(() => {
  if (!props.vendorName) return 'V';
  const parts = props.vendorName.trim().split(' ');
  return (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
});

const isMe = (msg: any) => {
  const senderId = msg.senderId || msg.sender?._id || msg.sender;
  return String(senderId) === String(currentUserId.value);
};

const formatTime = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const adjustHeight = () => {
  const el = inputRef.value;
  if (el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 128) + 'px';
  }
};

const submitMessage = async () => {
  if (!newMessage.value.trim() || !chatTracker) return;
  sending.value = true;

  const text = newMessage.value.trim();

  chatTracker.sendMessage(text);
  newMessage.value = '';
  sending.value = false;

  if (inputRef.value) {
    inputRef.value.style.height = 'auto';
  }
  
  scrollToBottom();
};

const initChat = async () => {
  if (!currentUserId.value || !props.vendorOwnerId) return;
  
  loading.value = true;
  chatTracker = useDirectChat(currentUserId.value, props.vendorOwnerId, props.serviceId);
  chatTracker.setupListeners();
  
  await chatTracker.fetchMessages();
  messages.value = chatTracker.messages.value;
  loading.value = false;

  // Prefill if provided
  if (props.prefillMessage) {
    newMessage.value = props.prefillMessage;
    adjustHeight();
  }

  scrollToBottom();
  
  // Focus input
  await nextTick();
  inputRef.value?.focus();
};

// Watch for external messages arriving
watch(() => chatTracker?.messages?.value, (newVal) => {
  if (newVal) {
    messages.value = newVal;
    scrollToBottom();
  }
}, { deep: true });

watch(() => chatTracker?.isTyping?.value, (val) => {
  isTyping.value = !!val;
});

watch(() => messages.value.length, () => {
  scrollToBottom();
});

// Init when opened
watch(() => props.isOpen, async (val) => {
  if (val) {
    await initChat();
  }
}, { immediate: true });
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.2s ease-out;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-slide-left {
  animation: slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes slideLeft {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
.animate-msg-in {
  animation: msgIn 0.2s ease-out;
}
@keyframes msgIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
