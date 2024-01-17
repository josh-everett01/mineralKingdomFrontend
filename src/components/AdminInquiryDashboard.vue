<template>
  <div class="admin-inquiry-dashboard">
    <h2>Inquiry Dashboard</h2>
    <ul v-if="filteredInquiries.length">
      <li v-for="inquiry in filteredInquiries" :key="inquiry.inquiryId">
        <p><strong>From:</strong> {{ inquiry.name }} ({{ inquiry.email }})</p>
        <p><strong>Message:</strong> {{ inquiry.message }}</p>
        <button @click="selectInquiry(inquiry)">Respond</button>
      </li>
    </ul>
    <p v-else>No inquiries found.</p>

    <!-- Inquiry Response Modal -->
    <div v-if="showResponseModal" class="modal">
      <InquiryResponseForm
        v-if="selectedInquiry"
        :inquiryId="selectedInquiry.inquiryId"
        @close="showResponseModal = false"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import InquiryResponseForm from "./InquiryResponseForm.vue";

export default {
  components: {
    InquiryResponseForm,
  },
  data() {
    return {
      selectedInquiry: null,
      showResponseModal: false,
    };
  },
  computed: {
    ...mapGetters("correspondence", ["inquiries"]),
    filteredInquiries() {
      // Filter out inquiries that have been responded to
      return this.inquiries.filter((inquiry) => inquiry.status !== "Responded");
    },
  },
  created() {
    this.fetchAllInquiries();
  },
  methods: {
    ...mapActions("correspondence", ["fetchAllInquiries"]),
    selectInquiry(inquiry) {
      this.selectedInquiry = inquiry;
      this.showResponseModal = true;
      this.$emit("inquirySelectedForResponse", inquiry.id);
    },
    removeRespondedInquiry(inquiryId) {
      this.$store.dispatch("correspondence/removeInquiry", inquiryId);
    },
  },
  mounted() {
    this.$root.$on("inquiryResponded", this.removeRespondedInquiry);
  },
  beforeDestroy() {
    this.$root.$off("inquiryResponded", this.removeRespondedInquiry);
  },
};
</script>

<style scoped>
/* Add your styles here */
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}
</style>
