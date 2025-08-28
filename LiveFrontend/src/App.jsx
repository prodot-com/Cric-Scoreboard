import React from 'react'
import Matches from './Component/Matches/Matches'
import { BrowserRouter, Route, Routes } from 'react-router'
import LiveFirstInnings from './Component/LivePage/LivePage'   // 👈 exports LiveFirstInnings
import LiveSecondInnings from './Component/LiveSecondInnings/LiveSecondInnings'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Matches />} />
        <Route path='/live/:id' element={<LiveFirstInnings />} />   {/* lowercase */}
        <Route path='/live-second/:id' element={<LiveSecondInnings />} /> {/* lowercase */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
