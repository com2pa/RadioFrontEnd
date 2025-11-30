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
  const handleChangePassword = async () => {
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

    try {
      setIsUpdating(true)
      const token = localStorage.getItem('token') || localStorage.getItem('authToken')
      
      if (!token) {
        throw new Error('No se encontró el token de autenticación')
      }
      
      // Preparar el body según lo que espera el backend
      const requestBody = {
        newPassword: passwordData.newPassword
      }
      
      // Enviar la petición al endpoint correcto
      const response = await axios.put('/api/perfilUser/profile/password', requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.data && response.data.success) {
        toast({
          title: 'Contraseña actualizada',
          description: 'Tu contraseña se ha cambiado correctamente. Por favor, inicia sesión nuevamente.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        
        // Limpiar formulario
        setPasswordData({
          newPassword: '',
          confirmPassword: ''
        })
        setErrors({})
        
        // Cerrar sesión y redirigir al login después de un breve delay
        setTimeout(() => {
          logout()
          navigate('/login')
        }, 2000)
      } else {
        const errorMessage = response.data?.message || 'Error al cambiar la contraseña'
        throw new Error(errorMessage)
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          'Error al cambiar la contraseña'
      
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
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
