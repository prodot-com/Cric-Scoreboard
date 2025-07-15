import React from 'react'
import Index from './Component/FrontPage'
import Creation from './Component/CreationPage/Creation'
import { BrowserRouter, Routes, Route , Link} from 'react-router-dom'
import Toss from './Component/TossPage/UpperSection/Toss'
import AdminPage from './Component/AdminPage/AdminPage'



const App = () => {
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<Index/>}/>
        <Route path='/creation' element={<Creation/>}/>
        <Route path='/toss' element={<Toss/>}/>
        <Route path='/admin' element={<AdminPage/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
