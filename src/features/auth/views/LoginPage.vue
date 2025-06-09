<template>
  <AuthTemplate>
    <LoginCard />
  </AuthTemplate>
</template>

<script>
import AuthTemplate from '../components/templates/AuthTemplate.vue'
import LoginCard from '../components/organisms/LoginCard.vue'

export default {
  components: { AuthTemplate, LoginCard },
}
</script>
