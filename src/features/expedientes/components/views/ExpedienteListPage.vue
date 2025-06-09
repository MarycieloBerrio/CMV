<template>
  <div class="contenedor-pagina">
    <h1 class="titulo-pagina">Expedientes</h1>

    <FiltrosExpediente
      :estados-expediente="estadosExpediente"
      :filtros-iniciales="filtros"
      @actualizar-filtros="actualizarFiltros"
    />

    <div class="contenedor-tabla">
      <table class="tabla">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>ID Socio</th>
            <th>CURP</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="expediente in expedientes" :key="expediente.id">
            <td>{{ expediente.id }}</td>
            <td>{{ expediente.nombre }}</td>
            <td>{{ expediente.socioId }}</td>
            <td>{{ expediente.curp }}</td>
            <td>
              <span
                class="estado-badge"
                :class="obtenerClaseEstado(expediente.estado)"
              >
                {{ obtenerNombreEstado(expediente.estado) }}
              </span>
            </td>
            <td>
              <div class="acciones">
                <button
                  class="boton-accion"
                  @click="verDetalle(expediente.id)"
                >
                  Ver
                </button>
                <button
                  class="boton-accion"
                  @click="editarExpediente(expediente.id)"
                >
                  Editar
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="paginacion">
      <button
        class="boton-pagina"
        :disabled="paginaActual === 1"
        @click="cambiarPagina(paginaActual - 1)"
      >
        Anterior
      </button>
      <span class="texto-pagina">
        Página {{ paginaActual }} de {{ totalPaginas }}
      </span>
      <button
        class="boton-pagina"
        :disabled="paginaActual === totalPaginas"
        @click="cambiarPagina(paginaActual + 1)"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useNotification } from '@/shared/composables/useNotification'
import { ExpedienteService } from '../api/ExpedienteService'
import { ParametrizacionService } from '../api/ParametrizacionService'
import FiltrosExpediente from '../components/molecules/Filters.vue'

export default {
  name: 'ListaExpedientes',
  components: {
    FiltrosExpediente
  },
  setup() {
    const router = useRouter()
    const { notificacionError } = useNotification()

    const expedientes = ref([])
    const estadosExpediente = ref([])
    const cargando = ref(false)
    const paginaActual = ref(1)
    const totalPaginas = ref(1)
    const elementosPorPagina = 10

    const filtros = ref({
      expedienteId: '',
      nombre: '',
      socioId: '',
      curp: '',
      estado: ''
    })

    const cargarEstados = async () => {
      try {
        estadosExpediente.value = await ParametrizacionService.getEstadosExpediente()
      } catch {
        notificacionError('Error al cargar los estados de expediente')
      }
    }

    const cargarExpedientes = async () => {
      cargando.value = true
      try {
        const params = {
          pagina: paginaActual.value,
          elementosPorPagina,
          ...filtros.value
        }

        const respuesta = await ExpedienteService.getExpedientes(params)
        expedientes.value = respuesta.datos
        totalPaginas.value = Math.ceil(respuesta.total / elementosPorPagina)
      } catch {
        notificacionError('Error al cargar los expedientes')
      } finally {
        cargando.value = false
      }
    }

    const actualizarFiltros = (nuevosFiltros) => {
      filtros.value = nuevosFiltros
      paginaActual.value = 1
    }

    const cambiarPagina = (pagina) => {
      paginaActual.value = pagina
    }

    const verDetalle = (id) => {
      router.push(`/expedientes/${id}`)
    }

    const editarExpediente = (id) => {
      router.push(`/expedientes/${id}/editar`)
    }

    const obtenerNombreEstado = (estadoId) => {
      const estado = estadosExpediente.value.find(e => e.id === estadoId)
      return estado ? estado.nombre : 'Desconocido'
    }

    const obtenerClaseEstado = (estadoId) => {
      const clases = {
        'PENDIENTE': 'estado-pendiente',
        'EN_PROCESO': 'estado-proceso',
        'COMPLETADO': 'estado-completado',
        'RECHAZADO': 'estado-rechazado'
      }
      return clases[estadoId] || 'estado-desconocido'
    }

    // Observar cambios en los filtros y la página
    watch(
      [filtros, paginaActual],
      () => {
        cargarExpedientes()
      },
      { deep: true }
    )

    // Cargar datos iniciales
    cargarEstados()
    cargarExpedientes()

    return {
      expedientes,
      estadosExpediente,
      cargando,
      paginaActual,
      totalPaginas,
      filtros,
      actualizarFiltros,
      cambiarPagina,
      verDetalle,
      editarExpediente,
      obtenerNombreEstado,
      obtenerClaseEstado
    }
  }
}
</script>

<style scoped>
.contenedor-pagina {
  @apply p-6;
}

.titulo-pagina {
  @apply text-2xl font-bold text-gray-800 mb-6;
}

.contenedor-tabla {
  @apply bg-white rounded-lg shadow overflow-hidden;
}

.tabla {
  @apply min-w-full divide-y divide-gray-200;
}

.tabla thead {
  @apply bg-gray-50;
}

.tabla th {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
}

.tabla td {
  @apply px-6 py-4 whitespace-nowrap text-sm text-gray-900;
}

.estado-badge {
  @apply px-2 py-1 text-xs font-semibold rounded-full;
}

.estado-pendiente {
  @apply bg-yellow-100 text-yellow-800;
}

.estado-proceso {
  @apply bg-blue-100 text-blue-800;
}

.estado-completado {
  @apply bg-green-100 text-green-800;
}

.estado-rechazado {
  @apply bg-red-100 text-red-800;
}

.estado-desconocido {
  @apply bg-gray-100 text-gray-800;
}

.acciones {
  @apply flex space-x-2;
}

.boton-accion {
  @apply px-3 py-1 text-sm rounded-md;
  @apply bg-blue-500 text-white hover:bg-blue-600;
}

.paginacion {
  @apply flex items-center justify-center space-x-4 mt-6;
}

.boton-pagina {
  @apply px-4 py-2 rounded-md;
  @apply bg-gray-100 text-gray-700 hover:bg-gray-200;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}

.texto-pagina {
  @apply text-sm text-gray-600;
}
</style>
