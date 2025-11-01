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
  Badge,
  Heading,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Spinner,
  Flex,
  Image,
  useToast,
  SimpleGrid,
  Divider,
  AspectRatio,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import { 
  FiBookOpen,
  FiSearch,
  FiFilter,
  FiGrid,
  FiList,
  FiCalendar,
  FiEye,
  FiTag,
  FiArrowRight,
  FiImage
} from 'react-icons/fi'
import UserLayout from '../../components/layout/UserLayout'
import axios from 'axios'

const NewsView = () => {
  console.log('📰 [NewsView] Componente renderizado')
  
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const bgHover = useColorModeValue('gray.50', 'gray.700')
  const toast = useToast()

  // Estados
  const [news, setNews] = useState([])
  const [filteredNews, setFilteredNews] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingSubcategories, setLoadingSubcategories] = useState(false)
  const [selectedNews, setSelectedNews] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('')
  const [viewMode, setViewMode] = useState('grid') // 'grid' o 'list'

  // Obtener todas las noticias
  const fetchNews = useCallback(async () => {
    setLoading(true)
    try {
      console.log('🔍 [NewsView] Obteniendo todas las noticias...')
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
      const response = await axios.get('/api/news', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = response.data?.data || response.data || []
      const newsArray = Array.isArray(data) ? data : []
      
      console.log(`✅ [NewsView] Noticias obtenidas: ${newsArray.length}`)
      console.log('📸 [NewsView] Ejemplo de noticia:', newsArray[0] ? {
        id: newsArray[0].news_id || newsArray[0].id,
        title: newsArray[0].news_title || newsArray[0].title,
        image: newsArray[0].news_image || newsArray[0].image,
        allFields: Object.keys(newsArray[0])
      } : 'No hay noticias')
      setNews(newsArray)
      setFilteredNews(newsArray)
    } catch (error) {
      console.error('❌ [NewsView] Error obteniendo noticias:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las noticias',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setNews([])
      setFilteredNews([])
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Obtener subcategorías
  const fetchSubcategories = useCallback(async () => {
    setLoadingSubcategories(true)
    try {
      const response = await axios.get('/api/subcategory-news')
      const data = Array.isArray(response.data) ? response.data : []
      setSubcategories(data)
      console.log(`✅ [NewsView] Subcategorías obtenidas: ${data.length}`)
    } catch (error) {
      console.error('❌ [NewsView] Error obteniendo subcategorías:', error)
      setSubcategories([])
    } finally {
      setLoadingSubcategories(false)
    }
  }, [])

  // Obtener noticias por subcategoría
  const fetchNewsBySubcategory = useCallback(async (subcategoryId) => {
    setLoading(true)
    try {
      console.log(`🔍 [NewsView] Obteniendo noticias para subcategoría: ${subcategoryId}`)
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
      
      // Intentar endpoint por subcategoría
      try {
        const response = await axios.get(`/api/news/subcategory/${subcategoryId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const data = response.data?.data || response.data || []
        const newsArray = Array.isArray(data) ? data : []
        
        console.log(`✅ [NewsView] Noticias por subcategoría: ${newsArray.length}`)
        setFilteredNews(newsArray)
        return
      } catch (err) {
        console.log(`⚠️ [NewsView] Endpoint /api/news/subcategory/ no disponible, usando filtro local...`)
      }
      
      // Fallback: filtrar manualmente
      const filtered = news.filter(item =>
        item.subcategory_id?.toString() === subcategoryId.toString() ||
        item.subcategoryId?.toString() === subcategoryId.toString()
      )
      setFilteredNews(filtered)
    } catch (error) {
      console.error('❌ [NewsView] Error obteniendo noticias por subcategoría:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las noticias de esta subcategoría',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setFilteredNews([])
    } finally {
      setLoading(false)
    }
  }, [toast, news])

  // Buscar noticias por título
  const searchNewsByTitle = useCallback(async (term) => {
    if (!term.trim()) {
      fetchNews()
      return
    }
    
    setLoading(true)
    try {
      console.log(`🔍 [NewsView] Buscando noticias por término: ${term}`)
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
      
      const response = await axios.get(`/api/news/search/${encodeURIComponent(term)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = response.data?.data || response.data || []
      const newsArray = Array.isArray(data) ? data : []
      
      console.log(`✅ [NewsView] Resultados de búsqueda: ${newsArray.length}`)
      setFilteredNews(newsArray)
    } catch (error) {
      console.error('❌ [NewsView] Error buscando noticias:', error)
      // Si falla, filtrar manualmente
      const filtered = news.filter(item =>
        item.news_title?.toLowerCase().includes(term.toLowerCase()) ||
        item.title?.toLowerCase().includes(term.toLowerCase())
      )
      setFilteredNews(filtered)
      
      if (filtered.length === 0) {
        toast({
          title: 'Sin resultados',
          description: 'No se encontraron noticias con ese término',
          status: 'info',
          duration: 3000,
          isClosable: true,
        })
      }
    } finally {
      setLoading(false)
    }
  }, [toast, news, fetchNews])

  // Cargar datos iniciales
  useEffect(() => {
    fetchNews()
    fetchSubcategories()
  }, [fetchNews, fetchSubcategories])

  // Filtrar noticias por subcategoría cuando se selecciona
  useEffect(() => {
    if (selectedSubcategory) {
      fetchNewsBySubcategory(selectedSubcategory)
    } else if (searchTerm) {
      // Si no hay subcategoría pero hay búsqueda, buscar
      searchNewsByTitle(searchTerm)
    } else {
      // Si no hay filtros, mostrar todas
      setFilteredNews(news)
    }
  }, [selectedSubcategory])

  // Buscar cuando cambia el término de búsqueda
  useEffect(() => {
    if (searchTerm.trim()) {
      const timeoutId = setTimeout(() => {
        searchNewsByTitle(searchTerm)
      }, 500) // Debounce de 500ms
      
      return () => clearTimeout(timeoutId)
    } else if (!selectedSubcategory) {
      // Si no hay búsqueda ni subcategoría, mostrar todas
      setFilteredNews(news)
    }
  }, [searchTerm, searchNewsByTitle, selectedSubcategory, news])

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedSubcategory('')
    setFilteredNews(news)
  }

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Abrir modal de noticia
  const handleNewsClick = (newsItem) => {
    setSelectedNews(newsItem)
    onOpen()
  }

  // Obtener URL de imagen
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      console.log('⚠️ [NewsView] No hay ruta de imagen')
      return null
    }
    
    if (imagePath.startsWith('http')) {
      console.log('✅ [NewsView] URL externa:', imagePath)
      return imagePath
    }
    
    // Extraer el nombre del archivo (puede venir con ruta completa o solo el nombre)
    const filename = imagePath.includes('/') 
      ? imagePath.split('/').pop() 
      : imagePath
    
    const finalUrl = `/images/${filename}`
    console.log(`🔗 [NewsView] Construyendo URL: "${imagePath}" → "${finalUrl}"`)
    return finalUrl
  }

  return (
    <UserLayout 
      title="Noticias"
      subtitle="Mantente informado con las últimas noticias"
    >
      <VStack spacing={6} align="stretch">
        {/* Header con búsqueda y filtros */}
        <Card bg={cardBg} boxShadow="md">
          <CardBody>
            <VStack spacing={4} align="stretch">
              {/* Búsqueda */}
              <InputGroup size="lg">
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiSearch} color="gray.400" />
                </InputLeftElement>
                <Input
                  placeholder="Buscar noticias por título..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  bg={useColorModeValue('white', 'gray.700')}
                />
              </InputGroup>

              {/* Filtros */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                <Select
                  placeholder="Todas las subcategorías"
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  isDisabled={loadingSubcategories}
                  bg={useColorModeValue('white', 'gray.700')}
                >
                  {loadingSubcategories ? (
                    <option>Cargando...</option>
                  ) : (
                    subcategories.map((subcategory) => (
                      <option 
                        key={subcategory.subcategory_id || subcategory.subcategoryId} 
                        value={subcategory.subcategory_id || subcategory.subcategoryId}
                      >
                        {subcategory.subcategory_name || subcategory.subcategoryName}
                      </option>
                    ))
                  )}
                </Select>

                <HStack spacing={2}>
                  <Button
                    leftIcon={<Icon as={FiFilter} />}
                    variant="outline"
                    onClick={clearFilters}
                    size="md"
                    flex={1}
                  >
                    Limpiar
                  </Button>
                  <IconButton
                    aria-label={viewMode === 'grid' ? 'Vista de lista' : 'Vista de grid'}
                    icon={<Icon as={viewMode === 'grid' ? FiList : FiGrid} />}
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    variant="outline"
                  />
                </HStack>
              </SimpleGrid>

              {/* Contador de resultados */}
              <HStack justify="space-between">
                <Text fontSize="sm" color={textColor}>
                  {filteredNews.length} noticia{filteredNews.length !== 1 ? 's' : ''} encontrada{filteredNews.length !== 1 ? 's' : ''}
                </Text>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Lista de Noticias */}
        {loading ? (
          <Flex justify="center" align="center" py={20}>
            <VStack spacing={4}>
              <Spinner size="xl" color="blue.500" thickness="4px" />
              <Text color={textColor}>Cargando noticias...</Text>
            </VStack>
          </Flex>
        ) : filteredNews.length === 0 ? (
          <Card bg={cardBg} boxShadow="md">
            <CardBody>
              <VStack spacing={4} py={10}>
                <Icon as={FiBookOpen} boxSize={16} color="gray.400" />
                <Heading size="md" color={textColor}>
                  No se encontraron noticias
                </Heading>
                <Text color={textColor} textAlign="center">
                  {searchTerm || selectedSubcategory
                    ? 'Intenta ajustar tus filtros de búsqueda'
                    : 'Aún no hay noticias disponibles'}
                </Text>
                {(searchTerm || selectedSubcategory) && (
                  <Button onClick={clearFilters} colorScheme="blue" variant="outline">
                    Limpiar filtros
                  </Button>
                )}
              </VStack>
            </CardBody>
          </Card>
        ) : viewMode === 'grid' ? (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 3 }} spacing={6}>
            {filteredNews.map((newsItem) => (
              <Card
                key={newsItem.news_id || newsItem.id}
                bg={cardBg}
                boxShadow="md"
                _hover={{
                  transform: 'translateY(-4px)',
                  boxShadow: 'xl',
                  transition: 'all 0.3s'
                }}
                transition="all 0.3s"
                cursor="pointer"
                onClick={() => handleNewsClick(newsItem)}
              >
                <CardBody p={0}>
                  {/* Imagen de la noticia */}
                  <Box position="relative" bg="gray.100" minH="200px" overflow="hidden">
                    {(() => {
                      const imagePath = newsItem.news_image || newsItem.image
                      const imageUrl = getImageUrl(imagePath)
                      console.log('🖼️ [NewsView] Renderizando imagen para noticia:', {
                        newsId: newsItem.news_id || newsItem.id,
                        title: newsItem.news_title || newsItem.title,
                        imagePath,
                        imageUrl
                      })
                      
                      return imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={newsItem.news_title || newsItem.title}
                          objectFit="cover"
                          w="100%"
                          h="200px"
                          onError={(e) => {
                            console.error('❌ [NewsView] Error cargando imagen:', imageUrl)
                            console.error('📰 [NewsView] Datos de la noticia:', newsItem)
                          }}
                          onLoad={() => {
                            console.log('✅ [NewsView] Imagen cargada:', imageUrl)
                          }}
                        />
                      ) : (
                        <Flex
                          align="center"
                          justify="center"
                          minH="200px"
                          bgGradient="linear(to-br, blue.400, purple.500)"
                        >
                          <Icon as={FiBookOpen} boxSize={16} color="white" opacity={0.8} />
                        </Flex>
                      )
                    })()}
                    {/* Badge de fecha */}
                    {newsItem.created_at && (
                      <Box
                        position="absolute"
                        top={2}
                        left={2}
                        bg="blackAlpha.700"
                        color="white"
                        px={2}
                        py={1}
                        borderRadius="md"
                        fontSize="xs"
                      >
                        {formatDate(newsItem.created_at).split(' ')[0]} {formatDate(newsItem.created_at).split(' ')[1]}
                      </Box>
                    )}
                  </Box>

                  {/* Información de la noticia */}
                  <VStack align="stretch" spacing={3} p={4}>
                    <VStack align="stretch" spacing={1}>
                      <Heading size="sm" noOfLines={2}>
                        {newsItem.news_title || newsItem.title}
                      </Heading>
                      <Text fontSize="sm" color={textColor} noOfLines={3}>
                        {newsItem.news_description || newsItem.description || 'Sin descripción disponible'}
                      </Text>
                    </VStack>

                    <HStack justify="space-between" align="center">
                      {newsItem.subcategory_name && (
                        <Badge colorScheme="blue">
                          {newsItem.subcategory_name}
                        </Badge>
                      )}
                      <HStack spacing={1} color={textColor}>
                        <Icon as={FiEye} boxSize={3} />
                        <Text fontSize="xs">Ver más</Text>
                      </HStack>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        ) : (
          <VStack spacing={4} align="stretch">
            {filteredNews.map((newsItem) => (
              <Card
                key={newsItem.news_id || newsItem.id}
                bg={cardBg}
                boxShadow="md"
                _hover={{
                  bg: bgHover,
                  transition: 'all 0.2s'
                }}
                transition="all 0.2s"
                cursor="pointer"
                onClick={() => handleNewsClick(newsItem)}
              >
                <CardBody>
                  <HStack spacing={6} align="start">
                    {/* Imagen */}
                    <Box minW="200px" maxW="200px">
                      {(() => {
                        const imagePath = newsItem.news_image || newsItem.image
                        const imageUrl = getImageUrl(imagePath)
                        
                        return imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={newsItem.news_title || newsItem.title}
                            objectFit="cover"
                            w="100%"
                            h="150px"
                            borderRadius="md"
                            onError={(e) => {
                              console.error('❌ [NewsView] Error cargando imagen en lista:', imageUrl)
                              console.error('📰 [NewsView] Datos:', newsItem)
                            }}
                            onLoad={() => {
                              console.log('✅ [NewsView] Imagen cargada en lista:', imageUrl)
                            }}
                          />
                        ) : (
                          <Flex
                            align="center"
                            justify="center"
                            bgGradient="linear(to-br, blue.400, purple.500)"
                            borderRadius="md"
                            minH="150px"
                          >
                            <Icon as={FiBookOpen} boxSize={10} color="white" />
                          </Flex>
                        )
                      })()}
                    </Box>

                    {/* Información */}
                    <VStack align="stretch" spacing={2} flex={1}>
                      <HStack justify="space-between" align="start">
                        <VStack align="stretch" spacing={1} flex={1}>
                          <Heading size="md">
                            {newsItem.news_title || newsItem.title}
                          </Heading>
                          <Text fontSize="sm" color={textColor} noOfLines={2}>
                            {newsItem.news_description || newsItem.description || 'Sin descripción disponible'}
                          </Text>
                        </VStack>
                        <Button
                          rightIcon={<Icon as={FiArrowRight} />}
                          colorScheme="blue"
                          size="sm"
                          variant="outline"
                        >
                          Leer
                        </Button>
                      </HStack>

                      <HStack spacing={4}>
                        {newsItem.subcategory_name && (
                          <Badge colorScheme="blue">
                            {newsItem.subcategory_name}
                          </Badge>
                        )}
                        {newsItem.created_at && (
                          <HStack spacing={1}>
                            <Icon as={FiCalendar} color={textColor} boxSize={3} />
                            <Text fontSize="xs" color={textColor}>
                              {formatDate(newsItem.created_at)}
                            </Text>
                          </HStack>
                        )}
                      </HStack>
                    </VStack>
                  </HStack>
                </CardBody>
              </Card>
            ))}
          </VStack>
        )}

        {/* Modal para ver noticia completa */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered scrollBehavior="inside">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {selectedNews?.news_title || selectedNews?.title || 'Noticia'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {selectedNews && (
                <VStack spacing={4} align="stretch">
                  {/* Imagen */}
                  {(() => {
                    const imagePath = selectedNews.news_image || selectedNews.image
                    const imageUrl = getImageUrl(imagePath)
                    
                    console.log('🖼️ [NewsView] Modal - Imagen:', { imagePath, imageUrl })
                    
                    return imageUrl ? (
                      <Box borderRadius="md" overflow="hidden">
                        <Image
                          src={imageUrl}
                          alt={selectedNews.news_title || selectedNews.title}
                          w="100%"
                          maxH="400px"
                          objectFit="cover"
                          onError={(e) => {
                            console.error('❌ [NewsView] Error cargando imagen en modal:', imageUrl)
                            console.error('📰 [NewsView] Datos completos:', selectedNews)
                          }}
                          onLoad={() => {
                            console.log('✅ [NewsView] Imagen cargada en modal:', imageUrl)
                          }}
                        />
                      </Box>
                    ) : null
                  })()}

                  {/* Información */}
                  <HStack spacing={4} flexWrap="wrap">
                    {selectedNews.subcategory_name && (
                      <Badge colorScheme="blue">
                        {selectedNews.subcategory_name}
                      </Badge>
                    )}
                    {selectedNews.created_at && (
                      <HStack spacing={1}>
                        <Icon as={FiCalendar} color={textColor} boxSize={4} />
                        <Text fontSize="sm" color={textColor}>
                          {formatDate(selectedNews.created_at)}
                        </Text>
                      </HStack>
                    )}
                  </HStack>

                  <Divider />

                  {/* Contenido */}
                  <VStack align="stretch" spacing={3}>
                    <Heading size="md">Contenido</Heading>
                    <Text color={textColor} whiteSpace="pre-wrap" fontSize="md" lineHeight="tall">
                      {selectedNews.news_content || selectedNews.content || selectedNews.news_description || selectedNews.description || 'No hay contenido disponible para esta noticia.'}
                    </Text>
                  </VStack>

                  {/* Botón para leer completo si hay URL externa */}
                  {selectedNews.news_url && (
                    <Button
                      as="a"
                      href={selectedNews.news_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      colorScheme="blue"
                      rightIcon={<Icon as={FiArrowRight} />}
                      w="100%"
                    >
                      Leer noticia completa
                    </Button>
                  )}
                </VStack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </UserLayout>
  )
}

export default NewsView

