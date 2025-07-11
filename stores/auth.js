import { defineStore } from 'pinia'
import axios from 'axios'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    checkInterval: null
  }),
  actions: {
    init() {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user')

      if(storedToken && storedUser){
        this.token = storedToken
        this.user = JSON.parse(storedUser)
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      }
    },
    
    async login(credentials) {
      const { data } = await axios.post('http://localhost:8000/api/login', credentials)
      this.user = data.user
      this.token = data.access_token
      localStorage.setItem('token', this.token)
      localStorage.setItem('user', JSON.stringify(this.user))
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      this.startAuthCheck()
    },
    
    startAuthCheck() {
      this.stopAuthCheck()
      
      this.checkInterval = setInterval(() => {
        this.verifyToken()
      }, 3000) 
    },
    
    stopAuthCheck() {
      if (this.checkInterval) {
        clearInterval(this.checkInterval)
        this.checkInterval = null
      }
    },
    
    async verifyToken() {
      if (!this.token) return
      
      try {
        await axios.get('http://localhost:8000/api/check-auth', {
          headers: { Authorization: `Bearer ${this.token}` }
        })
      } catch (error) {
        if (error.response?.status === 401) {
          this.logout()
          const router = useRouter()
          router.push({ name: 'login' })
        }
      }
    },
    
    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      this.stopAuthCheck()
      delete axios.defaults.headers.common['Authorization']
    }
  }
})