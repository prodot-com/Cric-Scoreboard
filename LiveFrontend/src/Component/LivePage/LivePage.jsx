import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { io } from 'socket.io-client';
import { useParams } from 'react-router';
import axios from 'axios';


const socket = io("http://localhost:9000/");

const LiveFirstInnings = () => {
  const navigate = useNavigate();
    const {id}=useParams()

  const [battingteam, setBattingTeam] = useState("Loading...");
  const [bowlingteam, setBowlingTeam] = useState("Loading...");
  const [currentRun, setCurrentRun] = useState(0);
  const [currentWicket, setCurrentWicket] = useState(0);
  const [totalBalls, setTotalBalls] = useState(0);
  const [overs, setOvers] = useState("0.0");
  const [iningsOver, setIningsOver] = useState(false);
  const [secondInningsStart, setSecondInningsStart] = useState(false);
  const [bowlingStarted, setBowlingStarted] = useState(false)
  const [tossWinner, setTossWinner] = useState('...')
  const [decision, setDecision] = useState('...')

  const [striker, setStriker] = useState('')
  const [nonStriker, setNonStriker] = useState('')
  const [bowler, setBowler] = useState('')
  const [newBowler, setNewBowler] = useState("");
  const [nextBatsman, setNextBatsman] = useState('')
  const [availableBatsmen, setAvailableBatsmen] = useState([])
  const [availableBowlers, setAvailableBowlers] = useState([])
  const [newBatsman, setNewBatsman] = useState("")

  const [batsmanStats, setBatsmanStats] = useState({})
  const [bowlerStats, setBowlerStats] = useState({})

  useEffect(() => {
  socket.emit("joinMatch", id); 

}, [id]);


  useEffect(()=>{
    
    const getDetails = async ()=>{
      try {
        
        console.log("matchId: ", id)
        const response = await axios.get(`http://localhost:9000/user/one/${id}`)
        const result = response.data.result
        if(result.completed){
          navigate(`/live-second/${id}`, { replace: true })
        }
        console.log(result)
        setBattingTeam(result.team1)
        setBowlingTeam(result.team2)
        setTossWinner(result.tossWinner)
        setDecision(result.decision.toLowerCase())
      } catch (error) {
        console.log(error)
      }
    }

    getDetails()

  },[])


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
        navigate(`/live-sec/${id}`, { replace: true });
      }
      console.log(data)

      if(data.battingteam)setBattingTeam(data.battingteam);
      if(data.battingteam)setBowlingTeam(data.bowlingteam);
      setCurrentRun(data.runs || 0);
      setCurrentWicket(data.wickets || 0);
      setTotalBalls(data.balls || 0);
      setIningsOver(data.iningsOver || false);
      setSecondInningsStart(data.secondInningsStart || false);
      setBowlingStarted(data.bowlingStarted || false);
      setBatsmanStats(data.batsmanStats);
      setStriker(data.striker);
      setNonStriker(data.nonStriker);
      setBowlerStats(data.bowlerStats);
      setBowler(data.bowler || " ");


      
      const liveFirstInningsData = {
        battingteam: data.battingteam,
        bowlingteam: data.bowlingteam,
        // runs: data.runs,
        // balls: data.balls,
        // wickets: data.wickets,
      };

      localStorage.setItem('liveFirstInningsData', JSON.stringify(liveFirstInningsData));
    };

    socket.on("scoreUpdate", handleMessage);

    return () => {
      socket.off("scoreUpdate", handleMessage);
    };
  }, [navigate]);

  

  
  useEffect(() => {
    const over = Math.floor(totalBalls / 6);
    const balls = totalBalls % 6;
    setOvers(`${over}.${balls}`);
  }, [totalBalls]);

  return (
    <div>
      {bowlingStarted ? (<div className='text-3xl font-bold flex flex-col justify-around gap-7 mt-7 m-4'>
        <div className='flex justify-around'>
          <div>{battingteam}</div>
        <div>{`${currentRun}/${currentWicket}`}</div>
        <div>{`Balls: ${totalBalls}`}</div>
        <div>{bowlingteam}</div>
        </div>
        <div className='text-3xl font-bold flex  justify-between gap-7 mt-7'>
          <div>
            <h1>{striker}: {batsmanStats[striker].runs} - {batsmanStats[striker].balls}
              {batsmanStats[striker].out ? (<div>
                Out
              </div>)
              :(<div> </div>)}
            </h1>
            <h1>{nonStriker}: {batsmanStats[nonStriker].runs} - {batsmanStats[nonStriker].balls}
              {batsmanStats[nonStriker].out ? (<div>
                Out
              </div>)
              :(<div></div>)}
            </h1>
          </div>

          {bowlerStats[bowler] && (<div>
            <h1>{bowler}: {bowlerStats[bowler].wickets || 0}-{bowlerStats[bowler].runs || 0}</h1>
          </div>)}

        </div>
    

      </div>): (<div className='flex flex-col items-center justify-center text-4xl font-bold mt-12 text-indigo-700'>
        <h2>{`Team1: ${battingteam}`}</h2>
        <h2>{`Team2: ${bowlingteam}`}</h2>
        <h3>Match not yet started</h3>
        <h2 className='text-amber-500 text-2xl mt-7 '>{`Team ${tossWinner} choose to ${decision} first`}</h2>
      </div>)}

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
