<template>
  <v-text-field
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    :label="placeholder"
    outlined
    dense
    hide-details
    class="base-input"
    @input="updateValue"
  ></v-text-field>
</template>

<script>
export default {
  name: 'BaseInput',
  props: {
    modelValue: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'input'],
  methods: {
    updateValue(event) {
      const value = event.target.value;
      this.$emit('update:modelValue', value);
      this.$emit('input', value);
    }
  }
}
</script>

<style scoped>
.base-input {
  font-family: 'Karla', sans-serif;
  font-size: 14px;
}

.base-input :deep(.v-field) {
  border-radius: 8px;
  background-color: white;
  transition: all 0.2s ease-in-out;
}

.base-input :deep(.v-field--focused) {
  background-color: #bec8c8;
}

.base-input :deep(.v-field__input) {
  color: #434c4e;
  padding: 8px 12px;
}

.base-input :deep(.v-field__outline) {
  border-color: #434c4e;
}

.base-input :deep(.v-field--focused .v-field__outline) {
  border-color: #fe4c00;
}
</style>
