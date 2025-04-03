import React from "react";

const Home: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Fast React Movies</h1>
            <p className="text-lg text-gray-600 text-center max-w-2xl">
                Discover the latest movies, explore your favorites, and enjoy a seamless
                browsing experience. Built with React, TypeScript, and Tailwind CSS, our
                platform is designed to bring you closer to the world of cinema.
            </p>
            <p className="text-lg text-gray-600 text-center max-w-2xl mt-4">
                Start exploring now and dive into the world of movies like never before!
            </p>
        </div>
    );
};

export default Home;
