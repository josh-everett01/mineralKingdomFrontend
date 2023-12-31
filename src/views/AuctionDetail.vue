<template>
  <div class="auction-details">
    <!-- Image gallery -->
    <h2 v-if="auction">{{ (auction.title, auction.i) }}</h2>
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
    <div v-if="bids.length" class="bid-list">
      <h3>Bid History</h3>
      <ul>
        <li v-for="(bid, index) in sortedAndLimitedBids" :key="index">
          ${{ bid.amount.toFixed(2) }} by {{ bid.username }} on
          {{ formatBidTime(bid.bidTime) }}
        </li>
      </ul>
    </div>

    <p v-if="auction">{{ auction.description }}</p>
    <p v-if="!auction">Loading auction details...</p>
    <div v-if="auction" class="auction-info">
      <span v-if="auction && auction.startingPrice">
        Starting Price: ${{ auction.startingPrice.toFixed(2) }}
      </span>
      <span v-if="auction && auctionHasEnded">
        Started on: {{ new Date(auction.startTime).toLocaleString() }}
      </span>
    </div>
    <!-- Bidding section -->
    <div v-if="auction && !auctionHasEnded" class="bid-section">
      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>
      <span v-if="currentHighestBid && currentHighestBid.amount">
        Current Bid: ${{ currentHighestBid.amount.toFixed(2) }}
      </span>
      <span v-if="auction && !auctionHasEnded">
        Auction End: {{ new Date(auction.endTime).toLocaleString() }}
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
    <div v-if="auction && auctionHasEnded" class="auction-ended-section">
      <h2>Auction Winner</h2>
      <p>
        Winning Bid: ${{ currentHighestBid.amount.toFixed(2) }} by
        {{ currentHighestBid.username }}
      </p>
      <p>Auction Ended at: {{ new Date(auction.endTime).toLocaleString() }}</p>
    </div>
    <!-- <div class="auction-table">
      <div class="table-row">
        <div class="table-cell">Starting Price:</div>
        <div class="table-cell">
          ${{ auction ? `${auction.startingPrice}` : "Loading..." }}
        </div>
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
    </div> -->
  </div>
</template>

<script>
import MineralService from "../services/MineralService";
import BidService from "../services/BidService";
import AuctionService from "../services/AuctionService";
import UserService from "../services/UserService";
import { mapGetters } from "vuex";
// import CartService from '../services/CartService';

export default {
  data() {
    return {
      mineral: null,
      startingPrice: null,
      activeImageIndex: 0,
      showControls: false,
      newBidAmount: 0,
      bidIncrement: 10, // Set your required bid increment here
      showBidding: true, // Show bidding section by default
      auction: null,
      countdown: "",
      currentHighestBid: { amount: 0, username: "" },
      successMessage: "",
      bids: [],
      username: "",
      auctionExtended: false,
      previousEndTime: null,
    };
  },
  computed: {
    ...mapGetters(["getUser"]),
    sortedAndLimitedBids() {
      // Create a copy of the bids array, sort it, and then slice the last 10
      return [...this.bids].sort((a, b) => a.amount - b.amount).slice(-10);
    },
    allImages() {
      return this.mineral
        ? [this.mineral.imageURL, ...this.mineral.imageURLs].filter(Boolean)
        : [];
    },
    activeImage() {
      return this.allImages[this.activeImageIndex];
    },
    auctionHasEnded() {
      if (!this.auction || !this.auction.endTime) {
        return false;
      }
      const now = new Date();
      const endTime = new Date(this.auction.endTime);
      return now >= endTime;
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
          const user = await UserService.getUserById(
            this.currentHighestBid.userId
          );
          console.log(user);
          this.currentHighestBid.username = user.username;
        } else {
          this.currentHighestBid = "0.00";
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
    async fetchWinningBid() {
      if (this.auction && this.auctionHasEnded) {
        try {
          const winningBid = await BidService.getWinningBidForCompletedAuction(this.auction.id);
          return winningBid;
        } catch (error) {
          console.error("Error fetching winning bid:", error);
        }
      }
    },
    addToCart(mineral) {
      if (!this.isAuthenticated) {
        alert("Please log in to add items to the cart");
        return;
      }

      const cartItem = {
        id: mineral.id,
        name: mineral.name,
        price: mineral.price,
        // Add other necessary properties
      };

      const userId = this.getUser.id; // Get the current user's ID
      if (!userId) {
        console.error("User ID is undefined");
        alert("Unable to add item to cart. Please log in again.");
        return;
      }

      this.$store.dispatch("cart/addToCart", { userId, item: cartItem });
      alert("Item added to cart successfully!");
    },
    async placeBid() {
      const minimumBid = this.currentHighestBid
        ? this.currentHighestBid.amount + this.bidIncrement
        : this.auction.startingPrice;

      if (this.newBidAmount < minimumBid) {
        alert(`Your bid must be at least $${minimumBid}.`);
        return;
      }
      if (this.getUser) {
        try {
          await BidService.createBid({
            amount: this.newBidAmount,
            bidTime: new Date().toISOString(),
            userId: this.getUser.id, // Replace with actual user ID
            auctionId: this.auction.id,
          });
          this.currentHighestBid = { amount: this.newBidAmount };
          this.successMessage = `Your bid of $${this.newBidAmount.toFixed(
            2
          )} has been placed successfully.`;

          setTimeout(() => {
            this.successMessage = "";
          }, 5000); // Change 5000 to 7000 for 7 seconds

          this.fetchBidList();
        } catch (error) {
          console.error("Error placing bid:", error);
          alert("There was an error placing your bid. Please try again.");
        }
      } else {
        alert("You must be logged in to place a bid.");
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
      if (!this.auction || !this.auction.endTime) {
        return;
      }

      const endTime = new Date(this.auction.endTime).getTime();
      if (this.previousEndTime && this.previousEndTime !== endTime) {
        this.auctionExtended = true; // Set true if end time changes
        this.previousEndTime = endTime; // Update the previous end time
      }
      const now = Date.now();
      const distance = endTime - now;

      if (distance < 0) {
        this.countdown = "Auction has ended";
        clearInterval(this.countdownInterval);
        return;
      }

      // Time calculations for days, hours, minutes and seconds
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Output the result in a string format
      this.countdown = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      if (this.auctionExtended) {
        setTimeout(() => {
          this.auctionExtended = false;
        }, 5000); // Hide the message after 5 seconds
      }
    },
    async fetchBidList() {
      try {
        const bids = await BidService.getBidsForAuction(this.auction.id);
        const bidsWithUsernames = await Promise.all(
          bids.map(async (bid) => {
            try {
              const user = await UserService.getUserById(bid.userId);
              return { ...bid, username: user.username };
            } catch (error) {
              console.error("Error fetching user for bid:", error);
              return { ...bid, username: "Unknown" }; // Fallback in case of error
            }
          })
        );
        this.bids = bidsWithUsernames;
      } catch (error) {
        console.error("Error fetching bids:", error);
      }
    },
    formatBidTime(bidTime) {
      const date = new Date(bidTime);
      return date.toLocaleString(); // Adjust formatting as needed
    },
    async fetchAuctionDetails(auctionId) {
      try {
        const auctionData = await AuctionService.getAuction(auctionId);
        this.auction = auctionData;
        if (!this.previousEndTime) {
          this.previousEndTime = new Date(this.auction.endTime).getTime();
        }
      } catch (error) {
        console.error("Error fetching auction details:", error);
      }
    },
  },
  async created() {
    const auctionId = this.$route.params.id; // Get the id from the route parameters
    if (auctionId) {
      await this.fetchAuctionDetails(auctionId);
      // Now that this.auction is set, you can call other methods that depend on it
      await this.fetchBidList();
      await this.fetchMineralData(); // Now fetch the mineral data
      await this.fetchCurrentHighestBid(); // And the current highest bid
      await this.fetchWinningBid();
    } else {
      console.error("Auction ID is not available in route parameters");
    }
  },
  mounted() {
    this.countdownInterval = setInterval(this.updateCountdown, 1000);
  },
  beforeDestroy() {
    clearInterval(this.countdownInterval);
    clearInterval(this.auctionDetailInterval);
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

.auction-ended-section {
  text-align: center;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 10px;
  margin-top: 20px;
}

.success-message {
  color: green;
  margin-top: 10px;
}

.bid-list {
  margin-top: 20px;
}

.bid-list h3 {
  margin-bottom: 10px;
}

.bid-list ul {
  list-style-type: none;
  padding: 0;
}

.bid-list li {
  margin-bottom: 5px;
}
</style>
