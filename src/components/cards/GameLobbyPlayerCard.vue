<template>
  <v-card class="mx-auto mb-1" density="compact" min-width="200" height="52">
    <template v-slot:prepend v-if="player.name">
      <v-avatar v-if="!is_bot" :image="avatarSrc" size="32"> </v-avatar>
      <v-icon v-else icon="mdi-robot-angry" size="large"></v-icon>
    </template>
    <template v-slot:title>
      <template v-if="player.name">
        <v-badge v-if="is_creator" color="transparent" floating offset-y="8">
          <template v-slot:badge>
            <v-icon icon="mdi-star" color="amber-accent-3" size="x-large"></v-icon>
          </template>
          {{ player.name }}
        </v-badge>
        <div v-else>{{ player.name }}</div>
      </template>
      <div v-else class="text-caption text-center">Свободный слот</div>
    </template>
    <template v-slot:append>
      <template v-if="player.name">
        <V-icon v-if="player.is_spawned" icon="mdi-check-circle" color="success"></V-icon>
        <V-icon v-else icon="mdi-close-circle" color="red"></V-icon>
      </template>
      <V-icon v-else icon="mdi-alert-circle" color="warning"></V-icon>
    </template>
  </v-card>
</template>

<script>
import { useCurrentUserStore } from '@/stores/currentUserStore'

export default {
  setup() {
    const currentUserStore = useCurrentUserStore()
    const avatarSrc = new URL('@/assets/default_avatar.jpg', import.meta.url).href
    return { currentUserStore, avatarSrc }
  },
  name: 'game-lobby-player-card',

  props: {
    player: {
      type: Object,
      default: function () {
        return {
          name: '',
          is_spawned: ''
        }
      }
    },
    creator: {
      type: String,
      default: ''
    },
    is_bot: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    is_creator() {
      return this.player.name === this.creator
    }
  }
}
</script>
