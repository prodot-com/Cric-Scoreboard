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
  const [newBatsman, setNewBatsman] = useState("")

  const [batsmanStats, setBatsmanStats] = useState({})
  const [bowlerStats, setBowlerStats] = useState({})

  useEffect(() => {
    socketRef.current = io("http://localhost:9000/")
    socketRef.current.on("connect", () => {
      if (id) socketRef.current.emit('joinMatch', id)
    })
    return () => { socketRef.current.disconnect() }
  }, [id])

  const getMatch = async () => {
    try {
      const res = await axios.get(`http://localhost:9000/user/one/${id}`)
      setMatchData(res.data.result)
    } catch (error) { console.log(error) }
  }
  useEffect(() => { getMatch() }, [])

  useEffect(() => {
    if (!matchData) return
    setTotalOver(matchData.over)

    const batting = matchData.decision === 'BAT'
      ? matchData.tossWinner
      : matchData.tossWinner === matchData.team1 ? matchData.team2 : matchData.team1

    const bowling = matchData.team1 !== matchData.tossWinner ? matchData.team1 : matchData.team2

    setBattingTeam(batting)
    setBowlingTeam(bowling)

    if (matchData.players) {
      setAvailableBatsmen(matchData.players[batting] || [])
      setAvailableBowlers(matchData.players[bowling] || [])
    }
  }, [matchData])

  useEffect(() => {
    if (matchData?.batsman1 && matchData?.batsman2 && matchData?.bowler) {
      setStriker(matchData.batsman1)
      setNonStriker(matchData.batsman2)
      setAvailableBatsmen(prev => prev.filter(p => p !== matchData.batsman1 && p !== matchData.batsman2))
      setBowler(matchData.bowler)
      setAvailableBowlers(prev => [...prev, matchData.bowler.trim()])

      setBatsmanStats({
        [matchData.batsman1]: { runs: 0, balls: 0, out: false },
        [matchData.batsman2]: { runs: 0, balls: 0, out: false }
      })

      setBowlerStats({
        [matchData.bowler]: { runs: 0, balls: 0, wickets: 0 }
      })
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
      if (bowler) {
        setBowlerStats(prev => ({
          ...prev,
          [bowler]: { ...prev[bowler], runs: (prev[bowler]?.runs || 0) + 1 }
        }))
      }
      return
    }

    if (value === "W") {
      setCurrentWicket(prev => {
        const newWickets = prev + 1
        if (newWickets === 10) setIningsOver(true)

        setBatsmanStats(prev => ({
          ...prev,
          [striker]: { ...prev[striker], out: true, balls: (prev[striker]?.balls || 0) + 1 }
        }))

        setBowlerStats(prev => ({
          ...prev,
          [bowler]: { 
            ...prev[bowler], 
            balls: (prev[bowler]?.balls || 0) + 1, 
            wickets: (prev[bowler]?.wickets || 0) + 1 
          }
        }))

        if (nextBatsman) {
          setStriker(nextBatsman)
          setAvailableBatsmen(prev => prev.filter(p => p !== nextBatsman))
          setBatsmanStats(prev => ({
            ...prev,
            [nextBatsman]: { runs: 0, balls: 0, out: false }
          }))
          setNextBatsman('')
        }
        return newWickets
      })
      setTotalBalls(prev => prev + 1)
      return
    }

    setCurrentRun(prev => prev + value)
    setBatsmanStats(prev => ({
      ...prev,
      [striker]: {
        ...prev[striker],
        runs: (prev[striker]?.runs || 0) + value,
        balls: (prev[striker]?.balls || 0) + 1
      }
    }))
    setBowlerStats(prev => ({
      ...prev,
      [bowler]: {
        ...prev[bowler],
        runs: (prev[bowler]?.runs || 0) + value,
        balls: (prev[bowler]?.balls || 0) + 1
      }
    }))

    setTotalBalls(prev => {
      const newBalls = prev + 1
      if (newBalls === matchData.over * 6) setIningsOver(true)

      const isEndOfOver = newBalls % 6 === 0
      if (isEndOfOver) {
        const temp = striker
        setStriker(nonStriker)
        setNonStriker(temp)
        setBowler('')
      } else if (value % 2 === 1) {
        const temp = striker
        setStriker(nonStriker)
        setNonStriker(temp)
      }
      return newBalls
    })
  }

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
      bowler,
      batsmanStats,
      bowlerStats
    }
    socketRef.current?.emit('scoreUpdate', { matchId: id, data: firstInnings })
  }, [totalBalls, currentRun, currentWicket, iningsOver, secondInningsStart, secondInningsStarted, bowlingStarted, striker, nonStriker, bowler, batsmanStats, bowlerStats])

  const handleSubmit = () => {
    setSecondInningsStart(true)
    setSecondInningsStarted(true)
    navigate(`/second-innings/${id}`)
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
            {[0,1,2,3,4,5,6,"wide","no"].map((value) => (
              <button
                key={value}
                disabled={iningsOver || !bowler}
                className='bg-amber-400 p-1 rounded-xl h-10 w-14 cursor-pointer disabled:opacity-50'
                onClick={() => { changeRun(value); setBowlingStarted(true) }}
              >
                {value}
              </button>
            ))}
          </div>

          <div className='flex justify-center items mt-5 font-bold text-2xl text-red-600 cursor-pointer'>
            <h1 onClick={() => { changeRun('W'); setBowlingStarted(true) }}>Out</h1>
          </div>

          {currentWicket > 0 && (
            <div className='mt-5 flex flex-col items-center gap-3'>
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
                      setBatsmanStats(prev => ({
                        ...prev,
                        [batsman]: { runs: 0, balls: 0, out: false }
                      }))
                      setNextBatsman("");
                      setNewBatsman("");
                    }
                  }}
                >Add</button>
              </div>
            </div>
          )}

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
                  {availableBowlers.map(p => (<option key={p} value={p}>{p}</option>))}
                </select>
              </div>
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
                      setBowlerStats(prev => ({
                        ...prev,
                        [newBowler.trim()]: { runs:0, balls:0, wickets:0 }
                      }))
                      setNewBowler("");
                    }
                  }}
                >Add</button>
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
          >Second Innings</button>

          <div className="mt-5">
            <h1 className="font-bold text-2xl">Batsmen Scorecard</h1>
            {Object.entries(batsmanStats).map(([name, stats]) => (
              <p key={name}>{name} - {stats.runs} ({stats.balls}) {stats.out ? "out" : "not out"}</p>
            ))}
            <h1 className="font-bold text-2xl mt-3">Bowler Stats</h1>
            {Object.entries(bowlerStats).map(([name, stats]) => (
              <p key={name}>{name} - {stats.overs || Math.floor(stats.balls/6)}.{stats.balls%6} overs, {stats.runs} runs, {stats.wickets} wickets</p>
            ))}
          </div>
        </div>
      )}

      <div className='flex justify-around mt-5 '>
        <div>
          <h1 className='font-bold text-2xl'>Batsmen</h1>
          <p>{`${striker || '-'}`} : {batsmanStats[striker]?.runs || 0} ({batsmanStats[striker]?.balls || 0})</p>
          <p>{`${nonStriker || '-'}`} : {batsmanStats[nonStriker]?.runs || 0} ({batsmanStats[nonStriker]?.balls || 0})</p>
        </div>
        <div>
          <h1 className='font-bold text-2xl'>Bowler</h1>
          <p>{`${bowler || '-'}`}:{bowlerStats[bowler]?.wickets || 0}-{bowlerStats[bowler]?.runs||0}</p>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
