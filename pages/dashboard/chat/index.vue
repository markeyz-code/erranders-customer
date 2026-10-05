<template>
  <div class="h-[calc(100vh-12rem)] flex bg-white rounded-3xl border border-gray-50 shadow-sm overflow-hidden animate-fade-in">
    
    <!-- Left Panel: Conversations List -->
    <div class="w-full md:w-[350px] lg:w-[400px] border-r border-gray-50 flex flex-col bg-white shrink-0">
      <div class="p-4 pb-4 border-b border-gray-50">
        <h1 class="text-2xl font-bold text-gray-900 mb-4">Messages</h1>
        
        <!-- Search -->
        <div class="relative">
          <input 
            type="text" 
            placeholder="Search messages..." 
            class="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-50 rounded-xl focus:bg-white focus:border-parentPrimary focus:ring-4 focus:ring-parentPrimary/10 transition-all text-base outline-none font-medium"
          >
          <Search class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <!-- List -->
      <div class="flex-1 overflow-y-auto hide-scrollbar">
        <div v-if="loading" class="p-4 space-y-3">
          <div v-for="i in 4" :key="i" class="h-20 bg-gray-50 rounded-2xl animate-pulse"></div>
        </div>

        <div v-else-if="conversations.length === 0" class="h-full flex flex-col items-center justify-center text-center p-4">
          <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <MessageSquareOff class="w-8 h-8 text-gray-300" />
          </div>
          <h3 class="text-gray-900 font-bold mb-1">No messages</h3>
          <p class="text-sm text-gray-500">When you contact a vendor, your messages will appear here.</p>
        </div>

        <div v-else class="divide-y divide-gray-50">
          <button 
            v-for="conv in conversations" 
            :key="conv.user?._id"
            @click="selectConversation(conv)"
            class="w-full flex items-center gap-4 p-4 text-left hover:bg-gray-50 transition-colors"
            :class="activeConversation?.user?._id === conv.user?._id ? 'bg-gray-50' : ''"
          >
            <div class="relative shrink-0">
              <img :src="conv.user?.avatar || '/placeholder-store.jpg'" class="w-12 h-12 rounded-full object-cover bg-gray-100 border border-gray-25" />
              <div v-if="conv.unreadCount > 0" class="absolute -top-1 -right-1 w-4 h-4 bg-parentPrimary border border-white rounded-full flex items-center justify-center"></div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-0.5">
                <h4 class="text-sm font-bold text-gray-900 truncate pr-2" :class="conv.unreadCount > 0 ? 'font-bold' : 'font-medium'">
                  {{ conv.user?.storeName || (conv.user ? `${conv.user.firstName} ${conv.user.lastName}`.trim() : 'Vendor') || 'Vendor' }}
                </h4>
                <span v-if="conv.lastMessage" class="text-[10px] font-bold text-gray-400 shrink-0">
                  {{ new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                </span>
              </div>
              <p class="text-xs text-gray-500 truncate" :class="conv.unreadCount > 0 ? 'font-bold text-gray-900' : ''">
                {{ conv.lastMessage?.message || conv.lastMessage?.content || 'Started a conversation' }}
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Right Panel: Active Conversation -->
    <div class="flex-1 bg-white hidden md:flex flex-col relative">
      <div v-if="!activeConversation" class="absolute inset-0 flex flex-col items-center justify-center text-center p-5 bg-gray-50/50">
        <div class="w-20 h-20 bg-white rounded-3xl shadow-sm border border-gray-50 flex items-center justify-center mb-6">
          <MessageCircle class="w-10 h-10 text-gray-300" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Your Messages</h3>
        <p class="text-sm text-gray-500 max-w-sm">Select a conversation from the sidebar to view your message history or send a new message.</p>
      </div>

      <template v-else>
        <!-- Chat Header -->
        <div class="p-4 border-b border-gray-50 flex items-center justify-between bg-white shrink-0">
          <div class="flex items-center gap-3">
            <img :src="activeConversation.user.avatar || '/placeholder-store.jpg'" class="w-10 h-10 rounded-full object-cover border border-gray-25" />
            <div>
              <h2 class="text-sm font-bold text-gray-900">
                {{ activeConversation.user.storeName || `${activeConversation.user.firstName} ${activeConversation.user.lastName}`.trim() || 'Vendor' }}
              </h2>
            </div>
          </div>
          <button class="p-2 hover:bg-gray-50 rounded-xl transition-colors">
            <MoreVertical class="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <!-- Chat Area -->
        <div class="flex-1 overflow-y-auto hide-scrollbar p-4 bg-gray-50/30" ref="chatAreaRef">
          <div v-if="isMessagesLoading" class="flex justify-center my-4">
            <div class="w-6 h-6 border border-parentPrimary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div class="space-y-6" v-else>
            <div v-for="msg in messages" :key="msg._id" :class="['flex', isMe(msg.senderId) ? 'justify-end' : 'justify-start']">
              <div :class="[
                'max-w-[75%] px-5 py-3 shadow-sm rounded-2xl',
                isMe(msg.senderId) 
                  ? 'bg-gray-900 text-white rounded-tr-sm' 
                  : 'bg-white border border-gray-50 text-gray-900 rounded-tl-sm'
              ]">
                <p class="text-sm font-medium">{{ msg.message || msg.content }}</p>
                <p :class="[
                  'text-[10px] mt-1',
                  isMe(msg.senderId) ? 'text-gray-400 text-right' : 'text-gray-400'
                ]">
                  {{ new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Message Input -->
        <div class="p-4 bg-white border-t border-gray-50 shrink-0">
          <div class="flex items-end gap-2 bg-gray-50 border border-gray-25 rounded-2xl p-2 focus-within:border-parentPrimary focus-within:bg-white focus-within:ring-4 focus-within:ring-parentPrimary/10 transition-all">
            <button class="p-2.5 text-gray-400 hover:text-gray-600 transition-colors shrink-0">
              <Paperclip class="w-5 h-5" />
            </button>
            <textarea 
              v-model="messageInput"
              @keydown.enter.prevent="handleSendMessage"
              @input="handleTyping"
              rows="1"
              placeholder="Type a message..."
              class="flex-1 bg-transparent border-none py-3 text-base font-medium text-gray-900 outline-none resize-none max-h-32"
            ></textarea>
            <button 
              @click="handleSendMessage"
              :disabled="!messageInput.trim()"
              class="p-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors shrink-0 shadow-sm disabled:opacity-50"
            >
              <Send class="w-4 h-4" />
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Search, MessageSquareOff, MessageCircle, MoreVertical, Paperclip, Send } from 'lucide-vue-next';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';
import { useUser } from '@/composables/modules/auth/user';
import { useDirectChat } from '@/composables/useDirectChat';

definePageMeta({
  layout: 'student',
});

useHead({ title: 'Messages - Erranders' });

const route = useRoute();
const router = useRouter();
const { user } = useUser();

const loading = ref(true);
const activeConversation = ref<any>(null);
const conversations = ref<any[]>([]);
const messageInput = ref('');
const chatAreaRef = ref<HTMLElement | null>(null);

let activeChatTracker: any = null;
const messages = ref<any[]>([]);
const isMessagesLoading = ref(false);

const isMe = (senderId: string) => {
  return senderId === user.value?._id;
};

const scrollToBottom = async () => {
  await nextTick();
  if (chatAreaRef.value) {
    chatAreaRef.value.scrollTop = chatAreaRef.value.scrollHeight;
  }
};

const fetchChats = async () => {
  loading.value = true;
  try {
    const res = await api.get('/chat/direct/conversations');
    conversations.value = Array.isArray(res.data) ? res.data : [];
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const selectConversation = async (conv: any) => {
  activeConversation.value = conv;
  messageInput.value = '';
  
  if (route.query.prefill && route.query.vendorId === conv.user?._id) {
    messageInput.value = route.query.prefill as string;
    // Clear query param
    router.replace({ query: {} });
  }

  isMessagesLoading.value = true;
  activeChatTracker = useDirectChat(user.value?._id as string, conv.user?._id);
  activeChatTracker.setupListeners();
  
  // Connect and load
  await activeChatTracker.fetchMessages();
  messages.value = activeChatTracker.messages.value;
  isMessagesLoading.value = false;
  
  scrollToBottom();
};

watch(() => messages.value.length, () => {
  scrollToBottom();
});

// Update the external activeChatTracker's messages array watch
watch(() => activeChatTracker?.messages?.value, (newVal) => {
  if (newVal) {
    messages.value = newVal;
    scrollToBottom();
  }
}, { deep: true });


const handleSendMessage = () => {
  if (!messageInput.value.trim() || !activeChatTracker) return;
  activeChatTracker.sendMessage(messageInput.value);
  
  // Optimistically add to local UI
  messages.value.push({
    _id: Date.now().toString(),
    senderId: user.value?._id,
    receiverId: activeConversation.value.user._id,
    message: messageInput.value,
    createdAt: new Date().toISOString()
  });
  
  messageInput.value = '';
  scrollToBottom();
};

const handleTyping = () => {
  if (activeChatTracker) {
    activeChatTracker.sendTyping();
  }
};

onMounted(async () => {
  await fetchChats();
  
  // Handle auto-start chat
  if (route.query.vendorId) {
    const vendorId = route.query.vendorId as string;
    const vendorDocId = route.query.vendorDocId as string || vendorId;
    let existingConv = conversations.value.find((c: any) => c.user?._id === vendorId);
    
    if (!existingConv) {
      try {
        const vendorRes = await api.get(`/vendors/${vendorDocId}`);
        const vendorData = vendorRes.data;
        if (vendorData) {
          existingConv = {
            user: {
              _id: vendorId,
              firstName: vendorData.firstName || vendorData.owner?.firstName || '',
              lastName: vendorData.lastName || vendorData.owner?.lastName || '',
              storeName: vendorData.businessName || 'Vendor',
              avatar: vendorData.profilePicture || ''
            },
            lastMessage: null,
            unreadCount: 0
          };
          conversations.value.unshift(existingConv);
        }
      } catch (err) {
        console.error("Failed to load vendor details for chat", err);
      }
    }
    
    if (existingConv) {
      selectConversation(existingConv);
    }
  }
});
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
