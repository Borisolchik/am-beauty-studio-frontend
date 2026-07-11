<script setup lang="ts">
import { ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { required, helpers } from '@vuelidate/validators'
import { findBooking } from '@/api/slots.api'

const emit = defineEmits<{
  (e: 'back'): void
}>()

const phone = ref('+375 ')
const cancelCode = ref('')

const formError = ref('')
const isLoading = ref(false)

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