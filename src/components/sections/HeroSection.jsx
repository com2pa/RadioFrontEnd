import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Card,
  CardBody,
  Heading,
  Icon,
  Avatar,
  IconButton,
  Progress,
  Image,
  Flex,
  useToast,
  Tooltip,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { keyframes } from '@emotion/react'
import { 
  FiPlay, 
  FiPause, 
  FiVolume2, 
  FiHeart, 
  FiShare2, 
  FiUsers,
  FiRadio,
  FiDownload,
  FiStar,
  FiTrendingUp,
  FiZap,
  FiEye
} from 'react-icons/fi'

// Animaciones EXTREMAS para máximo impacto
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

const float = keyframes`
  0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
  25% { transform: translateY(-20px) translateX(10px) rotate(5deg); }
  50% { transform: translateY(-40px) translateX(-10px) rotate(-5deg); }
  75% { transform: translateY(-20px) translateX(5px) rotate(3deg); }
`

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.9; }
`

const glow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 30px rgba(229, 0, 0, 0.6),
                0 0 60px rgba(229, 0, 0, 0.4),
                0 0 90px rgba(255, 165, 0, 0.3);
  }
  50% { 
    box-shadow: 0 0 50px rgba(229, 0, 0, 0.9),
                0 0 100px rgba(229, 0, 0, 0.6),
                0 0 150px rgba(255, 165, 0, 0.5);
  }
`

const blob = keyframes`
  0% { 
    transform: translate(0px, 0px) scale(1);
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  }
  25% { 
    transform: translate(20px, -20px) scale(1.1);
    border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
  }
  50% { 
    transform: translate(-20px, 20px) scale(0.9);
    border-radius: 50% 50% 50% 50% / 50% 50% 50% 50%;
  }
  75% { 
    transform: translate(10px, 10px) scale(1.05);
    border-radius: 40% 60% 60% 40% / 60% 40% 60% 40%;
  }
  100% { 
    transform: translate(0px, 0px) scale(1);
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  }
`

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`

const shimmer = keyframes`
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`

const HeroSection = () => {
  // Colores oficiales de OXÍGENO 88.1FM
  const brandRed = '#E50000'
  const brandWhite = '#FFFFFF'
  const brandOrange = '#FFA500'

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong] = useState({
    title: "Música en Vivo",
    artist: "OXÍ Radio 88.1 FM",
    duration: "00:00"
  })
  const [listeners] = useState(1247)
  
  // Estados para el carousel
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const carouselRef = useRef(null)
  const intervalRef = useRef(null)
  
  // Slides del carousel - solo programas con imágenes
  const [carouselSlides, setCarouselSlides] = useState([])
  
  // Navegación
  const navigate = useNavigate()
  
  // Función para obtener todos los programas con imágenes
  const fetchProgramsWithImages = useCallback(async () => {
    try {
      // Obtener todos los programas
      const response = await axios.get('/api/programs/all')
      
      if (response.data.success && response.data.data && response.data.data.length > 0) {
        // Filtrar solo programas con imagen y ordenar por fecha
        const programsWithImages = response.data.data
          .filter(p => p.program_image) // Solo programas con imagen
          .sort((a, b) => {
            return new Date(a.scheduled_date) - new Date(b.scheduled_date)
          })
          .map((program, index) => ({
            id: program.program_id || index + 1,
            programId: program.program_id, // Guardar el ID real del programa
            title: program.program_title || '',
            subtitle: program.program_description || '',
            bgImage: `http://localhost:3000/uploads/programs/${program.program_image}`,
            color: brandRed
          }))
        
        // Solo establecer slides si hay programas con imágenes
        if (programsWithImages.length > 0) {
          setCarouselSlides(programsWithImages)
        }
      }
    } catch (error) {
      // console.error('Error fetching programs:', error)
    }
  }, [])
  
  // Cargar los programas con imágenes inmediatamente al montar el componente
  useEffect(() => {
    fetchProgramsWithImages()
  }, [fetchProgramsWithImages])
  
  const toast = useToast()

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    toast({
      title: isPlaying ? 'Pausando transmisión' : 'Iniciando transmisión',
      description: isPlaying ? 'La radio se ha pausado' : '¡Disfruta de OXÍ Radio!',
      status: 'success',
      duration: 2000,
      isClosable: true,
    })
  }

  const nextSlide = useCallback(() => {
    const slidesWithImages = carouselSlides.filter(slide => slide.bgImage)
    if (slidesWithImages.length === 0) return
    setCurrentSlide((prev) => {
      const next = (prev + 1) % slidesWithImages.length
      return next
    })
  }, [carouselSlides])

  const prevSlide = useCallback(() => {
    const slidesWithImages = carouselSlides.filter(slide => slide.bgImage)
    if (slidesWithImages.length === 0) return
    setCurrentSlide((prev) => {
      const next = (prev - 1 + slidesWithImages.length) % slidesWithImages.length
      return next
    })
  }, [carouselSlides])

  const goToSlide = useCallback((index) => {
    const slidesWithImages = carouselSlides.filter(slide => slide.bgImage)
    if (index >= 0 && index < slidesWithImages.length) {
      setCurrentSlide(index)
    }
  }, [carouselSlides])

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  useEffect(() => {
    const slidesWithImages = carouselSlides.filter(slide => slide.bgImage)
    if (slidesWithImages.length === 0) return
    
    // Resetear currentSlide si es mayor que el número de slides disponibles
    if (currentSlide >= slidesWithImages.length) {
      setCurrentSlide(0)
    }
    
    if (isAutoPlaying && slidesWithImages.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => {
          const next = (prev + 1) % slidesWithImages.length
          return next
        })
      }, 6000) // Aumentado a 6 segundos para dar tiempo a ver el contenido
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [isAutoPlaying, carouselSlides, currentSlide])

  return (
    <Box
      position="relative"
      h={{ base: "calc(100vh - 150px)", sm: "calc(100vh - 170px)", md: "calc(100vh - 180px)" }}
      minH={{ base: "350px", sm: "450px", md: "500px" }}
      maxH={{ base: "calc(100vh - 150px)", sm: "calc(100vh - 170px)", md: "calc(100vh - 180px)" }}
      overflow="hidden"
      display="flex"
      alignItems="center"
      justifyContent="center"
      pb={{ base: "150px", sm: "170px", md: "180px" }}
    >
      {/* Fondo transparente - sin colores */}

      {/* Carousel con slides - Solo programas con imágenes */}
      {carouselSlides.filter(slide => slide.bgImage).length > 0 && (
        <Box
          ref={carouselRef}
          position="absolute"
          top={0}
          left={0}
          w="full"
          h="full"
          display="flex"
          sx={{
            transform: `translateX(-${currentSlide * 100}%)`,
            transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            perspective: '1000px'
          }}
          zIndex={3}
        >
          {carouselSlides.filter(slide => slide.bgImage).map((slide) => (
          <Box
            key={slide.id}
            position="relative"
            w="100%"
            h="100%"
            minW="100%"
            flexShrink={0}
            bg="transparent"
            display="flex"
            alignItems="center"
            justifyContent="center"
            overflow="hidden"
            _before={{
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bg: slide.bgImage 
                ? undefined
                : `linear-gradient(135deg, ${slide.color}90, ${slide.color === brandRed ? '#C00000' : brandRed}90)`,
              zIndex: 1
            }}
          >
            {/* Imagen de fondo - Responsive */}
            {slide.bgImage && (
              <Image
                src={slide.bgImage}
                alt={slide.title || "Programa"}
                position="absolute"
                top={0}
                left={0}
                w="100%"
                h="100%"
                objectFit={{ base: "contain", md: "cover", lg: "cover" }}
                objectPosition="center"
                zIndex={0}
              />
            )}
            {/* Overlay con efecto glassmorphism - solo si no hay imagen */}
            {!slide.bgImage && (
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="rgba(255, 255, 255, 0.05)"
                backdropFilter="blur(20px)"
                zIndex={2}
              />
            )}

            {/* Overlay responsive para mejorar legibilidad cuando hay imagen */}
            {slide.bgImage && (
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bgGradient={{
                  base: "linear(to-b, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.8) 100%)",
                  sm: "linear(to-b, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.7) 100%)",
                  md: "linear(to-b, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.6) 100%)",
                  lg: "linear(to-b, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.5) 100%)",
                  xl: "linear(to-b, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.4) 100%)"
                }}
                zIndex={2}
              />
            )}

            {/* Botones de acción en cada slide - Posicionados en la parte inferior derecha */}
            <HStack
              position="absolute"
              bottom={{ base: 4, sm: 6, md: 8 }}
              right={{ base: 4, sm: 6, md: 8 }}
              spacing={{ base: 2, sm: 3 }}
              zIndex={5}
            >
              <Tooltip
                label="Reproducir"
                placement="top"
                hasArrow
                bg={brandRed}
                color={brandWhite}
                fontSize="sm"
                fontWeight="bold"
                px={3}
                py={2}
                borderRadius="md"
              >
                <IconButton
                  aria-label="Reproducir"
                  icon={<Icon as={FiPlay} />}
                  size={{ base: "sm", sm: "md" }}
                  borderRadius="full"
                  bg="rgba(0, 0, 0, 0.5)"
                  backdropFilter="blur(10px)"
                  color={brandWhite}
                  border="2px solid"
                  borderColor="rgba(255, 255, 255, 0.3)"
                  _hover={{
                    bg: brandRed,
                    color: brandWhite,
                    borderColor: brandRed,
                    transform: "scale(1.1)",
                    boxShadow: `0 0 20px ${brandRed}80, 0 0 40px ${brandRed}60`
                  }}
                  transition="all 0.3s ease"
                />
              </Tooltip>
              <Tooltip
                label="Ver transmisión"
                placement="top"
                hasArrow
                bg={brandOrange}
                color={brandWhite}
                fontSize="sm"
                fontWeight="bold"
                px={3}
                py={2}
                borderRadius="md"
              >
                <IconButton
                  aria-label="Ver transmisión"
                  icon={<Icon as={FiEye} />}
                  size={{ base: "sm", sm: "md" }}
                  borderRadius="full"
                  bg="rgba(0, 0, 0, 0.5)"
                  backdropFilter="blur(10px)"
                  color={brandWhite}
                  border="2px solid"
                  borderColor="rgba(255, 255, 255, 0.3)"
                  onClick={() => {
                    const programId = slide.programId || slide.id
                    navigate(`/program/${programId}`)
                  }}
                  _hover={{
                    bg: brandOrange,
                    color: brandWhite,
                    borderColor: brandOrange,
                    transform: "scale(1.1)",
                    boxShadow: `0 0 20px ${brandOrange}80, 0 0 40px ${brandOrange}60`
                  }}
                  transition="all 0.3s ease"
                />
              </Tooltip>
            </HStack>

            {/* Contenido solo si no hay imagen del programa */}
            {!slide.bgImage && (
              <Container 
                maxW="container.xl" 
                position="relative" 
                zIndex={4} 
                px={{ base: 2, sm: 3, md: 4, lg: 6, xl: 8 }}
                py={{ base: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
                h="full"
                display="flex"
                alignItems="center"
              >
                <VStack 
                  spacing={{ base: 1.5, sm: 2, md: 3, lg: 4, xl: 5 }} 
                  textAlign="center"
                  w="full"
                  justify="center"
                >
                {/* Badge con efecto GLOW extremo */}
                <Badge 
                  bgGradient={`linear(135deg, ${brandRed}, #C00000)`}
                  color={brandWhite}
                  fontSize={{ base: "2xs", sm: "xs", md: "sm", lg: "md" }}
                  px={{ base: 2, sm: 2.5, md: 3, lg: 4, xl: 5 }}
                  py={{ base: 0.5, sm: 1, md: 1.5, lg: 2 }}
                  borderRadius="full"
                  fontWeight="black"
                  textTransform="uppercase"
                  letterSpacing={{ base: "tight", sm: "wide" }}
                  sx={{
                    animation: `${glow} 2s ease-in-out infinite, ${pulse} 3s ease-in-out infinite`,
                    willChange: 'transform, box-shadow'
                  }}
                  boxShadow={`0 0 30px ${brandRed}, 0 0 60px #C0000040`}
                  border={{ base: "1px solid", md: "2px solid" }}
                  borderColor="rgba(255, 255, 255, 0.3)"
                  backdropFilter="blur(10px)"
                >
                  🔴 EN VIVO AHORA
                </Badge>

                {/* Título con efecto SHIMMER */}
                <Heading 
                  size={{ base: "md", sm: "lg", md: "xl", lg: "2xl" }}
                  fontWeight="black"
                  lineHeight="shorter"
                  position="relative"
                  overflow="hidden"
                  display="inline-block"
                  w="auto"
                  px={{ base: 2, sm: 0 }}
                  _before={{
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)`,
                    animation: `${shimmer} 3s infinite`,
                    pointerEvents: 'none',
                    zIndex: 1
                  }}
                >
                  <Text
                    as="span"
                    position="relative"
                    zIndex={2}
                    bgGradient={`linear(to-r, ${brandWhite}, #FF6B6B, ${brandWhite})`}
                    bgClip="text"
                    backgroundSize="200% auto"
                    sx={{
                      animation: `${gradientShift} 3s ease infinite`,
                      willChange: 'background-position'
                    }}
                    textShadow={`0 0 15px ${brandRed}40, 0 0 30px #FF6B6B30`}
                    display="inline-block"
                  >
                    {slide.title}
                  </Text>
                </Heading>

                <Text 
                  fontSize={{ base: "sm", sm: "md", md: "lg", lg: "xl", xl: "2xl" }} 
                  fontWeight="bold"
                  color={brandWhite}
                  maxW={{ base: "95%", sm: "90%", md: "85%", lg: "80%", xl: "70%" }}
                  px={{ base: 2, sm: 0 }}
                  textShadow="0 2px 15px rgba(0,0,0,0.5)"
                  sx={{
                    animation: `${slideIn} 1s ease-out`,
                    willChange: 'transform, opacity'
                  }}
                >
                  {slide.subtitle}
                </Text>
                
                {/* Estadísticas con glassmorphism */}
                <HStack 
                  spacing={{ base: 1.5, sm: 2, md: 3, lg: 4, xl: 5 }} 
                  mt={{ base: 0.5, sm: 1 }}
                  flexWrap="wrap"
                  justify="center"
                  w="full"
                  maxW={{ base: "100%", sm: "95%", md: "90%", lg: "700px" }}
                  px={{ base: 1, sm: 0 }}
                >
                  {[
                    { icon: FiUsers, value: listeners.toLocaleString(), label: "Oyentes", color: brandOrange },
                    { icon: FiStar, value: "4.9", label: "Rating", color: brandOrange },
                    { icon: FiTrendingUp, value: "#1", label: "En la ciudad", color: brandOrange }
                  ].map((stat, idx) => (
                    <Box
                      key={idx}
                      bg="rgba(255, 255, 255, 0.1)"
                      backdropFilter="blur(20px)"
                      borderRadius={{ base: "md", sm: "lg", md: "xl" }}
                      p={{ base: 1, sm: 1.5, md: 2, lg: 3 }}
                      border={{ base: "1px solid", md: "2px solid" }}
                      borderColor="rgba(255, 255, 255, 0.2)"
                      boxShadow="0 6px 24px rgba(0, 0, 0, 0.3)"
                      sx={{
                        transition: 'all 0.3s ease',
                        willChange: 'transform',
                        animation: `${slideIn} ${0.5 + idx * 0.2}s ease-out`,
                        '&:hover': {
                          transform: 'translateY(-8px) scale(1.05)',
                          bg: 'rgba(255, 255, 255, 0.15)',
                          boxShadow: `0 15px 45px ${stat.color}60`
                        }
                      }}
                      flex={{ base: "0 0 calc(50% - 6px)", sm: "0 0 auto" }}
                      minW={{ base: "calc(50% - 6px)", sm: "auto" }}
                    >
                      <VStack spacing={{ base: 0.5, sm: 0.75, md: 1 }}>
                        <Icon as={stat.icon} boxSize={{ base: 3.5, sm: 4, md: 5, lg: 6 }} color={stat.color} />
                        <Text fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg", xl: "xl" }} fontWeight="black" color={brandWhite}>
                          {stat.value}
                        </Text>
                        <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color={brandWhite} opacity={0.9}>
                          {stat.label}
                        </Text>
                      </VStack>
                    </Box>
                  ))}
                </HStack>

                {/* Card del reproductor con GLASSMORPHISM EXTREMO */}
                <Card
                  bg="rgba(255, 255, 255, 0.15)"
                  backdropFilter="blur(30px)"
                  border={{ base: "1px solid", md: "2px solid" }}
                  borderColor="rgba(255, 255, 255, 0.3)"
                  borderRadius={{ base: "lg", sm: "xl", md: "2xl" }}
                  boxShadow="0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
                  maxW={{ base: "100%", sm: "95%", md: "90%", lg: "650px" }}
                  w="full"
                  mx={{ base: 1, sm: 0 }}
                  sx={{
                    transition: 'all 0.3s ease',
                    willChange: 'transform',
                    animation: `${slideIn} 0.8s ease-out`,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: `0 30px 60px rgba(0, 0, 0, 0.5), 0 0 80px ${brandRed}40`
                    }
                  }}
                >
                  <CardBody p={{ base: 3, sm: 4, md: 5, lg: 6 }}>
                    <VStack spacing={{ base: 2.5, sm: 3, md: 4 }}>
                      <HStack spacing={{ base: 2, sm: 3, md: 4 }} w="full" flexDir={{ base: "column", sm: "row" }} align={{ base: "center", sm: "start" }}>
                        <Avatar
                          size={{ base: "md", sm: "lg", md: "xl" }}
                          bgGradient={`linear(135deg, ${brandRed}, ${brandOrange})`}
                          icon={<Icon as={FiRadio} boxSize={{ base: 5, sm: 6, md: 8 }} />}
                          animation={isPlaying ? `${pulse} 1s ease-in-out infinite` : 'none'}
                          boxShadow={`0 0 40px ${brandRed}80, 0 0 80px ${brandOrange}60`}
                          border={{ base: "2px solid", md: "3px solid" }}
                          borderColor="rgba(255, 255, 255, 0.3)"
                        />
                        <VStack align={{ base: "center", sm: "start" }} spacing={{ base: 0.5, sm: 1 }} flex={1} textAlign={{ base: "center", sm: "left" }} w={{ base: "full", sm: "auto" }}>
                          <Text fontWeight="black" fontSize={{ base: "md", sm: "lg", md: "xl" }} color={brandWhite} textShadow="0 2px 10px rgba(0,0,0,0.3)">
                            {currentSong.title}
                          </Text>
                          <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color={brandWhite} opacity={0.9} fontWeight="medium">
                            {currentSong.artist}
                          </Text>
                          <HStack spacing={{ base: 1.5, sm: 2 }} flexWrap="wrap" justify={{ base: "center", sm: "start" }}>
                            <HStack spacing={1}>
                              <Icon as={FiUsers} boxSize={{ base: 3, sm: 4 }} color={brandOrange} />
                              <Text fontSize={{ base: "2xs", sm: "xs" }} color={brandWhite} opacity={0.9} fontWeight="medium">
                                {listeners.toLocaleString()} oyentes
                              </Text>
                            </HStack>
                            <HStack spacing={1}>
                              <Icon as={FiZap} boxSize={{ base: 3, sm: 4 }} color={brandOrange} />
                              <Text fontSize={{ base: "2xs", sm: "xs" }} color={brandWhite} opacity={0.9} fontWeight="medium">
                                En vivo
                              </Text>
                            </HStack>
                          </HStack>
                        </VStack>
                      </HStack>

                      <HStack spacing={{ base: 1.5, sm: 2, md: 3, lg: 4 }} w="full" flexDir={{ base: "column", sm: "row" }} align="center">
                        <IconButton
                          aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                          icon={<Icon as={isPlaying ? FiPause : FiPlay} />}
                          size={{ base: "sm", sm: "md", md: "lg", lg: "xl" }}
                          onClick={handlePlayPause}
                          borderRadius="full"
                          bgGradient={`linear(135deg, ${brandRed}, ${brandOrange})`}
                          color={brandWhite}
                          sx={{
                            transition: 'all 0.25s ease',
                            willChange: 'transform',
                            animation: isPlaying ? `${pulse} 1.5s ease-in-out infinite` : 'none',
                            '&:hover': {
                              bgGradient: `linear(135deg, #C00000, #FF8C00)`,
                              transform: 'scale(1.12) rotate(5deg)',
                              boxShadow: `0 0 40px ${brandRed}80, 0 0 80px ${brandOrange}60`
                            }
                          }}
                          boxShadow={`0 0 25px ${brandRed}60`}
                        />
                        <VStack spacing={{ base: 0.75, sm: 1, md: 1.5 }} flex={1} w="full">
                          <Progress 
                            value={65} 
                            size={{ base: "xs", sm: "sm", md: "md" }}
                            borderRadius="full"
                            bg="rgba(255, 255, 255, 0.2)"
                            sx={{
                              '& > div': {
                                bgGradient: `linear(to-r, ${brandRed}, ${brandOrange})`,
                                boxShadow: `0 0 15px ${brandRed}80`
                              }
                            }}
                          />
                          <HStack justify="space-between" w="full" fontSize={{ base: "2xs", sm: "xs" }} color={brandWhite} opacity={0.9}>
                            <Text>2:34</Text>
                            <Text>4:12</Text>
                          </HStack>
                        </VStack>
                        <HStack spacing={{ base: 0.75, sm: 1, md: 1.5 }}>
                          <IconButton
                            aria-label="Me gusta"
                            icon={<Icon as={FiHeart} />}
                            size={{ base: "xs", sm: "sm", md: "md" }}
                            variant="ghost"
                            color={brandWhite}
                            sx={{
                              transition: 'all 0.2s ease',
                              willChange: 'transform',
                              '&:hover': {
                                bg: 'rgba(255, 255, 255, 0.2)',
                                transform: 'scale(1.15)'
                              }
                            }}
                          />
                          <IconButton
                            aria-label="Compartir"
                            icon={<Icon as={FiShare2} />}
                            size={{ base: "xs", sm: "sm", md: "md" }}
                            variant="ghost"
                            color={brandWhite}
                            sx={{
                              transition: 'all 0.2s ease',
                              willChange: 'transform',
                              '&:hover': {
                                bg: 'rgba(255, 255, 255, 0.2)',
                                transform: 'scale(1.15)'
                              }
                            }}
                          />
                        </HStack>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Botones de acción con efectos 3D */}
                <HStack 
                  spacing={{ base: 1.5, sm: 2, md: 3, lg: 4 }} 
                  flexWrap="wrap" 
                  justify="center"
                  flexDir={{ base: "column", sm: "row" }}
                  w="full"
                  maxW={{ base: "100%", sm: "95%", md: "90%", lg: "550px" }}
                  px={{ base: 1, sm: 0 }}
                >
                  <Button
                    leftIcon={<Icon as={FiDownload} />}
                    size={{ base: "xs", sm: "sm", md: "md", lg: "lg" }}
                    bg="rgba(255, 255, 255, 0.2)"
                    backdropFilter="blur(20px)"
                    border={{ base: "1px solid", md: "2px solid" }}
                    borderColor="rgba(255, 255, 255, 0.4)"
                    color={brandWhite}
                    sx={{
                      transition: 'all 0.25s ease',
                      willChange: 'transform',
                      '&:hover': {
                        bg: brandWhite,
                        color: brandRed,
                        transform: 'translateY(-3px) scale(1.03)',
                        boxShadow: `0 15px 30px rgba(0,0,0,0.4), 0 0 50px ${brandWhite}40`
                      }
                    }}
                    px={{ base: 4, sm: 5, md: 6, lg: 8 }}
                    py={{ base: 2, sm: 3, md: 4, lg: 5 }}
                    fontSize={{ base: "2xs", sm: "xs", md: "sm", lg: "md" }}
                    fontWeight="black"
                    borderRadius={{ base: "md", sm: "lg", md: "xl" }}
                    w={{ base: "full", sm: "auto" }}
                  >
                    Descargar App
                  </Button>
                  <Button
                    leftIcon={<Icon as={FiUsers} />}
                    size={{ base: "xs", sm: "sm", md: "md", lg: "lg" }}
                    bgGradient={`linear(135deg, ${brandOrange}, #FF8C00)`}
                    color={brandWhite}
                    sx={{
                      transition: 'all 0.25s ease',
                      willChange: 'transform',
                      '&:hover': {
                        bgGradient: `linear(135deg, #FF8C00, ${brandOrange})`,
                        transform: 'translateY(-3px) scale(1.03)',
                        boxShadow: `0 15px 30px rgba(0,0,0,0.4), 0 0 60px ${brandOrange}80`
                      }
                    }}
                    px={{ base: 4, sm: 5, md: 6, lg: 8 }}
                    py={{ base: 2, sm: 3, md: 4, lg: 5 }}
                    fontSize={{ base: "2xs", sm: "xs", md: "sm", lg: "md" }}
                    fontWeight="black"
                    borderRadius={{ base: "md", sm: "lg", md: "xl" }}
                    w={{ base: "full", sm: "auto" }}
                    boxShadow={`0 0 25px ${brandOrange}60`}
                  >
                    Unirse al Chat
                  </Button>
                </HStack>
              </VStack>
            </Container>
            )}
          </Box>
        ))}
        </Box>
      )}

      {/* Controles del carousel - Solo si hay slides con imágenes */}
      {carouselSlides.filter(slide => slide.bgImage).length > 0 && (
        <HStack
        position="absolute"
        bottom={{ base: 4, sm: 6, md: 8 }}
        left="50%"
        transform="translateX(-50%)"
        spacing={{ base: 2, sm: 2.5, md: 3 }}
        zIndex={10}
      >
        {carouselSlides.filter(slide => slide.bgImage).map((_, index) => (
          <Box
            key={index}
            w={index === currentSlide ? { base: "8px", sm: "9px", md: "10px" } : { base: "2px", sm: "2.5px", md: "3px" }}
            h={{ base: "2px", sm: "2.5px", md: "3px" }}
            borderRadius="full"
            bg={index === currentSlide ? brandWhite : "rgba(255,255,255,0.5)"}
            cursor="pointer"
            transition="all 0.3s ease"
            _hover={{ bg: brandWhite, transform: "scale(1.2)" }}
            onClick={() => goToSlide(index)}
            boxShadow={index === currentSlide ? `0 0 20px ${brandOrange}80` : 'none'}
          />
        ))}
        </HStack>
      )}

      {/* Botones de navegación - Solo si hay más de un slide */}
      {carouselSlides.filter(slide => slide.bgImage).length > 1 && (
        <>
        <IconButton
        aria-label="Slide anterior"
        icon={<Icon as={FiPlay} transform="rotate(180deg)" />}
        position="absolute"
        left={{ base: 2, sm: 3, md: 4 }}
        top="50%"
        transform="translateY(-50%)"
        bg="rgba(0,0,0,0.3)"
        backdropFilter="blur(10px)"
        color={brandWhite}
        border="2px solid"
        borderColor="rgba(255,255,255,0.2)"
        _hover={{ 
          bg: "rgba(0,0,0,0.5)", 
          transform: "translateY(-50%) scale(1.2)",
          boxShadow: `0 0 30px ${brandRed}60`
        }}
        onClick={prevSlide}
        zIndex={10}
        size={{ base: "md", sm: "lg" }}
        borderRadius="full"
        display={{ base: "none", sm: "flex" }}
      />
      <IconButton
        aria-label="Siguiente slide"
        icon={<Icon as={FiPlay} />}
        position="absolute"
        right={{ base: 2, sm: 3, md: 4 }}
        top="50%"
        transform="translateY(-50%)"
        bg="rgba(0,0,0,0.3)"
        backdropFilter="blur(10px)"
        color={brandWhite}
        border="2px solid"
        borderColor="rgba(255,255,255,0.2)"
        _hover={{ 
          bg: "rgba(0,0,0,0.5)", 
          transform: "translateY(-50%) scale(1.2)",
          boxShadow: `0 0 30px ${brandRed}60`
        }}
        onClick={nextSlide}
        zIndex={10}
        size={{ base: "md", sm: "lg" }}
        borderRadius="full"
        display={{ base: "none", sm: "flex" }}
      />
        </>
      )}

      {/* Botón de auto-play */}
      <IconButton
        aria-label={isAutoPlaying ? "Pausar carousel" : "Reproducir carousel"}
        icon={<Icon as={isAutoPlaying ? FiPause : FiPlay} />}
        position="absolute"
        top={{ base: 2, sm: 3, md: 4 }}
        right={{ base: 2, sm: 3, md: 4 }}
        bg="rgba(0,0,0,0.3)"
        backdropFilter="blur(10px)"
        color={brandWhite}
        border="2px solid"
        borderColor="rgba(255,255,255,0.2)"
        _hover={{ 
          bg: "rgba(0,0,0,0.5)", 
          transform: "scale(1.2)",
          boxShadow: `0 0 30px ${brandRed}60`
        }}
        onClick={toggleAutoPlay}
        zIndex={10}
        size={{ base: "sm", sm: "md" }}
        borderRadius="full"
      />
    </Box>
  )
}

export default HeroSection
