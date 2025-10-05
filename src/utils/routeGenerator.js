// Generador de rutas dinámicas basado en el menú del backend

/**
 * Genera rutas dinámicas basadas en los items del menú
 * @param {Array} menuItems - Items del menú del backend
 * @returns {Array} - Array de rutas para React Router
 */
export const generateRoutesFromMenu = (menuItems) => {
  const routes = []
  
  menuItems.forEach(item => {
    // Solo procesar items activos
    if (!item.is_active) return
    
    // Crear ruta principal
    const route = {
      path: item.path,
      element: getComponentForPath(item.path),
      title: item.title,
      id: item.id,
      role_id: item.role_id,
      menu_type: item.menu_type,
      // Metadatos para el componente dinámico
      metadata: {
        title: item.title,
        description: `Página ${item.title}`,
        keywords: item.title.toLowerCase()
      }
    }
    
    routes.push(route)
    
    // Procesar children si existen
    if (item.children && item.children.length > 0) {
      const childRoutes = generateRoutesFromMenu(item.children)
      routes.push(...childRoutes)
    }
  })
  
  return routes
}

/**
 * Obtiene el componente correspondiente para una ruta
 * @param {string} path - Ruta del menú
 * @returns {React.Component} - Componente a renderizar
 */
const getComponentForPath = (path) => {
  // Mapeo de rutas conocidas a componentes específicos
  const routeComponents = {
    '/': () => import('../page/public/Home'),
    '/home': () => import('../page/public/Home'),
    // '/about': () => import('../page/public/About'),
    // '/contact': () => import('../page/public/Contact'),
    // '/register': () => import('../pages/public/Register'),
    // '/login': () => import('../page/public/Login'),
    // '/objective': () => import('../page/public/Objective'),
    // Agregar más rutas según sea necesario
  }
  
  // Si existe un componente específico, usarlo
  if (routeComponents[path]) {
    return routeComponents[path]
  }
  
  // Para rutas dinámicas, usar el componente dinámico
  return () => import('../components/dynamic/DynamicPage')
}

/**
 * Filtra rutas por rol de usuario
 * @param {Array} routes - Rutas generadas
 * @param {number} userRoleId - ID del rol del usuario
 * @returns {Array} - Rutas filtradas por rol
 */
export const filterRoutesByRole = (routes, userRoleId) => {
  return routes.filter(route => {
    // Si no tiene role_id específico, es público
    if (!route.role_id) return true
    
    // Si tiene role_id, verificar si el usuario tiene acceso
    return route.role_id === userRoleId || route.role_id === 3 // 3 = público
  })
}

/**
 * Genera estructura de navegación para el menú
 * @param {Array} menuItems - Items del menú
 * @param {number} userRoleId - ID del rol del usuario
 * @returns {Array} - Estructura de navegación
 */
export const generateNavigationStructure = (menuItems, userRoleId = 3) => {
  return menuItems
    .filter(item => item.is_active)
    .filter(item => !item.role_id || item.role_id === userRoleId || item.role_id === 3)
    .map(item => ({
      id: item.id,
      label: item.title,
      href: item.path,
      order: item.order_index,
      active: item.is_active,
      children: item.children && item.children.length > 0 
        ? generateNavigationStructure(item.children, userRoleId)
        : []
    }))
    .sort((a, b) => a.order - b.order)
}
