<template>
  <div class="dropdown-menu-wrapper" @click="toggleMenu">
    <div class="usuario-contenedor">
      <img src="../../assets/images/usuario.png" alt="usuario icono" class="icono-usuario"/>
      <div>
        <p class="user-name">Nombre Usuario</p>
        <p class="user-rol">(rol usuario)</p>
      </div>
    </div>
    <div v-if="isOpen" class="dropdown-menu">
      <button class="logout-button" @click="$emit('logout')">
        Cerrar sesión <span class="arrow">[></span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DropdownMenu',
  data() {
    return {
      isOpen: false
    }
  },
  methods: {
    toggleMenu() {
      this.isOpen = !this.isOpen;
    }
  }
}
</script>

<style scoped>

  .dropdown-menu-wrapper{
    display: flex;
    flex-direction: column;
    align-items: center;
    color:white;
    justify-content: center;
    position: relative;
    

    .usuario-contenedor{
      display: flex;
      flex-direction: row;
      gap:1rem;
      cursor: pointer;
    
      .icono-usuario{
        object-fit: none;
      }

      .user-name{
        font-weight: bold;
      }

      .user-rol{
        font-size: .8rem;
      }
    }


    .dropdown-menu{
      position: absolute;
      top: 100%;
      right: 0;
      z-index: 10;
      background-color: #84BD00;
      width: 100%;
      padding: 1rem;
      border-radius: 0 0 8px 8px;

      .logout-button{
        border: 1px solid rgb(198, 237, 167);
        padding: .2rem .3rem;
        border-radius: 6px;

        .arrow{
          color: rgb(198, 237, 167)
        }
      }
    }
  }
  
</style>
