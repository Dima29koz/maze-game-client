<template>
  <v-app>
    <navbar-header></navbar-header>
    <v-main>
      <RouterView />
      <div class="notificationContainer">
        <v-slide-y-transition group>
          <v-alert
            v-for="notification in notificationsStore.notifications"
            :key="notification[0]"
            :type="notification[1].type"
            :text="notification[1].text"
            closable
            @click:close="notificationsStore.removeNotification(notification[0])"
          >
          </v-alert>
        </v-slide-y-transition>
      </div>
    </v-main>
    <navbar-footer v-if="tocStore.showFooter"></navbar-footer>
  </v-app>
</template>

<script>
import NavbarHeader from '@/components/NavbarHeader.vue'
import NavbarFooter from '@/components/NavbarFooter.vue'
import { useCurrentUserStore } from '@/stores/currentUserStore'
import { useTocStore } from '@/stores/tocStore'
import { useNotificationsStore } from './stores/notificationsStore'

export default {
  setup() {
    const notificationsStore = useNotificationsStore()
    const tocStore = useTocStore()
    return { notificationsStore, tocStore }
  },

  components: {
    NavbarHeader,
    NavbarFooter
  },

  async mounted() {
    const currentUserStore = useCurrentUserStore()
    await currentUserStore.fetch_user()

    this.$router.beforeEach((to, from, next) => {
      if (to.matched.some((record) => record.meta.requiresAuth) && !currentUserStore.isAuth) {
        next({
          path: '/login',
          query: { redirect: to.fullPath }
        })
      } else {
        next()
      }
    })

    this.$router.afterEach((to) => {
      if (to.matched.some((record) => record.meta.requiresAuth === true)) {
        if (!currentUserStore.isAuth) {
          this.$router.push({ name: 'login', query: { redirect: to.fullPath } })
        }
      }

      if (to.matched.some((record) => record.meta.requiresAuth === false)) {
        if (currentUserStore.isAuth) {
          this.$router.push({ name: 'profile_settings' })
        }
      }
    })
  }
}
</script>

<style scoped>
.notificationContainer {
  position: fixed;
  bottom: 10px;
  right: 10px;
  display: grid;
  grid-gap: 0.5em;
  z-index: 9999;
}
</style>
