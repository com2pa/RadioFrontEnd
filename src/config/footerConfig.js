/**
 * Configuración del footer para páginas públicas
 * Centraliza toda la información del footer para facilitar el mantenimiento
 */

export const footerConfig = {
  companyInfo: {
    name: 'Radio FM',
    description: 'Tu estación de radio favorita con la mejor música, noticias y entretenimiento las 24 horas del día.',
    founded: '2020',
    slogan: 'Conectando voces, uniendo corazones'
  },
  
  quickLinks: [
    { label: 'Inicio', href: '/' },
    { label: 'Programas', href: '/programas' },
    { label: 'Noticias', href: '/noticias' },
    { label: 'Podcasts', href: '/podcasts' },
    { label: 'Contacto', href: '/contacto' },
    { label: 'Sobre Nosotros', href: '/sobre-nosotros' }
  ],
  
  services: [
    { label: 'Streaming en Vivo', href: '/streaming' },
    { label: 'Podcasts', href: '/podcasts' },
    { label: 'Noticias', href: '/noticias' },
    { label: 'Publicidad', href: '/publicidad' },
    { label: 'Eventos', href: '/eventos' },
    { label: 'Concursos', href: '/concursos' }
  ],
  
  legalLinks: [
    { label: 'Términos y Condiciones', href: '/terminos' },
    { label: 'Política de Privacidad', href: '/privacidad' },
    { label: 'Política de Cookies', href: '/cookies' },
    { label: 'Aviso Legal', href: '/aviso-legal' },
    { label: 'DMCA', href: '/dmca' }
  ],
  
  socialMedia: {
    facebook: 'https://facebook.com/radiofm',
    twitter: 'https://twitter.com/radiofm',
    instagram: 'https://instagram.com/radiofm',
    youtube: 'https://youtube.com/radiofm',
    tiktok: 'https://tiktok.com/@radiofm',
    spotify: 'https://open.spotify.com/user/radiofm'
  },
  
  contactInfo: {
    email: 'contacto@radiofm.com',
    phone: '+1 (555) 123-4567',
    address: '123 Radio Street, Ciudad, País 12345',
    businessHours: 'Lunes a Viernes: 8:00 AM - 6:00 PM',
    emergencyContact: '+1 (555) 999-8888'
  },
  
  // Configuraciones adicionales
  settings: {
    showNewsletter: true,
    showSocialMedia: true,
    showContactInfo: true,
    showBusinessHours: true,
    showEmergencyContact: false,
    logo: null, // URL del logo personalizado
    logoText: 'Radio FM',
    bgColor: null, // Color de fondo personalizado
    customSections: [] // Secciones adicionales personalizadas
  }
}

/**
 * Función para obtener configuración personalizada del footer
 * @param {Object} customConfig - Configuración personalizada
 * @returns {Object} Configuración combinada
 */
export const getFooterConfig = (customConfig = {}) => {
  return {
    ...footerConfig,
    ...customConfig,
    companyInfo: {
      ...footerConfig.companyInfo,
      ...customConfig.companyInfo
    },
    contactInfo: {
      ...footerConfig.contactInfo,
      ...customConfig.contactInfo
    },
    socialMedia: {
      ...footerConfig.socialMedia,
      ...customConfig.socialMedia
    },
    settings: {
      ...footerConfig.settings,
      ...customConfig.settings
    }
  }
}

/**
 * Función para actualizar enlaces del footer
 * @param {string} section - Sección a actualizar (quickLinks, services, legalLinks)
 * @param {Array} newLinks - Nuevos enlaces
 */
export const updateFooterLinks = (section, newLinks) => {
  if (footerConfig[section]) {
    footerConfig[section] = newLinks
  }
}

/**
 * Función para añadir enlaces al footer
 * @param {string} section - Sección donde añadir
 * @param {Object} newLink - Nuevo enlace
 */
export const addFooterLink = (section, newLink) => {
  if (footerConfig[section] && Array.isArray(footerConfig[section])) {
    footerConfig[section].push(newLink)
  }
}

/**
 * Función para actualizar información de contacto
 * @param {Object} newContactInfo - Nueva información de contacto
 */
export const updateContactInfo = (newContactInfo) => {
  footerConfig.contactInfo = {
    ...footerConfig.contactInfo,
    ...newContactInfo
  }
}

/**
 * Función para actualizar redes sociales
 * @param {Object} newSocialMedia - Nuevas redes sociales
 */
export const updateSocialMedia = (newSocialMedia) => {
  footerConfig.socialMedia = {
    ...footerConfig.socialMedia,
    ...newSocialMedia
  }
}

/**
 * Configuraciones predefinidas para diferentes tipos de páginas
 */
export const footerPresets = {
  // Footer básico para páginas simples
  basic: {
    settings: {
      showNewsletter: false,
      showSocialMedia: true,
      showContactInfo: false
    }
  },
  
  // Footer completo para página principal
  full: {
    settings: {
      showNewsletter: true,
      showSocialMedia: true,
      showContactInfo: true,
      showBusinessHours: true
    }
  },
  
  // Footer minimalista
  minimal: {
    settings: {
      showNewsletter: false,
      showSocialMedia: false,
      showContactInfo: false
    },
    quickLinks: [
      { label: 'Inicio', href: '/' },
      { label: 'Contacto', href: '/contacto' }
    ],
    services: [],
    legalLinks: [
      { label: 'Términos', href: '/terminos' },
      { label: 'Privacidad', href: '/privacidad' }
    ]
  }
}

