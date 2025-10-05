import axios from 'axios'

// Configuración base de axios (usando proxy de Vite)
const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Servicio para obtener contenido de páginas dinámicas
export const getPageContent = async (path) => {
  try {
    console.log('🔄 Obteniendo contenido para ruta:', path)
    const response = await api.get(`/api/pages/content`, {
      params: { path }
    })
    console.log('✅ Contenido obtenido:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Error al obtener contenido:', error)
    // Retornar contenido por defecto si no existe
    return {
      success: false,
      content: null,
      defaultContent: true
    }
  }
}

// Servicio para obtener metadatos de página
export const getPageMetadata = async (path) => {
  try {
    const response = await api.get(`/api/pages/metadata`, {
      params: { path }
    })
    return response.data
  } catch (error) {
    console.error('Error al obtener metadatos:', error)
    return {
      success: false,
      metadata: {
        title: path.charAt(1).toUpperCase() + path.slice(2),
        description: `Página ${path}`,
        keywords: path.replace('/', '')
      }
    }
  }
}

// Servicio para obtener todas las páginas
export const getAllPages = async () => {
  try {
    const response = await api.get('/api/pages/all')
    return response.data
  } catch (error) {
    console.error('Error al obtener páginas:', error)
    return { success: false, pages: [] }
  }
}

export default api
