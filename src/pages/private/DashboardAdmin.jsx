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
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Progress,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  IconButton,
  useDisclosure
} from '@chakra-ui/react'
import { 
  FiUsers, 
  FiRadio, 
  FiTrendingUp, 
  FiSettings, 
  FiUser,
  FiCalendar,
  FiClock,
  FiAlertTriangle,
  FiCheckCircle,  
  FiHeadphones,
  FiDownload
} from 'react-icons/fi'
import { FaChartBar } from "react-icons/fa";
import { FiMenu, FiHome, FiLogOut } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import { Link as RouterLink } from 'react-router-dom'

const DashboardAdmin = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { logout } = useAuth()
  // Menú específico para administradores
  const menuItems = [
    { label: 'Crear categoría Podcasts', href: '/dashboard/admin/podcast-category' },
    { label: 'Crear subcategoría de Podcasts', href: '/dashboard/admin/podcast-subcategory' },
    { label: 'Crear categoría de noticias', href: '/dashboard/admin/news-category' },
    { label: 'Crear subcategoría de noticias', href: '/dashboard/admin/news-subcategory' },
    { label: 'Crear Menú', href: '/dashboard/admin/menu-management' },
    { label: 'Gestionar Suscriptores', href: '/dashboard/admin/subscribers' },
    { label: 'Gestionar Roles', href: '/dashboard/admin/user-roles' }
  ]

  // Datos de ejemplo - en producción vendrían del backend
  const adminStats = {
    totalUsers: 1250,
    activeUsers: 980,
    totalPrograms: 45,
    livePrograms: 3,
    totalRevenue: 12500,
    monthlyGrowth: 12.5
  }

  const recentUsers = [
    { id: 1, name: 'Juan Pérez', email: 'juan@email.com', joinDate: '2024-01-15', status: 'Activo' },
    { id: 2, name: 'María García', email: 'maria@email.com', joinDate: '2024-01-14', status: 'Activo' },
    { id: 3, name: 'Carlos López', email: 'carlos@email.com', joinDate: '2024-01-13', status: 'Inactivo' },
  ]

  const systemAlerts = [
    { type: 'warning', message: 'Alto uso de CPU en servidor principal', time: 'Hace 5 min' },
    { type: 'info', message: 'Nueva actualización disponible', time: 'Hace 1 hora' },
    { type: 'success', message: 'Backup completado exitosamente', time: 'Hace 2 horas' }
  ]

  const quickActions = [
    { icon: FiUsers, label: 'Gestionar Usuarios', color: 'blue' },
    { icon: FiRadio, label: 'Programar Contenido', color: 'green' },
    { icon: FaChartBar, label: 'Ver Reportes', color: 'purple' },
    { icon: FiSettings, label: 'Configuración', color: 'gray' }
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
                  Panel de Administración
                </Heading>
                <Text color={textColor}>
                  Gestión completa del sistema Radio FM
                </Text>
              </VStack>
              <HStack spacing={2}>
                <IconButton aria-label="Abrir menú" icon={<FiMenu />} onClick={onOpen} />
                <IconButton as={RouterLink} to="/" aria-label="Inicio" icon={<FiHome />} />
                <Button leftIcon={<FiLogOut />} colorScheme="red" variant="outline" onClick={logout}>
                  Cerrar sesión
                </Button>
                <HStack spacing={4}>
                  <Avatar size="md" name="Admin" bg="red.500" />
                  <VStack align="start" spacing={0}>
                    <Text fontWeight="medium">Administrador</Text>
                    <Text fontSize="sm" color={textColor}>admin@radiofm.com</Text>
                  </VStack>
                </HStack>
              </HStack>
            </HStack>
          </Box>

          {/* Barra lateral (Drawer) */}
          <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
            <DrawerOverlay />
            <DrawerContent>
              <DrawerCloseButton />
              <DrawerHeader>Menú</DrawerHeader>
              <DrawerBody>
                <VStack align="stretch" spacing={2}>
                  {(menuItems || []).map((item, idx) => (
                    <Button
                      key={idx}
                      as={RouterLink}
                      to={item.href || '#'}
                      justifyContent="start"
                      variant="ghost"
                    >
                      {item.label}
                    </Button>
                  ))}
                </VStack>
              </DrawerBody>
              <DrawerFooter>
                <Button variant="outline" mr={3} onClick={onClose}>
                  Cerrar
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          {/* Alertas del Sistema */}
          {systemAlerts.length > 0 && (
            <VStack spacing={3} align="stretch">
              {systemAlerts.map((alert, index) => (
                <Alert 
                  key={index}
                  status={alert.type}
                  borderRadius="md"
                  variant="left-accent"
                >
                  <AlertIcon />
                  <Box>
                    <AlertTitle fontSize="sm">{alert.message}</AlertTitle>
                    <AlertDescription fontSize="xs" color={textColor}>
                      {alert.time}
                    </AlertDescription>
                  </Box>
                </Alert>
              ))}
            </VStack>
          )}

          {/* Estadísticas principales */}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
            <GridItem>
              <Card bg={cardBg} boxShadow="md">
                <CardBody>
                  <Stat>
                    <StatLabel>Total Usuarios</StatLabel>
                    <StatNumber color="blue.500">{adminStats.totalUsers.toLocaleString()}</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      +{adminStats.monthlyGrowth}% este mes
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card bg={cardBg} boxShadow="md">
                <CardBody>
                  <Stat>
                    <StatLabel>Usuarios Activos</StatLabel>
                    <StatNumber color="green.500">{adminStats.activeUsers.toLocaleString()}</StatNumber>
                    <StatHelpText>
                      <Progress value={(adminStats.activeUsers/adminStats.totalUsers)*100} size="sm" colorScheme="green" />
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card bg={cardBg} boxShadow="md">
                <CardBody>
                  <Stat>
                    <StatLabel>Programas Totales</StatLabel>
                    <StatNumber color="purple.500">{adminStats.totalPrograms}</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      +3 esta semana
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card bg={cardBg} boxShadow="md">
                <CardBody>
                  <Stat>
                    <StatLabel>En Vivo</StatLabel>
                    <StatNumber color="red.500">{adminStats.livePrograms}</StatNumber>
                    <StatHelpText>
                      <Icon as={FiRadio} color="red.500" />
                      Programas activos
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>

          <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
            {/* Usuarios Recientes */}
            <GridItem>
              <Card bg={cardBg} boxShadow="md">
                <CardHeader>
                  <HStack justify="space-between">
                    <Heading size="md">Usuarios Recientes</Heading>
                    <Button size="sm" variant="outline" colorScheme="blue">
                      Ver Todos
                    </Button>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>Usuario</Th>
                        <Th>Fecha</Th>
                        <Th>Estado</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {recentUsers.map((user) => (
                        <Tr key={user.id}>
                          <Td>
                            <VStack align="start" spacing={0}>
                              <Text fontWeight="medium" fontSize="sm">{user.name}</Text>
                              <Text fontSize="xs" color={textColor}>{user.email}</Text>
                            </VStack>
                          </Td>
                          <Td fontSize="sm" color={textColor}>{user.joinDate}</Td>
                          <Td>
                            <Badge 
                              colorScheme={user.status === 'Activo' ? 'green' : 'gray'}
                              variant="subtle"
                              fontSize="xs"
                            >
                              {user.status}
                            </Badge>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
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

          {/* Métricas del Sistema */}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
            <GridItem>
              <Card bg={cardBg} boxShadow="md">
                <CardHeader>
                  <Heading size="md">Rendimiento del Sistema</Heading>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack spacing={4} align="stretch">
                    <Box>
                      <HStack justify="space-between" mb={2}>
                        <Text fontSize="sm" fontWeight="medium">Uso de CPU</Text>
                        <Text fontSize="sm" color={textColor}>65%</Text>
                      </HStack>
                      <Progress value={65} colorScheme="green" size="sm" />
                    </Box>
                    <Box>
                      <HStack justify="space-between" mb={2}>
                        <Text fontSize="sm" fontWeight="medium">Memoria</Text>
                        <Text fontSize="sm" color={textColor}>78%</Text>
                      </HStack>
                      <Progress value={78} colorScheme="yellow" size="sm" />
                    </Box>
                    <Box>
                      <HStack justify="space-between" mb={2}>
                        <Text fontSize="sm" fontWeight="medium">Almacenamiento</Text>
                        <Text fontSize="sm" color={textColor}>45%</Text>
                      </HStack>
                      <Progress value={45} colorScheme="blue" size="sm" />
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </GridItem>

            <GridItem>
              <Card bg={cardBg} boxShadow="md">
                <CardHeader>
                  <Heading size="md">Ingresos</Heading>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack spacing={4} align="stretch">
                    <Stat>
                      <StatLabel>Este Mes</StatLabel>
                      <StatNumber color="green.500">${adminStats.totalRevenue.toLocaleString()}</StatNumber>
                      <StatHelpText>
                        <StatArrow type="increase" />
                        +15% vs mes anterior
                      </StatHelpText>
                    </Stat>
                    <Divider />
                    <HStack justify="space-between">
                      <Text fontSize="sm" color={textColor}>Suscriptores Premium</Text>
                      <Text fontSize="sm" fontWeight="medium">850</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm" color={textColor}>Suscriptores Básicos</Text>
                      <Text fontSize="sm" fontWeight="medium">400</Text>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>
        </VStack>
      </Container>
    </Box>
  )
}

export default DashboardAdmin
