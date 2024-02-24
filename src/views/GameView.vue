<template>
  <div class="px-4">
    <h2>Game {{ room_name }}</h2>
    <v-row no-gutters>
      <v-col sm="5" md="4">
        <div class="font-weight-bold text-center">
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
          :showControls="!game_data.is_ended"
          :isActive="is_active"
          :allowed_abilities="allowed_abilities"
        ></game-controls-card>
      </v-col>
      <v-col class="ms-sm-4">
        <div class="d-flex flex-wrap overflow-auto" style="max-height: 348px">
          <template v-for="(player_data, i) in players_stats" :key="i">
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
import { get_game_data, get_players_stats } from '@/utils/api_game'

export default {
  setup() {
    const currentUserStore = useCurrentUserStore()
    return { currentUserStore }
  },

  components: {
    GameTurnCard,
    GamePlayerCard,
    GameControlsCard
  },

  data: () => ({
    room_name: '',
    room_id: null,
    socket: null,
    rules: {},
    game_data: {
      is_ended: true,
      next_player: '',
      turns: [],
      winner_name: ''
    },
    players_stats: [],
    is_active: false,
    allowed_abilities: {}
  }),

  methods: {
    async getGameData() {
      this.game_data = await get_game_data(this.room_id)
      console.log(this.game_data)

      if (!this.game_data.is_ended) {
        this.socket.emit('get_allowed_abilities', { room_id: this.room_id })
      }
    },

    async getPlayersStats() {
      this.players_stats = await get_players_stats(this.room_id)
    },

    emitAction(action, direction) {
      this.socket.emit('action', { room_id: this.room_id, action: action, direction: direction })
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

  async mounted() {
    this.room_name = this.$route.query.room
    this.room_id = this.$route.query.room_id
    this.socket = io('/game')

    this.socket.on('connect', () => {
      this.socket.emit('join', { room_id: this.room_id })
    })

    this.socket.on('join', (data) => {
      this.rules = data.rules
      console.log(this.rules)
      this.getGameData()
      this.getPlayersStats()
    })

    this.socket.on('turn_info', (data) => {
      console.log(data)
      this.game_data.turns.push(data.turn_data)
      this.players_stats = data.players_stat
      this.socket.emit('get_allowed_abilities', { room_id: this.room_id })
    })

    this.socket.on('win_msg', (data) => {
      this.game_data.winner_name = data.winner_name
      this.game_data.is_ended = true
      this.game_data.next_player = ''
    })

    this.socket.on('set_allowed_abilities', (data) => {
      this.game_data.next_player = data.next_player_name
      this.is_active = data.is_active
      this.allowed_abilities = data.allowed_abilities
    })
  }
}
</script>
