import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import Title from '../Title/Title'
import { io } from 'socket.io-client';

const socket = io("https://cric-scoreboard.onrender.com/");

const SecondInnings = () => {
    let navigate = useNavigate()

    const [firstInningsDetails, setFirstInningsDetails] = useState({})
    const [totalOver,setTotalOver] = useState(0)
    const [target, setTarget] = useState(0)
    const [battingTeam, setBattingTeam] = useState('Loading')
    const [iningsOver, setIningsOver] = useState(false)
    const [currentRun, setcurrentRun]  = useState(0)
    const [currentWicket, setcurrentWicket]  = useState(0)
    const [totalBalls, settotalBalls]  = useState(0)
    const [bowlingTeam, setBowlingTeam]  = useState('_')
    const [battingTeamWon, setBattingTeamWon] = useState(false)
    const [bowlingTeamWon, setBowlingTeamWon] = useState(false)


    

    useEffect(() => {
      const handleMessage = (data) => {
        console.log(data)
        setBattingTeam(data.battingTeam || "N/A");
        setBowlingTeam(data.bowlingTeam || "N/A");
        setcurrentRun(data.runs || 0);
        setcurrentWicket(data.wickets || 0);
        settotalBalls(data.balls || 0);
        setIningsOver(data.iningsOver);
        setBattingTeamWon(data.battingTeamWon);
        setBowlingTeamWon(data.bowlingTeamWon)
    
        
      };

      
    
      socket.on("newMessage", handleMessage);
    
      return () => {
        socket.off("newMessage", handleMessage);
      };
    }, []);

    useEffect(()=>{
        console.log(battingTeam, bowlingTeam, currentRun)
      },[totalBalls])



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
        <Title text={`${bowlingTeam} will bowl`} className='mt-5'/>
        <Title text={`Target: ${target}`} className='mt-5'/>
        
      </div>
      )}
      
    </div>
)}

export default SecondInnings
