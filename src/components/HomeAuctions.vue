<template>
  <div>
    <h2>Featured Auctions</h2>
    <div class="auctions-container">
      <AuctionCard
        v-for="auction in featuredAuctions"
        :key="auction.id"
        :auction="auction"
      />
    </div>
  </div>
</template>

<script>
// import { mapGetters } from "vuex";
import AuctionCard from "./AuctionCard.vue";
import AuctionService from "../services/AuctionService";

export default {
  components: {
    AuctionCard,
  },
  data() {
    return {
      featuredAuctions: [],
    };
  },
  created() {
    this.fetchFeaturedAuctions();
  },
  methods: {
    async fetchFeaturedAuctions() {
      try {
        const auctions = await AuctionService.getAuctions();
        // Assuming the API returns an array of auctions, filter or select featured auctions as needed
        console.log(auctions);
        this.featuredAuctions = auctions;
      } catch (error) {
        console.error("Error fetching auctions:", error);
      }
    },
  },
};
</script>

<style scoped>
.auctions-container {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  gap: 1em;
}
</style>
