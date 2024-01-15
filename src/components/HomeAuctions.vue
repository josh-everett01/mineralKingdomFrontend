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
import AuctionCard from "../components/AuctionCard.vue";
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
        console.log(auctions);

        // Filter auctions to include only current or future ones
        const currentDate = new Date();
        this.featuredAuctions = auctions.filter(auction => {
          console.log("This is the auction: " + auction)
          const auctionDate = new Date(auction.endTime); // Replace 'endDate' with the actual property name
          return auctionDate >= currentDate;
        });
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
