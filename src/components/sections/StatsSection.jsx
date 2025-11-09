import React, { useMemo } from 'react'
import {
  Box,
  Container,
  VStack,
  HStack,
  Text,
  Card,
  Icon,
  useColorModeValue,
  SimpleGrid,
  Badge,
  Heading,
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { 
  FiUsers,
  FiRadio,
  FiMusic,
  FiAward,
  FiTrendingUp,
} from 'react-icons/fi'

// Animaciones optimizadas
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-6px); }
`

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.08); }
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

const StatsSection = () => {
  const brandRed = '#E50000'
  const brandDarkGray = '#333333'
  const brandWhite = '#FFFFFF'
  const brandLightGray = '#CCCCCC'
  const brandOrange = '#FFA500'

  const textColor = useColorModeValue(brandDarkGray, brandLightGray)
  const listeners = 1247

  const stats = useMemo(() => [
    {
      icon: FiUsers,
      value: listeners.toLocaleString(),
      label: "Oyentes en Vivo",
      color: brandRed,
      gradient: `linear(135deg, ${brandRed}, #C00000)`,
      bgGradient: `linear(135deg, rgba(229, 0, 0, 0.08), rgba(229, 0, 0, 0.15))`,
      borderColor: brandRed + '70',
      shadowColor: "rgba(229, 0, 0, 0.25)",
      trend: "+12%",
      trendColor: brandOrange
    },
    {
      icon: FiRadio,
      value: "24/7",
      label: "Transmisión Continua",
      color: brandOrange,
      gradient: `linear(135deg, ${brandOrange}, #FF8C00)`,
      bgGradient: `linear(135deg, rgba(255, 165, 0, 0.08), rgba(255, 165, 0, 0.15))`,
      borderColor: brandOrange + '70',
      shadowColor: "rgba(255, 165, 0, 0.25)",
      trend: "Live",
      trendColor: brandRed
    },
    {
      icon: FiMusic,
      value: "50+",
      label: "Canciones por Hora",
      color: brandRed,
      gradient: `linear(135deg, ${brandRed}, #C00000)`,
      bgGradient: `linear(135deg, rgba(229, 0, 0, 0.08), rgba(229, 0, 0, 0.15))`,
      borderColor: brandRed + '70',
      shadowColor: "rgba(229, 0, 0, 0.25)",
      trend: "Hot",
      trendColor: brandOrange
    },
    {
      icon: FiAward,
      value: "15+",
      label: "Años de Experiencia",
      color: brandOrange,
      gradient: `linear(135deg, ${brandOrange}, #FF8C00)`,
      bgGradient: `linear(135deg, rgba(255, 165, 0, 0.08), rgba(255, 165, 0, 0.15))`,
      borderColor: brandOrange + '70',
      shadowColor: "rgba(255, 165, 0, 0.25)",
      trend: "Pro",
      trendColor: brandRed
    }
  ], [listeners])

  return (
    <Box 
      py={{ base: 10, sm: 12, md: 14, lg: 16 }}
      bgGradient={`linear(to-b, ${brandLightGray}40, ${brandWhite})`}
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
        top="8%"
        left="-4%"
        w={{ base: "200px", md: "400px", lg: "600px" }}
        h={{ base: "200px", md: "400px", lg: "600px" }}
        bgGradient={`radial(circle, ${brandRed}50, ${brandOrange}25, transparent)`}
        filter="blur(70px)"
        opacity={0.5}
        sx={{
          animation: `${float} 20s ease-in-out infinite`,
          willChange: 'transform'
        }}
        zIndex={1}
      />
      <Box
        position="absolute"
        bottom="8%"
        right="-4%"
        w={{ base: "180px", md: "350px", lg: "500px" }}
        h={{ base: "180px", md: "350px", lg: "500px" }}
        bgGradient={`radial(circle, ${brandOrange}50, ${brandRed}25, transparent)`}
        filter="blur(80px)"
        opacity={0.5}
        sx={{
          animation: `${float} 25s ease-in-out infinite reverse`,
          willChange: 'transform'
        }}
        zIndex={1}
      />

      <Container maxW="container.xl" position="relative" zIndex={1} px={{ base: 2, sm: 3, md: 4, lg: 6, xl: 8 }}>
        <VStack spacing={{ base: 6, sm: 8, md: 10, lg: 12 }}>
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
              📊 ESTADÍSTICAS
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
              Números que Hablan
            </Heading>
            <Text 
              fontSize={{ base: "xs", sm: "sm", md: "md", lg: "lg" }} 
              color={textColor} 
              maxW={{ base: "98%", sm: "95%", md: "90%", lg: "85%", xl: "600px" }} 
              fontWeight="medium"
              lineHeight="tall"
              px={{ base: 2, sm: 0 }}
            >
              Descubre por qué somos la radio más escuchada de Barquisimeto
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={{ base: 3, sm: 4, md: 5, lg: 6 }}>
            {stats.map((stat, index) => (
              <Card 
                key={index} 
                bg="rgba(255, 255, 255, 0.12)"
                backdropFilter="blur(20px)"
                border={{ base: "1px solid", md: "2px solid" }}
                borderColor="rgba(255, 255, 255, 0.25)"
                textAlign="center" 
                p={{ base: 3, sm: 4, md: 5, lg: 6 }}
                borderRadius={{ base: "lg", sm: "xl", md: "2xl" }}
                boxShadow={`0 12px 28px ${stat.shadowColor}, inset 0 1px 0 rgba(255, 255, 255, 0.15)`}
                sx={{
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  willChange: 'transform',
                  animation: `${float} ${3 + index}s ease-in-out infinite`,
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.04)',
                    boxShadow: `0 20px 40px ${stat.shadowColor}, 0 0 50px ${stat.color}30`,
                    borderColor: stat.color
                  }
                }}
                position="relative"
                overflow="hidden"
              >
                {/* Efectos decorativos */}
                <Box
                  position="absolute"
                  top={-15}
                  right={-15}
                  w="60px"
                  h="60px"
                  bgGradient={`radial(circle, ${stat.color}35, transparent)`}
                  borderRadius="full"
                  opacity={0.25}
                  sx={{
                    animation: `${pulse} 4s ease-in-out infinite`,
                    willChange: 'transform'
                  }}
                />

                <VStack spacing={{ base: 3, sm: 4 }} position="relative" zIndex={1}>
                  {/* Icono con efectos */}
                  <Box
                    position="relative"
                    sx={{
                      transition: 'transform 0.3s ease',
                      willChange: 'transform',
                      '&:hover': {
                        transform: 'scale(1.15) rotate(8deg)'
                      }
                    }}
                  >
                    <Box
                      p={{ base: 3, sm: 4, md: 5 }}
                      borderRadius={{ base: "xl", md: "2xl" }}
                      bgGradient={stat.gradient}
                      color="white"
                      boxShadow={`0 12px 30px ${stat.shadowColor}, 0 0 40px ${stat.color}50`}
                      sx={{
                        animation: `${pulse} 2s ease-in-out infinite`,
                        willChange: 'transform'
                      }}
                      border="3px solid"
                      borderColor="rgba(255, 255, 255, 0.3)"
                    >
                      <Icon as={stat.icon} boxSize={{ base: 6, sm: 7, md: 8 }} />
                    </Box>
                    
                    {/* Indicador de tendencia */}
                    <Box
                      position="absolute"
                      top={-2}
                      right={-2}
                      w="5"
                      h="5"
                      bg={stat.trendColor}
                      borderRadius="full"
                      border="2px solid white"
                      sx={{
                        animation: `${glow} 2s ease-in-out infinite`,
                        willChange: 'box-shadow'
                      }}
                    />
                  </Box>

                  {/* Valor principal */}
                  <VStack spacing={1.5}>
                    <Text 
                      fontSize={{ base: "xl", sm: "2xl", md: "3xl", lg: "4xl" }}
                      fontWeight="black" 
                      bgGradient={stat.gradient}
                      bgClip="text"
                      lineHeight="1"
                    >
                      {stat.value}
                    </Text>
                    <Text fontSize={{ base: "sm", sm: "md", md: "lg" }} color={textColor} fontWeight="bold">
                      {stat.label}
                    </Text>
                  </VStack>

                  {/* Indicador de tendencia */}
                  <HStack spacing={1}>
                    <Icon as={FiTrendingUp} boxSize={{ base: 3, sm: 3.5, md: 4 }} color={stat.trendColor} />
                    <Text fontSize={{ base: "2xs", sm: "xs", md: "sm" }} color={stat.trendColor} fontWeight="bold">
                      {stat.trend}
                    </Text>
                  </HStack>
                </VStack>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </Box>
  )
}

export default StatsSection
