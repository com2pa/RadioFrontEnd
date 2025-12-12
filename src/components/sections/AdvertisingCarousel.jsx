import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  IconButton,
  Image,
  Flex,
  useColorModeValue,
  Heading,
  Badge,
  Link,
  Spinner,
  AspectRatio,
} from '@chakra-ui/react'
import { FiChevronLeft, FiChevronRight, FiExternalLink } from 'react-icons/fi'
import axios from 'axios'

/**
 * Componente de carrusel para mostrar publicidades activas
 * Muestra las publicidades de clientes en un carrusel pequeño y atractivo
 */
const AdvertisingCarousel = () => {
  const [advertisements, setAdvertisements] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [imageErrors, setImageErrors] = useState(new Set())
  const autoPlayIntervalRef = useRef(null)

  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const carouselBg = useColorModeValue('gray.50', 'gray.900')
  const placeholderBg = useColorModeValue('gray.100', 'gray.800')
  const buttonBg = useColorModeValue('whiteAlpha.900', 'blackAlpha.700')
  const buttonColor = useColorModeValue('gray.800', 'white')
  const buttonHoverBg = useColorModeValue('white', 'blackAlpha.800')
  const indicatorsBg = useColorModeValue('gray.50', 'gray.900')
  const indicatorDotBg = useColorModeValue('gray.300', 'gray.600')
  const infoBoxBg = useColorModeValue('whiteAlpha.800', 'blackAlpha.600')

  // Obtener publicidades activas
  const fetchActiveAdvertisements = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/advertising/active')
      
      // Manejar diferentes estructuras de respuesta
      let data = []
      if (response.data) {
        if (Array.isArray(response.data)) {
          data = response.data
        } else if (response.data.success && Array.isArray(response.data.data)) {
          data = response.data.data
        } else if (response.data.data && Array.isArray(response.data.data)) {
          data = response.data.data
        }
      }
      
      // Filtrar solo las que tienen imagen
      const adsWithImages = data.filter(ad => ad.advertising_image)
      setAdvertisements(adsWithImages)
    } catch (error) {
      console.error('Error obteniendo publicidades activas:', error)
      setAdvertisements([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Limpiar intervalo
  const clearAutoPlay = useCallback(() => {
    if (autoPlayIntervalRef.current) {
      clearInterval(autoPlayIntervalRef.current)
      autoPlayIntervalRef.current = null
    }
  }, [])

  // Auto-play del carrusel
  const startAutoPlay = useCallback(() => {
    clearAutoPlay()

    if (advertisements.length <= 1) return

    autoPlayIntervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        if (advertisements.length === 0) return 0
        return (prevIndex + 1) % advertisements.length
      })
    }, 5000) // Cambiar cada 5 segundos
  }, [advertisements.length, clearAutoPlay])

  // Limpiar intervalo al desmontar
  useEffect(() => {
    return () => {
      clearAutoPlay()
    }
  }, [clearAutoPlay])

  // Cargar publicidades al montar
  useEffect(() => {
    fetchActiveAdvertisements()
  }, [fetchActiveAdvertisements])

  // Reiniciar auto-play cuando cambian las publicidades
  useEffect(() => {
    if (advertisements.length > 1) {
      startAutoPlay()
    } else {
      clearAutoPlay()
    }
  }, [advertisements.length, startAutoPlay, clearAutoPlay])

  // Navegar al siguiente
  const handleNext = () => {
    if (advertisements.length === 0) return
    setCurrentIndex((prevIndex) => (prevIndex + 1) % advertisements.length)
    // Reiniciar auto-play
    startAutoPlay()
  }

  // Navegar al anterior
  const handlePrevious = () => {
    if (advertisements.length === 0) return
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? advertisements.length - 1 : prevIndex - 1
    )
    // Reiniciar auto-play
    startAutoPlay()
  }

  // Ir a un slide específico
  const goToSlide = (index) => {
    setCurrentIndex(index)
    startAutoPlay()
  }

  // Si no hay publicidades, no mostrar nada
  if (loading) {
    return (
      <Box py={8}>
        <Container maxW="container.xl">
          <Flex justify="center" align="center" py={8}>
            <Spinner size="lg" color="blue.500" />
          </Flex>
        </Container>
      </Box>
    )
  }

  if (advertisements.length === 0) {
    return null // No mostrar nada si no hay publicidades
  }

  const currentAd = advertisements[currentIndex]

  // Construir URL de la imagen
  const getImageUrl = (imageName) => {
    if (!imageName) return null
    // Si la imagen ya es una URL completa, retornarla
    if (imageName.startsWith('http://') || imageName.startsWith('https://')) {
      return imageName
    }
    // Si no, construir la URL desde el backend
    return `/api/advertising/images/${encodeURIComponent(imageName)}`
  }

  const imageUrl = getImageUrl(currentAd?.advertising_image)
  const hasImageError = imageErrors.has(currentAd?.advertising_image)

  // Manejar error de carga de imagen
  const handleImageError = (imageName) => {
    if (imageName) {
      setImageErrors(prev => new Set([...prev, imageName]))
    }
  }

  return (
    <Box 
      py={{ base: 1, md: 2 }} 
      bg={bgColor}
      borderTopWidth="1px"
      borderBottomWidth="1px"
      borderColor={borderColor}
      as="section"
      aria-label="Publicidad"
    >
      <Container maxW="container.xl">
        <VStack spacing={1} align="stretch">
          {/* Título SEO */}
          <Heading 
            as="h2"
            size={{ base: "xs", md: "sm" }} 
            textAlign="center"
            color={textColor}
            fontWeight="semibold"
            mb={0}
          >
            Publicidad
          </Heading>

          {/* Carrusel */}
          <Box 
            position="relative"
            borderRadius="lg"
            overflow="hidden"
            boxShadow="md"
            bg={carouselBg}
          >
            {/* Contenedor del carrusel */}
            <Flex
              position="relative"
              align="center"
              justify="center"
              minH={{ base: "80px", md: "100px", lg: "120px" }}
              maxH={{ base: "80px", md: "100px", lg: "120px" }}
              overflow="hidden"
            >
              {/* Imagen de la publicidad */}
              {imageUrl && !hasImageError ? (
                <Link
                  href={currentAd.email ? `mailto:${currentAd.email}` : '#'}
                  isExternal={!!currentAd.email}
                  _hover={{ textDecoration: 'none' }}
                  display="block"
                  w="100%"
                  h="100%"
                >
                  <AspectRatio ratio={16 / 9} w="100%" h="100%">
                    <Image
                      src={imageUrl}
                      alt={`Publicidad de ${currentAd.company_name || 'empresa'}`}
                      title={currentAd.company_name || 'Publicidad'}
                      objectFit="contain"
                      w="100%"
                      h="100%"
                      loading="lazy"
                      onError={() => handleImageError(currentAd?.advertising_image)}
                      fallback={
                        <Flex
                          align="center"
                          justify="center"
                          w="100%"
                          h="100%"
                          bg={placeholderBg}
                        >
                          <VStack spacing={2}>
                            <Text color={textColor} fontSize="sm">
                              {currentAd.company_name || 'Publicidad'}
                            </Text>
                          </VStack>
                        </Flex>
                      }
                    />
                  </AspectRatio>
                </Link>
              ) : (
                <Flex
                  align="center"
                  justify="center"
                  w="100%"
                  h="100%"
                  bg={placeholderBg}
                >
                  <VStack spacing={2} px={4}>
                    <Text 
                      color={textColor} 
                      fontSize={{ base: "sm", md: "md" }}
                      fontWeight="medium"
                      textAlign="center"
                    >
                      {currentAd.company_name || 'Publicidad'}
                    </Text>
                    {currentAd.rif && (
                      <Text 
                        color={textColor} 
                        fontSize={{ base: "xs", md: "sm" }}
                        opacity={0.7}
                      >
                        RIF: {currentAd.rif}
                      </Text>
                    )}
                    {currentAd.email && (
                      <Link
                        href={`mailto:${currentAd.email}`}
                        isExternal
                        color="blue.500"
                        fontSize={{ base: "xs", md: "sm" }}
                        _hover={{ textDecoration: 'underline' }}
                      >
                        {currentAd.email}
                      </Link>
                    )}
                    {hasImageError && (
                      <Text 
                        color="gray.400" 
                        fontSize="xs"
                        fontStyle="italic"
                      >
                        Imagen no disponible
                      </Text>
                    )}
                  </VStack>
                </Flex>
              )}

              {/* Botón anterior */}
              {advertisements.length > 1 && (
                <IconButton
                  aria-label="Ver publicidad anterior"
                  icon={<FiChevronLeft />}
                  position="absolute"
                  left={1}
                  size={{ base: "xs", md: "sm" }}
                  borderRadius="full"
                  bg={buttonBg}
                  color={buttonColor}
                  _hover={{
                    bg: buttonHoverBg,
                    transform: 'scale(1.1)'
                  }}
                  onClick={handlePrevious}
                  zIndex={2}
                />
              )}

              {/* Botón siguiente */}
              {advertisements.length > 1 && (
                <IconButton
                  aria-label="Ver publicidad siguiente"
                  icon={<FiChevronRight />}
                  position="absolute"
                  right={1}
                  size={{ base: "xs", md: "sm" }}
                  borderRadius="full"
                  bg={buttonBg}
                  color={buttonColor}
                  _hover={{
                    bg: buttonHoverBg,
                    transform: 'scale(1.1)'
                  }}
                  onClick={handleNext}
                  zIndex={2}
                />
              )}
            </Flex>

            {/* Indicadores de slides */}
            {advertisements.length > 1 && (
              <Flex
                justify="center"
                align="center"
                gap={1.5}
                py={1}
                bg={indicatorsBg}
                role="tablist"
                aria-label="Indicadores de publicidad"
              >
                {advertisements.map((_, index) => (
                  <Box
                    key={index}
                    as="button"
                    w={{ base: "6px", md: "8px" }}
                    h={{ base: "6px", md: "8px" }}
                    borderRadius="full"
                    bg={index === currentIndex 
                      ? 'blue.500' 
                      : indicatorDotBg
                    }
                    _hover={{
                      bg: index === currentIndex ? 'blue.600' : 'gray.400',
                      transform: 'scale(1.2)'
                    }}
                    transition="all 0.2s"
                    onClick={() => goToSlide(index)}
                    aria-label={`Ir a publicidad ${index + 1} de ${advertisements.length}`}
                    role="tab"
                    aria-selected={index === currentIndex}
                  />
                ))}
              </Flex>
            )}

            {/* Información adicional (opcional) */}
            {currentAd.company_name && (
              <Box
                px={2}
                py={1}
                bg={infoBoxBg}
                borderTopWidth="1px"
                borderColor={borderColor}
                as="footer"
                aria-label={`Información de ${currentAd.company_name}`}
              >
                <Flex
                  justify="space-between"
                  align="center"
                  flexWrap="wrap"
                  gap={2}
                >
                  <VStack align="start" spacing={0} flex={1} minW="0">
                    <Text
                      as="h3"
                      fontSize={{ base: "2xs", md: "xs" }}
                      fontWeight="medium"
                      color={textColor}
                      noOfLines={1}
                    >
                      {currentAd.company_name}
                    </Text>
                    {currentAd.rif && (
                      <Text
                        fontSize={{ base: "2xs", md: "2xs" }}
                        color={textColor}
                        opacity={0.7}
                        aria-label={`RIF: ${currentAd.rif}`}
                      >
                        RIF: {currentAd.rif}
                      </Text>
                    )}
                  </VStack>
                  {currentAd.email && (
                    <Link
                      href={`mailto:${currentAd.email}`}
                      isExternal
                      fontSize={{ base: "2xs", md: "xs" }}
                      color="blue.500"
                      _hover={{ color: "blue.600", textDecoration: "underline" }}
                      aria-label={`Contactar a ${currentAd.company_name} por email`}
                    >
                      <HStack spacing={0.5}>
                        <Text>Contactar</Text>
                        <FiExternalLink size={10} aria-hidden="true" />
                      </HStack>
                    </Link>
                  )}
                </Flex>
              </Box>
            )}
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}

export default AdvertisingCarousel

