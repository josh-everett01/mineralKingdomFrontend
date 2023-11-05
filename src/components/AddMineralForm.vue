<template>
  <div class="add-mineral-form">
    <div v-if="showSuccessMessage" class="success-message">
      {{ successMessage }}
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
        imageURLs: [""],
      },
      showSuccessMessage: false,
      successMessage: "",
    };
  },
  methods: {
    addImageUrl() {
      console.log(this.mineral.imageURLs);
      this.mineral.imageURLs.push("");
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
        status: "Available",
        imageURLs: [""],
      };
    },
    async submitForm() {
      try {
        // ... (submit logic)
        console.log("Mineral added successfully");
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
</style>
