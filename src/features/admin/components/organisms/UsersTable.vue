<template>
  <div>
    <h1 class="page-title">Users</h1>
    <div class="utilities">
      <SearchBar :name="name" @update:name="name = $event" />
      <div class="buttons">
        <BaseButton color="primary" @click="openCreateModal">Create</BaseButton>
        <BaseButton
          color="warning"
          @click="openModifyModal"
          :disabled="isModifyDeleteDisabled || isLoading"
        >
          Modify
          <v-progress-circular v-if="isLoading" indeterminate size="20" width="2" class="ml-2" />
        </BaseButton>
        <BaseButton
          color="error"
          @click="deleteUser"
          :disabled="isModifyDeleteDisabled || isLoading"
        >
          Delete
          <v-progress-circular v-if="isLoading" indeterminate size="20" width="2" class="ml-2" />
        </BaseButton>
      </div>
    </div>

    <v-skeleton-loader v-if="isLoading" type="table" style="max-height: 50vh; max-width: 75vw" />

    <template v-else>
      <v-data-table
        v-model="selected"
        :headers="headers"
        :items="filteredUsers"
        item-key="id"
        show-select
        style="max-height: 50vh"
        select-strategy="single"
        :loading="isLoading"
        loading-text="Loading users... Please wait"
      >
        <template v-slot:no-data>
          <div class="text-center py-4">
            <v-icon size="64" color="grey lighten-1">mdi-account-off</v-icon>
            <p class="text-h6 mt-2">No users found</p>
            <p v-if="name" class="subtitle-1">Try changing your search criteria</p>
          </div>
        </template>
      </v-data-table>
    </template>

    <UserFormModal
      :visible="isModalVisible"
      :user="currentUser"
      :roles="roles"
      @update:visible="isModalVisible = $event"
      @save="handleSave"
    />

    <BaseAlert ref="baseAlert" />
  </div>
</template>

<script>
import { useQuery } from '@tanstack/vue-query'
import { ref, computed } from 'vue'
import Swal from 'sweetalert2'
import '../../assets/css/UsersTable.css'
import BaseAlert from '../atoms/BaseAlert.vue'
import SearchBar from '../molecules/SearchBar.vue'
import BaseButton from '../atoms/BaseButton.vue'
import UserFormModal from '../organisms/UserFormModal.vue'
import { getUsersMocked } from '../../api/UserService'

export default {
  name: 'UsersTable',
  components: {
    SearchBar,
    BaseButton,
    UserFormModal,
    BaseAlert,
  },
  data() {
    return {
      name: '',
      selected: [],
      headers: [
        { title: 'ID', value: 'id' },
        { title: 'Name', value: 'name' },
        { title: 'Email', value: 'email' },
        { title: 'Role', value: 'role' },
      ],
      isModalVisible: false,
      currentUser: {},
      roles: ['Admin', 'User'],
    }
  },
  setup() {
    const queryOptions = {
      queryKey: ['users'],
      queryFn: getUsersMocked,
      retry: 2,
      retryDelay: 1000,
      staleTime: 10000,
      onError: (error) => {
        Swal.fire({
          title: 'Error!',
          text: `Failed to load users: ${error.message}`,
          icon: 'error',
          confirmButtonText: 'OK',
        })
      },
      onSettled: () => {
        // This runs after either success or error
        // Could be used to hide a global loading indicator
      },
    }

    const { data: users, isLoading, isError, isFetching, error } = useQuery(queryOptions)

    return {
      users,
      isLoading,
      isError,
      error,
      isFetching,
    }
  },
  computed: {
    filteredUsers() {
      if (!this.name) {
        return this.users || []
      }
      const query = this.name.toLowerCase()
      return (this.users || []).filter((user) => user.name.toLowerCase().includes(query))
    },
    isModifyDeleteDisabled() {
      return this.selected.length === 0 || this.isLoading
    },
  },
  methods: {
    openCreateModal() {
      this.currentUser = { id: null, name: '', email: '', role: '' }
      this.isModalVisible = true
    },
    openModifyModal() {
      if (this.selected.length === 0) return

      this.currentUser = {
        ...this.selected[0],
      }
      this.isModalVisible = true
    },
    async deleteUser() {
      try {
        const result = await Swal.fire({
          title: 'Delete User?',
          text: 'Do you really want to delete the selected user?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Yes, delete it!',
        })

        if (result.isConfirmed) {
          const userId = this.selected[0].id

          Swal.fire({
            title: 'Deleting...',
            html: 'Please wait while we delete the user.',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading()
            },
          })

          Swal.fire({
            title: 'Deleted!',
            text: 'The user has been deleted.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
          })
        }
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: `Failed to delete user: ${error.message}`,
          icon: 'error',
          confirmButtonText: 'OK',
        })
      }
    },
    async handleSave(user) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800))

        if (user.id) {
          const index = this.users.findIndex((u) => u.id === user.id)
          if (index !== -1) {
            this.users.splice(index, 1, user)
            Swal.fire({
              title: 'Success!',
              text: 'User updated successfully',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false,
            })
          }
        } else {
          user.id = this.users.length + 1
          this.users.push(user)
          Swal.fire({
            title: 'Success!',
            text: 'User created successfully',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
          })
        }

        this.isModalVisible = false
      } catch (error) {
        Swal.fire({
          title: 'Error!',
          text: `Failed to save user: ${error.message}`,
          icon: 'error',
          confirmButtonText: 'OK',
        })
      }
    },
  },
}
</script>

<style scoped>
.utilities {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.buttons {
  display: flex;
  gap: 0.5rem;
}

.page-title {
  margin-bottom: 1.5rem;
  color: #333;
}
</style>
