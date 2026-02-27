<template>
  <div class="app-container">
    <h1 class="title">AM BEAUTY STUDIO</h1>
    <div class="title__by">BY ANNA BEDYLINA</div>

    <!-- <img class="logo" :src="logo" alt=""> -->

    <div class="address">Братская, 17</div>

    <a class="inst" href="https://www.instagram.com/am_beautyhall/" target="_blank">
      <img :src="inst" alt="Instagram" />
    </a>

    <div class="selectors">
      <MastersSelect @masterSelected="onMasterSelected" :selectedMaster="selectedMaster" />

      <ServicesSelect v-if="selectedMaster" :masterId="Number(selectedMaster.id)" @serviceSelected="onServiceSelected"
        :selectedService="selectedService" />
    </div>

    <SlotsList v-if="selectedMaster && selectedService" :masterName="selectedMaster.name"
      :selectedService="selectedService" @slotBooked="onSlotBooked" />
    <div v-if="showPopup" class="popup">
      {{ popupMessage }}
    </div>

    <ImageSlider />
  </div>
</template>


<script setup>
import { ref } from 'vue';
import ServicesSelect from '../components/ServicesSelect.vue';
import MastersSelect from '../components/MastersSelect.vue';
import SlotsList from '../components/SlotsList.vue';
import ImageSlider from '../components/ImageSlider.vue';
import inst from '@/assets/inst.png'
import logo from '@/assets/logo.jpg'

const selectedService = ref(null);
const selectedMaster = ref(null);
const popupMessage = ref('');
const showPopup = ref(false);

function onServiceSelected(service) {
  selectedService.value = service;
}

function onMasterSelected(master) {
  selectedMaster.value = master;
}

function onSlotBooked(slot) {
  popupMessage.value = `✅ Вы записаны на ${slot.date} ${slot.time}`;
  showPopup.value = true;

  setTimeout(() => {
    showPopup.value = false;
  }, 10000);
}

</script>

<style scoped>
.app-container {
  max-width: 405px;
  margin: 10px auto;
  padding: 20px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #333;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 500;
  color: #d6336c;
  margin-bottom: 10px;
}

.title__by {
  margin: 0 auto 30px;
  width: fit-content;
}

.logo {
  max-width: 200px;
    margin: 0 auto 20px;
    display: block;
}

.address {
  font-weight: 600;
  font-size: 20px;
  color: #000;
  margin-bottom: 30px;
  text-align: center;
}

.selectors {
  margin-bottom: 30px;
}

select:hover {
  border-color: #d6336c;
}

h3 {
  margin-top: 20px;
  color: #d6336c;
}

.date-block {
  margin-bottom: 16px;
}

.date-block button {
  margin: 4px 6px 4px 0;
  padding: 6px 12px;
  border: 1px solid #d6336c;
  background: #fff;
  color: #d6336c;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.date-block button:hover {
  background: #d6336c;
  color: #fff;
}

.booking-form {
  margin-top: 20px;
  padding: 16px;
  border: 1px solid #eee;
  border-radius: 12px;
  background: #f9f9f9;
}

.booking-form input {
  display: block;
  margin-bottom: 12px;
  padding: 10px;
  width: 100%;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.booking-form button {
  padding: 10px 18px;
  font-size: 1rem;
  background: #d6336c;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.booking-form button:hover {
  background: #c12d5a;
}

.popup {
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: #d6336c;
  color: #fff;
  padding: 16px 24px;
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  transition: all 0.3s ease;
}

.inst {
  display: block;
  max-width: 40px;
  margin: 0 auto 30px;
}

.inst img {
  width: 100%;
}
</style>
