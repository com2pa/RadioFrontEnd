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
  useBreakpointValue,
} from '@chakra-ui/react'
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
  FiZap
} from 'react-icons/fi'

// Animaciones personalizadas
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.5); }
  50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.8); }
`



const HeroSection = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentSong] = useState({
    title: "Música en Vivo",
    artist: "OXÍ Radio 88.1 FM",
    duration: "00:00"
  })
  const [listeners] = useState(1247)
  
  // Estados para el carousel parallax
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const carouselRef = useRef(null)
  const intervalRef = useRef(null)
  
  // Datos del carousel con imágenes más apropiadas para radio
  const carouselSlides = [
    {
      id: 1,
      title: "🎵 Música en Vivo 24/7",
      subtitle: "Los mejores hits del momento",
      bgImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&h=1080&fit=crop&q=80",
      color: "blue"
    },
    {
      id: 2,
      title: "📻 Noticias Locales",
      subtitle: "Información actualizada de Barquisimeto",
      bgImage: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1920&h=1080&fit=crop&q=80",
      color: "purple"
    },
    {
      id: 3,
      title: "🎤 Programas Especiales",
      subtitle: "Entrevistas y eventos exclusivos",
      bgImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1920&h=1080&fit=crop&q=80",
      color: "pink"
    }
  ]
  
  const toast = useToast()
  
  // Responsive breakpoints (mantenidos para futuras mejoras)
  // const isMobile = useBreakpointValue({ base: true, md: false })
  // const isTablet = useBreakpointValue({ base: false, md: true, lg: false })
  // const isDesktop = useBreakpointValue({ base: false, lg: true })

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

  // Funciones del carousel
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
  }, [carouselSlides.length])

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length)
  }

  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  // Auto-play del carousel
  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselSlides.length)
      }, 5000)
    } else {
      clearInterval(intervalRef.current)
    }
    
    return () => clearInterval(intervalRef.current)
  }, [isAutoPlaying, carouselSlides.length])

  // Efectos parallax mejorados con múltiples capas
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset
      
      // Parallax para el contenedor principal
      if (carouselRef.current) {
        const parallaxContainer = scrolled * 0.3
        carouselRef.current.style.transform = `translateY(${parallaxContainer}px)`
      }
      
      // Parallax para elementos de fondo
      const backgroundElements = document.querySelectorAll('.parallax-bg')
      backgroundElements.forEach((element, index) => {
        const speed = 0.1 + (index * 0.05) // Diferentes velocidades
        const parallax = scrolled * speed
        element.style.transform = `translateY(${parallax}px)`
      })
      
      // Parallax para elementos flotantes
      const floatingElements = document.querySelectorAll('.parallax-float')
      floatingElements.forEach((element, index) => {
        const speed = 0.2 + (index * 0.1)
        const parallax = scrolled * speed
        const rotation = scrolled * 0.01
        element.style.transform = `translateY(${parallax}px) rotate(${rotation}deg)`
      })
      
      // Parallax para el contenido del carousel
      const contentElements = document.querySelectorAll('.parallax-content')
      contentElements.forEach((element, index) => {
        const speed = 0.1 + (index * 0.05)
        const parallax = scrolled * speed
        element.style.transform = `translateY(${parallax}px)`
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Carousel Parallax - REEMPLAZA LA SECCIÓN HERO ORIGINAL */}
      <Box
        ref={carouselRef}
        position="relative"
        h={{ base: "80vh", md: "90vh", lg: "100vh" }}
        overflow="hidden"
        display="flex"
        alignItems="center"
        bg="transparent"
      >
        {/* Capas de fondo parallax removidas para que las imágenes ocupen todo el espacio */}

        {/* Elementos flotantes parallax */}
        <Box
          className="parallax-float"
          position="absolute"
          top="10%"
          left="5%"
          w="60px"
          h="60px"
          bg="rgba(59, 130, 246, 0.2)"
          borderRadius="full"
          zIndex={3}
          animation={`${float} 4s ease-in-out infinite`}
        />
        
        <Box
          className="parallax-float"
          position="absolute"
          top="20%"
          right="10%"
          w="40px"
          h="40px"
          bg="rgba(236, 72, 153, 0.3)"
          borderRadius="full"
          zIndex={3}
          animation={`${float} 3s ease-in-out infinite reverse`}
        />
        
        <Box
          className="parallax-float"
          position="absolute"
          bottom="15%"
          left="15%"
          w="80px"
          h="80px"
          bg="rgba(147, 51, 234, 0.15)"
          borderRadius="full"
          zIndex={3}
          animation={`${float} 5s ease-in-out infinite`}
        />

        {/* Formas geométricas parallax */}
        <Box
          className="parallax-float"
          position="absolute"
          top="30%"
          right="20%"
          w="30px"
          h="30px"
          bg="rgba(255, 255, 255, 0.1)"
          transform="rotate(45deg)"
          zIndex={3}
          animation={`${pulse} 2s ease-in-out infinite`}
        />
        
        <Box
          className="parallax-float"
          position="absolute"
          bottom="25%"
          right="5%"
          w="50px"
          h="50px"
          bg="rgba(59, 130, 246, 0.1)"
          borderRadius="20%"
          zIndex={3}
          animation={`${float} 6s ease-in-out infinite`}
        />
        {/* Slides del carousel */}
        <Box
          position="absolute"
          top={0}
          left={0}
          w="full"
          h="full"
          display="flex"
          transition="transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)"
          transform={`translateX(-${currentSlide * 100}%)`}
          zIndex={4}
        >
          {carouselSlides.map((slide, index) => (
            <Box
              key={slide.id}
              position="relative"
              w="100%"
              h="100%"
              minW="100%"
              flexShrink={0}
              bgImage={`url(${slide.bgImage})`}
              bgSize="cover"
              bgPosition="center"
              bgRepeat="no-repeat"
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
                bg: `linear-gradient(135deg, ${slide.color}.600, ${slide.color}.800)`,
                opacity: 0.2,
                zIndex: 1
              }}
            >
              {/* Elementos parallax dentro de cada slide */}
              <Box
                className="parallax-float"
                position="absolute"
                top="5%"
                left="5%"
                w="100px"
                h="100px"
                bg={`rgba(255, 255, 255, 0.1)`}
                borderRadius="full"
                zIndex={2}
                animation={`${float} ${3 + index}s ease-in-out infinite`}
              />
              
              <Box
                className="parallax-float"
                position="absolute"
                bottom="10%"
                right="10%"
                w="60px"
                h="60px"
                bg={`rgba(255, 255, 255, 0.08)`}
                borderRadius="20%"
                zIndex={2}
                animation={`${pulse} ${2 + index}s ease-in-out infinite`}
              />
              
              <Box
                className="parallax-float"
                position="absolute"
                top="50%"
                left="10%"
                w="40px"
                h="40px"
                bg={`rgba(255, 255, 255, 0.06)`}
                transform="rotate(45deg)"
                zIndex={2}
                animation={`${float} ${4 + index}s ease-in-out infinite reverse`}
              />
              <Container maxW="container.xl" position="relative" zIndex={3} px={{ base: 4, md: 6, lg: 8 }}>
                <VStack spacing={{ base: 8, md: 10, lg: 12 }} textAlign="center">
                  {/* Header con animación */}
                  <VStack spacing={{ base: 4, md: 6 }} animation={`${pulse} 2s ease-in-out infinite`}>
                    <Badge 
                      colorScheme="yellow" 
                      fontSize={{ base: "sm", md: "md" }}
                      px={{ base: 3, md: 4 }}
                      py={{ base: 1, md: 2 }}
                      borderRadius="full"
                      bg="yellow.400"
                      color="black"
                      fontWeight="bold"
                      animation={`${glow} 2s ease-in-out infinite`}
                    >
                      🔴 EN VIVO AHORA
                    </Badge>
                    <Heading 
                      size={{ base: "2xl", md: "3xl", lg: "4xl" }}
                      fontWeight="black"
                      bgGradient="linear(to-r, white, yellow.200, white)"
                      bgClip="text"
                      textShadow="0 0 30px rgba(255,255,255,0.5)"
                      lineHeight="shorter"
                    >
                      {slide.title}
                    </Heading>
                    <Text 
                      fontSize={{ base: "lg", md: "xl", lg: "2xl" }} 
                      opacity={0.95} 
                      fontWeight="medium"
                      maxW={{ base: "90%", md: "80%", lg: "70%" }}
                      lineHeight="tall"
                    >
                      {slide.subtitle}
                    </Text>
                    
                    {/* Estadísticas destacadas */}
                    <HStack 
                      spacing={{ base: 4, md: 6, lg: 8 }} 
                      mt={4}
                      flexWrap="wrap"
                      justify="center"
                    >
                      <VStack spacing={1}>
                        <Icon as={FiUsers} boxSize={{ base: 5, md: 6 }} color="yellow.300" />
                        <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">{listeners.toLocaleString()}</Text>
                        <Text fontSize={{ base: "xs", md: "sm" }} opacity={0.8}>Oyentes</Text>
                      </VStack>
                      <VStack spacing={1}>
                        <Icon as={FiStar} boxSize={{ base: 5, md: 6 }} color="yellow.300" />
                        <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">4.9</Text>
                        <Text fontSize={{ base: "xs", md: "sm" }} opacity={0.8}>Rating</Text>
                      </VStack>
                      <VStack spacing={1}>
                        <Icon as={FiTrendingUp} boxSize={{ base: 5, md: 6 }} color="yellow.300" />
                        <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">#1</Text>
                        <Text fontSize={{ base: "xs", md: "sm" }} opacity={0.8}>En la ciudad</Text>
                      </VStack>
                    </HStack>
                  </VStack>

                  {/* Botones de acción mejorados */}
                  <HStack 
                    spacing={{ base: 4, md: 6 }} 
                    flexWrap="wrap" 
                    justify="center"
                    flexDir={{ base: "column", sm: "row" }}
                    w="full"
                    maxW={{ base: "100%", md: "600px" }}
                  >
                    <Button
                      leftIcon={<Icon as={FiDownload} />}
                      variant="outline"
                      colorScheme="white"
                      size={{ base: "md", md: "lg", lg: "xl" }}
                      bg="rgba(255,255,255,0.1)"
                      border="2px solid white"
                      color="white"
                      _hover={{
                        bg: 'white',
                        color: 'blue.600',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                      }}
                      px={{ base: 6, md: 8 }}
                      py={{ base: 4, md: 6 }}
                      fontSize={{ base: "sm", md: "md", lg: "lg" }}
                      fontWeight="bold"
                      w={{ base: "full", sm: "auto" }}
                    >
                      Descargar App
                    </Button>
                    <Button
                      leftIcon={<Icon as={FiUsers} />}
                      variant="solid"
                      colorScheme="yellow"
                      size={{ base: "md", md: "lg", lg: "xl" }}
                      bgGradient="linear(135deg, yellow.400, orange.400)"
                      color="black"
                      _hover={{
                        bgGradient: 'linear(135deg, yellow.500, orange.500)',
                        transform: 'translateY(-3px)',
                        boxShadow: '0 10px 25px rgba(255, 193, 7, 0.4)'
                      }}
                      px={{ base: 6, md: 8 }}
                      py={{ base: 4, md: 6 }}
                      fontSize={{ base: "sm", md: "md", lg: "lg" }}
                      fontWeight="bold"
                      w={{ base: "full", sm: "auto" }}
                    >
                      Unirse al Chat
                    </Button>
                  </HStack>
                </VStack>
              </Container>
            </Box>
          ))}
        </Box>

        {/* Controles de navegación */}
        <HStack
          position="absolute"
          bottom={8}
          left="50%"
          transform="translateX(-50%)"
          spacing={2}
          zIndex={10}
        >
          {carouselSlides.map((_, index) => (
            <Box
              key={index}
              w={3}
              h={3}
              borderRadius="full"
              bg={index === currentSlide ? "white" : "rgba(255,255,255,0.5)"}
              cursor="pointer"
              transition="all 0.3s ease"
              _hover={{ bg: "white", transform: "scale(1.2)" }}
              onClick={() => goToSlide(index)}
            />
          ))}
        </HStack>

        {/* Botones de navegación */}
        <IconButton
          aria-label="Slide anterior"
          icon={<Icon as={FiPlay} transform="rotate(180deg)" />}
          position="absolute"
          left={4}
          top="50%"
          transform="translateY(-50%)"
          bg="rgba(0,0,0,0.5)"
          color="white"
          _hover={{ bg: "rgba(0,0,0,0.7)", transform: "translateY(-50%) scale(1.1)" }}
          onClick={prevSlide}
          zIndex={10}
          size="lg"
          borderRadius="full"
        />
        <IconButton
          aria-label="Siguiente slide"
          icon={<Icon as={FiPlay} />}
          position="absolute"
          right={4}
          top="50%"
          transform="translateY(-50%)"
          bg="rgba(0,0,0,0.5)"
          color="white"
          _hover={{ bg: "rgba(0,0,0,0.7)", transform: "translateY(-50%) scale(1.1)" }}
          onClick={nextSlide}
          zIndex={10}
          size="lg"
          borderRadius="full"
        />

        {/* Botón de auto-play */}
        <IconButton
          aria-label={isAutoPlaying ? "Pausar carousel" : "Reproducir carousel"}
          icon={<Icon as={isAutoPlaying ? FiPause : FiPlay} />}
          position="absolute"
          top={4}
          right={4}
          bg="rgba(0,0,0,0.5)"
          color="white"
          _hover={{ bg: "rgba(0,0,0,0.7)", transform: "scale(1.1)" }}
          onClick={toggleAutoPlay}
          zIndex={10}
          size="md"
          borderRadius="full"
        />
      </Box>

      {/* SECCIÓN HERO ORIGINAL RESTAURADA */}
      <Box
        bgGradient="linear(135deg, blue.600, purple.600, pink.500)"
        color="white"
        py={{ base: 12, md: 16, lg: 24 }}
        position="relative"
        overflow="hidden"
        minH={{ base: "80vh", md: "90vh", lg: "100vh" }}
        display="flex"
        alignItems="center"
      >
      {/* Efectos de fondo animados */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgImage="url('https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1920&h=1080&fit=crop')"
        bgSize="cover"
        bgPosition="center"
        opacity={0.15}
        zIndex={0}
      />
      
      {/* TODO EL CONTENIDO ORIGINAL ESTÁ COMENTADO - REEMPLAZADO POR CAROUSEL PARALLAX */}
     
      <Box
        position="absolute"
        top="20%"
        left="10%"
        w="20px"
        h="20px"
        bg="white"
        borderRadius="full"
        opacity={0.6}
        animation={`${float} 3s ease-in-out infinite`}
        zIndex={1}
      />
      <Box
        position="absolute"
        top="60%"
        right="15%"
        w="15px"
        h="15px"
        bg="yellow.300"
        borderRadius="full"
        opacity={0.7}
        animation={`${float} 4s ease-in-out infinite reverse`}
        zIndex={1}
      />
      <Box
        position="absolute"
        top="40%"
        right="25%"
        w="25px"
        h="25px"
        bg="pink.300"
        borderRadius="full"
        opacity={0.5}
        animation={`${float} 5s ease-in-out infinite`}
        zIndex={1}
      />

      <Container maxW="container.xl" position="relative" zIndex={2} px={{ base: 4, md: 6, lg: 8 }}>
        <VStack spacing={{ base: 8, md: 10, lg: 12 }} textAlign="center">
          <VStack spacing={{ base: 4, md: 6 }} animation={`${pulse} 2s ease-in-out infinite`}>
            <Badge 
              colorScheme="yellow" 
              fontSize={{ base: "sm", md: "md" }}
              px={{ base: 3, md: 4 }}
              py={{ base: 1, md: 2 }}
              borderRadius="full"
              bg="yellow.400"
              color="black"
              fontWeight="bold"
              animation={`${glow} 2s ease-in-out infinite`}
            >
              🔴 EN VIVO AHORA
            </Badge>
            <Heading 
              size={{ base: "2xl", md: "3xl", lg: "4xl" }}
              fontWeight="black"
              bgGradient="linear(to-r, white, yellow.200, white)"
              bgClip="text"
              textShadow="0 0 30px rgba(255,255,255,0.5)"
              lineHeight="shorter"
            >
              OXÍ Radio 88.1 FM
            </Heading>
            <Text 
              fontSize={{ base: "lg", md: "xl", lg: "2xl" }} 
              opacity={0.95} 
              fontWeight="medium"
              maxW={{ base: "90%", md: "80%", lg: "70%" }}
              lineHeight="tall"
            >
              La mejor música y noticias de Barquisimeto
            </Text>
            
            <HStack 
              spacing={{ base: 4, md: 6, lg: 8 }} 
              mt={4}
              flexWrap="wrap"
              justify="center"
            >
              <VStack spacing={1}>
                <Icon as={FiUsers} boxSize={{ base: 5, md: 6 }} color="yellow.300" />
                <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">{listeners.toLocaleString()}</Text>
                <Text fontSize={{ base: "xs", md: "sm" }} opacity={0.8}>Oyentes</Text>
              </VStack>
              <VStack spacing={1}>
                <Icon as={FiStar} boxSize={{ base: 5, md: 6 }} color="yellow.300" />
                <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">4.9</Text>
                <Text fontSize={{ base: "xs", md: "sm" }} opacity={0.8}>Rating</Text>
              </VStack>
              <VStack spacing={1}>
                <Icon as={FiTrendingUp} boxSize={{ base: 5, md: 6 }} color="yellow.300" />
                <Text fontSize={{ base: "md", md: "lg" }} fontWeight="bold">#1</Text>
                <Text fontSize={{ base: "xs", md: "sm" }} opacity={0.8}>En la ciudad</Text>
              </VStack>
            </HStack>
          </VStack>

          <Card 
            bg="rgba(255,255,255,0.95)" 
            color="gray.800" 
            maxW={{ base: "100%", md: "600px" }}
            w="full" 
            boxShadow="0 25px 50px rgba(0,0,0,0.3)"
            borderRadius={{ base: "xl", md: "2xl" }}
            backdropFilter="blur(10px)"
            border="1px solid rgba(255,255,255,0.2)"
            _hover={{
              transform: 'translateY(-5px)',
              boxShadow: '0 35px 70px rgba(0,0,0,0.4)',
              transition: 'all 0.3s ease'
            }}
          >
            <CardBody p={{ base: 4, md: 6, lg: 8 }}>
              <VStack spacing={{ base: 4, md: 6 }}>
                <HStack spacing={{ base: 4, md: 6 }} w="full" flexDir={{ base: "column", sm: "row" }}>
                  <Avatar
                    size={{ base: "lg", md: "xl" }}
                    bgGradient="linear(135deg, blue.500, purple.500, pink.500)"
                    icon={<Icon as={FiRadio} boxSize={{ base: 6, md: 8, lg: 10 }} />}
                    animation={isPlaying ? `${pulse} 1s ease-in-out infinite` : 'none'}
                    boxShadow="0 10px 30px rgba(59, 130, 246, 0.4)"
                  />
                  <VStack align={{ base: "center", sm: "start" }} spacing={2} flex={1} textAlign={{ base: "center", sm: "left" }}>
                    <Text fontWeight="bold" fontSize={{ base: "lg", md: "xl" }} color="gray.800">
                      {currentSong.title}
                    </Text>
                    <Text fontSize={{ base: "sm", md: "md" }} color="gray.600" fontWeight="medium">
                      {currentSong.artist}
                    </Text>
                    <HStack spacing={{ base: 2, md: 3 }} flexWrap="wrap" justify={{ base: "center", sm: "start" }}>
                      <HStack spacing={1}>
                        <Icon as={FiUsers} boxSize={{ base: 4, md: 5 }} color="green.500" />
                        <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" fontWeight="medium">
                          {listeners.toLocaleString()} oyentes
                        </Text>
                      </HStack>
                      <HStack spacing={1}>
                        <Icon as={FiZap} boxSize={{ base: 4, md: 5 }} color="orange.500" />
                        <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" fontWeight="medium">
                          En vivo
                        </Text>
                      </HStack>
                    </HStack>
                  </VStack>
                </HStack>

                <HStack spacing={{ base: 4, md: 6 }} w="full" flexDir={{ base: "column", sm: "row" }}>
                  <IconButton
                    aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                    icon={<Icon as={isPlaying ? FiPause : FiPlay} />}
                    size={{ base: "lg", md: "xl" }}
                    colorScheme="blue"
                    onClick={handlePlayPause}
                    borderRadius="full"
                    bgGradient="linear(135deg, blue.500, purple.500)"
                    color="white"
                    _hover={{
                      bgGradient: 'linear(135deg, blue.600, purple.600)',
                      transform: 'scale(1.1)',
                      boxShadow: '0 10px 30px rgba(59, 130, 246, 0.6)'
                    }}
                    animation={isPlaying ? `${pulse} 1.5s ease-in-out infinite` : 'none'}
                  />
                  <VStack spacing={2} flex={1} w="full">
                    <Progress 
                      value={65} 
                      colorScheme="blue" 
                      size={{ base: "md", md: "lg" }}
                      borderRadius="full"
                      bg="gray.200"
                      _filledTrack={{
                        bgGradient: 'linear(to-r, blue.400, purple.400)'
                      }}
                    />
                    <HStack justify="space-between" w="full" fontSize={{ base: "xs", md: "sm" }} color="gray.600" fontWeight="medium">
                      <Text>2:34</Text>
                      <Text>4:12</Text>
                    </HStack>
                  </VStack>
                  <HStack spacing={{ base: 2, md: 3 }} justify="center">
                    <IconButton
                      aria-label="Me gusta"
                      icon={<Icon as={FiHeart} />}
                      size={{ base: "md", md: "lg" }}
                      variant="ghost"
                      colorScheme="red"
                      _hover={{ bg: 'red.50', color: 'red.500' }}
                    />
                    <IconButton
                      aria-label="Compartir"
                      icon={<Icon as={FiShare2} />}
                      size={{ base: "md", md: "lg" }}
                      variant="ghost"
                      colorScheme="blue"
                      _hover={{ bg: 'blue.50', color: 'blue.500' }}
                    />
                  </HStack>
                </HStack>
              </VStack>
            </CardBody>
          </Card>

          <HStack 
            spacing={{ base: 4, md: 6 }} 
            flexWrap="wrap" 
            justify="center"
            flexDir={{ base: "column", sm: "row" }}
            w="full"
            maxW={{ base: "100%", md: "600px" }}
          >
            <Button
              leftIcon={<Icon as={FiDownload} />}
              variant="outline"
              colorScheme="white"
              size={{ base: "md", md: "lg", lg: "xl" }}
              bg="rgba(255,255,255,0.1)"
              border="2px solid white"
              color="white"
              _hover={{
                bg: 'white',
                color: 'blue.600',
                transform: 'translateY(-3px)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
              }}
              px={{ base: 6, md: 8 }}
              py={{ base: 4, md: 6 }}
              fontSize={{ base: "sm", md: "md", lg: "lg" }}
              fontWeight="bold"
              w={{ base: "full", sm: "auto" }}
            >
              Descargar App
            </Button>
            <Button
              leftIcon={<Icon as={FiUsers} />}
              variant="solid"
              colorScheme="yellow"
              size={{ base: "md", md: "lg", lg: "xl" }}
              bgGradient="linear(135deg, yellow.400, orange.400)"
              color="black"
              _hover={{
                bgGradient: 'linear(135deg, yellow.500, orange.500)',
                transform: 'translateY(-3px)',
                boxShadow: '0 10px 25px rgba(255, 193, 7, 0.4)'
              }}
              px={{ base: 6, md: 8 }}
              py={{ base: 4, md: 6 }}
              fontSize={{ base: "sm", md: "md", lg: "lg" }}
              fontWeight="bold"
              w={{ base: "full", sm: "auto" }}
            >
              Unirse al Chat
            </Button>
          </HStack>
        </VStack>
      </Container>
      </Box>
      
    </>
  )
}

export default HeroSection
