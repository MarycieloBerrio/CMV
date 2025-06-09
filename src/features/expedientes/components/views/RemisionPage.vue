<template>
  <div class="remision-page-container">
    <Header />
    <div class="remision-page">

      <!-- Vista principal: Tabla de expedientes -->
      <div v-if="vistaActual === 'tabla'">
        <p class="titulo">Validación de Documentos</p>
        <div v-if="cargandoExpedientes" class="loading-message">
          Cargando expedientes...
        </div>


        <div v-else-if="expedientes && expedientes.length > 0" class="table-container">

          <table class="expedientes-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>CURP</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="expediente in expedientes" :key="expediente.expediente_id">
                <td>{{ expediente.expediente_id }}</td>
                <td>{{ expediente.nombre || 'N/A' }}</td>
                <td>{{ expediente.curp || 'N/A' }}</td>
                <td>
                  <img 
                    src="../../assets/images/visibility.png" 
                    alt="Ver detalles" 
                    class="visibility-icon" style="cursor: pointer;"
                    @click="verDetallesExpediente(expediente)"
                  />
                </td>
              </tr>
            </tbody>
            
          </table>


        </div>
        <div v-else class="no-expedientes">
          No hay expedientes para mostrar.
        </div>
      </div>

      <!-- Vista de detalles: Documentos y Checklist -->
      <div v-else-if="vistaActual === 'detalles'" class="detalles-container">
        <button @click="volverATabla" class="btn-volver">Volver a la tabla</button>
        <div class="expediente-info">
          <p style="font-size: 1.2rem; color:#6c757d">Expediente ID: {{ expedienteSeleccionado.expediente_id }}</p>
          <p><strong>CURP:</strong> {{ expedienteSeleccionado.curp }}</p>
          <p><strong>Nombre:</strong> {{ expedienteSeleccionado.nombre }}</p>
        </div>
        
        <div class="docs-checklist-container">
          <div class="documentos-lista">
            <!-- Mostrar lista de documentos o preview según el estado -->
            <div v-if="!documentoParaPreview">
              <p style="font-size: 1.2rem; color:#6c757d">Documentos:</p>
              <div v-if="cargandoDocumentos" class="loading-message">
                Cargando documentos...
              </div>
              <ul v-else-if="documentosDelExpediente.length > 0">
                <li v-for="documento in documentosDelExpediente" :key="documento.documento_id" class="lista-docs">
                  <a href="#" @click.prevent="verPreviewDocumento(documento)" class="documento-link">
                    {{ documento.nombre }} 
                  </a>
                </li>
              </ul>
              <p v-else>No hay documentos</p>
            </div>
            
            <!-- Preview del documento en el mismo espacio -->
            <div v-else class="documento-preview-inline">
              <button @click="cerrarPreviewInline" class="btn-volver-docs">← Volver a documentos</button>
              <DocumentPreview 
                :documento="documentoParaPreview" 
                :expedienteId="documentoParaPreview.expediente_id" 
                class="document-preview-small"
              />
            </div>
          </div>

          <DocumentoChecklist 
            v-if="documentosDelExpediente.length > 0" 
            :documentos="documentosDelExpediente"
            class="checklist-container" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Header from "../../components/organisms/Header.vue";
import DocumentPreview from '../../components/molecules/DocumentPreview.vue';
import ExpedienteRemisionItem from '../../components/organisms/ExpedienteRemisionItem.vue';
import DocumentoChecklist from '../molecules/DocumentoChecklist.vue';
import { getExpedientesRemitidos } from '../../api/RemisionService';
import { getDocumentosByExpediente } from '../../api/ExpedienteService';
import "../../assets/css/RemisionPage.css";
import '../../assets/css/ExpedientesTable.css'
import ExpedientesTable from "../organisms/ExpedientesTable.vue";

export default {
  name: 'RemisionPage',
  components: {
    Header,
    DocumentPreview,
    ExpedienteRemisionItem,
    ExpedientesTable,
    DocumentoChecklist
  },
  data() {
    return {
      expedientes: [],
      cargandoExpedientes: false,
      documentoParaPreview: null,
      mostrandoPreview: false,
      vistaActual: 'tabla',
      expedienteSeleccionado: null,
      documentosDelExpediente: [],
      cargandoDocumentos: false,
    };
  },
  async created() {
    this.cargandoExpedientes = true;
    try {
      // Obtener solo los primeros 3 expedientes como ejemplo
      const response = await getExpedientesRemitidos({ page_size: 3 }); 
      this.expedientes = response.data || []; 
    } catch (error) {
      console.error('Error al obtener expedientes remitidos:', error);
      this.expedientes = [];
    }
    this.cargandoExpedientes = false;
  },
  methods: {
    cerrarSesion() {
      this.$store.dispatch('logout');
      this.$router.push('/');
    },
    async verDetallesExpediente(expediente) {
      this.expedienteSeleccionado = expediente;
      this.vistaActual = 'detalles';
      await this.cargarDocumentos(expediente.expediente_id);
    },
    async cargarDocumentos(expedienteId) {
      if (!expedienteId) return;
      this.cargandoDocumentos = true;
      this.documentosDelExpediente = [];
      
      try {
        const response = await getDocumentosByExpediente(expedienteId);
        
        if (response && response.ciclos_vida && response.ciclos_vida[2] && 
            response.ciclos_vida[2].categorias && response.ciclos_vida[2].categorias[0]) {
          
          let tipos = response.ciclos_vida[2].categorias[0].tipos_documento || [];
          
          tipos.forEach(tipo => {
            if (tipo && tipo.documentos) {
              tipo.documentos.forEach(documento => {
                if (documento && documento.expediente_id == expedienteId) {
                  this.documentosDelExpediente.push(documento);
                }
              });
            }
          });
        }
      } catch (error) {
        console.error('Error al cargar documentos del expediente:', error);
        this.documentosDelExpediente = [];
      }
      this.cargandoDocumentos = false;
    },
    volverATabla() {
      this.expedienteSeleccionado = null;
      this.documentosDelExpediente = [];
      this.vistaActual = 'tabla';
    },
    verPreviewDocumento(documento) {
      this.documentoParaPreview = documento;
    },
    cerrarPreviewInline() {
      this.documentoParaPreview = null;
    },
    volverADetalles() {
      this.documentoParaPreview = null;
    }
  }
};
</script>

<style scoped>

.remision-page {
  padding: 1.5rem;
  margin: 0 auto;
}

.titulo {
  font-size: 2rem;
  color:#FE4C00;
}

.loading-message {
  text-align: center;
  font-size: 1.1rem;
  color: #6c757d;
  padding: 2rem;
}

.expedientes-table td {
  text-align: center; 
  vertical-align: middle;
}

.expedientes-table th {
  text-align: center;
  vertical-align: middle;
}

</style>
  
  