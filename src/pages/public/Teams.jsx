import React from 'react'
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Icon,
  Badge,
  Avatar,
  useColorModeValue,
  Divider,
  Flex,
  Button,
  Stack
} from '@chakra-ui/react'
import {
  FiRadio,
  FiUsers,
  FiMic,
  FiHeadphones,
  FiMusic,
  FiSettings,
  FiTrendingUp,
  FiAward,
  FiMail,
  FiBriefcase,
  FiStar,
  FiZap,
  FiHeart,
  FiArrowRight
} from 'react-icons/fi'
import PageWithFooter from '../../components/layout/PageWithFooter'
import PublicLayout from '../../components/layout/PublicLayout'

const Teams = () => {
  const bgGradient = useColorModeValue(
    'linear(to-br, indigo.50, purple.50, pink.50, cyan.50)',
    'linear(to-br, indigo.900, purple.900, pink.900, cyan.900)'
  )
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.700', 'gray.200')
  const headingColor = useColorModeValue('gray.800', 'white')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const glassBg = useColorModeValue('rgba(255, 255, 255, 0.7)', 'rgba(26, 32, 44, 0.7)')
  const statCardBg = useColorModeValue('whiteAlpha.800', 'blackAlpha.500')
  const statCardBorder = useColorModeValue('indigo.200', 'indigo.600')
  const memberBoxBg = useColorModeValue('gray.50', 'gray.700')
  const memberBoxHoverBg = useColorModeValue('gray.100', 'gray.600')

  // Estructura organizativa de la estación
  const organizationalStructure = [
    {
      id: 1,
      department: 'Dirección General',
      icon: FiAward,
      color: 'indigo',
      gradient: 'linear(to-br, indigo.400, indigo.600, purple.600)',
      description: 'Liderazgo estratégico y visión general de la estación',
      members: [
        {
          id: 1,
          name: 'María González',
          role: 'Directora General',
          experience: '15 años en medios',
          avatar: null,
          email: 'maria.gonzalez@oxiradio.com'
        },
        {
          id: 2,
          name: 'Carlos Rodríguez',
          role: 'Subdirector',
          experience: '12 años en radio',
          avatar: null,
          email: 'carlos.rodriguez@oxiradio.com'
        }
      ]
    },
    {
      id: 2,
      department: 'Programación',
      icon: FiRadio,
      color: 'blue',
      gradient: 'linear(to-br, blue.400, blue.600, cyan.600)',
      description: 'Producción y coordinación de la programación diaria',
      members: [
        {
          id: 3,
          name: 'Ana Martínez',
          role: 'Directora de Programación',
          experience: '10 años en producción',
          avatar: null,
          email: 'ana.martinez@oxiradio.com'
        },
        {
          id: 4,
          name: 'Luis Pérez',
          role: 'Coordinador de Programas',
          experience: '8 años en radio',
          avatar: null,
          email: 'luis.perez@oxiradio.com'
        },
        {
          id: 5,
          name: 'Sofía Ramírez',
          role: 'Productora Ejecutiva',
          experience: '6 años en medios',
          avatar: null,
          email: 'sofia.ramirez@oxiradio.com'
        }
      ]
    },
    {
      id: 3,
      department: 'Locución y Presentación',
      icon: FiMic,
      color: 'pink',
      gradient: 'linear(to-br, pink.400, pink.600, rose.600)',
      description: 'Nuestros locutores y presentadores que dan vida a la radio',
      members: [
        {
          id: 6,
          name: 'Roberto Silva',
          role: 'Locutor Principal - Mañanas',
          experience: '18 años en locución',
          avatar: null,
          email: 'roberto.silva@oxiradio.com'
        },
        {
          id: 7,
          name: 'Carmen Herrera',
          role: 'Locutora - Tardes',
          experience: '12 años en radio',
          avatar: null,
          email: 'carmen.herrera@oxiradio.com'
        },
        {
          id: 8,
          name: 'Diego Morales',
          role: 'Locutor - Noches',
          experience: '9 años en medios',
          avatar: null,
          email: 'diego.morales@oxiradio.com'
        },
        {
          id: 9,
          name: 'Laura Fernández',
          role: 'Presentadora - Fin de Semana',
          experience: '7 años en radio',
          avatar: null,
          email: 'laura.fernandez@oxiradio.com'
        }
      ]
    },
    {
      id: 4,
      department: 'Producción Técnica',
      icon: FiHeadphones,
      color: 'green',
      gradient: 'linear(to-br, green.400, green.600, emerald.600)',
      description: 'Equipo técnico que garantiza la calidad del sonido',
      members: [
        {
          id: 10,
          name: 'Javier Torres',
          role: 'Jefe de Producción',
          experience: '14 años en audio',
          avatar: null,
          email: 'javier.torres@oxiradio.com'
        },
        {
          id: 11,
          name: 'Patricia López',
          role: 'Técnica de Sonido',
          experience: '8 años en producción',
          avatar: null,
          email: 'patricia.lopez@oxiradio.com'
        },
        {
          id: 12,
          name: 'Miguel Ángel Rojas',
          role: 'Operador de Audio',
          experience: '5 años en radio',
          avatar: null,
          email: 'miguel.rojas@oxiradio.com'
        }
      ]
    },
    {
      id: 5,
      department: 'Musicalización',
      icon: FiMusic,
      color: 'orange',
      gradient: 'linear(to-br, orange.400, orange.600, amber.600)',
      description: 'Selección y gestión del contenido musical',
      members: [
        {
          id: 13,
          name: 'Isabella Cruz',
          role: 'Directora Musical',
          experience: '11 años en música',
          avatar: null,
          email: 'isabella.cruz@oxiradio.com'
        },
        {
          id: 14,
          name: 'Andrés Mendoza',
          role: 'Programador Musical',
          experience: '7 años en radio',
          avatar: null,
          email: 'andres.mendoza@oxiradio.com'
        }
      ]
    },
    {
      id: 6,
      department: 'Marketing y Comunicación',
      icon: FiTrendingUp,
      color: 'teal',
      gradient: 'linear(to-br, teal.400, teal.600, cyan.600)',
      description: 'Estrategia de marca y comunicación con la audiencia',
      members: [
        {
          id: 15,
          name: 'Gabriela Suárez',
          role: 'Directora de Marketing',
          experience: '10 años en marketing',
          avatar: null,
          email: 'gabriela.suarez@oxiradio.com'
        },
        {
          id: 16,
          name: 'Fernando Castro',
          role: 'Community Manager',
          experience: '6 años en redes sociales',
          avatar: null,
          email: 'fernando.castro@oxiradio.com'
        },
        {
          id: 17,
          name: 'Valentina Ríos',
          role: 'Especialista en Contenido',
          experience: '5 años en comunicación',
          avatar: null,
          email: 'valentina.rios@oxiradio.com'
        }
      ]
    },
    {
      id: 7,
      department: 'Tecnología e IT',
      icon: FiSettings,
      color: 'cyan',
      gradient: 'linear(to-br, cyan.400, cyan.600, blue.600)',
      description: 'Infraestructura tecnológica y desarrollo digital',
      members: [
        {
          id: 18,
          name: 'Ricardo Vargas',
          role: 'Jefe de IT',
          experience: '12 años en tecnología',
          avatar: null,
          email: 'ricardo.vargas@oxiradio.com'
        },
        {
          id: 19,
          name: 'Daniela Moreno',
          role: 'Desarrolladora Web',
          experience: '4 años en desarrollo',
          avatar: null,
          email: 'daniela.moreno@oxiradio.com'
        }
      ]
    },
    {
      id: 8,
      department: 'Comercial y Ventas',
      icon: FiBriefcase,
      color: 'yellow',
      gradient: 'linear(to-br, yellow.400, yellow.600, amber.600)',
      description: 'Gestión comercial y relaciones con clientes',
      members: [
        {
          id: 20,
          name: 'Eduardo Sánchez',
          role: 'Director Comercial',
          experience: '13 años en ventas',
          avatar: null,
          email: 'eduardo.sanchez@oxiradio.com'
        },
        {
          id: 21,
          name: 'Monica Vega',
          role: 'Ejecutiva de Ventas',
          experience: '8 años en comercial',
          avatar: null,
          email: 'monica.vega@oxiradio.com'
        },
        {
          id: 22,
          name: 'Alejandro Ruiz',
          role: 'Asesor Comercial',
          experience: '5 años en ventas',
          avatar: null,
          email: 'alejandro.ruiz@oxiradio.com'
        }
      ]
    }
  ]

  return (
    <PublicLayout>
      <PageWithFooter>
        {/* Hero Section - Modern with Animated Background */}
        <Box
          bg={bgGradient}
          py={{ base: 16, md: 24 }}
          position="relative"
          overflow="hidden"
        >
          {/* Animated gradient blobs */}
          <Box
            position="absolute"
            top="-10%"
            right="-5%"
            width={{ base: '300px', md: '600px' }}
            height={{ base: '300px', md: '600px' }}
            borderRadius="full"
            bgGradient="linear(to-br, indigo.400, purple.400)"
            opacity={0.3}
            filter="blur(80px)"
            animation="float 20s ease-in-out infinite"
          />
          <Box
            position="absolute"
            bottom="-10%"
            left="-5%"
            width={{ base: '250px', md: '500px' }}
            height={{ base: '250px', md: '500px' }}
            borderRadius="full"
            bgGradient="linear(to-br, pink.400, cyan.400)"
            opacity={0.3}
            filter="blur(80px)"
            animation="float 15s ease-in-out infinite reverse"
          />

          <Container maxW="container.xl" position="relative" zIndex={1}>
            <VStack spacing={10} textAlign="center">
              <Box
                bg={glassBg}
                backdropFilter="blur(20px)"
                borderRadius="2xl"
                p={{ base: 6, md: 10 }}
                borderWidth="2px"
                borderColor={useColorModeValue('whiteAlpha.600', 'whiteAlpha.200')}
                boxShadow="2xl"
                maxW="5xl"
                mx="auto"
                w="full"
              >
                <VStack spacing={8}>
                  <Badge
                    colorScheme="indigo"
                    variant="solid"
                    px={5}
                    py={2}
                    borderRadius="full"
                    fontSize="sm"
                    fontWeight="bold"
                    boxShadow="lg"
                  >
                    Nuestro Equipo
                  </Badge>
                  
                  <Heading
                    as="h1"
                    size={{ base: '2xl', md: '4xl', lg: '5xl' }}
                    bgGradient="linear(to-r, indigo.600, purple.600, pink.600, cyan.600)"
                    bgClip="text"
                    fontWeight="extrabold"
                    lineHeight="shorter"
                    letterSpacing="tight"
                  >
                    Estructura Organizativa
                  </Heading>
                  
                  <Text
                    fontSize={{ base: 'md', md: 'lg', lg: 'xl' }}
                    color={textColor}
                    maxW="3xl"
                    lineHeight="tall"
                    fontWeight="medium"
                  >
                    Conoce al talentoso equipo que hace posible que OXÍ Radio 88.1 FM 
                    sea la voz de Barquisimeto. Profesionales apasionados trabajando 
                    juntos para brindarte la mejor experiencia radial.
                  </Text>

                  <SimpleGrid 
                    columns={{ base: 2, md: 4 }} 
                    spacing={6} 
                    w="full" 
                    pt={4}
                  >
                    {[
                      { icon: FiUsers, label: 'Profesionales', value: '+25', color: 'indigo' },
                      { icon: FiBriefcase, label: 'Departamentos', value: '8', color: 'purple' },
                      { icon: FiStar, label: 'Años Experiencia', value: '150+', color: 'pink' },
                      { icon: FiAward, label: 'Premios', value: '15+', color: 'cyan' }
                    ].map((stat, idx) => (
                      <Box
                        key={idx}
                        textAlign="center"
                        p={5}
                        borderRadius="2xl"
                        bg={statCardBg}
                        backdropFilter="blur(10px)"
                borderWidth="2px"
                borderColor={stat.color === 'indigo' ? statCardBorder : `${stat.color}.200`}
                transition="all 0.3s"
                _hover={{
                  transform: 'translateY(-8px) scale(1.05)',
                  shadow: 'xl',
                  borderColor: `${stat.color}.400`
                }}
                      >
                        <Icon 
                          as={stat.icon} 
                          boxSize={8} 
                          color={`${stat.color}.500`} 
                          mb={3}
                        />
                        <Text fontSize="3xl" fontWeight="extrabold" color={headingColor} mb={1}>
                          {stat.value}
                        </Text>
                        <Text fontSize="xs" color={textColor} fontWeight="medium">
                          {stat.label}
                        </Text>
                      </Box>
                    ))}
                  </SimpleGrid>
                </VStack>
              </Box>
            </VStack>
          </Container>
        </Box>

        {/* Estructura Organizativa Section - Modern Grid */}
        <Box py={{ base: 12, md: 20 }} bg={useColorModeValue('gray.50', 'gray.900')}>
          <Container maxW="container.xl">
            <VStack spacing={12}>
              <VStack spacing={4} textAlign="center">
                <Heading as="h2" size={{ base: 'xl', md: '2xl' }} color={headingColor}>
                  Nuestros Departamentos
                </Heading>
                <Text fontSize={{ base: 'md', md: 'lg' }} color={textColor} maxW="2xl" px={4}>
                  Organización por áreas de especialización para garantizar la excelencia
                </Text>
              </VStack>

              <SimpleGrid 
                columns={{ base: 1, md: 2, lg: 3 }} 
                spacing={8} 
                w="full"
              >
                {organizationalStructure.map((dept) => (
                  <Card
                    key={dept.id}
                    bg={cardBg}
                    shadow="2xl"
                    borderRadius="2xl"
                    overflow="hidden"
                    position="relative"
                    borderWidth="2px"
                    borderColor="transparent"
                    transition="all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                    _hover={{
                      transform: 'translateY(-12px) rotate(1deg)',
                      shadow: '3xl',
                      borderColor: `${dept.color}.400`
                    }}
                    group
                  >
                    {/* Floating Icon Badge */}
                    <Box
                      position="absolute"
                      top={4}
                      right={4}
                      zIndex={2}
                      p={3}
                      borderRadius="xl"
                      bgGradient={dept.gradient}
                      color="white"
                      boxShadow="lg"
                      transform="rotate(12deg)"
                      transition="all 0.3s"
                      _groupHover={{
                        transform: 'rotate(0deg) scale(1.2)'
                      }}
                    >
                      <Icon as={dept.icon} boxSize={6} />
                    </Box>

                    {/* Gradient Top Bar */}
                    <Box
                      h="6px"
                      bgGradient={dept.gradient}
                      position="relative"
                    />

                    <CardBody p={6}>
                      <VStack spacing={5} align="stretch">
                        <VStack spacing={2} align="start" pt={2}>
                          <Heading size="md" color={headingColor}>
                            {dept.department}
                          </Heading>
                          <Text fontSize="sm" color={textColor} lineHeight="tall">
                            {dept.description}
                          </Text>
                        </VStack>
                        
                        <Divider borderColor={borderColor} />
                        
                        {/* Members Grid - Compact */}
                        <SimpleGrid columns={2} spacing={3}>
                          {dept.members.map((member) => (
                            <Box
                              key={member.id}
                              p={3}
                              borderRadius="lg"
                              bg={memberBoxBg}
                              borderWidth="2px"
                              borderColor="transparent"
                              transition="all 0.2s"
                              _hover={{
                                bg: memberBoxHoverBg,
                                borderColor: `${dept.color}.300`,
                                transform: 'scale(1.05)'
                              }}
                            >
                              <VStack spacing={2} align="center">
                                <Avatar
                                  name={member.name}
                                  size="md"
                                  bgGradient={dept.gradient}
                                  color="white"
                                  fontWeight="bold"
                                  boxShadow="md"
                                  borderWidth="2px"
                                  borderColor="white"
                                />
                                <VStack spacing={0} align="center">
                                  <Text
                                    fontWeight="bold"
                                    color={headingColor}
                                    fontSize="xs"
                                    textAlign="center"
                                    noOfLines={2}
                                    maxW="100px"
                                  >
                                    {member.name}
                                  </Text>
                                  <Text
                                    fontSize="2xs"
                                    color={`${dept.color}.500`}
                                    fontWeight="medium"
                                    textAlign="center"
                                    noOfLines={1}
                                  >
                                    {member.role.split(' - ')[0]}
                                  </Text>
                                  <Badge
                                    fontSize="2xs"
                                    colorScheme={dept.color}
                                    variant="subtle"
                                    mt={1}
                                    borderRadius="full"
                                  >
                                    {member.experience}
                                  </Badge>
                                </VStack>
                              </VStack>
                            </Box>
                          ))}
                        </SimpleGrid>

                        <Button
                          size="sm"
                          colorScheme={dept.color}
                          variant="ghost"
                          rightIcon={<Icon as={FiArrowRight} />}
                          w="full"
                          mt={2}
                          _hover={{
                            bg: `${dept.color}.50`,
                            transform: 'translateX(4px)'
                          }}
                        >
                          Ver más detalles
                        </Button>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>

        {/* Valores del Equipo Section - Modern Cards */}
        <Box py={{ base: 12, md: 20 }} bg={useColorModeValue('white', 'gray.800')}>
          <Container maxW="container.xl">
            <VStack spacing={12}>
              <VStack spacing={4} textAlign="center">
                <Heading as="h2" size={{ base: 'xl', md: '2xl' }} color={headingColor}>
                  Valores de Nuestro Equipo
                </Heading>
                <Text fontSize={{ base: 'md', md: 'lg' }} color={textColor} maxW="2xl" px={4}>
                  Los principios que guían el trabajo diario de cada profesional
                </Text>
              </VStack>

              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} w="full">
                {[
                  {
                    icon: FiStar,
                    title: 'Excelencia',
                    description: 'Buscamos la perfección en cada detalle',
                    color: 'yellow',
                    gradient: 'linear(to-br, yellow.400, orange.500)'
                  },
                  {
                    icon: FiUsers,
                    title: 'Trabajo en Equipo',
                    description: 'Colaboración y sinergia constante',
                    color: 'blue',
                    gradient: 'linear(to-br, blue.400, cyan.500)'
                  },
                  {
                    icon: FiZap,
                    title: 'Innovación',
                    description: 'Siempre a la vanguardia tecnológica',
                    color: 'purple',
                    gradient: 'linear(to-br, purple.400, pink.500)'
                  },
                  {
                    icon: FiHeart,
                    title: 'Pasión',
                    description: 'Amamos lo que hacemos cada día',
                    color: 'red',
                    gradient: 'linear(to-br, red.400, pink.500)'
                  }
                ].map((value, index) => (
                  <Card
                    key={index}
                    bg={cardBg}
                    shadow="xl"
                    borderRadius="2xl"
                    p={6}
                    textAlign="center"
                    borderWidth="3px"
                    borderColor="transparent"
                    position="relative"
                    overflow="hidden"
                    transition="all 0.4s"
                    _hover={{
                      transform: 'translateY(-12px) rotate(-2deg)',
                      shadow: '2xl',
                      borderColor: `${value.color}.400`
                    }}
                    _before={{
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      bgGradient: value.gradient
                    }}
                  >
                    <VStack spacing={4}>
                      <Box
                        p={5}
                        borderRadius="2xl"
                        bgGradient={value.gradient}
                        color="white"
                        boxShadow="xl"
                        transform="rotate(-5deg)"
                        transition="all 0.3s"
                        _groupHover={{
                          transform: 'rotate(0deg) scale(1.15)'
                        }}
                      >
                        <Icon as={value.icon} boxSize={10} />
                      </Box>
                      <Heading size="md" color={headingColor}>
                        {value.title}
                      </Heading>
                      <Text color={textColor} fontSize="sm" lineHeight="tall">
                        {value.description}
                      </Text>
                    </VStack>
                  </Card>
                ))}
              </SimpleGrid>
            </VStack>
          </Container>
        </Box>

        {/* Call to Action Section - Modern Gradient */}
        <Box
          py={{ base: 12, md: 20 }}
          position="relative"
          overflow="hidden"
          bgGradient="linear(to-r, indigo.600, purple.600, pink.600, cyan.600)"
          color="white"
        >
          {/* Animated background elements */}
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            width="800px"
            height="800px"
            borderRadius="full"
            bg="whiteAlpha.100"
            filter="blur(100px)"
            animation="pulse 4s ease-in-out infinite"
          />

          <Container maxW="container.xl" position="relative" zIndex={1}>
            <VStack spacing={8} textAlign="center">
              <Box
                bg="whiteAlpha.100"
                backdropFilter="blur(20px)"
                borderRadius="3xl"
                p={10}
                borderWidth="2px"
                borderColor="whiteAlpha.300"
                maxW="4xl"
                mx="auto"
                boxShadow="2xl"
              >
                <VStack spacing={6}>
                  <Icon as={FiStar} boxSize={10} color="white" />
                  <Heading as="h2" size={{ base: 'xl', md: '2xl' }}>
                    ¿Quieres Ser Parte del Equipo?
                  </Heading>
                  <Text fontSize={{ base: 'md', md: 'xl' }} opacity={0.95} maxW="2xl">
                    Estamos siempre buscando talento apasionado por la radio. 
                    Si compartes nuestra visión, ¡queremos conocerte!
                  </Text>
                  <Stack direction={{ base: 'column', sm: 'row' }} spacing={4} pt={4} justify="center">
                    <Button
                      size="lg"
                      colorScheme="white"
                      variant="solid"
                      leftIcon={<Icon as={FiMail} />}
                      rightIcon={<Icon as={FiArrowRight} />}
                      _hover={{
                        bg: 'white',
                        color: 'indigo.600',
                        transform: 'translateX(4px)'
                      }}
                      transition="all 0.3s"
                    >
                      talento@oxiradio.com
                    </Button>
                    <Button
                      size="lg"
                      colorScheme="white"
                      variant="outline"
                      leftIcon={<Icon as={FiUsers} />}
                      rightIcon={<Icon as={FiArrowRight} />}
                      _hover={{
                        bg: 'whiteAlpha.200',
                        transform: 'translateX(4px)'
                      }}
                      transition="all 0.3s"
                    >
                      Únete a nosotros
                    </Button>
                  </Stack>
                </VStack>
              </Box>
            </VStack>
          </Container>
        </Box>

        {/* CSS Animations */}
        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translate(0, 0) rotate(0deg); }
              50% { transform: translate(30px, -30px) rotate(180deg); }
            }
            @keyframes pulse {
              0%, 100% { opacity: 0.3; transform: translate(-50%, -50%) scale(1); }
              50% { opacity: 0.5; transform: translate(-50%, -50%) scale(1.1); }
            }
          `}
        </style>
      </PageWithFooter>
    </PublicLayout>
  )
}

export default Teams
