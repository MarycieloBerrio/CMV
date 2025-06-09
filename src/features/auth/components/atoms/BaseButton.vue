<template>
  <v-btn
    type="submit"
    block
    @click="$emit('click')"
    theme="moreliaTheme"
    class="bg-primary rounded-lg cursor-pointer text-white py-4 w-full disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <slot></slot>
  </v-btn>
</template>

<script>
export default {
  props: {
    disabled: Boolean,
    type: {
      type: String,
      default: 'button',
    },
  },
  emits: ['click'],
}
</script>
