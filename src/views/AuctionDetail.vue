<template>
  <div v-if="auction" class="auction-details">
    <div class="auction-details" :key="componentKey">
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
          <li
            v-for="(bid, index) in sortedAndLimitedBids"
            :key="index"
            :class="{ 'green-text': isMyBid(bid), 'red-text': !isMyBid(bid) }"
          >
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
        <span v-if="auction && !auctionHasStarted">
          Starts on: {{ new Date(auction.startTime).toLocaleString() }}
        </span>
        <span v-if="auction && auctionHasEnded">
          Started on: {{ new Date(auction.startTime).toLocaleString() }}
        </span>
      </div>
      <!-- Bidding section -->
      <div
        v-if="auction && auctionHasStarted && !auctionHasEnded"
        class="bid-section"
      >
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>
        <span v-if="currentHighestBid && currentHighestBid.amount">
          Current Highest Bid:
          <span :class="{ 'green-text': true }"
            >${{ currentHighestBid.amount.toFixed(2) }}</span
          ><br />
          <span v-if="isMyBid(currentHighestBid)" class="green-text"
            >You currently have the highest bid!</span
          >
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
      <div
        v-if="auctionHasEnded && isMyBid(currentHighestBid)"
        class="auction-ended-section"
      >
        <h2>Congratulations! You won this auction.</h2>
        <p>
          Winning Bid: ${{ currentHighestBid.amount.toFixed(2) }} by
          {{ currentHighestBid.username }}
        </p>
        <p>
          Auction Ended at: {{ new Date(auction.endTime).toLocaleString() }}
        </p>
        <p>
          You will receive a confirmation email shortly once your item has been
          moved to your Cart.
        </p>
      </div>
      <div v-if="auction && auctionHasEnded" class="auction-ended-section">
        <h2>Auction Winner</h2>
        <p>
          Winning Bid: ${{ currentHighestBid.amount.toFixed(2) }} by
          {{ currentHighestBid.username }}
        </p>
        <p>
          Auction Ended at: {{ new Date(auction.endTime).toLocaleString() }}
        </p>
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
  </div>
  <div v-else>Loading auction details...</div>
</template>

<script>
import MineralService from "../services/MineralService";
import BidService from "../services/BidService";
import AuctionService from "../services/AuctionService";
import UserService from "../services/UserService";
import { mapGetters } from "vuex";
import CartService from "../services/CartService";
import Vue from "vue";

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
      loading: false,
      auctionHasEnded: false,
      componentKey: 0,
    };
  },
  watch: {
    auction(newVal) {
      if (newVal) {
        this.fetchBidList();
        this.fetchMineralData();
        this.fetchCurrentHighestBid();
      }
    },
    "auction.endTime"(newEndTime, oldEndTime) {
      if (newEndTime !== oldEndTime) {
        // Handle the updated end time (e.g., update countdown, UI elements, etc.)
        this.updateCountdown();
      }
    },
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
    // auctionHasEnded() {
    //   if (!this.auction || !this.auction.endTime) {
    //     return false;
    //   }
    //   const now = new Date();
    //   const endTime = new Date(this.auction.endTime);
    //   return now >= endTime;
    // },
    auctionHasStarted() {
      if (!this.auction || !this.auction.startTime) {
        return false;
      }
      const now = new Date();
      const startTime = new Date(this.auction.startTime);
      return now >= startTime;
    },
  },
  methods: {
    async fetchCurrentHighestBid() {
      try {
        const response = await BidService.getCurrentWinningBidForAuction(
          this.auction.id
        );
        this.componentKey++;
        if (response && response.winningBid) {
          const user = await UserService.getUserById(
            response.winningBid.userId
          );
          Vue.set(this.currentHighestBid, "amount", response.winningBid.amount);
          Vue.set(this.currentHighestBid, "username", user.username);
        } else {
          Vue.set(this.currentHighestBid, "amount", 0);
          Vue.set(this.currentHighestBid, "username", "");
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
          const winningBid = await BidService.getWinningBidForCompletedAuction(
            this.auction.id
          );
          if (winningBid) {
            const user = await UserService.getUserById(winningBid.userId);
            this.currentHighestBid = {
              amount: winningBid.amount,
              username: user.username,
            };
          }
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
      console.log("Hey Josh here is the minimum bid: " + minimumBid.amount);
      if (this.newBidAmount < this.auction.startingPrice) {
        alert(`Your bid must be at least $${this.auction.startingPrice + 1}.`);
        return;
      }

      if (this.newBidAmount < minimumBid) {
        alert(`Your bid must be at least $${minimumBid}.`);
        return;
      }

      const confirmBid = confirm(
        `Are you sure you want to place a bid of $${this.newBidAmount.toFixed(
          2
        )}?`
      );
      if (!confirmBid) {
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

          await this.fetchBidList();
          await this.fetchCurrentHighestBid(); // Fe
          this.componentKey++;
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
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Output the result in a string format
      this.countdown = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    },
    async fetchBidList() {
      if (!this.auction || !this.auction.id) {
        console.error("Auction or auction ID is undefined");
        return;
      }

      try {
        const bids = await BidService.getBidsForAuction(this.auction.id);
        const bidsWithUsernames = await Promise.all(
          bids.map(async (bid) => {
            if (!bid.userId) {
              console.error("Bid's user ID is undefined");
              return { ...bid, username: "Unknown" };
            }
            try {
              const user = await UserService.getUserById(bid.userId);
              return { ...bid, username: user.username };
            } catch (error) {
              console.error("Error fetching user for bid:", error);
              return { ...bid, username: "Unknown" };
            }
          })
        );
        this.bids = [...bidsWithUsernames];
        this.componentKey++;
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
        await this.fetchBidList();
        const auctionData = await AuctionService.getAuction(auctionId);
        if (auctionData) {
          this.auction = auctionData;
          if (!this.previousEndTime) {
            this.previousEndTime = new Date(this.auction.endTime).getTime();
          }
        } else {
          console.error("Failed to fetch auction data or data is empty");
        }
      } catch (error) {
        console.error("Error fetching auction details:", error);
      }
    },
    async updateMineralPriceWithWinningBid() {
      if (this.currentHighestBid && this.currentHighestBid.amount) {
        try {
          this.mineral.price = this.currentHighestBid.amount;
        } catch (error) {
          console.error("Error updating mineral price:", error);
        }
      }
    },
    updateAuctionStatus() {
      const now = new Date();
      const endTime = new Date(this.auction.endTime);
      const hasEnded = now >= endTime;

      if (hasEnded && !this.auctionHasEnded) {
        this.auctionHasEnded = true;
      }
    },
    async refreshAuctionDetails() {
      try {
        const auctionData = await AuctionService.getAuction(this.auction.id);
        await this.fetchBidList();
        await this.fetchCurrentHighestBid();
        this.auction.endTime = auctionData.endTime;
      } catch (error) {
        console.error("Error refreshing auction details:", error);
      }
    },
    async refreshCartData() {
      console.log("Cart Items Before Fetch in Header: ", this.cartItems);
      try {
        const userId = this.getUser.id;
        const cartData = await CartService.getCartWithItemsByUserId(userId);
        console.log("Fetched Cart Data: ", cartData);
        this.$store.dispatch("cart/setCartItems", cartData);
        console.log("Cart Items After Fetch in Header: ", this.cartItems);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    },
    isMyBid(bid) {
      return bid.username === this.getUser.username;
    },
  },
  async created() {
    const auctionId = this.$route.params.id; // Get the id from the route parameters

    if (auctionId) {
      // Set up periodic polling to refresh auction details
      this.auctionRefreshInterval = setInterval(() => {
        this.refreshAuctionDetails();
        this.refreshCartData();
      }, 10000);
      if (auctionId) {
        this.loading = true; // Start loading
        try {
          await this.fetchAuctionDetails(auctionId);
          if (this.auction) {
            await this.fetchMineralData();
            await this.fetchBidList();
            await this.fetchCurrentHighestBid();
            if (this.auction.auctionHasEnded) {
              await this.fetchWinningBid();
            }
          }
        } catch (error) {
          console.error("Error occurred while fetching data:", error);
          // Handle the error appropriately
        } finally {
          this.loading = false; // End loading, regardless of success or error
        }
      }
    } else {
      console.error("Auction ID is not available in route parameters");
    }
  },
  mounted() {
    this.countdownInterval = setInterval(this.updateCountdown, 1000);
    this.auctionStatusInterval = setInterval(this.updateAuctionStatus, 1000);
  },
  beforeDestroy() {
    clearInterval(this.countdownInterval);
    clearInterval(this.auctionDetailInterval);
    clearInterval(this.auctionStatusInterval);
    clearInterval(this.auctionRefreshInterval);
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

.green-text {
  color: green;
}

.red-text {
  color: red;
}
</style>
