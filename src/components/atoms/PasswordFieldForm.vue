<script setup>
const props = defineProps({
  context: Object,
})

function handleInput(e) {
  props.context.node.input(e.target.value)
}
</script>

<template>
  <v-text-field
    :model-value="context.value"
    :id="context.id"
    :label="context.attrs['vuetify-label']"
    @input="handleInput"
    v-bind="context.attrs"
    clearable
    hide-details
    type="password"
  />
</template>
