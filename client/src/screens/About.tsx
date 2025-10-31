import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import next and prev icons from react-icons
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const About: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Our Mission",
      content:
        "To create high-quality applications that enhance user experiences and provide value.",
    },
    {
      title: "Our Vision",
      content:
        "To be a leading provider of innovative software solutions that empower users worldwide.",
    },
    {
      title: "Our Values",
      content:
        "Integrity, innovation, and customer satisfaction are at the core of everything we do.",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div
        className="w-full h-full bg-cover bg-center flex flex-col items-center justify-center text-white p-4"
        style={{
          backgroundImage: `url('https://static1.cbrimages.com/wordpress/wp-content/uploads/2018/04/Avengers-Infinity-War-feature.jpg')`,
          minHeight: "100vh",
        }}
      >
        <div className="bg-primary text-accent text-center p-4">
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">About Us</h1>
          <p className="text-lg text-center max-w-2xl drop-shadow-md">
            Welcome to our application! This project is built using modern
            technologies like React, TypeScript, and Tailwind CSS. Our goal is
            to provide a seamless and enjoyable experience for our users.
          </p>
          <p className="text-lg text-center max-w-2xl mt-4 drop-shadow-md">
            Feel free to explore and learn more about what we do. Thank you for
            visiting!
          </p>
        </div>

        <div className="w-full mt-8 text-primary">
          <div className="relative p-8">
            <div className="overflow-hidden rounded-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-lg shadow-lg p-6"
                >
                  <h3 className="text-xl font-semibold mb-2">
                    {slides[currentSlide].title}
                  </h3>
                  <p>{slides[currentSlide].content}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-primary bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
            >
              <FaArrowLeft />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
            >
              <FaArrowRight />
            </button>
          </div>

          <div className="flex justify-center mt-4 space-x-2 mx-12">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? "bg-white" : "bg-white bg-opacity-50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
