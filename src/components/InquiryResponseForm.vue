<template>
  <div class="inquiry-response-form">
    <h2>Respond to Inquiry</h2>
    <form @submit.prevent="submitResponse">
      <textarea
        v-model="responseText"
        placeholder="Your response"
        required
      ></textarea>
      <button type="submit">Submit Response</button>
    </form>
    <button @click="closeModal">Close</button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import CorrespondenceService from "@/services/CorrespondenceService"; // Import the service

export default {
  props: {
    inquiryId: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapGetters('correspondence', {
      adminId: "getAdminId", // Replace 'getAdminId' with the actual getter name
    }),
  },
  data() {
    return {
      responseText: "",
    };
  },
  methods: {
    async submitResponse() {
      try {
        const adminId = this.adminId;
        console.log("THIS IS THE ADMINID: " + adminId);
        const responseDto = {
          adminId: adminId,
          responseMessage: this.responseText,
        };
        // Use CorrespondenceService to submit the response
        await CorrespondenceService.respondToInquiry(
          this.inquiryId,
          responseDto
        );
        alert("Response submitted successfully.");
        this.responseText = "";
        this.$emit("close");
        this.$root.$emit('inquiryResponded', this.inquiryId);
      } catch (error) {
        console.error("Error submitting response:", error);
        alert("Failed to submit response.");
      }
    },
    closeModal() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
