import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Title from '../Title/Title';
import { io } from 'socket.io-client';
import axios from 'axios'

const socket = io("https://cric-scoreboard.onrender.com/");

const SecondInnings = () => {
  const navigate = useNavigate();

  const {id}= useParams()

  const [target, setTarget] = useState(0);
  const [battingTeam, setBattingTeam] = useState('Loading');
  const [bowlingTeam, setBowlingTeam] = useState('_');
  const [currentRun, setCurrentRun] = useState(0);
  const [currentWicket, setCurrentWicket] = useState(0);
  const [totalBalls, setTotalBalls] = useState(0);
  const [overs, setOvers] = useState("0.0");
  const [iningsOver, setIningsOver] = useState(false);
  const [battingTeamWon, setBattingTeamWon] = useState(false);
  const [bowlingTeamWon, setBowlingTeamWon] = useState(false);
  const [bowlingStarted, setBowlingStarted] = useState(false);
  const [difference, setDifference] = useState(0);
  const [matchEnd, setMatchEnd] = useState(false)
  const [matchDetails, setMatchDetails] =useState({})


  const [summary, setSummary] = useState(null); 
  const [showSummary, setShowSummary] = useState(false);


  useEffect(()=>{

    const getmatch = async()=>{
      const res = await axios.get(`http://localhost:9000/user/one/${id}`)

      console.log(res)
      if(res.data?.result.completed){
        setMatchEnd(true)
      }
      setMatchDetails(res.data.result)

    }
    getmatch()
    

  },[])

    useEffect(() => {
    socket.emit("joinMatch", id); 
  
  }, [id]);

  useEffect(()=>{
    const data = JSON.parse(localStorage.getItem('targetDetails'))
    console.log(data)
    setTarget(data.targ)
    setBattingTeam(data.battingteam)
    
  },[])

  // Load live session data
  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem('liveFirstInningsData'));
    if (data) {
      setCurrentRun(data.runs);
      setCurrentWicket(data.wickets);
      setTotalBalls(data.balls);
    }
  }, []);

  // Socket updates
  useEffect(() => {
    const handleMessage = (data) => {
      setShowSummary(false)
      setBattingTeam(data.battingTeam || "N/A");
      setBowlingTeam(data.bowlingTeam || "N/A");
      setCurrentRun(data.runs || 0);
      setCurrentWicket(data.wickets || 0);
      setTotalBalls(data.balls || 0);
      setIningsOver(data.iningsOver);
      setBattingTeamWon(data.battingTeamWon);
      setBowlingTeamWon(data.bowlingTeamWon);
      setTarget(data.target);
      setBowlingStarted(data.bowlingStarted)
    };

    socket.on("message", handleMessage);
    return () => {
      socket.off("message", handleMessage);
    };
  }, []);

  const watchSummary = async () => {
    try {
      const res = await axios.get(`http://localhost:9000/user/fetchsummary/${id}`);
      setSummary(res.data);
      console.log(res.data)
      setShowSummary(true);
    } catch (error) {
      console.log("Error fetching summary", error);
    }
  };

  useEffect(()=>{
    if(battingTeamWon){
      console.log('batting team = ', battingTeam)
      const Difference = 10 - currentWicket
      setDifference(Difference)
    }
      
    if(bowlingTeamWon){
      console.log('bowlingTeam won', bowlingTeam)
      const Difference = target - currentRun
      setDifference(Difference)
    }
  },[battingTeamWon, bowlingTeamWon])

 
  useEffect(() => {
    const liveSecondInningsData = {
      bowlingTeam,
      battingTeam,
      runs: currentRun,
      balls: totalBalls,
      wickets: currentWicket
    };
    sessionStorage.setItem('liveFirstInningsData', JSON.stringify(liveSecondInningsData));
  }, [totalBalls, currentRun, currentWicket]);

 
  useEffect(() => {
    const over = Math.floor(totalBalls / 6);
    const balls = totalBalls % 6;
    setOvers(`${over}.${balls}`);
  }, [totalBalls]);

  return (
    <div>

      {
        matchEnd ? (<div>
          <h1>Match Ended</h1>
          <button className='text-purple-600 mt-7 cursor-pointer' onClick={watchSummary}>
            Watch Summary
          </button>

        </div>):(<div>

              {bowlingStarted ? (<div className='text-3xl font-bold flex justify-around mt-7'>
        <div>{battingTeam}</div>
        <div>{`${currentRun}/${currentWicket}`}</div>
        <div>{`Balls: ${totalBalls}`}</div>
      </div>): (<div className='text-3xl font-bold flex justify-around mt-7'>
        <div>{`Target:${target}`}</div>
        <div>{`${bowlingTeam} will bowl`}</div>
      </div>)}

      {battingTeamWon ? (
        <div className='flex flex-col items-center justify-center text-4xl cursor-pointer font-bold mt-12'>
          <h3 className='text-indigo-700'>{`${battingTeam} Won`}</h3>
          <h3 className='text-indigo-700'>{`${battingTeam} won by ${difference} wickets`}</h3>
          <h4 className='text-purple-600 mt-7' onClick={watchSummary}>
            Watch Summary
          </h4>
        </div>
      ) : bowlingTeamWon ? (
        <div className='flex flex-col items-center justify-center text-4xl cursor-pointer font-bold mt-12'>
          <h3 className='text-indigo-700'>{`${bowlingTeam} Won`}</h3>
          <h3 className='text-indigo-700'>{`${bowlingTeam} won by ${difference} runs`}</h3>
          <h4 className='text-purple-600 mt-7' onClick={watchSummary}>
            Watch Summary
          </h4>
        </div>
      ) : !bowlingStarted ? (
        <h3 className='flex justify-center text-4xl font-bold mt-12 text-indigo-700'>{`Match not yet started`}</h3>
      ): (
        <div>
          <Title text={`Over: ${overs}`} className='mt-5' />
          <Title text={`${bowlingTeam} will bowl`} className='mt-5' />
          <Title text={`Target: ${target}`} className='mt-5' />
        </div>
      )}

        </div>)
      }


      {showSummary && summary && (
        <div className='mt-10 p-5 bg-gray-100 rounded-lg'>
          <h2 className='text-2xl font-bold text-center mb-4'>Match Summary</h2>
          <div className='mb-4'>
            <h3 className='font-bold'>First Innings:</h3>
            <p>{summary.firstSummary.battingTeam} - {summary.firstSummary.runs}/{summary.firstSummary.wickets} in {summary.firstSummary.totalOver} overs</p>
          </div>
          <div>
            <h3 className='font-bold'>Second Innings:</h3>
            <p>{summary.secondSummary.battingTeam} - {summary.secondSummary.runs}/{summary.secondSummary.wickets} in {summary.secondSummary.totalOver} overs</p>
          </div>
          <div>
            {battingTeamWon?(<div>
              <h3 className='text-indigo-700'>{`${summary.secondSummary.matchWinner} won by ${difference} wickets`}</h3>
            </div>):(<div>
              <h3 className='text-indigo-700'>{`${summary.secondSummary.matchWinner} won by ${difference} runs`}</h3>
            </div>)}
          </div>
        </div>
      )}

    </div>
  );
};

export default SecondInnings;
