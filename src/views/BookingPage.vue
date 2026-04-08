<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getMasters } from '@/api/masters.api'
import { getServices } from '@/api/services.api'

import type { Master } from '@/types/master'
import type { Service } from '@/types/service'

import MasterSelect from '@/components/MasterSelect.vue'
import ServiceSelect from '@/components/ServiceSelect.vue'
import SlotSelect from '@/components/SlotSelect.vue'
import SalonInfo from '@/components/SalonInfo.vue'
import ImageSlider from '@/components/ImageSlider.vue'

const images = Object.values(
  import.meta.glob('@/assets/images/*.{jpg,jpeg,png,webp}', {
    eager: true,
    import: 'default'
  })
) as string[]

const masters = ref<Master[]>([])
const services = ref<Service[]>([])
const slots = ref<{ date: string; time: string }[]>([])
const normalizeId = (id: string | number | null | undefined) => id ? Number(id) : null

const selectedMaster = ref<Master | null>(null)
const selectedService = ref<Service | null>(null)

onMounted(async () => {
  const res = await getMasters()
  masters.value = res.data
})

watch(selectedMaster, async (master) => {
  selectedService.value = null
  services.value = []

  if (!master) return

  const res = await getServices(master.id)

  services.value = res.data.map((s: any) => ({
    ...s,
    id: Number(s.id),
  }))
})

function handleMasterSelect(master: Master | null) {
  if (selectedMaster.value?.id === master?.id) {
    selectedMaster.value = null
  } else {
    selectedMaster.value = master
  }
}

function handleServiceSelect(id: number | null) {
  selectedService.value =
    services.value.find(s => s.id === id) || null
}

function handleSlotBooked({ date, time }: { date: string; time: string }) {
  slots.value = slots.value.filter(
    s => !(s.date === date && s.time === time)
  )
}
</script>

<template>
  <div class="booking-page">
    <div class="booking-container">
      <SalonInfo />
      <MasterSelect :masters="masters" :selected-master-id="normalizeId(selectedMaster?.id)"
        @select="handleMasterSelect" />

      <ServiceSelect v-if="selectedMaster" :services="services" :selected-service-id="selectedService?.id ?? null"
        @select="handleServiceSelect" />

      <SlotSelect v-if="selectedService" :slots="slots" :master-name="selectedMaster!.name"
        :service-name="selectedService!.name" @booked="handleSlotBooked" />

      <ImageSlider :images="images" />
    </div>
  </div>
</template>

<style scoped>
.booking-page {
  min-height: 100vh;
  background: #f6f7fb;
  display: flex;
  justify-content: center;
}

.booking-container {
  background: #ffffff;
  min-height: 100vh;
  max-width: 420px;
  width: 100%;
  box-sizing: border-box;
  padding: 16px 16px 50px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.booking-container>* {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 16px;
  padding: 12px;
  box-sizing: border-box;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
}
</style>