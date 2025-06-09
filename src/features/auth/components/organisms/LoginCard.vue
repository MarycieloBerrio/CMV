<template>
  <v-card class="auth-card">
    <LoginForm />
    <div class="links-container mt-4">
      <router-link to="/register">Register</router-link>
      <router-link to="/">Recover Password</router-link>
    </div>
  </v-card>
</template>

<script>
import '../../assets/css/AuthCard.css'
import LoginForm from '../molecules/LoginForm.vue'

export default {
  components: { LoginForm },
}
</script>
