<template>
  <div class="header-container" :class="{ 'header-compacto': modoCompacto }">
    <div class="toggle-button" @click="toggleModo">
      <v-icon class="icono-toggle" color="white" size="16">
        {{ modoCompacto ? 'mdi-chevron-right' : 'mdi-chevron-left' }}
      </v-icon>
    </div>

    <div class="header-logo-inicio-usuario">
      <img v-if="!modoCompacto" src="../../assets/images/header/logo.png"/>
      <img v-else src="../../assets/images/header/logo-compacto.png"/>

      <div class="botones-header">
        <div class="header-lista-expedientes" @click="$router.push('/expedientes')">
          <v-icon :class="['icono', { compacto: modoCompacto }]">mdi-view-dashboard</v-icon>
          <p v-if="!modoCompacto">Lista de expedientes</p>
        </div>

        <div class="header-inicio" @click="$router.push('/expedientes/parametrizacion')">
          <v-icon :class="['icono', { compacto: modoCompacto }]">mdi-sitemap</v-icon>
          <p v-if="!modoCompacto">Menú de parametrización</p>
        </div>
      </div>
    </div>

    <button @click="$emit('logout')" class="boton-salir">
      <v-icon :class="['icono', { compacto: modoCompacto }]">mdi-logout</v-icon>
      <span v-if="!modoCompacto">Salir</span>
    </button>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      modoCompacto: localStorage.getItem('modoCompacto') === 'true' || false
    }
  },
  methods: {
    toggleModo() {
      this.modoCompacto = !this.modoCompacto;
      localStorage.setItem('modoCompacto', this.modoCompacto);
      this.$emit('toggle-sidebar', this.modoCompacto);
    }
  }
}
</script>

<style scoped>
.header-container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  background-color: #BEC8C8;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  padding: 3rem 0;
  align-items: center;
  width: 20rem;
  transition: all 0.3s ease;
}

.header-compacto {
  width: 5rem;
  background-color: #84BD00;
}

.toggle-button {
  position: absolute;
  right: -1rem;
  top: 1rem;
  background-color: inherit;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

.header-logo-inicio-usuario {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
}

.botones-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  padding: 0 1rem;
}

.header-lista-expedientes,
.header-inicio {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  cursor: pointer;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
}

.header-lista-expedientes:hover,
.header-inicio:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.boton-salir {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  color: white;
  width: 100%;
  justify-content: center;
}

.icono {
  color: white;
  font-size: 1.5rem;
}

.compacto {
  color: white;
}
</style>
