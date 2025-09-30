import axios from 'axios'

// Configuración base de axios (usando proxy de Vite)
const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Servicio para obtener el menú principal
export const getMainMenu = async () => {
  try {
    console.log('🔄 Intentando conectar con el backend...')
    const response = await api.get('/api/menu/main') 
    console.log('✅ Respuesta del backend:', response.data)
    
    // Adaptar la estructura del backend a nuestro formato
    if (response.data.success && response.data.data) {
      const menuData = response.data.data.map(item => ({
        id: item.id.toString(),
        label: item.title,
        href: item.path,
        order: item.order_index,
        active: item.is_active,
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
