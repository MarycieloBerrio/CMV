import { ref, computed } from 'vue'

export function useDocumento() {
  const documentoSeleccionado = ref(null)
  const documentosSeleccionados = ref([])
  const showTipoDocumentoModal = ref(false)
  const tipoDocumentoSeleccionado = ref(null)

  const seleccionarDocumento = (doc) => {
    documentoSeleccionado.value = doc
  }

  const deseleccionarDocumento = () => {
    documentoSeleccionado.value = null
  }

  const toggleDocumentoSeleccionado = (doc) => {
    const index = documentosSeleccionados.value.findIndex(d => d.id === doc.id)
    if (index === -1) {
      documentosSeleccionados.value.push(doc)
    } else {
      documentosSeleccionados.value.splice(index, 1)
    }
  }

  const limpiarDocumentosSeleccionados = () => {
    documentosSeleccionados.value = []
  }

  const abrirSelectorDocumento = () => {
    showTipoDocumentoModal.value = true
  }

  const cerrarSelectorDocumento = () => {
    showTipoDocumentoModal.value = false
  }

  const seleccionarTipoDocumento = (tipo) => {
    tipoDocumentoSeleccionado.value = tipo
    showTipoDocumentoModal.value = false
  }

  const limpiarTipoDocumentoSeleccionado = () => {
    tipoDocumentoSeleccionado.value = null
  }

  const hayDocumentosSeleccionados = computed(() => {
    return documentosSeleccionados.value.length > 0
  })

  return {
    documentoSeleccionado,
    documentosSeleccionados,
    showTipoDocumentoModal,
    tipoDocumentoSeleccionado,
    hayDocumentosSeleccionados,
    seleccionarDocumento,
    deseleccionarDocumento,
    toggleDocumentoSeleccionado,
    limpiarDocumentosSeleccionados,
    abrirSelectorDocumento,
    cerrarSelectorDocumento,
    seleccionarTipoDocumento,
    limpiarTipoDocumentoSeleccionado
  }
}
