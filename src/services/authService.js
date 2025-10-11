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
    // Mapear campos del frontend a los que espera el backend
    const payload = {
      user_name: userData?.name ?? '',
      user_lastname: userData?.lastname ?? '',
      user_email: userData?.email ?? '',
      user_password: userData?.password ?? '',
      user_address: userData?.address ?? '',
      user_phone: userData?.phone ?? '',
      user_age: userData?.age ?? ''
    }

    console.log('🔄 Enviando datos de registro...', payload)
    const response = await api.post('/api/register', payload)
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

// Servicio para verificación de email
export const verifyEmail = async (userId, token) => {
  try {
    console.log('🔄 Verificando email...', { userId, token })
    const response = await api.patch(`/api/register/${userId}/${token}`)
    console.log('✅ Email verificado exitosamente:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ Error al verificar email:', error)
    
    throw error
  }
}

// Servicio para logout de usuario
export const logoutUser = async () => {
  // Si tu backend requiere invalidar token/cerrar sesión en servidor,
  // ajusta el endpoint y método según tu API.
  try {
    const response = await api.post('/api/logout')
    return response.data
  } catch (error) {
    console.error('❌ Error al cerrar sesión:', error)
    // Si falla el endpoint, devolvemos un objeto estándar para permitir logout local
    return { success: false, message: 'logout local' }
  }
}
