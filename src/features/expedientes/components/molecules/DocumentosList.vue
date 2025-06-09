<template>
  <div class="seccion-documentos">
    <h3 class="titulo-lista">Lista de documentos</h3>
    <div class="lista-documentos">
      <div v-if="documentosFiltrados.length === 0" class="sin-documentos">
        No hay ningún documento cargado
      </div>
      <TransitionGroup name="lista" tag="div" class="grid-documentos">
        <div
          v-for="doc in documentosFiltrados"
          :key="doc.id"
          class="item-documento"
          :class="{ 'seleccionado': esDocumentoSeleccionado(doc) }"
        >
          <div class="contenido-documento">
            <span
              class="nombre-documento"
              @click="$emit('seleccionar-documento', doc)"
            >
              {{ doc.nombre }}
            </span>
            <input
              type="checkbox"
              :id="'doc-' + doc.id"
              :checked="esDocumentoSeleccionado(doc)"
              @change="alternarSeleccionDocumento(doc)"
              class="checkbox-documento"
            />
          </div>
        </div>
      </TransitionGroup>
    </div>

    <div class="botones-accion">
      <BaseButton
        v-if="hayDocumentosSeleccionados"
        @click="$emit('descargar-documentos')"
        class="bg-primary text-white hover:bg-opacity-90 boton-descargar"
      >
        Descargar ({{ documentosSeleccionados.length }})
      </BaseButton>
      <BaseButton @click="$emit('abrir-selector')" class="bg-gray-200 text-gray-700 hover:bg-gray-300">
        Cargar documento
      </BaseButton>
      <BaseButton @click="$emit('remitir')" class="bg-primary text-white hover:bg-opacity-90">
        Enviar a remisión
      </BaseButton>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import BaseButton from '@/features/auth/components/atoms/BaseButton.vue'

export default {
  name: 'ListaDocumentos',
  components: {
    BaseButton
  },
  props: {
    documentosFiltrados: {
      type: Array,
      required: true
    },
    documentosSeleccionados: {
      type: Array,
      required: true
    }
  },
  emits: [
    'seleccionar-documento',
    'descargar-documentos',
    'abrir-selector',
    'remitir',
    'update:documentos-seleccionados'
  ],
  setup(props, { emit }) {
    const hayDocumentosSeleccionados = computed(() => props.documentosSeleccionados.length > 0)

    const esDocumentoSeleccionado = (doc) => {
      return props.documentosSeleccionados.some(seleccionado => seleccionado.id === doc.id)
    }

    const alternarSeleccionDocumento = (doc) => {
      const nuevaSeleccion = esDocumentoSeleccionado(doc)
        ? props.documentosSeleccionados.filter(seleccionado => seleccionado.id !== doc.id)
        : [...props.documentosSeleccionados, doc]

      emit('update:documentos-seleccionados', nuevaSeleccion)
    }

    return {
      hayDocumentosSeleccionados,
      esDocumentoSeleccionado,
      alternarSeleccionDocumento
    }
  }
}
</script>

<style scoped>
.seccion-documentos {
  @apply py-6;
}

.titulo-lista {
  @apply text-xl font-semibold text-gray-800 mb-4;
}

.lista-documentos {
  @apply mb-6;
}

.sin-documentos {
  @apply text-center text-gray-500 py-8 bg-gray-50 rounded-lg;
}

.grid-documentos {
  @apply grid gap-2;
}

.item-documento {
  @apply p-3 border border-gray-200 rounded-lg transition-all duration-200;
}

.item-documento:hover {
  @apply bg-gray-50 transform -translate-y-0.5 shadow-sm;
}

.item-documento.seleccionado {
  @apply bg-blue-50 border-blue-500;
}

.contenido-documento {
  @apply flex justify-between items-center;
}

.nombre-documento {
  @apply cursor-pointer text-gray-700 transition-colors duration-200;
}

.nombre-documento:hover {
  @apply text-blue-600;
}

.checkbox-documento {
  @apply w-5 h-5 cursor-pointer;
}

.botones-accion {
  @apply flex gap-4 flex-wrap;
}

/* Transiciones para la lista */
.lista-enter-active,
.lista-leave-active {
  @apply transition-all duration-300 ease-out;
}

.lista-enter-from,
.lista-leave-to {
  @apply opacity-0 translate-y-8;
}

.lista-move {
  @apply transition-transform duration-300 ease-out;
}
</style>
