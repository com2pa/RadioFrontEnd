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
  Heading,
  Icon,
  useColorModeValue,
  SimpleGrid,
  Badge,
  useBreakpointValue
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

// Animaciones
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(229, 0, 0, 0.3); }
  50% { box-shadow: 0 0 40px rgba(229, 0, 0, 0.6); }
`

const CategoriesSection = () => {
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

  const categories = [
    {
      id: 1,
      title: "Programas en Vivo",
      description: "Sintoniza tus programas favoritos con nuestros locutores en directo. Música, noticias y entretenimiento 24/7.",
      icon: FiMic,
      colorScheme: brandRed,
      gradient: `linear(135deg, ${brandRed}, #C00000)`,
      textGradient: `linear(to-r, ${brandRed}, #C00000)`,
      indicatorColor: brandOrange,
      borderColor: brandRed + '80',
      hoverBorderColor: brandRed,
      shadowColor: "rgba(229, 0, 0, 0.3)"
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
      borderColor: brandOrange + '80',
      hoverBorderColor: brandOrange,
      shadowColor: "rgba(255, 165, 0, 0.3)"
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
      borderColor: brandRed + '80',
      hoverBorderColor: brandRed,
      shadowColor: "rgba(229, 0, 0, 0.3)"
    }
  ]

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
      py={{ base: 12, md: 16, lg: 20 }} 
      bgGradient={`linear(to-b, ${brandWhite}, ${brandLightGray}40)`}
      position="relative"
      overflow="hidden"
    >
      {/* Efectos de fondo animados */}
      <Box
        position="absolute"
        top="20%"
        left="10%"
        w="300px"
        h="300px"
        bgGradient={`radial(circle, rgba(229, 0, 0, 0.1), transparent)`}
        borderRadius="full"
        opacity={0.4}
        animation={`${float} 10s ease-in-out infinite`}
      />
      <Box
        position="absolute"
        bottom="10%"
        right="10%"
        w="250px"
        h="250px"
        bgGradient={`radial(circle, rgba(255, 165, 0, 0.1), transparent)`}
        borderRadius="full"
        opacity={0.4}
        animation={`${float} 12s ease-in-out infinite reverse`}
      />

      <Container maxW="container.xl" position="relative" zIndex={1} px={{ base: 4, md: 6, lg: 8 }}>
        <VStack spacing={{ base: 12, md: 14, lg: 16 }} align="stretch">
          {/* Header mejorado */}
          <VStack spacing={{ base: 4, md: 6 }} textAlign="center">
            <Badge 
              colorScheme="blue" 
              fontSize={{ base: "xs", md: "sm" }}
              px={{ base: 3, md: 4 }}
              py={{ base: 1, md: 2 }}
              borderRadius="full"
              bg={brandRed}
              color={brandWhite}
              fontWeight="bold"
            >
              ✨ CATEGORÍAS
            </Badge>
            <Heading 
              size={{ base: "xl", md: "2xl", lg: "3xl" }}
              fontWeight="black"
              bgGradient={`linear(to-r, ${brandRed}, ${brandOrange})`}
              bgClip="text"
              lineHeight="shorter"
            >
              Explora Nuestras Categorías
            </Heading>
            <Text 
              fontSize={{ base: "md", md: "lg", lg: "xl" }} 
              color={textColor} 
              maxW={{ base: "90%", md: "80%", lg: "700px" }} 
              fontWeight="medium"
              lineHeight="tall"
            >
              Descubre una variedad de contenido, desde programas en vivo hasta las últimas noticias y podcasts exclusivos
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, sm: 2, lg: 3 }} spacing={{ base: 4, md: 6, lg: 8 }}>
            {categories.map((category, index) => (
              <Box
                key={category.id}
                position="relative"
                _hover={{ 
                  transform: 'translateY(-15px) scale(1.03)', 
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                animation={`${float} ${4 + index}s ease-in-out infinite`}
              >
                {/* Efectos de fondo */}
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  bgGradient={category.gradient}
                  borderRadius="3xl"
                  opacity={0.1}
                  _hover={{ opacity: 0.2 }}
                  transition="opacity 0.4s"
                />
                
                <Card 
                  bg={cardBg} 
                  boxShadow="0 25px 50px rgba(0,0,0,0.15)"
                  borderRadius="3xl"
                  overflow="hidden"
                  border="2px solid"
                  borderColor={category.borderColor}
                  _hover={{ 
                    boxShadow: `0 40px 80px ${category.shadowColor}`,
                    borderColor: category.hoverBorderColor
                  }}
                  position="relative"
                  backdropFilter="blur(15px)"
                  minH={{ base: "400px", md: "420px", lg: "450px" }}
                  display="flex"
                  flexDirection="column"
                >
                  {/* Efectos decorativos */}
                  <Box
                    position="absolute"
                    top={-60}
                    right={-60}
                    w="120px"
                    h="120px"
                    bgGradient={`radial(circle, ${category.colorScheme}60, transparent)`}
                    borderRadius="full"
                    opacity={0.2}
                    animation={`${pulse} 3s ease-in-out infinite`}
                  />
                  <Box
                    position="absolute"
                    bottom={-40}
                    left={-40}
                    w="80px"
                    h="80px"
                    bgGradient={`radial(circle, ${category.colorScheme}40, transparent)`}
                    borderRadius="full"
                    opacity={0.3}
                    animation={`${float} 6s ease-in-out infinite`}
                  />

                  <CardBody p={{ base: 4, md: 6, lg: 8 }} position="relative" flex="1" display="flex" flexDirection="column" justifyContent="space-between">
                    <VStack spacing={{ base: 4, md: 5, lg: 6 }} align="center" flex="1">
                      {/* Icono principal con efectos */}
                      <Box
                        position="relative"
                        _hover={{ transform: 'scale(1.15) rotate(10deg)' }}
                        transition="transform 0.4s ease"
                      >
                        <Box
                          p={{ base: 4, md: 5, lg: 6 }}
                          borderRadius={{ base: "xl", md: "2xl" }}
                          bgGradient={category.gradient}
                          color="white"
                          boxShadow={`0 15px 40px ${category.shadowColor}`}
                          _hover={{
                            boxShadow: `0 25px 60px ${category.shadowColor}`
                          }}
                          animation={`${pulse} 2s ease-in-out infinite`}
                        >
                          <Icon as={category.icon} boxSize={{ base: 8, md: 9, lg: 10 }} />
                        </Box>
                        
                        {/* Indicador de estado */}
                        <Box
                          position="absolute"
                          top={-3}
                          right={-3}
                          w="6"
                          h="6"
                          bg={category.indicatorColor}
                          borderRadius="full"
                          border="3px solid white"
                          animation={`${glow} 2s ease-in-out infinite`}
                        />
                        
                        {/* Efectos de partículas */}
                        <Box
                          position="absolute"
                          top="50%"
                          left="50%"
                          transform="translate(-50%, -50%)"
                          w="100px"
                          h="100px"
                          borderRadius="full"
                          border="2px solid"
                          borderColor={`${category.colorScheme}60`}
                          opacity={0.3}
                          animation={`${pulse} 3s ease-in-out infinite`}
                        />
                      </Box>

                      {/* Contenido */}
                      <VStack spacing={{ base: 3, md: 4 }} textAlign="center" flex="1" justifyContent="center">
                        <Heading size={{ base: "lg", md: "xl" }} bgGradient={category.textGradient} bgClip="text" fontWeight="black">
                          {category.title}
                        </Heading>
                        <Text color={textColor} fontSize={{ base: "sm", md: "md" }} lineHeight="1.7" fontWeight="medium">
                          {category.description}
                        </Text>
                        
                        {/* Estadísticas */}
                        <HStack spacing={{ base: 3, md: 4, lg: 6 }} mt={2} flexWrap="wrap" justify="center">
                          <VStack spacing={1}>
                            <Icon as={FiStar} boxSize={{ base: 3, md: 4 }} color={brandOrange} />
                            <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" color="gray.700">
                              4.8
                            </Text>
                          </VStack>
                          <VStack spacing={1}>
                            <Icon as={FiTrendingUp} boxSize={{ base: 3, md: 4 }} color={brandRed} />
                            <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" color="gray.700">
                              Trending
                            </Text>
                          </VStack>
                          <VStack spacing={1}>
                            <Icon as={FiZap} boxSize={{ base: 3, md: 4 }} color={brandOrange} />
                            <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" color="gray.700">
                              Live
                            </Text>
                          </VStack>
                        </HStack>
                      </VStack>
                    </VStack>

                    {/* Botón de acción mejorado */}
                    <Button 
                      size={{ base: "md", md: "lg" }}
                      bgGradient={category.gradient}
                      color="white"
                      _hover={{
                        bgGradient: category.gradient,
                        transform: 'translateY(-3px)',
                        boxShadow: `0 15px 35px ${category.shadowColor}`
                      }}
                      _active={{
                        transform: 'translateY(-1px)'
                      }}
                      rightIcon={<Icon as={FiArrowRight} />}
                      onClick={() => handleCategoryClick(category.title)}
                      borderRadius={{ base: "xl", md: "2xl" }}
                      fontWeight="bold"
                      px={{ base: 6, md: 8 }}
                      py={{ base: 4, md: 6 }}
                      mt={{ base: 4, md: 6 }}
                      fontSize={{ base: "sm", md: "lg" }}
                      boxShadow={`0 10px 25px ${category.shadowColor}`}
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
