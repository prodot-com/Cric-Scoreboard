import { useState } from "react";
import { Github, Linkedin, Mail, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LiveTime from "../LiveTime.jsx"
import Cricket1 from "../../assets/Cricket1.jpeg"

export default function CreateMatchPage() {
  const navigate = useNavigate();
  const [alert, setAlert] = useState()

  const [input, setInput] = useState({
    name: "",
    team1: "",
    team2: "",
    over: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.name || !input.team1 || !input.team2 || !input.over) {
      setAlert("Please fill all fields");
      return;
    }
    console.log("Match Created:", input);
    setAlert("Match Created Successfully")
  };

  return (
<div className="font-mono min-h-screen bg-black items-center
     text-white flex flex-col relative">
  {/* 🔹 Navbar */}
  <div className="mt-5 border-2 border-amber-600 bg-neutral-900/90 sm:max-w-[1330px] fixed w-[95%] sm:w-full max-w-[350px] 
        sm:max-h-[77px]
        flex flex-col sm:flex-row justify-between items-center px-4 sm:px-10 pt-5 py-4 
        rounded-2xl z-50 backdrop-blur-sm shadow-2xl
        ">
          <div>
            <h1
        onClick={() => window.location.reload()}
        className="text-xl sm:text-3xl font-bold text-white cursor-pointer text-center sm:text-left"
      >
        CricScoreBoard
      </h1>
      
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:space-x-5 mt-3 sm:mt-0 sm:gap-4">
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
      
            <div className="hidden sm:block font-bold px-2 py-1 text-[18px] sm:text-[22px] text-neutral-500">
              <LiveTime />
            </div>
          </div>
        </div>

  {/* 🔹 Main Content */}
  <div className="flex h-auto items-center justify-center w-full px-4 pt-[130px] sm:pt-[110px]">
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

    {/* Content Wrapper */}
    <div className="flex flex-col lg:flex-row w-full max-w-[1330px] mt-[20px] gap-7 relative z-10 px-2 sm:px-0">
      {/* Image Side */}
      <div className="flex justify-center lg:w-1/3 rounded-2xl p-1">
        <img
          src={Cricket1}
          alt="Cricket App Preview"
          className="ring-2 sm:rotate-3 hover:scale-95 hover:-rotate-5 ring-amber-600 ring-offset-2 ring-offset-black shadow-lg transition
    w-[330px] sm:w-[300px]  lg:w-[305px] sm:h-[540px] object-contain drop-shadow-2xl rounded-xl shadow-amber-600"
        />
      </div>

      {/* Card */}
      <div className="border border-amber-500 sm:border-0 lg:w-2/3 bg-neutral-900/90 backdrop-blur-md shadow-2xl p-6 sm:p-8 rounded-2xl">
        <div className="flex justify-between items-center">
          <h1 className="font-bold text-[15px] sm:text-3xl mb-3 text-amber-600">
          Create Match
        </h1>

        <h1 className="font-bold sm:mr-5 text-[10px] sm:text-xl mb-3 text-white/85"
        >
          {alert}
        </h1>

        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: "Your Name", value: input.name, key: "name", placeholder:"Enter Your Name" },
            { label: "Team1 Name", value: input.team1, key: "team1", placeholder:"Team1 Name" },
            { label: "Team2 Name", value: input.team2, key: "team2", placeholder:"Team2 Name" },
            {
              label: "Total Overs",
              value: input.over,
              key: "over",
              type: "number",
              placeholder:"Total Overs"
            },
          ].map((field, idx) => (
            <div key={idx}>
              <label className="block text-neutral-300 font-medium mb-2 text-sm sm:text-base">
                {field.label}
              </label>
              <input
                type={field.type || "text"}
                placeholder={field.placeholder}
                value={field.value}
                onChange={(e) =>{
                  setAlert("");
                  setInput({
                    ...input,
                    [field.key]:
                      field.type === "number"
                        ? Number(e.target.value)
                        : e.target.value,
                  })
                }
                }
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-neutral-800 border border-neutral-700 rounded-xl
                text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                transition-all text-sm sm:text-base"
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full py-2 sm:py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-base sm:text-lg rounded-xl shadow-lg transition"
          >
            Start Match
          </button>
        </form>
      </div>
    </div>
  </div>

  {/* 🔹 Footer */}
  <footer className="mt-8 sm:mt-auto py-6 text-center text-gray-400 text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4">
    <span>
      ©2025 CricScoreBoard | Built with 🧡
    </span>
  </footer>
</div>


  );
}
