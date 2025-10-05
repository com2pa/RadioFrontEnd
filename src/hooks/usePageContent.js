import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getPageContent, getPageMetadata } from '../services/pageService'

export const usePageContent = () => {
  const location = useLocation()
  const [content, setContent] = useState(null)
  const [metadata, setMetadata] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadPageContent = async () => {
      try {
        setLoading(true)
        setError(null)

        const path = location.pathname
        
        // Cargar contenido y metadatos en paralelo
        const [contentResponse, metadataResponse] = await Promise.all([
          getPageContent(path),
          getPageMetadata(path)
        ])

        setContent(contentResponse)
        setMetadata(metadataResponse.metadata || {
          title: path.charAt(1).toUpperCase() + path.slice(2),
          description: `Página ${path}`,
          keywords: path.replace('/', '')
        })

      } catch (err) {
        setError(err.message)
        console.error('Error al cargar contenido de página:', err)
      } finally {
        setLoading(false)
      }
    }

    loadPageContent()
  }, [location.pathname])

  return {
    content,
    metadata,
    loading,
    error,
    path: location.pathname
  }
}
