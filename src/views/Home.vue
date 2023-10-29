<template>
  <div class="home">
    <div v-if="showMessage" class="message">
      {{ registrationMessage }}
    </div>
    <HomeStore />
  </div>
</template>

<script>
import HomeStore from "../components/HomeStore.vue";

export default {
  name: "Home",
  components: {
    HomeStore,
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
</style>
