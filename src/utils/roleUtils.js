// Utilidades para manejo de roles
export const ROLE_IDS = {
  USER: 3,
  VIEW: 4,
  EDIT: 5,
  ADMIN: 6,
  SUPER_ADMIN: 7
}

export const ROLE_NAMES = {
  [ROLE_IDS.USER]: 'user',
  [ROLE_IDS.VIEW]: 'view',
  [ROLE_IDS.EDIT]: 'edit',
  [ROLE_IDS.ADMIN]: 'admin',
  [ROLE_IDS.SUPER_ADMIN]: 'superAdmin'
}

// Verificar si un usuario es administrador
export const isAdmin = (user) => {
  if (!user) return false
  
  // Verificar por role_id
  if (user.role_id >= ROLE_IDS.VIEW) return true
  
  // Verificar por role string
  const adminRoles = ['view', 'edit', 'admin', 'superAdmin']
  return adminRoles.includes(user.role)
}

// Obtener el dashboard correcto para un usuario
export const getDashboardRoute = (user) => {
  console.log('🧭 [roleUtils] - Getting route for user:', user)
  // Debe coincidir con estructura de rutas: /dashboard/* en Root y rutas hijas en Private
  const route = isAdmin(user) ? '/dashboard/admin' : '/dashboard/user'
  console.log('🧭 [roleUtils] - Determined route:', route)
  return route
}

// Verificar permisos específicos
export const hasPermission = (user, permission) => {
  if (!user) return false
  
  const permissions = {
    [ROLE_IDS.USER]: ['read'],
    [ROLE_IDS.VIEW]: ['read'],
    [ROLE_IDS.EDIT]: ['read', 'write'],
    [ROLE_IDS.ADMIN]: ['read', 'write', 'manage'],
    [ROLE_IDS.SUPER_ADMIN]: ['read', 'write', 'manage', 'admin']
  }
  
  const userPermissions = permissions[user.role_id] || permissions[ROLE_IDS.USER]
  return userPermissions.includes(permission)
}
