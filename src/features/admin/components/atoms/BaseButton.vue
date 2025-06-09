<template>
  <v-btn :color="color" :disabled="disabled" @click="$emit('click')" theme="moreliaTheme">
    <slot></slot>
  </v-btn>
</template>

<script>
import '../../../../assets/css/global.css'
export default {
  name: 'BaseButton',
  props: {
    color: {
      type: String,
      default: 'primary',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
