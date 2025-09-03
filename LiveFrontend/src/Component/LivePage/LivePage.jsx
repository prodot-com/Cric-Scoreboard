import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:9000/");

const LiveFirstInnings = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [battingTeam, setBattingTeam] = useState("Loading...");
  const [bowlingTeam, setBowlingTeam] = useState("Loading...");
  const [currentRun, setCurrentRun] = useState(0);
  const [currentWicket, setCurrentWicket] = useState(0);
  const [totalBalls, setTotalBalls] = useState(0);
  const [overs, setOvers] = useState("0.0");

  const [iningsOver, setIningsOver] = useState(false);
  const [secondInningsStart, setSecondInningsStart] = useState(false);
  const [bowlingStarted, setBowlingStarted] = useState(false);

  const [tossWinner, setTossWinner] = useState("...");
  const [decision, setDecision] = useState("...");
  const [inning, setInning] = useState(1)

  const [striker, setStriker] = useState("");
  const [nonStriker, setNonStriker] = useState("");
  const [bowler, setBowler] = useState("");

  const [batsmanStats, setBatsmanStats] = useState({});
  const [bowlerStats, setBowlerStats] = useState({});

  const [target, setTarget] = useState(null);
  const [winner, setWinner] = useState(null);
  const [matchResult, setMatchResult] = useState(null);


  // join match room
  useEffect(() => {
    socket.emit("joinMatch", id);
  }, [id]);

  // fetch match details
  useEffect(() => {
    const getDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:9000/user/one/${id}`);
        const result = response.data.result;

        if (result.completed) {
          navigate(`/live-second/${id}`, { replace: true });
        }

        setBattingTeam(result.team1);
        setBowlingTeam(result.team2);
        setTossWinner(result.tossWinner);
        setDecision(result.decision.toLowerCase());
      } catch (error) {
        console.log(error);
      }
    };

    getDetails();
  }, [id, navigate]);

  // restore from localStorage
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("liveFirstInningsData"));
    if (data) {
      setBattingTeam(data.battingTeam || "Loading...");
      setBowlingTeam(data.bowlingTeam || "Loading...");
      setCurrentRun(data.runs || 0);
      setCurrentWicket(data.wickets || 0);
      setTotalBalls(data.balls || 0);
    }
  }, []);

  // socket listener
  useEffect(() => {
  const handleMessage = (data) => {
    console.log("LIVE PAGE UPDATE:", data);

    setBattingTeam(data.battingTeam);
    setBowlingTeam(data.bowlingTeam);
    setCurrentRun(data.runs || 0);
    setCurrentWicket(data.wickets || 0);
    setTotalBalls(data.balls || 0);
    setIningsOver(data.iningsOver || false);
    setSecondInningsStart(data.secondInningsStart || false);
    setBowlingStarted(data.bowlingStarted || false);
    setInning(data.inning || 1);

    setStriker(data.striker || "");
    setNonStriker(data.nonStriker || "");
    setBowler(data.bowler || "");

    setBatsmanStats(data.batsmanStats || {});
    setBowlerStats(data.bowlerStats || {});

    if (data.iningsOver && data.inning === 1) {
      setTarget((data.runs || 0) + 1);
    }

    // Winning logic for second innings
    if (data.inning === 2 && data.bowlingStarted && target) {
      if (data.runs >= target) {
        setWinner(data.battingTeam); // chasing team won
      } else if (data.iningsOver) {
        if (data.runs < target - 1) {
          setWinner(data.bowlingTeam); // defending team won
        } else if (data.runs === target - 1) {
          setWinner("Match Tied");
        }
      }
    }

    // const liveFirstInningsData = {
    //   battingTeam: data.battingTeam,
    //   bowlingTeam: data.bowlingTeam,
    //   runs: data.runs,
    //   balls: data.balls,
    //   wickets: data.wickets,
    // };
    // localStorage.setItem(
    //   "liveFirstInningsData",
    //   JSON.stringify(liveFirstInningsData)
    // );
  };

  socket.on("scoreUpdate", handleMessage);
  return () => socket.off("scoreUpdate", handleMessage);
}, [navigate, target]);

useEffect(() => {
  if (inning === 2 && bowlingStarted) {
    // Case 1: Batting team successfully chased target
    if (currentRun >= target) {
      const wicketsRemaining = 10 - currentWicket;
      setMatchResult(`${battingTeam} won by ${wicketsRemaining} wicket${wicketsRemaining !== 1 ? "s" : ""}`);
    }
    // Case 2: All wickets lost or overs finished
    else if (currentWicket === 10 || iningsOver) {
      const runsDefended = target - currentRun;
      setMatchResult(`${bowlingTeam} won by ${runsDefended} run${runsDefended !== 1 ? "s" : ""}`);
    }
  }
}, [currentRun, currentWicket, iningsOver, inning, bowlingStarted, target, battingTeam, bowlingTeam]);



  // overs calculation
  useEffect(() => {
    const over = Math.floor(totalBalls / 6);
    const balls = totalBalls % 6;
    setOvers(`${over}.${balls}`);
  }, [totalBalls]);

  return (
    <div className="p-6 font-mono">
      {bowlingStarted && inning === 1 ? (
        <div className="text-3xl font-bold flex flex-col gap-6">
          {/* Scoreboard */}
          <div className="flex justify-around">
            <div>{battingTeam}</div>
            <div>{`${currentRun}/${currentWicket}`}</div>
            <div>{`Balls: ${totalBalls} (${overs})`}</div>
            <div>{bowlingTeam}</div>
          </div>

          {/* Batsman Summary */}
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-2">Batting</h2>
            {Object.keys(batsmanStats).length > 0 ? (
              Object.entries(batsmanStats).filter(([name, stats]) => !stats.out)
              .map(([name, stats]) => (
                <div key={name} className="flex justify-between text-lg">
                  <span>
                    {name} {name === striker ? "*" : ""}
                  </span>
                  <span>
                    {stats.runs} ({stats.balls})
                  </span>
                </div>
              ))
            ) : (
              <p>No batting data yet</p>
            )}
          </div>

          {/* Bowler Summary */}
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-2">Bowling</h2>
            {Object.keys(bowlerStats).length > 0 ? (
              
              Object.entries(bowlerStats)
              .filter(([name])=> name === bowler)
              .map(([name, stats]) => (
                <div key={name} className="flex justify-between text-lg">
                  <span>{name}</span>
                  <span>
                    {stats.wickets}-{stats.runs} 
                  </span>
                </div>
              ))
            ) : (
              <p>No bowling data yet</p>
            )}
          </div>
        </div>
      ) : inning === 2 ? (

      <div>

          {!bowlingStarted ? (
            <div>

              <h1>Second Innings Will start shortly.</h1>
              <h2>Target: {target}</h2>

            </div>
            )
            :(
            <div className="text-3xl font-bold flex flex-col gap-6">
          {/* Scoreboard */}
          <div className="flex justify-around">
            <div>{battingTeam}</div>
            <div>{`${currentRun}/${currentWicket}`}</div>
            <div>{`Balls: ${totalBalls} (${overs})`}</div>
            <div>{bowlingTeam}</div>
          </div>

          {/* Batsman Summary */}
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-2">Batting</h2>
            {Object.keys(batsmanStats).length > 0 ? (
              Object.entries(batsmanStats).filter(([name, stats]) => !stats.out)
              .map(([name, stats]) => (
                <div key={name} className="flex justify-between text-lg">
                  <span>
                    {name} {name === striker ? "*" : ""}
                  </span>
                  <span>
                    {stats.runs} ({stats.balls})
                  </span>
                </div>
              ))
            ) : (
              <p>No batting data yet</p>
            )}
          </div>

          {/* Bowler Summary */}
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-2">Bowling</h2>
            {Object.keys(bowlerStats).length > 0 ? (
              
              Object.entries(bowlerStats)
              .filter(([name])=> name === bowler)
              .map(([name, stats]) => (
                <div key={name} className="flex justify-between text-lg">
                  <span>{name}</span>
                  <span>
                    {stats.wickets}-{stats.runs} 
                  </span>
                </div>
              ))
            ) : (
              <p>No bowling data yet</p>
            )}
          </div>
        </div>
            )}

      </div>

    )
      : (
        <div className="flex flex-col items-center justify-center text-4xl font-bold mt-12 text-indigo-700">
          <h2>{`Team1: ${battingTeam}`}</h2>
          <h2>{`Team2: ${bowlingTeam}`}</h2>
          <h3>Match not yet started</h3>
          <h2 className="text-amber-500 text-2xl mt-7">
            {`Team ${tossWinner} choose to ${decision} first`}
          </h2>
        </div>
      )}

      {/* Innings Over / Result */}
      {iningsOver && (
        <div className="flex flex-col items-center mt-9 text-indigo-700">
          <h3 className="font-bold text-2xl">Innings Over</h3>
          {winner && <h2 className="mt-3">Winner: {winner}</h2>}
        </div>
      )}

      {matchResult && (
  <div className="flex flex-col items-center mt-9 text-green-700 text-2xl font-bold">
    <h2>🏆 {matchResult}</h2>
  </div>
)}


    </div>
  );
};

export default LiveFirstInnings;
