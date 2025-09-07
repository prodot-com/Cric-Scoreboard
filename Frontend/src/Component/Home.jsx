import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-indigo-900 to-indigo-800 text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-indigo-950 bg-opacity-70">
        <h1 className="text-2xl font-bold">🏏 CricLive</h1>
        <div className="space-x-6">
          <button className="hover:text-amber-400">Home</button>
          <button className="hover:text-amber-400">Matches</button>
          <button className="hover:text-amber-400">About</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col justify-center items-center text-center px-6 py-20">
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold 
          bg-gradient-to-r from-amber-400 to-green-400 bg-clip-text text-transparent">
          Experience Live Cricket Like Never Before
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-300">
          Track every ball, every run, and every wicket in real-time with smart analytics.
        </p>
        <div className="mt-8 flex gap-4">
          <button className="px-6 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700">
            Start a Match
          </button>
          <button className="px-6 py-2 bg-amber-500 text-white rounded-lg shadow-md hover:bg-amber-600">
            Watch Live
          </button>
        </div>
      </section>

      {/* Live Match Highlight */}
      <section className="flex justify-center mt-12 px-4">
        <div className="w-full max-w-md bg-indigo-900 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-amber-400 mb-4 text-center">
            🔥 Live Match Highlight
          </h2>
          <div className="flex justify-between text-lg font-semibold">
            <span>India</span>
            <span>145/3 (17.2)</span>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <span>Australia</span>
            <span>Yet to Bat</span>
          </div>
          <div className="mt-4 text-center">
            <button className="px-5 py-2 bg-amber-500 rounded-lg hover:bg-amber-600 text-sm">
              Watch Live →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-gray-400 text-sm">
        © 2025 CricLive | Built with ❤️
      </footer>
    </div>
  );
};

export default Home;
