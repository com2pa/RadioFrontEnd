import React from 'react'
import {
  Box,
  Container,
  VStack,
  Text,
  Heading,
  useColorModeValue,
  Divider,
  List,
  ListItem,
  ListIcon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Icon
} from '@chakra-ui/react'
import { FiCheck, FiSettings, FiShield, FiFile } from 'react-icons/fi'
import PageWithFooter from '../../components/layout/PageWithFooter'
import PublicLayout from '../../components/layout/PublicLayout'
import SEO from '../../components/SEO'

const Cookies = () => {
  // Colores oficiales de OXÍGENO 88.1FM
  const brandRed = '#E50000'      // Rojo Vibrante
  const brandDarkGray = '#333333' // Gris Oscuro
  const brandBlack = '#000000'    // Negro
  const brandWhite = '#FFFFFF'    // Blanco Puro
  const brandLightGray = '#CCCCCC' // Gris Claro

  const bgColor = useColorModeValue(brandWhite, brandDarkGray)
  const textColor = useColorModeValue(brandDarkGray, brandLightGray)
  const headingColor = useColorModeValue(brandDarkGray, brandWhite)
  const accentColor = brandRed

  const cookieTypes = [
    {
      tipo: 'Esenciales',
      descripcion: 'Necesarias para el funcionamiento básico del sitio',
      duracion: 'Sesión',
      ejemplo: 'Autenticación, preferencias de idioma'
    },
    {
      tipo: 'Analíticas',
      descripcion: 'Nos ayudan a entender cómo usas el sitio',
      duracion: '2 años',
      ejemplo: 'Google Analytics, métricas de uso'
    },
    {
      tipo: 'Funcionales',
      descripcion: 'Mejoran la funcionalidad y personalización',
      duracion: '1 año',
      ejemplo: 'Preferencias de usuario, configuraciones'
    },
    {
      tipo: 'Publicitarias',
      descripcion: 'Utilizadas para mostrar anuncios relevantes',
      duracion: '6 meses',
      ejemplo: 'Anuncios personalizados, remarketing'
    }
  ]

  return (
    <PublicLayout>
      <SEO
        title="Política de Cookies - Oxígeno 88.1 FM"
        description="Política de cookies de Oxígeno Radio 88.1 FM. Información sobre el uso de cookies en nuestro sitio web, tipos de cookies y cómo gestionar tus preferencias."
        keywords="cookies Oxígeno Radio, política cookies, gestión cookies, preferencias cookies, cookies sitio web"
      />
      <PageWithFooter>
        <Box bg={bgColor} py={12}>
          <Container maxW="container.lg" px={4}>
            <VStack spacing={8} align="stretch">
              {/* Header */}
              <VStack spacing={4} textAlign="center">
                <Heading as="h1" size="2xl" color={headingColor}>
                  <Icon as={FiFile} mr={2} />
                  Política de Cookies
                </Heading>
                <Text fontSize="lg" color={textColor}>
                  Última actualización: {new Date().toLocaleDateString('es-ES')}
                </Text>
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>¿Qué son las cookies?</AlertTitle>
                    <AlertDescription>
                      Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo cuando visitas nuestro sitio web.
                    </AlertDescription>
                  </Box>
                </Alert>
              </VStack>

              <Divider />

              {/* Contenido */}
              <VStack spacing={6} align="stretch">
                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    <Icon as={FiFile} mr={2} />
                    1. ¿Qué son las Cookies?
                  </Heading>
                  <Text color={textColor} lineHeight="tall">
                    Las cookies son pequeños archivos de texto que se almacenan en tu dispositivo (ordenador, 
                    tablet o móvil) cuando visitas nuestro sitio web. Estas cookies nos permiten reconocer tu 
                    dispositivo y recordar información sobre tu visita, como tu idioma preferido y otras 
                    configuraciones, lo que puede hacer que tu próxima visita sea más fácil y el sitio te 
                    resulte más útil.
                  </Text>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    <Icon as={FiSettings} mr={2} />
                    2. Tipos de Cookies que Utilizamos
                  </Heading>
                  <Text color={textColor} mb={4}>
                    Utilizamos diferentes tipos de cookies en nuestro sitio web:
                  </Text>
                  
                  <TableContainer>
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          <Th color={headingColor}>Tipo</Th>
                          <Th color={headingColor}>Descripción</Th>
                          <Th color={headingColor}>Duración</Th>
                          <Th color={headingColor}>Ejemplo</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {cookieTypes.map((cookie, index) => (
                          <Tr key={index}>
                            <Td color={textColor} fontWeight="bold">{cookie.tipo}</Td>
                            <Td color={textColor}>{cookie.descripcion}</Td>
                            <Td color={textColor}>{cookie.duracion}</Td>
                            <Td color={textColor}>{cookie.ejemplo}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    <Icon as={FiCheck} mr={2} />
                    3. Cookies Específicas que Utilizamos
                  </Heading>
                  <Text color={textColor} mb={4}>
                    A continuación, detallamos las cookies específicas que utilizamos en nuestro sitio:
                  </Text>
                  <List spacing={3} color={textColor}>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      <strong>oxi_session:</strong> Cookie de sesión para mantener tu sesión activa
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      <strong>oxi_preferences:</strong> Almacena tus preferencias de audio y configuración
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      <strong>oxi_analytics:</strong> Recopila datos anónimos sobre el uso del sitio
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      <strong>oxi_consent:</strong> Recuerda tu consentimiento para el uso de cookies
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      <strong>_ga, _gid:</strong> Cookies de Google Analytics para análisis de tráfico
                    </ListItem>
                  </List>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    <Icon as={FiSettings} mr={2} />
                    4. Cómo Gestionar las Cookies
                  </Heading>
                  <Text color={textColor} mb={4}>
                    Tienes varias opciones para gestionar las cookies:
                  </Text>
                  <List spacing={2} color={textColor}>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      <strong>Configuración del navegador:</strong> Puedes configurar tu navegador para rechazar cookies
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      <strong>Banner de cookies:</strong> Utiliza nuestro banner para aceptar o rechazar cookies no esenciales
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      <strong>Herramientas de terceros:</strong> Utiliza herramientas como Ghostery o AdBlock Plus
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      <strong>Configuración de privacidad:</strong> Ajusta la configuración en tu cuenta de usuario
                    </ListItem>
                  </List>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    <Icon as={FiShield} mr={2} />
                    5. Cookies de Terceros
                  </Heading>
                  <Text color={textColor} lineHeight="tall">
                    Nuestro sitio web puede contener cookies de terceros, como Google Analytics, redes sociales 
                    o servicios de publicidad. Estas cookies están sujetas a las políticas de privacidad de 
                    esos terceros. Te recomendamos revisar sus políticas de cookies para obtener más información.
                  </Text>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    6. Impacto de Deshabilitar Cookies
                  </Heading>
                  <Text color={textColor} lineHeight="tall">
                    Si decides deshabilitar las cookies, algunas funcionalidades de nuestro sitio web pueden 
                    verse afectadas. Por ejemplo, es posible que no puedas mantener tu sesión iniciada, 
                    que tus preferencias no se guarden, o que no podamos personalizar tu experiencia de 
                    escucha según tus gustos musicales.
                  </Text>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    7. Actualizaciones de esta Política
                  </Heading>
                  <Text color={textColor} lineHeight="tall">
                    Podemos actualizar esta política de cookies ocasionalmente para reflejar cambios en 
                    nuestras prácticas o por otras razones operativas, legales o regulatorias. Te 
                    recomendamos revisar esta página periódicamente para mantenerte informado sobre 
                    nuestro uso de cookies.
                  </Text>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    8. Contacto
                  </Heading>
                  <Text color={textColor} lineHeight="tall">
                    Si tienes preguntas sobre nuestra política de cookies o deseas ejercer tus derechos 
                    relacionados con el procesamiento de datos, puedes contactarnos en: cookies@oxiradio.com 
                    o a través de nuestro formulario de contacto.
                  </Text>
                </Box>

                <Alert status="success" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Tu Control</AlertTitle>
                    <AlertDescription>
                      Recuerda que siempre puedes cambiar tus preferencias de cookies en cualquier momento 
                      utilizando la configuración de tu navegador o nuestro centro de preferencias.
                    </AlertDescription>
                  </Box>
                </Alert>
              </VStack>
            </VStack>
          </Container>
        </Box>
      </PageWithFooter>
    </PublicLayout>
  )
}

export default Cookies
