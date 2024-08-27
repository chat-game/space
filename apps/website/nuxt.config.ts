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
  devtools: { enabled: true },
  devServer: {
    host: '0.0.0.0',
    port: 4200,
  },
  css: ['~/assets/css/styles.css'],
  runtimeConfig: {
    websiteBearer: '', // NUXT_WEBSITE_BEARER
    twitchChannelName: '', // NUXT_TWITCH_CHANNEL_NAME
    twitchChannelId: '', // NUXT_TWITCH_CHANNEL_ID
    twitchOauthCode: '', // NUXT_TWITCH_OAUTH_CODE
    yookassaShopId: '', // NUXT_YOOKASSA_SHOP_ID
    yookassaApiKey: '', // NUXT_YOOKASSA_API_KEY
    oauthTwitchClientId: '', // NUXT_OAUTH_TWITCH_CLIENT_ID
    oauthTwitchClientSecret: '', // NUXT_OAUTH_TWITCH_CLIENT_SECRET
    public: {
      signInRedirectUrl: '', // NUXT_PUBLIC_SIGN_IN_REDIRECT_URL
    },
  },
  modules: ['@vueuse/nuxt', 'nuxt-auth-utils'],
  compatibilityDate: '2024-08-18',
})
