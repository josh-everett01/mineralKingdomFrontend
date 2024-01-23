<template>
  <div class="add-auction-form">
    <h3>Add New Auction</h3>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="title">Title:</label>
        <input v-model="auction.title" id="title" required />
      </div>
      <div class="form-group">
        <label for="description">Description:</label>
        <textarea v-model="auction.description" id="description"></textarea>
      </div>
      <div class="form-group">
        <label for="startingPrice">Starting Price:</label>
        <input
          type="number"
          v-model.number="auction.startingPrice"
          id="startingPrice"
          required
          min="0.01"
          step="0.01"
        />
      </div>
      <div class="form-group">
        <label for="startTime">Start Time:</label>
        <input
          type="datetime-local"
          v-model="auction.startTime"
          id="startTime"
          required
        />
      </div>
      <div class="form-group">
        <label for="endTime">End Time:</label>
        <input
          type="datetime-local"
          v-model="auction.endTime"
          id="endTime"
          required
        />
      </div>
      <div class="form-group">
        <h4>
          Choose the Name of the Mineral you Added in the "Add Mineral" section
          from the dropdown below
        </h4>
        <label for="mineralId">Mineral:</label>
        <select
          v-model="auction.mineralId"
          id="mineralId"
          required
          @change="updateStartingPrice"
        >
          <option
            v-for="mineral in mineralsForAuction"
            :key="mineral.id"
            :value="mineral.id"
          >
            {{ mineral.name }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <h4>Set "Auction Status" to 1 from the dropdown menu below</h4>
        <label for="auctionStatusId">Auction Status ID:</label>
        <input
          type="number"
          v-model.number="auction.auctionStatusId"
          id="auctionStatusId"
          required
        />
      </div>
      <button type="submit" class="submit-button">Add Auction</button>
    </form>
  </div>
</template>

<script>
import MineralService from "../services/MineralService";
import AuctionService from "../services/AuctionService";
import router from "../router";

export default {
  data() {
    return {
      auction: {
        title: "",
        description: "",
        startingPrice: 0.01,
        startTime: "",
        endTime: "",
        mineralId: null,
        auctionStatusId: null,
      },
      mineralsForAuction: [],
      isSubmitting: false,
    };
  },
  created() {
    this.fetchMinerals();
  },
  methods: {
    async fetchMinerals() {
      try {
        // Fetch all minerals from your service
        const minerals = await MineralService.getMinerals();
        // Filter minerals to only those that are for future auction
        this.mineralsForAuction = minerals.filter(
          (mineral) => mineral.isAuctionItem
        );
      } catch (error) {
        console.error("Error fetching minerals:", error);
      }
    },
    updateStartingPrice() {
      const selectedMineral = this.mineralsForAuction.find(
        (mineral) => mineral.id === this.auction.mineralId
      );
      if (selectedMineral) {
        this.auction.startingPrice = selectedMineral.price;
      }
    },
    resetForm() {
      this.auction = {
        title: "",
        description: "",
        startingPrice: 0.01,
        startTime: "",
        endTime: "",
        mineralId: null,
        auctionStatusId: null,
      };
    },
    async submitForm() {
      if (!this.isFormValid) {
        alert("Please fill out all required fields correctly."); // Use alert for error message
        return;
      }
      this.isSubmitting = true;
      try {
        const auctionData = {
          title: this.auction.title,
          description: this.auction.description,
          startingPrice: this.auction.startingPrice,
          startTime: this.auction.startTime,
          endTime: this.auction.endTime,
          mineralId: this.auction.mineralId,
          auctionStatusId: this.auction.auctionStatusId,
        };
        // Call the AuctionService to add the auction
        const addedAuction = await AuctionService.addAuction(auctionData);
        console.log("Auction added successfully", addedAuction);
        alert(`Auction "${this.auction.title}" added successfully!`); // Use alert for success message
        this.resetForm(); // Reset the form after successful submission

        // Redirect to the Admin dashboard after a short delay
        setTimeout(() => {
          router.push('/admin'); // Adjust the path as per your routes
        }, 2000);
      } catch (error) {
        console.error("Error adding auction:", error);
        alert("Failed to add auction. Please try again."); // Use alert for error message
        this.isSubmitting = false;
      }
    },
  },
  watch: {
    watch: {
      "auction.mineralId": function (newVal, oldVal) {
        if (newVal !== oldVal) {
          this.updateStartingPrice();
        }
      },
    },
  },
  computed: {
    isFormValid() {
      // Check that all required fields are filled out
      // and that the data meets validation criteria
      return (
        this.auction.title.trim() !== "" &&
        this.auction.description.trim() !== "" &&
        this.auction.startingPrice > 0 &&
        this.auction.startTime.trim() !== "" &&
        this.auction.endTime.trim() !== "" &&
        this.auction.mineralId !== null &&
        this.auction.auctionStatusId !== null
      );
    }
  }
};
</script>

<style scoped>
.add-auction-form {
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

.success-message {
  color: green;
  margin-top: 20px;
  font-weight: bold;
}

.submit-button {
  padding: 10px 15px;
  background-color: black; /* Black background */
  color: white; /* White text */
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #333; /* Darker shade for hover */
}

.error-message {
  color: red;
  margin-top: 20px;
  font-weight: bold;
}
</style>
