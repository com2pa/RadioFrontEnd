import React, { useState } from 'react'
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
    name: '',
    description: '',
    href: '',
    icon: '',
    order: 1,
    isActive: true,
    isPublic: false,
    parentId: null
  })

  const [menuItems, setMenuItems] = useState([
    { 
      id: 1, 
      name: 'Dashboard', 
      description: 'Panel principal del sistema', 
      href: '/dashboard/admin',
      icon: 'FiHome',
      order: 1,
      isActive: true,
      isPublic: false,
      parentId: null,
      createdAt: '2024-01-15' 
    },
    { 
      id: 2, 
      name: 'Gestión de Usuarios', 
      description: 'Administrar usuarios del sistema', 
      href: '/admin/users',
      icon: 'FiUsers',
      order: 2,
      isActive: true,
      isPublic: false,
      parentId: null,
      createdAt: '2024-01-14' 
    },
    { 
      id: 3, 
      name: 'Configuración', 
      description: 'Configuración del sistema', 
      href: '/admin/settings',
      icon: 'FiSettings',
      order: 3,
      isActive: true,
      isPublic: false,
      parentId: null,
      createdAt: '2024-01-13' 
    },
    { 
      id: 4, 
      name: 'Reportes', 
      description: 'Generar reportes del sistema', 
      href: '/admin/reports',
      icon: 'FiBarChart',
      order: 4,
      isActive: false,
      isPublic: false,
      parentId: null,
      createdAt: '2024-01-12' 
    }
  ])

  const [editingId, setEditingId] = useState(null)

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

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast({
        title: 'Error',
        description: 'El nombre del menú es requerido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (!formData.href.trim()) {
      toast({
        title: 'Error',
        description: 'La URL del menú es requerida',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (editingId) {
      // Editar elemento del menú existente
      setMenuItems(prev => prev.map(item => 
        item.id === editingId 
          ? { ...item, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
          : item
      ))
      toast({
        title: 'Elemento actualizado',
        description: 'El elemento del menú ha sido actualizado exitosamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } else {
      // Crear nuevo elemento del menú
      const newMenuItem = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setMenuItems(prev => [newMenuItem, ...prev])
      toast({
        title: 'Elemento creado',
        description: 'El nuevo elemento del menú ha sido creado exitosamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    }

    setFormData({ 
      name: '', 
      description: '', 
      href: '', 
      icon: '', 
      order: 1, 
      isActive: true, 
      isPublic: false, 
      parentId: null 
    })
    setEditingId(null)
  }

  const handleEdit = (menuItem) => {
    setFormData({
      name: menuItem.name,
      description: menuItem.description,
      href: menuItem.href,
      icon: menuItem.icon,
      order: menuItem.order,
      isActive: menuItem.isActive,
      isPublic: menuItem.isPublic,
      parentId: menuItem.parentId
    })
    setEditingId(menuItem.id)
  }

  const handleDelete = (id) => {
    setMenuItems(prev => prev.filter(item => item.id !== id))
    toast({
      title: 'Elemento eliminado',
      description: 'El elemento del menú ha sido eliminado exitosamente',
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  const handleCancel = () => {
    setFormData({ 
      name: '', 
      description: '', 
      href: '', 
      icon: '', 
      order: 1, 
      isActive: true, 
      isPublic: false, 
      parentId: null 
    })
    setEditingId(null)
  }

  const toggleVisibility = (id) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, isActive: !item.isActive }
        : item
    ))
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
            <Heading size="md">
              {editingId ? 'Editar Elemento del Menú' : 'Crear Nuevo Elemento del Menú'}
            </Heading>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Nombre del menú</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ej: Dashboard, Usuarios, Configuración"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Descripción</FormLabel>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe brevemente la función de este elemento"
                    rows={2}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>URL (href)</FormLabel>
                  <Input
                    name="href"
                    value={formData.href}
                    onChange={handleInputChange}
                    placeholder="Ej: /dashboard/admin, /admin/users"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Icono</FormLabel>
                  <Input
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    placeholder="Ej: FiHome, FiUsers, FiSettings"
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Orden de aparición</FormLabel>
                  <NumberInput
                    name="order"
                    value={formData.order}
                    onChange={(value) => setFormData(prev => ({ ...prev, order: parseInt(value) || 1 }))}
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
                  <HStack spacing={4}>
                    <HStack>
                      <Switch
                        name="isActive"
                        isChecked={formData.isActive}
                        onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      />
                      <Text fontSize="sm">Activo</Text>
                    </HStack>
                    <HStack>
                      <Switch
                        name="isPublic"
                        isChecked={formData.isPublic}
                        onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                      />
                      <Text fontSize="sm">Público</Text>
                    </HStack>
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
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>Elemento</Th>
                  <Th>URL</Th>
                  <Th>Estado</Th>
                  <Th>Acciones</Th>
                </Tr>
              </Thead>
              <Tbody>
                {menuItems.map((item) => (
                  <Tr key={item.id}>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <HStack spacing={2}>
                          <Text fontWeight="medium" fontSize="sm">
                            {item.name}
                          </Text>
                          {item.isPublic && (
                            <Badge colorScheme="green" variant="subtle" fontSize="xs">
                              Público
                            </Badge>
                          )}
                        </HStack>
                        <Text fontSize="xs" color={textColor} noOfLines={1}>
                          {item.description}
                        </Text>
                      </VStack>
                    </Td>
                    <Td>
                      <Text fontSize="xs" color={textColor} fontFamily="mono">
                        {item.href}
                      </Text>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Badge
                          colorScheme={item.isActive ? 'green' : 'gray'}
                          variant="subtle"
                          fontSize="xs"
                        >
                          {item.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                        <IconButton
                          aria-label={item.isActive ? 'Ocultar' : 'Mostrar'}
                          icon={item.isActive ? <FiEyeOff /> : <FiEye />}
                          size="xs"
                          variant="ghost"
                          onClick={() => toggleVisibility(item.id)}
                        />
                      </HStack>
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
          </CardBody>
        </Card>
      </Box>
    </AdminLayout>
  )
}

export default MenuManagement
