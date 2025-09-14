import React, { useEffect, useState } from "react";
import { Backend_URL } from "../../Utilities/Constant.js";
import { useParams } from "react-router";
import { io } from "socket.io-client";
import axios from "axios";
import { Github, Linkedin, Mail, ArrowLeft, X, Loader2 } from 'lucide-react';

const socket = io(Backend_URL);

// --- Reusable UI Components ---

const Loader = ({ message = "Loading Match Data..." }) => (
    <div className="flex flex-col justify-center items-center h-full min-h-[300px] text-center">
        <Loader2 className="animate-spin text-amber-500 h-12 w-12 mb-4" />
        <p className="text-neutral-300 text-lg font-semibold">{message}</p>
    </div>
);

const StatBox = ({ label, value }) => (
  <div className="text-center">
    <p className='text-xl sm:text-2xl font-bold text-white'>{value || "0.00"}</p>
    <p className="text-xs sm:text-sm text-neutral-400 uppercase tracking-wider">{label}</p>
  </div>
);

const TimelineBall = ({ ball }) => {
    let style = "bg-neutral-700 border-neutral-600";
    let content = ball;

    if (typeof ball === 'object' && ball !== null) {
        content = ball.run;
        if (ball.type === "wicket") {
            style = "bg-red-600 border-red-500 text-white";
            content = "W";
        } else if (ball.run === 4) {
            style = "bg-blue-500 border-blue-400 text-white";
        } else if (ball.run === 6) {
            style = "bg-purple-600 border-purple-500 text-white";
        } else if (ball.type === "wide" || ball.type === "noball") {
            style = "bg-amber-500 border-amber-400 text-black";
            content = ball.run > 0 ? `${ball.run}${ball.type.charAt(0).toUpperCase()}` : ball.type.charAt(0).toUpperCase();
        }
    }

    return (
        <div className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full font-bold text-sm border-2 ${style} transition-transform duration-200 hover:scale-110`}>
            {content}
        </div>
    );
};

const MatchSummaryModal = ({ first, second, onClose }) => {
    const calculateSR = (r, b) => (b > 0 ? ((r / b) * 100).toFixed(2) : "0.00");
    const calculateEcon = (r, b) => (b > 0 ? (r / (b / 6)).toFixed(2) : "0.00");
    const renderOver = (b) => (b > 0 ? `${Math.floor(b / 6)}.${b % 6}` : "0.0");

    const renderInnings = (summary, title) => (
        <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-3 sm:p-4">
            <h3 className="text-lg sm:text-xl font-bold text-amber-500 mb-2">{title}: {summary.battingTeam}</h3>
            <p className="font-semibold text-sm sm:text-base mb-3 text-white">
                {summary.runs}/{summary.wickets || 0} ({renderOver(summary.balls)} Overs)
            </p>
            <div className="space-y-4">
                {/* Batting Table */}
                <div>
                    <h4 className="text-left font-semibold text-sm sm:text-base text-neutral-300 mb-1">Batting</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs sm:text-sm text-left">
                            <thead className="text-neutral-400"><tr className="border-b border-neutral-600"><th className="p-2 font-normal">Batter</th><th className="p-2 font-normal text-center">R</th><th className="p-2 font-normal text-center">B</th><th className="p-2 font-normal text-center">SR</th></tr></thead>
                            <tbody>
                                {Object.values(summary.batsman || {}).map((p, index) => (
                                    <tr key={`${p.name}-${index}`} className="border-b border-neutral-800 last:border-b-0 even:bg-white/5">
                                        <td className="p-2 font-semibold">{p.name} {p.out ? '' : '*'}</td>
                                        <td className="p-2 text-center">{p.runs}</td>
                                        <td className="p-2 text-center">{p.balls}</td>
                                        <td className="p-2 text-center">{calculateSR(p.runs, p.balls)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {/* Bowling Table */}
                <div>
                    <h4 className="text-left font-semibold text-sm sm:text-base text-neutral-300 mb-1">Bowling</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs sm:text-sm text-left">
                            <thead className="text-neutral-400"><tr className="border-b border-neutral-600"><th className="p-2 font-normal">Bowler</th><th className="p-2 font-normal text-center">O</th><th className="p-2 font-normal text-center">R</th><th className="p-2 font-normal text-center">W</th><th className="p-2 font-normal text-center">Econ</th></tr></thead>
                            <tbody>
                                {Object.values(summary.bowler || {}).map((p, index) => (
                                    <tr key={`${p.name}-${index}`} className="border-b border-neutral-800 last:border-b-0 even:bg-white/5">
                                        <td className="p-2 font-semibold">{p.name}</td>
                                        <td className="p-2 text-center">{renderOver(p.balls)}</td>
                                        <td className="p-2 text-center">{p.runs}</td>
                                        <td className="p-2 text-center">{p.wickets}</td>
                                        <td className="p-2 text-center">{calculateEcon(p.runs, p.balls)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/70 z-50 p-4" onClick={onClose}>
            <div className="w-full max-w-5xl bg-neutral-800/80 border-2 border-amber-600 rounded-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl sm:text-3xl font-bold text-amber-500">Match Summary</h2>
                    <button onClick={onClose} className="text-neutral-400 hover:text-white transition-colors"><X size={28} /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {first.battingTeam ? renderInnings(first, "1st Innings") : <div className="md:col-span-2"><Loader message="Loading Summary..."/></div>}
                    {second.battingTeam && renderInnings(second, "2nd Innings")}
                </div>
                <div className="mt-6 text-center pt-4 border-t border-neutral-700">
                    <h3 className="text-lg sm:text-xl font-bold text-green-400">{second?.matchWinner}</h3>
                    <p className="text-neutral-300 text-sm sm:text-base font-medium">{second?.matchResult}</p>
                </div>
            </div>
        </div>
    );
};


// --- Main Page Component ---

const LiveMatchPage = () => {
    const { id } = useParams();

    const [matchState, setMatchState] = useState({
        battingTeam: "", bowlingTeam: "", score: "0/0", overs: "0.0",
        inning: 1, target: null, crr: "0.00", rrr: "0.00", striker: "", nonStriker: "",
        bowler: "", batsmanStats: {}, bowlerStats: {}, commentary: "Connecting to the match...",
        timeline: [], isFreeHit: false, bowlingStarted: false, matchCompleted: false,
        totalOvers: 0, value: "new",
    });
    
    // States for loading indicators
    const [pageLoading, setPageLoading] = useState(true);
    const [summaryLoading, setSummaryLoading] = useState(false);

    const [matchResult, setMatchResult] = useState("");
    const [showSummary, setShowSummary] = useState(false);
    const [firstSummary, setFirstSummary] = useState({});
    const [secondSummary, setSecondSummary] = useState({});

    useEffect(() => {
        socket.emit("joinMatch", id);

        const getInitialDetails = async () => {
            try {
                const response = await axios.get(`${Backend_URL}user/one/${id}`);
                const result = response.data.result;
                setMatchState(prev => ({ ...prev, totalOvers: result.over }));
                if (result.completed) {
                    setMatchState(prev => ({ ...prev, matchCompleted: true }));
                    fetchSummary(true);
                }
            } catch (error) {
                console.log("Failed to fetch initial match details", error);
                setMatchState(prev => ({ ...prev, commentary: "Error loading match data." }));
            } finally {
                setPageLoading(false);
            }
        };
        getInitialDetails();
    }, [id]);

    useEffect(() => {
        const handleScoreUpdate = (data) => {
            setMatchState(prev => ({
                ...prev,
                battingTeam: data.battingTeam, bowlingTeam: data.bowlingTeam,
                score: `${data.runs || 0}/${data.wickets || 0}`, overs: data.overs || "0.0",
                inning: data.inning, target: data.target,
                crr: data.CRR || "0.00", rrr: data.RRR || "0.00",
                striker: data.striker || "", bowler: data.bowler || "",
                batsmanStats: data.batsmanStats || {}, bowlerStats: data.bowlerStats || {},
                commentary: data.commentry || "", timeline: Array.isArray(data.timeLine) ? data.timeLine : [],
                isFreeHit: data.freeHit || false, bowlingStarted: data.bowlingStarted || false,
                matchCompleted: (data.iningsOver && data.inning === 2) || prev.matchCompleted,
                value: data.value || "new"
            }));
        };
        socket.on("scoreUpdate", handleScoreUpdate);
        return () => socket.off("scoreUpdate", handleScoreUpdate);
    }, []);


    // --- Calculation Helpers ---
    const calculateStrikeRate = (runs, balls) => (balls > 0 ? ((runs / balls) * 100).toFixed(2) : "0.00");
    const calculateEconomy = (runs, balls) => (balls > 0 ? (runs / (balls / 6)).toFixed(2) : "0.00");
    const renderOver = (balls) => (balls > 0 ? `${Math.floor(balls / 6)}.${balls % 6}` : "0.0");

    useEffect(() => {
        if (matchState.matchCompleted) {
            fetchSummary(true);
        }
    }, [matchState.matchCompleted]);

    const fetchSummary = async (autoShow = false) => {
        if (!autoShow) setShowSummary(true);
        setSummaryLoading(true);
        try {
            const res = await axios.get(`${Backend_URL}user/fetchsummary/${id}`);
            setFirstSummary(res.data.firstSummary);
            setSecondSummary(res.data.secondSummary);
            if (res.data.secondSummary.matchWinner) {
                setMatchResult(`${res.data.secondSummary.matchWinner} - ${res.data.secondSummary.matchResult}`);
            }
        } catch (error) {
            console.log("Failed to fetch summary", error);
            if (!autoShow) setShowSummary(false);
        } finally {
            setSummaryLoading(false);
        }
    };

    const routeChange = (path) => { window.location.href = path; };

    const { battingTeam, bowlingTeam, score, overs, totalOvers, inning, target, crr, rrr, striker, bowler, batsmanStats, bowlerStats, commentary, timeline, matchCompleted, bowlingStarted } = matchState;

    return (
        <div className='font-mono bg-neutral-950 text-white min-h-screen w-full flex flex-col'>
            {showSummary && <MatchSummaryModal first={firstSummary} second={secondSummary} onClose={() => setShowSummary(false)} />}

            <header className="fixed top-0 sm:top-5 left-0 right-0 flex justify-center z-40 pointer-events-none">
                <div className="border-b sm:border-2 border-amber-600 bg-neutral-900/80 w-full sm:w-[95%] sm:max-w-[1330px] flex justify-between items-center px-4 sm:px-10 py-4 sm:rounded-2xl backdrop-blur-md shadow-2xl pointer-events-auto">
                    <h1 onClick={() => routeChange('/')} className="text-xl sm:text-3xl font-bold text-white cursor-pointer hover:text-amber-500 transition-colors">CricScoreBoard</h1>
                    <div className="flex items-center space-x-2 sm:space-x-4">
                        <button onClick={() => routeChange('/matches')} className="flex items-center space-x-2 text-neutral-300 hover:text-amber-500 transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                            <span className="hidden sm:inline">All Matches</span>
                        </button>
                        <div className="flex items-center space-x-3 sm:space-x-6">
                            <a href="https://github.com/prodot-com/Cric-Scoreboard" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors"><Github className="w-5 h-5 sm:w-6 sm:h-6" /></a>
                            <a href="https://www.linkedin.com/in/ghoshprobal/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors"><Linkedin className="w-5 h-5 sm:w-6 sm:h-6" /></a>
                            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=xprobal52@gmail.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors"><Mail className="w-5 h-5 sm:w-6 sm:h-6" /></a>
                        </div>
                    </div>
                </div>
            </header>

            <main className='w-full relative pt-24 sm:pt-32 pb-10 px-4 flex-grow'>
                <div className="absolute inset-0 z-0 opacity-80" style={{ backgroundImage: `radial-gradient(circle at 50% 0%, rgba(217, 119, 6, 0.3) 0%, transparent 50%), radial-gradient(circle at 10% 20%, rgba(217, 119, 6, 0.15) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(217, 119, 6, 0.15) 0%, transparent 40%)` }} />
                
                <div className='relative z-10 max-w-5xl mx-auto'>
                    {pageLoading ? <Loader /> : (
                        <>
                            <div className="bg-neutral-900/80 backdrop-blur-md border border-neutral-700 p-4 sm:p-6 rounded-2xl shadow-lg">
                                <div className="text-center mb-4">
                                    <p className="text-amber-500 font-bold tracking-widest uppercase text-sm">
                                        {inning === 1 ? "1st Innings" : "2nd Innings"}
                                    </p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="text-left w-1/3"><p className="text-sm text-neutral-400 truncate">{battingTeam}</p><p className="text-3xl sm:text-5xl font-bold text-white">{score}</p></div>
                                    <div className="text-center w-1/3"><p className="text-lg sm:text-2xl font-bold text-amber-500">Overs</p><p className="text-lg sm:text-2xl">{overs} <span className="text-base text-neutral-400">({totalOvers})</span></p></div>
                                    <div className="text-right w-1/3"><p className="text-sm text-neutral-400 truncate">{bowlingTeam}</p>{inning === 2 && target && <p className="text-lg sm:text-2xl font-bold">Target <span className="text-amber-500">{target}</span></p>}</div>
                                </div>
                                <div className="border-t border-neutral-700 mt-4 pt-4 flex justify-around">
                                    <StatBox label="CRR" value={crr} />
                                    {inning === 2 && bowlingStarted && <StatBox label="RRR" value={rrr} />}
                                </div>
                            </div>

                            {!matchCompleted && (
                                <>
                                    <div className="mt-6 text-center bg-neutral-900/50 p-3 rounded-lg min-h-[70px] flex items-center justify-center">
                                        <p className={`py-2 px-4 font-semibold transition-all duration-300 border-2 rounded-lg text-center
                                            ${matchState.value === "W" ? "bg-red-600 border-white text-white animate-bounce"
                                            : matchState.value === 4 ? "bg-blue-600 border-blue-700 text-white"
                                            : matchState.value === 6 ? "bg-green-600 border-green-700 text-white animate-pulse"
                                            : matchState.value === "wide" || matchState.value === "no" ? "bg-amber-500 border-amber-600 text-black"
                                            : "bg-neutral-800 border-neutral-600 text-gray-200"
                                            }`}>
                                            {commentary}
                                        </p>
                                    </div>

                                    <div className="mt-6 flex items-center justify-center flex-wrap gap-2">
                                        {timeline.slice(-6).map((ball, index) => <TimelineBall key={index} ball={ball} />)}
                                    </div>

                                    <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Batting Scorecard */}
                                        <div className="bg-neutral-900/50 p-4 rounded-lg">
                                            <h3 className="font-bold text-lg mb-2 text-amber-500 border-b border-neutral-700 pb-2">Batting</h3>
                                            <div className="overflow-x-auto min-h-[60px]">
                                                <table className="w-full text-sm sm:text-base">
                                                    <thead><tr className="border-b border-neutral-700"><th className="text-left p-2 font-semibold text-neutral-400">Batter</th><th className="text-center p-2 font-semibold text-neutral-400">R</th><th className="text-center p-2 font-semibold text-neutral-400">B</th><th className="text-center p-2 font-semibold text-neutral-400">SR</th></tr></thead>
                                                    <tbody>
                                                        {Object.entries(batsmanStats).filter(([, stats]) => !stats.out).map(([name, stats]) => (
                                                            <tr key={name} className={`border-b border-neutral-800 last:border-b-0 even:bg-white/5 ${name === striker ? "bg-amber-600/20" : ""}`}>
                                                                <td className="p-2 font-semibold">{name}{name === striker ? " *" : ""}</td>
                                                                <td className="p-2 text-center font-bold">{stats.runs}</td>
                                                                <td className="p-2 text-center">{stats.balls}</td>
                                                                <td className="p-2 text-center">{calculateStrikeRate(stats.runs, stats.balls)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        {/* Bowling Scorecard */}
                                        <div className="bg-neutral-900/50 p-4 rounded-lg">
                                            <h3 className="font-bold text-lg mb-2 text-amber-500 border-b border-neutral-700 pb-2">Bowling</h3>
                                            <div className="overflow-x-auto min-h-[60px]">
                                                <table className="w-full text-sm sm:text-base">
                                                    <thead><tr className="border-b border-neutral-700"><th className="text-left p-2 font-semibold text-neutral-400">Bowler</th><th className="text-center p-2 font-semibold text-neutral-400">O</th><th className="text-center p-2 font-semibold text-neutral-400">R</th><th className="text-center p-2 font-semibold text-neutral-400">W</th><th className="text-center p-2 font-semibold text-neutral-400">Econ</th></tr></thead>
                                                    <tbody>
                                                        {Object.entries(bowlerStats).map(([name, stats]) => (
                                                            <tr key={name} className={`border-b border-neutral-800 last:border-b-0 even:bg-white/5 ${name === bowler ? "bg-amber-600/20" : ""}`}>
                                                                <td className="p-2 font-semibold">{name}{name === bowler ? " *" : ""}</td>
                                                                <td className="p-2 text-center">{renderOver(stats.balls)}</td>
                                                                <td className="p-2 text-center">{stats.runs}</td>
                                                                <td className="p-2 text-center font-bold">{stats.wickets}</td>
                                                                <td className="p-2 text-center">{calculateEconomy(stats.runs, stats.balls)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                            
                            {matchCompleted && (
                                <div className="mt-6 text-center bg-neutral-900/50 p-6 rounded-lg">
                                    <p className="text-green-400 font-bold text-xl sm:text-2xl">{matchResult}</p>
                                    <button onClick={() => fetchSummary(false)} disabled={summaryLoading} className="mt-4 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-800 disabled:cursor-wait text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-colors inline-flex items-center space-x-2">
                                        {summaryLoading && <Loader2 className="w-4 h-4 animate-spin"/>}
                                        <span>{summaryLoading ? "Loading..." : "View Full Summary"}</span>
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default LiveMatchPage;