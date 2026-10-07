<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
    <!-- Backdrop -->
    <div 
      class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
      @click="close"
    ></div>

    <!-- Modal Content -->
    <div 
      class="relative bg-white w-full sm:w-[500px] h-[90vh] sm:h-[80vh] sm:max-h-[800px] sm:rounded-3xl rounded-t-3xl shadow-sm border border-gray-50 flex flex-col overflow-hidden transition-transform animate-slide-up sm:animate-scale-in"
    >
      <!-- Header -->
      <div class="px-4 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
        <div>
          <h2 class="text-xl font-bold text-gray-900">Reviews</h2>
          <div class="flex items-center gap-2 mt-1">
            <div class="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
              <Star class="w-3.5 h-3.5 text-amber-500 fill-current" />
              <span class="text-sm font-bold text-amber-700">{{ vendor?.rating?.toFixed(1) || '5.0' }}</span>
            </div>
            <span class="text-sm text-gray-500 font-medium">{{ vendor?.totalRatings || 0 }} total ratings</span>
          </div>
        </div>
        <button 
          @click="close"
          class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- Content Area -->
        <!-- Content Area -->
      <div class="flex-1 overflow-y-auto bg-gray-50/50 p-4 sm:p-4 no-scrollbar">

        <!-- Reviews List -->
        <div class="space-y-4">
          <div v-if="loading" class="flex flex-col items-center justify-center py-12 text-gray-400">
            <Loader2 class="w-8 h-8 animate-spin mb-3 text-parentPrimary" />
            <p class="text-sm font-medium">Loading reviews...</p>
          </div>
          
          <div v-else-if="reviews.length === 0" class="text-center py-12">
            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle class="w-6 h-6 text-gray-400" />
            </div>
            <h3 class="text-gray-900 font-bold mb-1">No reviews yet</h3>
            <p class="text-sm text-gray-500 font-medium">Be the first to share your experience!</p>
          </div>

          <div 
            v-else 
            v-for="review in reviews" 
            :key="review._id"
            class="bg-white p-4 rounded-2xl border border-gray-50 shadow-sm"
          >
            <div class="flex items-start justify-between mb-2">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-parentPrimary/20 to-indigo-500/20 flex items-center justify-center border border-white shadow-sm shrink-0">
                  <span class="text-sm font-bold text-parentPrimary">{{ getInitials(review.user?.name || 'Anonymous') }}</span>
                </div>
                <div>
                  <h4 class="font-bold text-gray-900 text-sm">{{ review.user?.name || 'Anonymous' }}</h4>
                  <p class="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{{ formatDate(review.createdAt) }}</p>
                </div>
              </div>
              <div class="flex items-center gap-0.5 bg-gray-50 px-1.5 py-1 rounded">
                <Star v-for="s in 5" :key="s" class="w-3 h-3" :class="s <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'" />
              </div>
            </div>
            <p v-if="review.comment" class="text-sm text-gray-600 leading-relaxed">{{ review.comment }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { X, Star, Loader2, MessageCircle, AlertCircle } from 'lucide-vue-next';
import { reviews_api } from '@/api_factory/modules/reviews';
import { useUser } from '@/composables/modules/auth/user';

const props = defineProps<{
  isOpen: boolean;
  vendor: any;
}>();

const emit = defineEmits(['close', 'review-added']);

const { user } = useUser();

const loading = ref(false);
const reviews = ref<any[]>([]);

const close = () => {
  emit('close');
};

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;
  return `${Math.floor(diffInMonths / 12)}y ago`;
};

const fetchReviews = async () => {
  if (!props.vendor?._id) return;
  loading.value = true;
  try {
    const res = await reviews_api.getVendorReviews(props.vendor._id);
    reviews.value = res.data?.reviews || res.data || [];
  } catch (err) {
    console.error('Failed to fetch reviews', err);
  } finally {
    loading.value = false;
  }
};


watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    fetchReviews();
  }
});
</script>
