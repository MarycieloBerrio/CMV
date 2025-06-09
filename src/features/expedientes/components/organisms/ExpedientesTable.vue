<template>
  <table class="expedientes-table w-full">
    <thead>
      <tr>
        <TableHeaderWithSort
          label="ID Expediente"
          :current-sort="sortColumn === 'expediente_id' ? sortOrder : ''"
          @sort="handleSort('Id', $event)"
        />
        <TableHeaderWithSort
          label="Nombre del socio"
          :current-sort="sortColumn === 'nombre' ? sortOrder : ''"
          @sort="handleSort('Nombre', $event)"
        />
        <TableHeaderWithSort
          label="ID socio"
          :current-sort="sortColumn === 'socio_id' ? sortOrder : ''"
          @sort="handleSort('EnteId', $event)"
        />
        <TableHeaderWithSort
          label="Estado"
          :current-sort="sortColumn === 'estado' ? sortOrder : ''"
          @sort="handleSort('EstadoId', $event)"
        />
        <TableHeaderWithSort
          label="CURP"
          :current-sort="sortColumn === 'curp' ? sortOrder : ''"
          @sort="handleSort('Curp', $event)"
        />
        <th class="table-header"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="expediente in expedientes" :key="expediente.expedienteId" class="hover:bg-[#bec8c8]/10">
        <td class="font-karla text-[16px] text-[#434c4e]">{{ expediente.expediente_id }}</td>
        <td class="font-karla text-[16px] text-[#434c4e]">{{ expediente.nombre }}</td>
        <td class="font-karla text-[16px] text-[#434c4e]">{{ expediente.socio_id }}</td>
        <td>
          <span
            :class="[
              'inline-block px-3 py-1 rounded-[14px] font-karla text-[16px] text-white',
              {
                'bg-[#84bd00]': expediente.estado === 'aprobado',
                'bg-[#f4a700]': expediente.estado === 'pendiente',
                'bg-[#e6332a]': expediente.estado === 'rechazado'
              }
            ]"
          >
            {{ expediente.estado }}
          </span>
        </td>
        <td class="font-karla text-[16px] text-[#434c4e]">{{ expediente.curp }}</td>
        <td>
          <button
            class="action-button rounded-full p-2 hover:bg-[#bec8c8]/10 transition-colors duration-200"
            @click="verDetalle(expediente.expediente_id)"
          >
            <img src="../../assets/images/visibility.png" alt="Ver detalle" class="action-icon w-5 h-5" />
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import TableHeaderWithSort from '../molecules/TableHeaderWithSort.vue'
import '../../assets/css/ExpedientesTable.css'

export default {
  name: 'ExpedientesTable',
  components: {
    TableHeaderWithSort
  },
  props: {
    expedientes: {
      type: Array,
      required: true
    },
    sortColumn: {
      type: String,
      default: ''
    },
    sortOrder: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleSort(column, order) {
      const orderValue = typeof order === 'object' ? (order.target ? order.target.value : '') : order;
      this.$emit('sort', { column, order: orderValue });
    },
    verDetalle(expedienteId) {
      this.$router.push(`/expedientes/${expedienteId}`);
    }
  }
}
</script>

<style scoped>
.expedientes-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 8px;
  overflow: hidden;
  background-color: transparent;
}

.expedientes-table th:first-child {
  border-top-left-radius: 8px;
}

.expedientes-table th:last-child {
  border-top-right-radius: 8px;
}

.expedientes-table tr:last-child td:first-child {
  border-bottom-left-radius: 8px;
}

.expedientes-table tr:last-child td:last-child {
  border-bottom-right-radius: 8px;
}

.expedientes-table th {
  @apply bg-[#434c4e] text-white font-archivo text-[18px] leading-[22px] font-bold p-4 text-left;
}

.expedientes-table td {
  @apply p-4 border-b border-[#bec8c8]/10;
}

.expedientes-table tr:last-child td {
  border-bottom: none;
}

.expedientes-table tr {
  transition: background-color 0.2s ease;
}

.expedientes-table tr:hover {
  background-color: rgba(190, 200, 200, 0.05);
}

.action-button {
  @apply bg-transparent border-none cursor-pointer p-2 hover:bg-[#bec8c8]/10 transition-colors duration-200 rounded-full;
}

.action-icon {
  @apply w-5 h-5 cursor-pointer;
}

@media (max-width: 1024px) {
  .expedientes-table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }

  .expedientes-table th,
  .expedientes-table td {
    @apply p-3;
  }
}

@media (max-width: 768px) {
  .expedientes-table th,
  .expedientes-table td {
    @apply p-2 text-[14px];
  }
}
</style>
