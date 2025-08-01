import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { io } from 'socket.io-client';

const socket = io("https://cric-scoreboard.onrender.com/");

const LiveFirstInnings = () => {
  const navigate = useNavigate();

  const [battingteam, setBattingTeam] = useState("Loading...");
  const [bowlingteam, setBowlingTeam] = useState("Loading...");
  const [currentRun, setCurrentRun] = useState(0);
  const [currentWicket, setCurrentWicket] = useState(0);
  const [totalBalls, setTotalBalls] = useState(0);
  const [overs, setOvers] = useState("0.0");
  const [iningsOver, setIningsOver] = useState(false);
  const [secondInningsStart, setSecondInningsStart] = useState(false);
  const [bowlingStarted, setBowlingStarted] = useState(false)


  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('liveFirstInningsData'));
    if (data) {
      console.log('Live : ',data)
      setCurrentRun(data.runs || 0);
      setCurrentWicket(data.wickets || 0);
      setTotalBalls(data.balls || 0);
    }
  }, []);

  const targetDetails = (data)=>{
    const payload = {
      targ: data.runs,
    battingteam: data.battingteam,
    bowlingteam: data.bowlingteam
    }

    localStorage.setItem('targetDetails', JSON.stringify(payload))
  }


  useEffect(() => {
    const handleMessage = (data) => {
      if (data.secondInningsStarted) {
        console.log("Target to be saved:", data.runs); 
        targetDetails(data)
        navigate('/live-second', { replace: true });
      }
      // console.log(data)

      setBattingTeam(data.battingteam || "N/A");
      setBowlingTeam(data.bowlingteam || "N/A");
      setCurrentRun(data.runs || 0);
      setCurrentWicket(data.wickets || 0);
      setTotalBalls(data.balls || 0);
      setIningsOver(data.iningsOver || false);
      setSecondInningsStart(data.secondInningsStart || false);
      setBowlingStarted(data.bowlingStarted || false)

      
      const liveFirstInningsData = {
        battingteam: data.battingteam,
        bowlingteam: data.bowlingteam,
        // runs: data.runs,
        // balls: data.balls,
        // wickets: data.wickets,
      };

      localStorage.setItem('liveFirstInningsData', JSON.stringify(liveFirstInningsData));
    };

    socket.on("message", handleMessage);

    return () => {
      socket.off("message", handleMessage);
    };
  }, [navigate]);

  
  useEffect(() => {
    const over = Math.floor(totalBalls / 6);
    const balls = totalBalls % 6;
    setOvers(`${over}.${balls}`);
  }, [totalBalls]);

  return (
    <div>
      {bowlingStarted ? (<div className='text-3xl font-bold flex justify-around mt-7'>
        <div>{battingteam}</div>
        <div>{`${currentRun}/${currentWicket}`}</div>
        <div>{`Balls: ${totalBalls}`}</div>
      </div>): (<div className='flex justify-center text-4xl font-bold mt-12 text-indigo-700'>Match not yet started</div>)}

      {iningsOver && (
        <div className='flex flex-col items-center mt-9 text-indigo-700'>
          <h3>Innings Over</h3>
          <h2>{`Target: ${currentRun + 1}`}</h2>
          <h2>Second Innings will start soon</h2>
        </div>
      )}
    </div>
  );
};

export default LiveFirstInnings;
