import axios from 'axios'

// Configuración base de axios (usando proxy de Vite)
const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Servicio para registro de usuario
export const registerUser = async (userData) => {
  try {
    console.log('🔄 Enviando datos de registro...', userData)
    const response = await api.post('/api/register', userData)
    console.log('✅ Usuario registrado exitosamente:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Error al registrar usuario:', error)
    console.error('📊 Detalles del error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    })
    throw error
  }
}

// Servicio para login de usuario
export const loginUser = async (credentials) => {
  // Mapear campos del frontend a los que espera el backend
  const payload = {
    user_email: credentials?.email ?? '',
    user_password: credentials?.password ?? ''
  }

  const response = await api.post('/api/login', payload)
  return response.data
}

export default api

// Servicio para logout de usuario
export const logoutUser = async () => {
  // Si tu backend requiere invalidar token/cerrar sesión en servidor,
  // ajusta el endpoint y método según tu API.
  try {
    const response = await api.post('/api/logout')
    return response.data
  } catch (error) {
    // Si falla el endpoint, devolvemos un objeto estándar para permitir logout local
    return { success: false, message: 'logout local' }
  }
}
