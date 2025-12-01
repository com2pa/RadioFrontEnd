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
  IconButton,
  useDisclosure
} from '@chakra-ui/react'
import { 
  FiUsers, 
  FiRadio, 
  FiTrendingUp, 
  FiSettings, 
  FiMenu,
  FiHome,
  FiLogOut
} from 'react-icons/fi'
import { FaChartBar } from "react-icons/fa";
import { useAuth } from '../../hooks/useAuth'
import { Link as RouterLink } from 'react-router-dom'
import AdminMenu from '../../components/layout/AdminMenu'
import { getUserRoleInfo } from '../../utils/roleUtils'

const DashboardAdmin = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { auth, logout } = useAuth()
  const roleInfo = getUserRoleInfo(auth)

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
      <Container maxW="container.xl" py={{ base: 4, md: 6, lg: 8 }} px={{ base: 4, md: 6 }}>
        <VStack spacing={{ base: 4, md: 6, lg: 8 }} align="stretch">
          {/* Header del Dashboard */}
          <Box>
            <VStack align="stretch" spacing={4}>
              {/* Título y subtítulo */}
              <VStack align={{ base: "start", md: "start" }} spacing={1}>
                <Heading 
                  size={{ base: "md", md: "lg", lg: "xl" }} 
                  color="blue.600"
                >
                  Panel de Administración
                </Heading>
                <Text 
                  color={textColor}
                  fontSize={{ base: "sm", md: "md" }}
                >
                  Gestión completa del sistema Radio FM
                </Text>
              </VStack>
              
              {/* Navegación y perfil - Responsive */}
              <Flex
                direction={{ base: "column", md: "row" }}
                justify="space-between"
                align={{ base: "stretch", md: "center" }}
                gap={4}
                wrap="wrap"
              >
                {/* Botones de navegación */}
                <HStack spacing={2} flexWrap="wrap">
                  <IconButton 
                    aria-label="Abrir menú" 
                    icon={<FiMenu />} 
                    onClick={onOpen}
                    size={{ base: "sm", md: "md" }}
                  />
                  <IconButton 
                    as={RouterLink} 
                    to="/" 
                    aria-label="Inicio" 
                    icon={<FiHome />}
                    size={{ base: "sm", md: "md" }}
                  />
                  <Button 
                    leftIcon={<FiLogOut />} 
                    colorScheme="red" 
                    variant="outline" 
                    onClick={logout}
                    size={{ base: "sm", md: "md" }}
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    <Text display={{ base: "none", sm: "block" }}>Cerrar sesión</Text>
                    <Text display={{ base: "block", sm: "none" }}>Salir</Text>
                  </Button>
                </HStack>
                
                {/* Perfil de usuario */}
                <HStack spacing={3}>
                  <Avatar 
                    size={{ base: "sm", md: "md" }} 
                    name={auth?.user_name || auth?.name || 'Usuario'} 
                    bg="red.500" 
                  />
                  <VStack align="start" spacing={0} display={{ base: "none", sm: "flex" }}>
                    <HStack spacing={2} flexWrap="wrap">
                      <Text 
                        fontWeight="medium"
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        {auth?.user_name || auth?.name || 'Usuario'}
                      </Text>
                      <Badge 
                        colorScheme="red" 
                        variant="solid" 
                        fontSize="xs"
                      >
                        {roleInfo.name.toUpperCase()}
                      </Badge>
                    </HStack>
                    <Text 
                      fontSize={{ base: "xs", md: "sm" }} 
                      color={textColor}
                    >
                      {auth?.user_email || auth?.email || 'usuario@radiofm.com'}
                    </Text>
                  </VStack>
                  {/* Versión compacta para móvil */}
                  <VStack align="start" spacing={0} display={{ base: "flex", sm: "none" }}>
                    <Text 
                      fontWeight="medium"
                      fontSize="xs"
                    >
                      {auth?.user_name || auth?.name || 'Usuario'}
                    </Text>
                    <Badge 
                      colorScheme="red" 
                      variant="solid" 
                      fontSize="2xs"
                    >
                      {roleInfo.name.toUpperCase()}
                    </Badge>
                  </VStack>
                </HStack>
              </Flex>
            </VStack>
          </Box>

          {/* Menú administrativo reutilizable */}
          <AdminMenu 
            isOpen={isOpen}
            onClose={onClose}
            currentPage="/dashboard/admin"
          />

          {/* Alertas del Sistema */}
          {systemAlerts.length > 0 && (
            <VStack spacing={3} align="stretch">
              {systemAlerts.map((alert, index) => (
                <Alert 
                  key={index}
                  status={alert.type}
                  borderRadius="md"
                  variant="left-accent"
                  py={{ base: 3, md: 4 }}
                >
                  <AlertIcon />
                  <Box flex="1">
                    <AlertTitle 
                      fontSize={{ base: "xs", md: "sm" }}
                      mb={1}
                    >
                      {alert.message}
                    </AlertTitle>
                    <AlertDescription 
                      fontSize={{ base: "2xs", md: "xs" }} 
                      color={textColor}
                    >
                      {alert.time}
                    </AlertDescription>
                  </Box>
                </Alert>
              ))}
            </VStack>
          )}

          {/* Estadísticas principales */}
          <Grid 
            templateColumns={{ 
              base: '1fr', 
              sm: 'repeat(2, 1fr)', 
              lg: 'repeat(4, 1fr)' 
            }} 
            gap={{ base: 4, md: 5, lg: 6 }}
          >
            <GridItem>
              <Card bg={cardBg} boxShadow="md" h="100%">
                <CardBody p={{ base: 4, md: 6 }}>
                  <Stat>
                    <StatLabel fontSize={{ base: "xs", md: "sm" }}>Total Usuarios</StatLabel>
                    <StatNumber 
                      color="blue.500"
                      fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
                    >
                      {adminStats.totalUsers.toLocaleString()}
                    </StatNumber>
                    <StatHelpText fontSize={{ base: "xs", md: "sm" }}>
                      <StatArrow type="increase" />
                      +{adminStats.monthlyGrowth}% este mes
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card bg={cardBg} boxShadow="md" h="100%">
                <CardBody p={{ base: 4, md: 6 }}>
                  <Stat>
                    <StatLabel fontSize={{ base: "xs", md: "sm" }}>Usuarios Activos</StatLabel>
                    <StatNumber 
                      color="green.500"
                      fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
                    >
                      {adminStats.activeUsers.toLocaleString()}
                    </StatNumber>
                    <StatHelpText fontSize={{ base: "xs", md: "sm" }}>
                      <Progress 
                        value={(adminStats.activeUsers/adminStats.totalUsers)*100} 
                        size="sm" 
                        colorScheme="green"
                        borderRadius="full"
                      />
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card bg={cardBg} boxShadow="md" h="100%">
                <CardBody p={{ base: 4, md: 6 }}>
                  <Stat>
                    <StatLabel fontSize={{ base: "xs", md: "sm" }}>Programas Totales</StatLabel>
                    <StatNumber 
                      color="purple.500"
                      fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
                    >
                      {adminStats.totalPrograms}
                    </StatNumber>
                    <StatHelpText fontSize={{ base: "xs", md: "sm" }}>
                      <StatArrow type="increase" />
                      +3 esta semana
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card bg={cardBg} boxShadow="md" h="100%">
                <CardBody p={{ base: 4, md: 6 }}>
                  <Stat>
                    <StatLabel fontSize={{ base: "xs", md: "sm" }}>En Vivo</StatLabel>
                    <StatNumber 
                      color="red.500"
                      fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
                    >
                      {adminStats.livePrograms}
                    </StatNumber>
                    <StatHelpText fontSize={{ base: "xs", md: "sm" }}>
                      <Icon as={FiRadio} color="red.500" mr={1} />
                      Programas activos
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>

          <Grid 
            templateColumns={{ base: '1fr', lg: '2fr 1fr' }} 
            gap={{ base: 4, md: 6, lg: 8 }}
          >
            {/* Usuarios Recientes */}
            <GridItem>
              <Card bg={cardBg} boxShadow="md">
                <CardHeader pb={{ base: 3, md: 4 }}>
                  <Flex
                    direction={{ base: "column", sm: "row" }}
                    justify="space-between"
                    align={{ base: "start", sm: "center" }}
                    gap={3}
                  >
                    <Heading 
                      size={{ base: "sm", md: "md" }}
                    >
                      Usuarios Recientes
                    </Heading>
                    <Button 
                      size={{ base: "xs", md: "sm" }} 
                      variant="outline" 
                      colorScheme="blue"
                    >
                      Ver Todos
                    </Button>
                  </Flex>
                </CardHeader>
                <CardBody pt={0} px={{ base: 3, md: 6 }} pb={{ base: 3, md: 6 }}>
                  {/* Tabla responsive - scroll horizontal en móvil */}
                  <Box overflowX="auto">
                    <Table size={{ base: "xs", md: "sm" }} variant="simple">
                      <Thead>
                        <Tr>
                          <Th fontSize={{ base: "xs", md: "sm" }}>Usuario</Th>
                          <Th fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", sm: "table-cell" }}>
                            Fecha
                          </Th>
                          <Th fontSize={{ base: "xs", md: "sm" }}>Estado</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {recentUsers.map((user) => (
                          <Tr key={user.id}>
                            <Td>
                              <VStack align="start" spacing={0}>
                                <Text 
                                  fontWeight="medium" 
                                  fontSize={{ base: "xs", md: "sm" }}
                                >
                                  {user.name}
                                </Text>
                                <Text 
                                  fontSize={{ base: "2xs", md: "xs" }} 
                                  color={textColor}
                                >
                                  {user.email}
                                </Text>
                                {/* Mostrar fecha en móvil debajo del email */}
                                <Text 
                                  fontSize="2xs" 
                                  color={textColor}
                                  display={{ base: "block", sm: "none" }}
                                  mt={1}
                                >
                                  {user.joinDate}
                                </Text>
                              </VStack>
                            </Td>
                            <Td 
                              fontSize={{ base: "xs", md: "sm" }} 
                              color={textColor}
                              display={{ base: "none", sm: "table-cell" }}
                            >
                              {user.joinDate}
                            </Td>
                            <Td>
                              <Badge 
                                colorScheme={user.status === 'Activo' ? 'green' : 'gray'}
                                variant="subtle"
                                fontSize={{ base: "2xs", md: "xs" }}
                              >
                                {user.status}
                              </Badge>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </CardBody>
              </Card>
            </GridItem>

            {/* Acciones Rápidas */}
            <GridItem>
              <Card bg={cardBg} boxShadow="md">
                <CardHeader pb={{ base: 3, md: 4 }}>
                  <Heading size={{ base: "sm", md: "md" }}>Acciones Rápidas</Heading>
                </CardHeader>
                <CardBody pt={0} px={{ base: 3, md: 6 }} pb={{ base: 3, md: 6 }}>
                  <VStack spacing={{ base: 2, md: 3 }} align="stretch">
                    {quickActions.map((action, index) => (
                      <Button
                        key={index}
                        leftIcon={<Icon as={action.icon} />}
                        variant="outline"
                        colorScheme={action.color}
                        justifyContent="start"
                        h={{ base: "44px", md: "50px" }}
                        fontSize={{ base: "xs", md: "sm" }}
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
          <Grid 
            templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} 
            gap={{ base: 4, md: 5, lg: 6 }}
          >
            <GridItem>
              <Card bg={cardBg} boxShadow="md">
                <CardHeader pb={{ base: 3, md: 4 }}>
                  <Heading size={{ base: "sm", md: "md" }}>Rendimiento del Sistema</Heading>
                </CardHeader>
                <CardBody pt={0} px={{ base: 4, md: 6 }} pb={{ base: 4, md: 6 }}>
                  <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                    <Box>
                      <HStack justify="space-between" mb={2}>
                        <Text 
                          fontSize={{ base: "xs", md: "sm" }} 
                          fontWeight="medium"
                        >
                          Uso de CPU
                        </Text>
                        <Text 
                          fontSize={{ base: "xs", md: "sm" }} 
                          color={textColor}
                        >
                          65%
                        </Text>
                      </HStack>
                      <Progress 
                        value={65} 
                        colorScheme="green" 
                        size={{ base: "xs", md: "sm" }}
                        borderRadius="full"
                      />
                    </Box>
                    <Box>
                      <HStack justify="space-between" mb={2}>
                        <Text 
                          fontSize={{ base: "xs", md: "sm" }} 
                          fontWeight="medium"
                        >
                          Memoria
                        </Text>
                        <Text 
                          fontSize={{ base: "xs", md: "sm" }} 
                          color={textColor}
                        >
                          78%
                        </Text>
                      </HStack>
                      <Progress 
                        value={78} 
                        colorScheme="yellow" 
                        size={{ base: "xs", md: "sm" }}
                        borderRadius="full"
                      />
                    </Box>
                    <Box>
                      <HStack justify="space-between" mb={2}>
                        <Text 
                          fontSize={{ base: "xs", md: "sm" }} 
                          fontWeight="medium"
                        >
                          Almacenamiento
                        </Text>
                        <Text 
                          fontSize={{ base: "xs", md: "sm" }} 
                          color={textColor}
                        >
                          45%
                        </Text>
                      </HStack>
                      <Progress 
                        value={45} 
                        colorScheme="blue" 
                        size={{ base: "xs", md: "sm" }}
                        borderRadius="full"
                      />
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </GridItem>

            <GridItem>
              <Card bg={cardBg} boxShadow="md">
                <CardHeader pb={{ base: 3, md: 4 }}>
                  <Heading size={{ base: "sm", md: "md" }}>Ingresos</Heading>
                </CardHeader>
                <CardBody pt={0} px={{ base: 4, md: 6 }} pb={{ base: 4, md: 6 }}>
                  <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                    <Stat>
                      <StatLabel fontSize={{ base: "xs", md: "sm" }}>Este Mes</StatLabel>
                      <StatNumber 
                        color="green.500"
                        fontSize={{ base: "xl", md: "2xl", lg: "3xl" }}
                      >
                        ${adminStats.totalRevenue.toLocaleString()}
                      </StatNumber>
                      <StatHelpText fontSize={{ base: "xs", md: "sm" }}>
                        <StatArrow type="increase" />
                        +15% vs mes anterior
                      </StatHelpText>
                    </Stat>
                    <Divider />
                    <HStack justify="space-between">
                      <Text 
                        fontSize={{ base: "xs", md: "sm" }} 
                        color={textColor}
                      >
                        Suscriptores Premium
                      </Text>
                      <Text 
                        fontSize={{ base: "xs", md: "sm" }} 
                        fontWeight="medium"
                      >
                        850
                      </Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text 
                        fontSize={{ base: "xs", md: "sm" }} 
                        color={textColor}
                      >
                        Suscriptores Básicos
                      </Text>
                      <Text 
                        fontSize={{ base: "xs", md: "sm" }} 
                        fontWeight="medium"
                      >
                        400
                      </Text>
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
