<template>
  <div class="parametrizacion-container">
    <Header @logout="cerrarSesion" />
    <div class="content-parametrizacion">
      <div class="titulo-parametrizacion">
        <p>Menú de parametrización</p>
      </div>
      <div class="tabs">
        <button
          :class="{ active: tab === 'categorias' }"
          @click="tab = 'categorias'"
        >Categorías de documentos</button>
        <button
          :class="{ active: tab === 'tipos' }"
          @click="tab = 'tipos'"
        >Tipos de documentos</button>
      </div>
      <div class="tab-content">
        <CategoriaDocumentos v-if="tab === 'categorias'" />
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../organisms/Header.vue'
import CategoriaDocumentos from '../molecules/CategoriaDocumentos.vue'

export default {
  name: 'ParametrizacionPage',
  components: {
    Header,
    CategoriaDocumentos
  },
  data() {
    return {
      tab: 'categorias'
    }
  },
  methods: {
    cerrarSesion() {
      this.$store.dispatch('logout')
      this.$router.push('/')
      alert("Sesión cerrada")
    }
  }
}
</script>

<style scoped>
.parametrizacion-container {
  width: 100%;
  height: 100%;
  margin: auto;
  text-align: left;
  display: flex;
}
.content-parametrizacion{
  width: 100%;
}
.titulo-parametrizacion {
  margin: 2rem 0 1rem 5%;
  font-size: 2rem;
  color: #84BD00;
}
.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  margin-left: 5%;
}
.tabs button {
  background: none;
  border: none;
  padding: 0.25rem 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 8px 8px 0 0;
}
.tabs button.active {
  border-bottom: 2px solid #c6e37a;
  background: #84bd004f;

}
.tab-content {
  margin: 0 auto;
  width: 90%;
}
</style>
