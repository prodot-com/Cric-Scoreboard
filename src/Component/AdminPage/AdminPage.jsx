import React, { useEffect, useState } from 'react'
import {  useNavigate } from 'react-router'


const AdminPage = () => {
  const navigate = new useNavigate()

  const [matchData, setMatchData] =  useState({})
  const [tossData, setTossData] =  useState({})
  const [battingteam, setBattingTeam] = useState('')
  const [bowlingteam, setBowlingTeam] = useState('')
  const [currentRun, setCurrentRun] = useState(0)
  const [currentWicket, setCurrentWicket] = useState(0)

  // const tossDetails = ()=>{
  //   JSON.parse(localStorage.getItem("tossDetails"))
  // }

  useEffect(()=>{
    const match = JSON.parse(localStorage.getItem('matchDetails'))
    const toss = JSON.parse(localStorage.getItem('tossDetails'))
    // console.log(JSON.parse(localStorage.getItem('matchDetails')))
    
    if(!match || !toss){
      navigate('/')
    }else{
    // console.log(match)
    // console.log(toss)
    setMatchData(()=>match)
    setTossData(()=>toss)
    // console.log(tossData)

    // console.log(matchData, tossData)

    const battingTeam = toss.decision === 'BAT'
    ? toss.tossWinner 
    : toss.tossWinner === match.team1
        ? match.team2
        : match.team1;


      setBattingTeam(battingTeam)

      const bowlingTeam = match.team1 !== toss.tossWinner
      ? match.team1 : match.team2
      setBowlingTeam(bowlingTeam)
    }


  },[])

  useEffect(() => {
  console.log('matchData:', matchData);
  console.log('battingTeam:', battingteam);
}, [matchData, battingteam]);

  const changeRun = ()=>{

  }

  return (
    <div>
      <div className='text-3xl font-bold flex justify-around mt-7'>
          <div>{battingteam}</div>
          <div>{`${currentRun}/${currentWicket}`}</div>
      </div>

        <div className='flex justify-around mt-15 '>
          {[0,1,2,3,4,5,6,"wide","no"].map((value)=>(
            <button key={value} className='bg-amber-400 p-1 rounded-xl h-10 w-10' onClick={()=>changeRun(value)}>{value}</button>
          ))}
        </div>
        {/* <div className='flex justify-around mt-7 '>
            <button className='bg-amber-400 p-1 rounded-xl h-15 w-15'>Wide</button>
            <button className='bg-amber-400 p-1 rounded-xl h-15 w-15'>No Ball</button>
        </div>
        <div className='flex justify-around mt-15 '>
            <button className='bg-red-600 p-1 rounded-xl h-14 w-14'>OUT</button>
        </div> */}
    </div>
  )
}



export default AdminPage
