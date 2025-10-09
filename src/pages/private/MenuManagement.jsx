import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
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
  NumberDecrementStepper
} from '@chakra-ui/react'
import { FiSave, FiEdit, FiTrash2, FiPlus, FiEye, FiEyeOff } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import AdminLayout from '../../components/layout/AdminLayout'
import axios from 'axios'

const MenuManagement = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const toast = useToast()
  const { auth } = useAuth()

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
      <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
        <Alert status="error" maxW="md">
          <AlertIcon />
          <Box>
            <AlertTitle>Acceso Denegado</AlertTitle>
            <AlertDescription>
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
    <AdminLayout 
      title="Gestión de Menús"
      subtitle="Crear y administrar elementos del menú del sistema"
    >
      <Box display={{ base: 'block', lg: 'grid' }} gridTemplateColumns="1fr 1fr" gap={8}>
        {/* Formulario */}
        <Card bg={cardBg} boxShadow="md">
          <CardHeader>
            <VStack align="stretch" spacing={4}>
              <Heading size="md">
                {editingId ? 'Editar Elemento del Menú' : 'Crear Nuevo Elemento del Menú'}
              </Heading>
              
              <FormControl>
                <FormLabel>Seleccionar tipo de menú a gestionar</FormLabel>
                <Select
                  value={selectedMenuType}
                  onChange={(e) => handleMenuTypeChange(e.target.value)}
                >
                  <option value="main">Menú Principal (Público)</option>
                  <option value="user-dashboard">Dashboard de Usuario</option>
                  <option value="admin-dashboard">Dashboard de Administración</option>
                </Select>
              </FormControl>
            </VStack>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Título del menú</FormLabel>
                  <Input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Ej: Dashboard, Usuarios, Configuración"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Ruta (path)</FormLabel>
                  <Input
                    name="path"
                    value={formData.path}
                    onChange={handleInputChange}
                    placeholder="Ej: /dashboard/admin, /admin/users"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Tipo de menú</FormLabel>
                  <Select
                    name="menu_type"
                    value={formData.menu_type}
                    onChange={handleInputChange}
                  >
                    <option value="main">Menú Principal (Público)</option>
                    <option value="user-dashboard">Dashboard de Usuario</option>
                    <option value="admin-dashboard">Dashboard de Administración</option>
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Orden de aparición</FormLabel>
                  <NumberInput
                    name="order_index"
                    value={formData.order_index}
                    onChange={(value) => setFormData(prev => ({ ...prev, order_index: parseInt(value) || 1 }))}
                    min={1}
                    max={100}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl>
                  <FormLabel>Estado</FormLabel>
                  <HStack>
                    <Switch
                      name="is_active"
                      isChecked={formData.is_active}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                    />
                    <Text fontSize="sm">Activo</Text>
                  </HStack>
                </FormControl>

                <HStack spacing={3}>
                  <Button
                    type="submit"
                    leftIcon={<FiSave />}
                    colorScheme="blue"
                    flex={1}
                  >
                    {editingId ? 'Actualizar' : 'Crear'} Elemento
                  </Button>
                  {editingId && (
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      flex={1}
                    >
                      Cancelar
                    </Button>
                  )}
                </HStack>
              </VStack>
            </form>
          </CardBody>
        </Card>

        {/* Lista de elementos del menú */}
        <Card bg={cardBg} boxShadow="md">
          <CardHeader>
            <HStack justify="space-between">
              <Heading size="md">Elementos del Menú</Heading>
              <Badge colorScheme="blue" variant="subtle">
                {menuItems.length} elementos
              </Badge>
            </HStack>
          </CardHeader>
          <CardBody pt={0}>
            {loading ? (
              <Box display="flex" justifyContent="center" py={8}>
                <Text>Cargando menús...</Text>
              </Box>
            ) : error ? (
              <Box textAlign="center" py={8}>
                <Text color="red.500" mb={4}>{error}</Text>
                <Button onClick={() => fetchMenus(selectedMenuType)} colorScheme="blue" variant="outline">
                  Reintentar
                </Button>
              </Box>
            ) : !Array.isArray(menuItems) || menuItems.length === 0 ? (
              <Box textAlign="center" py={8}>
                <Text color={textColor}>No hay elementos de menú para este tipo</Text>
              </Box>
            ) : (
              <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Título</Th>
                  <Th>Ruta</Th>
                  <Th>Tipo</Th>
                  <Th>Estado</Th>
                  <Th>Orden</Th>
                  <Th>Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {menuItems.map((item) => (
                  <Tr key={item.id}>
                    <Td>
                      <Text fontWeight="medium" fontSize="sm">
                        {item.title}
                      </Text>
                    </Td>
                    <Td>
                      <Text fontSize="xs" color={textColor} fontFamily="mono">
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
                        fontSize="xs"
                      >
                        {item.menu_type === 'main' ? 'Principal' :
                         item.menu_type === 'user-dashboard' ? 'Usuario' : 'Admin'}
                      </Badge>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Badge
                          colorScheme={item.is_active ? 'green' : 'gray'}
                          variant="subtle"
                          fontSize="xs"
                        >
                          {item.is_active ? 'Activo' : 'Inactivo'}
                        </Badge>
                        <IconButton
                          aria-label={item.is_active ? 'Ocultar' : 'Mostrar'}
                          icon={item.is_active ? <FiEyeOff /> : <FiEye />}
                          size="xs"
                          variant="ghost"
                          onClick={() => toggleVisibility(item.id)}
                        />
                      </HStack>
                    </Td>
                    <Td>
                      <Text fontSize="sm" color={textColor}>
                        {item.order_index}
                      </Text>
                    </Td>
                    <Td>
                      <HStack spacing={1}>
                        <IconButton
                          aria-label="Editar elemento"
                          icon={<FiEdit />}
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(item)}
                        />
                        <IconButton
                          aria-label="Eliminar elemento"
                          icon={<FiTrash2 />}
                          size="sm"
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
            )}
          </CardBody>
        </Card>
      </Box>
    </AdminLayout>
  )
}

export default MenuManagement
