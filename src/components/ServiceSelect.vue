<script setup lang="ts">
import type { Service } from '@/types/service'

const props = defineProps<{
  services: Service[]
  selectedServiceId: number | null
}>()

const emit = defineEmits<{
  (e: 'select', id: number | null): void
}>()

function onChange(event: Event) {
  const target = event.target as HTMLSelectElement

  const id = target.value === '' ? null : Number(target.value)

  if (id === props.selectedServiceId) return

  emit('select', id)
}
</script>

<template>
  <div class="service-select">
    <label>Выберите услугу:</label>
    <select :value="selectedServiceId ?? ''" @change="onChange">
      <option value="">-- Выберите услугу --</option>
      <option v-for="service in services" :key="service.id" :value="service.id">
        {{ service.name }}
      </option>
    </select>
  </div>
</template>

<style scoped>
.service-select {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-family: system-ui, -apple-system, sans-serif;
  max-width: 300px;
}

.service-select label {
  font-size: 14px;
  color: #444;
  font-weight: 500;
}

.service-select select {
  padding: 10px 30px 10px 12px;
  border-radius: 10px;
  border: 1px solid #d0d0d0;
  background-color: #fff;
  font-size: 14px;
  color: #222;
  outline: none;
  cursor: pointer;
  transition: all 0.2s ease;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5 7.5L10 12.5L15 7.5' stroke='%23555' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
}

.service-select select:hover {
  border-color: #999;
}

.service-select select:focus {
  border-color: #111;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.15);
}

.service-select select:disabled {
  background-color: #f5f5f5;
  color: #aaa;
  cursor: not-allowed;
}
</style>