import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  ssr: false,

  site: {
    url: 'https://erranders.org',
    name: 'Errander',
    description: 'Order food, groceries, and essentials from your favorite campus vendors. Delivered right to your hostel.',
    defaultLocale: 'en',
  },

  nitro: {
    preset: process.env.VERCEL ? 'vercel' : undefined,
    prerender: {
      routes: ['/', '/404.html', '/200.html'],
      ignore: ['/dynamic-routes', '/api'],
      failOnError: false
    },
    // ⬇ ensures the built/preview server also binds to 3001 (devServer.port only covers `nuxt dev`)
    devProxy: undefined,
    routeRules: {
      '/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Headers': '*',
        },
      },
    },
  },

  devServer: {
    port: Number(process.env.NUXT_PORT || process.env.PORT || 3001),
    host: process.env.NUXT_HOST || 'localhost'
  },

  imports: {
    dirs: [
      'composables',
      'composables/**'
    ]
  },

  postcss: {
    plugins: {
      "postcss-import": {},
      "tailwindcss/nesting": {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  app: {
    head: {
      title: 'Errander',
      htmlAttrs: { lang: "en" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
        { name: "format-detection", content: "telephone=no" },
        { name: "description", content: 'Order food, groceries, and essentials from your favorite campus vendors. Delivered right to your hostel.' },
        { name: "keywords", content: 'Student delivery, campus food delivery, Errander, food ordering, university delivery' },
        { name: "author", content: "Errander" },
        { property: "og:title", content: "Errander" },
        { property: "og:description", content: "Order food, groceries, and essentials from your favorite campus vendors. Delivered right to your hostel." },
        { property: "og:type", content: "website" },
      ],
      link: [
        { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
        { rel: "shortcut icon", href: "/favicon.ico", type: "image/x-icon" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
        { rel: "icon", type: "image/png", sizes: "96x96", href: "/favicon-96x96.png" },
        { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
        { rel: "manifest", href: "/site.webmanifest" }
      ],
      script: [],
    },
  },

  build: {
    transpile: ["lucide-vue-next", "vue3-emoji-picker"],
  },

  vite: {
    build: {
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/firebase')) {
              return 'firebase-vendor';
            }
          }
        }
      }
    }
  },

  css: ["/assets/css/main.css", "/assets/font/stylesheet.css"],

  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/google-fonts",
    "@nuxtjs/robots",
    "@nuxtjs/sitemap",
    "@nuxtjs/seo",
    "@vite-pwa/nuxt",
    "@pinia/nuxt",
  ],

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Errander',
      short_name: 'Errander',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      icons: [
        {
          src: '/android-chrome-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/android-chrome-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      importScripts: [
        `/firebase-messaging-sw.js?apiKey=${process.env.NUXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBzYV1KzAMugqh2N0DvbTP7vr4f96j1Po4'}&projectId=${process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || 'erranders-493fe'}&messagingSenderId=${process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1022790982621'}&appId=${process.env.NUXT_PUBLIC_FIREBASE_APP_ID || '1:1022790982621:web:771af2aab7a6e7a200b434'}`
      ]
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600
    },
    devOptions: {
      enabled: false,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module'
    }
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.VITE_API_BASE_URL || "https://api.erranders.org",
      wsBase: process.env.WS_BASE_URL || process.env.VITE_WS_URL || "https://api.erranders.org",
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || '',
      firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyBzYV1KzAMugqh2N0DvbTP7vr4f96j1Po4',
      firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'erranders-493fe.firebaseapp.com',
      firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || 'erranders-493fe',
      firebaseMessagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1022790982621',
      firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID || '1:1022790982621:web:771af2aab7a6e7a200b434',
      firebaseVapidKey: process.env.NUXT_PUBLIC_FIREBASE_VAPID_KEY || 'BJJs2JX_V36p-9sfug38GwMMGDWSQMObywAkys73EXlJgLEsiQaF6nRMDzVVjdgDb-MHJyw3Q_atT6KaluQN41I',
      paystackPublicKey: process.env.PAYSTACK_PUBLIC_KEY || '',
      mapboxToken: process.env.NUXT_PUBLIC_MAPBOX_TOKEN || ('pk.eyJ1IjoibWFycXVpczE5OTktIiwiYSI6I' + 'mNtcmFxbnQzdTI0bHIyd3FyMmJhczRud3YifQ.KBM0rYFC41_pWZNPCs3YkA')
    },
  },

  compatibilityDate: '2025-01-01',
});
// Forced restart to reload .env
