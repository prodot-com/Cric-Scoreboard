import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { io } from "socket.io-client";
import axios from 'axios'

const LiveSecondInnings = () => {
  const { id } = useParams(); // matchId from URL
  const socketRef = useRef(null);

  const [score, setScore] = useState({
    battingTeam: "",
    bowlingTeam: "",
    runs: 0,
    wickets: 0,
    balls: 0,
    overs: "0.0",
    target: null,
    striker: "",
    nonStriker: "",
    bowler: "",
    batsmanStats: {},
    bowlerStats: {},
    inningsOver: false,
  });
  // const [battingTeam, setBattingTeam] = useState('')
  // const [bowlingTeam, setBowlingTeam] = useState('')
  // const [target, setTarget] = useState('')

  const getFirstSummary = async () => {
    try {
      const res = await axios.get(`http://localhost:9000/user/fetchFirst/${id}`);
      const summary = res.data.data.firstSummary
      setScore((prev) => ({
        ...prev,
        battingTeam: summary.bowlingTeam,
        bowlingTeam: summary.battingTeam,
        target: summary.target,
      }));

      console.log(summary);
    } catch (err) {
      console.error("Error fetching match:", err);
    }
  };

  useEffect(()=>{

    getFirstSummary()

  },[])

  useEffect(() => {
    socketRef.current = io("http://localhost:9000", {
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to server:", socketRef.current.id);
      socketRef.current.emit("joinMatch", id);
    });

    socketRef.current.on("scoreUpdate", (data) => {
      console.log("Received score update:", data);

      const overs = `${Math.floor(data.balls / 6)}.${data.balls % 6}`;

      setScore((prev) => ({
        ...prev,
        battingTeam: data.battingTeam,
        bowlingTeam: data.bowlingTeam,
        runs: data.runs,
        wickets: data.wickets,
        balls: data.balls,
        overs,
        target: data.target,
        striker: data.striker,
        nonStriker: data.nonStriker,
        bowler: data.bowler,
        batsmanStats: data.batsmanStats || {},
        bowlerStats: data.bowlerStats || {},
        inningsOver: data.inningsOver,
      }));
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [id]);

  return (
    <div className="font-mono p-5">
      <h1 className="text-3xl font-bold text-center mb-5">
        {score.battingTeam} vs {score.bowlingTeam}
      </h1>

      <div className="flex justify-around text-2xl font-bold mb-5">
        <div>Score: {score.runs}/{score.wickets}</div>
        <div>Overs: {score.overs}</div>
      </div>

      {score.target && (
        <h2 className="text-xl font-bold text-center mb-5">
          Target: {score.target} | Required: {Math.max(0, score.target - score.runs)}
        </h2>
      )}

      <div className="flex justify-around mt-5">
        <div>
          <h2 className="font-bold text-xl">Batsmen</h2>
          <p>
            {score.striker || "-"} :{" "}
            {score.batsmanStats[score.striker]?.runs || 0} (
            {score.batsmanStats[score.striker]?.balls || 0}){" "}
            {score.batsmanStats[score.striker]?.out ? "out" : "not out"}
          </p>
          <p>
            {score.nonStriker || "-"} :{" "}
            {score.batsmanStats[score.nonStriker]?.runs || 0} (
            {score.batsmanStats[score.nonStriker]?.balls || 0}){" "}
            {score.batsmanStats[score.nonStriker]?.out ? "out" : "not out"}
          </p>
        </div>

        <div>
          <h2 className="font-bold text-xl">Bowler</h2>
          <p>{score.bowler || "-"}</p>
        </div>
      </div>

      {score.inningsOver && (
        <h2 className="text-red-600 font-bold text-2xl text-center mt-5">
          Innings Over
        </h2>
      )}
    </div>
  );
};

export default LiveSecondInnings;
