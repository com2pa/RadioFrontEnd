import React, { useState } from 'react'
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  useColorModeValue,
  Card,
  CardBody,
  CardHeader,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  FormErrorMessage,
  Heading,
  IconButton,
  useToast,
  useDisclosure,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react'
import { 
  FiLock, 
  FiArrowLeft, 
  FiMenu, 
  FiHome, 
  FiLogOut,
  FiEye,
  FiEyeOff
} from 'react-icons/fi'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getUserRoleInfo, isAdmin } from '../../utils/roleUtils'
import { validateField, validationRules } from '../../utils/validations'
import AdminMenu from '../../components/layout/AdminMenu'
import UserLayout from '../../components/layout/UserLayout'
import axios from 'axios'

const ChangePassword = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const toast = useToast()
  const navigate = useNavigate()
  const { auth, logout } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [isUpdating, setIsUpdating] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const userIsAdmin = auth ? isAdmin(auth) : false
  const roleInfo = getUserRoleInfo(auth)

  // Manejar cambio de campos
  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }))
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  // Validar y cambiar contraseña
  // Validar y cambiar contraseña - VERSIÓN OPTIMIZADA
const handleChangePassword = async () => {
  // Validaciones del formulario
  const newErrors = {}

  // Validar nueva contraseña usando validations.js
  if (!passwordData.newPassword) {
      newErrors.newPassword = 'La nueva contraseña es requerida'
  } else {
      const passwordValidation = validateField('password', passwordData.newPassword)
      if (!passwordValidation.isValid) {
          newErrors.newPassword = passwordValidation.message
      }
  }

  // Validar confirmación
  if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu nueva contraseña'
  } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
  }

  if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
  }

   // Declarar timeoutId fuera del try para que esté disponible en catch
   let timeoutId = null
   
   try {
      setIsUpdating(true)
      
      // Obtener token del contexto de autenticación o localStorage
      const token = auth?.token || auth?.accessToken || localStorage.getItem('authToken') || localStorage.getItem('token') || localStorage.getItem('accessToken')
      
      if (!token) {
          toast({
              title: 'Error de autenticación',
              description: 'No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.',
              status: 'error',
              duration: 5000,
              isClosable: true,
          })
          setTimeout(() => {
              logout()
              navigate('/login')
          }, 2000)
          return
      }
      
      // Preparar el body según lo que espera el backend
      const requestBody = {
          newPassword: passwordData.newPassword
      }
      
      // Verificar que el endpoint sea correcto (sin doble barra)
      const endpoint = '/api/perfilUser/profile/password'
      
      // Log temporal para debugging
      console.log('📤 [ChangePassword] Enviando request:', {
          endpoint,
          method: 'PUT',
          hasToken: !!token,
          tokenLength: token?.length,
          requestBody: { ...requestBody, newPassword: '***' } // Ocultar contraseña
      })
      
      // Configuración optimizada con timeout
      const source = axios.CancelToken.source();
      timeoutId = setTimeout(() => {
          source.cancel('Timeout - La solicitud está tomando demasiado tiempo');
      }, 20000); // 20 segundos de timeout
      
      const requestConfig = {
          headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
          },
          withCredentials: true,
          cancelToken: source.token,
          timeout: 20000, // Timeout de 20 segundos
          // Configuraciones adicionales para mejor performance
          decompress: true,
          responseType: 'json'
      }
      
      console.log('📤 [ChangePassword] Configuración de request:', {
          endpoint,
          timeout: requestConfig.timeout,
          hasToken: !!token
      })
      
      const response = await axios.put(endpoint, requestBody, requestConfig)
      
      // Limpiar timeout si la respuesta llega a tiempo
      clearTimeout(timeoutId);
      
      console.log('✅ [ChangePassword] Respuesta recibida:', {
          status: response.status,
          success: response.data?.success,
          message: response.data?.message,
          timestamp: new Date().toISOString()
      })

      // Verificar respuesta del servidor
      if (!response || !response.data) {
          throw new Error('No se recibió respuesta del servidor')
      }

      // El backend ahora responde inmediatamente (< 2 segundos)
      if (response.data.success === true || response.data.success === 'true') {
          // Mostrar mensaje de éxito inmediatamente
          toast({
              title: '✅ Contraseña actualizada',
              description: response.data.message || 'Tu contraseña se ha cambiado correctamente. Serás redirigido al login...',
              status: 'success',
              duration: 3000,
              isClosable: true,
          })
          
          // Limpiar formulario inmediatamente
          setPasswordData({
              newPassword: '',
              confirmPassword: ''
          })
          setErrors({})
          
          // Si requiere logout, cerrar sesión después de un breve delay
          if (response.data.requiresLogout) {
              setTimeout(() => {
                  console.log('🔐 Redirigiendo al login después de cambiar contraseña...');
                  logout()
                  navigate('/login')
              }, 2000)
          } else {
              // Si no requiere logout, redirigir al dashboard
              setTimeout(() => {
                  navigate(userIsAdmin ? "/dashboard/admin" : "/dashboard/user")
              }, 1500)
          }
      } else {
          // Si success es false o no existe, mostrar el mensaje del servidor
          const errorMessage = response.data?.message || 
                              response.data?.error || 
                              'La contraseña no se pudo actualizar. Por favor, intenta de nuevo.'
          throw new Error(errorMessage)
      }
  } catch (error) {
      // Limpiar timeout en caso de error
      if (timeoutId) clearTimeout(timeoutId);
      
      let errorMessage = 'Error al cambiar la contraseña'
      let errorStatus = 'error'
      
      // Log detallado del error para debugging
      console.error('❌ [ChangePassword] Error completo:', {
          message: error.message,
          code: error.code,
          response: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText,
          isCancel: axios.isCancel(error)
      })
      
      // Manejar diferentes tipos de errores
      if (axios.isCancel(error)) {
          errorMessage = 'La operación está tomando demasiado tiempo. Por favor, verifica tu conexión e intenta de nuevo.'
          errorStatus = 'warning'
      } else if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
          errorMessage = 'La solicitud tardó demasiado. Por favor, verifica tu conexión e intenta de nuevo.'
      } else if (error.response) {
          // El servidor respondió con un código de error
          const status = error.response.status
          const backendMessage = error.response.data?.message || error.response.data?.error
          
          if (status === 401) {
              errorMessage = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.'
              // Redirigir al login después de mostrar el error
              setTimeout(() => {
                  logout()
                  navigate('/login')
              }, 3000)
          } else if (status === 400) {
              errorMessage = backendMessage || 'Datos inválidos. Verifica que la contraseña cumpla con los requisitos.'
          } else if (status === 404) {
              errorMessage = 'Usuario no encontrado. Por favor, inicia sesión nuevamente.'
              setTimeout(() => {
                  logout()
                  navigate('/login')
              }, 3000)
          } else if (status === 408) {
              errorMessage = 'El servidor está ocupado. Por favor, intenta nuevamente en unos momentos.'
              errorStatus = 'warning'
          } else if (status >= 500) {
              errorMessage = 'Error del servidor. Por favor, intenta nuevamente más tarde.'
          } else {
              errorMessage = backendMessage || `Error del servidor: ${status}`
          }
      } else if (error.request) {
          // La solicitud se hizo pero no hubo respuesta
          errorMessage = 'No se recibió respuesta del servidor. Verifica tu conexión a internet.'
      } else {
          errorMessage = error.message || 'Error desconocido al cambiar la contraseña'
      }
      
      toast({
          title: 'Error',
          description: errorMessage,
          status: errorStatus,
          duration: 6000,
          isClosable: true,
      })
      
      // En caso de error de autenticación, limpiar el formulario
      if (error.response?.status === 401 || error.response?.status === 404) {
          setPasswordData({
              newPassword: '',
              confirmPassword: ''
          })
      }
  } finally {
      setIsUpdating(false)
  }
}

  // Contenido del formulario (reutilizable)
  const passwordFormContent = (
    <Card bg={cardBg} boxShadow="md" maxW="container.md" mx="auto">
      <CardHeader>
        <HStack spacing={3}>
          <Icon as={FiLock} boxSize={6} color={userIsAdmin ? "blue.500" : "red.500"} />
          <Heading size="md">Nueva Contraseña</Heading>
        </HStack>
      </CardHeader>
      <CardBody>
        <VStack spacing={6} align="stretch">
          {/* Información de seguridad */}
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle>Importante</AlertTitle>
              <AlertDescription fontSize="sm">
                Después de cambiar tu contraseña, deberás iniciar sesión nuevamente con tu nueva contraseña.
              </AlertDescription>
            </Box>
          </Alert>

          {/* Campo de nueva contraseña */}
          <FormControl isInvalid={errors.newPassword}>
            <FormLabel>Nueva Contraseña</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                placeholder="Ingresa tu nueva contraseña"
                pr="4.5rem"
              />
              <InputRightElement width="4.5rem">
                <IconButton
                  h="1.75rem"
                  size="sm"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  icon={<Icon as={showPassword ? FiEyeOff : FiEye} />}
                  onClick={() => setShowPassword(!showPassword)}
                  variant="ghost"
                />
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.newPassword}</FormErrorMessage>
          </FormControl>

          {/* Campo de confirmación */}
          <FormControl isInvalid={errors.confirmPassword}>
            <FormLabel>Confirmar Nueva Contraseña</FormLabel>
            <InputGroup>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                placeholder="Confirma tu nueva contraseña"
                pr="4.5rem"
              />
              <InputRightElement width="4.5rem">
                <IconButton
                  h="1.75rem"
                  size="sm"
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  icon={<Icon as={showConfirmPassword ? FiEyeOff : FiEye} />}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  variant="ghost"
                />
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
          </FormControl>

          {/* Requisitos de contraseña - usando validations.js (sin duplicar) */}
          <Box 
            bg={userIsAdmin ? "blue.50" : "red.50"} 
            p={4} 
            borderRadius="md" 
            borderWidth="1px"
            borderColor={userIsAdmin ? "blue.200" : "red.200"}
          >
            <Text fontWeight="bold" mb={2} color={userIsAdmin ? "blue.800" : "red.800"}>
              Requisitos de contraseña:
            </Text>
            <Text fontSize="sm" color={userIsAdmin ? "blue.700" : "red.700"}>
              {validationRules.password.message}
            </Text>
          </Box>

          {/* Botones de acción */}
          <HStack spacing={4} justify="flex-end" pt={4}>
            <Button
              variant="outline"
              onClick={() => navigate(userIsAdmin ? "/dashboard/admin" : "/dashboard/user")}
              isDisabled={isUpdating}
            >
              Cancelar
            </Button>
            <Button
              colorScheme={userIsAdmin ? "blue" : "red"}
              onClick={handleChangePassword}
              isLoading={isUpdating}
              loadingText="Actualizando..."
              leftIcon={<Icon as={FiLock} />}
            >
              Cambiar Contraseña
            </Button>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  )

  // Renderizar con el layout apropiado según el tipo de usuario
  if (!userIsAdmin) {
    // Para usuarios suscriptores, usar UserLayout
    return (
      <UserLayout>
        <Container maxW="container.md" py={8}>
          <VStack spacing={8} align="stretch">
            {/* Header */}
            <Box>
              <HStack justify="space-between" align="center" mb={4}>
                <VStack align="start" spacing={1}>
                  <HStack spacing={4}>
                    <Button
                      as={RouterLink}
                      to="/dashboard/user"
                      leftIcon={<Icon as={FiArrowLeft} />}
                      variant="outline"
                      size="sm"
                    >
                      Volver
                    </Button>
                    <Heading size="lg" color="red.600">
                      Cambiar Contraseña
                    </Heading>
                  </HStack>
                  <Text color={textColor}>
                    Actualiza tu contraseña para mantener tu cuenta segura
                  </Text>
                </VStack>
              </HStack>
            </Box>

            {passwordFormContent}
          </VStack>
        </Container>
      </UserLayout>
    )
  }

  // Para administradores, usar estructura consistente con otros archivos admin
  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header del Dashboard */}
          <Box>
            <HStack justify="space-between" align="center" mb={4}>
              <VStack align="start" spacing={1}>
                <HStack spacing={4}>
                  <Button
                    as={RouterLink}
                    to="/dashboard/admin"
                    leftIcon={<Icon as={FiArrowLeft} />}
                    variant="outline"
                    size="sm"
                  >
                    Volver
                  </Button>
                  <Heading size="lg" color="blue.600">
                    Cambiar Contraseña
                  </Heading>
                </HStack>
                <Text color={textColor}>
                  Actualiza tu contraseña para mantener tu cuenta segura
                </Text>
              </VStack>
              <HStack spacing={2}>
                <IconButton aria-label="Abrir menú" icon={<Icon as={FiMenu} />} onClick={onOpen} />
                <IconButton as={RouterLink} to="/" aria-label="Inicio" icon={<Icon as={FiHome} />} />
                <Button leftIcon={<Icon as={FiLogOut} />} colorScheme="red" variant="outline" onClick={logout}>
                  Cerrar sesión
                </Button>
              </HStack>
            </HStack>
          </Box>

          {/* Menú administrativo reutilizable */}
          <AdminMenu 
            isOpen={isOpen}
            onClose={onClose}
            currentPage="/dashboard/admin/change-password"
          />

          {/* Formulario de cambio de contraseña */}
          {passwordFormContent}
        </VStack>
      </Container>
    </Box>
  )
}

export default ChangePassword
