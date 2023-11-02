<template>
  <div>
    <h2>Featured Minerals</h2>
    <div class="minerals-container">
      <MineralCard
        v-for="mineral in availableMinerals"
        :key="mineral.id"
        :mineral="mineral"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import MineralCard from "./MineralCard.vue";

export default {
  components: {
    MineralCard,
  },
  computed: {
    ...mapGetters("minerals", ["availableMinerals"]),
  },
  created() {
    this.$store.dispatch("minerals/fetchMinerals");
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
