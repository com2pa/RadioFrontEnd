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

const NewsSubcategory = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const toast = useToast()
  const { auth } = useAuth()

  // Estados
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const [formData, setFormData] = useState({
    category_id: '',
    subcategory_name: ''
  })

  // Función para obtener todas las categorías
  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get('/api/category-news/all')
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
    }
  }, [toast])

  // Función para obtener todas las subcategorías
  const fetchSubcategories = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/subcategory-news/')
      const data = Array.isArray(response.data) ? response.data : []
      setSubcategories(data)
    } catch (error) {
      console.error('Error fetching subcategories:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las subcategorías',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setSubcategories([])
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Función para crear subcategoría
  const createSubcategory = async (subcategoryData) => {
    try {
      const response = await axios.post('/api/subcategory-news/create', subcategoryData)
      setSubcategories(prev => [response.data, ...prev])
      return true
    } catch (error) {
      console.error('Error creating subcategory:', error)
      return false
    }
  }

  // Función para actualizar subcategoría
  const updateSubcategory = async (subcategoryId, subcategoryData) => {
    try {
      const response = await axios.put(`/api/subcategory-news/${subcategoryId}`, subcategoryData)
      setSubcategories(prev => prev.map(sub => 
        sub.subcategory_id === subcategoryId ? response.data : sub
      ))
      return true
    } catch (error) {
      console.error('Error updating subcategory:', error)
      return false
    }
  }

  // Función para eliminar subcategoría
  const deleteSubcategory = async (subcategoryId) => {
    try {
      await axios.delete(`/api/subcategory-news/${subcategoryId}`)
      setSubcategories(prev => prev.filter(sub => sub.subcategory_id !== subcategoryId))
      return true
    } catch (error) {
      console.error('Error deleting subcategory:', error)
      return false
    }
  }

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchCategories()
    fetchSubcategories()
  }, [fetchCategories, fetchSubcategories])

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
    
    if (!formData.subcategory_name.trim()) {
      toast({
        title: 'Error',
        description: 'El nombre de la subcategoría es requerido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setSubmitting(false)
      return
    }

    if (!formData.category_id) {
      toast({
        title: 'Error',
        description: 'Debe seleccionar una categoría padre',
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
        success = await updateSubcategory(editingId, formData)
        if (success) {
          toast({
            title: 'Subcategoría actualizada',
            description: 'La subcategoría ha sido actualizada exitosamente',
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
        } else {
          toast({
            title: 'Error',
            description: 'No se pudo actualizar la subcategoría',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        }
      } else {
        success = await createSubcategory(formData)
        if (success) {
          toast({
            title: 'Subcategoría creada',
            description: 'La nueva subcategoría ha sido creada exitosamente',
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
        } else {
          toast({
            title: 'Error',
            description: 'No se pudo crear la subcategoría',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        }
      }

      if (success) {
        setFormData({ category_id: '', subcategory_name: '' })
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

  const handleEdit = (subcategory) => {
    setFormData({
      category_id: subcategory.category_id.toString(),
      subcategory_name: subcategory.subcategory_name
    })
    setEditingId(subcategory.subcategory_id)
  }

  const handleDelete = async (subcategoryId) => {
    try {
      const success = await deleteSubcategory(subcategoryId)
      if (success) {
        toast({
          title: 'Subcategoría eliminada',
          description: 'La subcategoría ha sido eliminada exitosamente',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        toast({
          title: 'Error',
          description: 'No se pudo eliminar la subcategoría',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
    } catch (error) {
      console.error('Error deleting subcategory:', error)
      toast({
        title: 'Error',
        description: 'Ocurrió un error al eliminar la subcategoría',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleCancel = () => {
    setFormData({ category_id: '', subcategory_name: '' })
    setEditingId(null)
  }

  return (
    <AdminLayout 
      title="Gestión de Subcategorías de Noticias"
      subtitle="Crear y administrar subcategorías para noticias"
    >
      <Box display={{ base: 'block', lg: 'grid' }} gridTemplateColumns="1fr 1fr" gap={8}>
            {/* Formulario */}
            <Card bg={cardBg} boxShadow="md">
              <CardHeader>
                <Heading size="md">
                  {editingId ? 'Editar Subcategoría' : 'Crear Nueva Subcategoría'}
                </Heading>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit}>
                  <VStack spacing={4} align="stretch">
                    <FormControl isRequired>
                      <FormLabel>Categoría Padre</FormLabel>
                      <Select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleInputChange}
                        placeholder="Selecciona una categoría"
                      >
                        {categories.map((category, index) => (
                          <option key={category.category_id || `category-${index}`} value={category.category_id}>
                            {category.category_name}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Nombre de la subcategoría</FormLabel>
                      <Input
                        name="subcategory_name"
                        value={formData.subcategory_name}
                        onChange={handleInputChange}
                        placeholder="Ej: Elecciones, Fútbol, Inteligencia Artificial"
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
                        {editingId ? 'Actualizar' : 'Crear'} Subcategoría
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

            {/* Lista de subcategorías */}
            <Card bg={cardBg} boxShadow="md">
              <CardHeader>
                <HStack justify="space-between">
                  <Heading size="md">Subcategorías Existentes</Heading>
                  <Badge colorScheme="red" variant="subtle">
                    {subcategories.length} subcategorías
                  </Badge>
                </HStack>
              </CardHeader>
              <CardBody pt={0}>
                {loading ? (
                  <Box display="flex" justifyContent="center" py={8}>
                    <Spinner size="lg" color="red.500" />
                  </Box>
                ) : !Array.isArray(subcategories) || subcategories.length === 0 ? (
                  <Box textAlign="center" py={8}>
                    <Text color={textColor}>No hay subcategorías creadas</Text>
                  </Box>
                ) : (
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>Subcategoría</Th>
                        <Th>Categoría</Th>
                        <Th>Acciones</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {subcategories.map((subcategory, index) => (
                        <Tr key={subcategory.subcategory_id || `subcategory-${index}`}>
                          <Td>
                            <Text fontWeight="medium" fontSize="sm">
                              {subcategory.subcategory_name}
                            </Text>
                          </Td>
                          <Td>
                            <Badge
                              colorScheme="red"
                              variant="subtle"
                              fontSize="xs"
                            >
                              {subcategory.category_name || 'Sin categoría'}
                            </Badge>
                          </Td>
                          <Td>
                            <HStack spacing={1}>
                              <IconButton
                                aria-label="Editar subcategoría"
                                icon={<FiEdit />}
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEdit(subcategory)}
                                isDisabled={submitting}
                              />
                              <IconButton
                                aria-label="Eliminar subcategoría"
                                icon={<FiTrash2 />}
                                size="sm"
                                variant="ghost"
                                colorScheme="red"
                                onClick={() => handleDelete(subcategory.subcategory_id)}
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

export default NewsSubcategory
