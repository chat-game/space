import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin'
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
  imports: {
    autoImport: true,
  },
  css: ['~/assets/css/styles.css'],
  vite: {
    plugins: [nxViteTsPaths()],
  },
  runtimeConfig: {
    websiteBearer: '', // NUXT_PRIVATE_WEBSITE_BEARER
    public: {
      twitchClientId: '', // NUXT_PUBLIC_TWITCH_CLIENT_ID
      signInRedirectUrl: '', // NUXT_PUBLIC_SIGN_IN_REDIRECT_URL
      cookieKey: '', // NUXT_PUBLIC_COOKIE_KEY
    },
  },
  modules: ['@nuxt/eslint', '@vueuse/nuxt', '@pinia/nuxt'],
  compatibilityDate: '2024-08-18',
})
