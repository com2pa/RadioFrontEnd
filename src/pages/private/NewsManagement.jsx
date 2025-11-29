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
  Avatar
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

  const handleSearch = (e) => {
    e.preventDefault()
    searchNews(searchTerm)
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
                    Gestión de Noticias
                  </Heading>
                </HStack>
                <Text color={textColor}>
                  Administrar noticias existentes
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
            currentPage="/dashboard/admin/news-management"
          />

          {/* Contenido principal */}
          <Card bg={cardBg} boxShadow="md">
            <CardHeader>
              <VStack align="stretch" spacing={4}>
                <HStack justify="space-between">
                  <Heading size="md">Lista de Noticias</Heading>
                  <HStack spacing={2}>
                    <Button
                      leftIcon={<FiRefreshCw />}
                      onClick={fetchNews}
                      variant="outline"
                      size="sm"
                    >
                      Actualizar
                    </Button>
                    <Button
                      as={RouterLink}
                      to="/dashboard/admin/news-create"
                      colorScheme="red"
                      size="sm"
                    >
                      Crear Noticia
                    </Button>
                  </HStack>
                </HStack>
                
                {/* Búsqueda */}
                <form onSubmit={handleSearch}>
                  <HStack spacing={2}>
                    <Input
                      placeholder="Buscar noticias por título..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      flex={1}
                    />
                    <Button
                      type="submit"
                      leftIcon={<FiSearch />}
                      colorScheme="blue"
                      variant="outline"
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
                        size="sm"
                      >
                        Limpiar
                      </Button>
                    )}
                  </HStack>
                </form>
              </VStack>
            </CardHeader>
            <CardBody pt={0}>
              {loading ? (
                <Box display="flex" justifyContent="center" py={8}>
                  <Spinner size="lg" color="red.500" />
                </Box>
              ) : !Array.isArray(news) || news.length === 0 ? (
                <Box textAlign="center" py={8}>
                  <Text color={textColor}>
                    {searchTerm ? 'No se encontraron noticias con ese título' : 'No hay noticias creadas'}
                  </Text>
                </Box>
              ) : (
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th>Título</Th>
                      <Th>Usuario</Th>
                      <Th>Estado</Th>
                      <Th>Destacada</Th>
                      <Th>Fecha</Th>
                      <Th>Acciones</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {news.map((item, index) => (
                      <Tr key={item.news_id || item.id || `news-${index}`}>
                        <Td>
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="medium" fontSize="sm" noOfLines={2}>
                              {item.news_title || item.title}
                            </Text>
                            {(item.news_subtitle || item.subtitle) && (
                              <Text fontSize="xs" color={textColor} noOfLines={1}>
                                {item.news_subtitle || item.subtitle}
                              </Text>
                            )}
                          </VStack>
                        </Td>
                        <Td>
                          <HStack spacing={2}>
                            <Avatar 
                              size="xs" 
                              name={item.user_name || item.author_name || 'Usuario'} 
                              bg="blue.500"
                            />
                            <VStack align="start" spacing={0}>
                              <Text fontSize="xs" fontWeight="medium" noOfLines={1}>
                                {item.user_name || item.author_name || 'Usuario'}
                              </Text>
                              <Text fontSize="xs" color="gray.500" noOfLines={1}>
                                {item.user_email || item.author_email || ''}
                              </Text>
                            </VStack>
                          </HStack>
                        </Td>
                        <Td>
                          <Badge
                            colorScheme={item.news_status || item.is_published ? 'green' : 'gray'}
                            variant="subtle"
                            fontSize="xs"
                          >
                            {item.news_status || item.is_published ? 'Publicada' : 'Borrador'}
                          </Badge>
                        </Td>
                        <Td>
                          <Badge
                            colorScheme={item.is_featured ? 'yellow' : 'gray'}
                            variant="subtle"
                            fontSize="xs"
                          >
                            {item.is_featured ? 'Sí' : 'No'}
                          </Badge>
                        </Td>
                        <Td>
                          <Text fontSize="xs" color={textColor}>
                            {item.news_created_at || item.created_at ? 
                              new Date(item.news_created_at || item.created_at).toLocaleDateString() : 
                              'N/A'
                            }
                          </Text>
                        </Td>
                        <Td>
                          <HStack spacing={1}>
                            <IconButton
                              aria-label="Ver noticia"
                              icon={<FiEye />}
                              size="sm"
                              variant="ghost"
                              colorScheme="blue"
                              onClick={() => viewNews(item.news_id || item.id)}
                            />
                            <IconButton
                              aria-label="Editar noticia"
                              icon={<FiEdit />}
                              size="sm"
                              variant="ghost"
                              colorScheme="green"
                              onClick={() => editNews(item.news_id || item.id)}
                            />
                            <IconButton
                              aria-label={item.news_status || item.is_published ? 'Desactivar' : 'Activar'}
                              icon={<FiRefreshCw />}
                              size="sm"
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
                              size="sm"
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
              )}
            </CardBody>
          </Card>
        </VStack>
      </Container>

      {/* Modal para ver detalles de la noticia */}
      <Modal isOpen={!!selectedNews} onClose={() => {
        setSelectedNews(null)
        setUserStats(null)
      }} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack spacing={3}>
              <Heading size="md">Detalles de la Noticia</Heading>
              <Badge colorScheme="blue" variant="solid">
                {selectedNews?.news_status || selectedNews?.is_published ? 'Publicada' : 'Borrador'}
              </Badge>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedNews && (
              <VStack spacing={4} align="stretch">
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
                  <Heading size="lg" color="red.600">
                    {selectedNews.news_title || selectedNews.title}
                  </Heading>
                  
                  {(selectedNews.news_subtitle || selectedNews.subtitle) && (
                    <Text fontSize="lg" color={textColor} fontStyle="italic">
                      {selectedNews.news_subtitle || selectedNews.subtitle}
                    </Text>
                  )}
                  
                  <HStack spacing={2} flexWrap="wrap">
                    <Badge colorScheme="blue" variant="outline">
                      Categoría: {selectedNews.subcategory_name || selectedNews.category_name || 'Sin categoría'}
                    </Badge>
                    <Badge colorScheme="gray" variant="outline">
                      Fecha: {new Date(selectedNews.news_created_at || selectedNews.created_at).toLocaleDateString()}
                    </Badge>
                  </HStack>
                  
                  {/* Información del Usuario */}
                  <Box
                    p={3}
                    bg="blue.50"
                    borderRadius="md"
                    border="1px solid"
                    borderColor="blue.200"
                  >
                    <HStack spacing={3}>
                      <Avatar 
                        size="md" 
                        name={selectedNews.user_name || selectedNews.author_name || 'Usuario'} 
                        bg="blue.500"
                      />
                      <VStack align="start" spacing={1}>
                        <Text fontSize="sm" fontWeight="semibold" color="blue.700">
                          Publicado por:
                        </Text>
                        <Text fontSize="md" fontWeight="medium">
                          {selectedNews.user_name || selectedNews.author_name || 'Usuario'}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {selectedNews.user_email || selectedNews.author_email || 'Sin email'}
                        </Text>
                        {selectedNews.user_role && (
                          <Badge colorScheme="purple" variant="subtle" fontSize="xs">
                            {selectedNews.user_role}
                          </Badge>
                        )}
                      </VStack>
                    </HStack>
                    
                    {/* Estadísticas del Usuario */}
                    {userStats && (
                      <HStack spacing={4} mt={3} justify="center">
                        <VStack spacing={1}>
                          <Text fontSize="lg" fontWeight="bold" color="blue.600">
                            {userStats.total_news || 0}
                          </Text>
                          <Text fontSize="xs" color="gray.600">
                            Noticias Totales
                          </Text>
                        </VStack>
                        <VStack spacing={1}>
                          <Text fontSize="lg" fontWeight="bold" color="green.600">
                            {userStats.published_news || 0}
                          </Text>
                          <Text fontSize="xs" color="gray.600">
                            Publicadas
                          </Text>
                        </VStack>
                        <VStack spacing={1}>
                          <Text fontSize="lg" fontWeight="bold" color="orange.600">
                            {userStats.draft_news || 0}
                          </Text>
                          <Text fontSize="xs" color="gray.600">
                            Borradores
                          </Text>
                        </VStack>
                      </HStack>
                    )}
                  </Box>
                </VStack>
                
                <Box>
                  <Text fontSize="sm" fontWeight="medium" mb={2}>Contenido:</Text>
                  <Text 
                    whiteSpace="pre-wrap" 
                    lineHeight="tall"
                    dangerouslySetInnerHTML={{ 
                      __html: (selectedNews.news_content || selectedNews.content || '').replace(/\n/g, '<br>') 
                    }}
                  />
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={() => {
              setSelectedNews(null)
              setUserStats(null)
            }}>
              Cerrar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal de Confirmación de Eliminación */}
      <Modal isOpen={deleteModal.isOpen} onClose={closeDeleteModal} isCentered>
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent mx={4} maxW="md">
          <ModalHeader>
            <HStack spacing={3}>
              <Box
                p={2}
                borderRadius="full"
                bg="red.100"
                color="red.600"
              >
                <FiTrash2 size={20} />
              </Box>
              <VStack align="start" spacing={0}>
                <Text fontSize="lg" fontWeight="bold">
                  Confirmar Eliminación
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Esta acción no se puede deshacer
                </Text>
              </VStack>
            </HStack>
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                <VStack align="start" spacing={1}>
                  <AlertTitle fontSize="sm">¡Atención!</AlertTitle>
                  <AlertDescription fontSize="sm">
                    Estás a punto de eliminar permanentemente la noticia:
                  </AlertDescription>
                </VStack>
              </Alert>
              
              <Box
                p={4}
                bg="gray.50"
                borderRadius="md"
                border="1px solid"
                borderColor="gray.200"
              >
                <Text fontWeight="semibold" color="red.600" mb={2}>
                  "{deleteModal.newsTitle}"
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Esta acción eliminará la noticia y todos sus datos asociados de forma permanente.
                </Text>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <HStack spacing={3} w="full">
              <Button
                variant="outline"
                onClick={closeDeleteModal}
                flex={1}
                isDisabled={deleteModal.isDeleting}
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
              >
                Eliminar Noticia
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default NewsManagement
