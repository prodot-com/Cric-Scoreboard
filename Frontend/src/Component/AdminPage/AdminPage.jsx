import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router'
import Title from '../Title/Title'
import { io } from "socket.io-client"
import axios from 'axios'

const AdminPage = () => {
  const socketRef = useRef(null)
  const { id } = useParams()

  const [matchData, setMatchData] = useState({})
  const [totalOver, setTotalOver] = useState(0)
  const [battingTeam, setBattingTeam] = useState('')
  const [bowlingTeam, setBowlingTeam] = useState('')
  const [currentRun, setCurrentRun] = useState(0)
  const [totalBalls, setTotalBalls] = useState(0)
  const [currentWicket, setCurrentWicket] = useState(0)
  const [Overs, setOvers] = useState('0.0')
  const [iningsOver, setIningsOver] = useState(false)
  const [secondInningsStarts, setSecondInningsStarts] = useState(false)

  const [isFirstInnings, setIsFirstInnings] = useState(true)
  const [target, setTarget] = useState(null)
  const [firstInningsRuns, setFirstInningsRuns] = useState(0)

  const [striker, setStriker] = useState('')
  const [nonStriker, setNonStriker] = useState('')
  const [bowler, setBowler] = useState('')
  const [batsmanStats, setBatsmanStats] = useState({})
  const [bowlerStats, setBowlerStats] = useState({})

  // store first innings summary
  const [firstInningsBatsmanStats, setFirstInningsBatsmanStats] = useState({})
  const [firstInningsBowlerStats, setFirstInningsBowlerStats] = useState({})

  const [matchResult, setMatchResult] = useState(null)

  const [team1Players] = useState([
    "Bats1","Bats2","Bats3","Bats4","Bats5","Bats6","Bats7","Bats8","Bats9","Bats10","Bats11"
  ])
  const [team2Players] = useState([
    "Bw1","Bw2","Bw3","Bw4","Bw5","Bw6","Bw7","Bw8","Bw9","Bw10","Bw11"
  ])

  const [batsmanList, setBatsmanList] = useState([])
  const [bowlerList, setBowlerList] = useState([])

  // ==== STATE ====
  const [showBatsmanModal, setShowBatsmanModal] = useState(false)
  const [showBowlerModal, setShowBowlerModal] = useState(false)

  // ===== SOCKET =====
  useEffect(() => {
    socketRef.current = io("http://localhost:9000/")
    socketRef.current.on("connect", () => {
      if (id) socketRef.current.emit('joinMatch', id)
    })
    return () => { socketRef.current.disconnect() }
  }, [id])

  // ===== FETCH MATCH DATA =====
  const getMatch = async () => {
    try {
      const res = await axios.get(`http://localhost:9000/user/one/${id}`)
      setMatchData(res.data.result)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => { getMatch() }, [])

  // ===== Initialise innings after match data load =====
useEffect(() => {
  if (!matchData || !matchData.team1) return
  setTotalOver(matchData.over)
  console.log(matchData)

  const batting = matchData.decision === 'BAT'
    ? matchData.tossWinner
    : matchData.tossWinner === matchData.team1 ? matchData.team2 : matchData.team1

  const bowling = batting === matchData.team1 ? matchData.team2 : matchData.team1

  setBattingTeam(batting)
  setBowlingTeam(bowling)

  // Player lists (assuming you fetch team1Players & team2Players separately)
  const bats = batting === matchData.team1 ? team1Players : team2Players
  const bowls = bowling === matchData.team1 ? team1Players : team2Players

  setBatsmanList(bats)
  setBowlerList(bowls)

  // ✅ Opening batsmen & bowler from matchData
  setStriker(matchData.batsman1)
  setNonStriker(matchData.batsman2)
  setBowler(matchData.bowler)

  // ✅ Initialize stats
  setBatsmanStats({
    [matchData.batsman1]: { runs: 0, balls: 0, out: false },
    [matchData.batsman2]: { runs: 0, balls: 0, out: false },
  })
  setBowlerStats({
    [matchData.bowler]: { runs: 0, balls: 0, wickets: 0 },
  })
}, [matchData])


  // update overs
  useEffect(() => {
    const over = Math.floor(totalBalls / 6)
    const balls = totalBalls % 6
    setOvers(`${over}.${balls}`)
  }, [totalBalls])

  // === helpers ===
  const updateBatsman = (name, cb) => {
    setBatsmanStats(prev => ({
      ...prev,
      [name]: { ...prev[name], ...cb(prev[name]) }
    }))
  }
  const updateBowler = (name, cb) => {
    setBowlerStats(prev => {
      const current = prev[name] || { runs: 0, balls: 0, wickets: 0 }
      return {
        ...prev,
        [name]: { ...current, ...cb(current) }
      }
    })
  }

  // ===== MAIN RUN HANDLER (FIRST INNINGS) =====
  const changeRun = (value) => {
    if (!bowler || !striker) return alert("Select batsmen and bowler first!")

    if (value === "W") {
      setCurrentWicket(w => {
        const newW = w + 1
        if (newW === 10) setIningsOver(true)
        return newW
      })
      setTotalBalls(b => b + 1)
      updateBatsman(striker, b => ({ balls: b.balls + 1, out: true }))
      updateBowler(bowler, bw => ({ balls: bw.balls + 1, wickets: bw.wickets + 1 }))
      setShowBatsmanModal(true)
      return
    }

    if (value === "wide" || value === "no") {
      setCurrentRun(r => r + 1)
      updateBowler(bowler, bw => ({ runs: bw.runs + 1 }))
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
        setShowBowlerModal(true)
      } else if (value % 2 === 1) {
        const temp = striker
        setStriker(nonStriker)
        setNonStriker(temp)
      }
      return newBalls
    })
  }

  // ===== START 2nd INNINGS =====
  const startSecondInnings = () => {
    // save 1st innings stats
    setFirstInningsBatsmanStats(batsmanStats)
    setFirstInningsBowlerStats(bowlerStats)

    setSecondInningsStarts(true)
    setIningsOver(false)
    setFirstInningsRuns(currentRun)
    setTarget(currentRun + 1)

    // switch sides
    const newBatting = bowlingTeam
    const newBowling = battingTeam
    setBattingTeam(newBatting)
    setBowlingTeam(newBowling)

    // reset score
    setCurrentRun(0)
    setTotalBalls(0)
    setCurrentWicket(0)
    setOvers("0.0")
    setIsFirstInnings(false)

    // reset player stats for new innings
    const bats = newBatting === matchData.team1 ? team1Players : team2Players
    const bowls = newBowling === matchData.team1 ? team1Players : team2Players

    setStriker(bats[0])
    setNonStriker(bats[1])
    setBowler(bowls[0])

    setBatsmanStats({
      [bats[0]]: { runs: 0, balls: 0, out: false },
      [bats[1]]: { runs: 0, balls: 0, out: false },
    })
    setBowlerStats({
      [bowls[0]]: { runs: 0, balls: 0, wickets: 0 },
    })
  }

  // ===== TARGET CHECK =====
  useEffect(() => {
    if (!isFirstInnings && target !== null) {
      if (currentRun >= target) {
        setIningsOver(true)
        setMatchResult(`${battingTeam} won by ${10 - currentWicket} wickets`)
      }
    }
  }, [currentRun, isFirstInnings, target])

  // ===== SECOND INNINGS RUN HANDLER =====
  const secChangeRun = (value) => {
    if (!bowler || !striker) return alert("Select batsmen and bowler first!")

    if (value === "W") {
      setCurrentWicket(w => {
        const newW = w + 1
        if (newW === 10) {
          setIningsOver(true)
          setMatchResult(`${bowlingTeam} won by ${target - 1 - currentRun} runs`)
        }
        return newW
      })
      setTotalBalls(b => b + 1)
      updateBatsman(striker, b => ({ balls: b.balls + 1, out: true }))
      updateBowler(bowler, bw => ({ balls: bw.balls + 1, wickets: bw.wickets + 1 }))
      setShowBatsmanModal(true)
      return
    }

    if (value === "wide" || value === "no") {
      setCurrentRun(r => {
        const newR = r + 1
        if (newR >= target) {
          setIningsOver(true)
          setMatchResult(`${battingTeam} won by ${10 - currentWicket} wickets`)
        }
        return newR
      })
      updateBowler(bowler, bw => ({ runs: bw.runs + 1 }))
      return
    }

    setCurrentRun(r => {
      const newR = r + value
      if (newR >= target) {
        setIningsOver(true)
        setMatchResult(`${battingTeam} won by ${10 - currentWicket} wickets`)
      }
      return newR
    })
    updateBatsman(striker, b => ({ runs: b.runs + value, balls: b.balls + 1 }))
    updateBowler(bowler, bw => ({ runs: bw.runs + value, balls: bw.balls + 1 }))

    setTotalBalls(prev => {
      const newBalls = prev + 1
      if (newBalls === matchData.over * 6) {
        setIningsOver(true)
        if (currentRun === target - 1) {
          setMatchResult("Match tied")
        } else if (currentRun < target - 1) {
          setMatchResult(`${bowlingTeam} won by ${target - 1 - currentRun} runs`)
        }
      }
      const isEndOfOver = newBalls % 6 === 0
      if (isEndOfOver) {
        const temp = striker
        setStriker(nonStriker)
        setNonStriker(temp)
        setShowBowlerModal(true)
      } else if (value % 2 === 1) {
        const temp = striker
        setStriker(nonStriker)
        setNonStriker(temp)
      }
      return newBalls
    })
  }

  // ===== EMIT SCORE =====
  useEffect(() => {
    const inningsData = {
      inning: isFirstInnings ? 1 : 2,
      battingTeam,
      bowlingTeam,
      runs: currentRun,
      balls: totalBalls,
      wickets: currentWicket,
      iningsOver,
      target,
    }
    socketRef.current?.emit("scoreUpdate", { matchId: id, data: inningsData })
  }, [totalBalls, currentRun, currentWicket, iningsOver, isFirstInnings, target])

  // ====== JSX ======
    // ====== JSX ======
  return (
    <div className="font-mono m-5">
      {/* ================== FIRST INNINGS ================== */}
      {!secondInningsStarts ? (
        !iningsOver ? (
          <div>
            <Title text="First Innings Admin Panel" className="text-indigo-700" />
            <p className="mt-3 text-xl font-bold">
              {battingTeam} vs {bowlingTeam}
            </p>
            <p className="mt-2 text-lg">
              Score: {currentRun}/{currentWicket} in {Overs} overs
            </p>

            {/* Run Buttons */}
            <div className="grid grid-cols-4 gap-2 mt-5">
              {[0, 1, 2, 3, 4, 6, "W", "wide", "no"].map((v) => (
                <button
                  key={v}
                  onClick={() => changeRun(v)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Live Batsman Stats */}
            <h3 className="mt-6 text-lg font-bold">Batting Scorecard</h3>
            <table className="table-auto border-collapse border border-gray-400 mt-2">
              <thead>
                <tr>
                  <th className="border px-3">Batsman</th>
                  <th className="border px-3">Runs</th>
                  <th className="border px-3">Balls</th>
                  <th className="border px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(batsmanStats).map((b) => (
                  <tr key={b}>
                    <td className="border px-3">{b}</td>
                    <td className="border px-3">{batsmanStats[b].runs}</td>
                    <td className="border px-3">{batsmanStats[b].balls}</td>
                    <td className="border px-3">
                      {batsmanStats[b].out ? "Out" : "Not Out"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Live Bowler Stats */}
            <h3 className="mt-6 text-lg font-bold">Bowling Scorecard</h3>
            <table className="table-auto border-collapse border border-gray-400 mt-2">
              <thead>
                <tr>
                  <th className="border px-3">Bowler</th>
                  <th className="border px-3">Runs</th>
                  <th className="border px-3">Balls</th>
                  <th className="border px-3">Wickets</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(bowlerStats).map((b) => (
                  <tr key={b}>
                    <td className="border px-3">{b}</td>
                    <td className="border px-3">{bowlerStats[b].runs}</td>
                    <td className="border px-3">{bowlerStats[b].balls}</td>
                    <td className="border px-3">{bowlerStats[b].wickets}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {/* ========= BATSMAN MODAL ========= */}
{showBatsmanModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
    <div className="bg-white p-6 rounded-lg w-96">
      <h2 className="text-lg font-bold mb-3">Select Next Batsman</h2>
      <select
        className="border px-3 py-2 rounded w-full"
        onChange={(e) => {
          const newBatsman = e.target.value
          if (!newBatsman) return
          setStriker(newBatsman)
          setBatsmanStats(prev => ({
            ...prev,
            [newBatsman]: { runs: 0, balls: 0, out: false }
          }))
          setShowBatsmanModal(false)
        }}
      >
        <option value="">-- Select Batsman --</option>
        {(battingTeam === matchData.team1 ? team1Players : team2Players)
          .filter(p => !batsmanStats[p]?.out && p !== striker && p !== nonStriker)
          .map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
      </select>
    </div>
  </div>
)}

{/* ========= BOWLER MODAL ========= */}
{showBowlerModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
    <div className="bg-white p-6 rounded-lg w-96">
      <h2 className="text-lg font-bold mb-3">Select Next Bowler</h2>
      <select
        className="border px-3 py-2 rounded w-full"
        onChange={(e) => {
          const newBowler = e.target.value
          if (!newBowler) return
          setBowler(newBowler)
          setBowlerStats(prev => ({
            ...prev,
            [newBowler]: { runs: 0, balls: 0, wickets: 0 }
          }))
          setShowBowlerModal(false)
        }}
      >
        <option value="">-- Select Bowler --</option>
        {(bowlingTeam === matchData.team1 ? team1Players : team2Players).map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
    </div>
  </div>
)}

          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold text-red-600">End of First Innings</h2>
            <p className="mt-3 text-lg">
              {battingTeam} scored {currentRun}/{currentWicket} in {Overs} overs
            </p>
            <p className="mt-2 text-xl font-semibold text-green-700">
              Target for {bowlingTeam}: {currentRun + 1} runs
            </p>

            {/* Final Batsman Stats */}
            <h3 className="mt-5 text-lg font-bold">Batting Scorecard</h3>
            <table className="table-auto border-collapse border border-gray-400 mt-2">
              <thead>
                <tr>
                  <th className="border px-3">Batsman</th>
                  <th className="border px-3">Runs</th>
                  <th className="border px-3">Balls</th>
                  <th className="border px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(batsmanStats).map((b) => (
                  <tr key={b}>
                    <td className="border px-3">{b}</td>
                    <td className="border px-3">{batsmanStats[b].runs}</td>
                    <td className="border px-3">{batsmanStats[b].balls}</td>
                    <td className="border px-3">
                      {batsmanStats[b].out ? "Out" : "Not Out"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Final Bowler Stats */}
            <h3 className="mt-5 text-lg font-bold">Bowling Scorecard</h3>
            <table className="table-auto border-collapse border border-gray-400 mt-2">
              <thead>
                <tr>
                  <th className="border px-3">Bowler</th>
                  <th className="border px-3">Runs</th>
                  <th className="border px-3">Balls</th>
                  <th className="border px-3">Wickets</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(bowlerStats).map((b) => (
                  <tr key={b}>
                    <td className="border px-3">{b}</td>
                    <td className="border px-3">{bowlerStats[b].runs}</td>
                    <td className="border px-3">{bowlerStats[b].balls}</td>
                    <td className="border px-3">{bowlerStats[b].wickets}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              className="mt-6 px-5 py-2 bg-green-600 text-white rounded-lg"
              onClick={startSecondInnings}
            >
              Start Second Innings
            </button>
          </div>
        )
      ) : (
        /* ================== SECOND INNINGS ================== */
        <div>
          <Title text="Second Innings Admin Panel" className="text-indigo-700" />
          <p className="mt-3 text-xl font-bold">
            {battingTeam} chasing {target} vs {bowlingTeam}
          </p>
          <p className="mt-2 text-lg">
            Score: {currentRun}/{currentWicket} in {Overs} overs
          </p>

          {!iningsOver ? (
            <div>
              <div className="grid grid-cols-4 gap-2 mt-5">
                {[0, 1, 2, 3, 4, 6, "W", "wide", "no"].map((v) => (
                  <button
                    key={v}
                    onClick={() => secChangeRun(v)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    {v}
                  </button>
                ))}
              </div>

              {/* Live Batsman Stats */}
              <h3 className="mt-6 text-lg font-bold">Batting Scorecard</h3>
              <table className="table-auto border-collapse border border-gray-400 mt-2">
                <thead>
                  <tr>
                    <th className="border px-3">Batsman</th>
                    <th className="border px-3">Runs</th>
                    <th className="border px-3">Balls</th>
                    <th className="border px-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(batsmanStats).map((b) => (
                    <tr key={b}>
                      <td className="border px-3">{b}</td>
                      <td className="border px-3">{batsmanStats[b].runs}</td>
                      <td className="border px-3">{batsmanStats[b].balls}</td>
                      <td className="border px-3">
                        {batsmanStats[b].out ? "Out" : "Not Out"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Live Bowler Stats */}
              <h3 className="mt-6 text-lg font-bold">Bowling Scorecard</h3>
              <table className="table-auto border-collapse border border-gray-400 mt-2">
                <thead>
                  <tr>
                    <th className="border px-3">Bowler</th>
                    <th className="border px-3">Runs</th>
                    <th className="border px-3">Balls</th>
                    <th className="border px-3">Wickets</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(bowlerStats).map((b) => (
                    <tr key={b}>
                      <td className="border px-3">{b}</td>
                      <td className="border px-3">{bowlerStats[b].runs}</td>
                      <td className="border px-3">{bowlerStats[b].balls}</td>
                      <td className="border px-3">{bowlerStats[b].wickets}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-6">
              <h2 className="text-2xl font-bold text-green-700">{matchResult}</h2>

              {/* First Innings Summary */}
              <h3 className="mt-6 text-lg font-bold">First Innings Summary</h3>
              <p className="mt-2">
                {bowlingTeam} scored {firstInningsRuns}
              </p>

              {/* Second Innings Summary */}
              <h3 className="mt-6 text-lg font-bold">Second Innings Summary</h3>
              <p className="mt-2">
                {battingTeam} scored {currentRun}/{currentWicket} in {Overs} overs
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )


}

export default AdminPage
