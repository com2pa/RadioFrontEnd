import React from 'react'
import {
  Box,
  Container,
  VStack,
  Text,
  Link,
  useColorModeValue,
  Divider,
  Flex
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import RegisterForm from '../../components/forms/RegisterForm'

const Register = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const textColor = useColorModeValue('gray.600', 'gray.300')

  const handleRegisterSuccess = (response) => {
    console.log('Registro exitoso:', response)
    // Aquí puedes redirigir al usuario o mostrar un mensaje
  }

  const handleRegisterError = (error) => {
    console.error('Error en registro:', error)
    // Aquí puedes manejar errores específicos
  }

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Container maxW="container.lg" px={4}>
        <VStack spacing={8} align="center">
          {/* Header */}
          <VStack spacing={4} textAlign="center">
            <Text fontSize="4xl" fontWeight="bold" color="blue.600">
              Radio FM
            </Text>
            <Text fontSize="lg" color={textColor} maxW="md">
              Únete a nuestra comunidad y disfruta de la mejor programación radial
            </Text>
          </VStack>

          {/* Formulario de Registro */}
          <RegisterForm 
            onSuccess={handleRegisterSuccess}
            onError={handleRegisterError}
          />

          {/* Footer */}
          <VStack spacing={4} textAlign="center">
            <Divider maxW="400px" />
            <Text fontSize="sm" color={textColor}>
              ¿Ya tienes una cuenta?{' '}
              <Link 
                as={RouterLink} 
                to="/login" 
                color="blue.500" 
                fontWeight="medium"
                _hover={{ textDecoration: 'underline' }}
              >
                Inicia sesión aquí
              </Link>
            </Text>
            
            <Flex 
              direction={{ base: 'column', sm: 'row' }} 
              gap={4} 
              fontSize="xs" 
              color={textColor}
              textAlign="center"
            >
              <Link as={RouterLink} to="/" _hover={{ color: 'blue.500' }}>
                Inicio
              </Link>
              <Text display={{ base: 'none', sm: 'block' }}>•</Text>
              <Link as={RouterLink} to="/about" _hover={{ color: 'blue.500' }}>
                Acerca de
              </Link>
              <Text display={{ base: 'none', sm: 'block' }}>•</Text>
              <Link as={RouterLink} to="/contact" _hover={{ color: 'blue.500' }}>
                Contacto
              </Link>
            </Flex>
          </VStack>
        </VStack>
      </Container>
    </Box>
  )
}

export default Register
