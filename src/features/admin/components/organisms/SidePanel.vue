<template>
  <v-navigation-drawer
    width="250"
    permanent
    class="!bg-[#417100] shadow-[3px_0_10px_black] rounded-r-[20px]"
  >
    <div class="py-6 text-center border-b border-[#bdbdbd]">
      <h2 class="text-white font-bold m-0">Caja Morelia</h2>
    </div>

    <v-list density="compact" nav class="p-[10px]">
      <v-list-item
        prepend-icon="mdi-account-multiple"
        title="Users"
        value="users"
        to="/users"
        class="text-white rounded-[10px] my-[5px] transition-all duration-300 ease-in-out hover:bg-[#828282] hover:translate-x-[5px] relative nav-item"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-cog"
        title="Settings"
        value="settings"
        to="/"
        class="text-white rounded-[10px] my-[5px] transition-all duration-300 ease-in-out hover:bg-[#828282] hover:translate-x-[5px] relative nav-item"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-chart-bar"
        title="Analytics"
        value="analytics"
        to="/"
        class="text-white rounded-[10px] my-[5px] transition-all duration-300 ease-in-out hover:bg-[#828282] hover:translate-x-[5px] relative nav-item"
      ></v-list-item>
      <v-list-item
        prepend-icon="mdi-logout"
        title="Logout"
        value="logout"
        @click="logout"
        class="text-white rounded-[10px] my-[5px] transition-all duration-300 ease-in-out hover:bg-[#828282] hover:translate-x-[5px] relative nav-item"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: 'SidePanel',
  methods: {
    logout() {
      this.$store.dispatch('logout')
      this.$router.push('/')
    },
  },
}
</script>

<style>
.nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background: white;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-item:hover::before {
  opacity: 1;
}

.nav-item.v-list-item--active {
  background: #828282 !important;
  font-weight: bold;
}
</style>
