<template>
  <div v-if="isAvailable && currentMineral">
    <h2>{{ currentMineral.name }}</h2>
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
      <img :src="activeImage" alt="Mineral Image" class="mineral-image" />
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
    <video v-if="currentMineral.videoURL" controls class="mineral-video">
      <source :src="currentMineral.videoURL" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <p>{{ currentMineral.description }}</p>
    <p>${{ currentMineral.price }}</p>
    <button @click="purchaseMineral" class="buy-now-button">BUY NOW</button>
  </div>
  <div v-else-if="isLoading">Loading...</div>
  <div v-else>
    <p>Error loading mineral details.</p>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import StripeService from "../services/StripeService";
import { loadStripe } from "@stripe/stripe-js";

export default {
  props: {
    id: {
      type: [String, Number],
      required: true,
    },
  },
  computed: {
    ...mapGetters("minerals", ["currentMineral", "isLoading", "error"]),
    ...mapGetters(["isAuthenticated", "getUser"]),
    isAvailable() {
      return this.currentMineral && this.currentMineral.status == "0";
    },
    allImages() {
      console.log("This.mineral.imageURLS" + this.currentMineral.imageURLs);
      console.log("this mineral" + this.currentMineral);
      return [
        this.currentMineral.imageURL,
        ...this.currentMineral.imageURLs,
      ].filter(Boolean);
    },
    activeImage() {
      return this.allImages[this.activeImageIndex];
    },
  },
  methods: {
    ...mapActions("minerals", ["fetchMineral"]),
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
    async purchaseMineral() {
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

        if (!this.currentMineral) {
          console.error("Mineral is not defined");
          alert(
            "Mineral information is not available. Please try again later."
          );
          return;
        }
        const stripePublishableKey = process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY;
        const purchaseData = {
          userId: this.getUser.id,
          mineralId: this.currentMineral.id,
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
    setActiveImage(index) {
      this.activeImageIndex = index;
    },
  },
  watch: {
    error(newValue) {
      if (newValue) {
        console.error(newValue);
        setTimeout(() => {
          this.$router.push("/");
        }, 10000);
      }
    },
  },
  async created() {
    try {
      await this.fetchMineral(this.id);
      if (this.error) {
        console.error("Error loading mineral details:", this.error);
        this.$router.push("/");
      }
    } catch (error) {
      console.error("Error in created hook:", error);
      this.$router.push("/home");
    }
  },
  data() {
    return {
      activeImageIndex: 0,
      showControls: false,
    };
  },
};
</script>

<style scoped>
.mineral-image {
  width: 450px; /* Adjust the width as needed */
  height: 450px; /* Adjust the height as needed */
  object-fit: cover;
  border-radius: 10px; /* Rounded edges */
  margin-bottom: 10px; /* Optional: add some space below the image */
}

.buy-now-button {
  background-color: black;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
}
.buy-now-button:hover {
  background-color: #333;
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
  left: 25%;
}

.next {
  right: 25%;
}

.image-gallery {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
  position: relative;
}

.mineral-image {
  max-width: 100%;
  object-fit: cover;
  border-radius: 8px;
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
  width: 65%;
  margin-top: 20px;
  border-radius: 8px;
}
</style>
