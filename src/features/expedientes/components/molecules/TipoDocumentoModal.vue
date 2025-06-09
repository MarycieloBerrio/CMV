<template>
  <div v-if="modelValue" class="modal-overlay">
    <div class="modal-contenido">
      <div class="modal-encabezado">
        <h3 class="modal-titulo">Seleccionar tipo de documento</h3>
        <button class="modal-cerrar" @click="$emit('update:modelValue', false)">×</button>
      </div>

      <div class="modal-cuerpo">
        <div class="seccion-tipo">
          <label class="etiqueta">Tipo de documento:</label>
          <select
            v-model="tipoDocumentoSeleccionado"
            class="selector"
            :class="{ 'error': errores.tipo }"
          >
            <option value="">Seleccione un tipo</option>
            <option
              v-for="tipo in tiposDocumentos"
              :key="tipo.id"
              :value="tipo.id"
            >
              {{ tipo.nombre }}
            </option>
          </select>
          <span v-if="errores.tipo" class="mensaje-error">{{ errores.tipo }}</span>
        </div>

        <div class="seccion-archivo">
          <label class="etiqueta">Archivo:</label>
          <div
            class="area-arrastre"
            :class="{ 'error': errores.archivo }"
            @dragover.prevent
            @drop.prevent="manejarDrop"
          >
            <input
              type="file"
              ref="inputArchivo"
              class="input-archivo"
              @change="manejarSeleccionArchivo"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <div class="contenido-area-arrastre">
              <span v-if="!archivoSeleccionado" class="texto-arrastre">
                Arrastre un archivo aquí o haga clic para seleccionar
              </span>
              <div v-else class="info-archivo">
                <span class="nombre-archivo">{{ archivoSeleccionado.name }}</span>
                <span class="tamano-archivo">{{ formatearTamano(archivoSeleccionado.size) }}</span>
                <button
                  class="boton-eliminar"
                  @click.stop="eliminarArchivo"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
          <span v-if="errores.archivo" class="mensaje-error">{{ errores.archivo }}</span>
          <div class="info-formatos">
            Formatos permitidos: PDF, DOC, DOCX, JPG, PNG (máx. 10MB)
          </div>
        </div>
      </div>

      <div class="modal-pie">
        <button
          class="boton-cancelar"
          @click="$emit('update:modelValue', false)"
        >
          Cancelar
        </button>
        <button
          class="boton-guardar"
          @click="guardar"
          :disabled="cargando"
        >
          {{ cargando ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useNotification } from '@/shared/composables/useNotification'
import { useValidacionArchivo } from '@/shared/composables/useValidacionArchivo'

export default {
  name: 'ModalTipoDocumento',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    tiposDocumentos: {
      type: Array,
      required: true
    }
  },
  emits: ['update:modelValue', 'guardar'],
  setup(props, { emit }) {
    const { notificacionError } = useNotification()
    const { validarArchivo } = useValidacionArchivo()

    const tipoDocumentoSeleccionado = ref('')
    const archivoSeleccionado = ref(null)
    const inputArchivo = ref(null)
    const cargando = ref(false)
    const errores = ref({
      tipo: '',
      archivo: ''
    })

    const validarFormulario = () => {
      errores.value = {
        tipo: '',
        archivo: ''
      }

      if (!tipoDocumentoSeleccionado.value) {
        errores.value.tipo = 'Debe seleccionar un tipo de documento'
      }

      if (!archivoSeleccionado.value) {
        errores.value.archivo = 'Debe seleccionar un archivo'
      }

      return !errores.value.tipo && !errores.value.archivo
    }

    const manejarSeleccionArchivo = (evento) => {
      const archivo = evento.target.files[0]
      if (archivo) {
        if (validarArchivo(archivo)) {
          archivoSeleccionado.value = archivo
          errores.value.archivo = ''
        } else {
          inputArchivo.value.value = ''
          archivoSeleccionado.value = null
        }
      }
    }

    const manejarDrop = (evento) => {
      const archivo = evento.dataTransfer.files[0]
      if (archivo) {
        if (validarArchivo(archivo)) {
          archivoSeleccionado.value = archivo
          errores.value.archivo = ''
        }
      }
    }

    const eliminarArchivo = () => {
      archivoSeleccionado.value = null
      if (inputArchivo.value) {
        inputArchivo.value.value = ''
      }
    }

    const formatearTamano = (bytes) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const tamanos = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + tamanos[i]
    }

    const guardar = async () => {
      if (!validarFormulario()) {
        return
      }

      cargando.value = true
      try {
        await emit('guardar', {
          tipoDocumentoId: tipoDocumentoSeleccionado.value,
          archivo: archivoSeleccionado.value
        })
        emit('update:modelValue', false)
      } catch {
        notificacionError('Error al guardar el documento')
      } finally {
        cargando.value = false
      }
    }

    return {
      tipoDocumentoSeleccionado,
      archivoSeleccionado,
      inputArchivo,
      cargando,
      errores,
      manejarSeleccionArchivo,
      manejarDrop,
      eliminarArchivo,
      formatearTamano,
      guardar
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  @apply fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50;
}

.modal-contenido {
  @apply bg-white rounded-lg shadow-xl w-full max-w-md mx-4;
}

.modal-encabezado {
  @apply flex justify-between items-center p-4 border-b;
}

.modal-titulo {
  @apply text-lg font-semibold text-gray-800;
}

.modal-cerrar {
  @apply text-gray-500 hover:text-gray-700 text-2xl;
}

.modal-cuerpo {
  @apply p-4 space-y-4;
}

.seccion-tipo,
.seccion-archivo {
  @apply space-y-2;
}

.etiqueta {
  @apply block text-sm font-medium text-gray-700;
}

.selector {
  @apply w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

.selector.error {
  @apply border-red-500;
}

.area-arrastre {
  @apply border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors;
  @apply hover:border-blue-500 hover:bg-blue-50;
}

.area-arrastre.error {
  @apply border-red-500;
}

.input-archivo {
  @apply hidden;
}

.contenido-area-arrastre {
  @apply space-y-2;
}

.texto-arrastre {
  @apply text-gray-500;
}

.info-archivo {
  @apply flex flex-col items-center space-y-2;
}

.nombre-archivo {
  @apply font-medium text-gray-700;
}

.tamano-archivo {
  @apply text-sm text-gray-500;
}

.boton-eliminar {
  @apply text-red-500 hover:text-red-700 text-sm;
}

.info-formatos {
  @apply text-xs text-gray-500 mt-1;
}

.mensaje-error {
  @apply text-sm text-red-500;
}

.modal-pie {
  @apply flex justify-end gap-2 p-4 border-t;
}

.boton-cancelar {
  @apply px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200;
}

.boton-guardar {
  @apply px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:opacity-50;
}
</style>
