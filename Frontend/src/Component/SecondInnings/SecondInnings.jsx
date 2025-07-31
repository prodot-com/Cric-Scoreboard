import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import Title from '../Title/Title'
import { io } from "socket.io-client";

const socket = io("https://cric-scoreboard.onrender.com/");

const SecondInnings = () => {
    let navigate = useNavigate()

    const [firstInningsDetails, setFirstInningsDetails] = useState({})
    const [totalOver,setTotalOver] = useState(0)
    const [target, setTarget] = useState(0)
    const [battingTeam, setBattingTeam] = useState('')
    const [iningsOver, setIningsOver] = useState(false)
    const [currentRun, setcurrentRun]  = useState(0)
    const [currentWicket, setcurrentWicket]  = useState(0)
    const [overs, setOvers] = useState("0.0");
    const [totalBalls, settotalBalls]  = useState(0)
    const [bowlingTeam, setBowlingTeam]  = useState('')
    const [battingTeamWon, setBattingTeamWon] = useState(false)
    const [bowlingTeamWon, setBowlingTeamWon] = useState(false)

    useEffect(()=>{

        const firstInningsDetails = JSON.parse(localStorage.getItem('firstInningsDetails'))
        // console.log(firstInningsDetails)
        if(!firstInningsDetails){
            navigate('/admin')
        }else{
            setFirstInningsDetails(firstInningsDetails)
        }

    },[navigate])

    useEffect(()=>{
        const data = JSON.parse(sessionStorage.getItem('liveSecondInningsData'))
        if(data){
          console.log(data)
          setcurrentRun(data.runs)
          setcurrentWicket(data.wickets)
          settotalBalls(data.balls)
        }
    
      },[])

    useEffect(()=>{
      // console.log(firstInningsDetails)
      setTarget(firstInningsDetails.runs + 1)
      setBattingTeam(firstInningsDetails.bowlingteam)
      setBowlingTeam(firstInningsDetails.battingteam)
      setTotalOver(firstInningsDetails.totalOver)
      
    },[firstInningsDetails])

    const changeRun = (value)=>{
      if(iningsOver) return

      if(value === 'wide' || value === 'no'){
        setcurrentRun(prev=>{
          const newRun = prev + 1;
          if(newRun === target)setBattingTeamWon(true)
            return newRun
        })
      }
    else if(value==='w'){
      setcurrentWicket(prev=>{
        const newWickets = prev + 1;
        // console.log(newWickets)
        if(newWickets === 10)setBowlingTeamWon(true)
          return newWickets
      })}

    else if(value !== 'wide' && value !== 'no'){
      setcurrentRun(prev =>{
        const newRun = prev + value
        if(newRun >= target)setBattingTeamWon(true)
          return newRun
      })
    }

    if(value !== 'wide' && value !== 'no'){
      settotalBalls(prev=>{
        const newBalls = prev + 1;
        if(newBalls === totalOver*6)setBowlingTeamWon(true)
          return newBalls
      })
    }

    }

    useEffect(() => {
        const liveSecondInningsData = {
          bowlingTeam,
          battingTeam,
          runs: currentRun,
          balls: totalBalls,
          wickets: currentWicket,
          totalOver
        }
    
        sessionStorage.setItem('liveSecondInningsData', JSON.stringify(liveSecondInningsData))
      }, [totalBalls, currentRun, currentWicket])

    useEffect(()=>{
      if(battingTeamWon || bowlingTeamWon){
        sessionStorage.clear("liveSecondInningsData")
      }
    },[battingTeamWon, bowlingTeamWon])

    useEffect(()=>{
        const SecondInnings = {
          bowlingTeam,
          battingTeam,
          runs: currentRun,
          balls: totalBalls,
          wickets: currentWicket,
          iningsOver,
          battingTeamWon,
          bowlingTeamWon
        }
        console.log(SecondInnings)
        socket.emit('newMessage', SecondInnings)
    
      },[totalBalls, currentRun,currentWicket])

      useEffect(() => {
    const over = Math.floor(totalBalls / 6);
    const balls = totalBalls % 6;
    setOvers(`${over}.${balls}`);
  }, [totalBalls]);


  return (
    <div>
      <div className='text-3xl font-bold flex justify-around mt-7'>
          <div>{battingTeam}</div>
          <div>{`${currentRun}/${currentWicket}`}</div>
          <div>{`Balls: ${totalBalls}`}</div>
          {/* <div>{`Overs: ${Overs}`}</div> */}
      </div>

      {(battingTeamWon) ? (<div>
          <h3 className='flex justify-center text-4xl font-bold mt-12 text-indigo-700'>{`${battingTeam} Won`}</h3>
        </div>)
      :(bowlingTeamWon)?(
        <div>
          <h3 className='flex justify-center text-4xl font-bold mt-12 text-indigo-700'>{`${bowlingTeam} Won`}</h3>
        </div>
      ):
      (
        <div>
        <Title text={`Over: ${overs}`} className='mt-5'/>
        <Title text={`${bowlingTeam} will bowl`} className='mt-5'/>
        <Title text={`Target: ${target}`} className='mt-5'/>

        <div className='flex justify-around mt-15 '>
          {[0,1,2,3,4,5,6,"wide","no"].map((value)=>(
            <button key={value} className='bg-amber-400 p-1 rounded-xl h-10 w-10 cursor-pointer' onClick={()=>changeRun(value)}>{value}</button>
          ))}
        </div>
        <div className='flex justify-center mt-5 font-bold text-2xl text-red-600 rounded-xl cursor-pointer' onClick={()=>changeRun("w")}>Out</div>
        
      </div>
      )}
      
    </div>
)}

export default SecondInnings
