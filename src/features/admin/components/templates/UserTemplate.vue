<template>
  <v-card>
    <v-layout>
      <SidePanel />
      <v-main>
        <UsersTable />
      </v-main>
    </v-layout>
  </v-card>
</template>

<script>
import SidePanel from '../organisms/SidePanel.vue'
import UsersTable from '../organisms/UsersTable.vue'

export default {
  name: 'UserTemplate',
  components: {
    SidePanel,
    UsersTable,
  },
}
</script>

<style scoped>
main {
  height: 95vh;
  margin: 5vh 5vw 0 5vw;
}
</style>
