import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import Title from '../Title/Title';
import { io } from "socket.io-client";
import axios from 'axios';


const SecondInnings = () => {
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const {id} = useParams()

  const [firstInningsDetails, setFirstInningsDetails] = useState({});
  const [totalOver, setTotalOver] = useState(0);
  const [target, setTarget] = useState(0);
  const [battingTeam, setBattingTeam] = useState('');
  const [iningsOver, setIningsOver] = useState(false);
  const [currentRun, setCurrentRun] = useState(0);
  const [currentWicket, setCurrentWicket] = useState(0);
  const [overs, setOvers] = useState("0.0");
  const [totalBalls, setTotalBalls] = useState(0);
  const [bowlingTeam, setBowlingTeam] = useState('');
  const [battingTeamWon, setBattingTeamWon] = useState(false);
  const [bowlingTeamWon, setBowlingTeamWon] = useState(false);
  const [secondInningsStarted, setSecondInningsStarted] = useState(true);
  const [bowlingStarted, setBowlingStarted] = useState(false);
  const [matchEnd, setMatchEnd] = useState(false)

useEffect(() => {
  socketRef.current = io("https://cric-scoreboard.onrender.com/");
  socketRef.current.emit('joinMatch', id); // join match room

  return () => {
    socketRef.current.disconnect();
  };
}, [id]);


  useEffect(() => {
    const firstInnings = JSON.parse(localStorage.getItem('firstInningsDetails'));
    if (!firstInnings) {
      navigate('/admin');
    } else {
      setFirstInningsDetails(firstInnings);
    }
  }, [navigate]);

  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem('liveSecondInningsData'));
    if (data) {
      setCurrentRun(data.runs || 0);
      setCurrentWicket(data.wickets || 0);
      setTotalBalls(data.balls || 0);
    }
  }, []);

  useEffect(() => {
    setTarget(firstInningsDetails.runs + 1 || 0);
    setBattingTeam(firstInningsDetails.bowlingteam || '');
    setBowlingTeam(firstInningsDetails.battingteam || '');
    setTotalOver(firstInningsDetails.totalOver || 0);
  }, [firstInningsDetails]);

  const changeRun = (value) => {
    if (iningsOver) return;

    if (value === 'wide' || value === 'no') {
      setCurrentRun(prev => {
        const newRun = prev + 1;
        if (newRun >= target) {
          setBattingTeamWon(true);
          setMatchEnd(true)};
        return newRun;
      });
    } else if (value === 'w') {
      setCurrentWicket(prev => {
        const newWickets = prev + 1;
        if (newWickets === 10) {
          setBowlingTeamWon(true);
          setMatchEnd(true)};
        return newWickets;
      });
    } else {
      setCurrentRun(prev => {
        const newRun = prev + value;
        if (newRun >= target) {
          setBattingTeamWon(true);
          setMatchEnd(true)};
        return newRun;
      });
    }

    if (value !== 'wide' && value !== 'no') {
      setTotalBalls(prev => {
        const newBalls = prev + 1;
        if (newBalls === totalOver * 6) {
          setBowlingTeamWon(true); 
          setMatchEnd(true)};
        return newBalls;
      });
    }
  };

  useEffect(()=>{
    if(matchEnd){
      console.log('matchend',matchEnd)
      const data = JSON.parse(localStorage.getItem('firstInningsDetails'))
      console.log(data)
      const firstSummary = {
        battingteam: data.battingteam,
        bowlingteam: data.bowlingteam,
        runs: data.runs,
        totalOver: data.totalOver,
        wickets: data.wickets,
        balls: data.balls
      }

      const secondSummary ={
        battingteam: battingTeam,
        bowlingteam: bowlingTeam,
        runs: currentRun,
        totalOver,
        wickets: currentWicket,
        balls: totalBalls
      }
      console.log('first:',firstSummary)
      console.log('secondSummary:',secondSummary)

      const addSummary = async ()=>{
        try {
          const res = await axios.post(`https://cric-scoreboard.onrender.com/user/addsummary/${id}`,{
            firstSummary,
            secondSummary
          })

          console.log(res.data)
        } catch (error) {
          console.log('Some error happened', error)
          return
        }
      }

      addSummary()


    }
  },[matchEnd])

  useEffect(() => {
    const data = {
      bowlingTeam,
      battingTeam,
      runs: currentRun,
      balls: totalBalls,
      wickets: currentWicket,
      totalOver
    };
    sessionStorage.setItem('liveSecondInningsData', JSON.stringify(data));
  }, [totalBalls, currentRun, currentWicket]);

  useEffect(() => {
    if (battingTeamWon || bowlingTeamWon) {
      sessionStorage.removeItem('liveSecondInningsData');
    }
  }, [battingTeamWon, bowlingTeamWon]);

  useEffect(() => {
    const data = {
      bowlingTeam,
      battingTeam,
      runs: currentRun,
      balls: totalBalls,
      wickets: currentWicket,
      iningsOver,
      battingTeamWon,
      bowlingTeamWon,
      target,
      secondInningsStarted,
      bowlingStarted
    };
    socketRef.current.emit('message', {data, matchId: id});
  }, [totalBalls,
  currentRun,
  currentWicket,
  iningsOver,
  battingTeamWon,
  bowlingTeamWon,
  target,
  secondInningsStarted,
  bowlingStarted]);

  const watchSummary = ()=>{

  }

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
      </div>

      {battingTeamWon ? (
        <div><h3 className='flex items-center justify-center font-bold text-4xl mt-10 text-indigo-700'>{`${battingTeam} Won`}</h3>
        <h4 className='flex items-center justify-center font-bold text-4xl text-purple-600 mt-7' onClick={watchSummary}>Watch Summary</h4>
        <div>{iningsOver ? (<div>gh</div>):(<div></div>)}</div>
        </div>
      ) : bowlingTeamWon ? (
        <div className='flex flex-col items-center justify-center text-4xl cursor-pointer font-bold mt-12'><h3 className='text-indigo-700'>{`${battingTeam} Won`}</h3>
        <h4 className='text-purple-600 mt-7' onClick={watchSummary}>Watch Summary</h4>
        </div>
      ) : (
        <div>
          <Title text={`Over: ${overs}`} className='mt-5' />
          <Title text={`${bowlingTeam} will bowl`} className='mt-5' />
          <Title text={`Target: ${target}`} className='mt-5' />

          <div className='flex justify-around mt-8'>
            {[0, 1, 2, 3, 4, 5, 6, 'wide', 'no'].map((value) => (
              <button
                key={value}
                className='bg-amber-400 p-1 rounded-xl h-10 w-10 cursor-pointer'
                onClick={() => {
                  changeRun(value);
                  setBowlingStarted(true);
                }}
              >
                {value}
              </button>
            ))}
          </div>

          <div
            className='flex justify-center mt-5 font-bold text-2xl text-red-600 rounded-xl cursor-pointer'
            onClick={() => {
              changeRun('w');
              setBowlingStarted(true);
            }}
          >
            Out
          </div>
        </div>
      )}
    </div>
  );
};

export default SecondInnings;
