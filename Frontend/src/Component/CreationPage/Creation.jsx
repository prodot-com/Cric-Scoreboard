import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useCric } from '../../Context/CricContext';

const Creation = () => {
  const [input, setInput] = useState({
    name: '',
    team1: '',
    team2: '',
    over: ''
  });

  const { addMatchDetails } = useCric(); 
  const navigate = useNavigate(); 

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!input.name || !input.team1 || !input.team2 || !input.over) {
      alert("Please fill out all fields.");
      return;
    }

    addMatchDetails(input); // Passing input directly

    localStorage.setItem('matchDetails', JSON.stringify(input)); // Storing input
    navigate('/toss');
    console.log(JSON.parse(localStorage.getItem('matchDetails')))
  };

  return (
    <div className="min-h-screen w-full bg-[#f9fafb] relative">
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, #d1d5db 1px, transparent 1px),
            linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 0% 0%, #000 50%, transparent 90%)",
        }}
      />

      <div className="relative z-10 text-2xl font-mono py-9">
        <form onSubmit={handleSubmit} className="flex flex-col justify-evenly items-center h-50">
          <label>
            Name:
            <input
              placeholder="Enter Your Name"
              className="bg-blue-400 rounded-xl"
              type="text"
              value={input.name}
              onChange={(e) => setInput({ ...input, name: e.target.value })}
            />
          </label>

          <label>
            Team-1 name:
            <input
              placeholder="Enter Team-1 name"
              className="bg-blue-400 rounded-xl"
              type="text"
              value={input.team1}
              onChange={(e) => setInput({ ...input, team1: e.target.value })}
            />
          </label>

          <label>
            Team-2 name:
            <input
              placeholder="Enter Team-2 name"
              className="bg-blue-400 rounded-xl"
              type="text"
              value={input.team2}
              onChange={(e) => setInput({ ...input, team2: e.target.value })}
            />
          </label>

          <label>
            Total Over:
            <input
              placeholder="Total over"
              className="bg-blue-400 rounded-xl"
              type="number"
              value={input.over}
              onChange={(e) => setInput({ ...input, over: Number(e.target.value) })}
            />
          </label>

          <input type="submit" className="bg-blue-400 rounded-sm px-4 py-2 mt-4 cursor-pointer" />
        </form>
      </div>
    </div>
  );
};

export default Creation;
