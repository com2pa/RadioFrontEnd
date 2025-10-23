import React from 'react'
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Icon,
  useColorModeValue,
  Badge,
  IconButton,
  Image,
  Flex,
  Progress,
  useBreakpointValue
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { 
  FiPlay,
  FiTrendingUp,
  FiHeart,
  FiShare2,
  FiStar,
  FiZap,
  FiMusic,
  FiVolume2
} from 'react-icons/fi'

// Animaciones
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
`

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
  50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
`

const TopSongs = () => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const accentColor = useColorModeValue('blue.500', 'blue.300')

  const topSongs = [
    { 
      title: "Canción del Verano", 
      artist: "Artista Popular", 
      plays: 1250,
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop",
      duration: "3:45",
      rating: 4.9,
      isTrending: true,
      genre: "Pop"
    },
    { 
      title: "Éxito Nacional", 
      artist: "Grupo Local", 
      plays: 980,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      duration: "4:12",
      rating: 4.8,
      isTrending: true,
      genre: "Rock"
    },
    { 
      title: "Hit Internacional", 
      artist: "Estrella Global", 
      plays: 756,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop",
      duration: "3:28",
      rating: 4.7,
      isTrending: false,
      genre: "Electronic"
    },
    { 
      title: "Clásico Regional", 
      artist: "Tradición Musical", 
      plays: 634,
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop",
      duration: "4:35",
      rating: 4.6,
      isTrending: false,
      genre: "Folk"
    }
  ]

  return (
    <Box 
      py={{ base: 12, md: 16, lg: 20 }}
      bgGradient="linear(to-b, white, gray.50)"
      position="relative"
      overflow="hidden"
    >
      {/* Efectos de fondo */}
      <Box
        position="absolute"
        top="10%"
        right="10%"
        w="250px"
        h="250px"
        bgGradient="radial(circle, yellow.100, transparent)"
        borderRadius="full"
        opacity={0.4}
        animation={`${float} 12s ease-in-out infinite`}
      />
      <Box
        position="absolute"
        bottom="10%"
        left="10%"
        w="200px"
        h="200px"
        bgGradient="radial(circle, orange.100, transparent)"
        borderRadius="full"
        opacity={0.4}
        animation={`${float} 10s ease-in-out infinite reverse`}
      />

      <Container maxW="container.xl" position="relative" zIndex={1} px={{ base: 4, md: 6, lg: 8 }}>
        <VStack spacing={{ base: 8, md: 10, lg: 12 }} align="stretch">
          {/* Header mejorado */}
          <VStack spacing={{ base: 4, md: 6 }} textAlign="center">
            <Badge 
              colorScheme="yellow" 
              fontSize={{ base: "xs", md: "sm" }}
              px={{ base: 3, md: 4 }}
              py={{ base: 1, md: 2 }}
              borderRadius="full"
              bg="yellow.500"
              color="black"
              fontWeight="bold"
            >
              🎵 TOP HITS
            </Badge>
            <Heading 
              size={{ base: "xl", md: "2xl", lg: "3xl" }}
              fontWeight="black"
              bgGradient="linear(to-r, yellow.600, orange.600, red.600)"
              bgClip="text"
              lineHeight="shorter"
            >
              Top Canciones
            </Heading>
            <Text 
              fontSize={{ base: "md", md: "lg", lg: "xl" }} 
              color={textColor} 
              maxW={{ base: "90%", md: "80%", lg: "700px" }} 
              fontWeight="medium"
              lineHeight="tall"
            >
              Las canciones más escuchadas esta semana en OXÍ Radio
            </Text>
          </VStack>

          <Card 
            bg={cardBg} 
            boxShadow="0 25px 50px rgba(0,0,0,0.15)"
            borderRadius={{ base: "2xl", md: "3xl" }}
            overflow="hidden"
            border="2px solid"
            borderColor="yellow.200"
          >
            <CardHeader 
              bgGradient="linear(to-r, yellow.50, orange.50)"
              borderBottom="2px solid"
              borderColor="yellow.200"
              p={{ base: 4, md: 6 }}
            >
              <HStack justify="space-between" flexDir={{ base: "column", sm: "row" }} spacing={{ base: 3, sm: 0 }}>
                <VStack align={{ base: "center", sm: "start" }} spacing={1}>
                  <Heading size={{ base: "md", md: "lg" }} color="gray.800" fontWeight="black">
                    🎤 Ranking Semanal
                  </Heading>
                  <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" fontWeight="medium">
                    Actualizado hace 2 horas
                  </Text>
                </VStack>
                <HStack spacing={2} flexWrap="wrap" justify="center">
                  <Badge 
                    colorScheme="red" 
                    variant="solid"
                    bg="red.500"
                    color="white"
                    px={{ base: 2, md: 3 }}
                    py={1}
                    borderRadius="full"
                    animation={`${glow} 2s ease-in-out infinite`}
                    fontSize={{ base: "xs", md: "sm" }}
                  >
                    🔴 EN VIVO
                  </Badge>
                  <Badge colorScheme="green" variant="solid" fontSize={{ base: "xs", md: "sm" }}>
                    <Icon as={FiTrendingUp} mr={1} />
                    Trending
                  </Badge>
                </HStack>
              </HStack>
            </CardHeader>
            
            <CardBody p={{ base: 4, md: 6, lg: 8 }}>
              <VStack spacing={{ base: 4, md: 6 }}>
                {topSongs.map((song, index) => (
                  <Box
                    key={index}
                    w="full"
                    p={{ base: 4, md: 5, lg: 6 }}
                    borderRadius={{ base: "xl", md: "2xl" }}
                    border="2px solid"
                    borderColor={index < 3 ? "yellow.200" : "gray.200"}
                    bg={index < 3 ? "yellow.50" : "white"}
                    _hover={{ 
                      bg: index < 3 ? "yellow.100" : "gray.50",
                      transform: 'translateX(10px)',
                      transition: 'all 0.3s ease'
                    }}
                    position="relative"
                    overflow="hidden"
                  >
                    {/* Efectos decorativos para top 3 */}
                    {index < 3 && (
                      <Box
                        position="absolute"
                        top={-20}
                        right={-20}
                        w="100px"
                        h="100px"
                        bgGradient="radial(circle, yellow.200, transparent)"
                        borderRadius="full"
                        opacity={0.3}
                        animation={`${pulse} 3s ease-in-out infinite`}
                      />
                    )}

                    <HStack spacing={{ base: 3, md: 4, lg: 6 }} w="full" align="center" flexDir={{ base: "column", sm: "row" }}>
                      {/* Ranking */}
                      <Box position="relative">
                        <Badge
                          colorScheme={index < 3 ? 'yellow' : 'gray'}
                          variant="solid"
                          borderRadius="full"
                          w={{ base: 8, md: 10, lg: 12 }}
                          h={{ base: 8, md: 10, lg: 12 }}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          fontSize={{ base: "sm", md: "md", lg: "lg" }}
                          fontWeight="black"
                          bgGradient={index < 3 ? "linear(135deg, yellow.400, orange.400)" : "linear(135deg, gray.400, gray.500)"}
                          boxShadow={index < 3 ? "0 10px 30px rgba(234, 179, 8, 0.4)" : "0 5px 15px rgba(0,0,0,0.1)"}
                          animation={index < 3 ? `${pulse} 2s ease-in-out infinite` : 'none'}
                        >
                          {index + 1}
                        </Badge>
                        {index < 3 && (
                          <Box
                            position="absolute"
                            top={-2}
                            right={-2}
                            w="4"
                            h="4"
                            bg="red.500"
                            borderRadius="full"
                            border="2px solid white"
                            animation={`${glow} 1.5s ease-in-out infinite`}
                          />
                        )}
                      </Box>

                      {/* Imagen del álbum */}
                      <Box position="relative">
                        <Image
                          src={song.image}
                          alt={song.title}
                          boxSize={{ base: "50px", md: "55px", lg: "60px" }}
                          borderRadius={{ base: "lg", md: "xl" }}
                          objectFit="cover"
                          boxShadow="0 10px 25px rgba(0,0,0,0.2)"
                        />
                        {song.isTrending && (
                          <Box
                            position="absolute"
                            top={-2}
                            right={-2}
                            w="6"
                            h="6"
                            bg="red.500"
                            borderRadius="full"
                            border="2px solid white"
                            animation={`${glow} 2s ease-in-out infinite`}
                          />
                        )}
                      </Box>

                      {/* Información de la canción */}
                      <VStack align={{ base: "center", sm: "start" }} spacing={1} flex={1} textAlign={{ base: "center", sm: "left" }}>
                        <HStack spacing={2} flexWrap="wrap" justify={{ base: "center", sm: "start" }}>
                          <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }} color="gray.800">
                            {song.title}
                          </Text>
                          {song.isTrending && (
                            <Badge colorScheme="red" variant="solid" fontSize={{ base: "2xs", md: "xs" }}>
                              🔥 HOT
                            </Badge>
                          )}
                        </HStack>
                        <Text fontSize={{ base: "sm", md: "md" }} color={textColor} fontWeight="medium">
                          {song.artist}
                        </Text>
                        <HStack spacing={{ base: 2, md: 4 }} flexWrap="wrap" justify={{ base: "center", sm: "start" }}>
                          <HStack spacing={1}>
                            <Icon as={FiStar} boxSize={{ base: 2, md: 3 }} color="yellow.500" />
                            <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" fontWeight="medium">
                              {song.rating}
                            </Text>
                          </HStack>
                          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" fontWeight="medium">
                            {song.genre}
                          </Text>
                          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" fontWeight="medium">
                            {song.duration}
                          </Text>
                        </HStack>
                      </VStack>

                      {/* Estadísticas */}
                      <VStack align={{ base: "center", sm: "end" }} spacing={1}>
                        <HStack spacing={1}>
                          <Icon as={FiVolume2} boxSize={{ base: 3, md: 4 }} color="blue.500" />
                          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" fontWeight="bold">
                            {song.plays.toLocaleString()}
                          </Text>
                        </HStack>
                        <Text fontSize={{ base: "2xs", md: "xs" }} color="gray.500">
                          reproducciones
                        </Text>
                      </VStack>

                      {/* Botones de acción */}
                      <HStack spacing={{ base: 1, md: 2 }} justify={{ base: "center", sm: "end" }}>
                        <IconButton
                          aria-label="Me gusta"
                          icon={<Icon as={FiHeart} />}
                          size={{ base: "xs", md: "sm" }}
                          variant="ghost"
                          colorScheme="red"
                          _hover={{ bg: 'red.50', color: 'red.500' }}
                        />
                        <IconButton
                          aria-label="Compartir"
                          icon={<Icon as={FiShare2} />}
                          size={{ base: "xs", md: "sm" }}
                          variant="ghost"
                          colorScheme="blue"
                          _hover={{ bg: 'blue.50', color: 'blue.500' }}
                        />
                        <IconButton
                          aria-label="Reproducir"
                          icon={<Icon as={FiPlay} />}
                          size={{ base: "sm", md: "md" }}
                          colorScheme="blue"
                          bgGradient="linear(135deg, blue.500, blue.600)"
                          color="white"
                          _hover={{
                            bgGradient: 'linear(135deg, blue.600, blue.700)',
                            transform: 'scale(1.1)',
                            boxShadow: '0 10px 25px rgba(59, 130, 246, 0.4)'
                          }}
                          animation={index < 3 ? `${pulse} 2s ease-in-out infinite` : 'none'}
                        />
                      </HStack>
                    </HStack>

                    {/* Barra de progreso para top 3 */}
                    {index < 3 && (
                      <Box mt={4}>
                        <Progress 
                          value={100 - (index * 20)} 
                          colorScheme="yellow" 
                          size="sm" 
                          borderRadius="full"
                          bg="yellow.100"
                          _filledTrack={{
                            bgGradient: 'linear(to-r, yellow.400, orange.400)'
                          }}
                        />
                      </Box>
                    )}
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  )
}

export default TopSongs
