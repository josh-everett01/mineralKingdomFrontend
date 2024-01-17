<template>
  <div v-if="isUserAuthenticated">
    <h2>Submit Inquiry</h2>
    <div>
      <p>
        <strong>Name:</strong> {{ getUser.firstName }} {{ getUser.lastName }}
      </p>
      <p><strong>Email:</strong> {{ getUser.email }}</p>
    </div>
    <form @submit.prevent="submitForm">
      <textarea
        v-model="inquiryData.message"
        placeholder="Your Message"
        required
      ></textarea>
      <button type="submit">Submit</button>
    </form>
  </div>
  <div v-else>
    <p>
      Please <router-link to="/login">log in</router-link> to submit an inquiry.
    </p>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      inquiryData: {
        customerId: null,
        name: '',
        email: '',
        message: ''
      }
    };
  },
  computed: {
    ...mapGetters(['getUser', 'isAuthenticated']),
    isUserAuthenticated() {
      return this.isAuthenticated && this.getUser && this.getUser.id;
    }
  },
  created() {
    if (this.isUserAuthenticated) {
      this.inquiryData.customerId = this.getUser.id;
      this.inquiryData.name = this.getUser.firstName + ' ' + this.getUser.lastName;
      this.inquiryData.email = this.getUser.email;
    }
  },
  methods: {
    async submitForm() {
      if (!this.isUserAuthenticated) {
        alert("You must be logged in to submit an inquiry.");
        return;
      }

      try {
        await this.$store.dispatch("correspondence/submitInquiry", this.inquiryData);
        this.inquiryData.message = '';
        alert("Inquiry submitted successfully.");
        await this.$store.dispatch(
          "correspondence/fetchInquiriesByCustomer",
          this.getUser.id
        );
      } catch (error) {
        console.error("Error submitting inquiry:", error);
        alert("Failed to submit inquiry.");
      }
    },
  },
};
</script>
<style scoped>
form {
  max-width: 500px;
  margin: auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-sizing: border-box;
}

input[type="text"],
input[type="email"],
textarea {
  width: calc(100% - 20px); /* Adjust width considering padding */
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box; /* Include padding and border in the element's total width and height */
}

textarea {
  height: 100px;
  resize: vertical;
}

button {
  width: 100%;
  padding: 10px;
  background-color: black;
  color: white;
  border: 1px solid transparent; /* Optional: add a border */
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s; /* Smooth transition for hover effect */
}

button:hover {
  background-color: #333; /* Slightly lighter black */
  color: #ddd; /* Optional: change text color */
  border-color: #555; /* Optional: change border color */
}
</style>
