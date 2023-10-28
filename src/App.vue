<template>
  <div id="app">
    <router-view></router-view>
    <h1>Welcome to Mineral Kingdom</h1>
    <Minerals />
    <Auctions />
  </div>
</template>

<script>
import Minerals from './components/Minerals.vue';
import Auctions from './components/Auctions.vue';

export default {
  name: 'App',
  components: {
    Minerals,
    Auctions,
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

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
