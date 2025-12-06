import React, { useState } from 'react'
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  useColorModeValue,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Spinner,
  FormHelperText,
  Divider
} from '@chakra-ui/react'
import { FiSend } from 'react-icons/fi'
import PublicLayout from '../../components/layout/PublicLayout'
import PageWithFooter from '../../components/layout/PageWithFooter'
import SEO from '../../components/SEO'
import { validateField } from '../../utils/validations'

const Contact = () => {
  // Colores oficiales de OXÍGENO 88.1FM
  const brandRed = '#E50000'      // Rojo Vibrante
  const brandDarkGray = '#333333' // Gris Oscuro
  const brandBlack = '#000000'    // Negro
  const brandWhite = '#FFFFFF'    // Blanco Puro
  const brandLightGray = '#CCCCCC' // Gris Claro

  const bgColor = useColorModeValue(brandWhite, brandDarkGray)
  const toast = useToast()

  // Estados del formulario
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // Manejar cambios en los campos
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  // Validar formulario usando las validaciones centralizadas
  const validateForm = () => {
    const newErrors = {}

    // Validar campos usando las validaciones centralizadas
    const fieldsToValidate = ['name', 'lastname', 'email', 'phone']
    
    fieldsToValidate.forEach(field => {
      const value = formData[field === 'name' ? 'firstName' : field === 'lastname' ? 'lastName' : field]
      if (!value.trim()) {
        newErrors[field === 'name' ? 'firstName' : field === 'lastname' ? 'lastName' : field] = `El ${field === 'name' ? 'nombre' : field === 'lastname' ? 'apellido' : field === 'email' ? 'email' : 'teléfono'} es requerido`
      } else {
        const validation = validateField(field, value)
        if (!validation.isValid) {
          newErrors[field === 'name' ? 'firstName' : field === 'lastname' ? 'lastName' : field] = validation.message
        }
      }
    })

    // Validar mensaje (validación específica para este formulario)
    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es requerido'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'El mensaje debe tener al menos 10 caracteres'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast({
        title: 'Error de validación',
        description: 'Por favor, completa todos los campos correctamente',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)

    try {
      // Preparar datos para enviar
      const dataToSend = {
        contact_name: formData.firstName,
        contact_lastname: formData.lastName,
        contact_email: formData.email,
        contact_phone: formData.phone,
        contact_message: formData.message,
        timestamp: new Date().toISOString(),
        status: 'unread' // Estado inicial del mensaje
      }
      
      // console.log('Enviando datos al backend:', dataToSend)
      
      // Enviar datos al backend
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      })
      
      // console.log('Respuesta del servidor:', response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        // console.error('Error del servidor:', errorData)
        throw new Error(errorData.message || `Error del servidor: ${response.status}`)
      }

      const result = await response.json()
      // console.log('Respuesta del servidor:', result)
      
      toast({
        title: 'Mensaje enviado',
        description: 'Gracias por contactarnos. Te responderemos pronto.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      // Limpiar formulario
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: ''
      })
      setErrors({})

    } catch (error) {
      // console.error('Error sending message:', error)
      toast({
        title: 'Error',
        description: 'No se pudo enviar el mensaje. Inténtalo de nuevo.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
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
        <FormLabel fontSize="sm" fontWeight="medium" color={brandDarkGray}>
          {label}
        </FormLabel>
        <Input
          type={type}
          value={formData[field]}
          onChange={(e) => handleChange(field, e.target.value)}
          placeholder={placeholder}
          borderColor={isValid ? brandLightGray : hasError ? brandRed : brandLightGray}
          _hover={{ borderColor: isValid ? brandDarkGray : hasError ? brandRed : brandDarkGray }}
          _focus={{
            borderColor: isValid ? brandRed : hasError ? brandRed : brandRed,
            boxShadow: isValid ? `0 0 0 1px ${brandRed}` : hasError ? `0 0 0 1px ${brandRed}` : `0 0 0 1px ${brandRed}`
          }}
          bg={brandWhite}
          size="md"
        />
        {hasError && (
          <FormHelperText color={brandRed} fontSize="xs">
            {errors[field]}
          </FormHelperText>
        )}
        {isValid && (
          <FormHelperText color={brandDarkGray} fontSize="xs">
            ✓ Campo válido
          </FormHelperText>
        )}
      </FormControl>
    )
  }

  // Renderizar textarea
  const renderTextarea = (field, label, placeholder = '') => {
    const hasError = errors[field] && errors[field] !== ''
    const isValid = formData[field] && !hasError

    return (
      <FormControl isInvalid={hasError} isRequired>
        <FormLabel fontSize="sm" fontWeight="medium" color={brandDarkGray}>
          {label}
        </FormLabel>
        <Textarea
          value={formData[field]}
          onChange={(e) => handleChange(field, e.target.value)}
          placeholder={placeholder}
          rows={6}
          resize="vertical"
          borderColor={isValid ? brandLightGray : hasError ? brandRed : brandLightGray}
          _hover={{ borderColor: isValid ? brandDarkGray : hasError ? brandRed : brandDarkGray }}
          _focus={{
            borderColor: isValid ? brandRed : hasError ? brandRed : brandRed,
            boxShadow: isValid ? `0 0 0 1px ${brandRed}` : hasError ? `0 0 0 1px ${brandRed}` : `0 0 0 1px ${brandRed}`
          }}
          bg={brandWhite}
          size="md"
        />
        {hasError && (
          <FormHelperText color={brandRed} fontSize="xs">
            {errors[field]}
          </FormHelperText>
        )}
        {isValid && (
          <FormHelperText color={brandDarkGray} fontSize="xs">
            ✓ Campo válido
          </FormHelperText>
        )}
      </FormControl>
    )
  }

  return (
    <PublicLayout>
      <SEO
        title="Contacto - Oxígeno 88.1 FM"
        description="Contáctanos en Oxígeno 88.1 FM. Envíanos tus comentarios, sugerencias o consultas. Estamos aquí para escucharte y responder todas tus preguntas."
        keywords="contacto Oxígeno Radio, Barquisimeto, radio contacto, sugerencias radio, consultas radio, comunicación radio"
      />
      <PageWithFooter>
        <Box bg={bgColor} py={8}>
          <Container maxW="container.lg" px={4}>
            <VStack spacing={8} align="center">
              {/* Header */}
              <VStack spacing={4} textAlign="center">
                <Text fontSize="4xl" fontWeight="bold" color={brandRed}>
                  Oxígeno Radio
                </Text>
                <Text fontSize="lg" color="gray.600" maxW="md">
                  ¿Tienes alguna pregunta, sugerencia o necesitas ayuda? Envíanos un mensaje.
                </Text>
              </VStack>

              {/* Formulario de Contacto */}
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
                  Contáctanos
                </Text>

                <form onSubmit={handleSubmit}>
                  <VStack spacing={4} align="stretch">
                    {/* Información Personal */}
                    <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={2}>
                      Información Personal
                    </Text>
                    
                    <HStack spacing={4}>
                      {renderField('firstName', 'Nombre', 'text', 'Ingresa tu nombre')}
                      {renderField('lastName', 'Apellido', 'text', 'Ingresa tu apellido')}
                    </HStack>

                    {renderField('email', 'Correo Electrónico', 'email', 'ejemplo@correo.com')}

                    {renderField('phone', 'Teléfono', 'tel', '02121234567')}

                    <Divider />

                    {/* Mensaje */}
                    <Text fontSize="lg" fontWeight="semibold" color="gray.700" mb={2}>
                      Tu Mensaje
                    </Text>

                    {renderTextarea('message', 'Mensaje', 'Escribe tu mensaje aquí...')}

                    {/* Botón de envío */}
                    <Button
                      type="submit"
                      bg={brandRed}
                      color={brandWhite}
                      size="lg"
                      isLoading={isLoading}
                      loadingText="Enviando..."
                      spinner={<Spinner size="sm" />}
                      isDisabled={Object.values(errors).some(error => error !== '')}
                      _hover={{ transform: 'translateY(-1px)', boxShadow: 'lg', bg: '#C00000' }}
                      transition="all 0.2s"
                      leftIcon={<FiSend />}
                    >
                      Enviar Mensaje
                    </Button>
                  </VStack>
                </form>
              </Box>

              {/* Footer */}
              <VStack spacing={4} textAlign="center">
                <Divider maxW="400px" />
                <Text fontSize="sm" color="gray.600">
                  Te responderemos en un plazo de 24-48 horas hábiles
                </Text>
              </VStack>
            </VStack>
          </Container>
        </Box>
      </PageWithFooter>
    </PublicLayout>
  )
}

export default Contact
