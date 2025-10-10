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
import PublicLayout from '../../components/layout/PublicLayout'
import PageWithFooter from '../../components/layout/PageWithFooter'

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
    <PublicLayout>
      <PageWithFooter>
        <Box bg={bgColor} py={8}>
          <Container maxW="container.lg" px={4}>
            <VStack spacing={8} align="center">
              {/* Header */}
              <VStack spacing={4} textAlign="center">
                <Text fontSize="4xl" fontWeight="bold" color="blue.600">
                  OXÍ Radio
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
              </VStack>
            </VStack>
          </Container>
        </Box>
      </PageWithFooter>
    </PublicLayout>
  )
}

export default Login
