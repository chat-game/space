import tailwindcss from '@tailwindcss/vite'
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  app: {
    head: {
      link: [
        {
          rel: 'icon',
          type: 'image/png',
          href: '/favicon.png',
        },
      ],
    },
  },
  routeRules: {
    '/': {
      static: true,
    },
    '/donate': {
      static: true,
    },
    '/addon': {
      ssr: false,
      cors: true,
    },
    '/api/**': {
      cors: true,
    },
  },
  devtools: { enabled: true },
  devServer: {
    host: '0.0.0.0',
    port: 4200,
  },
  fonts: {
    provider: 'google',
    families: [
      {
        name: 'Roboto Serif',
        provider: 'google',
      },
    ],
  },
  icon: {
    clientBundle: {
      scan: {
        globInclude: ['app/**/*.{vue,ts}'],
        globExclude: ['node_modules', 'dist', 'build', 'coverage', 'test', 'tests', '.*'],
      },
    },
  },
  css: ['~/assets/css/styles.css'],
  runtimeConfig: {
    redisUrl: '',
    websiteBearer: '',
    twitchChannelName: '',
    twitchChannelId: '',
    twitchOauthCode: '',
    yookassaShopId: '',
    yookassaApiKey: '',
    oauthTwitchClientId: '',
    oauthTwitchClientSecret: '',
    telegramBotToken: '',
    telegramGameBotToken: '',
    telegramAdminId: '',
    donationAlertsClientId: '',
    donationAlertsClientSecret: '',
    public: {
      signInRedirectUrl: '',
      websocketUrl: '',
    },
  },
  i18n: {
    locales: [
      { code: 'ru', name: 'Русский', file: 'ru-RU.json' },
      { code: 'en', name: 'English', file: 'en-EN.json' },
    ],
    defaultLocale: 'ru',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      alwaysRedirect: true,
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  nitro: {
    experimental: {
      websocket: true,
      tasks: true,
    },
    scheduledTasks: {
      '*/10 * * * *': ['game:leaderboard'],
      '*/2 * * * *': ['payment:status'],
    },
  },
  modules: [
    '@vueuse/nuxt',
    'nuxt-auth-utils',
    '@nuxtjs/i18n',
    '@nuxt/fonts',
    '@nuxt/icon',
  ],
  compatibilityDate: '2024-08-18',
})
