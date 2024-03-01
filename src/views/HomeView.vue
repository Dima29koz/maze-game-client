<template>
  <v-container>
    <h1 class="text-h5 text-sm-h4 text-md-h3 mb-2">Адаптация игры "Лабиринт на бумаге".</h1>
    <p>
      Maze Game - это стратегическая онлайн головоломка. В данной игре вы должны с помощью
      уникальных механик, победить противников, но одной удачи здесь мало. Работа головой, знания
      тонкостей игры и навыки анализа являются ключом к победе.
    </p>
    <v-footer class="text-center d-flex flex-column" :elevation="20" app>
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
  </v-container>
</template>

<script>
import IconDiscord from '@/components/icons/IconDiscord.vue'

export default {
  components: { IconDiscord },

  data: () => ({
    icons: {
      discord: import.meta.env.VITE_DISCORD_INVITE_URL,
      github: import.meta.env.VITE_GITHUB_URL
    }
  })
}
</script>
