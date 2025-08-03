import React from 'react'
import {useNavigate} from 'react-router'
import axios from 'axios'
import { useState } from 'react'
import { useEffect } from 'react'
import ApiError from '../../../../Backend/Utils/ApiError'

const Matches = () => {
    const navigate = useNavigate()
    const [matches, setMatches]= useState([])

    useEffect(()=>{
      const fetchMatch = async ()=>{
        try {
          
          const response = await axios.get('https://cric-scoreboard.onrender.com/user/get')
          console.log(response.data)
          setMatches(response.data)

        } catch (error) {
          console.log("Something Went Wrong", error)
        }
      }

      fetchMatch()
    },[])

    const routeChange =(matchId)=>{
      console.log(matchId)
        navigate(`/Live/${matchId}`)
    }

  return (
    <div className='flex flex-col justify-center items-center gap-8 mt-10'>
        <div className='lex items-center text-4xl font-bold mb-5 text-amber-600'>Live Matches</div>
        {(matches.length ==0 )?(<div>No Live Match now</div>)
        :(matches.map((match)=>(
          <div key={match._id} onClick={()=>routeChange(match._id)} className='gap-5 flex flex-col bg-indigo-500 p-8 rounded-xl font-bold text-2xl'>
            <h3>{`Match Creator: ${match.name}`}</h3>
            <div className='flex flex-col items-center'>
              <h2>{`${match.team1}`}</h2>
              <h1>vs</h1>
              <h2>{`${match.team2}`}</h2>
            </div>
          </div>
        )))}
        {/* <button className='font-bold bg-indigo-600 p-3 rounded-2xl' onClick={routeChange}>Watch now</button> */}
    </div>
  )
}

export default Matches
