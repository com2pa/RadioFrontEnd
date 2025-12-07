import React, { useMemo, useState, useEffect, useCallback } from 'react'
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  Heading,
  Icon,
  useColorModeValue,
  SimpleGrid,
  Badge,
  Flex,
  Image,
  Divider,
  Select,
  Spinner,
  useToast,
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { 
  FiMic,
  FiRss,
  FiHeadphones,
  FiStar,
  FiRadio,
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

// Animaciones optimizadas y sutiles
const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`

const scaleIn = keyframes`
  0% { 
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  100% { 
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`

const CategoriesSection = () => {
  const brandRed = '#E50000'
  const brandWhite = '#FFFFFF'
  const brandDarkGray = '#333333'
  const brandLightGray = '#CCCCCC'
  const brandOrange = '#FFA500'

  const textColor = useColorModeValue(brandDarkGray, brandLightGray)
  const cardBg = useColorModeValue('white', '#2d2d2d')
  const selectBg = useColorModeValue('white', '#2d2d2d')
  const navigate = useNavigate()
  const toast = useToast()

  // Estados
  const [contentType, setContentType] = useState('news') // 'news' o 'podcasts'
  const [selectedCategoryId, setSelectedCategoryId] = useState('')
  const [newsCategories, setNewsCategories] = useState([])
  const [podcastCategories, setPodcastCategories] = useState([])
  const [loading, setLoading] = useState(false)

  // Obtener categorías de noticias
  const fetchNewsCategories = useCallback(async () => {
    try {
      const response = await axios.get('/api/category-news/all')
      const data = Array.isArray(response.data) ? response.data : (response.data?.data || [])
      setNewsCategories(data)
    } catch (error) {
      console.error('Error obteniendo categorías de noticias:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las categorías de noticias',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setNewsCategories([])
    }
  }, [toast])

  // Obtener categorías de podcasts
  const fetchPodcastCategories = useCallback(async () => {
    try {
      const response = await axios.get('/api/category-podscats/all')
      const data = Array.isArray(response.data) ? response.data : (response.data?.data || [])
      setPodcastCategories(data)
    } catch (error) {
      console.error('Error obteniendo categorías de podcasts:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las categorías de podcasts',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setPodcastCategories([])
    }
  }, [toast])

  // Cargar categorías al montar y cuando cambia el tipo de contenido
  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true)
      setSelectedCategoryId('') // Reset categoría al cambiar tipo
      try {
        if (contentType === 'news') {
          await fetchNewsCategories()
        } else {
          await fetchPodcastCategories()
        }
      } finally {
        setLoading(false)
      }
    }
    loadCategories()
  }, [contentType, fetchNewsCategories, fetchPodcastCategories])

  // Obtener categorías actuales según el tipo
  const currentCategories = contentType === 'news' ? newsCategories : podcastCategories

  // Generar cards dinámicamente desde las categorías obtenidas
  const categories = useMemo(() => {
    if (!selectedCategoryId || currentCategories.length === 0) {
      return []
    }

    // Filtrar solo la categoría seleccionada
    const selectedCategory = currentCategories.find(
      cat => (cat.category_id || cat.id)?.toString() === selectedCategoryId.toString()
    )

    if (!selectedCategory) {
      return []
    }

    // Crear card para la categoría seleccionada
    return [{
      id: selectedCategory.category_id || selectedCategory.id,
      title: selectedCategory.category_name?.toUpperCase() || 'CATEGORÍA',
      titleShort: selectedCategory.category_name || 'Categoría',
      icon: contentType === 'news' ? FiRss : FiHeadphones,
      badge: contentType === 'news' ? 'ACTUALIZADO' : 'DISPONIBLE',
      badgeIcon: contentType === 'news' ? FiMic : FiHeadphones,
      rating: "4.8",
      stats: contentType === 'news' 
        ? [
            { label: "Artículos", value: selectedCategory.article_count || "0+" },
            { label: "Noticias", value: selectedCategory.news_count || "0+" }
          ]
        : [
            { label: "Episodios", value: selectedCategory.episode_count || "0+" },
            { label: "Podcasts", value: selectedCategory.podcast_count || "0+" }
          ],
      buttonText: contentType === 'news' ? "Ver Noticias" : "Escuchar Podcasts",
      route: `/category?type=${contentType}&category=${selectedCategoryId}&name=${encodeURIComponent(selectedCategory.category_name || 'Categoría')}`,
      image: selectedCategory.image || "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80",
      categoryData: selectedCategory
    }]
  }, [selectedCategoryId, currentCategories, contentType])

  const handleCategoryClick = (route) => {
    navigate(route)
  }

  const handleContentTypeChange = (e) => {
    setContentType(e.target.value)
  }

  const handleCategoryChange = (e) => {
    setSelectedCategoryId(e.target.value)
  }

  return (
    <Box 
      py={{ base: 12, sm: 16, md: 20, lg: 24 }} 
      bg="transparent"
      position="relative"
      overflow="hidden"
    >
      {/* Marcas de agua de radio - Fondo decorativo en espacios vacíos */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={0}
        pointerEvents="none"
        opacity={0.08}
      >
        {/* Onda de radio - Área vacía superior izquierda (fuera de las cards) */}
        <Box
          position="absolute"
          top={{ base: "3%", md: "2%" }}
          left={{ base: "3%", md: "2%" }}
          transform="rotate(-15deg)"
        >
            <Icon 
              as={FiRss} 
              boxSize={{ base: "50px", sm: "60px", md: "70px", lg: "80px" }}
              color="#B19CD9"
              opacity={0.4}
            />
        </Box>

        {/* Micrófono - Área vacía superior derecha (fuera de las cards) */}
        <Box
          position="absolute"
          top={{ base: "3%", md: "2%" }}
          right={{ base: "3%", md: "2%" }}
          transform="rotate(15deg)"
        >
            <Icon 
              as={FiMic} 
              boxSize={{ base: "50px", sm: "60px", md: "70px", lg: "80px" }}
              color="#B19CD9"
              opacity={0.4}
            />
        </Box>

        {/* Onda de radio - Área vacía inferior derecha (fuera de las cards) */}
        <Box
          position="absolute"
          bottom={{ base: "3%", md: "2%" }}
          right={{ base: "3%", md: "2%" }}
          transform="rotate(-15deg)"
        >
            <Icon 
              as={FiRss} 
              boxSize={{ base: "50px", sm: "60px", md: "70px", lg: "80px" }}
              color="#B19CD9"
              opacity={0.4}
            />
        </Box>

        {/* Marcas de agua verticales - Panel lateral izquierdo */}
        <VStack
          position="absolute"
          left={{ base: "2%", md: "1%" }}
          top="50%"
          transform="translateY(-50%)"
          spacing={{ base: 10, sm: 12, md: 14 }}
          align="center"
          zIndex={1}
        >
          {/* Onda de sonido morada - Parte superior */}
          <Box
            w={{ base: "50px", sm: "60px", md: "70px" }}
            h={{ base: "30px", sm: "35px", md: "40px" }}
            position="relative"
            opacity={0.6}
          >
            <svg width="100%" height="100%" viewBox="0 0 100 50" preserveAspectRatio="none">
              <path
                d="M 0 25 Q 12.5 10, 25 25 T 50 25 T 75 25 T 100 25"
                stroke="#B19CD9"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 0 25 Q 12.5 40, 25 25 T 50 25 T 75 25 T 100 25"
                stroke="#B19CD9"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </Box>

          {/* Torre de transmisión morada - Parte inferior */}
          <VStack spacing={2} align="center" opacity={0.6}>
            <Icon 
              as={FiRadio} 
              boxSize={{ base: "40px", sm: "50px", md: "60px" }}
              color="#B19CD9"
            />
            <Box
              position="relative"
              w={{ base: "30px", sm: "40px", md: "50px" }}
              h={{ base: "20px", sm: "25px", md: "30px" }}
            >
              {/* Ondas de radio */}
              <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                w="100%"
                h="100%"
              >
                <svg width="100%" height="100%" viewBox="0 0 30 20" preserveAspectRatio="xMidYMid meet">
                  <path
                    d="M 15 10 Q 15 5, 20 10 Q 15 15, 15 10"
                    stroke="#B19CD9"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M 15 10 Q 15 2, 25 10 Q 15 18, 15 10"
                    stroke="#B19CD9"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M 15 10 Q 15 0, 30 10 Q 15 20, 15 10"
                    stroke="#B19CD9"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </Box>
            </Box>
          </VStack>
        </VStack>

        {/* Marcas de agua verticales - Panel lateral derecho */}
        <VStack
          position="absolute"
          right={{ base: "2%", md: "1%" }}
          top="50%"
          transform="translateY(-50%)"
          spacing={{ base: 10, sm: 12, md: 14 }}
          align="center"
          zIndex={1}
        >
          {/* Onda de sonido verde claro - Parte superior */}
          <Box
            w={{ base: "50px", sm: "60px", md: "70px" }}
            h={{ base: "30px", sm: "35px", md: "40px" }}
            position="relative"
            opacity={0.6}
          >
            <svg width="100%" height="100%" viewBox="0 0 100 50" preserveAspectRatio="none">
              <path
                d="M 0 25 Q 12.5 10, 25 25 T 50 25 T 75 25 T 100 25"
                stroke="#40E0D0"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 0 25 Q 12.5 40, 25 25 T 50 25 T 75 25 T 100 25"
                stroke="#40E0D0"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </Box>

          {/* Torre de transmisión morada - Parte inferior */}
          <VStack spacing={2} align="center" opacity={0.6}>
            <Icon 
              as={FiRadio} 
              boxSize={{ base: "40px", sm: "50px", md: "60px" }}
              color="#B19CD9"
            />
            <Box
              position="relative"
              w={{ base: "30px", sm: "40px", md: "50px" }}
              h={{ base: "20px", sm: "25px", md: "30px" }}
            >
              {/* Ondas de radio */}
              <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                w="100%"
                h="100%"
              >
                <svg width="100%" height="100%" viewBox="0 0 30 20" preserveAspectRatio="xMidYMid meet">
                  <path
                    d="M 15 10 Q 15 5, 20 10 Q 15 15, 15 10"
                    stroke="#B19CD9"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M 15 10 Q 15 2, 25 10 Q 15 18, 15 10"
                    stroke="#B19CD9"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M 15 10 Q 15 0, 30 10 Q 15 20, 15 10"
                    stroke="#B19CD9"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </Box>
            </Box>
          </VStack>
        </VStack>
      </Box>

      <Container maxW="container.xl" position="relative" zIndex={2} px={{ base: 4, sm: 6, md: 8 }}>
        <VStack spacing={{ base: 8, sm: 10, md: 12 }} align="stretch">
          {/* Header */}
          <VStack spacing={{ base: 3, sm: 4 }} textAlign="center" maxW="800px" mx="auto">
            <Flex 
              align="center" 
              justify="center" 
              position="relative"
              w="full"
              gap={{ base: 4, sm: 6, md: 8 }}
            >
              {/* Onda de sonido izquierda */}
              <Box
                position="relative"
                display={{ base: "none", sm: "flex" }}
                alignItems="flex-end"
                h={{ base: "40px", sm: "50px", md: "60px" }}
                gap="3px"
              >
                {[30, 60, 45, 80, 35, 70, 50, 65].map((height, i) => (
                  <Box
                    key={i}
                    w="4px"
                    h={`${height}%`}
                    bgGradient="linear(to-b, #B19CD9, #40E0D0)"
                    borderRadius="full"
                    opacity={0.7}
                  />
                ))}
              </Box>
              
              <Heading 
                size={{ base: "lg", sm: "xl", md: "2xl" }}
                fontWeight="bold"
                color={textColor}
                lineHeight="shorter"
              >
                Explora Nuestro Contenido
              </Heading>
              
              {/* Onda de sonido derecha */}
              <Box
                position="relative"
                display={{ base: "none", sm: "flex" }}
                alignItems="flex-end"
                h={{ base: "40px", sm: "50px", md: "60px" }}
                gap="3px"
              >
                {[30, 60, 45, 80, 35, 70, 50, 65].map((height, i) => (
                  <Box
                    key={i}
                    w="4px"
                    h={`${height}%`}
                    bgGradient="linear(to-b, #B19CD9, #40E0D0)"
                    borderRadius="full"
                    opacity={0.7}
                  />
                ))}
              </Box>
            </Flex>
          </VStack>

          {/* Selectores de Tipo y Categoría */}
          <VStack spacing={4} maxW="800px" mx="auto" w="full">
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
              {/* Selector de Tipo de Contenido */}
              <Box>
                <Text 
                  fontSize={{ base: "sm", md: "md" }} 
                  fontWeight="semibold" 
                  color={textColor}
                  mb={2}
                >
                  Tipo de Contenido
                </Text>
                <Select
                  value={contentType}
                  onChange={handleContentTypeChange}
                  bg={selectBg}
                  color={textColor}
                  borderColor={brandRed}
                  _hover={{ borderColor: brandRed }}
                  _focus={{ borderColor: brandRed, boxShadow: `0 0 0 1px ${brandRed}` }}
                  size={{ base: "md", md: "lg" }}
                >
                  <option value="news">📰 Noticias</option>
                  <option value="podcasts">🎧 Podcasts</option>
                </Select>
              </Box>

              {/* Selector de Categoría */}
              <Box>
                <Text 
                  fontSize={{ base: "sm", md: "md" }} 
                  fontWeight="semibold" 
                  color={textColor}
                  mb={2}
                >
                  Selecciona una Categoría
                </Text>
                {loading ? (
                  <Flex align="center" justify="center" h="40px">
                    <Spinner size="sm" color={brandRed} />
                  </Flex>
                ) : currentCategories.length === 0 ? (
                  <Select
                    bg={selectBg}
                    color={textColor}
                    borderColor={brandRed}
                    size={{ base: "md", md: "lg" }}
                    isDisabled
                  >
                    <option>No hay categorías disponibles</option>
                  </Select>
                ) : (
                  <Select
                    value={selectedCategoryId}
                    onChange={handleCategoryChange}
                    bg={selectBg}
                    color={textColor}
                    borderColor={brandRed}
                    _hover={{ borderColor: brandRed }}
                    _focus={{ borderColor: brandRed, boxShadow: `0 0 0 1px ${brandRed}` }}
                    size={{ base: "md", md: "lg" }}
                    placeholder="Selecciona una categoría"
                  >
                    {currentCategories.map((category) => (
                      <option 
                        key={category.category_id || category.id} 
                        value={category.category_id || category.id}
                      >
                        {category.category_name || category.name || 'Sin nombre'}
                      </option>
                    ))}
                  </Select>
                )}
              </Box>
            </SimpleGrid>
          </VStack>

          {/* Grid de categorías - Diseño elegante con imágenes */}
          {!selectedCategoryId ? (
            <Box 
              textAlign="center" 
              py={12}
              maxW="600px"
              mx="auto"
            >
              <VStack spacing={4}>
                <Icon 
                  as={contentType === 'news' ? FiRss : FiHeadphones} 
                  boxSize={{ base: "60px", md: "80px" }}
                  color={brandRed}
                  opacity={0.5}
                />
                <Text 
                  fontSize={{ base: "md", md: "lg" }}
                  color={textColor}
                  fontWeight="medium"
                >
                  Selecciona una categoría para ver su contenido
                </Text>
              </VStack>
            </Box>
          ) : categories.length === 0 ? (
            <Box 
              textAlign="center" 
              py={12}
              maxW="600px"
              mx="auto"
            >
              <VStack spacing={4}>
                <Spinner size="xl" color={brandRed} />
                <Text 
                  fontSize={{ base: "md", md: "lg" }}
                  color={textColor}
                  fontWeight="medium"
                >
                  Cargando categoría...
                </Text>
              </VStack>
            </Box>
          ) : (
            <SimpleGrid 
              columns={{ base: 1, md: 2 }} 
              spacing={{ base: 6, sm: 8, md: 8 }}
              maxW="1200px"
              mx="auto"
              w="full"
            >
              {categories.map((category, index) => (
              <Card
                key={category.id}
                bg={cardBg}
                borderRadius={{ base: "xl", md: "2xl" }}
                overflow="hidden"
                position="relative"
                boxShadow="0 8px 32px rgba(0, 0, 0, 0.12)"
                sx={{
                  animation: `${scaleIn} 0.5s ease-out ${index * 0.1}s both`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.2)',
                  }
                }}
                cursor="pointer"
              >
                {/* Sección superior con imagen de fondo */}
                <Box
                  position="relative"
                  h={{ base: "120px", sm: "140px", md: "160px" }}
                  overflow="hidden"
                  bg={brandDarkGray}
                >
                  {/* Imagen de fondo */}
                  <Image
                    src={category.image}
                    alt={category.title}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    opacity={0.8}
                    filter="brightness(0.7)"
                  />
                  
                  {/* Overlay oscuro para legibilidad */}
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="rgba(0,0,0,0.5)"
                  />

                    {/* Título superpuesto en la imagen */}
                    <Box
                      position="absolute"
                      top={{ base: 2, sm: 3, md: 4 }}
                      left={{ base: 2, sm: 3, md: 4 }}
                      zIndex={2}
                    >
                      <Heading
                        fontSize={{ base: "sm", sm: "md", md: "lg" }}
                        fontWeight="black"
                        color={brandWhite}
                        lineHeight="shorter"
                        textShadow="0 2px 10px rgba(0,0,0,0.5)"
                      >
                        {category.title.split(' ').slice(0, 2).join(' ')}
                        <br />
                        {category.title.split(' ').slice(2).join(' ')}
                      </Heading>
                    </Box>

                  {/* Badge de estado en esquina inferior izquierda */}
                  <Box
                    position="absolute"
                    bottom={{ base: 2, sm: 3, md: 4 }}
                    left={{ base: 3, sm: 4, md: 5 }}
                    zIndex={2}
                  >
                    <Badge
                      bg={brandWhite}
                      color={brandDarkGray}
                      px={{ base: 2, sm: 2.5 }}
                      py={{ base: 0.5, sm: 1 }}
                      borderRadius="md"
                      fontSize={{ base: "2xs", sm: "xs" }}
                      fontWeight="bold"
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <Icon as={category.badgeIcon} boxSize={{ base: 2.5, sm: 3 }} />
                      {category.badge}
                    </Badge>
                  </Box>

                  {/* Rating en esquina inferior derecha */}
                  <Box
                    position="absolute"
                    bottom={{ base: 2, sm: 3, md: 4 }}
                    right={{ base: 3, sm: 4, md: 5 }}
                    zIndex={2}
                  >
                    <HStack spacing={1}>
                      <Text
                        fontSize={{ base: "xs", sm: "sm" }}
                        fontWeight="bold"
                        color={brandWhite}
                        textShadow="0 2px 8px rgba(0,0,0,0.5)"
                      >
                        {category.rating}
                      </Text>
                      <Icon as={FiStar} boxSize={{ base: 3, sm: 4 }} color="#FFD700" />
                    </HStack>
                  </Box>
                </Box>

                {/* Sección inferior con contenido */}
                <CardBody p={{ base: 3, sm: 4, md: 5 }} bg={cardBg}>
                  <VStack spacing={2} align="stretch">
                    {/* Título y rating */}
                    <Flex justify="space-between" align="center">
                      <Heading
                        size={{ base: "sm", sm: "md" }}
                        fontWeight="bold"
                        color={textColor}
                      >
                        {category.titleShort}
                      </Heading>
                      <HStack spacing={1}>
                        <Text
                          fontSize={{ base: "xs", sm: "sm" }}
                          fontWeight="bold"
                          color={textColor}
                        >
                          {category.rating}
                        </Text>
                        <Icon as={FiStar} boxSize={{ base: 3, sm: 4 }} color="#FFD700" />
                      </HStack>
                    </Flex>

                    {/* Divisor */}
                    <Divider
                      borderColor={brandRed}
                      h="2px"
                      borderRadius="full"
                    />

                    {/* Estadísticas */}
                    <SimpleGrid columns={2} spacing={2} py={1}>
                      {category.stats.map((stat, statIndex) => (
                        <VStack key={statIndex} spacing={0} align="center">
                          <Text
                            fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
                            fontWeight="black"
                            color={textColor}
                            lineHeight="shorter"
                          >
                            {stat.value}
                          </Text>
                          <Text
                            fontSize={{ base: "2xs", sm: "2xs" }}
                            color={textColor}
                            fontWeight="medium"
                          >
                            {stat.label}
                          </Text>
                        </VStack>
                      ))}
                    </SimpleGrid>

                    {/* Botón de acción */}
                    <Button
                      size={{ base: "sm", sm: "sm" }}
                      bg={brandRed}
                      color={brandWhite}
                      fontWeight="bold"
                      borderRadius="md"
                      py={{ base: 4, sm: 4 }}
                      fontSize={{ base: "xs", sm: "sm" }}
                      _hover={{
                        bg: '#C00000',
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 24px ${brandRed}50`,
                      }}
                      transition="all 0.3s ease"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCategoryClick(category.route)
                      }}
                    >
                      {category.buttonText}
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
              ))}
            </SimpleGrid>
          )}
        </VStack>
      </Container>

    </Box>
  )
}

export default CategoriesSection
