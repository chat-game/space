import { init } from '@telegram-apps/sdk-vue'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

init()

const app = createApp(App)

app.use(router)

app.mount('#app')
