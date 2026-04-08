<script setup lang="ts">
import { ref, watch } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, minLength, helpers } from '@vuelidate/validators'
import { bookSlot } from '@/api/slots.api'

const props = defineProps<{
  show: boolean
  date: string | null
  time: string | null
  masterName: string
  serviceName: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const clientName = ref('')
const clientPhone = ref('+375 ')
const formError = ref('')
const isLoading = ref(false)
const isSuccess = ref(false)

const phonePattern = helpers.regex(/^(\+375) \(\d{2}\) \d{3}-\d{2}-\d{2}$/)

const rules = {
  clientName: { required, minLength: minLength(2) },
  clientPhone: { required, phonePattern },
}

const v$ = useVuelidate(rules, { clientName, clientPhone })

function close() {
  emit('close')

  clientName.value = ''
  clientPhone.value = '+375 '
  formError.value = ''
  isLoading.value = false
  isSuccess.value = false

  v$.value.$reset()
}

async function confirmBooking() {
  formError.value = ''

  const valid = await v$.value.$validate()
  if (!valid) {
    formError.value = 'Пожалуйста, заполните все поля корректно'
    return
  }

  isLoading.value = true

  try {
    await bookSlot({
      masterName: props.masterName,
      date: props.date!,
      time: props.time!,
      service: props.serviceName,
      client: clientName.value,
      phone: clientPhone.value
    })

    isSuccess.value = true
  } catch (err: any) {
    formError.value = err.response?.data?.error || 'Ошибка записи'
  } finally {
    isLoading.value = false
  }
}

watch(clientPhone, (val) => {
  if (!val.startsWith('+375')) {
    clientPhone.value = '+375 '
  }
})
</script>

<template>
  <div v-if="show" class="modal-overlay" @click.self="close">
    <div class="modal booking-form">
      <button class="close-btn" @click="close">Х</button>
      <div v-if="!isSuccess">
        <h4>Запись на {{ date }} в {{ time }}</h4>
        <input v-model="clientName" placeholder="Ваше имя" />
        <input v-model="clientPhone" v-maska data-maska="+375 (##) ###-##-##" />
        <button class="booking-btn" @click="confirmBooking" :disabled="isLoading">
          {{ isLoading ? 'Загрузка...' : 'Записаться' }}
        </button>

        <div v-if="formError">{{ formError }}</div>
      </div>

      <div v-else class="success-block">
        <div class="success-icon">✔</div>
        <h4>Вы записаны!</h4>
        <p>
          На <b>{{ date }}</b> в <b>{{ time }}</b>
        </p>
        <button class="booking-btn" @click="close">
          Ок
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  width: 100%;
  max-width: 360px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  position: relative;
  animation: modalFade 0.25s ease;
}

@keyframes modalFade {
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: #f5f5f5;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  color: #555;
  padding: 0;
}

.close-btn:hover {
  background: #eaeaea;
  color: #111;
}

.booking-form h4 {
  margin-bottom: 16px;
  font-size: 16px;
  color: #222;
}

.booking-form input {
  width: 100%;
  margin-bottom: 10px;
  padding: 10px 12px;
  box-sizing: border-box;
  border-radius: 10px;
  border: 1px solid #ddd;
  font-size: 14px;
  transition: all 0.2s ease;
  color: #222;
}

.booking-form input:hover {
  border-color: #999;
}

.booking-form input:focus {
  outline: none;
  border-color: #111;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.12);
}

.booking-form button {
  margin-top: 6px;
  padding: 10px;
  border-radius: 10px;
  border: none;
  background: #111;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.booking-form button:hover {
  background: #333;
}

.booking-form button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.booking-btn {
  width: 100%;
}

.booking-form div {
  margin-top: 10px;
  font-size: 13px;
  color: #555;
}

.booking-form button:active {
  transform: scale(0.97);
}

.success-block {
  text-align: center;
  padding: 10px 0;
}

.success-block p {
  color: #222;
  font-size: 20px;
}

.success-icon {
  width: 50px;
  height: 50px;
  margin: 0 auto 10px;
  background: #fff;
  color: #111;
  border: 1px solid #ddd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: bold;
}

.booking-btn {
  background: #111;
  color: #fff;
}
</style>