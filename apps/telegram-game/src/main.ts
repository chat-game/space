import { retrieveLaunchParams } from '@telegram-apps/sdk-vue'
import { loadSlim } from '@tsparticles/slim'
import Particles from '@tsparticles/vue3'
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import { errorHandler } from './errorHandler'
import { init } from './init'
import router from './router'
import './assets/main.css'
import './assets/telegram.css'

init(retrieveLaunchParams().startParam === 'debug' || import.meta.env.DEV)

const i18n = createI18n({
  legacy: false,
  locale: 'ru',
  fallbackLocale: 'ru',
  messages: {
    en: {
      route: {
        title: {
          game: 'Game',
          inventory: 'Inventory',
          quest: 'Quests',
          shop: 'Shop',
          top: 'Top',
        },
      },
    },
    ru: {
      route: {
        title: {
          game: 'Игра',
          inventory: 'Инвентарь',
          quest: 'Задания',
          shop: 'Магазин',
          top: 'Топ',
        },
      },
    },
  },
})

const app = createApp(App)
app.config.errorHandler = errorHandler
app.use(i18n)
app.use(router)
app.use(Particles, {
  init: async (engine) => {
    await loadSlim(engine)
  },
})
app.mount('#app')
