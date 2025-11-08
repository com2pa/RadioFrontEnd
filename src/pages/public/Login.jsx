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
  // Colores oficiales de OXÍGENO 88.1FM
  const brandRed = '#E50000'
  const brandDarkGray = '#333333'
  const brandLightGray = '#CCCCCC'
  const brandOrange = '#FFA500'

  const bgColor = useColorModeValue(brandLightGray + '40', brandDarkGray)
  const textColor = useColorModeValue(brandDarkGray, brandLightGray)

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
                <Text fontSize="4xl" fontWeight="bold" color={brandRed}>
                  Radio Oxigeno
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
                    color={brandRed} 
                    fontWeight="medium"
                    _hover={{ color: brandOrange, textDecoration: 'underline' }}
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
