import React, { useEffect, useState } from 'react'
import Creation from './Component/CreationPage/Creation'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Toss from './Component/TossPage/Toss'
import AdminPage from './Component/AdminPage/AdminPage'
import Home from './Component/Home.jsx'



const App = () => {  

  return (
   
      <BrowserRouter>
    <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/creation' element={<Creation/>}/>
        <Route path='/toss/:id' element={<Toss/>}/>
        <Route path='/admin/:id' element={<AdminPage/>}/>
    </Routes>
    </BrowserRouter>
    
  )
}

export default App
