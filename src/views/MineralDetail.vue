<template>
  <div v-if="currentMineral">
    <h2>{{ currentMineral.name }}</h2>
    <img
      v-if="currentMineral.imageURL"
      :src="currentMineral.imageURL"
      alt="Mineral Image"
      class="mineral-image"
    />
    <p>{{ currentMineral.description }}</p>
    <p>${{ currentMineral.price }}</p>
    <button @click="buyNow" class="buy-now-button">BUY NOW</button>
  </div>
  <div v-else-if="isLoading">Loading...</div>
  <div v-else>
    <p>Error loading mineral details.</p>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  computed: {
    ...mapGetters('minerals', ['currentMineral', 'isLoading', 'error']),
  },
  methods: {
    ...mapActions('minerals', ['fetchMineral']),
    buyNow() {
      console.log('Initiating purchase for:', this.currentMineral.name);
      // Here you will integrate with Stripe or another payment processor
    },
  },
  watch: {
    error(newValue) {
      if (newValue) {
        console.error(newValue);
        setTimeout(() => {
          this.$router.push("/");
        }, 10000);
      }
    }
  },
  async created() {
    try {
      await this.fetchMineral(this.id);
      if (this.error) {
        console.error('Error loading mineral details:', this.error);
        this.$router.push("/");
      }
    } catch (error) {
      console.error('Error in created hook:', error);
      this.$router.push("/");
    }
  },
};
</script>

<style scoped>
.mineral-image {
  width: 350px; /* Adjust the width as needed */
  height: 350px; /* Adjust the height as needed */
  object-fit: cover;
  border-radius: 10px; /* Rounded edges */
  margin-bottom: 10px; /* Optional: add some space below the image */
}

.buy-now-button {
  background-color: black;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}
.buy-now-button:hover {
  background-color: #333;
}
</style>
