<script setup lang="ts">
import { ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { findBooking, cancelBooking } from '@/api/slots.api'

const emit = defineEmits<{
  (e: 'back'): void
}>()

const phone = ref('+375 ')
const cancelCode = ref('')

const formError = ref('')
const isLoading = ref(false)
const isCanceling = ref(false)
const successMessage = ref('')
const isFinished = ref(false)

const booking = ref<any>(null)

const phonePattern = helpers.regex(/^(\+375) \(\d{2}\) \d{3}-\d{2}-\d{2}$/)

const rules = {
  phone: { required, phonePattern },
  cancelCode: { required },
}

const v$ = useVuelidate(
  rules,
  {
    phone,
    cancelCode
  }
)

async function searchBooking() {
  formError.value = ''

  const valid = await v$.value.$validate()

  if (!valid) {
    formError.value = 'Пожалуйста, заполните данные корректно'
    return
  }

  isLoading.value = true

  try {
    const res = await findBooking({
      phone: phone.value,
      cancelCode: cancelCode.value
    })

    if (!res.data.found) {
      formError.value = 'Запись не найдена'
      return
    }

    booking.value = res.data.booking

  } catch (err: any) {
    formError.value =
      err.response?.data?.error || 'Ошибка поиска записи'
  } finally {
    isLoading.value = false
  }
}

async function cancel() {
  if (!booking.value) return

  formError.value = ''
  successMessage.value = ''
  isCanceling.value = true

  try {
    await cancelBooking({
      masterName: booking.value.masterName,
      date: booking.value.date,
      time: booking.value.time,
      phone: phone.value,
      cancelCode: cancelCode.value,
    })

    successMessage.value = 'Запись успешно отменена'

    booking.value = null
    isFinished.value = true

  } catch (err: any) {
    formError.value =
      err.response?.data?.error || 'Ошибка отмены записи'

    isFinished.value = true

  } finally {
    isCanceling.value = false
  }
}

function back() {
  emit('back')

  phone.value = '+375 '
  cancelCode.value = ''
  booking.value = null
  formError.value = ''
  successMessage.value = ''
  isFinished.value = false

  v$.value.$reset()
}
</script>

<template>
  <div class="cancel-booking">

    <h2>Отмена записи</h2>

    <div v-if="!isFinished">

      <div v-if="!booking">

        <p>
          Введите номер телефона и код отмены,
          который был показан после записи.
        </p>

        <input
          v-model="phone"
          v-maska
          data-maska="+375 (##) ###-##-##"
          placeholder="+375 (__) ___-__-__"
        />

        <input
          v-model="cancelCode"
          placeholder="Код отмены"
          maxlength="6"
        />

        <button
          class="booking-btn"
          :disabled="isLoading"
          @click="searchBooking"
        >
          {{ isLoading ? 'Поиск...' : 'Найти запись' }}
        </button>

      </div>


      <div v-else>

        <h3>Ваша запись:</h3>

        <p>{{ booking.date }}</p>
        <p>{{ booking.time }}</p>
        <p>{{ booking.service }}</p>
        <p>
          Мастер: {{ booking.masterName }}
        </p>

        <button
          class="cancel-btn"
          :disabled="isCanceling"
          @click="cancel"
        >
          {{ isCanceling ? 'Отмена...' : 'Отменить запись' }}
        </button>

      </div>

    </div>


    <div v-if="successMessage">
      {{ successMessage }}
    </div>

    <div v-if="formError">
      {{ formError }}
    </div>


    <button
      class="back-btn"
      @click="back"
    >
      Вернуться к записи
    </button>

  </div>
</template>

<style scoped>
.cancel-booking {
  max-width: 420px;
  margin: 0 auto;
}

.cancel-booking h2 {
  margin-bottom: 16px;
  margin-top: 0;
  font-size: 22px;
  color: #222;
}

.cancel-booking h3 {
  margin-bottom: 12px;
  margin-top: 0;
  font-size: 18px;
  color: #222;
}

.cancel-booking p {
  margin-bottom: 12px;
  color: #555;
  font-size: 14px;
  line-height: 1.5;
}

.cancel-booking input {
  width: 100%;
  padding: 12px;
  margin-bottom: 12px;
  border-radius: 10px;
  border: 1px solid #ddd;
  background: #fff;
  color: #333;
  font-size: 14px;
  box-sizing: border-box;
  transition: all 0.2s ease;
}

.cancel-booking input:focus {
  outline: none;
  border-color: #999;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.08);
}

.cancel-booking button {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #ddd;
  background: #fff;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-booking button:hover {
  border-color: #999;
  background: #f5f5f5;
}

.cancel-booking button:active {
  transform: scale(0.98);
}

.cancel-booking button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.12);
}

.cancel-booking button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.cancel-booking .cancel-btn {
  background: #111;
  color: #fff;
  border-color: #111;
}

.cancel-booking .cancel-btn:hover {
  background: #333;
  border-color: #333;
}

.cancel-booking .back-btn {
  margin-top: 16px;
}

.cancel-booking div[v-if="successMessage"] {
  margin-top: 16px;
  padding: 12px;
  border-radius: 10px;
  background: #f5f5f5;
  color: #222;
  border: 1px solid #ddd;
  font-size: 14px;
}

.cancel-booking div[v-if="formError"] {
  margin-top: 16px;
  padding: 12px;
  border-radius: 10px;
  background: #fafafa;
  color: #c12d5a;
  border: 1px solid #f0c8d6;
  font-size: 14px;
}

.cancel-booking > div {
  transition: all 0.2s ease;
}
</style>