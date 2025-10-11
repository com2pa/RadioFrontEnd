import React, { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  VStack,
  HStack,
  useToast,
  Spinner,
  Text,
  Divider
} from '@chakra-ui/react'
import { validateField } from '../../utils/validations'
import { registerUser } from '../../services/authService'

const RegisterForm = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    address: '',
    phone: '',
    age: ''
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

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
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validar todos los campos
      const hasErrors = Object.values(errors).some(error => error !== '')
      if (hasErrors) {
        toast({
          title: 'Error de validación',
          description: 'Por favor corrige los errores en el formulario',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        return
      }

      // Enviar datos al backend
      const response = await registerUser(formData)
      
      // Limpiar el formulario después del registro exitoso
      setFormData({
        name: '',
        lastname: '',
        email: '',
        password: '',
        address: '',
        phone: '',
        age: ''
      })
      setErrors({})
      
      toast({
        title: 'Registro exitoso',
        description: 'Tu cuenta ha sido creada correctamente',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      if (onSuccess) onSuccess(response)
      
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error al registrar usuario'
      
      toast({
        title: 'Error de registro',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })

      if (onError) onError(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Renderizar campo de formulario
  const renderField = (field, label, type = 'text', placeholder = '') => {
    const hasError = errors[field] && errors[field] !== ''
    const isValid = formData[field] && !hasError

    return (
      <FormControl isInvalid={hasError} isRequired>
        <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
          {label}
        </FormLabel>
        <Input
          type={type}
          value={formData[field]}
          onChange={(e) => handleChange(field, e.target.value)}
          placeholder={placeholder}
          borderColor={isValid ? 'green.400' : hasError ? 'red.400' : 'gray.300'}
          _hover={{ borderColor: isValid ? 'green.500' : hasError ? 'red.500' : 'gray.400' }}
          _focus={{
            borderColor: isValid ? 'green.500' : hasError ? 'red.500' : 'blue.500',
            boxShadow: isValid ? '0 0 0 1px #48BB78' : hasError ? '0 0 0 1px #F56565' : '0 0 0 1px #3182CE'
          }}
          bg="white"
          size="md"
        />
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
      p={8}
      borderRadius="lg"
      boxShadow="lg"
      w="full"
      maxW="600px"
      mx="auto"
    >
      <Text fontSize="2xl" fontWeight="bold" color="gray.800" mb={6} textAlign="center">
        Crear Cuenta
      </Text>

      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          {/* Información Personal */}
          <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={2}>
            Información Personal
          </Text>
          
          <HStack spacing={4}>
            {renderField('name', 'Nombre', 'text', 'Ingresa tu nombre')}
            {renderField('lastname', 'Apellido', 'text', 'Ingresa tu apellido')}
          </HStack>

          {renderField('email', 'Correo Electrónico', 'email', 'ejemplo@correo.com')}
          {renderField('password', 'Contraseña', 'password', 'Mínimo 8 caracteres')}

          <Divider />

          {/* Información de Contacto */}
          <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={2}>
            Información de Contacto
          </Text>

          {renderField('address', 'Dirección', 'text', 'Calle, número, ciudad')}
          
          <HStack spacing={4}>
            {renderField('phone', 'Teléfono', 'tel', '04141111111')}
            {renderField('age', 'Edad', 'number', '18')}
          </HStack>

          {/* Botón de envío */}
          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            isLoading={isLoading}
            loadingText="Registrando..."
            spinner={<Spinner size="sm" />}
            isDisabled={Object.values(errors).some(error => error !== '')}
            _hover={{ transform: 'translateY(-1px)', boxShadow: 'lg' }}
            transition="all 0.2s"
          >
            Crear Cuenta
          </Button>
        </VStack>
      </form>
    </Box>
  )
}

export default RegisterForm
