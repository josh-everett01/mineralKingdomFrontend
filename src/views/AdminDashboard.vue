<template>
  <div class="admin-dashboard">
    <h2>Admin Dashboard</h2>

    <!-- Instructions Section -->
    <div class="instructions">
      <h3>Instructions</h3>
      <ul>
        <li>
          <strong>Add a Mineral:</strong> Go to 'Add Mineral' to add a new
          mineral to the database. You will have the option to set it as an
          auction piece or a for sale piece.
        </li>
        <li>
          <strong>Add an Auction:</strong> After adding a mineral, you can
          create an auction. Go to 'Add Auction' and select the mineral you just
          added from the dropdown.
        </li>
      </ul>
      <p>Hit me up with any questions.</p>
    </div>

    <div class="tools-container">
      <div class="tool-card">
        <router-link :to="{ name: 'admin-add-mineral' }" class="card-link">
          <h3>Add Mineral</h3>
          <p>Add new minerals to the database for auctioning.</p>
        </router-link>
      </div>
      <!-- Manage Minerals Section -->
      <div class="tool-card">
        <h3>Manage Minerals</h3>
        <div class="minerals-list">
          <div
            v-for="mineral in minerals"
            :key="mineral.id"
            class="mineral-item"
          >
            <div class="mineral-content">
              <img
                v-if="mineral.imageURL"
                :src="mineral.imageURL"
                class="mineral-thumbnail"
                alt="Mineral Image"
              />
              <h4>Mineral Name: {{ mineral.name }}</h4>
              <h4>MineralID: {{ mineral.id }}</h4>
              <h4 v-if="mineral.status == 0">Status: Available</h4>
              <h4 v-if="mineral.status == 1">Status: Sold</h4>
              <h4 v-if="mineral.isAuctionItem">Sale or Auction: AUCTION</h4>
              <h4 v-else>Sale or Auction: SALE</h4>
              <!-- Add a link to the Edit Mineral page -->
              <button
                @click="navigateToEditMineral(mineral.id)"
                class="edit-button"
              >
                Edit
              </button>
              <!-- Delete Button -->
              <button
                @click="
                  confirmAndDeleteMineral(mineral.id, mineral.isAuctionItem)
                "
                class="delete-button"
              >
                Delete
              </button>
              <!-- Show Details Button for for-sale minerals -->
              <router-link
                v-if="!mineral.isAuctionItem"
                :to="{ name: 'mineral-detail', params: { id: mineral.id } }"
                class="details-button"
              >
                Show Details
              </router-link>

              <!-- Go to Auction Button for auction items -->
              <router-link
                v-if="
                  mineral.isAuctionItem && getAuctionIdByMineralId(mineral.id)
                "
                :to="{
                  name: 'auction-detail',
                  params: { id: getAuctionIdByMineralId(mineral.id) },
                }"
                class="auction-button"
              >
                Go to Auction
              </router-link>
            </div>
          </div>
        </div>
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
      <div class="tool-card">
        <div class="inquiry-dashboard-section">
          <AdminInquiryDashboard @inquirySelected="handleInquirySelected" />
        </div>
        <div v-if="selectedInquiry" class="inquiry-response-section">
          <InquiryResponseForm
            v-if="selectedInquiry"
            :inquiryId="selectedInquiry.id"
            @close="selectedInquiry = null"
          />
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
import AdminInquiryDashboard from "../components/AdminInquiryDashboard.vue";
import InquiryResponseForm from "../components/InquiryResponseForm.vue";
import MineralService from "../services/MineralService";
import { mapGetters } from "vuex";

export default {
  // components: {
  //   AddMineralForm,
  //   AddAuctionForm,
  //   UpdateAuctionForm,
  // },
  computed: {
    ...mapGetters({
      inquiries: "correspondence/inquiries",
    }),
  },
  components: {
    AdminInquiryDashboard,
    InquiryResponseForm,
  },
  data() {
    return {
      auctions: [],
      minerals: [],
      selectedInquiry: null,
    };
  },
  created() {
    this.fetchAuctions();
    this.fetchMinerals();
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
    handleInquirySelected(inquiryId) {
      this.selectedInquiry = this.inquiries.find(
        (inquiry) => inquiry.id === inquiryId
      );
    },
    handleInquiryResponded(inquiryId) {
      // Remove the responded inquiry from the list
      this.inquiries = this.inquiries.filter(
        (inquiry) => inquiry.id !== inquiryId
      );
      // Optionally, you can also refresh the inquiries list from the server
      // this.fetchAllInquiries();
    },
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
    getAuctionIdByMineralId(mineralId) {
      const auction = this.auctions.find(
        (auction) => auction.mineralId === mineralId
      );
      if (!auction) {
        return null;
      }
      return auction.id;
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
    async fetchMinerals() {
      try {
        const fetchedMinerals = await MineralService.getMinerals();
        // Sort the minerals by ID in descending order
        this.minerals = fetchedMinerals.sort((a, b) => b.id - a.id);
      } catch (error) {
        console.error("Failed to fetch minerals:", error);
      }
    },
    navigateToEditMineral(mineralId) {
      this.$router.push({
        name: "admin-edit-mineral",
        params: { id: mineralId },
      });
    },
    async confirmAndDeleteMineral(mineralId, isAuctionItem) {
      let confirmationMessage = `Are you sure you want to delete Mineral ID: ${mineralId}?`;
      let auctionId = null;

      if (isAuctionItem) {
        auctionId = this.getAuctionIdByMineralId(mineralId);
        if (auctionId) {
          confirmationMessage += ` This will also delete the associated Auction ID: ${auctionId}.`;
        } else {
          console.error(`No auction found for Mineral ID: ${mineralId}`);
          confirmationMessage += " No associated auction found.";
        }
      }

      if (confirm(confirmationMessage)) {
        try {
          if (isAuctionItem && auctionId) {
            await this.deleteAssociatedAuction(auctionId);
          }
          await MineralService.deleteMineral(mineralId);
          this.minerals = this.minerals.filter(
            (mineral) => mineral.id !== mineralId
          );
          alert(
            "Mineral deleted successfully." +
            // eslint-disable-next-line prettier/prettier
            (auctionId ? " Auction deleted successfully." : "")
          );
        } catch (error) {
          console.error("Error deleting mineral:", error);
          alert("Failed to delete mineral. Please try again.");
        }
      }
    },

    async deleteAssociatedAuction(auctionId) {
      if (!auctionId) {
        console.error("Auction ID is null, cannot delete auction.");
        return;
      }

      try {
        await AuctionService.deleteAuction(auctionId);
        console.log(`Auction with ID: ${auctionId} deleted successfully.`);
      } catch (error) {
        console.error(`Error deleting auction with ID: ${auctionId}:`, error);
        throw error; // Rethrow the error to handle it in the calling method
      }
    },
    mounted() {
      this.$root.$on("inquiryResponded", this.handleInquiryResponded);
    },
    beforeDestroy() {
      this.$root.$off("inquiryResponded", this.handleInquiryResponded);
    },
  },
};
</script>

<style scoped>
.admin-dashboard {
  padding: 16px;
}

.instructions {
  padding: 16px;
  margin-bottom: 20px; /* Spacing between instructions and tools */
}

ul {
  list-style-type: none;
}

.instructions h3 {
  margin-top: 0;
}

.instructions ol {
  margin-left: 20px;
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

.mineral-content {
  border: 1px solid #ccc; /* Light grey border */
  border-radius: 8px; /* Rounded corners */
  padding: 16px; /* Spacing inside the box */
  margin-bottom: 16px; /* Spacing between each mineral content box */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  background-color: #fff; /* White background */
}

.edit-button,
.delete-button,
.details-button,
.auction-button {
  background-color: black; /* Black background */
  color: white; /* White text */
  padding: 10px 20px; /* Padding */
  margin: 5px; /* Margin to separate buttons */
  border: none; /* No border */
  border-radius: 5px; /* Rounded edges */
  cursor: pointer; /* Pointer cursor on hover */
  text-decoration: none; /* Remove text decoration */
  display: inline-block; /* Align buttons inline */
}

.edit-button:hover,
.delete-button:hover,
.details-button:hover,
.auction-button:hover {
  background-color: #333; /* Darken background on hover */
}

/* Optional: Add a class for disabled buttons if needed */
.disabled-button {
  background-color: #ccc; /* Grey background for disabled state */
  color: #666; /* Dark grey text for disabled state */
  cursor: not-allowed; /* Not-allowed cursor for disabled state */
}

.minerals-list {
  display: flex;
  flex-direction: column;
  gap: 16px; /* Adjust the gap if necessary */
}

.mineral-thumbnail {
  width: 100px; /* Adjust as needed */
  height: 100px; /* Adjust as needed */
  object-fit: cover; /* This will cover the area without stretching the image */
  border-radius: 5px; /* Optional: if you want rounded corners */
  margin-right: 10px; /* Adjust as needed */
}

.mineral-content {
  /* Align items in a row */
  align-items: center; /* Center items vertically */
  /* ... rest of your code ... */
}

/* Responsive Tool Cards */
@media (max-width: 768px) {
  .tool-card {
    flex: 1 1 100%; /* Take full width on smaller screens */
    max-width: 100%; /* Ensure it doesn't exceed the screen width */
  }
}

/* Responsive Mineral Items */
@media (max-width: 768px) {
  .mineral-content {
    flex-direction: column; /* Stack items vertically */
    align-items: flex-start; /* Align items to the start */
  }

  .mineral-thumbnail {
    width: 80px; /* Adjust size for smaller screens */
    height: 80px; /* Adjust size for smaller screens */
    margin-bottom: 10px; /* Add some space below the image */
  }

  .edit-button,
  .delete-button {
    margin-top: 10px; /* Add some space above the buttons */
  }
}

/* General Layout Adjustments */
.tools-container {
  flex-direction: column; /* Stack cards vertically on smaller screens */
}

@media (min-width: 769px) {
  .tools-container {
    flex-direction: row; /* Align cards in a row on larger screens */
  }
}

/* Adjust padding and margins for smaller screens */
@media (max-width: 768px) {
  .admin-dashboard {
    padding: 8px;
  }

  .instructions,
  .tool-card {
    padding: 8px;
  }

  .mineral-content {
    padding: 8px;
  }
}
</style>
