import { create } from 'zustand'
import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  setUser(user, token) {
    if (token) {
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }
    set({ user, token: token || get().token })
  },
  logout() {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    set({ user: null, token: null })
  },
  async login(email, password) {
    const res = await axios.post(`${API_BASE}/auth/login`, { email, password })
    const { token, user } = res.data
    get().setUser(user, token)
    return user
  },
  async register(data) {
    const res = await axios.post(`${API_BASE}/auth/register`, data)
    const { token, user } = res.data
    get().setUser(user, token)
    return user
  }
}))

// Initialize axios auth header if token already exists
const token = localStorage.getItem('token')
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}
