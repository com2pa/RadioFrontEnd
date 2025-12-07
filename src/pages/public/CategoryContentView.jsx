import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
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
  Spinner,
  useToast,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { 
  FiMic,
  FiRss,
  FiHeadphones,
  FiStar,
  FiRadio,
  FiArrowLeft,
  FiChevronRight,
} from 'react-icons/fi'
import axios from 'axios'
import PublicLayout from '../../components/layout/PublicLayout'
import PublicFooter from '../../components/layout/PublicFooter'
import SEO from '../../components/SEO'

// Animaciones
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

const CategoryContentView = () => {
  const brandRed = '#E50000'
  const brandWhite = '#FFFFFF'
  const brandDarkGray = '#333333'
  const brandLightGray = '#CCCCCC'

  const textColor = useColorModeValue(brandDarkGray, brandLightGray)
  const cardBg = useColorModeValue('white', '#2d2d2d')
  const navigate = useNavigate()
  const toast = useToast()
  const [searchParams] = useSearchParams()
  
  // Obtener parámetros de la URL
  const contentType = searchParams.get('type') || 'news' // 'news' o 'podcasts'
  const categoryId = searchParams.get('category') || ''
  const categoryName = searchParams.get('name') || 'Categoría'

  // Estados
  const [subcategories, setSubcategories] = useState([])
  const [categoryInfo, setCategoryInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  // Obtener subcategorías de noticias
  const fetchNewsSubcategories = useCallback(async () => {
    try {
      const response = await axios.get('/api/subcategory-news/')
      const data = Array.isArray(response.data) ? response.data : (response.data?.data || [])
      
      // Filtrar subcategorías por category_id
      const filtered = data.filter(sub => 
        (sub.category_id || sub.categoryId)?.toString() === categoryId.toString()
      )
      setSubcategories(filtered)
    } catch (error) {
      console.error('Error obteniendo subcategorías de noticias:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las subcategorías',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setSubcategories([])
    }
  }, [categoryId, toast])

  // Obtener subcategorías de podcasts
  const fetchPodcastSubcategories = useCallback(async () => {
    try {
      const response = await axios.get('/api/subcategory-podscats/all')
      const data = Array.isArray(response.data) ? response.data : (response.data?.data || [])
      
      // Filtrar subcategorías por category_id
      const filtered = data.filter(sub => 
        (sub.category_id || sub.categoryId)?.toString() === categoryId.toString()
      )
      setSubcategories(filtered)
    } catch (error) {
      console.error('Error obteniendo subcategorías de podcasts:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las subcategorías',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      setSubcategories([])
    }
  }, [categoryId, toast])

  // Obtener información de la categoría
  const fetchCategoryInfo = useCallback(async () => {
    try {
      const endpoint = contentType === 'news' 
        ? '/api/category-news/all'
        : '/api/category-podscats/all'
      
      const response = await axios.get(endpoint)
      const data = Array.isArray(response.data) ? response.data : (response.data?.data || [])
      
      const category = data.find(cat => 
        (cat.category_id || cat.id)?.toString() === categoryId.toString()
      )
      setCategoryInfo(category)
    } catch (error) {
      console.error('Error obteniendo información de la categoría:', error)
    }
  }, [categoryId, contentType])

  // Cargar datos
  useEffect(() => {
    if (!categoryId) {
      navigate('/')
      return
    }

    const loadData = async () => {
      setLoading(true)
      await fetchCategoryInfo()
      
      if (contentType === 'news') {
        await fetchNewsSubcategories()
      } else {
        await fetchPodcastSubcategories()
      }
      
      setLoading(false)
    }

    loadData()
  }, [categoryId, contentType, fetchNewsSubcategories, fetchPodcastSubcategories, fetchCategoryInfo, navigate])

  const handleSubcategoryClick = (subcategoryId, subcategoryName) => {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
    
    if (token) {
      // Si está autenticado, navegar a las rutas privadas
      if (contentType === 'news') {
        navigate(`/dashboard/user/noticias?subcategory=${subcategoryId}&name=${encodeURIComponent(subcategoryName)}`)
      } else {
        navigate(`/dashboard/user/podcasts?subcategory=${subcategoryId}&name=${encodeURIComponent(subcategoryName)}`)
      }
    } else {
      // Si no está autenticado, redirigir al login con el parámetro de retorno
      const returnUrl = contentType === 'news' 
        ? `/dashboard/user/noticias?subcategory=${subcategoryId}&name=${encodeURIComponent(subcategoryName)}`
        : `/dashboard/user/podcasts?subcategory=${subcategoryId}&name=${encodeURIComponent(subcategoryName)}`
      navigate(`/login?redirect=${encodeURIComponent(returnUrl)}`)
    }
  }

  const handleBackClick = () => {
    navigate('/')
  }

  const displayCategoryName = categoryInfo?.category_name || categoryName

  return (
    <PublicLayout>
      <SEO
        title={`${displayCategoryName} - Oxígeno 88.1 FM`}
        description={`Explora ${displayCategoryName} en Oxígeno 88.1 FM`}
        keywords={`${displayCategoryName}, Oxígeno Radio, ${contentType === 'news' ? 'noticias' : 'podcasts'}`}
      />
      <Box 
        bg={useColorModeValue(brandLightGray + '40', brandDarkGray)}
        minH="100vh"
        pb="120px"
        px={{ base: 4, sm: 6, md: 8 }}
        py={{ base: 6, sm: 8, md: 10 }}
      >
        <Container maxW="container.xl">
          <VStack spacing={6} align="stretch">
            {/* Breadcrumb */}
            <Breadcrumb 
              separator={<FiChevronRight />} 
              color={textColor}
              fontSize={{ base: "sm", md: "md" }}
            >
              <BreadcrumbItem>
                <BreadcrumbLink onClick={handleBackClick} cursor="pointer">
                  Inicio
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink>
                  {contentType === 'news' ? 'Noticias' : 'Podcasts'}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem isCurrentPage>
                <Text>{displayCategoryName}</Text>
              </BreadcrumbItem>
            </Breadcrumb>

            {/* Header */}
            <Flex 
              direction={{ base: "column", md: "row" }}
              align={{ base: "start", md: "center" }}
              justify="space-between"
              gap={4}
            >
              <VStack align={{ base: "start", md: "start" }} spacing={2}>
                <Button
                  leftIcon={<FiArrowLeft />}
                  variant="ghost"
                  size="sm"
                  onClick={handleBackClick}
                  color={textColor}
                >
                  Volver
                </Button>
                <Heading 
                  size={{ base: "lg", md: "xl" }}
                  fontWeight="bold"
                  color={textColor}
                >
                  {displayCategoryName}
                </Heading>
                <Text 
                  fontSize={{ base: "sm", md: "md" }}
                  color={textColor}
                  opacity={0.8}
                >
                  {contentType === 'news' 
                    ? 'Explora las subcategorías de noticias' 
                    : 'Explora las subcategorías de podcasts'}
                </Text>
              </VStack>
              <Badge
                bg={brandRed}
                color={brandWhite}
                px={4}
                py={2}
                borderRadius="md"
                fontSize={{ base: "sm", md: "md" }}
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Icon as={contentType === 'news' ? FiRss : FiHeadphones} />
                {contentType === 'news' ? 'Noticias' : 'Podcasts'}
              </Badge>
            </Flex>

            <Divider borderColor={brandRed} />

            {/* Contenido */}
            {loading ? (
              <Box display="flex" justifyContent="center" py={20}>
                <VStack spacing={4}>
                  <Spinner size="xl" color={brandRed} />
                  <Text color={textColor}>Cargando subcategorías...</Text>
                </VStack>
              </Box>
            ) : subcategories.length === 0 ? (
              <Box 
                textAlign="center" 
                py={20}
                bg={cardBg}
                borderRadius="xl"
                px={6}
              >
                <VStack spacing={4}>
                  <Icon 
                    as={contentType === 'news' ? FiRss : FiHeadphones} 
                    boxSize="60px"
                    color={brandRed}
                    opacity={0.5}
                  />
                  <Heading size="md" color={textColor}>
                    No hay subcategorías disponibles
                  </Heading>
                  <Text color={textColor} opacity={0.7}>
                    Esta categoría aún no tiene subcategorías creadas.
                  </Text>
                  <Button
                    leftIcon={<FiArrowLeft />}
                    onClick={handleBackClick}
                    bg={brandRed}
                    color={brandWhite}
                    _hover={{ bg: '#C00000' }}
                  >
                    Volver al inicio
                  </Button>
                </VStack>
              </Box>
            ) : (
              <SimpleGrid 
                columns={{ base: 1, sm: 2, md: 3, lg: 4 }} 
                spacing={{ base: 4, md: 6 }}
              >
                {subcategories.map((subcategory, index) => {
                  const subcategoryId = subcategory.subcategory_id || subcategory.id
                  const subcategoryName = subcategory.subcategory_name || subcategory.name || 'Sin nombre'
                  
                  return (
                    <Card
                      key={subcategoryId}
                      bg={cardBg}
                      borderRadius="xl"
                      overflow="hidden"
                      position="relative"
                      boxShadow="0 4px 16px rgba(0, 0, 0, 0.1)"
                      sx={{
                        animation: `${scaleIn} 0.5s ease-out ${index * 0.1}s both`,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                        }
                      }}
                      cursor="pointer"
                      onClick={() => handleSubcategoryClick(subcategoryId, subcategoryName)}
                    >
                      <CardBody p={{ base: 4, md: 6 }}>
                        <VStack spacing={4} align="stretch">
                          {/* Icono */}
                          <Flex justify="center">
                            <Box
                              bg={brandRed}
                              borderRadius="full"
                              p={4}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Icon 
                                as={contentType === 'news' ? FiRss : FiHeadphones}
                                boxSize={{ base: "32px", md: "40px" }}
                                color={brandWhite}
                              />
                            </Box>
                          </Flex>

                          {/* Título */}
                          <Heading
                            size={{ base: "sm", md: "md" }}
                            fontWeight="bold"
                            color={textColor}
                            textAlign="center"
                            noOfLines={2}
                          >
                            {subcategoryName}
                          </Heading>

                          <Divider borderColor={brandRed} />

                          {/* Información adicional */}
                          <VStack spacing={2} align="stretch">
                            {subcategory.news_count !== undefined && (
                              <HStack justify="space-between">
                                <Text fontSize="sm" color={textColor} opacity={0.7}>
                                  Noticias:
                                </Text>
                                <Text fontSize="sm" fontWeight="bold" color={textColor}>
                                  {subcategory.news_count || 0}
                                </Text>
                              </HStack>
                            )}
                            {subcategory.podcast_count !== undefined && (
                              <HStack justify="space-between">
                                <Text fontSize="sm" color={textColor} opacity={0.7}>
                                  Podcasts:
                                </Text>
                                <Text fontSize="sm" fontWeight="bold" color={textColor}>
                                  {subcategory.podcast_count || 0}
                                </Text>
                              </HStack>
                            )}
                          </VStack>

                          {/* Botón */}
                          <Button
                            size="sm"
                            bg={brandRed}
                            color={brandWhite}
                            fontWeight="bold"
                            borderRadius="md"
                            _hover={{
                              bg: '#C00000',
                              transform: 'translateY(-2px)',
                            }}
                            transition="all 0.3s ease"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSubcategoryClick(subcategoryId, subcategoryName)
                            }}
                          >
                            {contentType === 'news' ? 'Ver Noticias' : 'Escuchar Podcasts'}
                          </Button>
                        </VStack>
                      </CardBody>
                    </Card>
                  )
                })}
              </SimpleGrid>
            )}
          </VStack>
        </Container>
      </Box>
      <PublicFooter />
    </PublicLayout>
  )
}

export default CategoryContentView

