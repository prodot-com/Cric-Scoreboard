import React from 'react'
import {io} from 'socket.io-client'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router'
import { useState } from 'react'

const socket = io('http://localhost:9000')

const LiveFirstInnings = () => {

  const [firstInningsDetails, setFirstInningsDetails] = useState('')
  const [battingteam, setBattingTeam] = useState('')
    const [bowlingteam, setBowlingTeam] = useState('')
    const [currentRun, setCurrentRun] = useState(0)
    const [currentWicket, setCurrentWicket] = useState(0)
    const [totalBalls, setTotalBalls] = useState(0)
    const [Overs, setOvers]  = useState('0.0')

  useEffect(() => {
    socket.on('message',(data)=>{
      console.log(data)
      setFirstInningsDetails(data)
    })
  },[])

    useEffect(()=>{
      setBattingTeam(firstInningsDetails.battingteam),
      setBowlingTeam(firstInningsDetails.bowlingteam),
      setCurrentRun(firstInningsDetails.runs),
      setCurrentWicket(firstInningsDetails.wickets),
      setTotalBalls(firstInningsDetails.balls)
    },[firstInningsDetails])

    const print =()=>{
      console.log(battingteam, bowlingteam , currentRun, currentWicket, totalBalls)
    }

  return (
    <div>
      <h3 className='flex justify-center text-4xl font-bold mt-12 text-indigo-700'>Live 1st Innings</h3>
      <button onClick={print}>print</button>
      </div>
  )
}

export default LiveFirstInnings
