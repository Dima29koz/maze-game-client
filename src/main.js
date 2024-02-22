import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import components from '@/components/UI'

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'

const app = createApp(App)

components.forEach((component) => {
  app.component(component.name, component)
})

app.use(createPinia())
app.use(
  createVuetify({
    display: {
      mobileBreakpoint: 'sm'
    }
  })
)
app.use(router)

app.mount('#app')
