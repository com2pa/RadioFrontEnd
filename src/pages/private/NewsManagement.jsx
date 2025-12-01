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
  Select,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Image,
  AspectRatio,
  Avatar,
  Flex
} from '@chakra-ui/react'
import { FiEdit, FiTrash2, FiEye, FiMenu, FiHome, FiLogOut, FiArrowLeft, FiSearch, FiRefreshCw } from 'react-icons/fi'
import { useAuth } from '../../hooks/useAuth'
import { Link as RouterLink } from 'react-router-dom'
import AdminMenu from '../../components/layout/AdminMenu'
import axios from 'axios'

const NewsManagement = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const toast = useToast()
  const { auth, logout } = useAuth()
  const { isOpen, onOpen, onClose } = useDisclosure()

  // Estados
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNews, setSelectedNews] = useState(null)
  const [userStats, setUserStats] = useState(null)
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    newsId: null,
    newsTitle: '',
    isDeleting: false
  })

  // Función para obtener todas las noticias
  const fetchNews = useCallback(async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
      const response = await axios.get('/api/news', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      // Manejar diferentes estructuras de respuesta del servidor
      const data = response.data?.data || response.data || []
      const newsArray = Array.isArray(data) ? data : []
      
      // console.log('📰 Noticias cargadas:', newsArray.length)
      setNews(newsArray)
    } catch (error) {
      // console.error('Error fetching news:', error)
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudieron cargar las noticias',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setNews([])
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Función para buscar noticias por término
  const searchNews = useCallback(async (term) => {
    if (!term.trim()) {
      fetchNews()
      return
    }
    
    setLoading(true)
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
      const response = await axios.get(`/api/news/search/${encodeURIComponent(term)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      // Manejar diferentes estructuras de respuesta del servidor
      const data = response.data?.data || response.data || []
      const newsArray = Array.isArray(data) ? data : []
      
      // console.log('🔍 Resultados de búsqueda:', newsArray.length, 'para término:', term)
      setNews(newsArray)
    } catch (error) {
      // console.error('Error searching news:', error)
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo realizar la búsqueda',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setNews([])
    } finally {
      setLoading(false)
    }
  }, [fetchNews, toast])

  // Función para cambiar estado de la noticia
  const changeNewsStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
      const response = await axios.put(`/api/news/${id}/status`, 
        { status }, 
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
          description: `La noticia ha sido ${status ? 'activada' : 'desactivada'}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        fetchNews() // Recargar la lista
      }
    } catch (error) {
      // console.error('Error changing news status:', error)
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo cambiar el estado de la noticia',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  // Función para eliminar noticia
  const deleteNews = async () => {
    setDeleteModal(prev => ({ ...prev, isDeleting: true }))

    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
      const response = await axios.delete(`/api/news/${deleteModal.newsId}`, {
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
        
        // Cerrar modal y recargar noticias
        closeDeleteModal()
        fetchNews()
      }
    } catch (error) {
      // console.error('Error deleting news:', error)
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo eliminar la noticia',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setDeleteModal(prev => ({ ...prev, isDeleting: false }))
    }
  }

  // Función para obtener estadísticas del usuario
  const fetchUserStats = async (userId) => {
    if (!userId) return null
    
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
      const response = await axios.get(`/api/news/user/${userId}/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      return response.data?.data || response.data
    } catch (error) {
      // console.error('Error fetching user stats:', error)
      return null
    }
  }

  // Función para ver detalles de la noticia
  const viewNews = async (id) => {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
      const response = await axios.get(`/api/news/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const newsData = response.data?.data || response.data
      setSelectedNews(newsData)
      
      // Obtener estadísticas del usuario si está disponible
      const userId = newsData.user_id || newsData.author_id
      if (userId) {
        const stats = await fetchUserStats(userId)
        setUserStats(stats)
      }
    } catch (error) {
      // console.error('Error fetching news details:', error)
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo cargar la noticia',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  // Función para editar noticia (redirige a la página de creación/edición)
  const editNews = async (id) => {
    // Redirigir a la página de creación con el ID para editar
    window.location.href = `/dashboard/admin/news-create?edit=${id}`
  }

  // Función para abrir el modal de confirmación de eliminación
  const openDeleteModal = (newsId, newsTitle) => {
    setDeleteModal({
      isOpen: true,
      newsId,
      newsTitle,
      isDeleting: false
    })
  }

  // Función para cerrar el modal de confirmación
  const closeDeleteModal = () => {
    setDeleteModal({
      isOpen: false,
      newsId: null,
      newsTitle: '',
      isDeleting: false
    })
  }

  // Cargar noticias al montar el componente
  useEffect(() => {
    fetchNews()
  }, [fetchNews])

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

  const handleSearch = (e) => {
    e.preventDefault()
    searchNews(searchTerm)
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
                    Gestión de Noticias
                  </Heading>
                </Flex>
                <Text 
                  color={textColor}
                  fontSize={{ base: "sm", md: "md" }}
                >
                  Administrar noticias existentes
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
            currentPage="/dashboard/admin/news-management"
          />

          {/* Contenido principal */}
          <Card bg={cardBg} boxShadow="md">
            <CardHeader pb={{ base: 3, md: 4 }}>
              <VStack align="stretch" spacing={{ base: 3, md: 4 }}>
                <Flex
                  direction={{ base: "column", sm: "row" }}
                  justify="space-between"
                  align={{ base: "start", sm: "center" }}
                  gap={3}
                >
                  <Heading size={{ base: "sm", md: "md" }}>
                    Lista de Noticias
                  </Heading>
                  <HStack spacing={2} flexWrap="wrap">
                    <Button
                      leftIcon={<FiRefreshCw />}
                      onClick={fetchNews}
                      variant="outline"
                      size={{ base: "xs", md: "sm" }}
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      Actualizar
                    </Button>
                    <Button
                      as={RouterLink}
                      to="/dashboard/admin/news-create"
                      colorScheme="red"
                      size={{ base: "xs", md: "sm" }}
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      Crear Noticia
                    </Button>
                  </HStack>
                </Flex>
                
                {/* Búsqueda */}
                <form onSubmit={handleSearch}>
                  <Flex
                    direction={{ base: "column", sm: "row" }}
                    gap={2}
                  >
                    <Input
                      placeholder="Buscar noticias por título..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      flex={1}
                      size={{ base: "sm", md: "md" }}
                    />
                    <HStack spacing={2}>
                      <Button
                        type="submit"
                        leftIcon={<FiSearch />}
                        colorScheme="blue"
                        variant="outline"
                        size={{ base: "sm", md: "md" }}
                        fontSize={{ base: "xs", md: "sm" }}
                      >
                        Buscar
                      </Button>
                      {searchTerm && (
                        <Button
                          onClick={() => {
                            setSearchTerm('')
                            fetchNews()
                          }}
                          variant="ghost"
                          size={{ base: "sm", md: "md" }}
                          fontSize={{ base: "xs", md: "sm" }}
                        >
                          Limpiar
                        </Button>
                      )}
                    </HStack>
                  </Flex>
                </form>
              </VStack>
            </CardHeader>
            <CardBody pt={0} px={{ base: 3, md: 6 }} pb={{ base: 3, md: 6 }}>
              {loading ? (
                <Box display="flex" justifyContent="center" py={8}>
                  <VStack spacing={4}>
                    <Spinner size={{ base: "md", md: "lg" }} color="red.500" />
                    <Text 
                      color={textColor}
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      Cargando noticias...
                    </Text>
                  </VStack>
                </Box>
              ) : !Array.isArray(news) || news.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <Text 
                    color={textColor}
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    {searchTerm ? 'No se encontraron noticias con ese título' : 'No hay noticias creadas'}
                  </Text>
                </Box>
              ) : (
                <Box overflowX="auto">
                  <Table size={{ base: "xs", md: "sm" }} variant="simple">
                    <Thead>
                      <Tr>
                        <Th fontSize={{ base: "xs", md: "sm" }}>Título</Th>
                        <Th fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", lg: "table-cell" }}>
                          Usuario
                        </Th>
                        <Th fontSize={{ base: "xs", md: "sm" }}>Estado</Th>
                        <Th fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", xl: "table-cell" }}>
                          Destacada
                        </Th>
                        <Th fontSize={{ base: "xs", md: "sm" }} display={{ base: "none", md: "table-cell" }}>
                          Fecha
                        </Th>
                        <Th fontSize={{ base: "xs", md: "sm" }}>Acciones</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {news.map((item, index) => (
                        <Tr key={item.news_id || item.id || `news-${index}`}>
                          <Td>
                            <VStack align="start" spacing={1}>
                              <Text 
                                fontWeight="medium" 
                                fontSize={{ base: "xs", md: "sm" }} 
                                noOfLines={2}
                                wordBreak="break-word"
                              >
                                {item.news_title || item.title}
                              </Text>
                              {(item.news_subtitle || item.subtitle) && (
                                <Text 
                                  fontSize="2xs" 
                                  color={textColor} 
                                  noOfLines={1}
                                >
                                  {item.news_subtitle || item.subtitle}
                                </Text>
                              )}
                              {/* Mostrar usuario, fecha y destacada en móvil */}
                              <VStack align="start" spacing={1} display={{ base: "flex", lg: "none" }} mt={1}>
                                <HStack spacing={2}>
                                  <Avatar 
                                    size="2xs" 
                                    name={item.user_name || item.author_name || 'Usuario'} 
                                    bg="blue.500"
                                  />
                                  <Text fontSize="2xs" fontWeight="medium" noOfLines={1}>
                                    {item.user_name || item.author_name || 'Usuario'}
                                  </Text>
                                </HStack>
                                <HStack spacing={2} flexWrap="wrap">
                                  <Text fontSize="2xs" color={textColor}>
                                    {item.news_created_at || item.created_at ? 
                                      new Date(item.news_created_at || item.created_at).toLocaleDateString() : 
                                      'N/A'
                                    }
                                  </Text>
                                  <Badge
                                    colorScheme={item.is_featured ? 'yellow' : 'gray'}
                                    variant="subtle"
                                    fontSize="2xs"
                                  >
                                    {item.is_featured ? 'Destacada' : 'Normal'}
                                  </Badge>
                                </HStack>
                              </VStack>
                            </VStack>
                          </Td>
                          <Td display={{ base: "none", lg: "table-cell" }}>
                            <HStack spacing={2}>
                              <Avatar 
                                size={{ base: "2xs", md: "xs" }} 
                                name={item.user_name || item.author_name || 'Usuario'} 
                                bg="blue.500"
                              />
                              <VStack align="start" spacing={0}>
                                <Text 
                                  fontSize={{ base: "2xs", md: "xs" }} 
                                  fontWeight="medium" 
                                  noOfLines={1}
                                >
                                  {item.user_name || item.author_name || 'Usuario'}
                                </Text>
                                <Text 
                                  fontSize="2xs" 
                                  color="gray.500" 
                                  noOfLines={1}
                                  display={{ base: "none", xl: "block" }}
                                >
                                  {item.user_email || item.author_email || ''}
                                </Text>
                              </VStack>
                            </HStack>
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={item.news_status || item.is_published ? 'green' : 'gray'}
                              variant="subtle"
                              fontSize={{ base: "2xs", md: "xs" }}
                            >
                              {item.news_status || item.is_published ? 'Publicada' : 'Borrador'}
                            </Badge>
                          </Td>
                          <Td display={{ base: "none", xl: "table-cell" }}>
                            <Badge
                              colorScheme={item.is_featured ? 'yellow' : 'gray'}
                              variant="subtle"
                              fontSize={{ base: "2xs", md: "xs" }}
                            >
                              {item.is_featured ? 'Sí' : 'No'}
                            </Badge>
                          </Td>
                          <Td display={{ base: "none", md: "table-cell" }}>
                            <Text 
                              fontSize={{ base: "2xs", md: "xs" }} 
                              color={textColor}
                            >
                              {item.news_created_at || item.created_at ? 
                                new Date(item.news_created_at || item.created_at).toLocaleDateString() : 
                                'N/A'
                              }
                            </Text>
                          </Td>
                          <Td>
                            <HStack spacing={1} flexWrap="wrap">
                              <IconButton
                                aria-label="Ver noticia"
                                icon={<FiEye />}
                                size={{ base: "xs", md: "sm" }}
                                variant="ghost"
                                colorScheme="blue"
                                onClick={() => viewNews(item.news_id || item.id)}
                              />
                              <IconButton
                                aria-label="Editar noticia"
                                icon={<FiEdit />}
                                size={{ base: "xs", md: "sm" }}
                                variant="ghost"
                                colorScheme="green"
                                onClick={() => editNews(item.news_id || item.id)}
                              />
                              <IconButton
                                aria-label={item.news_status || item.is_published ? 'Desactivar' : 'Activar'}
                                icon={<FiRefreshCw />}
                                size={{ base: "xs", md: "sm" }}
                                variant="ghost"
                                colorScheme={item.news_status || item.is_published ? 'orange' : 'green'}
                                onClick={() => changeNewsStatus(
                                  item.news_id || item.id, 
                                  !(item.news_status || item.is_published)
                                )}
                              />
                              <IconButton
                                aria-label="Eliminar noticia"
                                icon={<FiTrash2 />}
                                size={{ base: "xs", md: "sm" }}
                                variant="ghost"
                                colorScheme="red"
                                onClick={() => openDeleteModal(
                                  item.news_id || item.id, 
                                  item.news_title || item.title
                                )}
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
        </VStack>
      </Container>

      {/* Modal para ver detalles de la noticia */}
      <Modal 
        isOpen={!!selectedNews} 
        onClose={() => {
          setSelectedNews(null)
          setUserStats(null)
        }} 
        size={{ base: "full", md: "xl" }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent mx={{ base: 0, md: 4 }} maxH={{ base: "100vh", md: "90vh" }}>
          <ModalHeader pb={{ base: 3, md: 4 }}>
            <Flex
              direction={{ base: "column", sm: "row" }}
              align={{ base: "start", sm: "center" }}
              gap={3}
            >
              <Heading size={{ base: "sm", md: "md" }}>
                Detalles de la Noticia
              </Heading>
              <Badge 
                colorScheme="blue" 
                variant="solid"
                fontSize={{ base: "xs", md: "sm" }}
              >
                {selectedNews?.news_status || selectedNews?.is_published ? 'Publicada' : 'Borrador'}
              </Badge>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody 
            px={{ base: 4, md: 6 }} 
            pb={{ base: 4, md: 6 }}
            overflowY="auto"
            maxH={{ base: "calc(100vh - 200px)", md: "calc(90vh - 200px)" }}
          >
            {selectedNews && (
              <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                {selectedNews.news_image || selectedNews.image ? (
                  <AspectRatio ratio={16/9} borderRadius="md" overflow="hidden">
                    <Image
                      src={`http://localhost:3000/uploads/news/${selectedNews.news_image || selectedNews.image}`}
                      alt={selectedNews.news_title || selectedNews.title}
                      objectFit="cover"
                      fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg=="
                    />
                  </AspectRatio>
                ) : null}
                
                <VStack align="start" spacing={2}>
                  <Heading 
                    size={{ base: "md", md: "lg" }} 
                    color="red.600"
                  >
                    {selectedNews.news_title || selectedNews.title}
                  </Heading>
                  
                  {(selectedNews.news_subtitle || selectedNews.subtitle) && (
                    <Text 
                      fontSize={{ base: "md", md: "lg" }} 
                      color={textColor} 
                      fontStyle="italic"
                    >
                      {selectedNews.news_subtitle || selectedNews.subtitle}
                    </Text>
                  )}
                  
                  <HStack spacing={2} flexWrap="wrap">
                    <Badge 
                      colorScheme="blue" 
                      variant="outline"
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      Categoría: {selectedNews.subcategory_name || selectedNews.category_name || 'Sin categoría'}
                    </Badge>
                    <Badge 
                      colorScheme="gray" 
                      variant="outline"
                      fontSize={{ base: "xs", md: "sm" }}
                    >
                      Fecha: {new Date(selectedNews.news_created_at || selectedNews.created_at).toLocaleDateString()}
                    </Badge>
                  </HStack>
                  
                  {/* Información del Usuario */}
                  <Box
                    p={{ base: 3, md: 4 }}
                    bg="blue.50"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="blue.200"
                    w="full"
                  >
                    <Flex
                      direction={{ base: "column", sm: "row" }}
                      align={{ base: "start", sm: "center" }}
                      gap={3}
                    >
                      <Avatar 
                        size={{ base: "sm", md: "md" }} 
                        name={selectedNews.user_name || selectedNews.author_name || 'Usuario'} 
                        bg="blue.500"
                      />
                      <VStack align="start" spacing={1} flex={1}>
                        <Text 
                          fontSize={{ base: "xs", md: "sm" }} 
                          fontWeight="semibold" 
                          color="blue.700"
                        >
                          Publicado por:
                        </Text>
                        <Text 
                          fontSize={{ base: "sm", md: "md" }} 
                          fontWeight="medium"
                        >
                          {selectedNews.user_name || selectedNews.author_name || 'Usuario'}
                        </Text>
                        <Text 
                          fontSize={{ base: "xs", md: "sm" }} 
                          color="gray.600"
                        >
                          {selectedNews.user_email || selectedNews.author_email || 'Sin email'}
                        </Text>
                        {selectedNews.user_role && (
                          <Badge 
                            colorScheme="purple" 
                            variant="subtle" 
                            fontSize={{ base: "2xs", md: "xs" }}
                          >
                            {selectedNews.user_role}
                          </Badge>
                        )}
                      </VStack>
                    </Flex>
                    
                    {/* Estadísticas del Usuario */}
                    {userStats && (
                      <Flex
                        direction={{ base: "column", sm: "row" }}
                        spacing={4}
                        mt={3}
                        justify="center"
                        gap={4}
                        flexWrap="wrap"
                      >
                        <VStack spacing={1}>
                          <Text 
                            fontSize={{ base: "md", md: "lg" }} 
                            fontWeight="bold" 
                            color="blue.600"
                          >
                            {userStats.total_news || 0}
                          </Text>
                          <Text 
                            fontSize={{ base: "2xs", md: "xs" }} 
                            color="gray.600"
                          >
                            Noticias Totales
                          </Text>
                        </VStack>
                        <VStack spacing={1}>
                          <Text 
                            fontSize={{ base: "md", md: "lg" }} 
                            fontWeight="bold" 
                            color="green.600"
                          >
                            {userStats.published_news || 0}
                          </Text>
                          <Text 
                            fontSize={{ base: "2xs", md: "xs" }} 
                            color="gray.600"
                          >
                            Publicadas
                          </Text>
                        </VStack>
                        <VStack spacing={1}>
                          <Text 
                            fontSize={{ base: "md", md: "lg" }} 
                            fontWeight="bold" 
                            color="orange.600"
                          >
                            {userStats.draft_news || 0}
                          </Text>
                          <Text 
                            fontSize={{ base: "2xs", md: "xs" }} 
                            color="gray.600"
                          >
                            Borradores
                          </Text>
                        </VStack>
                      </Flex>
                    )}
                  </Box>
                </VStack>
                
                <Box>
                  <Text 
                    fontSize={{ base: "xs", md: "sm" }} 
                    fontWeight="medium" 
                    mb={2}
                  >
                    Contenido:
                  </Text>
                  <Text 
                    whiteSpace="pre-wrap" 
                    lineHeight="tall"
                    fontSize={{ base: "sm", md: "md" }}
                    dangerouslySetInnerHTML={{ 
                      __html: (selectedNews.news_content || selectedNews.content || '').replace(/\n/g, '<br>') 
                    }}
                  />
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter px={{ base: 4, md: 6 }} pb={{ base: 4, md: 6 }}>
            <Button 
              variant="outline" 
              onClick={() => {
                setSelectedNews(null)
                setUserStats(null)
              }}
              size={{ base: "sm", md: "md" }}
              fontSize={{ base: "xs", md: "sm" }}
            >
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de Confirmación de Eliminación */}
      <Modal isOpen={deleteModal.isOpen} onClose={closeDeleteModal} isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent mx={{ base: 4, md: 0 }} maxW="md">
          <ModalHeader pb={{ base: 3, md: 4 }}>
            <Flex
              direction={{ base: "column", sm: "row" }}
              align={{ base: "start", sm: "center" }}
              gap={3}
            >
              <Box
                p={2}
                borderRadius="full"
                bg="red.100"
                color="red.600"
              >
                <FiTrash2 size={20} />
              </Box>
              <VStack align="start" spacing={0}>
                <Text 
                  fontSize={{ base: "md", md: "lg" }} 
                  fontWeight="bold"
                >
                  Confirmar Eliminación
                </Text>
                <Text 
                  fontSize={{ base: "xs", md: "sm" }} 
                  color="gray.500"
                >
                  Esta acción no se puede deshacer
                </Text>
              </VStack>
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody px={{ base: 4, md: 6 }} pb={{ base: 4, md: 6 }}>
            <VStack spacing={{ base: 3, md: 4 }} align="stretch">
              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                <VStack align="start" spacing={1}>
                  <AlertTitle fontSize={{ base: "xs", md: "sm" }}>
                    ¡Atención!
                  </AlertTitle>
                  <AlertDescription fontSize={{ base: "xs", md: "sm" }}>
                    Estás a punto de eliminar permanentemente la noticia:
                  </AlertDescription>
                </VStack>
              </Alert>
              
              <Box
                p={{ base: 3, md: 4 }}
                bg="gray.50"
                borderRadius="md"
                border="1px solid"
                borderColor="gray.200"
              >
                <Text 
                  fontWeight="semibold" 
                  color="red.600" 
                  mb={2}
                  fontSize={{ base: "sm", md: "md" }}
                >
                  "{deleteModal.newsTitle}"
                </Text>
                <Text 
                  fontSize={{ base: "xs", md: "sm" }} 
                  color="gray.600"
                >
                  Esta acción eliminará la noticia y todos sus datos asociados de forma permanente.
                </Text>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter px={{ base: 4, md: 6 }} pb={{ base: 4, md: 6 }}>
            <Flex
              direction={{ base: "column", sm: "row" }}
              w="full"
              gap={3}
            >
              <Button
                variant="outline"
                onClick={closeDeleteModal}
                flex={1}
                isDisabled={deleteModal.isDeleting}
                size={{ base: "sm", md: "md" }}
                fontSize={{ base: "xs", md: "sm" }}
              >
                Cancelar
              </Button>
              <Button
                colorScheme="red"
                onClick={deleteNews}
                flex={1}
                isLoading={deleteModal.isDeleting}
                loadingText="Eliminando..."
                leftIcon={<FiTrash2 />}
                size={{ base: "sm", md: "md" }}
                fontSize={{ base: "xs", md: "sm" }}
              >
                Eliminar Noticia
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default NewsManagement
