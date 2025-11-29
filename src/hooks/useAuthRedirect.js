
import { useNavigate } from 'react-router-dom'
import { useAuth } from './useAuth'
import { getDashboardRoute } from '../utils/roleUtils'

export const useAuthRedirect = () => {
  const { auth } = useAuth()
  const navigate = useNavigate()

  const redirectToDashboard = () => {
    // console.log('🔄 [useAuthRedirect] - Starting redirect...')
    // console.log('🔄 [useAuthRedirect] - Current auth state:', auth)
    
    if (auth) {
      // console.log('🔄 [useAuthRedirect] - Auth exists, getting dashboard route...')
      const dashboardRoute = getDashboardRoute(auth)
      // console.log('🎯 [useAuthRedirect] - Redirecting to:', dashboardRoute)
      // console.log('🎯 [useAuthRedirect] - User role:', auth.role)
      // console.log('🎯 [useAuthRedirect] - User role_id:', auth.role_id)
      
      navigate(dashboardRoute, { replace: true })
    } else {
      // console.log('❌ [useAuthRedirect] - No auth data available for redirect')
      // console.log('❌ [useAuthRedirect] - localStorage token:', localStorage.getItem('authToken'))
      // console.log('❌ [useAuthRedirect] - localStorage user:', localStorage.getItem('user'))
    }
  }

  return { redirectToDashboard }
}