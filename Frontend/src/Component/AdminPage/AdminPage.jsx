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
  const [newBatsman, setNewBatsman] = useState("")

  const [availableBatsmen, setAvailableBatsmen] = useState([])
  const [availableBowlers, setAvailableBowlers] = useState([])

  // ✅ keep stats as arrays
  const [batsmanStats, setBatsmanStats] = useState([])
  const [bowlerStats, setBowlerStats] = useState([])

  // socket connect
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

      // ✅ push initial batsmen
      setBatsmanStats([
        { name: matchData.batsman1, runs: 0, balls: 0, out: false },
        { name: matchData.batsman2, runs: 0, balls: 0, out: false }
      ])

      // ✅ push initial bowler
      setBowlerStats([
        { name: matchData.bowler, runs: 0, balls: 0, wickets: 0 }
      ])
    }
  }, [matchData])

  useEffect(() => {
    const over = Math.floor(totalBalls / 6)
    const balls = totalBalls % 6
    setOvers(`${over}.${balls}`)
  }, [totalBalls])

  // helpers
  const updateBatsman = (name, updater) => {
    setBatsmanStats(prev =>
      prev.map(b => b.name === name ? { ...b, ...updater(b) } : b)
    )
  }

  const updateBowler = (name, updater) => {
    setBowlerStats(prev =>
      prev.map(bw => bw.name === name ? { ...bw, ...updater(bw) } : bw)
    )
  }

  const changeRun = (value) => {
    if (iningsOver) return

    if (value === 'wide' || value === 'no') {
      setCurrentRun(r => r + 1)
      if (bowler) updateBowler(bowler, bw => ({ runs: bw.runs + 1 }))
      return
    }

    if (value === "W") {
      setCurrentWicket(w => {
        const newW = w + 1
        if (newW === 10) setIningsOver(true)

        updateBatsman(striker, b => ({ balls: b.balls + 1, out: true }))
        updateBowler(bowler, bw => ({ balls: bw.balls + 1, wickets: bw.wickets + 1 }))

        return newW
      })
      setTotalBalls(b => b + 1)
      return
    }

    setCurrentRun(r => r + value)
    updateBatsman(striker, b => ({ runs: b.runs + value, balls: b.balls + 1 }))
    updateBowler(bowler, bw => ({ runs: bw.runs + value, balls: bw.balls + 1 }))

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

  // socket emit
  useEffect(() => {
    const firstInnings = {
      battingteam,
      bowlingteam,
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

  const handleSubmit = async () => {
    const firstSummary = {
      battingTeam: battingteam,
      bowlingTeam: bowlingteam,
      totalOver,
      runs: currentRun,
      balls: totalBalls,
      wickets: currentWicket,
      target: currentRun + 1,
      batsman: batsmanStats, 
      bowler: bowlerStats    
    }
    try {
      const res = await axios.post(`http://localhost:9000/user/addFirst/${id}`, firstSummary)
      console.log(res)
      setSecondInningsStart(true)
      setSecondInningsStarted(true)
      navigate(`/second-innings/${id}`)
    } catch (error) {
      console.log('error', error)
    }
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
                      const batsman = newBatsman.trim()
                      setAvailableBatsmen(prev => [...prev, batsman])
                      setStriker(batsman)
                      setBatsmanStats(prev => [...prev, { name: batsman, runs: 0, balls: 0, out: false }])
                      setNewBatsman("")
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
                      setAvailableBowlers(prev => [...prev, newBowler.trim()])
                      setBowler(newBowler.trim())
                      setBowlerStats(prev => [...prev, { name: newBowler.trim(), runs:0, balls:0, wickets:0 }])
                      setNewBowler("")
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
            {batsmanStats.map(b => (
              <p key={b.name}>{b.name} - {b.runs} ({b.balls}) {b.out ? "out" : "not out"}</p>
            ))}
            <h1 className="font-bold text-2xl mt-3">Bowler Stats</h1>
            {bowlerStats.map(bw => (
              <p key={bw.name}>{bw.name} - {Math.floor(bw.balls/6)}.{bw.balls%6} overs, {bw.runs} runs, {bw.wickets} wickets</p>
            ))}
          </div>
        </div>
      )}

      <div className='flex justify-around mt-5 '>
        <div>
          <h1 className='font-bold text-2xl'>Batsmen</h1>
          <p>{`${striker || '-'}`} : {batsmanStats.find(b=>b.name===striker)?.runs || 0} ({batsmanStats.find(b=>b.name===striker)?.balls || 0})</p>
          <p>{`${nonStriker || '-'}`} : {batsmanStats.find(b=>b.name===nonStriker)?.runs || 0} ({batsmanStats.find(b=>b.name===nonStriker)?.balls || 0})</p>
        </div>
        <div>
          <h1 className='font-bold text-2xl'>Bowler</h1>
          <p>{`${bowler || '-'}`} : {bowlerStats.find(bw=>bw.name===bowler)?.wickets || 0}-{bowlerStats.find(bw=>bw.name===bowler)?.runs || 0}</p>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
