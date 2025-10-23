import React from 'react'
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
  useBreakpointValue
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import { 
  FiUsers,
  FiRadio,
  FiMusic,
  FiAward,
  FiTrendingUp,
  FiZap,
  FiStar
} from 'react-icons/fi'

// Animaciones
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
  50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
`

const StatsSection = () => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const accentColor = useColorModeValue('blue.500', 'blue.300')
  const listeners = 1247

  const stats = [
    {
      icon: FiUsers,
      value: listeners.toLocaleString(),
      label: "Oyentes en Vivo",
      color: "blue.500",
      gradient: "linear(135deg, blue.500, blue.600)",
      bgGradient: "linear(135deg, blue.50, blue.100)",
      borderColor: "blue.200",
      shadowColor: "rgba(59, 130, 246, 0.3)",
      trend: "+12%",
      trendColor: "green.500"
    },
    {
      icon: FiRadio,
      value: "24/7",
      label: "Transmisión Continua",
      color: "green.500",
      gradient: "linear(135deg, green.500, green.600)",
      bgGradient: "linear(135deg, green.50, green.100)",
      borderColor: "green.200",
      shadowColor: "rgba(34, 197, 94, 0.3)",
      trend: "Live",
      trendColor: "red.500"
    },
    {
      icon: FiMusic,
      value: "50+",
      label: "Canciones por Hora",
      color: "purple.500",
      gradient: "linear(135deg, purple.500, purple.600)",
      bgGradient: "linear(135deg, purple.50, purple.100)",
      borderColor: "purple.200",
      shadowColor: "rgba(147, 51, 234, 0.3)",
      trend: "Hot",
      trendColor: "orange.500"
    },
    {
      icon: FiAward,
      value: "15+",
      label: "Años de Experiencia",
      color: "yellow.500",
      gradient: "linear(135deg, yellow.500, yellow.600)",
      bgGradient: "linear(135deg, yellow.50, yellow.100)",
      borderColor: "yellow.200",
      shadowColor: "rgba(234, 179, 8, 0.3)",
      trend: "Pro",
      trendColor: "blue.500"
    }
  ]

  return (
    <Box 
      py={{ base: 12, md: 16, lg: 20 }}
      bgGradient="linear(to-b, gray.50, white)"
      position="relative"
      overflow="hidden"
    >
      {/* Efectos de fondo */}
      <Box
        position="absolute"
        top="20%"
        left="5%"
        w="200px"
        h="200px"
        bgGradient="radial(circle, blue.100, transparent)"
        borderRadius="full"
        opacity={0.4}
        animation={`${float} 8s ease-in-out infinite`}
      />
      <Box
        position="absolute"
        bottom="20%"
        right="5%"
        w="150px"
        h="150px"
        bgGradient="radial(circle, purple.100, transparent)"
        borderRadius="full"
        opacity={0.4}
        animation={`${float} 10s ease-in-out infinite reverse`}
      />

      <Container maxW="container.xl" position="relative" zIndex={1} px={{ base: 4, md: 6, lg: 8 }}>
        <VStack spacing={{ base: 8, md: 10, lg: 12 }}>
          {/* Header */}
          <VStack spacing={{ base: 3, md: 4 }} textAlign="center">
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
              📊 ESTADÍSTICAS
            </Badge>
            <Heading 
              size={{ base: "xl", md: "2xl", lg: "3xl" }}
              fontWeight="black"
              bgGradient="linear(to-r, blue.600, purple.600)"
              bgClip="text"
              lineHeight="shorter"
            >
              Números que Hablan
            </Heading>
            <Text 
              fontSize={{ base: "md", md: "lg" }} 
              color={textColor} 
              maxW={{ base: "90%", md: "80%", lg: "600px" }} 
              fontWeight="medium"
              lineHeight="tall"
            >
              Descubre por qué somos la radio más escuchada de Barquisimeto
            </Text>
          </VStack>

          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={{ base: 4, md: 6, lg: 8 }}>
            {stats.map((stat, index) => (
              <Card 
                key={index} 
                bg={cardBg} 
                textAlign="center" 
                p={{ base: 4, md: 6, lg: 8 }}
                borderRadius="2xl"
                border="2px solid"
                borderColor={stat.borderColor}
                boxShadow={`0 20px 40px ${stat.shadowColor}`}
                _hover={{
                  transform: 'translateY(-10px) scale(1.05)',
                  boxShadow: `0 30px 60px ${stat.shadowColor}`,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                animation={`${float} ${3 + index}s ease-in-out infinite`}
                position="relative"
                overflow="hidden"
              >
                {/* Efectos decorativos */}
                <Box
                  position="absolute"
                  top={-20}
                  right={-20}
                  w="80px"
                  h="80px"
                  bgGradient={`radial(circle, ${stat.color.replace('.500', '.200')}, transparent)`}
                  borderRadius="full"
                  opacity={0.3}
                  animation={`${pulse} 4s ease-in-out infinite`}
                />

                <VStack spacing={{ base: 3, md: 4 }} position="relative" zIndex={1}>
                  {/* Icono con efectos */}
                  <Box
                    position="relative"
                    _hover={{ transform: 'scale(1.2) rotate(10deg)' }}
                    transition="transform 0.3s ease"
                  >
                    <Box
                      p={{ base: 3, md: 4 }}
                      borderRadius="xl"
                      bgGradient={stat.gradient}
                      color="white"
                      boxShadow={`0 10px 30px ${stat.shadowColor}`}
                      animation={`${pulse} 2s ease-in-out infinite`}
                    >
                      <Icon as={stat.icon} boxSize={{ base: 6, md: 7, lg: 8 }} />
                    </Box>
                    
                    {/* Indicador de tendencia */}
                    <Box
                      position="absolute"
                      top={-2}
                      right={-2}
                      w="6"
                      h="6"
                      bg={stat.trendColor}
                      borderRadius="full"
                      border="2px solid white"
                      animation={`${glow} 2s ease-in-out infinite`}
                    />
                  </Box>

                  {/* Valor principal */}
                  <VStack spacing={2}>
                    <Text 
                      fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
                      fontWeight="black" 
                      bgGradient={stat.gradient}
                      bgClip="text"
                      lineHeight="1"
                    >
                      {stat.value}
                    </Text>
                    <Text fontSize={{ base: "md", md: "lg" }} color={textColor} fontWeight="bold">
                      {stat.label}
                    </Text>
                  </VStack>

                  {/* Indicador de tendencia */}
                  <HStack spacing={1}>
                    <Icon as={FiTrendingUp} boxSize={{ base: 3, md: 4 }} color={stat.trendColor} />
                    <Text fontSize={{ base: "xs", md: "sm" }} color={stat.trendColor} fontWeight="bold">
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
