import React from "react";

const Home = () => {
  return (
    <div className="font-mono min-h-screen 
    
     text-white flex flex-col">
      {/* Navbar */}
      <div className="flex justify-between items-center px-8 py-4  bg-opacity-70 text-black">
        <h1 className="text-3xl font-bold">CricScoreBoard</h1>
        <div className="space-x-6">
          <button className="hover:text-neutral-200 cursor-pointer">Github</button>
          <button className="hover:text-neutral-200 cursor-pointer">Email</button>
          <button className="hover:text-neutral-200 cursor-pointer">LinkedIn</button>
        </div>
      </div>

      <div className="min-h-screen w-full bg-black relative">
    {/* Ember Glow Background */}
    <div
      className="absolute inset-0 z-0"
      style={{
        backgroundImage: `
          radial-gradient(circle at 50% 100%, rgba(255, 69, 0, 0.6) 0%, transparent 60%),
          radial-gradient(circle at 50% 100%, rgba(255, 140, 0, 0.4) 0%, transparent 70%),
          radial-gradient(circle at 50% 100%, rgba(255, 215, 0, 0.3) 0%, transparent 80%)
        `,
      }}
    />
    {/* Your Content/Components */}
    <div className="relative z-10">
    <div className="flex flex-col justify-center items-center  min-h-100">
        <h1 className="font-bold leading-tight text-6xl max-w-3xl text-center tracking-tight
        ">
          Experience Live Cricket Like Never Before.
        </h1>
        <p className='mx-auto mt-10 max-w-3xl text-center text-xl  selection:bg-white'>
          Track every ball, every run, and every wicket in real-time with smart analytics.
        </p>
      </div>

      <div className="flex flex-col justify-center items-center mb-5">
        
        <button className='relative border border-neutral-300 px-4 py-2 rounded-3xl text-white hover:bg-neutral-500 cursor-pointer'>
              <div className='absolute inset-x-0 -bottom-px h-px w-full bg-gradient-to-r 
              from-transparent via-sky-600 to-transparent'></div>
              Get Started</button>

      </div>

      
      <div className="p-5 max-w-[1430px] mx-auto grid lg:grid-cols-2 gap-12 items-center">
    
    {/* Text Content */}
    <div className="">
      <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
        About Our App
      </h2>
      <p className="mt-6 text-lg sm:text-xl text-neutral-300">
        Our live cricket platform is built for fans who don’t just watch the game, but 
        <span> feel every moment</span>.  
        From ball-by-ball updates to smart insights powered by analytics, we bring the stadium atmosphere right to your screen.
      </p>

      {/* Features */}
      <div className="mt-10 space-y-6">
        <div className="flex items-start gap-4">
          
          <div>
            <h3 className="text-xl font-semibold text-white">Real-Time Updates</h3>
            <p className="text-neutral-400">Never miss a ball. Follow every run, wicket, and over as it happens.</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          
          <div>
            <h3 className="text-xl font-semibold text-white">Smart Analytics</h3>
            <p className="text-neutral-400">Player strike rates, run rates, and predictive match stats – all in one place.</p>
          </div>
        </div>
        <div className="flex items-start gap-4">
          
          <div>
            <h3 className="text-xl font-semibold text-white">Match Summaries</h3>
            <p className="text-neutral-400">Get instant match highlights with batting & bowling summaries and results.</p>
          </div>
        </div>
      </div>
    </div>

    {/* Image / Illustration */}
    <div className="flex justify-center">
      <img
        src="https://img.icons8.com/external-flaticons-lineal-color-flat-icons/512/external-cricket-sports-flaticons-lineal-color-flat-icons.png"
        alt="Cricket Illustration"
        className="w-80 h-80 object-contain drop-shadow-lg"
      />
    </div>
      </div></div>
  </div>

  <div className="flex flex-col items-center justify-center py-20  text-white">
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
