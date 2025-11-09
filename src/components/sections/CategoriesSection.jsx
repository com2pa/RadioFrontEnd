import React, { useMemo } from 'react'
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
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { 
  FiMic,
  FiRss,
  FiHeadphones,
  FiArrowRight,
  FiStar,
  FiTrendingUp,
  FiZap
} from 'react-icons/fi'
import { useToast } from '@chakra-ui/react'

// Animaciones optimizadas
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
`

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(229, 0, 0, 0.5); }
  50% { box-shadow: 0 0 35px rgba(229, 0, 0, 0.8); }
`

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`

const CategoriesSection = () => {
  const brandRed = '#E50000'
  const brandDarkGray = '#333333'
  const brandWhite = '#FFFFFF'
  const brandLightGray = '#CCCCCC'
  const brandOrange = '#FFA500'

  const textColor = useColorModeValue(brandDarkGray, brandLightGray)
  const toast = useToast()

  const categories = useMemo(() => [
    {
      id: 1,
      title: "Programas en Vivo",
      description: "Sintoniza tus programas favoritos con nuestros locutores en directo. Música, noticias y entretenimiento 24/7.",
      icon: FiMic,
      colorScheme: brandRed,
      gradient: `linear(135deg, ${brandRed}, #C00000)`,
      textGradient: `linear(to-r, ${brandRed}, #C00000)`,
      indicatorColor: brandOrange,
      borderColor: brandRed + '70',
      hoverBorderColor: brandRed,
      shadowColor: "rgba(229, 0, 0, 0.25)"
    },
    {
      id: 2,
      title: "Últimas Noticias",
      description: "Mantente informado con los titulares más relevantes del día. Noticias locales, nacionales e internacionales.",
      icon: FiRss,
      colorScheme: brandOrange,
      gradient: `linear(135deg, ${brandOrange}, #FF8C00)`,
      textGradient: `linear(to-r, ${brandOrange}, #FF8C00)`,
      indicatorColor: brandRed,
      borderColor: brandOrange + '70',
      hoverBorderColor: brandOrange,
      shadowColor: "rgba(255, 165, 0, 0.25)"
    },
    {
      id: 3,
      title: "Nuestros Podcasts",
      description: "Explora nuestra biblioteca de podcasts exclusivos y a la carta. Contenido especializado para todos los gustos.",
      icon: FiHeadphones,
      colorScheme: brandRed,
      gradient: `linear(135deg, ${brandRed}, #C00000)`,
      textGradient: `linear(to-r, ${brandRed}, #C00000)`,
      indicatorColor: brandOrange,
      borderColor: brandRed + '70',
      hoverBorderColor: brandRed,
      shadowColor: "rgba(229, 0, 0, 0.25)"
    }
  ], [])

  const handleCategoryClick = (categoryName) => {
    toast({
      title: `Explorando ${categoryName}`,
      description: `Redirigiendo a la sección de ${categoryName.toLowerCase()}`,
      status: 'info',
      duration: 2000,
      isClosable: true,
    })
  }

  return (
    <Box 
      py={{ base: 10, sm: 12, md: 14, lg: 16 }} 
      bgGradient={`linear(to-b, ${brandWhite}, ${brandLightGray}40)`}
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
        bgGradient={`linear(135deg, ${brandRed}08, ${brandOrange}08, ${brandRed}08)`}
        backgroundSize="400% 400%"
        sx={{
          animation: `${gradientShift} 20s ease infinite`,
          willChange: 'background-position'
        }}
        zIndex={0}
      />

      {/* Blobs grandes animados optimizados */}
      <Box
        position="absolute"
        top="12%"
        left="-4%"
        w={{ base: "250px", md: "500px", lg: "700px" }}
        h={{ base: "250px", md: "500px", lg: "700px" }}
        bgGradient={`radial(circle, ${brandRed}50, ${brandOrange}25, transparent)`}
        filter="blur(80px)"
        opacity={0.4}
        sx={{
          animation: `${float} 22s ease-in-out infinite`,
          willChange: 'transform'
        }}
        zIndex={1}
      />
      <Box
        position="absolute"
        bottom="4%"
        right="-4%"
        w={{ base: "220px", md: "450px", lg: "650px" }}
        h={{ base: "220px", md: "450px", lg: "650px" }}
        bgGradient={`radial(circle, ${brandOrange}50, ${brandRed}25, transparent)`}
        filter="blur(90px)"
        opacity={0.4}
        sx={{
          animation: `${float} 28s ease-in-out infinite reverse`,
          willChange: 'transform'
        }}
        zIndex={1}
      />

      <Container maxW="container.xl" position="relative" zIndex={1} px={{ base: 2, sm: 3, md: 4, lg: 6, xl: 8 }}>
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
              ✨ CATEGORÍAS
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
              Explora Nuestras Categorías
            </Heading>
            <Text 
              fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg", xl: "xl" }} 
              color={textColor} 
              maxW={{ base: "98%", sm: "95%", md: "90%", lg: "85%", xl: "700px" }} 
              fontWeight="medium"
              lineHeight="tall"
              px={{ base: 2, sm: 0 }}
            >
              Descubre una variedad de contenido, desde programas en vivo hasta las últimas noticias y podcasts exclusivos
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={{ base: 4, sm: 5, md: 6, lg: 7 }}>
            {categories.map((category, index) => (
              <Box
                key={category.id}
                position="relative"
                sx={{
                  animation: `${float} ${4 + index}s ease-in-out infinite`,
                  willChange: 'transform'
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
                  sx={{
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    willChange: 'transform',
                    '&:hover': {
                      boxShadow: `0 28px 56px ${category.shadowColor}, 0 0 75px ${category.colorScheme}30`,
                      borderColor: category.hoverBorderColor,
                      transform: 'translateY(-10px) scale(1.02)'
                    }
                  }}
                  position="relative"
                  minH={{ base: "350px", sm: "380px", md: "400px", lg: "420px" }}
                  display="flex"
                  flexDirection="column"
                >
                  {/* Efectos decorativos */}
                  <Box
                    position="absolute"
                    top={-50}
                    right={-50}
                    w="100px"
                    h="100px"
                    bgGradient={`radial(circle, ${category.colorScheme}50, transparent)`}
                    borderRadius="full"
                    opacity={0.15}
                    sx={{
                      animation: `${pulse} 3s ease-in-out infinite`,
                      willChange: 'transform'
                    }}
                  />
                  <Box
                    position="absolute"
                    bottom={-30}
                    left={-30}
                    w="70px"
                    h="70px"
                    bgGradient={`radial(circle, ${category.colorScheme}40, transparent)`}
                    borderRadius="full"
                    opacity={0.2}
                    sx={{
                      animation: `${float} 6s ease-in-out infinite`,
                      willChange: 'transform'
                    }}
                  />

                  <CardBody p={{ base: 3, sm: 4, md: 5, lg: 6 }} position="relative" flex="1" display="flex" flexDirection="column" justifyContent="space-between">
                    <VStack spacing={{ base: 3, sm: 4, md: 5 }} align="center" flex="1">
                      {/* Icono principal con efectos */}
                      <Box
                        position="relative"
                        sx={{
                          transition: 'transform 0.3s ease',
                          willChange: 'transform',
                          '&:hover': {
                            transform: 'scale(1.1) rotate(8deg)'
                          }
                        }}
                      >
                        <Box
                          p={{ base: 3, sm: 4, md: 5, lg: 6 }}
                          borderRadius={{ base: "lg", sm: "xl", md: "2xl" }}
                          bgGradient={category.gradient}
                          color="white"
                          boxShadow={`0 12px 32px ${category.shadowColor}, 0 0 50px ${category.colorScheme}50`}
                          sx={{
                            animation: `${pulse} 2s ease-in-out infinite`,
                            willChange: 'transform',
                            transition: 'box-shadow 0.3s ease',
                            '&:hover': {
                              boxShadow: `0 20px 50px ${category.shadowColor}, 0 0 80px ${category.colorScheme}70`
                            }
                          }}
                          border={{ base: "2px solid", md: "3px solid" }}
                          borderColor="rgba(255, 255, 255, 0.3)"
                        >
                          <Icon as={category.icon} boxSize={{ base: 7, sm: 8, md: 9, lg: 10 }} />
                        </Box>
                        
                        {/* Indicador de estado */}
                        <Box
                          position="absolute"
                          top={-2}
                          right={-2}
                          w="5"
                          h="5"
                          bg={category.indicatorColor}
                          borderRadius="full"
                          border="3px solid white"
                          sx={{
                            animation: `${glow} 2s ease-in-out infinite`,
                            willChange: 'box-shadow'
                          }}
                        />
                      </Box>

                      {/* Contenido */}
                      <VStack spacing={{ base: 2.5, sm: 3 }} textAlign="center" flex="1" justifyContent="center">
                        <Heading size={{ base: "md", sm: "lg", md: "xl" }} bgGradient={category.textGradient} bgClip="text" fontWeight="black">
                          {category.title}
                        </Heading>
                        <Text color={textColor} fontSize={{ base: "xs", sm: "sm", md: "md" }} lineHeight="1.6" fontWeight="medium">
                          {category.description}
                        </Text>
                        
                        {/* Estadísticas */}
                        <HStack spacing={{ base: 2.5, sm: 3, md: 4 }} mt={2} flexWrap="wrap" justify="center">
                          <VStack spacing={0.5}>
                            <Icon as={FiStar} boxSize={{ base: 3, sm: 3.5, md: 4 }} color={brandOrange} />
                            <Text fontSize={{ base: "2xs", sm: "xs" }} fontWeight="bold" color="gray.700">
                              4.8
                            </Text>
                          </VStack>
                          <VStack spacing={0.5}>
                            <Icon as={FiTrendingUp} boxSize={{ base: 3, sm: 3.5, md: 4 }} color={brandRed} />
                            <Text fontSize={{ base: "2xs", sm: "xs" }} fontWeight="bold" color="gray.700">
                              Trending
                            </Text>
                          </VStack>
                          <VStack spacing={0.5}>
                            <Icon as={FiZap} boxSize={{ base: 3, sm: 3.5, md: 4 }} color={brandOrange} />
                            <Text fontSize={{ base: "2xs", sm: "xs" }} fontWeight="bold" color="gray.700">
                              Live
                            </Text>
                          </VStack>
                        </HStack>
                      </VStack>
                    </VStack>

                    {/* Botón de acción */}
                    <Button 
                      size={{ base: "sm", sm: "md", md: "lg" }}
                      bgGradient={category.gradient}
                      color="white"
                      sx={{
                        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                        willChange: 'transform',
                        '&:hover': {
                          bgGradient: category.gradient,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 12px 28px ${category.shadowColor}`
                        }
                      }}
                      _active={{
                        transform: 'translateY(0px)'
                      }}
                      rightIcon={<Icon as={FiArrowRight} />}
                      onClick={() => handleCategoryClick(category.title)}
                      borderRadius={{ base: "lg", md: "xl" }}
                      fontWeight="bold"
                      px={{ base: 5, sm: 6, md: 8 }}
                      py={{ base: 3, sm: 4, md: 5 }}
                      mt={{ base: 3, sm: 4 }}
                      fontSize={{ base: "xs", sm: "sm", md: "md" }}
                      boxShadow={`0 8px 20px ${category.shadowColor}`}
                      w="full"
                    >
                      {category.title.includes('Programas') ? 'Ver Programas' : 
                       category.title.includes('Noticias') ? 'Leer Noticias' : 
                       'Escuchar Podcasts'}
                    </Button>
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

export default CategoriesSection
