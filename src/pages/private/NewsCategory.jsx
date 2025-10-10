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
  Spinner,
  useDisclosure
} from '@chakra-ui/react'
import { FiSave, FiEdit, FiTrash2, FiMenu, FiHome, FiLogOut, FiArrowLeft } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import { Link as RouterLink } from 'react-router-dom'
import AdminMenu from '../../components/layout/AdminMenu'
import axios from 'axios'

const NewsCategory = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const toast = useToast()
  const { auth, logout } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [formData, setFormData] = useState({
    categoryName: ''
  })

  const [categories, setCategories] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Función para obtener todas las categorías
  const fetchCategories = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/category-news/all')
      console.log('API Response:', response.data)
      // Asegurar que siempre sea un array
      const data = Array.isArray(response.data) ? response.data : []
      console.log('Processed data:', data)
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las categorías',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      // En caso de error, establecer array vacío
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Cargar categorías al montar el componente
  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

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

  // Función para crear categoría
  const createCategory = async (categoryData) => {
    try {
      const response = await axios.post('/api/category-news/create', categoryData)
      setCategories(prev => [response.data, ...prev])
      return true
    } catch (error) {
      console.error('Error creating category:', error)
      return false
    }
  }

  // Función para actualizar categoría
  const updateCategory = async (categoryId, categoryData) => {
    try {
      const response = await axios.put(`/api/category-news/update/${categoryId}`, categoryData)
      setCategories(prev => prev.map(cat => 
        cat.category_id === categoryId ? response.data : cat
      ))
      return true
    } catch (error) {
      console.error('Error updating category:', error)
      return false
    }
  }

  // Función para eliminar categoría
  const deleteCategory = async (categoryId) => {
    try {
      await axios.delete(`/api/category-news/delete/${categoryId}`)
      setCategories(prev => prev.filter(cat => cat.category_id !== categoryId))
      return true
    } catch (error) {
      console.error('Error deleting category:', error)
      return false
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.categoryName.trim()) {
      toast({
        title: 'Error',
        description: 'El nombre de la categoría es requerido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setSubmitting(true)

    try {
      if (editingId) {
        // Editar categoría existente
        const success = await updateCategory(editingId, { categoryName: formData.categoryName })
        if (success) {
          toast({
            title: 'Categoría actualizada',
            description: 'La categoría ha sido actualizada exitosamente',
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
        } else {
          throw new Error('Error al actualizar la categoría')
        }
      } else {
        // Crear nueva categoría
        const success = await createCategory({ categoryName: formData.categoryName })
        if (success) {
          toast({
            title: 'Categoría creada',
            description: 'La nueva categoría ha sido creada exitosamente',
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
        } else {
          throw new Error('Error al crear la categoría')
        }
      }

      setFormData({ categoryName: '' })
      setEditingId(null)
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Ocurrió un error inesperado',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (category) => {
    setFormData({
      categoryName: category.category_name
    })
    setEditingId(category.category_id)
  }

  const handleDelete = async (categoryId) => {
    try {
      const success = await deleteCategory(categoryId)
      if (success) {
        toast({
          title: 'Categoría eliminada',
          description: 'La categoría ha sido eliminada exitosamente',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        throw new Error('Error al eliminar la categoría')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'No se pudo eliminar la categoría',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleCancel = () => {
    setFormData({ categoryName: '' })
    setEditingId(null)
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
                  <Heading size="lg" color="red.600">
                    Gestión de Categorías de Noticias
                  </Heading>
                </HStack>
                <Text color={textColor}>
                  Crear y administrar categorías para noticias
                </Text>
              </VStack>
              <HStack spacing={2}>
                <IconButton aria-label="Abrir menú" icon={<FiMenu />} onClick={onOpen} />
                <IconButton as={RouterLink} to="/" aria-label="Inicio" icon={<FiHome />} />
                <Button leftIcon={<FiLogOut />} colorScheme="red" variant="outline" onClick={logout}>
                  Cerrar sesión
                </Button>
              </HStack>
            </HStack>
          </Box>

          {/* Menú administrativo reutilizable */}
          <AdminMenu 
            isOpen={isOpen}
            onClose={onClose}
            currentPage="/dashboard/admin/news-category"
          />

          {/* Contenido principal */}
          <Box display={{ base: 'block', lg: 'grid' }} gridTemplateColumns="1fr 1fr" gap={8}>
            {/* Formulario */}
            <Card bg={cardBg} boxShadow="md">
              <CardHeader>
                <Heading size="md">
                  {editingId ? 'Editar Categoría' : 'Crear Nueva Categoría'}
                </Heading>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit}>
                  <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                      <FormLabel>Nombre de la categoría</FormLabel>
                      <Input
                        name="categoryName"
                        value={formData.categoryName}
                        onChange={handleInputChange}
                        placeholder="Ej: Política, Deportes, Tecnología, Economía"
                      />
                    </FormControl>

                    <HStack spacing={3}>
                      <Button
                        type="submit"
                        leftIcon={<FiSave />}
                        colorScheme="red"
                        flex={1}
                        isLoading={submitting}
                        loadingText={editingId ? 'Actualizando...' : 'Creando...'}
                      >
                        {editingId ? 'Actualizar' : 'Crear'} Categoría
                      </Button>
                      {editingId && (
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          flex={1}
                          isDisabled={submitting}
                        >
                          Cancelar
                        </Button>
                      )}
                    </HStack>
                  </VStack>
                </form>
              </CardBody>
            </Card>

            {/* Lista de categorías */}
            <Card bg={cardBg} boxShadow="md">
              <CardHeader>
                <HStack justify="space-between">
                  <Heading size="md">Categorías Existentes</Heading>
                  <Badge colorScheme="red" variant="subtle">
                    {categories.length} categorías
                  </Badge>
                </HStack>
              </CardHeader>
              <CardBody pt={0}>
                {loading ? (
                  <Box display="flex" justifyContent="center" py={8}>
                    <VStack spacing={4}>
                      <Spinner size="lg" color="red.500" />
                      <Text color={textColor}>Cargando categorías...</Text>
                    </VStack>
                  </Box>
                ) : !Array.isArray(categories) || categories.length === 0 ? (
                  <Box display="flex" justifyContent="center" py={8}>
                    <Text color={textColor}>No hay categorías creadas</Text>
                  </Box>
                ) : (
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>Nombre</Th>
                        <Th>Acciones</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {Array.isArray(categories) && categories.map((category, index) => (
                        <Tr key={category.category_id || `category-${index}`}>
                          <Td>
                            <Text fontWeight="medium" fontSize="sm">
                              {category.category_name}
                            </Text>
                          </Td>
                          <Td>
                            <HStack spacing={1}>
                              <IconButton
                                aria-label="Editar categoría"
                                icon={<FiEdit />}
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(category)}
                                isDisabled={submitting}
                              />
                              <IconButton
                                aria-label="Eliminar categoría"
                                icon={<FiTrash2 />}
                                size="sm"
                                variant="ghost"
                                colorScheme="red"
                                onClick={() => handleDelete(category.category_id)}
                                isDisabled={submitting}
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
        </VStack>
      </Container>
    </Box>
  )
}

export default NewsCategory
