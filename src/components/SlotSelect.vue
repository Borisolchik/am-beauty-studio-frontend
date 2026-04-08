<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { getSlots } from '@/api/slots.api'
import BookingModal from './BookingModal.vue'

const props = defineProps<{
  masterName: string
  serviceName: string
}>()

const slots = ref<any[]>([])
const selectedDate = ref<string | null>(null)
const selectedTime = ref<string | null>(null)
const showModal = ref(false)

watch(
  () => [props.masterName, props.serviceName],
  async ([master, service]) => {
    if (!master) return

    const res = await getSlots(master, service)
    slots.value = res.data
  },
  { immediate: true }
)

const groupedSlots = computed(() => {
  const grouped: Record<string, string[]> = {}

  slots.value.forEach(slot => {
    if (!grouped[slot.date]) grouped[slot.date] = []
    grouped[slot.date].push(slot.time)
  })

  return grouped
})

function openModal(date: string, time: string) {
  selectedDate.value = date
  selectedTime.value = time
  showModal.value = true
}

function handleSuccess({ date, time }: { date: string; time: string }) {
  slots.value = slots.value.filter(
    s => !(s.date === date && s.time === time)
  )
}
</script>

<template>
  <div class="slots-list">
    <h3>Выберите слот:</h3>
    <div v-for="(times, date) in groupedSlots" :key="date">
      <strong>{{ date }}</strong>
      <button v-for="time in times" :key="time" @click="openModal(date, time)">
        {{ time }}
      </button>
    </div>

    <BookingModal :show="showModal" :date="selectedDate" :time="selectedTime" :master-name="masterName"
      :service-name="serviceName" @close="showModal = false" @success="handleSuccess" />
  </div>
</template>

<style scoped>
.slots-list h3 {
  margin-bottom: 12px;
  font-size: 18px;
  color: #222;
}

.slots-list>div {
  margin-bottom: 16px;
  padding: 12px;
  border-radius: 12px;
  background: #fafafa;
  border: 1px solid #e6e6e6;
  transition: all 0.2s ease;
}

.slots-list strong {
  display: block;
  margin-bottom: 10px;
  font-size: 14px;
  color: #333;
}

.slots-list button {
  margin: 4px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: #fff;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.slots-list button:hover {
  border-color: #999;
  color: #111;
  background: #f5f5f5;
}

.slots-list button:active {
  transform: scale(0.96);
}

.slots-list button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.12);
}

.slots-list button.selected {
  background: #111;
  color: #fff;
  border-color: #111;
}

.slots-list>div:hover {
  border-color: #bbb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}
</style>