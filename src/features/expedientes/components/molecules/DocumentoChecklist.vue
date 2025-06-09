<template>
  <div class="documento-checklist">
    <h4>Datos Personales</h4>
    <div class="checklist-items">
      <div v-for="(item, index) in checklistItems" :key="index" class="checklist-item">
        <input type="checkbox" :id="'item-' + index" v-model="item.checked">
        <label :for="'item-' + index">{{ item.label }}</label>
      </div>
    </div>
    <div class="actions">
      <button class="btn-aceptar" @click="aprobar">Aceptar</button>
      <button class="btn-rechazar" @click="archivar">Rechazar</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DocumentoChecklist',
  props: {
    documentos: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      checklistItems: [
        { label: 'Dato requerido 1', checked: false },
        { label: 'Dato requerido 2', checked: false },
        { label: 'Dato requerido 3', checked: false },
        { label: 'Dato requerido 4', checked: false },
        { label: 'Dato requerido 5', checked: false },
        { label: 'Dato requerido 6', checked: false },
        { label: 'Dato requerido 7', checked: false },
        { label: 'Dato requerido 8', checked: false },
        { label: 'Dato requerido 9', checked: false },
        { label: 'Dato requerido 10', checked: false },
      ]
    };
  },
  methods: {
    aprobar() {
      //console.log('Documentos aprobados:', this.checklistItems.filter(item => item.checked));
      alert('Funcionalidad "Aprobar"');
    },
    archivar() {
      alert('Funcionalidad "Archivar"');
    }
  },
  watch: {
    documentos: {
      handler(newVal) {
        console.log('Documentos recibidos en checklist:', newVal);
      },
      immediate: true
    }
  }
};
</script>

<style scoped></style>