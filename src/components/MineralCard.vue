<template>
  <div class="mineral-card">
    <h3>{{ mineral.name }}</h3>
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
      <img :src="activeImage" alt="Mineral Image" class="gallery-image" />
      <button
        v-if="showControls"
        class="gallery-control next"
        @click="nextImage"
      >
        &gt;
      </button>
    </div>
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
    <!-- Video player -->
    <video v-if="mineral.videoURL" controls class="mineral-video">
      <source :src="mineral.videoURL" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <p>{{ mineral.description }}</p>
    <p>${{ mineral.price.toFixed(2) }}</p>
    <div class="button-container">
      <router-link
        :to="{ name: 'mineral-detail', params: { id: mineral.id } }"
        class="button view-details"
        >View Details</router-link
      >
      <button
        @click="addToCart(mineral)"
        :disabled="this.isItemInCart"
        class="button add-to-cart"
      >
        {{ isItemInCart ? "Item in Cart" : "Add to Cart" }}
      </button>
    </div>
  </div>
</template>

<script>
import StripeService from "../services/StripeService";
import { mapActions, mapGetters } from "vuex";
import { loadStripe } from "@stripe/stripe-js";

export default {
  props: {
    mineral: Object,
  },
  computed: {
    allImages() {
      console.log("This.mineral.imageURLS" + this.mineral.imageURLs);
      console.log("this mineral" + this.mineral);
      return [this.mineral.imageURL, ...this.mineral.imageURLs].filter(Boolean);
    },
    activeImage() {
      return this.allImages[this.activeImageIndex];
    },
    ...mapGetters("minerals", ["currentMineral", "isLoading", "error"]),
    ...mapGetters(["isAuthenticated", "getUser"]),
  },
  data() {
    return {
      activeImageIndex: 0,
      showControls: false,
      isItemInCart: this.$store.getters['cart/isItemInCart'](this.userId, this.mineral.id),
    };
  },
  methods: {
    ...mapActions("minerals", ["fetchMineral"]),
    async initiatePurchase() {
      try {
        if (!this.isAuthenticated) {
          alert("Please log in to proceed with the purchase");
          return;
        }

        if (!this.getUser) {
          console.error("User is not defined");
          alert("User information is not available. Please log in again.");
          return;
        }

        if (!this.mineral) {
          console.error("Mineral is not defined");
          alert(
            "Mineral information is not available. Please try again later."
          );
          return;
        }
        const stripePublishableKey = process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY;
        const purchaseData = {
          userId: this.getUser.id,
          mineralId: this.mineral.id,
          // You can omit the fields that are not needed
        };
        console.log(
          "Purchase Data: " + purchaseData.userId + "," + purchaseData.mineralId
        );
        const sessionId = await StripeService.createCheckoutSession(
          purchaseData
        );
        console.log("SessionID: " + sessionId);
        const stripe = await loadStripe(stripePublishableKey);
        await stripe.redirectToCheckout({ sessionId });
      } catch (error) {
        console.error("Error initiating purchase:", error);
        alert("Failed to initiate purchase. Please try again later.");
      }
    },
    nextImage() {
      if (this.activeImageIndex < this.allImages.length - 1) {
        this.activeImageIndex++;
      } else {
        this.activeImageIndex = 0; // Loop back to the first image
      }
    },
    prevImage() {
      if (this.activeImageIndex > 0) {
        this.activeImageIndex--;
      } else {
        this.activeImageIndex = this.allImages.length - 1; // Loop back to the last image
      }
    },
    setActiveImage(index) {
      this.activeImageIndex = index;
    },
    addToCart(mineral) {
      if (!this.isAuthenticated) {
        alert("Please log in to add items to the cart");
        return;
      }

      const userId = this.getUser.id; // Get the current user's ID
      if (!userId) {
        console.error("User ID is undefined");
        alert("Unable to add item to cart. Please log in again.");
        return;
      }

      // Check if the item is already in the cart
      const isItemInCart = this.$store.getters['cart/isItemInCart'](userId, mineral.id);

      if (isItemInCart) {
        // Show a message that the item is already in the cart
        alert("This item is already in your cart");
      } else {
        // Add the item to the cart
        const cartItem = {
          id: mineral.id,
          name: mineral.name,
          price: mineral.price,
          // Add other necessary properties
        };

        this.$store.dispatch("cart/addToCart", { userId, item: cartItem });
        alert("Item added to cart successfully!");

        this.isItemInCart = true;
      }
    },
  },
};
</script>

<style scoped>
.mineral-card {
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

img {
  width: 100%;
  object-fit: cover; /* Ensure the image covers the area without distorting aspect ratio */
  border-bottom: 1px solid #ccc;
  border-radius: 8px; /* Optional: add rounded corners to the image */
}
.button-container {
  display: flex;
  justify-content: space-between;
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
}

.view-details {
  background-color: black;
  /* color: white;
  border: none; */
}

.add-to-cart {
  background-color: black;
  /* color: white;
  border: none; */
}

.additional-images {
  display: flex;
  overflow-x: auto; /* Allows scrolling through the images if they overflow */
  margin-top: 10px;
}

.additional-image {
  max-width: 100px; /* Set a max-width for additional images */
  margin-right: 10px;
  object-fit: cover;
  border-radius: 8px;
}

.mineral-video {
  width: 100%; /* Responsive width */
  margin-top: 20px;
  border-radius: 8px; /* Optional: add rounded corners to the video */
}

.image-gallery {
  display: flex;
  overflow-x: auto; /* Allows scrolling through the images */
  margin-bottom: 10px;
  position: relative;
}

.gallery-image {
  max-width: 100%;
  object-fit: cover;
  border-radius: 8px;
  margin-right: 10px;
}

/* Hide the scrollbar but still allow scrolling */
.image-gallery::-webkit-scrollbar {
  display: none;
}

.image-gallery {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
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
  left: 10px;
}

.next {
  right: 10px;
}

.prev {
  left: 10px;
}

.next {
  right: 10px;
}

.mineral-video {
  width: 100%; /* Responsive width */
  margin-top: 20px;
  border-radius: 8px; /* Optional: add rounded corners to the video */
}

.thumbnails {
  display: flex;
  justify-content: center;
  margin-top: 10px;
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
</style>
