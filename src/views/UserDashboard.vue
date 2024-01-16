<template>
  <div class="user-dashboard">
    <h2>User Dashboard</h2>

    <div class="user-info">
      <h3>User Information</h3>

      <!-- Display User Details when not in edit mode -->
      <div v-if="!editMode">
        <div class="form-group">
          <label>First Name:</label>
          <span>{{ user.firstName }}</span>
        </div>
        <div class="form-group">
          <label>Last Name:</label>
          <span>{{ user.lastName }}</span>
        </div>
        <div class="form-group">
          <label>Email:</label>
          <span>{{ user.email }}</span>
        </div>
        <div class="form-group">
          <label>Username:</label>
          <span>{{ user.username }}</span>
          <p class="info-message">
            To change/update Username or Email, contact Admin.
          </p>
        </div>
        <!-- Display Address Information as spans -->
        <div class="form-group">
          <h3>Address Information</h3>
          <label>Street Address:</label>
          <span>{{ user.streetAddress }}</span>
        </div>
        <div class="form-group">
          <label>City:</label>
          <span>{{ user.city }}</span>
        </div>
        <div class="form-group">
          <label>State:</label>
          <span>{{ user.state }}</span>
        </div>
        <div class="form-group">
          <label>Zip Code:</label>
          <span>{{ user.zipCode }}</span>
        </div>
        <div class="form-group">
          <label>Country:</label>
          <span>{{ user.country }}</span>
          <p class="info-message">
            User has the responsibility of providing a current and valid
            shipping address. Please verify Address information is correct.
          </p>
        </div>
      </div>

      <!-- Edit User Details when in edit mode -->
      <div v-else>
        <div class="form-group">
          <label for="firstName">First Name:</label>
          <input type="text" id="firstName" v-model="user.firstName" />
        </div>
        <div class="form-group">
          <label for="lastName">Last Name:</label>
          <input type="text" id="lastName" v-model="user.lastName" />
        </div>
        <!-- You can display the email and username as spans here -->
        <div class="form-group">
          <label>Email:</label>
          <span>{{ user.email }}</span>
        </div>
        <div class="form-group">
          <label>Username:</label>
          <span>{{ user.username }}</span>
          <p class="info-message">
            To change/update Username or Email, contact Admin.
          </p>
        </div>
        <!-- Address Information (editable) -->
        <div class="form-group">
          <h4>Address Information</h4>
          <label for="streetAddress">Street Address:</label>
          <input type="text" id="streetAddress" v-model="user.streetAddress" />
        </div>
        <div class="form-group">
          <label for="city">City:</label>
          <input type="text" id="city" v-model="user.city" />
        </div>
        <div class="form-group">
          <label for="state">State:</label>
          <input type="text" id="state" v-model="user.state" />
        </div>
        <div class="form-group">
          <label for="zipCode">Zip Code:</label>
          <input type="text" id="zipCode" v-model="user.zipCode" />
        </div>
        <div class="form-group">
          <label for="country">Country:</label>
          <input type="text" id="country" v-model="user.country" />
          <p class="info-message">
            User has the responsibility of providing a current and valid
            shipping address. Please verify Address information is correct.
          </p>
        </div>

        <!-- Submit Button for updating user information -->
        <button @click="updateUser">Update</button>
      </div>
    </div>

    <!-- Edit Button (Optional) -->
    <div class="edit-button">
      <button @click="toggleEditMode">
        {{ editMode ? "Cancel Edit" : "Edit User Information" }}
      </button>
    </div>

    <!-- Purchased Items Section -->
    <div class="purchased-items">
      <h3>Purchased Items</h3>
      <!-- List or table of purchased items -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import UserService from "@/services/UserService";

export default {
  data() {
    return {
      user: {
        // Initialize with user data fetched from the backend
        id: 0, // User ID
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      originalUser: {}, // Store the original user data for canceling edits
      editMode: false, // Indicates whether the user is in edit mode
    };
  },
  computed: {
    ...mapGetters(['getUser']), // Map the 'getUser' getter from Vuex
    populatedUser() {
      return this.getUser;
    }
  },
  created() {
    // Fetch user data when the component is created
    this.fetchUserData();
  },
  watch: {
    // Watch the 'populatedUser' computed property for changes
    populatedUser: {
      deep: true, // Watch for nested changes within the 'populatedUser' data
      async handler(newUser) {
        // Trigger actions when the 'populatedUser' data changes
        console.log('User data changed:', newUser);

        // Update the 'user' data property with the new data
        this.user = { ...newUser };
        this.originalUser = { ...newUser };
      }
    }
  },
  methods: {
    async fetchUserData() {
      try {
        // Use Vuex getter to get user data
        const user = this.getUser;
        if (user) {
          // Update the 'user' data property with user data
          this.user = { ...user };
          this.originalUser = { ...user };
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle the error (e.g., display an error message to the user)
      }
    },
    toggleEditMode() {
      if (this.editMode) {
        // Cancel edit mode, restore original user data
        this.user = { ...this.originalUser };
      } else {
        // Enter edit mode
        this.originalUser = { ...this.user };
      }
      this.editMode = !this.editMode;
    },
    async updateUser() {
      try {
        const { id, firstName, lastName, email, streetAddress, city, state, zipCode, country } = this.user;

        const partialUpdateUserDTO = {
          firstName,
          lastName,
          email,
          streetAddress,
          city,
          state,
          zipCode,
          country
        };
        // Make the API request to partially update the user's information
        await UserService.partiallyUpdateUser(id, partialUpdateUserDTO);
        // After making the API request to partially update the user's information
        const response = await UserService.partiallyUpdateUser(id, partialUpdateUserDTO);
        console.log("API Response:", response);

        var updatedUser = await UserService.getUserById(id);
        // After successfully updating the user data, call the mutation
        this.$store.commit("UPDATE_USER_DATA", updatedUser);

        // Fetch the updated user data and refresh the Vuex store
        await this.fetchUserData();

        // Successfully updated, exit edit mode
        this.editMode = false;
      } catch (error) {
        console.error("Error updating user:", error);
        // Handle the error (e.g., display an error message to the user)
      }
    },
  },
};
</script>

<style scoped>
.user-dashboard {
}

.user-info {
  background-color: white;
}

.user-info h3 {
  margin-top: 0;
}

.form-group {
  margin-bottom: 12px;
}

label {
  font-weight: bold;
}

.info-message {
  color: black;
  font-size: 14px;
}

.edit-button {
  margin-top: 16px;
  text-align: center;
}
</style>
