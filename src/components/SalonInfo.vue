<script setup lang="ts">
</script>

<template>
  <div class="salon-info">
    <video class="bg-video" autoplay muted loop playsinline>
      <source src="../assets/video/IMG_4973.MOV" type="video/mp4" />
    </video>

    <div class="overlay"></div>

    <div class="content">
      <h1 class="title">AM Beauty Studio</h1>
      <h2 class="sub-title">BY ANNA BEDYLINA</h2>
      <p class="address">Льва Сапеги, 5</p>
    </div>
  </div>
</template>

<style scoped>
.salon-info {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: hidden;
  color: #fff;
}

.bg-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  filter: grayscale(100%) contrast(1.1);
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 1;
}

.content {
  position: relative;
  z-index: 2;
  padding: 20px;
}

.title {
  text-transform: uppercase;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 2px;
  color: #fff;
  margin-bottom: 8px;
}

.sub-title {
  text-transform: uppercase;
  font-size: 0.9rem;
  font-weight: 400;
  letter-spacing: 3px;
  color: #ddd;
  margin-bottom: 20px;
}

.address {
  font-size: 1rem;
  font-weight: 500;
  color: #ccc;
}
</style>