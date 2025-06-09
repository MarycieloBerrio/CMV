<template>
  <v-card class="auth-card">
    <RegisterForm />
    <div class="links-container mt-4">
      <router-link to="/">Login</router-link>
      <router-link to="/">Recover Password</router-link>
    </div>
  </v-card>
</template>

<script>
import '../../assets/css/AuthCard.css'
import RegisterForm from '../molecules/RegisterForm.vue'

export default {
  components: { RegisterForm },
}
</script>
