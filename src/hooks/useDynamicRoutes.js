import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getMainMenu } from '../services/menuService'
import { generateRoutesFromMenu, filterRoutesByRole, generateNavigationStructure } from '../utils/routeGenerator'
import { useMenuCache } from '../utils/menuCache'
import { useAuth } from './useAuth'

export const useDynamicRoutes = () => {
  const [routes, setRoutes] = useState([])
  const [navigation, setNavigation] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { auth } = useAuth()
  const location = useLocation()
  const { get: getFromCache, set: setCache, clear: clearCache } = useMenuCache()

  // Rutas públicas que no necesitan cargar rutas dinámicas
  const publicRoutes = ['/', '/login', '/register']
  const isPublicRoute = publicRoutes.includes(location.pathname)

  useEffect(() => {
    // Si es una ruta pública, no cargar rutas dinámicas
    if (isPublicRoute) {
      setLoading(false)
      setRoutes([])
      setNavigation([])
      return
    }

    const loadRoutes = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Usar rol público por defecto si no hay autenticación
        const userRoleId = auth?.role_id || 3 // 3 = público por defecto
        
        // Intentar obtener del cache primero
        let menuItems = getFromCache(userRoleId, 'main')
        
        if (!menuItems) {
          try {
            // Si no está en cache, obtener del backend
            menuItems = await getMainMenu(userRoleId)
            setCache(userRoleId, 'main', menuItems)
          } catch (backendError) {
            console.warn('No se pudo conectar con el backend, usando rutas por defecto:', backendError.message)
            // Si falla la conexión con el backend, usar un array vacío
            menuItems = []
          }
        }
        
        // Generar rutas dinámicas
        const generatedRoutes = generateRoutesFromMenu(menuItems)
        
        // Filtrar por rol del usuario
        const filteredRoutes = filterRoutesByRole(generatedRoutes, userRoleId)
        
        // Generar estructura de navegación
        const navigationStructure = generateNavigationStructure(menuItems, userRoleId)
        
        setRoutes(filteredRoutes)
        setNavigation(navigationStructure)
        
      } catch (err) {
        console.error('Error al cargar rutas dinámicas:', err)
        // En caso de error, establecer rutas vacías para que la app funcione
        setRoutes([])
        setNavigation([])
        setError(null) // No mostrar error para que la app funcione sin backend
      } finally {
        setLoading(false)
      }
    }

    loadRoutes()
  }, [auth?.role_id, isPublicRoute])

  const refreshRoutes = async () => {
    setLoading(true)
    try {
      // Usar rol público por defecto si no hay autenticación
      const userRoleId = auth?.role_id || 3
      
      // Limpiar cache y obtener datos frescos
      clearCache(userRoleId, 'main')
      const menuItems = await getMainMenu(userRoleId)
      setCache(userRoleId, 'main', menuItems)
      
      const generatedRoutes = generateRoutesFromMenu(menuItems)
      const filteredRoutes = filterRoutesByRole(generatedRoutes, userRoleId)
      const navigationStructure = generateNavigationStructure(menuItems, userRoleId)
      
      setRoutes(filteredRoutes)
      setNavigation(navigationStructure)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    routes,
    navigation,
    loading,
    error,
    refreshRoutes
  }
}
