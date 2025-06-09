<template>
  <TransitionGroup
    tag="div"
    name="notificacion"
    class="fixed top-4 right-4 z-50 flex flex-col gap-2"
  >
    <div
      v-for="notificacion in notificaciones"
      :key="notificacion.id"
      class="item-notificacion"
      :class="[
        notificacion.tipo,
        'bg-white rounded-lg shadow-lg p-4 min-w-[300px] max-w-md relative overflow-hidden'
      ]"
    >
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0 w-5 h-5">
          <component :is="obtenerIcono(notificacion.tipo)" />
        </div>
        <p class="flex-1 text-sm text-gray-700">{{ notificacion.mensaje }}</p>
        <button
          class="flex-shrink-0 w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors"
          @click="eliminarNotificacion(notificacion.id)"
        >
          ×
        </button>
      </div>
      <div
        v-if="notificacion.duracion > 0"
        class="absolute bottom-0 left-0 h-1 bg-current opacity-20"
        :style="{ animationDuration: `${notificacion.duracion}ms` }"
      />
    </div>
  </TransitionGroup>
</template>

<script>
import { useNotification } from '../../composables/useNotification'

export default {
  name: 'NotificacionToast',
  setup() {
    const { notificaciones, eliminarNotificacion } = useNotification()

    const obtenerIcono = (tipo) => {
      const iconos = {
        exito: 'CheckCircleIcon',
        error: 'XCircleIcon',
        advertencia: 'ExclamationCircleIcon',
        info: 'InformationCircleIcon'
      }
      return iconos[tipo] || iconos.info
    }

    return {
      notificaciones,
      eliminarNotificacion,
      obtenerIcono
    }
  }
}
</script>

<style scoped>
.item-notificacion.exito {
  @apply border-l-4 border-green-500;
}

.item-notificacion.error {
  @apply border-l-4 border-red-500;
}

.item-notificacion.advertencia {
  @apply border-l-4 border-yellow-500;
}

.item-notificacion.info {
  @apply border-l-4 border-blue-500;
}

/* Animaciones */
.notificacion-enter-active,
.notificacion-leave-active {
  @apply transition-all duration-300 ease-out;
}

.notificacion-enter-from {
  @apply opacity-0 translate-x-full;
}

.notificacion-leave-to {
  @apply opacity-0 translate-x-full;
}

@keyframes progreso {
  from {
    width: 100%;
  }
  to {
    width: 0%;
  }
}
</style>
