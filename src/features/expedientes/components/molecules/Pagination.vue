<template>
  <div class="pagination-container">
    <button
      class="pagination-button"
      :disabled="currentPage === 1"
      @click="$emit('page-change', currentPage - 1)"
    >
      ←
    </button>

    <div class="page-numbers">
      <button
        v-for="page in displayedPages"
        :key="page"
        class="page-number"
        :class="{ active: page === currentPage }"
        @click="$emit('page-change', page)"
      >
        {{ page }}
      </button>
    </div>

    <button
      class="pagination-button"
      :disabled="currentPage === totalPages"
      @click="$emit('page-change', currentPage + 1)"
    >
      →
    </button>
  </div>
</template>

<script>
export default {
  name: 'PaginationComponent',
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    },
    maxVisiblePages: {
      type: Number,
      default: 5
    }
  },
  computed: {
    displayedPages() {
      const pages = []
      const halfVisible = Math.floor(this.maxVisiblePages / 2)

      let start = Math.max(1, this.currentPage - halfVisible)
      let end = Math.min(this.totalPages, start + this.maxVisiblePages - 1)

      if (end - start + 1 < this.maxVisiblePages) {
        start = Math.max(1, end - this.maxVisiblePages + 1)
      }

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      return pages
    }
  }
}
</script>

<style scoped>
.pagination-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination-button {
  padding: 0.5rem 1rem;
  background-color: transparent;
  border: none;
  color: #434c4e;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  font-size: 1.2rem;
}

.pagination-button:hover:not(:disabled) {
  color: #2c3333;
}

.pagination-button:disabled {
  color: #bec8c8;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
}

.page-number {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  color: #434c4e;
  cursor: pointer;
  transition: all 0.2s;
}

.page-number:hover:not(.active) {
  color: #2c3333;
}

.page-number.active {
  color: #2c3333;
  font-weight: bold;
}

@media (max-width: 768px) {
  .pagination-container {
    flex-wrap: wrap;
  }

  .page-numbers {
    order: -1;
    width: 100%;
    justify-content: center;
    margin-bottom: 1rem;
  }
}
</style>
