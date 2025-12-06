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
  Button,
  Flex,
  Icon,
  useToast,
} from '@chakra-ui/react'
import { keyframes } from '@emotion/react'
import {
  FiPlay,
  FiPause,
  FiVolume2,
  FiVolumeX,
} from 'react-icons/fi'
import { radioConfig, getStreamUrl, isValidStreamUrl } from '../config/radioConfig'

// Animación de pulso para indicar que está en vivo
const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`

const StickyRadioPlayer = () => {
  // console.log('🎧 [StickyRadioPlayer] Componente renderizado')
  
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

  // Colores oficiales de OXÍGENO 88.1FM
  const brandRed = '#E50000'
  const brandWhite = '#FFFFFF'
  const brandDarkGray = '#333333'
  const brandLightGray = '#CCCCCC'

  // Colores del reproductor (tema oscuro)
  const playerBg = brandDarkGray
  const textColor = brandWhite
  const mutedTextColor = brandLightGray

  // Obtener URL del stream
  const streamUrl = getStreamUrl()
  
  // Log de depuración
  useEffect(() => {
    // console.log('📻 [StickyRadioPlayer] Configuración:', {
    //   streamUrl,
    //   isValid: isValidStreamUrl(streamUrl),
    //   stationName: radioConfig.stationName
    // })
  }, [streamUrl])

  // Función de reconexión
  const handleReconnect = useCallback(() => {
    if (reconnectAttempts >= radioConfig.reconnectAttempts) {
      // console.error('❌ [Reconnect] Máximo de intentos alcanzado')
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
    // console.log(`🔄 [Reconnect] Intentando reconectar en ${delay}ms (intento ${reconnectAttempts + 1}/${radioConfig.reconnectAttempts})`)
    
    setTimeout(() => {
      setReconnectAttempts(prev => prev + 1)
      if (audioRef.current) {
        audioRef.current.load()
        if (isPlaying) {
          audioRef.current.play().catch(err => {
            // console.error('❌ [Reconnect] Error al reproducir después de reconectar:', err)
          })
        }
      }
    }, delay)
  }, [reconnectAttempts, isPlaying, toast, errorToastShown])

  // Validar URL del stream al montar
  useEffect(() => {
    if (!isValidStreamUrl(streamUrl)) {
      const errorMsg = `URL de stream inválida: ${streamUrl}. Por favor, configura una URL válida en src/config/radioConfig.js`
      // console.error('❌ [StickyRadioPlayer]', errorMsg)
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
      // console.warn('⚠️ [Audio] Audio element o URL no válida')
      return
    }

    // console.log('🎵 [Audio] Configurando stream:', streamUrl)
    
    // Configurar URL del stream
    // Primero intentar sin crossOrigin, luego con crossOrigin si es necesario
    audio.preload = radioConfig.preload
    
    // Intentar primero sin crossOrigin (muchos streams no lo requieren)
    try {
      audio.crossOrigin = null // null en lugar de 'anonymous' para evitar problemas CORS
    } catch (e) {
      // console.warn('⚠️ [Audio] No se pudo configurar crossOrigin:', e)
    }
    
    // Configurar src y forzar carga
    if (audio.src !== streamUrl) {
      audio.src = streamUrl
      audio.load() // Forzar recarga del stream
      // console.log('✅ [Audio] URL configurada y cargada')
    }

    // Event listeners
    const handleCanPlay = () => {
      // console.log('✅ [Audio] Stream listo para reproducir')
      setIsLoading(false)
      setError(null)
      setReconnectAttempts(0)
      // No resetear errorToastShown aquí para evitar múltiples toasts durante reconexiones
    }

    const handleLoadStart = () => {
      // console.log('🔄 [Audio] Cargando stream...')
      setIsLoading(true)
    }

    const handlePlay = () => {
      // console.log('▶️ [Audio] Reproducción iniciada')
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
      // console.log('⏸️ [Audio] Reproducción pausada')
      setIsPlaying(false)
    }

    const handleWaiting = () => {
      // console.log('⏳ [Audio] Buffering...')
      setIsLoading(true)
    }

    const handlePlaying = () => {
      // console.log('🎵 [Audio] Reproduciendo')
      setIsLoading(false)
    }

    const handleError = (e) => {
      // console.error('❌ [Audio] Error:', {
      //   error: e,
      //   errorCode: audio.error?.code,
      //   errorMessage: audio.error?.message,
      //   networkState: audio.networkState,
      //   readyState: audio.readyState
      // })
      
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
          // toast({
          //   title: 'Error de reproducción',
          //   description: errorMessage,
          //   status: 'error',
          //   duration: 5000,
          //   isClosable: true,
          // })
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
      // console.warn('⚠️ [Audio] Stream estancado, intentando reconectar...')
      setIsLoading(true)
    }

    const handleSuspend = () => {
      // console.log('⏸️ [Audio] Stream suspendido')
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
      // console.error('❌ [handlePlayPause] Audio element no disponible')
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
      // console.error('❌ [handlePlayPause] URL inválida:', streamUrl)
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
        // console.log('⏸️ [handlePlayPause] Pausando...')
          audio.pause()
        setIsPlaying(false)
      } else {
        // console.log('▶️ [handlePlayPause] Iniciando reproducción...')
        setIsLoading(true)
        setError(null)
        
        // Asegurar que el src esté configurado
        if (!audio.src || audio.src !== streamUrl) {
          // console.log('🔄 [handlePlayPause] Configurando src del audio...')
          audio.src = streamUrl
          audio.load()
          // Esperar un momento para que el audio se cargue
          await new Promise(resolve => setTimeout(resolve, 500))
        }
        
        // Intentar reproducir
          await audio.play()
        // console.log('✅ [handlePlayPause] Reproducción iniciada exitosamente')
        setIsPlaying(true)
        setIsLoading(false)
        }
      } catch (error) {
      // console.error('❌ [handlePlayPause] Error completo:', {
      //   name: error.name,
      //   message: error.message,
      //   error: error,
      //   audioSrc: audio.src,
      //   audioReadyState: audio.readyState,
      //   audioNetworkState: audio.networkState,
      //   audioError: audio.error
      // })
      
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
      // toast({
      //   title: 'Error de reproducción',
      //   description: errorMessage,
      //   status: 'error',
      //   duration: 5000,
      //   isClosable: true,
      // })
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
        // console.error('Error al compartir:', error)
      }
    }
  }

  // Determinar color del botón según estado
  const buttonColor = isPlaying && !error ? "#00FF00" : "#E50000"
  const buttonHoverColor = isPlaying && !error ? "#00CC00" : "#C00000"

  return (
    <>
      {/* Elemento de audio oculto */}
      <audio
        ref={audioRef}
        preload={radioConfig.preload}
        crossOrigin={null}
        style={{ display: 'none' }}
      />

      {/* Reproductor principal - Diseño moderno y limpio */}
      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        zIndex={1000}
        bg={brandWhite}
        borderTop="1px solid rgba(0, 0, 0, 0.1)"
        boxShadow="0 -4px 20px rgba(0, 0, 0, 0.15)"
      >
        <Box px={{ base: 2, sm: 3, md: 4, lg: 6 }} py={{ base: 2.5, sm: 3, md: 4 }}>
          {/* Layout responsive: vertical en móvil, horizontal en desktop */}
          <VStack 
            spacing={{ base: 2, sm: 3, md: 0 }} 
            align="stretch"
            display={{ base: "flex", md: "none" }}
          >
            {/* Móvil: Layout vertical */}
            {/* Fila superior: Información y botón play */}
            <HStack 
              spacing={3} 
              align="center" 
              justify="space-between"
              w="full"
            >
              {/* Información de la estación */}
              <HStack 
                spacing={2} 
                align="center" 
                flex={1} 
                minW={0}
              >
                {/* Indicador de estado */}
                <Box
                  w={{ base: "8px", sm: "10px" }}
                  h={{ base: "8px", sm: "10px" }}
                  borderRadius="full"
                  bg={isPlaying && !error ? "#00FF00" : "#E50000"}
                  boxShadow={isPlaying && !error ? "0 0 8px rgba(0, 255, 0, 0.6)" : "0 0 8px rgba(229, 0, 0, 0.6)"}
                  animation={isPlaying && !error ? `${pulse} 2s ease-in-out infinite` : 'none'}
                  flexShrink={0}
                />
                
                {/* Información de la estación */}
                <VStack spacing={0.5} align="start" flex={1} minW={0}>
                  <Text
                    fontSize={{ base: "xs", sm: "sm" }}
                    fontWeight="bold"
                    color={brandDarkGray}
                    noOfLines={1}
                    letterSpacing="0.2px"
                  >
                    {radioConfig.stationName}
                  </Text>
                  <Text
                    fontSize="2xs"
                    color={isPlaying && !error ? "#00FF00" : brandDarkGray}
                    fontWeight={isPlaying && !error ? "semibold" : "normal"}
                    opacity={isPlaying && !error ? 1 : 0.7}
                  >
                    {isPlaying && !error ? "● En vivo" : error ? "Sin conexión" : "Pausado"}
                  </Text>
                </VStack>
              </HStack>

              {/* Botón play/pause principal */}
              <IconButton
                aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                icon={<Icon as={isPlaying ? FiPause : FiPlay} />}
                onClick={handlePlayPause}
                borderRadius="full"
                bg={buttonColor}
                color="white"
                isLoading={isLoading}
                isDisabled={!isValidStreamUrl(streamUrl) || !!error}
                _hover={{
                  bg: buttonHoverColor,
                  transform: 'scale(1.05)',
                }}
                _active={{
                  transform: 'scale(0.95)',
                }}
                transition="all 0.2s ease"
                w={{ base: "44px", sm: "50px" }}
                h={{ base: "44px", sm: "50px" }}
                boxShadow={`0 4px 15px ${buttonColor}50`}
                fontSize={{ base: "16px", sm: "18px" }}
                flexShrink={0}
              />
            </HStack>

            {/* Fila inferior: Control de volumen */}
            <HStack 
              spacing={2} 
              align="center"
              justify="center"
              w="full"
            >
              <IconButton
                aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
                icon={<Icon as={isMuted ? FiVolumeX : FiVolume2} />}
                onClick={() => setIsMuted(!isMuted)}
                variant="ghost"
                color={brandDarkGray}
                size="xs"
                _hover={{
                  bg: "rgba(0, 0, 0, 0.05)",
                }}
                w="32px"
                h="32px"
              />
              <Box flex={1} maxW="200px">
                <Slider
                  value={isMuted ? 0 : volume}
                  min={0}
                  max={100}
                  onChange={handleVolumeChange}
                  size="sm"
                >
                  <SliderTrack bg="rgba(0, 0, 0, 0.1)" h="3px" borderRadius="full">
                    <SliderFilledTrack bg={buttonColor} borderRadius="full" />
                  </SliderTrack>
                  <SliderThumb 
                    boxSize={2.5} 
                    bg={brandDarkGray} 
                    border="2px solid"
                    borderColor={buttonColor}
                    _focus={{ boxShadow: `0 0 0 3px ${buttonColor}30` }}
                  />
                </Slider>
              </Box>
            </HStack>
          </VStack>

          {/* Desktop: Layout horizontal */}
          <HStack 
            spacing={{ base: 3, md: 4, lg: 6 }} 
            align="center" 
            justify="space-between"
            display={{ base: "none", md: "flex" }}
          >
            {/* Sección izquierda - Información de la estación */}
            <HStack 
              spacing={3} 
              align="center" 
              flex={1} 
              minW={0}
              maxW={{ md: "300px", lg: "400px" }}
            >
              {/* Indicador de estado */}
              <Box
                w={{ md: "10px", lg: "12px" }}
                h={{ md: "10px", lg: "12px" }}
                borderRadius="full"
                bg={isPlaying && !error ? "#00FF00" : "#E50000"}
                boxShadow={isPlaying && !error ? "0 0 10px rgba(0, 255, 0, 0.6)" : "0 0 10px rgba(229, 0, 0, 0.6)"}
                animation={isPlaying && !error ? `${pulse} 2s ease-in-out infinite` : 'none'}
                flexShrink={0}
              />
              
              {/* Información de la estación */}
              <VStack spacing={1} align="start" flex={1} minW={0}>
                <Text
                  fontSize={{ md: "md", lg: "lg" }}
                  fontWeight="bold"
                  color={brandDarkGray}
                  noOfLines={1}
                  letterSpacing="0.3px"
                >
                  {radioConfig.stationName}
                </Text>
                <Text
                  fontSize={{ md: "sm", lg: "md" }}
                  color={isPlaying && !error ? "#00FF00" : brandDarkGray}
                  fontWeight={isPlaying && !error ? "semibold" : "normal"}
                  opacity={isPlaying && !error ? 1 : 0.7}
                >
                  {isPlaying && !error ? "● En vivo" : error ? "Sin conexión" : "Pausado"}
                </Text>
              </VStack>
            </HStack>

            {/* Sección central - Controles principales */}
            <HStack 
              spacing={{ md: 3, lg: 4 }} 
              align="center" 
              justify="center"
              flexShrink={0}
            >
              {/* Botón play/pause principal */}
              <IconButton
                aria-label={isPlaying ? 'Pausar' : 'Reproducir'}
                icon={<Icon as={isPlaying ? FiPause : FiPlay} />}
                onClick={handlePlayPause}
                borderRadius="full"
                bg={buttonColor}
                color="white"
                isLoading={isLoading}
                isDisabled={!isValidStreamUrl(streamUrl) || !!error}
                _hover={{
                  bg: buttonHoverColor,
                  transform: 'scale(1.1)',
                }}
                _active={{
                  transform: 'scale(0.95)',
                }}
                transition="all 0.2s ease"
                w={{ md: "56px", lg: "64px" }}
                h={{ md: "56px", lg: "64px" }}
                boxShadow={`0 4px 15px ${buttonColor}50`}
                fontSize={{ md: "20px", lg: "22px" }}
              />

              {/* Control de volumen */}
              <HStack 
                spacing={2} 
                align="center"
              >
                <IconButton
                  aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
                  icon={<Icon as={isMuted ? FiVolumeX : FiVolume2} />}
                  onClick={() => setIsMuted(!isMuted)}
                  variant="ghost"
                  color={brandDarkGray}
                  size="sm"
                  _hover={{
                    bg: "rgba(0, 0, 0, 0.05)",
                  }}
                />
                <Box w={{ md: "80px", lg: "100px" }}>
                  <Slider
                    value={isMuted ? 0 : volume}
                    min={0}
                    max={100}
                    onChange={handleVolumeChange}
                    size="sm"
                  >
                    <SliderTrack bg="rgba(0, 0, 0, 0.1)" h="4px" borderRadius="full">
                      <SliderFilledTrack bg={buttonColor} borderRadius="full" />
                    </SliderTrack>
                    <SliderThumb 
                      boxSize={3} 
                      bg={brandDarkGray} 
                      border="2px solid"
                      borderColor={buttonColor}
                      _focus={{ boxShadow: `0 0 0 3px ${buttonColor}30` }}
                    />
                  </Slider>
                </Box>
              </HStack>
            </HStack>
          </HStack>
        </Box>
      </Box>
    </>
  )
}

export default StickyRadioPlayer
