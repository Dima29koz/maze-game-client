import { defineStore } from 'pinia'

export const useTocStore = defineStore('toc', {
  state: () => ({
    ancors: null
  }),

  actions: {
    setAncors(ancors) {
      this.ancors = ancors
    },
    reset() {
      this.$reset()
    }
  }
})
