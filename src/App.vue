<template>
  <div class="min-h-screen font-karla antialiased text-gray-800">
    <router-view />
    <NotificacionToast />
  </div>
</template>

<script>
import NotificationToast from '@/shared/components/atoms/Toast.vue'

export default {
  name: 'App',
  components: {
    NotificationToast
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Karla:wght@400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Karla', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #eef0f2;
}

.app {
  min-height: 100vh;
}

#app {
  font-family: 'Karla', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
}
</style>
