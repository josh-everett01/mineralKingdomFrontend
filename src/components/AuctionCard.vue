<template>
  <div class="auction-card">
    <h3>{{ auction.title }}</h3>
    <!-- Image gallery -->
    <div
      v-if="this.mineral"
      class="image-gallery"
      @mouseover="showControls = true"
      @mouseleave="showControls = false"
    >
      <button
        v-if="showControls"
        class="gallery-control prev"
        @click="prevImage"
      >
        &lt;
      </button>
      <img :src="activeImage" alt="Mineral Image" class="gallery-image" />
      <button
        v-if="showControls"
        class="gallery-control next"
        @click="nextImage"
      >
        &gt;
      </button>
    </div>
    <div v-if="this.mineral" class="thumbnails">
      <img
        v-for="(url, index) in allImages"
        :key="index"
        :src="url"
        :alt="`Thumbnail ${index + 1}`"
        class="thumbnail-image"
        :class="{ active: activeImageIndex === index }"
        @click="setActiveImage(index)"
      />
    </div>
    <!-- Video player -->
    <video v-if="mineral && mineral.videoURL" controls class="mineral-video">
      <source :src="mineral.videoURL" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <p>{{ auction.description }}</p>
    <div class="auction-details">
      <span>Starting Price: ${{ auction.startingPrice }}</span>
      <div
        v-if="!auctionHasEnded && currentHighestBid"
        class="current-highest-bid"
      >
        <p>Current Highest Bid: ${{ currentHighestBid.amount.toFixed(2) }}</p>
      </div>
      <div v-if="auctionHasEnded && currentHighestBid">
        <p>
          Winning Bid: ${{
            currentHighestBid && currentHighestBid.amount
              ? currentHighestBid.amount.toFixed(2)
              : "0.00"
          }}
        </p>
      </div>
      <span v-if="auctionHasEnded">
        Ended on: {{ new Date(auction.endTime).toLocaleString() }}
      </span>
      <span v-else>
        Ends on: {{ new Date(auction.endTime).toLocaleString() }}
      </span>
    </div>
    <div class="button container">
      <router-link
        :to="{ name: 'auction-detail', params: { id: auction.id } }"
        class="button view-details"
      >
        View Details
      </router-link>
    </div>
    <!-- <div v-if="showBidding" class="bid-section bid-section-active">
      <div class="bid-section">
        <span v-if="currentHighestBid">
          Current Bid: ${{ currentHighestBid.amount }}
        </span>
        <span v-else>{{ noBidsMessage }}</span>
        <input
          type="number"
          v-model.number="newBidAmount"
          :min="
            currentHighestBid
              ? currentHighestBid.amount + bidIncrement
              : auction.startingPrice
          "
          placeholder="Enter your bid"
        />
        <button @click="placeBid" class="bid-button">Bid</button>
      </div>
    </div> -->
    <!-- Add more details and styling as needed -->
  </div>
</template>

<script>
// import AuctionService from "../services/AuctionService";
import MineralService from "../services/MineralService";
import BidService from "../services/BidService";
import { mapGetters } from "vuex";

export default {
  props: {
    auction: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      mineral: null,
      activeImageIndex: 0,
      showControls: false,
      currentHighestBid: { amount: this.auction.startingPrice },
      newBidAmount: 0,
      bidIncrement: 10, // Set your required bid increment here
      showBidding: false,
    };
  },
  computed: {
    ...mapGetters({
      currentUser: "getUser", // This maps this.currentUser to your Vuex getter getUser
    }),
    allImages() {
      return this.mineral
        ? [this.mineral.imageURL, ...this.mineral.imageURLs].filter(Boolean)
        : [];
    },
    activeImage() {
      return this.allImages[this.activeImageIndex];
    },
    auctionHasEnded() {
      return new Date() > new Date(this.auction.endTime);
    },
  },
  methods: {
    async fetchCurrentHighestBid() {
      // Fetch the current highest bid for this auction
      // Fetch the current highest bid for this auction
      try {
        const response = await BidService.getCurrentWinningBidForAuction(
          this.auction.id
        );
        if (response && response.winningBid) {
          this.currentHighestBid = response.winningBid;
        } else {
          // If there is no winning bid, set the current highest bid to null
          this.currentHighestBid = null;
          // You can also set a flag or a message to indicate there are no bids
          this.noBidsMessage = response.message;
        }
      } catch (error) {
        console.error("Error fetching current highest bid:", error);
      }
    },
    async fetchMineralData() {
      console.log("MineralID from AuctionCard: " + this.auction.mineralId);
      if (this.auction.mineralId) {
        try {
          this.mineral = await MineralService.getMineral(
            this.auction.mineralId
          );
          console.log("From AuctionCard" + this.mineral);
        } catch (error) {
          console.error("Error fetching mineral data:", error);
        }
      }
    },
    toggleBidding(event) {
      event.stopPropagation(); // Prevent click from bubbling up
      this.showBidding = !this.showBidding;
      console.log(
        "toggleBidding called, showBidding is now:",
        this.showBidding
      );
    },

    async placeBid() {
      // Check if there is a current highest bid before comparing amounts
      const minimumBid = this.currentHighestBid
        ? this.currentHighestBid.amount + this.bidIncrement
        : this.auction.startingPrice;

      if (this.newBidAmount <= minimumBid) {
        alert(`Your bid must be at least $${minimumBid}.`);
        return;
      }
      if (this.currentUser) {
        try {
          // Await the createBid call without assigning its result to a variable
          await BidService.createBid({
            amount: this.newBidAmount,
            bidTime: new Date().toISOString(),
            userId: this.currentUser.id,
            auctionId: this.auction.id,
          });

          // Update the currentHighestBid with the new bid amount
          this.currentHighestBid = { amount: this.newBidAmount };
          this.checkAndExtendAuctionTime();
        } catch (error) {
          console.error("Error placing bid:", error);
          alert("There was an error placing your bid. Please try again.");
        }
      } else {
        alert("You must be logged in to place a bid.");
      }
    },
    checkAndExtendAuctionTime() {
      // Implement the logic to check the time and extend the auction
      // This is a placeholder for your actual implementation
      const auctionEndTime = new Date(this.auction.endTime);
      const now = new Date();
      const timeLeft = auctionEndTime - now;
      const fiveMinutes = 5 * 60 * 1000;
      if (timeLeft < fiveMinutes) {
        // Extend the auction time as needed
        this.auction.endTime = new Date(
          now.getTime() + fiveMinutes
        ).toISOString();
        // Update the auction end time on the server
        // This would be another method in your AuctionService
      }
    },
    nextImage() {
      if (this.activeImageIndex < this.allImages.length - 1) {
        this.activeImageIndex++;
      } else {
        this.activeImageIndex = 0;
      }
    },
    prevImage() {
      if (this.activeImageIndex > 0) {
        this.activeImageIndex--;
      } else {
        this.activeImageIndex = this.allImages.length - 1;
      }
    },
    setActiveImage(index) {
      this.activeImageIndex = index;
    },
  },
  async created() {
    this.fetchMineralData();
    await this.fetchCurrentHighestBid();
  },
};
</script>

<style scoped>
.auction-card {
  border: 1px solid #ccc;
  padding: 1em;
  border-radius: 10px;
  overflow: hidden;
  max-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.button-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px; /* Add space between buttons and bid section */
}

.center-button {
  justify-content: center;
}

.bid-section {
  transition: max-height 0.3s ease-out;
  overflow: hidden;
  max-height: 0; /* Initially hide the bid section */
}

/* When bidding is shown, we set a max-height greater than its content's height */
.bid-section-active {
  max-height: 500px; /* Adjust as needed based on content */
}

.button {
  padding: 10px 20px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 12px;
  color: white;
  border: none;
  background-color: black; /* Change as needed */
}

.image-gallery {
  position: relative;
}

.gallery-image {
  max-width: 100%;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 10px;
}

.thumbnail-image {
  width: 50px; /* Adjust size as needed */
  height: 50px; /* Adjust size as needed */
  object-fit: cover;
  margin-right: 5px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.thumbnail-image {
  width: 50px; /* Adjust size as needed */
  height: 50px; /* Adjust size as needed */
  object-fit: cover;
  margin-right: 5px;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.thumbnail-image.active,
.thumbnail-image:hover {
  opacity: 1;
}

.mineral-video {
  width: 100%; /* Responsive width */
  margin-top: 20px;
  border-radius: 8px; /* Optional: add rounded corners to the video */
}

.gallery-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  cursor: pointer;
}

.prev {
  left: 10px;
}

.next {
  right: 10px;
}

.thumbnails {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
/* Add any additional styles specific to the AuctionCard */
</style>
