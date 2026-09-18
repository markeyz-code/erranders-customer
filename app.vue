<template>
  <div>
    <VitePwaManifest />
    <UiToast />
    <CoreGlobalConfirmModal />
    <CoreNetworkStatusBanner />
    <UiGlobalLoader />
    <NuxtLayout class="z-10">
      <NuxtPage class="z-10" />
    </NuxtLayout>
    
    <CoreGlobalAdModal />
    <ChatWidget />
    <CoreWhatsAppWidget />

    <CorePushNotificationPrompt />
    <CoreCallOverlay />
    <RequirePhoneModal />
    <GenderSetupModal />
    
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
import { onMounted, watch } from 'vue'
import { useRealtimeNotifications } from '@/composables/core/useRealtimeNotifications'
import { useCart } from '@/composables/modules/cart'
import { useStudentNotifications } from '@/composables/useStudentNotifications'
import { useUser } from '@/composables/modules/auth/user'
import { useWebRTC } from '@/composables/useWebRTC'

import { useAuth } from '@/composables/modules/auth'
import { useMarketPoolStore } from '@/stores/marketPool'

const { initCart } = useCart()
const marketPoolStore = useMarketPoolStore()
const { isLoggedIn } = useUser()
const { requestPermissionAndRegister, listenForNotifications } = useStudentNotifications()
const { initSocketListeners } = useWebRTC()
const { checkRedirectResult } = useAuth()

initCart()
marketPoolStore.initCart()
useRealtimeNotifications()

onMounted(() => {
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
