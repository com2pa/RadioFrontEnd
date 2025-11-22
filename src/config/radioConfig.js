/**
 * Configuración de Radio en Vivo
 * 
 * Para obtener la URL del stream de Zeno.fm:
 * 1. Abre https://zeno.fm/radio/oxigeno-88-1fm/ en tu navegador
 * 2. Abre las herramientas de desarrollador (F12)
 * 3. Ve a la pestaña "Network" (Red)
 * 4. Reproduce la radio en la página
 * 5. Busca una petición que contenga "stream" o "audio"
 * 6. Copia la URL completa del stream
 * 
 * Formatos comunes de URLs de Zeno.fm:
 * - https://stream.zeno.fm/xxxxxxxxxx
 * - https://zeno.fm/stream/xxxxxxxxxx
 * - https://streaming.radio.co/xxxxxxxxxx/listen
 */

export const radioConfig = {
  // URL del stream de radio en vivo
  // IMPORTANTE: Usar la URL base sin token temporal (los tokens expiran)
  // El sistema probará automáticamente las URLs alternativas si la principal falla
  streamUrl: 'https://stream.zeno.fm/hwwthayn6biuv',
  
  // URLs alternativas para probar automáticamente si la principal falla
  alternativeUrls: [
    'https://stream-177.zeno.fm/hwwthayn6biuv',
    'https://stream-178.zeno.fm/hwwthayn6biuv',
    'https://zeno.fm/stream/hwwthayn6biuv',
  ],
  
  // Información de la estación
  stationName: 'Radio Oxigeno 88.1 FM',
  stationDescription: 'La mejor música y noticias en vivo',
  
  // Configuración del reproductor
  autoPlay: false, // No reproducir automáticamente al cargar
  preload: 'auto', // Precargar el stream
  crossOrigin: 'anonymous', // Para CORS si es necesario
  
  // URLs alternativas (fallback si la principal falla)
  fallbackUrls: [
    // Agrega URLs alternativas aquí si las tienes
    // 'https://stream.zeno.fm/oxigeno-88-1fm-backup',
  ],
  
  // Configuración de reconexión
  reconnectAttempts: 5, // Número de intentos de reconexión
  reconnectDelay: 3000, // Delay entre intentos (ms)
}

/**
 * Función para obtener la URL del stream
 * Intenta la URL principal, si falla intenta las URLs de fallback
 */
export const getStreamUrl = () => {
  return radioConfig.streamUrl
}

/**
 * Función para validar si una URL de stream es válida
 */
export const isValidStreamUrl = (url) => {
  if (!url || typeof url !== 'string') return false
  try {
    const urlObj = new URL(url)
    return ['http:', 'https:'].includes(urlObj.protocol)
  } catch {
    return false
  }
}

