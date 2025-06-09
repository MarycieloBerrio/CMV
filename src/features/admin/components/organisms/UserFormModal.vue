<template>
  <v-dialog v-model="isVisible" max-width="600px" class="rounded-xl">
    <v-card class="rounded-xl shadow-lg">
      <v-card-title class="bg-[#417100] text-white font-bold text-center py-4 rounded-t-xl">
        <span class="text-xl">{{ formTitle }}</span>
      </v-card-title>

      <v-card-text class="px-6 py-8">
        <FormKit type="form" :actions="false">
          <FormKit
            type="TextFieldForm"
            :value="user.name"
            name="name"
            vuetify-label="Name"
            validation="required|min:3"
            validation-visibility="dirty"
            placeholder="Enter your name"
            validation-messages="{
              required: 'Name is required',
              min: 'Name must be at least 3 characters',
            }"
            outer-class="mb-4"
          />
          <FormKit
            type="TextFieldForm"
            :value="user.email"
            name="email"
            vuetify-label="Email"
            validation="required|email"
            validation-messages="{
              required: 'Email is required',
              email: 'Invalid email format',
            }"
            validation-visibility="dirty"
            placeholder="Enter your email"
            outer-class="mb-4"
          />

          <FormKit
            type="SelectFieldForm"
            :value="user.role"
            name="role"
            vuetify-label="Role"
            :options="roles"
            validation="required"
            validation-visibility="dirty"
            :validation-messages="{
              required: 'Role is required',
            }"
          />
        </FormKit>
      </v-card-text>

      <v-card-actions class="bg-gray-50 px-6 py-4 rounded-b-xl">
        <v-spacer></v-spacer>
        <v-btn
          color="error"
          @click="close"
          class="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-all duration-300"
        >
          Cancel
        </v-btn>
        <v-btn
          color="success"
          @click="validateAndSave"
          class="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-all duration-300 ml-4"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'UserFormModal',
  props: {
    visible: Boolean,
    user: Object,
    roles: Array,
  },
  computed: {
    isVisible: {
      get() {
        return this.visible
      },
      set(value) {
        this.$emit('update:visible', value)
      },
    },
    formTitle() {
      return this.user.id ? 'Modify User' : 'Create User'
    },
  },
  methods: {
    close() {
      this.isVisible = false
    },
    async validateAndSave() {
      const form = document.querySelector('[data-type="form"]')
      if (form) {
        form.submit()
      }
    },
    save() {
      this.$emit('save', this.user)
      this.close()
    },
  },
}
</script>
