<template>
  <v-app>
    <Navbar></Navbar>
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script>
import Navbar from '@/components/NavbarHeader.vue'
import { useCurrentUserStore } from '@/stores/currentUserStore'

export default {
  components: {
    Navbar
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
