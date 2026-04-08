<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  images: string[]
}>()

const currentIndex = ref(0)
let interval: ReturnType<typeof setInterval> | null = null

const currentImage = computed(() => props.images[currentIndex.value])

function next() {
  if (props.images.length === 0) return

  currentIndex.value =
    currentIndex.value < props.images.length - 1
      ? currentIndex.value + 1
      : 0
}

function prev() {
  if (props.images.length === 0) return

  currentIndex.value =
    currentIndex.value > 0
      ? currentIndex.value - 1
      : props.images.length - 1
}

function startAutoSlide() {
  stopAutoSlide()
  interval = setInterval(() => {
    next()
  }, 2000)
}

function stopAutoSlide() {
  if (interval) {
    clearInterval(interval)
    interval = null
  }
}

onMounted(() => {
  startAutoSlide()
})

onUnmounted(() => {
  stopAutoSlide()
})
</script>

<template>
  <div class="slider" @mouseenter="stopAutoSlide" @mouseleave="startAutoSlide">
    <div class="slider__image">
      <img :src="currentImage" alt="photo" />
    </div>

    <button class="slider__btn left" @click="prev">‹</button>
    <button class="slider__btn right" @click="next">›</button>
  </div>
</template>

<style scoped>
.slider {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: auto;
  border-radius: 16px;
  overflow: hidden;
}

.slider__image img {
  width: 100%;
  height: 320px;
  object-fit: cover;
  display: block;
}

.slider__btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.4);
  color: #fff;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
}

.slider__btn:hover {
  background: rgba(0,0,0,0.6);
}

.left {
  left: 15px;
}

.right {
  right: 15px;
}
</style>