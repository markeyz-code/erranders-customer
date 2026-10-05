<template>
 <div class="h-screen flex flex-col bg-[#E5DDD5] font-sans selection:bg-[#00A884]/30">
 <!-- WhatsApp Green Header -->
 <div class="bg-[#075E54] text-white px-4 py-3 flex items-center gap-3 sticky top-0 z-20 shadow-sm border border-gray-50">
 <button @click="router.back()" class="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center">
 <ArrowLeft class="w-6 h-6 text-white" />
 </button>
 <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold overflow-hidden shrink-0 border border-white/10 shadow-sm relative group cursor-pointer">
   <img v-if="chatTargetAvatar" :src="chatTargetAvatar" class="w-full h-full object-cover" />
   <span v-else>{{ chatTargetName[0] || '?' }}</span>
 </div>
 <div class="flex-1 min-w-0 cursor-pointer" v-if="order">
   <h1 class="text-base font-bold truncate leading-tight tracking-tight">{{ chatTargetName }}</h1>
   <p class="text-[12px] text-white/80 font-medium truncate mt-0.5">
     {{ isTyping ? 'typing...' : 'online' }}
   </p>
 </div>
 <div class="flex items-center gap-5 ml-2 shrink-0">
 <button @click="startVideoCall" class="p-1 hover:bg-white/10 rounded-full transition-colors">
  <Video class="w-5 h-5 text-white" />
 </button>
 <button @click="startAudioCall" class="p-1 hover:bg-white/10 rounded-full transition-colors">
  <Phone class="w-4 h-4 text-white fill-current" />
 </button>
 <button class="p-1 hover:bg-white/10 rounded-full transition-colors">
  <MoreVertical class="w-5 h-5 text-white" />
 </button>
 </div>
 </div>

 <!-- Messages Area with WhatsApp Doodle Background -->
 <div 
 class="flex-1 overflow-y-auto px-2 sm:px-4 py-4 space-y-2 scroll-smooth bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat opacity-95"
 ref="chatContainer"
 >
 <!-- Date Marker -->
 <div class="flex justify-center mb-6 sticky top-2 z-10">
 <span class="px-3 py-1.5 bg-[#D1E9F6] text-[#54656F] text-[11.5px] font-bold rounded-lg shadow-sm  backdrop-blur-sm bg-opacity-90">
 Order {{ order?.orderNumber || 'Connecting...' }}
 </span>
 </div>

 <div class="flex flex-col items-center justify-center p-10 text-center space-y-3 mt-4" v-if="messages.length === 0">
 <div class="px-4 py-3 bg-[#FCF4CB] rounded-2xl shadow-sm max-w-sm border border-amber-100/50">
 <p class="text-[12px] text-[#54656F] font-medium leading-relaxed">
 🔒 Messages and calls are end-to-end encrypted. No one outside of this chat, not even Errandr, can read or listen to them. Tap to learn more.
 </p>
 </div>
 </div>

 <div v-for="(msg, i) in messages" :key="msg._id || i" 
 class="flex flex-col w-full animate-message-in"
 :class="isMe(msg) ? 'items-end' : 'items-start'"
 >
 <div 
 :class="[
 'relative max-w-[85%] px-2.5 py-1.5 rounded-lg text-[15px] shadow-sm mb-0.5 group transition-all',
 isMe(msg) 
 ? 'bg-[#DCF8C6] text-[#111B21] rounded-tr-none ml-10' 
 : 'bg-white text-[#111B21] rounded-tl-none mr-10'
 ]"
 >
 <!-- Speech Bubble Tail -->
 <div v-if="shouldShowTail(msg, i)" 
 :class="[
 'absolute top-0 w-[11px] h-[13px] overflow-hidden',
 isMe(msg) ? 'right-[-11px] text-[#DCF8C6]' : 'left-[-11px] text-white transform -scale-x-100'
 ]">
 <svg viewBox="0 0 11 13" class="fill-current w-full h-full">
 <path d="M0,0 C0,0 8.5,0.5 11,0 C11,6.5 6.5,13 0,13 L0,0 Z"></path>
 </svg>
 </div>

  <div class="flex flex-col gap-1 w-full relative group/msg">
    <!-- Reply block -->
    <div v-if="msg.replyTo || msg.replyToMessageId" class="bg-black/5 rounded p-1.5 mb-1 text-sm border-l-4 border-[#00A884] opacity-80 flex flex-col cursor-pointer max-w-[200px] truncate" @click="scrollToReply(msg)">
      <span class="text-[#00A884] font-semibold text-xs">{{ msg.replyTo?.sender?.firstName || 'User' }}</span>
      <span class="truncate text-xs">{{ msg.replyTo?.messageType === 'image' ? 'Photo' : msg.replyTo?.messageType === 'voice' ? 'Voice note' : msg.replyTo?.message || 'Replied message' }}</span>
    </div>
    
    <!-- Image -->
    <div v-if="msg.messageType === 'image' && msg.attachment" class="rounded-md overflow-hidden mb-1">
      <img :src="msg.attachment" class="max-w-[200px] sm:max-w-[250px] max-h-[300px] object-cover" />
    </div>
    
    <!-- Voice -->
    <div v-else-if="msg.messageType === 'voice' && msg.attachment" class="min-w-[150px] mb-1">
      <audio controls :src="msg.attachment" class="h-8 w-full max-w-[200px]"></audio>
    </div>
    
    <!-- Text -->
    <span v-else-if="msg.message" class="break-words flex-1 min-w-0 font-normal leading-relaxed pb-[10px] pl-1 pr-1">{{ msg.message }}</span>
    
    <div class="flex items-center gap-1 shrink-0 absolute bottom-[-2px] right-0 bg-transparent">
      <span class="text-[10.5px] text-gray-500 font-medium">
        {{ formatTime(msg.createdAt) }}
      </span>
      <div v-if="isMe(msg)" class="flex items-center">
        <Check v-if="msg.status === 'pending'" class="w-[15px] h-[15px] text-gray-400" stroke-width="2.5" />
        <CheckCheck v-else class="w-[15px] h-[15px] text-[#34B7F1]" stroke-width="2.5" />
      </div>
    </div>
    
    <!-- Reply Button (visible on hover) -->
    <button @click="setReply(msg)" class="absolute top-1/2 -translate-y-1/2 p-1.5 bg-white shadow-sm border border-gray-50 rounded-full text-gray-500 hover:text-[#00A884] opacity-0 group-hover/msg:opacity-100 transition-opacity" :class="isMe(msg) ? '-left-10' : '-right-10'">
      <Reply class="w-4 h-4" />
    </button>
  </div>
 </div>
 </div>
 
 <!-- Typing Indicator -->
 <div v-if="isTyping" class="flex items-center ml-2 transition-all mt-2 animate-fade-in relative max-w-[85%] px-3 py-2.5 rounded-lg bg-white rounded-tl-none shadow-sm h-[38px] w-[60px]">
 <div class="absolute top-0 w-[11px] h-[13px] overflow-hidden left-[-11px] text-white transform -scale-x-100">
 <svg viewBox="0 0 11 13" class="fill-current w-full h-full"><path d="M0,0 C0,0 8.5,0.5 11,0 C11,6.5 6.5,13 0,13 L0,0 Z"></path></svg>
 </div>
 <div class="flex gap-[3px] items-center justify-center w-full h-full opacity-60">
 <span class="w-[6px] h-[6px] bg-[#54656F] rounded-full animate-bounce" style="animation-delay: 0ms"></span>
 <span class="w-[6px] h-[6px] bg-[#54656F] rounded-full animate-bounce" style="animation-delay: 150ms"></span>
 <span class="w-[6px] h-[6px] bg-[#54656F] rounded-full animate-bounce" style="animation-delay: 300ms"></span>
 </div>
 </div>
 </div>

  <!-- Emoji Picker -->
  <div v-if="showEmojiPicker" class="absolute bottom-[70px] left-2 bg-white rounded-lg shadow-sm border border-gray-50 border border-gray-50 p-2 max-w-[300px] animate-fade-in z-30">
    <div class="grid grid-cols-6 gap-2 text-2xl">
      <button v-for="emoji in emojis" :key="emoji" @click="selectEmoji(emoji)" class="hover:bg-gray-100 rounded p-1 transition-colors">
        {{ emoji }}
      </button>
    </div>
  </div>

  <!-- WhatsApp Input Bar -->
  <div class="px-2 py-2.5 bg-[#F0F2F5] flex flex-col gap-2 sticky bottom-0 border-t border-gray-200 z-20">
    <!-- Reply Preview Bar -->
    <div v-if="replyingTo" class="bg-[#E2E8F0] rounded-lg p-2 mx-2 flex items-center justify-between shadow-inner animate-fade-in relative border-l-4 border-[#00A884]">
      <div class="flex flex-col min-w-0 pr-4">
        <span class="text-[#00A884] font-bold text-sm">Replying to {{ replyingTo?.sender?.firstName || 'User' }}</span>
        <span class="text-xs text-gray-600 truncate">{{ replyingTo.messageType === 'image' ? 'Photo' : replyingTo.messageType === 'voice' ? 'Voice note' : replyingTo.message }}</span>
      </div>
      <button @click="replyingTo = null" class="p-1 text-gray-500 hover:text-gray-800 rounded-full hover:bg-gray-300 transition-colors shrink-0">
        <X class="w-4 h-4" />
      </button>
    </div>

    <!-- Hidden file input -->
    <input type="file" ref="fileInput" @change="handleFileUpload" accept="image/*" class="hidden" />

    <div class="flex items-end gap-2 max-w-4xl mx-auto w-full">
      <!-- Input Container -->
      <div class="flex-1 bg-white rounded-[24px] px-3 py-1 flex items-end shadow-sm border border-transparent focus-within:border-gray-200 transition-all min-h-[44px]">
        <button @click="toggleEmojiPicker" class="p-2 mb-0.5 shrink-0 text-[#54656F] hover:text-[#00A884] transition-colors rounded-full hover:bg-gray-50" :class="{'text-[#00A884]': showEmojiPicker}">
          <Smile class="w-[26px] h-[26px]" />
        </button>
        
        <textarea
          v-model="newMessage"
          rows="1"
          placeholder="Type a message"
          class="w-full bg-transparent border-none outline-none text-[16px] font-normal text-[#111B21] placeholder:text-gray-400 resize-none overflow-hidden mx-2 py-[11px]"
          @input="handleInput"
          @keydown.enter.prevent="sendMessage"
          style="min-height: 24px; max-height: 120px;"
        ></textarea>

        <button @click="triggerFileInput" class="p-2 mb-0.5 shrink-0 text-[#54656F] hover:text-[#00A884] transition-colors rounded-full hover:bg-gray-50 transform -rotate-45" :disabled="isUploading">
          <Paperclip v-if="!isUploading" class="w-[22px] h-[22px]" />
          <span v-else class="w-[22px] h-[22px] border border-[#00A884] border-t-transparent rounded-full animate-spin inline-block"></span>
        </button>
      </div>

      <!-- Send Button -->
      <button 
        @click="newMessage.trim() ? sendMessage() : null"
        @mousedown="!newMessage.trim() ? startRecording() : null"
        @touchstart.passive="!newMessage.trim() ? startRecording() : null"
        @mouseup="stopRecording"
        @mouseleave="stopRecording"
        @touchend="stopRecording"
        :class="[
          'w-[48px] h-[48px] text-white rounded-full flex items-center justify-center transition-all shadow-sm border border-gray-50 shrink-0 mb-0.5',
          newMessage.trim() ? 'bg-[#00A884] hover:bg-[#008f6f] hover:scale-105 active:scale-95' : 
          isRecording ? 'bg-red-500 scale-125 animate-pulse' : 'bg-[#00A884] hover:bg-[#008f6f]'
        ]"
      >
        <Send v-if="newMessage.trim()" class="w-[20px] h-[20px] ml-1 mt-[2px] stroke-2" />
        <Mic v-else class="w-[22px] h-[22px] fill-current" />
      </button>
    </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ArrowLeft, CheckCheck, Check, Smile, Paperclip, Send, Mic, Video, Phone, MoreVertical, X, Reply } from 'lucide-vue-next';
import { ref, onMounted, nextTick, computed, onUnmounted } from 'vue';
import { useRoute, useRouter, useHead } from '#imports';
import { orders_api } from '@/api_factory/modules/orders';
import { upload_api } from '@/api_factory/modules/upload';
import { useUser } from '@/composables/modules/auth/user';
import { useSocket } from '@/composables/useSocket';
import { useWebRTC } from '@/composables/useWebRTC';

const route = useRoute();
const router = useRouter();

const { user } = useUser();
const { on, emit, connect } = useSocket('chat');

const order = ref<any>(null);
const messages = ref<any[]>([]);
const newMessage = ref('');
const isTyping = ref(false);

const isUploading = ref(false);
const isRecording = ref(false);
const mediaRecorder = ref<MediaRecorder | null>(null);
const audioChunks = ref<Blob[]>([]);
const showEmojiPicker = ref(false);
const replyingTo = ref<any>(null);
const fileInput = ref<HTMLInputElement | null>(null);

const emojis = ['😀', '😂', '🥺', '😍', '🙏', '👍', '❤️', '🔥', '🎉', '😊', '😭', '😎', '😡', '🤔', '🙌', '✨', '💯', '👏'];

const chatTargetName = computed(() => {
  if (!order.value) return 'Loading...';
  if (route.query.target === 'vendor') {
    return order.value.vendor?.storeName || 'Vendor';
  }
  return order.value.errander?.firstName 
    ? `${order.value.errander.firstName} ${order.value.errander.lastName || ''}`.trim() 
    : 'Your Rider';
});

const chatTargetAvatar = computed(() => {
  if (!order.value) return '';
  if (route.query.target === 'vendor') {
    return order.value.vendor?.logo || '';
  }
  return order.value.errander?.avatar || '';
});
const chatContainer = ref<HTMLElement | null>(null);
let typingTimeout: any = null;

const { initiateCall } = useWebRTC();

const startVideoCall = () => {
  const receiverId = getReceiverId();
  if (receiverId) initiateCall(receiverId, chatTargetName.value, chatTargetAvatar.value, true);
};

const startAudioCall = () => {
  const receiverId = getReceiverId();
  if (receiverId) initiateCall(receiverId, chatTargetName.value, chatTargetAvatar.value, false);
};

const getSenderId = (msg: any) => msg.sender?._id || msg.sender;
const isMe = (msg: any) => getSenderId(msg) === user.value?._id;

const shouldShowTail = (msg: any, idx: number) => {
 if (idx === 0) return true;
 return getSenderId(messages.value[idx - 1]) !== getSenderId(msg);
};

const formatTime = (date: string) => {
 if (!date) return '';
 return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const scrollToBottom = () => {
 nextTick(() => {
 if (chatContainer.value) {
 chatContainer.value.scrollTo({ top: chatContainer.value.scrollHeight, behavior: 'smooth' });
 }
 });
};

const getReceiverId = () => {
  if (!order.value) return null;
  if (route.query.target === 'vendor') {
    return order.value.vendor?._id;
  }
  return order.value.errander?._id;
};

const handleInput = (e: Event) => {
 const target = e.target as HTMLTextAreaElement;
 target.style.height = 'auto';
 target.style.height = `${target.scrollHeight}px`;

 const receiverId = getReceiverId();
 if (!receiverId) return;
 emit('typing', { orderId: route.params.id, receiverId });
 
 clearTimeout(typingTimeout);
 typingTimeout = setTimeout(() => {
 emit('stopTyping', { orderId: route.params.id, receiverId });
 }, 2000);
};

const sendOptimisticMessage = (payload: any) => {
  const tempId = 'temp-' + Date.now();
  const optimisticMsg = {
    _id: tempId,
    ...payload,
    sender: { _id: payload.senderId },
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  messages.value.push(optimisticMsg);
  scrollToBottom();
  
  emit('sendMessage', payload);
  return tempId;
};

const sendMessage = () => {
 const receiverId = getReceiverId();
 if (!newMessage.value.trim() || !receiverId) return;
 
 const payload: any = {
   orderId: route.params.id,
   senderId: user.value?._id,
   receiverId: receiverId,
   message: newMessage.value,
   messageType: 'text',
 };
 
 if (replyingTo.value) {
   payload.replyToMessageId = replyingTo.value._id;
   payload.replyTo = replyingTo.value;
 }
 
 sendOptimisticMessage(payload);
 
 newMessage.value = '';
 replyingTo.value = null;
 showEmojiPicker.value = false;
 
 nextTick(() => {
   const textareas = document.querySelectorAll('textarea');
   textareas.forEach(t => t.style.height = '44px');
 });

 emit('stopTyping', { orderId: route.params.id, receiverId });
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  const receiverId = getReceiverId();
  if (!file || !receiverId) return;

  isUploading.value = true;
  try {
    const res = await upload_api.uploadFile(file, 'image');
    const attachmentUrl = res.data?.url || res.data?.secure_url;
    if (attachmentUrl) {
      sendOptimisticMessage({
        orderId: route.params.id,
        senderId: user.value?._id,
        receiverId: receiverId,
        message: 'Photo',
        messageType: 'image',
        attachment: attachmentUrl
      });
    }
  } catch (error) {
    console.error('Failed to upload image', error);
  } finally {
    isUploading.value = false;
    if (fileInput.value) fileInput.value.value = '';
  }
};

const startRecording = async () => {
  if (newMessage.value.trim()) return;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.value = new MediaRecorder(stream);
    audioChunks.value = [];

    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.value.push(event.data);
      }
    };

    mediaRecorder.value.onstop = async () => {
      const audioBlob = new Blob(audioChunks.value, { type: 'audio/webm' });
      isUploading.value = true;
      try {
        const res = await upload_api.uploadFile(audioBlob, 'audio');
        const attachmentUrl = res.data?.url || res.data?.secure_url;
        const receiverId = getReceiverId();
        if (attachmentUrl && receiverId) {
          sendOptimisticMessage({
            orderId: route.params.id,
            senderId: user.value?._id,
            receiverId: receiverId,
            message: 'Voice note',
            messageType: 'voice',
            attachment: attachmentUrl
          });
        }
      } catch (error) {
        console.error('Failed to upload audio', error);
      } finally {
        isUploading.value = false;
      }
      stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.value.start();
    isRecording.value = true;
  } catch (err) {
    console.error('Error accessing microphone', err);
  }
};

const stopRecording = () => {
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop();
    isRecording.value = false;
  }
};

const toggleEmojiPicker = () => {
  showEmojiPicker.value = !showEmojiPicker.value;
};

const selectEmoji = (emoji: string) => {
  newMessage.value += emoji;
};

const setReply = (msg: any) => {
  replyingTo.value = msg;
};

const scrollToReply = (msg: any) => {
  // Not implemented, but could find DOM node and scroll
};

onMounted(async () => {
 try {
  const orderRes = await orders_api.getOrder(route.params.id as string);
  order.value = orderRes.data;
  
  const receiverId = getReceiverId();
  const currentUserId = user.value?._id;
  
  const messagesRes = await orders_api.getOrderChat(route.params.id as string, currentUserId, receiverId);
  messages.value = messagesRes.data;
  scrollToBottom();
 } catch (e) {
  console.error(e);
 }

 connect();
 
 const receiverId = getReceiverId();
 const currentUserId = user.value?._id;
 let pairKey: string | undefined;
 if (currentUserId && receiverId) {
   const ids = [currentUserId.toString(), receiverId.toString()].sort();
   pairKey = `${ids[0]}_${ids[1]}`;
 }
 
 emit('joinOrder', { orderId: route.params.id, pairKey });

 on('newMessage', (msg: any) => {
  const msgOrderId = msg.orderId || msg.order;
  if (msgOrderId === route.params.id || msgOrderId?.toString() === route.params.id) {
    if (msg.senderId === user.value?._id || msg.sender?._id === user.value?._id) {
      const pendingIdx = messages.value.findIndex(m => m.status === 'pending' && m.message === msg.message && (m.messageType || 'text') === (msg.messageType || 'text'));
      if (pendingIdx !== -1) {
        messages.value[pendingIdx] = msg;
        return;
      }
    }
    if (!messages.value.some(m => m._id === msg._id)) {
      messages.value.push(msg);
      scrollToBottom();
    }
  }
 });

 on('typing', (data: any) => {
 if (data.senderId !== user.value?._id) {
 isTyping.value = true;
 scrollToBottom();
 }
 });

 on('stopTyping', (data: any) => {
 if (data.senderId !== user.value?._id) {
 isTyping.value = false;
 }
 });
});

useHead({ title: 'Chat - Errandr' });
</script>

<style scoped>
.animate-message-in {
 animation: slideUp 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
}
@keyframes slideUp {
 from { opacity: 0; transform: translateY(8px) scale(0.98); }
 to { opacity: 1; transform: translateY(0) scale(1); }
}
.animate-fade-in {
 animation: fadeIn 0.3s ease-in-out forwards;
}
@keyframes fadeIn {
 from { opacity: 0; }
 to { opacity: 1; }
}
</style>
