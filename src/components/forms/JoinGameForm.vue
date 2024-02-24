<template>
  <v-form ref="form" @submit.prevent="submit" class="form-join-room">
    <v-text-field
      v-model="room.name"
      :rules="[(v) => validateField(v, schema.name)]"
      :error-messages="error"
      label="Название комнаты"
    ></v-text-field>

    <v-text-field
      v-model="room.password"
      :rules="[(v) => validateField(v, schema.password)]"
      label="Пароль"
      type="password"
    ></v-text-field>

    <v-btn type="submit" color="success" size="large" block>Войти</v-btn>
  </v-form>
</template>

<script>
import * as yup from 'yup'
import { validateField } from '../../utils/validators'

export default {
  name: 'join-game-form',
  setup() {
    const schema = {
      name: yup.string().required('Поле не заполнено'),
      password: yup.string().required('Поле не заполнено')
    }
    return { schema, validateField }
  },

  data() {
    return {
      room: {
        name: '',
        password: ''
      }
    }
  },

  props: {
    error: null
  },

  methods: {
    async submit() {
      if ((await this.$refs.form.validate()).valid) {
        this.$emit('join', this.room)
      }
    }
  }
}
</script>

<style scoped>
.form-join-room {
  width: 100%;
  max-width: 400px;
}
</style>
