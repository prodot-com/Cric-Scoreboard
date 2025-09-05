import React, { use, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:9000/");

const LiveFirstInnings = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [matchData, setMatchData] = useState({})
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
  const [matchCompleted, setmatchCompleted]= useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [firstSummary, setFirstSummary] =useState({})
  const [secondSummary, setsecondSummary] =useState({})
  

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
        setMatchData(result)

        if (result.completed) {
          setmatchCompleted(true)
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


  const watchSummary = async()=>{
    try {
      setShowSummary(true)

      const res = await axios.get(`http://localhost:9000/user/fetchsummary/${id}`)
      console.log(res.data)
      setFirstSummary(res.data.firstSummary)
      setsecondSummary(res.data.secondSummary)

    } catch (error) {
      console.log(Error)
    }

  }

  useEffect(()=>{console.log("FirstSummary:", firstSummary);
  console.log("SecondSummary:", secondSummary)

  },[firstSummary, secondSummary])



  return (
    <div className="p-6 font-mono">
      {!matchCompleted ? (
        <div>
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
      </div>
        ):(
        
        <div className="flex flex-col gap-4 items-center mt-7 text-indigo-700">
          <h1 className="font-bold text-4xl">Match Completed</h1>

          <h2 className=" text-xl">{`${matchData.team1} vs ${matchData.team2}`}</h2>

          <button className="font-bold bg-amber-500 p-3 text-white rounded-xl" onClick={watchSummary}>Watch Summary</button>

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

{showSummary && (
  <div
    className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50"
    onClick={() => setShowSummary(false)}
  >
    <div
      className="flex flex-col w-[95%] sm:w-[85%] max-w-5xl bg-white border-2  
      backdrop-blur-lg shadow-xl p-4 sm:p-6 text-center max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-bold text-green-700 drop-shadow mb-4">
        Match Summary
      </h2>

      {/* Grid for innings (stack on mobile, side by side on larger screens) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* First Innings */}
        {firstSummary && (
          <div className="border rounded-xl p-3 sm:p-4 shadow-md bg-white/90">
            <h3 className="text-lg sm:text-xl font-bold text-indigo-700 mb-2">
              1st Innings: {firstSummary.battingTeam}
            </h3>
            <p className="font-semibold text-sm sm:text-base mb-1">
              {firstSummary.runs}/{firstSummary.wickets || 0} 
              ({firstSummary.totalOver} ov, {firstSummary.balls} balls)
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mb-2">
              Bowling: {firstSummary.bowlingTeam}
            </p>

            {/* Batting Table */}
            {firstSummary.batsman && Object.keys(firstSummary.batsman).length > 0 && (
              <div className="overflow-x-auto mb-3">
                <h4 className="text-left font-semibold text-sm sm:text-base">Batting</h4>
                <table className="w-full text-xs sm:text-sm border mt-1">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-1 text-left">Batsman</th>
                      <th className="p-1">R</th>
                      <th className="p-1">B</th>
                      <th className="p-1">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(firstSummary.batsman).map(([_, stats]) => (
                      <tr key={stats.name} className="border-b">
                        <td className="p-1 text-left">{stats.name}</td>
                        <td className="p-1">{stats.runs}</td>
                        <td className="p-1">{stats.balls}</td>
                        <td className="p-1">{stats.out ? "Out ❌" : "Not Out ✅"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Bowling Table */}
            {firstSummary.bowler && Object.keys(firstSummary.bowler).length > 0 && (
              <div className="overflow-x-auto">
                <h4 className="text-left font-semibold text-sm sm:text-base">Bowling</h4>
                <table className="w-full text-xs sm:text-sm border mt-1">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-1 text-left">Bowler</th>
                      <th className="p-1">Wkts</th>
                      <th className="p-1">Runs</th>
                      <th className="p-1">Balls</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(firstSummary.bowler).map(([_, stats]) => (
                      <tr key={stats.name} className="border-b">
                        <td className="p-1 text-left">{stats.name}</td>
                        <td className="p-1">{stats.wickets}</td>
                        <td className="p-1">{stats.runs}</td>
                        <td className="p-1">{stats.balls || "0"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Second Innings */}
        {secondSummary && (
          <div className="border rounded-xl p-3 sm:p-4 shadow-md bg-white/90">
            <h3 className="text-lg sm:text-xl font-bold text-indigo-700 mb-2">
              2nd Innings: {secondSummary.battingTeam}
            </h3>
            <p className="font-semibold text-sm sm:text-base mb-1">
              {secondSummary.runs}/{secondSummary.wickets || 0} 
              ({secondSummary.totalOver} ov, {secondSummary.balls} balls)
            </p>
            <p className="text-xs sm:text-sm text-gray-600 mb-2">
              Bowling: {secondSummary.bowlingTeam}
            </p>

            {/* Batting Table */}
            {secondSummary.batsman && Object.keys(secondSummary.batsman).length > 0 && (
              <div className="overflow-x-auto mb-3">
                <h4 className="text-left font-semibold text-sm sm:text-base">Batting</h4>
                <table className="w-full text-xs sm:text-sm border mt-1">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-1 text-left">Batsman</th>
                      <th className="p-1">R</th>
                      <th className="p-1">B</th>
                      <th className="p-1">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(secondSummary.batsman).map(([_, stats]) => (
                      <tr key={stats.name} className="border-b">
                        <td className="p-1 text-left">{stats.name}</td>
                        <td className="p-1">{stats.runs}</td>
                        <td className="p-1">{stats.balls}</td>
                        <td className="p-1">{stats.out ? "Out ❌" : "Not Out ✅"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Bowling Table */}
            {secondSummary.bowler && Object.keys(secondSummary.bowler).length > 0 && (
              <div className="overflow-x-auto">
                <h4 className="text-left font-semibold text-sm sm:text-base">Bowling</h4>
                <table className="w-full text-xs sm:text-sm border mt-1">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-1 text-left">Bowler</th>
                      <th className="p-1">Wkts</th>
                      <th className="p-1">Runs</th>
                      <th className="p-1">Balls</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(secondSummary.bowler).map(([_, stats]) => (
                      <tr key={stats.name} className="border-b">
                        <td className="p-1 text-left">{stats.name}</td>
                        <td className="p-1">{stats.wickets}</td>
                        <td className="p-1">{stats.runs}</td>
                        <td className="p-1">{stats.balls || "0"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        <div>
          <button onClick={()=>setShowSummary(false)} className="p-[3px] relative">
  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
  <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
    Close
  </div>
</button>
        </div>
      </div>

      {/* Match Result */}
      <div className="mt-4 sm:mt-6  pt-3 sm:pt-4">
        {secondSummary?.matchWinner && (
          <h3 className="text-lg sm:text-xl font-bold text-red-600">
            Winner: {secondSummary.matchWinner}
          </h3>
        )}
        {secondSummary?.matchResult && (
          <p className="text-gray-700 text-sm sm:text-base font-medium">
            {secondSummary.matchResult}
          </p>
        )}
      </div>
    </div>
  </div>
)}






    </div>
  );
};

export default LiveFirstInnings;
