import { ref } from 'vue'
import { useNotification } from './useNotification'

const TAMANO_MAXIMO = 10 * 1024 * 1024 // 10MB
const TIPOS_PERMITIDOS = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png'
]

export function useValidacionArchivo() {
  const { notificacionError } = useNotification()
  const errores = ref([])

  const validarArchivo = (archivo) => {
    errores.value = []

    // Validar tamaño
    if (archivo.size > TAMANO_MAXIMO) {
      errores.value.push(`El archivo excede el tamaño máximo permitido de ${TAMANO_MAXIMO / (1024 * 1024)}MB`)
    }

    // Validar tipo
    if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
      errores.value.push('Tipo de archivo no permitido. Formatos aceptados: PDF, DOC, DOCX, JPG, PNG')
    }

    if (errores.value.length > 0) {
      errores.value.forEach(error => notificacionError(error))
      return false
    }

    return true
  }

  const validarArchivos = (archivos) => {
    return Array.from(archivos).every(archivo => validarArchivo(archivo))
  }

  const obtenerExtension = (nombreArchivo) => {
    return nombreArchivo.split('.').pop().toLowerCase()
  }

  const esTipoValido = (tipo) => {
    return TIPOS_PERMITIDOS.includes(tipo)
  }

  return {
    errores,
    validarArchivo,
    validarArchivos,
    obtenerExtension,
    esTipoValido,
    TAMANO_MAXIMO,
    TIPOS_PERMITIDOS
  }
}
