import React from "react";
import mobileVersion from "../assets/MobileView.png";
import { Star, BarChart, Zap, Heart, Github, Linkedin, Mail} from "lucide-react";
import CountUp from "react-countup";
import VisibilitySensor from "react-visibility-sensor";

const Home = () => {
  return (
    <div className="font-mono min-h-screen bg-black text-white flex flex-col">
      {/* Navbar */}
      

<div className="flex justify-between items-center px-8 py-4 bg-black">
  <h1 className="text-3xl font-bold text-white">CricScoreBoard</h1>
  <div className="flex items-center space-x-8">
    <a
      href="https://github.com/yourusername"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-amber-600 transition"
    >
      <Github className="w-6 h-6" />
    </a>
    <a
      href="https://linkedin.com/in/yourprofile"
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-amber-600 transition"
    >
      <Linkedin className="w-6 h-6" />
    </a>
    <a
      href="mailto:youremail@gmail.com"
      className="hover:text-amber-600 transition"
    >
      <Mail className="w-6 h-6" />
    </a>
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
            <button
              onClick={() =>
                document
                  .getElementById("about")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="px-6 py-3 bg-amber-600 text-white rounded-lg text-lg font-semibold shadow-md hover:bg-amber-500 hover:shadow-lg transition duration-300"
            >
              Get Started
            </button>
            
          </div>
        </div>
      </div>

      {/* About Section */}
      <div
        id="about"
        className="p-10 pt-3 max-w-[1430px] mx-auto grid lg:grid-cols-2 gap-12 items-center"
      >
        {/* Text Content */}
        <div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight  from-white ">
            About Our App
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-neutral-300 leading-relaxed">
            Our cricket scoring platform is designed to bring the excitement of
            the game to everyone, whether you’re on the field or following from
            home. <span className="text-amber-600 font-semibold">Match admins</span>{" "}
            can easily create matches and update scores ball by ball, while{" "}
            <span className="text-amber-600 font-semibold">fans</span> get to
            experience real-time updates, insights, and complete match summaries
            once the game ends.
          </p>

          {/* Features */}
          <div className="mt-10 space-y-8">
            <div className="flex items-start gap-4 group">
              <div className="p-2 rounded-full bg-amber-500/10 group-hover:bg-amber-500/20 transition">
                <Zap className="text-amber-600 w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Ball-by-Ball Scoring
                </h3>
                <p className="text-neutral-400">
                  Match admins can update scores every ball – runs, wickets,
                  extras – all in real time.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="p-2 rounded-full bg-amber-500/10 group-hover:bg-amber-500/20 transition">
                <BarChart className="text-amber-600 w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Live Scoreboard
                </h3>
                <p className="text-neutral-400">
                  Fans can track every run, over, and wicket with instant live
                  updates, just like a stadium scoreboard.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 group">
              <div className="p-2 rounded-full bg-amber-500/10 group-hover:bg-amber-500/20 transition">
                <Star className="text-amber-600 w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Match Summaries
                </h3>
                <p className="text-neutral-400">
                  Once the game ends, get detailed summaries with batting &
                  bowling stats, team performances, and the match result.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-6 mt-12">
            <button className="px-6 py-3 bg-amber-600 hover:bg-amber-500 rounded-lg text-lg font-semibold shadow-lg transition">
              Start a Match
            </button>
            <button className="px-6 py-3 border border-neutral-400 hover:bg-neutral-800 rounded-lg text-lg font-semibold transition">
              View Live Scores
            </button>
          </div>
        </div>

        {/* Image / Illustration */}
        <div className="flex justify-center">
          <img
            src={mobileVersion}
            alt="Cricket App Preview"
            className="w-[350px] h-auto object-contain drop-shadow-2xl rounded-xl hover:scale-105 transition-transform"
          />
        </div>
      </div>

      {/* Stats / Trust Section */}
      <div className="bg-neutral-900 py-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center mb-12 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Why Trust <span className="text-amber-600">CricScoreBoard</span>
          </h2>
          <p className="mt-4 text-lg text-neutral-400">
            Powering live matches, connecting fans, and delivering accurate
            stats — every time.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 gap-12 text-center relative z-10">
  
        <div className="group flex flex-col items-center">
          <Zap className="text-amber-600 w-10 h-10 group-hover:scale-110 transition-transform" />
            <h3 className="text-neutral-300 mt-2">Low Latency</h3>

        </div>

        <div className="group">
          <h3 className="text-5xl font-extrabold text-amber-600 group-hover:scale-110 transition-transform">
            99.9%
          </h3>
          <p className="text-neutral-300 mt-2">Accurate Data Delivery</p>
        </div>
      </div>


        {/* Glow background */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-green-500/5 blur-3xl"></div>
      </div>

      {/* Final CTA */}
      <div className="flex flex-col items-center justify-center py-20 px-4 text-white">
        <h2 className="text-4xl sm:text-5xl font-bold text-center mb-6">
          Ready to Experience Live Cricket Like Never Before?
        </h2>
        <p className="text-lg text-center max-w-2xl mb-8 text-indigo-100">
          Get real-time updates, smart analytics, and live match summaries — all
          in one place.
        </p>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-amber-600 hover:bg-amber-400 rounded-lg text-lg font-semibold shadow-lg transition">
            Start Watching
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto py-6 text-center text-gray-400 text-sm flex flex-col sm:flex-row items-center justify-center gap-4">
        <span>
        © 2025 CricScoreBoard | Built with
        <Heart strokeWidth={4} className="inline-block w-4 h-4 text-amber-600 mx-1" /> 
        </span>
      </footer>

    </div>
  );
};

export default Home;
