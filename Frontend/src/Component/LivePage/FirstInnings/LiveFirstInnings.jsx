import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io("https://cric-scoreboard.onrender.com", { transports: ["websocket"] });


const LiveFirstInnings = () => {
  const [battingteam, setBattingTeam] = useState("Loading...");
  const [bowlingteam, setBowlingTeam] = useState("Loading...");
  const [currentRun, setCurrentRun] = useState(0);
  const [currentWicket, setCurrentWicket] = useState(0);
  const [totalBalls, setTotalBalls] = useState(0);
  const [overs, setOvers] = useState("0.0");

useEffect(() => {
  const handleMessage = (data) => {
    setBattingTeam(data.battingteam || "N/A");
    setBowlingTeam(data.bowlingteam || "N/A");
    setCurrentRun(data.runs || 0);
    setCurrentWicket(data.wickets || 0);
    setTotalBalls(data.balls || 0);

    // ✅ Save to localStorage
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
  }
}, []);



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
    </div>
  );
};

export default LiveFirstInnings;
