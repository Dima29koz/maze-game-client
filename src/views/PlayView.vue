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
          <create-game-form @create="createRoom"></create-game-form>
        </v-container>
      </v-window-item>
      <v-window-item value="join">
        <v-container fluid>
          <join-game-form @join="joinRoom"></join-game-form>
        </v-container>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script>
import JoinGameForm from '@/components/forms/JoinGameForm.vue'
import CreateGameForm from '@/components/forms/CreateGameForm.vue'

export default {
  components: {
    JoinGameForm,
    CreateGameForm
  },

  data: () => ({
    tab: null
  }),

  methods: {
    createRoom(roomData) {
      console.log('create')
      console.log(roomData)
    },

    joinRoom(roomData) {
      console.log('join')
      console.log(roomData)
    }
  }
}
</script>
