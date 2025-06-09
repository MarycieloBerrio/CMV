<template>
  <div class="filter-item">
    <p v-if="title" class="filter-title font-karla text-[16px] text-[#434c4e] font-bold">{{ title }}</p>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'FilterItem',
  props: {
    title: {
      type: String,
      required: false,
      default: ''
    }
  }
}
</script>

<style scoped>
.filter-item {
  width: 100%;
}

.filter-title {
  font-family: 'Karla', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #434c4e;
  margin-bottom: 0.5rem;
}
</style>
