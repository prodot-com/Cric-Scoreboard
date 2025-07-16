import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { CricProvider, useCric } from '../../Context/CricContext';

const Creation = () => {
  const [input, setInput] = useState('');
  // const { matchDetails, addMatchDetails } = useCric();

    const {addMatchDetails } = useCric(); 

  
  let navigate = useNavigate(); 
  const routeChange = () =>{ 
    navigate('/toss');}

  


  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(input);
    addMatchDetails({input})
    routeChange()
  };



  
  return (
    <>
    <div className="min-h-screen w-full bg-[#f9fafb] relative">
      {/* Background Grid */}
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

      {/* Form */}
      <div className="relative z-10 text-2xl font-mono py-9">
        <form onSubmit={handleSubmit} className="flex flex-col justify-evenly items-center h-50">
          <label>
            Name:
            <input
              placeholder="Enter Your Name"
              className="bg-blue-400 rounded-xl"
              type="text"
              value={input.name || ''}
              onChange={(e) => setInput({ ...input, name: e.target.value })}
            />
          </label>

          <label>
            Team-1 name:
            <input
            placeholder='Enter Team-1 name'
              className="bg-blue-400 rounded-xl"
              type="text"
              value={input.team1 || ''}
              onChange={(e) => setInput({ ...input, team1: e.target.value })}
            />
          </label>

          <label>
            Team-2 name:
            <input
            placeholder='Enter Team-2 name'
              className="bg-blue-400 rounded-xl"
              type="text"
              value={input.team2 || ''}
              onChange={(e) => setInput({ ...input, team2: e.target.value })}
            />
          </label>

          <label>
            Total Over:
            <input
            placeholder='Total over'
              className="bg-blue-400 rounded-xl"
              type="number"
              value={input.over || ''}
              onChange={(e) => setInput({ ...input, over: e.target.value })}
            />
          </label>

          <input type="submit" className="bg-blue-400 rounded-sm px-4 py-2 mt-4 cursor-pointer" />
        </form>
      </div>
    </div>
    </>
  );
};

export default Creation;
