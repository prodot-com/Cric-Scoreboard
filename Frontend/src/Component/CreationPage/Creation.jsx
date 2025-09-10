import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useCric } from "../../Context/CricContext";
import axios from "axios";
import { Github, Linkedin, Mail, Zap } from "lucide-react";
import LiveTime from "../LiveTime";

const Creation = () => {
  const [input, setInput] = useState({
    name: "",
    team1: "",
    team2: "",
    over: "",
  });

  const { addMatchDetails } = useCric();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.name || !input.team1 || !input.team2 || !input.over) {
      alert("Please fill out all fields.");
      return;
    }

    addMatchDetails(input);

    try {
      const res = await axios.post("http://localhost:9000/user/create", input);
      localStorage.setItem("matchDetails", JSON.stringify(input));
      const id = res.data._id;
      navigate(`/toss/${id}`);
    } catch (error) {
      console.log("Error creating match", error);
    }
  };

  return (
    <div className="font-mono min-h-screen gap-7 bg-black text-white flex  items-center relative px-4">
      {/* Navbar */}
      <div
        className="mt-5 bg-neutral-800/65 top-0 
        w-1/3 flex justify-between items-center 
        px-4  pt-5 py-4 rounded-2xl z-50 backdrop-blur-sm shadow-2xl"
      >
        <div>
          <h1
            onClick={() => navigate("/")}
            className="text-2xl sm:text-3xl font-bold text-white cursor-pointer"
          >
            CricScoreBoard
          </h1>
        </div>
        <div className="flex flex-col sm:flex-row items-center sm:space-x-5 mt-4 sm:mt-0 sm:gap-4">
          <div className="flex items-center space-x-6">
            {/* GitHub */}
            <a
              href="https://github.com/prodot-com/Cric-Scoreboard"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-600 transition"
            >
              <Github className="w-6 h-6" />
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/ghoshprobal/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-600 transition"
            >
              <Linkedin className="w-6 h-6" />
            </a>

            {/* Mail */}
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=xprobal52@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-600 transition"
            >
              <Mail className="w-6 h-6 pointer-events-auto" />
            </a>
          </div>

          <div className="sm:block hidden font-bold px-2 py-1 text-[22px] text-neutral-500 sm:mt-0">
            <LiveTime />
          </div>
        </div>
      </div>

    <div className="border w-2/3">
      {/* Ember Glow Background */}
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

      {/* Card */}
      <div className="relative z-10 w-full max-w-lg bg-neutral-900/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 mt-[120px]">
        {/* Header */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Zap className="w-7 h-7 text-amber-600" />
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-amber-500">
            Create Match
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { label: "Your Name", value: input.name, key: "name" },
            { label: "Team 1 Name", value: input.team1, key: "team1" },
            { label: "Team 2 Name", value: input.team2, key: "team2" },
            { label: "Total Overs", value: input.over, key: "over", type: "number" },
          ].map((field, idx) => (
            <div key={idx}>
              <label className="block text-neutral-300 font-medium mb-2">
                {field.label}
              </label>
              <input
                type={field.type || "text"}
                placeholder={field.label}
                value={field.value}
                onChange={(e) =>
                  setInput({
                    ...input,
                    [field.key]:
                      field.type === "number" ? Number(e.target.value) : e.target.value,
                  })
                }
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl
                text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                transition-all"
              />
            </div>
          ))}

          {/* Button */}
          <button
            type="submit"
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-lg rounded-xl shadow-lg transition"
          >
            Start Match
          </button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default Creation;
