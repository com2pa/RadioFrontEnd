import React, { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  FormErrorMessage,
  VStack,
  HStack,
  useToast,
  Spinner,
  Text,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  IconButton,
  Checkbox,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Icon
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { FiLock, FiMail } from 'react-icons/fi'
import { validateField } from '../../utils/validations'
import { loginUser } from '../../services/authService'
import { useAuth } from '../../hooks/useAuth'
import axios from 'axios'

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
  
  // Estados para el modal de recuperación de contraseña
  const { isOpen: isForgotPasswordOpen, onOpen: onForgotPasswordOpen, onClose: onForgotPasswordClose } = useDisclosure()
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1) // 1: email, 2: password
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [forgotPasswordErrors, setForgotPasswordErrors] = useState({})
  const [isCheckingEmail, setIsCheckingEmail] = useState(false)
  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)

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

  // console.log('🔐 [1] LoginForm - Starting login process...')
  // console.log('🔐 [2] LoginForm - Form data:', formData)

  try {
    // Validar que los campos no estén vacíos
    if (!formData.email || !formData.password) {
      // console.log('❌ [3] LoginForm - Empty fields detected')
      toast({
        title: 'Datos incompletos',
        description: 'Por favor completa todos los campos',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    // console.log('📤 [4] LoginForm - Calling loginUser API...')
    
    // Enviar datos al backend
    const response = await loginUser(formData)
    
    // console.log('✅ [5] LoginForm - API Response received:', response)
    
    // Verificar estructura de la respuesta
    if (response.success && response.user && response.accesstoken) {
      // console.log('🎯 [6] LoginForm - Login successful!')
      // console.log('🎯 [7] LoginForm - User data:', response.user)
      // console.log('🎯 [8] LoginForm - Access token:', response.accesstoken ? 'PRESENT' : 'MISSING')
      
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
      
      // console.log('🔐 [9] LoginForm - Auth data to set:', authData)
      
      // ACTUALIZAR EL ESTADO DE AUTENTICACIÓN
      setAuth(authData);
      
      // Limpiar el formulario después del login exitoso
      setFormData({
        email: '',
        password: ''
      })
      setErrors({})
      
      // console.log('🔐 [10] LoginForm - Auth state updated, checking localStorage...')
      // console.log('🔐 [11] LoginForm - localStorage token:', localStorage.getItem('authToken'))
      // console.log('🔐 [12] LoginForm - localStorage user:', localStorage.getItem('user'))
      
      toast({
        title: 'Inicio de sesión exitoso',
        description: `Bienvenido ${response.user.name}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      // console.log('🔄 [13] LoginForm - Calling onSuccess callback...')
      if (onSuccess) onSuccess(response)
      
    } else {
      // console.error('❌ [6] LoginForm - Login failed - Response structure:', {
      //   success: response.success,
      //   hasUser: !!response.user,
      //   hasToken: !!response.accesstoken,
      //   message: response.message
      // })
      throw new Error(response.message || 'Error en el login')
    }
    
  } catch (error) {
    // console.error('❌ [ERROR] LoginForm - Catch block:', error)
    // console.error('❌ [ERROR] LoginForm - Error details:', {
    //   message: error.message,
    //   response: error.response?.data,
    //   status: error.response?.status
    // })
    
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
    // console.log('🏁 [FINALLY] LoginForm - Process completed')
    setIsLoading(false)
  }
}

// Función auxiliar para convertir role_id a nombre de rol
const getRoleName = (roleId) => {
  // console.log('🎭 Converting role ID:', roleId)
  const roleMap = {
    7: 'superAdmin',
    6: 'admin', 
    5: 'edit',
    4: 'view',
    3: 'user'
  }
  const roleName = roleMap[roleId] || 'user'
  // console.log('🎭 Role conversion:', roleId, '→', roleName)
  return roleName
}

  // Función para verificar el correo
  const handleVerifyEmail = async () => {
    const newErrors = {}

    if (!forgotPasswordData.email) {
      newErrors.email = 'El correo electrónico es requerido'
    } else {
      const emailValidation = validateField('email', forgotPasswordData.email)
      if (!emailValidation.isValid) {
        newErrors.email = emailValidation.message
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setForgotPasswordErrors(newErrors)
      return
    }

    setIsCheckingEmail(true)
    try {
      // Verificar si el correo existe y está verificado
      const response = await axios.post('/api/auth/verify-email-for-password-reset', {
        email: forgotPasswordData.email
      })

      if (response.data.success) {
        if (response.data.verified) {
          setEmailVerified(true)
          setForgotPasswordStep(2)
          toast({
            title: 'Correo verificado',
            description: 'El correo está verificado. Puedes continuar con el cambio de contraseña.',
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
        } else {
          toast({
            title: 'Correo no verificado',
            description: 'Este correo no ha sido verificado. Por favor verifica tu correo primero.',
            status: 'warning',
            duration: 5000,
            isClosable: true,
          })
        }
      } else {
        throw new Error(response.data.message || 'Error al verificar el correo')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al verificar el correo'
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      
      if (error.response?.status === 404) {
        setForgotPasswordErrors({ email: 'Este correo no está registrado' })
      }
    } finally {
      setIsCheckingEmail(false)
    }
  }

  // Función para cambiar la contraseña
  const handleResetPassword = async () => {
    const newErrors = {}

    if (!forgotPasswordData.newPassword) {
      newErrors.newPassword = 'La nueva contraseña es requerida'
    } else {
      const passwordValidation = validateField('password', forgotPasswordData.newPassword)
      if (!passwordValidation.isValid) {
        newErrors.newPassword = passwordValidation.message
      }
    }

    if (!forgotPasswordData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu nueva contraseña'
    } else if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }

    if (Object.keys(newErrors).length > 0) {
      setForgotPasswordErrors(newErrors)
      return
    }

    setIsResettingPassword(true)
    try {
      // Cambiar la contraseña sin autenticación (usando el correo)
      const response = await axios.put('/api/auth/reset-password', {
        email: forgotPasswordData.email,
        newPassword: forgotPasswordData.newPassword
      })

      if (response.data.success) {
        toast({
          title: 'Contraseña actualizada',
          description: 'Tu contraseña se ha cambiado correctamente. Ya puedes iniciar sesión.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        
        // Cerrar modal y resetear estado
        onForgotPasswordClose()
        setForgotPasswordStep(1)
        setForgotPasswordData({
          email: '',
          newPassword: '',
          confirmPassword: ''
        })
        setForgotPasswordErrors({})
        setEmailVerified(false)
      } else {
        throw new Error(response.data.message || 'Error al cambiar la contraseña')
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Error al cambiar la contraseña'
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsResettingPassword(false)
    }
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
            <Link 
              onClick={onForgotPasswordOpen}
              color={brandRed} 
              fontSize="sm" 
              _hover={{ color: brandOrange, textDecoration: 'underline' }}
              cursor="pointer"
            >
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

      {/* Modal de recuperación de contraseña */}
      <Modal isOpen={isForgotPasswordOpen} onClose={onForgotPasswordClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <VStack align="start" spacing={2}>
              <Text>Recuperar Contraseña</Text>
              <Text fontSize="sm" color="gray.500" fontWeight="normal">
                {forgotPasswordStep === 1 ? 'Paso 1 de 2: Verificar correo' : 'Paso 2 de 2: Nueva contraseña'}
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              {forgotPasswordStep === 1 ? (
                <>
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <AlertTitle fontSize="sm">Verificación requerida</AlertTitle>
                      <AlertDescription fontSize="xs">
                        Ingresa tu correo electrónico para verificar que esté verificado y proceder con el cambio de contraseña.
                      </AlertDescription>
                    </Box>
                  </Alert>

                  <FormControl isInvalid={forgotPasswordErrors.email}>
                    <FormLabel>Correo Electrónico</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon as={FiMail} color="gray.400" />
                      </InputLeftElement>
                      <Input
                        type="email"
                        value={forgotPasswordData.email}
                        onChange={(e) => {
                          setForgotPasswordData(prev => ({ ...prev, email: e.target.value }))
                          if (forgotPasswordErrors.email) {
                            setForgotPasswordErrors(prev => ({ ...prev, email: '' }))
                          }
                        }}
                        placeholder="ejemplo@correo.com"
                        pl="10"
                      />
                    </InputGroup>
                    <FormErrorMessage>{forgotPasswordErrors.email}</FormErrorMessage>
                  </FormControl>

                  <Button
                    colorScheme="red"
                    onClick={handleVerifyEmail}
                    isLoading={isCheckingEmail}
                    loadingText="Verificando..."
                    leftIcon={<Icon as={FiMail} />}
                    w="full"
                  >
                    Verificar Correo
                  </Button>
                </>
              ) : (
                <>
                  <Alert status="success" borderRadius="md">
                    <AlertIcon />
                    <Box>
                      <AlertTitle fontSize="sm">Correo verificado</AlertTitle>
                      <AlertDescription fontSize="xs">
                        El correo {forgotPasswordData.email} está verificado. Ahora puedes establecer tu nueva contraseña.
                      </AlertDescription>
                    </Box>
                  </Alert>

                  <FormControl isInvalid={forgotPasswordErrors.newPassword}>
                    <FormLabel>Nueva Contraseña</FormLabel>
                    <InputGroup>
                      <Input
                        type={showNewPassword ? 'text' : 'password'}
                        value={forgotPasswordData.newPassword}
                        onChange={(e) => {
                          setForgotPasswordData(prev => ({ ...prev, newPassword: e.target.value }))
                          if (forgotPasswordErrors.newPassword) {
                            setForgotPasswordErrors(prev => ({ ...prev, newPassword: '' }))
                          }
                        }}
                        placeholder="Ingresa tu nueva contraseña"
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={showNewPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                          icon={showNewPassword ? <ViewOffIcon /> : <ViewIcon />}
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{forgotPasswordErrors.newPassword}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={forgotPasswordErrors.confirmPassword}>
                    <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                    <InputGroup>
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={forgotPasswordData.confirmPassword}
                        onChange={(e) => {
                          setForgotPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))
                          if (forgotPasswordErrors.confirmPassword) {
                            setForgotPasswordErrors(prev => ({ ...prev, confirmPassword: '' }))
                          }
                        }}
                        placeholder="Confirma tu nueva contraseña"
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                          icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{forgotPasswordErrors.confirmPassword}</FormErrorMessage>
                  </FormControl>

                  <Box 
                    bg="blue.50" 
                    p={3} 
                    borderRadius="md" 
                    fontSize="xs" 
                    color="blue.800"
                  >
                    <Text fontWeight="bold" mb={1}>Requisitos de contraseña:</Text>
                    <Text>• Entre 8 y 15 caracteres</Text>
                    <Text>• Al menos una letra mayúscula</Text>
                    <Text>• Al menos una letra minúscula</Text>
                    <Text>• Al menos un número</Text>
                    <Text>• Al menos un símbolo</Text>
                  </Box>

                  <HStack spacing={3}>
                    <Button
                      variant="outline"
                      onClick={() => setForgotPasswordStep(1)}
                      flex={1}
                    >
                      Volver
                    </Button>
                    <Button
                      colorScheme="red"
                      onClick={handleResetPassword}
                      isLoading={isResettingPassword}
                      loadingText="Cambiando..."
                      leftIcon={<Icon as={FiLock} />}
                      flex={1}
                    >
                      Cambiar Contraseña
                    </Button>
                  </HStack>
                </>
              )}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default LoginForm
