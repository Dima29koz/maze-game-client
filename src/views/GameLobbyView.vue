<template>
  <v-container>
    <div class="d-flex justify-space-between align-center py-2">
      <h1>
        Комната: <span id="get-room-name">{{ room_name }}</span>
      </h1>
      <v-btn @click="leaveRoom" color="red">Покинуть игру</v-btn>
    </div>
    <div v-if="is_creator" class="text-center my-2 w-100">
      <v-btn
        @click="startGame"
        :disabled="!room_data.is_ready"
        block
        :color="room_data.is_ready ? 'success' : ''"
      >
        Начать игру
      </v-btn>
    </div>
    <div class="d-flex flex-sm-row flex-column w-100">
      <div id="players-cards" class="me-sm-4 mb-sm-0 me-0 mb-2">
        <template v-for="(player_data, i) in room_data.players" :key="i">
          <game-lobby-player-card
            :player="player_data"
            :creator="room_data.creator"
          ></game-lobby-player-card>
        </template>

        <template v-for="i in room_data.players_amount - room_data.players.length" :key="i">
          <game-lobby-player-card :creator="room_data.creator"></game-lobby-player-card>
        </template>

        <template v-for="(bot_data, i) in room_data.bots" :key="i">
          <game-lobby-player-card
            :player="bot_data"
            :creator="room_data.creator"
            :is_bot="true"
          ></game-lobby-player-card>
        </template>
      </div>
      <div class="mb-1">
        <v-alert class="mb-2" density="compact" type="info" variant="tonal">
          Для выбора места появления нажмите на одну из клеток поля. Данное действие
          <b>невозможно</b> отменить.
        </v-alert>

        <div id="map-container" class="text-center h-100">
          <canvas class="border" id="map"></canvas>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script>
import { io } from 'socket.io-client'

import { useCurrentUserStore } from '@/stores/currentUserStore'
import { useNotificationsStore } from '@/stores/notificationsStore'
import GameLobbyPlayerCard from '@/components/cards/GameLobbyPlayerCard.vue'

export default {
  setup() {
    const currentUserStore = useCurrentUserStore()
    const notificationsStore = useNotificationsStore()
    return { currentUserStore, notificationsStore }
  },

  components: {
    GameLobbyPlayerCard
  },

  data: () => ({
    room_name: '',
    socket: null,
    room_data: {
      bots: [],
      bots_amount: 0,
      players: [],
      players_amount: 0,
      creator: '',
      is_ready: false
    }
  }),

  methods: {
    leaveRoom() {
      this.socket.emit('leave')
      this.$router.push({ name: 'play' })
    },
    startGame() {
      this.socket.emit('start')
    },

    drawSpawnMap(field, spawn_point) {
      const drawingCanvas = document.getElementById('map')
      const div = document.getElementById('map-container')
      const width = div.clientWidth
      const height = div.clientHeight
      const tile_size = height < width ? height / field.length : width / field[0].length
      if (drawingCanvas && drawingCanvas.getContext) {
        const context = drawingCanvas.getContext('2d')
        context.canvas.width = tile_size * field[0].length
        context.canvas.height = tile_size * field.length
        let cells = drawField(context)
        if (spawn_point == null) {
          drawingCanvas.onclick = (e) => {
            cells.forEach((cell_obj) => {
              if (cell_obj !== null) {
                if (context.isPointInPath(cell_obj, e.offsetX, e.offsetY)) {
                  this.socket.emit('set_spawn', { spawn: cell_obj.data })
                  drawingCanvas.onclick = null
                  drawCell(cell_obj.data, context, true)
                }
              }
            })
          }
        } else {
          drawCell(spawn_point, context, true)
        }
      }

      function drawField(context) {
        let cells = []
        for (let row of field) {
          for (let cell of row) {
            if (cell != null) {
              cells.push(drawCell(cell, context))
            }
          }
        }
        return cells
      }

      function drawCell(cell, context, is_pressed = false) {
        let cell_obj = new Path2D()
        let x = (cell.x - 1) * tile_size
        let y = (cell.y - 1) * tile_size
        cell_obj.rect(x + 2, y + 2, tile_size - 4, tile_size - 4)
        cell_obj.data = { x: cell.x, y: cell.y }
        context.fillStyle = is_pressed ? '#453E26' : '#6b623c'
        context.fill(cell_obj)
        return cell_obj
      }
    }
  },

  computed: {
    is_creator() {
      return this.room_data.creator === this.currentUserStore.username
    }
  },

  async mounted() {
    const token = this.$route.query.game
    this.socket = io('/game_room', {
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
      if (error.type === 'start') {
        if (error.msg === 'all players should join and select spawn') {
          this.notificationsStore.addNotification(
            'Для начала игры необходимо, чтобы все игроки присоединилсь к лобби и выбрали точки появления.',
            'warning'
          )
        }
        if (error.msg === 'only creator allowed to start game') {
          this.notificationsStore.addNotification(
            'Начать игру может только создатель комнаты.',
            'warning'
          )
        }
        this.room_data.is_ready = false
      }
    })

    this.socket.on('join', (data) => {
      console.log(data)
      this.room_name = data.room_name
      this.room_data = data.room_info
    })

    this.socket.on('get_spawn', (data) => {
      console.log(data)
      this.drawSpawnMap(data.field, data.spawn_info)
    })

    //redirect всех игроков в комнате в игру
    this.socket.on('start', () => {
      this.$router.push({ name: 'game', query: { game: token } })
    })
  }
}
</script>
