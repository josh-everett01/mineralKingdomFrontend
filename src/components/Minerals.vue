<template>
  <div>
    <h2>Minerals</h2>
    <div v-for="mineral in minerals" :key="mineral.id">
      <img
        v-if="mineral.imageURL"
        :src="mineral.imageURL"
        alt="Mineral Image"
      />
      <h3>{{ mineral.name }}</h3>
      <p>{{ mineral.description }}</p>
      <p>${{ mineral.price }}</p>
    </div>
  </div>
</template>


<script>
import MineralService from '../services/MineralService';

export default {
  data() {
    return {
      minerals: [],
    };
  },
  async created() {
    try {
      this.minerals = await MineralService.getMinerals();
    } catch (error) {
      console.error('Error fetching minerals:', error);
    }
  },
};
</script>
