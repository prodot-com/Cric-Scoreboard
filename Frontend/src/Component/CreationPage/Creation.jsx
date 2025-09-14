import { useState } from "react";
import { Github, Linkedin, Mail, Copy, X, ArrowRight, PartyPopper, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import LiveTime from "../LiveTime.jsx";
import Cricket1 from "../../assets/Cricket1.jpeg";
import axios from "axios";
import { Backend_URL } from "../../Utilities/Constant.js";

// A small, reusable Toast component for notifications
const Toast = ({ message, type, onDismiss }) => {
  if (!message) return null;

  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-green-600/90' : 'bg-red-600/90';
  const borderColor = isSuccess ? 'border-green-400' : 'border-red-400';
  const Icon = isSuccess ? PartyPopper : AlertTriangle;

  return (
    <div className={`fixed bottom-5 right-5 z-50 flex items-center gap-4 p-4 rounded-lg shadow-2xl border ${borderColor} ${bgColor} backdrop-blur-sm animate-fade-in-up`}>
      <Icon className="w-6 h-6 text-white" />
      <p className="text-white font-semibold">{message}</p>
      <button onClick={onDismiss} className="cursor-pointer p-1 rounded-full hover:bg-white/20 transition-colors">
        <X className="w-5 h-5 text-white" />
      </button>
    </div>
  );
};


export default function CreateMatchPage() {
  const navigate = useNavigate();
  const [matchId, setMatchId] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ message: '', type: '' });

  const [input, setInput] = useState({
    name: "",
    team1: "",
    team2: "",
    over: "",
  });

  const clearNotification = () => setNotification({ message: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.name || !input.team1 || !input.team2 || !input.over) {
      setNotification({ message: "Please fill out all fields.", type: "error" });
      setTimeout(clearNotification, 3000);
      return;
    }

    setLoading(true);
    clearNotification();

    try {
      const res = await axios.post(`${Backend_URL}user/create`, input);

      if (!res || !res.data?._id) {
        throw new Error("Server returned an invalid response.");
      }

      const newMatchId = res.data._id;
      setMatchId(newMatchId);
      setNotification({ message: "Match Created Successfully!", type: "success" });
      setTimeout(()=>{setShowSuccessModal(true);},1500)

    } catch (error) {
      console.error(error);
      setNotification({ message: "Something went wrong. Please try again.", type: "error" });
    } finally {
      setLoading(false);
      setTimeout(clearNotification, 3000);
    }
  };

  const handleCopy = (textToCopy, elementId) => {
    navigator.clipboard.writeText(textToCopy);
    const button = document.getElementById(elementId);
    if(button) {
      button.innerText = "Copied!";
      setTimeout(() => {
        button.innerText = "Copy";
      }, 2000);
    }
  };


  return (
    <div className="font-mono min-h-screen bg-black text-white flex flex-col items-center relative overflow-x-hidden">
      <Toast message={notification.message} type={notification.type} onDismiss={clearNotification} />

      {/* 🔹 Refined Sticky Header */}
      <header className="sticky top-4 mt-4 w-[calc(100%-2rem)] max-w-7xl z-50">
          <div className="border-2 border-amber-600 bg-neutral-900/80 backdrop-blur-lg flex flex-col sm:flex-row justify-between items-center px-4 sm:px-10 py-3 sm:py-4 rounded-2xl shadow-2xl shadow-black/50">
              <h1 onClick={() => window.location.reload()} className="text-xl sm:text-3xl font-bold text-white cursor-pointer">
                  CricScoreBoard
              </h1>
              <div className="flex items-center gap-4 sm:gap-6 mt-3 sm:mt-0">
                  <div className="flex items-center gap-5">
                      <a href="https://github.com/prodot-com/Cric-Scoreboard" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-amber-500 transition-colors duration-300">
                          <Github className="w-6 h-6" />
                      </a>
                      <a href="https://www.linkedin.com/in/ghoshprobal/" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-amber-500 transition-colors duration-300">
                          <Linkedin className="w-6 h-6" />
                      </a>
                      <a href="https://mail.google.com/mail/?view=cm&fs=1&to=xprobal52@gmail.com" target="_blank" rel="noopener noreferrer" className="text-neutral-300 hover:text-amber-500 transition-colors duration-300">
                          <Mail className="w-6 h-6" />
                      </a>
                  </div>
                  <div className="hidden sm:block font-bold text-lg text-neutral-400">
                      <LiveTime />
                  </div>
              </div>
          </div>
      </header>

      {/* 🔹 Main Content */}
      <main className="flex-grow flex items-center justify-center w-full px-4 pt-8 sm:pt-4">
        <div className="absolute inset-0 z-0 opacity-80"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 100%, rgba(255, 69, 0, 0.4) 0%, transparent 60%),
              radial-gradient(circle at 0% 0%, rgba(255, 215, 0, 0.2) 0%, transparent 70%),
              radial-gradient(circle at 100% 0%, rgba(255, 140, 0, 0.2) 0%, transparent 80%)
            `,
          }}
        />

        <div className="flex flex-col lg:flex-row w-full max-w-7xl items-center gap-12 relative z-10 px-2 sm:px-0">
          {/* Image Side */}
          <div className="flex justify-center lg:w-1/3 rounded-2xl p-1">
        <img
          src={Cricket1}
          alt="Cricket App Preview"
          className="ring-2 sm:rotate-3 hover:scale-95 hover:-rotate-5 ring-amber-600 ring-offset-2 ring-offset-black shadow-lg 
          transition-transform duration-500 delay-100
          w-[330px] sm:w-[300px]  lg:w-[305px] sm:h-[540px] object-contain drop-shadow-2xl rounded-xl shadow-amber-600"
        />
      </div>

          {/* Form Card */}
          <div className="w-full lg:w-3/5 bg-neutral-900/80 backdrop-blur-md p-6 sm:p-10 rounded-2xl shadow-2xl border border-white/10">
            <h2 className="font-bold text-2xl sm:text-3xl mb-6 text-amber-500">
              Create a New Match
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                { label: "Your Name", key: "name", placeholder: "Akex Carey" },
                { label: "Team 1 Name", key: "team1", placeholder: "Royal Challengers" },
                { label: "Team 2 Name", key: "team2", placeholder: "Knight Riders" },
                { label: "Total Overs", key: "over", type: "number", placeholder: "20" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-neutral-300 font-medium mb-2 text-sm sm:text-base">
                    {field.label}
                  </label>
                  <input
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    value={input[field.key]}
                    onChange={(e) => {
                      clearNotification();
                      setInput({ ...input, [field.key]: e.target.value });
                    }}
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-xl
                    text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500
                    transition-all text-sm sm:text-base"
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer w-full flex justify-center items-center gap-3 py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-base sm:text-lg rounded-xl shadow-lg transition-all duration-300 disabled:bg-neutral-600 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className=" w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Match...
                  </>
                ) : (
                  "Create & Start Match"
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
      
      {/* 🔹 Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fade-in">
          <div className="relative bg-neutral-900 border-2 border-amber-500 rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center">
             <button onClick={() => setShowSuccessModal(false)} className="cursor-pointer absolute top-4 right-4 text-neutral-400 hover:text-white transition">
                <X size={24} />
             </button>
             <PartyPopper size={48} className="mx-auto text-amber-500 mb-4" />
             <h2 className="text-3xl font-bold text-white mb-3">Match Created!</h2>
             <p className="text-neutral-300 mb-8">Share the links below or proceed to the toss.</p>
             
             <div className="space-y-6 text-left">
                {/* Admin Link */}
                <div className="bg-neutral-800 p-4 rounded-lg">
                    <label className="font-semibold text-amber-400">Go for all matches</label>
                    <div className="flex items-center gap-3 mt-2">
                        <input type="text" readOnly value={`https://cric-livescoreboard.vercel.app`} className="w-full bg-neutral-700 text-neutral-200 px-3 py-2 rounded truncate" />
                        <button id="copyAdmin" onClick={() => handleCopy(`https://cric-livescoreboard.vercel.app`, 'copyAdmin')} className="cursor-pointer bg-neutral-600 hover:bg-neutral-500 text-white font-bold py-2 px-3 rounded-lg flex items-center gap-2 transition whitespace-nowrap">
                            <Copy size={16} /> <span >Copy</span>
                        </button>
                    </div>
                </div>

                 {/* Spectator Link */}
                <div className="bg-neutral-800 p-4 rounded-lg">
                    <label className="font-semibold text-green-400">Spectator Link (Only for these match)</label>
                    <div className="flex items-center gap-3 mt-2">
                        <input type="text" readOnly value={`https://cric-livescoreboard.vercel.app/Live/${matchId}`} className="w-full bg-neutral-700 text-neutral-200 px-3 py-2 rounded truncate" />
                        <button id="copySpectator" onClick={() => handleCopy(`https://cric-livescoreboard.vercel.app/Live/${matchId}`, 'copySpectator')} className="cursor-pointer bg-neutral-600 hover:bg-neutral-500 text-white font-bold py-2 px-3 rounded-lg flex items-center gap-2 transition whitespace-nowrap">
                            <Copy size={16} /> <span>Copy</span>
                        </button>
                    </div>
                </div>
             </div>

             <button onClick={() => navigate(`/toss/${matchId}`)} className="cursor-pointer mt-8 w-full py-3 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-lg rounded-xl shadow-lg transition flex items-center justify-center gap-2">
                Proceed to Toss <ArrowRight size={20} />
             </button>
          </div>
        </div>
      )}

      {/* 🔹 Footer */}
      <footer className="w-full mt-auto py-6 text-center text-gray-500 text-sm">
        <p>©{new Date().getFullYear()} CricScoreBoard | Built with 🧡</p>
      </footer>
    </div>
  );
}