// Sistema de manejo de rutas dinámicas basado en endpoints del backend

/**
 * Obtiene el componente dinámico basado en el path del backend
 * @param {string} path - Ruta del menú (ej: /home, /about, /contact)
 * @returns {Function} - Función que importa el componente dinámicamente
 */
export const getDynamicComponent = (path) => {
  // Mapeo de rutas conocidas a componentes específicos
  const knownRoutes = {
    '/': () => import('../page/public/Home'),
    '/home': () => import('../page/public/Home'),
    '/about': () => import('../page/public/About'),
    '/contact': () => import('../page/public/Contact'),
    '/register': () => import('../pages/public/Register'),
    '/login': () => import('../page/public/Login'),
    '/objective': () => import('../page/public/Objective'),
  }

  // Si existe un componente específico, usarlo
  if (knownRoutes[path]) {
    return knownRoutes[path]
  }

  // Para rutas dinámicas, crear componente basado en el path
  return () => createDynamicPage(path)
}

/**
 * Crea una página dinámica basada en el path
 * @param {string} path - Ruta del menú
 * @returns {React.Component} - Componente dinámico
 */
const createDynamicPage = (path) => {
  // Extraer nombre de la página del path
  const pageName = path.replace('/', '').replace('-', ' ')
  const capitalizedName = pageName.charAt(0).toUpperCase() + pageName.slice(1)

  return {
    default: () => {
      const React = require('react')
      const { Box, Container, Heading, Text, VStack, useColorModeValue } = require('@chakra-ui/react')
      
      return React.createElement(() => {
        const bgColor = useColorModeValue('gray.50', 'gray.900')
        const textColor = useColorModeValue('gray.600', 'gray.300')

        return React.createElement(Box, { minH: "100vh", bg: bgColor, py: 8 },
          React.createElement(Container, { maxW: "container.lg", px: 4 },
            React.createElement(VStack, { spacing: 8, align: "center" },
              React.createElement(VStack, { spacing: 4, textAlign: "center" },
                React.createElement(Heading, { as: "h1", size: "2xl", color: "blue.600" },
                  capitalizedName
                ),
                React.createElement(Text, { fontSize: "lg", color: textColor, maxW: "md" },
                  `Página ${capitalizedName} - Configurada dinámicamente desde el dashboard administrativo.`
                )
              )
            )
          )
        )
      })
    }
  }
}

/**
 * Genera rutas dinámicas basadas en los items del menú del backend
 * @param {Array} menuItems - Items del menú del backend
 * @returns {Array} - Array de rutas para React Router
 */
export const generateDynamicRoutes = (menuItems) => {
  const routes = []
  
  menuItems.forEach(item => {
    // Solo procesar items activos
    if (!item.is_active) return
    
    // Crear ruta dinámica
    const route = {
      path: item.path,
      element: getDynamicComponent(item.path),
      title: item.title,
      id: item.id,
      role_id: item.role_id,
      menu_type: item.menu_type,
      // Metadatos adicionales para el componente
      metadata: {
        title: item.title,
        description: `Página ${item.title}`,
        keywords: item.title.toLowerCase()
      }
    }
    
    routes.push(route)
    
    // Procesar children si existen
    if (item.children && item.children.length > 0) {
      const childRoutes = generateDynamicRoutes(item.children)
      routes.push(...childRoutes)
    }
  })
  
  return routes
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
