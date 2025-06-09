<template>
  <th class="table-header cursor-pointer" @click="handleSortClick">
    <div class="header-content flex items-center gap-2">
      <span class="font-archivo text-[18px] leading-[22px] font-bold">{{ label }}</span>
      <span v-if="currentSort" class="sort-arrow text-white">
        {{ currentSort === 'asc' ? '↑' : '↓' }}
      </span>
    </div>
  </th>
</template>

<script>
export default {
  name: 'TableHeaderWithSort',
  props: {
    label: {
      type: String,
      required: true
    },
    currentSort: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleSortClick() {
      let newSort = '';
      if (!this.currentSort) {
        newSort = 'asc';
      } else if (this.currentSort === 'asc') {
        newSort = 'desc';
      }
      this.$emit('sort', newSort);
    }
  }
}
</script>

<style scoped>
.table-header {
  @apply bg-[#434c4e] text-white p-4 text-left first:rounded-tl-[8px] last:rounded-tr-[8px];
}

.header-content {
  @apply flex items-center gap-2;
}

.sort-arrow {
  @apply text-white text-lg;
}
</style>
