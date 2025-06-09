<template>
  <div class="filters-container">
    <div class="filters-row">
      <FilterItem>
        <div class="relative">
          <BaseInput
            v-model="expedienteIdBusqueda"
            @input="$emit('filter-by-expediente-id', expedienteIdBusqueda)"
            placeholder="ID Expediente"
          />
          <img src="../../assets/images/search.png" alt="Buscar" class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4" />
        </div>
      </FilterItem>

      <FilterItem>
        <div class="relative">
          <BaseInput
            v-model="nombreBusqueda"
            @input="$emit('filter-by-name', nombreBusqueda)"
            placeholder="Nombre"
          />
          <img src="../../assets/images/search.png" alt="Buscar" class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4" />
        </div>
      </FilterItem>

      <FilterItem>
        <div class="relative">
          <BaseInput
            v-model="socioIdBusqueda"
            @input="$emit('filter-by-socio-id', socioIdBusqueda)"
            placeholder="ID Socio"
          />
          <img src="../../assets/images/search.png" alt="Buscar" class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4" />
        </div>
      </FilterItem>

      <FilterItem>
        <div class="relative">
          <BaseInput
            v-model="curpBusqueda"
            @input="$emit('filter-by-curp', curpBusqueda)"
            placeholder="CURP"
          />
          <img src="../../assets/images/search.png" alt="Buscar" class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4" />
        </div>
      </FilterItem>

      <FilterItem>
        <BaseSelect
          v-model="estadoSeleccionado"
          :options="estadoOptions"
          @change="$emit('filter-by-state', estadoSeleccionado)"
        />
      </FilterItem>
    </div>
  </div>
</template>

<script>
import BaseInput from '../atoms/BaseInput.vue'
import BaseSelect from '../atoms/BaseSelect.vue'
import FilterItem from '../molecules/FilterItem.vue'

export default {
  name: 'FiltersList',
  components: {
    BaseInput,
    BaseSelect,
    FilterItem
  },
  data() {
    return {
      estadoSeleccionado: '',
      nombreBusqueda: '',
      socioIdBusqueda: '',
      expedienteIdBusqueda: '',
      curpBusqueda: '',
      estadoOptions: [
        { value: '', label: 'Todos' },
        { value: 'aprobado', label: 'Aprobado' },
        { value: 'pendiente', label: 'Pendiente' },
        { value: 'rechazado', label: 'Rechazado' }
      ]
    }
  }
}
</script>

<style scoped>
.filters-container {
  width: 100%;
  padding: 1rem 0;
  background-color: #eef0f2;
}

.filters-row {
  display: flex;
  gap: 1rem;
  width: 100%;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding: 0.5rem;
}

.filters-row::-webkit-scrollbar {
  height: 4px;
}

.filters-row::-webkit-scrollbar-track {
  background: #eef0f2;
}

.filters-row::-webkit-scrollbar-thumb {
  background: #bec8c8;
  border-radius: 4px;
}

.relative {
  position: relative;
  min-width: 200px;
  max-width: 300px;
  width: 100%;
}

.relative img {
  opacity: 0.6;
  transition: opacity 0.2s ease-in-out;
}

.relative:hover img {
  opacity: 1;
}

@media (max-width: 768px) {
  .filters-row {
    gap: 0.75rem;
  }

  .relative {
    min-width: 150px;
  }
}
</style>
