<template>
  <button :class="['base-button', { 'disabled': disabled }]" :disabled="disabled" @click="$emit('click')">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.base-button {
  background: none;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
}

.base-button.disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>