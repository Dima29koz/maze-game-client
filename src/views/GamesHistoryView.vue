<template>
  <v-container>
    <h2>Статистика</h2>
    <p>Сыграно игр: {{ stats.games_total }}</p>
    <p>Побед: {{ stats.games_won }}</p>

    <h3>История игр</h3>
    <v-data-table
      :headers="headers"
      :items="games"
      :items-per-page="-1"
      multi-sort
      hover
      class="pa-2"
    >
      <template v-slot:item="{ item, index }">
        <tr>
          <td>{{ index + 1 }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.status }}</td>
          <td>{{ item.winner }}</td>
          <td>
            <v-btn @click="joinGame(item)" density="compact" icon>
              <v-icon icon="mdi-login" color="success"></v-icon>
            </v-btn>
          </td>
        </tr>
      </template>

      <template v-slot:bottom></template>
    </v-data-table>
  </v-container>
</template>

<script>
import { user_games } from '@/utils/api_user_account'

export default {
  data() {
    return {
      games: [],
      stats: {
        games_total: 0,
        games_won: 0
      },
      headers: [
        { title: '#', key: '_', sortable: false },
        { title: 'Лобби', key: 'name' },
        { title: 'Статус', key: 'status' },
        { title: 'Победитель', key: 'winner' },
        { title: 'Присоединиться', key: '_', sortable: false }
      ]
    }
  },

  methods: {
    joinGame(game) {
      if (game.status === 'created') {
        this.$router.push({ name: 'game_lobby', query: { room: game.name, room_id: game.id } })
      } else {
        this.$router.push({ name: 'game', query: { room: game.name, room_id: game.id } })
      }
    }
  },

  async mounted() {
    const res = await user_games()
    this.games = res.games
    this.stats.games_total = res.games_total
    this.stats.games_won = res.games_won
  }
}
</script>
