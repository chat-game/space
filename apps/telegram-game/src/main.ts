import { retrieveLaunchParams } from '@telegram-apps/sdk-vue'
import { loadSlim } from '@tsparticles/slim'
import Particles from '@tsparticles/vue3'
import { createApp } from 'vue'
import App from './App.vue'
import { errorHandler } from './errorHandler'
import { init } from './init'
import { i18n } from './locale'
import router from './router'
import './assets/main.css'
import './assets/telegram.css'

init(retrieveLaunchParams().startParam === 'debug' || import.meta.env.DEV)

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
