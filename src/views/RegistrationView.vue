<template>
  <v-sheet class="pa-4 text-center mx-auto my-sm-16 my-4 form-register rounded" :elevation="8">
    <h1 class="h3 mb-4 fw-normal">Регистрация</h1>
    <registration-form @register="createUser" :error="error"> </registration-form>
  </v-sheet>
</template>

<script>
import RegistrationForm from '@/components/forms/RegistrationForm.vue'
import { registration } from '@/utils/api_user_account'

export default {
  data() {
    return {
      error: null
    }
  },
  components: {
    RegistrationForm
  },
  methods: {
    async createUser(new_user) {
      const res = await registration(
        new_user.username,
        new_user.email,
        new_user.password,
        new_user.password_repeat
      )
      if (res?.msg == 'username is not allowed') {
        this.error = 'Пользователь с таким именем уже существует'
      } else {
        this.$router.push({ name: 'login', query: { msg: 'success_registration' } })
      }
    }
  }
}
</script>

<style scoped>
.form-register {
  width: 100%;
  max-width: 400px;
}
</style>
