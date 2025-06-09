<template>
  <div class="filtros-contenedor">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Filtro por ID de Expediente -->
      <div class="filtro-grupo">
        <label class="etiqueta-filtro">ID Expediente</label>
        <input
          type="text"
          v-model="filtrosLocales.expedienteId"
          class="input-filtro"
          placeholder="Buscar por ID"
          @input="actualizarFiltro('expedienteId', $event.target.value)"
        />
      </div>

      <!-- Filtro por Nombre -->
      <div class="filtro-grupo">
        <label class="etiqueta-filtro">Nombre</label>
        <input
          type="text"
          v-model="filtrosLocales.nombre"
          class="input-filtro"
          placeholder="Buscar por nombre"
          @input="actualizarFiltro('nombre', $event.target.value)"
        />
      </div>

      <!-- Filtro por ID de Socio -->
      <div class="filtro-grupo">
        <label class="etiqueta-filtro">ID Socio</label>
        <input
          type="text"
          v-model="filtrosLocales.socioId"
          class="input-filtro"
          placeholder="Buscar por ID socio"
          @input="actualizarFiltro('socioId', $event.target.value)"
        />
      </div>

      <!-- Filtro por CURP -->
      <div class="filtro-grupo">
        <label class="etiqueta-filtro">CURP</label>
        <input
          type="text"
          v-model="filtrosLocales.curp"
          class="input-filtro"
          placeholder="Buscar por CURP"
          @input="actualizarFiltro('curp', $event.target.value)"
        />
      </div>

      <!-- Filtro por Estado -->
      <div class="filtro-grupo">
        <label class="etiqueta-filtro">Estado</label>
        <select
          v-model="filtrosLocales.estado"
          class="input-filtro"
          @change="actualizarFiltro('estado', $event.target.value)"
        >
          <option value="">Todos los estados</option>
          <option
            v-for="estado in estadosExpediente"
            :key="estado.id"
            :value="estado.id"
          >
            {{ estado.nombre }}
          </option>
        </select>
      </div>

      <!-- Botón de limpiar filtros -->
      <div class="filtro-grupo flex items-end">
        <button
          class="boton-limpiar"
          @click="limpiarFiltros"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useNotification } from '@/shared/composables/useNotification'

export default {
  name: 'FiltrosExpediente',
  props: {
    estadosExpediente: {
      type: Array,
      required: true
    },
    filtrosIniciales: {
      type: Object,
      default: () => ({
        expedienteId: '',
        nombre: '',
        socioId: '',
        curp: '',
        estado: ''
      })
    }
  },
  emits: ['actualizar-filtros'],
  setup(props, { emit }) {
    const { notificacionInfo } = useNotification()
    const filtrosLocales = ref({ ...props.filtrosIniciales })
    let timeoutId = null

    const actualizarFiltro = (campo, valor) => {
      filtrosLocales.value[campo] = valor

      // Debounce para evitar demasiadas llamadas
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(() => {
        emit('actualizar-filtros', { ...filtrosLocales.value })
      }, 300)
    }

    const limpiarFiltros = () => {
      filtrosLocales.value = { ...props.filtrosIniciales }
      emit('actualizar-filtros', { ...filtrosLocales.value })
      notificacionInfo('Filtros limpiados')
    }

    // Observar cambios en los filtros iniciales
    watch(
      () => props.filtrosIniciales,
      (nuevosFiltros) => {
        filtrosLocales.value = { ...nuevosFiltros }
      },
      { deep: true }
    )

    return {
      filtrosLocales,
      actualizarFiltro,
      limpiarFiltros
    }
  }
}
</script>

<style scoped>
.filtros-contenedor {
  @apply bg-white p-4 rounded-lg shadow-sm mb-6;
}

.filtro-grupo {
  @apply flex flex-col space-y-1;
}

.etiqueta-filtro {
  @apply text-sm font-medium text-gray-700;
}

.input-filtro {
  @apply w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm;
  @apply focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
}

.boton-limpiar {
  @apply px-4 py-2 bg-gray-100 text-gray-700 rounded-md;
  @apply hover:bg-gray-200 transition-colors duration-200;
}
</style>
