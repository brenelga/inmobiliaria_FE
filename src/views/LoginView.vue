<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-sm">
      <h1 class="text-xl font-semibold text-center text-gray-800 mb-1">
        Condominio Vista Alegre
      </h1>
      <p class="text-xs text-center text-gray-500 mb-6">
        Sistema de Gestión de Condominio
      </p>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1" for="username">
            Correo Electrónico
          </label>
          <input
            v-model="form.username"
            type="text"
            id="username"
            placeholder="Ingrese su correo"
            class="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1" for="password">
            Contraseña
          </label>
          <input
            v-model="form.password"
            type="password"
            id="password"
            placeholder="Ingrese su contraseña"
            class="w-full px-3 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>
        <div v-if="error" class="text-red-500 text-sm mb-4">
          {{ error }}
        </div>
        <button
          type="submit"
          class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Iniciar Sesión
        </button>
      </form>
      <div class="flex justify-between mt-4 text-sm text-blue-500">
        <router-link to="/recuperar" class="hover:underline">¿Olvidaste tu contraseña?</router-link>
        <router-link to="/registro" class="hover:underline">Registrarse</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const form = reactive({
  username: '',
  password: ''
})

const error = ref(null)
const auth = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
  error.value = null
  try {
    await auth.login(form)
    if (auth.user.tipo === 'admin') {
      router.push({ name: 'panel' })
    } else if (auth.user.tipo === 'inquilino') {
      router.push({ name: 'usuario' })
    } else {
      router.push({ name: 'login' })
    }
  } catch (err) {
    error.value = 'Credenciales inválidas o error de conexión.'
    console.error(err)
  }
}
</script>
