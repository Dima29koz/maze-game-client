<template>
  <v-footer class="d-flex flex-column flex-grow-0 text-center w-100" :elevation="20" :app="false">
    <div class="d-flex align-center">
      <h4 class="">Связаться с нами</h4>
      <v-btn class="ms-4" variant="text" :href="icons.discord" target="_blank" icon>
        <v-icon><IconDiscord></IconDiscord></v-icon>
      </v-btn>
      <v-btn class="" variant="text" :href="icons.github" target="_blank" icon="mdi-github">
      </v-btn>
    </div>

    <div class="px-4 py-2 text-center text-medium-emphasis text-caption w-100">
      2022-2024 Maze Game Team
    </div>
  </v-footer>
</template>

<script>
import IconDiscord from '@/components/icons/IconDiscord.vue'
export default {
  name: 'navbar-footer',
  components: { IconDiscord },

  data: () => ({
    icons: {
      discord: import.meta.env.VITE_DISCORD_INVITE_URL,
      github: import.meta.env.VITE_GITHUB_URL
    }
  })
}
</script>
