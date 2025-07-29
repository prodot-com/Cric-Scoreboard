import React from 'react'
import LivePage from './Component/LivePage/LivePage'
import Matches from './Component/Matches/Matches'
import { BrowserRouter, Route, Routes } from 'react-router'
import LiveSecondInnings from './Component/LiveSecondInnings/LiveSecondInnings'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Matches/>}/>
      <Route path='/Live' element={<LivePage/>}/>
      <Route path='/Live-second' element={<LiveSecondInnings/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
