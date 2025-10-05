import { useState } from 'react'
import { registerUser } from '../services/authService'
import { validateForm } from '../utils/validations'

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const register = async (formData) => {
    setIsLoading(true)
    setErrors({})

    try {
      // Validar formulario
      const validation = validateForm(formData)
      if (!validation.isValid) {
        setErrors(validation.errors)
        throw new Error('Formulario inválido')
      }

      // Enviar datos al backend
      const response = await registerUser(formData)
      return response

    } catch (error) {
      // Manejar errores del backend
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      }
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const clearErrors = () => {
    setErrors({})
  }

  return {
    register,
    isLoading,
    errors,
    clearErrors
  }
}
