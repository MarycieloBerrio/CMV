<template>
  <div class="filters-container">
    <div class="filters-row">
      <FilterItem>
        <div class="relative">
          <BaseInput
            v-model="expedienteIdBusqueda"
            type="number"
            @input="handleExpedienteIdSearch"
            placeholder="ID Expediente"
            :rules="[v => !v || /^\d*$/.test(v) || 'Solo se permiten números']"
          />
          <img src="../../assets/images/search.png" alt="Buscar" class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4" />
        </div>
      </FilterItem>

      <FilterItem>
        <div class="relative">
          <BaseInput
            v-model="nombreBusqueda"
            @input="handleNombreSearch"
            placeholder="Nombre"
          />
          <img src="../../assets/images/search.png" alt="Buscar" class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4" />
        </div>
      </FilterItem>

      <FilterItem>
        <div class="relative">
          <BaseInput
            v-model="socioIdBusqueda"
            type="number"
            @input="handleSocioIdSearch"
            placeholder="ID Socio"
            :rules="[v => !v || /^\d*$/.test(v) || 'Solo se permiten números']"
          />
          <img src="../../assets/images/search.png" alt="Buscar" class="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4" />
        </div>
      </FilterItem>

      <FilterItem>
        <div class="relative">
          <BaseInput
            v-model="curpBusqueda"
            @input="handleCurpSearch"
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
      ],
      searchTimeout: null
    }
  },
  methods: {
    handleExpedienteIdSearch(value) {
      this.debounceSearch(() => {
        this.$emit('filter-by-expediente-id', value)
      })
    },
    handleNombreSearch(value) {
      this.debounceSearch(() => {
        this.$emit('filter-by-name', value.toLowerCase())
      })
    },
    handleSocioIdSearch(value) {
      this.debounceSearch(() => {
        this.$emit('filter-by-socio-id', value)
      })
    },
    handleCurpSearch(value) {
      this.debounceSearch(() => {
        this.$emit('filter-by-curp', value.toUpperCase())
      })
    },
    debounceSearch(callback) {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }
      this.searchTimeout = setTimeout(callback, 300)
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
