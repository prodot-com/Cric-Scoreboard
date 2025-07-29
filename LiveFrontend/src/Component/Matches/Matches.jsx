import React from 'react'
import {useNavigate} from 'react-router'

const Matches = () => {
    const navigate = useNavigate()

    const routeChange =()=>{
        navigate('/Live')
    }

  return (
    <div className='flex flex-col justify-center items-center gap-8 mt-10'>
        <div>Live Matches</div>
        <button className='font-bold bg-indigo-600 p-3 rounded-2xl' onClick={routeChange}>Watch now</button>
    </div>
  )
}

export default Matches
