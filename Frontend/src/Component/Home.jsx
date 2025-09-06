import React from "react";

export default function HomePage() {
  return (
    <div className="font-sans text-gray-900">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-6 bg-white shadow-sm">
        <h1 className="text-2xl font-extrabold text-indigo-600">YourApp</h1>
        <nav className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <a href="#features" className="hover:text-indigo-600">Features</a>
          <a href="#pricing" className="hover:text-indigo-600">Pricing</a>
          <a href="#developers" className="hover:text-indigo-600">Developers</a>
          <a href="#resources" className="hover:text-indigo-600">Resources</a>
        </nav>
        <button className="ml-6 bg-indigo-600 text-white px-5 py-2 rounded-lg shadow hover:bg-indigo-700 transition">
          Get Started
        </button>
      </header>

      {/* Hero Section */}
      <section className="text-center py-24 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <h2 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
          Financial Infrastructure <br /> for Your App
        </h2>
        <p className="text-lg max-w-2xl mx-auto mb-8 opacity-90">
          Build smarter apps with real-time insights, seamless integrations,
          and scalable infrastructure.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition">
            Start Now
          </button>
          <button className="border border-white px-6 py-3 rounded-lg hover:bg-white hover:text-indigo-600 transition">
            View Demo
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-8 max-w-6xl mx-auto">
        <h3 className="text-4xl font-bold text-center mb-12">
          Powerful Features, Simple Setup
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              icon: "⚡",
              title: "Real-Time Insights",
              desc: "Track every action instantly with live dashboards.",
            },
            {
              icon: "⚙️",
              title: "Easy Integration",
              desc: "Install with a single line and scale effortlessly.",
            },
            {
              icon: "🚀",
              title: "Enterprise Ready",
              desc: "Built for performance, security, and global scale.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="text-center p-6 rounded-xl bg-white shadow hover:shadow-lg transition"
            >
              <div className="text-5xl mb-4">{f.icon}</div>
              <h4 className="text-xl font-semibold mb-2">{f.title}</h4>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Customer Logos */}
      <section className="py-16 bg-gray-50">
        <h3 className="text-2xl font-bold text-center mb-10">
          Trusted by leading teams
        </h3>
        <div className="flex justify-center flex-wrap gap-8 opacity-70">
          <div className="h-10 w-28 bg-gray-300 rounded" />
          <div className="h-10 w-28 bg-gray-300 rounded" />
          <div className="h-10 w-28 bg-gray-300 rounded" />
          <div className="h-10 w-28 bg-gray-300 rounded" />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-8 max-w-6xl mx-auto">
        <h3 className="text-4xl font-bold text-center mb-12">
          Simple, Transparent Pricing
        </h3>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            { plan: "Starter", price: "Free", desc: "Best for testing." },
            { plan: "Pro", price: "$19/mo", desc: "For growing teams." },
            { plan: "Enterprise", price: "Custom", desc: "For large-scale apps." },
          ].map((p) => (
            <div
              key={p.plan}
              className="p-8 border rounded-xl text-center shadow hover:shadow-lg transition"
            >
              <h4 className="text-2xl font-bold mb-2">{p.plan}</h4>
              <p className="text-indigo-600 text-3xl font-extrabold mb-4">{p.price}</p>
              <p className="mb-6 text-gray-600">{p.desc}</p>
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
                Choose {p.plan}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center py-24 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to build the future?
        </h2>
        <p className="text-lg mb-8">Start integrating in minutes.</p>
        <button className="bg-white text-indigo-600 font-semibold px-8 py-3 rounded-lg shadow-md hover:bg-gray-100 transition">
          Get Started
        </button>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <h1 className="text-xl font-bold text-white">YourApp</h1>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#features" className="hover:text-white">Features</a>
            <a href="#pricing" className="hover:text-white">Pricing</a>
            <a href="#developers" className="hover:text-white">Developers</a>
            <a href="#resources" className="hover:text-white">Resources</a>
          </div>
        </div>
        <p className="text-center mt-6 text-sm">
          © 2025 YourApp. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
