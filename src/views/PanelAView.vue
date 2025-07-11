<template>
    <div class="layout">
        <header class="encabezado">
            <h1>Panel de Control</h1>

    <button
  @click="logout"
  class="ml-4 px-4 py-2 rounded-full font-bold bg-gray-200 text-black hover:bg-gray-300 transition"
>
  🚪 Cerrar sesión
</button>

        </header>
        <div class="contenido">
            <aside class="sidebar">
                <ul>
                    <li><a href="#">Inicio</a></li>
                    <li><a href="#">Multas</a></li>
                    <li><a href="#">Mensajes</a></li>
                    <li><a href="/cambiarcontrasena">Cambiar Contraseña</a></li>
                </ul>
            </aside>
            <main class="main">
                <button @click="mostrarFormulario = !mostrarFormulario" class="btn">
                    {{ mostrarFormulario ? 'Ocultar' : 'Mostrar' }} formulario
                </button>
                <Transition name="fade">
                    <div v-if="mostrarNotificacion" :class="['notificacion', tipoNotificacion === 'success' ? 'notificacion-exito' : 'notificacion-error']">
                        {{ mensajeNotificacion }}
                    </div>
                </Transition>
                <Transition name="fade">
                    <form v-if="mostrarFormulario" class="formulario" @submit.prevent="enviarMulta">
                        <label>Id del Departamento: </label>
                        <input type="text" v-model="departamentoId">
                        <label>Monto: </label>
                        <input type="number" v-model="monto">
                        <label>Mensaje: </label>
                        <input type="text" v-model="mensaje">
                        <button type="submit" class="btn" :disabled="isLoading">

                            <Transition name="fade" mode="out-in">
                                <span v-if="!isLoading">Enviar</span>
                                <span v-else class="flex items-center justify-center">
                                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Enviando...
                                </span>
                            </Transition>
                        </button>
                    </form>
                </Transition>
                <Transition name="modal">
                    <div v-if="showResultModal" class="modal-overlay">
                        <div class="modal-content" :class="modalType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                            <div class="modal-header">
                                <h3>{{ modalType === 'success' ? 'Éxito' : 'Error' }}</h3>
                                <button @click="closeModal" class="modal-close">&times;</button>
                            </div>
                            <div class="modal-body">
                                <p>{{ modalMessage }}</p>
                            </div>
                            <div class="modal-footer">
                                <button @click="closeModal" class="modal-button">Aceptar</button>
                            </div>
                        </div>
                    </div>
                </Transition>
            </main>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import axios from 'axios';
    import { useRouter } from 'vue-router';
    import { defineStore } from 'pinia';
    import { useAuthStore } from '../../stores/auth'

    const router = useRouter();
    const mostrarFormulario = ref(false);
    const departamentoId = ref('');
    const monto = ref('');
    const mensaje = ref('');
    const mensajeNotificacion = ref('');
    const tipoNotificacion = ref('');
    const mostrarNotificacion = ref('');
    const isLoading = ref(false);
    const showResultModal = ref(false);
    const modalMessage = ref('');
    const modalType = ref('');
    const auth = useAuthStore();

    const enviarMulta = async() => {
        isLoading.value = true;
        try {
            const response = await axios.post('http://localhost:8000/api/multas', {
                departamento_id: departamentoId.value,
                monto: monto.value,
                mensaje: mensaje.value
            });

            modalMessage.value = 'Multa enviada correctamente';
            modalType.value = 'success';
            showResultModal.value = true;
            
            mensajeNotificacion.value = 'Multa enviada correctamente';
            tipoNotificacion.value = 'success';
            mostrarNotificacion.value = true;

            departamentoId.value = '';
            monto.value = '';
            mensaje.value = '';
        } catch (error) {
            console.error(error);
            mensajeNotificacion = 'Error al enviar la multa';
            tipoNotificacion.value = 'error';
            mostrarNotificacion.value = true;
            modalMessage.value = 'Error al enviar la multa';
            modalType.value = 'error';
            showResultModal.value = true;
        } finally {
            isLoading.value = false;
        }
    };

    
    function closeModal() {
        showResultModal.value = false;
    }

function logout() {
  auth.logout();
  router.push({ name: 'login' });
}

</script>

<style scoped>
    .layout {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    .encabezado {
        background-color: #3b82f6;
        color: white;
        padding: 1rem;
    }
    .contenido {
        display: flex;
        flex: 1;
    }
    .sidebar {
        width: 200px;
        background-color: #e5e7eb;
        padding: 1rem;
    }
    .sidebar ul {
        list-style: none;
        padding: 0;
    }
    .sidebar li {
        margin-bottom: 1rem;
    }
    .main {
        flex: 1;
        padding: 2rem;
    }
    .btn {
        padding: 0.5rem 1rem;
        background-color: #2563eb;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-bottom: 1rem;
    }
    .formulario {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity 0.5s ease;
    }
    .fade-enter-from, .fade-leave-to {
        opacity: 0;
    }
    .notificacion {
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        font-weight: bold;
        text-align: center;
        max-width: 400px;
    }

    .notificacion-exito{
        background-color: #d1fae5;
        color: #065f46;
    }

    .notificacion-error{
        background-color: #fee2e2;
        color: #991b1b;
    }

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        width: 90%;
        max-width: 400px;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        font-weight: bold;
        font-size: 1.2rem;
    }

    .modal-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
    }

    .modal-footer {
        margin-top: 1rem;
        text-align: right;
    }

    .modal-button {
        padding: 0.5rem 1rem;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        background-color: #2563eb;
        color: white;
    }

    .modal-enter-active, .modal-leave-active {
        transition: opacity 0.3s ease;
    }

    .modal-enter-from, .modal-leave-to {
        opacity: 0;
    }

    .modal-enter-active .modal-content,
    .modal-leave-active .modal-content {
        transition: transform 0.3s ease, opacity 0.3s ease;
    }

    .modal-enter-from .modal-content,
    .modal-leave-to .modal-content {
        transform: translateY(-20px);
        opacity: 0;
    }
</style>