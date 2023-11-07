<template>
  <div class="auctions-page">
    <h1>Auctions</h1>
    <div class="auctions-container">
      <AuctionCard
        v-for="auction in allAuctions"
        :key="auction.id"
        :auction="auction"
      />
    </div>
  </div>
</template>

<script>
import AuctionCard from "../components/AuctionCard.vue";
import AuctionService from "../services/AuctionService";

export default {
  components: {
    AuctionCard,
  },
  data() {
    return {
      allAuctions: [],
    };
  },
  created() {
    this.fetchAllAuctions();
  },
  methods: {
    async fetchAllAuctions() {
      try {
        this.allAuctions = await AuctionService.getAuctions();
      } catch (error) {
        console.error("Error fetching auctions:", error);
      }
    },
  },
};
</script>

<style scoped>
.auctions-page {
  padding: 2em;
}

.auctions-container {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  gap: 1em;
}
</style>
