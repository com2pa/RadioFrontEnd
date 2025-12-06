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
  Icon
} from '@chakra-ui/react'
import { FiShield, FiCheck, FiEye, FiLock } from 'react-icons/fi'
import PageWithFooter from '../../components/layout/PageWithFooter'
import PublicLayout from '../../components/layout/PublicLayout'
import SEO from '../../components/SEO'

const Privacy = () => {
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

  return (
    <PublicLayout>
      <SEO
        title="Política de Privacidad - Oxígeno 88.1 FM"
        description="Política de privacidad de Oxígeno Radio 88.1 FM. Conoce cómo protegemos y gestionamos tus datos personales, tus derechos de privacidad y nuestra política de cookies."
        keywords="privacidad Oxígeno Radio, protección datos, política privacidad, datos personales, GDPR, privacidad radio"
      />
      <PageWithFooter>
        <Box bg={bgColor} py={12}>
          <Container maxW="container.lg" px={4}>
            <VStack spacing={8} align="stretch">
              {/* Header */}
              <VStack spacing={4} textAlign="center">
                <Heading as="h1" size="2xl" color={headingColor}>
                  Política de Privacidad
                </Heading>
                <Text fontSize="lg" color={textColor}>
                  Última actualización: {new Date().toLocaleDateString('es-ES')}
                </Text>
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Tu privacidad es importante para nosotros</AlertTitle>
                    <AlertDescription>
                      Esta política explica cómo recopilamos, usamos y protegemos tu información personal.
                    </AlertDescription>
                  </Box>
                </Alert>
              </VStack>

              <Divider />

              {/* Contenido */}
              <VStack spacing={6} align="stretch">
                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    <Icon as={FiShield} mr={2} />
                    1. Información que Recopilamos
                  </Heading>
                  <Text color={textColor} mb={4}>
                    Recopilamos diferentes tipos de información cuando utilizas nuestros servicios:
                  </Text>
                  <List spacing={2} color={textColor}>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      <strong>Información personal:</strong> Nombre, email, teléfono (cuando te registras)
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      <strong>Datos de uso:</strong> Páginas visitadas, tiempo de escucha, preferencias
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      <strong>Información técnica:</strong> Dirección IP, tipo de navegador, dispositivo
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      <strong>Interacciones:</strong> Comentarios, mensajes, participación en programas
                    </ListItem>
                  </List>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    <Icon as={FiEye} mr={2} />
                    2. Cómo Utilizamos tu Información
                  </Heading>
                  <Text color={textColor} mb={4}>
                    Utilizamos tu información para:
                  </Text>
                  <List spacing={2} color={textColor}>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      Proporcionar y mejorar nuestros servicios de radio
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      Personalizar tu experiencia de escucha
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      Comunicarnos contigo sobre programación y eventos
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      Analizar el uso de nuestros servicios para mejorarlos
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      Cumplir con obligaciones legales y regulatorias
                    </ListItem>
                  </List>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    <Icon as={FiLock} mr={2} />
                    3. Protección de Datos
                  </Heading>
                  <Text color={textColor} lineHeight="tall">
                    Implementamos medidas de seguridad técnicas y organizativas para proteger tu información 
                    personal contra acceso no autorizado, alteración, divulgación o destrucción. Esto incluye 
                    encriptación, firewalls y controles de acceso estrictos.
                  </Text>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    4. Compartir Información
                  </Heading>
                  <Text color={textColor} mb={4}>
                    No vendemos, alquilamos ni compartimos tu información personal con terceros, excepto en los siguientes casos:
                  </Text>
                  <List spacing={2} color={textColor}>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      Con tu consentimiento explícito
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      Para cumplir con requerimientos legales
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      Con proveedores de servicios que nos ayudan a operar (bajo acuerdos de confidencialidad)
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      En caso de fusión, adquisición o venta de activos
                    </ListItem>
                  </List>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    5. Cookies y Tecnologías Similares
                  </Heading>
                  <Text color={textColor} lineHeight="tall">
                    Utilizamos cookies y tecnologías similares para mejorar tu experiencia, recordar tus preferencias 
                    y analizar el uso de nuestro sitio. Puedes controlar el uso de cookies a través de la configuración 
                    de tu navegador. Para más información, consulta nuestra Política de Cookies.
                  </Text>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    6. Tus Derechos
                  </Heading>
                  <Text color={textColor} mb={4}>
                    Tienes derecho a:
                  </Text>
                  <List spacing={2} color={textColor}>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      Acceder a la información que tenemos sobre ti
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      Corregir información inexacta o incompleta
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      Solicitar la eliminación de tus datos personales
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      Oponerte al procesamiento de tus datos
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      Retirar tu consentimiento en cualquier momento
                    </ListItem>
                  </List>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    7. Retención de Datos
                  </Heading>
                  <Text color={textColor} lineHeight="tall">
                    Conservamos tu información personal solo durante el tiempo necesario para cumplir con los 
                    propósitos descritos en esta política, a menos que la ley requiera un período de retención 
                    más largo. Los datos de uso y estadísticas pueden conservarse por períodos más largos en 
                    forma anonimizada.
                  </Text>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    8. Menores de Edad
                  </Heading>
                  <Text color={textColor} lineHeight="tall">
                    Nuestros servicios están dirigidos a personas mayores de 13 años. No recopilamos 
                    intencionalmente información personal de menores de 13 años. Si descubrimos que hemos 
                    recopilado información de un menor, la eliminaremos inmediatamente.
                  </Text>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    9. Cambios a esta Política
                  </Heading>
                  <Text color={textColor} lineHeight="tall">
                    Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos sobre 
                    cambios significativos publicando la nueva política en nuestro sitio web y actualizando 
                    la fecha de "última actualización". Te recomendamos revisar esta política periódicamente.
                  </Text>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    10. Contacto
                  </Heading>
                  <Text color={textColor} lineHeight="tall">
                    Si tienes preguntas sobre esta política de privacidad o deseas ejercer tus derechos, 
                    puedes contactarnos en: privacy@oxiradio.com o a través de nuestro formulario de contacto.
                  </Text>
                </Box>
              </VStack>
            </VStack>
          </Container>
        </Box>
      </PageWithFooter>
    </PublicLayout>
  )
}

export default Privacy
