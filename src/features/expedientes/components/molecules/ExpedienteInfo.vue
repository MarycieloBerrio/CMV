<template>
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
</template>

<script>
export default {
  name: 'ExpedienteInfo',
  props: {
    expediente: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatearFecha(fecha) {
      if (!fecha) return 'No disponible';
      return new Date(fecha).toLocaleDateString();
    }
  }
}
</script>

<style scoped>
.detalles-expediente-container {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.detalles-container {
  margin-bottom: 1rem;
}

.detalles-container p,
.fechas-container p {
  margin: 0.5rem 0;
  color: #333;
}

.fechas-container {
  border-top: 1px solid #eee;
  padding-top: 1rem;
  color: #666;
}
</style>
