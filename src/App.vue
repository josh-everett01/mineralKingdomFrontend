<template>
  <div id="app">
    <Header />
    <div class="content">
      <MainImage />
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import MainImage from "./components/MainImage.vue";

export default {
  name: "App",
  components: {
    Header,
    MainImage,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

.content {
  padding-top: 70px; /* Adjust this value based on the height of your header */
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
