<template>
  <div class="cancelled-page">
    <h1>Payment Cancelled</h1>
    <p>Your payment process was cancelled.</p>
    <p>If this was a mistake, you can return to your cart to try again.</p>
    <!-- You can add more details or instructions here as needed -->
    <router-link to="/cart">Return to Cart</router-link>
    <br />
    <router-link to="/">Return Home</router-link>
  </div>
</template>

<script>
import CancellationService from "../services/CancellationService";

export default {
  props: {
    orderId: String,
  },
  // beforeRouteEnter(to, from, next) {
  //   if (to.path.startsWith("/payment-cancelled")) {
  //     const orderId = to.params.orderId; // Extract orderId from URL
  //     next((vm) => vm.cancelOrder(orderId));
  //   } else {
  //     next();
  //   }
  // },
  mounted() {
    this.cancelOrder();
  },
  methods: {
    async cancelOrder() {
      try {
        const response = await CancellationService.cancelOrder(this.orderId);
        console.log("Order cancelled:", response);
        // Handle successful cancellation
      } catch (error) {
        console.error("Error cancelling order:", error);
        // Handle error
      }
    },
  },
};
</script>

<style scoped>
.cancelled-page {
  text-align: center;
  margin-top: 50px;
}
</style>
