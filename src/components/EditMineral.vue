<template>
  <div class="edit-mineral">
    <h2>Edit Mineral ID: {{ $route.params.id }}</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" id="name" v-model="mineral.name" required />
      </div>
      <div class="form-group">
        <label for="description">Description:</label>
        <textarea id="description" v-model="mineral.description"></textarea>
      </div>
      <div class="form-group">
        <label for="price">Price:</label>
        <input
          type="number"
          id="price"
          v-model.number="mineral.price"
          required
          step="0.01"
        />
      </div>
      <div class="form-group">
        <label for="origin">Origin:</label>
        <input type="text" id="origin" v-model="mineral.origin" />
      </div>
      <div class="form-group">
        <label for="imageURL">Image URL:</label>
        <input type="text" id="imageURL" v-model="mineral.imageURL" />
      </div>
      <div class="form-group">
        <label for="videoURL">Video URL:</label>
        <input type="text" id="videoURL" v-model="mineral.videoURL" />
      </div>
      <div class="form-group">
        <label for="status">Status:</label>
        <select id="status" v-model="mineral.status">
          <option value="Available">Available</option>
          <option value="Sold">Sold</option>
        </select>
      </div>
      <div class="form-group">
        <label for="isAuctionItem">Is Auction Item:</label>
        <input
          type="checkbox"
          id="isAuctionItem"
          v-model="mineral.isAuctionItem"
        />
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
            class="remove"
            @click.prevent="removeImageUrl(index)"
            v-if="mineral.imageURLs.length > 1"
          >
            Remove
          </button>
        </div>
        <button @click.prevent="addImageUrl">Add Image URL</button>
      </div>
      <div class="form-buttons">
        <button type="button" class="cancel-button" @click="confirmCancel">
          Cancel
        </button>
        <button type="submit" class="update-button">Update Mineral</button>
      </div>
    </form>
  </div>
</template>

<script>
import MineralService from "../services/MineralService";

export default {
  data() {
    return {
      loading: false,
      mineral: {
        name: "",
        description: "",
        price: null,
        origin: "",
        imageURL: "",
        imageURLs: [], // Assuming you will handle this as a string and then convert as needed
        videoURL: "",
        status: "Available", // Set a default value or fetch it dynamically
        isAuctionItem: false,
      },
    };
  },
  async mounted() {
    this.loading = true;
    const mineralId = this.$route.params.id;
    try {
      const data = await MineralService.getMineral(mineralId);
      this.mineral = {
        ...this.mineral,
        ...data,
        imageURLs: Array.isArray(data.imageURLs)
          ? data.imageURLs
          : data.imageURLs.split(",").map((url) => url.trim()),
      };
      this.loading = false;
    } catch (error) {
      console.error("Failed to fetch mineral data:", error);
      // Show an alert to the user
      alert("Failed to fetch mineral data. Please try again later.");
    }
  },
  methods: {
    async submitForm() {
      const confirmUpdate = confirm("Please confirm your changes.");
      if (!confirmUpdate) return;
      try {
        // Ensure price is a number
        this.mineral.price = Number(this.mineral.price);
        // Convert imageURLs from comma-separated string to array
        const submissionData = {
          ...this.mineral,
          imageURLs: Array.isArray(this.mineral.imageURLs)
            ? this.mineral.imageURLs
            : this.mineral.imageURLs.split(",").map((url) => url.trim()),
        };

        await MineralService.updateMineral(this.mineral.id, submissionData);
        // Handle success
        alert("Mineral updated successfully");
        this.$router.push("/admin"); // Redirect to the admin dashboard
      } catch (error) {
        // Handle failure
        console.error("Failed to update mineral:", error);
        alert("Failed to update mineral. Please try again."); // Show an error message to the user
        this.resetForm(); // Clear the form
      }
    },
    confirmCancel() {
      const confirmLeave = confirm(
        "Are you sure you want to cancel? Any unsaved changes will be lost."
      );
      if (confirmLeave) {
        this.$router.push("/admin"); // Navigate to the admin dashboard
      }
    },
    resetForm() {
      this.mineral = {
        name: "",
        description: "",
        price: null,
        origin: "",
        imageURL: "",
        imageURLs: "",
        videoURL: "",
        status: "Available",
        isAuctionItem: false,
      };
    },
    addImageUrl() {
      this.mineral.imageURLs.push("");
    },
    removeImageUrl(index) {
      if (this.mineral.imageURLs.length > 1) {
        this.mineral.imageURLs.splice(index, 1);
      }
    },
  },
};
</script>

<style scoped>
/* Add styles for your form */
.form-group {
  margin-bottom: 1rem;
}

.remove {
  margin-left: 2em;
}

button {
  margin-top: 1em;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input[type="text"],
input[type="number"],
textarea,
select {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: black;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #333;
}

.form-buttons {
  display: flex;
  justify-content: space-around; /* Align buttons to the right */
  gap: 10px; /* Add some space between buttons */
  margin-top: 1rem;
}

.form-button {
  background-color: black;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.form-button:hover {
  background-color: #333; /* Darken the button on hover */
}

.cancel-button {
  background-color: black; /* Keep the cancel button black */
}

.cancel-button:hover {
  background-color: #333; /* Darken the cancel button on hover */
}
</style>
