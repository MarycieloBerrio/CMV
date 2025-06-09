<template>
  <div class="document-preview-container" ref="container">
    <!-- Mostrar controles para imágenes y PDFs -->
    <div class="preview-controls" :class="{ 'pdf-controls': isPDF }">
      <div class="fullscreen-controls">
        <button @click="toggleFullscreen" class="control-button" :title="isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'">

          <span class="control-text">
  <img v-if="isFullscreen" src="../../assets/images/minimizearrows.svg" alt="Exit Fullscreen" style="width: 1rem;" />
  <img v-else src="../../assets/images/maximize_icon.svg" alt="Enter Fullscreen" />
</span>
        </button>
      </div>
      <template v-if="isImage">
        <div class="zoom-controls">
          <button @click="zoomIn" class="control-button" title="Acercar">
            <span class="control-text">+</span>
          </button>
          <span class="zoom-text">{{ Math.round(zoom * 100) }}%</span>
          <button @click="zoomOut" class="control-button" title="Alejar">
            <span class="control-text">-</span>
          </button>
        </div>
        <div class="rotation-controls">
          <button @click="rotateLeft" class="control-button" title="Rotar a la izquierda">
            <span class="control-text">↺</span>
          </button>
          <button @click="rotateRight" class="control-button" title="Rotar a la derecha">
            <span class="control-text">↻</span>
          </button>
        </div>
      </template>
    </div>

    <div class="preview-content" :class="{ 'pdf-mode': isPDF, 'fullscreen': isFullscreen }">
      <!-- Vista previa de PDF -->
      <div v-if="isPDF" class="pdf-preview">
        <embed
          :src="pdfUrl"
          type="application/pdf"
          width="100%"
          height="100%"
        />
      </div>
      
      <!-- Vista previa de imagen -->
      <div v-else-if="isImage" class="image-preview" :style="contentStyle">
        <img 
          :src="imageUrl" 
          :alt="documento.nombre" 
          class="preview-image"
          @wheel="handleWheel"
        />
      </div>
      <div v-else class="loading-preview">
        Cargando vista previa...
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import '../../assets/css/DocumentPreview.css'

export default {
  name: 'DocumentPreview',
  props: {
    documento: {
      type: Object,
      required: true
    },
    expedienteId: {
      type: [String, Number],
      required: true
    },
    previewData: {
      type: [Object, String],
      default: null
    }
  },
  setup(props, { emit }) {
    const container = ref(null)
    const zoom = ref(1)
    const rotation = ref(0)
    const isFullscreen = ref(false)
    const previewData = ref(props.previewData)
    const isLoading = ref(false)
    
    watch(() => props.previewData, (newValue) => {
      previewData.value = newValue
    })
    
    const isPDF = computed(() => {
    
      if (props.documento.url_presignada && props.documento.url_presignada.includes('.pdf')) {
        return true
      }
 
      if (props.documento.tipo) {
        return props.documento.tipo === 'application/pdf' || props.documento.nombre.toLowerCase().endsWith('.pdf')
      }
 
      if (props.documento.nombre) {
        return props.documento.nombre.toLowerCase().endsWith('.pdf')
      }
      if (props.documento.tipo_documento) {
        return props.documento.tipo_documento.toLowerCase().includes('pdf')
      }
      return false
    })
    
    const isImage = computed(() => {
      // Verificar por URL presignada que contiene extensiones de imagen
      if (props.documento.url_presignada) {
        const url = props.documento.url_presignada.toLowerCase()
        return /\.(jpg|jpeg|png|gif|bmp|webp)/.test(url)
      }
      // Verificar por tipo de documento
      if (props.documento.tipo) {
        return props.documento.tipo.startsWith('image/') || 
               /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(props.documento.nombre)
      }
      // Verificar por nombre de documento
      if (props.documento.nombre) {
        return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(props.documento.nombre)
      }
      return false
    })
    
    const contentStyle = computed(() => ({
      transform: `scale(${zoom.value}) rotate(${rotation.value}deg)`,
      transformOrigin: 'center center'
    }))
    
    const pdfUrl = computed(() => {
      if (isPDF.value) {

        if (props.documento.url_presignada) {
          console.log("URL presignada encontrada:", props.documento.url_presignada);
          return props.documento.url_presignada;
        }
        // Si tenemos datos de vista previa
        if (previewData.value) {
          // Si previewData es una URL
          if (typeof previewData.value === 'string' && previewData.value.startsWith('http')) {
            return previewData.value
          }
          // Si previewData es contenido binario
          const blob = new Blob([previewData.value], { type: 'application/pdf' })
          return URL.createObjectURL(blob)
        }
        // Si tenemos un archivo local
        if (props.documento.archivo instanceof File) {
          return URL.createObjectURL(props.documento.archivo)
        }
      }
      return ''
    })
    
    const imageUrl = computed(() => {
      if (isImage.value) {
    
        if (props.documento.url_presignada) {
          return props.documento.url_presignada
        }
        if (previewData.value) {
          // Si previewData es una URL
          if (typeof previewData.value === 'string' && previewData.value.startsWith('http')) {
            return previewData.value
          }
          if (typeof previewData.value === 'string' && !previewData.value.startsWith('http')) {
            return `data:image/${getImageType(props.documento.nombre)};base64,${previewData.value}`
          }
        }
        // Si tenemos un archivo local
        if (props.documento.archivo instanceof File) {
          return URL.createObjectURL(props.documento.archivo)
        }
      }
      return ''
    })

    // Función para determinar el tipo de imagen basado en la extensión
    const getImageType = (filename) => {
      const ext = filename.split('.').pop().toLowerCase()
      switch (ext) {
        case 'jpg':
        case 'jpeg':
          return 'jpeg'
        case 'png':
          return 'png'
        case 'gif':
          return 'gif'
        case 'bmp':
          return 'bmp'
        case 'webp':
          return 'webp'
        default:
          return 'jpeg'
      }
    }

    // Cargar la vista previa cuando cambie el documento
    watch(() => props.documento, async (newDoc) => {
      if (newDoc && newDoc.documento_id && props.expedienteId) {
        isLoading.value = true
        try {
          // Emitir un evento para que el componente padre cargue la vista previa
          emit('load-preview', props.expedienteId, newDoc.documento_id)
        } catch (error) {
          console.error('Error al solicitar la vista previa:', error)
        } finally {
          isLoading.value = false
        }
      }
    }, { immediate: true })

    // Método para actualizar los datos de la vista previa
    const updatePreviewData = (data) => {
      // Si data es un objeto con una propiedad url_presignada
      if (data && data.url_presignada) {
        props.documento.url_presignada = data.url_presignada
      } else {
        previewData.value = data
      }
    }

    const zoomIn = () => {
      if (zoom.value < 5) {
        zoom.value = Math.min(5, zoom.value + 0.25)
      }
    }

    const zoomOut = () => {
      if (zoom.value > 0.25) {
        zoom.value = Math.max(0.25, zoom.value - 0.25)
      }
    }

    const handleWheel = (event) => {
      if (event.ctrlKey) {
        event.preventDefault()
        if (event.deltaY < 0) {
          zoomIn()
        } else {
          zoomOut()
        }
      }
    }

    const rotateLeft = () => {
      rotation.value = (rotation.value - 90) % 360
    }

    const rotateRight = () => {
      rotation.value = (rotation.value + 90) % 360
    }

    const toggleFullscreen = async () => {
      try {
        if (!isFullscreen.value) {
          if (container.value.requestFullscreen) {
            await container.value.requestFullscreen()
          } else if (container.value.webkitRequestFullscreen) {
            await container.value.webkitRequestFullscreen()
          } else if (container.value.msRequestFullscreen) {
            await container.value.msRequestFullscreen()
          }
        } else {
          if (document.exitFullscreen) {
            await document.exitFullscreen()
          } else if (document.webkitExitFullscreen) {
            await document.webkitExitFullscreen()
          } else if (document.msExitFullscreen) {
            await document.msExitFullscreen()
          }
        }
      } catch (error) {
        console.error('Error al cambiar modo pantalla completa:', error)
      }
    }

    const handleFullscreenChange = () => {
      isFullscreen.value = !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement)
    }

    onMounted(() => {
      document.addEventListener('wheel', handleWheel, { passive: false })
      document.addEventListener('fullscreenchange', handleFullscreenChange)
      document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.addEventListener('msfullscreenchange', handleFullscreenChange)
    })

    onUnmounted(() => {
      document.removeEventListener('wheel', handleWheel)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
      document.removeEventListener('msfullscreenchange', handleFullscreenChange)
    })
// Todo esto es por si el archivo es imagen, en los pdfs no es necesario y es más sencillo
    return {
      container,
      zoom,
      rotation,
      isPDF,
      isImage,
      pdfUrl,
      imageUrl,
      contentStyle,
      isFullscreen,
      isLoading,
      updatePreviewData,
      zoomIn,
      zoomOut,
      rotateLeft,
      rotateRight,
      handleWheel,
      toggleFullscreen
    }
  }
}
</script>

