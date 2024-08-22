import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
import { join } from 'node:path'
import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  workspaceDir: '../../',
  srcDir: 'src',
  devtools: { enabled: true },
  devServer: {
    host: '0.0.0.0',
    port: 4200,
  },
  typescript: {
    typeCheck: true,
    tsConfig: {
      extends: '../tsconfig.app.json', // Nuxt copies this string as-is to the `./.nuxt/tsconfig.json`, therefore it needs to be relative to that directory
    },
  },
  alias: {
    '@chat-game/prisma-client': join(__dirname, '../../libs/prisma-client/src/index.ts'),
    '@chat-game/types': join(__dirname, '../../libs/types/src/index.ts'),
  },
  imports: {
    autoImport: true,
  },
  css: ['~/assets/css/styles.css'],
  vite: {
    plugins: [nxViteTsPaths()],
  },
  runtimeConfig: {
    websiteBearer: '', // NUXT_WEBSITE_BEARER
    jwtSecretKey: '', // NUXT_JWT_SECRET_KEY
    twitchSecretId: '', // NUXT_TWITCH_SECRET_ID
    twitchChannelName: '', // NUXT_TWITCH_CHANNEL_NAME
    twitchChannelId: '', // NUXT_TWITCH_CHANNEL_ID
    twitchOauthCode: '', // NUXT_TWITCH_OAUTH_CODE
    yookassaShopId: '', // NUXT_YOOKASSA_SHOP_ID
    yookassaApiKey: '', // NUXT_YOOKASSA_API_KEY
    public: {
      twitchClientId: '', // NUXT_PUBLIC_TWITCH_CLIENT_ID
      signInRedirectUrl: '', // NUXT_PUBLIC_SIGN_IN_REDIRECT_URL
      cookieKey: '', // NUXT_PUBLIC_COOKIE_KEY
    },
  },
  modules: ['@nuxt/eslint', '@vueuse/nuxt', '@pinia/nuxt'],
  compatibilityDate: '2024-08-18',
})
