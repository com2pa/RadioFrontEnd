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
  ListIcon
} from '@chakra-ui/react'
import { FiCheck } from 'react-icons/fi'
import PageWithFooter from '../../components/layout/PageWithFooter'
import PublicLayout from '../../components/layout/PublicLayout'

const Terms = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const textColor = useColorModeValue('gray.700', 'gray.200')
  const headingColor = useColorModeValue('gray.800', 'white')
  const accentColor = useColorModeValue('blue.500', 'blue.300')

  return (
    <PublicLayout>
      <PageWithFooter>
        <Box bg={bgColor} py={12}>
          <Container maxW="container.lg" px={4}>
            <VStack spacing={8} align="stretch">
              {/* Header */}
              <VStack spacing={4} textAlign="center">
                <Heading as="h1" size="2xl" color={headingColor}>
                  Términos y Condiciones
                </Heading>
                <Text fontSize="lg" color={textColor}>
                  Última actualización: {new Date().toLocaleDateString('es-ES')}
                </Text>
              </VStack>

              <Divider />

              {/* Contenido */}
              <VStack spacing={6} align="stretch">
                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    1. Información General
                  </Heading>
                  <Text color={textColor} lineHeight="tall">
                    Bienvenido a OXÍ Radio 88.1 FM. Estos términos y condiciones rigen el uso de nuestro sitio web, 
                    servicios de streaming y cualquier contenido proporcionado por OXÍ Radio. Al acceder y utilizar 
                    nuestros servicios, usted acepta cumplir con estos términos.
                  </Text>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    2. Uso del Servicio
                  </Heading>
                  <Text color={textColor} mb={4}>
                    Nuestros servicios incluyen:
                  </Text>
                  <List spacing={2} color={textColor}>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      Transmisión de radio en vivo por internet
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      Contenido de audio y podcasts
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      Información sobre programación
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      Interacción con la audiencia
                    </ListItem>
                  </List>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    3. Condiciones de Uso
                  </Heading>
                  <Text color={textColor} mb={4}>
                    Al utilizar nuestros servicios, usted se compromete a:
                  </Text>
                  <List spacing={2} color={textColor}>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      No utilizar el servicio para fines ilegales o no autorizados
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      Respetar los derechos de propiedad intelectual
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      No interferir con el funcionamiento del servicio
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      Proporcionar información veraz al registrarse
                    </ListItem>
                  </List>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    4. Propiedad Intelectual
                  </Heading>
                  <Text color={textColor} lineHeight="tall">
                    Todo el contenido de OXÍ Radio, incluyendo pero no limitado a música, programas, logos, 
                    marcas comerciales y material gráfico, está protegido por derechos de autor y otras leyes 
                    de propiedad intelectual. El uso no autorizado de este contenido está estrictamente prohibido.
                  </Text>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    5. Limitación de Responsabilidad
                  </Heading>
                  <Text color={textColor} lineHeight="tall">
                    OXÍ Radio no será responsable por interrupciones del servicio, pérdida de datos, o cualquier 
                    daño directo o indirecto que pueda resultar del uso de nuestros servicios. Nos esforzamos por 
                    mantener un servicio de alta calidad, pero no podemos garantizar la disponibilidad continua.
                  </Text>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    6. Modificaciones
                  </Heading>
                  <Text color={textColor} lineHeight="tall">
                    Nos reservamos el derecho de modificar estos términos y condiciones en cualquier momento. 
                    Las modificaciones entrarán en vigor inmediatamente después de su publicación en nuestro sitio web. 
                    Es responsabilidad del usuario revisar periódicamente estos términos.
                  </Text>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    7. Contacto
                  </Heading>
                  <Text color={textColor} lineHeight="tall">
                    Si tiene preguntas sobre estos términos y condiciones, puede contactarnos a través de 
                    nuestro formulario de contacto o enviando un correo electrónico a legal@oxiradio.com
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

export default Terms
