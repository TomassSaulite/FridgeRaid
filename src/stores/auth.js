import { defineStore } from 'pinia'
import api from '../api/axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({ token: localStorage.getItem('token'), user: null }),
  actions: {
    setSession(data) {
      const payload = data.data ?? data
      this.token = payload.token ?? payload.access_token
      this.user = payload.user ?? null
      if (!this.token) throw new Error('The API did not return an authentication token.')
      localStorage.setItem('token', this.token)
    },
    async register(payload) {
      const { data } = await api.post('/register', payload)
      this.setSession(data)
    },
    async login(email, password) {
      const { data } = await api.post('/login', { email, password })
      this.setSession(data)
    },
    async fetchUser() {
      const { data } = await api.get('/user')
      this.user = data.data ?? data
    },
    async logout() {
      try { await api.post('/logout') } finally {
        this.token = null
        this.user = null
        localStorage.removeItem('token')
      }
    },
  },
})
