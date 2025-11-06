import React, { Suspense } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Box, Spinner, Text, VStack } from '@chakra-ui/react'
import { useDynamicRoutes } from '../hooks/useDynamicRoutes'
import Home from '../page/public/Home'
import Register from '../pages/public/Register'
import Login from '../pages/public/Login'
import About from '../pages/public/About'
import Objective from '../pages/public/Objective'
import Terms from '../pages/public/Terms'
import Privacy from '../pages/public/Privacy'
import Cookies from '../pages/public/Cookies'
import Legal from '../pages/public/Legal'
import EmailVerification from '../pages/public/EmailVerification'
import Contact from '../pages/public/Contact'
import Teams from '../pages/public/Teams'
// Componente de carga
const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minH="50vh">
    <VStack spacing={4}>
      <Spinner size="lg" color="blue.500" />
      <Text color="gray.500">Cargando...</Text>
    </VStack>
  </Box>
)

// Componente de error
const ErrorFallback = ({ error }) => (
  <Box display="flex" justifyContent="center" alignItems="center" minH="50vh">
    <VStack spacing={4}>
      <Text color="red.500" fontSize="lg">Error al cargar rutas</Text>
      <Text color="gray.500" fontSize="sm">{error}</Text>
    </VStack>
  </Box>
)

const Public = () => {
  const location = useLocation()
  const { routes, loading, error } = useDynamicRoutes()
  
  // Rutas públicas que no necesitan cargar rutas dinámicas
  const publicRoutes = ['/', '/login', '/register', '/about', '/objective', '/terms', '/privacy', '/cookies', '/legal', '/contact', '/teams']
  const isPublicRoute = publicRoutes.includes(location.pathname) || location.pathname.startsWith('/verify/')
  
  // Solo mostrar loading para rutas que no son públicas
  if (!isPublicRoute && loading) {
    return <LoadingFallback />
  }

  if (!isPublicRoute && error) {
    return <ErrorFallback error={error} />
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Rutas estáticas conocidas */}
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/objective' element={<Objective />} />
        <Route path='/terms' element={<Terms />} />
        <Route path='/privacy' element={<Privacy />} />
        <Route path='/cookies' element={<Cookies />} />
        <Route path='/legal' element={<Legal />} />
        <Route path='/verify/:id/:token' element={<EmailVerification />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/teams' element={<Teams />} />
        
        {/* Rutas dinámicas generadas desde el backend - solo para rutas no públicas */}
        {!isPublicRoute && routes.map((route) => {
          const Component = route.element
          return (
            <Route 
              key={route.id} 
              path={route.path} 
              element={<Component />} 
            />
          )
        })}
        
        {/* Ruta 404 */}
        <Route path="*" element={
          <Box textAlign="center" py={20}>
            <Text fontSize="2xl" color="gray.500">Página no encontrada</Text>
            <Text color="gray.400">La página que buscas no existe</Text>
          </Box>
        } />
      </Routes>
    </Suspense>
  )
}

export default Public