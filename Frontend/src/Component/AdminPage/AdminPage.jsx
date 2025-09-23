import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from "socket.io-client";
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { Backend_URL } from "../../Utilities/Constant.js";

// A simple, reusable loader component for asynchronous actions
const Loader = ({ message = "Loading..." }) => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-50">
    <div className="w-16 h-16 border-4 border-t-amber-500 border-neutral-700 rounded-full animate-spin"></div>
    <p className="text-white text-lg mt-4">{message}</p>
  </div>
);

const AdminPage = () => {
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // State for loading indicators
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Loading Match...");

  // All other existing states
  const [input, setInput] = useState({ batsman1: '', batsman2: '', bowler: '' });
  const [matchData, setMatchData] = useState({});
  const [totalOver, setTotalOver] = useState(0);
  const [battingTeam, setBattingTeam] = useState('');
  const [bowlingTeam, setBowlingTeam] = useState('');
  const [currentRun, setCurrentRun] = useState(0);
  const [totalBalls, setTotalBalls] = useState(0);
  const [currentWicket, setCurrentWicket] = useState(0);
  const [Overs, setOvers] = useState('0.0');
  const [iningsOver, setIningsOver] = useState(false);
  const [secondInningsStarts, setSecondInningsStarts] = useState(false);
  const [bowlingStarted, setBowlingStarted] = useState(false);
  const [isFirstInnings, setIsFirstInnings] = useState(true);
  const [target, setTarget] = useState(null);
  const [firstInningsRuns, setFirstInningsRuns] = useState(0);
  const [firstInningsBattingTeam, setFirstInningsBattingTeam] = useState('');
  const [striker, setStriker] = useState('');
  const [nonStriker, setNonStriker] = useState('');
  const [bowler, setBowler] = useState('');
  const [batsmanStats, setBatsmanStats] = useState({});
  const [bowlerStats, setBowlerStats] = useState({});
  const [value, setValue] = useState("new");
  const [firstInningsBatsmanStats, setFirstInningsBatsmanStats] = useState({});
  const [firstInningsBowlerStats, setFirstInningsBowlerStats] = useState({});
  const [openingBatsman1, setOpeningBatsman1] = useState("");
  const [openingBatsman2, setOpeningBatsman2] = useState("");
  const [openingBowler, setOpeningBowler] = useState("");
  const [openersSet, setOpenersSet] = useState(false);
  const [isFreeHit, setIsFreeHit] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [openersSelected, setOpenersSelected] = useState(false);
  const [matchWinner, setMatchWinner] = useState('');
  const [showBatsmanModal, setShowBatsmanModal] = useState(false);
  const [showBowlerModal, setShowBowlerModal] = useState(false);
  const [timeLine, setTimeLine] = useState([]);
  const [commentry, setCommentry] = useState('🏏 Match is about to begin');
  const [toltalBallsInMatch, setToltalBallsInMatch] = useState(0);
  const [RRR, setRRR] = useState(0);
  const [CRR, setCRR] = useState(0);

  // ===== SOCKET =====
  useEffect(() => {
    socketRef.current = io(Backend_URL);
    socketRef.current.on("connect", () => {
      if (id) socketRef.current.emit('joinMatch', id);
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, [id]);

  
  useEffect(() => {
    const getMatch = async () => {
      setLoading(true);
      setLoadingMessage("Fetching Match Details...");
      try {
        const res = await axios.get(`${Backend_URL}user/one/${id}`);
        setMatchData(res.data.result);
        setToltalBallsInMatch(res.data.result.over * 6);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getMatch();
  }, [id]);


  useEffect(() => {
    if (!matchData || !matchData.team1) return;
    setTotalOver(matchData.over);

    const batting = matchData.decision === 'BAT'
      ? matchData.tossWinner
      : matchData.tossWinner === matchData.team1 ? matchData.team2 : matchData.team1;

    const bowling = batting === matchData.team1 ? matchData.team2 : matchData.team1;

    setBattingTeam(batting);
    setBowlingTeam(bowling);
  }, [matchData]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.batsman1 || !input.batsman2 || !input.bowler) {
      return alert("Please fill in all player names.");
    }
    setLoading(true);
    setLoadingMessage("Setting up the match...");
    try {
      const res = await axios.put(`${Backend_URL}user/addOpeners/${id}`, input);
      const matchDetails = res.data.data;
      const bats1 = matchDetails.batsman1 || "";
      const bats2 = matchDetails.batsman2 || "";
      const bowl = matchDetails.bowler || "";

      setStriker(bats1);
      setNonStriker(bats2);
      setBowler(bowl);

      setBatsmanStats({
        [bats1]: { runs: 0, balls: 0, out: false },
        [bats2]: { runs: 0, balls: 0, out: false },
      });
      setBowlerStats({
        [bowl]: { runs: 0, balls: 0, wickets: 0 },
      });

      setOpenersSelected(true);
    } catch (error) {
      if (error.response) {
        console.error("Backend error:", error.response.data);
      } else {
        console.error("Network error:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

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
    }));
  };
  const updateBowler = (name, cb) => {
    setBowlerStats(prev => {
      const current = prev[name] || { runs: 0, balls: 0, wickets: 0 };
      return {
        ...prev,
        [name]: { ...current, ...cb(current) }
      };
    });
  };

  // ===== LOGIC FOR TIMELINE AND COMMENTARY (UNCHANGED) =====
  const updateTimeline = (eventType) => {
    let symbol;
    switch (eventType) {
      case 0: symbol = "0"; break;
      case 1: symbol = "1"; break;
      case 2: symbol = "2"; break;
      case 3: symbol = "3"; break;
      case 4: symbol = "4"; break;
      case 6: symbol = "6"; break;
      case "W": symbol = "W"; break;
      case "wide": symbol = "Wd"; break;
      case "no": symbol = "Nb"; break;
      default: symbol = "-";
    }
    setTimeLine((prev) => [...prev, symbol]);
  };

  const updateCommentry = (eventType, batsmanName, bowlerName) => {
    let commentary;
    switch (eventType) {
      case 0: commentary = `${batsmanName} plays it safe — no run.`; break;
      case 1: commentary = `${batsmanName} takes a quick single.`; break;
      case 2: commentary = `${batsmanName} pushes for a couple of runs.`; break;
      case 3: commentary = `${batsmanName} runs hard, and they get three!`; break;
      case 4: commentary = `FOUR! ${batsmanName} finds the gap off ${bowlerName}.`; break;
      case 6: commentary = `SIX! ${batsmanName} smashes it out of the ground!`; break;
      case "W": commentary = `WICKET! ${batsmanName} is out, ${bowlerName} gets the breakthrough.`; break;
      case "wide": commentary = `${bowlerName} bowls a wide — extra run for the batting side.`; break;
      case "no": commentary = `No ball from ${bowlerName}! Free hit coming up.`; break;
      default: commentary = "Something happened on the field...";
    }
    setCommentry(commentary);
  };

  // ===== MAIN RUN HANDLER (FIRST INNINGS) - LOGIC UNCHANGED =====
  const changeRun = (value) => {
    if (!bowler || !striker) return alert("Select batsmen and bowler first!");
    setBowlingStarted(true);
    setValue(value);
    updateTimeline(value);
    updateCommentry(value, striker, bowler);

    if (value === "W") {
      if (isFreeHit) {
        setTotalBalls((b) => b + 1);
        updateBatsman(striker, (b) => ({ balls: b.balls + 1 }));
        updateBowler(bowler, (bw) => ({ balls: bw.balls + 1 }));
        setIsFreeHit(false);
        return;
      }
      setCurrentWicket((w) => {
        const newW = w + 1;
        if (newW === 10) {
          setTimeout(() => {
            setIningsOver(true);
            setBowlingStarted(false);
          }, 1000);
        }
        return newW;
      });
      setTotalBalls((b) => {
        const newBalls = b + 1;
        updateBatsman(striker, (b) => ({ balls: b.balls + 1, out: true }));
        updateBowler(bowler, (bw) => ({ balls: bw.balls + 1, wickets: bw.wickets + 1 }));
        if (newBalls % 6 === 0) {
          setTimeout(() => setShowBatsmanModal(true), 500);
          const temp = striker;
          setStriker(nonStriker);
          setNonStriker(temp);
          setTimeout(() => setShowBowlerModal(true), 1200);
        } else {
          setTimeout(() => setShowBatsmanModal(true), 500);
        }
        return newBalls;
      });
      return;
    }

    if (value === "wide" || value === "no") {
      setCurrentRun((r) => r + 1);
      updateBowler(bowler, (bw) => ({ runs: bw.runs + 1 }));
      setIsFreeHit(true);
      return;
    }

    setCurrentRun((r) => r + value);
    updateBatsman(striker, (b) => ({
      runs: b.runs + value,
      balls: b.balls + 1,
    }));
    updateBowler(bowler, (bw) => ({
      runs: bw.runs + value,
      balls: bw.balls + 1,
    }));
    setTotalBalls((prev) => {
      const newBalls = prev + 1;
      if (newBalls === matchData.over * 6) {
        setTimeout(() => {
          setIningsOver(true);
          setBowlingStarted(false);
        }, 1000);
        return newBalls;
      }
      if (newBalls % 6 === 0) {
        const temp = striker;
        setStriker(nonStriker);
        setNonStriker(temp);
        setShowBowlerModal(true);
      } else if (value % 2 === 1) {
        const temp = striker;
        setStriker(nonStriker);
        setNonStriker(temp);
      }
      return newBalls;
    });
  };

  // ===== START 2nd INNINGS =====
  const startSecondInnings = async () => {
    setLoading(true);
    setLoadingMessage("Starting Second Innings...");
    try {
      let summary = {
        battingTeam, bowlingTeam, totalOver: matchData.over, runs: currentRun, balls: totalBalls,
        wickets: currentWicket, target: currentRun + 1,
        batsman: Object.entries(batsmanStats).map(([name, stats]) => ({ name, ...stats })),
        bowler: Object.entries(bowlerStats).map(([name, stats]) => ({ name, ...stats }))
      };
      summary = {
        ...summary,
        batsman: summary.batsman.filter(b => b.name && b.name.trim() !== ""),
        bowler: summary.bowler.filter(b => b.name && b.name.trim() !== "")
      };
      await axios.put(`${Backend_URL}user/addFirstSummary/${id}`, summary);

      setFirstInningsBatsmanStats(batsmanStats);
      setFirstInningsBowlerStats(bowlerStats);
      setFirstInningsBattingTeam(battingTeam);
      setSecondInningsStarts(true);
      setIningsOver(false);
      setFirstInningsRuns(currentRun);
      setTarget(currentRun + 1);
      setBattingTeam(bowlingTeam);
      setBowlingTeam(battingTeam);
      setCurrentRun(0);
      setTotalBalls(0);
      setCurrentWicket(0);
      setOvers("0.0");
      setIsFirstInnings(false);
      setIsFreeHit(false);
      setStriker("");
      setNonStriker("");
      setBowler("");
      setBatsmanStats({});
      setBowlerStats({});
      setCommentry("🏏 Second innings is about to begin!");
      setTimeLine([]);
      setValue("new");
    } catch (error) {
      console.error("Error saving first innings summary:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetOpeners = () => {
    if (!openingBatsman1 || !openingBatsman2 || !openingBowler) {
      alert("Please enter all players");
      return;
    }
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

  useEffect(() => {
    if (!isFirstInnings && target !== null && currentRun >= target) {
      setIningsOver(true);
    }
  }, [currentRun, isFirstInnings, target]);

  // ===== SECOND INNINGS RUN HANDLER - LOGIC UNCHANGED =====
const secChangeRun = (value) => {
  if (!bowler || !striker) return alert("Select batsmen and bowler first!");

  setBowlingStarted(true);
  setValue(value);
  updateTimeline(value);
  updateCommentry(value, striker, bowler);

  // Handle Wicket
if (value === "W") {
  if (isFreeHit) {
    setTotalBalls(b => b + 1);
    updateBatsman(striker, b => ({ balls: b.balls + 1 }));
    updateBowler(bowler, bw => ({ balls: bw.balls + 1 }));
    setIsFreeHit(false);
    return;
  }

  setCurrentWicket(w => {
    const newW = w + 1;

    if (newW === 10) {
      // All out → directly end match
      setIningsOver(true);
      setBowlingStarted(false);
      setMatchResult(`${bowlingTeam} won by ${target - 1 - currentRun} runs`);
      setMatchWinner(bowlingTeam);

      // Update final ball + stats
      setTotalBalls(b => b + 1);
      updateBatsman(striker, b => ({ balls: b.balls + 1, out: true }));
      updateBowler(bowler, bw => ({ balls: bw.balls + 1, wickets: bw.wickets + 1 }));

      return newW;
    }

    return newW;
  });

  // Normal wicket flow only if match not over
  setTotalBalls(prev => {
    // 🚨 protect against false modal triggers
    if (currentWicket + 1 >= 10 || iningsOver) {
      return prev; // do nothing, innings ended
    }

    const newBalls = prev + 1;
    updateBatsman(striker, b => ({ balls: b.balls + 1, out: true }));
    updateBowler(bowler, bw => ({ balls: bw.balls + 1, wickets: bw.wickets + 1 }));

    if (newBalls % 6 === 0) {
      setTimeout(() => {
        if (!iningsOver) setShowBatsmanModal(true);
      }, 500);

      const temp = striker;
      setStriker(nonStriker);
      setNonStriker(temp);

      setTimeout(() => {
        if (!iningsOver) setShowBowlerModal(true);
      }, 1200);
    } else {
      setTimeout(() => {
        if (!iningsOver) setShowBatsmanModal(true);
      }, 500);
    }
    return newBalls;
  });

  return;
}



  // Handle Wide/No ball
  if (value === "wide" || value === "no") {
    setCurrentRun(r => {
      const newR = r + 1;
      if (newR >= target) {
        setIningsOver(true);
        setBowlingStarted(false);
        setMatchResult(`${battingTeam} won by ${10 - currentWicket} wickets`);
        setMatchWinner(battingTeam);
      }
      return newR;
    });
    updateBowler(bowler, bw => ({ runs: bw.runs + 1 }));
    if (value === "no") setIsFreeHit(true);
    return;
  }

  // Handle Runs
  setCurrentRun(r => {
    const newR = r + value;
    if (newR >= target) {
      setIningsOver(true);
      setBowlingStarted(false);
      setMatchResult(`${battingTeam} won by ${10 - currentWicket} wickets`);
      setMatchWinner(battingTeam);
    }
    return newR;
  });

  updateBatsman(striker, b => ({ runs: b.runs + value, balls: b.balls + 1 }));
  updateBowler(bowler, bw => ({ runs: bw.runs + value, balls: bw.balls + 1 }));

  setTotalBalls(prev => {
    const newBalls = prev + 1;

    if (newBalls === matchData.over * 6) {
      setTimeout(() => {
        setIningsOver(true);
        setBowlingStarted(false);
        if (currentRun >= target) {
          setMatchResult(`${battingTeam} won by ${10 - currentWicket} wickets`);
          setMatchWinner(battingTeam);
        } else if (currentRun < target - 1) {
          setMatchResult(`${bowlingTeam} won by ${target - currentRun - 1} runs`);
          setMatchWinner(bowlingTeam);
        } else {
          setMatchResult("Match tied");
        }
      }, 1000);
      return newBalls;
    }

    if (newBalls % 6 === 0) {
      const temp = striker;
      setStriker(nonStriker);
      setNonStriker(temp);
      setShowBowlerModal(true);
    } else if (value % 2 === 1) {
      const temp = striker;
      setStriker(nonStriker);
      setNonStriker(temp);
    }

    setIsFreeHit(false);
    return newBalls;
  });
};


  // ===== UTILITY FUNCTIONS (UNCHANGED) =====
  const calculateCurrentRunRate = (runs, balls) => {
    if (balls === 0) return 0;
    return ((runs / balls) * 6).toFixed(2);
  };
  const calculateStrikeRate = (runs, balls) => {
    return balls > 0 ? ((runs / balls) * 100).toFixed(2) : "0.00";
  };
  const calculateEconomy = (runs, over) => {
    return over > 0 ? (runs / over).toFixed(1) : "0.0";
  };
  const calculateOver = (inputBalls) => {
    const over = Math.floor(inputBalls / 6);
    const balls = inputBalls % 6;
    return `${over}.${balls}`;
  };

  useEffect(() => {
    setCRR(calculateCurrentRunRate(currentRun, totalBalls));
    if (!isFirstInnings && target) {
      const runsNeeded = target - currentRun;
      const ballsRemaining = toltalBallsInMatch - totalBalls;
      setRRR(calculateCurrentRunRate(runsNeeded, ballsRemaining));
    }
  }, [totalBalls, currentRun, isFirstInnings, target, toltalBallsInMatch]);

  // ===== SAVE 2nd INNINGS & MATCH RESULT =====
  useEffect(() => {
    if (iningsOver && !isFirstInnings) {
      const saveSecondInnings = async () => {
        setLoading(true);
        setLoadingMessage("Finishing Match...");
        try {
          const summary = {
            battingTeam, bowlingTeam, totalOver: matchData.over, runs: currentRun,
            balls: totalBalls, wickets: currentWicket, target, matchResult, matchWinner,
            batsman: Object.entries(batsmanStats).map(([name, stats]) => ({ name, ...stats })),
            bowler: Object.entries(bowlerStats).map(([name, stats]) => ({ name, ...stats })),
          };
          await axios.put(`${Backend_URL}user/addSecondSummary/${id}`, summary);
        } catch (error) {
          console.error("Error saving second innings summary:", error);
        } finally {
          setLoading(false);
        }
      };
      saveSecondInnings();
    }
  }, [iningsOver, isFirstInnings, matchResult]); // Depends on matchResult to ensure it's set

  // ===== UPDATE MATCH STATUS TO COMPLETED =====
  useEffect(() => {
    if (matchResult) {
      const updateMatchStatus = async () => {
        try {
          await axios.put(`${Backend_URL}user/update/${id}`);
        } catch (error) {
          console.error("Error updating match status:", error);
        }
      };
      updateMatchStatus();
    }
  }, [matchResult, id]);

  // ===== EMIT SCORE VIA SOCKET =====
  useEffect(() => {
    const inningsData = {
      inning: isFirstInnings ? 1 : 2, battingTeam, bowlingTeam,
      runs: currentRun, balls: totalBalls, overs: Overs, totalOvers: matchData.over,
      wickets: currentWicket, iningsOver, target, batsmanStats, bowlerStats, bowler,
      bowlingStarted, striker, freeHit: isFreeHit, commentry, timeLine,
      toltalBallsInMatch, CRR, RRR, value
    };
    socketRef.current?.emit("scoreUpdate", { matchId: id, data: inningsData });
  }, [
    totalBalls, currentRun, currentWicket, Overs, iningsOver, isFirstInnings,
    target, batsmanStats, bowlerStats, matchData.over, bowler, bowlingStarted,
    striker, isFreeHit, commentry, timeLine, CRR, RRR, value
  ]);

  return (
    <div className="font-mono">
      {loading && <Loader message={loadingMessage} />}
      <div className="min-h-screen w-full bg-black relative">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 100%, rgba(255, 69, 0, 0.6) 0%, transparent 60%),
              radial-gradient(circle at 50% 100%, rgba(255, 140, 0, 0.4) 0%, transparent 70%),
              radial-gradient(circle at 50% 100%, rgba(255, 215, 0, 0.3) 0%, transparent 80%)
            `,
          }}
        />
        
        <div className='relative z-20 text-white'>
          {/* Modals are now more responsive */}
          {showBatsmanModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
              <div className="relative bg-white/20 backdrop-blur-2xl border-2 border-amber-600 rounded-2xl p-6 w-full max-w-sm text-center">
                <h3 className="text-2xl font-extrabold text-amber-400 drop-shadow-lg mb-5 tracking-wide">
                  Enter Next Batsman
                </h3>
                <input
                  id="nextBatsmanInput" type="text" placeholder="Batsman name"
                  className="w-full rounded-xl border border-amber-400/40 px-4 py-2 bg-black/40 text-amber-100 placeholder-amber-300/60 focus:ring-2 focus:ring-amber-400 focus:outline-none transition"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value) {
                      setStriker(e.target.value);
                      setBatsmanStats(prev => ({ ...prev, [e.target.value]: { runs: 0, balls: 0, out: false } }));
                      setShowBatsmanModal(false);
                    }
                  }}
                />
                <button
                  className="mt-5 w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl px-6 py-2 cursor-pointer shadow-lg hover:scale-105 hover:shadow-amber-400/40 transition-transform duration-200"
                  onClick={() => {
                    const input = document.querySelector("#nextBatsmanInput");
                    if (input.value) {
                      setStriker(input.value);
                      setBatsmanStats(prev => ({ ...prev, [input.value]: { runs: 0, balls: 0, out: false } }));
                      setShowBatsmanModal(false);
                    }
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          )}

          {!openersSelected && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
              <div className="relative bg-neutral-700/20 backdrop-blur-xl border-2 border-amber-600 rounded-2xl p-6 md:p-8 text-center w-full max-w-md">
                <h2 className="text-2xl md:text-3xl font-extrabold text-amber-600 drop-shadow-lg mb-6 tracking-wide">
                  Choose Openers
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
                  <label className="flex flex-col items-start text-gray-200 font-semibold">
                    Striker:
                    <input
                      placeholder="Enter Striker name"
                      className="mt-2 w-full rounded-xl border border-amber-500 px-4 py-2 bg-black/40 text-white placeholder-amber-300/60 focus:ring-2 focus:ring-amber-400 focus:outline-none transition"
                      type="text" value={input.batsman1} onChange={(e) => setInput({ ...input, batsman1: e.target.value })}
                    />
                  </label>
                  <label className="flex flex-col items-start text-gray-200 font-semibold">
                    Non-Striker:
                    <input
                      placeholder="Enter Non-Striker name"
                      className="mt-2 w-full rounded-xl border border-amber-500 px-4 py-2 bg-black/40 text-white placeholder-amber-300/60 focus:ring-2 focus:ring-amber-400 focus:outline-none transition"
                      type="text" value={input.batsman2} onChange={(e) => setInput({ ...input, batsman2: e.target.value })}
                    />
                  </label>
                  <label className="flex flex-col items-start text-gray-200 font-semibold">
                    Bowler:
                    <input
                      placeholder="Enter Opening Bowler name"
                      className="mt-2 w-full rounded-xl border border-amber-500 px-4 py-2 bg-black/40 text-white placeholder-amber-300/60 focus:ring-2 focus:ring-amber-400 focus:outline-none transition"
                      type="text" value={input.bowler} onChange={(e) => setInput({ ...input, bowler: e.target.value })}
                    />
                  </label>
                  <input
                    type="submit" value="Start Match"
                    className="bg-gradient-to-r from-amber-700 to-amber-400 text-white font-bold rounded-xl px-6 py-2.5 mt-6 cursor-pointer shadow-lg hover:scale-105 hover:shadow-amber-600/40 transition-transform duration-200"
                  />
                </form>
              </div>
            </div>
          )}
          
          {showBowlerModal && (
             <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 p-4">
               <div className="relative bg-white/20 backdrop-blur-2xl border-2 border-amber-600 rounded-2xl p-6 w-full max-w-sm text-center">
                 <h3 className="text-2xl font-extrabold text-amber-400 drop-shadow-lg mb-5 tracking-wide">
                   Enter Next Bowler
                 </h3>
                 <input
                   id="nextBowlerInput" type="text" placeholder="Bowler name"
                   className="w-full rounded-xl border border-amber-400/40 px-4 py-2 bg-black/40 text-amber-100 placeholder-amber-300/60 focus:ring-2 focus:ring-amber-400 focus:outline-none transition"
                   onKeyDown={(e) => {
                     if (e.key === "Enter" && e.target.value) {
                       setBowler(e.target.value);
                       setBowlerStats(prev => ({...prev, [e.target.value]: { runs: 0, balls: 0, wickets: 0 }}));
                       setShowBowlerModal(false);
                     }
                   }}
                 />
                 <button
                   className="mt-5 w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl px-6 py-2 cursor-pointer shadow-lg hover:scale-105 hover:shadow-amber-400/40 transition-transform duration-200"
                   onClick={() => {
                     const input = document.querySelector("#nextBowlerInput");
                     if (input.value) {
                       setBowler(input.value);
                       setBowlerStats(prev => ({...prev, [input.value]: { runs: 0, balls: 0, wickets: 0 }}));
                       setShowBowlerModal(false);
                     }
                   }}
                 >
                   Confirm
                 </button>
               </div>
             </div>
          )}

          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
             {!secondInningsStarts ? (
               // FIRST INNINGS
               !iningsOver ? (
                 <div>
                   <div className='text-center'>
                     <div className='flex items-center justify-center relative mb-4'>
                       <ArrowLeft onClick={() => navigate(`/toss/${id}`)} className="absolute left-0 w-6 h-6 sm:w-7 sm:h-7 cursor-pointer hover:scale-125 transition-transform"/>
                       <h1 className='font-bold text-2xl sm:text-3xl lg:text-4xl text-amber-500 tracking-tight drop-shadow-lg'>
                         First Innings
                       </h1>
                     </div>
                     <p className="mt-2 text-lg md:text-xl font-bold text-neutral-200">
                       {battingTeam} vs {bowlingTeam}
                     </p>
                     <p className="mt-4 text-2xl sm:text-3xl font-bold text-white bg-black/30 rounded-lg px-4 py-2 inline-block">
                       {battingTeam}: {currentRun}/{currentWicket} <span className="text-xl sm:text-2xl text-neutral-400">({Overs})</span>
                     </p>
                   </div>
                   
                   {/* Run Buttons */}
                   <div className="grid grid-cols-5 sm:grid-cols-9 gap-2 sm:gap-3 my-6 max-w-3xl mx-auto">
                     {[0, 1, 2, 3, 4, 6].map((v) => (
                       <button key={v} onClick={() => changeRun(v)} className="cursor-pointer py-3 font-semibold text-white transition-all duration-200 border-2 rounded-lg bg-white/10 border-neutral-600 hover:bg-amber-500 hover:border-amber-500 hover:scale-105 text-lg">
                         {v}
                       </button>
                     ))}
                     <button onClick={() => changeRun("W")} className="cursor-pointer py-3 font-semibold text-white transition-all duration-200 border-2 rounded-lg bg-red-800/50 border-red-700 hover:bg-red-700 hover:border-red-600 hover:scale-105 text-lg">W</button>
                     <button onClick={() => changeRun("wide")} className="cursor-pointer py-3 font-semibold text-white transition-all duration-200 border-2 rounded-lg bg-sky-800/50 border-sky-700 hover:bg-sky-700 hover:border-sky-600 hover:scale-105 text-lg">WD</button>
                     <button onClick={() => changeRun("no")} className="cursor-pointer py-3 font-semibold text-white transition-all duration-200 border-2 rounded-lg bg-sky-800/50 border-sky-700 hover:bg-sky-700 hover:border-sky-600 hover:scale-105 text-lg">NB</button>
                   </div>
                   
                   {/* Rest of the UI */}
                 </div>
               ) : (
                 // INNINGS BREAK
                 <div className="text-center py-20 min-h-[70vh] flex flex-col justify-center items-center">
                   <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-red-500">First Innings Over</h1>
                   <p className="mt-4 text-xl md:text-2xl">
                     {battingTeam} scored <span className="font-bold text-amber-400">{currentRun}/{currentWicket}</span> in {Overs} overs
                   </p>
                   <button
                     onClick={startSecondInnings}
                     className="mt-8 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl px-8 py-3 cursor-pointer shadow-lg hover:scale-105 hover:shadow-amber-400/40 transition-transform duration-200 text-lg"
                   >
                     Start Second Innings
                   </button>
                 </div>
               )
             ) : (
               // SECOND INNINGS
               <div>
                  {!iningsOver ? (
                    <div>
                      <div className='text-center'>
                         <h1 className='font-bold text-2xl sm:text-3xl lg:text-4xl text-amber-500 tracking-wider drop-shadow-lg'>
                           Second Innings
                         </h1>
                         <p className="mt-2 text-lg md:text-xl font-bold text-neutral-200">
                           {battingTeam} chasing <span className="text-amber-400">{target}</span>
                         </p>
                       </div>
                       
                       {!openersSet ? (
                         <div className="mt-8 max-w-md mx-auto p-6 bg-black/30 backdrop-blur-sm border border-neutral-700 rounded-lg">
                           <h3 className="text-xl font-bold mb-4 text-center text-amber-500">Enter Opening Players</h3>
                           <div className="flex flex-col gap-4">
                             <input type="text" placeholder="Opening Batsman 1 (Striker)" value={openingBatsman1} onChange={(e) => setOpeningBatsman1(e.target.value)} className="w-full rounded-xl border border-amber-500/50 px-4 py-2 bg-black/40 text-white placeholder-amber-300/60 focus:ring-2 focus:ring-amber-400 focus:outline-none transition"/>
                             <input type="text" placeholder="Opening Batsman 2 (Non-Striker)" value={openingBatsman2} onChange={(e) => setOpeningBatsman2(e.target.value)} className="w-full rounded-xl border border-amber-500/50 px-4 py-2 bg-black/40 text-white placeholder-amber-300/60 focus:ring-2 focus:ring-amber-400 focus:outline-none transition"/>
                             <input type="text" placeholder="Opening Bowler" value={openingBowler} onChange={(e) => setOpeningBowler(e.target.value)} className="w-full rounded-xl border border-amber-500/50 px-4 py-2 bg-black/40 text-white placeholder-amber-300/60 focus:ring-2 focus:ring-amber-400 focus:outline-none transition"/>
                             <button onClick={handleSetOpeners} className="mt-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl px-6 py-2 cursor-pointer shadow-lg hover:scale-105 hover:shadow-amber-400/40 transition-transform duration-200">
                               Start Innings
                             </button>
                           </div>
                         </div>
                       ) : (
                         <>
                           <div className="text-center my-4 space-y-3">
                             <p className="text-2xl sm:text-3xl font-bold text-white bg-black/30 rounded-lg px-4 py-2 inline-block">
                               {battingTeam}: {currentRun}/{currentWicket} <span className="text-xl sm:text-2xl text-neutral-400">({Overs})</span>
                             </p>
                             <p className="text-lg md:text-xl font-bold text-white bg-black/30 rounded-lg px-4 py-2 block">
                               {battingTeam} need {target - currentRun > 0 ? target-currentRun : 0} runs in {toltalBallsInMatch - totalBalls} balls
                             </p>
                           </div>

                           <div className="grid grid-cols-5 sm:grid-cols-9 gap-2 sm:gap-3 my-6 max-w-3xl mx-auto">
                              {[0, 1, 2, 3, 4, 6].map((v) => (
                               <button key={v} onClick={() => secChangeRun(v)} className="py-3 font-semibold text-white transition-all duration-200 border-2 rounded-lg bg-white/10 border-neutral-600 hover:bg-amber-500 hover:border-amber-500 hover:scale-105 text-lg">{v}</button>
                             ))}
                             <button onClick={() => secChangeRun("W")} className="py-3 font-semibold text-white transition-all duration-200 border-2 rounded-lg bg-red-800/50 border-red-700 hover:bg-red-700 hover:border-red-600 hover:scale-105 text-lg">W</button>
                             <button onClick={() => secChangeRun("wide")} className="py-3 font-semibold text-white transition-all duration-200 border-2 rounded-lg bg-sky-800/50 border-sky-700 hover:bg-sky-700 hover:border-sky-600 hover:scale-105 text-lg">WD</button>
                             <button onClick={() => secChangeRun("no")} className="py-3 font-semibold text-white transition-all duration-200 border-2 rounded-lg bg-sky-800/50 border-sky-700 hover:bg-sky-700 hover:border-sky-600 hover:scale-105 text-lg">NB</button>
                           </div>
                         </>
                       )}
                    </div>
                  ) : (
                    // MATCH OVER
                    <div className="text-center py-20 min-h-[70vh] flex flex-col justify-center items-center">
                       <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-500">Match Over</h1>
                       <h2 className="mt-5 text-2xl md:text-3xl font-bold text-amber-400">{matchResult}</h2>
                       <div className="mt-6 space-y-2 text-lg text-neutral-300">
                         <p>{firstInningsBattingTeam} scored {firstInningsRuns}</p>
                         <p>{battingTeam} scored {currentRun}/{currentWicket} in {Overs} overs</p>
                       </div>
                     </div>
                  )}
               </div>
             )}
            
            {/* Common UI elements for both innings when active */}
            {((isFirstInnings && openersSelected && !iningsOver) || (!isFirstInnings && openersSet && !iningsOver)) && (
                <>
                <div className='flex justify-center text-center mt-3 gap-3'>
                    <p className='px-3 py-3 font-semibold text-white transition-all duration-200 border-2 rounded-lg bg-white/10 border-neutral-600'>CRR: {CRR}</p>
                    {!isFirstInnings && <p className='px-3 py-3 font-semibold text-white transition-all duration-200 border-2 rounded-lg bg-white/10 border-neutral-600'>RRR: {RRR}</p>}
                </div>

                <div className="flex justify-center mt-4 p-2">
                    <p className={`cursor-pointer py-3 px-4 font-semibold transition-all duration-300 border-2 rounded-lg text-center ${ value === "W" ? "bg-red-600 border-white text-white animate-bounce" : value === 4 ? "bg-blue-600 border-blue-700 text-white" : value === 6 ? "bg-green-600 border-green-700 text-white animate-pulse" : (value === "wide" || value === "no") ? "bg-amber-500 border-amber-600 text-black" : "bg-neutral-800 border-neutral-600 text-gray-200" }`}>
                    {commentry}
                    </p>
                </div>

                <div className="flex justify-center mt-4">
                    {timeLine.length === 0 ?(
                    <div className='py-1.5 px-3 font-semibold text-white transition-all duration-200 border-2 rounded-lg bg-white/10 border-neutral-600'>
                        <h1>Timeline will appear here</h1>
                    </div>
                    ) : (
                    <div className="flex flex-wrap justify-center gap-2">
                        {timeLine.slice(-6).map((res, idx) => (
                        <div key={idx} className={`w-10 h-10 flex items-center justify-center rounded-full font-bold ${res === "4" ? "bg-blue-600 text-white" : res === "6" ? "bg-green-600 text-white" : res === "W" ? "bg-red-600 text-white" : (res === "Wd" || res === "Nb") ? "bg-amber-500 text-black" : "bg-gray-700 text-white"}`}>
                            {res}
                        </div>
                        ))}
                    </div>
                    )}
                </div>

                {/* Stats Tables */}
                <div className="grid gap-6 md:gap-8 mt-8 md:grid-cols-2">
                    <div>
                        <h3 className="text-xl font-bold text-neutral-300 mb-2">Batting Scoreboard</h3>
                        <div className="overflow-x-auto bg-black/30 backdrop-blur-sm border border-neutral-700 rounded-lg p-1">
                        <table className="w-full text-left text-sm sm:text-base">
                            <thead>
                            <tr className="border-b border-neutral-600">
                                <th className="p-3 font-semibold uppercase text-amber-500">Batsman</th>
                                <th className="p-3 font-semibold uppercase text-amber-500 text-center">R</th>
                                <th className="p-3 font-semibold uppercase text-amber-500 text-center">B</th>
                                <th className="p-3 font-semibold uppercase text-amber-500 text-center">SR</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Object.keys(batsmanStats).filter((b) => !batsmanStats[b].out).map((b) => (
                                <tr key={b} className={`border-t border-neutral-800 ${b === striker ? "bg-amber-500/50" : ""}`}>
                                <td className="p-3 font-bold">{b}{b === striker ? " *" : ""}</td>
                                <td className="p-3 font-bold text-center">{batsmanStats[b].runs}</td>
                                <td className="p-3 text-center">{batsmanStats[b].balls}</td>
                                <td className="p-3 text-center">{calculateStrikeRate(batsmanStats[b].runs, batsmanStats[b].balls)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-neutral-300 mb-2">Bowling Scoreboard</h3>
                        <div className="overflow-x-auto bg-black/30 backdrop-blur-sm border border-neutral-700 rounded-lg p-1">
                        <table className="w-full text-left text-sm sm:text-base">
                            <thead>
                            <tr className="border-b border-neutral-600">
                                <th className="p-3 font-semibold uppercase text-amber-500">Bowler</th>
                                <th className="p-3 font-semibold uppercase text-amber-500 text-center">R</th>
                                <th className="p-3 font-semibold uppercase text-amber-500 text-center">B</th>
                                <th className="p-3 font-semibold uppercase text-amber-500 text-center">W</th>
                                <th className="p-3 font-semibold uppercase text-amber-500 text-center">Eco.</th>
                            </tr>
                            </thead>
                            <tbody>
                            {Object.keys(bowlerStats).filter((b) => b === bowler).map((b) => (
                                <tr key={b} className="border-t border-neutral-800">
                                <td className="p-3 font-bold">{b}</td>
                                <td className="p-3 text-center">{bowlerStats[b].runs}</td>
                                <td className="p-3 text-center">{bowlerStats[b].balls}</td>
                                <td className="p-3 font-bold text-center">{bowlerStats[b].wickets}</td>
                                <td className="p-3 font-bold text-center">{calculateEconomy(bowlerStats[b].runs, bowlerStats[b].balls / 6)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                </div>
                </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;