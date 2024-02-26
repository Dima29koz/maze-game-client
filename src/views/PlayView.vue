<template>
  <v-card class="mt-4">
    <v-tabs v-model="tab" color="primary">
      <v-tab value="create">
        <v-icon start> mdi-plus </v-icon>
        Создать
      </v-tab>
      <v-tab value="join">
        <v-icon start> mdi-login </v-icon>
        Присоединиться
      </v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <v-window-item value="create">
        <v-container fluid>
          <create-game-form @create="createRoom" :error="createError"></create-game-form>
        </v-container>
      </v-window-item>
      <v-window-item value="join">
        <v-container fluid>
          <join-game-form @join="joinRoom" :error="joinError"></join-game-form>
        </v-container>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script>
import JoinGameForm from '@/components/forms/JoinGameForm.vue'
import CreateGameForm from '@/components/forms/CreateGameForm.vue'

import { useNotificationsStore } from '@/stores/notificationsStore'
import { join_game, create_game } from '@/utils/api_game'

export default {
  setup() {
    const notificationsStore = useNotificationsStore()
    return { notificationsStore }
  },

  components: {
    JoinGameForm,
    CreateGameForm
  },

  data: () => ({
    tab: null,
    joinError: null,
    createError: null
  }),

  methods: {
    async createRoom(roomData) {
      const res = await create_game(roomData.name, roomData.password, roomData.rules)
      if (res?.msg === 'Room with this name already exists') {
        this.createError = 'Комната с таким названием уже существует'
        return
      }
      this.$router.push({ name: 'game_lobby', query: { room: res.name, room_id: res.id } })
    },

    async joinRoom(roomData) {
      const res = await join_game(roomData.name, roomData.password)
      if (res?.msg === 'Wrong room name or password') {
        this.joinError = 'Неверное название или пароль'
        return
      }
      if (res?.msg === 'There are no empty slots in the room') {
        this.notificationsStore.addNotification('Комната полностью заполена.', 'warning')
        return
      }

      if (res.state === 'created') {
        this.$router.push({ name: 'game_lobby', query: { room: res.name, room_id: res.id } })
      } else {
        this.$router.push({ name: 'game', query: { room: res.name, room_id: res.id } })
      }
    }
  }
}
</script>
