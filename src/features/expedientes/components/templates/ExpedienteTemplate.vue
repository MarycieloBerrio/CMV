<template>
  <div class="expedientes-container" :class="{ 'expedientes-container-compacto': isSidebarCompact }">
    <AppHeader @logout="cerrarSesion" @toggle-sidebar="handleSidebarToggle" />
    <main class="expedientes-content">
      <h1 class="expedientes-title">Lista de expedientes</h1>
      <div class="title-separator"></div>

      <div class="expedientes-filters">
        <Filters
          @filter-by-expediente-id="handleExpedienteIdFilter"
          @filter-by-name="handleNombreFilter"
          @filter-by-socio-id="handleSocioIdFilter"
          @filter-by-curp="handleCurpFilter"
          @filter-by-state="handleEstadoFilter"
        />
      </div>

      <div class="expedientes-table">
        <ExpedientesTable
          :expedientes="filteredExpedientes"
          :sortColumn="sortColumn"
          :sortOrder="sortOrder"
          @sort="handleSort"
          @view="handleView"
        />
      </div>

      <div v-if="filteredExpedientes.length === 0" class="no-results">
        <p>No se encontraron expedientes que coincidan con los criterios de búsqueda</p>
        <p class="subtitle">Intente ajustar los filtros de búsqueda</p>
      </div>

      <div class="expedientes-pagination">
        <Pagination
          :currentPage="currentPage"
          :totalPages="totalPages"
          @pageChange="handlePageChange"
        />
      </div>
    </main>
  </div>
</template>

<script>
import AppHeader from '../organisms/Header.vue'
import Filters from '../organisms/Filters.vue'
import ExpedientesTable from '../organisms/ExpedientesTable.vue'
import Pagination from '../molecules/Pagination.vue'
import { getExpedientes } from '../../api/ExpedienteService'
import { computed } from 'vue'
import { usePagination } from '@/shared/composables/usePagination'

export default {
  name: 'ExpedienteTemplate',
  components: {
    AppHeader,
    Filters,
    ExpedientesTable,
    Pagination
  },
  data() {
    return {
      expedientes: [],
      currentPage: 1,
      totalPages: 1,
      sortColumn: 'id',
      sortOrder: 'asc',
      filters: {
        expedienteId: '',
        nombre: '',
        socioId: '',
        curp: '',
        estado: ''
      },
      isSidebarCompact: localStorage.getItem('modoCompacto') === 'true' || false,
      loading: false
    }
  },
  computed: {
    filteredExpedientes() {
      if (!this.expedientes) return [];

      return this.expedientes.filter(expediente => {
        const expedienteIdMatch = !this.filters.expedienteId ||
          expediente.expediente_id.toString().includes(this.filters.expedienteId);

        const nombreMatch = !this.filters.nombre ||
          expediente.nombre.toLowerCase().includes(this.filters.nombre.toLowerCase());

        const socioIdMatch = !this.filters.socioId ||
          expediente.socio_id.toString().includes(this.filters.socioId);

        const curpMatch = !this.filters.curp ||
          expediente.curp.toLowerCase().includes(this.filters.curp.toLowerCase());

        const estadoMatch = !this.filters.estado ||
          expediente.estado === this.filters.estado;

        return expedienteIdMatch && nombreMatch && socioIdMatch && curpMatch && estadoMatch;
      });
    }
  },
  methods: {
    handleExpedienteIdFilter(value) {
      this.filters.expedienteId = value;
      this.loadExpedientes();
    },
    handleNombreFilter(value) {
      this.filters.nombre = value;
      this.loadExpedientes();
    },
    handleSocioIdFilter(value) {
      this.filters.socioId = value;
      this.loadExpedientes();
    },
    handleCurpFilter(value) {
      this.filters.curp = value;
      this.loadExpedientes();
    },
    handleEstadoFilter(value) {
      this.filters.estado = value;
      this.loadExpedientes();
    },
    handleSort(column) {
      if (this.sortColumn === column) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortColumn = column;
        this.sortOrder = 'asc';
      }
      this.loadExpedientes();
    },
    handleView(id) {
      this.$router.push(`/expedientes/${id}`);
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.loadExpedientes();
    },
    async loadExpedientes() {
      this.loading = true;
      try {
        const response = await getExpedientes({
          page: this.currentPage,
          page_size: 10,
          sort_by: this.sortColumn,
          sort_order: this.sortOrder,
          ...this.filters
        });

        this.expedientes = response.data || [];
        this.totalPages = Math.ceil(response.totalRecords / response.pageSize);
      } catch (error) {
        console.error('Error loading expedientes:', error);
        // No mostramos el error al usuario, solo lo registramos
      } finally {
        this.loading = false;
      }
    },
    handleSidebarToggle(isCompact) {
      this.isSidebarCompact = isCompact;
    },
    cerrarSesion() {
      this.$store.dispatch('logout');
      this.$router.push('/');
    }
  },
  mounted() {
    this.loadExpedientes();
  }
}
</script>

<style scoped>
.expedientes-container {
  min-height: 100vh;
  background-color: #eef0f2;
  padding-left: 20rem;
  transition: padding-left 0.3s ease;
  position: relative;
  width: 100%;
  box-sizing: border-box;
}

.expedientes-container-compacto {
  padding-left: 5rem;
}

.expedientes-content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 1.5rem;
  box-sizing: border-box;
}

.expedientes-title {
  font-family: 'Karla', sans-serif;
  font-size: 2rem;
  font-weight: 700;
  color: #434c4e;
  margin-bottom: 0.5rem;
}

.title-separator {
  width: 100%;
  height: 1px;
  background-color: #bec8c8;
  margin-bottom: 1rem;
}

.expedientes-filters {
  margin-bottom: 1rem;
  background-color: transparent;
  padding: 1rem;
  border-radius: 8px;
}

.expedientes-table {
  margin-bottom: 1rem;
  width: 100%;
  background-color: transparent;
  border-radius: 8px;
  overflow: hidden;
}

.expedientes-pagination {
  display: flex;
  justify-content: center;
}

.no-results {
  text-align: center;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  margin: 1rem 0;
}

.no-results p {
  color: #434c4e;
  margin: 0;
}

.no-results .subtitle {
  color: #bec8c8;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .expedientes-container {
    padding-left: 5rem;
  }

  .expedientes-content {
    padding: 1rem;
  }

  .expedientes-title {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .expedientes-filters {
    padding: 0.75rem;
  }
}
</style>
