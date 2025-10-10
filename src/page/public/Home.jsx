import React from 'react'
import { Outlet } from 'react-router-dom'
import PublicFooter from '../../components/layout/PublicFooter'
import PublicLayout from '../../components/layout/PublicLayout'

const Home = () => {
  return (
    <PublicLayout>
      <Outlet />
      <PublicFooter />
    </PublicLayout>
  )
}

export default Home