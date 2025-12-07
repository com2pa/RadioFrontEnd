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
        pb={{ base: "100px", sm: "110px", md: "120px" }}
        px={{ base: 3, sm: 4, md: 6, lg: 8 }}
        py={{ base: 4, sm: 6, md: 8, lg: 10 }}
        w="100%"
      >
        <Container 
          maxW={{ base: "100%", sm: "container.sm", md: "container.md", lg: "container.lg", xl: "container.xl", "2xl": "container.2xl" }}
          px={{ base: 2, sm: 4, md: 6 }}
        >
          <VStack spacing={{ base: 4, sm: 5, md: 6, lg: 8 }} align="stretch">
            {/* Breadcrumb */}
            <Breadcrumb 
              separator={<FiChevronRight />} 
              color={textColor}
              fontSize={{ base: "xs", sm: "sm", md: "md" }}
              spacing={{ base: 1, sm: 2 }}
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
              direction={{ base: "column", sm: "column", md: "row" }}
              align={{ base: "start", sm: "start", md: "center" }}
              justify="space-between"
              gap={{ base: 3, sm: 4, md: 4, lg: 6 }}
              w="full"
            >
              <VStack align={{ base: "start", md: "start" }} spacing={{ base: 1.5, sm: 2 }} flex="1" minW="0">
                <Button
                  leftIcon={<FiArrowLeft />}
                  variant="ghost"
                  size={{ base: "xs", sm: "sm", md: "md" }}
                  onClick={handleBackClick}
                  color={textColor}
                  px={{ base: 2, sm: 3 }}
                  fontSize={{ base: "xs", sm: "sm" }}
                  h={{ base: "32px", sm: "36px", md: "40px" }}
                >
                  Volver
                </Button>
                <Heading 
                  size={{ base: "md", sm: "lg", md: "xl", lg: "2xl" }}
                  fontWeight="bold"
                  color={textColor}
                  lineHeight={{ base: "1.2", md: "shorter" }}
                  noOfLines={{ base: 2, sm: 1 }}
                  w="full"
                >
                  {displayCategoryName}
                </Heading>
                <Text 
                  fontSize={{ base: "xs", sm: "sm", md: "md" }}
                  color={textColor}
                  opacity={0.8}
                  w="full"
                >
                  {contentType === 'news' 
                    ? 'Explora las subcategorías de noticias' 
                    : 'Explora las subcategorías de podcasts'}
                </Text>
              </VStack>
              <Badge
                bg={brandRed}
                color={brandWhite}
                px={{ base: 3, sm: 4, md: 5 }}
                py={{ base: 1.5, sm: 2, md: 2.5 }}
                borderRadius="md"
                fontSize={{ base: "xs", sm: "sm", md: "md" }}
                display="flex"
                alignItems="center"
                gap={{ base: 1.5, sm: 2 }}
                flexShrink={0}
                alignSelf={{ base: "start", md: "center" }}
              >
                <Icon as={contentType === 'news' ? FiRss : FiHeadphones} boxSize={{ base: "14px", sm: "16px", md: "18px" }} />
                <Text as="span" display={{ base: "none", sm: "inline" }}>
                  {contentType === 'news' ? 'Noticias' : 'Podcasts'}
                </Text>
              </Badge>
            </Flex>

            <Divider borderColor={brandRed} borderWidth={{ base: "1.5px", md: "2px" }} />

            {/* Contenido */}
            {loading ? (
              <Box display="flex" justifyContent="center" py={{ base: 12, sm: 16, md: 20 }}>
                <VStack spacing={{ base: 3, sm: 4 }}>
                  <Spinner size={{ base: "lg", sm: "xl" }} color={brandRed} />
                  <Text 
                    color={textColor}
                    fontSize={{ base: "sm", sm: "md" }}
                  >
                    Cargando subcategorías...
                  </Text>
                </VStack>
              </Box>
            ) : subcategories.length === 0 ? (
              <Box 
                textAlign="center" 
                py={{ base: 12, sm: 16, md: 20 }}
                bg={cardBg}
                borderRadius={{ base: "lg", md: "xl" }}
                px={{ base: 4, sm: 6, md: 8 }}
                mx={{ base: 2, sm: 0 }}
              >
                <VStack spacing={{ base: 3, sm: 4 }}>
                  <Icon 
                    as={contentType === 'news' ? FiRss : FiHeadphones} 
                    boxSize={{ base: "50px", sm: "60px", md: "70px" }}
                    color={brandRed}
                    opacity={0.5}
                  />
                  <Heading 
                    size={{ base: "sm", sm: "md", md: "lg" }}
                    color={textColor}
                    px={{ base: 2, sm: 0 }}
                  >
                    No hay subcategorías disponibles
                  </Heading>
                  <Text 
                    color={textColor} 
                    opacity={0.7}
                    fontSize={{ base: "xs", sm: "sm", md: "md" }}
                    px={{ base: 2, sm: 0 }}
                  >
                    Esta categoría aún no tiene subcategorías creadas.
                  </Text>
                  <Button
                    leftIcon={<FiArrowLeft />}
                    onClick={handleBackClick}
                    bg={brandRed}
                    color={brandWhite}
                    _hover={{ bg: '#C00000' }}
                    size={{ base: "sm", sm: "md" }}
                    fontSize={{ base: "xs", sm: "sm" }}
                    px={{ base: 4, sm: 6 }}
                    py={{ base: 5, sm: 6 }}
                  >
                    Volver al inicio
                  </Button>
                </VStack>
              </Box>
            ) : (
              <SimpleGrid 
                columns={{ base: 1, sm: 2, md: 2, lg: 3, xl: 4 }} 
                spacing={{ base: 3, sm: 4, md: 5, lg: 6 }}
                w="full"
                px={{ base: 1, sm: 0 }}
              >
                {subcategories.map((subcategory, index) => {
                  const subcategoryId = subcategory.subcategory_id || subcategory.id
                  const subcategoryName = subcategory.subcategory_name || subcategory.name || 'Sin nombre'
                  
                  return (
                    <Card
                      key={subcategoryId}
                      bg={cardBg}
                      borderRadius={{ base: "lg", sm: "xl" }}
                      overflow="hidden"
                      position="relative"
                      boxShadow={{ base: "0 2px 8px rgba(0, 0, 0, 0.08)", md: "0 4px 16px rgba(0, 0, 0, 0.1)" }}
                      sx={{
                        animation: `${scaleIn} 0.5s ease-out ${index * 0.1}s both`,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          transform: { base: 'translateY(-4px)', md: 'translateY(-8px)' },
                          boxShadow: { base: '0 6px 20px rgba(0, 0, 0, 0.15)', md: '0 8px 32px rgba(0, 0, 0, 0.2)' },
                        }
                      }}
                      cursor="pointer"
                      onClick={() => handleSubcategoryClick(subcategoryId, subcategoryName)}
                      w="100%"
                    >
                      <CardBody p={{ base: 3, sm: 4, md: 5, lg: 6 }}>
                        <VStack spacing={{ base: 3, sm: 3.5, md: 4 }} align="stretch">
                          {/* Icono */}
                          <Flex justify="center">
                            <Box
                              bg={brandRed}
                              borderRadius="full"
                              p={{ base: 3, sm: 3.5, md: 4 }}
                              display="flex"
                              alignItems="center"
                              justifyContent="center"
                            >
                              <Icon 
                                as={contentType === 'news' ? FiRss : FiHeadphones}
                                boxSize={{ base: "28px", sm: "32px", md: "36px", lg: "40px" }}
                                color={brandWhite}
                              />
                            </Box>
                          </Flex>

                          {/* Título */}
                          <Heading
                            size={{ base: "xs", sm: "sm", md: "md" }}
                            fontWeight="bold"
                            color={textColor}
                            textAlign="center"
                            noOfLines={2}
                            lineHeight={{ base: "1.3", md: "1.4" }}
                            minH={{ base: "2.6em", sm: "2.8em" }}
                          >
                            {subcategoryName}
                          </Heading>

                          <Divider borderColor={brandRed} borderWidth={{ base: "1.5px", md: "2px" }} />

                          {/* Información adicional */}
                          <VStack spacing={{ base: 1.5, sm: 2 }} align="stretch">
                            {subcategory.news_count !== undefined && (
                              <HStack justify="space-between">
                                <Text 
                                  fontSize={{ base: "xs", sm: "sm" }}
                                  color={textColor} 
                                  opacity={0.7}
                                >
                                  Noticias:
                                </Text>
                                <Text 
                                  fontSize={{ base: "xs", sm: "sm", md: "md" }}
                                  fontWeight="bold" 
                                  color={textColor}
                                >
                                  {subcategory.news_count || 0}
                                </Text>
                              </HStack>
                            )}
                            {subcategory.podcast_count !== undefined && (
                              <HStack justify="space-between">
                                <Text 
                                  fontSize={{ base: "xs", sm: "sm" }}
                                  color={textColor} 
                                  opacity={0.7}
                                >
                                  Podcasts:
                                </Text>
                                <Text 
                                  fontSize={{ base: "xs", sm: "sm", md: "md" }}
                                  fontWeight="bold" 
                                  color={textColor}
                                >
                                  {subcategory.podcast_count || 0}
                                </Text>
                              </HStack>
                            )}
                          </VStack>

                          {/* Botón */}
                          <Button
                            size={{ base: "xs", sm: "sm", md: "md" }}
                            bg={brandRed}
                            color={brandWhite}
                            fontWeight="bold"
                            borderRadius="md"
                            py={{ base: 4, sm: 5, md: 6 }}
                            fontSize={{ base: "xs", sm: "sm", md: "md" }}
                            w="full"
                            _hover={{
                              bg: '#C00000',
                              transform: 'translateY(-2px)',
                            }}
                            _active={{
                              transform: 'translateY(0)',
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

