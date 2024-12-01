import { retrieveLaunchParams } from '@telegram-apps/sdk-vue'
import { createApp } from 'vue'
import App from './App.vue'
import { errorHandler } from './errorHandler'
import { init } from './init'

import router from './router'
import './assets/main.css'
import './assets/telegram.css'

init(retrieveLaunchParams().startParam === 'debug' || import.meta.env.DEV)

const app = createApp(App)
app.config.errorHandler = errorHandler
app.use(router)
app.mount('#app')
