import React, { useEffect, useState } from 'react'
import Index from './Component/FrontPage/Index.jsx'
import Creation from './Component/CreationPage/Creation'
import { BrowserRouter, Routes, Route , Link} from 'react-router-dom'
import Toss from './Component/TossPage/UpperSection/Toss'
import AdminPage from './Component/AdminPage/AdminPage'
import SecondInnings from './Component/SecondInnings/SecondInnings'
import Home from './Component/Home.jsx'



const App = () => {
  const [matchDetails, setMatchDetails] = useState({})

  const addMatchDetails =(input)=>{
    setMatchDetails(input)
  }


  return (
   
      <BrowserRouter>
    <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/Home' element={<Index/>}/>
        <Route path='/creation' element={<Creation/>}/>
        <Route path='/toss/:id' element={<Toss/>}/>
        <Route path='/admin/:id' element={<AdminPage/>}/>
        <Route path='/second-innings/:id' element={<SecondInnings/>}/>
    </Routes>
    </BrowserRouter>
    
  )
}

export default App
