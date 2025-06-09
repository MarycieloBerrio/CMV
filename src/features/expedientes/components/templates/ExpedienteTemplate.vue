<template>
  <div class="expedientes-container" :class="{ 'expedientes-container-compacto': isSidebarCompact }">
    <AppHeader @logout="cerrarSesion" @toggle-sidebar="handleSidebarToggle" />
    <main class="expedientes-content">
      <h1 class="expedientes-title">Lista de expedientes</h1>
      <div class="title-separator"></div>

      <div class="expedientes-filters">
        <Filters @filter="handleFilter" />
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
      isSidebarCompact: localStorage.getItem('modoCompacto') === 'true' || false
    }
  },
  computed: {
    filteredExpedientes() {
      return this.expedientes.filter(expediente => {
        return (
          expediente.expediente_id.toString().includes(this.filters.expedienteId) &&
          expediente.nombre.toLowerCase().includes(this.filters.nombre.toLowerCase()) &&
          expediente.socio_id.toString().includes(this.filters.socioId) &&
          expediente.curp.toLowerCase().includes(this.filters.curp.toLowerCase()) &&
          (!this.filters.estado || expediente.estado === this.filters.estado)
        )
      })
    }
  },
  methods: {
    handleFilter(filters) {
      this.filters = filters
    },
    handleSort(column) {
      if (this.sortColumn === column) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortColumn = column
        this.sortOrder = 'asc'
      }
    },
    handleView(id) {
      this.$router.push(`/expedientes/${id}`)
    },
    handlePageChange(page) {
      this.currentPage = page
      this.loadExpedientes()
    },
    async loadExpedientes() {
      try {
        const response = await getExpedientes({
          page: this.currentPage,
          page_size: 10,
          sort_by: this.sortColumn,
          sort_order: this.sortOrder,
          ...this.filters
        })

        this.expedientes = response.data || []
        this.totalPages = Math.ceil(response.totalRecords / response.pageSize)
      } catch (error) {
        console.error('Error loading expedientes:', error)
      }
    },
    handleSidebarToggle(isCompact) {
      this.isSidebarCompact = isCompact
    },
    cerrarSesion() {
      this.$store.dispatch('logout')
      this.$router.push('/')
      alert("Sesión cerrada")
    }
  },
  mounted() {
    this.loadExpedientes()
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
