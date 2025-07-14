import React from 'react'
import Header from './Component/FrontPage/Header/Header'
import MatchCreate from './Component/FrontPage/MatchCreate/MatchCreate'
import Title from './Component/Title/Title'
import Matches from './Component/FrontPage/Matches/Matches'

const App = () => {
  return (
    <div className="min-h-screen w-full bg-white relative">
{/* Magenta Orb Grid Background */}
<div
 className="absolute inset-0 z-0"
 style={{
   background: "white",
   backgroundImage: `
     linear-gradient(to right, rgba(71,85,105,0.15) 1px, transparent 1px),
     linear-gradient(to bottom, rgba(71,85,105,0.15) 1px, transparent 1px),
     radial-gradient(circle at 50% 60%, rgba(236,72,153,0.15) 0%, rgba(168,85,247,0.05) 40%, transparent 70%)
   `,
   backgroundSize: "40px 40px, 40px 40px, 100% 100%",
 }}
/>
  {/* Your Content/Components */}
  <div className='relative z-10'>
    <Header/>
    <MatchCreate/>
    <Title text={`Live Match Now`}/>
    <Matches/>
  </div>
</div>
  )
}

export default App
