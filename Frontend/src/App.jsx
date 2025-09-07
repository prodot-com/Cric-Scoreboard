import React, { useEffect, useState } from 'react'
import Index from './Component/FrontPage/Index.jsx'
import Creation from './Component/CreationPage/Creation'
import { BrowserRouter, Routes, Route , Link} from 'react-router-dom'
import Toss from './Component/TossPage/UpperSection/Toss'
import AdminPage from './Component/AdminPage/AdminPage'
import SecondInnings from './Component/SecondInnings/SecondInnings'
import { CricContext, CricProvider, useCric } from './Context/CricContext'
import Home from './Component/Home.jsx'



const App = () => {
  const [matchDetails, setMatchDetails] = useState({})

  const addMatchDetails =(input)=>{
    setMatchDetails(input)
  }


  return (
    <CricProvider value={{matchDetails, addMatchDetails}}>
      <BrowserRouter>
    <Routes>
        <Route path='/Home' element={<Home/>}/>
        <Route path='/' element={<Index/>}/>
        <Route path='/creation' element={<Creation/>}/>
        <Route path='/toss/:id' element={<Toss/>}/>
        <Route path='/admin/:id' element={<AdminPage/>}/>
        <Route path='/second-innings/:id' element={<SecondInnings/>}/>
        {/* <Route path='/live-first' element={<LiveFirstInnings/>}/> */}
    </Routes>
    </BrowserRouter>
    </CricProvider>
  )
}

export default App
