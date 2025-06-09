<template>
  <v-text-field
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    :label="label"
    outlined
    dense
    hide-details
    width="30vw"
  ></v-text-field>
</template>

<script>
export default {
  name: 'BaseInput',
  props: {
    modelValue: String,
    label: {
      type: String,
      default: 'Search',
    },
    value: {
      type: String,
      default: '',
    },
    emits: ['update:modelValue'],
  },
  methods: {
    updateValue(event) {
      const value = event.target.value
      this.$emit('input', value)
    },
  },
}
</script>
