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
        <tr @click="joinGame(item)" class="cursor-pointer" title="Перейти к игре">
          <td>{{ index + 1 }}</td>
          <td class="overflow-x-hidden" style="max-width: 120px">
            <v-badge
              v-if="item.status !== 'ended'"
              :content="states[item.status]['badge']"
              :color="states[item.status]['color']"
              offset-x="-4"
              floating
            >
              {{ item.name }}
            </v-badge>
            <template v-else>
              {{ item.name }}
            </template>
          </td>
          <td class="overflow-x-hidden" style="max-width: 120px">{{ item.winner }}</td>
        </tr>
      </template>

      <template v-slot:bottom></template>
    </v-data-table>
  </v-container>
</template>

<script>
import { user_games } from '@/utils/api_user_account'
import { get_game_token } from '@/utils/api_game'

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
        { title: 'Победитель', key: 'winner' }
      ],
      states: {
        created: { title: 'Создана', badge: 'new', color: 'success' },
        running: { title: 'Не завершена', badge: 'идет', color: 'primary' },
        ended: { title: 'Завершена' }
      }
    }
  },

  methods: {
    async joinGame(game) {
      const token = await get_game_token(game.id)

      if (game.status === 'created') {
        this.$router.push({ name: 'game_lobby', query: { game: token } })
      } else {
        this.$router.push({ name: 'game', query: { game: token } })
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
