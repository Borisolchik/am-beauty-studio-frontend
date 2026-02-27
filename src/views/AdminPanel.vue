<template>
  <div>
    <h1>Админка</h1>

    <button @click="logout">Выйти</button>

    <hr />

    <h3>Управление слотами</h3>

    <button @click="addSlotPrompt">➕ Добавить слот</button>

    <div v-if="slots.length === 0">Слотов пока нет</div>

    <div v-for="slot in slots" :key="slot.date + slot.time" class="slot">
      <span>
        {{ slot.date }} {{ slot.time }} — {{ slot.active ? 'Открыт' : 'Закрыт' }}
      </span>

      <button @click="toggleSlot(slot)">
        {{ slot.active ? 'Закрыть' : 'Открыть' }}
      </button>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const slots = ref([])
const backendUrl = import.meta.env.VITE_API_URL

const masterId = localStorage.getItem('admin_id') || '2' // пока один мастер

// Загрузка слотов с backend
const loadSlots = async () => {
  try {
    const res = await axios.get(`${backendUrl}/admin/${masterId}/slots`)
    // преобразуем для фронта
    slots.value = res.data.map(s => ({
      ...s,
      active: true // все доступные слоты считаем открытыми
    }))
  } catch (err) {
    console.error('Ошибка загрузки слотов', err)
  }
}

onMounted(() => loadSlots())

// Закрыть / открыть слот
const toggleSlot = async (slot) => {
  try {
    await axios.patch(`${backendUrl}/admin/slots/toggle`, {
      masterName: slot.masterName || 'admin', // или masterId
      date: slot.date,
      time: slot.time
    })
    slot.active = !slot.active
  } catch (err) {
    console.error('Ошибка при смене статуса слота', err)
  }
}

// Добавить слот (через prompt)
const addSlotPrompt = async () => {
  const date = prompt('Дата (например 10.02.2026)')
  const time = prompt('Время (например 14:00)')
  if (!date || !time) return

  try {
    await axios.post(`${backendUrl}/admin/slots/add`, {
      masterName: 'admin', // или masterId
      date,
      time,
      service: 'Маникюр'
    })
    await loadSlots()
  } catch (err) {
    console.error('Ошибка добавления слота', err)
  }
}

// Выход
const logout = () => {
  localStorage.removeItem('admin_auth')
  localStorage.removeItem('admin_id')
  router.push('/admin')
}
</script>


