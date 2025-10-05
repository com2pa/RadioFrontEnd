// Sistema de cache para el menú dinámico

class MenuCache {
  constructor() {
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutos
  }

  // Generar clave de cache
  generateKey(roleId, menuType = 'main') {
    return `${menuType}_${roleId}`
  }

  // Obtener datos del cache
  get(roleId, menuType = 'main') {
    const key = this.generateKey(roleId, menuType)
    const cached = this.cache.get(key)
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      console.log('📦 Datos obtenidos del cache:', key)
      return cached.data
    }
    
    // Cache expirado, limpiar
    if (cached) {
      this.cache.delete(key)
    }
    
    return null
  }

  // Guardar datos en cache
  set(roleId, menuType, data) {
    const key = this.generateKey(roleId, menuType)
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
    console.log('💾 Datos guardados en cache:', key)
  }

  // Limpiar cache específico
  clear(roleId, menuType = 'main') {
    const key = this.generateKey(roleId, menuType)
    this.cache.delete(key)
    console.log('🗑️ Cache limpiado:', key)
  }

  // Limpiar todo el cache
  clearAll() {
    this.cache.clear()
    console.log('🗑️ Todo el cache limpiado')
  }

  // Obtener estadísticas del cache
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      entries: Array.from(this.cache.entries()).map(([key, value]) => ({
        key,
        age: Date.now() - value.timestamp,
        expired: Date.now() - value.timestamp > this.cacheTimeout
      }))
    }
  }
}

// Instancia singleton del cache
export const menuCache = new MenuCache()

// Hook para usar el cache
export const useMenuCache = () => {
  return {
    get: (roleId, menuType) => menuCache.get(roleId, menuType),
    set: (roleId, menuType, data) => menuCache.set(roleId, menuType, data),
    clear: (roleId, menuType) => menuCache.clear(roleId, menuType),
    clearAll: () => menuCache.clearAll(),
    getStats: () => menuCache.getStats()
  }
}
