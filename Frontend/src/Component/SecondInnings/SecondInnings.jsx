import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "react-router";
import { io } from "socket.io-client";
import axios from "axios";

const SecondInnings = () => {
  const { id } = useParams();
  const socketRef = useRef(null);

  // match + scoreboard
  const [matchData, setMatchData] = useState({});
  const [runs, setRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [balls, setBalls] = useState(0);
  const [overs, setOvers] = useState("0.0");
  const [inningsOver, setInningsOver] = useState(false);
  const [target, setTarget] = useState(0);

  // batting/bowling people
  const [striker, setStriker] = useState("");
  const [nonStriker, setNonStriker] = useState("");
  const [openersSelected, setOpenersSelected] = useState(false);
  const [nextBatsman, setNextBatsman] = useState("");
  const [bowler, setBowler] = useState("");
  const [newBowler, setNewBowler] = useState("");
  const [awaitingNewBatsman, setAwaitingNewBatsman] = useState(false);


  // stats
  const [batsmanStats, setBatsmanStats] = useState({});
  const [bowlerStats, setBowlerStats] = useState({});

  // result
  const [winnerMsg, setWinnerMsg] = useState(null);

  // ---- socket ----
  useEffect(() => {
    socketRef.current = io("http://localhost:9000", { transports: ["websocket"] });
    socketRef.current.on("connect", () => {
      socketRef.current.emit("joinMatch", id);
    });
    return () => socketRef.current.disconnect();
  }, [id]);

  // ---- load match + target ----
  const getMatch = async () => {
    try {
      const res = await axios.get(`http://localhost:9000/user/one/${id}`);
      setMatchData(res.data.result || {});
    } catch (err) {
      console.error("Error fetching match:", err);
    }
  };

  const getFirstSummary = async () => {
    try {
      const res = await axios.get(`http://localhost:9000/user/fetchFirst/${id}`);
      const summary = res?.data?.data?.firstSummary;
      if (summary?.target) setTarget(summary.target);
    } catch (err) {
      console.error("Error fetching first summary:", err);
    }
  };

  useEffect(() => {
    getMatch();
    getFirstSummary();
  }, []);

  // who is batting/bowling this innings
  const { battingTeam, bowlingTeam } = useMemo(() => {
    if (!matchData?.team1 || !matchData?.team2) return { battingTeam: "", bowlingTeam: "" };

    const firstBatting =
      matchData.decision === "BAT"
        ? matchData.tossWinner
        : matchData.tossWinner === matchData.team1
        ? matchData.team2
        : matchData.team1;

    const secondBatting = firstBatting === matchData.team1 ? matchData.team2 : matchData.team1;
    const secondBowling = secondBatting === matchData.team1 ? matchData.team2 : matchData.team1;

    return { battingTeam: secondBatting, bowlingTeam: secondBowling };
  }, [matchData]);

  // overs text
  useEffect(() => {
    const o = Math.floor(balls / 6);
    const b = balls % 6;
    setOvers(`${o}.${b}`);
  }, [balls]);

  // ---- scoring ----
  const changeRun = (value) => {
    if (inningsOver || winnerMsg) return;

    // wides/no-balls
    if (value === "wide" || value === "no") {
      setRuns((prev) => prev + 1);
      if (bowler) {
        setBowlerStats((prev) => ({
          ...prev,
          [bowler]: {
            ...(prev[bowler] || { overs: 0, runs: 0, wickets: 0 }),
            runs: (prev[bowler]?.runs || 0) + 1,
          },
        }));
      }
      return;
    }

    // wicket
    if (value === "W") {
  setWickets((prev) => {
    const newW = prev + 1;
    if (newW === 10) setInningsOver(true);
    return newW;
  });

  setBatsmanStats((prev) => ({
    ...prev,
    [striker]: {
      ...(prev[striker] || { runs: 0, balls: 0, out: false }),
      balls: (prev[striker]?.balls || 0) + 1,
      out: true,
    },
  }));

  if (bowler) {
    setBowlerStats((prev) => ({
      ...prev,
      [bowler]: {
        ...(prev[bowler] || { overs: 0, runs: 0, wickets: 0 }),
        wickets: (prev[bowler]?.wickets || 0) + 1,
      },
    }));
  }

  setAwaitingNewBatsman(true); // lock scoring until new batsman is added
  return;
}


    // normal runs
    const n = Number(value);
    if (!Number.isNaN(n)) {
      setRuns((prev) => prev + n);

      setBatsmanStats((prev) => ({
        ...prev,
        [striker]: {
          ...(prev[striker] || { runs: 0, balls: 0, out: false }),
          runs: (prev[striker]?.runs || 0) + n,
          balls: (prev[striker]?.balls || 0) + 1,
        },
      }));

      if (bowler) {
        setBowlerStats((prev) => ({
          ...prev,
          [bowler]: {
            ...(prev[bowler] || { overs: 0, runs: 0, wickets: 0 }),
            runs: (prev[bowler]?.runs || 0) + n,
          },
        }));
      }

      setBalls((prev) => updateBalls(prev, n));
    }
  };

  // helper: update balls & handle strike
  const updateBalls = (prevBalls, runValue) => {
    const newBalls = prevBalls + 1;

    if (matchData?.over && newBalls === matchData.over * 6) {
      setInningsOver(true);
    }

    const endOfOver = newBalls % 6 === 0;
    if (endOfOver) {
      const temp = striker;
      setStriker(nonStriker);
      setNonStriker(temp);

      if (bowler) {
        setBowlerStats((prev) => ({
          ...prev,
          [bowler]: {
            ...(prev[bowler] || { overs: 0, runs: 0, wickets: 0 }),
            overs: (prev[bowler]?.overs || 0) + 1,
          },
        }));
      }
      setBowler("");
    } else if (typeof runValue === "number" && runValue % 2 === 1) {
      const temp = striker;
      setStriker(nonStriker);
      setNonStriker(temp);
    }

    return newBalls;
  };

  // ---- winner logic ----
  useEffect(() => {
    if (!target || !battingTeam || !bowlingTeam) return;

    if (runs >= target && !winnerMsg) {
      const wktsInHand = 10 - wickets;
      setWinnerMsg(`${battingTeam} won by ${wktsInHand} wicket${wktsInHand === 1 ? "" : "s"} 🎉`);
      setInningsOver(true);
      return;
    }

    if (inningsOver && runs < target && !winnerMsg) {
      const defendingRuns = target - 1;
      const margin = Math.max(0, defendingRuns - runs);
      setWinnerMsg(`${bowlingTeam} won by ${margin} run${margin === 1 ? "" : "s"} 🏆`);
    }
  }, [runs, wickets, inningsOver, target, battingTeam, bowlingTeam, winnerMsg]);

  // ---- emit live updates ----
  useEffect(() => {
    if (!battingTeam || !bowlingTeam) return;

    const payload = {
      battingTeam,
      bowlingTeam,
      runs,
      wickets,
      balls,
      striker,
      nonStriker,
      bowler,
      batsmanStats,
      bowlerStats,
      inningsOver,
      target,
      winner: winnerMsg || null,
    };

    socketRef.current?.emit("scoreUpdate", { matchId: id, data: payload });
  }, [
    id,
    battingTeam,
    bowlingTeam,
    runs,
    wickets,
    balls,
    striker,
    nonStriker,
    bowler,
    batsmanStats,
    bowlerStats,
    inningsOver,
    target,
    winnerMsg,
  ]);

  const ballsLeft =
    matchData?.over ? Math.max(0, matchData.over * 6 - balls) : null;
  const runsRequired = target ? Math.max(0, target - runs) : null;

  // confirm new batsman
  const confirmNewBatsman = () => {
  if (!nextBatsman) return;
  setStriker(nextBatsman);
  setBatsmanStats((prev) => ({
    ...prev,
    [nextBatsman]: { runs: 0, balls: 0, out: false },
  }));
  setNextBatsman("");
  setAwaitingNewBatsman(false); // unlock scoring
};


  return (
    <div className="font-mono p-5">
      <h1 className="text-2xl font-bold text-center mb-1">Second Innings Admin Panel</h1>
      <p className="text-center text-sm opacity-70 mb-4">
        {battingTeam && bowlingTeam ? `${battingTeam} vs ${bowlingTeam}` : ""}
      </p>

      <div className="flex justify-around text-xl font-bold mb-3">
        <div>{runs}/{wickets}</div>
        <div>Overs: {overs}{matchData?.over ? ` / ${matchData.over}.0` : ""}</div>
      </div>

      {target > 0 && !winnerMsg && (
        <div className="text-center mb-4">
          <span className="font-semibold">Target:</span> {target}{" "}
          {runsRequired !== null && ballsLeft !== null && (
            <span className="ml-3">
              • Need <b>{runsRequired}</b> off <b>{ballsLeft}</b>
            </span>
          )}
        </div>
      )}

      {winnerMsg && (
        <div className="text-center text-2xl font-bold mt-2 mb-4 text-green-600">
          {winnerMsg}
        </div>
      )}

      {/* Openers */}
      {!openersSelected && (
        <div className="flex flex-col items-center gap-3 mb-6">
          <h2 className="font-bold text-lg">Select Opening Batsmen</h2>

          <input
            type="text"
            value={striker}
            onChange={(e) => setStriker(e.target.value)}
            placeholder="Enter Striker Name"
            className="border px-3 py-2 rounded w-64"
          />

          <input
            type="text"
            value={nonStriker}
            onChange={(e) => setNonStriker(e.target.value)}
            placeholder="Enter Non-Striker Name"
            className="border px-3 py-2 rounded w-64"
          />

          <button
            className="bg-green-500 text-white px-4 py-2 rounded mt-2"
            onClick={() => {
              if (striker && nonStriker) {
                setOpenersSelected(true);
                setBatsmanStats({
                  [striker]: { runs: 0, balls: 0, out: false },
                  [nonStriker]: { runs: 0, balls: 0, out: false },
                });
              }
            }}
          >
            Confirm Openers
          </button>
        </div>
      )}

      {/* Bowler */}
      {openersSelected && (!bowler || balls % 6 === 0) && !winnerMsg && (
        <div className="mt-2 flex gap-2 items-center justify-center">
          <input
            type="text"
            value={newBowler}
            onChange={(e) => setNewBowler(e.target.value)}
            placeholder="Enter Bowler Name"
            className="border px-3 py-2 rounded w-64"
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => {
              if (newBowler.trim()) {
                const name = newBowler.trim();
                setBowler(name);
                setBowlerStats((prev) => ({
                  ...prev,
                  [name]: prev[name] || { overs: 0, runs: 0, wickets: 0 },
                }));
                setNewBowler("");
              }
            }}
          >
            Set Bowler
          </button>
        </div>
      )}

      
      {/* Scoring buttons */}
{openersSelected && (
  <div className="flex flex-col items-center mt-6">
    <div className="flex justify-center flex-wrap gap-2">
      {[0, 1, 2, 3, 4, 5, 6, "wide", "no"].map((val) => (
        <button
          key={val}
          onClick={() => changeRun(val)}
          disabled={inningsOver || Boolean(winnerMsg) || !bowler || awaitingNewBatsman}
          className="bg-amber-400 px-4 py-2 rounded-xl disabled:opacity-50"
        >
          {val}
        </button>
      ))}
      <button
        onClick={() => changeRun("W")}
        disabled={inningsOver || Boolean(winnerMsg) || !bowler}
        className="bg-red-500 text-white px-4 py-2 rounded-xl disabled:opacity-50"
      >
        OUT
      </button>
    </div>

    {/* Warning if no bowler */}
    {!bowler && !inningsOver && !winnerMsg && (
      <p className="text-red-500 font-semibold mt-2">
        Please set a bowler before scoring
      </p>
    )}
  </div>
)}


      {/* Next batsman input */}
      {(batsmanStats[striker]?.out || batsmanStats[nonStriker]?.out) && (
        <div className="mt-5 flex flex-col items-center">
          <input
            type="text"
            placeholder="Enter next batsman"
            value={nextBatsman}
            onChange={(e) => setNextBatsman(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <button
            onClick={confirmNewBatsman}
            className="bg-green-600 text-white px-4 py-2 rounded mt-2"
          >
            Confirm New Batsman
          </button>
        </div>
      )}

      {/* Batsman table */}
      {openersSelected && (
        <div className="mt-6">
          <h2 className="font-bold text-lg mb-2">Batsman Details</h2>
          <table className="w-full border text-center">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Name</th>
                <th className="p-2">Runs</th>
                <th className="p-2">Balls</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(batsmanStats).map(([name, stats]) => (
                <tr key={name} className="border">
                  <td className="p-2">{name}</td>
                  <td className="p-2">{stats.runs}</td>
                  <td className="p-2">{stats.balls}</td>
                  <td className="p-2">{stats.out ? "Out" : "Not Out"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bowler table */}
      {Object.keys(bowlerStats).length > 0 && (
        <div className="mt-6">
          <h2 className="font-bold text-lg mb-2">Bowler Details</h2>
          <table className="w-full border text-center">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Name</th>
                <th className="p-2">Overs</th>
                <th className="p-2">Runs</th>
                <th className="p-2">Wickets</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(bowlerStats).map(([name, stats]) => (
                <tr key={name} className="border">
                  <td className="p-2">{name}</td>
                  <td className="p-2">{stats.overs}</td>
                  <td className="p-2">{stats.runs}</td>
                  <td className="p-2">{stats.wickets}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {inningsOver && !winnerMsg && (
        <h2 className="text-red-600 font-bold text-2xl text-center mt-5">
          Innings Over
        </h2>
      )}
    </div>
  );
};

export default SecondInnings;
