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
        <h4>
          If you are adding a piece for an Auction, the price you set here for
          the mineral will be the Auction's starting price.
        </h4>
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
      <div class="form-group isAuctionPiece">
        <ul class="auction-instructions">
          <li>
            If you are creating a piece for Auction, choose "Is Auction Piece"
            from the dropdown below.
          </li>
          <li>
            Once you finish adding the mineral here, you can go and configure
            the Auction in the "Add Auction" section from the Admin Dashboard.
          </li>
          <li>
            Once you go to the "Add Auction" section you will see this Mineral
            in the dropdown. Select it and then you will be able to update the
            time etc.
          </li>
        </ul>
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
      <h4 v-if="!isFormValid">
        The "Add Mineral" Button below will become active once the required
        fields are filled in. <br />
        The Video URL and Extra Image URLS are optional.
      </h4>
      <button type="submit" :disabled="!isFormValid || isSubmitting">
        Add Mineral
      </button>
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
      isSubmitting: false,
      showModal: false,
      successMessage: "",
    };
  },
  computed: {
    isFormValid() {
      // Check that all required fields are filled out
      // and that the data meets validation criteria
      return (
        this.mineral.name.trim() !== "" &&
        this.mineral.description.trim() !== "" &&
        this.mineral.price > 0 &&
        this.mineral.origin.trim() !== "" &&
        this.mineral.imageURL.trim() !== "" &&
        this.mineral.status.trim() !== ""
      );
    },
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
      if (!this.isFormValid) {
        alert("Please fill out all required fields correctly.");
        return;
      }
      this.isSubmitting = true;
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
  background-color: black;
  color: white;
  border: none;
  border-radius: 20px; /* Rounded corners */
  cursor: pointer;
  outline: none;
  display: block; /* Block level element */
  margin-left: auto;
  margin-right: auto; /* Center the button */
}

.isAuctionPiece {
  border: 1px;
  text-align: center;
}

.modal-close-button:hover {
  background-color: #333;
}

.auction-instructions {
  list-style-type: none; /* Remove default list styling */
  padding: 0; /* Remove default padding */
  display: inline-block; /* Align with the center of the container */
  text-align: left; /* Align text to the left */
}

.auction-instructions li {
  margin-bottom: 10px; /* Space between bullet points */
  position: relative; /* Position relative for custom bullet */
  padding-left: 20px; /* Space for custom bullet */
}

.auction-instructions li::before {
  content: "•"; /* Custom bullet */
  color: black; /* Bullet color */
  font-size: 20px; /* Bullet size */
  position: absolute; /* Position absolute to the li element */
  left: 0; /* Align bullet to the left */
  top: 50%; /* Center bullet vertically */
  transform: translateY(-50%); /* Adjust vertical position */
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

button:disabled {
  background-color: #ccc; /* Change the background color to a grayish tone */
  color: #666; /* Change the text color to a darker gray */
  cursor: not-allowed; /* Change the cursor to 'not-allowed' */
  /* You can also add any other styles to visually indicate it's disabled */
}

label {
  display: block;
  margin-bottom: 10px;
}

input,
textarea {
  width: 85%;
  padding: 8px;
  box-sizing: border-box;
  border-radius: 7px;
}

button {
  padding: 10px 15px;
  background-color: black; /* Change to black */
  color: white; /* Text color white */
  border: none;
  border-radius: 5px;
  cursor: pointer; /* Add some space above the button */
}

button:hover {
  background-color: #333; /* Darken the button on hover */
}

button:disabled {
  background-color: #ccc; /* Change the background color to a grayish tone */
  color: #666; /* Change the text color to a darker gray */
  cursor: not-allowed; /* Change the cursor to 'not-allowed' */
}

.image-url-group {
  display: flex;
  flex-direction: column; /* Stack elements vertically */
  align-items: center; /* Align items to the center */
  margin-bottom: 15px; /* Add space between each image URL group */
}

.image-url-group input {
  width: 85%; /* Full width */
  margin-bottom: 8px; /* Space between input and button */
}

.image-url-group button {
  width: auto; /* Auto width for the button */
  margin-bottom: 8px; /* Space between button and next input field */
}

.isAuctionPiece {
  border: 1px solid #ccc; /* Light grey border */
  padding: 15px; /* Padding inside the box */
  border-radius: 10px; /* Rounded corners */
  margin-bottom: 20px; /* Space below the section */
}

.success-message {
  color: black;
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
