import { defineStore } from 'pinia'
import api from '../api/axios'

export const usePantryStore = defineStore('pantry', {
  state: () => ({
    items: [],
    loading: false,
    error: '',
    oneShopAway: [],
    oneShopAwayLoading: false,
    oneShopAwayError: '',
  }),
  actions: {
    async fetchAll() {
      this.loading = true; this.error = ''
      try {
        const { data } = await api.get('/pantry')
        this.items = data.data ?? data
      } catch (error) { this.error = error.response?.data?.message ?? 'Could not load your pantry.' }
      finally { this.loading = false }
    },
    async add(ingredientName, expiresAt = null) {
      const { data } = await api.post('/pantry', { ingredient_name: ingredientName, expires_at: expiresAt })
      this.items.push(data.data ?? data)
      await this.fetchOneShopAway()
    },
    async remove(id) {
      await api.delete(`/pantry/${id}`)
      this.items = this.items.filter((item) => item.id !== id)
      await this.fetchOneShopAway()
    },
    async fetchOneShopAway(limit = 5) {
      this.oneShopAwayLoading = true
      this.oneShopAwayError = ''
      try {
        const { data } = await api.get('/pantry/one-shop-away', { params: { limit } })
        this.oneShopAway = data.data ?? data
      } catch (error) {
        this.oneShopAwayError = error.response?.data?.message ?? 'Could not load shopping opportunities.'
        this.oneShopAway = []
      } finally {
        this.oneShopAwayLoading = false
      }
    },
  },
})
