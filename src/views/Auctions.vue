<template>
  <div class="auctions-page">
    <h1>Auctions</h1>
    <section>
      <h2>Current Auctions</h2>
      <div class="auctions-container">
        <AuctionCard
          v-for="auction in currentAuctions"
          :key="auction.id"
          :auction="auction"
        />
      </div>
    </section>
    <section>
      <h2>Future Auctions</h2>
      <div class="auctions-container">
        <AuctionCard
          v-for="auction in futureAuctions"
          :key="auction.id"
          :auction="auction"
        />
      </div>
    </section>
    <section>
      <h2>Past Auctions</h2>
      <div class="auctions-container">
        <AuctionCard
          v-for="auction in pastAuctions"
          :key="auction.id"
          :auction="auction"
        />
      </div>
    </section>
  </div>
</template>

<script>
import AuctionCard from "../components/AuctionCard.vue";
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    AuctionCard,
  },
  computed: {
    ...mapGetters("auctions", ["allAuctions"]),
    currentAuctions() {
      const now = new Date();
      console.log("Current time:", now.toISOString());

      return this.allAuctions.filter((auction) => {
        const startTime = new Date(auction.startTime);
        const endTime = new Date(auction.endTime);

        return startTime <= now && endTime > now;
      });
    },
    futureAuctions() {
      const now = new Date();
      console.log(
        this.allAuctions.filter((auction) => new Date(auction.startTime) > now)
      );
      return this.allAuctions.filter(
        (auction) => new Date(auction.startTime) > now
      );
    },
    pastAuctions() {
      const now = new Date();
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(now.getDate() - 10);

      return this.allAuctions.filter((auction) => {
        const endDate = new Date(auction.endTime);
        return endDate <= now && endDate > tenDaysAgo;
      });
    },
  },
  created() {
    this.fetchAuctions();
  },
  methods: {
    ...mapActions("auctions", ["fetchAuctions"]),
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
