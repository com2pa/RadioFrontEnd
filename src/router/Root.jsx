import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import Public from './Public'
import Private from './Private'

const Root = () => {
  return (
    <BrowserRouter>
      <Public />
      <Private />
    </BrowserRouter>
  )
}

export default Root