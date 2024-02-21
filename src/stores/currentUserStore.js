import { defineStore } from 'pinia'
import { profile_data, logout } from '@/utils/api_user_account'

export const useCurrentUserStore = defineStore('currentUser', {
  state: () => ({
    isAuth: false,
    id: null,
    username: '',
    email: '',
    is_email_verified: false
  }),
  getters: {
    currentUser: (state) => state
  },
  actions: {
    authenticate() {
      this.isAuth = true
    },
    setData(data) {
      this.isAuth = true
      this.id = data.id
      this.username = data.username
      this.email = data.email
      this.is_email_verified = data.is_email_verified
    },
    async logout() {
      await logout()
      this.$reset()
    },
    async fetch_user() {
      if (this.id === null) {
        const user_data = await profile_data()
        if (user_data != undefined) {
          this.setData(user_data)
        }
      }
    }
  }
})
