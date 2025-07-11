import { useAuthStore } from "../../../stores/auth"

export default function roleMiddleware({ to, next }) {
  const auth = useAuthStore()

  if (to.meta?.role && auth.user?.tipo !== to.meta.role) {
    return next({ name: 'login' })
  }

  return next()
}