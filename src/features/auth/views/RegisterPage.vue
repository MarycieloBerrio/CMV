<template>
  <AuthTemplate>
    <RegisterCard />
  </AuthTemplate>
</template>

<script>
import AuthTemplate from '../components/templates/AuthTemplate.vue'
import RegisterCard from '../components/organisms/RegisterCard.vue'

export default {
  components: { AuthTemplate, RegisterCard },
}
</script>
