<template>
  <div>
    <h2>Minerals</h2>
    <div v-for="mineral in availableMinerals" :key="mineral.id">
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
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("minerals", ["availableMinerals"]),
  },
  async created() {
    this.$store.dispatch("minerals/fetchMinerals");
  },
};
</script>
