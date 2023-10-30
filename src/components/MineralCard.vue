<template>
  <router-link
    :to="{ name: 'mineral-detail', params: { id: mineral.id } }"
    class="mineral-link"
  >
    <div class="mineral-card">
      <img
        v-if="mineral.imageURL"
        :src="mineral.imageURL"
        alt="Mineral Image"
      />
      <h3>{{ mineral.name }}</h3>
      <p>{{ mineral.description }}</p>
      <p>${{ mineral.price }}</p>
      <div class="button-container">
        <router-link
          :to="{ name: 'mineral-detail', params: { id: mineral.id } }"
          class="button view-details"
          >View Details</router-link
        >
        <button @click="initiatePurchase(mineral.id)" class="button buy-now">
          Buy Now
        </button>
      </div>
    </div>
  </router-link>
</template>

<script>
export default {
  props: {
    mineral: Object,
  },
  methods: {
    initiatePurchase(mineralId) {
      // Logic to initiate purchase
      this.$router.push({ name: 'checkout', params: { mineralId } });
    },
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
.button-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.button {
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 12px;
  color: white;
  border: none;
}

.view-details {
  background-color: black;
  /* color: white;
  border: none; */
}

.buy-now {
  background-color: black;
  /* color: white;
  border: none; */
}
</style>
