<template>
  <div class="home">
    <div v-if="showMessage" class="message">
      {{ registrationMessage }}
    </div>
    <div class="content">
      <HomeStore class="featured-minerals" />
      <HomeAuctions class="featured-auctions" />
    </div>
  </div>
</template>

<script>
import HomeStore from "../components/HomeStore.vue";
import HomeAuctions from "../components/HomeAuctions.vue";

export default {
  name: "Home",
  components: {
    HomeStore,
    HomeAuctions,
  },
  data() {
    return {
      showMessage: false,
    };
  },
  computed: {
    registrationMessage() {
      return this.$store.getters.getRegistrationMessage;
    },
  },
  watch: {
    registrationMessage: {
      immediate: true,
      handler(newMessage) {
        if (newMessage) {
          this.showMessage = true;
          setTimeout(() => {
            this.$store.dispatch("clearRegistrationMessage");
            this.showMessage = false;
          }, 5000);
        }
      },
    },
  },
};
</script>

<style scoped>
.message {
  color: green;
  margin-top: 10px;
}

.content {
  display: flex;
  justify-content: space-between;
}

.featured-minerals {
  width: 48%;
}

.featured-auctions {
  width: 48%;
}
</style>
