<template>
  <v-select
    :model-value="value"
    @update:modelValue="$emit('change', $event)"
    :items="options"
    item-title="label"
    item-value="value"
    outlined
    dense
    hide-details
    class="base-select"
  ></v-select>
</template>

<script>
export default {
  name: 'BaseSelect',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    formattedOptions() {
      return this.options.map(option => ({
        title: option.label,
        value: option.value
      }))
    }
  }
}
</script>

<style scoped>
.base-select {
  font-family: 'Karla', sans-serif;
  font-size: 14px;
}

.base-select :deep(.v-field) {
  border-radius: 8px;
  background-color: white;
  transition: all 0.2s ease-in-out;
}

.base-select :deep(.v-field--focused) {
  background-color: #bec8c8;
}

.base-select :deep(.v-field__input) {
  color: #434c4e;
  padding: 8px 12px;
}

.base-select :deep(.v-field__outline) {
  border-color: #434c4e;
}

.base-select :deep(.v-field--focused .v-field__outline) {
  border-color: #fe4c00;
}

.base-select :deep(.v-select__selection) {
  color: #434c4e;
}
</style>
