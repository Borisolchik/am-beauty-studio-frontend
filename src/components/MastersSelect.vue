<template>
  <div class="master-select">
    <label>Выберите мастера:</label>

    <div class="masters-list">
      <label
        v-for="master in masters"
        :key="master.id"
        class="master-card"
        :class="{ active: selectedMasterId === master.id }"
      >
        <input
          type="checkbox"
          :checked="selectedMasterId === master.id"
          @change="selectMaster(master)"
        />

        <img
          :src="masterPhotos[`master-${master.id}`]"
          alt="Фото мастера"
          class="master-photo"
        />

        <span class="master-name">{{ master.name }}</span>
      </label>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import axios from 'axios'

const backendUrl = import.meta.env.VITE_API_URL
const emit = defineEmits(['masterSelected'])

const masters = ref([])
const selectedMasterId = ref(null)

const masterPhotos = {
  'master-1': '/images/masters/master-1.jpg',
  'master-2': '/images/masters/master-2.jpg'
}

onMounted(async () => {
  try {
    const res = await axios.get(`${backendUrl}/api/masters`)
    masters.value = res.data
  } catch (err) {
    console.error('Ошибка при получении мастеров:', err)
  }
})

function selectMaster(master) {
  if (selectedMasterId.value === master.id) {
    selectedMasterId.value = null
    emit('masterSelected', null)
  } else {
    selectedMasterId.value = master.id
    emit('masterSelected', master)
  }
}
</script>

<style scoped>
.master-select {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 6px;
  font-weight: 500;
  color: #d6336c;
  font-size: 1rem;
}

.select-wrapper {
  position: relative;
  width: 100%;
}

.select-wrapper::after {
  content: '';
  position: absolute;
  top: 45%;
  right: 20px;
  width: 10px;
  height: 10px;
  border-right: 2px solid #333;
  border-bottom: 2px solid #333;
  transform: translateY(-50%) rotate(45deg);
  pointer-events: none;
}

select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;

  width: 100%;
  padding: 12px 40px 12px 16px;
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  background-color: #fafafa;
  border: 1px solid #ccc;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

/* Hover и focus */
select:hover {
  border-color: #d6336c;
}

select:focus {
  outline: none;
  border-color: #c12d5a;
  box-shadow: 0 0 5px rgba(214, 51, 108, 0.3);
}

/* Для IE/Edge стрелка не отображается дважды */
select::-ms-expand {
  display: none;
}

.master-select {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 10px;
  font-weight: 500;
  color: #d6336c;
}

.masters-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.master-card {
  position: relative;
  border: 2px solid #eee;
  border-radius: 14px;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  transition: 0.2s ease;
  background: #fafafa;
}

.master-card:hover {
  border-color: #d6336c;
}

.master-card.active {
  border-color: #d6336c;
  box-shadow: 0 0 8px rgba(214, 51, 108, 0.3);
}

.master-card input {
  position: absolute;
  top: 8px;
  right: 8px;
}

.master-photo {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 6px;
}

.master-name {
  display: block;
  font-size: 0.95rem;
  font-weight: 500;
  color: #333;
}
</style>
