import { useAuthStore } from "../../../stores/auth"

export default function authMiddleware({ to, next }) {
  const auth = useAuthStore()

  if (to.meta?.requiresAuth && !auth.token) {
    return next({ name: 'login' })
  }

  return next()
}
