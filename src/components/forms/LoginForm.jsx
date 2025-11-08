import React, { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  VStack,
  useToast,
  Spinner,
  Text,
  InputGroup,
  InputRightElement,
  IconButton,
  Checkbox,
  Link
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { validateField } from '../../utils/validations'
import { loginUser } from '../../services/authService'
import { useAuth } from '../../hooks/useAuth'

const LoginForm = ({ onSuccess, onError }) => {
  // Colores oficiales de OXÍGENO 88.1FM
  const brandRed = '#E50000'
  const brandDarkGray = '#333333'
  const brandWhite = '#FFFFFF'
  const brandLightGray = '#CCCCCC'
  const brandOrange = '#FFA500'

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const toast = useToast()
  const { setAuth } = useAuth()

  // Manejar cambios en los campos
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Validar en tiempo real
    const validation = validateField(field, value)
    setErrors(prev => ({
      ...prev,
      [field]: validation.isValid ? '' : validation.message
    }))
  }

  // Manejar envío del formulario
// En LoginForm.jsx - modifica el handleSubmit
const handleSubmit = async (e) => {
  e.preventDefault()
  setIsLoading(true)

  console.log('🔐 [1] LoginForm - Starting login process...')
  console.log('🔐 [2] LoginForm - Form data:', formData)

  try {
    // Validar que los campos no estén vacíos
    if (!formData.email || !formData.password) {
      console.log('❌ [3] LoginForm - Empty fields detected')
      toast({
        title: 'Datos incompletos',
        description: 'Por favor completa todos los campos',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    console.log('📤 [4] LoginForm - Calling loginUser API...')
    
    // Enviar datos al backend
    const response = await loginUser(formData)
    
    console.log('✅ [5] LoginForm - API Response received:', response)
    
    // Verificar estructura de la respuesta
    if (response.success && response.user && response.accesstoken) {
      console.log('🎯 [6] LoginForm - Login successful!')
      console.log('🎯 [7] LoginForm - User data:', response.user)
      console.log('🎯 [8] LoginForm - Access token:', response.accesstoken ? 'PRESENT' : 'MISSING')
      
      // Mapear los datos CORRECTAMENTE según lo que devuelve tu backend
      const authData = {
        token: response.accesstoken,
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role_id: response.user.role, // Esto viene como número del backend
        role: getRoleName(response.user.role), // Convertir a string
        online: response.user.online
      }
      
      console.log('🔐 [9] LoginForm - Auth data to set:', authData)
      
      // ACTUALIZAR EL ESTADO DE AUTENTICACIÓN
      setAuth(authData);
      
      // Limpiar el formulario después del login exitoso
      setFormData({
        email: '',
        password: ''
      })
      setErrors({})
      
      console.log('🔐 [10] LoginForm - Auth state updated, checking localStorage...')
      console.log('🔐 [11] LoginForm - localStorage token:', localStorage.getItem('authToken'))
      console.log('🔐 [12] LoginForm - localStorage user:', localStorage.getItem('user'))
      
      toast({
        title: 'Inicio de sesión exitoso',
        description: `Bienvenido ${response.user.name}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      console.log('🔄 [13] LoginForm - Calling onSuccess callback...')
      if (onSuccess) onSuccess(response)
      
    } else {
      console.error('❌ [6] LoginForm - Login failed - Response structure:', {
        success: response.success,
        hasUser: !!response.user,
        hasToken: !!response.accesstoken,
        message: response.message
      })
      throw new Error(response.message || 'Error en el login')
    }
    
  } catch (error) {
    console.error('❌ [ERROR] LoginForm - Catch block:', error)
    console.error('❌ [ERROR] LoginForm - Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })
    
    const errorMessage = error.response?.data?.message || error.message || 'Error al iniciar sesión'
    
    toast({
      title: 'Error de inicio de sesión',
      description: errorMessage,
      status: 'error',
      duration: 5000,
      isClosable: true,
    })

    if (onError) onError(error)
  } finally {
    console.log('🏁 [FINALLY] LoginForm - Process completed')
    setIsLoading(false)
  }
}

// Función auxiliar para convertir role_id a nombre de rol
const getRoleName = (roleId) => {
  console.log('🎭 Converting role ID:', roleId)
  const roleMap = {
    7: 'superAdmin',
    6: 'admin', 
    5: 'edit',
    4: 'view',
    3: 'user'
  }
  const roleName = roleMap[roleId] || 'user'
  console.log('🎭 Role conversion:', roleId, '→', roleName)
  return roleName
}

  // Renderizar campo de formulario
  const renderField = (field, label, type = 'text', placeholder = '', isPassword = false) => {
    const hasError = errors[field] && errors[field] !== ''
    const isValid = formData[field] && !hasError

    return (
      <FormControl isInvalid={hasError} isRequired>
        <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
          {label}
        </FormLabel>
        {isPassword ? (
          <InputGroup>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={formData[field]}
              onChange={(e) => handleChange(field, e.target.value)}
              placeholder={placeholder}
              borderColor={isValid ? 'green.400' : hasError ? brandRed : brandLightGray}
              _hover={{ borderColor: isValid ? 'green.500' : hasError ? brandRed : brandOrange }}
              _focus={{
                borderColor: isValid ? 'green.500' : hasError ? brandRed : brandRed,
                boxShadow: isValid ? '0 0 0 1px #48BB78' : hasError ? `0 0 0 1px ${brandRed}` : `0 0 0 1px ${brandRed}`
              }}
              bg="white"
              size="md"
            />
            <InputRightElement>
              <IconButton
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
              />
            </InputRightElement>
          </InputGroup>
        ) : (
          <Input
            type={type}
            value={formData[field]}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder={placeholder}
            borderColor={isValid ? 'green.400' : hasError ? brandRed : brandLightGray}
            _hover={{ borderColor: isValid ? 'green.500' : hasError ? brandRed : brandOrange }}
            _focus={{
              borderColor: isValid ? 'green.500' : hasError ? brandRed : brandRed,
              boxShadow: isValid ? '0 0 0 1px #48BB78' : hasError ? `0 0 0 1px ${brandRed}` : `0 0 0 1px ${brandRed}`
            }}
            bg="white"
            size="md"
          />
        )}
        {hasError && (
          <FormHelperText color="red.500" fontSize="xs">
            {errors[field]}
          </FormHelperText>
        )}
        {isValid && (
          <FormHelperText color="green.500" fontSize="xs">
            ✓ Campo válido
          </FormHelperText>
        )}
      </FormControl>
    )
  }

  return (
    <Box
      bg="white"
      p={{ base: 6, md: 8 }}
      borderRadius="lg"
      boxShadow="xl"
      w="full"
      maxW="500px"
      mx="auto"
    >
      <Text fontSize="2xl" fontWeight="bold" color="gray.800" mb={6} textAlign="center">
        Iniciar Sesión
      </Text>

      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          {renderField('email', 'Correo Electrónico', 'email', 'ejemplo@correo.com')}
          {renderField('password', 'Contraseña', 'password', 'Ingresa tu contraseña', true)}

          {/* Opciones adicionales */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Checkbox
              isChecked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              colorScheme="red"
              size="sm"
            >
              Recordarme
            </Checkbox>
            <Link color={brandRed} fontSize="sm" _hover={{ color: brandOrange, textDecoration: 'underline' }}>
              ¿Olvidaste tu contraseña?
            </Link>
          </Box>

          {/* Botón de envío */}
          <Button
            type="submit"
            bg={brandRed}
            color={brandWhite}
            size="lg"
            isLoading={isLoading}
            loadingText="Iniciando sesión..."
            spinner={<Spinner size="sm" />}
            isDisabled={Object.values(errors).some(error => error !== '')}
            _hover={{ 
              bg: brandOrange, 
              transform: 'translateY(-1px)', 
              boxShadow: 'lg' 
            }}
            transition="all 0.2s"
            w="full"
          >
            Iniciar Sesión
          </Button>
        </VStack>
      </form>
    </Box>
  )
}

export default LoginForm
