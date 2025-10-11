import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box,
  VStack,
  Text,
  Spinner,
  Button,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react'
import { verifyEmail } from '../../services/authService'

const EmailVerification = () => {
  const { id, token } = useParams()
  const navigate = useNavigate()
  const toast = useToast()
  
  const [isVerifying, setIsVerifying] = useState(true)
  const [verificationStatus, setVerificationStatus] = useState(null) // 'success', 'error', 'expired'
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (id && token) {
      handleVerification()
    } else {
      setVerificationStatus('error')
      setMessage('Enlace de verificación inválido')
      setIsVerifying(false)
    }
  }, [id, token])

  const handleVerification = async () => {
    try {
      console.log('🔄 Verificando email...', { id, token })
      
      const response = await verifyEmail(id, token)
      
      if (response.success) {
        setVerificationStatus('success')
        setMessage('¡Tu correo ha sido verificado exitosamente!')
        
        toast({
          title: 'Verificación exitosa',
          description: 'Tu cuenta ha sido verificada. Ya puedes iniciar sesión.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      } else {
        setVerificationStatus('error')
        setMessage(response.message || 'Error al verificar el correo')
      }
    } catch (error) {
      console.error('❌ Error en verificación:', error)
      
      const errorMessage = error.response?.data?.message || error.message || 'Error al verificar el correo'
      
      if (errorMessage.includes('expirado') || errorMessage.includes('expired')) {
        setVerificationStatus('expired')
        setMessage('El enlace de verificación ha expirado. Se ha enviado un nuevo enlace a tu correo.')
      } else {
        setVerificationStatus('error')
        setMessage(errorMessage)
      }
      
      toast({
        title: 'Error de verificación',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleGoToLogin = () => {
    navigate('/login')
  }

  const handleGoToHome = () => {
    navigate('/')
  }

  if (isVerifying) {
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="gray.50"
      >
        <VStack spacing={6}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text fontSize="lg" color="gray.600">
            Verificando tu correo electrónico...
          </Text>
        </VStack>
      </Box>
    )
  }

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      px={4}
    >
      <Box
        bg="white"
        p={8}
        borderRadius="lg"
        boxShadow="xl"
        w="full"
        maxW="500px"
        textAlign="center"
      >
        <VStack spacing={6}>
          {verificationStatus === 'success' && (
            <Alert status="success" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle>¡Verificación exitosa!</AlertTitle>
                <AlertDescription>
                  {message}
                </AlertDescription>
              </Box>
            </Alert>
          )}

          {verificationStatus === 'error' && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle>Error de verificación</AlertTitle>
                <AlertDescription>
                  {message}
                </AlertDescription>
              </Box>
            </Alert>
          )}

          {verificationStatus === 'expired' && (
            <Alert status="warning" borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle>Enlace expirado</AlertTitle>
                <AlertDescription>
                  {message}
                </AlertDescription>
              </Box>
            </Alert>
          )}

          <VStack spacing={4} w="full">
            {verificationStatus === 'success' && (
              <>
                <Text fontSize="lg" color="gray.700">
                  Ya puedes iniciar sesión con tu cuenta verificada.
                </Text>
                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={handleGoToLogin}
                  w="full"
                >
                  Ir a Iniciar Sesión
                </Button>
              </>
            )}

            {(verificationStatus === 'error' || verificationStatus === 'expired') && (
              <>
                <Text fontSize="lg" color="gray.700">
                  Por favor, intenta registrarte nuevamente o contacta al soporte.
                </Text>
                <VStack spacing={3} w="full">
                  <Button
                    colorScheme="blue"
                    size="lg"
                    onClick={handleGoToLogin}
                    w="full"
                  >
                    Ir a Iniciar Sesión
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleGoToHome}
                    w="full"
                  >
                    Ir al Inicio
                  </Button>
                </VStack>
              </>
            )}
          </VStack>
        </VStack>
      </Box>
    </Box>
  )
}

export default EmailVerification
