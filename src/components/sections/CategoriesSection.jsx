import React from 'react'
import {
  Box,
  Container,
  VStack,
  Text,
  Button,
  Card,
  CardBody,
  Heading,
  Icon,
  useColorModeValue,
  SimpleGrid
} from '@chakra-ui/react'
import { 
  FiMic,
  FiRss,
  FiHeadphones,
  FiArrowRight
} from 'react-icons/fi'
import { useToast } from '@chakra-ui/react'

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
    <Box py={16}>
      <Container maxW="container.xl">
        <VStack spacing={12} align="stretch">
          <VStack spacing={4} textAlign="center">
            <Heading size="xl" color={accentColor}>
              Explora Nuestras Categorías
            </Heading>
            <Text fontSize="lg" color={textColor} maxW="600px">
              Descubre una variedad de contenido, desde programas en vivo hasta las últimas noticias y podcasts exclusivos
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
            {categories.map((category) => (
              <Box
                key={category.id}
                position="relative"
                _hover={{ 
                  transform: 'translateY(-12px) scale(1.02)', 
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  bgGradient={category.gradient}
                  borderRadius="2xl"
                  opacity={0.1}
                  _hover={{ opacity: 0.2 }}
                  transition="opacity 0.3s"
                />
                <Card 
                  bg={cardBg} 
                  boxShadow="0 20px 40px rgba(0,0,0,0.1)"
                  borderRadius="2xl"
                  overflow="hidden"
                  border="1px solid"
                  borderColor={category.borderColor}
                  _hover={{ 
                    boxShadow: `0 30px 60px ${category.shadowColor}`,
                    borderColor: category.hoverBorderColor
                  }}
                  position="relative"
                  backdropFilter="blur(10px)"
                  minH="400px"
                  display="flex"
                  flexDirection="column"
                >
                  <Box
                    position="absolute"
                    top={-50}
                    right={-50}
                    w="100px"
                    h="100px"
                    bgGradient={`radial(circle, ${category.colorScheme}.300, transparent)`}
                    borderRadius="full"
                    opacity={0.1}
                  />
                  <CardBody p={6} position="relative" flex="1" display="flex" flexDirection="column" justifyContent="space-between">
                    <VStack spacing={4} align="center" flex="1">
                      <Box
                        position="relative"
                        _hover={{ transform: 'scale(1.1) rotate(5deg)' }}
                        transition="transform 0.3s ease"
                      >
                        <Box
                          p={4}
                          borderRadius="xl"
                          bgGradient={category.gradient}
                          color="white"
                          boxShadow={`0 10px 30px ${category.shadowColor}`}
                          _hover={{
                            boxShadow: `0 15px 40px ${category.shadowColor}`
                          }}
                        >
                          <Icon as={category.icon} boxSize={8} />
                        </Box>
                        <Box
                          position="absolute"
                          top={-2}
                          right={-2}
                          w="5"
                          h="5"
                          bg={category.indicatorColor}
                          borderRadius="full"
                          border="2px solid white"
                          animation="pulse 2s infinite"
                        />
                      </Box>
                      <VStack spacing={3} textAlign="center" flex="1" justifyContent="center">
                        <Heading size="lg" bgGradient={category.textGradient} bgClip="text">
                          {category.title}
                        </Heading>
                        <Text color={textColor} fontSize="sm" lineHeight="1.6" fontWeight="medium">
                          {category.description}
                        </Text>
                      </VStack>
                    </VStack>
                    <Button 
                      size="md"
                      bgGradient={category.gradient}
                      color="white"
                      _hover={{
                        bgGradient: category.gradient,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 10px 25px ${category.shadowColor}`
                      }}
                      _active={{
                        transform: 'translateY(0px)'
                      }}
                      rightIcon={<Icon as={FiArrowRight} />}
                      onClick={() => handleCategoryClick(category.title)}
                      borderRadius="xl"
                      fontWeight="bold"
                      px={6}
                      py={4}
                      mt={4}
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
