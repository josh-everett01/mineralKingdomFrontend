<template>
  <div id="app">
    <Header />
    <div class="content">
      <MainImage />
      <router-view></router-view>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from "./components/Header.vue";
import MainImage from "./components/MainImage.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "App",
  components: {
    Header,
    MainImage,
    Footer,
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box; /* Ensures padding does not affect the total width of elements */
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
  padding: 0;
  width: 100vw;
}

#nav {
  padding: 30px;
}

.content {
  padding-top: 70px; /* Adjust this value based on the height of your header */
  padding-bottom: 100px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

a {
  color: black; /* Black text */
  text-decoration: none; /* No underline by default */
}

a:hover {
  text-decoration: underline; /* Underline on hover */
  text-decoration-color: white; /* White underline */
}
</style>
