<template>
  <div class="flex min-h-screen">
    <aside class="w-64 bg-slate-800 text-white p-6 flex flex-col justify-between">
      <div>
        <h2 class="text-lg font-bold text-center">Condominio Vista Alegre</h2>
        <div class="mt-6 flex flex-col items-center">
          <div class="w-20 h-20 rounded-full border-2 border-blue-500 mb-2"></div>
          <p class="text-sm">Bienvenido, <span class="font-semibold">Juan Pérez</span></p>
          <p class="text-xs text-gray-300">Dueño · Propiedad A101</p>
        </div>

        <nav class="mt-6 space-y-2 text-sm">
          <router-link to="/panel" class="block py-2 px-4 rounded hover:bg-slate-700 bg-blue-600">Inicio</router-link>
          <router-link to="/multas" class="block py-2 px-4 rounded hover:bg-slate-700">Multas</router-link>
          <router-link to="/pagos" class="block py-2 px-4 rounded hover:bg-slate-700">Pagos</router-link>
          <router-link to="/notificaciones" class="block py-2 px-4 rounded hover:bg-slate-700">Notificaciones</router-link>
          <router-link to="/configuracion" class="block py-2 px-4 rounded hover:bg-slate-700">Configuración</router-link>
          <router-link to="/logout" class="block py-2 px-4 rounded hover:bg-red-600 text-red-300">Cerrar Sesión</router-link>
        </nav>
      </div>
    </aside>

    <main class="flex-1 p-8 bg-gray-100 overflow-auto">
      <h1 class="text-2xl font-bold mb-6">Panel de Control</h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card title="Multas Pendientes" count="2" button="Ver detalles" />
        <Card title="Pagos Pendientes" count="1" button="Ver detalles" />
        <Card title="Notificaciones" count="3" button="Ver todas" />
      </div>

      <div class="bg-white rounded shadow p-4">
        <h2 class="text-lg font-semibold mb-4">Actividad Reciente</h2>
        
      </div>
    </main>
  </div>
</template>

<script setup>
import Card from '@/components/Card.vue'
</script>
