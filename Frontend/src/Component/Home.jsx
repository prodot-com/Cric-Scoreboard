import React from "react";

const Home = () => {
  return (
    <div className="font-mono min-h-screen bg-gradient-to-br from-neutral-300 via-neutral-600 to-neutral-900 text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4  bg-opacity-70 text-black">
        <h1 className="text-3xl font-bold">CricScoreBoard</h1>
        <div className="space-x-6">
          <button className="hover:text-neutral-600 cursor-pointer">Home</button>
          <button className="hover:text-neutral-600 cursor-pointer">Matches</button>
          <button className="hover:text-neutral-600 cursor-pointer">About</button>
        </div>
      </nav>

      

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-gray-400 text-sm">
        © 2025 CricLive | Built with ❤️
      </footer>
    </div>
  );
};

export default Home;
