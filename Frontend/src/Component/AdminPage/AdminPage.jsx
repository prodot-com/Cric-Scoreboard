import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router'
import Title from '../Title/Title'
import { io, Socket } from "socket.io-client";
import { useParams } from 'react-router';
import axios from 'axios'

const AdminPage = () => {
  const navigate = useNavigate()
  const socketRef = useRef(null)
  const {id}= useParams()

  const [matchData, setMatchData] = useState({})
  const [totalOver, setTotalOver] = useState(0)
  const [tossData, setTossData] = useState({})
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

useEffect(() => {
  socketRef.current = io("https://cric-scoreboard.onrender.com/")

  socketRef.current.on("connect", () => {
    console.log("Connected:", socketRef.current.id)
    if (id) {
      socketRef.current.emit('joinMatch', id)
    }
  })

  return () => {
    socketRef.current.disconnect()
  }
}, [id])

  const getMatch = async ()=>{

    try {
      
      const res =await axios.get(`http://localhost:9000/user/one/${id}`)
      if(!res)console.log('Error fecthing the match details')

      console.log(res.data.result)
      setMatchData(res.data.result)

    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{

    getMatch()
    

  },[])
  useEffect(()=>{
    console.log("MatchData:", matchData)

    if (!matchData) {
      navigate('/')
    } else {
      // setMatchData(match)
      // setTossData(toss)
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
    }


  })


  // useEffect(() => {
  //   const data = JSON.parse(sessionStorage.getItem('liveFirstInningsData'))
  //   if (data) {
  //     setCurrentRun(data.runs)
  //     setCurrentWicket(data.wickets)
  //     setTotalBalls(data.balls)
  //   }
  // }, [])

  // useEffect(() => {
  //   const match = JSON.parse(localStorage.getItem('matchDetails'))
  //   const toss = JSON.parse(localStorage.getItem('tossDetails'))

  //   if (!match || !toss) {
  //     navigate('/')
  //   } else {
  //     setMatchData(match)
  //     setTossData(toss)
  //     setTotalOver(match.over)

  //     const batting = toss.decision === 'BAT'
  //       ? toss.tossWinner
  //       : toss.tossWinner === match.team1
  //         ? match.team2
  //         : match.team1

  //     const bowling = match.team1 !== toss.tossWinner
  //       ? match.team1
  //       : match.team2

  //     setBattingTeam(batting)
  //     setBowlingTeam(bowling)
  //   }
  // }, [])

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
        return newWickets
      })
    } else {
      setCurrentRun(prev => prev + value)
    }

    if (value !== 'wide' && value !== 'no') {
      setTotalBalls(prev => {
        const newBalls = prev + 1
        if (newBalls === matchData.over * 6) setIningsOver(true)
        return newBalls
      })
    }
  }

  // useEffect(() => {
  //   const liveFirstInningsData = {
  //     bowlingteam,
  //     battingteam,
  //     runs: currentRun,
  //     balls: totalBalls,
  //     wickets: currentWicket,
  //     totalOver
  //   }
  //   sessionStorage.setItem('liveFirstInningsData', JSON.stringify(liveFirstInningsData))
  // }, [totalBalls, currentRun, currentWicket])

  // useEffect(() => {
  //   if (iningsOver) {
  //     const firstInningsDetails = {
  //       bowlingteam,
  //       battingteam,
  //       runs: currentRun,
  //       balls: totalBalls,
  //       wickets: currentWicket,
  //       totalOver
  //     }
  //     localStorage.setItem("firstInningsDetails", JSON.stringify(firstInningsDetails))
  //   }
  // }, [iningsOver])

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
      bowlingStarted
    }

    socketRef.current?.emit('message', {matchId: id, data: firstInnings})
  }, [
    totalBalls,
    currentRun,
    currentWicket,
    iningsOver,
    secondInningsStart,
    secondInningsStarted,
    bowlingStarted
  ])

  useEffect(() => {
    if (secondInningsStart) {
      setTimeout(() => {
        routeChange()
      }, 300)
    }
  }, [secondInningsStart])

  const routeChange = () => {
    socketRef.current?.off('message')
    setTimeout(() => {
      if (socketRef.current?.connected) {
        socketRef.current.disconnect()
        sessionStorage.removeItem('liveFirstInningsData')
        console.log('Socket disconnected on route change')
      }
      navigate(`/second-innings/${id}`)
    }, 200)
  }

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
                disabled={iningsOver}
                className='bg-amber-400 p-1 rounded-xl h-10 w-10 cursor-pointer disabled:opacity-50'
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
            className='flex justify-center mt-5 font-bold text-2xl text-red-600 rounded-xl cursor-pointer'
            onClick={() => {
              changeRun('W')
              setBowlingStarted(true)
            }}
          >
            Out
          </div>
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
      <div className='flex justify-around mt-5 '>
        <div >
          <h1 className='font-bold text-2xl'>Batsmen</h1>
          <p>{`${matchData.striker}:`}</p>
          <p>{`${matchData.nonStriker}:`}</p>
        </div>


        <div>
          <h1 className='font-bold text-2xl'>Bowler</h1>
            
        </div>
      </div>
    </div>
  )
}

export default AdminPage
