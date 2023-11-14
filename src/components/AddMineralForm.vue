<template>
  <div class="add-mineral-form">
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <!-- Modal message -->
        <p>{{ successMessage }}</p>
        <!-- Close button -->
        <button class="modal-close-button" @click="closeAndRefresh">
          Close
        </button>
      </div>
    </div>
    <h3>Add New Mineral</h3>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">Name:</label>
        <input v-model="mineral.name" id="name" required />
      </div>
      <div class="form-group">
        <label for="description">Description:</label>
        <textarea v-model="mineral.description" id="description"></textarea>
      </div>
      <div class="form-group">
        <label for="price">Price:</label>
        <input
          type="number"
          v-model.number="mineral.price"
          id="price"
          required
          min="0.01"
          step="0.01"
        />
      </div>
      <div class="form-group">
        <label for="origin">Origin:</label>
        <input v-model="mineral.origin" id="origin" />
      </div>
      <div class="form-group">
        <label for="imageURL">Image URL:</label>
        <input v-model="mineral.imageURL" id="imageURL" />
      </div>
      <div class="form-group">
        <label for="videoURL">Video URL:</label>
        <input v-model="mineral.videoURL" id="videoURL" />
      </div>
      <div class="form-group">
        <label>Is "For Sale" piece or Is "Auction" Piece:</label>
        <select v-model="mineral.isAuctionItem">
          <option value="false">Is "For Sale" Piece</option>
          <option value="true">Is "Auction" Piece</option>
        </select>
      </div>
      <div class="form-group">
        <label>Status:</label>
        <select v-model="mineral.status">
          <option value="Available">Available</option>
          <option value="Sold">Sold</option>
        </select>
      </div>
      <div class="form-group">
        <label>Image URLs:</label>
        <div
          v-for="(url, index) in mineral.imageURLs"
          :key="index"
          class="image-url-group"
        >
          <input
            v-model="mineral.imageURLs[index]"
            placeholder="Enter image URL"
          />
          <button
            @click.prevent="removeImageUrl(index)"
            v-if="shouldShowRemoveButton(index)"
          >
            Remove
          </button>
        </div>
        <button @click.prevent="addImageUrl">Add Image URL</button>
      </div>
      <!-- ... (other form fields remain unchanged) ... -->
      <button type="submit">Add Mineral</button>
    </form>
  </div>
</template>

<script>
import MineralService from "../services/MineralService";

export default {
  data() {
    return {
      mineral: {
        name: "",
        description: "",
        price: null,
        origin: "",
        imageURL: "",
        videoURL: "",
        status: "Available",
        isAuctionItem: false,
        imageURLs: [""],
      },
      showModal: false,
      successMessage: "",
    };
  },
  methods: {
    addImageUrl() {
      this.mineral.imageURLs.push("");
    },
    closeModal() {
      this.showModal = false; // Set showModal to false to hide the modal
    },
    closeAndRefresh() {
      this.showModal = false; // Close the modal
      window.location.reload(); // Refresh the page
    },
    shouldShowRemoveButton() {
      return this.mineral.imageURLs.length > 1;
    },
    removeImageUrl(index) {
      if (this.mineral.imageURLs.length > 1) {
        this.mineral.imageURLs.splice(index, 1);
      }
    },
    resetForm() {
      this.mineral = {
        name: "",
        description: "",
        price: null,
        origin: "",
        imageURL: "",
        videoURL: "",
        isAuctionItem: false,
        status: "Available",
        imageURLs: [""],
      };
    },
    async submitForm() {
      try {
        this.mineral.isAuctionItem = this.mineral.isAuctionItem === "true";
        console.log("this mineral" + this.mineral.isAuctionItem);
        const addedMineral = await MineralService.addMineral(this.mineral);
        console.log("Mineral added successfully", addedMineral);
        this.showModal = true;
        this.successMessage = `Mineral "${this.mineral.name}" added successfully!`; // Set the success message
        this.showSuccessMessage = true; // Show the success message
        this.resetForm(); // Reset the form
        // Optionally, redirect or do something else
      } catch (error) {
        console.error("Error adding mineral:", error);
        // Handle the error, e.g., show an error notification to the user
      }
    },
  },
};
</script>

<style scoped>
add-mineral-form {
  max-width: 500px;
  margin: 0 auto;
}

.modal-close-button {
  padding: 10px 20px;
  margin-top: 20px; /* Add some space above the button */
  background-color: #5cb85c;
  color: white;
  border: none;
  border-radius: 20px; /* Rounded corners */
  cursor: pointer;
  outline: none;
  display: block; /* Block level element */
  margin-left: auto;
  margin-right: auto; /* Center the button */
}

.modal-close-button:hover {
  background-color: #4cae4c;
}

/* .close-button {
  position: absolute;
  top: 10px;
  right: 15px;
  font-size: 30px;
  cursor: pointer;
} */

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 10px;
}

input,
textarea {
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

.image-url-group {
  display: flex;
  align-items: center;
}
.image-url-group input {
  margin-right: 8px;
}

.success-message {
  color: green;
  margin-top: 20px;
  font-weight: bold;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* High z-index to be on top of other content */
}

.modal-content {
  position: relative;
  background-color: #fff;
  padding: 20px;
  padding-bottom: 60px;
  border-radius: 5px;
  z-index: 1001; /* Higher z-index than overlay to be above it */
}
</style>
