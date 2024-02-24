<template>
  <v-form ref="form" @submit.prevent="submit" class="form-create-room">
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

    <div class="d-sm-flex">
      <v-text-field
        ref="num_players"
        v-model.number="room.rules.num_players"
        :rules="[
          (v) => validateField(v, schema.num_players),
          (v) => rule_total_players_num(v, room.rules.num_bots)
        ]"
        label="Количество игроков"
        type="number"
        class="me-sm-4"
      ></v-text-field>

      <v-text-field
        ref="num_bots"
        v-model.number="room.rules.num_bots"
        :rules="[
          (v) => validateField(v, schema.num_bots),
          (v) => rule_total_players_num(v, room.rules.num_players)
        ]"
        label="Количество ботов"
        type="number"
      ></v-text-field>
    </div>

    <v-switch
      v-model="room.rules.is_not_rect"
      color="primary"
      label="Поле произвольной формы"
      :true-value="true"
      :false-value="false"
      hide-details
      disabled
    ></v-switch>

    <v-switch
      v-model="room.rules.is_separated_armory"
      color="primary"
      label="Раздельные склады оружия и взрывчатки"
      :true-value="true"
      :false-value="false"
      hide-details
    ></v-switch>

    <v-switch
      v-model="room.rules.is_diff_outer_concrete_walls"
      color="primary"
      label="Не различать внешние и внутренние стены"
      :true-value="true"
      :false-value="false"
      hide-details
    ></v-switch>

    <v-btn type="submit" color="success" size="large" block>Создать</v-btn>
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
      password: yup.string().required('Поле не заполнено'),
      num_players: yup.number().moreThan(0, 'Значение должно быть больше 0'),
      num_bots: yup.number().min(0, 'Значение должно быть положительным')
    }
    return { schema, validateField }
  },

  data() {
    return {
      room: {
        name: '',
        password: '',
        rules: {
          num_players: 2,
          num_bots: 0,
          is_not_rect: false,
          is_separated_armory: false,
          is_diff_outer_concrete_walls: false
        }
      }
    }
  },

  props: {
    error: null
  },

  methods: {
    async submit() {
      if ((await this.$refs.form.validate()).valid) {
        this.$emit('create', this.room)
      }
    },

    rule_total_players_num(num_pl, num_bots) {
      const total_num = num_pl + num_bots
      return total_num > 1 && total_num < 10
        ? true
        : 'Суммарное колическо игроков должно быть от 2 до 10 '
    }
  },

  watch: {
    'room.rules.num_players'() {
      this.$refs.num_bots.validate()
    },
    'room.rules.num_bots'() {
      this.$refs.num_players.validate()
    }
  }
}
</script>

<style scoped>
.form-create-room {
  width: 100%;
  max-width: 400px;
}
</style>
