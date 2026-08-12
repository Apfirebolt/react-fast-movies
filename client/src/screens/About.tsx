import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface Slide {
  title: string;
  content: string;
}

const About: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const slides: Slide[] = [
    {
      title: "Our Mission",
      content:
        "To create high-quality applications that enhance user experiences and provide immense value to our global audience.",
    },
    {
      title: "Our Vision",
      content:
        "To be a leading provider of innovative, cinematic software solutions that empower and entertain users worldwide.",
    },
    {
      title: "Our Values",
      content:
        "Integrity, relentless innovation, and user satisfaction are at the core of everything we build.",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen bg-slate-950 text-slate-300 font-sans overflow-hidden">
      
      {/* Background Decorative Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-indigo-500/10 blur-3xl pointer-events-none rounded-full" />

      {/* Main Content Container */}
      <main className="relative z-10 flex flex-col items-center w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        
        {/* Intro Section */}
        <section className="w-full max-w-3xl mb-16 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-6">
            <span>✨ The Vision Behind Monstella</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
            Discover What <span className="text-indigo-400">Drives Us.</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            Welcome to Monstella, your gateway to unparalleled cinematic experiences. This platform is built upon a foundation of modern technologies—React, TypeScript, and Tailwind CSS—with a single goal: to provide a seamless, enjoyable, and high-performance journey for every user.
          </p>
          <p className="mt-6 text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
            Explore our core principles and discover the commitment that brings this vision to life. Thank you for joining us!
          </p>
        </section>

        {/* Custom Framer Motion Carousel Section */}
        <section className="w-full max-w-3xl">
          <div className="relative px-2 sm:px-8 lg:px-0">
            
            {/* Animated Slide Container */}
            <div className="overflow-hidden rounded-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 50, scale: 0.98 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -50, scale: 0.98 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="bg-slate-900/60 border border-slate-800/80 rounded-2xl shadow-xl hover:shadow-indigo-500/5 transition-shadow duration-300 p-8 sm:p-10 flex flex-col h-full min-h-[160px] sm:min-h-[180px] justify-between"
                >
                  <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight mb-4 group-hover:text-indigo-400 transition-colors">
                    {slides[currentSlide].title}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                    {slides[currentSlide].content}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation Buttons - Tablet & Desktop View (Hidden on mobile) */}
            <div className="hidden sm:flex absolute left-0 right-0 top-1/2 -translate-y-1/2 justify-between px-0 sm:-px-8 lg:-px-16 pointer-events-none">
              <button
                onClick={prevSlide}
                className="w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 text-indigo-400 border border-slate-700/60 backdrop-blur-sm flex items-center justify-center transition-all duration-200 pointer-events-auto transform hover:scale-105 active:scale-95"
                aria-label="Previous Slide"
              >
                <FaArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={nextSlide}
                className="w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 text-indigo-400 border border-slate-700/60 backdrop-blur-sm flex items-center justify-center transition-all duration-200 pointer-events-auto transform hover:scale-105 active:scale-95"
                aria-label="Next Slide"
              >
                <FaArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Pagination Indicators */}
            <div className="flex justify-center mt-10 space-x-2.5">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentSlide 
                      ? "w-8 h-2.5 bg-indigo-500 shadow-lg shadow-indigo-500/20" 
                      : "w-2.5 h-2.5 bg-slate-700 hover:bg-slate-600"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
            
            {/* Mobile Navigation Buttons (Hidden on sm and up) */}
            <div className="flex sm:hidden items-center justify-center space-x-6 mt-8 pointer-events-auto">
                <button
                    onClick={prevSlide}
                    className="w-12 h-12 rounded-full bg-slate-800/80 hover:bg-slate-700 text-indigo-400 border border-slate-700/60 flex items-center justify-center transition-colors duration-200"
                    aria-label="Previous Slide"
                >
                    <FaArrowLeft className="w-5 h-5" />
                </button>

                <button
                    onClick={nextSlide}
                    className="w-12 h-12 rounded-full bg-slate-800/80 hover:bg-slate-700 text-indigo-400 border border-slate-700/60 flex items-center justify-center transition-colors duration-200"
                    aria-label="Next Slide"
                >
                    <FaArrowRight className="w-5 h-5" />
                </button>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
};

export default About;