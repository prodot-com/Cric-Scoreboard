import React from "react";
import mobileVersion from "../assets/MobileView.png";
import { Star, BarChart, Zap } from "lucide-react"; // icons for features

const Home = () => {
  return (
    <div className="font-mono min-h-screen bg-black text-white flex flex-col">
      {/* Navbar */}
      <div className="flex justify-between items-center px-8 py-4 bg-black">
        <h1 className="text-3xl font-bold text-white">CricScoreBoard</h1>
        <div className="space-x-6">
          <button className="hover:text-green-400 cursor-pointer">Github</button>
          <button className="hover:text-green-400 cursor-pointer">Email</button>
          <button className="hover:text-green-400 cursor-pointer">LinkedIn</button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="min-h-screen w-full relative">
        {/* Ember Glow Background */}
        <div
          className="absolute inset-0 z-0 opacity-90 animate-pulseMe"
          style={{
            backgroundImage: `
              radial-gradient(circle at 50% 100%, rgba(255, 69, 0, 0.6) 0%, transparent 60%),
              radial-gradient(circle at 50% 100%, rgba(255, 140, 0, 0.4) 0%, transparent 70%),
              radial-gradient(circle at 50% 100%, rgba(255, 215, 0, 0.3) 0%, transparent 80%)
            `,
          }}
        />
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center min-h-screen px-6">
          <h1
            className="font-bold leading-tight text-6xl sm:text-7xl max-w-3xl text-center tracking-tight
            bg-clip-text text-transparent bg-gradient-to-b from-white to-[#FFA600]"
          >
            Experience Live Cricket Like Never Before.
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-center text-xl text-neutral-300">
            Track every ball, every run, and every wicket in real-time with smart analytics.
          </p>

          <div className="flex gap-6 mt-10">
  <button className="px-6 py-3 bg-amber-600 text-white rounded-lg text-lg font-semibold shadow-md hover:bg-amber-500 hover:shadow-lg transition duration-300">
    Get Started
  </button>
  <button className="px-6 py-3 border border-neutral-400 text-neutral-200 rounded-lg text-lg font-semibold hover:bg-neutral-800 hover:text-white transition duration-300">
    Learn More
  </button>
</div>

        </div>
      </div>

      {/* About Section */}
      <div className="p-10 max-w-[1430px] mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">About Our App</h2>
          <p className="mt-6 text-lg sm:text-xl text-neutral-300">
            Our live cricket platform is built for fans who don’t just watch the game, but
            <span className="text-white font-semibold"> feel every moment</span>.  
            From ball-by-ball updates to smart insights powered by analytics, we bring the stadium atmosphere right to your screen.
          </p>

          {/* Features */}
          <div className="mt-10 space-y-6">
            <div className="flex items-start gap-4">
              <Zap className="text-green-400 w-6 h-6" />
              <div>
                <h3 className="text-xl font-semibold">Real-Time Updates</h3>
                <p className="text-neutral-400">
                  Never miss a ball. Follow every run, wicket, and over as it happens.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <BarChart className="text-green-400 w-6 h-6" />
              <div>
                <h3 className="text-xl font-semibold">Smart Analytics</h3>
                <p className="text-neutral-400">
                  Player strike rates, run rates, and predictive match stats – all in one place.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Star className="text-green-400 w-6 h-6" />
              <div>
                <h3 className="text-xl font-semibold">Match Summaries</h3>
                <p className="text-neutral-400">
                  Get instant highlights with batting & bowling summaries and results.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Image / Illustration */}
        <div className="flex justify-center">
          <img
            src={mobileVersion}
            alt="Cricket App Preview"
            className="w-96 h-auto object-contain drop-shadow-lg"
          />
        </div>
      </div>

      {/* Stats / Trust Section */}
      <div className="bg-neutral-900 py-16">
        <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-10 text-center">
          <div>
            <h3 className="text-5xl font-bold text-green-400">10K+</h3>
            <p className="text-neutral-300 mt-2">Live Matches Covered</p>
          </div>
          <div>
            <h3 className="text-5xl font-bold text-green-400">50K+</h3>
            <p className="text-neutral-300 mt-2">Fans Connected</p>
          </div>
          <div>
            <h3 className="text-5xl font-bold text-green-400">99.9%</h3>
            <p className="text-neutral-300 mt-2">Accuracy in Data</p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="flex flex-col items-center justify-center py-20 px-4 text-white">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-6">
          Ready to Experience Live Cricket Like Never Before?
        </h2>
        <p className="text-lg text-center max-w-2xl mb-8 text-indigo-100">
          Get real-time updates, smart analytics, and live match summaries — all in one place.
        </p>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-green-500 hover:bg-green-600 rounded-lg text-lg font-semibold shadow-lg transition">
            Start Watching
          </button>
          <button className="px-6 py-3 bg-white text-indigo-700 hover:bg-gray-200 rounded-lg text-lg font-semibold shadow-lg transition">
            Learn More
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-gray-400 text-sm">
        © 2025 CricScoreBoard | Built with ❤️
      </footer>
    </div>
  );
};

export default Home;
