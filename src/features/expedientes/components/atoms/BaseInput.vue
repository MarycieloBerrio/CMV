<template>
  <v-text-field
    :model-value="modelValue"
    @update:modelValue="handleInput"
    :label="placeholder"
    outlined
    dense
    :type="type"
    :error-messages="errorMessage"
    :rules="rules"
    class="base-input"
    @input="updateValue"
    :hide-spin-buttons="type === 'number'"
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
    },
    rules: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      errorMessage: ''
    }
  },
  emits: ['update:modelValue', 'input'],
  methods: {
    handleInput(value) {
      this.errorMessage = '';
      if (this.type === 'number') {
        if (value && !/^\d*$/.test(value)) {
          this.errorMessage = 'Solo se permiten números';
          return;
        }
      }
      this.$emit('update:modelValue', value);
      this.$emit('input', value);
    },
    updateValue(event) {
      const value = event.target.value;
      this.handleInput(value);
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

/* Ocultar flechas de input number */
.base-input :deep(input[type="number"]::-webkit-inner-spin-button),
.base-input :deep(input[type="number"]::-webkit-outer-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}

.base-input :deep(input[type="number"]) {
  -moz-appearance: textfield;
}
</style>
