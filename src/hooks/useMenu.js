import { useState, useEffect } from 'react'
import { getMainMenu } from '../services/menuService'
import { sortMenuItems, filterActiveItems } from '../components/menu/types'

export const useMenu = () => {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const processMenuData = (data) => {
    // Filtrar items activos y ordenar
    const activeItems = filterActiveItems(data)
    const sortedItems = sortMenuItems(activeItems)
    
    // Procesar también los children si existen
    const processedItems = sortedItems.map(item => {
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: sortMenuItems(filterActiveItems(item.children))
        }
      }
      return item
    })
    
    return processedItems
  }

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getMainMenu()
        const processedData = processMenuData(data)
        setMenuItems(processedData)
      } catch (err) {
        console.error('🚨 Error en useMenu:', err)
        setError(err.message || 'Error de conexión')
        // NO usar fallback - solo datos del backend
        setMenuItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchMenu()
  }, [])

  const refetch = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getMainMenu()
      const processedData = processMenuData(data)
      setMenuItems(processedData)
    } catch (err) {
      setError(err.message)
      setMenuItems([])
    } finally {
      setLoading(false)
    }
  }

  return {
    menuItems,
    loading,
    error,
    refetch
  }
}
