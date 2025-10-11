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
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  useDisclosure,
  Switch,
  FormHelperText,
  Image,
  AspectRatio,
  Grid
} from '@chakra-ui/react'
import { FiSave, FiUpload, FiImage, FiMenu, FiHome, FiLogOut, FiArrowLeft, FiEye, FiExternalLink, FiEdit, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import { Link as RouterLink } from 'react-router-dom'
import AdminMenu from '../../components/layout/AdminMenu'
import { canEdit, getUserRoleInfo } from '../../utils/roleUtils'
import api from '../../services/authService'

const NewsCreate = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const toast = useToast()
  const { auth, logout } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()

  // Estados
  const [submitting, setSubmitting] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [subcategories, setSubcategories] = useState([])
  const [loadingSubcategories, setLoadingSubcategories] = useState(false)
  const [userNews, setUserNews] = useState([])
  const [loadingNews, setLoadingNews] = useState(false)

  const [formData, setFormData] = useState({
    news_title: '', // CORREGIDO: usar news_title en lugar de title
    news_subtitle: '', // CORREGIDO: usar news_subtitle en lugar de subtitle
    news_content: '', // CORREGIDO: usar news_content en lugar de content
    news_image: null, // CORREGIDO: usar news_image en lugar de image
    subcategory_id: '', // NUEVO: campo para subcategoría
    news_status: true // CORREGIDO: usar news_status en lugar de status
  })

  // Cargar subcategorías
  const fetchSubcategories = useCallback(async () => {
    setLoadingSubcategories(true)
    try {
      const response = await api.get('/api/subcategory-news')
      setSubcategories(response.data || [])
    } catch (error) {
      console.error('Error fetching subcategories:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las subcategorías',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setLoadingSubcategories(false)
    }
  }, [toast])

  // Cargar noticias del usuario
  const fetchUserNews = useCallback(async () => {
    setLoadingNews(true)
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
      const response = await api.get('/api/news/user/my-news', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const newsData = response.data?.data || response.data || []
      setUserNews(newsData)
    } catch (error) {
      console.error('Error fetching user news:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las noticias',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setLoadingNews(false)
    }
  }, [toast])

  // Función para cambiar el status de una noticia
  const toggleNewsStatus = async (newsId, currentStatus) => {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
      const newStatus = !currentStatus
      
      const response = await api.patch(`/api/news/${newsId}/status`, 
        { status: newStatus },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      
      if (response.data.success) {
        toast({
          title: 'Estado actualizado',
          description: `La noticia ha sido ${newStatus ? 'activada' : 'desactivada'}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        // Recargar noticias
        fetchUserNews()
      } else {
        throw new Error(response.data.message || 'Error al cambiar el estado')
      }
    } catch (error) {
      console.error('Error changing news status:', error)
      toast({
        title: 'Error',
        description: 'No se pudo cambiar el estado de la noticia',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  // Función para eliminar una noticia
  const deleteNews = async (newsId, newsTitle) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar la noticia "${newsTitle}"?`)) {
      return
    }

    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
      
      const response = await api.delete(`/api/news/${newsId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.data.success) {
        toast({
          title: 'Noticia eliminada',
          description: 'La noticia ha sido eliminada exitosamente',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        // Recargar noticias
        fetchUserNews()
      } else {
        throw new Error(response.data.message || 'Error al eliminar la noticia')
      }
    } catch (error) {
      console.error('Error deleting news:', error)
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la noticia',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  useEffect(() => {
    fetchSubcategories()
    fetchUserNews()
  }, [fetchSubcategories, fetchUserNews])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        news_image: file
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    if (!formData.news_title.trim()) {
      toast({
        title: 'Error',
        description: 'El título de la noticia es requerido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setSubmitting(false)
      return
    }

    if (!formData.news_content.trim()) {
      toast({
        title: 'Error',
        description: 'El contenido de la noticia es requerido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setSubmitting(false)
      return
    }

    if (!formData.subcategory_id) {
      toast({
        title: 'Error',
        description: 'La subcategoría es requerida',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setSubmitting(false)
      return
    }

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('news_title', formData.news_title)
      formDataToSend.append('news_subtitle', formData.news_subtitle)
      formDataToSend.append('news_content', formData.news_content)
      formDataToSend.append('subcategory_id', formData.subcategory_id)
      formDataToSend.append('news_status', formData.news_status)
      
      if (formData.news_image) {
        formDataToSend.append('news_image', formData.news_image) // CORREGIDO: usar news_image
      }

      // Agregar token de autorización
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
      
      console.log('🔐 Token encontrado:', token ? 'SÍ' : 'NO')
      console.log('📝 Datos del formulario:', formData)
      console.log('👤 Usuario autenticado:', auth)
      
      const response = await api.post('/api/news/create', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.data.success) {
        toast({
          title: 'Noticia creada',
          description: 'La noticia ha sido creada exitosamente',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        
        // Limpiar formulario
        setFormData({
          news_title: '',
          news_subtitle: '',
          news_content: '',
          news_image: null,
          subcategory_id: '',
          news_status: true
        })
        setShowPreview(false)
        
        // Recargar noticias del usuario
        fetchUserNews()
      } else {
        throw new Error(response.data.message || 'Error al crear la noticia')
      }
    } catch (error) {
      console.error('Error creating news:', error)
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo crear la noticia',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setSubmitting(false)
    }
  }

  const togglePreview = () => {
    setShowPreview(!showPreview)
  }

  const renderPreview = () => {
    if (!showPreview) return null

    return (
      <Card bg={cardBg} boxShadow="md" mt={4}>
        <CardHeader>
          <Heading size="md">Vista Previa de la Noticia</Heading>
        </CardHeader>
        <CardBody>
          <VStack spacing={4} align="stretch">
            {formData.news_image && (
              <AspectRatio ratio={16/9} borderRadius="md" overflow="hidden">
                <Image
                  src={URL.createObjectURL(formData.news_image)}
                  alt="Imagen de la noticia"
                  objectFit="cover"
                />
              </AspectRatio>
            )}
            
            <VStack align="start" spacing={2}>
              <Heading size="lg" color="red.600">
                {formData.news_title || "Título de la noticia"}
              </Heading>
              
              {formData.news_subtitle && (
                <Text fontSize="lg" color={textColor} fontStyle="italic">
                  {formData.news_subtitle}
                </Text>
              )}
              
              <HStack spacing={2} flexWrap="wrap">
                <Badge 
                  colorScheme={formData.news_status ? 'green' : 'gray'} 
                  variant="solid"
                >
                  {formData.news_status ? 'Publicada' : 'Borrador'}
                </Badge>
                {formData.subcategory_id && (
                  <Badge colorScheme="blue" variant="outline">
                    Subcategoría: {subcategories.find(s => s.subcategory_id == formData.subcategory_id)?.subcategory_name || formData.subcategory_id}
                  </Badge>
                )}
              </HStack>
            </VStack>
            
            {formData.news_content && (
              <Box>
                <Text fontSize="sm" fontWeight="medium" mb={2}>Contenido:</Text>
                <Text 
                  whiteSpace="pre-wrap" 
                  lineHeight="tall"
                  dangerouslySetInnerHTML={{ 
                    __html: formData.news_content.replace(/\n/g, '<br>') 
                  }}
                />
              </Box>
            )}
          </VStack>
        </CardBody>
      </Card>
    )
  }

  // Verificar permisos de editor
  const hasEditPermission = canEdit(auth)
  const roleInfo = getUserRoleInfo(auth)

  if (!hasEditPermission) {
    return (
      <Box minH="100vh" bg={bgColor} display="flex" alignItems="center" justifyContent="center">
        <Alert status="error" maxW="md">
          <AlertIcon />
          <Box>
            <AlertTitle>Acceso Denegado</AlertTitle>
            <AlertDescription>
              No tienes permisos para crear noticias. Se requiere rol de editor o superior.
              <br />
              <Text fontSize="sm" mt={2}>
                Tu rol actual: {roleInfo.name} (ID: {roleInfo.id})
              </Text>
            </AlertDescription>
          </Box>
        </Alert>
      </Box>
    )
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
                    Crear Nueva Noticia
                  </Heading>
                  <Badge colorScheme="green" variant="solid" fontSize="sm">
                    {roleInfo.name.toUpperCase()} (ID: {roleInfo.id})
                  </Badge>
                </HStack>
                <Text color={textColor}>
                  Crear y publicar noticias para el sitio web
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
            currentPage="/dashboard/admin/news-create"
          />

          {/* Contenido principal - Grid con formulario y listado */}
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={6}>
            {/* Formulario de creación */}
            <Card bg={cardBg} boxShadow="md">
              <CardHeader>
                <Heading size="md">Crear Nueva Noticia</Heading>
              </CardHeader>
              <CardBody>
              <form onSubmit={handleSubmit}>
                <VStack spacing={6} align="stretch">
                  {/* Título */}
                  <FormControl isRequired>
                    <FormLabel>Título de la Noticia</FormLabel>
                    <Input
                      name="news_title"
                      value={formData.news_title}
                      onChange={handleInputChange}
                      placeholder="Ej: Nueva tecnología revoluciona la industria"
                      size="lg"
                    />
                  </FormControl>

                  {/* Subtítulo */}
                  <FormControl>
                    <FormLabel>Subtítulo</FormLabel>
                    <Input
                      name="news_subtitle"
                      value={formData.news_subtitle}
                      onChange={handleInputChange}
                      placeholder="Subtítulo opcional de la noticia"
                    />
                    <FormHelperText>
                      Subtítulo que aparecerá debajo del título principal
                    </FormHelperText>
                  </FormControl>

                  {/* Contenido */}
                  <FormControl isRequired>
                    <FormLabel>Contenido de la Noticia</FormLabel>
                    <Textarea
                      name="news_content"
                      value={formData.news_content}
                      onChange={handleInputChange}
                      placeholder="Escribe el contenido de la noticia aquí... Puede ser extenso o corto según necesites."
                      rows={12}
                      resize="vertical"
                    />
                    <FormHelperText>
                      Puedes escribir contenido extenso o corto. Usa saltos de línea para formatear el texto.
                    </FormHelperText>
                  </FormControl>

                  {/* Subcategoría */}
                  <FormControl isRequired>
                    <FormLabel>Subcategoría</FormLabel>
                    <Select
                      name="subcategory_id"
                      value={formData.subcategory_id}
                      onChange={handleInputChange}
                      placeholder="Selecciona una subcategoría"
                      isDisabled={loadingSubcategories}
                    >
                      {subcategories.map((subcat) => (
                        <option key={subcat.subcategory_id} value={subcat.subcategory_id}>
                          {subcat.subcategory_name} - {subcat.category_name}
                        </option>
                      ))}
                    </Select>
                    <FormHelperText>
                      Selecciona la subcategoría a la que pertenece esta noticia
                    </FormHelperText>
                  </FormControl>

                  {/* Subir Imagen */}
                  <FormControl isRequired>
                    <FormLabel>Imagen de la Noticia</FormLabel>
                    <Input
                      type="file"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleImageChange}
                      p={1}
                    />
                    <FormHelperText>
                      Selecciona una imagen para la noticia (JPG, PNG)
                    </FormHelperText>
                    {formData.news_image && (
                      <Box mt={2}>
                        <Text fontSize="sm" color="green.500">
                          ✓ Imagen seleccionada: {formData.news_image.name}
                        </Text>
                      </Box>
                    )}
                  </FormControl>

                  {/* Status de la Noticia */}
                  <FormControl>
                    <FormLabel>Estado de la Noticia</FormLabel>
                    <Select
                      name="news_status"
                      value={formData.news_status}
                      onChange={handleInputChange}
                    >
                      <option value={true}>Publicada</option>
                      <option value={false}>Borrador</option>
                    </Select>
                    <FormHelperText>
                      Selecciona si la noticia será un borrador o se publicará inmediatamente
                    </FormHelperText>
                  </FormControl>

                  {/* Botones de acción */}
                  <HStack spacing={4} justify="space-between">
                    <HStack spacing={2}>
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<FiEye />}
                        onClick={togglePreview}
                        isDisabled={!formData.news_title}
                      >
                        {showPreview ? 'Ocultar' : 'Mostrar'} Vista Previa
                      </Button>
                    </HStack>
                    
                    <HStack spacing={3}>
                      <Button
                        type="submit"
                        leftIcon={<FiSave />}
                        colorScheme="red"
                        size="lg"
                        isLoading={submitting}
                        loadingText="Creando..."
                      >
                        Crear Noticia
                      </Button>
                    </HStack>
                  </HStack>
                </VStack>
              </form>
            </CardBody>
          </Card>

          {/* Listado de noticias del usuario */}
          <Card bg={cardBg} boxShadow="md">
            <CardHeader>
              <HStack justify="space-between" align="center">
                <Heading size="md">Mis Noticias</Heading>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={fetchUserNews}
                  isLoading={loadingNews}
                  loadingText="Cargando..."
                >
                  Actualizar
                </Button>
              </HStack>
            </CardHeader>
            <CardBody>
              {loadingNews ? (
                <VStack spacing={4} py={8}>
                  <Spinner size="lg" color="blue.500" />
                  <Text>Cargando noticias...</Text>
                </VStack>
              ) : !Array.isArray(userNews) || userNews.length === 0 ? (
                <VStack spacing={4} py={8}>
                  <Text color={textColor} textAlign="center">
                    No tienes noticias creadas aún.
                  </Text>
                  <Text fontSize="sm" color={textColor} textAlign="center">
                    Crea tu primera noticia usando el formulario de la izquierda.
                  </Text>
                </VStack>
              ) : (
                <VStack spacing={4} align="stretch" maxH="600px" overflowY="auto">
                  {Array.isArray(userNews) && userNews.map((news) => (
                    <Box
                      key={news.news_id}
                      p={4}
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                      bg="gray.50"
                    >
                      <VStack align="start" spacing={2}>
                        <HStack justify="space-between" w="full">
                          <Heading size="sm" color="blue.600" noOfLines={1}>
                            {news.news_title}
                          </Heading>
                          <Badge
                            colorScheme={news.news_status ? "green" : "red"}
                            variant="solid"
                            fontSize="xs"
                          >
                            {news.news_status ? "Activa" : "Inactiva"}
                          </Badge>
                        </HStack>
                        
                        {news.news_subtitle && (
                          <Text fontSize="sm" color={textColor} noOfLines={2}>
                            {news.news_subtitle}
                          </Text>
                        )}
                        
                        <HStack justify="space-between" w="full" fontSize="xs" color="gray.500">
                          <Text>
                            {news.subcategory_name && `Categoría: ${news.subcategory_name}`}
                          </Text>
                          <Text>
                            {new Date(news.news_created_at).toLocaleDateString()}
                          </Text>
                        </HStack>
                        
                        {/* Botones de acción */}
                        <HStack spacing={2} w="full" justify="flex-end">
                          <Button
                            size="xs"
                            variant="outline"
                            colorScheme="blue"
                            leftIcon={<FiEdit />}
                            onClick={() => {
                              // TODO: Implementar edición
                              toast({
                                title: 'Función en desarrollo',
                                description: 'La edición de noticias estará disponible próximamente',
                                status: 'info',
                                duration: 3000,
                                isClosable: true,
                              })
                            }}
                          >
                            Editar
                          </Button>
                          
                          <Button
                            size="xs"
                            variant="outline"
                            colorScheme={news.news_status ? "orange" : "green"}
                            leftIcon={news.news_status ? <FiToggleLeft /> : <FiToggleRight />}
                            onClick={() => toggleNewsStatus(news.news_id, news.news_status)}
                          >
                            {news.news_status ? "Desactivar" : "Activar"}
                          </Button>
                          
                          <Button
                            size="xs"
                            variant="outline"
                            colorScheme="red"
                            leftIcon={<FiTrash2 />}
                            onClick={() => deleteNews(news.news_id, news.news_title)}
                          >
                            Eliminar
                          </Button>
                        </HStack>
                        
                        {news.news_image ? (
                          <Box w="full">
                            <Image
                              src={`http://localhost:3000/uploads/news/${news.news_image}`}
                              alt={news.news_title}
                              borderRadius="md"
                              maxH="100px"
                              objectFit="cover"
                              w="full"
                              fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg=="
                              onError={(e) => {
                                console.log('❌ Error cargando imagen:', `http://localhost:3000/uploads/news/${news.news_image}`)
                                console.log('📰 Datos de la noticia:', news)
                              }}
                              onLoad={() => {
                                console.log('✅ Imagen cargada correctamente:', `http://localhost:3000/uploads/news/${news.news_image}`)
                              }}
                            />
                          </Box>
                        ) : (
                          <Box w="full" h="100px" bg="gray.100" borderRadius="md" display="flex" alignItems="center" justifyContent="center">
                            <Text fontSize="sm" color="gray.500">
                              Sin imagen
                            </Text>
                          </Box>
                        )}
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              )}
            </CardBody>
          </Card>
        </Grid>

        {/* Vista Previa - Mover fuera del grid */}
        {renderPreview()}
        </VStack>
      </Container>
    </Box>
  )
}

export default NewsCreate