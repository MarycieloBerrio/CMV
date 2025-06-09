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
            :class="['categoria-tab', { activa: categoriaSeleccionada === 'Socio', disabled: documentoSeleccionado }]"
            @click="!documentoSeleccionado && (categoriaSeleccionada = 'Socio')"
          >
            Información personal
          </p>
          <p
            :class="['categoria-tab', { activa: categoriaSeleccionada === 'Pasivo', disabled: documentoSeleccionado }]"
            @click="!documentoSeleccionado && (categoriaSeleccionada = 'Pasivo')"
          >
            Operaciones pasivas
          </p>
          <p
            :class="['categoria-tab', { activa: categoriaSeleccionada === 'Activo', disabled: documentoSeleccionado }]"
            @click="!documentoSeleccionado && (categoriaSeleccionada = 'Activo')"
          >
            Operaciones activas
          </p>
        </div>

        <hr class="linea-divisora"/>
        <div class="documentos-section">
          <template v-if="!documentoSeleccionado">
            <h3 class="titulo-lista-documentos">Lista de documentos</h3>
            <div class="lista-documentos">
              <div v-if="documentosFiltrados.length === 0" class="no-documentos">
                No hay ningún documento cargado
              </div>
              <div v-else v-for="doc in documentosFiltrados" :key="doc.id" class="documento-item">
                <div class="documento-content" v-if="doc.expediente_id == expedienteId">
                  <span
                    class="documento-nombre"
                    @click="seleccionarDocumento(doc)"
                  >
                    {{ doc.nombre }}
                  </span>
                  <input
                    type="checkbox"
                    :id="'doc-' + doc.id"
                    v-model="documentosSeleccionados"
                    :value="doc"
                    class="documento-checkbox"
                  />
                </div>
              </div>
            </div>

            <div class="botones-accion">
              <BaseButton
                v-if="documentosSeleccionados.length > 0"
                @click="descargarDocumentosSeleccionados"
                class="bg-primary text-white hover:bg-opacity-90 boton-descargar"
              >
                Descargar ({{ documentosSeleccionados.length }})
              </BaseButton>
              <BaseButton @click="abrirSelectorDocumento" class="bg-gray-200 text-gray-700 hover:bg-gray-300">
                Cargar documento
              </BaseButton>
              <BaseButton @click="remitirExpediente" class="bg-primary text-white hover:bg-opacity-90">
                Enviar a remisión
              </BaseButton>
            </div>

            <!-- Modal para seleccionar tipo de documento -->
            <v-dialog v-model="showTipoDocumentoModal" max-width="500px">
              <template v-slot:default>
                <div class="modal-content">
                  <h2>Selecciona el tipo de documento</h2>
                  <div class="tipos-documento">
                    <div v-if="tiposDocumentos.length === 0" class="no-tipos">
                      No hay tipos de documentos disponibles
                    </div>
                    <div
                      v-for="ciclo in tiposDocumentos"
                      :key="ciclo.id"
                      class="ciclo-documento"
                    >
                      <h3 class="ciclo-titulo">{{ ciclo.descripcion }}</h3>
                      <div
                        v-for="categoria in ciclo.categorias"
                        :key="categoria.id"
                        class="categoria-documento"
                      >
                        <h4 class="categoria-titulo">{{ categoria.descripcion }}</h4>
                        <div
                          v-for="tipo in categoria.tipos_documento"
                          :key="tipo.id"
                          class="tipo-documento-item"
                          @click="seleccionarTipoDocumento(tipo)"
                        >
                          <span class="tipo-documento-nombre">{{ tipo.descripcion }}</span>
                          <span v-if="tipo.obligatorio" class="obligatorio">(Obligatorio)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </v-dialog>

            <input
              type="file"
              ref="fileInput"
              @change="handleFileUpload"
              style="display: none"
            />

            <!-- Modal de vista previa -->
            <v-dialog v-model="showPreviewModal" fullscreen>
              <template v-slot:default>
                <div class="preview-container">
                  <div class="preview-header">
                    <h2>Vista previa del documento</h2>
                    <div class="preview-actions">
                      <BaseButton @click="$refs.updateFileInput.click()" class="bg-primary text-white hover:bg-opacity-90">
                        Actualizar documento
                      </BaseButton>
                      <button @click="showPreviewModal = false" class="close-button">×</button>
                    </div>
                  </div>
                  <DocumentPreview
                    v-if="selectedDocument"
                    :documento="selectedDocument"
                    @close="showPreviewModal = false"
                  />
                </div>
              </template>
            </v-dialog>
          </template>

          <template v-else>
            <div class="preview-documento-container">
              <div class="preview-section">
                <div class="preview-documento-header">
                  <button @click="documentoSeleccionado = null" class="boton-volver-preview">←</button>
                  <p class="nombre-documento-preview">{{ documentoSeleccionado.nombre }}</p>
                </div>
                <DocumentPreview
                  :documento="documentoSeleccionado"
                  :expedienteId="expedienteId"
                  class="document-preview"
                  @aprobar-documento="handleAprobarDocumento"
                  @rechazar-documento="handleRechazarDocumento"
                />
                <div class="documento-info">
                  <p>ID del documento: {{ documentoSeleccionado.documento_id }}</p>
                  <p>Tipo de documento: {{ documentoSeleccionado.tipo_documento?.descripcion || 'No especificado' }}</p>
                </div>
                <div class="preview-actions">
                  <BaseButton @click="$refs.updateFileInput.click()" class="bg-primary text-white hover:bg-opacity-90 boton-actualizar">
                    Actualizar documento
                  </BaseButton>
                </div>
                <input
                  type="file"
                  ref="updateFileInput"
                  @change="actualizarDocumento"
                  style="display: none"
                />
              </div>

              <div class="validation-section">
                <DocumentoChecklist
                  @aprobar-documento="handleAprobarDocumento"
                  @rechazar-documento="handleRechazarDocumento"
                />
              </div>
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
import BaseButton from '@/features/auth/components/atoms/BaseButton.vue'
import { getDocumentosByExpediente, getExpedientes, downloadDocumento, getDocumentoPreview, uploadDocumento, remitirDocumentos } from '../../api/ExpedienteService'
import { getTiposDocumentosWithCategoria } from "../../api/ParametrizacionService"
import '../../assets/css/ExpedienteDetalle.css'
import DocumentoChecklist from '../molecules/DocumentoChecklist.vue'

export default {
  name: 'ExpedienteDetallePage',
  components: {
    Header,
    DocumentPreview,
    BaseButton,
    DocumentoChecklist
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
      isSidebarCompact: localStorage.getItem('modoCompacto') === 'true' || false,
      showTipoDocumentoModal: false,
      showPreviewModal: false,
      selectedDocument: null,
      tiposDocumentos: []
    }
  },
  computed: {
    documentosFiltrados() {
      if (!this.documentos) return [];

      return this.documentos.filter(doc => {
        if (this.categoriaSeleccionada === 'Socio') {
          return doc.ciclo_vida?.descripcion === 'Socio';
        }
        if (this.categoriaSeleccionada === 'Pasivo') {
          return doc.ciclo_vida?.descripcion === 'Pasivo';
        }
        if (this.categoriaSeleccionada === 'Activo') {
          return doc.ciclo_vida?.descripcion === 'Activo';
        }
        return false;
      });
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
        const tipos = await getTiposDocumentosWithCategoria();
        this.tiposDocumentos = tipos.ciclos_vida || [];
      } catch (error) {
        console.error('Error al cargar tipos de documentos:', error);
      }
    },
    abrirSelectorDocumento() {
      this.showTipoDocumentoModal = true
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
    seleccionarTipoDocumento(tipo) {
      this.tipoDocumentoSeleccionado = tipo.id;
      this.showTipoDocumentoModal = false;
      this.$refs.fileInput.click();
    },
    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (file && this.tipoDocumentoSeleccionado) {
        try {
          const resultado = await uploadDocumento(
            this.expedienteId,
            this.tipoDocumentoSeleccionado,
            file
          );

          if (resultado) {
            // Recargar los documentos después de subir uno nuevo
            const respuesta = await getDocumentosByExpediente(this.expedienteId);
            this.documentos = this.extraerDocumentos(respuesta.ciclos_vida);
            this.tipoDocumentoSeleccionado = null;
          }
        } catch (error) {
          console.error('Error al subir el documento:', error);
          alert('No se pudo subir el documento');
        }

        event.target.value = '';
      } else if (!this.tipoDocumentoSeleccionado) {
        alert('Debe seleccionar un tipo de documento');
        event.target.value = '';
      }
    },
    async seleccionarDocumento(doc) {
      this.documentoSeleccionado = doc;
      try {
        if (doc.documento_id) {
          const response = await getDocumentoPreview(this.expedienteId, doc.documento_id);
          if (response && response.results) {
            this.documentoSeleccionado.url_presignada = response.results.uri;
            this.documentoSeleccionado.content_type = response.results.content_type;
          }
        }
      } catch (error) {
        console.error('Error al obtener la vista previa del documento:', error);
      }
    },
    actualizarDocumento(event) {
      const file = event.target.files[0]
      if (file) {
        this.selectedDocument.nombre = file.name
        this.selectedDocument.tipo = file.type
        this.selectedDocument.archivo = file
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
    },
    handleAprobarDocumento(documento) {
      // TODO: Implementar lógica de aprobación
      console.log('Documento aprobado:', documento)
    },
    handleRechazarDocumento(documento) {
      // TODO: Implementar lógica de rechazo
      console.log('Documento rechazado:', documento)
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

.modal-content {
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
}

.modal-content h2 {
  color: #2c3333;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.tipos-documento {
  max-height: 60vh;
  overflow-y: auto;
  background-color: white;
  border-radius: 0.5rem;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.ciclo-documento {
  margin-bottom: 1.5rem;
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 0.5rem;
}

.ciclo-titulo {
  color: #84BD00;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.categoria-documento {
  margin-bottom: 1rem;
  padding-left: 1rem;
  background-color: white;
  border-radius: 0.5rem;
  padding: 1rem;
}

.categoria-titulo {
  color: #434c4e;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.tipo-documento-item {
  padding: 0.75rem;
  margin-bottom: 0.25rem;
  cursor: pointer;
  border-radius: 0.25rem;
  transition: all 0.2s;
  background-color: #f8f9fa;
}

.tipo-documento-item:hover {
  background-color: rgba(132, 189, 0, 0.1);
  transform: translateY(-1px);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tipo-documento-nombre {
  color: #434c4e;
}

.obligatorio {
  color: #e6332a;
  margin-left: 0.25rem;
  font-size: 0.875rem;
}

.no-tipos {
  text-align: center;
  color: #6c757d;
  padding: 1rem;
}

.preview-documento-container {
  @apply flex gap-6 h-full;
}

.preview-section {
  @apply flex-1 flex flex-col gap-4;
}

.validation-section {
  @apply w-96 flex-shrink-0;
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

@media (max-width: 1024px) {
  .preview-documento-container {
    @apply flex-col;
  }

  .validation-section {
    @apply w-full;
  }
}
</style>

