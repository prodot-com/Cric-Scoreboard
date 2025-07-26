import React from 'react'

const Matches = ({team1, team2}) => {

  const routeChange = ()=>{
    
  }

  return (
    <div onClick={routeChange} className='bg-linear-to-r from-blue-200 via-blue-400 to-blue-600
    flex flex-col justify-evenly items-center font-bold mx-14 rounded-2xl m-6 min-h-28 text-2xl'>
      <h3>{team1}</h3>
      <h3>{team2}</h3>
    </div>
  )
}

export default Matches
