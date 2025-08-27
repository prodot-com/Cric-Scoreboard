import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { io } from "socket.io-client";
import axios from "axios";

const SecondInnings = () => {
  const { id } = useParams();
  const socketRef = useRef(null);
  const navigate = useNavigate();

  const [matchData, setMatchData] = useState({});
  const [runs, setRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [balls, setBalls] = useState(0);
  const [overs, setOvers] = useState("0.0");
  const [inningsOver, setInningsOver] = useState(false);

  const [striker, setStriker] = useState("");
  const [nonStriker, setNonStriker] = useState("");
  const [bowler, setBowler] = useState("");
  const [newBowler, setNewBowler] = useState("");

  const [nextBatsman, setNextBatsman] = useState("");
  const [newBatsman, setNewBatsman] = useState("");

  const [availableBatsmen, setAvailableBatsmen] = useState([]);
  const [availableBowlers, setAvailableBowlers] = useState([]);

  const [batsmanStats, setBatsmanStats] = useState({});
  const [bowlerStats, setBowlerStats] = useState({});

  // ✅ connect socket
  useEffect(() => {
    socketRef.current = io("http://localhost:9000", { transports: ["websocket"] });
    socketRef.current.on("connect", () => {
      socketRef.current.emit("joinMatch", id);
    });
    return () => socketRef.current.disconnect();
  }, [id]);

  // ✅ fetch match details
  const getMatch = async () => {
    try {
      const res = await axios.get(`http://localhost:9000/user/one/${id}`);
      setMatchData(res.data.result);
    } catch (err) {
      console.error("Error fetching match:", err);
    }
  };

  useEffect(() => {
    getMatch();
  }, []);

  // ✅ setup batting/bowling sides for 2nd innings
  useEffect(() => {
    if (!matchData.team1 || !matchData.team2) return;

    // second innings batting team is opposite of first innings
    const firstBatting =
      matchData.decision === "BAT"
        ? matchData.tossWinner
        : matchData.tossWinner === matchData.team1
        ? matchData.team2
        : matchData.team1;

    const batting = firstBatting === matchData.team1 ? matchData.team2 : matchData.team1;
    const bowling = batting === matchData.team1 ? matchData.team2 : matchData.team1;

    setAvailableBatsmen(matchData.players?.[batting] || []);
    setAvailableBowlers(matchData.players?.[bowling] || []);

    // pick initial batsmen
    if (matchData.players && matchData.players[batting]) {
      const players = matchData.players[batting];
      if (players.length >= 2) {
        setStriker(players[0]);
        setNonStriker(players[1]);
        setAvailableBatsmen(players.slice(2)); // remove openers
        setBatsmanStats({
          [players[0]]: { runs: 0, balls: 0, out: false },
          [players[1]]: { runs: 0, balls: 0, out: false },
        });
      }
    }
  }, [matchData]);

  // ✅ overs calculation
  useEffect(() => {
    const o = Math.floor(balls / 6);
    const b = balls % 6;
    setOvers(`${o}.${b}`);
  }, [balls]);

  // ✅ change run logic
  const changeRun = (value) => {
    if (inningsOver) return;

    if (value === "wide" || value === "no") {
      setRuns((prev) => prev + 1);
      return;
    }

    if (value === "W") {
      setWickets((prev) => {
        const newW = prev + 1;
        if (newW === 10) setInningsOver(true);

        setBatsmanStats((prevStats) => ({
          ...prevStats,
          [striker]: { ...prevStats[striker], out: true },
        }));

        if (nextBatsman) {
          setStriker(nextBatsman);
          setBatsmanStats((prev) => ({
            ...prev,
            [nextBatsman]: { runs: 0, balls: 0, out: false },
          }));
          setNextBatsman("");
        }

        return newW;
      });
      return;
    }

    // ✅ normal runs
    setRuns((prev) => prev + value);

    setBatsmanStats((prev) => ({
      ...prev,
      [striker]: {
        ...prev[striker],
        runs: (prev[striker]?.runs || 0) + value,
        balls: (prev[striker]?.balls || 0) + 1,
      },
    }));

    setBalls((prev) => {
      const newBalls = prev + 1;
      if (newBalls === matchData.over * 6) setInningsOver(true);

      const endOfOver = newBalls % 6 === 0;

      if (endOfOver) {
        const temp = striker;
        setStriker(nonStriker);
        setNonStriker(temp);
        setBowler(""); // reset bowler
      } else if (value % 2 === 1) {
        // odd run → swap strike
        const temp = striker;
        setStriker(nonStriker);
        setNonStriker(temp);
      }

      return newBalls;
    });
  };

  // ✅ emit score update
  useEffect(() => {
    if (!matchData.team1 || !matchData.team2) return;

    const firstBatting =
      matchData.decision === "BAT"
        ? matchData.tossWinner
        : matchData.tossWinner === matchData.team1
        ? matchData.team2
        : matchData.team1;

    const batting = firstBatting === matchData.team1 ? matchData.team2 : matchData.team1;
    const bowling = batting === matchData.team1 ? matchData.team2 : matchData.team1;

    const data = {
      battingTeam: batting,
      bowlingTeam: bowling,
      runs,
      wickets,
      balls,
      striker,
      nonStriker,
      bowler,
      batsmanStats,
      bowlerStats,
      inningsOver,
      target: matchData?.firstSummary?.runs ? matchData.firstSummary.runs + 1 : null,
    };

    socketRef.current?.emit("scoreUpdate", { matchId: id, data });
  }, [runs, wickets, balls, striker, nonStriker, bowler, batsmanStats, inningsOver]);

  return (
    <div className="font-mono p-5">
      <h1 className="text-2xl font-bold text-center mb-4">Second Innings Admin Panel</h1>

      <div className="flex justify-around text-xl font-bold mb-5">
        <div>Score: {runs}/{wickets}</div>
        <div>Overs: {overs}</div>
      </div>

      {/* ✅ scoring buttons */}
      <div className="flex justify-around flex-wrap gap-2">
  {[0, 1, 2, 3, 4, 5, 6, "wide", "no"].map((val) => (
    <button
      key={val}
      onClick={() => changeRun(val)}
      disabled={inningsOver}   // ✅ only disable if innings over
      className="bg-amber-400 px-4 py-2 rounded-xl disabled:opacity-50"
    >
      {val}
    </button>
  ))}
  <button
    onClick={() => changeRun("W")}
    disabled={inningsOver}
    className="bg-red-500 text-white px-4 py-2 rounded-xl"
  >
    OUT
  </button>
</div>


      {/* ✅ new batsman input */}
      {wickets > 0 && (
        <div className="mt-4 flex gap-2 items-center justify-center">
          <select
            value={nextBatsman}
            onChange={(e) => setNextBatsman(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="">Select next batsman</option>
            {availableBatsmen.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      )}

      {/* ✅ bowler input */}
      {/* ✅ bowler input */}
{(!bowler || balls % 6 === 0) && (
  <div className="mt-4 flex gap-2 items-center justify-center">
    <select
      value={newBowler}
      onChange={(e) => setNewBowler(e.target.value)}
      className="border px-2 py-1 rounded"
    >
      <option value="">Select Bowler</option>
      {availableBowlers.map((p) => (
        <option key={p} value={p}>{p}</option>
      ))}
    </select>
    <button
      className="bg-blue-500 text-white px-3 py-1 rounded"
      onClick={() => {
        if (newBowler.trim()) {
          setBowler(newBowler.trim());   // ✅ properly set bowler
          setNewBowler("");
        }
      }}
    >
      Set Bowler
    </button>
  </div>
)}

    </div>
  );
};

export default SecondInnings;
