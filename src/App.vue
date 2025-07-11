<template>
  <RouterView />
  <RouterLink />
</template>

<script>
import { onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { RouterLink, RouterView, useRouter } from 'vue-router'

export default {
  setup() {
    const auth = useAuthStore()
    const router = useRouter()

    const initializeAuth = () => {
      auth.init()
      
      if (auth.token) {
        auth.startAuthCheck()
        
        auth.verifyToken().catch(() => {
          console.log('Token verification failed on startup')
        })
      }
    }

    const handleStorageEvent = (event) => {
      if (event.key === 'forceLogout') {
        auth.logout()
        router.push({ name: 'login' })
      }
    }

    onMounted(() => {
      initializeAuth()
      window.addEventListener('storage', handleStorageEvent)
    })

    onUnmounted(() => {
      auth.stopAuthCheck()
      window.removeEventListener('storage', handleStorageEvent)
    })

    return {}
  }
}
</script>