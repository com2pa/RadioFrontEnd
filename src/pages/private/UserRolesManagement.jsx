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
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
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
                    Gestión de Roles del Sistema
                  </Heading>
                </HStack>
                <Text color={textColor}>
                  Administra roles y permisos del sistema
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
                      colorScheme={item.label === 'Gestionar Roles' ? 'blue' : undefined}
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

          {/* Estadísticas principales */}
          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={6}>
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
            <CardBody>
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={4}>
                <GridItem>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiSearch} color="gray.300" />
                    </InputLeftElement>
                    <Input
                      placeholder="Buscar por nombre o descripción..."
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
                    <option value="inactivo">Inactivo</option>
                  </Select>
                </GridItem>
              </Grid>
            </CardBody>
          </Card>

          {/* Tabla de roles */}
          <Card bg={cardBg} boxShadow="md">
            <CardHeader>
              <HStack justify="space-between">
                <Heading size="md">Lista de Roles ({filteredRoles.length})</Heading>
                <HStack spacing={2}>
                  <Button 
                    leftIcon={<FiUsers />} 
                    colorScheme="green" 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    Crear Rol
                  </Button>
                  <Button leftIcon={<FiDownload />} colorScheme="blue" variant="outline" size="sm">
                    Exportar
                  </Button>
                </HStack>
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
                  <Button onClick={fetchRoles} colorScheme="blue" variant="outline">
                    Reintentar
                  </Button>
                </Box>
              ) : !Array.isArray(roles) || roles.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <Text color={textColor}>No hay roles registrados</Text>
                </Box>
              ) : (
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th>Rol</Th>
                      <Th>Descripción</Th>
                      <Th>Estado</Th>
                      <Th>Fecha Creación</Th>
                      <Th>Acciones</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {filteredRoles.map((role) => (
                      <Tr key={role.id}>
                        <Td>
                          <HStack spacing={3}>
                            <Icon as={getRoleIcon(role.name)} color={`${getRoleColor(role.name)}.500`} />
                            <VStack align="start" spacing={0}>
                              <Text fontWeight="medium" fontSize="sm">{role.name}</Text>
                            </VStack>
                          </HStack>
                        </Td>
                        <Td>
                          <Text fontSize="sm" color={textColor} maxW="200px" isTruncated>
                            {role.description}
                          </Text>
                        </Td>
                        <Td>
                          <Badge 
                            colorScheme={getStatusColor(role.status)}
                            variant="subtle"
                            fontSize="xs"
                          >
                            {role.status}
                          </Badge>
                        </Td>
                        <Td fontSize="sm" color={textColor}>{role.createdAt}</Td>
                        <Td>
                          <HStack spacing={1}>
                            <IconButton
                              aria-label="Ver detalles"
                              icon={<FiEye />}
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewDetails(role)}
                            />
                            <IconButton
                              aria-label="Editar rol"
                              icon={<FiEdit />}
                              size="sm"
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
              )}
            </CardBody>
          </Card>

          {/* Modal de detalles del rol */}
          <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} size="lg">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Detalles del Rol</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {selectedUser && (
                  <VStack spacing={4} align="stretch">
                    <HStack spacing={4}>
                      <Icon as={getRoleIcon(selectedUser.name)} color={`${getRoleColor(selectedUser.name)}.500`} boxSize={12} />
                      <VStack align="start" spacing={1}>
                        <Heading size="md">{selectedUser.name}</Heading>
                        <Text color={textColor}>{selectedUser.description}</Text>
                        <HStack spacing={2}>
                          <Badge 
                            colorScheme={getStatusColor(selectedUser.status)}
                            variant="subtle"
                            fontSize="sm"
                          >
                            {selectedUser.status}
                          </Badge>
                        </HStack>
                      </VStack>
                    </HStack>
                    
                    <Divider />
                    
                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                      <Box>
                        <Text fontSize="sm" fontWeight="medium" color={textColor}>Estado</Text>
                        <Badge 
                          colorScheme={getStatusColor(selectedUser.status)}
                          variant="subtle"
                          fontSize="sm"
                        >
                          {selectedUser.status}
                        </Badge>
                      </Box>
                      <Box>
                        <Text fontSize="sm" fontWeight="medium" color={textColor}>Fecha de Creación</Text>
                        <Text fontSize="sm">{selectedUser.createdAt}</Text>
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
                  handleEditRole(selectedUser)
                }}>
                  Editar Rol
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Modal de edición de rol */}
          <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} size="md">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Editar Rol</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {editingRole && (
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel>Nombre del Rol</FormLabel>
                      <Input
                        value={editingRole.name}
                        onChange={(e) => setEditingRole({...editingRole, name: e.target.value})}
                        placeholder="Nombre del rol"
                      />
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>Descripción</FormLabel>
                      <Input
                        value={editingRole.description}
                        onChange={(e) => setEditingRole({...editingRole, description: e.target.value})}
                        placeholder="Descripción del rol"
                      />
                    </FormControl>
                  </VStack>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="outline" mr={3} onClick={() => setIsEditModalOpen(false)}>
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
                >
                  Actualizar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          {/* Modal de creación de rol */}
          <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} size="md">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Crear Nuevo Rol</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>Nombre del Rol</FormLabel>
                    <Input
                      value={newRole.role_name}
                      onChange={(e) => setNewRole({...newRole, role_name: e.target.value})}
                      placeholder="Nombre del rol"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Descripción</FormLabel>
                    <Input
                      value={newRole.role_description}
                      onChange={(e) => setNewRole({...newRole, role_description: e.target.value})}
                      placeholder="Descripción del rol"
                    />
                  </FormControl>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button variant="outline" mr={3} onClick={() => setIsCreateModalOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  colorScheme="green" 
                  onClick={handleCreateRole}
                >
                  Crear Rol
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </VStack>
      </Container>
    </Box>
  )
}

export default UserRolesManagement
