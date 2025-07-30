import React, { useEffect, useState } from 'react';
import { replace, useNavigate } from 'react-router';
import { io } from 'socket.io-client';

const socket = io("https://cric-scoreboard.onrender.com/");
// const navigate = useNavigate()


const LiveFirstInnings = () => {

  const navigate = useNavigate()

  const [battingteam, setBattingTeam] = useState("Loading...");
  const [bowlingteam, setBowlingTeam] = useState("Loading...");
  const [currentRun, setCurrentRun] = useState(0);
  const [currentWicket, setCurrentWicket] = useState(0);
  const [totalBalls, setTotalBalls] = useState(0);
  const [overs, setOvers] = useState("0.0");
  const [iningsOver, setIningsOver] = useState(false)
  const [secondInningsStart, setSecondInningsStart] = useState(false)

useEffect(() => {
  const handleMessage = (data) => {
    console.log(data)
    setBattingTeam(data.battingteam || "N/A");
    setBowlingTeam(data.bowlingteam || "N/A");
    setCurrentRun(data.runs || 0);
    setCurrentWicket(data.wickets || 0);
    setTotalBalls(data.balls || 0);
    setIningsOver(data.iningsOver)
    setSecondInningsStart(data.secondInningsStart)


    localStorage.setItem("firstInningsDetails", JSON.stringify(data));
  };

  socket.on("message", handleMessage);

  return () => {
    socket.off("message", handleMessage);
  };
}, []);

useEffect(() => {
  const savedData = localStorage.getItem("firstInningsDetails");
  if (savedData) {
    const parsed = JSON.parse(savedData);
    setBattingTeam(parsed.battingteam || "N/A");
    setBowlingTeam(parsed.bowlingteam || "N/A");
    setCurrentRun(parsed.runs || 0);
    setCurrentWicket(parsed.wickets || 0);
    setTotalBalls(parsed.balls || 0);
    setIningsOver(parsed.iningsOver)
  }
}, []);

  // const routeChange = ()=>{
  //   navigate('/live-second')
  // }

  // if(setSecondInningsStart){
  //   routeChange()
  // }
  useEffect(()=>{
    if(secondInningsStart){
      navigate('/live-second', {replace: true})
    }
  },[secondInningsStart])



  useEffect(() => {
    const over = Math.floor(totalBalls / 6);
    const balls = totalBalls % 6;
    setOvers(`${over}.${balls}`);
  }, [totalBalls]);

  return (
      <div className='text-3xl font-bold flex flex-col items-center mt-7'>
      <div>{battingteam}</div>
      <div>{`${currentRun}/${currentWicket}`}</div>
      <div>{`Balls: ${totalBalls}`}</div>
      <div>{`Overs: ${overs}`}</div>

      {iningsOver && (
        <div className='flex flex-col items-center mt-9 text-indigo-700'>
          <h3>Innings Over</h3>
          <h2>{`Target: ${currentRun +1}`}</h2>
          <h2>Second Innings will start soon</h2>
        </div>
      )}
    </div>
  );
};

export default LiveFirstInnings;
