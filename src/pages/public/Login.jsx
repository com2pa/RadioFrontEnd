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
import { useAuthRedirect } from '../../hooks/useAuthRedirect'
import LoginForm from '../../components/forms/LoginForm'

const Login = () => {
  const { redirectToDashboard } = useAuthRedirect()
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const textColor = useColorModeValue('gray.600', 'gray.300')

  const handleLoginSuccess = () => {
    // Redirección automática basada en rol del usuario
    redirectToDashboard()
  }

  const handleLoginError = () => {
    // Manejar errores de login
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
              Inicia sesión para acceder a tu cuenta y disfrutar de la mejor programación radial
            </Text>
          </VStack>

          {/* Formulario de Login */}
          <LoginForm 
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
          />

          {/* Footer */}
          <VStack spacing={4} textAlign="center">
            <Divider maxW="400px" />
            <Text fontSize="sm" color={textColor}>
              ¿No tienes una cuenta?{' '}
              <Link 
                as={RouterLink} 
                to="/register" 
                color="blue.500" 
                fontWeight="medium"
                _hover={{ textDecoration: 'underline' }}
              >
                Regístrate aquí
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

export default Login
