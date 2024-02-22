<template>
  <v-container>
    <h1>Настройки профиля</h1>

    <v-expansion-panels v-model="panels">
      <!-- Username -->
      <v-expansion-panel>
        <v-expansion-panel-title hide-actions readonly>
          <v-row no-gutters class="align-center flex-column flex-sm-row me-5">
            <v-col class="text-subtitle-1"> Имя пользователя </v-col>
            <v-col class="text-medium-emphasis mt-sm-0 mt-2">
              <span> {{ currentUser.username }} </span>
            </v-col>
          </v-row>
        </v-expansion-panel-title>
      </v-expansion-panel>

      <!-- Email -->
      <v-expansion-panel @group:selected="resetEmail($event)">
        <v-expansion-panel-title expand-icon="mdi-pencil">
          <template v-slot:default="{ expanded }">
            <v-row no-gutters class="align-center flex-column flex-sm-row">
              <v-col class="text-subtitle-1 d-flex">
                Электронная почта
                <v-switchable-tooltip>
                  <template v-slot:activator>
                    <v-icon
                      :color="currentUser.is_email_verified ? 'success' : 'red'"
                      class="ms-2"
                      :icon="email_verified_icon"
                    >
                    </v-icon>
                  </template>
                  <p v-if="currentUser.is_email_verified">Почта подтверждена</p>
                  <p v-else>Почта не подтверждена</p>
                </v-switchable-tooltip>
              </v-col>
              <v-col class="text-medium-emphasis mt-sm-0 mt-2">
                <v-fade-transition leave-absolute>
                  <span v-if="expanded"> Укажите новую почту </span>
                  <span v-else>
                    {{ currentUser.email }}
                  </span>
                </v-fade-transition>
              </v-col>
            </v-row>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-form ref="formEmail" @submit.prevent="setEmail">
            <v-text-field
              v-model="email"
              :rules="[(v) => validateField(v, schema.email)]"
              counter="50"
              name="email"
              label="Почта"
            >
              <template v-slot:append>
                <v-btn type="submit" icon="mdi-check"></v-btn>
              </template>
            </v-text-field>
          </v-form>
        </v-expansion-panel-text>
      </v-expansion-panel>

      <!-- password -->
      <v-expansion-panel @group:selected="resetPassword($event)">
        <v-expansion-panel-title expand-icon="mdi-pencil">
          <template v-slot:default="{ expanded }">
            <v-row no-gutters class="align-center flex-column flex-sm-row">
              <v-col class="text-subtitle-1"> Пароль </v-col>
              <v-col class="text-medium-emphasis mt-sm-0 mt-2">
                <v-fade-transition>
                  <span v-if="expanded"> Изменение пароля </span>
                </v-fade-transition>
              </v-col>
            </v-row>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-form ref="formPassword" @submit.prevent="setPassword">
            <v-text-field
              v-model="password"
              :rules="[(v) => validateField(v, schema.password)]"
              :error-messages="passwordError"
              @update:modelValue="passwordError = ''"
              type="password"
              name="passwordCurrent"
              label="Текущий пароль"
            ></v-text-field>
            <v-text-field
              v-model="newPassword"
              :rules="[(v) => validateField(v, schema.password)]"
              type="password"
              name="password"
              label="Новый пароль"
              autocomplete="new-password"
            ></v-text-field>
            <v-text-field
              v-model="newPasswordRepeat"
              :rules="[(v) => validateField(v, schema.password_repeat(newPassword))]"
              type="password"
              name="passwordRepeat"
              label="Повторите пароль"
            >
              <template v-slot:append>
                <v-btn type="submit" icon="mdi-check"></v-btn>
              </template>
            </v-text-field>
          </v-form>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script>
import * as yup from 'yup'
import { validateField } from '@/utils/validators'
import { edit_email, edit_password } from '@/utils/api_user_account'

import { useCurrentUserStore } from '../stores/currentUserStore'
import { useNotificationsStore } from '@/stores/notificationsStore'

export default {
  setup() {
    const schema = {
      username: yup.string().max(50, 'Превышена максимальная длина').required('Поле не заполнено'),
      email: yup
        .string()
        .max(50, 'Превышена максимальная длина')
        .required('Поле не заполнено')
        .email('Некорректный ардес'),
      password: yup.string().required('Поле не заполнено'),
      password_repeat: (password) => yup.string().oneOf([password, null], 'Пароли не совпадают')
    }
    const currentUserStore = useCurrentUserStore()
    const notificationsStore = useNotificationsStore()
    return { currentUserStore, notificationsStore, schema, validateField }
  },

  data() {
    return {
      email: '',
      password: '',
      passwordError: '',
      newPassword: '',
      newPasswordRepeat: '',
      panels: []
    }
  },

  methods: {
    async setEmail() {
      if ((await this.$refs.formEmail.validate()).valid) {
        const res = await edit_email(this.email)
        this.currentUser.setData(res)
        this.panels = []
        this.notificationsStore.addNotification(
          'Почта изменена. Проверьте вашу почту и следуйте инструкциям для её подтверждения.',
          'success'
        )
      }
    },

    async setPassword() {
      if ((await this.$refs.formPassword.validate()).valid) {
        const res = await edit_password(this.password, this.newPassword, this.newPasswordRepeat)
        if (res?.msg === 'Wrong username or password') {
          this.passwordError = 'Неверный пароль'
          return
        }
        this.currentUser.setData(res)
        this.panels = []
        this.notificationsStore.addNotification('Пароль изменен.', 'success')
      }
    },

    resetEmail(event) {
      if (event.value === true) {
        this.email = ''
      }
    },
    resetPassword(event) {
      if (event.value === true) {
        this.password = ''
        this.passwordError = ''
        this.newPassword = ''
        this.newPasswordRepeat = ''
      }
    }
  },

  computed: {
    currentUser() {
      return this.currentUserStore
    },
    email_verified_icon() {
      return this.currentUserStore.is_email_verified ? 'mdi-email-check' : 'mdi-email-remove'
    }
  }
}
</script>
