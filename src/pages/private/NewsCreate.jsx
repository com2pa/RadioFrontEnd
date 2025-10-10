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
  AspectRatio
} from '@chakra-ui/react'
import { FiSave, FiUpload, FiImage, FiMenu, FiHome, FiLogOut, FiArrowLeft, FiEye, FiExternalLink } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import { Link as RouterLink } from 'react-router-dom'
import AdminMenu from '../../components/layout/AdminMenu'
import axios from 'axios'

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
      const response = await axios.get('/api/subcategory-news')
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

  useEffect(() => {
    fetchSubcategories()
  }, [fetchSubcategories])

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
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      
      const response = await axios.post('/api/news/create', formDataToSend, {
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

  // Verificar permisos de administrador
  if (!auth || (auth.role !== 'admin' && auth.role !== 'superAdmin' && auth.role !== 'edit')) {
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

          {/* Contenido principal */}
          <Card bg={cardBg} boxShadow="md">
            <CardHeader>
              <Heading size="md">Formulario de Noticia</Heading>
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

          {/* Vista Previa */}
          {renderPreview()}
        </VStack>
      </Container>
    </Box>
  )
}

export default NewsCreate