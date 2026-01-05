<template>
  <div 
    class="slider"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <div class="slider-window">
      <img :src="images[currentIndex]" alt="Фото" class="slider-image" />
    </div>

    <div class="controls">
      <button @click="prev">‹</button>
      <button @click="next">›</button>
    </div>

    <div class="dots">
      <span
        v-for="(img, index) in images"
        :key="index"
        class="dot"
        :class="{ active: index === currentIndex }"
        @click="goTo(index)"
      ></span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

// Динамическая загрузка всех картинок из assets
const importImages = import.meta.glob('@/assets/images/*.{jpg,jpeg,png}', { eager: true })
const images = Object.values(importImages).map(mod => mod.default)

const currentIndex = ref(0)
const intervalTime = 4000
let timer = null

// Для свайпов
let startX = 0
const swipeThreshold = 50 // минимальное смещение для свайпа

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % images.length
}

const prev = () => {
  currentIndex.value = (currentIndex.value - 1 + images.length) % images.length
}

const goTo = (index) => {
  currentIndex.value = index
}

// Обработка свайпов пальцем
const onTouchStart = (e) => {
  startX = e.touches[0].clientX
}

const onTouchEnd = (e) => {
  const endX = e.changedTouches[0].clientX
  const diff = endX - startX

  if (diff > swipeThreshold) {
    prev() // свайп вправо
  } else if (diff < -swipeThreshold) {
    next() // свайп влево
  }
}

// // Автопрокрутка
// onMounted(() => {
//   timer = setInterval(next, intervalTime)
// })

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<style scoped>
.slider {
  margin: auto;
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  margin-top: 30px;
}

.slider-window {
  width: 100%;
  height: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.slider-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.5s ease-in-out;
}

.controls {
  display: flex;
  justify-content: space-between;
  position: absolute;
  top: 45%;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
}

button {
  background: rgba(0, 0, 0, 0.4);
  color: white;
  border: none;
  font-size: 28px;
  cursor: pointer;
  border-radius: 50%;
  width: 40px;
  height: 40px;
}

.dots {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}

.dot {
  height: 10px;
  width: 10px;
  margin: 0 5px;
  background-color: #bbb;
  border-radius: 50%;
  display: inline-block;
  cursor: pointer;
  transition: background-color 0.3s;
}

.dot.active {
  background-color: #333;
}
</style>
