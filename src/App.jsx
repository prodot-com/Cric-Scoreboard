import React from 'react'
import Index from './Component/FrontPage'
import Creation from './Component/CreationPage/Creation'
import { BrowserRouter, Routes, Route , Link} from 'react-router-dom'


const App = () => {
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<Index/>}/>
        <Route path='/creation' element={<Creation/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
