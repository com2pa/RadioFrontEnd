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
  CardHeader,
  Heading,
  Icon,
  useColorModeValue,
  Badge,
  IconButton
} from '@chakra-ui/react'
import { 
  FiPlay,
  FiTrendingUp
} from 'react-icons/fi'

const TopSongs = () => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const accentColor = useColorModeValue('blue.500', 'blue.300')

  const topSongs = [
    { title: "Canción del Verano", artist: "Artista Popular", plays: 1250 },
    { title: "Éxito Nacional", artist: "Grupo Local", plays: 980 },
    { title: "Hit Internacional", artist: "Estrella Global", plays: 756 },
    { title: "Clásico Regional", artist: "Tradición Musical", plays: 634 }
  ]

  return (
    <Box py={16}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <VStack spacing={4} textAlign="center">
            <Heading size="xl" color={accentColor}>
              Top Canciones
            </Heading>
            <Text fontSize="lg" color={textColor}>
              Las canciones más escuchadas esta semana
            </Text>
          </VStack>

          <Card bg={cardBg} boxShadow="lg">
            <CardHeader>
              <HStack justify="space-between">
                <Heading size="md">Ranking Semanal</Heading>
                <Badge colorScheme="green" variant="subtle">
                  <Icon as={FiTrendingUp} mr={1} />
                  En Vivo
                </Badge>
              </HStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={4}>
                {topSongs.map((song, index) => (
                  <HStack key={index} w="full" p={3} borderRadius="md" _hover={{ bg: 'gray.50' }}>
                    <Badge
                      colorScheme={index < 3 ? 'yellow' : 'gray'}
                      variant="solid"
                      borderRadius="full"
                      w={8}
                      h={8}
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {index + 1}
                    </Badge>
                    <VStack align="start" spacing={0} flex={1}>
                      <Text fontWeight="medium">{song.title}</Text>
                      <Text fontSize="sm" color={textColor}>{song.artist}</Text>
                    </VStack>
                    <HStack spacing={2}>
                      <Icon as={FiPlay} boxSize={4} color="blue.500" />
                      <Text fontSize="sm" color="gray.600">
                        {song.plays.toLocaleString()}
                      </Text>
                    </HStack>
                    <IconButton
                      aria-label="Reproducir"
                      icon={<Icon as={FiPlay} />}
                      size="sm"
                      variant="ghost"
                      colorScheme="blue"
                    />
                  </HStack>
                ))}
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Container>
    </Box>
  )
}

export default TopSongs
