import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  useColorModeValue,
  Grid,
  GridItem,
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
  Stack,
  Textarea,
  FormControl,
  FormLabel,
  Avatar,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import { 
  FiHeadphones,
  FiSearch,
  FiPlay,
  FiFilter,
  FiGrid,
  FiList,
  FiCalendar,
  FiMessageSquare,
  FiSend,
  FiUser,
  FiHeart
} from 'react-icons/fi'
import UserLayout from '../../components/layout/UserLayout'
import axios from 'axios'

const PodcastsView = () => {
  console.log('🎧 [PodcastsView] Componente renderizado')
  
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const bgHover = useColorModeValue('gray.50', 'gray.700')
  const commentCardBg = useColorModeValue('gray.50', 'gray.700')
  const textareaBg = useColorModeValue('white', 'gray.800')
  const borderDashedColor = useColorModeValue('gray.300', 'gray.600')
  const toast = useToast()

  // Estados
  const [podcasts, setPodcasts] = useState([])
  const [filteredPodcasts, setFilteredPodcasts] = useState([])
  const [categories, setCategories] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingSubcategories, setLoadingSubcategories] = useState(false)
  const [selectedPodcast, setSelectedPodcast] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSubcategory, setSelectedSubcategory] = useState('')
  const [viewMode, setViewMode] = useState('grid') // 'grid' o 'list'
  
  // Abrir modal de podcast
  const handlePodcastClick = (podcast) => {
    setSelectedPodcast(podcast)
    onOpen()
  }

  // Obtener todos los podcasts
  const fetchPodcasts = useCallback(async () => {
    setLoading(true)
    try {
      // Intentar con /api/podcasts primero, si falla usar /api/podcasts/all
      let response
      try {
        response = await axios.get('/api/podcasts')
      } catch {
        response = await axios.get('/api/podcasts/all')
      }
      
      const data = response.data.success && Array.isArray(response.data.data)
        ? response.data.data
        : response.data?.data && Array.isArray(response.data.data)
        ? response.data.data
        : Array.isArray(response.data)
        ? response.data
        : []
      
      setPodcasts(data)
      setFilteredPodcasts(data)
    } catch (error) {
      console.error('Error obteniendo podcasts:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los podcasts',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setPodcasts([])
      setFilteredPodcasts([])
    } finally {
      setLoading(false)
    }
  }, [toast])

  // Obtener categorías
  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get('/api/category-podscats/all')
      const data = Array.isArray(response.data) ? response.data : []
      setCategories(data)
    } catch (error) {
      console.error('Error obteniendo categorías:', error)
    }
  }, [])

  // Obtener subcategorías
  const fetchSubcategories = useCallback(async () => {
    if (!selectedCategory) {
      setSubcategories([])
      return
    }

    setLoadingSubcategories(true)
    try {
      const response = await axios.get('/api/subcategory-podscats/all')
      const data = Array.isArray(response.data) ? response.data : []
      
      // Filtrar subcategorías por categoría seleccionada
      const filtered = data.filter(sub => 
        sub.category_id?.toString() === selectedCategory.toString()
      )
      setSubcategories(filtered)
    } catch (error) {
      console.error('Error obteniendo subcategorías:', error)
      setSubcategories([])
    } finally {
      setLoadingSubcategories(false)
    }
  }, [selectedCategory])

  // Obtener podcasts por subcategoría
  const fetchPodcastsBySubcategory = useCallback(async (subcategoryId) => {
    setLoading(true)
    try {
      console.log(`🔍 [PodcastsView] Obteniendo podcasts para subcategoría: ${subcategoryId}`)
      
      // Intentar diferentes variantes del endpoint
      let response
      let data = []
      
      // Primera opción: /api/podcasts/subcategory/:subcategoryId
      try {
        response = await axios.get(`/api/podcasts/subcategory/${subcategoryId}`)
        data = response.data.success && Array.isArray(response.data.data)
          ? response.data.data
          : response.data?.data && Array.isArray(response.data.data)
          ? response.data.data
          : Array.isArray(response.data)
          ? response.data
          : []
        
        if (data.length > 0) {
          console.log(`✅ [PodcastsView] Podcasts obtenidos del endpoint /api/podcasts/subcategory/: ${data.length}`)
          setFilteredPodcasts(data)
          return
        }
      } catch {
        console.log(`⚠️ [PodcastsView] Endpoint /api/podcasts/subcategory/ no disponible, intentando alternativa...`)
      }
      
      // Segunda opción: /api/subcategory/:subcategoryId
      try {
        response = await axios.get(`/api/subcategory/${subcategoryId}`)
        data = response.data.success && Array.isArray(response.data.data)
          ? response.data.data
          : response.data?.data && Array.isArray(response.data.data)
          ? response.data.data
          : Array.isArray(response.data)
          ? response.data
          : []
        
        if (data.length > 0) {
          console.log(`✅ [PodcastsView] Podcasts obtenidos del endpoint /api/subcategory/: ${data.length}`)
          setFilteredPodcasts(data)
          return
        }
      } catch {
        console.log(`⚠️ [PodcastsView] Endpoint /api/subcategory/ no disponible, usando filtro local...`)
      }
      
      // Fallback: filtrar manualmente desde todos los podcasts
      const filtered = podcasts.filter(podcast =>
        podcast.podcast_subcategory_id?.toString() === subcategoryId.toString()
      )
      
      console.log(`🔧 [PodcastsView] Filtrado local: ${filtered.length} podcasts encontrados`)
      setFilteredPodcasts(filtered)
      
      if (filtered.length === 0) {
        toast({
          title: 'Información',
          description: 'No hay podcasts en esta subcategoría',
          status: 'info',
          duration: 3000,
          isClosable: true,
        })
      }
    } catch (error) {
      console.error('❌ [PodcastsView] Error obteniendo podcasts por subcategoría:', error)
      // Si todos los endpoints fallan, filtrar manualmente
      const filtered = podcasts.filter(podcast =>
        podcast.podcast_subcategory_id?.toString() === subcategoryId.toString()
      )
      setFilteredPodcasts(filtered)
      
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los podcasts. Mostrando resultados filtrados localmente.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }, [toast, podcasts])

  // Cargar datos iniciales
  useEffect(() => {
    fetchPodcasts()
    fetchCategories()
  }, [fetchPodcasts, fetchCategories])

  // Cargar subcategorías cuando cambia la categoría
  useEffect(() => {
    if (selectedCategory) {
      fetchSubcategories()
      setSelectedSubcategory('') // Reset subcategoría al cambiar categoría
    } else {
      setSubcategories([])
      setSelectedSubcategory('')
    }
  }, [selectedCategory, fetchSubcategories])

  // Filtrar podcasts por subcategoría cuando se selecciona
  useEffect(() => {
    if (selectedSubcategory) {
      fetchPodcastsBySubcategory(selectedSubcategory)
    } else if (selectedCategory || searchTerm) {
      // Si no hay subcategoría seleccionada, filtrar manualmente
      applyFilters()
    } else {
      // Si no hay filtros, mostrar todos
      setFilteredPodcasts(podcasts)
    }
  }, [selectedSubcategory])

  // Aplicar filtros (búsqueda y categoría)
  const applyFilters = useCallback(() => {
    let filtered = [...podcasts]

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(podcast =>
        podcast.podcast_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        podcast.podcast_description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrar por categoría (si hay subcategorías cargadas)
    if (selectedCategory && subcategories.length > 0) {
      const subcategoryIds = subcategories.map(sub => sub.subcategory_id)
      filtered = filtered.filter(podcast =>
        subcategoryIds.includes(podcast.podcast_subcategory_id)
      )
    }

    setFilteredPodcasts(filtered)
  }, [podcasts, searchTerm, selectedCategory, subcategories])

  // Efecto para aplicar filtros cuando cambian los términos de búsqueda o categoría
  useEffect(() => {
    if (!selectedSubcategory) {
      applyFilters()
    }
  }, [searchTerm, selectedCategory, applyFilters, selectedSubcategory])

  // Limpiar filtros
  const clearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
    setSelectedSubcategory('')
    setFilteredPodcasts(podcasts)
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

  return (
    <UserLayout 
      title="Podcasts"
      subtitle="Descubre nuestros mejores podcasts"
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
                  placeholder="Buscar podcasts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  bg={useColorModeValue('white', 'gray.700')}
                />
              </InputGroup>

              {/* Filtros */}
              <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                <Select
                  placeholder="Todas las categorías"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  bg={useColorModeValue('white', 'gray.700')}
                >
                  {categories.map((category) => (
                    <option key={category.category_id} value={category.category_id}>
                      {category.category_name}
                    </option>
                  ))}
                </Select>

                <Select
                  placeholder="Todas las subcategorías"
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  isDisabled={!selectedCategory || loadingSubcategories}
                  bg={useColorModeValue('white', 'gray.700')}
                >
                  {loadingSubcategories ? (
                    <option>Cargando...</option>
                  ) : (
                    subcategories.map((subcategory) => (
                      <option key={subcategory.subcategory_id} value={subcategory.subcategory_id}>
                        {subcategory.subcategory_name}
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
                  {filteredPodcasts.length} podcast{filteredPodcasts.length !== 1 ? 's' : ''} encontrado{filteredPodcasts.length !== 1 ? 's' : ''}
                </Text>
              </HStack>
            </VStack>
          </CardBody>
        </Card>

        {/* Lista de Podcasts */}
        {loading ? (
          <Flex justify="center" align="center" py={20}>
            <VStack spacing={4}>
              <Spinner size="xl" color="blue.500" thickness="4px" />
              <Text color={textColor}>Cargando podcasts...</Text>
            </VStack>
          </Flex>
        ) : filteredPodcasts.length === 0 ? (
          <Card bg={cardBg} boxShadow="md">
            <CardBody>
              <VStack spacing={4} py={10}>
                <Icon as={FiHeadphones} boxSize={16} color="gray.400" />
                <Heading size="md" color={textColor}>
                  No se encontraron podcasts
                </Heading>
                <Text color={textColor} textAlign="center">
                  {searchTerm || selectedCategory || selectedSubcategory
                    ? 'Intenta ajustar tus filtros de búsqueda'
                    : 'Aún no hay podcasts disponibles'}
                </Text>
                {(searchTerm || selectedCategory || selectedSubcategory) && (
                  <Button onClick={clearFilters} colorScheme="blue" variant="outline">
                    Limpiar filtros
                  </Button>
                )}
              </VStack>
            </CardBody>
          </Card>
        ) : viewMode === 'grid' ? (
          <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
            {filteredPodcasts.map((podcast) => (
              <Card
                key={podcast.podcast_id}
                bg={cardBg}
                boxShadow="md"
                _hover={{
                  transform: 'translateY(-4px)',
                  boxShadow: 'xl',
                  transition: 'all 0.3s'
                }}
                transition="all 0.3s"
                cursor="pointer"
                onClick={() => handlePodcastClick(podcast)}
              >
                <CardBody p={0}>
                  {/* Imagen o reproductor */}
                  <Box position="relative" bg="gray.100" minH="200px">
                    {podcast.podcast_iframe ? (
                      <Box
                        dangerouslySetInnerHTML={{ __html: podcast.podcast_iframe }}
                        sx={{
                          '& iframe': {
                            width: '100%',
                            height: '200px',
                            border: 'none'
                          }
                        }}
                      />
                    ) : (
                      <Flex
                        align="center"
                        justify="center"
                        minH="200px"
                        bgGradient="linear(to-br, blue.400, purple.500)"
                      >
                        <Icon as={FiHeadphones} boxSize={16} color="white" opacity={0.8} />
                      </Flex>
                    )}
                    <Box
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                      bg="blackAlpha.700"
                      borderRadius="full"
                      p={3}
                      opacity={0.9}
                      _hover={{ opacity: 1 }}
                    >
                      <Icon as={FiPlay} boxSize={6} color="white" />
                    </Box>
                  </Box>

                  {/* Información del podcast */}
                  <VStack align="stretch" spacing={3} p={4}>
                    <VStack align="stretch" spacing={1}>
                      <Heading size="sm" noOfLines={2}>
                        {podcast.podcast_title}
                      </Heading>
                      <Text fontSize="sm" color={textColor} noOfLines={3}>
                        {podcast.podcast_description}
                      </Text>
                    </VStack>

                    <HStack justify="space-between" align="center">
                      {podcast.subcategory_name && (
                        <Badge colorScheme="blue" alignSelf="flex-start">
                          {podcast.subcategory_name}
                        </Badge>
                      )}
                      {/* Botón de Like y contador */}
                      <HStack spacing={2}>
                        <IconButton
                          aria-label="Me gusta"
                          icon={<Icon as={FiHeart} />}
                          variant="ghost"
                          colorScheme="red"
                          size="sm"
                          _hover={{
                            transform: 'scale(1.2)'
                          }}
                          onClick={(e) => {
                            e.stopPropagation()
                            // TODO: Lógica para dar like
                          }}
                          // TODO: Agregar estado para saber si el usuario ya dio like
                          // colorScheme={userLiked ? 'red' : 'gray'}
                        />
                        <Text fontSize="xs" color={textColor} fontWeight="medium">
                          {/* TODO: Mostrar contador de likes */}
                          0
                        </Text>
                      </HStack>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        ) : (
          <VStack spacing={4} align="stretch">
            {filteredPodcasts.map((podcast) => (
              <Card
                key={podcast.podcast_id}
                bg={cardBg}
                boxShadow="md"
                _hover={{
                  bg: bgHover,
                  transition: 'all 0.2s'
                }}
                transition="all 0.2s"
              >
                <CardBody>
                  <HStack spacing={6} align="start">
                    {/* Mini reproductor o imagen */}
                    <Box minW="150px" maxW="150px">
                      {podcast.podcast_iframe ? (
                        <Box
                          dangerouslySetInnerHTML={{ __html: podcast.podcast_iframe }}
                          sx={{
                            '& iframe': {
                              width: '100%',
                              height: '150px',
                              border: 'none',
                              borderRadius: 'md'
                            }
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
                          <Icon as={FiHeadphones} boxSize={10} color="white" />
                        </Flex>
                      )}
                    </Box>

                    {/* Información */}
                    <VStack align="stretch" spacing={2} flex={1}>
                      <HStack justify="space-between" align="start">
                        <VStack align="stretch" spacing={1} flex={1}>
                          <Heading size="md">
                            {podcast.podcast_title}
                          </Heading>
                          <Text fontSize="sm" color={textColor} noOfLines={2}>
                            {podcast.podcast_description}
                          </Text>
                        </VStack>
                        <HStack spacing={2}>
                          {/* Icono de Like */}
                          <IconButton
                            aria-label="Me gusta"
                            icon={<Icon as={FiHeart} />}
                            variant="ghost"
                            colorScheme="red"
                            size="sm"
                            _hover={{
                              transform: 'scale(1.2)'
                            }}
                            onClick={(e) => {
                              e.stopPropagation()
                              // TODO: Lógica para dar like
                            }}
                            // TODO: Agregar estado para saber si el usuario ya dio like
                            // colorScheme={userLiked ? 'red' : 'gray'}
                          />
                          <HStack spacing={1}>
                            <Text fontSize="xs" color={textColor} fontWeight="medium">
                              {/* TODO: Mostrar contador de likes */}
                              0
                            </Text>
                          </HStack>
                          <Button
                            leftIcon={<Icon as={FiPlay} />}
                            colorScheme="blue"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handlePodcastClick(podcast)
                            }}
                          >
                            Escuchar
                          </Button>
                        </HStack>
                      </HStack>

                      <HStack spacing={4} justify="space-between">
                        <HStack spacing={4}>
                          {podcast.subcategory_name && (
                            <Badge colorScheme="blue">
                              {podcast.subcategory_name}
                            </Badge>
                          )}
                          {podcast.category_name && (
                            <Badge colorScheme="purple" variant="outline">
                              {podcast.category_name}
                            </Badge>
                          )}
                          {podcast.created_at && (
                            <HStack spacing={1}>
                              <Icon as={FiCalendar} color={textColor} boxSize={3} />
                              <Text fontSize="xs" color={textColor}>
                                {formatDate(podcast.created_at)}
                              </Text>
                            </HStack>
                          )}
                        </HStack>
                      </HStack>
                    </VStack>
                  </HStack>
                </CardBody>
              </Card>
            ))}
          </VStack>
        )}

        {/* Modal para reproducir podcast */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {selectedPodcast?.podcast_title || 'Podcast'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              {selectedPodcast && (
                <VStack spacing={4} align="stretch">
                  {/* Reproductor */}
                  {selectedPodcast.podcast_iframe ? (
                    <Box
                      dangerouslySetInnerHTML={{ __html: selectedPodcast.podcast_iframe }}
                      sx={{
                        '& iframe': {
                          width: '100%',
                          minHeight: '400px',
                          border: 'none',
                          borderRadius: 'md'
                        }
                      }}
                    />
                  ) : selectedPodcast.podcast_url ? (
                    <AspectRatio ratio={16 / 9}>
                      <iframe
                        src={selectedPodcast.podcast_url}
                        allowFullScreen
                        style={{ borderRadius: '8px' }}
                      />
                    </AspectRatio>
                  ) : (
                    <Box
                      bgGradient="linear(to-br, blue.400, purple.500)"
                      borderRadius="md"
                      p={10}
                      textAlign="center"
                    >
                      <Icon as={FiHeadphones} boxSize={16} color="white" mb={4} />
                      <Text color="white" fontSize="lg">
                        No hay reproductor disponible para este podcast
                      </Text>
                    </Box>
                  )}

                  {/* Descripción */}
                  {selectedPodcast.podcast_description && (
                    <>
                      <Divider />
                      <VStack align="stretch" spacing={2}>
                        <Heading size="sm">Descripción</Heading>
                        <Text color={textColor} whiteSpace="pre-wrap">
                          {selectedPodcast.podcast_description}
                        </Text>
                      </VStack>
                    </>
                  )}

                  {/* Información adicional */}
                  <HStack spacing={4} flexWrap="wrap" justify="space-between">
                    <HStack spacing={4} flexWrap="wrap">
                      {selectedPodcast.subcategory_name && (
                        <Badge colorScheme="blue">
                          {selectedPodcast.subcategory_name}
                        </Badge>
                      )}
                      {selectedPodcast.category_name && (
                        <Badge colorScheme="purple" variant="outline">
                          {selectedPodcast.category_name}
                        </Badge>
                      )}
                      {selectedPodcast.created_at && (
                        <HStack spacing={1}>
                          <Icon as={FiCalendar} color={textColor} boxSize={4} />
                          <Text fontSize="sm" color={textColor}>
                            {formatDate(selectedPodcast.created_at)}
                          </Text>
                        </HStack>
                      )}
                    </HStack>
                    {/* Botón de Like y contador en el modal */}
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Me gusta"
                        icon={<Icon as={FiHeart} />}
                        variant="ghost"
                        colorScheme="red"
                        size="md"
                        _hover={{
                          transform: 'scale(1.2)'
                        }}
                        onClick={() => {
                          // TODO: Lógica para dar like
                        }}
                        // TODO: Agregar estado para saber si el usuario ya dio like
                        // colorScheme={userLiked ? 'red' : 'gray'}
                      />
                      <Text fontSize="sm" fontWeight="medium" color={textColor}>
                        {/* TODO: Mostrar contador de likes */}
                        0
                      </Text>
                    </HStack>
                  </HStack>

                  {/* URL externa si existe */}
                  {selectedPodcast.podcast_url && !selectedPodcast.podcast_iframe && (
                    <Button
                      as="a"
                      href={selectedPodcast.podcast_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      colorScheme="blue"
                      leftIcon={<Icon as={FiPlay} />}
                      w="100%"
                    >
                      Abrir en nueva pestaña
                    </Button>
                  )}

                  {/* Sección de Comentarios */}
                  <Divider />
                  <VStack align="stretch" spacing={4}>
                    <HStack justify="space-between" align="center">
                      <HStack spacing={2}>
                        <Icon as={FiMessageSquare} color="blue.500" boxSize={5} />
                        <Heading size="md">Comentarios</Heading>
                        <Badge colorScheme="blue" variant="subtle">
                          {/* TODO: Aquí irá el contador de comentarios */}
                          0
                        </Badge>
                      </HStack>
                    </HStack>

                    {/* Formulario para agregar comentario */}
                    <Card bg={commentCardBg} boxShadow="sm">
                      <CardBody>
                        <VStack spacing={3} align="stretch">
                          <FormControl>
                            <FormLabel fontSize="sm" fontWeight="medium">
                              Escribe tu comentario
                            </FormLabel>
                            <Textarea
                              placeholder="Comparte tu opinión sobre este podcast..."
                              rows={3}
                              bg={textareaBg}
                              resize="none"
                              // TODO: Agregar estado para el texto del comentario
                              // value={commentText}
                              // onChange={(e) => setCommentText(e.target.value)}
                            />
                          </FormControl>
                          <HStack justify="flex-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                // TODO: Lógica para cancelar/limpiar el formulario
                              }}
                            >
                              Cancelar
                            </Button>
                            <Button
                              size="sm"
                              colorScheme="blue"
                              leftIcon={<Icon as={FiSend} />}
                              onClick={() => {
                                // TODO: Lógica para enviar comentario
                              }}
                            >
                              Comentar
                            </Button>
                          </HStack>
                        </VStack>
                      </CardBody>
                    </Card>

                    {/* Lista de comentarios */}
                    <VStack spacing={3} align="stretch" maxH="400px" overflowY="auto">
                      {/* TODO: Reemplazar con comentarios reales del backend */}
                      {/* {comments.length > 0 ? (
                        comments.map((comment) => (
                          <Card key={comment.id} bg={cardBg} boxShadow="sm">
                            <CardBody>
                              <VStack align="stretch" spacing={3}>
                                <HStack spacing={3}>
                                  <Avatar
                                    size="sm"
                                    name={comment.user_name || 'Usuario'}
                                    bg="blue.500"
                                    color="white"
                                  />
                                  <VStack align="start" spacing={0} flex={1}>
                                    <HStack spacing={2}>
                                      <Text fontWeight="medium" fontSize="sm">
                                        {comment.user_name || 'Usuario Anónimo'}
                                      </Text>
                                      {comment.created_at && (
                                        <Text fontSize="xs" color={textColor}>
                                          {formatDate(comment.created_at)}
                                        </Text>
                                      )}
                                    </HStack>
                                  </VStack>
                                </HStack>
                                <Text fontSize="sm" color={textColor} whiteSpace="pre-wrap">
                                  {comment.content}
                                </Text>
                                <HStack spacing={4}>
                                  <Button
                                    size="xs"
                                    variant="ghost"
                                    leftIcon={<Icon as={FiMessageSquare} />}
                                    onClick={() => {
                                      // TODO: Lógica para responder
                                    }}
                                  >
                                    Responder
                                  </Button>
                                </HStack>
                              </VStack>
                            </CardBody>
                          </Card>
                        ))
                      ) : ( */}
                      <Box
                        textAlign="center"
                        py={8}
                        borderWidth="1px"
                        borderStyle="dashed"
                        borderRadius="md"
                        borderColor={borderDashedColor}
                      >
                        <Icon as={FiMessageSquare} boxSize={8} color="gray.400" mb={2} />
                        <Text color={textColor} fontSize="sm">
                          No hay comentarios aún. ¡Sé el primero en comentar!
                        </Text>
                      </Box>
                      {/* )} */}
                    </VStack>
                  </VStack>
                </VStack>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </UserLayout>
  )
}

export default PodcastsView

