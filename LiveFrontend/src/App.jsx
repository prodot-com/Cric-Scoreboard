import React from 'react'
import LivePage from './Component/LivePage/LivePage'
import Matches from './Component/Matches/Matches'
import { BrowserRouter, Route, Routes } from 'react-router'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Matches/>}/>
      <Route path='/Live' element={<LivePage/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
