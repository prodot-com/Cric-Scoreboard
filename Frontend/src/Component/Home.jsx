import React, { useState, useEffect, useRef } from "react";
import { Star, BarChart, Zap, Github, Linkedin, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Hero1 from "../assets/Hero1.png";
import Hero3 from "../assets/Hero3.jpg";
import { LivePage_URL } from "../Utilities/Constant";

const useFadeIn = () => {
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("opacity-0", "translate-y-10");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 },
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);
  return {
    ref,
    className: "opacity-0 translate-y-10 transition-all duration-700 ease-out",
  };
};

// Animated Number Component
const AnimatedNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const end = value;
          if (start === end) return;

          let totalDuration = 1500;
          let startTimestamp = null;

          const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min(
              (timestamp - startTimestamp) / totalDuration,
              1,
            );
            setDisplayValue(parseFloat((progress * (end - start)).toFixed(1)));
            if (progress < 1) {
              window.requestAnimationFrame(step);
            }
          };
          window.requestAnimationFrame(step);
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.5 },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => ref.current && observer.unobserve(ref.current);
  }, [value]);

  return <span ref={ref}>{displayValue}%</span>;
};

// --- Main Page Component ---

const Home = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  // Fade-in animation refs
  const heroFade = useFadeIn();
  const aboutFade = useFadeIn();
  const trustFade = useFadeIn();
  const ctaFade = useFadeIn();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="flex min-h-screen flex-col items-center bg-black font-mono text-white"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(255, 255, 255, 0.03) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      {/* Navbar */}
      <div
        className={`fixed z-50 mt-8 flex w-full max-w-[350px] flex-col items-center justify-between rounded-2xl border transition-all duration-300 sm:max-h-[77px] sm:max-w-[1330px] sm:flex-row sm:px-10 sm:py-4 ${scrolled ? "border-neutral-700 bg-neutral-900/80 shadow-amber-600/30 backdrop-blur-lg" : "border-transparent bg-transparent"}`}
      >
        <h1
          onClick={() => window.location.reload()}
          className="cursor-pointer px-6 py-4 text-2xl font-bold text-white transition hover:text-amber-500 sm:text-3xl"
        >
          CricScoreBoard
        </h1>

        <div className="flex flex-col items-center gap-4 mb-3 sm:mb-0 sm:mt-0 sm:flex-row">
          <div className="flex items-center space-x-6">
            {/* Social Links */}
            <a
              href="https://github.com/prodot-com/Cric-Scoreboard"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-amber-500"
            >
              <Github className="h-6 w-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/ghoshprobal/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-amber-500"
            >
              <Linkedin className="h-6 w-6" />
            </a>
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=xprobal52@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-amber-500"
            >
              <Mail className="h-6 w-6" />
            </a>
          </div>
          <div className="hidden px-2 py-1 text-lg font-bold text-neutral-400 sm:block">
            <LiveTime />
          </div>
        </div>
      </div>

      <div className="relative mt-[155px] flex min-h-[600px] w-full flex-col items-center justify-center overflow-hidden px-4 sm:mt-24 sm:min-h-screen sm:px-6">
        {/* Glow Background */}
        <div
          className="animate-pulseMe absolute -bottom-1/2 left-1/2 z-0 h-full w-[200%] max-w-4xl -translate-x-1/2"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(217, 119, 6, 0.4) 0%, transparent 50%)`,
          }}
        />

        <div
          ref={heroFade.ref}
          className={`relative z-10 text-center ${heroFade.className}`}
        >
          <h1 className="max-w-full bg-gradient-to-b from-white to-amber-500 bg-clip-text text-5xl leading-tight font-bold tracking-tight text-transparent sm:max-w-4xl sm:text-7xl">
            Your Match, Your Scoreboard
          </h1>
          <p className="mx-auto mt-6 max-w-full text-base text-neutral-300 sm:max-w-2xl sm:text-xl">
            Create a match, update scores ball-by-ball, and share a live link
            with your friends. It's that simple.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <button
              onClick={() => navigate("/creation")}
              className="cursor-pointer rounded-lg bg-amber-600 px-6 py-3 text-lg font-semibold text-white shadow-lg shadow-amber-600/30 transition-all duration-300 hover:scale-105 hover:bg-amber-500 active:scale-95"
            >
              Create a Match
            </button>
            <a href={LivePage_URL} target="_blank" rel="noopener noreferrer">
              <button className="w-full cursor-pointer rounded-lg border border-neutral-600 bg-neutral-900/50 px-6 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:border-amber-500 hover:bg-neutral-800 active:scale-95">
                View Live Scores
              </button>
            </a>
          </div>
        </div>
      </div>

      <div
        ref={aboutFade.ref}
        className={`mx-auto grid max-w-[1430px] grid-cols-1 items-center gap-12 p-6 sm:p-12 lg:grid-cols-2 ${aboutFade.className}`}
      >
        <div>
          <h2 className="text-3xl font-bold text-white sm:text-5xl">
            How It Works
          </h2>
          <p className="mt-6 text-base leading-relaxed text-neutral-300 sm:text-lg">
            CricScoreBoard is built for every cricket lover. An{" "}
            <span className="font-semibold text-amber-500">admin</span> can
            create a match in seconds and update scores live. Anyone with the
            link can then{" "}
            <span className="font-semibold text-amber-500">watch</span> the
            match with real-time updates and full summaries.
          </p>
          <div className="mt-10 space-y-8">
            <Feature
              icon={<Zap className="h-6 w-6 text-amber-500" />}
              title="Instant Match Creation"
              desc="Set up your match with team names and overs, and get a shareable link instantly."
            />
            <Feature
              icon={<BarChart className="h-6 w-6 text-amber-500" />}
              title="Live Ball-by-Ball Updates"
              desc="As an admin, score the match live. Viewers see every update in real-time."
            />
            <Feature
              icon={<Star className="h-6 w-6 text-amber-500" />}
              title="Complete Match Summaries"
              desc="Once the match is over, everyone can view detailed stats and results."
            />
          </div>
        </div>

        <div className="group relative mt-6 flex flex-col items-center justify-center gap-6 sm:flex-row lg:mt-0">
          <div className="absolute inset-0 -inset-x-4 -inset-y-8 z-0 rounded-2xl bg-neutral-900/50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <img
            src={Hero1}
            alt="Cricket Preview"
            className="relative z-10 h-auto w-[280px] rounded-xl object-cover shadow-2xl transition-transform duration-300 group-hover:scale-105 sm:w-[320px]"
          />
          <img
            src={Hero3}
            alt="Cricket Preview"
            className="relative z-10 hidden h-auto w-[280px] rounded-xl object-cover shadow-2xl transition-transform duration-300 group-hover:scale-105 sm:block sm:w-[300px]"
          />
        </div>
      </div>

      <div
        ref={trustFade.ref}
        className={`relative mx-auto my-12 w-full max-w-[330px] rounded-2xl bg-neutral-900/50 py-16 shadow-lg shadow-amber-600/20 sm:max-w-[1430px] sm:py-20 ${trustFade.className}`}
      >
        <div className="relative z-10 mb-12 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Why Trust <span className="text-amber-500">CricScoreBoard</span>
          </h2>
          <p className="mt-4 text-base text-neutral-400 sm:text-lg">
            Powering live matches, delivering accurate stats, and connecting
            fans worldwide.
          </p>
        </div>
        <div className="relative z-10 mx-auto grid max-w-4xl grid-cols-1 gap-10 text-center sm:grid-cols-2">
          <div className="flex flex-col items-center">
            <Zap className="h-12 w-12 text-amber-500" />
            <h3 className="mt-2 text-lg text-neutral-300">
              Low Latency Updates
            </h3>
          </div>
          <div>
            <h3 className="text-4xl font-extrabold text-amber-500 sm:text-5xl">
              <AnimatedNumber value={99.9} />
            </h3>
            <p className="mt-2 text-neutral-300">Accurate Data Delivery</p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div
        ref={ctaFade.ref}
        className={`flex w-full flex-col items-center justify-center bg-gradient-to-t from-amber-900/20 via-black to-black px-6 py-20 text-center ${ctaFade.className}`}
      >
        <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
          Ready to Start Scoring?
        </h2>
        <p className="mb-8 max-w-2xl text-base text-neutral-300 sm:text-lg">
          Create your first match and share the excitement of live cricket. It's
          free and easy to get started.
        </p>
        <button
          className="cursor-pointer rounded-lg bg-amber-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-amber-600/40 transition-all duration-300 hover:scale-105 hover:bg-amber-500 active:scale-95"
          onClick={() => navigate("/creation")}
        >
          Create Your Match Now
        </button>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-neutral-800 py-6 text-center text-sm text-gray-500">
        ©{new Date().getFullYear()} CricScoreBoard | Built with 🏏
      </footer>
    </div>
  );
};

// --- Child Components ---

const LiveTime = () => {
  const [time, setTime] = useState("");
  useEffect(() => {
    const timerId = setInterval(() => {
      const options = {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      setTime(new Date().toLocaleTimeString("en-US", options));
    }, 1000);
    return () => clearInterval(timerId);
  }, []);
  return <div>{time} IST</div>;
};

const Feature = ({ icon, title, desc }) => (
  <div className="group flex flex-col items-start gap-4 rounded-lg p-4 transition-colors duration-300 hover:bg-neutral-900/50 sm:flex-row">
    <div className="rounded-full bg-amber-500/10 p-3 transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-500/20">
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-semibold text-white sm:text-xl">{title}</h3>
      <p className="text-sm text-neutral-400 sm:text-base">{desc}</p>
    </div>
  </div>
);

export default Home;
