import { ref, onUnmounted } from 'vue';
import { useSocket } from '@/composables/useSocket';
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config';

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  content?: string;
  messageType?: 'text' | 'image' | 'voice';
  attachment?: string;
  sender?: {
    firstName: string;
    lastName: string;
    avatar?: string;
    role?: string;
  };
  createdAt: string;
}

export const useDirectChat = (currentUserId: string, targetUserId: string, serviceId?: string) => {
  const { connect, emit, on, off } = useSocket('chat');
  const messages = ref<Message[]>([]);
  const loading = ref(false);
  const isTyping = ref(false);
  const typingTimeout = ref<any>(null);

  // Use a predictable room ID between these two users and the service
  const roomId = `${[currentUserId, targetUserId].sort().join('_')}_${serviceId || 'general'}`;

  const fetchMessages = async () => {
    loading.value = true;
    try {
      const url = serviceId ? `/chat/direct/${targetUserId}?serviceId=${serviceId}` : `/chat/direct/${targetUserId}`;
      const res = await api.get(url);
      messages.value = Array.isArray(res.data) ? res.data.map((m: any) => ({
        ...m,
        senderId: m.senderId || m.sender?._id || m.sender,
        receiverId: m.receiverId || m.receiver?._id || m.receiver,
      })) : [];
    } catch (e) {
      console.error('Failed to fetch direct messages', e);
    } finally {
      loading.value = false;
    }
  };

  const sendMessage = (text: string, type: 'text' | 'image' | 'voice' = 'text', attachment?: string) => {
    const tempId = `temp_${Date.now()}`;
    const optimisticMsg: Message = {
      _id: tempId,
      senderId: currentUserId,
      receiverId: targetUserId,
      message: text,
      content: text,
      messageType: type,
      attachment,
      createdAt: new Date().toISOString()
    };
    messages.value.push(optimisticMsg);

    emit('sendMessage', {
      roomId,
      roomType: 'direct',
      senderId: currentUserId,
      receiverId: targetUserId,
      message: text,
      messageType: type,
      attachment,
      serviceId
    });
  };

  const sendTyping = () => {
    emit('typing', { roomId, roomType: 'direct', userId: currentUserId });
    if (typingTimeout.value) clearTimeout(typingTimeout.value);
    typingTimeout.value = setTimeout(() => {
      emit('stopTyping', { roomId, roomType: 'direct', userId: currentUserId });
    }, 2000);
  };

  const setupListeners = () => {
    connect();
    
    // We don't off('newMessage') unconditionally if there are other chat instances, 
    // but typically there's only one active.
    
    emit('joinOrder', { roomId, roomType: 'direct' }); // backend maps joinOrder or chat:join-room

    on('chat:new-message', (message: any) => {
      // Sometimes message comes through newMessage or chat:new-message
      handleIncomingMessage(message);
    });

    on('newMessage', (message: any) => {
      handleIncomingMessage(message);
    });

    on('chat:user-typing', (data: { userId: string, isTyping: boolean, roomId: string }) => {
      if (data.roomId === roomId && data.userId === targetUserId) {
        isTyping.value = data.isTyping;
      }
    });
  };

  const handleIncomingMessage = (message: any) => {
    // Only accept messages that are part of this generic direct conversation
    const msgRoomType = message.roomType;
    if (msgRoomType === 'direct' && !message.appointment && !message.appointmentId) {
      const sId = String(message.senderId || message.sender?._id || message.sender || '');
      const rId = String(message.receiverId || message.receiver?._id || message.receiver || '');
      const cId = String(currentUserId);
      const tId = String(targetUserId);
      const isRelevantUser = (sId === cId && rId === tId) || (sId === tId && rId === cId);
      
      const msgServiceId = String(message.serviceId || message.service?._id || message.service || '');
      const currentServiceIdStr = String(serviceId || '');
      const isRelevantService = msgServiceId === currentServiceIdStr;

      if (isRelevantUser && isRelevantService) {
        // Match and replace optimistic message
        if (sId === cId) {
          const pendingIdx = messages.value.findIndex(m => m._id?.startsWith('temp_') && m.message === message.message);
          if (pendingIdx !== -1) {
            messages.value[pendingIdx] = message;
            return;
          }
        }

        if (!message._id || !messages.value.some(m => m._id === message._id)) {
          messages.value.push(message);
        }
      }
    }
  };

  onUnmounted(() => {
    // emit('leaveRoom', { roomId, roomType: 'direct' });
  });

  return {
    messages,
    loading,
    isTyping,
    fetchMessages,
    sendMessage,
    sendTyping,
    setupListeners
  };
};
