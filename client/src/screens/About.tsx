import React from "react";

const About: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">About Us</h1>
            <p className="text-lg text-gray-600 text-center max-w-2xl">
                Welcome to our application! This project is built using modern
                technologies like React, TypeScript, and Tailwind CSS. Our goal is to
                provide a seamless and enjoyable experience for our users.
            </p>
            <p className="text-lg text-gray-600 text-center max-w-2xl mt-4">
                Feel free to explore and learn more about what we do. Thank you for
                visiting!
            </p>
        </div>
    );
};

export default About;