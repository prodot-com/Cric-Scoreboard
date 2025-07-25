import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import Title from '../Title/Title'

const SecondInnings = () => {
    let navigate = useNavigate()

    const [firstInningsDetails, setFirstInningsDetails] = useState({})
    const [target, setTarget] = useState(0)
    const [battingTeam, setBattingTeam] = useState('')
    const [iningsOver, setIningsOver] = useState(false)
    const [currentRun, setcurrentRun]  = useState(0)
    const [currentWicket, setcurrentWicket]  = useState(0)
    const [totalBalls, settotalBalls]  = useState(0)
    const [bowlingTeam, setBowlingTeam]  = useState('')

    useEffect(()=>{

        const firstInningsDetails = JSON.parse(localStorage.getItem('firstInningsDetails'))
        console.log(firstInningsDetails)
        if(!firstInningsDetails){
            navigate('/admin')
        }else{
            setFirstInningsDetails(firstInningsDetails)
        }

    },[navigate])

    useEffect(()=>{
      console.log(firstInningsDetails)
      setTarget(firstInningsDetails.runs + 1)
      setBattingTeam(firstInningsDetails.bowlingteam)
      setBowlingTeam(firstInningsDetails.battingteam)
      
    },[firstInningsDetails])

    const changeRun = (value)=>{
      if(iningsOver) return

      if(value === 'wide'){
        setcurrentRun(prev=>prev+1)
      }else if(value==='no'){
        setcurrentRun(prev=>prev +1)
    }
    else if(value==='w'){
      
    }

    }

    // useEffect(()=>
    //   console.log(battingTeam)
    // ,[firstInningsDetails])


  return (
    <div>
      <div className='text-3xl font-bold flex justify-around mt-7'>
          <div>{battingTeam}</div>
          <div>{`${currentRun}/${currentWicket}`}</div>
          <div>{`Balls: ${totalBalls}`}</div>
          {/* <div>{`Overs: ${Overs}`}</div> */}
      </div>

      {!iningsOver ? (<div>
        <Title text={`${bowlingTeam} will bowl`} className='mt-5'/>
        <Title text={`Target: ${target}`} className='mt-5'/>

        <div className='flex justify-around mt-15 '>
          {[0,1,2,3,4,5,6,"wide","no"].map((value)=>(
            <button key={value} className='bg-amber-400 p-1 rounded-xl h-10 w-10 cursor-pointer' onClick={()=>changeRun(value)}>{value}</button>
          ))}
        </div>
        <div className='flex justify-center mt-5 font-bold text-2xl text-red-600 rounded-xl cursor-pointer' onClick={()=>changeRun("W")}>Out</div>
        
      </div>)
      :(
        <div>
            <Title text={`1st innings end`} className='mt-5'/>
            <Title text={`Target: ${currentRun+1}`}/>
            <button className='bg-amber-400 p-1 rounded-xl ml-30 mt-7 cursor-pointer' onClick={routeChange}>Second Innings</button>
        </div>
      )}
      
    </div>
)}

export default SecondInnings
