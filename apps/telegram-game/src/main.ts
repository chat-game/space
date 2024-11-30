import { retrieveLaunchParams } from '@telegram-apps/sdk-vue'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

init(retrieveLaunchParams().startParam === 'debug' || import.meta.env.DEV)

const app = createApp(App)

app.use(router)

app.mount('#app')
