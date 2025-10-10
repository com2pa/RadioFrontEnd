import React from 'react'
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Heading,
  Image,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  Icon,
  Badge,
  Divider,
  useColorModeValue,
  SimpleGrid,
  Avatar,
  AvatarGroup,
  Button,
  Link as ChakraLink
} from '@chakra-ui/react'
import {
  FiRadio,
  FiUsers,
  FiHeart,
  FiAward,
  FiMapPin,
  FiClock,
  FiStar,
  FiTrendingUp,
  FiMusic,
  FiMic,
  FiHeadphones,
  FiGlobe
} from 'react-icons/fi'
import PageWithFooter from '../../components/layout/PageWithFooter'
import PublicLayout from '../../components/layout/PublicLayout'

const About = () => {
  const bgGradient = useColorModeValue(
    'linear(to-br, blue.50, purple.50, pink.50)',
    'linear(to-br, blue.900, purple.900, pink.900)'
  )
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.700', 'gray.200')
  const headingColor = useColorModeValue('gray.800', 'white')
  const accentColor = useColorModeValue('blue.500', 'blue.300')

  return (
    <PublicLayout>
      <PageWithFooter>
      {/* Hero Section */}
      <Box
        bg={bgGradient}
        py={20}
        position="relative"
        overflow="hidden"
      >
        <Container maxW="container.xl">
          <VStack spacing={8} textAlign="center">
            <Badge
              colorScheme="blue"
              variant="subtle"
              px={4}
              py={2}
              borderRadius="full"
              fontSize="sm"
              fontWeight="bold"
            >
              <Icon as={FiRadio} mr={2} />
              OXÍ Radio 88.1 FM
            </Badge>
            
            <Heading
              as="h1"
              size="4xl"
              bgGradient="linear(to-r, blue.600, purple.600, pink.600)"
              bgClip="text"
              fontWeight="bold"
              lineHeight="shorter"
            >
              Quiénes Somos
            </Heading>
            
            <Text
              fontSize="xl"
              color={textColor}
              maxW="3xl"
              lineHeight="tall"
            >
              Somos la voz de Barquisimeto, conectando corazones y mentes a través de 
              la música, la información y el entretenimiento que nos define como ciudad.
            </Text>

            <HStack spacing={8} mt={8}>
              <VStack>
                <Icon as={FiMapPin} boxSize={8} color={accentColor} />
                <Text fontWeight="bold" color={headingColor}>Barquisimeto</Text>
                <Text fontSize="sm" color={textColor}>Nuestra Ciudad</Text>
              </VStack>
              <VStack>
                <Icon as={FiRadio} boxSize={8} color={accentColor} />
                <Text fontWeight="bold" color={headingColor}>88.1 FM</Text>
                <Text fontSize="sm" color={textColor}>Nuestra Frecuencia</Text>
              </VStack>
              <VStack>
                <Icon as={FiUsers} boxSize={8} color={accentColor} />
                <Text fontWeight="bold" color={headingColor}>+50K</Text>
                <Text fontSize="sm" color={textColor}>Oyentes Diarios</Text>
              </VStack>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Misión y Visión Section */}
      <Box py={20} bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <VStack spacing={4} textAlign="center">
              <Heading as="h2" size="2xl" color={headingColor}>
                Nuestra Filosofía
              </Heading>
              <Text fontSize="lg" color={textColor} maxW="2xl">
                Creemos en el poder de la radio para transformar vidas y construir comunidad
              </Text>
            </VStack>

            <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8} w="full">
              {/* Misión */}
              <Card bg={cardBg} shadow="xl" borderRadius="xl" overflow="hidden">
                <CardHeader bgGradient="linear(to-r, blue.500, blue.600)" color="white">
                  <HStack>
                    <Icon as={FiHeart} boxSize={6} />
                    <Heading size="lg">Nuestra Misión</Heading>
                  </HStack>
                </CardHeader>
                <CardBody p={8}>
                  <Text
                    fontSize="lg"
                    lineHeight="tall"
                    color={textColor}
                    textAlign="justify"
                  >
                    Disfrutar de los placeres cotidianos de nuestra audiencia y ser parte de su convivencia, 
                    con entretenimiento que educa, informa, inspira y orienta de manera sana, entretenida e 
                    informal de acuerdo a nuestra filosofía de comunicación en difundir actitud positiva y 
                    motivadora en el día a día de nuestros oyentes, garantizando los deberes y derechos de 
                    nuestra audiencia, colaboradores, clientes e instituciones públicas y privadas.
                  </Text>
                </CardBody>
              </Card>

              {/* Visión */}
              <Card bg={cardBg} shadow="xl" borderRadius="xl" overflow="hidden">
                <CardHeader bgGradient="linear(to-r, purple.500, purple.600)" color="white">
                  <HStack>
                    <Icon as={FiAward} boxSize={6} />
                    <Heading size="lg">Nuestra Visión</Heading>
                  </HStack>
                </CardHeader>
                <CardBody p={8}>
                  <Text
                    fontSize="lg"
                    lineHeight="tall"
                    color={textColor}
                    textAlign="justify"
                  >
                    Brindar a nuestra audiencia el más alto nivel de calidad, fidelidad y entrega en el 
                    servicio de comunicación de manera respetuosa y objetiva con un sonido excepcional, 
                    de información fresca, auténtica e interesante, consolidándonos como el medio de 
                    comunicación de consumo masivo referente en el acervo cultural, motivación, aprendizaje, 
                    vitalidad, ideas y participación de la audiencia en la programación.
                  </Text>
                </CardBody>
              </Card>
            </Grid>
          </VStack>
        </Container>
      </Box>

      {/* Valores Section */}
      <Box py={20}>
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <VStack spacing={4} textAlign="center">
              <Heading as="h2" size="2xl" color={headingColor}>
                Nuestros Valores
              </Heading>
              <Text fontSize="lg" color={textColor} maxW="2xl">
                Los principios que guían cada programa, cada canción y cada palabra que transmitimos
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
              {[
                {
                  icon: FiHeart,
                  title: 'Pasión',
                  description: 'Amamos lo que hacemos y lo transmitimos en cada programa',
                  color: 'red'
                },
                {
                  icon: FiUsers,
                  title: 'Comunidad',
                  description: 'Construimos lazos que unen a toda Barquisimeto',
                  color: 'blue'
                },
                {
                  icon: FiStar,
                  title: 'Calidad',
                  description: 'Excelencia en sonido, contenido y servicio',
                  color: 'yellow'
                },
                {
                  icon: FiTrendingUp,
                  title: 'Innovación',
                  description: 'Siempre buscamos nuevas formas de conectar',
                  color: 'green'
                }
              ].map((value, index) => (
                <Card
                  key={index}
                  bg={cardBg}
                  shadow="lg"
                  borderRadius="xl"
                  p={6}
                  textAlign="center"
                  transition="all 0.3s"
                  _hover={{
                    transform: 'translateY(-5px)',
                    shadow: 'xl'
                  }}
                >
                  <VStack spacing={4}>
                    <Box
                      p={4}
                      borderRadius="full"
                      bgGradient={`linear(to-r, ${value.color}.400, ${value.color}.500)`}
                      color="white"
                    >
                      <Icon as={value.icon} boxSize={8} />
                    </Box>
                    <Heading size="md" color={headingColor}>
                      {value.title}
                    </Heading>
                    <Text color={textColor} fontSize="sm">
                      {value.description}
                    </Text>
                  </VStack>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Historia Section */}
      <Box py={20} bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW="container.xl">
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12} alignItems="center">
            <VStack spacing={6} align="start">
              <Heading as="h2" size="2xl" color={headingColor}>
                Nuestra Historia
              </Heading>
              <Text fontSize="lg" color={textColor} lineHeight="tall">
                Desde nuestros inicios, OXÍ Radio 88.1 FM ha sido testigo y protagonista de la 
                evolución de Barquisimeto. Nacimos con el propósito de ser más que una estación 
                de radio; somos el corazón que late al ritmo de nuestra ciudad.
              </Text>
              <Text fontSize="lg" color={textColor} lineHeight="tall">
                A lo largo de los años, hemos crecido junto a nuestra audiencia, adaptándonos a 
                los cambios tecnológicos y sociales, pero siempre manteniendo nuestra esencia: 
                la pasión por la música, el compromiso con la información veraz y el amor por 
                nuestra comunidad.
              </Text>
              <HStack spacing={6} pt={4}>
                <VStack>
                  <Text fontSize="2xl" fontWeight="bold" color={accentColor}>2015</Text>
                  <Text fontSize="sm" color={textColor}>Fundación</Text>
                </VStack>
                <VStack>
                  <Text fontSize="2xl" fontWeight="bold" color={accentColor}>24/7</Text>
                  <Text fontSize="sm" color={textColor}>Transmisión</Text>
                </VStack>
                <VStack>
                  <Text fontSize="2xl" fontWeight="bold" color={accentColor}>HD</Text>
                  <Text fontSize="sm" color={textColor}>Calidad</Text>
                </VStack>
              </HStack>
            </VStack>
            
            <Box position="relative">
              <Box
                bgGradient="linear(to-br, blue.400, purple.500, pink.500)"
                borderRadius="xl"
                p={8}
                color="white"
                textAlign="center"
              >
                <VStack spacing={6}>
                  <Icon as={FiRadio} boxSize={16} />
                  <Heading size="lg">OXÍ Radio</Heading>
                  <Text fontSize="lg" opacity={0.9}>
                    La voz de Barquisimeto desde 2015
                  </Text>
                  <Divider borderColor="whiteAlpha.300" />
                  <Text fontSize="sm" opacity={0.8}>
                    Conectando corazones, inspirando mentes, construyendo futuro
                  </Text>
                </VStack>
              </Box>
            </Box>
          </Grid>
        </Container>
      </Box>

      {/* Tecnología y Cobertura Section */}
      <Box py={20}>
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <VStack spacing={4} textAlign="center">
              <Heading as="h2" size="2xl" color={headingColor}>
                Tecnología y Cobertura
              </Heading>
              <Text fontSize="lg" color={textColor} maxW="2xl">
                Llevamos la mejor calidad de sonido y programación a toda la región
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} w="full">
              {[
                {
                  icon: FiHeadphones,
                  title: 'Sonido HD',
                  description: 'Transmisión en alta definición para la mejor experiencia auditiva',
                  color: 'blue'
                },
                {
                  icon: FiGlobe,
                  title: 'Cobertura Regional',
                  description: 'Llegamos a toda Barquisimeto y municipios aledaños',
                  color: 'green'
                },
                {
                  icon: FiMusic,
                  title: 'Streaming Online',
                  description: 'Escúchanos desde cualquier parte del mundo',
                  color: 'purple'
                }
              ].map((tech, index) => (
                <Card
                  key={index}
                  bg={cardBg}
                  shadow="lg"
                  borderRadius="xl"
                  p={6}
                  textAlign="center"
                  transition="all 0.3s"
                  _hover={{
                    transform: 'translateY(-5px)',
                    shadow: 'xl'
                  }}
                >
                  <VStack spacing={4}>
                    <Box
                      p={4}
                      borderRadius="full"
                      bgGradient={`linear(to-r, ${tech.color}.400, ${tech.color}.500)`}
                      color="white"
                    >
                      <Icon as={tech.icon} boxSize={8} />
                    </Box>
                    <Heading size="md" color={headingColor}>
                      {tech.title}
                    </Heading>
                    <Text color={textColor} fontSize="sm">
                      {tech.description}
                    </Text>
                  </VStack>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Call to Action Section */}
      <Box
        py={20}
        bgGradient="linear(to-r, blue.600, purple.600, pink.600)"
        color="white"
      >
        <Container maxW="container.xl">
          <VStack spacing={8} textAlign="center">
            <Heading as="h2" size="2xl">
              ¡Únete a la Familia OXÍ!
            </Heading>
            <Text fontSize="xl" maxW="2xl" opacity={0.9}>
              Sintoniza 88.1 FM y forma parte de la comunidad más vibrante de Barquisimeto
            </Text>
            <HStack spacing={4} pt={4}>
              <Button
                size="lg"
                colorScheme="white"
                variant="outline"
                leftIcon={<Icon as={FiRadio} />}
                _hover={{
                  bg: 'white',
                  color: 'blue.600'
                }}
              >
                Escuchar Ahora
              </Button>
              <Button
                size="lg"
                colorScheme="white"
                variant="solid"
                leftIcon={<Icon as={FiMic} />}
                _hover={{
                  bg: 'whiteAlpha.200'
                }}
              >
                Contactar
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>
      </PageWithFooter>
    </PublicLayout>
  )
}

export default About
