<template>
  <div class="expediente-remision-item">
    <div class="expediente-info">


      <p style="font-size: 1.2rem; color:#6c757d">Expediente ID: {{ expediente.expediente_id }}</p>
      <p><strong>CURP:</strong> {{ expediente.curp }}</p>
      <p><strong>Nombre:</strong> {{ expediente.nombre }}</p>
      <p v_if="documentosDelExpediente.length > 0">
        <strong>Ciclo: </strong>Socio
      </p>
      <p v-if="!documentosDelExpediente.length">No hay documentos cargados para este expediente.</p>
    </div>

    <div class="docs-checklist-container">
        <div class="documentos-lista">
        <p style="font-size: 1.2rem; color:#6c757d">Documentos:</p>
        <ul v-if="documentosDelExpediente.length > 0">
            <li v-for="documento in documentosDelExpediente" :key="documento.documento_id" class="lista-docs">
            <a href="#" @click.prevent="seleccionarDocumento(documento)" class="documento-link">
                {{ documento.nombre }}
            </a>
            </li>
        </ul>
        <p v-else>No hay documentos</p>
        </div>

        <DocumentoChecklist
        v-if="documentosDelExpediente.length > 0"
        :documentos="documentosDelExpediente"
        class="checklist-container"
        />

    </div>
  </div>
</template>

<script>

import { getDocumentosByExpediente } from '../../api/ExpedienteService';
import DocumentoChecklist from '../molecules/DocumentoChecklist.vue';

export default {
  name: 'ExpedienteRemisionItem',
  components: {
    DocumentoChecklist
  },
  props: {
    expediente: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      documentosDelExpediente: [],
      cargandoDocumentos: false,
    };
  },
  async created() {
    await this.cargarDocumentos();
  },
  methods: {
    async cargarDocumentos() {
      if (!this.expediente || !this.expediente.expediente_id) return;
      this.cargandoDocumentos = true;
      try {
        const response = await getDocumentosByExpediente(this.expediente.expediente_id);

        if (response && response.ciclos_vida && response.ciclos_vida[2] &&
            response.ciclos_vida[2].categorias && response.ciclos_vida[2].categorias[0]) {

          let tipos = response.ciclos_vida[2].categorias[0].tipos_documento || [];

          tipos.forEach(tipo => {
            if (tipo && tipo.documentos) {
              tipo.documentos.forEach(documento => {

                if (documento && documento.expediente_id == this.expediente.expediente_id) {
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
    seleccionarDocumento(documento) {
      this.$emit('mostrar-preview', documento);
    }
  }
};
</script>

<style scoped>
</style>
