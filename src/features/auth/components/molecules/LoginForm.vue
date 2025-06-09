<template>
  <FormKit type="form" :actions="false" @submit="handleLogin" class="auth-form">
    <h1 class="text-h4 text-center mt-8">Login to your account</h1>
    <div class="w-[90%] mx-auto mt-[5%]">
      <FormKit
        type="TextFieldForm"
        name="email"
        vuetify-label="Email"
        placeholder="Enter your email"
        outer-class="mb-8"
      />

      <FormKit
        type="PasswordFieldForm"
        name="password"
        vuetify-label="Password"
        placeholder="Enter your password"
        outer-class="mb-10"
      />

      <BaseButton class="mt-4 py-6" style="width: 100%; max-width: 200px; margin: 0 auto">
        Login
      </BaseButton>
    </div>
  </FormKit>
</template>

<script>
import BaseButton from '../atoms/BaseButton.vue'
import Swal from 'sweetalert2'
import { loginMocked } from '../../api/AuthService'
import { validateEmail, validatePassword } from '@/utils/validations/UserValidation'

export default {
  components: { BaseButton },
  methods: {
    handleLogin(data) {
      const isEmailValid = validateEmail(data.email)
      const isPasswordValid = validatePassword(data.password)

      if (!isEmailValid || !isPasswordValid) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Please check your email and password.',
        })
        return
      }
      const token = loginMocked(data.email, data.password)
      this.$store.dispatch('login', token)
      this.$router.push('/users')
    },
  },
}
</script>
