<template>
  <div class="login">
    <h2>Вход для мастера</h2>

    <input v-model="login" placeholder="Логин" />
    <input v-model="password" type="password" placeholder="Пароль" />

    <button @click="auth">Войти</button>

    <p v-if="error" class="error">Неверный логин или пароль</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const login = ref('')
const password = ref('')
const error = ref(false)

const auth = () => {
  if (login.value === 'admin' && password.value === '1234') {
    // Сохраняем айди мастера
    localStorage.setItem('admin_auth', 'true')
    localStorage.setItem('admin_id', '2')  // id мастера = 2
    router.push('/admin/panel')
  } else {
    error.value = true
  }
}
</script>

