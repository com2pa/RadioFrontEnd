import React from 'react'
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
  Flex,
  useBreakpointValue
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { 
  FiClock,
  FiUsers,
  FiVolume2,
  FiVideo,
  FiStar,
  FiTrendingUp,
  FiZap
} from 'react-icons/fi'

// Animaciones
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(229, 0, 0, 0.3); }
  50% { box-shadow: 0 0 30px rgba(229, 0, 0, 0.6); }
`

const LivePrograms = () => {
  // Colores oficiales de OXÍGENO 88.1FM
  const brandRed = '#E50000'      // Rojo Vibrante
  const brandDarkGray = '#333333' // Gris Oscuro
  const brandWhite = '#FFFFFF'    // Blanco Puro
  const brandLightGray = '#CCCCCC' // Gris Claro
  const brandOrange = '#FFA500'   // Naranja Vibrante

  const cardBg = useColorModeValue(brandWhite, brandDarkGray)
  const textColor = useColorModeValue(brandDarkGray, brandLightGray)
  const accentColor = brandRed
  const toast = useToast()

  // Simular datos de la radio
  const featuredShows = [
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
  ]

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
      py={{ base: 12, md: 16, lg: 20 }}
      bgGradient={`linear(to-b, ${brandLightGray}40, ${brandWhite})`}
      position="relative"
      overflow="hidden"
    >
      {/* Efectos de fondo */}
      <Box
        position="absolute"
        top="10%"
        right="5%"
        w="200px"
        h="200px"
        bgGradient={`radial(circle, rgba(229, 0, 0, 0.1), transparent)`}
        borderRadius="full"
        opacity={0.3}
        animation={`${float} 6s ease-in-out infinite`}
      />
      <Box
        position="absolute"
        bottom="20%"
        left="5%"
        w="150px"
        h="150px"
        bgGradient={`radial(circle, rgba(255, 165, 0, 0.1), transparent)`}
        borderRadius="full"
        opacity={0.3}
        animation={`${float} 8s ease-in-out infinite reverse`}
      />

      <Container maxW="container.xl" position="relative" zIndex={1} px={{ base: 4, md: 6, lg: 8 }}>
        <VStack spacing={{ base: 12, md: 14, lg: 16 }} align="stretch">
          {/* Header mejorado */}
          <VStack spacing={{ base: 4, md: 6 }} textAlign="center">
            <Badge 
              colorScheme="red" 
              fontSize={{ base: "xs", md: "sm" }}
              px={{ base: 2, md: 3 }}
              py={{ base: 1, md: 1 }}
              borderRadius="full"
              bg={brandRed}
              color={brandWhite}
              fontWeight="bold"
            >
              🔴 EN VIVO AHORA
            </Badge>
            <Heading 
              size={{ base: "xl", md: "2xl", lg: "3xl" }}
              fontWeight="black"
              bgGradient={`linear(to-r, ${brandRed}, ${brandOrange})`}
              bgClip="text"
              lineHeight="shorter"
            >
              Programas en Vivo
            </Heading>
            <Text 
              fontSize={{ base: "md", md: "lg", lg: "xl" }} 
              color={textColor} 
              maxW={{ base: "90%", md: "80%", lg: "700px" }} 
              fontWeight="medium"
              lineHeight="tall"
            >
              Disfruta de nuestros programas más populares con los mejores conductores de Barquisimeto
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 6, md: 8 }}>
            {featuredShows.map((show, index) => (
              <Card 
                key={show.id} 
                bg={cardBg} 
                boxShadow="0 20px 40px rgba(0,0,0,0.1)"
                borderRadius="2xl"
                overflow="hidden"
                position="relative"
                _hover={{ 
                  transform: 'translateY(-8px) scale(1.02)', 
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: '0 30px 60px rgba(0,0,0,0.2)'
                }}
                animation={`${float} ${3 + index}s ease-in-out infinite`}
              >
                {/* Indicador de en vivo */}
                {show.isLive && (
                  <Box
                    position="absolute"
                    top={4}
                    right={4}
                    zIndex={2}
                  >
                    <Badge
                      colorScheme="red"
                      bg={brandRed}
                      color={brandWhite}
                      px={2}
                      py={1}
                      borderRadius="full"
                      fontSize="xs"
                      fontWeight="bold"
                      animation={`${glow} 2s ease-in-out infinite`}
                    >
                      🔴 EN VIVO
                    </Badge>
                  </Box>
                )}

                {/* Imagen con overlay */}
                <Box position="relative">
                  <AspectRatio ratio={16/9}>
                    <Image
                      src={show.image}
                      alt={show.title}
                      objectFit="cover"
                    />
                  </AspectRatio>
                  <Box
                    position="absolute"
                    bottom={0}
                    left={0}
                    right={0}
                    bgGradient="linear(to-t, black, transparent)"
                    h="50%"
                  />
                  <VStack
                    position="absolute"
                    bottom={4}
                    left={4}
                    right={4}
                    align="start"
                    spacing={1}
                  >
                    <Badge bg={brandRed} color={brandWhite} variant="solid" fontSize="xs">
                      {show.category}
                    </Badge>
                    <HStack spacing={2}>
                      <Icon as={FiStar} boxSize={3} color={brandOrange} />
                      <Text fontSize="xs" color="white" fontWeight="bold">
                        {show.rating}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>

                <CardBody p={{ base: 4, md: 6 }}>
                  <VStack align="start" spacing={{ base: 3, md: 4 }}>
                    <VStack align="start" spacing={2}>
                      <Text fontWeight="bold" fontSize={{ base: "lg", md: "xl" }} color="gray.800">
                        {show.title}
                      </Text>
                      <Text fontSize={{ base: "sm", md: "md" }} color={textColor} fontWeight="medium">
                        Con {show.host}
                      </Text>
                      <HStack spacing={2}>
                        <Icon as={FiClock} boxSize={{ base: 3, md: 4 }} color={brandRed} />
                        <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" fontWeight="medium">
                          {show.time}
                        </Text>
                      </HStack>
                    </VStack>

                    <HStack justify="space-between" w="full" align="center" flexWrap="wrap">
                      <VStack align="start" spacing={1}>
                        <HStack spacing={1}>
                          <Icon as={FiUsers} boxSize={{ base: 3, md: 4 }} color={brandRed} />
                          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" fontWeight="medium">
                            {show.listeners} oyentes
                          </Text>
                        </HStack>
                        <HStack spacing={1}>
                          <Icon as={FiTrendingUp} boxSize={{ base: 3, md: 4 }} color={brandOrange} />
                          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" fontWeight="medium">
                            Trending
                          </Text>
                        </HStack>
                      </VStack>
                    </HStack>

                    <HStack 
                      spacing={{ base: 2, md: 3 }} 
                      w="full" 
                      justify="center"
                      flexDir={{ base: "column", sm: "row" }}
                    >
                      <Button 
                        size={{ base: "sm", md: "md" }}
                        variant="solid"
                        leftIcon={<Icon as={FiVolume2} />}
                        onClick={() => handleListen(show.title)}
                        bgGradient={`linear(to-r, ${brandRed}, #C00000)`}
                        color={brandWhite}
                        _hover={{
                          bgGradient: `linear(to-r, #C00000, #A00000)`,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 10px 25px rgba(229, 0, 0, 0.4)`
                        }}
                        flex={1}
                        w={{ base: "full", sm: "auto" }}
                        fontSize={{ base: "xs", md: "sm" }}
                      >
                        Escuchar
                      </Button>
                      <Button 
                        size={{ base: "sm", md: "md" }}
                        variant="solid"
                        leftIcon={<Icon as={FiVideo} />}
                        onClick={() => handleWatch(show.title)}
                        bgGradient={`linear(to-r, ${brandOrange}, #FF8C00)`}
                        color={brandWhite}
                        _hover={{
                          bgGradient: `linear(to-r, #FF8C00, #FF7700)`,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 10px 25px rgba(255, 165, 0, 0.4)`
                        }}
                        flex={1}
                        w={{ base: "full", sm: "auto" }}
                        fontSize={{ base: "xs", md: "sm" }}
                      >
                        Ver
                      </Button>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  )
}

export default LivePrograms
