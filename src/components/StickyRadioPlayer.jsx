import React, { useState, useRef, useEffect, useCallback } from 'react'
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
  Badge,
  Tooltip,
  useColorModeValue,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useToast,
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import {
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX,
  FiRadio,
  FiShare2,
  FiMoreVertical,
} from 'react-icons/fi'
import { radioConfig, getStreamUrl, isValidStreamUrl } from '../config/radioConfig'

// Animación de pulso para indicar que está en vivo
const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`

const StickyRadioPlayer = () => {
  console.log('🎧 [StickyRadioPlayer] Componente renderizado')
  
  // Estados del reproductor
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [reconnectAttempts, setReconnectAttempts] = useState(0)
  const [errorToastShown, setErrorToastShown] = useState(false)

  const toast = useToast()
  const audioRef = useRef(null)

  // Colores responsivos
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const textColor = useColorModeValue('gray.800', 'white')
  const mutedTextColor = useColorModeValue('gray.600', 'gray.400')

  // Obtener URL del stream
  const streamUrl = getStreamUrl()
  
  // Log de depuración
  useEffect(() => {
    console.log('📻 [StickyRadioPlayer] Configuración:', {
      streamUrl,
      isValid: isValidStreamUrl(streamUrl),
      stationName: radioConfig.stationName
    })
  }, [streamUrl])

  // Función de reconexión
  const handleReconnect = useCallback(() => {
    if (reconnectAttempts >= radioConfig.reconnectAttempts) {
      console.error('❌ [Reconnect] Máximo de intentos alcanzado')
      // Solo mostrar toast si no se ha mostrado ya
      if (!errorToastShown) {
        setErrorToastShown(true)
        toast({
          title: 'Error de conexión',
          description: 'No se pudo conectar a la radio después de varios intentos',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
      return
    }

    const delay = radioConfig.reconnectDelay * (reconnectAttempts + 1)
    console.log(`🔄 [Reconnect] Intentando reconectar en ${delay}ms (intento ${reconnectAttempts + 1}/${radioConfig.reconnectAttempts})`)
    
    setTimeout(() => {
      setReconnectAttempts(prev => prev + 1)
      if (audioRef.current) {
        audioRef.current.load()
        if (isPlaying) {
          audioRef.current.play().catch(err => {
            console.error('❌ [Reconnect] Error al reproducir después de reconectar:', err)
          })
        }
      }
    }, delay)
  }, [reconnectAttempts, isPlaying, toast, errorToastShown])

  // Validar URL del stream al montar
  useEffect(() => {
    if (!isValidStreamUrl(streamUrl)) {
      const errorMsg = `URL de stream inválida: ${streamUrl}. Por favor, configura una URL válida en src/config/radioConfig.js`
      console.error('❌ [StickyRadioPlayer]', errorMsg)
      setError(errorMsg)
      toast({
        title: 'Error de configuración',
        description: 'La URL del stream de radio no está configurada correctamente',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }, [streamUrl, toast])

  // Configurar audio element
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !isValidStreamUrl(streamUrl)) {
      console.warn('⚠️ [Audio] Audio element o URL no válida')
      return
    }

    console.log('🎵 [Audio] Configurando stream:', streamUrl)
    
    // Configurar URL del stream
    // Primero intentar sin crossOrigin, luego con crossOrigin si es necesario
    audio.preload = radioConfig.preload
    
    // Intentar primero sin crossOrigin (muchos streams no lo requieren)
    try {
      audio.crossOrigin = null // null en lugar de 'anonymous' para evitar problemas CORS
    } catch (e) {
      console.warn('⚠️ [Audio] No se pudo configurar crossOrigin:', e)
    }
    
    // Configurar src y forzar carga
    if (audio.src !== streamUrl) {
      audio.src = streamUrl
      audio.load() // Forzar recarga del stream
      console.log('✅ [Audio] URL configurada y cargada')
    }

    // Event listeners
    const handleCanPlay = () => {
      console.log('✅ [Audio] Stream listo para reproducir')
      setIsLoading(false)
      setError(null)
      setReconnectAttempts(0)
      // No resetear errorToastShown aquí para evitar múltiples toasts durante reconexiones
    }

    const handleLoadStart = () => {
      console.log('🔄 [Audio] Cargando stream...')
      setIsLoading(true)
    }

    const handlePlay = () => {
      console.log('▶️ [Audio] Reproducción iniciada')
      setIsPlaying(true)
      setIsLoading(false)
      setError(null)
      // Resetear el flag de toast solo cuando la reproducción es estable
      // Esperar 3 segundos para asegurar que no hay errores inmediatos
      setTimeout(() => {
        if (audioRef.current && !audioRef.current.paused && !audioRef.current.error) {
          setErrorToastShown(false)
        }
      }, 3000)
    }

    const handlePause = () => {
      console.log('⏸️ [Audio] Reproducción pausada')
      setIsPlaying(false)
    }

    const handleWaiting = () => {
      console.log('⏳ [Audio] Buffering...')
      setIsLoading(true)
    }

    const handlePlaying = () => {
      console.log('🎵 [Audio] Reproduciendo')
      setIsLoading(false)
    }

    const handleError = (e) => {
      console.error('❌ [Audio] Error:', {
        error: e,
        errorCode: audio.error?.code,
        errorMessage: audio.error?.message,
        networkState: audio.networkState,
        readyState: audio.readyState
      })
      
      setIsPlaying(false)
      setIsLoading(false)
      
      let errorMessage = 'Error al reproducir la radio'
      let shouldReconnect = false
      
      if (audio.error) {
        switch (audio.error.code) {
          case 1: // MEDIA_ERR_ABORTED
            errorMessage = 'Reproducción cancelada'
            break
          case 2: // MEDIA_ERR_NETWORK
            errorMessage = 'Error de red. Verifica tu conexión'
            shouldReconnect = true
            break
          case 3: // MEDIA_ERR_DECODE
            errorMessage = 'Error al decodificar el stream'
            break
          case 4: // MEDIA_ERR_SRC_NOT_SUPPORTED
            errorMessage = 'Formato de stream no soportado o servidor no disponible'
            shouldReconnect = true
            break
          default:
            errorMessage = 'Error desconocido al reproducir'
        }
      }
      
      setError(errorMessage)
      
      // Mostrar toast solo una vez por error
      setErrorToastShown(prev => {
        if (!prev) {
          toast({
            title: 'Error de reproducción',
            description: errorMessage,
            status: 'error',
            duration: 5000,
            isClosable: true,
          })
          return true
        }
        return prev
      })
      
      // Intentar reconectar si es necesario (sin mostrar toast adicional)
      if (shouldReconnect) {
        handleReconnect()
      }
    }

    const handleStalled = () => {
      console.warn('⚠️ [Audio] Stream estancado, intentando reconectar...')
      setIsLoading(true)
    }

    const handleSuspend = () => {
      console.log('⏸️ [Audio] Stream suspendido')
    }

    audio.addEventListener('canplay', handleCanPlay)
    audio.addEventListener('loadstart', handleLoadStart)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('waiting', handleWaiting)
    audio.addEventListener('playing', handlePlaying)
    audio.addEventListener('error', handleError)
    audio.addEventListener('stalled', handleStalled)
    audio.addEventListener('suspend', handleSuspend)

    return () => {
      audio.removeEventListener('canplay', handleCanPlay)
      audio.removeEventListener('loadstart', handleLoadStart)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('waiting', handleWaiting)
      audio.removeEventListener('playing', handlePlaying)
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('stalled', handleStalled)
      audio.removeEventListener('suspend', handleSuspend)
    }
  }, [streamUrl, toast, handleReconnect])

  // Actualizar volumen y muted
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume / 100
    }
  }, [volume, isMuted])

  // Reproducir/pausar
  const handlePlayPause = async () => {
    const audio = audioRef.current
    if (!audio) {
      console.error('❌ [handlePlayPause] Audio element no disponible')
      toast({
        title: 'Error',
        description: 'Reproductor de audio no disponible',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (!isValidStreamUrl(streamUrl)) {
      console.error('❌ [handlePlayPause] URL inválida:', streamUrl)
        toast({
        title: 'Error',
        description: 'URL de stream no configurada correctamente',
        status: 'error',
        duration: 3000,
          isClosable: true,
        })
      return
    }

    try {
      if (isPlaying) {
        console.log('⏸️ [handlePlayPause] Pausando...')
          audio.pause()
        setIsPlaying(false)
      } else {
        console.log('▶️ [handlePlayPause] Iniciando reproducción...')
        setIsLoading(true)
        setError(null)
        
        // Asegurar que el src esté configurado
        if (!audio.src || audio.src !== streamUrl) {
          console.log('🔄 [handlePlayPause] Configurando src del audio...')
          audio.src = streamUrl
          audio.load()
          // Esperar un momento para que el audio se cargue
          await new Promise(resolve => setTimeout(resolve, 500))
        }
        
        // Intentar reproducir
          await audio.play()
        console.log('✅ [handlePlayPause] Reproducción iniciada exitosamente')
        setIsPlaying(true)
        setIsLoading(false)
        }
      } catch (error) {
      console.error('❌ [handlePlayPause] Error completo:', {
        name: error.name,
        message: error.message,
        error: error,
        audioSrc: audio.src,
        audioReadyState: audio.readyState,
        audioNetworkState: audio.networkState,
        audioError: audio.error
      })
      
          setIsPlaying(false)
      setIsLoading(false)
      
      let errorMessage = 'No se pudo reproducir la radio'
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Por favor, haz clic en el botón de reproducir para iniciar la radio'
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Tu navegador no soporta este formato de audio'
      } else if (audio.error) {
        errorMessage = `Error de audio: ${audio.error.message || 'Error desconocido'}`
    } else {
        errorMessage = `Error: ${error.message || error.name || 'Error desconocido'}`
      }

      setError(errorMessage)
      toast({
        title: 'Error de reproducción',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleVolumeChange = (value) => {
    setVolume(value)
    setIsMuted(value === 0)
  }

  // Compartir radio
  const handleShare = async () => {
    const shareData = {
      title: radioConfig.stationName,
      text: `Escucha ${radioConfig.stationName} en vivo`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
    } else {
        // Fallback: copiar al portapapeles
        await navigator.clipboard.writeText(window.location.href)
        toast({
          title: 'Enlace copiado',
          description: 'El enlace se ha copiado al portapapeles',
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error al compartir:', error)
      }
    }
  }

  return (
    <>
      {/* Elemento de audio oculto */}
      <audio
        ref={audioRef}
        preload={radioConfig.preload}
        crossOrigin={null}
        style={{ display: 'none' }}
      />

      {/* Reproductor principal */}
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
    >
      {/* Contenido principal del reproductor */}
      <Box p={{ base: 3, md: 4 }}>
        <HStack spacing={{ base: 3, md: 4 }} align="center">
            {/* Información de la radio */}
          <HStack spacing={3} minW={0} flex={1}>
            <Box
              position="relative"
              w={{ base: "50px", md: "60px" }}
              h={{ base: "50px", md: "60px" }}
              borderRadius="md"
              overflow="hidden"
              flexShrink={0}
                bgGradient="linear(135deg, blue.500, purple.500)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                <Icon as={FiRadio} color="white" boxSize={6} />
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
                  {radioConfig.stationName}
              </Text>
              <Text
                fontSize={{ base: "xs", md: "sm" }}
                color={mutedTextColor}
                noOfLines={1}
                w="full"
              >
                  {radioConfig.stationDescription}
              </Text>
              <HStack spacing={2} mt={1}>
                {isPlaying && (
                  <Badge
                    size="sm"
                    colorScheme="green"
                    variant="subtle"
                    fontSize="xs"
                  >
                      🔴 EN VIVO
                  </Badge>
                )}
                  {isLoading && (
                    <Badge
                      size="sm"
                      colorScheme="blue"
                      variant="subtle"
                      fontSize="xs"
                    >
                      Cargando...
                    </Badge>
                  )}
                  {error && (
                    <Badge
                      size="sm"
                      colorScheme="red"
                      variant="subtle"
                      fontSize="xs"
                    >
                      Error
                    </Badge>
                )}
              </HStack>
            </VStack>
          </HStack>

          {/* Controles principales */}
          <HStack spacing={{ base: 2, md: 3 }} align="center">
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
                isLoading={isLoading}
                isDisabled={!isValidStreamUrl(streamUrl) || !!error}
              _hover={{
                bgGradient: 'linear(135deg, blue.600, purple.600)',
                transform: 'scale(1.05)',
                boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)'
              }}
              animation={isPlaying ? `${pulse} 1.5s ease-in-out infinite` : 'none'}
              boxShadow={isPlaying ? '0 0 20px rgba(59, 130, 246, 0.3)' : 'none'}
            />
          </HStack>

          {/* Controles adicionales */}
          <HStack spacing={2} align="center">
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
                  <MenuItem icon={<Icon as={FiShare2} />} onClick={handleShare}>
                    Compartir Radio
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem>
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xs" fontWeight="bold">
                        {radioConfig.stationName}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        {radioConfig.stationDescription}
                      </Text>
                    </VStack>
                  </MenuItem>
                </MenuList>
              </Menu>
          </HStack>
        </HStack>
      </Box>
    </Box>
    </>
  )
}

export default StickyRadioPlayer
