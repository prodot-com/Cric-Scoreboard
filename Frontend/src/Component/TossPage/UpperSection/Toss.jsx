import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import LiveTime from "../../LiveTime.jsx";
import { Github, Linkedin, Mail, ShieldCheck, Sword, ArrowRight, AlertTriangle, X } from "lucide-react";
import Cricket3 from "../../../assets/Cricket3.jpeg";
import { Backend_URL } from "../../../Utilities/Constant.js";

// Reusable Loader Component
const Loader = ({ message }) => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
    <div className="w-16 h-16 border-4 border-t-amber-500 border-neutral-700 rounded-full animate-spin"></div>
    <p className="mt-4 text-lg text-white">{message}</p>
  </div>
);

// Reusable Toast Component for Notifications
const Toast = ({ message, onDismiss }) => {
    if (!message) return null;
    return (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-4 p-4 rounded-lg shadow-2xl border border-red-400 bg-red-600/90 backdrop-blur-sm animate-fade-in-up">
            <AlertTriangle className="w-6 h-6 text-white" />
            <p className="text-white font-semibold">{message}</p>
            <button onClick={onDismiss} className="p-1 rounded-full hover:bg-white/20 transition-colors">
                <X className="w-5 h-5 text-white" />
            </button>
        </div>
    );
};


const Toss = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [matchData, setMatchData] = useState({});
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');
  
  const [tossWinner, setTossWinner] = useState("");
  const [decision, setDecision] = useState("");
  const [isFlipping, setIsFlipping] = useState(false);
  const [decisionMade, setDecisionMade] = useState(false);
  const [tossMade, setTossMade] = useState(false);

  useEffect(() => {
    const getMatch = async () => {
      try {
        const res = await axios.get(`${Backend_URL}user/one/${id}`);
        if (res.data && res.data.result) {
            setMatchData(res.data.result);
        } else {
            throw new Error("Match data not found.");
        }
      } catch (error) {
        console.error("Something went wrong: ", error);
        setNotification('Failed to load match data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    getMatch();
  }, [id]);

  const handleToss = () => {
    if (!matchData.team1 || !matchData.team2) return;
    setIsFlipping(true);
    setTossWinner("");
    setTossMade(true);

    setTimeout(() => {
      const result = Math.random() < 0.5 ? matchData.team1 : matchData.team2;
      setTossWinner(result);
      setIsFlipping(false);
    }, 2500); // Increased duration for a better animation feel
  };

  const handleDecision = async (choice) => {
    setDecisionMade(true);
    setDecision(choice);

    const tossDetails = { tossWinner, decision: choice };

    try {
      await axios.post(`${Backend_URL}user/addtoss/${id}`, tossDetails);
      
    } catch (error) {
      console.error("Something Went Wrong", error);
      setNotification('Failed to save decision. Please try again.');
    }
  };

  if (loading) {
    return <Loader message="Loading Match..." />;
  }

  return (
<div className="font-mono min-h-screen bg-black text-white flex flex-col relative overflow-x-hidden">
  <Toast message={notification} onDismiss={() => setNotification('')} />

  {/* Refined Sticky Header */}
  <header className="sticky top-4 mt-4 w-[calc(100%-2rem)] max-w-7xl z-50 mx-auto">
    <div className="border-2 border-amber-600 bg-neutral-900/80 backdrop-blur-lg flex flex-col sm:flex-row justify-between items-center px-4 sm:px-10 py-3 sm:py-4 rounded-2xl shadow-2xl shadow-black/50">
      <h1
        onClick={() => navigate('/')}
        className="text-xl sm:text-3xl font-bold text-white cursor-pointer"
      >
        CricScoreBoard
      </h1>
      <div className="flex items-center gap-4 sm:gap-6 mt-3 sm:mt-0">
        <div className="flex items-center gap-5">
          <a
            href="https://github.com/prodot-com/Cric-Scoreboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-300 hover:text-amber-500 transition-colors duration-300"
          >
            <Github className="w-6 h-6" />
          </a>
          <a
            href="https://www.linkedin.com/in/ghoshprobal/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-300 hover:text-amber-500 transition-colors duration-300"
          >
            <Linkedin className="w-6 h-6" />
          </a>
          <a
            href="mailto:xprobal52@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-300 hover:text-amber-500 transition-colors duration-300"
          >
            <Mail className="w-6 h-6" />
          </a>
        </div>
        <div className="hidden sm:block font-bold text-lg text-neutral-400">
          <LiveTime />
        </div>
      </div>
    </div>
  </header>

  {/* Background Glow */}
  <div
    className="absolute inset-0 z-0 opacity-80"
    style={{
      backgroundImage: `
        radial-gradient(circle at 50% 100%, rgba(255, 69, 0, 0.4) 0%, transparent 60%),
        radial-gradient(circle at 0% 0%, rgba(255, 215, 0, 0.2) 0%, transparent 70%),
        radial-gradient(circle at 100% 0%, rgba(255, 140, 0, 0.2) 0%, transparent 80%)
      `,
    }}
  />

  {/* Main Content */}
  <main className="relative z-10 w-full flex-grow flex items-center justify-center p-4">
    <div className="w-full max-w-5xl bg-neutral-900/80 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl p-6 sm:p-10 flex flex-col lg:flex-row items-center gap-10">
      {/* Left: Image */}
      <div className="flex justify-center items-center w-full lg:w-2/5">
        <img
          src={Cricket3}
          alt="Toss Preview"
          className="ring-2 ring-amber-600 ring-offset-4 ring-offset-black shadow-lg 
          transition-transform duration-500 ease-in-out transform hover:scale-105 hover:-rotate-3
          w-full max-w-sm h-auto object-contain drop-shadow-2xl rounded-2xl"
        />
      </div>

      {/* Right: Toss UI */}
      <div className="flex flex-col items-center justify-center w-full lg:w-3/5 p-4 sm:p-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-amber-500 mb-6">
          Time for the Toss
        </h1>
        <p className="text-neutral-300 mb-8 max-w-md">
          The captains are in the middle. Click the button to flip the coin and decide who bats first!
        </p>

        {/* Coin Animation */}
        <div className="w-24 h-24 sm:w-32 sm:h-32 perspective mb-6 relative">
          {!tossWinner ? (
            <div
              className={`relative w-full h-full ${
                isFlipping ? 'coin-flip' : ''
              }`}
            >
              <div className="absolute inset-0 bg-amber-400 rounded-full flex items-center justify-center font-bold text-black text-lg sm:text-xl backface-hidden">
                {matchData.team1}
              </div>
              <div
                className="absolute inset-0 bg-blue-600 rounded-full flex items-center justify-center font-bold text-white text-lg sm:text-xl backface-hidden"
                style={{ transform: 'rotateY(180deg)' }}
              >
                {matchData.team2}
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 bg-emerald-500 rounded-full flex items-center justify-center font-bold text-white text-lg sm:text-xl shadow-lg">
              {tossWinner}
            </div>
          )}
        </div>

        {/* UI States */}
        {!tossMade && (
          <button
            onClick={handleToss}
            className="cursor-pointer px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-xl shadow-lg hover:scale-105 hover:shadow-amber-400/50 transition-all duration-300"
          >
            Flip The Coin
          </button>
        )}

        {isFlipping && (
          <p className="text-xl text-neutral-300">Flipping...</p>
        )}

        {tossWinner && !decisionMade && (
          <div className="flex flex-col items-center gap-4 animate-fade-in">
            <h2 className="text-2xl font-bold text-green-400">
              {tossWinner} won the toss!
            </h2>
            <p className="text-lg text-neutral-200">What's the decision?</p>
            <div className="flex gap-4 mt-2">
              <button
                onClick={() => handleDecision('BAT')}
                className="cursor-pointer flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-lg transition bg-sky-600 hover:bg-sky-500 text-white shadow-lg hover:scale-105"
              >
                <Sword size={20} /> Bat
              </button>
              <button
                onClick={() => handleDecision('BOWL')}
                className="cursor-pointer flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-lg transition bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg hover:scale-105"
              >
                <ShieldCheck size={20} /> Bowl
              </button>
            </div>
          </div>
        )}

        {decisionMade && (
          <div className="flex flex-col items-center gap-4 animate-fade-in">
            <h3 className="text-xl text-neutral-200 text-center">
              {tossWinner} has elected to{' '}
              <span className="text-amber-400 font-bold uppercase">
                {decision}
              </span>{' '}
              first.
            </h3>
            <button
              onClick={() => navigate(`/admin/${id}`)}
              className="cursor-pointer mt-4 flex items-center gap-2 px-8 py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-lg shadow-lg transition-transform hover:scale-105"
            >
              Start Match <ArrowRight size={22} />
            </button>
          </div>
        )}
      </div>
    </div>
  </main>

  {/* Footer */}
  <footer className="w-full py-6 text-center text-gray-500 text-sm">
    <p>©{new Date().getFullYear()} CricScoreBoard | Built with 🧡</p>
  </footer>
</div>

  );
};

export default Toss;