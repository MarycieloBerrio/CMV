<template>
  <div
    class="categoria-item"
    :class="{ 'categoria-habilitada': categoria.habilitado, 'categoria-deshabilitada': !categoria.habilitado }"
  >
    <div class="categoria-header">
      <span class="categoria-nombre">{{ categoria.descripcion }}</span>
      <div class="habilitar-deshabilitar">
        <span class="switch-text">{{ localHabilitado ? 'Deshabilitar' : 'Habilitar' }}</span>
        <label class="switch">
          <input
            type="checkbox"
            v-model="localHabilitado"
            @change="toggleHabilitado"
          />
          <span class="slider"></span>
        </label>
        
      </div>
      <button @click="$emit('modificar', categoria)">Modificar 
        <img src="../../assets/images/gear.png"/>
      </button>
    </div>
    <ul class="tipos-lista">
      <li v-for="categoria in categoria.categorias" :key="categoria.id">
        <div>
          {{ categoria.descripcion }}
          <span v-if="categoria.obligatorio" class="obligatorio">(Obligatorio)</span>
          <li v-for="tipo in categoria.tipos_documento" :key="tipo.id">
            {{ tipo.descripcion }} <span v-if="tipo.obligatorio" class="obligatorio">(Obligatorio)</span>
          </li>
        </div>
      </li>
      
    </ul>
  </div>
</template>

<script>
export default {
  name: 'CategoriaItem',
  props: {
    categoria: { type: Object, required: true }
  },
  data() {
    return {
      localHabilitado: this.categoria.habilitado !== false // Por defecto true si no está definido
    }
  },
  watch: {
    'categoria.habilitado'(val) {
      this.localHabilitado = val !== false
    }
  },
  methods: {
    toggleHabilitado() {
      // Emitimos el nuevo estado al padre
      this.$emit('deshabilitar', { ...this.categoria, habilitado: this.localHabilitado })
    }
  }
}
</script>

<style scoped>
.categoria-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #fafafa;
  transition: filter 0.3s, background 0.3s;
}
.categoria-habilitada {
  background: #eaf7d2;
  filter: none;
}
.categoria-deshabilitada {
  background: #f5f5f5;
}
.categoria-header {
  display: flex;  
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 0.5rem;
}
.categoria-header button {
  border:1px solid #84BD00;
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 0.2rem 0.5rem;
  gap: 0.3rem;
}
.categoria-header button img {
  width: 1rem;
}
.categoria-nombre {
  font-weight: bold;
  color: #84BD00;
  flex: 1;
}
.tipos-lista {
  margin: 0;
  padding-left: 1.2rem;
}
.obligatorio {
  color: #e67e22;
  font-size: 0.9em;
}

/* Switch estilo */
.habilitar-deshabilitar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  width: auto;
  padding: 0;
}

.switch {
  position: relative;
  display: inline-block;
  width: 38px;
  height: 22px;
}

.switch-text {
  font-size: .9rem;
  margin-left: 0.3rem;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 22px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}
input:checked + .slider {
  background-color: #84BD00;
}
input:checked + .slider:before {
  transform: translateX(16px);
}
</style>