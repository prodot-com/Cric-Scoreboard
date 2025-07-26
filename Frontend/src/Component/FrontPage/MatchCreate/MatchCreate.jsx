import React from 'react'
import { useNavigate } from 'react-router'


const MatchCreate = () => {

  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    navigate('/creation');
  }

  return (
    <>
    <div onClick={routeChange}>
            <div className=' bg-linear-to-r from-gray-800 via-blue-700 to-gray-900 flex justify-center items-center 
        h-20 rounded-3xl mx-14  text-3xl font-bold text-white hover:shadow-lg shadow-blue-700/100 delay-75 cursor-pointer'>
            <h3>Create a Match</h3> 
        </div>
    </div>
    </>
  )
}

export default MatchCreate
