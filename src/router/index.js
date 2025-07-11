import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../../stores/auth";

const routes = [
  {path: '/', name: 'login', component: () => import('@/views/LoginView.vue')},
  {path: '/recuperar', name: 'recuperar_cont', component: () => import('@/views/RecuperarContrasena.vue')},
  {path: '/validarc', name: 'validar_codigo', component: () => import('@/views/ValidarCodigo.vue')},
  {path: '/panel_admin', name: 'panel', component: () => import('@/views/PanelAView.vue'), meta: {requiresAuth: true, role: 'admin'}},
  {path: '/panel_inq', name: 'usuario', component: () => import('@/views/PanelIView.vue'), meta: {requiresAuth: true, role: 'inquilino'}},
  {path: '/cambiarcontrasena', name: 'cambiar_contrasena', component: () => import('@/views/CambiarContrasenaView.vue'), meta: {requiresAuth: true, role: 'admin'}}
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth && !auth.token) {
    return next({ name: 'login' })
  }

  if (to.meta.role && auth.user?.tipo !== to.meta.role) {
    return next({ name: 'login' })
  }

  next()
})

export default router