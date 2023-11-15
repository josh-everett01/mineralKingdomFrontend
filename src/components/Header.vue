<template>
  <header class="header">
    <div class="navAndUserAreaContainer">
      <nav class="navigation">
        <router-link to="/home">Home</router-link>
        <router-link to="/shop">Shop</router-link>
        <router-link v-if="isAdmin" to="/admin">Admin Dashboard</router-link>
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
//import AuthService from "../services/AuthService";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["isAuthenticated", "getUser"]),
    user() {
      return this.getUser || {};
    },
    isAdmin() {
      // Access the store getter to check if the user is an admin
      return this.$store.getters.isAdmin;
    },
    cartItemCount() {
      return this.$store.getters["cart/cartItems"].length;
    },
  },
  methods: {
    ...mapActions(["setUser"]),
    async logout() {
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
