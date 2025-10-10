// components/Private.jsx - VERSIÓN CORREGIDA
import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { Box, Spinner, Text, VStack, Button } from '@chakra-ui/react'
import { useAuth } from '../hooks/useAuth'
import { getDashboardRoute } from '../utils/roleUtils'
import DashboardUser from '../pages/private/DashboardUser'
import DashboardAdmin from '../pages/private/DashboardAdmin'
import PodcastCategory from '../pages/private/PodcastCategory'
import PodcastSubcategory from '../pages/private/PodcastSubcategory'
import PodcastUpload from '../pages/private/PodcastUpload'
import NewsCategory from '../pages/private/NewsCategory'
import NewsSubcategory from '../pages/private/NewsSubcategory'
import MenuManagement from '../pages/private/MenuManagement'
import SubscribersManagement from '../pages/private/SubscribersManagement'
import UserRolesManagement from '../pages/private/UserRolesManagement'

const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minH="100vh">
    <VStack spacing={4}>
      <Spinner size="lg" color="blue.500" />
      <Text color="gray.500">Cargando...</Text>
    </VStack>
  </Box>
)

const Private = () => {
  const { auth } = useAuth()
  
  console.log('🔐 [Private] - Auth state:', auth)
  console.log('🔐 [Private] - Current path:', window.location.pathname)

  if (!auth) {
    console.log('❌ [Private] - No auth, showing loading')
    return <LoadingFallback />
  }

  console.log('✅ [Private] - User authenticated, rendering routes')
  
  return (
    <Routes>
      {/* Rutas del dashboard */}
      <Route path="user" element={<DashboardUser />} />
      <Route path="admin" element={<DashboardAdmin />} />
      
      {/* Rutas de administración */}
      <Route path="admin/podcast-category" element={<PodcastCategory />} />
      <Route path="admin/podcast-subcategory" element={<PodcastSubcategory />} />
      <Route path="admin/podcast-upload" element={<PodcastUpload />} />
      <Route path="admin/news-category" element={<NewsCategory />} />
      <Route path="admin/news-subcategory" element={<NewsSubcategory />} />
      <Route path="admin/menu-management" element={<MenuManagement />} />
      <Route path="admin/subscribers" element={<SubscribersManagement />} />
      <Route path="admin/user-roles" element={<UserRolesManagement />} />
      
      {/* Redirección automática */}
      <Route path="/" element={<Navigate to={getDashboardRoute(auth)} replace />} />
      
      {/* Cualquier otra ruta redirige al dashboard correcto */}
      <Route path="*" element={<Navigate to={getDashboardRoute(auth)} replace />} />
    </Routes>
  )
}

export default Private