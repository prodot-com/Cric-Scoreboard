import React from "react";
import mobileVersion from "../assets/MobileView.png";
import { Star, BarChart, Zap, Heart, Github, Linkedin, Mail} from "lucide-react";
import LiveTime from "./LiveTime";
import { useNavigate } from "react-router-dom";
import { LivePage_URL } from "../Utilities/Constant.js";

const Home = () => {

  const navigate = useNavigate()

  return (
    <div className="font-mono min-h-screen bg-black text-white flex flex-col items-center">
  {/* Navbar */}
  <div className="mt-5 bg-neutral-800/65 sm:max-w-[1330px] fixed max-w-[350px]
  sm:max-h-[77px]
  flex flex-col sm:flex-row justify-between items-center w-full px-4 sm:px-10 pt-5 py-4 
  rounded-2xl z-50 backdrop-blur-sm shadow-2xl
  ">
    <div>
      <h1
  onClick={() => window.location.reload()}
  className="text-2xl sm:text-3xl font-bold text-white cursor-pointer"
>
  CricScoreBoard
</h1>

    </div>
    <div className="flex flex-col sm:flex-row items-center  sm:space-x-5 mt-4 sm:mt-0 sm:gap-4">
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

  {/* Hero Section */}
  <div className="mt-[155px] sm:mt-20 min-h-[590px] sm:min-h-screen w-full relative flex flex-col justify-center items-center px-4 sm:px-6">
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
    <div className="relative  z-10 flex flex-col justify-center items-center text-center">
      <h1
        className="font-bold leading-tight text-5xl sm:text-7xl max-w-full sm:max-w-3xl tracking-tight
        bg-clip-text text-transparent bg-gradient-to-b from-white to-[#FFA600]"
      >
        Experience Live Cricket Like Never Before.
      </h1>
      <p className="mt-6 text-base sm:text-xl text-neutral-300 max-w-full sm:max-w-3xl">
        Track every ball, every run, and every wicket in real-time with smart analytics.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 mt-6 sm:mt-10">
        <button
          onClick={() =>
            document
              .getElementById("about")
              .scrollIntoView({ behavior: "smooth" })
          }
          className="px-6 py-3 cursor-pointer bg-amber-600 text-white rounded-lg text-lg font-semibold shadow-md hover:bg-amber-500 hover:shadow-lg transition duration-300"
        >
          Get Started
        </button>
      </div>
    </div>
  </div>

  {/* About Section */}
  <div
    id="about"
    className=" p-6 sm:p-10 sm:pt-2 pt-3 max-w-[1430px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center"
  >
    {/* Text Content */}
    <div>
      <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
        About Our App
      </h2>
      <p className="mt-4 sm:mt-6 text-base sm:text-xl text-neutral-300 leading-relaxed">
        Our cricket scoring platform is designed to bring the excitement of
        the game to everyone, whether you’re on the field or following from
        home. <span className="text-amber-600 font-semibold">Match admins</span>{" "}
        can easily create matches and update scores ball by ball, while{" "}
        <span className="text-amber-600 font-semibold">fans</span> get to
        experience real-time updates, insights, and complete match summaries
        once the game ends.
      </p>

      {/* Features */}
      <div className="mt-8 sm:mt-10 space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row items-start gap-4 group">
          <div className="p-3 rounded-full bg-amber-500/10 group-hover:bg-amber-500/20 transition">
            <Zap className="text-amber-600 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-white">
              Ball-by-Ball Scoring
            </h3>
            <p className="text-neutral-400 text-sm sm:text-base">
              Match admins can update scores every ball – runs, wickets,
              extras – all in real time.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start gap-4 group">
          <div className="p-3 rounded-full bg-amber-500/10 group-hover:bg-amber-500/20 transition">
            <BarChart className="text-amber-600 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-white">
              Live Scoreboard
            </h3>
            <p className="text-neutral-400 text-sm sm:text-base">
              Fans can track every run, over, and wicket with instant live
              updates, just like a stadium scoreboard.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start gap-4 group">
          <div className="p-3 rounded-full bg-amber-500/10 group-hover:bg-amber-500/20 transition">
            <Star className="text-amber-600 w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-white">
              Match Summaries
            </h3>
            <p className="text-neutral-400 text-sm sm:text-base">
              Once the game ends, get detailed summaries with batting & bowling stats, team performances, and the match result.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8 sm:mt-12">
        <button className="px-6 py-3 cursor-pointer bg-amber-600 hover:bg-amber-500 rounded-lg text-lg font-semibold shadow-lg transition"
        onClick={()=>{navigate('/creation')}}
        >
          Start a Match
        </button>

        <a
  href= {LivePage_URL}
  target="_blank"   // remove this if you want it in the same tab
  rel="noopener noreferrer"
>
  <button className="px-6 py-3 cursor-pointer border border-neutral-400 hover:bg-neutral-800 rounded-lg text-lg font-semibold transition">
    View Live Scores
  </button>
</a>



      </div>
    </div>

    {/* Image / Illustration */}
    <div className="flex justify-center lg:justify-end mt-6 sm:mt-0">
      <img
        src={mobileVersion}
        alt="Cricket App Preview"
        className="w-[300px] sm:w-[350px] h-auto object-contain drop-shadow-2xl rounded-xl hover:scale-105 transition-transform"
      />
    </div>
  </div>

  {/* Stats / Trust Section */}
  <div className="bg-neutral-900 rounded-2xl max-w-[330px] shadow-lg shadow-amber-500/70 py-16 sm:py-20 overflow-hidden w-full sm:max-w-[1430px] mx-auto">
    <div className="max-w-6xl mx-auto text-center mb-8 sm:mb-12 relative z-10">
      <h2 className="text-3xl sm:text-4xl font-bold text-white">
        Why Trust <span className="text-amber-600">CricScoreBoard</span>
      </h2>
      <p className="mt-2 sm:mt-4 text-base sm:text-lg text-neutral-400">
        Powering live matches, connecting fans, and delivering accurate
        stats — every time.
      </p>
    </div>

    <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12 text-center relative z-10">
      <div className="group flex flex-col items-center">
        <Zap className="text-amber-600 w-10 h-10 group-hover:scale-110 transition-transform" />
        <h3 className="text-neutral-300 mt-2">Low Latency</h3>
      </div>

      <div className="group">
        <h3 className="text-4xl sm:text-5xl font-extrabold text-amber-600 group-hover:scale-110 transition-transform">
          99.9%
        </h3>
        <p className="text-neutral-300 mt-2">Accurate Data Delivery</p>
      </div>
    </div>

    {/* Glow background */}
    <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-green-500/5 blur-3xl"></div>
  </div>

  {/* Final CTA */}
  <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-4 text-white">
    <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 sm:mb-6">
      Ready to Experience Live Cricket Like Never Before?
    </h2>
    <p className="text-base sm:text-lg text-center max-w-full sm:max-w-2xl mb-6 sm:mb-8 text-indigo-100">
      Get real-time updates, smart analytics, and live match summaries — all
      in one place.
    </p>
    <div className="flex gap-4">

      <a
  href="http://localhost:5174/"
  target="_blank"   // remove this if you want it in the same tab
  rel="noopener noreferrer"
>
      <button className="px-6 py-3 cursor-pointer bg-amber-600 hover:bg-amber-400 rounded-lg text-lg font-semibold shadow-lg transition">
        Start Watching
      </button>
      </a>
    </div>
  </div>

  

  {/* Footer */}
  <footer className="mt-auto py-6 text-center text-gray-400 text-sm flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
    <span className="text-[12px] sm:text-[15px]">
      ©2025 CricScoreBoard | Built with 🧡
      {/* <Heart strokeWidth={4} className="inline-block w-4 h-4 text-amber-600 mx-1" /> */}
    </span>
  </footer>
</div>

  );
};

export default Home;
