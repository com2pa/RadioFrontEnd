import React, { useMemo } from 'react'
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Image,
  Card,
  CardBody,
  Heading,
  Icon,
  useColorModeValue,
  SimpleGrid,
  AspectRatio,
  useToast,
  Badge,
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { 
  FiClock,
  FiUsers,
  FiVolume2,
  FiVideo,
  FiStar,
  FiTrendingUp,
} from 'react-icons/fi'

// Animaciones optimizadas
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.95; }
`

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(229, 0, 0, 0.5); }
  50% { box-shadow: 0 0 40px rgba(229, 0, 0, 0.8); }
`

const blob = keyframes`
  0% { transform: translate(0px, 0px) scale(1); border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  50% { transform: translate(15px, -15px) scale(1.1); border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  100% { transform: translate(0px, 0px) scale(1); border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
`

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`

const LivePrograms = () => {
  const brandRed = '#E50000'
  const brandDarkGray = '#333333'
  const brandWhite = '#FFFFFF'
  const brandLightGray = '#CCCCCC'
  const brandOrange = '#FFA500'

  const textColor = useColorModeValue(brandDarkGray, brandLightGray)
  const toast = useToast()

  const featuredShows = useMemo(() => [
    {
      id: 1,
      title: "Música del Momento",
      host: "DJ Carlos",
      time: "08:00 - 12:00",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=200&fit=crop",
      listeners: 856,
      rating: 4.8,
      isLive: true,
      category: "Música"
    },
    {
      id: 2,
      title: "Noticias del Día",
      host: "María González",
      time: "12:00 - 14:00",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop",
      listeners: 423,
      rating: 4.9,
      isLive: true,
      category: "Noticias"
    },
    {
      id: 3,
      title: "Deportes en Vivo",
      host: "Roberto Silva",
      time: "14:00 - 18:00",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop",
      listeners: 634,
      rating: 4.7,
      isLive: true,
      category: "Deportes"
    }
  ], [])

  const handleListen = (showTitle) => {
    toast({
      title: 'Iniciando transmisión de audio',
      description: `Sintonizando ${showTitle} en audio`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    })
  }

  const handleWatch = (showTitle) => {
    toast({
      title: 'Iniciando transmisión de video',
      description: `Abriendo video en vivo de ${showTitle}`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    })
  }

  return (
    <Box 
      py={{ base: 10, sm: 12, md: 14, lg: 16 }}
      position="relative"
      overflow="hidden"
      bgGradient={`linear(to-b, ${brandLightGray}20, ${brandWhite})`}
      sx={{
        scrollSnapAlign: 'start',
        scrollMarginTop: '0px'
      }}
    >
      {/* Fondo con gradiente animado */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bgGradient={`linear(135deg, ${brandRed}08, ${brandOrange}08, ${brandRed}08)`}
        backgroundSize="400% 400%"
        sx={{
          animation: `${gradientShift} 20s ease infinite`,
          willChange: 'background-position'
        }}
        zIndex={0}
      />

      {/* Blobs animados optimizados */}
      <Box
        position="absolute"
        top="-10%"
        right="-5%"
        w={{ base: "200px", md: "400px", lg: "500px" }}
        h={{ base: "200px", md: "400px", lg: "500px" }}
        bgGradient={`radial(circle, ${brandRed}50, ${brandOrange}25, transparent)`}
        filter="blur(60px)"
        sx={{
          animation: `${blob} 25s ease-in-out infinite`,
          willChange: 'transform'
        }}
        zIndex={1}
      />
      
      <Box
        position="absolute"
        bottom="-8%"
        left="-5%"
        w={{ base: "180px", md: "350px", lg: "450px" }}
        h={{ base: "180px", md: "350px", lg: "450px" }}
        bgGradient={`radial(circle, ${brandOrange}50, ${brandRed}25, transparent)`}
        filter="blur(70px)"
        sx={{
          animation: `${blob} 30s ease-in-out infinite reverse`,
          willChange: 'transform'
        }}
        zIndex={1}
      />

      {/* Partículas reducidas */}
      {[...Array(6)].map((_, i) => (
        <Box
          key={i}
          position="absolute"
          top={`${15 + i * 15}%`}
          left={`${10 + i * 12}%`}
          w={{ base: "6px", md: "8px" }}
          h={{ base: "6px", md: "8px" }}
          bg={i % 2 === 0 ? brandRed : brandOrange}
          borderRadius="full"
          opacity={0.25}
          sx={{
            animation: `${float} ${5 + i * 1.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`,
            willChange: 'transform'
          }}
          zIndex={2}
          display={{ base: i < 3 ? "block" : "none", md: "block" }}
        />
      ))}

      <Container maxW="container.xl" position="relative" zIndex={3} px={{ base: 2, sm: 3, md: 4, lg: 6, xl: 8 }}>
        <VStack spacing={{ base: 6, sm: 8, md: 10, lg: 12 }} align="stretch">
          {/* Header */}
          <VStack spacing={{ base: 2, sm: 3, md: 4 }} textAlign="center">
            <Badge 
              fontSize={{ base: "2xs", sm: "xs", md: "sm", lg: "md" }}
              px={{ base: 2, sm: 2.5, md: 3, lg: 4, xl: 5 }}
              py={{ base: 0.5, sm: 1, md: 1.5, lg: 2 }}
              borderRadius="full"
              bgGradient={`linear(135deg, ${brandRed}, ${brandOrange})`}
              color={brandWhite}
              fontWeight="black"
              textTransform="uppercase"
              letterSpacing={{ base: "tight", sm: "wide" }}
              sx={{
                animation: `${glow} 2s ease-in-out infinite, ${pulse} 3s ease-in-out infinite`,
                willChange: 'transform, box-shadow'
              }}
              boxShadow={`0 0 25px ${brandRed}60`}
              border={{ base: "1px solid", md: "2px solid" }}
              borderColor="rgba(255, 255, 255, 0.3)"
              backdropFilter="blur(10px)"
            >
              🔴 EN VIVO AHORA
            </Badge>
            <Heading 
              size={{ base: "lg", sm: "xl", md: "2xl", lg: "3xl", xl: "4xl" }}
              fontWeight="black"
              bgGradient={`linear(to-r, ${brandRed}, ${brandOrange}, ${brandRed})`}
              bgClip="text"
              backgroundSize="200% auto"
              sx={{
                animation: `${gradientShift} 3s ease infinite`,
                willChange: 'background-position'
              }}
              lineHeight="shorter"
              px={{ base: 2, sm: 0 }}
            >
              Programas en Vivo
            </Heading>
            <Text 
              fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg", xl: "xl" }} 
              color={textColor} 
              maxW={{ base: "98%", sm: "95%", md: "90%", lg: "85%", xl: "700px" }} 
              fontWeight="bold"
              lineHeight="tall"
              px={{ base: 2, sm: 0 }}
            >
              Disfruta de nuestros programas más populares con los mejores conductores de Barquisimeto
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 4, sm: 5, md: 6, lg: 7, xl: 8 }}>
            {featuredShows.map((show, index) => (
              <Box
                key={show.id}
                position="relative"
                sx={{
                  animation: `${slideIn} ${0.3 + index * 0.15}s ease-out`,
                  willChange: 'transform, opacity'
                }}
              >
                <Card 
                  bg="rgba(255, 255, 255, 0.12)"
                  backdropFilter="blur(20px)"
                  border={{ base: "1px solid", md: "2px solid" }}
                  borderColor="rgba(255, 255, 255, 0.25)"
                  boxShadow="0 12px 28px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)"
                  borderRadius={{ base: "lg", sm: "xl", md: "2xl" }}
                  overflow="hidden"
                  position="relative"
                  sx={{
                    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease, border-color 0.3s ease',
                    willChange: 'transform',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.02)',
                      boxShadow: `0 20px 40px rgba(0, 0, 0, 0.3), 0 0 50px ${brandRed}30`,
                      borderColor: 'rgba(255, 255, 255, 0.4)'
                    }
                  }}
                >
                  {/* Indicador de en vivo */}
                  {show.isLive && (
                    <Box
                      position="absolute"
                      top={3}
                      right={3}
                      zIndex={10}
                    >
                      <Badge
                        bgGradient={`linear(135deg, ${brandRed}, #C00000)`}
                        color={brandWhite}
                        px={{ base: 2, sm: 2.5 }}
                        py={1}
                        borderRadius="full"
                        fontSize={{ base: "2xs", sm: "xs" }}
                        fontWeight="black"
                        textTransform="uppercase"
                        sx={{
                          animation: `${glow} 2s ease-in-out infinite`,
                          willChange: 'box-shadow'
                        }}
                        boxShadow={`0 0 20px ${brandRed}60`}
                        border="2px solid"
                        borderColor="rgba(255, 255, 255, 0.3)"
                        backdropFilter="blur(10px)"
                      >
                        🔴 EN VIVO
                      </Badge>
                    </Box>
                  )}

                  {/* Imagen */}
                  <Box position="relative">
                    <AspectRatio ratio={16/9}>
                      <Image
                        src={show.image}
                        alt={show.title}
                        objectFit="cover"
                        filter="brightness(0.9)"
                      />
                    </AspectRatio>
                    <Box
                      position="absolute"
                      bottom={0}
                      left={0}
                      right={0}
                      bgGradient="linear(to-t, rgba(0,0,0,0.7), transparent)"
                      h="50%"
                    />
                    <VStack
                      position="absolute"
                      bottom={2}
                      left={2}
                      right={2}
                      align="start"
                      spacing={1.5}
                    >
                      <Badge 
                        bgGradient={`linear(135deg, ${brandRed}, ${brandOrange})`}
                        color={brandWhite}
                        variant="solid" 
                        fontSize={{ base: "2xs", sm: "xs" }}
                        fontWeight="black"
                        px={1.5}
                        py={0.5}
                        borderRadius="md"
                        boxShadow={`0 0 15px ${brandRed}50`}
                      >
                        {show.category}
                      </Badge>
                      <HStack spacing={1.5}>
                        <Icon as={FiStar} boxSize={3} color={brandOrange} />
                        <Text fontSize={{ base: "2xs", sm: "xs" }} color={brandWhite} fontWeight="black" textShadow="0 2px 8px rgba(0,0,0,0.5)">
                          {show.rating}
                        </Text>
                      </HStack>
                    </VStack>
                  </Box>

                  <CardBody p={{ base: 3, sm: 4, md: 5, lg: 6 }} position="relative" zIndex={2}>
                    <VStack align="start" spacing={{ base: 2.5, sm: 3, md: 4 }}>
                      <VStack align="start" spacing={1}>
                        <Text 
                          fontWeight="black" 
                          fontSize={{ base: "md", sm: "lg", md: "xl", lg: "2xl" }} 
                          bgGradient={`linear(to-r, ${brandRed}, ${brandOrange})`}
                          bgClip="text"
                        >
                          {show.title}
                        </Text>
                        <Text fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} color={textColor} fontWeight="bold">
                          Con {show.host}
                        </Text>
                        <HStack spacing={1}>
                          <Icon as={FiClock} boxSize={{ base: 3, sm: 3.5 }} color={brandRed} />
                          <Text fontSize={{ base: "2xs", sm: "xs", md: "sm", lg: "md" }} color={textColor} fontWeight="bold">
                            {show.time}
                          </Text>
                        </HStack>
                      </VStack>

                      <HStack justify="space-between" w="full" align="center" flexWrap="wrap" spacing={1.5}>
                        <VStack align="start" spacing={1}>
                          <HStack spacing={1}>
                            <Icon as={FiUsers} boxSize={{ base: 3, sm: 3.5 }} color={brandRed} />
                            <Text fontSize={{ base: "2xs", sm: "xs", md: "sm", lg: "md" }} color={textColor} fontWeight="bold">
                              {show.listeners} oyentes
                            </Text>
                          </HStack>
                          <HStack spacing={1}>
                            <Icon as={FiTrendingUp} boxSize={{ base: 3, sm: 3.5 }} color={brandOrange} />
                            <Text fontSize={{ base: "2xs", sm: "xs", md: "sm", lg: "md" }} color={textColor} fontWeight="bold">
                              Trending
                            </Text>
                          </HStack>
                        </VStack>
                      </HStack>

                      <HStack 
                        spacing={{ base: 1.5, sm: 2, md: 3 }} 
                        w="full" 
                        justify="center"
                        flexDir={{ base: "column", sm: "row" }}
                      >
                        <Button 
                          size={{ base: "xs", sm: "sm", md: "md", lg: "lg" }}
                          variant="solid"
                          leftIcon={<Icon as={FiVolume2} />}
                          onClick={() => handleListen(show.title)}
                          bgGradient={`linear(135deg, ${brandRed}, #C00000)`}
                          color={brandWhite}
                          sx={{
                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                            willChange: 'transform',
                            '&:hover': {
                              bgGradient: `linear(135deg, #C00000, #A00000)`,
                              transform: 'translateY(-2px) scale(1.02)',
                              boxShadow: `0 12px 25px ${brandRed}60, 0 0 35px ${brandRed}40`
                            }
                          }}
                          flex={1}
                          w={{ base: "full", sm: "auto" }}
                          fontSize={{ base: "2xs", sm: "xs", md: "sm", lg: "md" }}
                          fontWeight="black"
                          borderRadius={{ base: "lg", md: "xl" }}
                          boxShadow={`0 6px 15px ${brandRed}40`}
                        >
                          Escuchar
                        </Button>
                        <Button 
                          size={{ base: "xs", sm: "sm", md: "md", lg: "lg" }}
                          variant="solid"
                          leftIcon={<Icon as={FiVideo} />}
                          onClick={() => handleWatch(show.title)}
                          bgGradient={`linear(135deg, ${brandOrange}, #FF8C00)`}
                          color={brandWhite}
                          sx={{
                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                            willChange: 'transform',
                            '&:hover': {
                              bgGradient: `linear(135deg, #FF8C00, #FF7700)`,
                              transform: 'translateY(-2px) scale(1.02)',
                              boxShadow: `0 12px 25px ${brandOrange}60, 0 0 35px ${brandOrange}40`
                            }
                          }}
                          flex={1}
                          w={{ base: "full", sm: "auto" }}
                          fontSize={{ base: "2xs", sm: "xs", md: "sm", lg: "md" }}
                          fontWeight="black"
                          borderRadius={{ base: "lg", md: "xl" }}
                          boxShadow={`0 6px 15px ${brandOrange}40`}
                        >
                          Ver
                        </Button>
                      </HStack>
                    </VStack>
                  </CardBody>
                </Card>
              </Box>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  )
}

export default LivePrograms
