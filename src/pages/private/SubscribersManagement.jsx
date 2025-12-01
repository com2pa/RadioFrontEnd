import React, { useState, useEffect, useCallback } from 'react'
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
  useDisclosure,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  Spinner,
  FormControl,
  FormLabel
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
  FiDownload,
  FiSearch,
  FiFilter,
  FiEdit,
  FiTrash2,
  FiEye,
  FiMail,
  FiPhone,
  FiCreditCard,
  FiStar
} from 'react-icons/fi'
import { FaChartBar, FaCrown } from "react-icons/fa";
import { FiMenu, FiHome, FiLogOut, FiArrowLeft } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import { Link as RouterLink } from 'react-router-dom'
import axios from 'axios'
import AdminMenu from '../../components/layout/AdminMenu'

const SubscribersManagement = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { logout } = useAuth()
  const toast = useToast()
  
  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPlan, setFilterPlan] = useState('all')
  const [selectedSubscriber, setSelectedSubscriber] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  
  // Estados para datos del backend
  const [subscribers, setSubscribers] = useState([])
  const [availableRoles, setAvailableRoles] = useState([])
  const [subscriberStats, setSubscriberStats] = useState({
    totalSubscribers: 0,
    premiumSubscribers: 0,
    basicSubscribers: 0,
    monthlyRevenue: 0,
    monthlyGrowth: 0,
    churnRate: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedUserForEdit, setSelectedUserForEdit] = useState(null)


  // Función para calcular estadísticas basándose en los usuarios
  const calculateStats = useCallback((users) => {
    const totalSubscribers = users.length
    const premiumSubscribers = users.filter(user => user.plan === 'Premium').length
    const basicSubscribers = users.filter(user => user.plan === 'Básico').length
    
    // Calcular ingresos estimados (esto debería venir del backend en un caso real)
    const monthlyRevenue = users.reduce((total, user) => {
      const planPrice = user.plan === 'Premium' ? 29.99 : 9.99
      return total + planPrice
    }, 0)
    
    setSubscriberStats({
      totalSubscribers,
      premiumSubscribers,
      basicSubscribers,
      monthlyRevenue: Math.round(monthlyRevenue),
      monthlyGrowth: 12.5, // Esto debería venir del backend
      churnRate: 2.3 // Esto debería venir del backend
    })
  }, [])

  // Función para obtener roles disponibles
  const fetchAvailableRoles = useCallback(async () => {
    try {
      const response = await axios.get('/api/role')
      const result = response.data
      
      if (result.success && Array.isArray(result.data)) {
        setAvailableRoles(result.data)
      }
    } catch (error) {
      console.error('Error fetching roles:', error)
    }
  }, [])

  // Función para obtener suscriptores del backend
  const fetchSubscribers = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await axios.get('/api/register')
      console.log('Response data:', response.data)
      const result = response.data
      
      if (result.success && Array.isArray(result.data)) {
        // Mapear los datos del backend al formato esperado por la UI
        const mappedSubscribers = result.data.map(user => ({
          id: user.user_id,
          name: `${user.user_name} ${user.user_lastname}`,
          email: user.user_email,
          phone: user.user_phone || 'N/A',
          subscriptionDate: user.created_at || user.subscription_date || 'N/A',
          plan: user.subscription_plan || 'Básico',
          status: user.subscription_status || 'Activo',
          nextBilling: user.next_billing_date || 'N/A',
          totalPaid: user.total_paid || 0,
          role: user.user_role || 'user',
          avatar: null
        }))
        console.log('Mapped subscribers:', mappedSubscribers)
        setSubscribers(mappedSubscribers)
        // Calcular estadísticas basándose en los usuarios mapeados
        calculateStats(mappedSubscribers)
      } else {
        setSubscribers([])
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error)
      setError('Error al cargar los suscriptores')
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los suscriptores',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setSubscribers([])
    } finally {
      setLoading(false)
    }
  }, [toast, calculateStats])

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchSubscribers()
    fetchAvailableRoles()
  }, [fetchSubscribers, fetchAvailableRoles])

  // Filtrar suscriptores
  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subscriber.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || subscriber.status.toLowerCase() === filterStatus.toLowerCase()
    const matchesPlan = filterPlan === 'all' || subscriber.plan.toLowerCase() === filterPlan.toLowerCase()
    
    return matchesSearch && matchesStatus && matchesPlan
  })

  const handleViewDetails = (subscriber) => {
    setSelectedSubscriber(subscriber)
    setIsDetailModalOpen(true)
  }

  const handleEditSubscriber = (subscriber) => {
    setSelectedUserForEdit(subscriber)
    setIsEditModalOpen(true)
  }

  const handleUpdateUserRole = async (userId, roleData) => {
    try {
      const response = await axios.put(`/api/register/${userId}/role`, roleData)
      
      if (response.data.success) {
        toast({
          title: 'Rol actualizado',
          description: 'El rol del usuario ha sido actualizado exitosamente',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        
        // Actualizar el estado local
        setSubscribers(prevSubscribers => 
          prevSubscribers.map(subscriber => 
            subscriber.id === userId ? { ...subscriber, role: roleData.role_name } : subscriber
          )
        )
        
        setIsEditModalOpen(false)
        setSelectedUserForEdit(null)
      }
    } catch (error) {
      console.error('Error updating user role:', error)
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el rol del usuario',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleDeleteSubscriber = async (subscriber) => {
    try {
      // Aquí puedes implementar la lógica para eliminar el suscriptor
      // await axios.delete(`/api/subscribers/${subscriber.id}`)
      // fetchSubscribers() // Recargar la lista
      
      toast({
        title: 'Función en desarrollo',
        description: `Eliminar suscriptor ${subscriber.name}`,
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Error deleting subscriber:', error)
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el suscriptor',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'activo': return 'green'
      case 'suspendido': return 'yellow'
      case 'cancelado': return 'red'
      default: return 'gray'
    }
  }

  const getPlanIcon = (plan) => {
    return plan === 'Premium' ? FaCrown : FiUser
  }

  const getPlanColor = (plan) => {
    return plan === 'Premium' ? 'purple' : 'blue'
  }

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'superadmin': return 'red'
      case 'admin': return 'purple'
      case 'user': return 'blue'
      default: return 'gray'
    }
  }

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case 'superadmin': return FaCrown
      case 'admin': return FiUser
      case 'user': return FiUser
      default: return FiUser
    }
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="container.xl" py={{ base: 4, md: 6, lg: 8 }} px={{ base: 4, md: 6 }}>
        <VStack spacing={{ base: 4, md: 6, lg: 8 }} align="stretch">
          {/* Header del Dashboard */}
          <Box>
            <VStack align="stretch" spacing={4}>
              {/* Título y botón volver */}
              <VStack align={{ base: "start", md: "start" }} spacing={2}>
                <Flex
                  direction={{ base: "column", sm: "row" }}
                  align={{ base: "start", sm: "center" }}
                  gap={{ base: 3, md: 4 }}
                  wrap="wrap"
                >
                  <Button
                    as={RouterLink}
                    to="/dashboard/admin"
                    leftIcon={<FiArrowLeft />}
                    variant="outline"
                    size={{ base: "xs", md: "sm" }}
                  >
                    <Text display={{ base: "none", sm: "block" }}>Volver</Text>
                    <Text display={{ base: "block", sm: "none" }}>←</Text>
                  </Button>
                  <Heading 
                    size={{ base: "md", md: "lg", lg: "xl" }} 
                    color="blue.600"
                  >
                    Gestión de Suscriptores
                  </Heading>
                </Flex>
                <Text 
                  color={textColor}
                  fontSize={{ base: "sm", md: "md" }}
                >
                  Administra todos los usuarios suscritos a Radio FM
                </Text>
              </VStack>
              
              {/* Navegación */}
              <Flex
                direction={{ base: "row", md: "row" }}
                justify="flex-end"
                align="center"
                gap={2}
                wrap="wrap"
              >
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
                <HStack spacing={2} display={{ base: "none", lg: "flex" }}>
                  <Avatar size={{ base: "sm", md: "md" }} name="Admin" bg="red.500" />
                  <VStack align="start" spacing={0} display={{ base: "none", xl: "flex" }}>
                    <Text fontWeight="medium" fontSize={{ base: "xs", md: "sm" }}>Administrador</Text>
                    <Text fontSize={{ base: "2xs", md: "sm" }} color={textColor}>admin@radiofm.com</Text>
                  </VStack>
                </HStack>
              </Flex>
            </VStack>
          </Box>

          {/* Menú administrativo reutilizable */}
          <AdminMenu 
            isOpen={isOpen}
            onClose={onClose}
            currentPage="/dashboard/admin/subscribers"
          />

          {/* Estadísticas principales */}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={{ base: 4, md: 6 }}>
            <GridItem>
              <Card bg={cardBg} boxShadow="md">
                <CardBody>
                  <Stat>
                    <StatLabel>Total Suscriptores</StatLabel>
                    <StatNumber color="blue.500">{subscriberStats.totalSubscribers.toLocaleString()}</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      +{subscriberStats.monthlyGrowth}% este mes
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card bg={cardBg} boxShadow="md">
                <CardBody>
                  <Stat>
                    <StatLabel>Premium</StatLabel>
                    <StatNumber color="purple.500">{subscriberStats.premiumSubscribers.toLocaleString()}</StatNumber>
                    <StatHelpText>
                      <Icon as={FaCrown} color="purple.500" />
                      {Math.round((subscriberStats.premiumSubscribers/subscriberStats.totalSubscribers)*100)}% del total
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card bg={cardBg} boxShadow="md">
                <CardBody>
                  <Stat>
                    <StatLabel>Básicos</StatLabel>
                    <StatNumber color="green.500">{subscriberStats.basicSubscribers.toLocaleString()}</StatNumber>
                    <StatHelpText>
                      <Icon as={FiUser} color="green.500" />
                      {Math.round((subscriberStats.basicSubscribers/subscriberStats.totalSubscribers)*100)}% del total
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card bg={cardBg} boxShadow="md">
                <CardBody>
                  <Stat>
                    <StatLabel>Ingresos Mensuales</StatLabel>
                    <StatNumber color="green.500">${subscriberStats.monthlyRevenue.toLocaleString()}</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      +15% vs mes anterior
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>

          {/* Filtros y búsqueda */}
          <Card bg={cardBg} boxShadow="md">
            <CardBody px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }}>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={{ base: 3, md: 4 }}>
                <GridItem>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiSearch} color="gray.300" />
                    </InputLeftElement>
                    <Input
                      placeholder="Buscar por nombre o email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      size={{ base: "sm", md: "md" }}
                    />
                  </InputGroup>
                </GridItem>
                <GridItem>
                  <Select
                    placeholder="Filtrar por estado"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    size={{ base: "sm", md: "md" }}
                  >
                    <option value="all">Todos los estados</option>
                    <option value="activo">Activo</option>
                    <option value="suspendido">Suspendido</option>
                    <option value="cancelado">Cancelado</option>
                  </Select>
                </GridItem>
                <GridItem>
                  <Select
                    placeholder="Filtrar por plan"
                    value={filterPlan}
                    onChange={(e) => setFilterPlan(e.target.value)}
                    size={{ base: "sm", md: "md" }}
                  >
                    <option value="all">Todos los planes</option>
                    <option value="premium">Premium</option>
                    <option value="básico">Básico</option>
                  </Select>
                </GridItem>
              </Grid>
            </CardBody>
          </Card>

          {/* Tabla de suscriptores */}
          <Card bg={cardBg} boxShadow="md">
            <CardHeader px={{ base: 4, md: 6 }} pb={{ base: 3, md: 4 }}>
              <Flex
                direction={{ base: "column", sm: "row" }}
                justify="space-between"
                align={{ base: "start", sm: "center" }}
                gap={3}
              >
                <Heading size={{ base: "sm", md: "md" }}>
                  Lista de Suscriptores ({filteredSubscribers.length})
                </Heading>
                <Button 
                  leftIcon={<FiDownload />} 
                  colorScheme="blue" 
                  variant="outline" 
                  size={{ base: "sm", md: "md" }}
                  fontSize={{ base: "xs", md: "sm" }}
                >
                  <Text display={{ base: "none", sm: "block" }}>Exportar</Text>
                  <Text display={{ base: "block", sm: "none" }}>Exp</Text>
                </Button>
              </Flex>
            </CardHeader>
            <CardBody pt={0} px={{ base: 3, md: 6 }} pb={{ base: 3, md: 6 }}>
              {loading ? (
                <Box display="flex" justifyContent="center" py={8}>
                  <VStack spacing={4}>
                    <Spinner size={{ base: "md", md: "lg" }} color="blue.500" />
                    <Text 
                      color={textColor}
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      Cargando suscriptores...
                    </Text>
                  </VStack>
                </Box>
              ) : error ? (
                <Box textAlign="center" py={8}>
                  <Text 
                    color="red.500" 
                    mb={4}
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    {error}
                  </Text>
                  <Button 
                    onClick={fetchSubscribers} 
                    colorScheme="blue" 
                    variant="outline"
                    size={{ base: "sm", md: "md" }}
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    Reintentar
                  </Button>
                </Box>
              ) : !Array.isArray(subscribers) || subscribers.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <Text 
                    color={textColor}
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    No hay suscriptores registrados
                  </Text>
                </Box>
              ) : (
                <Box overflowX="auto">
                  <Table size={{ base: "xs", md: "sm" }} variant="simple">
                    <Thead>
                      <Tr>
                        <Th fontSize={{ base: "xs", md: "sm" }}>Usuario</Th>
                        <Th fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", md: "table-cell" }}>
                          Plan
                        </Th>
                        <Th fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", lg: "table-cell" }}>
                          Rol
                        </Th>
                        <Th fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", md: "table-cell" }}>
                          Estado
                        </Th>
                        <Th fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", lg: "table-cell" }}>
                          Fecha Suscripción
                        </Th>
                        <Th fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", xl: "table-cell" }}>
                          Próximo Pago
                        </Th>
                        <Th fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", lg: "table-cell" }}>
                          Total Pagado
                        </Th>
                        <Th fontSize={{ base: "xs", md: "sm" }}>Acciones</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredSubscribers.map((subscriber) => (
                      <Tr key={subscriber.id}>
                        <Td>
                          <VStack align="start" spacing={1}>
                            <HStack spacing={2}>
                              <Avatar size={{ base: "xs", md: "sm" }} name={subscriber.name} bg="blue.500" />
                              <VStack align="start" spacing={0}>
                                <Text 
                                  fontWeight="medium" 
                                  fontSize={{ base: "xs", md: "sm" }}
                                  wordBreak="break-word"
                                >
                                  {subscriber.name}
                                </Text>
                                <Text 
                                  fontSize={{ base: "2xs", md: "xs" }} 
                                  color={textColor}
                                  wordBreak="break-word"
                                >
                                  {subscriber.email}
                                </Text>
                              </VStack>
                            </HStack>
                            {/* Mostrar información adicional en móvil */}
                            <VStack align="start" spacing={1} mt={1} display={{ base: "flex", md: "none" }}>
                              <HStack spacing={2} flexWrap="wrap">
                                <HStack spacing={1}>
                                  <Icon as={getPlanIcon(subscriber.plan)} color={`${getPlanColor(subscriber.plan)}.500`} boxSize={3} />
                                  <Badge 
                                    colorScheme={getPlanColor(subscriber.plan)}
                                    variant="subtle"
                                    fontSize="2xs"
                                  >
                                    {subscriber.plan}
                                  </Badge>
                                </HStack>
                                <HStack spacing={1}>
                                  <Icon as={getRoleIcon(subscriber.role)} color={`${getRoleColor(subscriber.role)}.500`} boxSize={3} />
                                  <Badge 
                                    colorScheme={getRoleColor(subscriber.role)}
                                    variant="subtle"
                                    fontSize="2xs"
                                  >
                                    {subscriber.role}
                                  </Badge>
                                </HStack>
                                <Badge 
                                  colorScheme={getStatusColor(subscriber.status)}
                                  variant="subtle"
                                  fontSize="2xs"
                                >
                                  {subscriber.status}
                                </Badge>
                              </HStack>
                              <Text fontSize="2xs" color={textColor}>
                                Suscripción: {subscriber.subscriptionDate}
                              </Text>
                              <Text fontSize="2xs" color="green.500" fontWeight="medium">
                                Total: ${subscriber.totalPaid}
                              </Text>
                            </VStack>
                          </VStack>
                        </Td>
                        <Td display={{ base: "none", md: "table-cell" }}>
                          <HStack spacing={2}>
                            <Icon as={getPlanIcon(subscriber.plan)} color={`${getPlanColor(subscriber.plan)}.500`} boxSize={4} />
                            <Text fontSize={{ base: "xs", md: "sm" }}>{subscriber.plan}</Text>
                          </HStack>
                        </Td>
                        <Td display={{ base: "none", lg: "table-cell" }}>
                          <HStack spacing={2}>
                            <Icon as={getRoleIcon(subscriber.role)} color={`${getRoleColor(subscriber.role)}.500`} boxSize={4} />
                            <Badge 
                              colorScheme={getRoleColor(subscriber.role)}
                              variant="subtle"
                              fontSize={{ base: "2xs", md: "xs" }}
                            >
                              {subscriber.role}
                            </Badge>
                          </HStack>
                        </Td>
                        <Td display={{ base: "none", md: "table-cell" }}>
                          <Badge 
                            colorScheme={getStatusColor(subscriber.status)}
                            variant="subtle"
                            fontSize={{ base: "2xs", md: "xs" }}
                          >
                            {subscriber.status}
                          </Badge>
                        </Td>
                        <Td 
                          fontSize={{ base: "xs", md: "sm" }} 
                          color={textColor}
                          display={{ base: "none", lg: "table-cell" }}
                        >
                          {subscriber.subscriptionDate}
                        </Td>
                        <Td 
                          fontSize={{ base: "xs", md: "sm" }} 
                          color={textColor}
                          display={{ base: "none", xl: "table-cell" }}
                        >
                          {subscriber.nextBilling || 'N/A'}
                        </Td>
                        <Td 
                          fontSize={{ base: "xs", md: "sm" }} 
                          fontWeight="medium" 
                          color="green.500"
                          display={{ base: "none", lg: "table-cell" }}
                        >
                          ${subscriber.totalPaid}
                        </Td>
                        <Td>
                          <HStack spacing={1}>
                            <IconButton
                              aria-label="Ver detalles"
                              icon={<FiEye />}
                              size={{ base: "xs", md: "sm" }}
                              variant="ghost"
                              onClick={() => handleViewDetails(subscriber)}
                            />
                            <IconButton
                              aria-label="Editar"
                              icon={<FiEdit />}
                              size={{ base: "xs", md: "sm" }}
                              variant="ghost"
                              colorScheme="blue"
                              onClick={() => handleEditSubscriber(subscriber)}
                            />
                            <IconButton
                              aria-label="Eliminar"
                              icon={<FiTrash2 />}
                              size={{ base: "xs", md: "sm" }}
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => handleDeleteSubscriber(subscriber)}
                            />
                          </HStack>
                        </Td>
                      </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              )}
            </CardBody>
          </Card>

          {/* Modal de detalles del suscriptor */}
          <Modal 
            isOpen={isDetailModalOpen} 
            onClose={() => setIsDetailModalOpen(false)} 
            size={{ base: "full", md: "lg" }}
          >
            <ModalOverlay />
            <ModalContent mx={{ base: 0, md: 4 }} my={{ base: 0, md: 4 }}>
              <ModalHeader fontSize={{ base: "md", md: "lg" }}>Detalles del Suscriptor</ModalHeader>
              <ModalCloseButton />
              <ModalBody px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }}>
                {selectedSubscriber && (
                  <VStack spacing={4} align="stretch">
                    <Flex
                      direction={{ base: "column", sm: "row" }}
                      align={{ base: "start", sm: "center" }}
                      gap={4}
                    >
                      <Avatar size={{ base: "md", md: "lg" }} name={selectedSubscriber.name} bg="blue.500" />
                      <VStack align="start" spacing={1} flex={1}>
                        <Heading size={{ base: "sm", md: "md" }}>{selectedSubscriber.name}</Heading>
                        <Text color={textColor} fontSize={{ base: "xs", md: "sm" }}>{selectedSubscriber.email}</Text>
                        <HStack spacing={2} flexWrap="wrap">
                          <HStack spacing={1}>
                            <Icon as={getPlanIcon(selectedSubscriber.plan)} color={`${getPlanColor(selectedSubscriber.plan)}.500`} boxSize={4} />
                            <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium">{selectedSubscriber.plan}</Text>
                          </HStack>
                          <HStack spacing={1}>
                            <Icon as={getRoleIcon(selectedSubscriber.role)} color={`${getRoleColor(selectedSubscriber.role)}.500`} boxSize={4} />
                            <Badge 
                              colorScheme={getRoleColor(selectedSubscriber.role)}
                              variant="subtle"
                              fontSize={{ base: "xs", md: "sm" }}
                            >
                              {selectedSubscriber.role}
                            </Badge>
                          </HStack>
                        </HStack>
                      </VStack>
                    </Flex>
                    
                    <Divider />
                    
                    <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                      <Box>
                        <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium" color={textColor}>Teléfono</Text>
                        <Text fontSize={{ base: "xs", md: "sm" }}>{selectedSubscriber.phone}</Text>
                      </Box>
                      <Box>
                        <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium" color={textColor}>Estado</Text>
                        <Badge 
                          colorScheme={getStatusColor(selectedSubscriber.status)}
                          variant="subtle"
                          fontSize={{ base: "xs", md: "xs" }}
                        >
                          {selectedSubscriber.status}
                        </Badge>
                      </Box>
                      <Box>
                        <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium" color={textColor}>Fecha de Suscripción</Text>
                        <Text fontSize={{ base: "xs", md: "sm" }}>{selectedSubscriber.subscriptionDate}</Text>
                      </Box>
                      <Box>
                        <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium" color={textColor}>Próximo Pago</Text>
                        <Text fontSize={{ base: "xs", md: "sm" }}>{selectedSubscriber.nextBilling || 'N/A'}</Text>
                      </Box>
                      <Box>
                        <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium" color={textColor}>Total Pagado</Text>
                        <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium" color="green.500">${selectedSubscriber.totalPaid}</Text>
                      </Box>
                    </Grid>
                  </VStack>
                )}
              </ModalBody>
              <ModalFooter px={{ base: 4, md: 6 }} py={{ base: 3, md: 4 }}>
                <Flex
                  direction={{ base: "column", sm: "row" }}
                  gap={2}
                  w="100%"
                >
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDetailModalOpen(false)}
                    flex={1}
                    size={{ base: "sm", md: "md" }}
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    Cerrar
                  </Button>
                  <Button 
                    colorScheme="blue" 
                    onClick={() => {
                      setIsDetailModalOpen(false)
                      handleEditSubscriber(selectedSubscriber)
                    }}
                    flex={1}
                    size={{ base: "sm", md: "md" }}
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    Editar
                  </Button>
                </Flex>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Modal para editar usuario */}
          <Modal 
            isOpen={isEditModalOpen} 
            onClose={() => setIsEditModalOpen(false)} 
            size={{ base: "full", md: "lg" }}
          >
            <ModalOverlay />
            <ModalContent mx={{ base: 0, md: 4 }} my={{ base: 0, md: 4 }}>
              <ModalHeader fontSize={{ base: "md", md: "lg" }}>Editar Usuario</ModalHeader>
              <ModalCloseButton />
              <ModalBody px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }}>
                {selectedUserForEdit && (
                  <VStack spacing={{ base: 4, md: 6 }} align="stretch">
                    {/* Información del usuario */}
                    <Flex
                      direction={{ base: "column", sm: "row" }}
                      align={{ base: "start", sm: "center" }}
                      gap={4}
                    >
                      <Avatar size={{ base: "md", md: "lg" }} name={selectedUserForEdit.name} bg="blue.500" />
                      <VStack align="start" spacing={1} flex={1}>
                        <Heading size={{ base: "sm", md: "md" }}>{selectedUserForEdit.name}</Heading>
                        <Text color={textColor} fontSize={{ base: "xs", md: "sm" }}>{selectedUserForEdit.email}</Text>
                        <HStack spacing={2}>
                          <Icon as={getPlanIcon(selectedUserForEdit.plan)} color={`${getPlanColor(selectedUserForEdit.plan)}.500`} boxSize={4} />
                          <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium">{selectedUserForEdit.plan}</Text>
                        </HStack>
                      </VStack>
                    </Flex>
                    
                    <Divider />
                    
                    {/* Información detallada */}
                    <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                      <Box>
                        <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium" color={textColor}>Teléfono</Text>
                        <Text fontSize={{ base: "xs", md: "sm" }}>{selectedUserForEdit.phone}</Text>
                      </Box>
                      <Box>
                        <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium" color={textColor}>Estado</Text>
                        <Badge 
                          colorScheme={getStatusColor(selectedUserForEdit.status)}
                          variant="subtle"
                          fontSize={{ base: "xs", md: "xs" }}
                        >
                          {selectedUserForEdit.status}
                        </Badge>
                      </Box>
                      <Box>
                        <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium" color={textColor}>Fecha de Suscripción</Text>
                        <Text fontSize={{ base: "xs", md: "sm" }}>{selectedUserForEdit.subscriptionDate}</Text>
                      </Box>
                      <Box>
                        <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium" color={textColor}>Próximo Pago</Text>
                        <Text fontSize={{ base: "xs", md: "sm" }}>{selectedUserForEdit.nextBilling || 'N/A'}</Text>
                      </Box>
                      <Box>
                        <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium" color={textColor}>Total Pagado</Text>
                        <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium" color="green.500">${selectedUserForEdit.totalPaid}</Text>
                      </Box>
                    </Grid>
                    
                    <Divider />
                    
                    {/* Sección para cambiar rol */}
                    <Box>
                      <Heading size={{ base: "xs", md: "sm" }} mb={4}>Cambiar Rol del Usuario</Heading>
                      <VStack spacing={4} align="stretch">
                        <FormControl>
                          <FormLabel fontSize={{ base: "xs", md: "sm" }}>Rol Actual</FormLabel>
                          <HStack spacing={2}>
                            <Icon as={getRoleIcon(selectedUserForEdit.role)} color={`${getRoleColor(selectedUserForEdit.role)}.500`} boxSize={4} />
                            <Badge 
                              colorScheme={getRoleColor(selectedUserForEdit.role)}
                              variant="subtle"
                              fontSize={{ base: "xs", md: "sm" }}
                            >
                              {selectedUserForEdit.role}
                            </Badge>
                          </HStack>
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel fontSize={{ base: "xs", md: "sm" }}>Nuevo Rol</FormLabel>
                          <Select 
                            placeholder="Seleccionar nuevo rol"
                            onChange={(e) => {
                              if (e.target.value) {
                                const selectedRole = availableRoles.find(role => role.role_name === e.target.value)
                                if (selectedRole) {
                                  handleUpdateUserRole(selectedUserForEdit.id, {
                                    role_name: selectedRole.role_name,
                                    role_description: selectedRole.role_description
                                  })
                                }
                              }
                            }}
                            size={{ base: "sm", md: "md" }}
                          >
                            {availableRoles.map((role) => (
                              <option key={role.id || role.role_id} value={role.role_name}>
                                {role.role_name}
                              </option>
                            ))}
                          </Select>
                        </FormControl>
                      </VStack>
                    </Box>
                  </VStack>
                )}
              </ModalBody>
              <ModalFooter px={{ base: 4, md: 6 }} py={{ base: 3, md: 4 }}>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditModalOpen(false)}
                  size={{ base: "sm", md: "md" }}
                  fontSize={{ base: "xs", md: "sm" }}
                  w={{ base: "100%", sm: "auto" }}
                >
                  Cerrar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </VStack>
      </Container>
    </Box>
  )
}

export default SubscribersManagement
