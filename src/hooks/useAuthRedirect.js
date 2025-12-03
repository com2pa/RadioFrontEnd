
import { useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth'
import { getDashboardRoute } from '../utils/roleUtils'

export const useAuthRedirect = () => {
  const { auth } = useAuth()
  const navigate = useNavigate()

  const redirectToDashboard = (userData = null) => {
    // Si se proporcionan datos del usuario directamente, usarlos
    // De lo contrario, usar el estado de auth del contexto
    const user = userData || auth
    
    if (user) {
      const dashboardRoute = getDashboardRoute(user)
      navigate(dashboardRoute, { replace: true })
    } else {
      // Si no hay datos, intentar leer del localStorage como fallback
      const userFromStorage = localStorage.getItem('user')
      if (userFromStorage) {
        try {
          const parsedUser = JSON.parse(userFromStorage)
          const dashboardRoute = getDashboardRoute(parsedUser)
          navigate(dashboardRoute, { replace: true })
        } catch (error) {
          // console.error('Error parsing user from localStorage:', error)
        }
      }
    }
  }

  return { redirectToDashboard }
}