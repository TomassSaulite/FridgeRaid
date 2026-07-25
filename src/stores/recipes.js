import { defineStore } from 'pinia'
import api from '../api/axios'

export const useRecipesStore = defineStore('recipes', {
  state: () => ({ suggestions: [], loading: false, error: '', filters: { ease: null, tag: null } }),
  actions: {
    async fetchSuggestions() {
      this.loading = true; this.error = ''
      try {
        const { data } = await api.get('/recipes/suggestions', { params: this.filters })
        this.suggestions = data.data ?? data
      } catch (error) { this.error = error.response?.data?.message ?? 'Could not load recipe suggestions.' }
      finally { this.loading = false }
    },
  },
})
