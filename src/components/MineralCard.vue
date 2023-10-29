<template>
  <div class="mineral-card">
    <img v-if="mineral.imageURL" :src="mineral.imageURL" alt="Mineral Image" />
    <h3>{{ mineral.name }}</h3>
    <p>{{ mineral.description }}</p>
    <p>${{ mineral.price }}</p>
  </div>
</template>

<script>
export default {
  props: {
    mineral: Object,
  },
};
</script>

<style scoped>
.mineral-card {
  border: 1px solid #ccc;
  padding: 1em;
  border-radius: 10px;
  overflow: hidden;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

img {
  width: 100%;
  object-fit: cover; /* Ensure the image covers the area without distorting aspect ratio */
  border-bottom: 1px solid #ccc;
  border-radius: 8px; /* Optional: add rounded corners to the image */
}
</style>
