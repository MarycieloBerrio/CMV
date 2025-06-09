<template>
  <div class="documento-checklist">
    <h3 class="checklist-title">Criterios de Validación</h3>
    <div class="separator"></div>
    <div class="checklist-items">
      <div v-for="(criterio, index) in criterios" :key="index" class="checklist-item">
        <input
          type="checkbox"
          :id="'criterio-' + index"
          v-model="criterio.checked"
          class="checklist-checkbox"
        />
        <label :for="'criterio-' + index" class="checklist-label">
          Criterio de validación {{ index + 1 }}
        </label>
      </div>
    </div>
    <div class="checklist-actions">
      <BaseButton
        @click="aprobarDocumento"
        :disabled="!todosCriteriosCompletados"
        :class="[
          todosCriteriosCompletados
            ? 'bg-primary text-white hover:bg-opacity-90'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        ]"
      >
        Aprobar
      </BaseButton>
      <BaseButton
        @click="rechazarDocumento"
        class="reject-button"
      >
        Rechazar
      </BaseButton>
    </div>
  </div>
</template>

<script>
import BaseButton from '@/features/auth/components/atoms/BaseButton.vue'

export default {
  name: 'DocumentoChecklist',
  components: {
    BaseButton
  },
  data() {
    return {
      criterios: Array(10).fill().map((_, index) => ({
        texto: `Criterio de validación ${index + 1}`,
        checked: false
      }))
    }
  },
  computed: {
    todosCriteriosCompletados() {
      return this.criterios.every(criterio => criterio.checked)
    }
  },
  methods: {
    aprobarDocumento() {
      if (this.todosCriteriosCompletados) {
        this.$emit('aprobar-documento')
      }
    },
    rechazarDocumento() {
      this.$emit('rechazar-documento')
    }
  }
}
</script>

<style scoped>
.documento-checklist {
  @apply bg-[#F5F5F5] p-8 rounded-lg;
  min-width: 280px;
  max-width: 400px;
  width: 100%;
}

.checklist-title {
  @apply text-lg font-semibold text-gray-700 mb-2;
}

.separator {
  @apply h-[1px] bg-gray-400 mb-4 w-full;
}

.checklist-items {
  @apply space-y-3 mb-6 -ml-20;
}

.checklist-item {
  @apply flex items-start gap-2;
}

.checklist-checkbox {
  @apply w-5 h-5 mt-0.5 text-valladolid-secondary border-gray-300 rounded focus:ring-valladolid-secondary flex-shrink-0;
}

.checklist-label {
  @apply text-sm text-gray-600 text-left whitespace-normal;
  max-width: calc(100% - 1rem);
}

.checklist-actions {
  @apply flex flex-row gap-3 justify-center;
}

.checklist-actions button {
  @apply py-2.5 px-4 rounded-md transition-all duration-200 font-medium;
  min-width: 120px;
  max-width: 140px;
}

.checklist-actions button:disabled {
  @apply opacity-100 cursor-not-allowed;
}

.reject-button {
  @apply bg-[#FE4C00] text-white hover:bg-[#E64400] !important;
}

@media (min-width: 1024px) {
  .documento-checklist {
    min-width: 320px;
    max-width: 480px;
  }
}

@media (min-width: 1280px) {
  .documento-checklist {
    min-width: 360px;
    max-width: 520px;
  }
}
</style>
