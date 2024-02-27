<template>
  <v-card
    width="300"
    height="100"
    class="me-4 mb-4"
    :prepend-avatar="get_user_avatar_src(player.name)"
    density="compact"
    elevation="4"
  >
    <template v-slot:append>
      <v-icon v-if="player.has_treasure" icon="mdi-treasure-chest" color="amber-accent-4"></v-icon>
      <v-icon v-else icon="mdi-treasure-chest-outline"></v-icon>
    </template>
    <template v-slot:title>
      <p class="font-weight-bold">
        {{ player.name }}
      </p>

      <v-icon
        v-for="i in player.health"
        :key="i"
        icon="mdi-heart"
        color="red-accent-4"
        size="x-small"
      ></v-icon>
      <v-icon
        v-for="i in rules_stats.max_health - player.health"
        :key="i"
        icon="mdi-heart-outline"
        size="x-small"
      ></v-icon>
    </template>
    <v-card-text class="d-flex justify-space-between">
      <div>
        <v-icon v-for="i in player.arrows" :key="i" icon="mdi-bow-arrow"></v-icon>
      </div>
      <div>
        <v-icon v-for="i in player.bombs" :key="i" icon="mdi-bomb"></v-icon>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { get_user_avatar_src } from '@/utils/api_user_account'

export default {
  setup() {
    return { get_user_avatar_src }
  },

  name: 'game-player-card',
  props: {
    player: {
      type: Object,
      default: function () {
        return {
          name: '',
          has_treasure: false,
          health: 0,
          bombs: 0,
          arrows: 0
        }
      }
    },
    rules_stats: {
      type: Object,
      default: function () {
        return {
          max_health: 0,
          max_arrows: 0,
          max_bombs: 0
        }
      }
    }
  }
}
</script>
