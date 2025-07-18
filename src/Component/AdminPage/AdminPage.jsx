import React, { useEffect, useState } from 'react'
import {  useNavigate } from 'react-router'
import Title from '../Title/Title'


const AdminPage = () => {
  const navigate = new useNavigate()

  const [matchData, setMatchData] =  useState({})
  const [tossData, setTossData] =  useState({})
  const [battingteam, setBattingTeam] = useState('')
  const [bowlingteam, setBowlingTeam] = useState('')
  const [currentRun, setCurrentRun] = useState(0)
  const [currentWicket, setCurrentWicket] = useState(0)
  const [iningsOver, setIningsOver] = useState(false)
  const [totalBalls, setTotalBalls] = useState(0)
  const [Overs, setOvers]  = useState(0)

  // const tossDetails = ()=>{
  //   JSON.parse(localStorage.getItem("tossDetails"))
  // }
  const endIninngs = ()=>{
      setIningsOver(true)
      console.log('innings Ended')
    }

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
  console.log('BowlingTeam:',bowlingteam)
}, [matchData, battingteam, bowlingteam]);

  useEffect(()=>{
      const over = Math.floor((totalBalls)/6)
      const balls = (totalBalls)%6
      setOvers(`${over}.${balls}`)
  },[totalBalls])

  const changeRun = (value)=>{
    if(iningsOver) return

    if(value === 'wide'){
      setCurrentRun(prev=> prev + 1)
    
    }else if(value==='no'){setCurrentRun(prev=>prev+1)}
    
    else if(value === "W"){
      setCurrentWicket(prev=>{
        const newWickets = prev+1;
        if(newWickets === 10) endIninngs()
          return newWickets;
      })
    }
    else{
      setCurrentRun(prev => prev + value)
    }


    if(value !== 'wide' && value !== "no"){
      setTotalBalls(prev =>{
        const newBalls = prev +1;
        if(newBalls == (matchData.over)*6)endIninngs()
          return newBalls
      })
    }

  }

  return (
    <div>
      <div className='text-3xl font-bold flex justify-around mt-7'>
          <div>{battingteam}</div>
          <div>{`${currentRun}/${currentWicket}`}</div>
          <div>{`Balls: ${totalBalls}`}</div>
          <div>{`Overs: ${Overs}`}</div>
      </div>

      {!iningsOver ? (<div>
        <Title text={`${bowlingteam} will bowl`} className='mt-5'/>

        <div className='flex justify-around mt-15 '>
          {[0,1,2,3,4,5,6,"wide","no"].map((value)=>(
            <button key={value} className='bg-amber-400 p-1 rounded-xl h-10 w-10 cursor-pointer' onClick={()=>changeRun(value)}>{value}</button>
          ))}
        </div>
        <div className='flex justify-center mt-5 font-bold text-2xl text-red-600 rounded-xl cursor-pointer' onClick={()=>changeRun("W")}>Out</div>
        
      </div>)
      :(
        <Title text={`1st innings end`} className='mt-5'/>
      )}
      
    </div>
  )
}



export default AdminPage
