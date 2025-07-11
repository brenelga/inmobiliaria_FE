import { createRouter, createWebHistory } from 'vue-router'
import { middlewarePipeline } from './middlearePipeline'
import auth from './middlewares/auth'
import role from './middlewares/role'

const routes = [
  { path: '/', name: 'login', component: () => import('@/views/LoginView.vue') },
  { path: '/panel_admin', name: 'panel', component: () => import('@/views/PanelAView.vue'), meta: { middleware: [auth, role], requiresAuth: true, role: 'admin' }},
  { path: '/panel_inq', name: 'usuario', component: () => import('@/views/PanelIView.vue'), meta: { middleware: [auth, role], requiresAuth: true, role: 'inquilino' }},
  { path: '/cambiarcontrasena', name: 'cambiar_contrasena', component: () => import('@/views/CambiarContrasenaView.vue'), meta: { middleware: [auth, role], requiresAuth: true, role: 'admin' }},
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  if (!to.meta || !to.meta.middleware) {
    return next()
  }

  const middlewares = to.meta.middleware
  const context = { to, from, next }

  return middlewares[0]({
    ...context,
    next: middlewarePipeline(context, middlewares, 1)
  })
})

export default router
