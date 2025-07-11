<template>
  <div class="main">
    <h2 class="text-xl font-bold mb-4">Cambiar contraseña</h2>
    <form @submit.prevent="cambiarPassword" class="formulario">
      <label>Contraseña actual:</label>
      <input type="password" v-model="actual" required />
      
      <label>Nueva contraseña:</label>
      <input type="password" v-model="nueva" required minlength="8" />
      
      <label>Confirmar nueva contraseña:</label>
      <input 
        type="password" 
        v-model="confirmacion" 
        required 
        minlength="8"
        :class="{ 'border-red-500': nueva && confirmacion && nueva !== confirmacion }"
      />
      <small v-if="nueva && confirmacion && nueva !== confirmacion" class="text-red-500">
        Las contraseñas no coinciden
      </small>
      
      <button 
        class="btn" 
        type="submit" 
        :disabled="isLoading || (nueva && confirmacion && nueva !== confirmacion)"
      >
        <span v-if="!isLoading">Actualizar</span>
        <span v-else>Actualizando...</span>
      </button>
      
      <div 
        v-if="mensaje" 
        :class="['notificacion', exito ? 'notificacion-exito' : 'notificacion-error']"
      >
        {{ mensaje }}
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const actual = ref('')
const nueva = ref('')
const confirmacion = ref('')
const isLoading = ref(false)
const mensaje = ref('')
const exito = ref(false)
const router = useRouter()
const auth = useAuthStore()

// Validación en el cliente antes de enviar
const passwordsCoinciden = computed(() => {
  return nueva.value === confirmacion.value
})

async function cambiarPassword() {
  // Validación adicional en el cliente
  if (!passwordsCoinciden.value) {
    exito.value = false
    mensaje.value = 'Las contraseñas no coinciden'
    return
  }

  isLoading.value = true
  mensaje.value = ''
  
  try {
    const response = await axios.post('http://localhost:8000/api/change-password', {
      current_password: actual.value,
      new_password: nueva.value,
      new_password_confirmation: confirmacion.value
    }, {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    })

    exito.value = true
    mensaje.value = response.data.message
    
    localStorage.setItem('forceLogout', Date.now())
    
    setTimeout(() => {
      auth.logout()
      router.push({ name: 'login' })
    }, 1500)
    
  } catch (err) {
    exito.value = false
    mensaje.value = err.response?.data?.message || 
                    err.response?.data?.error || 
                    'Error al cambiar contraseña. Por favor, inténtalo de nuevo.'
    
    if (err.response?.status === 401) {
      setTimeout(() => {
        auth.logout()
        router.push({ name: 'login' })
      }, 1500)
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.formulario {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
}

input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 1px #4f46e5;
}

.border-red-500 {
  border-color: #ef4444;
}

.text-red-500 {
  color: #ef4444;
}

.btn {
  padding: 0.5rem 1rem;
  background-color: #4f46e5;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn:hover:not(:disabled) {
  background-color: #4338ca;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.notificacion {
  padding: 0.75rem;
  border-radius: 6px;
  margin-top: 1rem;
}

.notificacion-exito {
  background-color: #d1fae5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.notificacion-error {
  background-color: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}
</style>