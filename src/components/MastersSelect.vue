<template>
  <div class="master-select">
    <label for="master">Выберите мастера:</label>
    <div class="select-wrapper">
      <select id="master" @change="selectMaster($event)" :value="selectedMasterName">
        <option value="">-- Выберите мастера --</option>
        <option v-for="master in masters" :key="master.id" :value="master.name">
          {{ master.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_API_URL;
const emit = defineEmits(['masterSelected']);
const masters = ref([]);
const selectedMasterName = ref('');

onMounted(async () => {
  try {
    const res = await axios.get(`${backendUrl}/api/masters`); 
    masters.value = res.data;
  } catch (err) {
    console.error('Ошибка при получении мастеров:', err);
  }
});

function selectMaster(event) {
  const master = masters.value.find(m => m.name === event.target.value);
  selectedMasterName.value = event.target.value;
  emit('masterSelected', master);
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

/* Обертка для кастомной стрелки */
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
</style>
