import { createApp } from 'vue'
import App from './App.vue'
import IMask from 'imask'

const app = createApp(App)

app.directive('mask', {
  mounted(el, binding) {
    IMask(el, { mask: binding.value })
  },
})

app.mount('#app')
