import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'

import { router } from './router'
import 'virtual:uno.css'
import '@unocss/reset/tailwind-compat.css'

const app = createApp(App)

const pinia = createPinia()

app.use(pinia)
app.use(router)

app.mount('#app')
