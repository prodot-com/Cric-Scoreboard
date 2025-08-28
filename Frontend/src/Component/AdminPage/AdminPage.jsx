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

  const [secBatsmanStats, setSecBatsmanStats] = useState({})
  const [secBowlerStats, setSecBowlerStats] = useState({})

  const [showBatsmanModal, setShowBatsmanModal] = useState(false)
  const [showBowlerModal, setShowBowlerModal] = useState(false)

  const [firstInningsBatsmanStats, setFirstInningsBatsmanStats] = useState({})
  const [firstInningsBowlerStats, setFirstInningsBowlerStats] = useState({})

  const [matchResult, setMatchResult] = useState(null)



  const [team1Players] = useState(["Bats1","Bats2","Bats3","Bats4","Bats5","Bats6","Bats7","Bats8","Bats9","Bats10","Bats11"])
  const [team2Players] = useState(["Bw1","Bw2","Bw3","Bw4","Bw5","Bw6","Bw7","Bw8","Bw9","Bw10","Bw11"])

  // ===== SOCKET =====
  useEffect(() => {
    socketRef.current = io("http://localhost:9000/")
    socketRef.current.on("connect", () => {
      if (id) socketRef.current.emit('joinMatch', id)
      console.log('joined match:', id)
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

    // initialise first striker/non-striker/bowler
    const bats = batting === matchData.team1 ? team1Players : team2Players
    const bowls = bowling === matchData.team1 ? team1Players : team2Players

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
  }, [matchData])

  // ===== OVERS UPDATE =====
  useEffect(() => {
    const over = Math.floor(totalBalls / 6)
    const balls = totalBalls % 6
    setOvers(`${over}.${balls}`)
  }, [totalBalls])

  // ===== UPDATE HELPERS =====
  const updateBatsman = (name, cb) => {
    setBatsmanStats(prev => ({
      ...prev,
      [name]: { ...prev[name], ...cb(prev[name]) }
    }))
  }

  // === Update bowler helper ===
const updateBowler = (name, cb) => {
  setBowlerStats(prev => {
    const current = prev[name] || { runs: 0, balls: 0, wickets: 0 }
    return {
      ...prev,
      [name]: { ...current, ...cb(current) }
    }
  })
}


  // ===== MAIN RUN HANDLER =====
  const changeRun = (value) => {
    if (!bowler || !striker) return alert("Select batsmen and bowler first!")

    if (value === "W") {
      setCurrentWicket(w => {
        const newW = w + 1
        if (newW === 10){ 
          setIningsOver(true);
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
          setIningsOver(true);
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


    if(secondInningsStarts){

    }
  }

  const startSecondInnings = () => {
  // save 1st innings stats
  setFirstInningsBatsmanStats(batsmanStats)
  setFirstInningsBowlerStats(bowlerStats)

  setSecondInningsStarts(true)
  setIningsOver(false)
  setShowBowlerModal(false)
  setFirstInningsRuns(currentRun)
  setTarget(currentRun + 1)

  // switch sides
  setBattingTeam(bowlingTeam)
  setBowlingTeam(battingTeam)

  // reset score
  setCurrentRun(0)
  setTotalBalls(0)
  setCurrentWicket(0)
  setOvers("0.0")
  setIsFirstInnings(false)

  // reset player stats for new innings
  setBatsmanStats({
      [bats[0]]: { runs: 0, balls: 0, out: false },
      [bats[1]]: { runs: 0, balls: 0, out: false },
    })
    setBowlerStats({
      [bowls[0]]: { runs: 0, balls: 0, wickets: 0 },
    })
}


  console.log(firstInningsBatsmanStats)
  // ===== AUTO MOVE TO SECOND INNINGS =====
  // useEffect(() => {
  //   if (iningsOver && isFirstInnings) {
  //     setFirstInningsRuns(currentRun)
  //     setTarget(currentRun + 1)
  //     setBattingTeam(bowlingTeam)
  //     setBowlingTeam(battingTeam)
  //     setCurrentRun(0)
  //     setTotalBalls(0)
  //     setCurrentWicket(0)
  //     setOvers("0.0")
  //     setIningsOver(false)
  //     setIsFirstInnings(false)
  //   }
  // }, [iningsOver, isFirstInnings])

  // ===== TARGET CHECK =====
  useEffect(() => {
    if (!isFirstInnings && target !== null) {
      if (currentRun >= target) {
        setIningsOver(true)
      }
    }
  }, [currentRun, isFirstInnings, target])

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

    // check if overs completed
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

  return (
      <div>
        {!secondInningsStarts? (
          <div className='font-mono m-5'>
        {!iningsOver? (    
          <div>
      <Title text="First Innings Admin Panel" className='text-indigo-700'/>
      <Title text={`${matchData.team1} vs ${matchData.team2}`}/>

      <div className='text-3xl font-bold flex justify-around mt-7'>
        <div>{battingTeam}</div>
        <div>{`${currentRun}/${currentWicket}`}</div>
        <div>{`Balls: ${totalBalls}`}</div>
        <div>{`Overs: ${Overs}`}</div>
      </div>

      <h2 className='text-2xl font-bold flex justify-around mt-4'>
        {`${bowlingTeam} will bowl`}
      </h2>

      {/* Batsman Modal */}
      {showBatsmanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold mb-4">Select Next Batsman</h2>
            <div className="grid grid-cols-2 gap-3">
              {(battingTeam === matchData.team1 ? team1Players : team2Players)
                .filter(p => !batsmanStats[p]?.out && p !== striker && p !== nonStriker)
                .map(player => (
                  <button
                    key={player}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                    onClick={() => {
                      setStriker(player)
                      setBatsmanStats(prev => ({
                        ...prev,
                        [player]: { runs: 0, balls: 0, out: false }
                      }))
                      setShowBatsmanModal(false)
                    }}
                  >
                    {player}
                  </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bowler Modal */}
      {showBowlerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold mb-4">Select Next Bowler</h2>
            <div className="grid grid-cols-2 gap-3">
              {(bowlingTeam === matchData.team1 ? team1Players : team2Players)
                .filter(p => p !== bowler) // prevent same bowler in consecutive overs
                .map(player => (
                  <button
                    key={player}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg"
                    onClick={() => {
                      setBowler(player)
                      setBowlerStats(prev => ({
                        ...prev,
                        [player]: prev[player] || { runs: 0, balls: 0, wickets: 0 }
                      }))
                      setShowBowlerModal(false)
                    }}
                  >
                    {player}
                  </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Batsmen */}
      <div className="mt-6">
        <h3 className="font-bold text-xl">Batsmen</h3>
        <ul>
          {Object.entries(batsmanStats).map(([name, stats]) => (
            <li key={name} className={name === striker ? "text-green-600 font-semibold" : ""}>
              {name} - {stats.runs}({stats.balls}) {stats.out ? "❌" : ""}
            </li>
          ))}
        </ul>
      </div>

      {/* Bowler */}
      <div className="mt-4">
        <h3 className="font-bold text-xl">Bowler</h3>
        {Object.entries(bowlerStats).map(([name, stats]) => {
          const overs = Math.floor(stats.balls / 6)
          const balls = stats.balls % 6
          return (
            <div key={name}>
              {name} - {overs}.{balls} overs / {stats.runs} runs / {stats.wickets} wkts
            </div>
          )
        })}
      </div>

      {!isFirstInnings && target && (
        <div className='text-center mt-4 text-lg font-semibold text-red-600'>
          Target: {target}
        </div>
      )}

      {!iningsOver ? (
        <>
          <div className='flex justify-around mt-8 flex-wrap gap-2'>
            {[0,1,2,3,4,5,6,"wide","no"].map((value) => (
              <button
                key={value}
                className='bg-amber-400 p-1 rounded-xl h-10 w-14 cursor-pointer'
                onClick={() => changeRun(value)}
              >
                {value}
              </button>
            ))}
          </div>
          <div className='flex justify-center mt-5 font-bold text-2xl text-red-600 cursor-pointer'>
            <h1 onClick={() => changeRun('W')}>Out</h1>
          </div>
        </>
      ) : (
        <div className='text-center mt-6 text-xl font-bold text-green-600'>

          

        </div>
      )}
    </div>):(
      <div>
    <h2 className="text-2xl font-bold text-red-600">End of First Innings</h2>
    <p className="mt-3 text-lg">
      {battingTeam} scored {currentRun}/{currentWicket} in {Overs} overs
    </p>

    {/* Show Target */}
    <p className="mt-2 text-xl font-semibold text-green-700">
      Target for {bowlingTeam}: {currentRun + 1} runs
    </p>

    {/* === Batsman Stats === */}
    <h3 className="mt-6 text-xl font-semibold">Batting Scorecard</h3>
    <table className="mx-auto mt-2 border border-gray-400">
      <thead className="bg-gray-200">
        <tr>
          <th className="px-4 py-2">Batsman</th>
          <th className="px-4 py-2">Runs</th>
          <th className="px-4 py-2">Balls</th>
          <th className="px-4 py-2">Status</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(batsmanStats).map(([name, stats]) => (
          <tr key={name} className="border-t">
            <td className="px-4 py-2">{name}</td>
            <td className="px-4 py-2">{stats.runs ?? 0}</td>
            <td className="px-4 py-2">{stats.balls ?? 0}</td>
            <td className="px-4 py-2">{stats.out ? "Out" : "Not Out"}</td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* === Bowler Stats === */}
    <h3 className="mt-6 text-xl font-semibold">Bowling Scorecard</h3>
    <table className="mx-auto mt-2 border border-gray-400">
      <thead className="bg-gray-200">
        <tr>
          <th className="px-4 py-2">Bowler</th>
          <th className="px-4 py-2">Runs</th>
          <th className="px-4 py-2">Balls</th>
          <th className="px-4 py-2">Wickets</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(bowlerStats).map(([name, stats]) => (
          <tr key={name} className="border-t">
            <td className="px-4 py-2">{name}</td>
            <td className="px-4 py-2">{stats.runs ?? 0}</td>
            <td className="px-4 py-2">{stats.balls ?? 0}</td>
            <td className="px-4 py-2">{stats.wickets ?? 0}</td>
          </tr>
        ))}
      </tbody>
    </table>

    {/* Button to start 2nd innings */}
    <button
      className="mt-6 px-5 py-2 bg-green-600 text-white rounded-lg"
      onClick={startSecondInnings}
    >
      Start Second Innings
    </button>
  </div>
)}
      </div>)

      :(

    <div className='font-mono m-5'>
      <Title text="Second Innings Admin Panel" className='text-indigo-700'/>
      <Title text={`${matchData.team1} vs ${matchData.team2}`}/>

      <div className='text-3xl font-bold flex justify-around mt-7'>
        <div>{battingTeam}</div>
        <div>{`${currentRun}/${currentWicket}`}</div>
        <div>{`Balls: ${totalBalls}`}</div>
        <div>{`Overs: ${Overs}`}</div>
      </div>

      <h2 className='text-2xl font-bold flex justify-around mt-4'>
        {`${bowlingTeam} will bowl`}
      </h2>

      {/* Batsman Modal */}
      {showBatsmanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold mb-4">Select Next Batsman</h2>
            <div className="grid grid-cols-2 gap-3">
              {(battingTeam === matchData.team1 ? team1Players : team2Players)
                .filter(p => !batsmanStats[p]?.out && p !== striker && p !== nonStriker)
                .map(player => (
                  <button
                    key={player}
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg"
                    onClick={() => {
                      setStriker(player)
                      setBatsmanStats(prev => ({
                        ...prev,
                        [player]: { runs: 0, balls: 0, out: false }
                      }))
                      setShowBatsmanModal(false)
                    }}
                  >
                    {player}
                  </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Bowler Modal */}
      {showBowlerModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-bold mb-4">Select Next Bowler</h2>
            <div className="grid grid-cols-2 gap-3">
              {(bowlingTeam === matchData.team1 ? team1Players : team2Players)
                .filter(p => p !== bowler) // prevent same bowler in consecutive overs
                .map(player => (
                  <button
                    key={player}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg"
                    onClick={() => {
                      setBowler(player)
                      setBowlerStats(prev => ({
                        ...prev,
                        [player]: prev[player] || { runs: 0, balls: 0, wickets: 0 }
                      }))
                      setShowBowlerModal(false)
                    }}
                  >
                    {player}
                  </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Batsmen */}
      <div className="mt-6">
        <h3 className="font-bold text-xl">Batsmen</h3>
        <ul>
          {Object.entries(batsmanStats).map(([name, stats]) => (
            <li key={name} className={name === striker ? "text-green-600 font-semibold" : ""}>
              {name} - {stats.runs}({stats.balls}) {stats.out ? "❌" : ""}
            </li>
          ))}
        </ul>
      </div>

      {/* Bowler */}
      <div className="mt-4">
        <h3 className="font-bold text-xl">Bowler</h3>
        {Object.entries(bowlerStats).map(([name, stats]) => {
  const overs = Math.floor((stats?.balls || 0) / 6)
  const balls = (stats?.balls || 0) % 6
  return (
    <div key={name}>
      {name} - {overs}.{balls} overs / {stats?.runs || 0} runs / {stats?.wickets || 0} wkts
    </div>
  )
})}

      </div>

      {!isFirstInnings && target && (
        <div className='text-center mt-4 text-lg font-semibold text-red-600'>
          Target: {target}
        </div>
      )}

      {!iningsOver ? (
        <>
          <div className='flex justify-around mt-8 flex-wrap gap-2'>
            {[0,1,2,3,4,5,6,"wide","no"].map((value) => (
              <button
                key={value}
                className='bg-amber-400 p-1 rounded-xl h-10 w-14 cursor-pointer'
                onClick={() => secChangeRun(value)}
              >
                {value}
              </button>
            ))}
          </div>
          <div className='flex justify-center mt-5 font-bold text-2xl text-red-600 cursor-pointer'>
            <h1 onClick={() => secChangeRun('W')}>Out</h1>
          </div>
        </>
      ) : (
        <div className='text-center mt-6 text-xl font-bold text-green-600'>

          {matchResult}

        </div>
      )}
    </div>
      )}
      </div>
  )
}

export default AdminPage
