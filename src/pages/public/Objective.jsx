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
  Link as ChakraLink,
  Progress,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow
} from '@chakra-ui/react'
import {
  FiTarget,
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
  FiGlobe,
  FiZap,
  FiShield,
  FiBookOpen,
  FiGift,
  FiActivity,
  FiRadio
} from 'react-icons/fi'
import PageWithFooter from '../../components/layout/PageWithFooter'
import PublicLayout from '../../components/layout/PublicLayout'

const Objective = () => {
  const bgGradient = useColorModeValue(
    'linear(to-br, green.50, blue.50, purple.50)',
    'linear(to-br, green.900, blue.900, purple.900)'
  )
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.700', 'gray.200')
  const headingColor = useColorModeValue('gray.800', 'white')
  const accentColor = useColorModeValue('green.500', 'green.300')

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
              colorScheme="green"
              variant="subtle"
              px={4}
              py={2}
              borderRadius="full"
              fontSize="sm"
              fontWeight="bold"
            >
              <Icon as={FiTarget} mr={2} />
              Nuestros Objetivos
            </Badge>
            
            <Heading
              as="h1"
              size="4xl"
              bgGradient="linear(to-r, green.600, blue.600, purple.600)"
              bgClip="text"
              fontWeight="bold"
              lineHeight="shorter"
            >
              Nuestros Objetivos
            </Heading>
            
            <Text
              fontSize="xl"
              color={textColor}
              maxW="3xl"
              lineHeight="tall"
            >
              Trabajamos cada día para alcanzar metas que nos permitan servir mejor 
              a nuestra comunidad y fortalecer el vínculo con nuestros oyentes.
            </Text>

            <HStack spacing={8} mt={8}>
              <VStack>
                <Icon as={FiTarget} boxSize={8} color={accentColor} />
                <Text fontWeight="bold" color={headingColor}>Objetivos Claros</Text>
                <Text fontSize="sm" color={textColor}>Metas Definidas</Text>
              </VStack>
              <VStack>
                <Icon as={FiUsers} boxSize={8} color={accentColor} />
                <Text fontWeight="bold" color={headingColor}>Comunidad</Text>
                <Text fontSize="sm" color={textColor}>Nuestro Foco</Text>
              </VStack>
              <VStack>
                <Icon as={FiTrendingUp} boxSize={8} color={accentColor} />
                <Text fontWeight="bold" color={headingColor}>Crecimiento</Text>
                <Text fontSize="sm" color={textColor}>Constante</Text>
              </VStack>
            </HStack>
          </VStack>
        </Container>
      </Box>

      {/* Objetivos Principales Section */}
      <Box py={20} bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <VStack spacing={4} textAlign="center">
              <Heading as="h2" size="2xl" color={headingColor}>
                Objetivos Estratégicos
              </Heading>
              <Text fontSize="lg" color={textColor} maxW="2xl">
                Nuestras metas principales para el desarrollo y crecimiento de OXÍ Radio
              </Text>
            </VStack>

            <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={8} w="full">
              {/* Objetivo 1: Cobertura */}
              <Card bg={cardBg} shadow="xl" borderRadius="xl" overflow="hidden">
                <CardHeader bgGradient="linear(to-r, green.500, green.600)" color="white">
                  <HStack>
                    <Icon as={FiGlobe} boxSize={6} />
                    <Heading size="lg">Ampliar Cobertura</Heading>
                  </HStack>
                </CardHeader>
                <CardBody p={8}>
                  <Text
                    fontSize="lg"
                    lineHeight="tall"
                    color={textColor}
                    textAlign="justify"
                    mb={4}
                  >
                    Expandir nuestra señal para llegar a más comunidades en el estado Lara 
                    y municipios aledaños, garantizando que nuestra programación llegue a 
                    cada rincón de la región.
                  </Text>
                  <VStack spacing={3} align="stretch">
                    <Box>
                      <HStack justify="space-between" mb={1}>
                        <Text fontSize="sm" fontWeight="medium">Cobertura Actual</Text>
                        <Text fontSize="sm" fontWeight="bold">75%</Text>
                      </HStack>
                      <Progress value={75} colorScheme="green" size="sm" borderRadius="full" />
                    </Box>
                    <Box>
                      <HStack justify="space-between" mb={1}>
                        <Text fontSize="sm" fontWeight="medium">Meta 2024</Text>
                        <Text fontSize="sm" fontWeight="bold">95%</Text>
                      </HStack>
                      <Progress value={95} colorScheme="blue" size="sm" borderRadius="full" />
                    </Box>
                  </VStack>
                </CardBody>
              </Card>

              {/* Objetivo 2: Calidad */}
              <Card bg={cardBg} shadow="xl" borderRadius="xl" overflow="hidden">
                <CardHeader bgGradient="linear(to-r, blue.500, blue.600)" color="white">
                  <HStack>
                    <Icon as={FiHeadphones} boxSize={6} />
                    <Heading size="lg">Mejorar Calidad</Heading>
                  </HStack>
                </CardHeader>
                <CardBody p={8}>
                  <Text
                    fontSize="lg"
                    lineHeight="tall"
                    color={textColor}
                    textAlign="justify"
                    mb={4}
                  >
                    Implementar tecnología de última generación para ofrecer la mejor 
                    calidad de sonido, tanto en transmisión FM como en streaming digital, 
                    garantizando una experiencia auditiva excepcional.
                  </Text>
                  <VStack spacing={3} align="stretch">
                    <Box>
                      <HStack justify="space-between" mb={1}>
                        <Text fontSize="sm" fontWeight="medium">Calidad Actual</Text>
                        <Text fontSize="sm" fontWeight="bold">HD</Text>
                      </HStack>
                      <Progress value={85} colorScheme="blue" size="sm" borderRadius="full" />
                    </Box>
                    <Box>
                      <HStack justify="space-between" mb={1}>
                        <Text fontSize="sm" fontWeight="medium">Meta 2024</Text>
                        <Text fontSize="sm" fontWeight="bold">Ultra HD</Text>
                      </HStack>
                      <Progress value={100} colorScheme="purple" size="sm" borderRadius="full" />
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </Grid>
          </VStack>
        </Container>
      </Box>

      {/* Objetivos Específicos Section */}
      <Box py={20}>
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <VStack spacing={4} textAlign="center">
              <Heading as="h2" size="2xl" color={headingColor}>
                Objetivos Específicos
              </Heading>
              <Text fontSize="lg" color={textColor} maxW="2xl">
                Metas concretas que nos guían hacia la excelencia en el servicio
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
              {[
                {
                  icon: FiUsers,
                  title: 'Comunidad Activa',
                  description: 'Fortalecer la participación de nuestra audiencia en programas interactivos y eventos comunitarios',
                  color: 'blue',
                  progress: 80,
                  target: '100K seguidores'
                },
                {
                  icon: FiMusic,
                  title: 'Diversidad Musical',
                  description: 'Ampliar nuestro repertorio para incluir todos los géneros y promover artistas locales',
                  color: 'purple',
                  progress: 70,
                  target: '50 géneros'
                },
                {
                  icon: FiBookOpen,
                  title: 'Educación',
                  description: 'Desarrollar contenido educativo que contribuya al crecimiento personal de nuestros oyentes',
                  color: 'green',
                  progress: 60,
                  target: '20 programas educativos'
                },
                {
                  icon: FiShield,
                  title: 'Transparencia',
                  description: 'Mantener los más altos estándares de ética y transparencia en toda nuestra programación',
                  color: 'orange',
                  progress: 90,
                  target: '100% transparencia'
                },
                {
                  icon: FiGift,
                  title: 'Responsabilidad Social',
                  description: 'Incrementar nuestro compromiso con causas sociales y el desarrollo de la comunidad',
                  color: 'pink',
                  progress: 65,
                  target: '12 campañas anuales'
                },
                {
                  icon: FiActivity,
                  title: 'Innovación',
                  description: 'Implementar nuevas tecnologías y formatos de programación para mantenernos a la vanguardia',
                  color: 'teal',
                  progress: 75,
                  target: '5 nuevas tecnologías'
                }
              ].map((objective, index) => (
                <Card
                  key={index}
                  bg={cardBg}
                  shadow="lg"
                  borderRadius="xl"
                  p={6}
                  transition="all 0.3s"
                  _hover={{
                    transform: 'translateY(-5px)',
                    shadow: 'xl'
                  }}
                >
                  <VStack spacing={4} align="start">
                    <HStack>
                      <Box
                        p={3}
                        borderRadius="full"
                        bgGradient={`linear(to-r, ${objective.color}.400, ${objective.color}.500)`}
                        color="white"
                      >
                        <Icon as={objective.icon} boxSize={6} />
                      </Box>
                      <VStack align="start" spacing={1}>
                        <Heading size="md" color={headingColor}>
                          {objective.title}
                        </Heading>
                        <Text fontSize="sm" color={objective.color + '.500'} fontWeight="bold">
                          Meta: {objective.target}
                        </Text>
                      </VStack>
                    </HStack>
                    
                    <Text color={textColor} fontSize="sm" lineHeight="tall">
                      {objective.description}
                    </Text>
                    
                    <Box w="full">
                      <HStack justify="space-between" mb={2}>
                        <Text fontSize="xs" color={textColor}>Progreso</Text>
                        <Text fontSize="xs" fontWeight="bold" color={objective.color + '.500'}>
                          {objective.progress}%
                        </Text>
                      </HStack>
                      <Progress 
                        value={objective.progress} 
                        colorScheme={objective.color} 
                        size="sm" 
                        borderRadius="full"
                      />
                    </Box>
                  </VStack>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>

      {/* Metas a Largo Plazo Section */}
      <Box py={20} bg={useColorModeValue('gray.50', 'gray.900')}>
        <Container maxW="container.xl">
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12} alignItems="center">
            <VStack spacing={6} align="start">
              <Heading as="h2" size="2xl" color={headingColor}>
                Visión a Futuro
              </Heading>
              <Text fontSize="lg" color={textColor} lineHeight="tall">
                Nuestros objetivos a largo plazo nos posicionan como la radio líder 
                en innovación, calidad y compromiso social en toda la región.
              </Text>
              <Text fontSize="lg" color={textColor} lineHeight="tall">
                Trabajamos para ser reconocidos no solo por nuestra excelencia técnica, 
                sino por nuestro impacto positivo en la vida de cada oyente y en el 
                desarrollo de nuestra querida Barquisimeto.
              </Text>
              <HStack spacing={6} pt={4}>
                <VStack>
                  <Text fontSize="2xl" fontWeight="bold" color={accentColor}>2025</Text>
                  <Text fontSize="sm" color={textColor}>Expansión</Text>
                </VStack>
                <VStack>
                  <Text fontSize="2xl" fontWeight="bold" color={accentColor}>2026</Text>
                  <Text fontSize="sm" color={textColor}>Innovación</Text>
                </VStack>
                <VStack>
                  <Text fontSize="2xl" fontWeight="bold" color={accentColor}>2027</Text>
                  <Text fontSize="sm" color={textColor}>Liderazgo</Text>
                </VStack>
              </HStack>
            </VStack>
            
            <Box position="relative">
              <Box
                bgGradient="linear(to-br, green.400, blue.500, purple.500)"
                borderRadius="xl"
                p={8}
                color="white"
                textAlign="center"
              >
                <VStack spacing={6}>
                  <Icon as={FiTarget} boxSize={16} />
                  <Heading size="lg">Objetivos 2024-2027</Heading>
                  <Text fontSize="lg" opacity={0.9}>
                    Construyendo el futuro de la radio
                  </Text>
                  <Divider borderColor="whiteAlpha.300" />
                  <Text fontSize="sm" opacity={0.8}>
                    Innovación, calidad y compromiso social
                  </Text>
                </VStack>
              </Box>
            </Box>
          </Grid>
        </Container>
      </Box>

      {/* Impacto y Resultados Section */}
      <Box py={20}>
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <VStack spacing={4} textAlign="center">
              <Heading as="h2" size="2xl" color={headingColor}>
                Nuestro Impacto
              </Heading>
              <Text fontSize="lg" color={textColor} maxW="2xl">
                Los resultados que hemos logrado y las metas que seguimos persiguiendo
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8} w="full">
              {[
                {
                  icon: FiUsers,
                  title: 'Audiencia',
                  number: '50K+',
                  description: 'Oyentes diarios',
                  color: 'blue',
                  trend: 'up'
                },
                {
                  icon: FiMusic,
                  title: 'Programación',
                  number: '24/7',
                  description: 'Horas de transmisión',
                  color: 'purple',
                  trend: 'up'
                },
                {
                  icon: FiHeart,
                  title: 'Satisfacción',
                  number: '98%',
                  description: 'Nivel de satisfacción',
                  color: 'red',
                  trend: 'up'
                },
                {
                  icon: FiAward,
                  title: 'Reconocimientos',
                  number: '15+',
                  description: 'Premios y distinciones',
                  color: 'yellow',
                  trend: 'up'
                }
              ].map((stat, index) => (
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
                      bgGradient={`linear(to-r, ${stat.color}.400, ${stat.color}.500)`}
                      color="white"
                    >
                      <Icon as={stat.icon} boxSize={8} />
                    </Box>
                    <Stat>
                      <StatNumber fontSize="3xl" color={headingColor}>
                        {stat.number}
                      </StatNumber>
                      <StatLabel color={textColor}>
                        {stat.title}
                      </StatLabel>
                      <StatHelpText color={textColor} fontSize="sm">
                        {stat.description}
                      </StatHelpText>
                      <StatArrow type="increase" color="green.500" />
                    </Stat>
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
        bgGradient="linear(to-r, green.600, blue.600, purple.600)"
        color="white"
      >
        <Container maxW="container.xl">
          <VStack spacing={8} textAlign="center">
            <Heading as="h2" size="2xl">
              ¡Ayúdanos a Alcanzar Nuestros Objetivos!
            </Heading>
            <Text fontSize="xl" maxW="2xl" opacity={0.9}>
              Tu participación y feedback son fundamentales para el cumplimiento de nuestras metas
            </Text>
            <HStack spacing={4} pt={4}>
              <Button
                size="lg"
                colorScheme="white"
                variant="outline"
                leftIcon={<Icon as={FiRadio} />}
                _hover={{
                  bg: 'white',
                  color: 'green.600'
                }}
              >
                Escuchar Ahora
              </Button>
              <Button
                size="lg"
                colorScheme="white"
                variant="solid"
                leftIcon={<Icon as={FiHeart} />}
                _hover={{
                  bg: 'whiteAlpha.200'
                }}
              >
                Apoyar Objetivos
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>
      </PageWithFooter>
    </PublicLayout>
  )
}

export default Objective
