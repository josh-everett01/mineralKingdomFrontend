<template>
  <div class="auction-details">
    <!-- Image gallery -->
    <h3 v-if="mineral">{{ mineral.name }}</h3>
    <div
      v-if="mineral"
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
    <div v-if="mineral" class="thumbnails">
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
    <p v-if="auction">{{ auction.description }}</p>
    <p v-if="!auction">Loading auction details...</p>
    <div class="auction-info">
      <span v-if="auction">Starting Price: ${{ auction.startingPrice }}</span>
      <span v-if="auction"
        >Ends on: {{ new Date(auction.endTime).toLocaleString() }}</span
      >
    </div>
    <!-- Bidding section -->
    <div class="bid-section">
      <span v-if="currentHighestBid">
        Current Bid: ${{ currentHighestBid.amount }}
      </span>
      <span v-else>No bids yet</span>
      <input
        class="BidpriceField"
        type="number"
        v-model.number="newBidAmount"
        :min="
          auction
            ? currentHighestBid
              ? currentHighestBid.amount + bidIncrement
              : auction.startingPrice
            : 0
        "
        placeholder="Enter your bid"
      />
      <button @click="placeBid" class="bid-button">Place Bid</button>
    </div>
    <div class="auction-table">
      <div class="table-row">
        <div class="table-cell">Starting Price:</div>
        <div class="table-cell">${{ auction.startingPrice }}</div>
      </div>
      <div class="table-row">
        <div class="table-cell">Current Highest Bid:</div>
        <div class="table-cell">
          ${{ currentHighestBid.amount }} by
          {{ currentHighestBid.username || "Loading..." }}
        </div>
      </div>
      <div class="table-row">
        <div class="table-cell">Bid Increment:</div>
        <div class="table-cell">${{ bidIncrement }}</div>
      </div>
      <div class="table-row">
        <div class="table-cell">Auction Ends In:</div>
        <div class="table-cell">{{ countdown }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import MineralService from "../services/MineralService";
import BidService from "../services/BidService";
import AuctionService from "../services/AuctionService";
import UserService from "../services/UserService";

export default {
  data() {
    return {
      mineral: null,
      activeImageIndex: 0,
      showControls: false,
      currentHighestBid: null,
      newBidAmount: 0,
      bidIncrement: 10, // Set your required bid increment here
      showBidding: true, // Show bidding section by default
      auction: null,
      countdown: "",
    };
  },
  computed: {
    allImages() {
      return this.mineral
        ? [this.mineral.imageURL, ...this.mineral.imageURLs].filter(Boolean)
        : [];
    },
    activeImage() {
      return this.allImages[this.activeImageIndex];
    },
  },
  methods: {
    async fetchCurrentHighestBid() {
      // Fetch the current highest bid for this auction
      try {
        const response = await BidService.getCurrentWinningBidForAuction(
          this.auction.id
        );
        if (response && response.winningBid) {
          this.currentHighestBid = response.winningBid;
          const user = await UserService.getUserById(this.currentHighestBid.userId);
          console.log(user);
          this.currentHighestBid.username = user.username;
        } else {
          this.currentHighestBid = null;
        }
      } catch (error) {
        console.error("Error fetching current highest bid:", error);
      }
    },
    async fetchMineralData() {
      console.log("Mineral Data in AuctionDetail: " + this.auction);
      if (this.auction.mineralId) {
        try {
          this.mineral = await MineralService.getMineral(
            this.auction.mineralId
          );
        } catch (error) {
          console.error("Error fetching mineral data:", error);
        }
      }
    },
    async placeBid() {
      const minimumBid = this.currentHighestBid
        ? this.currentHighestBid.amount + this.bidIncrement
        : this.auction.startingPrice;

      if (this.newBidAmount < minimumBid) {
        alert(`Your bid must be at least $${minimumBid}.`);
        return;
      }

      try {
        await BidService.createBid({
          amount: this.newBidAmount,
          bidTime: new Date().toISOString(),
          userId: 1, // Replace with actual user ID
          auctionId: this.auction.id,
        });

        this.currentHighestBid = { amount: this.newBidAmount };
        // Optionally, refresh the bid data
      } catch (error) {
        console.error("Error placing bid:", error);
        alert("There was an error placing your bid. Please try again.");
      }
    },
    nextImage() {
      this.activeImageIndex =
        (this.activeImageIndex + 1) % this.allImages.length;
    },
    prevImage() {
      this.activeImageIndex =
        (this.activeImageIndex - 1 + this.allImages.length) %
        this.allImages.length;
    },
    setActiveImage(index) {
      this.activeImageIndex = index;
    },
    updateCountdown() {
      const endTime = new Date(this.auction.endTime).getTime();
      const now = Date.now();
      const distance = endTime - now;

      if (distance < 0) {
        this.countdown = "Auction has ended";
        clearInterval(this.countdownInterval);
        return;
      }

      // Time calculations for days, hours, minutes and seconds
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Output the result in a string format
      this.countdown = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    },
  },
  async created() {
    const auctionId = this.$route.params.id; // Get the id from the route parameters
    try {
      const auctionData = await AuctionService.getAuction(auctionId);
      this.auction = auctionData; // Set the auction data
      await this.fetchMineralData(); // Now fetch the mineral data
      await this.fetchCurrentHighestBid(); // And the current highest bid
    } catch (error) {
      console.error("Error fetching auction details:", error);
    }
  },
  mounted() {
    this.countdownInterval = setInterval(this.updateCountdown, 1000);
  },
  beforeDestroy() {
    clearInterval(this.countdownInterval);
  },
};
</script>

<style scoped>
.auction-details {
  max-width: 75%; /* Match the width of the mineral image */
  margin: auto; /* Center the container */
  padding: 2em;
  border-radius: 10px; /* Rounded edges */
  background: #fff; /* Assuming a light theme, adjust as needed */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Optional: add some shadow for depth */
}

.gallery-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  cursor: pointer;
  padding: 10px; /* Adjust size as needed */
  font-size: 24px; /* Adjust size as needed */
  z-index: 10;
}

.prev {
  left: 20px;
}

.next {
  right: 20px;
}

.auction-info {
  display: flex;
  flex-direction: column;
}

.bid-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-gallery {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  position: relative;
}

.BidpriceField {
  width: 15%;
  justify-content: center;
}

.gallery-image {
  max-width: 100%;
  height: auto; /* Maintain aspect ratio */
  object-fit: cover;
  border-radius: 8px;
}

.thumbnails {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.thumbnail-image {
  width: 50px; /* Match the MineralDetail dimensions */
  height: 50px; /* Match the MineralDetail dimensions */
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
  width: 65%; /* Match the MineralDetail width */
  margin-top: 20px;
  border-radius: 8px;
}

.bid-button {
  background-color: black; /* Match the MineralDetail button color */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px; /* Match the MineralDetail button font size */
  margin-top: 20px;
}

.bid-button:hover {
  background-color: #333; /* Match the MineralDetail button hover color */
}

/* Add any additional styles specific to the AuctionDetails */
</style>
