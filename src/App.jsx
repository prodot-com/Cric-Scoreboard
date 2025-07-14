import React from 'react'
import Header from './Component/FrontPage/Header/Header'
import MatchCreate from './Component/FrontPage/MatchCreate/MatchCreate'

const App = () => {
  return (
    <div className='bg-gradient-to-b from-purple-200 via-indigo-400 to-violet-600 
    h-screen w-full flex flex-col justify-center items-center '>
      <Header/>
      <MatchCreate/>
    </div>
  )
}

export default App
