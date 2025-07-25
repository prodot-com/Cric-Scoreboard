import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

const SecondInnings = () => {
    let navigate = useNavigate()

    const [firstInningsDetails, setFirstInningsDetails] = useState({})
    const [target, setTarget] = useState(0)

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
    },[firstInningsDetails])


  return (
    <div>
      <h3>2nd Innings</h3>
      <h4>{`Target: ${target}`}</h4>
      <h4>{`battingTeam: ${firstInningsDetails.battingteam}`}</h4>
    </div>
  )
}

export default SecondInnings
