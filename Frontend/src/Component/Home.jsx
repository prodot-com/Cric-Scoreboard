import React from "react";
import Hero1 from "../assets/Hero1.png";
import Hero3 from "../assets/Hero3.jpg";
import { Star, BarChart, Zap, Github, Linkedin, Mail } from "lucide-react";
import LiveTime from "./LiveTime";
import { useNavigate } from "react-router-dom";
import { LivePage_URL } from "../Utilities/Constant.js";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="font-mono min-h-screen bg-black text-white flex flex-col items-center">
      {/* Navbar */}
      <div className="mt-5 bg-neutral-900/70 backdrop-blur-lg border border-neutral-800 
        sm:max-w-[1330px] fixed max-w-[350px] sm:max-h-[77px]
        flex flex-col sm:flex-row justify-between items-center w-full px-6 sm:px-10 py-4 
        rounded-2xl z-50 shadow-lg shadow-amber-600/30">
        <h1
          onClick={() => window.location.reload()}
          className="text-2xl sm:text-3xl font-bold text-white cursor-pointer hover:text-amber-500 transition"
        >
          CricScoreBoard
        </h1>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-3 sm:mt-0">
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
              <Mail className="w-6 h-6" />
            </a>
          </div>

          <div className="hidden sm:block font-bold px-2 py-1 text-[20px] text-neutral-400">
            <LiveTime />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="mt-[155px] sm:mt-24 min-h-[600px] sm:min-h-screen w-full relative flex flex-col justify-center items-center px-4 sm:px-6">
        {/* Glow Background */}
        <div
          className="absolute inset-0 z-0 opacity-80 animate-pulseMe"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 100%, rgba(255, 69, 0, 0.6) 0%, transparent 60%),
              radial-gradient(circle at 50% 100%, rgba(255, 140, 0, 0.4) 0%, transparent 70%),
              radial-gradient(circle at 50% 100%, rgba(255, 215, 0, 0.25) 0%, transparent 80%)
            `,
          }}
        />
        {/* Content */}
        <div className="relative z-10 text-center">
          <h1 className="font-bold leading-tight text-5xl sm:text-7xl max-w-full sm:max-w-4xl tracking-tight
            bg-clip-text text-transparent bg-gradient-to-b from-white to-amber-500">
            Experience Live Cricket Like Never Before
          </h1>
          <p className="mt-6 text-base sm:text-xl text-neutral-300 max-w-full sm:max-w-2xl mx-auto">
            Track every ball, every run, and every wicket in real-time with powerful analytics and live updates.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <button
              onClick={() =>
                document.getElementById("about").scrollIntoView({ behavior: "smooth" })
              }
              className="px-6 py-3 cursor-pointer bg-amber-600 text-white rounded-lg text-lg font-semibold shadow-md hover:bg-amber-500 transition"
            >
              Get Started
            </button>
            <a
              href={LivePage_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="cursor-pointer px-6 py-3 border border-neutral-500 hover:bg-neutral-800 rounded-lg text-lg font-semibold transition">
                View Live Scores
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div
        id="about"
        className="p-6 sm:p-12 max-w-[1430px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
      >
        {/* Text Content */}
        <div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white">
            About Our App
          </h2>
          <p className="mt-6 text-base sm:text-lg text-neutral-300 leading-relaxed">
            CricScoreBoard is built to bring cricket closer to fans.{" "}
            <span className="text-amber-500 font-semibold">Admins</span> can create matches and update scores ball by ball, while{" "}
            <span className="text-amber-500 font-semibold">fans</span> enjoy real-time updates and match summaries.
          </p>

          {/* Features */}
          <div className="mt-10 space-y-8">
            <Feature
              icon={<Zap className="text-amber-600 w-6 h-6" />}
              title="Ball-by-Ball Scoring"
              desc="Admins can update every run, wicket, and extra live in real-time."
            />
            <Feature
              icon={<BarChart className="text-amber-600 w-6 h-6" />}
              title="Live Scoreboard"
              desc="Fans get stadium-like experience with instant scoreboard updates."
            />
            <Feature
              icon={<Star className="text-amber-600 w-6 h-6" />}
              title="Match Summaries"
              desc="Detailed stats, team performance breakdowns, and match results."
            />
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <button
              className="cursor-pointer px-6 py-3 bg-amber-600 hover:bg-amber-500 rounded-lg text-lg font-semibold shadow-lg transition"
              onClick={() => navigate("/creation")}
            >
              Start a Match
            </button>
            <a href={LivePage_URL} target="_blank" rel="noopener noreferrer">
              <button className="cursor-pointer px-6 py-3 border border-neutral-500 hover:bg-neutral-800 rounded-lg text-lg font-semibold transition">
                View Live Scores
              </button>
            </a>
          </div>
        </div>

        {/* Image Preview */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 mt-6 lg:mt-0">
          <img
            src={Hero1}
            alt="Cricket Preview"
            className="w-[300px] sm:w-[350px] h-auto object-contain drop-shadow-2xl rounded-xl hover:scale-105 transition"
          />
          <img
            src={Hero3}
            alt="Cricket Preview"
            className="sm:max-h-[500px] w-[280px] sm:w-[300px] h-auto object-contain drop-shadow-2xl rounded-xl hover:scale-105 transition"
          />
        </div>
      </div>

      {/* Trust Section */}
      <div className="bg-neutral-900 rounded-2xl max-w-[330px] sm:max-w-[1430px] w-full py-16 sm:py-20 mx-auto shadow-lg shadow-amber-600/40 relative">
        <div className="text-center mb-12 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Why Trust <span className="text-amber-600">CricScoreBoard</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-neutral-400">
            Powering live matches, delivering accurate stats, and connecting fans worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 max-w-4xl mx-auto text-center relative z-10">
          <div className="group flex flex-col items-center">
            <Zap className="text-amber-600 w-12 h-12 group-hover:scale-110 transition" />
            <h3 className="text-neutral-300 mt-2 text-lg">Low Latency Updates</h3>
          </div>
          <div className="group">
            <h3 className="text-4xl sm:text-5xl font-extrabold text-amber-600 group-hover:scale-110 transition">
              99.9%
            </h3>
            <p className="text-neutral-300 mt-2">Accurate Data Delivery</p>
          </div>
        </div>

        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/10 blur-3xl"></div>
      </div>

      {/* Final CTA */}
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-gradient-to-r from-amber-600/10 via-black to-amber-600/10 w-full">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
          Ready to Experience Live Cricket?
        </h2>
        <p className="text-base sm:text-lg max-w-2xl text-neutral-300 mb-8">
          Get real-time updates, smart analytics, and live match summaries — all in one place.
        </p>
        <a href={LivePage_URL} target="_blank" rel="noopener noreferrer">
          <button className="cursor-pointer px-8 py-3 bg-amber-600 hover:bg-amber-500 rounded-lg text-lg font-semibold shadow-lg transition">
            Start Watching
          </button>
        </a>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-gray-400 text-sm flex flex-col sm:flex-row items-center justify-center gap-2">
        <span className="text-[13px] sm:text-[15px]">
          ©2025 CricScoreBoard | Built with 🏏
        </span>
      </footer>
    </div>
  );
};

// Reusable Feature Card
const Feature = ({ icon, title, desc }) => (
  <div className="flex flex-col sm:flex-row items-start gap-4 group">
    <div className="p-3 rounded-full bg-amber-500/10 group-hover:bg-amber-500/20 transition">
      {icon}
    </div>
    <div>
      <h3 className="text-lg sm:text-xl font-semibold text-white">{title}</h3>
      <p className="text-neutral-400 text-sm sm:text-base">{desc}</p>
    </div>
  </div>
);

export default Home;
