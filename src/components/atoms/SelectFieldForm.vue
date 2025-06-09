<script setup>
const props = defineProps({
  context: Object,
})

function handleInput(e) {
  props.context.node.input(e.target.value)
}
</script>

<template>
  <v-select
    :model-value="context.value"
    :id="context.id"
    :label="context.attrs['vuetify-label']"
    @input="handleInput"
    v-bind="context.attrs"
    clearable
    hide-details
    :items="context.attrs.options"
  />
</template>
