import { useState, useEffect } from 'react'
import { getMainMenu } from '../services/menuService'
// import { sortMenuItems, filterActiveItems } from '../components/menu/types'

export const useMenu = () => {
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const processMenuData = (data) => {
    // Convertir datos del backend al formato esperado por los componentes
    const processedItems = data.map(item => ({
      id: item.id,
      label: item.title,
      href: item.path,
      order: item.order_index,
      active: item.is_active,
      children: item.children || []
    }))
    
    // Filtrar items activos y ordenar
    const activeItems = processedItems.filter(item => item.active)
    const sortedItems = activeItems.sort((a, b) => a.order - b.order)
    
    return sortedItems
  }

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true)
        setError(null)
        // console.log('🔄 Obteniendo menú...')
        const data = await getMainMenu()
        // console.log('📊 Datos del backend:', data)
        const processedData = processMenuData(data)
        // console.log('🔄 Datos procesados:', processedData)
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
