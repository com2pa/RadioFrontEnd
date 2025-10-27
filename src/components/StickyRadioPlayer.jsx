import React, { useState, useRef, useEffect } from 'react'
import {
  Box,
  HStack,
  VStack,
  IconButton,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Text,
  Image,
  Badge,
  Tooltip,
  useColorModeValue,
  useBreakpointValue,
  Flex,
  Icon,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useToast
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import {
  FiPlay,
  FiPause,
  FiSkipBack,
  FiSkipForward,
  FiVolume2,
  FiVolumeX,
  FiShuffle,
  FiRepeat,
  FiList,
  FiCast,
  FiMaximize,
  FiHeart,
  FiShare2,
  FiMoreVertical,
  FiRadio
} from 'react-icons/fi'

// Animaciones
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.3); }
  50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.6); }
`

const StickyRadioPlayer = () => {
  // Estados del reproductor
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(240) // 4 minutos en segundos
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [isShuffled, setIsShuffled] = useState(false)
  const [isRepeating, setIsRepeating] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Información de la canción actual
  const [currentSong] = useState({
    title: "Música en Vivo",
    artist: "OXÍ Radio 88.1 FM",
    album: "Transmisión en Vivo",
    cover: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop&q=80",
    listeners: 1247
  })

  const toast = useToast()
  const progressRef = useRef(null)
  const intervalRef = useRef(null)

  // Colores responsivos
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const textColor = useColorModeValue('gray.800', 'white')
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400')

  // Breakpoints responsivos
  const isMobile = useBreakpointValue({ base: true, md: false })
  const isTablet = useBreakpointValue({ base: false, md: true, lg: false })

  // Simular progreso de reproducción
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }

    return () => clearInterval(intervalRef.current)
  }, [isPlaying, duration])

  // Funciones de control
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    toast({
      title: isPlaying ? 'Pausando transmisión' : 'Iniciando transmisión',
      description: isPlaying ? 'La radio se ha pausado' : '¡Disfruta de OXÍ Radio!',
      status: 'success',
      duration: 2000,
      isClosable: true,
    })
  }

  const handleVolumeChange = (value) => {
    setVolume(value)
    setIsMuted(value === 0)
  }

  const handleProgressChange = (value) => {
    setCurrentTime(value)
  }

  const handleSkipBack = () => {
    setCurrentTime(Math.max(0, currentTime - 10))
  }

  const handleSkipForward = () => {
    setCurrentTime(Math.min(duration, currentTime + 10))
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Box
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      zIndex={1000}
      bg={bgColor}
      borderTop="1px solid"
      borderColor={borderColor}
      boxShadow="0 -4px 20px rgba(0,0,0,0.1)"
      backdropFilter="blur(10px)"
      transition="all 0.3s ease"
      transform={isExpanded ? 'translateY(0)' : 'translateY(0)'}
    >
      {/* Barra de progreso principal */}
      <Box
        w="full"
        h="3px"
        bg="gray.200"
        cursor="pointer"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const percent = (e.clientX - rect.left) / rect.width
          setCurrentTime(percent * duration)
        }}
      >
        <Box
          w={`${(currentTime / duration) * 100}%`}
          h="full"
          bgGradient="linear(to-r, blue.500, purple.500)"
          transition="width 0.1s ease"
        />
      </Box>

      {/* Contenido principal del reproductor */}
      <Box p={{ base: 3, md: 4 }}>
        <HStack spacing={{ base: 3, md: 4 }} align="center">
          {/* Información de la canción */}
          <HStack spacing={3} minW={0} flex={1}>
            <Box
              position="relative"
              w={{ base: "50px", md: "60px" }}
              h={{ base: "50px", md: "60px" }}
              borderRadius="md"
              overflow="hidden"
              flexShrink={0}
            >
              <Image
                src={currentSong.cover}
                alt={currentSong.title}
                w="full"
                h="full"
                objectFit="cover"
              />
              {isPlaying && (
                <Box
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                  bg="rgba(0,0,0,0.3)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  animation={`${pulse} 1s ease-in-out infinite`}
                >
                  <Icon as={FiRadio} color="white" boxSize={4} />
                </Box>
              )}
            </Box>

            <VStack align="start" spacing={0} minW={0} flex={1}>
              <Text
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="bold"
                color={textColor}
                noOfLines={1}
                w="full"
              >
                {currentSong.title}
              </Text>
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                color={mutedTextColor}
                noOfLines={1}
                w="full"
              >
                {currentSong.artist}
              </Text>
              <HStack spacing={2} mt={1}>
                <Badge
                  size="sm"
                  colorScheme="green"
                  variant="subtle"
                  fontSize="xs"
                >
                  🔴 EN VIVO
                </Badge>
                <Text fontSize="xs" color={mutedTextColor}>
                  {currentSong.listeners.toLocaleString()} oyentes
                </Text>
              </HStack>
            </VStack>
          </HStack>

          {/* Controles principales */}
          <HStack spacing={{ base: 2, md: 3 }} align="center">
            {/* Botón shuffle */}
            <Tooltip label="Aleatorio" placement="top">
              <IconButton
                aria-label="Aleatorio"
                icon={<Icon as={FiShuffle} />}
                size="sm"
                variant="ghost"
                color={isShuffled ? "blue.500" : mutedTextColor}
                onClick={() => setIsShuffled(!isShuffled)}
                _hover={{ color: "blue.500" }}
              />
            </Tooltip>

            {/* Botón anterior */}
            <Tooltip label="Retroceder 10s" placement="top">
              <IconButton
                aria-label="Anterior"
                icon={<Icon as={FiSkipBack} />}
                size="sm"
                variant="ghost"
                color={mutedTextColor}
                onClick={handleSkipBack}
                _hover={{ color: textColor }}
              />
            </Tooltip>

            {/* Botón play/pause principal */}
            <IconButton
              aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
              icon={<Icon as={isPlaying ? FiPause : FiPlay} />}
              size="lg"
              colorScheme="blue"
              onClick={handlePlayPause}
              borderRadius="full"
              bgGradient="linear(135deg, blue.500, purple.500)"
              color="white"
              _hover={{
                bgGradient: 'linear(135deg, blue.600, purple.600)',
                transform: 'scale(1.05)',
                boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)'
              }}
              animation={isPlaying ? `${pulse} 1.5s ease-in-out infinite` : 'none'}
              boxShadow={isPlaying ? '0 0 20px rgba(59, 130, 246, 0.3)' : 'none'}
            />

            {/* Botón siguiente */}
            <Tooltip label="Avanzar 10s" placement="top">
              <IconButton
                aria-label="Siguiente"
                icon={<Icon as={FiSkipForward} />}
                size="sm"
                variant="ghost"
                color={mutedTextColor}
                onClick={handleSkipForward}
                _hover={{ color: textColor }}
              />
            </Tooltip>

            {/* Botón repeat */}
            <Tooltip label="Repetir" placement="top">
              <IconButton
                aria-label="Repetir"
                icon={<Icon as={FiRepeat} />}
                size="sm"
                variant="ghost"
                color={isRepeating ? "blue.500" : mutedTextColor}
                onClick={() => setIsRepeating(!isRepeating)}
                _hover={{ color: "blue.500" }}
              />
            </Tooltip>
          </HStack>

          {/* Controles adicionales */}
          <HStack spacing={2} align="center">
            {/* Tiempo actual */}
            <Text fontSize="xs" color={mutedTextColor} minW="35px">
              {formatTime(currentTime)}
            </Text>

            {/* Barra de progreso */}
            <Box flex={1} minW="100px" maxW="200px">
              <Slider
                value={currentTime}
                min={0}
                max={duration}
                onChange={handleProgressChange}
                colorScheme="blue"
                size="sm"
              >
                <SliderTrack bg="gray.200">
                  <SliderFilledTrack bgGradient="linear(to-r, blue.400, purple.400)" />
                </SliderTrack>
                <SliderThumb boxSize={4} />
              </Slider>
            </Box>

            {/* Tiempo total */}
            <Text fontSize="xs" color={mutedTextColor} minW="35px">
              {formatTime(duration)}
            </Text>

            {/* Controles de volumen */}
            <HStack spacing={1} align="center">
              <Tooltip label={isMuted ? "Activar sonido" : "Silenciar"} placement="top">
                <IconButton
                  aria-label={isMuted ? "Activar sonido" : "Silenciar"}
                  icon={<Icon as={isMuted ? FiVolumeX : FiVolume2} />}
                  size="sm"
                  variant="ghost"
                  color={mutedTextColor}
                  onClick={() => setIsMuted(!isMuted)}
                  _hover={{ color: textColor }}
                />
              </Tooltip>
              
              <Box w="60px">
                <Slider
                  value={isMuted ? 0 : volume}
                  min={0}
                  max={100}
                  onChange={handleVolumeChange}
                  colorScheme="blue"
                  size="sm"
                >
                  <SliderTrack bg="gray.200">
                    <SliderFilledTrack bg="blue.400" />
                  </SliderTrack>
                  <SliderThumb boxSize={3} />
                </Slider>
              </Box>
            </HStack>

            {/* Controles adicionales */}
            <HStack spacing={1}>
              <Tooltip label="Lista de reproducción" placement="top">
                <IconButton
                  aria-label="Lista de reproducción"
                  icon={<Icon as={FiList} />}
                  size="sm"
                  variant="ghost"
                  color={mutedTextColor}
                  _hover={{ color: textColor }}
                />
              </Tooltip>

              <Tooltip label="Transmitir" placement="top">
                <IconButton
                  aria-label="Transmitir"
                  icon={<Icon as={FiCast} />}
                  size="sm"
                  variant="ghost"
                  color={mutedTextColor}
                  _hover={{ color: textColor }}
                />
              </Tooltip>

              <Tooltip label="Pantalla completa" placement="top">
                <IconButton
                  aria-label="Pantalla completa"
                  icon={<Icon as={FiMaximize} />}
                  size="sm"
                  variant="ghost"
                  color={mutedTextColor}
                  _hover={{ color: textColor }}
                />
              </Tooltip>

              {/* Menú de opciones */}
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Más opciones"
                  icon={<Icon as={FiMoreVertical} />}
                  size="sm"
                  variant="ghost"
                  color={mutedTextColor}
                  _hover={{ color: textColor }}
                />
                <MenuList>
                  <MenuItem icon={<Icon as={FiHeart} />}>
                    Me gusta
                  </MenuItem>
                  <MenuItem icon={<Icon as={FiShare2} />}>
                    Compartir
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem>
                    Ver detalles
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </HStack>
        </HStack>
      </Box>
    </Box>
  )
}

export default StickyRadioPlayer
