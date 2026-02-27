<template>
  <div class="service-select">
    <label for="service">Выберите услугу:</label>
    <div class="select-wrapper">
      <select id="service" @change="selectService($event)" :value="selectedServiceId">
        <option value="">-- Выберите услугу --</option>
        <option v-for="service in services" :key="service.id" :value="service.id">
          {{ service.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_API_URL;
const props = defineProps({ masterId: Number });
const emit = defineEmits(['serviceSelected']);
const services = ref([]);
const selectedServiceId = ref('');

watch(
  () => props.masterId,
  async (id) => {
    if (!id) {
      services.value = [];
      selectedServiceId.value = '';
      return;
    }

    try {
      const res = await axios.get(`${backendUrl}/api/services/by-master/${id}`);
      services.value = res.data;
      resetSelection();
    } catch (err) {
      console.error('Ошибка при загрузке услуг для мастера:', err);
      services.value = [];
    }
  },
  { immediate: true }
);

function resetSelection() {
  selectedServiceId.value = '';
  emit('serviceSelected', null);
}

function selectService(event) {
  selectedServiceId.value = event.target.value;
  const service = services.value.find(s => Number(s.id) === Number(event.target.value));
  emit('serviceSelected', service);
}
</script>

<style scoped>
.service-select {
  display: flex;
  flex-direction: column;
  margin: 0 auto 20px;
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
