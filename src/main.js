import { createApp } from 'vue'
import './assets/css/global.css'
import store from './store'
import App from './App.vue'
import router from './router'
import { createVuetify } from 'vuetify'
import { plugin, defaultConfig, createInput } from '@formkit/vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

import TextFieldForm from './components/atoms/TextFieldForm.vue'
import SelectFieldForm from './components/atoms/SelectFieldForm.vue'
import PasswordFieldForm from './components/atoms/PasswordFieldForm.vue'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    themes: {
      moreliaTheme: {
        dark: true,
        colors: {
          primary: '#7cbc24',
          secondary: '#417100',
          warning: '#C8A434',
          error: '#CE4C4C',
        },
      },
    },
  },
})

const app = createApp(App)
app.use(router)
app.use(vuetify)
app.use(
  plugin,
  defaultConfig({
    inputs: {
      TextFieldForm: createInput(TextFieldForm),
      SelectFieldForm: createInput(SelectFieldForm),
      PasswordFieldForm: createInput(PasswordFieldForm),
    },
  }),
)
app.use(VueQueryPlugin)
app.use(store)
app.mount('#app')
