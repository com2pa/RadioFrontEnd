import React from 'react'
import { Box, useColorModeValue } from '@chakra-ui/react'
import PublicLayout from '../../components/layout/PublicLayout'
import PublicFooter from '../../components/layout/PublicFooter'
import HeroSection from '../../components/sections/HeroSection'
import LivePrograms from '../../components/sections/LivePrograms'
import TopSongs from '../../components/sections/TopSongs'
import StatsSection from '../../components/sections/StatsSection'
import CategoriesSection from '../../components/sections/CategoriesSection'
import StickyRadioPlayer from '../../components/StickyRadioPlayer'
import SEO from '../../components/SEO'
const Home = () => {
  // Colores oficiales de OXÍGENO 88.1FM
  const brandLightGray = '#CCCCCC' // Gris Claro
  const brandDarkGray = '#333333' // Gris Oscuro
  
  const bgColor = useColorModeValue(brandLightGray + '40', brandDarkGray)

  return (
    <PublicLayout>
      <SEO
        title="Oxígeno 88.1 FM - La Voz de Barquisimeto | Radio Online"
        description="Escucha Oxígeno 88.1 FM, la radio de Barquisimeto. Música, programas en vivo, noticias y entretenimiento 24/7. Transmisión en alta calidad desde Venezuela."
        keywords="Oxígeno Radio, 88.1 FM, Barquisimeto, radio online, streaming radio, música, programas radio, noticias Barquisimeto, radio Venezuela"
      />
      <Box 
        bg={bgColor} 
        minH="100vh" 
        pb="120px"
        px={{ base: 4, sm: 6, md: 8, lg: 10, xl: 12 }}
        py={{ base: 4, sm: 6, md: 8, lg: 10, xl: 12 }}
        position="relative"
        overflow="hidden"
      >
        <HeroSection />
        {/* <LivePrograms /> */}
        {/* <TopSongs /> */}
        {/* <StatsSection /> */}
        <CategoriesSection />
      </Box>
      <PublicFooter />
      
      {/* Reproductor Sticky */}
      <StickyRadioPlayer />
    </PublicLayout>
  )
}

export default Home