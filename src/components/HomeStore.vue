<template>
  <div>
    <h2>Featured Minerals</h2>
    <div class="minerals-container">
      <MineralCard
        v-for="mineral in featuredMinerals"
        :key="mineral.id"
        :mineral="mineral"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import MineralCard from './MineralCard.vue';

export default {
  components: {
    MineralCard,
  },
  data() {
    return {
      featuredMinerals: [],
    };
  },
  async created() {
    try {
      const response = await axios.get('https://localhost:7240/api/Minerals');
      this.featuredMinerals = response.data; // Assuming all minerals are featured for now
    } catch (error) {
      console.error('Error fetching minerals:', error);
    }
  },
};
</script>

<style scoped>
.minerals-container {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  gap: 1em;
}
</style>