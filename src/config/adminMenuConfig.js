/**
 * Configuración del menú del dashboard administrativo
 * Centraliza todos los elementos del menú para facilitar el mantenimiento
 */

export const adminMenuItems = [
  {
    id: 'podcast-category',
    label: 'Crear categoría Podcasts',
    href: '/dashboard/admin/podcast-category',
    icon: 'FiRadio',
    description: 'Gestionar categorías de podcasts'
  },
  {
    id: 'podcast-subcategory',
    label: 'Crear subcategoría de Podcasts',
    href: '/dashboard/admin/podcast-subcategory',
    icon: 'FiRadio',
    description: 'Gestionar subcategorías de podcasts'
  },
  {
    id: 'podcast-upload',
    label: 'Subir Podcasts',
    href: '/dashboard/admin/podcast-upload',
    icon: 'FiRadio',
    description: 'Crear y gestionar podcasts con videos'
  },
  {
    id: 'news-category',
    label: 'Crear categoría de noticias',
    href: '/dashboard/admin/news-category',
    icon: 'FiRadio',
    description: 'Gestionar categorías de noticias'
  },
  {
    id: 'news-subcategory',
    label: 'Crear subcategoría de noticias',
    href: '/dashboard/admin/news-subcategory',
    icon: 'FiRadio',
    description: 'Gestionar subcategorías de noticias'
  },
  {
    id: 'news-create',
    label: 'Crear Noticia',
    href: '/dashboard/admin/news-create',
    icon: 'FiEdit3',
    description: 'Crear y publicar noticias'
  },
  {
    id: 'news-management',
    label: 'Gestionar Noticias',
    href: '/dashboard/admin/news-management',
    icon: 'FiList',
    description: 'Administrar noticias existentes'
  },
  {
    id: 'programs',
    label: 'Crear Programa',
    href: '/dashboard/admin/programs',
    icon: 'FiRadio',
    description: 'Crear y programar programas de radio'
  },
  {
    id: 'menu-management',
    label: 'Crear Menú',
    href: '/dashboard/admin/menu-management',
    icon: 'FiMenu',
    description: 'Gestionar menús del sistema'
  },
  {
    id: 'subscribers',
    label: 'Gestionar Suscriptores',
    href: '/dashboard/admin/subscribers',
    icon: 'FiUsers',
    description: 'Administrar usuarios suscritos'
  },
  {
    id: 'user-roles',
    label: 'Gestionar Roles',
    href: '/dashboard/admin/user-roles',
    icon: 'FiShield',
    description: 'Administrar roles y permisos'
  },
  {
    id: 'contact-notifications',
    label: 'Mensajes de Contacto',
    href: '/dashboard/admin/contact-notifications',
    icon: 'FiMail',
    description: 'Gestionar mensajes del formulario de contacto'
  },
  {
    id: 'auditoria',
    label: 'Auditoría',
    href: '/dashboard/admin/auditoria',
    icon: 'FiFileText',
    description: 'Ver logs de auditoría del sistema'
  },
  {
    id:'perfil',
    label:'Mi Perfil',
    href:'/dashboard/admin/profile',
    icon:'FiUser',
    description:'Gestionar perfil y actualizar datos personales'
  }
]

/**
 * Función para obtener elementos del menú filtrados por permisos
 * @param {Array} userPermissions - Permisos del usuario actual
 * @returns {Array} Elementos del menú filtrados
 */
export const getFilteredMenuItems = (userPermissions = []) => {
  // Por ahora retorna todos los elementos, pero se puede extender para filtrar por permisos
  // userPermissions se puede usar en el futuro para filtrar elementos según permisos
  // console.log('User permissions:', userPermissions) // Evitar warning de variable no usada
  return adminMenuItems
}

/**
 * Función para añadir nuevos elementos al menú dinámicamente
 * @param {Object} newItem - Nuevo elemento del menú
 */
export const addMenuItem = (newItem) => {
  adminMenuItems.push({
    id: newItem.id || `item-${Date.now()}`,
    label: newItem.label,
    href: newItem.href,
    icon: newItem.icon || 'FiSettings',
    description: newItem.description || '',
    ...newItem
  })
}

/**
 * Función para actualizar un elemento del menú
 * @param {string} itemId - ID del elemento a actualizar
 * @param {Object} updates - Actualizaciones a aplicar
 */
export const updateMenuItem = (itemId, updates) => {
  const index = adminMenuItems.findIndex(item => item.id === itemId)
  if (index !== -1) {
    adminMenuItems[index] = { ...adminMenuItems[index], ...updates }
  }
}

/**
 * Función para eliminar un elemento del menú
 * @param {string} itemId - ID del elemento a eliminar
 */
export const removeMenuItem = (itemId) => {
  const index = adminMenuItems.findIndex(item => item.id === itemId)
  if (index !== -1) {
    adminMenuItems.splice(index, 1)
  }
}
