<template>
  <div class="expediente-detalle-container" :class="{ 'expediente-detalle-container-compacto': isSidebarCompact }">
    <Header @logout="cerrarSesion" @toggle-sidebar="handleSidebarToggle" />

    <div class="content" v-if="expediente">
      <div class="header">
        <button class="back-button" @click="goBack">
          <img src="../../assets/images/return.png" alt="Volver" class="back-icon" />
        </button>
        <p class="titulo">Detalle de expediente: {{ expedienteId }}</p>
      </div>
      <div class="detalles-expediente-container">
        <div class="detalles-container">
          <p>Nombre: {{ expediente.nombre }}</p>
          <p>CURP: {{ expediente.curp }}</p>
          <p>ID Socio: {{ expediente.socio_id}}</p>
          <p>Fecha de nacimiento: {{ formatearFecha(expediente.fecha_nacimiento) }}</p>
        </div>
        <div class="fechas-container">
          <p>Fecha de creación: {{ formatearFecha(expediente.fecha_creacion) }}</p>
          <p>Fecha de modificación: {{ formatearFecha(expediente.fecha_modificacion) }}</p>
        </div>
      </div>

      <div class="informacion-personal">
        <div class="categorias-documentos">
          <p
            :class="['categoria-tab', { activa: categoriaSeleccionada === 'Socio' }]"
            @click="categoriaSeleccionada = 'Socio'"
          >
            Información personal
          </p>
          <p
            :class="['categoria-tab', { activa: categoriaSeleccionada === 'Pasivo' }]"
            @click="categoriaSeleccionada = 'Pasivo'"
          >
            Operaciones pasivas
          </p>
          <p
            :class="['categoria-tab', { activa: categoriaSeleccionada === 'Activo' }]"
            @click="categoriaSeleccionada = 'Activo'"
          >
            Operaciones activas
          </p>
        </div>

        <hr class="linea-divisora"/>
        <div class="documentos-section">
          <template v-if="!documentoSeleccionado">
            <p class="documentos-section-titulo">Lista de documentos</p>
            <div class="documentos-actions">
              <button
                v-if="documentosSeleccionados.length > 0"
                @click="descargarDocumentosSeleccionados"
                class="boton-descargar"
              >
                Descargar ({{ documentosSeleccionados.length }})
              </button>
            </div>

            <div v-if="categoriaSeleccionada && documentosFiltrados.length > 0">
              <ul class="documentos-list">
                <li
                  class="documento-item"
                  v-for="(doc, index) in documentosFiltrados"
                  :key="index"
                >
                  <div class="documento-content" v-if="doc.expediente_id == expedienteId">
                    <span
                      class="documento-nombre"
                      @click="seleccionarDocumento(doc)"
                    >
                      {{ doc.nombre }}
                    </span>
                    <input
                      type="checkbox"
                      :id="'doc-' + index"
                      v-model="documentosSeleccionados"
                      :value="doc"
                      class="documento-checkbox"
                    />
                  </div>
                </li>
              </ul>
            </div>
            <p v-else>No hay documentos cargados</p>

            <input
              type="file"
              ref="fileInput"
              @change="handleFileUpload"
              style="display: none"
            />
            <button @click="abrirSelectorDocumento" class="boton-cargar">Cargar documento
              <img src="../../assets/images/upload.png" alt="Cargar documento" class="icono-cargar"/>
            </button>
            <button @click="remitirExpediente" class="boton-cargar">Enviar a revisión</button>

            <!-- Modal para seleccionar tipo de documento -->
            <div v-if="mostrarModalTipoDocumento" class="modal-tipo-documento">
              <div class="modal-contenido">
                <div class="modal-header">
                  <h3>Seleccionar tipo de documento</h3>
                  <button @click="cerrarModalTipoDocumento" class="boton-cerrar">×</button>
                </div>
                <div class="modal-body">
                  <div v-for="ciclo in categoriasDocumentos" :key="ciclo.id" class="categoria-documentos">
                    <h4>{{ ciclo.descripcion }}</h4>
                    <div v-for="categoria in ciclo.categorias" :key="categoria.id">
                      <h5>{{ categoria.descripcion }}</h5>
                      <ul class="lista-tipos-documentos">
                        <li v-for="tipo in categoria.tipos_documento" :key="tipo.id"
                            @click="seleccionarTipoDocumento(tipo)"
                            class="tipo-documento-item">
                          {{ tipo.descripcion }}
                          <span v-if="tipo.obligatorio" class="obligatorio">*</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <template v-else>
            <div class="preview-documento">
              <div class="preview-documento-header">
                <button @click="documentoSeleccionado = null" class="boton-volver-preview">←</button>
                <p class="nombre-documento-preview">{{ documentoSeleccionado.nombre }}</p>
              </div>
              <DocumentPreview
                :documento="documentoSeleccionado"
                :expedienteId="expedienteId"
                class="document-preview"
              />
              <p>ID del documento: {{ documentoSeleccionado.nombre }}</p>
              <p>Tipo de documento: {{ documentoSeleccionado.tipo || 'PDF' }}</p>
              <input
                type="file"
                ref="updateFileInput"
                @change="actualizarDocumento"
                style="display: none"
              />
              <button @click="$refs.updateFileInput.click()" class="boton-cargar">Actualizar documento</button>
            </div>
          </template>
        </div>
      </div>
    </div>
    <div v-else class="loading">
      Cargando expediente...
    </div>
  </div>
</template>

<script>
import Header from '../organisms/Header.vue'
import DocumentPreview from '../molecules/DocumentPreview.vue'
import { getDocumentosByExpediente, getExpedientes, downloadDocumento, getDocumentoPreview, uploadDocumento, remitirDocumentos } from '../../api/ExpedienteService'
import { getTiposDocumentosWithCategoria } from "../../api/ParametrizacionService"
import '../../assets/css/ExpedienteDetalle.css'

export default {
  name: 'ExpedienteDetallePage',
  components: {
    Header,
    DocumentPreview
  },
  data() {
    return {
      expedienteId: this.$route.params.id,
      expediente: null,
      documentos: [],
      documentoSeleccionado: null,
      documentosSeleccionados: [],
      documentoPreviewData: null,
      categoriasDocumentos: [],
      tipoDocumentoSeleccionado: null,
      mostrarModalTipoDocumento: false,
      socio: [],
      pasivos: [],
      activos: [],
      categoriaSeleccionada: 'Socio',
      isSidebarCompact: localStorage.getItem('modoCompacto') === 'true' || false
    }
  },
  computed: {
    documentosFiltrados() {
      if (this.categoriaSeleccionada === 'Socio') return this.socio;
      if (this.categoriaSeleccionada === 'Pasivo') return this.pasivos;
      if (this.categoriaSeleccionada === 'Activo') return this.activos;
      return [];
    }
  },
  methods: {
    handleSidebarToggle(isCompact) {
      this.isSidebarCompact = isCompact;
    },
    goBack() {
      this.$router.push('/expedientes')
    },
    cerrarSesion() {
      this.$store.dispatch('logout')
      this.$router.push('/')
      alert("Sesión cerrada")
    },
    formatearFecha(fecha) {
      if (!fecha) return ''
      const fechaObj = new Date(fecha)
      const dia = fechaObj.getDate().toString().padStart(2, '0')
      const mes = (fechaObj.getMonth() + 1).toString().padStart(2, '0')
      const año = fechaObj.getFullYear()
      return `${dia}/${mes}/${año}`
    },
    async cargarTiposDocumentos() {
      try {
        const categorias = await getTiposDocumentosWithCategoria()
        this.categoriasDocumentos = categorias.ciclos_vida || []
      } catch (error) {
        console.error('Error al cargar tipos de documentos:', error)
      }
    },
    abrirSelectorDocumento() {
      this.mostrarModalTipoDocumento = true
    },
    extraerDocumentos(results) {
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
    },
    seleccionarTipoDocumento(tipoDocumento) {
      this.tipoDocumentoSeleccionado = tipoDocumento.id
      this.mostrarModalTipoDocumento = false
      this.$refs.fileInput.click()
    },
    cerrarModalTipoDocumento() {
      this.mostrarModalTipoDocumento = false
    },
    async handleFileUpload(event) {
      const file = event.target.files[0]
      if (file && this.tipoDocumentoSeleccionado) {
        try {
          const resultado = await uploadDocumento(
            this.expedienteId,
            this.tipoDocumentoSeleccionado,
            file
          )

          if (resultado) {
            this.documentos.push({
              nombre: file.name,
              tipo: file.type,
              documento_id: resultado.documento_id,
              expediente_id: this.expedienteId,
              tipo_documento_id: this.tipoDocumentoSeleccionado
            })
            this.tipoDocumentoSeleccionado = null
          }
        } catch (error) {
          console.error('Error al subir el documento:', error)
          alert('No se pudo subir el documento')
        }

        event.target.value = ''
      } else if (!this.tipoDocumentoSeleccionado) {
        alert('Debe seleccionar un tipo de documento')
        event.target.value = ''
      }
    },
    async seleccionarDocumento(doc) {
      this.documentoSeleccionado = doc
      try {
        if (doc.documento_id) {
          const urlPresignada = await getDocumentoPreview(this.expedienteId, doc.documento_id)
          this.documentoSeleccionado.url_presignada = urlPresignada.results.uri
        }
      } catch (error) {
        console.error('Error al obtener la vista previa del documento:', error)
      }
    },
    actualizarDocumento(event) {
      const file = event.target.files[0]
      if (file) {
        this.documentoSeleccionado.nombre = file.name
        this.documentoSeleccionado.tipo = file.type
        this.documentoSeleccionado.archivo = file
        event.target.value = ''
      }
    },
    async descargarDocumentosSeleccionados() {
      try {
        for (const doc of this.documentosSeleccionados) {
          const pdfBlob = await downloadDocumento(this.expedienteId, doc.documento_id)
          const url = URL.createObjectURL(pdfBlob)
          const a = document.createElement('a')
          a.href = url
          a.download = doc.nombre || `documento_${doc.documento_id}.pdf`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }
      } catch (error) {
        console.error('Error al descargar documentos:', error)
        alert("El documento no se encuentra para descargar")
      }
    },
    async remitirExpediente() {
      try {
        const expedienteId = this.expedienteId
        const resultado = await remitirDocumentos(expedienteId)
        return resultado
      } catch (error) {
        console.error('Error al remitir el expediente:', error)
      }
    }
  },
  async created() {
    try {
      let respuesta = await getDocumentosByExpediente(this.expedienteId)
      const infoExpediente = (await getExpedientes({expediente_id:this.expedienteId})).data[0]
      respuesta = respuesta.ciclos_vida

      this.documentos = this.extraerDocumentos(respuesta)
      this.expediente = infoExpediente

      this.pasivos = this.documentos.filter(doc => doc.ciclo_vida.descripcion === "Pasivo")
      this.activos = this.documentos.filter(doc => doc.ciclo_vida.descripcion === "Activo")
      this.socio = this.documentos.filter(doc => doc.ciclo_vida.descripcion === "Socio")
      this.cargarTiposDocumentos()
    } catch (error) {
      console.error('Error al cargar los documentos:', error)
    }
  }
}
</script>

<style scoped>
.expediente-detalle-container {
  min-height: 100vh;
  background-color: #eef0f2;
  padding-left: 20rem;
  transition: padding-left 0.3s ease;
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.expediente-detalle-container-compacto {
  padding-left: 5rem;
}

.content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  box-sizing: border-box;
}

.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.back-button {
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

.back-icon {
  width: 24px;
  height: 24px;
}

.titulo {
  font-family: 'Karla', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #84BD00;
  margin-bottom: 1rem;
}

.detalles-expediente-container {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.detalles-container {
  background-color: rgba(190, 200, 200, 0.15);
  border-radius: 8px;
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  flex: 1;
  border: 1px solid rgba(132, 189, 0, 0.2);
}

.fechas-container {
  color: #434c4e;
  font-size: 0.875rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background-color: rgba(132, 189, 0, 0.05);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid rgba(132, 189, 0, 0.1);
}

.categorias-documentos {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.categoria-tab {
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
  color: #434c4e;
  border: 1px solid transparent;
}

.categoria-tab:hover {
  background-color: rgba(132, 189, 0, 0.1);
  border-color: rgba(132, 189, 0, 0.2);
}

.categoria-tab.activa {
  background-color: #84BD00;
  color: white;
  border-color: #84BD00;
}

.linea-divisora {
  border: none;
  border-top: 1px solid #bec8c8;
  margin: 1rem 0;
}

.documentos-section {
  padding: 1.5rem 0;
}

.documentos-section-titulo {
  font-family: 'Karla', sans-serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3333;
  margin-bottom: 1rem;
}

.documentos-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.documento-item {
  padding: 0.75rem;
  border-bottom: 1px solid rgba(132, 189, 0, 0.1);
  transition: background-color 0.2s;
}

.documento-item:hover {
  background-color: rgba(132, 189, 0, 0.05);
}

.documento-item:last-child {
  border-bottom: none;
}

.documento-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.documento-nombre {
  cursor: pointer;
  color: #434c4e;
  transition: color 0.2s;
}

.documento-nombre:hover {
  color: #84BD00;
}

.boton-cargar {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: white;
  border: 1px dashed #84BD00;
  border-radius: 4px;
  color: #84BD00;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.2s;
}

.boton-cargar:hover {
  background-color: rgba(132, 189, 0, 0.05);
  border-style: solid;
}

.icono-cargar {
  width: 16px;
  height: 16px;
}

.modal-tipo-documento {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-contenido {
  background-color: white;
  border-radius: 8px;
  width: 80%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  padding: 1rem;
  border-bottom: 1px solid #eef0f2;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  padding: 1rem;
}

.categoria-documentos {
  margin-bottom: 1.5rem;
}

.lista-tipos-documentos {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tipo-documento-item {
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.tipo-documento-item:hover {
  background-color: #eef0f2;
}

.obligatorio {
  color: #e6332a;
  margin-left: 0.25rem;
}

.preview-documento {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preview-documento-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.boton-volver-preview {
  padding: 0.5rem;
  background-color: rgba(190, 200, 200, 0.15);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.nombre-documento-preview {
  font-weight: 600;
  color: #434c4e;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: 'Karla', sans-serif;
  font-size: 1.25rem;
  color: #434c4e;
}

@media (max-width: 768px) {
  .expediente-detalle-container {
    padding-left: 5rem;
  }

  .content {
    padding: 1rem;
  }

  .detalles-expediente-container {
    flex-direction: column;
    gap: 1rem;
  }

  .detalles-container {
    grid-template-columns: 1fr;
  }

  .titulo {
    font-size: 1.5rem;
  }

  .categorias-documentos {
    flex-direction: column;
    gap: 0.5rem;
  }

  .categoria-tab {
    width: 100%;
    text-align: center;
  }
}
</style>

