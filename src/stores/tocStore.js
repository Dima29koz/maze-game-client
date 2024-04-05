import { defineStore } from 'pinia'

export const useTocStore = defineStore('toc', {
  state: () => ({
    ancors: null,
    showFooter: true
  }),

  actions: {
    setAncors(ancors) {
      this.ancors = ancors
    },
    hideFooter() {
      this.showFooter = false
    },
    reset() {
      this.$reset()
    }
  }
})
