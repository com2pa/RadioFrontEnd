import React from 'react'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  Badge,
  Divider,
  HStack,
  Icon,
  useColorMode
} from '@chakra-ui/react'
import { useLocation } from 'react-router-dom'

const DynamicPage = ({ 
  title, 
  description, 
  content, 
  metadata = {} 
}) => {
  const location = useLocation()
  const { colorMode } = useColorMode()
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  // Usar título del prop o generar desde la ruta
  const pageTitle = title || location.pathname.charAt(1).toUpperCase() + location.pathname.slice(2)
  const pageDescription = description || `Página ${pageTitle} - Configurada dinámicamente desde el dashboard administrativo.`

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Container maxW="container.lg" px={4}>
        <VStack spacing={8} align="stretch">
          {/* Header de la página */}
          <Box
            bg={cardBg}
            p={8}
            borderRadius="lg"
            boxShadow="md"
            border="1px"
            borderColor={borderColor}
          >
            <VStack spacing={4} textAlign="center">
              <Heading as="h1" size="2xl" color="blue.600">
                {pageTitle}
              </Heading>
              <Text fontSize="lg" color={textColor} maxW="2xl">
                {pageDescription}
              </Text>
              
              {/* Metadatos de la página */}
              <HStack spacing={4} wrap="wrap" justify="center">
                <Badge colorScheme="blue" variant="subtle">
                  Página Dinámica
                </Badge>
                <Badge colorScheme="green" variant="subtle">
                  Ruta: {location.pathname}
                </Badge>
                {metadata.keywords && (
                  <Badge colorScheme="purple" variant="subtle">
                    {metadata.keywords}
                  </Badge>
                )}
              </HStack>
            </VStack>
          </Box>

          {/* Contenido de la página */}
          <Box
            bg={cardBg}
            p={8}
            borderRadius="lg"
            boxShadow="md"
            border="1px"
            borderColor={borderColor}
          >
            {content ? (
              <Box>
                {content}
              </Box>
            ) : (
              <VStack spacing={6} align="center">
                <Text fontSize="lg" color={textColor} textAlign="center">
                  Esta página se generó automáticamente basada en la configuración del menú.
                </Text>
                
                <Divider />
                
                <VStack spacing={4} align="center">
                  <Text fontSize="md" color={textColor} textAlign="center">
                    Para personalizar el contenido de esta página:
                  </Text>
                  <VStack spacing={2} align="start" fontSize="sm" color={textColor}>
                    <Text>1. Accede al dashboard administrativo</Text>
                    <Text>2. Ve a la sección de páginas</Text>
                    <Text>3. Edita el contenido de "{pageTitle}"</Text>
                    <Text>4. Guarda los cambios</Text>
                  </VStack>
                </VStack>
              </VStack>
            )}
          </Box>

          {/* Footer de la página */}
          <Box
            bg={cardBg}
            p={6}
            borderRadius="lg"
            boxShadow="sm"
            border="1px"
            borderColor={borderColor}
            textAlign="center"
          >
            <VStack spacing={2}>
              <Text fontSize="sm" color={textColor}>
                Página generada dinámicamente
              </Text>
              <Text fontSize="xs" color={textColor}>
                Configurada desde el dashboard administrativo
              </Text>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default DynamicPage
