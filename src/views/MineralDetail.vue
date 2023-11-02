<template>
  <div v-if="isAvailable && currentMineral">
    <h2>{{ currentMineral.name }}</h2>
    <img
      v-if="currentMineral.imageURL"
      :src="currentMineral.imageURL"
      alt="Mineral Image"
      class="mineral-image"
    />
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
  },
  methods: {
    ...mapActions("minerals", ["fetchMineral"]),
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
};
</script>

<style scoped>
.mineral-image {
  width: 350px; /* Adjust the width as needed */
  height: 350px; /* Adjust the height as needed */
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
</style>
