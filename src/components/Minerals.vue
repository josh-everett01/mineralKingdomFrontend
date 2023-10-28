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
    </div>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  data() {
    return {
      minerals: [],
    };
  },
  async created() {
    try {
      const response = await axios.get('https://localhost:7240/api/Minerals');
      this.minerals = response.data;
    } catch (error) {
      console.error('Error fetching minerals:', error);
    }
  },
};
</script>
