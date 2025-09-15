import React from 'react'
import Matches from './Component/Matches/Matches'
import { BrowserRouter, Route, Routes } from 'react-router'
import LiveFirstInnings from './Component/LivePage/LivePage'  

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Matches />} />
        <Route path='/live/:id' element={<LiveFirstInnings />} /> 
      </Routes>
    </BrowserRouter>
  )
}

export default App
