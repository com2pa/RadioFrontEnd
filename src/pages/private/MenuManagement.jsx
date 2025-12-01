import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  useColorModeValue,
  Card,
  CardBody,
  CardHeader,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useToast,
  Heading,
  IconButton,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Switch,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useDisclosure,
  Flex,
  Spinner
} from '@chakra-ui/react'
import { FiSave, FiEdit, FiTrash2, FiPlus, FiEye, FiEyeOff, FiMenu, FiHome, FiLogOut, FiArrowLeft } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import { Link as RouterLink } from 'react-router-dom'
import AdminMenu from '../../components/layout/AdminMenu'
import axios from 'axios'

const MenuManagement = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const toast = useToast()
  const { auth, logout } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()

  // Debug: Verificar datos del usuario
  console.log('🔍 [MenuManagement] - Auth data:', auth)
  console.log('🔍 [MenuManagement] - User role:', auth?.role)
  console.log('🔍 [MenuManagement] - Is admin?', auth?.role === 'admin' || auth?.role === 'superAdmin')

  const [formData, setFormData] = useState({
    title: '',
    path: '',
    menu_type: 'main',
    is_active: true,
    order_index: 1
  })

  const [menuItems, setMenuItems] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedMenuType, setSelectedMenuType] = useState('main')

  // Función para obtener menús del backend
  const fetchMenus = useCallback(async (menuType = 'main') => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await axios.get(`/api/menu/${menuType}`)
      console.log('Response data:', response.data)
      const result = response.data
      
      if (result.success && Array.isArray(result.data)) {
        setMenuItems(result.data)
      } else {
        setMenuItems([])
      }
    } catch (error) {
      console.error('Error fetching menus:', error)
      setError('Error al cargar los menús')
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los menús',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setMenuItems([])
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Cargar menús al montar el componente
  useEffect(() => {
    fetchMenus(selectedMenuType)
  }, [fetchMenus, selectedMenuType])

  // Verificar permisos de administrador
  if (!auth || (auth.role !== 'admin' && auth.role !== 'superAdmin')) {
    return (
      <Box 
        minH="100vh" 
        bg={bgColor} 
        display="flex" 
        alignItems="center" 
        justifyContent="center"
        px={4}
      >
        <Alert status="error" maxW="md" borderRadius="md">
          <AlertIcon />
          <Box>
            <AlertTitle fontSize={{ base: "sm", md: "md" }}>Acceso Denegado</AlertTitle>
            <AlertDescription fontSize={{ base: "xs", md: "sm" }}>
              No tienes permisos para acceder a esta página.
            </AlertDescription>
          </Box>
        </Alert>
      </Box>
    )
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleMenuTypeChange = (menuType) => {
    setSelectedMenuType(menuType)
    setFormData(prev => ({
      ...prev,
      menu_type: menuType
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast({
        title: 'Error',
        description: 'El título del menú es requerido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (!formData.path.trim()) {
      toast({
        title: 'Error',
        description: 'La ruta del menú es requerida',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      if (editingId) {
        // Actualizar elemento del menú existente
        const response = await axios.put(`/api/menu/${editingId}`, {
          title: formData.title,
          path: formData.path,
          menu_type: formData.menu_type,
          is_active: formData.is_active,
          order_index: formData.order_index
        })

        if (response.data.success) {
          toast({
            title: 'Elemento actualizado',
            description: 'El elemento del menú ha sido actualizado exitosamente',
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
          fetchMenus(selectedMenuType) // Recargar la lista
        }
      } else {
        // Crear nuevo elemento del menú
        const response = await axios.post('/api/menu/create', {
          title: formData.title,
          path: formData.path,
          menu_type: formData.menu_type,
          is_active: formData.is_active,
          order_index: formData.order_index
        })

        if (response.data.success) {
          toast({
            title: 'Elemento creado',
            description: 'El nuevo elemento del menú ha sido creado exitosamente',
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
          fetchMenus(selectedMenuType) // Recargar la lista
        }
      }

      // Limpiar formulario
      setFormData({ 
        title: '', 
        path: '', 
        menu_type: selectedMenuType, 
        is_active: true, 
        order_index: 1 
      })
      setEditingId(null)
    } catch (error) {
      console.error('Error saving menu item:', error)
      toast({
        title: 'Error',
        description: 'No se pudo guardar el elemento del menú',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleEdit = (menuItem) => {
    setFormData({
      title: menuItem.title,
      path: menuItem.path,
      menu_type: menuItem.menu_type,
      is_active: menuItem.is_active,
      order_index: menuItem.order_index
    })
    setEditingId(menuItem.id)
  }

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`/api/menu/${id}`)
      
      if (response.data.success) {
        toast({
          title: 'Elemento eliminado',
          description: 'El elemento del menú ha sido eliminado exitosamente',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        fetchMenus(selectedMenuType) // Recargar la lista
      }
    } catch (error) {
      console.error('Error deleting menu item:', error)
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el elemento del menú',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleCancel = () => {
    setFormData({ 
      title: '', 
      path: '', 
      menu_type: selectedMenuType, 
      is_active: true, 
      order_index: 1 
    })
    setEditingId(null)
  }

  const toggleVisibility = async (id) => {
    try {
      const menuItem = menuItems.find(item => item.id === id)
      if (!menuItem) return

      const response = await axios.put(`/api/menu/${id}`, {
        title: menuItem.title,
        path: menuItem.path,
        menu_type: menuItem.menu_type,
        is_active: !menuItem.is_active,
        order_index: menuItem.order_index
      })

      if (response.data.success) {
        toast({
          title: 'Estado actualizado',
          description: `El elemento ha sido ${!menuItem.is_active ? 'activado' : 'desactivado'}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        fetchMenus(selectedMenuType) // Recargar la lista
      }
    } catch (error) {
      console.error('Error toggling visibility:', error)
      toast({
        title: 'Error',
        description: 'No se pudo cambiar el estado del elemento',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
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
                    Gestión de Menús
                  </Heading>
                </Flex>
                <Text 
                  color={textColor}
                  fontSize={{ base: "sm", md: "md" }}
                >
                  Crear y administrar elementos del menú del sistema
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
              </Flex>
            </VStack>
          </Box>

          {/* Menú administrativo reutilizable */}
          <AdminMenu 
            isOpen={isOpen}
            onClose={onClose}
            currentPage="/dashboard/admin/menu-management"
          />

          {/* Contenido principal */}
          <Box 
            display={{ base: 'block', lg: 'grid' }} 
            gridTemplateColumns="1fr 1fr" 
            gap={{ base: 4, md: 6, lg: 8 }}
          >
            {/* Formulario */}
            <Card bg={cardBg} boxShadow="md">
              <CardHeader pb={{ base: 3, md: 4 }}>
                <VStack align="stretch" spacing={{ base: 3, md: 4 }}>
                  <Heading size={{ base: "sm", md: "md" }}>
                    {editingId ? 'Editar Elemento del Menú' : 'Crear Nuevo Elemento del Menú'}
                  </Heading>
                  
                  <FormControl>
                    <FormLabel fontSize={{ base: "sm", md: "md" }}>
                      Seleccionar tipo de menú a gestionar
                    </FormLabel>
                    <Select
                      value={selectedMenuType}
                      onChange={(e) => handleMenuTypeChange(e.target.value)}
                      size={{ base: "sm", md: "md" }}
                    >
                      <option value="main">Menú Principal (Público)</option>
                      <option value="user-dashboard">Dashboard de Usuario</option>
                      <option value="admin-dashboard">Dashboard de Administración</option>
                    </Select>
                  </FormControl>
                </VStack>
              </CardHeader>
              <CardBody px={{ base: 4, md: 6 }} pb={{ base: 4, md: 6 }}>
                <form onSubmit={handleSubmit}>
                  <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                    <FormControl isRequired>
                      <FormLabel fontSize={{ base: "sm", md: "md" }}>
                        Título del menú
                      </FormLabel>
                      <Input
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Ej: Dashboard, Usuarios, Configuración"
                        size={{ base: "sm", md: "md" }}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel fontSize={{ base: "sm", md: "md" }}>
                        Ruta (path)
                      </FormLabel>
                      <Input
                        name="path"
                        value={formData.path}
                        onChange={handleInputChange}
                        placeholder="Ej: /dashboard/admin, /admin/users"
                        size={{ base: "sm", md: "md" }}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel fontSize={{ base: "sm", md: "md" }}>
                        Tipo de menú
                      </FormLabel>
                      <Select
                        name="menu_type"
                        value={formData.menu_type}
                        onChange={handleInputChange}
                        size={{ base: "sm", md: "md" }}
                      >
                        <option value="main">Menú Principal (Público)</option>
                        <option value="user-dashboard">Dashboard de Usuario</option>
                        <option value="admin-dashboard">Dashboard de Administración</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize={{ base: "sm", md: "md" }}>
                        Orden de aparición
                      </FormLabel>
                      <NumberInput
                        name="order_index"
                        value={formData.order_index}
                        onChange={(value) => setFormData(prev => ({ ...prev, order_index: parseInt(value) || 1 }))}
                        min={1}
                        max={100}
                        size={{ base: "sm", md: "md" }}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>

                    <FormControl>
                      <FormLabel fontSize={{ base: "sm", md: "md" }}>
                        Estado
                      </FormLabel>
                      <HStack spacing={3}>
                        <Switch
                          name="is_active"
                          isChecked={formData.is_active}
                          onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                          size={{ base: "sm", md: "md" }}
                        />
                        <Text fontSize={{ base: "xs", md: "sm" }}>Activo</Text>
                      </HStack>
                    </FormControl>

                    <Flex
                      direction={{ base: "column", sm: "row" }}
                      gap={3}
                    >
                      <Button
                        type="submit"
                        leftIcon={<FiSave />}
                        colorScheme="blue"
                        flex={1}
                        size={{ base: "sm", md: "md" }}
                        fontSize={{ base: "xs", md: "sm" }}
                      >
                        {editingId ? 'Actualizar' : 'Crear'} Elemento
                      </Button>
                      {editingId && (
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          flex={1}
                          size={{ base: "sm", md: "md" }}
                          fontSize={{ base: "xs", md: "sm" }}
                        >
                          Cancelar
                        </Button>
                      )}
                    </Flex>
                  </VStack>
                </form>
              </CardBody>
            </Card>

            {/* Lista de elementos del menú */}
            <Card bg={cardBg} boxShadow="md">
              <CardHeader pb={{ base: 3, md: 4 }}>
                <Flex
                  direction={{ base: "column", sm: "row" }}
                  justify="space-between"
                  align={{ base: "start", sm: "center" }}
                  gap={3}
                >
                  <Heading size={{ base: "sm", md: "md" }}>
                    Elementos del Menú
                  </Heading>
                  <Badge 
                    colorScheme="blue" 
                    variant="subtle"
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    {menuItems.length} elementos
                  </Badge>
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
                        Cargando menús...
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
                      onClick={() => fetchMenus(selectedMenuType)} 
                      colorScheme="blue" 
                      variant="outline"
                      size={{ base: "sm", md: "md" }}
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      Reintentar
                    </Button>
                  </Box>
                ) : !Array.isArray(menuItems) || menuItems.length === 0 ? (
                  <Box textAlign="center" py={8}>
                    <Text 
                      color={textColor}
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      No hay elementos de menú para este tipo
                    </Text>
                  </Box>
                ) : (
                  <Box overflowX="auto">
                    <Table size={{ base: "xs", md: "sm" }} variant="simple">
                      <Thead>
                        <Tr>
                          <Th fontSize={{ base: "xs", md: "sm" }}>Título</Th>
                          <Th fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", md: "table-cell" }}>
                            Ruta
                          </Th>
                          <Th fontSize={{ base: "xs", md: "sm" }}>Tipo</Th>
                          <Th fontSize={{ base: "xs", md: "sm" }}>Estado</Th>
                          <Th fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", lg: "table-cell" }}>
                            Orden
                          </Th>
                          <Th fontSize={{ base: "xs", md: "sm" }}>Acciones</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {menuItems.map((item) => (
                          <Tr key={item.id}>
                            <Td>
                              <VStack align="start" spacing={0}>
                                <Text 
                                  fontWeight="medium" 
                                  fontSize={{ base: "xs", md: "sm" }}
                                  wordBreak="break-word"
                                >
                                  {item.title}
                                </Text>
                                {/* Mostrar ruta en móvil debajo del título */}
                                <Text 
                                  fontSize="2xs" 
                                  color={textColor} 
                                  fontFamily="mono"
                                  display={{ base: "block", md: "none" }}
                                  mt={1}
                                >
                                  {item.path}
                                </Text>
                                {/* Mostrar orden en móvil */}
                                <Text 
                                  fontSize="2xs" 
                                  color={textColor}
                                  display={{ base: "block", lg: "none" }}
                                  mt={1}
                                >
                                  Orden: {item.order_index}
                                </Text>
                              </VStack>
                            </Td>
                            <Td display={{ base: "none", md: "table-cell" }}>
                              <Text 
                                fontSize={{ base: "2xs", md: "xs" }} 
                                color={textColor} 
                                fontFamily="mono"
                                wordBreak="break-word"
                              >
                                {item.path}
                              </Text>
                            </Td>
                            <Td>
                              <Badge
                                colorScheme={
                                  item.menu_type === 'main' ? 'blue' :
                                  item.menu_type === 'user-dashboard' ? 'green' : 'purple'
                                }
                                variant="subtle"
                                fontSize={{ base: "2xs", md: "xs" }}
                              >
                                {item.menu_type === 'main' ? 'Principal' :
                                 item.menu_type === 'user-dashboard' ? 'Usuario' : 'Admin'}
                              </Badge>
                            </Td>
                            <Td>
                              <HStack spacing={2} flexWrap="wrap">
                                <Badge
                                  colorScheme={item.is_active ? 'green' : 'gray'}
                                  variant="subtle"
                                  fontSize={{ base: "2xs", md: "xs" }}
                                >
                                  {item.is_active ? 'Activo' : 'Inactivo'}
                                </Badge>
                                <IconButton
                                  aria-label={item.is_active ? 'Ocultar' : 'Mostrar'}
                                  icon={item.is_active ? <FiEyeOff /> : <FiEye />}
                                  size={{ base: "2xs", md: "xs" }}
                                  variant="ghost"
                                  onClick={() => toggleVisibility(item.id)}
                                />
                              </HStack>
                            </Td>
                            <Td display={{ base: "none", lg: "table-cell" }}>
                              <Text 
                                fontSize={{ base: "xs", md: "sm" }} 
                                color={textColor}
                              >
                                {item.order_index}
                              </Text>
                            </Td>
                            <Td>
                              <HStack spacing={1}>
                                <IconButton
                                  aria-label="Editar elemento"
                                  icon={<FiEdit />}
                                  size={{ base: "xs", md: "sm" }}
                                  variant="ghost"
                                  onClick={() => handleEdit(item)}
                                />
                                <IconButton
                                  aria-label="Eliminar elemento"
                                  icon={<FiTrash2 />}
                                  size={{ base: "xs", md: "sm" }}
                                  variant="ghost"
                                  colorScheme="red"
                                  onClick={() => handleDelete(item.id)}
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
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default MenuManagement
