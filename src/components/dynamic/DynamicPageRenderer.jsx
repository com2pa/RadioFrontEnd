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
  Button,
  Link,
  Image,
  List,
  ListItem,
  ListIcon,
  Code,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription
} from '@chakra-ui/react'
import { useLocation } from 'react-router-dom'
import { useMenu } from '../../hooks/useMenu'

const DynamicPageRenderer = () => {
  const location = useLocation()
  const { menuItems } = useMenu()
  const { colorMode } = useColorMode()
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  // Buscar información de la página actual en el menú
  const currentPage = menuItems.find(item => item.href === location.pathname)
  
  // Generar título y descripción
  const pageTitle = currentPage?.label || location.pathname.charAt(1).toUpperCase() + location.pathname.slice(2)
  const pageDescription = `Página ${pageTitle} - Configurada dinámicamente desde el dashboard administrativo.`

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
                <Badge colorScheme="purple" variant="subtle">
                  {currentPage ? 'Configurada' : 'Auto-generada'}
                </Badge>
              </HStack>
            </VStack>
          </Box>

          {/* Contenido principal */}
          <Box
            bg={cardBg}
            p={8}
            borderRadius="lg"
            boxShadow="md"
            border="1px"
            borderColor={borderColor}
          >
            <VStack spacing={6} align="stretch">
              {/* Información de la página */}
              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Página Dinámica</AlertTitle>
                  <AlertDescription>
                    Esta página se generó automáticamente basada en la configuración del menú.
                  </AlertDescription>
                </Box>
              </Alert>

              {/* Contenido por defecto */}
              <VStack spacing={6} align="center">
                <Text fontSize="lg" color={textColor} textAlign="center">
                  Bienvenido a la página <Code>{pageTitle}</Code>
                </Text>
                
                <Divider />
                
                <VStack spacing={4} align="center">
                  <Text fontSize="md" color={textColor} textAlign="center">
                    Para personalizar el contenido de esta página:
                  </Text>
                  
                  <List spacing={2} align="start" fontSize="sm" color={textColor}>
                    <ListItem>
                      <ListIcon as={Badge} colorScheme="blue" />
                      Accede al dashboard administrativo
                    </ListItem>
                    <ListItem>
                      <ListIcon as={Badge} colorScheme="green" />
                      Ve a la sección de páginas
                    </ListItem>
                    <ListItem>
                      <ListIcon as={Badge} colorScheme="purple" />
                      Edita el contenido de "{pageTitle}"
                    </ListItem>
                    <ListItem>
                      <ListIcon as={Badge} colorScheme="orange" />
                      Guarda los cambios
                    </ListItem>
                  </List>
                </VStack>

                {/* Botones de acción */}
                <HStack spacing={4} wrap="wrap" justify="center">
                  <Button as={Link} href="/" colorScheme="blue" variant="outline">
                    Volver al Inicio
                  </Button>
                  <Button as={Link} href="/contact" colorScheme="green" variant="outline">
                    Contacto
                  </Button>
                </HStack>
              </VStack>
            </VStack>
          </Box>

          {/* Información técnica */}
          <Box
            bg={cardBg}
            p={6}
            borderRadius="lg"
            boxShadow="sm"
            border="1px"
            borderColor={borderColor}
          >
            <VStack spacing={4} align="center">
              <Text fontSize="sm" fontWeight="semibold" color={textColor}>
                Información Técnica
              </Text>
              <VStack spacing={2} fontSize="xs" color={textColor}>
                <Text>Ruta: <Code>{location.pathname}</Code></Text>
                <Text>Página: <Code>{pageTitle}</Code></Text>
                <Text>Estado: <Code>{currentPage ? 'Configurada' : 'Auto-generada'}</Code></Text>
                <Text>Modo: <Code>{colorMode}</Code></Text>
              </VStack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default DynamicPageRenderer

















