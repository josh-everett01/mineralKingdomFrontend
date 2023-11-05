<template>
  <div class="admin-dashboard">
    <h2>Admin Dashboard</h2>
    <div class="tools-container">
      <div class="tool-card">
        <router-link :to="{ name: 'add-mineral' }" class="card-link">
          <h3>Add Mineral</h3>
        </router-link>
        <AddMineralForm />
      </div>
      <!-- Add more tool components/cards here -->
      <!-- Example of another card -->
      <div class="tool-card">
        <router-link to="/admin/other-feature" class="card-link">
          <h3>Other Feature</h3>
        </router-link>
        <!-- Include other feature component here -->
      </div>
    </div>
  </div>
</template>

<script>
import AddMineralForm from "../components/AddMineralForm.vue";

export default {
  components: {
    AddMineralForm,
  },
  beforeEnter(to, from, next) {
    if (this.$store.getters.isAdmin) {
      next();
    } else {
      next("/");
    }
  },
};
</script>

<style scoped>
.admin-dashboard {
  padding: 16px;
}

.tools-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.tool-card {
  flex: 1;
  min-width: 300px; /* Adjust as needed */
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-link {
  text-decoration: none;
  color: inherit;
}
</style>
