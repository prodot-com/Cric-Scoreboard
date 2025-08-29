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
  const [firstInningsBattingTeam, setFirstInningsBattingTeam] = useState('')

  const [striker, setStriker] = useState('')
  const [nonStriker, setNonStriker] = useState('')
  const [bowler, setBowler] = useState('')
  const [batsmanStats, setBatsmanStats] = useState({})
  const [bowlerStats, setBowlerStats] = useState({})

  // store first innings summary
  const [firstInningsBatsmanStats, setFirstInningsBatsmanStats] = useState({})
  const [firstInningsBowlerStats, setFirstInningsBowlerStats] = useState({})

  const [openingBatsman1, setOpeningBatsman1] = useState("");
const [openingBatsman2, setOpeningBatsman2] = useState("");
const [openingBowler, setOpeningBowler] = useState("");
const [openersSet, setOpenersSet] = useState(false);

  const [matchResult, setMatchResult] = useState(null)

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

    const batting = matchData.decision === 'BAT'
      ? matchData.tossWinner
      : matchData.tossWinner === matchData.team1 ? matchData.team2 : matchData.team1

    const bowling = batting === matchData.team1 ? matchData.team2 : matchData.team1

    setBattingTeam(batting)
    setBowlingTeam(bowling)

    // opening players from DB
    const bats1 = matchData.batsman1 || ""
    const bats2 = matchData.batsman2 || ""
    const bowl = matchData.bowler || ""

    setStriker(bats1)
    setNonStriker(bats2)
    setBowler(bowl)

    setBatsmanStats({
      [bats1]: { runs: 0, balls: 0, out: false },
      [bats2]: { runs: 0, balls: 0, out: false },
    })
    setBowlerStats({
      [bowl]: { runs: 0, balls: 0, wickets: 0 },
    })
  }, [matchData])

  // update overs
  useEffect(() => {
  const ballsValue = Number.isFinite(totalBalls) ? totalBalls : 0; 
  const over = Math.floor(ballsValue / 6);
  const balls = ballsValue % 6;
  setOvers(`${over}.${balls}`);
}, [totalBalls]);


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
      if (newBalls === matchData.over * 6){ 
        setIningsOver(true)
      return newBalls
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

  // useEffect(()=>{console.log(Overs)},[Overs])

  // ===== START 2nd INNINGS =====
  const startSecondInnings = () => {
    setFirstInningsBatsmanStats(batsmanStats)
    setFirstInningsBowlerStats(bowlerStats)
    setFirstInningsBattingTeam(battingTeam)

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

    // clear players, force admin to enter openers & bowler
    setStriker("")
    setNonStriker("")
    setBowler("")
    setBatsmanStats({})
    setBowlerStats({})
    // setShowBatsmanModal(true)
    // setShowBowlerModal(true)
    console.log(batsmanStats)
    console.log(bowlerStats)
  }

  const handleSetOpeners = () => {
  if (!openingBatsman1 || !openingBatsman2 || !openingBowler) {
    alert("Please enter all players");
    return;
  }
  // Initialize batsman & bowler in stats
  setBatsmanStats({
    [openingBatsman1]: { runs: 0, balls: 0, out: false },
    [openingBatsman2]: { runs: 0, balls: 0, out: false },
  });
  setBowlerStats({
    [openingBowler]: { runs: 0, balls: 0, wickets: 0 },
  });
  setStriker(openingBatsman1);
  setNonStriker(openingBatsman2);
  setBowler(openingBowler);
  setOpenersSet(true);
};

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
        return
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
    overs: Overs,                
    totalOvers: matchData.over,   
    wickets: currentWicket,
    iningsOver,
    target,
    batsmanStats,
    bowlerStats,
    bowler
  }
  socketRef.current?.emit("scoreUpdate", { matchId: id, data: inningsData })
}, [
  totalBalls,
  currentRun,
  currentWicket,
  Overs,             
  iningsOver,
  isFirstInnings,
  target,
  batsmanStats,
  bowlerStats,
  matchData.over,
  bowler    
])


  // ====== JSX ======
  return (
    <div className="font-mono m-5">

      {/* Batsman Modal */}
      {showBatsmanModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50">
          <div className="bg-white p-5 rounded-lg">
            <h3 className="text-lg font-bold mb-3">Enter Next Batsman</h3>
            <input
              id="nextBatsmanInput"
              type="text"
              placeholder="Batsman name"
              className="border p-2 rounded w-full"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value) {
                  setStriker(e.target.value)
                  setBatsmanStats(prev => ({
                    ...prev,
                    [e.target.value]: { runs: 0, balls: 0, out: false }
                  }))
                  setShowBatsmanModal(false)
                }
              }}
            />
            <button
              className="mt-3 px-4 py-2 bg-green-600 text-white rounded"
              onClick={() => {
                const input = document.querySelector("#nextBatsmanInput")
                if (input.value) {
                  setStriker(input.value)
                  setBatsmanStats(prev => ({
                    ...prev,
                    [input.value]: { runs: 0, balls: 0, out: false }
                  }))
                  setShowBatsmanModal(false)
                }
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* Bowler Modal */}
      {showBowlerModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/50">
          <div className="bg-white p-5 rounded-lg">
            <h3 className="text-lg font-bold mb-3">Enter Next Bowler</h3>
            <input
              id="nextBowlerInput"
              type="text"
              placeholder="Bowler name"
              className="border p-2 rounded w-full"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value) {
                  setBowler(e.target.value)
                  setBowlerStats(prev => ({
                    ...prev,
                    [e.target.value]: { runs: 0, balls: 0, wickets: 0 }
                  }))
                  setShowBowlerModal(false)
                }
              }}
            />
            <button
              className="mt-3 px-4 py-2 bg-green-600 text-white rounded"
              onClick={() => {
                const input = document.querySelector("#nextBowlerInput")
                if (input.value) {
                  setBowler(input.value)
                  setBowlerStats(prev => ({
                    ...prev,
                    [input.value]: { runs: 0, balls: 0, wickets: 0 }
                  }))
                  setShowBowlerModal(false)
                }
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      )}

      {/* ================== FIRST INNINGS ================== */}
      {!secondInningsStarts ? (
        !iningsOver ? (
          <div>
            <Title text="First Innings Admin Panel" className="text-indigo-700" />
            <p className="mt-3 text-xl font-bold">
              {battingTeam} vs {bowlingTeam}
            </p>
            <p className="mt-2 text-lg">
              {battingTeam}: {currentRun}/{currentWicket} in {Overs} overs
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
            <h3 className="mt-5 text-lg font-bold">Batting Stats</h3>
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
                {Object.keys(batsmanStats).filter((b) => !batsmanStats[b].out).map((b) => (
                  <tr 
                  key={b}
                  className={b === striker ? "bg-gray-200 font-bold text-green-600" : ""}>
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
            <h3 className="mt-5 text-lg font-bold">Bowling Stats</h3>
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
                {Object.keys(bowlerStats).filter((b) => b === bowler).map((b) => (
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
          <div>
            <Title text="First Innings Over" className="text-red-600" />
            <p className="mt-3 text-lg">
              {battingTeam} scored {currentRun}/{currentWicket} in {Overs} overs
            </p>
            <button
              onClick={startSecondInnings}
              className="mt-4 px-4 py-2 bg-green-700 text-white rounded"
            >
              Start Second Innings
            </button>
          </div>
        )
      ) : (
        // ================ SECOND INNINGS ===================
       
// ================ SECOND INNINGS ===================
<div>
  {!iningsOver ? (
    <div>
      <Title text="Second Innings Admin Panel" className="text-indigo-700" />
      <p className="mt-3 text-xl font-bold">
        {battingTeam} chasing {target} vs {bowlingTeam}
      </p>

      {/* Opening Setup */}
      {!openersSet ? (
        <div className="mt-5">
          <h3 className="text-lg font-bold mb-3">Enter Opening Players</h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Opening Batsman 1"
              value={openingBatsman1}
              onChange={(e) => setOpeningBatsman1(e.target.value)}
              className="border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Opening Batsman 2"
              value={openingBatsman2}
              onChange={(e) => setOpeningBatsman2(e.target.value)}
              className="border px-3 py-2 rounded"
            />
            <input
              type="text"
              placeholder="Opening Bowler"
              value={openingBowler}
              onChange={(e) => setOpeningBowler(e.target.value)}
              className="border px-3 py-2 rounded"
            />
            <button
              onClick={handleSetOpeners}
              className="bg-green-600 text-white px-4 py-2 rounded-lg"
            >
              Start Innings
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Score Info */}
          <p className="mt-2 text-lg">
            {battingTeam} {currentRun}/{currentWicket} in {Overs} overs
          </p>

          {/* Run Buttons */}
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
          <h3 className="mt-5 text-lg font-bold">Batting Stats</h3>
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
              {Object.keys(batsmanStats)
                .filter((b) => !batsmanStats[b].out)
                .map((b) => (
                  <tr
                    key={b}
                    className={b === striker ? "bg-yellow-200 font-bold" : ""}
                  >
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
          <h3 className="mt-5 text-lg font-bold">Bowling Stats</h3>
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
              {Object.keys(bowlerStats)
                .filter((b) => b === bowler)
                .map((b) => (
                  <tr key={b} className="bg-green-100 font-bold">
                    <td className="border px-3">{b}</td>
                    <td className="border px-3">{bowlerStats[b].runs}</td>
                    <td className="border px-3">{bowlerStats[b].balls}</td>
                    <td className="border px-3">{bowlerStats[b].wickets}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  ) : (
    <div>
      <Title text="Match Over" className="text-red-600" />
      <p className="mt-3 text-lg">
        {battingTeam} scored {currentRun}/{currentWicket} in {Overs} overs
        {console.log(currentRun, currentWicket, Overs)}
      </p>
      <p className="mt-3 text-lg">
        {firstInningsBattingTeam} scored {firstInningsRuns}
      </p>
      <h2 className="mt-5 text-xl font-bold">{matchResult}</h2>
    </div>
  )}
</div>


      )
      } 
    </div>
  )
}

export default AdminPage
