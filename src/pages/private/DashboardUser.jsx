import React, { useState } from 'react'
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
  Heading,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useBreakpointValue,
  Link as ChakraLink
} from '@chakra-ui/react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { 
  FiRadio, 
  FiHeart, 
  FiDownload, 
  FiSettings, 
  FiUser,
  FiCalendar,
  FiClock,
  FiTrendingUp,
  FiMenu,
  FiHome,
  FiLogOut,
  FiVolume2,
  FiHeadphones,
  FiBookOpen,
  FiMusic,
  FiMic,
  FiMail,
  FiInfo
} from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'

const DashboardUser = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { auth, logout } = useAuth()
  const user = auth
  const navigate = useNavigate()
  const isMobile = useBreakpointValue({ base: true, md: false })
  const isTablet = useBreakpointValue({ base: false, md: true, lg: false })
  
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const headerBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const logoColor = useColorModeValue('blue.600', 'blue.300')

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

  // Elementos del menú para suscriptores
  const subscriberMenuItems = [
    { icon: FiHome, label: 'Inicio', href: '/', description: 'Volver al inicio' },
    { icon: FiRadio, label: 'Escuchar Radio', href: '/radio', description: 'Escuchar en vivo' },
    { icon: FiHeadphones, label: 'Podcasts', href: '/podcasts', description: 'Escuchar podcasts' },
    { icon: FiBookOpen, label: 'Noticias', href: '/news', description: 'Últimas noticias' },
    { icon: FiMusic, label: 'Música', href: '/music', description: 'Programas musicales' },
    { icon: FiMic, label: 'Programas', href: '/programs', description: 'Programas de radio' },
    { icon: FiCalendar, label: 'Eventos', href: '/events', description: 'Próximos eventos' },
    { icon: FiMail, label: 'Contacto', href: '/contact', description: 'Contáctanos' },
    { icon: FiInfo, label: 'Acerca de', href: '/about', description: 'Sobre nosotros' }
  ]

  // Funciones de manejo
  const handleLogout = () => {
    logout()
    onClose()
  }

  const handleHome = () => {
    navigate('/')
    onClose()
  }

  return (
    <>
      {/* Header Principal */}
      <Box
        bg={headerBg}
        borderBottom="1px"
        borderColor={borderColor}
        position="sticky"
        top={0}
        zIndex={1000}
        shadow="sm"
      >
        <Container maxW="container.xl" px={isTablet ? 4 : 6}>
          <HStack justify="space-between" py={isTablet ? 3 : 4}>
            {/* Logo y Título */}
            <HStack spacing={isTablet ? 2.5 : 3}>
              <Box
                p={isTablet ? 1.5 : 2}
                borderRadius="lg"
                bgGradient="linear(to-r, blue.500, purple.500)"
                color="white"
              >
                <Icon as={FiRadio} boxSize={isTablet ? 5 : 6} />
              </Box>
              <VStack align="start" spacing={0}>
                <Text
                  fontSize={isTablet ? "lg" : "xl"}
                  fontWeight="bold"
                  color={logoColor}
                  lineHeight="shorter"
                >
                  Dashboard Suscriptor
                </Text>
                <Text 
                  fontSize="xs" 
                  color={textColor} 
                  fontWeight="medium"
                  display={isTablet ? "none" : "block"}
                >
                  Panel personal de Radio FM
                </Text>
              </VStack>
            </HStack>

            {/* Botones de Acción */}
            <HStack spacing={isTablet ? 1 : 2}>
              {/* Botón Home */}
              <IconButton
                aria-label="Ir al inicio"
                icon={<FiHome />}
                size={isTablet ? "xs" : "sm"}
                variant="ghost"
                onClick={handleHome}
                _hover={{
                  bg: 'gray.100',
                  color: 'blue.500'
                }}
              />

              {/* Botón de Menú Hamburguesa - Al lado del home */}
              <IconButton
                aria-label="Abrir menú del dashboard"
                icon={<FiMenu />}
                variant="ghost"
                onClick={onOpen}
                size={isTablet ? "xs" : "sm"}
                _hover={{
                  bg: 'gray.100',
                  color: 'blue.500'
                }}
              />

              {/* Botón Logout */}
              <Button
                size={isTablet ? "xs" : "sm"}
                colorScheme="red"
                variant="outline"
                leftIcon={<Icon as={FiLogOut} />}
                onClick={handleLogout}
                _hover={{
                  bg: 'red.500',
                  color: 'white',
                  borderColor: 'red.500'
                }}
              >
                {isTablet ? "Salir" : "Cerrar Sesión"}
              </Button>

              {/* Información del Usuario */}
              <HStack spacing={3}>
                <Avatar 
                  size="md" 
                  name={user?.name || 'Usuario'} 
                  bg="red.500"
                  color="white"
                />
                <VStack align="start" spacing={0}>
                  <Text fontWeight="medium" fontSize="sm">
                    {user?.name || 'Usuario Suscriptor'}
                  </Text>
                  <Text fontSize="xs" color={textColor}>
                    {user?.email || 'usuario@email.com'}
                  </Text>
                  <Badge colorScheme="blue" size="sm" variant="subtle">
                    SUSCRIPTOR
                  </Badge>
                </VStack>
              </HStack>
            </HStack>
          </HStack>
        </Container>
      </Box>

      {/* Contenido Principal */}
      <Box minH="100vh" bg={bgColor}>
        <Container maxW="container.xl" py={8}>
          <VStack spacing={8} align="stretch">

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

      {/* Drawer Móvil */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            <HStack>
              <Icon as={FiRadio} color={logoColor} />
              <VStack align="start" spacing={0}>
                <Text color={logoColor} fontWeight="bold">
                  Dashboard Suscriptor
                </Text>
                <Text fontSize="xs" color={textColor}>
                  Radio FM Management
                </Text>
              </VStack>
            </HStack>
          </DrawerHeader>
          
          <DrawerBody>
            <VStack align="stretch" spacing={2} pt={4}>
              {/* Botón de Escuchar - Siempre visible en el menú móvil */}
              <Button
                colorScheme="blue"
                variant="outline"
                leftIcon={<Icon as={FiVolume2} />}
                onClick={onClose}
                _hover={{
                  bg: 'blue.500',
                  color: 'white',
                  borderColor: 'blue.500'
                }}
              >
                Escuchar Radio
              </Button>

              {/* Separador */}
              <Box borderTop="1px" borderColor={borderColor} my={2} />

              {/* Elementos del menú de navegación */}
              {subscriberMenuItems.map((item) => (
                <Button
                  key={item.label}
                  as={RouterLink}
                  to={item.href}
                  justifyContent="start"
                  variant="ghost"
                  leftIcon={<Icon as={item.icon} />}
                  onClick={onClose}
                  h="50px"
                  _hover={{
                    bg: 'blue.50',
                    color: 'blue.600'
                  }}
                >
                  <VStack align="start" spacing={0} flex={1}>
                    <Text fontSize="sm" fontWeight="medium">
                      {item.label}
                    </Text>
                    <Text fontSize="xs" color={textColor}>
                      {item.description}
                    </Text>
                  </VStack>
                </Button>
              ))}
              
              {/* Separador */}
              <Box borderTop="1px" borderColor={borderColor} my={2} />
              
              {/* Información del usuario */}
              <Box p={3} bg="gray.50" borderRadius="md">
                <HStack spacing={3}>
                  <Avatar 
                    size="sm" 
                    name={user?.name || 'Usuario'} 
                    bg="red.500"
                    color="white"
                  />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" fontWeight="medium">
                      {user?.name || 'Usuario Suscriptor'}
                    </Text>
                    <Text fontSize="xs" color={textColor}>
                      {user?.email || 'usuario@email.com'}
                    </Text>
                    <Badge colorScheme="blue" size="sm" variant="subtle">
                      SUSCRIPTOR
                    </Badge>
                  </VStack>
                </HStack>
              </Box>

              {/* Botones de acción */}
              <HStack spacing={2} pt={2}>
                <Button
                  flex={1}
                  leftIcon={<Icon as={FiHome} />}
                  onClick={handleHome}
                  variant="outline"
                  colorScheme="blue"
                >
                  Inicio
                </Button>
                <Button
                  flex={1}
                  leftIcon={<Icon as={FiLogOut} />}
                  onClick={handleLogout}
                  colorScheme="red"
                  variant="outline"
                >
                  Salir
                </Button>
              </HStack>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default DashboardUser