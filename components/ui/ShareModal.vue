<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="isOpen" class="fixed inset-0 z-[120] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/50 backdrop-blur-sm" @click.self="close">
        <div class="bg-white w-full md:max-w-md rounded-t-[2rem] md:rounded-[2rem] shadow-sm border border-gray-50 p-4 md:p-5 animate-slide-up-mobile md:animate-zoom-in">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-medium text-gray-900 tracking-tight">Share {{ vendor?.storeName || 'Vendor' }}</h3>
            <button @click="close" class="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-all">
              <X class="w-4 h-4" />
            </button>
          </div>
          
          <div class="grid grid-cols-4 gap-4 mb-8">
            <!-- Native Share -->
            <button v-if="isNativeShareSupported" @click="nativeShare" class="flex flex-col items-center gap-2 group">
              <div class="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 group-hover:bg-gray-200 group-hover:scale-105 transition-all">
                <Share2 class="w-6 h-6" />
              </div>
              <span class="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">More</span>
            </button>

            <!-- WhatsApp -->
            <button @click="shareWhatsApp" class="flex flex-col items-center gap-2 group">
              <div class="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-green-500 group-hover:bg-green-100 group-hover:scale-105 transition-all">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              </div>
              <span class="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">WhatsApp</span>
            </button>

            <!-- Twitter -->
            <button @click="shareTwitter" class="flex flex-col items-center gap-2 group">
              <div class="w-14 h-14 bg-sky-50 rounded-full flex items-center justify-center text-sky-500 group-hover:bg-sky-100 group-hover:scale-105 transition-all">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </div>
              <span class="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Twitter</span>
            </button>

            <!-- Facebook -->
            <button @click="shareFacebook" class="flex flex-col items-center gap-2 group">
              <div class="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 group-hover:bg-blue-100 group-hover:scale-105 transition-all">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </div>
              <span class="text-sm font-bold text-gray-600 group-hover:text-gray-900 transition-colors">Facebook</span>
            </button>
          </div>

          <div class="relative flex items-center bg-gray-50 rounded-2xl border border-gray-25 p-1.5 shadow-inner">
            <div class="pl-4 pr-2 py-2 flex-1 overflow-hidden">
              <p class="text-sm text-gray-500 truncate font-medium">{{ shareUrl }}</p>
            </div>
            <button 
              @click="copyLink" 
              class="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-parentPrimary transition-all active:scale-95 shrink-0"
            >
              {{ copied ? 'Copied!' : 'Copy Link' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { X, Share2 } from 'lucide-vue-next'
import { useToast } from '@/composables/useToast'

const props = defineProps<{
  isOpen: boolean
  vendor: any
}>()

const emit = defineEmits(['update:isOpen'])

const { showToast } = useToast()
const copied = ref(false)
const isNativeShareSupported = ref(false)

const close = () => {
  emit('update:isOpen', false)
}

onMounted(() => {
  if (process.client) {
    isNativeShareSupported.value = !!navigator.share
  }
})

const shareUrl = computed(() => {
  if (!process.client || !props.vendor) return ''
  
  const host = window.location.host
  const protocol = window.location.protocol
  const vendorIdOrSlug = props.vendor?.subdomain || props.vendor?._id
  
  if (!vendorIdOrSlug) return window.location.href
  
  // If we're already on the vendor's subdomain, just use the current origin
  if (host.startsWith(vendorIdOrSlug + '.')) {
    return `${protocol}//${host}/`
  }

  // Vercel app or localhost, default to path-based sharing to avoid broken subdomains locally
  if (host.includes('vercel.app') || host.includes('localhost')) {
    return `${protocol}//${host}/vendors/${vendorIdOrSlug}`
  }
  
  // Production custom domain (e.g., erranders.org)
  const parts = window.location.hostname.split('.')
  let baseHost = host
  
  // Strip existing subdomain if any to find the root domain
  if (parts.length >= 3 && !['www', 'student', 'vendor'].includes(parts[0])) {
    const port = window.location.port ? `:${window.location.port}` : ''
    baseHost = parts.slice(1).join('.') + port
  } else if (parts[0] === 'www' || parts[0] === 'student' || parts[0] === 'vendor') {
    const port = window.location.port ? `:${window.location.port}` : ''
    baseHost = parts.slice(1).join('.') + port
  }
  
  return `${protocol}//${vendorIdOrSlug}.${baseHost}/`
})

const shareText = computed(() => `Check out ${props.vendor?.storeName} on Errandr!`)

const nativeShare = () => {
  if (navigator.share) {
    navigator.share({
      title: props.vendor?.storeName,
      text: shareText.value,
      url: shareUrl.value,
    }).catch(console.error)
  }
}

const shareWhatsApp = () => {
  const url = `https://wa.me/?text=${encodeURIComponent(shareText.value + ' ' + shareUrl.value)}`
  window.open(url, '_blank')
}

const shareTwitter = () => {
  const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl.value)}&text=${encodeURIComponent(shareText.value)}`
  window.open(url, '_blank')
}

const shareFacebook = () => {
  const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl.value)}`
  window.open(url, '_blank')
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    copied.value = true
    showToast('Link copied to clipboard!', 'success')
    setTimeout(() => {
      copied.value = false
      close()
    }, 2000)
  } catch (err) {
    showToast('Failed to copy link', 'error')
  }
}
</script>
