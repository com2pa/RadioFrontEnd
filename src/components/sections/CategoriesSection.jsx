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
  FiRadio,
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
      bg="transparent"
      position="relative"
      overflow="hidden"
    >
      {/* Marcas de agua de radio - Fondo decorativo en espacios vacíos */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        zIndex={0}
        pointerEvents="none"
        opacity={0.08}
      >
        {/* Onda de radio - Área vacía superior izquierda (fuera de las cards) */}
        <Box
          position="absolute"
          top={{ base: "3%", md: "2%" }}
          left={{ base: "3%", md: "2%" }}
          transform="rotate(-15deg)"
        >
            <Icon 
              as={FiRss} 
              boxSize={{ base: "50px", sm: "60px", md: "70px", lg: "80px" }}
              color="#B19CD9"
              opacity={0.4}
            />
        </Box>

        {/* Micrófono - Área vacía superior derecha (fuera de las cards) */}
        <Box
          position="absolute"
          top={{ base: "3%", md: "2%" }}
          right={{ base: "3%", md: "2%" }}
          transform="rotate(15deg)"
        >
            <Icon 
              as={FiMic} 
              boxSize={{ base: "50px", sm: "60px", md: "70px", lg: "80px" }}
              color="#B19CD9"
              opacity={0.4}
            />
        </Box>

        {/* Onda de radio - Área vacía inferior derecha (fuera de las cards) */}
        <Box
          position="absolute"
          bottom={{ base: "3%", md: "2%" }}
          right={{ base: "3%", md: "2%" }}
          transform="rotate(-15deg)"
        >
            <Icon 
              as={FiRss} 
              boxSize={{ base: "50px", sm: "60px", md: "70px", lg: "80px" }}
              color="#B19CD9"
              opacity={0.4}
            />
        </Box>

        {/* Marcas de agua verticales - Panel lateral izquierdo */}
        <VStack
          position="absolute"
          left={{ base: "2%", md: "1%" }}
          top="50%"
          transform="translateY(-50%)"
          spacing={{ base: 10, sm: 12, md: 14 }}
          align="center"
          zIndex={1}
        >
          {/* Onda de sonido morada - Parte superior */}
          <Box
            w={{ base: "50px", sm: "60px", md: "70px" }}
            h={{ base: "30px", sm: "35px", md: "40px" }}
            position="relative"
            opacity={0.6}
          >
            <svg width="100%" height="100%" viewBox="0 0 100 50" preserveAspectRatio="none">
              <path
                d="M 0 25 Q 12.5 10, 25 25 T 50 25 T 75 25 T 100 25"
                stroke="#B19CD9"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 0 25 Q 12.5 40, 25 25 T 50 25 T 75 25 T 100 25"
                stroke="#B19CD9"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </Box>

          {/* Torre de transmisión morada - Parte inferior */}
          <VStack spacing={2} align="center" opacity={0.6}>
            <Icon 
              as={FiRadio} 
              boxSize={{ base: "40px", sm: "50px", md: "60px" }}
              color="#B19CD9"
            />
            <Box
              position="relative"
              w={{ base: "30px", sm: "40px", md: "50px" }}
              h={{ base: "20px", sm: "25px", md: "30px" }}
            >
              {/* Ondas de radio */}
              <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                w="100%"
                h="100%"
              >
                <svg width="100%" height="100%" viewBox="0 0 30 20" preserveAspectRatio="xMidYMid meet">
                  <path
                    d="M 15 10 Q 15 5, 20 10 Q 15 15, 15 10"
                    stroke="#B19CD9"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M 15 10 Q 15 2, 25 10 Q 15 18, 15 10"
                    stroke="#B19CD9"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M 15 10 Q 15 0, 30 10 Q 15 20, 15 10"
                    stroke="#B19CD9"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </Box>
            </Box>
          </VStack>
        </VStack>

        {/* Marcas de agua verticales - Panel lateral derecho */}
        <VStack
          position="absolute"
          right={{ base: "2%", md: "1%" }}
          top="50%"
          transform="translateY(-50%)"
          spacing={{ base: 10, sm: 12, md: 14 }}
          align="center"
          zIndex={1}
        >
          {/* Onda de sonido verde claro - Parte superior */}
          <Box
            w={{ base: "50px", sm: "60px", md: "70px" }}
            h={{ base: "30px", sm: "35px", md: "40px" }}
            position="relative"
            opacity={0.6}
          >
            <svg width="100%" height="100%" viewBox="0 0 100 50" preserveAspectRatio="none">
              <path
                d="M 0 25 Q 12.5 10, 25 25 T 50 25 T 75 25 T 100 25"
                stroke="#40E0D0"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M 0 25 Q 12.5 40, 25 25 T 50 25 T 75 25 T 100 25"
                stroke="#40E0D0"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </Box>

          {/* Torre de transmisión morada - Parte inferior */}
          <VStack spacing={2} align="center" opacity={0.6}>
            <Icon 
              as={FiRadio} 
              boxSize={{ base: "40px", sm: "50px", md: "60px" }}
              color="#B19CD9"
            />
            <Box
              position="relative"
              w={{ base: "30px", sm: "40px", md: "50px" }}
              h={{ base: "20px", sm: "25px", md: "30px" }}
            >
              {/* Ondas de radio */}
              <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                w="100%"
                h="100%"
              >
                <svg width="100%" height="100%" viewBox="0 0 30 20" preserveAspectRatio="xMidYMid meet">
                  <path
                    d="M 15 10 Q 15 5, 20 10 Q 15 15, 15 10"
                    stroke="#B19CD9"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M 15 10 Q 15 2, 25 10 Q 15 18, 15 10"
                    stroke="#B19CD9"
                    strokeWidth="2"
                    fill="none"
                  />
                  <path
                    d="M 15 10 Q 15 0, 30 10 Q 15 20, 15 10"
                    stroke="#B19CD9"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </Box>
            </Box>
          </VStack>
        </VStack>
      </Box>

      <Container maxW="container.xl" position="relative" zIndex={2} px={{ base: 4, sm: 6, md: 8 }}>
        <VStack spacing={{ base: 8, sm: 10, md: 12 }} align="stretch">
          {/* Header */}
          <VStack spacing={{ base: 3, sm: 4 }} textAlign="center" maxW="800px" mx="auto">
            <Flex 
              align="center" 
              justify="center" 
              position="relative"
              w="full"
              gap={{ base: 4, sm: 6, md: 8 }}
            >
              {/* Onda de sonido izquierda */}
              <Box
                position="relative"
                display={{ base: "none", sm: "flex" }}
                alignItems="flex-end"
                h={{ base: "40px", sm: "50px", md: "60px" }}
                gap="3px"
              >
                {[30, 60, 45, 80, 35, 70, 50, 65].map((height, i) => (
                  <Box
                    key={i}
                    w="4px"
                    h={`${height}%`}
                    bgGradient="linear(to-b, #B19CD9, #40E0D0)"
                    borderRadius="full"
                    opacity={0.7}
                  />
                ))}
              </Box>
              
              <Heading 
                size={{ base: "lg", sm: "xl", md: "2xl" }}
                fontWeight="bold"
                color={textColor}
                lineHeight="shorter"
              >
                Explora Nuestro Contenido
              </Heading>
              
              {/* Onda de sonido derecha */}
              <Box
                position="relative"
                display={{ base: "none", sm: "flex" }}
                alignItems="flex-end"
                h={{ base: "40px", sm: "50px", md: "60px" }}
                gap="3px"
              >
                {[30, 60, 45, 80, 35, 70, 50, 65].map((height, i) => (
                  <Box
                    key={i}
                    w="4px"
                    h={`${height}%`}
                    bgGradient="linear(to-b, #B19CD9, #40E0D0)"
                    borderRadius="full"
                    opacity={0.7}
                  />
                ))}
              </Box>
            </Flex>
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
                  bg={brandDarkGray}
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
                    bg="rgba(0,0,0,0.5)"
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

                    {/* Divisor */}
                    <Divider
                      borderColor={brandRed}
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
                            fontWeight="medium"
                          >
                            {stat.label}
                          </Text>
                        </VStack>
                      ))}
                    </SimpleGrid>

                    {/* Botón de acción */}
                    <Button
                      size={{ base: "sm", sm: "sm" }}
                      bg={brandRed}
                      color={brandWhite}
                      fontWeight="bold"
                      borderRadius="md"
                      py={{ base: 4, sm: 4 }}
                      fontSize={{ base: "xs", sm: "sm" }}
                      _hover={{
                        bg: '#C00000',
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
