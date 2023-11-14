<template>
  <div class="update-auction-form">
    <h3>Update Auction</h3>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="title">Title:</label>
        <input v-model="auctionData.title" id="title" type="text" required />
      </div>
      <div class="form-group">
        <label for="description">Description:</label>
        <textarea
          v-model="auctionData.description"
          id="description"
          required
        ></textarea>
      </div>
      <div class="form-group">
        <label for="startingPrice">Starting Price:</label>
        <input
          v-model.number="auctionData.startingPrice"
          id="startingPrice"
          type="number"
          required
          min="0.01"
          step="0.01"
        />
      </div>
      <div class="form-group">
        <label for="startTime">Start Time:</label>
        <input
          v-model="auctionData.startTime"
          id="startTime"
          type="datetime-local"
          required
          :disabled="isAuctionStarted"
        />
      </div>
      <div class="form-group">
        <label for="endTime">End Time:</label>
        <input
          v-model="auctionData.endTime"
          id="endTime"
          type="datetime-local"
          required
        />
      </div>
      <div class="form-group">
        <label for="mineral">Mineral:</label>
        <input id="mineral" type="text" :value="mineralName" disabled />
      </div>
      <div class="form-group">
        <label for="auctionStatusId">Auction Status ID:</label>
        <input
          v-model.number="auctionData.auctionStatusId"
          id="auctionStatusId"
          type="number"
          required
        />
      </div>
      <button type="submit">Update Auction</button>
    </form>
  </div>
</template>

<script>
import AuctionService from "../services/AuctionService";
import MineralService from "../services/MineralService";

export default {
  props: ["id"],
  data() {
    return {
      auctionData: {
        title: "",
        description: "",
        startingPrice: 0,
        startTime: "",
        endTime: "",
        mineralId: null,
        auctionStatusId: null,
      },
      mineralName: "",
    };
  },
  computed: {
    isAuctionStarted() {
      return new Date(this.auctionData.startTime) < new Date();
    },
  },
  created() {
    this.fetchAuctionData();
  },
  methods: {
    async fetchAuctionData() {
      try {
        const auction = await AuctionService.getAuction(this.id);
        this.auctionData = auction;
        const mineral = await MineralService.getMineral(auction.mineralId);
        this.mineralName = mineral.name;
      } catch (error) {
        console.error("Error fetching auction data:", error);
        // Handle error (e.g., show an error message)
      }
    },
    async submitForm() {
      try {
        this.auctionData.endTime = new Date(
          this.auctionData.endTime
        ).toISOString();
        await AuctionService.updateAuction(this.id, this.auctionData);
        // Handle success (e.g., show a message or redirect to a confirmation page)
      } catch (error) {
        console.error("Error updating auction:", error);
        // Handle error (e.g., show an error message)
      }
    },
  },
};
</script>

<style scoped>
.update-auction-form {
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 10px;
}

input,
textarea,
select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  padding: 10px 15px;
  background-color: #5cb85c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #4cae4c;
}
</style>
