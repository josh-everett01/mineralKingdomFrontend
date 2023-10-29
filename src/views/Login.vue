<template>
  <div class="login-container" @click="closeModal">
    <div class="login-form" @click.stop>
      <h1>Login</h1>
      <form @submit.prevent="login">
        <label for="username">Username:</label>
        <input v-model="credentials.username" id="username" required />
        <label for="password">Password:</label>
        <input
          type="password"
          v-model="credentials.password"
          id="password"
          required
        />
        <button type="submit" :disabled="loading">Login</button>
      </form>
      <div v-if="error" class="error">{{ error }}</div>
    </div>
  </div>
</template>

<script>
import AuthService from "@/services/AuthService";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      credentials: {
        username: "",
        password: "",
      },
      error: null,
      loading: false,
    };
  },
  methods: {
    ...mapActions(["setUser"]),
    async login() {
      this.loading = true;
      this.error = null;
      try {
        const response = await AuthService.login(this.credentials);
        console.log("Login response:", response);
        this.setUser(response.data);
        this.$router.push({ name: "home" });
      } catch (error) {
        console.error("Login failed", error);
        this.error =
          "Login failed. Please check your credentials and try again.";
      } finally {
        this.loading = false;
      }
    },
    closeModal() {
      this.$router.go(-1); // Go back to the previous page
    },
  },
};
</script>

<style scoped>
.login-container {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease-in-out;
}

.login-form {
  width: 300px;
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.login-container-enter-active,
.login-container-leave-active {
  opacity: 1;
}

.login-container-enter,
.login-container-leave-to {
  opacity: 0;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
