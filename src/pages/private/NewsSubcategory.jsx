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

const NewsSubcategory = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const toast = useToast()
  const { auth, logout } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()

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
                    Gestión de Subcategorías de Noticias
                  </Heading>
                </Flex>
                <Text 
                  color={textColor}
                  fontSize={{ base: "sm", md: "md" }}
                >
                  Crear y administrar subcategorías para noticias
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
            currentPage="/dashboard/admin/news-subcategory"
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
                  {editingId ? 'Editar Subcategoría' : 'Crear Nueva Subcategoría'}
                </Heading>
              </CardHeader>
              <CardBody px={{ base: 4, md: 6 }} pb={{ base: 4, md: 6 }}>
                <form onSubmit={handleSubmit}>
                  <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                    <FormControl isRequired>
                      <FormLabel fontSize={{ base: "sm", md: "md" }}>
                        Categoría Padre
                      </FormLabel>
                      <Select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleInputChange}
                        placeholder="Selecciona una categoría"
                        size={{ base: "sm", md: "md" }}
                      >
                        {categories.map((category, index) => (
                          <option key={category.category_id || `category-${index}`} value={category.category_id}>
                            {category.category_name}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel fontSize={{ base: "sm", md: "md" }}>
                        Nombre de la subcategoría
                      </FormLabel>
                      <Input
                        name="subcategory_name"
                        value={formData.subcategory_name}
                        onChange={handleInputChange}
                        placeholder="Ej: Elecciones, Fútbol, Inteligencia Artificial"
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
                        {editingId ? 'Actualizar' : 'Crear'} Subcategoría
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

            {/* Lista de subcategorías */}
            <Card bg={cardBg} boxShadow="md">
              <CardHeader pb={{ base: 3, md: 4 }}>
                <Flex
                  direction={{ base: "column", sm: "row" }}
                  justify="space-between"
                  align={{ base: "start", sm: "center" }}
                  gap={3}
                >
                  <Heading size={{ base: "sm", md: "md" }}>
                    Subcategorías Existentes
                  </Heading>
                  <Badge 
                    colorScheme="red" 
                    variant="subtle"
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    {subcategories.length} subcategorías
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
                        Cargando subcategorías...
                      </Text>
                    </VStack>
                  </Box>
                ) : !Array.isArray(subcategories) || subcategories.length === 0 ? (
                  <Box textAlign="center" py={8}>
                    <Text 
                      color={textColor}
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      No hay subcategorías creadas
                    </Text>
                  </Box>
                ) : (
                  <Box overflowX="auto">
                    <Table size={{ base: "xs", md: "sm" }} variant="simple">
                      <Thead>
                        <Tr>
                          <Th fontSize={{ base: "xs", md: "sm" }}>Subcategoría</Th>
                          <Th fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", md: "table-cell" }}>
                            Categoría
                          </Th>
                          <Th fontSize={{ base: "xs", md: "sm" }}>Acciones</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {subcategories.map((subcategory, index) => (
                          <Tr key={subcategory.subcategory_id || `subcategory-${index}`}>
                            <Td>
                              <VStack align="start" spacing={0}>
                                <Text 
                                  fontWeight="medium" 
                                  fontSize={{ base: "xs", md: "sm" }}
                                  wordBreak="break-word"
                                >
                                  {subcategory.subcategory_name}
                                </Text>
                                {/* Mostrar categoría en móvil debajo del nombre */}
                                <Badge
                                  colorScheme="red"
                                  variant="subtle"
                                  fontSize="2xs"
                                  display={{ base: "block", md: "none" }}
                                  mt={1}
                                >
                                  {subcategory.category_name || 'Sin categoría'}
                                </Badge>
                              </VStack>
                            </Td>
                            <Td display={{ base: "none", md: "table-cell" }}>
                              <Badge
                                colorScheme="red"
                                variant="subtle"
                                fontSize={{ base: "2xs", md: "xs" }}
                              >
                                {subcategory.category_name || 'Sin categoría'}
                              </Badge>
                            </Td>
                            <Td>
                              <HStack spacing={1}>
                                <IconButton
                                  aria-label="Editar subcategoría"
                                  icon={<FiEdit />}
                                  size={{ base: "xs", md: "sm" }}
                                  variant="ghost"
                                  onClick={() => handleEdit(subcategory)}
                                  isDisabled={submitting}
                                />
                                <IconButton
                                  aria-label="Eliminar subcategoría"
                                  icon={<FiTrash2 />}
                                  size={{ base: "xs", md: "sm" }}
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

export default NewsSubcategory
