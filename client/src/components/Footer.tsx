import React from "react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const features = [
    {
      title: "Movies",
      description: "Navigate through your favorite movies, view details, and explore trending releases.",
      icon: (
        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      ),
    },
    {
      title: "Playlist",
      description: "Save your favorite movies and curate custom watchlists for your next movie night.",
      icon: (
        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      title: "Tech Stack",
      description: "High performance web app built with FastAPI, React, PostgreSQL, and Tailwind CSS.",
      icon: (
        <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="relative bg-slate-950 text-slate-300 border-t border-slate-800/80 overflow-hidden">
      {/* Background Decorative Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        
        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 hover:bg-slate-900/90 transition-all duration-300 shadow-lg hover:shadow-indigo-500/5 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-semibold text-white group-hover:text-indigo-400 transition-colors">
                  {feature.title}
                </h4>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800/60 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          
          {/* Brand & Copyright */}
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white text-base tracking-wide">
              Monstella
            </span>
            <span>&copy; {currentYear}. All rights reserved.</span>
          </div>

          {/* Built With Badge */}
          <div className="flex items-center space-x-1.5 text-xs sm:text-sm bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
            <span>Built with</span>
            <span className="text-red-500 animate-pulse">❤️</span>
            <span>using</span>
            <span className="text-slate-300 font-medium">React</span>
            <span>&</span>
            <span className="text-slate-300 font-medium">Tailwind CSS</span>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;