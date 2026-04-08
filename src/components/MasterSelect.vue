<script setup lang="ts">
import { watch, onMounted } from 'vue'
import type { Master } from '@/types/master'

const props = defineProps<{
  masters: Master[]
  selectedMasterId: number | null
}>()

const emit = defineEmits<{
  (e: 'select', master: Master | null): void
}>()

const masterPhotos: Record<string, string> = {
  'master-1': '/images/masters/master-1.jpeg',
  'master-2': '/images/masters/master-2.jpeg'
}

function onSelect(master: Master) {
  emit('select', master)
}

onMounted(() => {
  if (props.masters.length === 1) {
    emit('select', props.masters[0])
  }
})

watch(
  () => props.masters,
  (newMasters) => {
    if (newMasters.length === 1) {
      emit('select', newMasters[0])
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="master-select">
    <div v-if="masters.length > 1">
      <div>Выберите мастера:</div>
      <div class="masters-list">
        <label v-for="master in masters" :key="master.id" class="master-card"
          :class="{ active: master.id === selectedMasterId }">
          <input type="checkbox" :checked="master.id === selectedMasterId" @change="onSelect(master)" />
          <img :src="masterPhotos[`master-${master.id}`]" alt="Фото мастера" class="master-photo" />
          <span class="master-name">
            {{ master.name }}
          </span>
        </label>
      </div>
    </div>

    <div v-else-if="masters.length === 1" class="single-master">
      <div class="master-card active">
        <img :src="masterPhotos[`master-${masters[0].id}`]" alt="Фото мастера" class="master-photo" />
        <span class="master-name">
          {{ masters[0].name }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.master-select {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 6px;
  font-weight: 500;
  color: #333;
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
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

select:hover {
  border-color: #999;
}

select:focus {
  outline: none;
  border-color: #111;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.15);
}

select::-ms-expand {
  display: none;
}

.masters-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}

.master-card {
  position: relative;
  border: 2px solid #e6e6e6;
  border-radius: 14px;
  padding: 10px;
  text-align: center;
  cursor: pointer;
  transition: 0.2s ease;
  background: #fafafa;
}

.master-card:hover {
  border-color: #999;
}

.master-card.active {
  border-color: #111;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
}

.master-card input {
  position: absolute;
  top: 8px;
  right: 8px;
  accent-color: #111;
}

.master-photo {
  width: 100%;
  max-width: 150px;
  height: auto;
  max-height: 150px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 6px;
}

.master-name {
  display: block;
  font-size: 0.95rem;
  font-weight: 500;
  color: #222;
}
</style>
