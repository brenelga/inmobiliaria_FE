<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const email = ref('');
const loading = ref(false);
const error = ref(null);
const success = ref(null);
const router = useRouter();

const sendResetCode = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await axios.post('http://localhost:8000/api/auth/password/reset-code', {
      email: email.value
    });
    success.value = response.data.message;
    router.push({ name: 'validate-reset-code', query: { email: email.value } });
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al enviar el código';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="forgot-password">
    <h1>Recuperar Contraseña</h1>
    <form @submit.prevent="sendResetCode">
      <div class="form-group">
        <label for="email">Correo Electrónico</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          required
          placeholder="Ingresa tu correo electrónico"
        />
      </div>
      
      <button type="submit" :disabled="loading">
        {{ loading ? 'Enviando...' : 'Enviar Código' }}
      </button>
      
      <div v-if="error" class="error-message">{{ error }}</div>
      <div v-if="success" class="success-message">{{ success }}</div>
    </form>
  </div>
</template>