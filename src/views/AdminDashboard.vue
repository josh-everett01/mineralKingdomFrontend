<template>
  <div class="admin-dashboard">
    <h2>Admin Dashboard</h2>
    <div class="tools-container">
      <div class="tool-card">
        <router-link :to="{ name: 'admin-add-mineral' }" class="card-link">
          <h3>Add Mineral</h3>
          <p>Add new minerals to the database for auctioning.</p>
        </router-link>
      </div>
      <div class="tool-card">
        <router-link :to="{ name: 'admin-add-auction' }" class="card-link">
          <h3>Add Auction</h3>
          <p>Create a new auction for buyers to place their bids.</p>
        </router-link>
      </div>
      <div class="tool-card">
        <h3>Update Auction</h3>
        <div class="auctions-list">
          <div
            v-for="auction in auctions"
            :key="auction.id"
            class="auction-item"
          >
            <router-link
              :to="{ name: 'admin-update-auction', params: { id: auction.id } }"
              class="auction-link"
            >
              <div class="auction-content">
                <h4>{{ auction.title }}</h4>
                <p>Start: {{ new Date(auction.startTime).toLocaleString() }}</p>
                <p>End: {{ new Date(auction.endTime).toLocaleString() }}</p>
                <p>
                  Highest Bid:
                  {{
                    auction.currentHighestBid &&
                    auction.currentHighestBid.winningBid
                      ? `$${auction.currentHighestBid.winningBid.amount}`
                      : "No bids yet"
                  }}
                </p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import AddMineralForm from "../components/AddMineralForm.vue";
// import AddAuctionForm from "../components/AddAuctionForm.vue";
// import UpdateAuctionForm from "../components/UpdateAuctionForm.vue";
import AuctionService from "../services/AuctionService";
import BidService from "../services/BidService";

export default {
  // components: {
  //   AddMineralForm,
  //   AddAuctionForm,
  //   UpdateAuctionForm,
  // },
  data() {
    return {
      auctions: [],

    };
  },
  created() {
    this.fetchAuctions();
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (vm.$store.getters.isAdmin) {
        next();
      } else {
        next("/");
      }
    });
  },
  methods: {
    async fetchAuctions() {
      try {
        const fetchedAuctions = await AuctionService.getAuctions();
        this.auctions = await Promise.all(
          fetchedAuctions.map(async (auction) => {
            const currentHighestBid =
              await BidService.getCurrentWinningBidForAuction(auction.id);
            auction.currentHighestBid = currentHighestBid;
            console.log("Current Highest Bid: " + auction.currentHighestBid);
            return auction;
          })
        );
      } catch (error) {
        console.error("Failed to fetch auctions:", error);
      }
    },
    formatDate(dateString) {
      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
  },
};
</script>

<style scoped>
.admin-dashboard {
  padding: 16px;
}

.tools-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.tool-card {
  flex: 1;
  min-width: 300px; /* Adjust as needed */
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-link {
  text-decoration: none;
  color: inherit;
}

.auctions-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.auction-item {
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  transition: box-shadow 0.3s;
}

.auction-item:hover {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.auction-link {
  text-decoration: none;
  color: inherit;
  display: block;
  padding: 10px;
}

.auction-content h4 {
  margin-top: 0;
}
</style>
