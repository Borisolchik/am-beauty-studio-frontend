import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { vMaska } from 'maska'

const app = createApp(App)

app.use(router)
app.directive('maska', vMaska)

app.mount('#app')