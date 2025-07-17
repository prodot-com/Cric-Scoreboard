import React, { useState } from 'react';
import Title from '../../Title/Title';
import { useNavigate } from 'react-router';

const Toss = () => {
  const navigate = useNavigate();

  // State hooks
  const [userCall, setUserCall] = useState('Heads');
  const [tossResult, setTossResult] = useState(null);
  const [tossWinner, setTossWinner] = useState('');
  const [choice, setChoice] = useState('');

  // Get teams from localStorage
  const getElement = () => {
    const local = JSON.parse(localStorage.getItem('matchDetails'));
    return [local?.team1, local?.team2];
  };

  // Toss simulation
  const handleToss = () => {
    const [team1, team2] = getElement();

    if (!team1 || !team2) {
      alert("Team names not found in localStorage.");
      return;
    }

    const coinFlip = Math.random() < 0.5 ? 'Heads' : 'Tails';
    setTossResult(coinFlip);

    const winner = coinFlip === userCall ? team1 : team2;
    setTossWinner(winner);
  };

  // Handle decision to bat or bowl
  const handleChoice = (batOrBowl) => {
    setChoice(batOrBowl);

    const tossData = {
      tossResult,
      tossWinner,
      decision: batOrBowl,
    };

    localStorage.setItem('tossDetails', JSON.stringify(tossData));
    navigate('/match'); // Or your actual next route
  };

  return (
    <div className="min-h-screen w-full relative">
      {/* Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(125% 125% at 50% 90%, #fff 40%, #6366f1 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 font-mono px-4 py-8">
        <div className="text-center mb-8">
          <Title text="TOSS" className="text-blue-800 text-5xl font-bold" />
        </div>

        <div className="flex flex-col items-center space-y-4">
          {/* Toss call selection */}
          <div>
            <label className="mr-4 text-lg">Call the Toss:</label>
            <label className="mr-4">
              <input
                type="radio"
                value="Heads"
                checked={userCall === 'Heads'}
                onChange={(e) => setUserCall(e.target.value)}
              />
              Heads
            </label>
            <label>
              <input
                type="radio"
                value="Tails"
                checked={userCall === 'Tails'}
                onChange={(e) => setUserCall(e.target.value)}
              />
              Tails
            </label>
          </div>

          {/* Toss button */}
          <button
            onClick={handleToss}
            className="bg-green-500 px-6 py-2 rounded-xl text-white font-bold"
          >
            Toss
          </button>

          {/* Toss result display */}
          {tossResult && (
            <div className="text-center mt-4">
              <p className="text-xl font-semibold">
                Toss Result: <span className="text-blue-700">{tossResult}</span>
              </p>
              <p className="text-xl font-semibold">
                {tossWinner} won the toss!
              </p>
            </div>
          )}

          {/* Bat/Bowl options if user wins toss */}
          {tossWinner && tossWinner === getElement()[0] && (
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => handleChoice('BAT')}
                className="bg-blue-700 px-6 py-2 rounded-xl text-white text-xl"
              >
                BAT
              </button>
              <button
                onClick={() => handleChoice('BOWL')}
                className="bg-blue-700 px-6 py-2 rounded-xl text-white text-xl"
              >
                BOWL
              </button>
            </div>
          )}

          {/* If opponent wins toss, show message only */}
          {tossWinner && tossWinner !== getElement()[0] && (
            <div className="text-xl mt-4">
              {tossWinner} will decide to bat or bowl.
              <br />
              (Simulate or handle this part in future)
              <button
                onClick={() => handleChoice('BOWL')} // Simulate opponent's choice
                className="mt-4 bg-blue-600 px-4 py-2 rounded-xl text-white"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Toss;
