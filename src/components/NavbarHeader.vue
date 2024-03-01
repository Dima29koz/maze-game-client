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
              <p class="my-0 ms-2">{{ currentUser.username }}</p>
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

    <v-list
      v-if="tocStore.ancors && $vuetify.display.mobile"
      v-model:selected="selected"
      nav
      variant="plain"
      active-class="active-ancor text-primary"
    >
      <v-list-subheader>Содержание</v-list-subheader>

      <v-list-item
        @click.prevent.stop="onClick(item), (sidebar = !sidebar)"
        v-for="(item, i) in tocStore.ancors"
        :key="i"
        :title="item.title"
        :href="item.href"
        :value="item.href"
        class="ancor rounded-0 ps-3"
        :class="`ps-${item.level * 3}`"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>

  <v-navigation-drawer
    v-if="tocStore.ancors && !$vuetify.display.mobile"
    v-model="showToc"
    floating
    permanent
    sticky
    location="right"
    color="background"
  >
    <v-list
      v-model:selected="selected"
      nav
      variant="plain"
      active-class="active-ancor text-primary"
    >
      <v-list-subheader>Содержание</v-list-subheader>

      <v-list-item
        @click.prevent.stop="onClick(item)"
        v-for="(item, i) in tocStore.ancors"
        :key="i"
        :title="item.title"
        :href="item.href"
        :value="item.href"
        class="ancor rounded-0 ps-3"
        :class="`ps-${item.level * 3}`"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { nextTick } from 'vue'

import { useCurrentUserStore } from '@/stores/currentUserStore'
import { useTocStore } from '@/stores/tocStore'

import ColorModeToggler from '@/components/UI/ColorModeToggler.vue'

export default {
  name: 'navbar-header',
  setup() {
    const currentUserStore = useCurrentUserStore()
    const tocStore = useTocStore()
    const avatarSrc = new URL('@/assets/default_avatar.jpg', import.meta.url).href
    return { currentUserStore, tocStore, avatarSrc }
  },
  data() {
    return {
      sidebar: false,
      showToc: false,
      currentTab: '',
      selectedTab: [],
      current: '',
      selected: [],
      intersecting: [],
      observer: null
    }
  },
  components: {
    ColorModeToggler
  },
  methods: {
    logout() {
      this.currentUserStore.logout()
      this.$router.push({ name: 'login' })
    },

    async observeToc() {
      this.intersecting.length = 0
      this.current = ''
      this.observer.disconnect()
      await nextTick()

      const tocItems = document.querySelectorAll('h2, h3')
      tocItems.forEach((el) => {
        this.observer.observe(el)
      })
    },

    onClick(item) {
      // if (this.current === item.href) return
      this.current = item.href
      this.selected = [`#${this.current}`]
      const el = document.getElementById(item.id)
      // console.log(el.offsetTop)
      window.scrollTo(0, el.offsetTop - 64)
      // el.scrollIntoView(true)
      // this.$router.replace({ path: this.$route.path, hash: href })
      // internalScrolling = true

      // setTimeout(() => {
      //   internalScrolling = false
      // }, 1000)
    }
  },
  computed: {
    currentUser() {
      return this.currentUserStore
    }
  },

  watch: {
    'tocStore.ancors'() {
      this.observeToc()
    }
  },

  mounted() {
    this.showToc = !this.$vuetify.display.mobile

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.intersecting.push(entry.target.id)
          } else if (this.intersecting.includes(entry.target.id)) {
            this.intersecting.splice(this.intersecting.indexOf(entry.target.id), 1)
          }
        })
        this.current = this.intersecting.at(-1) || this.current || ''
        this.selected = [`#${this.current}`]
      },
      {
        rootMargin: '0px 0px -75%'
      }
    )

    this.observeToc()
  }
}
</script>

<style scoped>
a.v-slide-group-item--active,
a.v-tab--selected {
  color: #42b983;
}

.ancor {
  min-height: auto;
  margin: 0 !important;
  border-left: 2px solid;
  border-left-color: rgb(var(--v-theme-on-surface-variant));
}

.active-ancor {
  border-left-color: rgb(var(--v-theme-primary));
}
</style>
