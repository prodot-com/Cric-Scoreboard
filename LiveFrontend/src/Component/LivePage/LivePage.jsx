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

  const [striker, setStriker] = useState("");
  const [nonStriker, setNonStriker] = useState("");
  const [bowler, setBowler] = useState("");

  const [batsmanStats, setBatsmanStats] = useState({});
  const [bowlerStats, setBowlerStats] = useState({});

  // join match room
  useEffect(() => {
    socket.emit("joinMatch", id);
  }, [id]);

  // fetch match details once
  useEffect(() => {
    const getDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9000/user/one/${id}`
        );
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

      setStriker(data.striker || "");
      setNonStriker(data.nonStriker || "");
      setBowler(data.bowler || "");

      setBatsmanStats(data.batsmanStats || {});
      setBowlerStats(data.bowlerStats || {});

      const liveFirstInningsData = {
        battingTeam: data.battingTeam,
        bowlingTeam: data.bowlingTeam,
        runs: data.runs,
        balls: data.balls,
        wickets: data.wickets,
      };

      localStorage.setItem(
        "liveFirstInningsData",
        JSON.stringify(liveFirstInningsData)
      );
    };

    socket.on("scoreUpdate", handleMessage);
    return () => socket.off("scoreUpdate", handleMessage);
  }, [navigate]);

  // overs calculation
  useEffect(() => {
    const over = Math.floor(totalBalls / 6);
    const balls = totalBalls % 6;
    setOvers(`${over}.${balls}`);
  }, [totalBalls]);

  return (
    <div>
      {bowlingStarted ? (
        <div className="text-3xl font-bold flex flex-col justify-around gap-7 mt-7 m-4">
          <div className="flex justify-around">
            <div>{battingTeam}</div>
            <div>{`${currentRun}/${currentWicket}`}</div>
            <div>{`Balls: ${totalBalls} (${overs})`}</div>
            <div>{bowlingTeam}</div>
          </div>

          <div className="text-3xl font-bold flex justify-between gap-7 mt-7">
            <div>
              <h1>
                {striker && batsmanStats[striker] ? (
                  <>
                    {striker}: {batsmanStats[striker].runs} -{" "}
                    {batsmanStats[striker].balls}
                    {batsmanStats[striker].out ? <div>Out</div> : null}
                  </>
                ) : (
                  <>{striker}</>
                )}
              </h1>

              <h1>
                {nonStriker && batsmanStats[nonStriker] ? (
                  <>
                    {nonStriker}: {batsmanStats[nonStriker].runs} -{" "}
                    {batsmanStats[nonStriker].balls}
                    {batsmanStats[nonStriker].out ? <div>Out</div> : null}
                  </>
                ) : (
                  <>{nonStriker}</>
                )}
              </h1>
            </div>

            {bowler && bowlerStats[bowler] && (
              <div>
                <h1>
                  {bowler}: {bowlerStats[bowler].wickets || 0}-
                  {bowlerStats[bowler].runs || 0}
                </h1>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-4xl font-bold mt-12 text-indigo-700">
          <h2>{`Team1: ${battingTeam}`}</h2>
          <h2>{`Team2: ${bowlingTeam}`}</h2>
          <h3>Match not yet started</h3>
          <h2 className="text-amber-500 text-2xl mt-7">{`Team ${tossWinner} choose to ${decision} first`}</h2>
        </div>
      )}

      {iningsOver && (
        <div className="flex flex-col items-center mt-9 text-indigo-700">
          <h3>Innings Over</h3>
          <h2>{`Target: ${currentRun + 1}`}</h2>
          <h2>Second Innings will start soon</h2>
        </div>
      )}
    </div>
  );
};

export default LiveFirstInnings;
