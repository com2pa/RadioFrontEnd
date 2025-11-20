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
  Flex,
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

// Animaciones optimizadas y sutiles
const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`

const scaleIn = keyframes`
  0% { 
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  100% { 
    opacity: 1;
    transform: scale(1) translateY(0);
  }
`

const CategoriesSection = () => {
  const brandRed = '#E50000'
  const brandWhite = '#FFFFFF'
  const brandDarkGray = '#333333'
  const brandLightGray = '#CCCCCC'

  const textColor = useColorModeValue(brandDarkGray, brandLightGray)
  const cardBg = useColorModeValue('white', '#2d2d2d')
  const borderColorValue = useColorModeValue('gray.200', 'gray.700')
  const toast = useToast()

  const categories = useMemo(() => [
    // {
    //   id: 1,
    //   title: "Programas en Vivo",
    //   description: "Sintoniza tus programas favoritos con nuestros locutores en directo",
    //   icon: FiMic,
    //   color: brandRed,
    //   count: "24/7",
    //   badge: "EN VIVO"
    // },
    {
      id: 2,
      title: "Últimas Noticias",
      description: "Mantente informado con los titulares más relevantes del día",
      icon: FiRss,
      color: brandRed,
      count: "50+",
      badge: "ACTUALIZADO"
    },
    {
      id: 3,
      title: "Nuestros Podcasts",
      description: "Explora nuestra biblioteca de podcasts exclusivos y a la carta",
      icon: FiHeadphones,
      color: brandRed,
      count: "100+",
      badge: "DISPONIBLE"
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
      py={{ base: 12, sm: 16, md: 20, lg: 24 }} 
      bg={brandLightGray}
      position="relative"
      overflow="hidden"
    >

      <Container maxW="container.xl" position="relative" zIndex={2} px={{ base: 4, sm: 6, md: 8 }}>
        <VStack spacing={{ base: 8, sm: 10, md: 12 }} align="stretch">
          {/* Header compacto y elegante */}
          <VStack spacing={{ base: 3, sm: 4 }} textAlign="center" maxW="800px" mx="auto">
            <Badge 
              fontSize={{ base: "xs", sm: "sm" }}
              px={4}
              py={1.5}
              borderRadius="full"
              bg={brandRed}
              color={brandWhite}
              fontWeight="bold"
              textTransform="uppercase"
              letterSpacing="wide"
            >
              Categorías
            </Badge>
            <Heading 
              size={{ base: "lg", sm: "xl", md: "2xl" }}
              fontWeight="bold"
              color={textColor}
              lineHeight="shorter"
            >
              Explora Nuestro Contenido
            </Heading>
            <Text 
              fontSize={{ base: "sm", sm: "md", md: "lg" }} 
              color={textColor} 
              opacity={0.8}
              maxW="600px"
              fontWeight="medium"
            >
              Descubre programas en vivo, noticias actualizadas y podcasts exclusivos
            </Text>
          </VStack>

          {/* Grid de categorías - Diseño compacto */}
          <SimpleGrid 
            columns={{ base: 1, md: 2, lg: 3 }} 
            spacing={{ base: 6, sm: 8, md: 6 }}
            maxW="1200px"
            mx="auto"
            w="full"
          >
            {categories.map((category, index) => (
              <Card
                key={category.id}
                bg={cardBg}
                borderRadius={{ base: "xl", md: "2xl" }}
                overflow="hidden"
                position="relative"
                border="1px solid"
                borderColor={borderColorValue}
                boxShadow="0 4px 20px rgba(0, 0, 0, 0.08)"
                sx={{
                  animation: `${scaleIn} 0.5s ease-out ${index * 0.1}s both`,
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 40px ${category.color}20, 0 0 0 1px ${category.color}30`,
                    borderColor: category.color,
                  }
                }}
                cursor="pointer"
                onClick={() => handleCategoryClick(category.title)}
              >
                {/* Barra superior con color */}
                <Box
                  h="4px"
                  bg={category.color}
                  position="relative"
                  overflow="hidden"
                  _before={{
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    bg: `${brandWhite}40`,
                    animation: `${shimmer} 3s infinite`,
                  }}
                />

                <CardBody p={{ base: 5, sm: 6, md: 6 }}>
                  <VStack spacing={4} align="stretch">
                    {/* Header del card con icono y badge */}
                    <Flex justify="space-between" align="flex-start">
                      <Box
                        p={3}
                        borderRadius="xl"
                        bg={category.color}
                        color={brandWhite}
                        boxShadow={`0 4px 16px ${category.color}30`}
                        sx={{
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.1) rotate(5deg)',
                            boxShadow: `0 8px 24px ${category.color}50`,
                          }
                        }}
                      >
                        <Icon as={category.icon} boxSize={{ base: 5, sm: 6 }} />
                      </Box>
                      <Badge
                        fontSize="2xs"
                        px={2.5}
                        py={1}
                        borderRadius="full"
                        bg={`${category.color}15`}
                        color={category.color}
                        fontWeight="bold"
                        textTransform="uppercase"
                        letterSpacing="wide"
                      >
                        {category.badge}
                      </Badge>
                    </Flex>

                    {/* Contenido */}
                    <VStack spacing={2} align="stretch" flex={1}>
                      <Heading 
                        size={{ base: "md", sm: "lg" }}
                        color={textColor}
                        fontWeight="bold"
                        lineHeight="shorter"
                      >
                        {category.title}
                      </Heading>
                      <Text 
                        fontSize={{ base: "sm", sm: "md" }}
                        color={textColor}
                        opacity={0.7}
                        lineHeight="tall"
                        noOfLines={2}
                      >
                        {category.description}
                      </Text>
                    </VStack>

                    {/* Footer con estadísticas y botón */}
                    <VStack spacing={3} align="stretch" pt={2}>
                        {/* Estadísticas compactas */}
                        <HStack spacing={4} justify="space-between">
                          <HStack spacing={1.5}>
                            <Icon as={FiStar} boxSize={4} color={category.color} />
                            <Text fontSize="xs" fontWeight="bold" color={textColor} opacity={0.8}>
                              4.8
                            </Text>
                          </HStack>
                          <HStack spacing={1.5}>
                            <Icon as={FiTrendingUp} boxSize={4} color={category.color} />
                            <Text fontSize="xs" fontWeight="bold" color={textColor} opacity={0.8}>
                              Trending
                            </Text>
                          </HStack>
                          <HStack spacing={1.5}>
                            <Icon as={FiZap} boxSize={4} color={category.color} />
                            <Text fontSize="xs" fontWeight="bold" color={textColor} opacity={0.8}>
                              {category.count}
                            </Text>
                          </HStack>
                        </HStack>

                      {/* Botón de acción */}
                      <Button
                        size="sm"
                        variant="ghost"
                        colorScheme="gray"
                        rightIcon={<Icon as={FiArrowRight} />}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCategoryClick(category.title)
                        }}
                        color={category.color}
                        fontWeight="semibold"
                        _hover={{
                          bg: category.color,
                          color: brandWhite,
                          fontWeight: 'bold',
                          transform: 'translateX(4px) scale(1.02)',
                          boxShadow: `0 4px 12px ${category.color}40`,
                          '& svg': {
                            transform: 'translateX(4px)',
                          }
                        }}
                        transition="all 0.15s ease"
                        justifyContent="space-between"
                        px={0}
                        h="auto"
                        py={2}
                      >
                        {category.title.includes('Programas') ? 'Ver Programas' : 
                         category.title.includes('Noticias') ? 'Leer Noticias' : 
                         'Escuchar Podcasts'}
                      </Button>
                    </VStack>
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

export default CategoriesSection
