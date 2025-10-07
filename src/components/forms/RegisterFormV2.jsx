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
  Divider,
  InputGroup,
  InputRightElement,
  IconButton
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { validateField } from '../../utils/validations'
import { useRegister } from '../../hooks/useRegister'

const RegisterFormV2 = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    address: '',
    phone: '',
    age: ''
  })

  const [fieldErrors, setFieldErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const { register, isLoading, errors, clearErrors } = useRegister()
  const toast = useToast()

  // Manejar cambios en los campos
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Validar en tiempo real
    const validation = validateField(field, value)
    setFieldErrors(prev => ({
      ...prev,
      [field]: validation.isValid ? '' : validation.message
    }))
  }

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    clearErrors()

    try {
      const response = await register(formData)
      
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
    }
  }

  // Renderizar campo de formulario
  const renderField = (field, label, type = 'text', placeholder = '', isPassword = false) => {
    const hasError = (fieldErrors[field] && fieldErrors[field] !== '') || (errors[field])
    const isValid = formData[field] && !hasError
    const errorMessage = fieldErrors[field] || errors[field]

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
              borderColor={isValid ? 'green.400' : hasError ? 'red.400' : 'gray.300'}
              _hover={{ borderColor: isValid ? 'green.500' : hasError ? 'red.500' : 'gray.400' }}
              _focus={{
                borderColor: isValid ? 'green.500' : hasError ? 'red.500' : 'blue.500',
                boxShadow: isValid ? '0 0 0 1px #48BB78' : hasError ? '0 0 0 1px #F56565' : '0 0 0 1px #3182CE'
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
            borderColor={isValid ? 'green.400' : hasError ? 'red.400' : 'gray.300'}
            _hover={{ borderColor: isValid ? 'green.500' : hasError ? 'red.500' : 'gray.400' }}
            _focus={{
              borderColor: isValid ? 'green.500' : hasError ? 'red.500' : 'blue.500',
              boxShadow: isValid ? '0 0 0 1px #48BB78' : hasError ? '0 0 0 1px #F56565' : '0 0 0 1px #3182CE'
            }}
            bg="white"
            size="md"
          />
        )}
        {hasError && (
          <FormHelperText color="red.500" fontSize="xs">
            {errorMessage}
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
      maxW="700px"
      mx="auto"
    >
      <Text fontSize="2xl" fontWeight="bold" color="gray.800" mb={6} textAlign="center">
        Crear Cuenta
      </Text>

      <form onSubmit={handleSubmit}>
        <VStack spacing={6} align="stretch">
          {/* Información Personal */}
          <Box>
            <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={4}>
              Información Personal
            </Text>
            
            <VStack spacing={4}>
              <HStack spacing={4} w="full">
                {renderField('name', 'Nombre', 'text', 'Ingresa tu nombre')}
                {renderField('lastname', 'Apellido', 'text', 'Ingresa tu apellido')}
              </HStack>

              {renderField('email', 'Correo Electrónico', 'email', 'ejemplo@correo.com')}
              {renderField('password', 'Contraseña', 'password', 'Mínimo 8 caracteres', true)}
            </VStack>
          </Box>

          <Divider />

          {/* Información de Contacto */}
          <Box>
            <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={4}>
              Información de Contacto
            </Text>

            <VStack spacing={4}>
              {renderField('address', 'Dirección', 'text', 'Calle, número, ciudad')}
              
              <HStack spacing={4} w="full">
                {renderField('phone', 'Teléfono', 'tel', '3001234567')}
                {renderField('age', 'Edad', 'number', '18')}
              </HStack>
            </VStack>
          </Box>

          {/* Botón de envío */}
          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            isLoading={isLoading}
            loadingText="Registrando..."
            spinner={<Spinner size="sm" />}
            isDisabled={Object.values(fieldErrors).some(error => error !== '')}
            _hover={{ transform: 'translateY(-1px)', boxShadow: 'lg' }}
            transition="all 0.2s"
            w="full"
          >
            Crear Cuenta
          </Button>
        </VStack>
      </form>
    </Box>
  )
}

export default RegisterFormV2






