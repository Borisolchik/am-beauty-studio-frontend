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
    phone.value = '+375 '
    cancelCode.value = ''

  } catch (err: any) {
    formError.value =
      err.response?.data?.error || 'Ошибка отмены записи'
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

  v$.value.$reset()
}
</script>


<template>
  <div class="cancel-booking">

    <h2>Отмена записи</h2>

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

      <p>
        {{ booking.date }}
      </p>

      <p>
        {{ booking.time }}
      </p>

      <p>
        {{ booking.service }}
      </p>

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