import React from 'react'
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  useColorModeValue,
  Grid,
  GridItem,
  Card,
  CardBody,
  CardHeader,
  Button,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Icon,
  Divider,
  Flex,
  Avatar,
  Heading
} from '@chakra-ui/react'
import { 
  FiRadio, 
  FiHeart, 
  FiDownload, 
  FiSettings, 
  FiUser,
  FiCalendar,
  FiClock,
  FiTrendingUp
} from 'react-icons/fi'

const DashboardUser = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')

  // Datos de ejemplo - en producción vendrían del backend
  const userStats = {
    totalPrograms: 12,
    favoritePrograms: 5,
    downloadedContent: 23,
    listeningHours: 45
  }

  const recentPrograms = [
    { id: 1, name: 'Música del Ayer', time: '08:00 - 10:00', status: 'En vivo' },
    { id: 2, name: 'Noticias Matutinas', time: '06:00 - 08:00', status: 'Finalizado' },
    { id: 3, name: 'Deportes en Vivo', time: '19:00 - 21:00', status: 'Próximo' },
  ]

  const quickActions = [
    { icon: FiRadio, label: 'Escuchar Ahora', color: 'blue' },
    { icon: FiHeart, label: 'Mis Favoritos', color: 'red' },
    { icon: FiDownload, label: 'Descargas', color: 'green' },
    { icon: FiSettings, label: 'Configuración', color: 'purple' }
  ]

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header del Dashboard */}
          <Box>
            <HStack justify="space-between" align="center" mb={4}>
              <VStack align="start" spacing={1}>
                <Heading size="lg" color="blue.600">
                  Dashboard del Suscriptor
                </Heading>
                <Text color={textColor}>
                  Bienvenido a tu panel personal de Radio FM
                </Text>
              </VStack>
              <HStack spacing={4}>
                <Avatar size="md" name="Usuario" />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="medium">Usuario Suscriptor</Text>
                  <Text fontSize="sm" color={textColor}>usuario@email.com</Text>
                </VStack>
              </HStack>
            </HStack>
          </Box>

          {/* Estadísticas principales */}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
            <GridItem>
              <Card bg={cardBg} boxShadow="md">
                <CardBody>
                  <Stat>
                    <StatLabel>Programas Suscritos</StatLabel>
                    <StatNumber color="blue.500">{userStats.totalPrograms}</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      +2 este mes
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card bg={cardBg} boxShadow="md">
                <CardBody>
                  <Stat>
                    <StatLabel>Favoritos</StatLabel>
                    <StatNumber color="red.500">{userStats.favoritePrograms}</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      +1 esta semana
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card bg={cardBg} boxShadow="md">
                <CardBody>
                  <Stat>
                    <StatLabel>Descargas</StatLabel>
                    <StatNumber color="green.500">{userStats.downloadedContent}</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      +5 esta semana
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card bg={cardBg} boxShadow="md">
                <CardBody>
                  <Stat>
                    <StatLabel>Horas Escuchadas</StatLabel>
                    <StatNumber color="purple.500">{userStats.listeningHours}h</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      +12h esta semana
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>

          <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
            {/* Programas Recientes */}
            <GridItem>
              <Card bg={cardBg} boxShadow="md">
                <CardHeader>
                  <HStack justify="space-between">
                    <Heading size="md">Programas de Hoy</Heading>
                    <Button size="sm" variant="outline" colorScheme="blue">
                      Ver Todos
                    </Button>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack spacing={4} align="stretch">
                    {recentPrograms.map((program) => (
                      <Box key={program.id} p={4} border="1px" borderColor="gray.200" borderRadius="md">
                        <HStack justify="space-between" align="start">
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="medium">{program.name}</Text>
                            <HStack spacing={2}>
                              <Icon as={FiClock} color="gray.500" />
                              <Text fontSize="sm" color={textColor}>{program.time}</Text>
                            </HStack>
                          </VStack>
                          <Badge 
                            colorScheme={program.status === 'En vivo' ? 'green' : program.status === 'Próximo' ? 'blue' : 'gray'}
                            variant="subtle"
                          >
                            {program.status}
                          </Badge>
                        </HStack>
                      </Box>
                    ))}
                  </VStack>
                </CardBody>
              </Card>
            </GridItem>

            {/* Acciones Rápidas */}
            <GridItem>
              <Card bg={cardBg} boxShadow="md">
                <CardHeader>
                  <Heading size="md">Acciones Rápidas</Heading>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack spacing={3} align="stretch">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        leftIcon={<Icon as={action.icon} />}
                        variant="outline"
                        colorScheme={action.color}
                        justifyContent="start"
                        h="50px"
                        _hover={{ transform: 'translateY(-1px)', boxShadow: 'md' }}
                        transition="all 0.2s"
                      >
                        {action.label}
                      </Button>
                    ))}
                  </VStack>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>

          {/* Actividad Reciente */}
          <Card bg={cardBg} boxShadow="md">
            <CardHeader>
              <Heading size="md">Actividad Reciente</Heading>
            </CardHeader>
            <CardBody pt={0}>
              <VStack spacing={3} align="stretch">
                {[
                  { action: 'Escuchaste', program: 'Música del Ayer', time: 'Hace 2 horas' },
                  { action: 'Descargaste', program: 'Noticias Matutinas', time: 'Ayer' },
                  { action: 'Agregaste a favoritos', program: 'Deportes en Vivo', time: 'Hace 3 días' },
                  { action: 'Compartiste', program: 'Música del Ayer', time: 'Hace 1 semana' }
                ].map((activity, index) => (
                  <HStack key={index} justify="space-between" p={3} bg="gray.50" borderRadius="md">
                    <HStack spacing={3}>
                      <Icon as={FiTrendingUp} color="blue.500" />
                      <Text fontSize="sm">
                        <Text as="span" fontWeight="medium">{activity.action}</Text>
                        <Text as="span" color={textColor}> {activity.program}</Text>
                      </Text>
                    </HStack>
                    <Text fontSize="xs" color={textColor}>
                      {activity.time}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  )
}

export default DashboardUser