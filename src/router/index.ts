import { createRouter, createWebHistory } from 'vue-router'
import BookingPage from '@/views/BookingPage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'booking',
      component: BookingPage,
    },
  ],
})

export default router