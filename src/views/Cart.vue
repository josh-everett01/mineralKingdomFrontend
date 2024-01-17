<template>
  <div>
    <h2>Your Cart</h2>
    <div v-if="isCartEmpty">
      <p>Your cart is empty.</p>
    </div>
    <div v-else class="cart-items">
      <CartItem
        v-for="item in cartItems"
        :key="item.id"
        :item="item"
        @remove-item="handleRemoveItem"
        @price-updated="updateTotal"
      />
    </div>
    <p v-if="!isCartEmpty">Total: ${{ this.total }}</p>
    <div class="shipping-address-container">
      <div v-if="!isCartEmpty" class="shipping-address">
        <label for="shipping-address">Shipping Address:</label> <br />
        <span>
          {{ getUser.firstName }} {{ getUser.lastName }}<br />
          {{ getUser.streetAddress }}<br />
          {{ getUser.city }}, {{ getUser.state }} {{ getUser.zipCode }}
        </span>
        <!-- Display the user's address -->
      </div>
    </div>
    <div v-if="!isCartEmpty" class="confirm-address">
      <input type="checkbox" id="confirm-address" v-model="addressConfirmed" />
      <label for="confirm-address">I CONFIRM THIS IS MY SHIPPING ADDRESS</label>
    </div>
    <button
      @click="initiateCheckout"
      class="checkout-button"
      :disabled="!addressConfirmed"
      :class="{ 'disabled-button': !addressConfirmed }"
    >
      Checkout
    </button>
  </div>
</template>

<script>
import CartItem from "../components/CartItem.vue";
import { mapGetters, mapActions, mapMutations } from "vuex";
import StripeService from "../services/StripeService";
import { loadStripe } from "@stripe/stripe-js";
import MineralService from "../services/MineralService";
import CartService from "../services/CartService";
import BidService from '../services/BidService';
import AuctionService from '../services/AuctionService';

// import AuctionService from '../services/AuctionService';

export default {
  components: {
    CartItem,
  },
  data() {
    return {
      total: "0.00", // Initialize total as a data property
      shippingAddress: "", // Store the user's shipping address
      addressConfirmed: false, // Flag to confirm the address
    };
  },
  computed: {
    ...mapGetters("cart", ["cartItems", "cartTotal"]),
    ...mapGetters(["isAuthenticated", "getUser"]),
    isCartEmpty() {
      return this.cartItems.length === 0;
    },
  },
  watch: {
    cartItems: {
      deep: true,
      async handler(newItems) {
        if (newItems.length === 0) {
          this.total = "0.00";
        } else {
          this.total = await this.calculateCartTotal(newItems);

        }
      },
    },
  },
  async mounted() {
    console.log("Cart Items Before Check: ", this.cartItems);
    const cartData = await CartService.getCartWithItemsByUserId(
      this.getUser.id
    );
    cartData.forEach((data) => {
      console.log(data);
    });
    this.SET_CART_ITEMS(cartData);
    console.log("Cart Items After Check: ", this.cartItems);
    this.$store.dispatch("cart/calculateTotal");
  },
  methods: {
    ...mapActions("cart", ["addToCart"]),
    ...mapMutations("cart", ["SET_CART_ITEMS"]),
    async calculateCartTotal(items) {
      let total = 0;
      const auctions = await AuctionService.getAuctions(); // Fetch auctions here

      for (const item of items) {
        const mineralWithPrice = await MineralService.getMineral(item.mineralId);
        console.log("HEy JOSH" + mineralWithPrice.price);
        console.log("This is the mineral " + mineralWithPrice.isAuctionItem)
        if (mineralWithPrice.isAuctionItem) {
          console.log(mineralWithPrice)
          const matchingAuction = auctions.find(auction => auction.mineralId === mineralWithPrice.id);
          console.log("Matching Auction " + matchingAuction)
          if (matchingAuction) {
            const winningBid = await BidService.getWinningBidForCompletedAuction(matchingAuction.id); // Ensure you pass the correct auction ID
            console.log("Winning Bid:", winningBid);
            mineralWithPrice.price = winningBid.winningBid.amount; // Update the price based on the winning bid
          }
        }

        total += parseFloat(mineralWithPrice.price) || 0;
      }
      return total.toFixed(2);
    },
    async checkCartItems() {
      console.log("Cart Items during Check Cart Items: " + this.cartItems);
      const mineralIds = this.cartItems;
      mineralIds.forEach((mineral) => {
        console.log(mineral);
      });
      console.log("These are the mineral ids: " + mineralIds);
      const availableMinerals = await MineralService.checkMineralAvailability(
        mineralIds
      );
      console.log(availableMinerals);
      this.cartItems.forEach((item) => {
        if (!availableMinerals.includes(item.mineralId)) {
          this.handleRemoveItem(item.mineralId);
          alert(
            `There was an item in your cart that is no longer available. This item has been removed from your cart.`
          );
        }
      });
    },
    async initiateCheckout() {
      console.log("isAuthenticated:", this.isAuthenticated);
      console.log("getUser:", this.getUser);
      await this.checkCartItems();
      this.total = await this.calculateCartTotal(this.cartItems);
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

        // Fetch and assign Name and Price for each cart item
        for (const item of this.cartItems) {
          const mineralData = await MineralService.getMineral(item.mineralId);
          item.Name = mineralData.name;
          item.Price = mineralData.price;
        }

        const stripePublishableKey = process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY;
        console.log(this.cartItems);
        const lineItems = this.cartItems.map((item) => ({
          Name: item.Name,
          Quantity: 1, // or the actual quantity if applicable
          Price: item.Price,
          MineralId: item.mineralId,
        }));

        const purchaseData = {
          LineItems: lineItems,
          UserId: this.getUser.id,
          total: this.total,
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
      this.$store.dispatch("cart/removeItem", {
        userId: this.getUser.id,
        cartItemId: itemId,
      });
      this.$store.dispatch("cart/calculateTotal");
    },
    async updateTotal(updatedPrice) {
      // Find the item in the cartItems array and update its price
      const updatedItem = this.cartItems.find((item) => item.mineralId === updatedPrice.itemId);

      if (updatedItem) {
        updatedItem.Price = updatedPrice.price;
      }

      // Recalculate the total based on the updated prices
      this.total = await this.calculateCartTotal(this.cartItems);
    }
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

.disabled-button {
  background-color: #ccc; /* Change the background color to a grayish tone */
  color: #666; /* Change the text color to a darker gray */
  cursor: not-allowed; /* Change the cursor to 'not-allowed' */
  /* You can also add any other styles to visually indicate it's disabled */
}

.shipping-address-container {
  max-width: 250px; /* Set your desired maximum width */
  margin: 0 auto; /* Center the container horizontally */
  padding: 10px; /* Add some padding to the container */
}

.shipping-address {
  border: 1px solid black;
  padding: 10px;
  border-radius: 10px; /* Adds rounded corners */
}
</style>
