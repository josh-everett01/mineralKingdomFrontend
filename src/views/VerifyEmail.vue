<!-- src/views/VerifyEmail.vue -->
<template>
  <div>
    <h1>Email Verification</h1>
    <p v-if="message">{{ message }}</p>
  </div>
</template>

<script>
import AuthService from "@/services/AuthService";

export default {
  data() {
    return {
      message: "Verifying your email...",
    };
  },
  async created() {
    try {
      const token = this.$route.query.token;
      if (!token) {
        this.message = "Invalid verification link.";
        return;
      }
      // Call your API to verify the email
      await AuthService.verifyEmail(token);
      this.message = "Email verified successfully!";
      // Redirect back home after delay
      setTimeout(() => {
        this.$router.push({ name: "home" });
      }, 5000); // 5 second delay
    } catch (error) {
      console.error("Email verification failed", error);
      this.message = "Email verification failed. Please try again later.";
    }
  },
};
</script>
