<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const email = ref(route.query.email || '');
const code = ref('');
const password = ref('');
const passwordConfirmation = ref('');
const loading = ref(false);
const error = ref(null);
const step = ref('validate'); 
onMounted(() => {
  if (!email.value) {
    router.push({ name: 'forgot-password' });
  }
});

const validateCode = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await axios.post('http://localhost:8000/api/auth/password/validate-code', {
      email: email.value,
      code: code.value
    });
    step.value = 'reset';
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al validar el código';
  } finally {
    loading.value = false;
  }
};

const resetPassword = async () => {
  try {
    loading.value = true;
    error.value = null;
    const response = await axios.post('/api/auth/password/reset', {
      email: email.value,
      code: code.value,
      password: password.value,
      password_confirmation: passwordConfirmation.value
    });
    router.push({ name: 'login', query: { passwordReset: 'success' } });
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al cambiar la contraseña';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="validate-reset-code">
    <h1>{{ step === 'validate' ? 'Validar Código' : 'Cambiar Contraseña' }}</h1>
    
    <form v-if="step === 'validate'" @submit.prevent="validateCode">
      <div class="form-group">
        <label for="email">Correo Electrónico</label>
        <input 
          type="email" 
          id="email" 
          v-model="email" 
          required
          disabled
        />
      </div>
      
      <div class="form-group">
        <label for="code">Código de Verificación</label>
        <input 
          type="text" 
          id="code" 
          v-model="code" 
          required
          placeholder="Ingresa el código de 6 dígitos"
          maxlength="6"
        />
      </div>
      
      <button type="submit" :disabled="loading">
        {{ loading ? 'Validando...' : 'Validar Código' }}
      </button>
    </form>
    
    <form v-else @submit.prevent="resetPassword">
      <div class="form-group">
        <label for="password">Nueva Contraseña</label>
        <input 
          type="password" 
          id="password" 
          v-model="password" 
          required
          placeholder="Ingresa tu nueva contraseña"
        />
      </div>
      
      <div class="form-group">
        <label for="passwordConfirmation">Confirmar Contraseña</label>
        <input 
          type="password" 
          id="passwordConfirmation" 
          v-model="passwordConfirmation" 
          required
          placeholder="Confirma tu nueva contraseña"
        />
      </div>
      
      <button type="submit" :disabled="loading">
        {{ loading ? 'Actualizando...' : 'Actualizar Contraseña' }}
      </button>
    </form>
    
    <div v-if="error" class="error-message">{{ error }}</div>
  </div>
</template>