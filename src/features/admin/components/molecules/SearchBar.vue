<template>
  <div>
    <BaseInput
      :model-value="name"
      @update:modelValue="$emit('update:name', $event)"
      label="Search by name"
    />
  </div>
</template>

<script>
import BaseInput from '../atoms/BaseInput.vue'

export default {
  name: 'SearchBar',
  components: {
    BaseInput,
  },
  props: {
    name: String,
  },
  emits: ['update:name'],
}
</script>
