<template>
  <div>
    <div v-if="loading">Cargando categorías...</div>
    <div v-else>
      <CategoriaItem
        v-for="categoria in categorias"
        :key="categoria.id"
        :categoria="categoria"
        @modificar="modificarCategoria"
        @deshabilitar="deshabilitarCategoria"
      />
    </div>
  </div>
</template>

<script>
import { getTiposDocumentosWithCategoria } from '../../api/ParametrizacionService'
import CategoriaItem from './CategoriaItem.vue'

export default {
  name: 'CategoriaDocumentos',
  components: { CategoriaItem },
  data() {
    return {
      categorias: [],
      loading: true
    }
  },
  async mounted() {
    this.loading = true
    try {
      const categorias = await getTiposDocumentosWithCategoria()
      this.categorias = categorias.ciclos_vida || []
      console.log(this.categorias)
    } catch (e) {
      this.categorias = []
    }
    this.loading = false
  },
  methods: {
    modificarCategoria(categoria) {
      // Aquí lógica para modificar
      alert('Modificar: ' + categoria.descripcion)
    },
    deshabilitarCategoria(categoria) {
      // Aquí lógica para deshabilitar
     // alert('Deshabilitar: ' + categoria.descripcion)
    }
  }
}
</script>

<style scoped>
</style>