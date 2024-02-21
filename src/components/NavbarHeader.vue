<template>
  <v-app-bar flat>
    <template v-slot:prepend>
      <div>
        <v-app-bar-nav-icon
          @click="sidebar = !sidebar"
          class="hidden-sm-and-up"
        ></v-app-bar-nav-icon>
      </div>
    </template>

    <v-tabs v-model="currentTab" class="hidden-xs">
      <v-tab to="/" value="home">Главная</v-tab>
      <template v-if="currentUser.isAuth">
        <v-tab to="/play" value="play">Играть</v-tab>
      </template>
      <v-tab to="/rules" value="rules">Правила</v-tab>
    </v-tabs>

    <template v-slot:append>
      <template v-if="currentUser.isAuth">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props">
              <v-avatar :image="avatarSrc" size="32"> </v-avatar>
              <p class="my-0">{{ currentUser.username }}</p>
              <v-icon icon="mdi-menu-down"></v-icon>
            </v-btn>
          </template>
          <v-list :lines="false">
            <v-list-item
              to="/profile_settings"
              @click="currentTab = 'profile'"
              title="Профиль"
            ></v-list-item>
            <v-list-item
              to="/my_games"
              @click="currentTab = 'my_games'"
              title="История игр"
            ></v-list-item>
            <v-divider class="mt-2"></v-divider>
            <v-list-item
              @click="logout"
              type="button"
              class="font-weight-bold"
              title="Выйти"
            ></v-list-item>
          </v-list>
        </v-menu>
      </template>

      <template v-else>
        <v-btn :to="{ name: 'login' }" type="button" class="me-2" variant="outlined"> Вход </v-btn>
        <v-btn :to="{ name: 'registration' }" type="button" variant="flat" color="indigo-darken-3">
          Регистрация
        </v-btn>
      </template>
      <color-mode-toggler></color-mode-toggler>
    </template>
  </v-app-bar>

  <v-navigation-drawer v-model="sidebar" temporary>
    <v-list :lines="false" nav>
      <v-list-item to="/">Главная</v-list-item>
      <template v-if="currentUser.isAuth">
        <v-list-item to="/play">Играть</v-list-item>
      </template>
      <v-list-item to="/rules">Правила</v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { useCurrentUserStore } from '../stores/currentUserStore'
import ColorModeToggler from '@/components/UI/ColorModeToggler.vue'

export default {
  name: 'navbar-header',
  setup() {
    const currentUserStore = useCurrentUserStore()
    const avatarSrc = new URL('@/assets/default_avatar.jpg', import.meta.url).href
    return { currentUserStore, avatarSrc }
  },
  data() {
    return {
      sidebar: false,
      currentTab: '',
      selectedTab: []
    }
  },
  components: {
    ColorModeToggler
  },
  methods: {
    logout() {
      this.currentUserStore.logout()
      this.$router.push({ name: 'login' })
    }
  },
  computed: {
    currentUser() {
      return this.currentUserStore
    }
  }
}
</script>

<style scoped>
a.v-slide-group-item--active,
a.v-tab--selected {
  color: #42b983;
}
</style>
