<template>
  <div class="slots-list">
    <h3>Выберите слот:</h3>

    <div v-for="(times, date) in groupedSlots" :key="date" class="date-block">
      <strong>{{ formatDate(date) }}:</strong>
      <div class="times">
        <button v-for="time in times" :key="time" :class="{ selected: selectedDate === date && selectedTime === time }"
          @click="openModal(date, time)">
          {{ time }}
        </button>
      </div>
    </div>

    <!-- Попап -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal booking-form">
        <button class="close-btn" @click="closeModal">Х</button>
        <h4>Запись на {{ formatDate(selectedDate) }} в {{ selectedTime }}</h4>

        <div class="field">
          <input v-model="clientName" placeholder="Ваше имя" />
          <span v-if="v$.clientName.$error" class="error">
            {{ v$.clientName.required.$invalid ? 'Введите имя' : '' }}
            {{ v$.clientName.minLength.$invalid ? 'Имя должно быть не короче 2 символов' : '' }}
          </span>
        </div>

        <div class="field">
          <input v-model="clientPhone" v-mask="'+{375} (00) 000-00-00'" placeholder="(29) 111-22-33" />
          <span v-if="v$.clientPhone.$error" class="error">
            {{ v$.clientPhone.required.$invalid ? 'Введите телефон' : '' }}
            {{ v$.clientPhone.phonePattern.$invalid ? 'Неверный формат телефона' : '' }}
          </span>
        </div>

        <button class="book-btn" @click="confirmBooking" :disabled="isLoading">
          <span v-if="isLoading" class="spinner"></span>
          <span v-else>Записаться</span>
        </button>

        <div v-if="formError" class="form-message error">{{ formError }}</div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import axios from 'axios'
import useVuelidate from '@vuelidate/core'
import { required, minLength, helpers, numeric } from '@vuelidate/validators'

const props = defineProps({
  masterName: String,
  serviceId: String,
  selectedService: Object
})
const backendUrl = import.meta.env.VITE_API_URL;
const emit = defineEmits(['slotBooked'])

const slots = ref([])
const selectedDate = ref(null)
const selectedTime = ref(null)
const clientName = ref('')
const clientPhone = ref('')
const formError = ref('')
const isLoading = ref(false)
const showModal = ref(false)

function openModal(date, time) {
  selectedDate.value = date
  selectedTime.value = time
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  clientName.value = ''
  clientPhone.value = ''
  formError.value = ''
  v$.value.$reset()
}

const phonePattern = helpers.regex(/^(\+375) \(\d{2}\) \d{3}-\d{2}-\d{2}$/)

const rules = {
  clientName: { required, minLength: minLength(2) },
  clientPhone: { required, phonePattern },
}

const v$ = useVuelidate(rules, { clientName, clientPhone })

const groupedSlots = computed(() => {
  const grouped = {}
  slots.value.forEach(slot => {
    if (!grouped[slot.date]) grouped[slot.date] = []
    grouped[slot.date].push(slot.time)
  })
  return grouped
})

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
}

function selectTime(date, time) {
  selectedDate.value = date
  selectedTime.value = time
}

watch([() => props.masterName, () => props.serviceId], async ([master, service]) => {
  if (!master) return
  selectedDate.value = null
  selectedTime.value = null
  clientName.value = ''
  clientPhone.value = ''

  try {
    const res = await axios.get(`/api/slots/${encodeURIComponent(master)}`, {
      params: { service: props.selectedService?.name }
    })
    slots.value = res.data
  } catch (err) {
    console.error('Ошибка при получении слотов:', err)
  }
}, { immediate: true })

async function confirmBooking() {
  formError.value = ''

  const valid = await v$.value.$validate()
  if (!valid) {
    formError.value = 'Пожалуйста, заполните все поля корректно'
    return
  }

  isLoading.value = true

  try {
    await axios.post(`${backendUrl}/api/slots`, {
      masterName: props.masterName,
      date: selectedDate.value,
      time: selectedTime.value,
      service: props.selectedService.name,
      client: clientName.value,
      phone: clientPhone.value
    })

    emit('slotBooked', { date: selectedDate.value, time: selectedTime.value })

    slots.value = slots.value.filter(
      s => !(s.date === selectedDate.value && s.time === selectedTime.value)
    )

    selectedDate.value = null
    selectedTime.value = null
    clientName.value = ''
    clientPhone.value = ''
    v$.value.$reset()
    closeModal()
  } catch (err) {
    formError.value = err.response?.data?.error || 'Ошибка записи. Попробуйте еще раз.'
    console.error('Ошибка при бронировании слота:', err)
  } finally {
    isLoading.value = false
  }
}

</script>


<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal {
  background: white;
  padding: 24px;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  position: relative;
}

.close-btn {
  padding: 8px 12px;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  cursor: pointer;
  position: absolute;
  right: 20px;
  top: 20px;
}

.slots-list {
  margin-top: 20px;
}

.date-block {
  margin-bottom: 16px;
}

.times {
  display: flex;
  flex-wrap: wrap;
  margin-top: 6px;
}

.times button {
  margin: 4px;
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background: #fafafa;
  cursor: pointer;
  transition: all 0.2s ease;
}

.times button:hover {
  border-color: #d6336c;
  background: #ffe5f0;
}

.times button.selected {
  background: #d6336c;
  color: white;
  border-color: #d6336c;
}

.booking-form {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.booking-form input {
  margin-bottom: 12px;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.booking-form .book-btn {
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  background: #d6336c;
  color: white;
  cursor: pointer;
  transition: background 0.2s ease;
  font-size: 16px;
}

.booking-form .book-btn:hover {
  background: #c12d5a;
}

.error {
  color: #d6336c;
  font-size: 13px;
  margin-top: 4px;
  display: block;
}

.field {
  display: flex;
  flex-direction: column;
}

.field input {
  border-radius: 5px;
  font-size: 16px;
  padding: 12px 40px 12px 16px;
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  background-color: #fafafa;
  border: 1px solid #ccc;
  border-radius: 12px;
}

.form-message {
  margin-top: 12px;
  font-size: 14px;
}

.form-message.error {
  color: #d6336c;
}

.form-message.success {
  color: #28a745;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.5);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-right: 6px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
