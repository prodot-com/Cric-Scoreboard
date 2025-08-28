import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { io } from "socket.io-client";

const LiveSecondInnings = () => {
  const { id } = useParams();
  const socketRef = useRef(null);

  const [score, setScore] = useState({
    battingTeam: "",
    bowlingTeam: "",
    runs: 0,
    wickets: 0,
    balls: 0,
    striker: "",
    nonStriker: "",
    bowler: "",
    batsmanStats: {},
    bowlerStats: {},
    inningsOver: false,
    target: 0,
    winner: null,
  });

  // overs text
  const oversText = `${Math.floor(score.balls / 6)}.${score.balls % 6}`;

  useEffect(() => {
    socketRef.current = io("http://localhost:9000", { transports: ["websocket"] });

    socketRef.current.on("connect", () => {
      socketRef.current.emit("joinMatch", id);
    });

    socketRef.current.on("scoreUpdate", ({ matchId, data }) => {
      console.log("Received scoreUpdate:", data);
      if (matchId === id) {
        setScore((prev) => ({ ...prev, ...data }));
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [id]);

  const ballsLeft = score.target
    ? Math.max(0, score.target * 6 - score.balls)
    : null;
  const runsRequired =
    score.target !== 0 ? Math.max(0, score.target - score.runs) : null;

  return (
    <div className="font-mono p-5">
      <h1 className="text-2xl font-bold text-center mb-1">
        Second Innings Live Score
      </h1>
      <p className="text-center text-sm opacity-70 mb-4">
        {score.battingTeam && score.bowlingTeam
          ? `${score.battingTeam} vs ${score.bowlingTeam}`
          : ""}
      </p>

      {/* Scoreboard */}
      <div className="flex justify-around text-xl font-bold mb-3">
        <div>
          {score.runs}/{score.wickets}
        </div>
        <div>
          Overs: {oversText}
        </div>
      </div>

      {/* Target & Requirement */}
      {score.target > 0 && !score.winner && (
        <div className="text-center mb-4">
          <span className="font-semibold">Target:</span> {score.target}{" "}
          {runsRequired !== null && (
            <span className="ml-3">
              • Need <b>{runsRequired}</b> off <b>{ballsLeft}</b>
            </span>
          )}
        </div>
      )}

      {/* Winner */}
      {score.winner && (
        <div className="text-center text-2xl font-bold mt-2 mb-4 text-green-600">
          {score.winner}
        </div>
      )}

      {/* Current Striker & Non-striker */}
      {(score.striker || score.nonStriker) && (
        <div className="text-center mb-4">
          <p>
            <b>Striker:</b> {score.striker || "-"} |{" "}
            <b>Non-Striker:</b> {score.nonStriker || "-"}
          </p>
        </div>
      )}

      {/* Batsman Table */}
      {Object.keys(score.batsmanStats).length > 0 && (
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
              {Object.entries(score.batsmanStats).map(([name, stats]) => (
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

      {/* Bowler Table */}
      {Object.keys(score.bowlerStats).length > 0 && (
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
              {Object.entries(score.bowlerStats).map(([name, stats]) => (
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

      {score.inningsOver && !score.winner && (
        <h2 className="text-red-600 text-lg font-bold text-center mt-4">
          Innings Over
        </h2>
      )}
    </div>
  );
};

export default LiveSecondInnings;
