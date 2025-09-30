import React from 'react'
import Menu from '../../layout/Menu'
import { Outlet } from 'react-router-dom'

const Home = () => {
  return (
    <>
        <Menu />
        <Outlet />
    </>
  )
}

export default Home