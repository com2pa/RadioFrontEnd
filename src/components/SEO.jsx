import { useEffect } from 'react'

/**
 * Componente SEO para gestionar meta tags y título de página
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la página
 * @param {string} props.description - Descripción meta
 * @param {string} props.keywords - Palabras clave separadas por comas
 * @param {string} props.image - URL de la imagen para Open Graph
 * @param {string} props.url - URL canónica de la página
 * @param {string} props.type - Tipo de contenido (website, article, etc.)
 */
const SEO = ({ 
  title = 'Oxígeno 88.1 FM - La Voz de Barquisimeto',
  description = 'Oxígeno 88.1 FM, la radio de Barquisimeto. Escucha música, programas en vivo, noticias y más. Transmisión 24/7 en alta calidad.',
  keywords = 'radio, Barquisimeto, 88.1 FM, música, programas, noticias, streaming, radio online, Venezuela',
  image = '/og-image.jpg',
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website'
}) => {
  useEffect(() => {
    // Actualizar título
    document.title = title

    // Función para actualizar o crear meta tag
    const setMetaTag = (name, content, attribute = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, name)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    // Meta tags básicos
    setMetaTag('description', description)
    setMetaTag('keywords', keywords)
    setMetaTag('author', 'Oxígeno 88.1 FM')
    setMetaTag('robots', 'index, follow')

    // Open Graph tags
    setMetaTag('og:title', title, 'property')
    setMetaTag('og:description', description, 'property')
    setMetaTag('og:image', image, 'property')
    setMetaTag('og:url', url, 'property')
    setMetaTag('og:type', type, 'property')
    setMetaTag('og:site_name', 'Oxígeno 88.1 FM', 'property')
    setMetaTag('og:locale', 'es_VE', 'property')

    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image')
    setMetaTag('twitter:title', title)
    setMetaTag('twitter:description', description)
    setMetaTag('twitter:image', image)

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', url)

    // Meta tags adicionales
    setMetaTag('theme-color', '#E50000')
    setMetaTag('msapplication-TileColor', '#E50000')
  }, [title, description, keywords, image, url, type])

  return null
}

export default SEO

