<template>
  <div class="pagination-container">
    <BaseButton @click="$emit('prev-page')" :disabled="currentPage === 1">←</BaseButton>
    <span 
      v-for="page in totalPages" 
      :key="page" 
      :class="{ 'active-page': page === currentPage }"
      @click="$emit('page-change', page)"
      class="page-number"
    >
      {{ page }}
    </span>
    <BaseButton @click="$emit('next-page')" :disabled="currentPage === totalPages">→</BaseButton>
  </div>
</template>

<script>
import BaseButton from '../atoms/BaseButton.vue'

export default {
  name: 'Pagination',
  components: {
    BaseButton
  },
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    }
  }
}
</script>

<style scoped>
.pagination-container {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 5px;
  align-items: center;
}

.page-number {
  cursor: pointer;
  padding: 5px 10px;
}

.active-page {
  font-weight: bold;
  text-decoration: underline;
  color: #6A9F2F;
}
</style>