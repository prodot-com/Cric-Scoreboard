import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router'
import Title from '../Title/Title'
import { io } from "socket.io-client";
import axios from 'axios'

const AdminPage = () => {
  const navigate = useNavigate()
  const socketRef = useRef(null)
  const { id } = useParams()

  const [matchData, setMatchData] = useState({})
  const [totalOver, setTotalOver] = useState(0)
  const [battingteam, setBattingTeam] = useState('')
  const [bowlingteam, setBowlingTeam] = useState('')
  const [currentRun, setCurrentRun] = useState(0)
  const [currentWicket, setCurrentWicket] = useState(0)
  const [iningsOver, setIningsOver] = useState(false)
  const [totalBalls, setTotalBalls] = useState(0)
  const [Overs, setOvers] = useState('0.0')
  const [secondInningsStart, setSecondInningsStart] = useState(false)
  const [secondInningsStarted, setSecondInningsStarted] = useState(false)
  const [bowlingStarted, setBowlingStarted] = useState(false)

  const [striker, setStriker] = useState('')
  const [nonStriker, setNonStriker] = useState('')
  const [bowler, setBowler] = useState('')
  const [newBowler, setNewBowler] = useState("");
  const [nextBatsman, setNextBatsman] = useState('')
  const [availableBatsmen, setAvailableBatsmen] = useState([])
  const [availableBowlers, setAvailableBowlers] = useState([])
  const [newBatsman, setNewBatsman] = useState("");


  useEffect(() => {
    socketRef.current = io("https://cric-scoreboard.onrender.com/")

    socketRef.current.on("connect", () => {
      if (id) socketRef.current.emit('joinMatch', id)
    })

    return () => {
      socketRef.current.disconnect()
    }
  }, [id])

  const getMatch = async () => {
    try {
      const res = await axios.get(`http://localhost:9000/user/one/${id}`)
      setMatchData(res.data.result)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => { getMatch() }, [])

  useEffect(() => {
    if (!matchData) return
    setTotalOver(matchData.over)

    const batting = matchData.decision === 'BAT'
      ? matchData.tossWinner
      : matchData.tossWinner === matchData.team1
        ? matchData.team2
        : matchData.team1

    const bowling = matchData.team1 !== matchData.tossWinner
      ? matchData.team1
      : matchData.team2

    setBattingTeam(batting)
    setBowlingTeam(bowling)

    // lineups
    if (matchData.players) {
      setAvailableBatsmen(matchData.players[batting] || [])
      setAvailableBowlers(matchData.players[bowling] || [])
    }
  }, [matchData])

  useEffect(() => {
    if (matchData?.batsman1 && matchData?.batsman2) {
      setStriker(matchData.batsman1)
      setNonStriker(matchData.batsman2)
      setAvailableBatsmen(prev => prev.filter(p => p !== matchData.batsman1 && p !== matchData.batsman2))
      setBowler(matchData.bowler)
      setAvailableBowlers(prev => [...prev, matchData.bowler.trim()])
    }
  }, [matchData])

  useEffect(() => {
    const over = Math.floor(totalBalls / 6)
    const balls = totalBalls % 6
    setOvers(`${over}.${balls}`)
  }, [totalBalls])

  const changeRun = (value) => {
    if (iningsOver) return

    if (value === 'wide' || value === 'no') {
      setCurrentRun(prev => prev + 1)
    } else if (value === "W") {
      setCurrentWicket(prev => {
        const newWickets = prev + 1
        if (newWickets === 10) setIningsOver(true)

        // bring next batsman
        if (nextBatsman) {
          setStriker(nextBatsman)
          setAvailableBatsmen(prev => prev.filter(p => p !== nextBatsman))
          setNextBatsman('')
        }
        return newWickets
      })
    } else {
      setCurrentRun(prev => prev + value)
    }

    if (value !== 'wide' && value !== 'no') {
      setTotalBalls(prev => {
        const newBalls = prev + 1
        if (newBalls === matchData.over * 6) setIningsOver(true)

        if( value === 1|| value === 3|| value ===5){
          const temp = striker
          setStriker(nonStriker)
          setNonStriker(temp)
        }
       
        if (newBalls % 6 === 0) {
          const temp = striker
          setStriker(nonStriker)
          setNonStriker(temp)
          setBowler('') 
        }
        return newBalls
      })
    }
  }

  useEffect(()=>{
    console.log(striker)
  },[striker,nonStriker])

  useEffect(() => {
    const firstInnings = {
      bowlingteam,
      battingteam,
      runs: currentRun,
      balls: totalBalls,
      wickets: currentWicket,
      iningsOver,
      secondInningsStart,
      secondInningsStarted,
      bowlingStarted,
      striker,
      nonStriker,
      bowler
    }

    socketRef.current?.emit('message', { matchId: id, data: firstInnings })
  }, [totalBalls, currentRun, currentWicket, iningsOver, secondInningsStart, secondInningsStarted, bowlingStarted, striker, nonStriker, bowler])

  const handleSubmit = () => {
    setSecondInningsStart(true)
    setSecondInningsStarted(true)
  }

  return (
    <div className='font-mono'>
      <div className='text-3xl font-bold flex justify-around mt-7'>
        <div>{battingteam}</div>
        <div>{`${currentRun}/${currentWicket}`}</div>
        <div>{`Balls: ${totalBalls}`}</div>
        <div>{`Overs: ${Overs}`}</div>
      </div>

      {!iningsOver ? (
        <div>
          <Title text={`${bowlingteam} will bowl`} className='mt-5' />

          
          <div className='flex justify-around mt-15 flex-wrap gap-2'>
            {[0, 1, 2, 3, 4, 5, 6, "wide", "no"].map((value) => (
              <button
                key={value}
                disabled={iningsOver || !bowler}
                className='bg-amber-400 p-1 rounded-xl h-10 w-14 cursor-pointer disabled:opacity-50'
                onClick={() => {
                  changeRun(value)
                  setBowlingStarted(true)
                }}
              >
                {value}
              </button>
            ))}
          </div>

          
          <div
            className='flex justify-center items mt-5 font-bold text-2xl text-red-600 cursor-pointer'
            
          >
            <h1 onClick={() => {
              changeRun('W')
              setBowlingStarted(true)
            }}>Out</h1>
          </div>

          {/* Next batsman dropdown (only visible after wicket) */}
          {/* Next batsman selection (only visible after wicket) */}
{currentWicket > 0 && (
  <div className='mt-5 flex flex-col items-center gap-3'>
    {/* <div className="flex gap-3 items-center">
      <label className='font-bold'>Next Batsman:</label>
      <select
        value={nextBatsman}
        onChange={(e) => setNextBatsman(e.target.value)}
        className='border p-1 rounded'
      >
        <option value="">Select</option>
        {availableBatsmen.map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
    </div> */}

    {/* Add new batsman */}
    <div className="flex gap-3 items-center">
      <label className='font-bold'>Add New Batsman:</label>
      <input
        type="text"
        value={newBatsman}
        onChange={(e) => setNewBatsman(e.target.value)}
        className='border p-1 rounded'
        placeholder="Enter batsman name"
      />
      <button
  className='bg-green-500 text-white px-3 py-1 rounded'
  onClick={() => {
    if (newBatsman.trim()) {
      const batsman = newBatsman.trim();
      setAvailableBatsmen(prev => [...prev, batsman]);
      setStriker(batsman);
      setNextBatsman("");   
      setNewBatsman("");
    }
  }}
>
  Add
</button>

    </div>
  </div>
)}


          {/* Bowler dropdown (must pick at start of over) */}
          {(!bowler || totalBalls % 6 === 0) && (
  <div className='mt-5 flex flex-col items-center gap-3'>
    <div className="flex gap-3 items-center">
      <label className='font-bold'>Select Bowler:</label>
      <select
        value={bowler}
        onChange={(e) => setBowler(e.target.value)}
        className='border p-1 rounded'
      >
        <option value="">Select</option>
        {availableBowlers.map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
    </div>

    {/* Add new bowler */}
    <div className="flex gap-3 items-center">
      <label className='font-bold'>Add New Bowler:</label>
      <input
        type="text"
        value={newBowler}
        onChange={(e) => setNewBowler(e.target.value)}
        className='border p-1 rounded'
        placeholder="Enter bowler name"
      />
      <button
        className='bg-blue-500 text-white px-3 py-1 rounded'
        onClick={() => {
          if (newBowler.trim()) {
            setAvailableBowlers(prev => [...prev, newBowler.trim()]);
            setBowler(newBowler.trim());
            setNewBowler("");
          }
        }}
      >
        Add
      </button>
    </div>
  </div>
)}

        </div>
      ) : (
        <div>
          <Title text={`1st innings end`} className='mt-5' />
          <Title text={`Target: ${currentRun + 1}`} />
          <button
            className='bg-amber-400 p-2 rounded-xl ml-30 mt-7 cursor-pointer'
            onClick={handleSubmit}
          >
            Second Innings
          </button>
        </div>
      )}

      {/* Batsmen + Bowler Info */}
      <div className='flex justify-around mt-5 '>
        <div>
          <h1 className='font-bold text-2xl'>Batsmen</h1>
          <p>{`${striker || '-'}`}</p>
          <p>{`${nonStriker || '-'}`}</p>
        </div>
        <div>
          <h1 className='font-bold text-2xl'>Bowler</h1>
          <p>{bowler || '-'}</p>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
