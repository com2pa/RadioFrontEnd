import axios from 'axios'

// Configuración base de axios (usando proxy de Vite)
const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Servicio para obtener el menú principal
export const getMainMenu = async (userRoleId = 3) => {
  try {
    console.log('🔄 Obteniendo menú para rol:', userRoleId)
    const response = await api.get('/api/menu/main', {
      params: { role_id: userRoleId }
    }) 
    console.log('✅ Respuesta del backend:', response.data)
    
    // Adaptar la estructura del backend a nuestro formato
    if (response.data.success && response.data.data) {
      const menuData = response.data.data.map(item => ({
        id: item.id,
        title: item.title,
        path: item.path,
        order_index: item.order_index,
        is_active: item.is_active,
        role_id: item.role_id,
        menu_type: item.menu_type,
        level: item.level,
        parent_id: item.parent_id,
        children: item.children || []
      }))
      
      console.log('🔄 Datos adaptados:', menuData)
      return menuData
    }
    
    return []
  } catch (error) {
    console.error('❌ Error al obtener el menú:', error)
    console.error('📊 Detalles del error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      baseURL: error.config?.baseURL
    })
    throw error
  }
}

// Servicio para obtener menú por tipo
export const getMenuByType = async (menuType = 'main', userRoleId = 3) => {
  try {
    const response = await api.get(`/api/menu/${menuType}`, {
      params: { role_id: userRoleId }
    })
    
    if (response.data.success && response.data.data) {
      return response.data.data
    }
    
    return []
  } catch (error) {
    console.error(`Error al obtener menú ${menuType}:`, error)
    throw error
  }
}

// Servicio para refrescar menú (útil cuando se actualiza desde dashboard)
export const refreshMenu = async (userRoleId = 3) => {
  try {
    // Limpiar cache si existe
    const response = await api.get('/api/menu/refresh', {
      params: { role_id: userRoleId }
    })
    
    return response.data
  } catch (error) {
    console.error('Error al refrescar menú:', error)
    throw error
  }
}

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Manejar autenticación expirada
      console.log('Sesión expirada')
    }
    return Promise.reject(error)
  }
)

export default api
