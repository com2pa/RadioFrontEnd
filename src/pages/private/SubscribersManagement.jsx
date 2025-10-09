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
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8} align="stretch">
          {/* Header del Dashboard */}
          <Box>
            <HStack justify="space-between" align="center" mb={4}>
              <VStack align="start" spacing={1}>
                <HStack spacing={4}>
                  <Button
                    as={RouterLink}
                    to="/dashboard/admin"
                    leftIcon={<FiArrowLeft />}
                    variant="outline"
                    size="sm"
                  >
                    Volver
                  </Button>
                  <Heading size="lg" color="blue.600">
                    Gestión de Suscriptores
                  </Heading>
                </HStack>
                <Text color={textColor}>
                  Administra todos los usuarios suscritos a Radio FM
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

          {/* Menú administrativo reutilizable */}
          <AdminMenu 
            isOpen={isOpen}
            onClose={onClose}
            currentPage="/dashboard/admin/subscribers"
          />

          {/* Estadísticas principales */}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
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
            <CardBody>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={4}>
                <GridItem>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiSearch} color="gray.300" />
                    </InputLeftElement>
                    <Input
                      placeholder="Buscar por nombre o email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </GridItem>
                <GridItem>
                  <Select
                    placeholder="Filtrar por estado"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
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
            <CardHeader>
              <HStack justify="space-between">
                <Heading size="md">Lista de Suscriptores ({filteredSubscribers.length})</Heading>
                <Button leftIcon={<FiDownload />} colorScheme="blue" variant="outline" size="sm">
                  Exportar
                </Button>
              </HStack>
            </CardHeader>
            <CardBody pt={0}>
              {loading ? (
                <Box display="flex" justifyContent="center" py={8}>
                  <Spinner size="lg" color="blue.500" />
                </Box>
              ) : error ? (
                <Box textAlign="center" py={8}>
                  <Text color="red.500" mb={4}>{error}</Text>
                  <Button onClick={fetchSubscribers} colorScheme="blue" variant="outline">
                    Reintentar
                  </Button>
                </Box>
              ) : !Array.isArray(subscribers) || subscribers.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <Text color={textColor}>No hay suscriptores registrados</Text>
                </Box>
              ) : (
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th>Usuario</Th>
                      <Th>Plan</Th>
                      <Th>Rol</Th>
                      <Th>Estado</Th>
                      <Th>Fecha Suscripción</Th>
                      <Th>Próximo Pago</Th>
                      <Th>Total Pagado</Th>
                      <Th>Acciones</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredSubscribers.map((subscriber) => (
                    <Tr key={subscriber.id}>
                      <Td>
                        <HStack spacing={3}>
                          <Avatar size="sm" name={subscriber.name} bg="blue.500" />
                          <VStack align="start" spacing={0}>
                            <Text fontWeight="medium" fontSize="sm">{subscriber.user_name}</Text>
                            <Text fontSize="xs" color={textColor}>{subscriber.user_email}</Text>
                          </VStack>
                        </HStack>
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <Icon as={getPlanIcon(subscriber.plan)} color={`${getPlanColor(subscriber.plan)}.500`} />
                          <Text fontSize="sm">{subscriber.plan}</Text>
                        </HStack>
                      </Td>
                      <Td>
                        <HStack spacing={2}>
                          <Icon as={getRoleIcon(subscriber.role)} color={`${getRoleColor(subscriber.role)}.500`} />
                          <Badge 
                            colorScheme={getRoleColor(subscriber.role)}
                            variant="subtle"
                            fontSize="xs"
                          >
                            {subscriber.role}
                          </Badge>
                        </HStack>
                      </Td>
                      <Td>
                        <Badge 
                          colorScheme={getStatusColor(subscriber.status)}
                          variant="subtle"
                          fontSize="xs"
                        >
                          {subscriber.status}
                        </Badge>
                      </Td>
                      <Td fontSize="sm" color={textColor}>{subscriber.subscriptionDate}</Td>
                      <Td fontSize="sm" color={textColor}>
                        {subscriber.nextBilling || 'N/A'}
                      </Td>
                      <Td fontSize="sm" fontWeight="medium" color="green.500">
                        ${subscriber.totalPaid}
                      </Td>
                      <Td>
                        <HStack spacing={1}>
                          <IconButton
                            aria-label="Ver detalles"
                            icon={<FiEye />}
                            size="sm"
                            variant="ghost"
                            onClick={() => handleViewDetails(subscriber)}
                          />
                          <IconButton
                            aria-label="Editar"
                            icon={<FiEdit />}
                            size="sm"
                            variant="ghost"
                            colorScheme="blue"
                            onClick={() => handleEditSubscriber(subscriber)}
                          />
                          <IconButton
                            aria-label="Eliminar"
                            icon={<FiTrash2 />}
                            size="sm"
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
              )}
            </CardBody>
          </Card>

          {/* Modal de detalles del suscriptor */}
          <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} size="lg">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Detalles del Suscriptor</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {selectedSubscriber && (
                  <VStack spacing={4} align="stretch">
                    <HStack spacing={4}>
                      <Avatar size="lg" name={selectedSubscriber.name} bg="blue.500" />
                      <VStack align="start" spacing={1}>
                        <Heading size="md">{selectedSubscriber.name}</Heading>
                        <Text color={textColor}>{selectedSubscriber.email}</Text>
                        <HStack spacing={2}>
                          <Icon as={getPlanIcon(selectedSubscriber.plan)} color={`${getPlanColor(selectedSubscriber.plan)}.500`} />
                          <Text fontSize="sm" fontWeight="medium">{selectedSubscriber.plan}</Text>
                        </HStack>
                        <HStack spacing={2}>
                          <Icon as={getRoleIcon(selectedSubscriber.role)} color={`${getRoleColor(selectedSubscriber.role)}.500`} />
                          <Badge 
                            colorScheme={getRoleColor(selectedSubscriber.role)}
                            variant="subtle"
                            fontSize="sm"
                          >
                            {selectedSubscriber.role}
                          </Badge>
                        </HStack>
                      </VStack>
                    </HStack>
                    
                    <Divider />
                    
                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                      <Box>
                        <Text fontSize="sm" fontWeight="medium" color={textColor}>Teléfono</Text>
                        <Text fontSize="sm">{selectedSubscriber.phone}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" fontWeight="medium" color={textColor}>Estado</Text>
                        <Badge 
                          colorScheme={getStatusColor(selectedSubscriber.status)}
                          variant="subtle"
                          fontSize="xs"
                        >
                          {selectedSubscriber.status}
                        </Badge>
                      </Box>
                      <Box>
                        <Text fontSize="sm" fontWeight="medium" color={textColor}>Fecha de Suscripción</Text>
                        <Text fontSize="sm">{selectedSubscriber.subscriptionDate}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" fontWeight="medium" color={textColor}>Próximo Pago</Text>
                        <Text fontSize="sm">{selectedSubscriber.nextBilling || 'N/A'}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" fontWeight="medium" color={textColor}>Total Pagado</Text>
                        <Text fontSize="sm" fontWeight="medium" color="green.500">${selectedSubscriber.totalPaid}</Text>
                      </Box>
                    </Grid>
                  </VStack>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="outline" mr={3} onClick={() => setIsDetailModalOpen(false)}>
                  Cerrar
                </Button>
                <Button colorScheme="blue" onClick={() => {
                  setIsDetailModalOpen(false)
                  handleEditSubscriber(selectedSubscriber)
                }}>
                  Editar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Modal para editar usuario */}
          <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} size="lg">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Editar Usuario</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {selectedUserForEdit && (
                  <VStack spacing={6} align="stretch">
                    {/* Información del usuario */}
                    <HStack spacing={4}>
                      <Avatar size="lg" name={selectedUserForEdit.name} bg="blue.500" />
                      <VStack align="start" spacing={1}>
                        <Heading size="md">{selectedUserForEdit.name}</Heading>
                        <Text color={textColor}>{selectedUserForEdit.email}</Text>
                        <HStack spacing={2}>
                          <Icon as={getPlanIcon(selectedUserForEdit.plan)} color={`${getPlanColor(selectedUserForEdit.plan)}.500`} />
                          <Text fontSize="sm" fontWeight="medium">{selectedUserForEdit.plan}</Text>
                        </HStack>
                      </VStack>
                    </HStack>
                    
                    <Divider />
                    
                    {/* Información detallada */}
                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                      <Box>
                        <Text fontSize="sm" fontWeight="medium" color={textColor}>Teléfono</Text>
                        <Text fontSize="sm">{selectedUserForEdit.phone}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" fontWeight="medium" color={textColor}>Estado</Text>
                        <Badge 
                          colorScheme={getStatusColor(selectedUserForEdit.status)}
                          variant="subtle"
                          fontSize="xs"
                        >
                          {selectedUserForEdit.status}
                        </Badge>
                      </Box>
                      <Box>
                        <Text fontSize="sm" fontWeight="medium" color={textColor}>Fecha de Suscripción</Text>
                        <Text fontSize="sm">{selectedUserForEdit.subscriptionDate}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" fontWeight="medium" color={textColor}>Próximo Pago</Text>
                        <Text fontSize="sm">{selectedUserForEdit.nextBilling || 'N/A'}</Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" fontWeight="medium" color={textColor}>Total Pagado</Text>
                        <Text fontSize="sm" fontWeight="medium" color="green.500">${selectedUserForEdit.totalPaid}</Text>
                      </Box>
                    </Grid>
                    
                    <Divider />
                    
                    {/* Sección para cambiar rol */}
                    <Box>
                      <Heading size="sm" mb={4}>Cambiar Rol del Usuario</Heading>
                      <VStack spacing={4} align="stretch">
                        <FormControl>
                          <FormLabel>Rol Actual</FormLabel>
                          <HStack spacing={2}>
                            <Icon as={getRoleIcon(selectedUserForEdit.role)} color={`${getRoleColor(selectedUserForEdit.role)}.500`} />
                            <Badge 
                              colorScheme={getRoleColor(selectedUserForEdit.role)}
                              variant="subtle"
                            >
                              {selectedUserForEdit.role}
                            </Badge>
                          </HStack>
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel>Nuevo Rol</FormLabel>
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
              <ModalFooter>
                <Button variant="outline" mr={3} onClick={() => setIsEditModalOpen(false)}>
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
