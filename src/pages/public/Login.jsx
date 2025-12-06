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
import { getDashboardRoute } from '../../utils/roleUtils'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../../components/forms/LoginForm'
import PublicLayout from '../../components/layout/PublicLayout'
import PageWithFooter from '../../components/layout/PageWithFooter'
import SEO from '../../components/SEO'

const Login = () => {
  const { redirectToDashboard } = useAuthRedirect()
  const navigate = useNavigate()
  // Colores oficiales de OXÍGENO 88.1FM
  const brandRed = '#E50000'
  const brandDarkGray = '#333333'
  const brandBlack = '#000000'
  const brandWhite = '#FFFFFF'
  const brandLightGray = '#CCCCCC'

  const bgColor = useColorModeValue(brandWhite, brandDarkGray)
  const textColor = useColorModeValue(brandDarkGray, brandLightGray)

  const handleLoginSuccess = (response) => {
    // Extraer datos del usuario del response
    if (response && response.user) {
      // Mapear los datos del usuario para la redirección
      const userData = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role_id: response.user.role, // role_id viene del backend
        role: getRoleName(response.user.role) // Convertir a string
      }
      
      // Redirección directa usando los datos del login
      const dashboardRoute = getDashboardRoute(userData)
      navigate(dashboardRoute, { replace: true })
    } else {
      // Fallback: usar el hook de redirección
      redirectToDashboard()
    }
  }

  // Función auxiliar para convertir role_id a nombre de rol
  const getRoleName = (roleId) => {
    const roleMap = {
      7: 'superAdmin',
      6: 'admin', 
      5: 'edit',
      4: 'view',
      3: 'user'
    }
    return roleMap[roleId] || 'user'
  }

  const handleLoginError = () => {
    // Manejar errores de login
  }

  return (
    <PublicLayout>
      <SEO
        title="Iniciar Sesión - Oxígeno 88.1 FM"
        description="Inicia sesión en tu cuenta de Oxígeno 88.1 FM para acceder a contenido exclusivo, personalizar tu experiencia y disfrutar de todos nuestros servicios."
        keywords="login Oxígeno Radio, iniciar sesión, cuenta radio, acceso radio, usuario radio"
      />
      <PageWithFooter>
        <Box bg={bgColor} py={8}>
          <Container maxW="container.lg" px={4}>
            <VStack spacing={8} align="center">
              {/* Header */}
              <VStack spacing={4} textAlign="center">
                <Text fontSize="4xl" fontWeight="bold" color={brandRed}>
                  Radio Oxígeno
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
                    _hover={{ color: brandRed, textDecoration: 'underline' }}
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
