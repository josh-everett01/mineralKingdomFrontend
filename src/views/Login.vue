<!-- src/views/Login.vue -->
<template>
  <div>
    <h1>Login</h1>
    <form @submit.prevent="login">
      <label for="username">Username:</label>
      <input v-model="credentials.username" id="username" required />
      <label for="password">Password:</label>
      <input
        type="password"
        v-model="credentials.password"
        id="password"
        required
      />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
import AuthService from '@/services/AuthService'
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      credentials: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    ...mapActions(['setUser']),
    async login() {
      try {
        const response = await AuthService.login(this.credentials)
        this.setUser(response.data.user)
        this.$router.push({ name: 'home' })
      } catch (error) {
        console.error('Login failed', error)
      }
    }
  }
}
</script>
