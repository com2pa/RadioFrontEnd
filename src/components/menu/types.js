// Tipos e interfaces para el menú
// Estructura esperada del backend para /api/menu/main

/**
 * Estructura de un item del menú
 * @typedef {Object} MenuItem
 * @property {string} id - ID único del item
 * @property {string} label - Texto a mostrar
 * @property {string} [href] - URL de destino
 * @property {string} [icon] - Icono del item
 * @property {number} [order] - Orden de aparición
 * @property {boolean} [active] - Si está activo
 * @property {MenuItem[]} [children] - Subitems del menú
 * @property {string} [subLabel] - Descripción adicional
 */

// Función para ordenar items del menú
export const sortMenuItems = (items) => {
  return items.sort((a, b) => (a.order || 0) - (b.order || 0))
}

// Función para filtrar items activos
export const filterActiveItems = (items) => {
  return items.filter(item => item.active !== false)
}
