import React from 'react'
import {
  Box,
  Container,
  VStack,
  Text,
  Card,
  Icon,
  useColorModeValue,
  SimpleGrid
} from '@chakra-ui/react'
import { 
  FiUsers,
  FiRadio,
  FiMusic,
  FiAward
} from 'react-icons/fi'

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
      color: "blue.500"
    },
    {
      icon: FiRadio,
      value: "24/7",
      label: "Transmisión Continua",
      color: "green.500"
    },
    {
      icon: FiMusic,
      value: "50+",
      label: "Canciones por Hora",
      color: "purple.500"
    },
    {
      icon: FiAward,
      value: "15+",
      label: "Años de Experiencia",
      color: "yellow.500"
    }
  ]

  return (
    <Box py={16}>
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
          {stats.map((stat, index) => (
            <Card key={index} bg={cardBg} textAlign="center" p={6}>
              <VStack spacing={3}>
                <Icon as={stat.icon} boxSize={8} color={stat.color} />
                <Text fontSize="2xl" fontWeight="bold" color={accentColor}>
                  {stat.value}
                </Text>
                <Text fontSize="sm" color={textColor}>
                  {stat.label}
                </Text>
              </VStack>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  )
}

export default StatsSection
