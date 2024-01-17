<template>
  <div>
    <h2>Your Inquiries</h2>
    <ul v-if="inquiries.length">
      <li v-for="inquiry in inquiries" :key="inquiry.id">
        <p><strong>Message:</strong> {{ inquiry.message }}</p>
        <p><strong>Status:</strong> {{ inquiry.status }}</p>
        <!-- Display response if available -->
        <p v-if="inquiry.response">
          <strong>Response:</strong> {{ inquiry.response }}
        </p>
      </li>
    </ul>
    <p v-else>No inquiries found.</p>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters("correspondence", ["inquiries"]),
  },
  async created() {
    try {
      const userId = this.$store.getters.getUser.id;
      await this.$store.dispatch(
        "correspondence/fetchInquiriesByCustomer",
        userId
      );
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    }
  },
};
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}

li {
  background: #f9f9f9;
  border: 1px solid #ddd;
  margin-bottom: 10px;
  padding: 15px;
  border-radius: 4px;
}

p {
  margin: 5px 0;
}

strong {
  font-weight: bold;
}
</style>

