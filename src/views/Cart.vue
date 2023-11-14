<template>
  <div>
    <h2>Your Cart</h2>
    <div class="cart-items">
      <CartItem
        v-for="item in cartItems"
        :key="item.id"
        :item="item"
        @remove-item="handleRemoveItem"
      />
    </div>
    <p>Total: ${{ cartTotal.toFixed(2) }}</p>
    <button @click="initiateCheckout" class="checkout-button">Checkout</button>
  </div>
</template>

<script>
import CartItem from "../components/CartItem.vue";
import { mapGetters, mapActions, mapMutations } from "vuex";
import StripeService from "../services/StripeService";
import { loadStripe } from "@stripe/stripe-js";
import MineralService from "../services/MineralService";

export default {
  components: {
    CartItem,
  },
  computed: {
    ...mapGetters("cart", ["cartItems", "cartTotal"]),
    ...mapGetters(["isAuthenticated", "getUser"]),
  },
  watch: {
    cartItems: {
      deep: true,
      handler(newItems) {
        console.log("Cart Items Updated:", newItems);
      },
    },
  },
  mounted() {
    console.log("Initial Cart Items:", this.cartItems);
  },
  methods: {
    ...mapActions("cart", ["addToCart"]),
    ...mapMutations("cart", ["SET_CART_ITEMS"]),
    async checkCartItems() {
      const mineralIds = this.cartItems.map((item) => item.id);
      const availableMinerals = await MineralService.checkMineralAvailability(
        mineralIds
      );

      this.cartItems.forEach((item) => {
        if (!availableMinerals.includes(item.id)) {
          this.handleRemoveItem(item.id);
          alert(
            `Item ${item.name} is no longer available and has been removed from your cart.`
          );
        }
      });
    },
    async initiateCheckout() {
      console.log("isAuthenticated:", this.isAuthenticated);
      console.log("getUser:", this.getUser);
      await this.checkCartItems();
      try {
        if (!this.isAuthenticated) {
          alert("Please log in to proceed with the checkout");
          return;
        }

        if (!this.getUser) {
          console.error("User is not defined");
          alert("User information is not available. Please log in again.");
          return;
        }

        if (this.cartItems.length === 0) {
          alert("Your cart is empty.");
          return;
        }

        const stripePublishableKey = process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY;

        const lineItems = this.cartItems.map((item) => ({
          Name: item.name,
          Quantity: 1, // or the actual quantity if applicable
          Price: item.price,
          MineralId: item.id,
        }));

        const purchaseData = {
          LineItems: lineItems,
          UserId: this.getUser.id,
          total: this.cartTotal,
        };

        console.log("Purchase Data:", purchaseData);
        const sessionId = await StripeService.createCartCheckoutSession(
          purchaseData
        );
        console.log("SessionID:", sessionId);

        const stripe = await loadStripe(stripePublishableKey);
        await stripe.redirectToCheckout({ sessionId });
      } catch (error) {
        console.error("Error initiating checkout:", error);
        alert("Failed to initiate checkout. Please try again later.");
      }
    },
    handleRemoveItem(itemId) {
      // Remove the item from the cart
      console.log("Handling remove-item event with itemId:", itemId);
      this.$store.dispatch("cart/removeItem", itemId);
    },
  },
};
</script>

<style>
.cart-container {
  max-width: 75%; /* Match the width of auction details */
  margin: auto; /* Center the container */
  padding: 2em;
  border-radius: 10px; /* Rounded edges */
  background: #fff; /* Light theme background */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
}

.cart-items {
  display: flex;
  flex-wrap: wrap;
  gap: 20px; /* Spacing between cards */
  justify-content: center;
}

.cart-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #eaeaea;
  padding: 10px 0;
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-image {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 5px;
}

.cart-description {
  flex-grow: 1;
  margin-left: 15px;
}

.cart-price {
  font-weight: bold;
}

.cart-remove-button {
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
}

.cart-remove-button:hover {
  background-color: #ff7875;
}

.cart-total {
  text-align: right;
  font-size: 18px;
  font-weight: bold;
  margin-top: 20px;
}

.checkout-button {
  background-color: black;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  display: block;
  width: 100%;
  text-align: center;
}

.checkout-button:hover {
  background-color: #333;
}
</style>
