import { ref, computed } from 'vue'
import { getExpedientes, getDocumentosByExpediente, downloadDocumento, uploadDocumento, remitirDocumentos } from '../api/ExpedienteService'
import { getTiposDocumentosWithCategoria } from '../api/ParametrizacionService'
import { useNotification } from '@/shared/composables/useNotification'

export function useExpediente(expedienteId) {
  const expediente = ref(null)
  const documentos = ref([])
  const tiposDocumentos = ref([])
  const loading = ref(false)
  const error = ref(null)
  const { error: showError, success: showSuccess } = useNotification()

  const documentosFiltrados = computed(() => {
    if (!documentos.value) return []
    return documentos.value.filter(doc => doc.expediente_id === expedienteId)
  })

  const cargarExpediente = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await getExpedientes({ expediente_id: expedienteId })
      expediente.value = response.data[0]
    } catch (err) {
      error.value = 'Error al cargar el expediente'
      showError('No se pudo cargar la información del expediente')
      console.error('Error al cargar el expediente:', err)
    } finally {
      loading.value = false
    }
  }

  const cargarDocumentos = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await getDocumentosByExpediente(expedienteId)
      documentos.value = extraerDocumentos(response.ciclos_vida)
    } catch (err) {
      error.value = 'Error al cargar los documentos'
      showError('No se pudieron cargar los documentos del expediente')
      console.error('Error al cargar los documentos:', err)
    } finally {
      loading.value = false
    }
  }

  const cargarTiposDocumentos = async () => {
    try {
      const tipos = await getTiposDocumentosWithCategoria()
      tiposDocumentos.value = tipos.ciclos_vida || []
    } catch (err) {
      showError('No se pudieron cargar los tipos de documentos')
      console.error('Error al cargar tipos de documentos:', err)
    }
  }

  const descargarDocumento = async (documentoId) => {
    try {
      const pdfBlob = await downloadDocumento(expedienteId, documentoId)
      const url = URL.createObjectURL(pdfBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `documento_${documentoId}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      showSuccess('Documento descargado correctamente')
    } catch (err) {
      showError('No se pudo descargar el documento')
      console.error('Error al descargar documento:', err)
    }
  }

  const subirDocumento = async (tipoDocumentoId, file) => {
    try {
      const resultado = await uploadDocumento(expedienteId, tipoDocumentoId, file)
      if (resultado) {
        await cargarDocumentos()
        showSuccess('Documento subido correctamente')
      }
    } catch (err) {
      showError('No se pudo subir el documento')
      console.error('Error al subir documento:', err)
    }
  }

  const remitirExpediente = async () => {
    try {
      const resultado = await remitirDocumentos(expedienteId)
      if (resultado) {
        showSuccess('Expediente remitido correctamente')
      }
    } catch (err) {
      showError('No se pudo remitir el expediente')
      console.error('Error al remitir expediente:', err)
    }
  }

  const extraerDocumentos = (results) => {
    if (!results) return []

    const documentos = []
    results.forEach(ciclo => {
      ciclo.categorias.forEach(categoria => {
        categoria.tipos_documento.forEach(tipo => {
          if (tipo.documentos && tipo.documentos.length > 0) {
            const docsConMetadata = tipo.documentos.map(doc => ({
              ...doc,
              ciclo_vida: {
                id: ciclo.id,
                descripcion: ciclo.descripcion
              },
              categoria: {
                id: categoria.id,
                descripcion: categoria.descripcion
              },
              tipo_documento: {
                id: tipo.id,
                descripcion: tipo.descripcion,
                obligatorio: tipo.obligatorio
              }
            }))
            documentos.push(...docsConMetadata)
          }
        })
      })
    })
    return documentos
  }

  return {
    expediente,
    documentos,
    tiposDocumentos,
    loading,
    error,
    documentosFiltrados,
    cargarExpediente,
    cargarDocumentos,
    cargarTiposDocumentos,
    descargarDocumento,
    subirDocumento,
    remitirExpediente
  }
}
