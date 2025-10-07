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
  Spinner
} from '@chakra-ui/react'
import { FiSave, FiEdit, FiTrash2 } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import AdminLayout from '../../components/layout/AdminLayout'
import axios from 'axios'

const PodcastCategory = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const toast = useToast()
  const { auth } = useAuth()

  // Estados
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    categoryName: ''
  })

  // Función para obtener todas las categorías
  const fetchCategories = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/category-podscats/all')
      console.log(response)
      const data = Array.isArray(response.data) ? response.data : []
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
      setCategories([])
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Función para crear categoría
  const createCategory = async (categoryData) => {
    try {
      const response = await axios.post('/api/category-podscats/create', categoryData)
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
      const response = await axios.put(`/api/category-podscats/update/${categoryId}`, categoryData)
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
      await axios.delete(`/api/category-podscats/delete/${categoryId}`)
      setCategories(prev => prev.filter(cat => cat.category_id !== categoryId))
      return true
    } catch (error) {
      console.error('Error deleting category:', error)
      return false
    }
  }

  // Cargar datos al montar el componente
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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    if (!formData.categoryName.trim()) {
      toast({
        title: 'Error',
        description: 'El nombre de la categoría es requerido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setSubmitting(false)
      return
    }

    try {
      let success = false
      if (editingId) {
        success = await updateCategory(editingId, formData)
        if (success) {
          toast({
            title: 'Categoría actualizada',
            description: 'La categoría ha sido actualizada exitosamente',
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
        } else {
          toast({
            title: 'Error',
            description: 'No se pudo actualizar la categoría',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        }
      } else {
        success = await createCategory(formData)
        if (success) {
          toast({
            title: 'Categoría creada',
            description: 'La nueva categoría ha sido creada exitosamente',
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
        } else {
          toast({
            title: 'Error',
            description: 'No se pudo crear la categoría',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        }
      }

      if (success) {
        setFormData({ categoryName: '' })
        setEditingId(null)
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error)
      toast({
        title: 'Error',
        description: 'Ocurrió un error inesperado',
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
        toast({
          title: 'Error',
          description: 'No se pudo eliminar la categoría',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
    } catch (error) {
      console.error('Error deleting category:', error)
      toast({
        title: 'Error',
        description: 'Ocurrió un error al eliminar la categoría',
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
    <AdminLayout 
      title="Gestión de Categorías de Podcasts"
      subtitle="Crear y administrar categorías para podcasts"
    >
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
                        placeholder="Ej: Tecnología, Entretenimiento, Educación"
                      />
                    </FormControl>

                    <HStack spacing={3}>
                      <Button
                        type="submit"
                        leftIcon={<FiSave />}
                        colorScheme="blue"
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
                  <Badge colorScheme="blue" variant="subtle">
                    {categories.length} categorías
                  </Badge>
                </HStack>
              </CardHeader>
              <CardBody pt={0}>
                {loading ? (
                  <Box display="flex" justifyContent="center" py={8}>
                    <Spinner size="lg" color="blue.500" />
                  </Box>
                ) : !Array.isArray(categories) || categories.length === 0 ? (
                  <Box textAlign="center" py={8}>
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
                      {categories.map((category) => (
                        <Tr key={category.category_id}>
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
    </AdminLayout>
  )
}

export default PodcastCategory
