<template>
  <div class="user-dashboard">
    <h2>User Dashboard</h2>
    <div class="dashboard-container">
      <div class="user-info-container">
        <h3>User / Address Information</h3>
        <button @click="showUserInfo = !showUserInfo" class="toggle-button">
          {{
            showUserInfo
              ? "Click here to hide your User / Address Information"
              : "Click here to edit your User / Address Information"
          }}
        </button>
        <div v-if="showUserInfo" class="user-info">
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
              <input
                type="text"
                id="streetAddress"
                v-model="user.streetAddress"
              />
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
          <!-- Edit Button (Optional) -->
          <div class="edit-button">
            <button @click="toggleEditMode">
              {{ editMode ? "Cancel Edit" : "Edit User / Address Information" }}
            </button>
          </div>
        </div>
      </div>
      <!-- Inquiry Form Section -->
      <div class="inquiry-container">
        <h3>Contact Mineral Kingdom Admin</h3>
        <p>
          You may submit an inquiry below and an admin will reach out to you via
          your email address on file. When a response has been sent, the Inquiry
          status will be updated to "Responded".
        </p>
        <div class="inquiry-form-container">
          <button
            @click="showInquiryForm = !showInquiryForm"
            class="toggle-button"
          >
            {{ showInquiryForm ? "Hide Inquiry Form" : "Submit an Inquiry" }}
          </button>
          <div v-if="showInquiryForm">
            <InquiryForm />
          </div>
        </div>

        <!-- Inquiry History Section -->
        <div class="inquiry-history-container">
          <button
            @click="showInquiryHistory = !showInquiryHistory"
            class="toggle-button"
          >
            {{
              showInquiryHistory
                ? "Hide Inquiry History"
                : "View Inquiry History"
            }}
          </button>
          <div v-if="showInquiryHistory">
            <InquiryHistory />
          </div>
        </div>
      </div>
      <div class="purchased-items-container">
        <h3>Purchase History</h3>
        <!-- Purchased Items Section -->
        <button
          @click="showPurchasedItems = !showPurchasedItems"
          class="toggle-button"
        >
          {{
            showPurchasedItems
              ? "Click here to hide Purchase History"
              : "Click here to view Purchase History"
          }}
        </button>
        <div v-if="showPurchasedItems" class="purchased-items">
          <h3>Purchased Items</h3>
          <ul v-if="userPayments.length">
            <li v-for="payment in userPayments" :key="payment.id">
              <!-- Display payment details -->
              <p>MineralKingdom OrderID: {{ payment.orderId }}</p>
              <p>Transaction ID: {{ payment.transactionId }}</p>
              <p>Amount: {{ formatCurrency(payment.amount) }}</p>
              <p>Status: {{ payment.status }}</p>
              <!-- Add more details as needed -->
            </li>
          </ul>
          <p v-else>No payment details found.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import UserService from "@/services/UserService";
import InquiryForm from "../components/InquiryForm.vue"
import InquiryHistory from "../components/InquiryHistory.vue"

export default {
  components: {
    InquiryForm,
    InquiryHistory
  },
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
      showPurchasedItems: false,
      showUserInfo: true,
      showInquiryForm: false,
      showInquiryHistory: false,
    };
  },
  computed: {
    ...mapGetters(['getUser', 'userPayments']), // Map the 'getUser' getter from Vuex
    populatedUser() {
      return this.getUser;
    }
  },
  created() {
    // Fetch user data when the component is created
    this.fetchUserData();
    if (this.getUser && this.getUser.id) {
      this.fetchUserPayments(this.getUser.id); // Fetch user payments
    }
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
    formatCurrency(amount) {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    },
    ...mapActions(['fetchUserPayments']),
  },
};
</script>

<style scoped>
.user-dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dashboard-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
}
.inquiry-container,
.user-info-container,
.purchased-items-container {
  flex: 1;
  padding: 10px;
  border: 2px solid #ccc; /* Adjust the color and thickness as needed */
  border-radius: 10px; /* Optional: if you want rounded corners */
  margin: 10px; /* Optional: to provide some space around the container */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Optional: for a subtle shadow effect */
  background-color: white; /* Ensures the background is white */
}

.user-info {
  background-color: white;
  padding: 15px;
  border-radius: 10px;
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
  text-align: center;
  margin-top: 16px;
}

.purchased-items ul {
  list-style-type: none;
  padding: 0;
}

.purchased-items li {
  background-color: #f3f3f3;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
}
.toggle-button {
  background-color: #f5f5f5;
  border: none;
  padding: 10px;
  width: 100%;
  text-align: left;
  text-align: center;
  font-size: 18px;
  cursor: pointer;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 2%;
}
.toggle-button:hover {
  background-color: #e0e0e0;
}

@media (max-width: 768px) {
  .dashboard-container {
    flex-direction: column;
  }
}
</style>