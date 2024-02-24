<template>
  <div class="d-flex" :class="isMe ? 'justify-end' : ''">
    <v-card class="pa-2 ma-2" density="compact">
      <div class="d-flex">
        <div
          class="font-weight-bold"
          :class="isMe ? 'text-amber-darken-4' : 'text-indigo-accent-4'"
        >
          {{ turn.player }}
        </div>
        <div class="ps-1">{{ actionName }}</div>
      </div>
      <div>
        {{ turn.response }}
      </div>
    </v-card>
  </div>
</template>

<script>
import { useCurrentUserStore } from '@/stores/currentUserStore'

export default {
  setup() {
    const currentUserStore = useCurrentUserStore()
    return { currentUserStore }
  },

  name: 'game-turn-card',
  props: {
    turn: {
      type: Object,
      default: function () {
        return {
          action: '',
          direction: '',
          player: '',
          response: ''
        }
      }
    }
  },

  computed: {
    actionName() {
      return this.turn.direction
        ? `(${this.turn.action} ${this.turn.direction})`
        : `(${this.turn.action})`
    },
    isMe() {
      return this.turn.player === this.currentUserStore.username
    }
  }
}
</script>
