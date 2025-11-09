import React, { useMemo } from 'react'
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Icon,
  useColorModeValue,
  Badge,
  IconButton,
  Image,
  Progress,
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { 
  FiPlay,
  FiTrendingUp,
  FiHeart,
  FiShare2,
  FiStar,
  FiVolume2
} from 'react-icons/fi'

// Animaciones optimizadas
const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
`

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.08); opacity: 0.95; }
`

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(255, 165, 0, 0.5); }
  50% { box-shadow: 0 0 35px rgba(255, 165, 0, 0.8); }
`

const blob = keyframes`
  0% { transform: translate(0px, 0px) scale(1); border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
  50% { transform: translate(20px, -20px) scale(1.15); border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
  100% { transform: translate(0px, 0px) scale(1); border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
`

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`

const TopSongs = () => {
  const brandRed = '#E50000'
  const brandDarkGray = '#333333'
  const brandWhite = '#FFFFFF'
  const brandLightGray = '#CCCCCC'
  const brandOrange = '#FFA500'

  const textColor = useColorModeValue(brandDarkGray, brandLightGray)

  const topSongs = useMemo(() => [
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
  ], [])

  return (
    <Box 
      py={{ base: 10, sm: 12, md: 14, lg: 16 }}
      bgGradient={`linear(to-b, ${brandWhite}, ${brandLightGray}20)`}
      position="relative"
      overflow="hidden"
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
        bgGradient={`linear(135deg, ${brandOrange}08, ${brandRed}08, ${brandOrange}08)`}
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
        top="8%"
        right="3%"
        w={{ base: "200px", md: "400px", lg: "500px" }}
        h={{ base: "200px", md: "400px", lg: "500px" }}
        bgGradient={`radial(circle, ${brandOrange}50, ${brandRed}25, transparent)`}
        filter="blur(70px)"
        sx={{
          animation: `${blob} 20s ease-in-out infinite`,
          willChange: 'transform'
        }}
        zIndex={1}
      />
      <Box
        position="absolute"
        bottom="8%"
        left="3%"
        w={{ base: "180px", md: "350px", lg: "450px" }}
        h={{ base: "180px", md: "350px", lg: "450px" }}
        bgGradient={`radial(circle, ${brandRed}50, ${brandOrange}25, transparent)`}
        filter="blur(80px)"
        sx={{
          animation: `${blob} 25s ease-in-out infinite reverse`,
          willChange: 'transform'
        }}
        zIndex={1}
      />

      {/* Partículas reducidas */}
      {[...Array(5)].map((_, i) => (
        <Box
          key={i}
          position="absolute"
          top={`${12 + i * 18}%`}
          left={`${8 + i * 15}%`}
          w={{ base: "5px", md: "7px" }}
          h={{ base: "5px", md: "7px" }}
          bg={i % 2 === 0 ? brandOrange : brandRed}
          borderRadius="full"
          opacity={0.25}
          sx={{
            animation: `${float} ${4 + i * 1.2}s ease-in-out infinite`,
            animationDelay: `${i * 0.25}s`,
            willChange: 'transform'
          }}
          zIndex={2}
          display={{ base: i < 2 ? "block" : "none", md: "block" }}
        />
      ))}

      <Container maxW="container.xl" position="relative" zIndex={3} px={{ base: 2, sm: 3, md: 4, lg: 6, xl: 8 }}>
        <VStack spacing={{ base: 6, sm: 8, md: 10, lg: 12 }} align="stretch">
          <VStack spacing={{ base: 2, sm: 3, md: 4 }} textAlign="center">
            <Badge 
              fontSize={{ base: "2xs", sm: "xs", md: "sm", lg: "md" }}
              px={{ base: 2, sm: 2.5, md: 3, lg: 4, xl: 5 }}
              py={{ base: 0.5, sm: 1, md: 1.5, lg: 2 }}
              borderRadius="full"
              bgGradient={`linear(135deg, ${brandOrange}, #FF8C00)`}
              color={brandWhite}
              fontWeight="black"
              textTransform="uppercase"
              letterSpacing={{ base: "tight", sm: "wide" }}
              sx={{
                animation: `${glow} 2s ease-in-out infinite, ${pulse} 3s ease-in-out infinite`,
                willChange: 'transform, box-shadow'
              }}
              boxShadow={`0 0 25px ${brandOrange}60`}
              border={{ base: "1px solid", md: "2px solid" }}
              borderColor="rgba(255, 255, 255, 0.3)"
              backdropFilter="blur(10px)"
            >
              🎵 TOP HITS
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
              Top Canciones
            </Heading>
            <Text 
              fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg", xl: "xl" }} 
              color={textColor} 
              maxW={{ base: "98%", sm: "95%", md: "90%", lg: "85%", xl: "700px" }} 
              fontWeight="bold"
              lineHeight="tall"
              px={{ base: 2, sm: 0 }}
            >
              Las canciones más escuchadas esta semana en OXÍ Radio
            </Text>
          </VStack>

          <Card 
            bg="rgba(255, 255, 255, 0.12)"
            backdropFilter="blur(20px)"
            border={{ base: "1px solid", md: "2px solid" }}
            borderColor="rgba(255, 255, 255, 0.25)"
            boxShadow="0 12px 28px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.15)"
            borderRadius={{ base: "lg", sm: "xl", md: "2xl" }}
            overflow="hidden"
          >
            <CardHeader 
              bgGradient={`linear(to-r, ${brandOrange}25, ${brandRed}25)`}
              borderBottom={{ base: "1px solid", md: "2px solid" }}
              borderColor="rgba(255, 255, 255, 0.2)"
              p={{ base: 3, sm: 4, md: 5, lg: 6 }}
            >
              <HStack justify="space-between" flexDir={{ base: "column", sm: "row" }} spacing={{ base: 2, sm: 0 }}>
                <VStack align={{ base: "center", sm: "start" }} spacing={1}>
                  <Heading size={{ base: "md", sm: "lg", md: "xl" }} color="gray.800" fontWeight="black">
                    🎤 Ranking Semanal
                  </Heading>
                  <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color="gray.600" fontWeight="bold">
                    Actualizado hace 2 horas
                  </Text>
                </VStack>
                <HStack spacing={2} flexWrap="wrap" justify="center">
                  <Badge 
                    bgGradient={`linear(135deg, ${brandRed}, #C00000)`}
                    color={brandWhite}
                    px={{ base: 2.5, sm: 3, md: 4 }}
                    py={1}
                    borderRadius="full"
                    sx={{
                      animation: `${glow} 2s ease-in-out infinite`,
                      willChange: 'box-shadow'
                    }}
                    fontSize={{ base: "2xs", sm: "xs", md: "sm" }}
                    fontWeight="black"
                    boxShadow={`0 0 20px ${brandRed}60`}
                  >
                    🔴 EN VIVO
                  </Badge>
                  <Badge 
                    bgGradient={`linear(135deg, ${brandOrange}, #FF8C00)`}
                    color={brandWhite}
                    variant="solid" 
                    fontSize={{ base: "2xs", sm: "xs", md: "sm" }}
                    fontWeight="black"
                  >
                    <Icon as={FiTrendingUp} mr={1} />
                    Trending
                  </Badge>
                </HStack>
              </HStack>
            </CardHeader>
            
            <CardBody p={{ base: 3, sm: 4, md: 5, lg: 6 }}>
              <VStack spacing={{ base: 3, sm: 4, md: 5 }}>
                {topSongs.map((song, index) => (
                  <Box
                    key={index}
                    w="full"
                    p={{ base: 3, sm: 4, md: 5, lg: 6 }}
                    borderRadius={{ base: "md", sm: "lg", md: "xl" }}
                    border={{ base: "1px solid", md: "2px solid" }}
                    borderColor={index < 3 ? brandOrange + '70' : brandLightGray + '50'}
                    bg={index < 3 ? 'rgba(255, 165, 0, 0.12)' : 'rgba(255, 255, 255, 0.08)'}
                    backdropFilter="blur(15px)"
                    sx={{
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      willChange: 'transform',
                      animation: `${slideIn} ${0.2 + index * 0.1}s ease-out`,
                      '&:hover': {
                        bg: index < 3 ? 'rgba(255, 165, 0, 0.2)' : 'rgba(255, 255, 255, 0.12)',
                        transform: 'translateX(6px) scale(1.01)',
                        boxShadow: index < 3 ? `0 12px 32px ${brandOrange}50` : '0 12px 32px rgba(0,0,0,0.15)',
                        borderColor: index < 3 ? brandOrange : brandLightGray + '70'
                      }
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
                        bgGradient={`radial(circle, ${brandOrange}70, transparent)`}
                        borderRadius="full"
                        opacity={0.25}
                        sx={{
                          animation: `${pulse} 3s ease-in-out infinite`,
                          willChange: 'transform'
                        }}
                        filter="blur(15px)"
                      />
                    )}

                    <HStack spacing={{ base: 2, sm: 3, md: 4, lg: 5 }} w="full" align="center" flexDir={{ base: "column", sm: "row" }}>
                      {/* Ranking */}
                      <Box position="relative">
                        <Badge
                          borderRadius="full"
                          w={{ base: 8, sm: 10, md: 12, lg: 14 }}
                          h={{ base: 8, sm: 10, md: 12, lg: 14 }}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          fontSize={{ base: "sm", sm: "md", md: "lg", lg: "xl" }}
                          fontWeight="black"
                          bgGradient={index < 3 ? `linear(135deg, ${brandOrange}, #FF8C00)` : `linear(135deg, ${brandDarkGray}, #555555)`}
                          color={brandWhite}
                          boxShadow={index < 3 ? `0 0 20px ${brandOrange}60` : "0 3px 10px rgba(0,0,0,0.15)"}
                          sx={{
                            animation: index < 3 ? `${pulse} 2s ease-in-out infinite` : 'none',
                            willChange: 'transform'
                          }}
                          border={{ base: "2px solid", md: "3px solid" }}
                          borderColor={index < 3 ? brandOrange : brandLightGray}
                        >
                          {index + 1}
                        </Badge>
                        {index < 3 && (
                          <Box
                            position="absolute"
                            top={-2}
                            right={-2}
                            w="5"
                            h="5"
                            bg={brandRed}
                            borderRadius="full"
                            border="2px solid white"
                            sx={{
                              animation: `${glow} 1.5s ease-in-out infinite`,
                              willChange: 'box-shadow'
                            }}
                            boxShadow={`0 0 15px ${brandRed}60`}
                          />
                        )}
                      </Box>

                      {/* Imagen del álbum */}
                      <Box position="relative">
                        <Image
                          src={song.image}
                          alt={song.title}
                          boxSize={{ base: "45px", sm: "50px", md: "60px", lg: "70px" }}
                          borderRadius={{ base: "md", sm: "lg", md: "xl" }}
                          objectFit="cover"
                          boxShadow={`0 8px 20px ${index < 3 ? brandOrange : brandDarkGray}50`}
                          border={{ base: "2px solid", md: "3px solid" }}
                          borderColor={index < 3 ? brandOrange : brandLightGray}
                        />
                        {song.isTrending && (
                          <Box
                            position="absolute"
                            top={-2}
                            right={-2}
                            w="6"
                            h="6"
                            bg={brandRed}
                            borderRadius="full"
                            border="2px solid white"
                            sx={{
                              animation: `${glow} 2s ease-in-out infinite`,
                              willChange: 'box-shadow'
                            }}
                            boxShadow={`0 0 15px ${brandRed}60`}
                          />
                        )}
                      </Box>

                      {/* Información */}
                      <VStack align={{ base: "center", sm: "start" }} spacing={1.5} flex={1} textAlign={{ base: "center", sm: "left" }}>
                        <HStack spacing={2} flexWrap="wrap" justify={{ base: "center", sm: "start" }}>
                          <Text fontWeight="black" fontSize={{ base: "md", sm: "lg", md: "xl" }} bgGradient={`linear(to-r, ${brandRed}, ${brandOrange})`} bgClip="text">
                            {song.title}
                          </Text>
                          {song.isTrending && (
                            <Badge 
                              bgGradient={`linear(135deg, ${brandRed}, #C00000)`}
                              color={brandWhite}
                              variant="solid" 
                              fontSize={{ base: "2xs", sm: "xs" }}
                              fontWeight="black"
                              sx={{
                                animation: `${glow} 2s ease-in-out infinite`,
                                willChange: 'box-shadow'
                              }}
                            >
                              🔥 HOT
                            </Badge>
                          )}
                        </HStack>
                        <Text fontSize={{ base: "sm", sm: "md", md: "lg" }} color={textColor} fontWeight="bold">
                          {song.artist}
                        </Text>
                        <HStack spacing={{ base: 2, sm: 3 }} flexWrap="wrap" justify={{ base: "center", sm: "start" }}>
                          <HStack spacing={1}>
                            <Icon as={FiStar} boxSize={3} color={brandOrange} />
                            <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color={textColor} fontWeight="bold">
                              {song.rating}
                            </Text>
                          </HStack>
                          <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color={textColor} fontWeight="bold">
                            {song.genre}
                          </Text>
                          <Text fontSize={{ base: "xs", sm: "sm", md: "md" }} color={textColor} fontWeight="bold">
                            {song.duration}
                          </Text>
                        </HStack>
                      </VStack>

                      {/* Estadísticas */}
                      <VStack align={{ base: "center", sm: "end" }} spacing={1}>
                        <HStack spacing={1.5}>
                          <Icon as={FiVolume2} boxSize={3.5} color={brandRed} />
                          <Text fontSize={{ base: "sm", sm: "md", md: "lg" }} color={textColor} fontWeight="black">
                            {song.plays.toLocaleString()}
                          </Text>
                        </HStack>
                        <Text fontSize={{ base: "2xs", sm: "xs" }} color={textColor} opacity={0.7}>
                          reproducciones
                        </Text>
                      </VStack>

                      {/* Botones de acción */}
                      <HStack spacing={{ base: 1.5, sm: 2 }} justify={{ base: "center", sm: "end" }}>
                        <IconButton
                          aria-label="Me gusta"
                          icon={<Icon as={FiHeart} />}
                          size={{ base: "xs", sm: "sm", md: "md" }}
                          variant="ghost"
                          colorScheme="red"
                          sx={{
                            transition: 'all 0.2s ease',
                            willChange: 'transform',
                            '&:hover': {
                              bg: brandRed + '20',
                              color: brandRed,
                              transform: 'scale(1.15)'
                            }
                          }}
                        />
                        <IconButton
                          aria-label="Compartir"
                          icon={<Icon as={FiShare2} />}
                          size={{ base: "xs", sm: "sm", md: "md" }}
                          variant="ghost"
                          colorScheme="blue"
                          sx={{
                            transition: 'all 0.2s ease',
                            willChange: 'transform',
                            '&:hover': {
                              bg: brandRed + '20',
                              color: brandRed,
                              transform: 'scale(1.15)'
                            }
                          }}
                        />
                        <IconButton
                          aria-label="Reproducir"
                          icon={<Icon as={FiPlay} />}
                          size={{ base: "sm", sm: "md", md: "lg" }}
                          bgGradient={`linear(135deg, ${brandRed}, #C00000)`}
                          color={brandWhite}
                          sx={{
                            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                            willChange: 'transform',
                            animation: index < 3 ? `${pulse} 2s ease-in-out infinite` : 'none',
                            '&:hover': {
                              bgGradient: `linear(135deg, #C00000, #A00000)`,
                              transform: 'scale(1.12) rotate(5deg)',
                              boxShadow: `0 12px 30px ${brandRed}60`
                            }
                          }}
                          boxShadow={`0 0 20px ${brandRed}50`}
                        />
                      </HStack>
                    </HStack>

                    {/* Barra de progreso para top 3 */}
                    {index < 3 && (
                      <Box mt={4}>
                        <Progress 
                          value={100 - (index * 20)} 
                          size={{ base: "sm", md: "md" }}
                          borderRadius="full"
                          bg={brandOrange + '20'}
                          sx={{
                            '& > div': {
                              bgGradient: `linear(to-r, ${brandOrange}, #FF8C00)`,
                              boxShadow: `0 0 15px ${brandOrange}60`
                            }
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
