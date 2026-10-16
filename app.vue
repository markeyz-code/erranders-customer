<template>
  <div>
    <!-- Platform Closed Overlay -->
    <ClientOnly>
      <CorePlatformClosed v-if="isPlatformClosed" />
    </ClientOnly>

    <template v-if="!isPlatformClosed">
      <VitePwaManifest />
      <UiToast />
      <CoreGlobalConfirmModal />
      <CoreNetworkStatusBanner />
      <UiGlobalLoader />
      <NuxtLayout class="z-10">
        <NuxtPage class="z-10" />
      </NuxtLayout>

      <!-- Campus scoping: the first-visit chooser, then the switching splash -->
      <ClientOnly>
        <CoreCampusPicker v-if="showCampusPicker" @close="closePicker" />
      </ClientOnly>

      <CoreGlobalAdModal />
      <ChatWidget />
      <CoreWhatsAppWidget />

      <!--
        Suppressed while the campus picker is open: on a first visit the push
        prompt was rendering on top of the picker, asking for notifications
        before the user had even chosen a campus.
      -->
      <CorePushNotificationPrompt v-if="!showCampusPicker" />
      <CoreCallOverlay />
      <RequirePhoneModal />
      <GenderSetupModal />

      <!-- Sits above every other overlay: it owns the screen while switching -->
      <ClientOnly>
        <CoreCampusSwitchSplash
          v-if="splashTarget"
          :institution="splashTarget"
          @finished="endCampusSwitch"
        />
      </ClientOnly>
    </template>
    
    <!-- Background Audio - Bottom Left -->
    <!-- <ClientOnly>
      <div class="fixed bottom-6 left-6 z-[999998]">
        <BackgroundAudio src="/audio/ambient-tranquility-serene-soundscapes-365048.mp3" />
      </div>
    </ClientOnly> -->
  </div>
</template>

<style>
body {
  font-family: 'Roobert PRO', sans-serif;
}
</style>

<script setup lang="ts">
// Global app configuration
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useRealtimeNotifications } from '@/composables/core/useRealtimeNotifications'
import { useCart } from '@/composables/modules/cart'
import { useStudentNotifications } from '@/composables/useStudentNotifications'
import { useUser } from '@/composables/modules/auth/user'
import { useWebRTC } from '@/composables/useWebRTC'
import { useInstitution, isVendorSubdomainHost } from '@/composables/useInstitution'

import { useAuth } from '@/composables/modules/auth'
import { useMarketPoolStore } from '@/stores/marketPool'

const isPlatformClosed = ref(false)

const route = useRoute()
const {
  institutions,
  hasChosen,
  splashTarget,
  pickerRequested,
  restore,
  loadInstitutions,
  closePicker,
  endCampusSwitch
} = useInstitution()

// Restore the persisted campus (cookie + localStorage) before the first scoped
// request goes out, then warm the chooser's list in the background. The axios
// interceptor reads the cookie synchronously, so the header is already correct
// on the very first request of the page load.
restore()
loadInstitutions()

// A vendor storefront subdomain belongs entirely to one vendor: never cover it.
const onVendorSubdomain = ref(typeof window !== 'undefined' ? isVendorSubdomainHost() : false)

const isAuthRoute = computed(() => route.path.startsWith('/auth'))

/**
 * The chooser is a first-visit overlay, so it only appears when the visitor has
 * no campus AND the campus list actually loaded. An empty or failed list falls
 * through to the normal site instead of trapping the visitor behind a broken
 * overlay, and the auth routes are never blocked.
 */
const showCampusPicker = computed(() =>
  (pickerRequested.value || !hasChosen.value) &&
  institutions.value.length > 0 &&
  !isAuthRoute.value &&
  !onVendorSubdomain.value
)

const { initCart } = useCart()
const marketPoolStore = useMarketPoolStore()
const { isLoggedIn } = useUser()
const { requestPermissionAndRegister, listenForNotifications } = useStudentNotifications()
const { initSocketListeners } = useWebRTC()
const { checkRedirectResult } = useAuth()

// Check platform status
const checkPlatformStatus = async () => {
  try {
    const config = useRuntimeConfig()
    const baseUrl = (config.public.apiBase as string) || 'https://api.erranders.org'
    const cleanBase = baseUrl.replace(/\/api\/v1\/?$/, '').replace(/\/$/, '')
    const res = await $fetch<{ isStudentAppClosed: boolean; isClosed: boolean }>(`${cleanBase}/api/v1/settings/platform-status/public`)
    isPlatformClosed.value = res?.isStudentAppClosed ?? res?.isClosed ?? false
  } catch (e) {
    // If we can't reach the API, don't block the app
    isPlatformClosed.value = false
  }
}

initCart()
marketPoolStore.initCart()
useRealtimeNotifications()

onMounted(() => {
  checkPlatformStatus()
  checkRedirectResult()
  listenForNotifications()
  initSocketListeners()
  if (isLoggedIn.value && 'Notification' in window && Notification.permission === 'granted') {
    requestPermissionAndRegister()
  }
})

watch(isLoggedIn, (newVal) => {
  if (newVal && 'Notification' in window && Notification.permission === 'granted') {
    requestPermissionAndRegister()
  }
})

useHead({
  title: 'Errander - Making Campus Life Easier, One Errand at a time',
  htmlAttrs: {
    lang: 'en'
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'format-detection', content: 'telephone=no' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'shortcut icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/favicon-96x96.png' },
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }
  ]
})

useSeoMeta({
  title: 'Errander - Making Campus Life Easier, One Errand at a time',
  ogTitle: 'Errander - Making Campus Life Easier, One Errand at a time',
  description: 'Official Errander Student Portal. Order food, track deliveries, and manage your student campus services.',
  ogDescription: 'Official Errander Student Portal. Order food, track deliveries, and manage your student campus services.',
  keywords: 'Errandr student, campus delivery, student services, order food, track orders',
  author: 'Errandr Team',
  ogType: 'website',
  ogUrl: 'https://errandr.com/student',
  ogImage: 'https://errandr.com/og-image.jpg',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Errander - Making Campus Life Easier, One Errand at a time',
  twitterDescription: 'Official Errander Student Portal. Order food, track deliveries, and manage your student campus services.',
  twitterImage: 'https://errandr.com/og-image.jpg'
})
</script>

