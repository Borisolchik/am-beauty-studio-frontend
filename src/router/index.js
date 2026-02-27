import { createRouter, createWebHistory } from 'vue-router'
import Main from '@/views/Main.vue'
import AdminLogin from '@/views/AdminLogin.vue'
import AdminPanel from '@/views/AdminPanel.vue'

const routes = [
  {
    path: '/',
    component: Main
  },
  {
    path: '/admin',
    component: AdminLogin
  },
  {
    path: '/admin/panel',
    component: AdminPanel,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuth = localStorage.getItem('admin_auth')

  if (to.meta.requiresAuth && !isAuth) {
    next('/admin')
  } else {
    next()
  }
})

export default router
