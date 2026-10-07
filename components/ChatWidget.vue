<template>
  <ClientOnly>
    <div v-if="showChatWidget" class="z-[90] fixed bottom-6 right-6 md:bottom-8 md:right-8">
      <Transition name="slide-up">
        <div
          v-if="isOpen"
          :class="[
            'bg-white shadow-sm border border-gray-50 overflow-hidden flex flex-col transition-all duration-300',
            // Mobile (default)
            'fixed inset-0 w-full h-[100dvh] rounded-none z-[999999]',
            // Desktop (sm and up)
            'sm:absolute sm:inset-auto sm:bottom-[76px] sm:right-0 sm:w-[380px] md:w-[420px] sm:h-[600px] sm:max-h-[85vh] sm:rounded-[2rem] sm:border sm:border-gray-100/50'
          ]"
        >
          <!-- Wrapper for White Section -->
          <div class="flex-1 flex flex-col relative overflow-hidden">
            <!-- White Background behind everything -->
            <div class="absolute inset-0 bg-white pointer-events-none"></div>

          <!-- Header -->
          <div class="relative z-10 flex items-center justify-between px-4 py-5 text-gray-900 border-b border-gray-100">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-parentPrimary/10 flex items-center justify-center">
                <Smile class="w-6 h-6 text-parentPrimary" />
              </div>
              <div>
                <p class="text-xl font-bold tracking-tight">
                  Hello{{ isLoggedIn ? ` ${user?.firstName}` : '' }},
                </p>
                <p class="text-sm text-gray-500 font-medium mt-0.5">
                  Welcome to our live chat!
                </p>
              </div>
            </div>
            <button
              @click="isOpen = false"
              class="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <X class="w-5 h-5 text-gray-500 hover:text-gray-900" />
            </button>
          </div>

          <!-- Body Content Area -->
          <div class="relative z-10 flex-1 overflow-y-auto px-4 py-2 flex flex-col scrollbar-hide">
            
            <p v-if="!messages.length" class="text-gray-600 text-base leading-relaxed mb-6">
              Start chatting with us - we will be happy to help.
            </p>

            <!-- Details Dropdown -->
            <div class="mb-6" v-if="!messages.length">
              <button 
                @click="showDetails = !showDetails" 
                class="flex items-center gap-2 text-gray-900 font-semibold hover:text-gray-700 transition group"
              >
                <span v-if="isLoggedIn">My details</span>
                <span v-else>Log in if you have an account, or provide your details</span>
                <ChevronDown class="w-4 h-4 transition-transform duration-300" :class="showDetails ? 'rotate-180' : ''" />
              </button>

              <Transition name="fade-slide">
                <div v-if="showDetails" class="mt-4 space-y-4">
                  <div>
                    <label class="block text-gray-700 text-sm font-medium mb-1">Name <span v-if="!isLoggedIn" class="text-gray-400 font-normal text-sm">(Optional)</span></label>
                    <div class="relative">
                      <input 
                        v-model="guestProfile.name"
                        :disabled="isLoggedIn"
                        type="text" 
                        placeholder="Enter your name here"
                        class="w-full bg-gray-50 border border-gray-25 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-parentPrimary/50 focus:border-parentPrimary transition disabled:opacity-70 disabled:cursor-not-allowed"
                      />
                      <Lock v-if="isLoggedIn" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-medium mb-1">Email <span v-if="!isLoggedIn" class="text-gray-400 font-normal text-sm">(Required to chat)</span></label>
                    <div class="relative">
                      <input 
                        v-model="guestProfile.email"
                        :disabled="isLoggedIn"
                        type="email" 
                        placeholder="Enter your email here"
                        class="w-full bg-gray-50 border border-gray-25 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-parentPrimary/50 focus:border-parentPrimary transition disabled:opacity-70 disabled:cursor-not-allowed"
                      />
                      <Lock v-if="isLoggedIn" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label class="block text-gray-700 text-sm font-medium mb-1">Phone Number <span v-if="!isLoggedIn" class="text-gray-400 font-normal text-sm">(Optional for support calls)</span></label>
                    <div class="relative">
                      <input 
                        v-model="guestProfile.phone"
                        :disabled="isLoggedIn && !!(user as any)?.phone && (user as any)?.phone.trim() !== ''"
                        type="tel" 
                        placeholder="Enter your phone number here"
                        class="w-full bg-gray-50 border border-gray-25 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-parentPrimary/50 focus:border-parentPrimary transition disabled:opacity-70 disabled:cursor-not-allowed"
                        @blur="handlePhoneUpdate"
                      />
                      <Lock v-if="isLoggedIn && !!(user as any)?.phone && (user as any)?.phone.trim() !== ''" class="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                  <button v-if="!isLoggedIn && needsGuestInfo" @click="startChat" class="w-full rounded-xl bg-parentPrimary text-white hover:bg-[#E54D12] py-3 text-sm font-bold shadow-sm transition-transform active:scale-[0.98]">
                    Submit Details
                  </button>
                </div>
              </Transition>
            </div>

            <!-- Chat Messages -->
            <div class="space-y-4 flex-1 mb-4" v-if="messages.length">
              <div
                v-for="(message, idx) in messages"
                :key="message._id || message.id || idx"
                class="flex w-full"
                :class="getBubblePosition(message)"
                :style="{
                  marginTop: idx > 0 && messages[idx-1]?.senderType !== message.senderType ? '24px' : '6px',
                }"
              >
                <div
                  class="max-w-[85%] rounded-[1.5rem] px-5 py-3.5 shadow-sm border border-gray-50 backdrop-blur-md"
                  :class="getBubbleStyle(message)"
                >
                  <p class="text-[11px] font-bold uppercase tracking-wider mb-1" :class="getBubbleLabelStyle(message)" v-if="showSenderLabel(message)">
                    {{ message.senderName || (message.senderType === 'bot' ? 'Bot' : 'Support') }}
                  </p>

                  <div v-if="message.messageType === 'image' && (message.attachments?.[0] || message.attachment)" class="mb-2 -mx-2 -mt-1">
                    <img :src="message.attachments?.[0] || message.attachment" class="rounded-xl max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity border border-black/5" />
                  </div>
                  <div v-else-if="message.messageType === 'voice' && (message.attachments?.[0] || message.attachment)" class="mb-2 min-w-[200px] flex items-center gap-3 py-2">
                    <audio :src="message.attachments?.[0] || message.attachment" controls class="h-8 w-full custom-audio" />
                  </div>

                  <p class="whitespace-pre-wrap leading-relaxed text-[14px]">{{ message.content || message.message }}</p>
                  <p class="text-[10px] mt-2 font-medium text-right" :class="getBubbleTimeStyle(message)" v-if="message.createdAt">
                    {{ formatTime(message.createdAt) }}
                  </p>
                </div>
              </div>
              <div v-if="isTyping" class="flex justify-start mt-2">
                <div class="bg-gray-100 rounded-full px-4 py-2 text-sm animate-pulse flex items-center gap-1">
                  <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                  <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></span>
                  <span class="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></span>
                </div>
              </div>
            </div>

            <!-- Spacer -->
            <div class="flex-1"></div>
          </div>
          </div>

          <!-- Bottom White Area -->
          <div class="bg-white relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col">
            <!-- Quick Actions / FAQs -->
            <div class="px-4 pt-5 pb-3" v-if="faqs.length > 0 && messages.length === 0">
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="faq in faqs.slice(0, 8)"
                  :key="faq._id"
                  @click="handleFaqClick(faq)"
                  class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-[13px] font-semibold transition-colors border border-gray-25/50 whitespace-nowrap"
                >
                  {{ faq.question }}
                </button>
              </div>
            </div>

            <!-- Input Area -->
            <div class="px-4 py-4 flex items-center gap-3 border-t border-gray-100">
              <div class="flex-1 relative flex items-center">
                <input
                  v-model="newMessage"
                  type="text"
                  placeholder="What can we help you with?"
                  class="w-full bg-transparent text-gray-800 placeholder-gray-400 text-[15px] focus:outline-none py-2"
                  @input="handleTyping"
                  @keyup.enter="handleSend"
                  :disabled="isGuest && needsGuestInfo"
                />
              </div>
              <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileUpload" />
              <button 
                @click="triggerFileUpload" 
                :disabled="isGuest && needsGuestInfo || uploadingMedia"
                class="text-gray-400 hover:text-gray-600 transition-colors p-2 disabled:opacity-50" 
                title="Attach file"
              >
                <div v-if="uploadingMedia" class="w-5 h-5 border border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <Paperclip v-else class="w-5 h-5" />
              </button>
              <button
                v-if="newMessage.trim()"
                @click="handleSend"
                :disabled="sending || !newMessage.trim() || (isGuest && needsGuestInfo)"
                class="w-10 h-10 rounded-full bg-[#FF5C1A] hover:bg-[#E54D12] text-white flex items-center justify-center disabled:opacity-50 transition-all shadow-sm border border-gray-50 shadow-orange-500/20 animate-in zoom-in"
              >
                <ArrowRight class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Floating Button with Unread Badge / Tooltip -->
      <div class="relative flex flex-col items-end">
        <Transition name="fade-slide">
          <div v-if="unreadCount > 0 && !isOpen" class="absolute bottom-full mb-3 right-0 bg-white shadow-lg rounded-2xl px-4 py-3 flex flex-col items-center shadow-black/10 border border-gray-50 whitespace-nowrap animate-bounce">
            <span class="text-[13px] font-semibold text-gray-800">You have {{ unreadCount }} new message{{ unreadCount > 1 ? 's' : '' }}!</span>
            <div class="absolute -bottom-2 right-6 w-4 h-4 bg-white transform rotate-45 border-b border-r border-gray-100"></div>
          </div>
        </Transition>
        <button
          @click="toggleChat"
          class="group relative w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF6B35] to-[#FF5C1A] text-white shadow-sm border border-gray-50 shadow-[#FF5C1A]/40 flex items-center justify-center hover:scale-105 hover:-translate-y-1 transition-all duration-300"
          aria-label="Open chat"
        >
          <div v-if="unreadCount > 0 && !isOpen" class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full shadow-sm animate-pulse"></div>
          <div class="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
          <MessageSquare class="w-7 h-7 transition-transform group-hover:scale-110" />
        </button>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { X, ArrowRight, MessageSquare, Smile, ChevronDown, Lock, Paperclip } from 'lucide-vue-next'
import { onMounted, ref, computed, watch, nextTick, onBeforeUnmount } from 'vue'
import { useUser } from '@/composables/modules/auth/user'
import { useChat } from '@/composables/modules/chat/useChat'
import { useRealtimeSocket } from '@/composables/core/useRealtimeSocket'
import type { ChatMessage } from '@/composables/modules/chat/useChat'
import { upload_api } from '@/api_factory/modules/upload'
import { useCustomToast } from '@/composables/core/useCustomToast'

import { users_api } from '@/api_factory/modules/users'

function isMobile() {
  return window.innerWidth <= 640;
}

const { user, isLoggedIn } = useUser()

const handlePhoneUpdate = async () => {
  if (isLoggedIn.value && !(user.value as any)?.phone && guestProfile.value.phone) {
    try {
      await users_api.updateProfile({ phone: guestProfile.value.phone })
      if (user.value) {
        (user.value as any).phone = guestProfile.value.phone
      }
      showToast({ title: 'Success', message: 'Phone number saved to profile', toastType: 'success' })
    } catch (err) {
      console.error('Failed to update phone number', err)
    }
  }
}

const showDetails = ref(true)
const newMessage = ref('')
const messageContainer = ref<HTMLDivElement | null>(null)
const typingTimeout = ref<number | null>(null)
const isTyping = ref(false)

const {
  room,
  messages,
  faqs,
  sending,
  incomingMessageTrigger,
  loadingFaqs,
  isGuest,
  guestProfile,
  ensureRoom,
  loadFaqs,
  markAsRead,
  sendMessage,
  sendFaqQuestion,
  attachSocketListeners,
  detachSocketListeners,
  isMine,
  isOpen
} = useChat()
const { showToast } = useCustomToast()

const fileInput = ref<HTMLInputElement | null>(null)
const uploadingMedia = ref(false)

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  try {
    // Ensure room exists before uploading, so we don't waste time uploading if they can't chat
    await ensureRoom()
    
    uploadingMedia.value = true;
    const res = await upload_api.uploadFile(file, 'image');
    if (res.type === 'ERROR') {
      throw new Error(res.data?.message || res.statusText || 'Upload failed');
    }
    
    const attachmentUrl = res.data?.url || res.data?.data?.url;
    if (!attachmentUrl) {
      throw new Error('No valid URL returned from upload server.');
    }
    
    // Send the message immediately with the attachment
    await sendMessage(newMessage.value || 'Shared an image', {
      messageType: 'image',
      attachments: [attachmentUrl]
    })
    newMessage.value = ''
  } catch (err: any) {
    console.error('Action failed', err);
    if (!err.message?.toLowerCase().includes('name and email')) {
        showToast({ title: 'Action Failed', message: err.message || 'Could not send image.', toastType: 'error' });
    }
  } finally {
    uploadingMedia.value = false;
    if (fileInput.value) fileInput.value.value = '';
  }
}

const unreadCount = ref(0)
watch(incomingMessageTrigger, () => {
  if (!isOpen.value) {
    unreadCount.value++
  }
})

watch(isOpen, async (newVal) => {
  if (newVal) {
    unreadCount.value = 0
    await startChat()
    await loadFaqs()
  }
})


const showChatWidget = computed(() => true)

watch(isLoggedIn, (logged) => {
  if (logged && user.value) {
    guestProfile.value.name = user.value.firstName + ' ' + user.value.lastName;
    guestProfile.value.email = user.value.email;
    guestProfile.value.phone = (user.value as any).phone || '';
  }
}, { immediate: true })

const needsGuestInfo = computed(() => !guestProfile.value.name || !guestProfile.value.email)

function getBubblePosition(message: ChatMessage) {
  if (isMine(message)) {
    return 'justify-end';
  }
  return 'justify-start';
}

function getBubbleStyle(message: ChatMessage) {
  if (isMine(message)) {
    return 'bg-parentPrimary text-white rounded-br-sm shadow-sm border border-parentPrimary shadow-[#FF5C1A]/20';
  }
  return 'bg-gray-100 text-gray-900 rounded-bl-sm border border-gray-50';
}

function getBubbleLabelStyle(message: ChatMessage) {
  if (isMine(message)) {
    return 'text-white/80';
  }
  return 'text-gray-500';
}

function getBubbleTimeStyle(message: ChatMessage) {
  if (isMine(message)) {
    return 'text-white/70';
  }
  return 'text-gray-400';
}

function showSenderLabel(message: ChatMessage) {
  return !isMine(message);
}

const { socket, connectSocket, isConnected } = useRealtimeSocket()

const toggleChat = () => {
  isOpen.value = !isOpen.value
}

const startChat = async () => {
  connectSocket()
  if (!needsGuestInfo.value || !isGuest.value) {
    await ensureRoom()
    await markAsRead()
    showDetails.value = false
  }
}

const handleSend = async () => {
  if (!newMessage.value.trim()) return
  if (isGuest.value && needsGuestInfo.value) return
  if (!room.value?._id) {
    await startChat()
  }
  const messageText = newMessage.value
  newMessage.value = ''
  await sendMessage(messageText)
}

const handleFaqClick = async (faq: any) => {
  if (isGuest.value && needsGuestInfo.value) {
    showDetails.value = true;
    return;
  }
  if (!room.value?._id) {
    await startChat()
  }
  await sendFaqQuestion(faq)
}

const handleTyping = () => {
  if (!socket.value || !room.value?._id) return
  socket.value.emit('chat:typing', { roomId: room.value._id, isTyping: true })

  if (typingTimeout.value) {
    clearTimeout(typingTimeout.value)
  }

  typingTimeout.value = window.setTimeout(() => {
    socket.value?.emit('chat:typing', { roomId: room.value?._id, isTyping: false })
  }, 1200)
}

const formatTime = (value: string) => {
  try {
    return new Date(value).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

watch(messages, async () => {
  await nextTick()
  if (messageContainer.value) {
    messageContainer.value.scrollTop = messageContainer.value.scrollHeight
  }
}, { deep: true })

onMounted(() => {
  connectSocket()
  attachSocketListeners()
  if (socket.value) {
    socket.value.on('chat:user-typing', (payload: { isTyping: boolean; roomId?: string }) => {
      if (room.value?._id && payload?.roomId && payload.roomId !== room.value._id) return
      isTyping.value = payload?.isTyping || false
    })
  }
})

onBeforeUnmount(() => {
  detachSocketListeners()
  if (socket.value) {
    socket.value.off('chat:user-typing')
  }
})
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: bottom right;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
