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
  Divider,
  Grid,
  GridItem,
  AspectRatio,
  Switch,
  FormHelperText,
  Icon,
  useDisclosure
} from '@chakra-ui/react'
import { FiSave, FiEdit, FiTrash2, FiPlay, FiUpload, FiEye, FiExternalLink, FiX, FiMonitor, FiMenu, FiHome, FiLogOut, FiArrowLeft } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import { Link as RouterLink } from 'react-router-dom'
import AdminMenu from '../../components/layout/AdminMenu'
import axios from 'axios'

const PodcastUpload = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const toast = useToast()
  const { auth, logout } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()

  // Estados
  const [subcategories, setSubcategories] = useState([])
  const [podcasts, setPodcasts] = useState([])
  const [filteredPodcasts, setFilteredPodcasts] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [selectedSubcategoryFilter, setSelectedSubcategoryFilter] = useState('')
  const [showPublicPreview, setShowPublicPreview] = useState(false)

  const [formData, setFormData] = useState({
    podcast_title: '',
    podcast_description: '',
    podcast_iframe: '',
    podcast_url: '',
    podcast_subcategory_id: '',
    useIframe: false
  })

  // Función para obtener todas las subcategorías
  const fetchSubcategories = useCallback(async () => {
    try {
      const response = await axios.get('/api/subcategory-podscats/all')
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
    }
  }, [toast])

  // Función para obtener todos los podcasts
  const fetchPodcasts = useCallback(async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/podcasts/all')
      const data = response.data.success && Array.isArray(response.data.data) 
        ? response.data.data 
        : []
      setPodcasts(data)
    } catch (error) {
      console.error('Error fetching podcasts:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los podcasts',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setPodcasts([])
    } finally {
      setLoading(false)
    }
  }, [toast])


  // Función para crear podcast
  const createPodcast = async (podcastData) => {
    try {
      const response = await axios.post('/api/podcasts/create', podcastData)
      if (response.data.success) {
        setPodcasts(prev => [response.data.data, ...prev])
        return true
      }
      return false
    } catch (error) {
      console.error('Error creating podcast:', error)
      return false
    }
  }

  // Función para actualizar podcast
  const updatePodcast = async (podcastId, podcastData) => {
    try {
      const response = await axios.put(`/api/podcasts/${podcastId}`, podcastData)
      if (response.data.success) {
        setPodcasts(prev => prev.map(podcast => 
          podcast.podcastId === podcastId ? response.data.data : podcast
        ))
        return true
      }
      return false
    } catch (error) {
      console.error('Error updating podcast:', error)
      return false
    }
  }

  // Función para eliminar podcast
  const deletePodcast = async (podcastId) => {
    try {
      const response = await axios.delete(`/api/podcasts/${podcastId}`)
      if (response.data.success) {
        setPodcasts(prev => prev.filter(podcast => podcast.podcastId !== podcastId))
        return true
      }
      return false
    } catch (error) {
      console.error('Error deleting podcast:', error)
      return false
    }
  }

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchSubcategories()
    fetchPodcasts()
  }, [fetchSubcategories, fetchPodcasts])

  // Filtrar podcasts por subcategoría
  useEffect(() => {
    if (selectedSubcategoryFilter) {
      const filtered = podcasts.filter(podcast => 
        podcast.podcast_subcategory_id?.toString() === selectedSubcategoryFilter
      )
      setFilteredPodcasts(filtered)
    } else {
      setFilteredPodcasts(podcasts)
    }
  }, [podcasts, selectedSubcategoryFilter])

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    if (!formData.podcast_title.trim()) {
      toast({
        title: 'Error',
        description: 'El título del podcast es requerido',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setSubmitting(false)
      return
    }

    if (!formData.podcast_subcategory_id) {
      toast({
        title: 'Error',
        description: 'Debe seleccionar una subcategoría',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setSubmitting(false)
      return
    }

    if (!formData.useIframe && !formData.podcast_url.trim()) {
      toast({
        title: 'Error',
        description: 'Debe proporcionar una URL del video',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setSubmitting(false)
      return
    }

    if (formData.useIframe && !formData.podcast_iframe.trim()) {
      toast({
        title: 'Error',
        description: 'Debe proporcionar un iframe del video',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setSubmitting(false)
      return
    }

    try {
      const podcastData = {
        podcast_title: formData.podcast_title,
        podcast_description: formData.podcast_description,
        podcast_subcategory_id: formData.podcast_subcategory_id,
        ...(formData.useIframe 
          ? { podcast_iframe: formData.podcast_iframe }
          : { podcast_url: formData.podcast_url }
        )
      }

      let success = false
      if (editingId) {
        success = await updatePodcast(editingId, podcastData)
        if (success) {
          toast({
            title: 'Podcast actualizado',
            description: 'El podcast ha sido actualizado exitosamente',
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
        } else {
          toast({
            title: 'Error',
            description: 'No se pudo actualizar el podcast',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        }
      } else {
        success = await createPodcast(podcastData)
        if (success) {
          toast({
            title: 'Podcast creado',
            description: 'El nuevo podcast ha sido creado exitosamente',
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
        } else {
          toast({
            title: 'Error',
            description: 'No se pudo crear el podcast',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        }
      }

      if (success) {
        setFormData({
          podcast_title: '',
          podcast_description: '',
          podcast_iframe: '',
          podcast_url: '',
          podcast_subcategory_id: '',
          useIframe: false
        })
        setEditingId(null)
        setShowPreview(false)
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

  const handleEdit = (podcast) => {
    setFormData({
      podcast_title: podcast.podcast_title || '',
      podcast_description: podcast.podcast_description || '',
      podcast_iframe: podcast.podcast_iframe || '',
      podcast_url: podcast.podcast_url || '',
      podcast_subcategory_id: podcast.podcast_subcategory_id?.toString() || '',
      useIframe: !!podcast.podcast_iframe
    })
    setEditingId(podcast.podcastId)
    setShowPreview(false)
  }

  const handleDelete = async (podcastId) => {
    try {
      const success = await deletePodcast(podcastId)
      if (success) {
        toast({
          title: 'Podcast eliminado',
          description: 'El podcast ha sido eliminado exitosamente',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        toast({
          title: 'Error',
          description: 'No se pudo eliminar el podcast',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
      }
    } catch (error) {
      console.error('Error deleting podcast:', error)
      toast({
        title: 'Error',
        description: 'Ocurrió un error al eliminar el podcast',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleCancel = () => {
    setFormData({
      podcast_title: '',
      podcast_description: '',
      podcast_iframe: '',
      podcast_url: '',
      podcast_subcategory_id: '',
      useIframe: false
    })
    setEditingId(null)
    setShowPreview(false)
  }

  const togglePreview = () => {
    setShowPreview(!showPreview)
  }

  const togglePublicPreview = () => {
    setShowPublicPreview(!showPublicPreview)
  }

  const closeAllPreviews = () => {
    setShowPreview(false)
    setShowPublicPreview(false)
  }

  const renderVideoPreview = () => {
    if (!showPreview) return null

    if (formData.useIframe && formData.podcast_iframe) {
      return (
        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2}>Vista Previa:</Text>
          <Box 
            dangerouslySetInnerHTML={{ __html: formData.podcast_iframe }}
            borderRadius="md"
            overflow="hidden"
            border="1px solid"
            borderColor="gray.200"
          />
        </Box>
      )
    }

    if (!formData.useIframe && formData.podcast_url) {
      return (
        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={2}>Vista Previa:</Text>
          <AspectRatio ratio={16/9} borderRadius="md" overflow="hidden">
            <iframe
              src={formData.podcast_url}
              title="Podcast Preview"
              allowFullScreen
              style={{ border: '1px solid #e2e8f0' }}
            />
          </AspectRatio>
        </Box>
      )
    }

    return (
      <Text fontSize="sm" color="gray.500">
        Agrega un iframe o URL para ver la vista previa
      </Text>
    )
  }

  const renderPublicPreview = () => {
    if (!showPublicPreview) return null

    return (
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="blackAlpha.900"
        zIndex={9999}
        display="flex"
        alignItems="center"
        justifyContent="center"
        p={4}
        backdropFilter="blur(10px)"
      >
        <Box
          bg="white"
          borderRadius="2xl"
          maxW="6xl"
          w="full"
          maxH="95vh"
          overflow="hidden"
          position="relative"
          boxShadow="2xl"
          border="1px solid"
          borderColor="gray.200"
        >
          {/* Header moderno con gradiente */}
          <Box
            bgGradient="linear(to-r, blue.500, purple.600)"
            p={6}
            color="white"
            position="relative"
            overflow="hidden"
          >
            {/* Patrón de fondo */}
            <Box
              position="absolute"
              top={0}
              right={0}
              w="200px"
              h="200px"
              bg="whiteAlpha.100"
              borderRadius="full"
              transform="translate(50%, -50%)"
            />
            <Box
              position="absolute"
              bottom={0}
              left={0}
              w="150px"
              h="150px"
              bg="whiteAlpha.100"
              borderRadius="full"
              transform="translate(-50%, 50%)"
            />
            
            <HStack justify="space-between" position="relative" zIndex={1}>
              <VStack align="start" spacing={2}>
                <HStack>
                  <Icon as={FiMonitor} boxSize={6} />
                  <Text fontSize="xl" fontWeight="bold">
                    Vista Previa Pública
                  </Text>
                </HStack>
                <Text fontSize="sm" color="whiteAlpha.800">
                  Así se verá el video en la página web para los usuarios
                </Text>
              </VStack>
              <HStack spacing={2}>
                <Button
                  size="sm"
                  variant="ghost"
                  color="white"
                  leftIcon={<FiX />}
                  onClick={closeAllPreviews}
                  _hover={{ bg: "whiteAlpha.200" }}
                >
                  Cerrar Vista
                </Button>
                <IconButton
                  aria-label="Cerrar vista previa"
                  icon={<FiX />}
                  variant="ghost"
                  color="white"
                  onClick={togglePublicPreview}
                  _hover={{ bg: "whiteAlpha.200" }}
                />
              </HStack>
            </HStack>
          </Box>

          {/* Contenido con scroll */}
          <Box maxH="calc(95vh - 120px)" overflowY="auto">
            <Box p={8}>
              <VStack spacing={8} align="stretch">
                {/* Header simulado de la página pública */}
                <Box 
                  textAlign="center" 
                  py={8}
                  bgGradient="linear(to-r, gray.50, blue.50)"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="gray.100"
                >
                  <VStack spacing={3}>
                    <HStack>
                      <Box
                        p={3}
                        borderRadius="xl"
                        bgGradient="linear(to-r, blue.500, purple.500)"
                        color="white"
                      >
                        <Icon as={FiPlay} boxSize={8} />
                      </Box>
                      <VStack align="start" spacing={0}>
                        <Text fontSize="3xl" fontWeight="bold" color="blue.600">
                          Radio Oxígeno
                        </Text>
                        <Text fontSize="lg" color="gray.600" fontWeight="medium">
                          Podcasts & Videos
                        </Text>
                      </VStack>
                    </HStack>
                    <Text fontSize="sm" color="gray.500">
                      88.1 FM Barquisimeto • Contenido Premium
                    </Text>
                  </VStack>
                </Box>

                {/* Card del podcast con diseño moderno */}
                <Card 
                  bg="white" 
                  boxShadow="xl"
                  borderRadius="2xl"
                  border="1px solid"
                  borderColor="gray.100"
                  overflow="hidden"
                >
                  <CardBody p={0}>
                    <VStack spacing={0} align="stretch">
                      {/* Header del podcast */}
                      <Box
                        p={8}
                        bgGradient="linear(to-r, blue.50, purple.50)"
                        borderBottom="1px solid"
                        borderColor="gray.100"
                      >
                        <VStack align="start" spacing={4}>
                          <VStack align="start" spacing={2}>
                            <Text fontSize="2xl" fontWeight="bold" color="gray.800">
                              {formData.podcast_title || "Título del Podcast"}
                            </Text>
                            {formData.podcast_description && (
                              <Text color="gray.600" fontSize="lg" lineHeight="tall">
                                {formData.podcast_description}
                              </Text>
                            )}
                          </VStack>
                          
                          <HStack spacing={3} flexWrap="wrap">
                            <Badge 
                              colorScheme="blue" 
                              variant="solid"
                              px={3}
                              py={1}
                              borderRadius="full"
                              fontSize="sm"
                            >
                              {subcategories.find(sub => sub.subcategoryId?.toString() === formData.podcast_subcategory_id)?.subcategory_name || "Subcategoría"}
                            </Badge>
                            <Badge 
                              colorScheme="green" 
                              variant="solid"
                              px={3}
                              py={1}
                              borderRadius="full"
                              fontSize="sm"
                            >
                              {formData.useIframe ? "Video Embebido" : "Video Externo"}
                            </Badge>
                            <Badge 
                              colorScheme="purple" 
                              variant="solid"
                              px={3}
                              py={1}
                              borderRadius="full"
                              fontSize="sm"
                            >
                              Premium
                            </Badge>
                          </HStack>
                        </VStack>
                      </Box>

                      {/* Video Player con diseño moderno */}
                      <Box p={8}>
                        <VStack spacing={4} align="stretch">
                          <HStack>
                            <Icon as={FiPlay} color="blue.500" boxSize={5} />
                            <Text fontSize="lg" fontWeight="semibold" color="gray.700">
                              Reproductor de Video
                            </Text>
                          </HStack>
                          
                          {formData.useIframe && formData.podcast_iframe ? (
                            <Box 
                              dangerouslySetInnerHTML={{ __html: formData.podcast_iframe }}
                              borderRadius="xl"
                              overflow="hidden"
                              border="3px solid"
                              borderColor="blue.200"
                              bg="gray.50"
                              p={4}
                              boxShadow="lg"
                            />
                          ) : !formData.useIframe && formData.podcast_url ? (
                            <Box
                              borderRadius="xl"
                              overflow="hidden"
                              border="3px solid"
                              borderColor="blue.200"
                              boxShadow="lg"
                            >
                              <AspectRatio ratio={16/9}>
                                <iframe
                                  src={formData.podcast_url}
                                  title="Podcast Preview"
                                  allowFullScreen
                                  style={{ 
                                    border: 'none',
                                    borderRadius: '12px'
                                  }}
                                />
                              </AspectRatio>
                            </Box>
                          ) : (
                            <Box
                              bg="gray.50"
                              borderRadius="xl"
                              p={12}
                              textAlign="center"
                              border="3px dashed"
                              borderColor="gray.300"
                            >
                              <VStack spacing={4}>
                                <Icon as={FiPlay} boxSize={12} color="gray.400" />
                                <Text color="gray.500" fontSize="lg">
                                  Agrega un video para ver la vista previa
                                </Text>
                              </VStack>
                            </Box>
                          )}
                        </VStack>
                      </Box>

                      {/* Footer del podcast */}
                      <Box
                        p={6}
                        bg="gray.50"
                        borderTop="1px solid"
                        borderColor="gray.100"
                      >
                        <HStack justify="space-between" fontSize="sm" color="gray.600">
                          <HStack spacing={6}>
                            <HStack>
                              <Icon as={FiEye} boxSize={4} />
                              <Text>Vista para usuarios suscriptores</Text>
                            </HStack>
                            <HStack>
                              <Icon as={FiPlay} boxSize={4} />
                              <Text>Reproducción directa</Text>
                            </HStack>
                          </HStack>
                          <Text>📅 Publicado hace 2 horas</Text>
                        </HStack>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Nota informativa moderna */}
                <Alert 
                  status="info" 
                  borderRadius="xl"
                  bg="blue.50"
                  border="1px solid"
                  borderColor="blue.200"
                >
                  <AlertIcon color="blue.500" />
                  <Box>
                    <Text fontSize="md" fontWeight="semibold" color="blue.700">
                      ✨ Vista Previa del Usuario Final
                    </Text>
                    <Text fontSize="sm" color="blue.600" mt={1}>
                      Este es exactamente cómo verán los usuarios suscriptores el video en la página web.
                      El video se reproducirá directamente desde la plataforma original (YouTube, TikTok, etc.).
                    </Text>
                  </Box>
                </Alert>
              </VStack>
            </Box>
          </Box>
        </Box>
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
                  <Heading size="lg" color="blue.600">
                    Gestión de Podcasts
                  </Heading>
                </HStack>
                <Text color={textColor}>
                  Crear y administrar podcasts con videos
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
            currentPage="/dashboard/admin/podcast-upload"
          />

          {/* Contenido principal */}
          <Grid 
            templateColumns={{ base: '1fr', lg: '1fr 1fr' }} 
            gap={8}
            minH="100vh"
          >
            {/* Formulario */}
            <GridItem>
              <Card bg={cardBg} boxShadow="md" h="fit-content">
                <CardHeader>
                  <Heading size="md">
                    {editingId ? 'Editar Podcast' : 'Crear Nuevo Podcast'}
                  </Heading>
                </CardHeader>
                <CardBody>
                  <form onSubmit={handleSubmit}>
                    <VStack spacing={4} align="stretch">
                      <FormControl isRequired>
                        <FormLabel>Título del Podcast</FormLabel>
                        <Input
                          name="podcast_title"
                          value={formData.podcast_title}
                          onChange={handleInputChange}
                          placeholder="Ej: Introducción a React Hooks"
                        />
                      </FormControl>

                      <FormControl>
                        <FormLabel>Descripción</FormLabel>
                        <Textarea
                          name="podcast_description"
                          value={formData.podcast_description}
                          onChange={handleInputChange}
                          placeholder="Describe el contenido del podcast..."
                          rows={3}
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Subcategoría</FormLabel>
                        <Select
                          name="podcast_subcategory_id"
                          value={formData.podcast_subcategory_id}
                          onChange={handleInputChange}
                          placeholder="Selecciona una subcategoría"
                        >
                          {subcategories.map((subcategory, index) => (
                            <option key={subcategory.subcategoryId || `subcategory-${index}`} value={subcategory.subcategoryId}>
                              {subcategory.subcategory_name}
                            </option>
                          ))}
                        </Select>
                      </FormControl>

                      <Divider />

                      <FormControl>
                        <FormLabel>Tipo de Video</FormLabel>
                        <HStack>
                          <Text fontSize="sm">URL</Text>
                          <Switch
                            name="useIframe"
                            isChecked={formData.useIframe}
                            onChange={handleInputChange}
                            colorScheme="blue"
                          />
                          <Text fontSize="sm">Iframe</Text>
                        </HStack>
                        <FormHelperText>
                          {formData.useIframe 
                            ? 'Pega el código iframe completo del video'
                            : 'Pega la URL del video (YouTube, Vimeo, etc.)'
                          }
                        </FormHelperText>
                      </FormControl>

                      {formData.useIframe ? (
                        <FormControl isRequired>
                          <FormLabel>Código Iframe</FormLabel>
                          <Textarea
                            name="podcast_iframe"
                            value={formData.podcast_iframe}
                            onChange={handleInputChange}
                            placeholder="<iframe src='...' width='560' height='315' frameborder='0' allowfullscreen></iframe>"
                            rows={3}
                            fontFamily="mono"
                            fontSize="sm"
                          />
                        </FormControl>
                      ) : (
                        <FormControl isRequired>
                          <FormLabel>URL del Video</FormLabel>
                          <Input
                            name="podcast_url"
                            value={formData.podcast_url}
                            onChange={handleInputChange}
                            placeholder="https://www.youtube.com/watch?v=..."
                            type="url"
                          />
                        </FormControl>
                      )}

                      {/* Vista Previa */}
                      <Box>
                        <HStack justify="space-between" mb={2}>
                          <Text fontSize="sm" fontWeight="medium">Vista Previa</Text>
                          <HStack spacing={2}>
                            <Button
                              size="sm"
                              variant="outline"
                              leftIcon={<FiEye />}
                              onClick={togglePreview}
                              isDisabled={!formData.podcast_iframe && !formData.podcast_url}
                            >
                              {showPreview ? 'Ocultar' : 'Mostrar'}
                            </Button>
                            <Button
                              size="sm"
                              colorScheme="blue"
                              variant="outline"
                              leftIcon={<FiExternalLink />}
                              onClick={togglePublicPreview}
                              isDisabled={!formData.podcast_iframe && !formData.podcast_url}
                            >
                              Vista Pública
                            </Button>
                          </HStack>
                        </HStack>
                        {renderVideoPreview()}
                      </Box>

                      <HStack spacing={3}>
                        <Button
                          type="submit"
                          leftIcon={<FiSave />}
                          colorScheme="blue"
                          flex={1}
                          isLoading={submitting}
                          loadingText={editingId ? 'Actualizando...' : 'Creando...'}
                        >
                          {editingId ? 'Actualizar' : 'Crear'} Podcast
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
            </GridItem>

            {/* Lista de podcasts */}
            <GridItem>
              <Card bg={cardBg} boxShadow="md">
                <CardHeader>
                  <VStack align="stretch" spacing={4}>
                    <HStack justify="space-between">
                      <Heading size="md">Podcasts Existentes</Heading>
                      <Badge colorScheme="blue" variant="subtle">
                        {filteredPodcasts.length} podcasts
                      </Badge>
                    </HStack>
                    
                    {/* Filtro por subcategoría */}
                    <FormControl>
                      <FormLabel fontSize="sm">Filtrar por subcategoría</FormLabel>
                      <Select
                        value={selectedSubcategoryFilter}
                        onChange={(e) => setSelectedSubcategoryFilter(e.target.value)}
                        placeholder="Todas las subcategorías"
                        size="sm"
                      >
                        {subcategories.map((subcategory, index) => (
                          <option key={subcategory.subcategoryId || `subcategory-${index}`} value={subcategory.subcategoryId}>
                            {subcategory.subcategory_name}
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                  </VStack>
                </CardHeader>
                <CardBody pt={0}>
                  {loading ? (
                    <Box display="flex" justifyContent="center" py={8}>
                      <Spinner size="lg" color="blue.500" />
                    </Box>
                  ) : !Array.isArray(filteredPodcasts) || filteredPodcasts.length === 0 ? (
                    <Box textAlign="center" py={8}>
                      <Text color={textColor}>
                        {selectedSubcategoryFilter 
                          ? 'No hay podcasts en esta subcategoría' 
                          : 'No hay podcasts creados'
                        }
                      </Text>
                    </Box>
                  ) : (
                    <Box maxH="70vh" overflowY="auto">
                      <Table size="sm">
                        <Thead position="sticky" top={0} bg={cardBg} zIndex={1}>
                          <Tr>
                            <Th>Título</Th>
                            <Th>Subcategoría</Th>
                            <Th>Tipo</Th>
                            <Th>Acciones</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {filteredPodcasts.map((podcast, index) => (
                            <Tr key={podcast.podcastId || `podcast-${index}`}>
                              <Td>
                                <VStack align="start" spacing={1}>
                                  <Text fontWeight="medium" fontSize="sm" noOfLines={2}>
                                    {podcast.podcast_title}
                                  </Text>
                                  {podcast.podcast_description && (
                                    <Text fontSize="xs" color={textColor} noOfLines={1}>
                                      {podcast.podcast_description}
                                    </Text>
                                  )}
                                </VStack>
                              </Td>
                              <Td>
                                <Badge
                                  colorScheme="blue"
                                  variant="subtle"
                                  fontSize="xs"
                                >
                                  {podcast.subcategory_name || 'Sin subcategoría'}
                                </Badge>
                              </Td>
                              <Td>
                                <Badge
                                  colorScheme={podcast.podcast_iframe ? "green" : "orange"}
                                  variant="subtle"
                                  fontSize="xs"
                                >
                                  {podcast.podcast_iframe ? "Iframe" : "URL"}
                                </Badge>
                              </Td>
                              <Td>
                                <HStack spacing={1}>
                                  <IconButton
                                    aria-label="Editar podcast"
                                    icon={<FiEdit />}
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleEdit(podcast)}
                                    isDisabled={submitting}
                                  />
                                  <IconButton
                                    aria-label="Eliminar podcast"
                                    icon={<FiTrash2 />}
                                    size="sm"
                                    variant="ghost"
                                    colorScheme="red"
                                    onClick={() => handleDelete(podcast.podcastId)}
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
            </GridItem>
          </Grid>

          {/* Vista Previa Pública Modal */}
          {renderPublicPreview()}
        </VStack>
      </Container>
    </Box>
  )
}

export default PodcastUpload
