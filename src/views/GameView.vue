<template>
  <div class="px-4">
    <h2>Game {{ room_name }}</h2>
    <v-row no-gutters>
      <v-col sm="5" md="4">
        <div class="font-weight-bold text-center">
          <div v-if="game_data.error" class="bg-error rounded-t">
            Для данной игры доступна только история ходов
          </div>
          <div v-if="game_data.next_player" class="bg-info rounded-t">
            Ход игрока {{ game_data.next_player }}
          </div>
          <div v-if="game_data.winner_name" class="bg-success rounded-t">
            {{ game_data.winner_name }} одержал победу!
          </div>
        </div>

        <div id="game-info" ref="gameInfo" class="border overflow-auto" style="height: 70vh">
          <template v-for="(turn_data, i) in game_data.turns" :key="i">
            <game-turn-card :turn="turn_data"></game-turn-card>
          </template>
        </div>
        <game-controls-card
          @action="emitAction"
          :showControls="!game_data.is_ended && !game_data.error"
          :isActive="is_active"
          :allowed_abilities="allowed_abilities"
        ></game-controls-card>
      </v-col>
      <v-col class="ms-sm-4">
        <div class="d-flex flex-wrap overflow-auto" style="max-height: 348px">
          <template v-for="(player_data, i) in game_data.players_stats" :key="i">
            <game-player-card
              :player="player_data"
              :rules_stats="rules.player_stat"
            ></game-player-card>
          </template>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { io } from 'socket.io-client'
import { nextTick } from 'vue'

import GameTurnCard from '@/components/cards/GameTurnCard.vue'
import GamePlayerCard from '@/components/cards/GamePlayerCard.vue'
import GameControlsCard from '@/components/cards/GameControlsCard.vue'
import { useCurrentUserStore } from '@/stores/currentUserStore'
import { useNotificationsStore } from '@/stores/notificationsStore'
import { useTocStore } from '@/stores/tocStore'

export default {
  setup() {
    const currentUserStore = useCurrentUserStore()
    const tocStore = useTocStore()
    const notificationsStore = useNotificationsStore()
    tocStore.hideFooter()
    return { currentUserStore, tocStore, notificationsStore }
  },

  components: {
    GameTurnCard,
    GamePlayerCard,
    GameControlsCard
  },

  data: () => ({
    room_name: '',
    socket: null,
    rules: {},
    game_data: {
      error: null,
      is_ended: true,
      next_player: '',
      turns: [],
      winner_name: '',
      players_stats: []
    },
    is_active: false,
    allowed_abilities: {}
  }),

  methods: {
    emitAction(action, direction) {
      this.is_active = false
      this.socket.emit('action', {
        action: action,
        direction: direction
      })
    },

    async scrollDownChatWindow() {
      await nextTick()
      const chatWindow = this.$refs.gameInfo
      chatWindow.scrollTo(0, chatWindow.scrollHeight)
    }
  },

  watch: {
    'game_data.turns': {
      handler() {
        this.scrollDownChatWindow()
      },
      deep: true
    }
  },

  unmounted() {
    this.tocStore.reset()
  },

  async mounted() {
    const token = this.$route.query.game
    this.socket = io('/game', {
      auth: {
        token: token
      }
    })

    this.socket.on('connect_error', () => {
      this.notificationsStore.addNotification('Не удалось присоединиться к комнате.', 'warning')
      this.$router.push({ name: 'play' })
    })

    this.socket.on('error', (error) => {
      console.log(error)
    })

    this.socket.on('join', (data) => {
      console.log(data)
      this.rules = data.rules
      this.room_name = data.room_name
      this.game_data = data.game_data

      if (!this.game_data.is_ended && !this.game_data.error) {
        this.socket.emit('get_allowed_abilities')
      }
    })

    this.socket.on('turn_info', (data) => {
      console.log(data)
      this.game_data.turns.push(data.turn_data)
      this.game_data.players_stats = data.players_stats
      this.game_data.next_player = data.next_player
      this.game_data.winner_name = data.winner_name

      if (this.game_data.winner_name) {
        this.is_ended = true
      }

      if (this.game_data.next_player === this.currentUserStore.username) {
        this.socket.emit('get_allowed_abilities')
      }
    })

    this.socket.on('set_allowed_abilities', (data) => {
      console.log(data)
      this.game_data.next_player = data.next_player_name
      this.is_active = data.is_active
      this.allowed_abilities = data.allowed_abilities
    })
  }
}
</script>
