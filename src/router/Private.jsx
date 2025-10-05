// components/Private.jsx - VERSIÓN CORREGIDA
import React from 'react'
import { Route, Routes, Navigate } from 'react-router-dom'
import { Box, Spinner, Text, VStack, Button } from '@chakra-ui/react'
import { useAuth } from '../hooks/useAuth'
import { getDashboardRoute } from '../utils/roleUtils'
import DashboardUser from '../pages/private/DashboardUser'
import DashboardAdmin from '../pages/private/DashboardAdmin'

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
      {/* USAR LAS RUTAS QUE COINCIDEN CON roleUtils.js */}
      <Route path="user" element={<DashboardUser />} />
      <Route path="admin" element={<DashboardAdmin />} />
      
      {/* Redirección automática */}
      <Route path="/" element={<Navigate to={getDashboardRoute(auth)} replace />} />
      
      {/* Cualquier otra ruta redirige al dashboard correcto */}
      <Route path="*" element={<Navigate to={getDashboardRoute(auth)} replace />} />
    </Routes>
  )
}

export default Private