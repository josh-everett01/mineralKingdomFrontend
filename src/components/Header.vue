<template>
  <header class="header">
    <div class="navAndUserAreaContainer">
      <nav class="navigation">
        <router-link to="/home">Home</router-link>
        <router-link to="/shop">Shop</router-link>
        <router-link v-if="isAdmin" to="/admin">Admin Dashboard</router-link>
        <router-link v-if="isUser" to="/user">User Dashboard</router-link>
        <router-link to="/auctions">Auctions</router-link>
        <router-link to="/contact">Contact Us</router-link>
      </nav>
      <div class="user-area">
        <router-link v-if="!isAuthenticated" to="/login">Login</router-link>
        <router-link v-if="!isAuthenticated" to="/register"
          >Register</router-link
        >
        <a v-if="isAuthenticated" @click="logout">Logout</a>
        <router-link to="/cart">Cart ({{ cartItemCount }})</router-link>
      </div>
      <div class="welcomeUserContainer">
        <h4 class="welcomeUser" v-if="isAuthenticated">
          <br />Welcome, {{ user.firstName }} {{ user.lastName }}!
        </h4>
      </div>
    </div>
  </header>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import CartService from "../services/CartService";
//import AuthService from "../services/AuthService";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["isAuthenticated", "getUser"]),
    ...mapGetters("cart", ["cartItems", "cartTotal"]),
    user() {
      return this.getUser || {};
    },
    isAdmin() {
      // Access the store getter to check if the user is an admin
      return this.$store.getters.isAdmin;
    },
    isUser() {
      return this.$store.getters.isUser;
    },
    cartItemCount() {
      const cartItems = this.cartItems;
      console.log("Cart Items!!!: " + cartItems);
      return cartItems ? cartItems.length : 0;
    },
  },
  async mounted() {
    // this.initializeSSE();
    console.log("Cart Items Before Fetch in Header: ", this.cartItems);
    if (this.isAuthenticated && this.getUser) {
      try {
        const userId = this.getUser.id;
        const cartData = await CartService.getCartWithItemsByUserId(userId);
        console.log("Fetched Cart Data: ", cartData);
        this.$store.dispatch("cart/setCartItems", cartData);
        console.log("Cart Items After Fetch in Header: ", this.cartItems);
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    }
  },
  methods: {
    ...mapActions(["setUser"]),
    ...mapActions("cart", ["setCartItems"]),

    initializeSSE() {
      const eventSource = new EventSource(
        process.env.VUE_APP_API_URL + "/CartUpdates/stream"
      ); // Replace with your SSE endpoint
      console.log("Coming to you from SSE");
      eventSource.onmessage = (event) => {
        console.log("FromSSE: ", event.data); // Log the actual data received
        const data = JSON.parse(event.data);
        console.log("Parsed Data: ", data); // Log the parsed data
        if (data.userId === this.user.id) {
          // Check if the update is for the current user
          this.setCartItems(data.cartItems);
          console.log("Updated Cart Items via SSE: " + data.cartItems);
        }
      };

      eventSource.onerror = (error) => {
        console.error("SSE error:", error);
        eventSource.close();
      };
    },
    async logout() {
      console.log(this.getUser);
      await this.$store.dispatch("logout");
      await this.$store.dispatch("cart/clearCart");
    },
  },
};
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.8); /* white with 80% opacity */
  z-index: 1000;
  margin: 1% auto;
  /* padding: 0 1em; 1em padding on the left and right */
}

.welcomeUserContainer {
  width: 85%;
  justify-content: center;
}
/* .navAndUserAreaContainer {
  width: 95%;
  display: flex;
  justify-content: space-between;
} */

.navigation {
  display: flex;
  justify-content: space-between;
}

/* .welcomeUser {
} */

.user-area {
  display: flex;
  justify-content: space-around;
}
user-area a
/* .user-area a:visited,
.user-area a:active,
.user-area a:hover { */ {
  cursor: pointer;
  text-decoration: underline;
}
/* img {
  margin-top: -5%; 
  margin-bottom: -10%;
} */
</style>
