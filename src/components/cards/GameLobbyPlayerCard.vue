<template>
  <div class="card bg-secondary my-1 border border-4 border-warning">
    <div class="card-body d-flex py-2 align-items-center">
      <div class="my-0 pe-2">
        <v-avatar :image="avatarSrc" size="32"> </v-avatar>
      </div>
      <div v-if="is_creator" class="my-0 pe-2">⭐</div>
      <h5 class="my-0">{{ player.name }}</h5>
      <div class="ms-auto my-0">{{ is_spawned_icon }}</div>
    </div>
  </div>
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
    }
  },

  computed: {
    is_spawned_icon() {
      return this.player.is_spawned ? '🟢' : '🔴'
    },
    is_creator() {
      return this.player.name === this.creator
    }
  }
}
</script>
