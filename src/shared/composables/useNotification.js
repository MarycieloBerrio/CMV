import { ref } from 'vue'

const notificaciones = ref([])
let contadorId = 0

export function useNotification() {
  const agregarNotificacion = (mensaje, tipo = 'info', duracion = 5000) => {
    const id = ++contadorId
    notificaciones.value.push({
      id,
      mensaje,
      tipo,
      duracion
    })

    if (duracion > 0) {
      setTimeout(() => {
        eliminarNotificacion(id)
      }, duracion)
    }

    return id
  }

  const eliminarNotificacion = (id) => {
    const indice = notificaciones.value.findIndex(n => n.id === id)
    if (indice !== -1) {
      notificaciones.value.splice(indice, 1)
    }
  }

  const notificacionExito = (mensaje, duracion = 5000) => {
    return agregarNotificacion(mensaje, 'exito', duracion)
  }

  const notificacionError = (mensaje, duracion = 5000) => {
    return agregarNotificacion(mensaje, 'error', duracion)
  }

  const notificacionAdvertencia = (mensaje, duracion = 5000) => {
    return agregarNotificacion(mensaje, 'advertencia', duracion)
  }

  const notificacionInfo = (mensaje, duracion = 5000) => {
    return agregarNotificacion(mensaje, 'info', duracion)
  }

  return {
    notificaciones,
    agregarNotificacion,
    eliminarNotificacion,
    notificacionExito,
    notificacionError,
    notificacionAdvertencia,
    notificacionInfo
  }
}
