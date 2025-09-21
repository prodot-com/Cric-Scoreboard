import React, { useState, useEffect } from "react";
import { Star, BarChart, Zap, Github, Linkedin, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LivePage_URL } from "../Utilities/Constant";


const LiveTime = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const timerId = setInterval(() => {
      const options = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      };
      const kolkataTime = new Date().toLocaleTimeString('en-US', options);
      setTime(kolkataTime);
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  return (
    <div>
      {time} IST
    </div>
  );
};


const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center bg-black font-mono text-white">
      {/* Navbar */}
      <div className="fixed z-50 mt-8 flex w-full max-w-[350px] flex-col items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/70 px-6 py-4 shadow-lg shadow-amber-600/30 backdrop-blur-lg sm:max-h-[77px] sm:max-w-[1330px] sm:flex-row sm:px-10 sm:py-7">
        <h1
          onClick={() => window.location.reload()}
          className="cursor-pointer text-2xl font-bold text-white transition hover:text-amber-500 sm:text-3xl"
        >
          CricScoreBoard
        </h1>

        <div className="mt-3 flex flex-col items-center gap-4 sm:mt-0 sm:flex-row">
          <div className="flex items-center space-x-6">
            {/* Social Links */}
            <a href="https://github.com/prodot-com/Cric-Scoreboard" target="_blank" rel="noopener noreferrer" className="transition hover:text-amber-600">
              <Github className="h-6 w-6" />
            </a>
            <a href="https://www.linkedin.com/in/ghoshprobal/" target="_blank" rel="noopener noreferrer" className="transition hover:text-amber-600">
              <Linkedin className="h-6 w-6" />
            </a>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=xprobal52@gmail.com" target="_blank" rel="noopener noreferrer" className="transition hover:text-amber-600">
              <Mail className="h-6 w-6" />
            </a>
          </div>
          <div className="hidden px-2 py-1 text-lg font-bold text-neutral-400 sm:block">
            <LiveTime />
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative mt-[155px] flex min-h-[600px] w-full flex-col items-center justify-center px-4 sm:mt-24 sm:min-h-screen sm:px-6">
        {/* Glow Background */}
        <div
          className="animate-pulseMe absolute inset-0 z-0 opacity-80"
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
          <h1 className="max-w-full bg-gradient-to-b from-white to-amber-500 bg-clip-text text-5xl font-bold leading-tight tracking-tight text-transparent sm:max-w-4xl sm:text-7xl">
            Your Match, Your Scoreboard
          </h1>
          <p className="mx-auto mt-6 max-w-full text-base text-neutral-300 sm:max-w-2xl sm:text-xl">
            Create a match, update scores ball-by-ball, and share a live link with your friends. It's that simple.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <button
              onClick={() => navigate("/creation")}
              className="cursor-pointer rounded-lg bg-amber-600 px-6 py-3 text-lg font-semibold text-white shadow-md transition hover:bg-amber-500"
            >
              Create a Match
            </button>
            <a href={LivePage_URL} target="_blank" rel="noopener noreferrer">
              <button className="w-full cursor-pointer rounded-lg border border-neutral-500 px-6 py-3 text-lg font-semibold transition hover:bg-neutral-800">
                View Live Scores
              </button>
            </a>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div
        id="about"
        className="mx-auto grid max-w-[1430px] grid-cols-1 items-center gap-12 p-6 sm:p-12 lg:grid-cols-2"
      >
        {/* Text Content */}
        <div>
          <h2 className="text-3xl font-bold text-white sm:text-5xl">
            How It Works
          </h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-300 sm:text-lg">
            CricScoreBoard is built for every cricket lover. An{" "}
            <span className="font-semibold text-amber-500">admin</span> can
            create a match in seconds and update scores live. Anyone with the link
            can then <span className="font-semibold text-amber-500">watch</span>{" "}
            the match with real-time updates and full summaries.
          </p>

          {/* Features */}
          <div className="mt-10 space-y-8">
            <Feature
              icon={<Zap className="h-6 w-6 text-amber-600" />}
              title="Instant Match Creation"
              desc="Set up your match with team names and overs, and get a shareable link instantly."
            />
            <Feature
              icon={<BarChart className="h-6 w-6 text-amber-600" />}
              title="Live Ball-by-Ball Updates"
              desc="As an admin, score the match live. Viewers see every update in real-time."
            />
            <Feature
              icon={<Star className="h-6 w-6 text-amber-600" />}
              title="Complete Match Summaries"
              desc="Once the match is over, everyone can view detailed stats and results."
            />
          </div>

          {/* CTA */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <button
              className="cursor-pointer rounded-lg bg-amber-600 px-6 py-3 text-lg font-semibold shadow-lg transition hover:bg-amber-500"
              onClick={() => navigate("/creation")}
            >
              Start a Match
            </button>
          </div>
        </div>

        {/* Image Preview */}
        <div className="mt-6 flex flex-col items-center justify-center gap-6 sm:flex-row lg:mt-0">
          <img
            src="https://placehold.co/350x500/171717/d97706?text=Live+View"
            alt="Cricket Preview"
            className="h-auto w-[300px] rounded-xl object-cover drop-shadow-2xl transition hover:scale-105 sm:w-[350px]"
          />
          <img
            src="https://placehold.co/300x500/171717/d97706?text=Admin+Panel"
            alt="Cricket Preview"
            className="h-auto w-[280px] rounded-xl object-cover drop-shadow-2xl transition hover:scale-105 sm:max-h-[500px] sm:w-[300px]"
          />
        </div>
      </div>

      {/* Trust Section */}
      <div className="relative mx-auto my-12 w-full max-w-[330px] rounded-2xl bg-neutral-900 py-16 shadow-lg shadow-amber-600/40 sm:max-w-[1430px] sm:py-20">
        <div className="relative z-10 mb-12 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Why Trust <span className="text-amber-600">CricScoreBoard</span>
          </h2>
          <p className="mt-4 text-base text-neutral-400 sm:text-lg">
            Powering live matches, delivering accurate stats, and connecting
            fans worldwide.
          </p>
        </div>

        <div className="relative z-10 mx-auto grid max-w-4xl grid-cols-1 gap-10 text-center sm:grid-cols-2">
          <div className="group flex flex-col items-center">
            <Zap className="h-12 w-12 text-amber-600 transition group-hover:scale-110" />
            <h3 className="mt-2 text-lg text-neutral-300">
              Low Latency Updates
            </h3>
          </div>
          <div className="group">
            <h3 className="text-4xl font-extrabold text-amber-600 transition group-hover:scale-110 sm:text-5xl">
              99.9%
            </h3>
            <p className="mt-2 text-neutral-300">Accurate Data Delivery</p>
          </div>
        </div>

        {/* Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/10 blur-3xl"></div>
      </div>

      {/* Final CTA */}
      <div className="flex w-full flex-col items-center justify-center bg-gradient-to-r from-amber-600/10 via-black to-amber-600/10 px-6 py-20 text-center">
        <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
          Ready to Start Scoring?
        </h2>
        <p className="mb-8 max-w-2xl text-base text-neutral-300 sm:text-lg">
          Create your first match and share the excitement of live cricket. It's free and easy to get started.
        </p>
        <button
            className="cursor-pointer rounded-lg bg-amber-600 px-8 py-3 text-lg font-semibold shadow-lg transition hover:bg-amber-500"
            onClick={() => navigate("/creation")}
        >
            Create Your Match Now
        </button>
      </div>

      {/* Footer */}
      <footer className="mt-auto flex flex-col items-center justify-center gap-2 py-6 text-center text-sm text-gray-400 sm:flex-row">
        <span className="text-[13px] sm:text-[15px]">
          ©2024 CricScoreBoard | Built with 🏏
        </span>
      </footer>
    </div>
  );
};

// Reusable Feature Card
const Feature = ({ icon, title, desc }) => (
  <div className="group flex flex-col items-start gap-4 sm:flex-row">
    <div className="rounded-full bg-amber-500/10 p-3 transition group-hover:bg-amber-500/20">
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-semibold text-white sm:text-xl">{title}</h3>
      <p className="text-sm text-neutral-400 sm:text-base">{desc}</p>
    </div>
  </div>
);

export default Home;

