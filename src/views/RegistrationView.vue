<template>
  <RegistrationForm @register="createUser" :error="error"> </RegistrationForm>
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
      const res = await registration(new_user.username, new_user.email, new_user.password)
      if (res?.msg == 'username is not allowed') {
        this.error = 'Пользователь с таким именем уже существует'
      } else {
        this.$router.push({ name: 'login', query: { msg: 'success_registration' } })
      }
    }
  }
}
</script>

<style scoped></style>
