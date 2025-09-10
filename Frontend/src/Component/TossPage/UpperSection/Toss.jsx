import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const Toss = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tossWinner, setTossWinner] = useState("");
  const [disable, setDisable] = useState(true);
  const [decision, setDecision] = useState("");
  const [isFlipping, setIsFlipping] = useState(false);
  const [matchData, setMatchData] = useState({})

  useEffect(()=>{
    const local = JSON.parse(localStorage.getItem('matchDetails'));
    setMatchData(local)
  },[])

  const getElement = () => {
    const local = JSON.parse(localStorage.getItem('matchDetails'));
    console.log(local)
    return [local?.team1, local?.team2];
  };

  
  const toss = () => {
    console.log(matchData)
    setIsFlipping(true);
    setTossWinner("");

    setTimeout(() => {
      const [team1, team2] = getElement();
      const result = Math.random() < 0.5 ? team1 : team2;
      setTossWinner(result);
      setDisable(false); 
      setIsFlipping(false);
    }, 2000);
  };

  
  const handleDecision = async (choice) => {
    const tossDetails = {
      tossWinner,
      decision: choice,
    };

    try {
      const res = await axios.post(
        `http://localhost:9000/user/addtoss/${id}`,
        tossDetails
      );
      console.log("Toss Data:::", res.data);
    } catch (error) {
      console.log("Something Went Wrong", error);
      return;
    }

    localStorage.setItem("tossDetails", JSON.stringify(tossDetails));
    setDecision(choice);
  };

  
  const routeChange = () => {
    navigate(`/admin/${id}`);
  };

  return (
    <div className="font-mono min-h-screen bg-black text-white flex flex-col items-center justify-center relative">
      {/* Background Glow */}
      <div
        className="absolute inset-0 z-0 opacity-80 animate-pulseMe"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 100%, rgba(255, 69, 0, 0.5) 0%, transparent 60%),
            radial-gradient(circle at 0% 0%, rgba(255, 215, 0, 0.25) 0%, transparent 70%),
            radial-gradient(circle at 100% 0%, rgba(255, 140, 0, 0.2) 0%, transparent 80%)
          `,
        }}
      />

      {/* Toss Card */}
      <div className="relative z-10 w-full max-w-[420px] bg-neutral-900/90 border border-amber-500 backdrop-blur-lg shadow-2xl rounded-2xl p-8 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-amber-500 mb-6">Toss Time 🎲</h1>

        
        <div className="w-32 h-32 perspective mb-6">
  {!tossWinner ? (
    <div
      className={`relative w-full h-full ${
        isFlipping ? "coin-flip" : ""
      }`}
    >
   
      <div className="absolute w-full h-full bg-amber-400 rounded-full flex items-center justify-center font-bold text-black text-xl backface-hidden">
        {matchData.team1}
      </div>

      <div
        className="absolute w-full h-full bg-blue-600 rounded-full flex items-center justify-center font-bold text-white text-xl backface-hidden"
        style={{ transform: "rotateY(180deg)" }}
      >
        {matchData.team2}
      </div>
    </div>
  ) : (
    /* After Toss Result → Show Winner Only */
    <div className="absolute w-full h-full bg-emerald-500 rounded-full flex items-center justify-center font-bold text-white text-xl shadow-lg">
      {tossWinner}
    </div>
  )}
</div>


        {/* Toss Button */}
        <button
          onClick={toss}
          disabled={isFlipping}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-xl
          shadow-lg hover:scale-95 hover:shadow-amber-400/50 transition-transform duration-300 disabled:opacity-50"
        >
          {isFlipping ? "Flipping..." : "Toss"}
        </button>

        {/* Winner + Decision */}
        {tossWinner && (
          <div className="mt-6 flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold text-amber-400 animate-bounce">
              {tossWinner} won the toss!
            </h2>

            {/* Bat / Bowl Choice */}
            <div className="flex gap-6 mt-3">
              <button
                disabled={disable}
                onClick={() => handleDecision("BAT")}
                className={`px-5 py-2 rounded-xl font-bold text-lg transition 
                ${
                  disable
                    ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg"
                }`}
              >
                Bat 🏏
              </button>

              <button
                disabled={disable}
                onClick={() => handleDecision("BOWL")}
                className={`px-5 py-2 rounded-xl font-bold text-lg transition 
                ${
                  disable
                    ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-500 text-white shadow-lg"
                }`}
              >
                Bowl 🎯
              </button>
            </div>

            {/* Show chosen decision */}
            {decision && (
              <h3 className="mt-4 text-lg text-gray-200">
                {tossWinner} chose to{" "}
                <span className="text-amber-400 font-bold">{decision}</span>
              </h3>
            )}

            {/* Done Button */}
            {decision && (
              <button
                onClick={routeChange}
                className="mt-6 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-lg shadow-lg"
              >
                Done ✅
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Toss;
