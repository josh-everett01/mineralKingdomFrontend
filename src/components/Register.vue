<template>
  <div class="register">
    <h1>Register</h1>
    <form @submit.prevent="register">
      <div>
        <label for="firstName">First Name:</label>
        <input v-model="credentials.firstName" id="firstName" required />
      </div>
      <div>
        <label for="lastName">Last Name:</label>
        <input v-model="credentials.lastName" id="lastName" required />
      </div>
      <div>
        <label for="email">Email:</label>
        <input type="email" v-model="credentials.email" id="email" required />
      </div>
      <div>
        <label for="username">Username:</label>
        <input v-model="credentials.username" id="username" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input
          type="password"
          v-model="credentials.password"
          id="password"
          required
        />
      </div>
      <div>
        <label for="streetAddress">Street Address:</label>
        <input
          v-model="credentials.streetAddress"
          id="streetAddress"
          required
        />
      </div>
      <div>
        <label for="city">City:</label>
        <input v-model="credentials.city" id="city" required />
      </div>
      <div>
        <label for="state">State:</label>
        <input v-model="credentials.state" id="state" required />
      </div>
      <div>
        <label for="zipCode">Zip Code:</label>
        <input v-model="credentials.zipCode" id="zipCode" required />
      </div>
      <div>
        <label for="country">Country:</label>
        <input v-model="credentials.country" id="country" required />
      </div>
      <button type="submit" :disabled="loading">Register</button>
    </form>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="message" class="message">{{ message }}</div>
  </div>
</template>

<script>
import AuthService from "@/services/AuthService";

export default {
  data() {
    return {
      credentials: {
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        streetAddress: "",
        city: "",
        state: "",
        zipCode: "",
        country: ""
      },
      error: null,
      loading: false,
      message: '',
    };
  },
  methods: {
    async register() {
      this.loading = true;
      this.error = null;
      try {
        const response = await AuthService.register(this.credentials);
        console.log("Registration successful:", response);
        this.$store.dispatch('setRegistrationMessage', "Registration successful! Please check your email to verify your account.");
        this.$router.push({ name: "home" });
      } catch (error) {
        console.error("Registration failed:", error);
        if (error.response) {
          console.log("Server response:", error.response);
        }
        if (
          error.response &&
          error.response.data &&
          typeof error.response.data === "string"
        ) {
          this.error = error.response.data;
        } else {
          this.error = "Registration failed. Please try again later.";
        }
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.error {
  color: red;
  margin-top: 10px;
}
</style>
