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
  useDisclosure,
  Flex
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
                    color="red.600"
                  >
                    Gestión de Categorías de Noticias
                  </Heading>
                </Flex>
                <Text 
                  color={textColor}
                  fontSize={{ base: "sm", md: "md" }}
                >
                  Crear y administrar categorías para noticias
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
            currentPage="/dashboard/admin/news-category"
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
                <Heading size={{ base: "sm", md: "md" }}>
                  {editingId ? 'Editar Categoría' : 'Crear Nueva Categoría'}
                </Heading>
              </CardHeader>
              <CardBody px={{ base: 4, md: 6 }} pb={{ base: 4, md: 6 }}>
                <form onSubmit={handleSubmit}>
                  <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                    <FormControl isRequired>
                      <FormLabel fontSize={{ base: "sm", md: "md" }}>
                        Nombre de la categoría
                      </FormLabel>
                      <Input
                        name="categoryName"
                        value={formData.categoryName}
                        onChange={handleInputChange}
                        placeholder="Ej: Política, Deportes, Tecnología, Economía"
                        size={{ base: "sm", md: "md" }}
                      />
                    </FormControl>

                    <Flex
                      direction={{ base: "column", sm: "row" }}
                      gap={3}
                    >
                      <Button
                        type="submit"
                        leftIcon={<FiSave />}
                        colorScheme="red"
                        flex={1}
                        isLoading={submitting}
                        loadingText={editingId ? 'Actualizando...' : 'Creando...'}
                        size={{ base: "sm", md: "md" }}
                        fontSize={{ base: "xs", md: "sm" }}
                      >
                        {editingId ? 'Actualizar' : 'Crear'} Categoría
                      </Button>
                      {editingId && (
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          flex={1}
                          isDisabled={submitting}
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

            {/* Lista de categorías */}
            <Card bg={cardBg} boxShadow="md">
              <CardHeader pb={{ base: 3, md: 4 }}>
                <Flex
                  direction={{ base: "column", sm: "row" }}
                  justify="space-between"
                  align={{ base: "start", sm: "center" }}
                  gap={3}
                >
                  <Heading size={{ base: "sm", md: "md" }}>
                    Categorías Existentes
                  </Heading>
                  <Badge 
                    colorScheme="red" 
                    variant="subtle"
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    {categories.length} categorías
                  </Badge>
                </Flex>
              </CardHeader>
              <CardBody pt={0} px={{ base: 3, md: 6 }} pb={{ base: 3, md: 6 }}>
                {loading ? (
                  <Box display="flex" justifyContent="center" py={8}>
                    <VStack spacing={4}>
                      <Spinner 
                        size={{ base: "md", md: "lg" }} 
                        color="red.500" 
                      />
                      <Text 
                        color={textColor}
                        fontSize={{ base: "xs", md: "sm" }}
                      >
                        Cargando categorías...
                      </Text>
                    </VStack>
                  </Box>
                ) : !Array.isArray(categories) || categories.length === 0 ? (
                  <Box display="flex" justifyContent="center" py={8}>
                    <Text 
                      color={textColor}
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      No hay categorías creadas
                    </Text>
                  </Box>
                ) : (
                  <Box overflowX="auto">
                    <Table size={{ base: "xs", md: "sm" }} variant="simple">
                      <Thead>
                        <Tr>
                          <Th fontSize={{ base: "xs", md: "sm" }}>Nombre</Th>
                          <Th fontSize={{ base: "xs", md: "sm" }}>Acciones</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {Array.isArray(categories) && categories.map((category, index) => (
                          <Tr key={category.category_id || `category-${index}`}>
                            <Td>
                              <Text 
                                fontWeight="medium" 
                                fontSize={{ base: "xs", md: "sm" }}
                                wordBreak="break-word"
                              >
                                {category.category_name}
                              </Text>
                            </Td>
                            <Td>
                              <HStack spacing={1}>
                                <IconButton
                                  aria-label="Editar categoría"
                                  icon={<FiEdit />}
                                  size={{ base: "xs", md: "sm" }}
                                  variant="ghost"
                                  onClick={() => handleEdit(category)}
                                  isDisabled={submitting}
                                />
                                <IconButton
                                  aria-label="Eliminar categoría"
                                  icon={<FiTrash2 />}
                                  size={{ base: "xs", md: "sm" }}
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

export default NewsCategory
