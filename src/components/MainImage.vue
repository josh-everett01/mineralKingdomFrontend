<template>
  <div class="main-image">
    <img
      src="@/assets/Black Modern Crystal Orbit Logo.svg"
      alt="Mineral Kingdom"
    />
  </div>
</template>

<script>
export default {
  name: 'MainImage',
};
</script>

<style scoped>
.main-image img {
  margin: -25% auto;
  width: 85%; /* or any other size you prefer */
  display: block;
  /* margin: 0 auto; */
  z-index: 0;
  background-color: transparent;
}
</style>
