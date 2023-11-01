<template>
  <div class="success-page">
    <h1>Payment Successful!</h1>
    <p>Your payment has been processed successfully.</p>
    <p>Order ID: {{ orderId }}</p>
    <!-- You can add more details here as needed -->
    <router-link to="/">Return Home</router-link>
  </div>
</template>

<script>
export default {
  props: {
    orderId: {
      type: String,
      required: true,
    },
  },
};
</script>

<style scoped>
.success-page {
  text-align: center;
  margin-top: 50px;
}
</style>
