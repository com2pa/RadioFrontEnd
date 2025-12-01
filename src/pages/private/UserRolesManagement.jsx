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
  FormLabel,
  Switch
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
  FiStar,
  FiShield,
  FiUserCheck,
  FiUserX,
} from 'react-icons/fi'
import { TfiCrown } from "react-icons/tfi";
import { FaChartBar, FaCrown, FaUserShield } from "react-icons/fa";
import { FiMenu, FiHome, FiLogOut, FiArrowLeft } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import { Link as RouterLink } from 'react-router-dom'
import axios from 'axios'
import AdminMenu from '../../components/layout/AdminMenu'

const UserRolesManagement = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { logout } = useAuth()
  const toast = useToast()
  
  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  
  // Estados para datos del backend
  const [roles, setRoles] = useState([])
  const [roleStats, setRoleStats] = useState({
    totalRoles: 0,
    activeRoles: 0,
    inactiveRoles: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [editingRole, setEditingRole] = useState(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newRole, setNewRole] = useState({ role_name: '', role_description: '' })

  // Función para calcular estadísticas basándose en los roles
  const calculateStats = useCallback((roles) => {
    const totalRoles = roles.length
    const activeRoles = roles.filter(role => role.status === 'Activo').length
    const inactiveRoles = roles.filter(role => role.status === 'Inactivo').length
    
    setRoleStats({
      totalRoles,
      activeRoles,
      inactiveRoles
    })
  }, [])

  // Función para obtener roles del backend
  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await axios.get('/api/role')
      console.log('Response data:', response.data)
      const result = response.data
      
      if (result.success && Array.isArray(result.data)) {
        // Mapear los datos del backend al formato esperado por la UI
        const mappedRoles = result.data.map(role => ({
          id: role.id || role.role_id,
          name: role.role_name,
          description: role.role_description,
          status: 'Activo', // Por defecto activo, ajustar según tu backend
          createdAt: role.created_at || 'N/A',
          avatar: null
        }))
        console.log('Mapped roles:', mappedRoles)
        setRoles(mappedRoles)
        // Calcular estadísticas basándose en los roles mapeados
        calculateStats(mappedRoles)
      } else {
        setRoles([])
      }
    } catch (error) {
      console.error('Error fetching roles:', error)
      setError('Error al cargar los roles')
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los roles',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setRoles([])
    } finally {
      setLoading(false)
    }
  }, [toast, calculateStats])

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchRoles()
  }, [fetchRoles])

  // Filtrar roles
  const filteredRoles = roles.filter(role => {
    const roleName = typeof role.name === 'string' ? role.name : ''
    const roleDescription = typeof role.description === 'string' ? role.description : ''
    const roleStatus = typeof role.status === 'string' ? role.status : ''

    const matchesSearch = roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         roleDescription.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || roleStatus.toLowerCase() === filterStatus.toLowerCase()
    
    return matchesSearch && matchesStatus
  })

  const handleViewDetails = (role) => {
    setSelectedUser(role)
    setIsDetailModalOpen(true)
  }

  const handleEditRole = (role) => {
    setEditingRole(role)
    setIsEditModalOpen(true)
  }

  const handleCreateRole = async () => {
    try {
      if (!newRole.role_name.trim()) {
        toast({
          title: 'Error',
          description: 'El nombre del rol es requerido',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        return
      }

      const response = await axios.post('/api/role', {
        role_name: newRole.role_name,
        role_description: newRole.role_description
      })

      if (response.data.success) {
        toast({
          title: 'Rol creado',
          description: 'El rol ha sido creado exitosamente',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        setNewRole({ role_name: '', role_description: '' })
        setIsCreateModalOpen(false)
        fetchRoles() // Recargar la lista
      }
    } catch (error) {
      console.error('Error creating role:', error)
      toast({
        title: 'Error',
        description: 'No se pudo crear el rol',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleUpdateRole = async (roleId, updatedData) => {
    try {
      const response = await axios.put(`/api/role/${roleId}`, {
        role_name: updatedData.role_name,
        role_description: updatedData.role_description
      })

      if (response.data.success) {
        toast({
          title: 'Rol actualizado',
          description: 'El rol ha sido actualizado exitosamente',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        setIsEditModalOpen(false)
        setEditingRole(null)
        fetchRoles() // Recargar la lista
      }
    } catch (error) {
      console.error('Error updating role:', error)
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el rol',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const getRoleColor = (roleName) => {
    const value = typeof roleName === 'string' ? roleName.toLowerCase() : ''
    switch (value) {
      case 'superadmin': return 'red'
      case 'admin': return 'purple'
      case 'user': return 'blue'
      default: return 'blue'
    }
  }

  const getRoleIcon = (roleName) => {
    const value = typeof roleName === 'string' ? roleName.toLowerCase() : ''
    switch (value) {
      case 'superadmin': return FaCrown
      case 'admin': return FaUserShield
      case 'user': return FiUser
      default: return FiShield
    }
  }

  const getStatusColor = (status) => {
    const value = typeof status === 'string' ? status.toLowerCase() : ''
    switch (value) {
      case 'activo': return 'green'
      case 'inactivo': return 'red'
      default: return 'gray'
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
                    Gestión de Roles del Sistema
                  </Heading>
                </Flex>
                <Text 
                  color={textColor}
                  fontSize={{ base: "sm", md: "md" }}
                >
                  Administra roles y permisos del sistema
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
            currentPage="/dashboard/admin/user-roles"
          />

          {/* Estadísticas principales */}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={{ base: 4, md: 6 }}>
            <GridItem>
              <Card bg={cardBg} boxShadow="md">
                <CardBody>
                  <Stat>
                    <StatLabel>Total Roles</StatLabel>
                    <StatNumber color="blue.500">{roleStats.totalRoles.toLocaleString()}</StatNumber>
                    <StatHelpText>
                      <StatArrow type="increase" />
                      +{roleStats.activeRoles} activos
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card bg={cardBg} boxShadow="md">
                <CardBody>
                  <Stat>
                    <StatLabel>Roles Activos</StatLabel>
                    <StatNumber color="green.500">{roleStats.activeRoles.toLocaleString()}</StatNumber>
                    <StatHelpText>
                      <Icon as={FiCheckCircle} color="green.500" />
                      En uso
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>
            
            <GridItem>
              <Card bg={cardBg} boxShadow="md">
                <CardBody>
                  <Stat>
                    <StatLabel>Roles Inactivos</StatLabel>
                    <StatNumber color="red.500">{roleStats.inactiveRoles.toLocaleString()}</StatNumber>
                    <StatHelpText>
                      <Icon as={FiUserX} color="red.500" />
                      Deshabilitados
                    </StatHelpText>
                  </Stat>
                </CardBody>
              </Card>
            </GridItem>
          </Grid>

          {/* Filtros y búsqueda */}
          <Card bg={cardBg} boxShadow="md">
            <CardBody px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }}>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={{ base: 3, md: 4 }}>
                <GridItem>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiSearch} color="gray.300" />
                    </InputLeftElement>
                    <Input
                      placeholder="Buscar por nombre o descripción..."
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
                    <option value="inactivo">Inactivo</option>
                  </Select>
                </GridItem>
              </Grid>
            </CardBody>
          </Card>

          {/* Tabla de roles */}
          <Card bg={cardBg} boxShadow="md">
            <CardHeader px={{ base: 4, md: 6 }} pb={{ base: 3, md: 4 }}>
              <Flex
                direction={{ base: "column", sm: "row" }}
                justify="space-between"
                align={{ base: "start", sm: "center" }}
                gap={3}
              >
                <Heading size={{ base: "sm", md: "md" }}>
                  Lista de Roles ({filteredRoles.length})
                </Heading>
                <HStack spacing={2} flexWrap="wrap">
                  <Button 
                    leftIcon={<FiUsers />} 
                    colorScheme="green" 
                    variant="outline" 
                    size={{ base: "sm", md: "md" }}
                    fontSize={{ base: "xs", md: "sm" }}
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    <Text display={{ base: "none", sm: "block" }}>Crear Rol</Text>
                    <Text display={{ base: "block", sm: "none" }}>Crear</Text>
                  </Button>
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
                </HStack>
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
                      Cargando roles...
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
                    onClick={fetchRoles} 
                    colorScheme="blue" 
                    variant="outline"
                    size={{ base: "sm", md: "md" }}
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    Reintentar
                  </Button>
                </Box>
              ) : !Array.isArray(roles) || roles.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <Text 
                    color={textColor}
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    No hay roles registrados
                  </Text>
                </Box>
              ) : (
                <Box overflowX="auto">
                  <Table size={{ base: "xs", md: "sm" }} variant="simple">
                    <Thead>
                      <Tr>
                        <Th fontSize={{ base: "xs", md: "sm" }}>Rol</Th>
                        <Th fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", md: "table-cell" }}>
                          Descripción
                        </Th>
                        <Th fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", sm: "table-cell" }}>
                          Estado
                        </Th>
                        <Th fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", lg: "table-cell" }}>
                          Fecha Creación
                        </Th>
                        <Th fontSize={{ base: "xs", md: "sm" }}>Acciones</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {filteredRoles.map((role) => (
                        <Tr key={role.id}>
                          <Td>
                            <VStack align="start" spacing={1}>
                              <HStack spacing={2}>
                                <Icon as={getRoleIcon(role.name)} color={`${getRoleColor(role.name)}.500`} boxSize={4} />
                                <Text 
                                  fontWeight="medium" 
                                  fontSize={{ base: "xs", md: "sm" }}
                                  wordBreak="break-word"
                                >
                                  {role.name}
                                </Text>
                              </HStack>
                              {/* Mostrar información adicional en móvil */}
                              <VStack align="start" spacing={1} mt={1} display={{ base: "flex", md: "none" }}>
                                <Text 
                                  fontSize="2xs" 
                                  color={textColor}
                                  wordBreak="break-word"
                                >
                                  {role.description}
                                </Text>
                                <HStack spacing={2} flexWrap="wrap">
                                  <Badge 
                                    colorScheme={getStatusColor(role.status)}
                                    variant="subtle"
                                    fontSize="2xs"
                                  >
                                    {role.status}
                                  </Badge>
                                  <Text fontSize="2xs" color={textColor}>
                                    {role.createdAt}
                                  </Text>
                                </HStack>
                              </VStack>
                            </VStack>
                          </Td>
                          <Td display={{ base: "none", md: "table-cell" }}>
                            <Text 
                              fontSize={{ base: "xs", md: "sm" }} 
                              color={textColor} 
                              maxW="200px" 
                              isTruncated
                            >
                              {role.description}
                            </Text>
                          </Td>
                          <Td display={{ base: "none", sm: "table-cell" }}>
                            <Badge 
                              colorScheme={getStatusColor(role.status)}
                              variant="subtle"
                              fontSize={{ base: "2xs", md: "xs" }}
                            >
                              {role.status}
                            </Badge>
                          </Td>
                          <Td 
                            fontSize={{ base: "xs", md: "sm" }} 
                            color={textColor}
                            display={{ base: "none", lg: "table-cell" }}
                          >
                            {role.createdAt}
                          </Td>
                          <Td>
                            <HStack spacing={1}>
                              <IconButton
                                aria-label="Ver detalles"
                                icon={<FiEye />}
                                size={{ base: "xs", md: "sm" }}
                                variant="ghost"
                                onClick={() => handleViewDetails(role)}
                              />
                              <IconButton
                                aria-label="Editar rol"
                                icon={<FiEdit />}
                                size={{ base: "xs", md: "sm" }}
                                variant="ghost"
                                colorScheme="blue"
                                onClick={() => handleEditRole(role)}
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

          {/* Modal de detalles del rol */}
          <Modal 
            isOpen={isDetailModalOpen} 
            onClose={() => setIsDetailModalOpen(false)} 
            size={{ base: "full", md: "lg" }}
          >
            <ModalOverlay />
            <ModalContent mx={{ base: 0, md: 4 }} my={{ base: 0, md: 4 }}>
              <ModalHeader fontSize={{ base: "md", md: "lg" }}>Detalles del Rol</ModalHeader>
              <ModalCloseButton />
              <ModalBody px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }}>
                {selectedUser && (
                  <VStack spacing={4} align="stretch">
                    <Flex
                      direction={{ base: "column", sm: "row" }}
                      align={{ base: "start", sm: "center" }}
                      gap={4}
                    >
                      <Icon 
                        as={getRoleIcon(selectedUser.name)} 
                        color={`${getRoleColor(selectedUser.name)}.500`} 
                        boxSize={{ base: 10, md: 12 }} 
                      />
                      <VStack align="start" spacing={1} flex={1}>
                        <Heading size={{ base: "sm", md: "md" }}>{selectedUser.name}</Heading>
                        <Text color={textColor} fontSize={{ base: "xs", md: "sm" }}>{selectedUser.description}</Text>
                        <HStack spacing={2} flexWrap="wrap">
                          <Badge 
                            colorScheme={getStatusColor(selectedUser.status)}
                            variant="subtle"
                            fontSize={{ base: "xs", md: "sm" }}
                          >
                            {selectedUser.status}
                          </Badge>
                        </HStack>
                      </VStack>
                    </Flex>
                    
                    <Divider />
                    
                    <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                      <Box>
                        <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium" color={textColor}>Estado</Text>
                        <Badge 
                          colorScheme={getStatusColor(selectedUser.status)}
                          variant="subtle"
                          fontSize={{ base: "xs", md: "sm" }}
                        >
                          {selectedUser.status}
                        </Badge>
                      </Box>
                      <Box>
                        <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium" color={textColor}>Fecha de Creación</Text>
                        <Text fontSize={{ base: "xs", md: "sm" }}>{selectedUser.createdAt}</Text>
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
                      handleEditRole(selectedUser)
                    }}
                    flex={1}
                    size={{ base: "sm", md: "md" }}
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    Editar Rol
                  </Button>
                </Flex>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Modal de edición de rol */}
          <Modal 
            isOpen={isEditModalOpen} 
            onClose={() => setIsEditModalOpen(false)} 
            size={{ base: "full", md: "md" }}
          >
            <ModalOverlay />
            <ModalContent mx={{ base: 0, md: 4 }} my={{ base: 0, md: 4 }}>
              <ModalHeader fontSize={{ base: "md", md: "lg" }}>Editar Rol</ModalHeader>
              <ModalCloseButton />
              <ModalBody px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }}>
                {editingRole && (
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel fontSize={{ base: "xs", md: "sm" }}>Nombre del Rol</FormLabel>
                      <Input
                        value={editingRole.name}
                        onChange={(e) => setEditingRole({...editingRole, name: e.target.value})}
                        placeholder="Nombre del rol"
                        size={{ base: "sm", md: "md" }}
                      />
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel fontSize={{ base: "xs", md: "sm" }}>Descripción</FormLabel>
                      <Input
                        value={editingRole.description}
                        onChange={(e) => setEditingRole({...editingRole, description: e.target.value})}
                        placeholder="Descripción del rol"
                        size={{ base: "sm", md: "md" }}
                      />
                    </FormControl>
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
                    onClick={() => setIsEditModalOpen(false)}
                    flex={1}
                    size={{ base: "sm", md: "md" }}
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    colorScheme="blue" 
                    onClick={() => {
                      if (editingRole) {
                        handleUpdateRole(editingRole.id, {
                          role_name: editingRole.name,
                          role_description: editingRole.description
                        })
                      }
                    }}
                    flex={1}
                    size={{ base: "sm", md: "md" }}
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    Actualizar
                  </Button>
                </Flex>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Modal de creación de rol */}
          <Modal 
            isOpen={isCreateModalOpen} 
            onClose={() => setIsCreateModalOpen(false)} 
            size={{ base: "full", md: "md" }}
          >
            <ModalOverlay />
            <ModalContent mx={{ base: 0, md: 4 }} my={{ base: 0, md: 4 }}>
              <ModalHeader fontSize={{ base: "md", md: "lg" }}>Crear Nuevo Rol</ModalHeader>
              <ModalCloseButton />
              <ModalBody px={{ base: 4, md: 6 }} py={{ base: 4, md: 6 }}>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel fontSize={{ base: "xs", md: "sm" }}>Nombre del Rol</FormLabel>
                    <Input
                      value={newRole.role_name}
                      onChange={(e) => setNewRole({...newRole, role_name: e.target.value})}
                      placeholder="Nombre del rol"
                      size={{ base: "sm", md: "md" }}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel fontSize={{ base: "xs", md: "sm" }}>Descripción</FormLabel>
                    <Input
                      value={newRole.role_description}
                      onChange={(e) => setNewRole({...newRole, role_description: e.target.value})}
                      placeholder="Descripción del rol"
                      size={{ base: "sm", md: "md" }}
                    />
                  </FormControl>
                </VStack>
              </ModalBody>
              <ModalFooter px={{ base: 4, md: 6 }} py={{ base: 3, md: 4 }}>
                <Flex
                  direction={{ base: "column", sm: "row" }}
                  gap={2}
                  w="100%"
                >
                  <Button 
                    variant="outline" 
                    onClick={() => setIsCreateModalOpen(false)}
                    flex={1}
                    size={{ base: "sm", md: "md" }}
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    colorScheme="green" 
                    onClick={handleCreateRole}
                    flex={1}
                    size={{ base: "sm", md: "md" }}
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    Crear Rol
                  </Button>
                </Flex>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </VStack>
      </Container>
    </Box>
  )
}

export default UserRolesManagement
