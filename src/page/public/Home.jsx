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

const Home = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900')

  return (
    <PublicLayout>
      <Box bg={bgColor} minH="100vh" pb="120px"> {/* Padding bottom para el reproductor sticky */}
        <HeroSection />
        <LivePrograms />
        <TopSongs />
        <StatsSection />
        <CategoriesSection />
      </Box>
      <PublicFooter />
      
      {/* Reproductor Sticky */}
      <StickyRadioPlayer />
    </PublicLayout>
  )
}

export default Home