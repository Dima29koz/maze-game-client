import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VueCookies from 'vue-cookies'

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'

const app = createApp(App)

app.use(createPinia())
app.use(
  createVuetify({
    display: {
      mobileBreakpoint: 'sm'
    }
  })
)
app.use(router)
app.use(VueCookies)

app.mount('#app')
