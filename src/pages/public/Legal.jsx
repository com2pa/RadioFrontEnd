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
import { FiFileText, FiCheck, FiMapPin, FiPhone, FiMail } from 'react-icons/fi'
import PageWithFooter from '../../components/layout/PageWithFooter'
import PublicLayout from '../../components/layout/PublicLayout'

const Legal = () => {
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
                  <Icon as={FiFileText} mr={2} />
                  Aviso Legal
                </Heading>
                <Text fontSize="lg" color={textColor}>
                  Última actualización: {new Date().toLocaleDateString('es-ES')}
                </Text>
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Información Legal</AlertTitle>
                    <AlertDescription>
                      Este aviso legal regula el uso del sitio web y servicios de OXÍ Radio 88.1 FM.
                    </AlertDescription>
                  </Box>
                </Alert>
              </VStack>

              <Divider />

              {/* Contenido */}
              <VStack spacing={6} align="stretch">
                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    <Icon as={FiFileText} mr={2} />
                    1. Datos de la Empresa
                  </Heading>
                  <Text color={textColor} mb={4}>
                    En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la 
                    Sociedad de la Información y de Comercio Electrónico, se informa de los siguientes datos:
                  </Text>
                  <List spacing={2} color={textColor}>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      <strong>Denominación social:</strong> OXÍ Radio 88.1 FM
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      <strong>Domicilio social:</strong> Barquisimeto, Estado Lara, Venezuela
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      <strong>Frecuencia:</strong> 88.1 FM
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      <strong>Correo electrónico:</strong> info@oxiradio.com
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      <strong>Sitio web:</strong> www.oxiradio.com
                    </ListItem>
                  </List>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    2. Objeto y Condiciones de Uso
                  </Heading>
                  <Text color={textColor} lineHeight="tall">
                    El presente aviso legal regula el uso del sitio web www.oxiradio.com (en adelante, el sitio web), 
                    que es titularidad de OXÍ Radio 88.1 FM. La navegación por el sitio web atribuye la condición 
                    de usuario del mismo e implica la aceptación plena y sin reservas de todas y cada una de las 
                    disposiciones incluidas en este Aviso Legal.
                  </Text>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    3. Servicios Ofrecidos
                  </Heading>
                  <Text color={textColor} mb={4}>
                    A través del sitio web, OXÍ Radio 88.1 FM ofrece a los usuarios la posibilidad de acceder a:
                  </Text>
                  <List spacing={2} color={textColor}>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      Transmisión de radio en vivo por internet
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      Programación y horarios de emisión
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      Información sobre programas y conductores
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      Noticias y eventos de la región
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      Podcasts y contenido multimedia
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCheck} color={accentColor} />
                      Interacción con la audiencia
                    </ListItem>
                  </List>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    4. Propiedad Intelectual e Industrial
                  </Heading>
                  <Text color={textColor} lineHeight="tall">
                    Todos los contenidos del sitio web, entendiendo por estos a título enunciativo los textos, 
                    fotografías, gráficos, imágenes, iconos, tecnología, software, links y demás contenidos 
                    audiovisuales o sonoros, así como su diseño gráfico y códigos fuente, constituyen una 
                    obra cuya propiedad pertenece a OXÍ Radio 88.1 FM, sin que puedan entenderse cedidos 
                    al usuario ninguno de los derechos de explotación sobre los mismos.
                  </Text>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    5. Derechos de Autor Musical
                  </Heading>
                  <Text color={textColor} lineHeight="tall">
                    OXÍ Radio 88.1 FM respeta los derechos de autor y propiedad intelectual de todos los 
                    artistas y compositores. La música transmitida cumple con las licencias correspondientes 
                    y está sujeta a los acuerdos con las sociedades de gestión de derechos de autor. 
                    Cualquier reclamación relacionada con derechos de autor debe dirigirse a: 
                    derechos@oxiradio.com
                  </Text>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    6. Exclusión de Garantías y Responsabilidad
                  </Heading>
                  <Text color={textColor} lineHeight="tall">
                    OXÍ Radio 88.1 FM no se hace responsable de la información contenida en el sitio web, 
                    ni de los daños y perjuicios que puedan derivarse de su uso. La información contenida 
                    en el sitio web tiene carácter meramente informativo y no constituye asesoramiento de 
                    ningún tipo. El acceso al sitio web no implica obligación de OXÍ Radio 88.1 FM de 
                    controlar la ausencia de virus, gusanos o cualquier otro elemento informático dañino.
                  </Text>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    7. Política de Enlaces
                  </Heading>
                  <Text color={textColor} lineHeight="tall">
                    El sitio web puede contener enlaces a otros sitios web que consideramos de interés para 
                    nuestros usuarios. OXÍ Radio 88.1 FM no ejerce ningún control sobre dichos sitios y 
                    contenidos. En ningún caso OXÍ Radio 88.1 FM asumirá responsabilidad alguna por los 
                    contenidos de algún enlace perteneciente a un sitio web ajeno, ni garantizará la 
                    disponibilidad técnica, calidad, fiabilidad, exactitud, amplitud, veracidad, validez 
                    y constitucionalidad de cualquier material o información contenida en ninguno de dichos 
                    enlaces u otros sitios web.
                  </Text>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    8. Protección de Datos
                  </Heading>
                  <Text color={textColor} lineHeight="tall">
                    En cumplimiento de lo establecido en la Ley Orgánica de Protección de Datos de Carácter 
                    Personal, OXÍ Radio 88.1 FM informa que los datos personales que nos proporcione serán 
                    incorporados a un fichero automatizado, siendo responsable del mismo OXÍ Radio 88.1 FM. 
                    Para más información, consulte nuestra Política de Privacidad.
                  </Text>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    9. Legislación Aplicable y Jurisdicción
                  </Heading>
                  <Text color={textColor} lineHeight="tall">
                    Para la resolución de todas las controversias o cuestiones relacionadas con el presente 
                    sitio web o de las actividades en él desarrolladas, será de aplicación la legislación 
                    venezolana, a la que se someten expresamente las partes, siendo competentes para la 
                    resolución de todos los conflictos derivados o relacionados con su uso los Juzgados y 
                    Tribunales de Barquisimeto, Estado Lara.
                  </Text>
                </Box>

                <Box>
                  <Heading as="h2" size="lg" color={headingColor} mb={4}>
                    <Icon as={FiMapPin} mr={2} />
                    10. Información de Contacto
                  </Heading>
                  <Text color={textColor} mb={4}>
                    Para cualquier consulta o reclamación relacionada con este aviso legal, puede contactarnos:
                  </Text>
                  <List spacing={2} color={textColor}>
                    <ListItem>
                      <ListIcon as={FiMail} color={accentColor} />
                      <strong>Correo electrónico:</strong> legal@oxiradio.com
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiPhone} color={accentColor} />
                      <strong>Teléfono:</strong> +58 251 123 4567
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiMapPin} color={accentColor} />
                      <strong>Dirección:</strong> Barquisimeto, Estado Lara, Venezuela
                    </ListItem>
                  </List>
                </Box>

                <Alert status="success" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>Compromiso Legal</AlertTitle>
                    <AlertDescription>
                      OXÍ Radio 88.1 FM se compromete a cumplir con toda la legislación aplicable y 
                      a mantener los más altos estándares de transparencia y legalidad en todas sus operaciones.
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

export default Legal
