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
  Image,
  Divider,
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { 
  FiMic,
  FiRss,
  FiHeadphones,
  FiStar,
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

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
  const brandOrange = '#FFA500'

  const textColor = useColorModeValue(brandDarkGray, brandLightGray)
  const cardBg = useColorModeValue('white', '#2d2d2d')
  const navigate = useNavigate()

  const categories = useMemo(() => [
    {
      id: 2,
      title: "ÚLTIMAS NOTICIAS",
      titleShort: "ÚLTIMAS NOTICIAS",
      icon: FiRss,
      badge: "ACTUALIZADO",
      badgeIcon: FiMic,
      rating: "4.8",
      stats: [
        { label: "Artículos", value: "100+" },
        { label: "Podcasts", value: "50+" }
      ],
      buttonText: "Leer Noticias",
      route: "/noticias",
      image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80" // Microphone image
    },
    {
      id: 3,
      title: "NUESTROS PODCASTS",
      titleShort: "NUESTROS PODCASTS",
      icon: FiHeadphones,
      badge: "DISPONIBLE",
      badgeIcon: FiHeadphones,
      rating: "4.8",
      stats: [
        { label: "Episodios", value: "100+" },
        { label: "Autores", value: "50+" }
      ],
      buttonText: "Escuchar Podcasts",
      route: "/podcasts",
      image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80" // Headphones image
    }
  ], [])

  const handleCategoryClick = (route) => {
    navigate(route)
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
          {/* Header */}
          <VStack spacing={{ base: 3, sm: 4 }} textAlign="center" maxW="800px" mx="auto">
            <Heading 
              size={{ base: "lg", sm: "xl", md: "2xl" }}
              fontWeight="bold"
              color={textColor}
              lineHeight="shorter"
            >
              Explora Nuestro Contenido
            </Heading>
          </VStack>

          {/* Grid de categorías - Diseño elegante con imágenes */}
          <SimpleGrid 
            columns={{ base: 1, md: 2 }} 
            spacing={{ base: 6, sm: 8, md: 8 }}
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
                boxShadow="0 8px 32px rgba(0, 0, 0, 0.12)"
                sx={{
                  animation: `${scaleIn} 0.5s ease-out ${index * 0.1}s both`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 16px 48px rgba(0, 0, 0, 0.2)',
                  }
                }}
                cursor="pointer"
              >
                {/* Sección superior con imagen de fondo */}
                <Box
                  position="relative"
                  h={{ base: "120px", sm: "140px", md: "160px" }}
                  overflow="hidden"
                  bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                >
                  {/* Imagen de fondo */}
                  <Image
                    src={category.image}
                    alt={category.title}
                    w="100%"
                    h="100%"
                    objectFit="cover"
                    opacity={0.8}
                    filter="brightness(0.7)"
                  />
                  
                  {/* Overlay oscuro para legibilidad */}
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))"
                  />

                    {/* Título superpuesto en la imagen */}
                    <Box
                      position="absolute"
                      top={{ base: 2, sm: 3, md: 4 }}
                      left={{ base: 2, sm: 3, md: 4 }}
                      zIndex={2}
                    >
                      <Heading
                        fontSize={{ base: "sm", sm: "md", md: "lg" }}
                        fontWeight="black"
                        color={brandWhite}
                        lineHeight="shorter"
                        textShadow="0 2px 10px rgba(0,0,0,0.5)"
                      >
                        {category.title.split(' ').slice(0, 2).join(' ')}
                        <br />
                        {category.title.split(' ').slice(2).join(' ')}
                      </Heading>
                    </Box>

                  {/* Badge de estado en esquina inferior izquierda */}
                  <Box
                    position="absolute"
                    bottom={{ base: 2, sm: 3, md: 4 }}
                    left={{ base: 3, sm: 4, md: 5 }}
                    zIndex={2}
                  >
                    <Badge
                      bg={brandWhite}
                      color={brandDarkGray}
                      px={{ base: 2, sm: 2.5 }}
                      py={{ base: 0.5, sm: 1 }}
                      borderRadius="md"
                      fontSize={{ base: "2xs", sm: "xs" }}
                      fontWeight="bold"
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <Icon as={category.badgeIcon} boxSize={{ base: 2.5, sm: 3 }} />
                      {category.badge}
                    </Badge>
                  </Box>

                  {/* Rating en esquina inferior derecha */}
                  <Box
                    position="absolute"
                    bottom={{ base: 2, sm: 3, md: 4 }}
                    right={{ base: 3, sm: 4, md: 5 }}
                    zIndex={2}
                  >
                    <HStack spacing={1}>
                      <Text
                        fontSize={{ base: "xs", sm: "sm" }}
                        fontWeight="bold"
                        color={brandWhite}
                        textShadow="0 2px 8px rgba(0,0,0,0.5)"
                      >
                        {category.rating}
                      </Text>
                      <Icon as={FiStar} boxSize={{ base: 3, sm: 4 }} color="#FFD700" />
                    </HStack>
                  </Box>
                </Box>

                {/* Sección inferior con contenido */}
                <CardBody p={{ base: 3, sm: 4, md: 5 }} bg={cardBg}>
                  <VStack spacing={2} align="stretch">
                    {/* Título y rating */}
                    <Flex justify="space-between" align="center">
                      <Heading
                        size={{ base: "sm", sm: "md" }}
                        fontWeight="bold"
                        color={textColor}
                      >
                        {category.titleShort}
                      </Heading>
                      <HStack spacing={1}>
                        <Text
                          fontSize={{ base: "xs", sm: "sm" }}
                          fontWeight="bold"
                          color={textColor}
                        >
                          {category.rating}
                        </Text>
                        <Icon as={FiStar} boxSize={{ base: 3, sm: 4 }} color="#FFD700" />
                      </HStack>
                    </Flex>

                    {/* Divisor con gradiente */}
                    <Divider
                      borderColor="transparent"
                      bgGradient={`linear(to-r, #667eea, ${brandRed})`}
                      h="2px"
                      borderRadius="full"
                    />

                    {/* Estadísticas */}
                    <SimpleGrid columns={2} spacing={2} py={1}>
                      {category.stats.map((stat, statIndex) => (
                        <VStack key={statIndex} spacing={0} align="center">
                          <Text
                            fontSize={{ base: "lg", sm: "xl", md: "2xl" }}
                            fontWeight="black"
                            color={textColor}
                            lineHeight="shorter"
                          >
                            {stat.value}
                          </Text>
                          <Text
                            fontSize={{ base: "2xs", sm: "2xs" }}
                            color={textColor}
                            opacity={0.7}
                            fontWeight="medium"
                          >
                            {stat.label}
                          </Text>
                        </VStack>
                      ))}
                    </SimpleGrid>

                    {/* Botón de acción con gradiente */}
                    <Button
                      size={{ base: "sm", sm: "sm" }}
                      bgGradient={`linear(135deg, ${brandRed}, ${brandOrange})`}
                      color={brandWhite}
                      fontWeight="bold"
                      borderRadius="md"
                      py={{ base: 4, sm: 4 }}
                      fontSize={{ base: "xs", sm: "sm" }}
                      _hover={{
                        bgGradient: `linear(135deg, #C00000, #FF8C00)`,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 24px ${brandRed}50`,
                      }}
                      transition="all 0.3s ease"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCategoryClick(category.route)
                      }}
                    >
                      {category.buttonText}
                    </Button>
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
