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
  Textarea
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
      
      console.log('📰 Noticias cargadas:', newsArray.length)
      setNews(newsArray)
    } catch (error) {
      console.error('Error fetching news:', error)
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
      
      console.log('🔍 Resultados de búsqueda:', newsArray.length, 'para término:', term)
      setNews(newsArray)
    } catch (error) {
      console.error('Error searching news:', error)
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
      console.error('Error changing news status:', error)
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
  const deleteNews = async (id) => {
    try {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
      const response = await axios.delete(`/api/news/${id}`, {
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
        fetchNews() // Recargar la lista
      }
    } catch (error) {
      console.error('Error deleting news:', error)
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'No se pudo eliminar la noticia',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  // Función para editar noticia (redirige a la página de creación/edición)
  const editNews = async () => {
    // Por ahora, solo mostramos un mensaje
    // En el futuro se puede implementar un modal de edición o redirigir
    toast({
      title: 'Función en desarrollo',
      description: 'La edición de noticias estará disponible próximamente',
      status: 'info',
      duration: 3000,
      isClosable: true,
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
                              onClick={() => editNews(item.news_id || item.id)}
                            />
                            <IconButton
                              aria-label="Editar noticia"
                              icon={<FiEdit />}
                              size="sm"
                              variant="ghost"
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
                              onClick={() => deleteNews(item.news_id || item.id)}
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
    </Box>
  )
}

export default NewsManagement
