<template>
  <div v-if="mineralData" class="cart-item-card">
    <h3>{{ mineralData.name }}</h3>
    <!-- Image gallery -->
    <div
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
      <img :src="activeImage" alt="Item Image" class="gallery-image" />
      <button
        v-if="showControls"
        class="gallery-control next"
        @click="nextImage"
      >
        &gt;
      </button>
    </div>
    <!-- Thumbnails -->
    <div class="thumbnails">
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
    <!-- Video player (if applicable) -->
    <video v-if="mineralData" controls class="item-video">
      <source :src="mineralData.videoURL" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <p>${{ this.formattedPrice() }}</p>
    <div class="button-container">
      <button @click="removeFromCart(item.id)" class="button remove-from-cart">
        Remove from Cart
      </button>
    </div>
  </div>
  <div v-else-if="loadError">
    <p>Unable to load item details.</p>
  </div>
  <div v-else><h1>...Loading</h1></div>
</template>

<script>
import MineralService from "../services/MineralService";
import AuctionService from "../services/AuctionService";
import BidService from "../services/BidService";

export default {
  props: {
    item: {
      type: Object, // Changed from typeof to type
      required: true,
      default: () => ({}),
    },
  },
  data() {
    return {
      activeImageIndex: 0,
      showControls: false,
      mineralData: null,
      loadError: false,
      winningBid: null,
      auctionId: null,
      isAuctionItem: false,
    };
  },
  computed: {
    allImages() {
      if (this.mineralData) {
        return [
          this.mineralData.imageURL,
          ...this.mineralData.imageURLs,
        ].filter(Boolean);
      }
      return [];
    },
    activeImage() {
      return this.allImages[this.activeImageIndex];
    },
  },
  methods: {
    async loadMineralDetails() {
      if (!this.item.mineralId) {
        this.loadError = true;
        return;
      }
      const mineralData = await MineralService.getMineral(this.item.mineralId);
      this.mineralData = mineralData;
    },
    prevImage() {
      if (this.activeImageIndex > 0) {
        this.activeImageIndex--;
      } else {
        this.activeImageIndex = this.allImages.length - 1;
      }
    },
    nextImage() {
      if (this.activeImageIndex < this.allImages.length - 1) {
        this.activeImageIndex++;
      } else {
        this.activeImageIndex = 0;
      }
    },
    async loadWinningBid() {
      try {
        console.log(this.item.id);
        const auctions = await AuctionService.getAuctions();
        auctions.forEach((auction) => {
          if (auction.mineralId == this.item.mineralId) {
            this.auctionId = auction.id;
          }
        });

        const winningBid = await BidService.getWinningBidForCompletedAuction(
          this.auctionId
        );
        console.log("THIS IS THE WINNING BID: " + winningBid.winningBid.amount);
        this.winningBid = winningBid.winningBid.amount;
        this.$emit("price-updated", { itemId: this.item.mineralId, price: winningBid.winningBid.amount });
      } catch (error) {
        console.error("Error loading winning bid:", error);
        // Handle the error appropriately
      }
    },
    formattedPrice() {
      // Check if winningBid is defined and has an amount property
      if (this.winningBid && typeof this.winningBid === "number") {
        return `${this.winningBid.toFixed(2)}`;
      }
      // Fallback to mineral price if no winning bid
      if (this.mineralData && !isNaN(parseFloat(this.mineralData.price))) {
        return `${this.mineralData.price.toFixed(2)}`;
      }
      return "Price not available";
    },
    removeFromCart() {
      this.$emit("remove-item", this.mineralData.id);
    },
  },
  async mounted() {
    await this.loadMineralDetails();
    console.log(await this.mineralData);
    if (this.mineralData.isAuctionItem) {
      this.loadWinningBid();
    }
  },
  watch: {
    "item.mineralId": function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.loadMineralDetails();
        this.loadWinningBid();
      }
    },
  },
};
</script>
<style scoped>
.cart-item-card {
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

.item-image {
  width: 100%;
  object-fit: cover;
  border-bottom: 1px solid #ccc;
  border-radius: 8px;
}

.item-video {
  width: 100%;
  border-radius: 8px;
  margin-top: 10px;
}

.button-container {
  display: flex;
  justify-content: center;
  width: 100%;
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
  background-color: black;
}

.image-gallery {
  display: flex;
  position: relative;
  overflow-x: auto;
}

.gallery-image {
  width: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.gallery-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  cursor: pointer;
  /* Additional styling for size, padding, etc. */
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

.thumbnail-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.thumbnail-image.active,
.thumbnail-image:hover {
  opacity: 1;
}

.item-video {
  width: 100%;
  border-radius: 8px;
  margin-top: 10px;
}
</style>
