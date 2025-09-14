import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Github, Linkedin, Mail, PlusCircle, Clock, Loader2, Trophy, BarChartHorizontalBig } from 'lucide-react';
import { Backend_URL } from '../../Utilities/Constant';

// --- Reusable UI Components ---

const LiveTime = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="hidden sm:flex items-center space-x-2 text-neutral-400">
        <Clock className="w-5 h-5" />
        <span>
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
    </div>
  );
};

const Loader = ({ message = "Loading Matches..." }) => (
    <div className="flex flex-col justify-center items-center h-full min-h-[300px] text-center">
        <Loader2 className="animate-spin text-amber-500 h-12 w-12 mb-4" />
        <p className="text-neutral-300 text-lg font-semibold">{message}</p>
    </div>
);

const MatchCard = ({ match, onClick }) => {
    const getWinner = (match) => {
        if (!match.completed || !match.firstSummary || !match.secondSummary) return '';
        if (match.secondSummary.runs > match.firstSummary.runs) {
            return `${match.secondSummary.battingTeam} won`;
        }
        if (match.firstSummary.runs > match.secondSummary.runs) {
            return `${match.firstSummary.battingTeam} won`;
        }
        return 'Match Tied';
    };

    const isLive = !match.completed;

    return (
        <div 
            onClick={onClick} 
            className={`group relative overflow-hidden bg-neutral-900/60 backdrop-blur-md border p-6 rounded-2xl shadow-lg 
                      transition-all duration-300 cursor-pointer
                      ${isLive 
                        ? 'border-amber-500/30 hover:border-amber-400 hover:scale-[1.03] hover:shadow-2xl hover:shadow-amber-500/20'
                        : 'border-neutral-700 hover:bg-neutral-800/80 hover:border-neutral-600'
                      }`}
            style={{
                backgroundImage: `radial-gradient(circle at 20% 20%, rgba(255,255,255,0.02), transparent), 
                                radial-gradient(circle at 80% 80%, rgba(255,255,255,0.02), transparent)`
            }}
        >
            <div className='flex justify-between items-center mb-4'>
                <h3 className='text-sm text-neutral-400'>{`By: ${match.name}`}</h3>
                {isLive ? (
                    <div className="flex items-center space-x-2">
                        <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span></span>
                        <span className="text-red-500 text-sm font-bold">LIVE</span>
                    </div>
                ) : (
                    <span className="text-green-500 text-sm font-bold">COMPLETED</span>
                )}
            </div>

            <div className='flex flex-col items-center text-center space-y-2'>
                {match.completed && match.firstSummary && match.secondSummary ? (
                    <div className='w-full space-y-1'>
                        <div className="w-full flex justify-between items-baseline"><h2 className='text-lg sm:text-xl font-bold text-white truncate'>{match.firstSummary.battingTeam}</h2><p className="text-base sm:text-lg font-semibold text-neutral-300">{match.firstSummary.runs}/{match.firstSummary.wickets}</p></div>
                        <div className="w-full flex justify-between items-baseline"><h2 className='text-lg sm:text-xl font-bold text-white truncate'>{match.secondSummary.battingTeam}</h2><p className="text-base sm:text-lg font-semibold text-neutral-300">{match.secondSummary.runs}/{match.secondSummary.wickets}</p></div>
                    </div>
                ) : (
                    <>
                        <h2 className='text-xl sm:text-2xl font-bold text-white'>{match.team1}</h2>
                        <h1 className='text-lg sm:text-xl font-medium text-amber-500'>vs</h1>
                        <h2 className='text-xl sm:text-2xl font-bold text-white'>{match.team2}</h2>
                    </>
                )}
            </div>
            
            <div className="text-center mt-4 h-6">
                {isLive ? (
                    <div className="font-semibold text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Watch Now &rarr;
                    </div>
                ) : (
                   <p className="text-sm text-green-400 font-bold flex items-center justify-center gap-2">
                       <Trophy size={16}/> {getWinner(match)}
                   </p>
                )}
            </div>
        </div>
    );
};


// --- Main Page Component ---

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = `${Backend_URL}user/get`;

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await axios.get(API_URL);
        const sortedMatches = response.data.sort((a, b) => a.completed - b.completed);
        setMatches(sortedMatches);
      } catch (err) {
        console.log("Something Went Wrong", err);
        setError("Failed to fetch matches. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [API_URL]);

  const routeChange = (path) => {
    window.location.href = path;
  };

  return (
    <div className='font-mono bg-neutral-950 text-white min-h-screen w-full flex flex-col'>
      {/* 🔹 Header */}
      <header className="fixed top-0 sm:top-5 left-0 right-0 flex justify-center z-50 pointer-events-none">
        <div className="border-b sm:border-2 border-amber-600 bg-neutral-900/80 w-full sm:w-[95%] sm:max-w-[1330px] flex justify-between items-center px-4 sm:px-10 py-4 sm:rounded-2xl backdrop-blur-md shadow-2xl pointer-events-auto">
          <h1 onClick={() => routeChange('/')} className="text-xl sm:text-3xl font-bold text-white cursor-pointer hover:text-amber-500 transition-colors">
            CricScoreBoard
          </h1>
          <div className="flex items-center space-x-4 sm:space-x-6">
            
            <div className="flex items-center space-x-3 sm:space-x-6">
              <a href="https://github.com/prodot-com/Cric-Scoreboard" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors"><Github className="w-5 h-5 sm:w-6 sm:h-6" /></a>
              <a href="https://www.linkedin.com/in/ghoshprobal/" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors"><Linkedin className="w-5 h-5 sm:w-6 sm:h-6" /></a>
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=xprobal52@gmail.com" target="_blank" rel="noopener noreferrer" className="hover:text-amber-500 transition-colors"><Mail className="w-5 h-5 sm:w-6 sm:h-6" /></a>
            </div>
          </div>
        </div>
      </header>

      {/* 🔹 Main Content */}
      <main className='w-full relative pt-28 sm:pt-36 pb-10 px-4 flex-grow'>
        <div
          className="absolute inset-0 z-0 opacity-80"
          style={{ backgroundImage: `
            radial-gradient(circle at 50% 0%, rgba(217, 119, 6, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 10% 20%, rgba(217, 119, 6, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 90% 80%, rgba(217, 119, 6, 0.15) 0%, transparent 40%)
          `}}
        />
        
        <div className='relative z-10 flex flex-col items-center w-full'>
          <div className='text-center mb-10'>
            <h2 className='text-3xl sm:text-4xl font-bold text-amber-500 drop-shadow-lg tracking-wider'>Match Center</h2>
            <p className="text-neutral-400 mt-2">Live games and recent results</p>
          </div>

          {loading ? (
            <Loader />
          ) : error ? (
            <div className="bg-red-900/50 border border-red-700 rounded-xl p-6 sm:p-8 text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-red-400">An Error Occurred</h2>
              <p className="text-red-300 mt-2">{error}</p>
            </div>
          ) : matches.length === 0 ? (
            <div className="bg-neutral-900/80 border border-neutral-700 rounded-xl p-8 text-center flex flex-col items-center">
              <BarChartHorizontalBig size={48} className="text-neutral-600 mb-4"/>
              <h2 className="text-2xl font-bold text-neutral-400">No Matches Found</h2>
              <p className="text-neutral-500 mt-2 mb-6">Create a new match to get started!</p>
              <button onClick={() => routeChange('/')} className="bg-amber-600 hover:bg-amber-500 text-white font-semibold py-2 px-5 rounded-lg transition-colors flex items-center space-x-2">
                  <PlusCircle size={20} />
                  <span>Create Match</span>
              </button>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full max-w-7xl'>
              {matches.map((match) => (
                <MatchCard key={match._id} match={match} onClick={() => routeChange(`/Live/${match._id}`)} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* 🔹 Footer */}
      <footer className="w-full mt-auto py-4 px-4 border-t border-neutral-800">
        <div className="text-center">
          <p className="text-sm text-neutral-400">©{new Date().getFullYear()} | Built with 🧡 by Probal Ghosh</p>
        </div>
      </footer>
    </div>
  );
}

export default Matches;
