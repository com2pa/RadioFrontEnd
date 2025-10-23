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
  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
  50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
`

const CategoriesSection = () => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const accentColor = useColorModeValue('blue.500', 'blue.300')
  const toast = useToast()

  const categories = [
    {
      id: 1,
      title: "Programas en Vivo",
      description: "Sintoniza tus programas favoritos con nuestros locutores en directo. Música, noticias y entretenimiento 24/7.",
      icon: FiMic,
      colorScheme: "purple",
      gradient: "linear(135deg, purple.500, purple.700, pink.600)",
      textGradient: "linear(to-r, purple.600, pink.600)",
      indicatorColor: "green.400",
      borderColor: "purple.100",
      hoverBorderColor: "purple.200",
      shadowColor: "rgba(147, 51, 234, 0.3)"
    },
    {
      id: 2,
      title: "Últimas Noticias",
      description: "Mantente informado con los titulares más relevantes del día. Noticias locales, nacionales e internacionales.",
      icon: FiRss,
      colorScheme: "teal",
      gradient: "linear(135deg, teal.500, teal.700, cyan.600)",
      textGradient: "linear(to-r, teal.600, cyan.600)",
      indicatorColor: "blue.400",
      borderColor: "teal.100",
      hoverBorderColor: "teal.200",
      shadowColor: "rgba(20, 184, 166, 0.3)"
    },
    {
      id: 3,
      title: "Nuestros Podcasts",
      description: "Explora nuestra biblioteca de podcasts exclusivos y a la carta. Contenido especializado para todos los gustos.",
      icon: FiHeadphones,
      colorScheme: "orange",
      gradient: "linear(135deg, orange.500, orange.700, red.600)",
      textGradient: "linear(to-r, orange.600, red.600)",
      indicatorColor: "yellow.400",
      borderColor: "orange.100",
      hoverBorderColor: "orange.200",
      shadowColor: "rgba(251, 146, 60, 0.3)"
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
      bgGradient="linear(to-b, white, gray.50)"
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
        bgGradient="radial(circle, blue.100, transparent)"
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
        bgGradient="radial(circle, purple.100, transparent)"
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
              bg="blue.500"
              color="white"
              fontWeight="bold"
            >
              ✨ CATEGORÍAS
            </Badge>
            <Heading 
              size={{ base: "xl", md: "2xl", lg: "3xl" }}
              fontWeight="black"
              bgGradient="linear(to-r, blue.600, purple.600, pink.600)"
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
                    bgGradient={`radial(circle, ${category.colorScheme}.300, transparent)`}
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
                    bgGradient={`radial(circle, ${category.colorScheme}.200, transparent)`}
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
                          borderColor={`${category.colorScheme}.300`}
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
                            <Icon as={FiStar} boxSize={{ base: 3, md: 4 }} color="yellow.500" />
                            <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" color="gray.700">
                              4.8
                            </Text>
                          </VStack>
                          <VStack spacing={1}>
                            <Icon as={FiTrendingUp} boxSize={{ base: 3, md: 4 }} color="green.500" />
                            <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" color="gray.700">
                              Trending
                            </Text>
                          </VStack>
                          <VStack spacing={1}>
                            <Icon as={FiZap} boxSize={{ base: 3, md: 4 }} color="orange.500" />
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
