import axios from 'axios'

// Configuración base de axios (usando proxy de Vite)
const api = axios.create({
  timeout: 30000, // Aumentado a 30 segundos para operaciones que pueden tardar más
  headers: {
    'Content-Type': 'application/json',
  },
})

// Servicio para registro de usuario
export const registerUser = async (userData) => {
  try {
    // Validar que todos los campos requeridos estén presentes y no vacíos
    const requiredFields = ['name', 'lastname', 'email', 'password', 'address', 'phone', 'age']
    const missingFields = requiredFields.filter(field => {
      const value = userData?.[field]
      return !value || (typeof value === 'string' && value.trim() === '')
    })

    if (missingFields.length > 0) {
      throw new Error(`Los siguientes campos son obligatorios: ${missingFields.join(', ')}`)
    }

    // Mapear campos del frontend a los que espera el backend
    const payload = {
      user_name: (userData?.name || '').trim(),
      user_lastname: (userData?.lastname || '').trim(),
      user_email: (userData?.email || '').trim(),
      user_password: userData?.password || '',
      user_address: (userData?.address || '').trim(),
      user_phone: (userData?.phone || '').trim(),
      user_age: userData?.age ? String(userData.age).trim() : ''
    }

    // Validar que ningún campo esté vacío después del trim
    const emptyFields = Object.entries(payload)
      .filter(([key, value]) => !value || value === '')
      .map(([key]) => key.replace('user_', ''))

    if (emptyFields.length > 0) {
      throw new Error(`Los siguientes campos no pueden estar vacíos: ${emptyFields.join(', ')}`)
    }

    // console.log('🔄 Enviando datos de registro...', { ...payload, user_password: '***' })
    
    // Usar timeout más largo para el registro (puede tardar más por validaciones y envío de email)
    const response = await api.post('/api/register', payload, {
      timeout: 30000 // 30 segundos específicamente para registro
    })
    
    // console.log('✅ Usuario registrado exitosamente:', response.data)
    return response.data
  } catch (error) {
    // console.error('❌ Error al registrar usuario:', error)
    
    // Extraer mensaje de error más descriptivo
    let errorMessage = 'Error al registrar usuario'
    
    // Manejar timeout específicamente
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      errorMessage = 'El registro está tardando más de lo esperado. El usuario puede haberse creado correctamente. Por favor intenta iniciar sesión o verifica tu correo electrónico.'
    } else if (error.message && !error.response) {
      // Error de validación del frontend
      errorMessage = error.message
    } else if (error.response?.data?.message) {
      // Mensaje del backend
      errorMessage = error.response.data.message
    } else if (error.response?.status === 400) {
      errorMessage = 'Datos inválidos. Por favor verifica que todos los campos estén completos.'
    } else if (error.response?.status === 409) {
      errorMessage = 'El correo electrónico ya está registrado'
    } else if (error.response?.status === 500) {
      errorMessage = 'Error del servidor. Por favor intenta más tarde.'
    } else if (error.message) {
      errorMessage = error.message
    }
    
    // console.error('📊 Detalles del error:', {
    //   message: errorMessage,
    //   status: error.response?.status,
    //   statusText: error.response?.statusText,
    //   data: error.response?.data,
    //   originalError: error.message
    // })
    
    // Crear un error con mensaje más descriptivo
    const enhancedError = new Error(errorMessage)
    enhancedError.response = error.response
    enhancedError.status = error.response?.status
    throw enhancedError
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
    // console.log('❌ Error al cerrar sesión:', error)
    // Si falla el endpoint, devolvemos un objeto estándar para permitir logout local
    return { success: false, message: 'logout local' }
  }
}
