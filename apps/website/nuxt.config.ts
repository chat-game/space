import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
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
  css: ['~/assets/css/styles.css'],
  runtimeConfig: {
    redisUrl: '', // NUXT_REDIS_URL
    websiteBearer: '', // NUXT_WEBSITE_BEARER
    twitchChannelName: '', // NUXT_TWITCH_CHANNEL_NAME
    twitchChannelId: '', // NUXT_TWITCH_CHANNEL_ID
    twitchOauthCode: '', // NUXT_TWITCH_OAUTH_CODE
    yookassaShopId: '', // NUXT_YOOKASSA_SHOP_ID
    yookassaApiKey: '', // NUXT_YOOKASSA_API_KEY
    oauthTwitchClientId: '', // NUXT_OAUTH_TWITCH_CLIENT_ID
    oauthTwitchClientSecret: '', // NUXT_OAUTH_TWITCH_CLIENT_SECRET
    telegramBotToken: '', // NUXT_TELEGRAM_BOT_TOKEN
    public: {
      signInRedirectUrl: '', // NUXT_PUBLIC_SIGN_IN_REDIRECT_URL
      websocketUrl: '', // NUXT_PUBLIC_WEBSOCKET_URL
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
  nitro: {
    experimental: {
      websocket: true,
      tasks: true,
    },
    scheduledTasks: {
      '*/10 * * * *': ['game:leaderboard'],
    },
  },
  modules: [
    '@vueuse/nuxt',
    'nuxt-auth-utils',
    '@nuxtjs/device',
    '@nuxtjs/i18n',
    '@nuxt/fonts',
    '@nuxt/icon',
  ],
  compatibilityDate: '2024-08-18',
})
