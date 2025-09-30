import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../page/public/Home'

const Public = () => {
  return (
    <Routes>
      <Route path='/' element={<Home />}/>
    </Routes>
  )
}

export default Public