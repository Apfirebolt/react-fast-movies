import React from "react";

const About: React.FC = () => {
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
                    technologies like React, TypeScript, and Tailwind CSS. Our goal is to
                    provide a seamless and enjoyable experience for our users.
                </p>
                <p className="text-lg text-center max-w-2xl mt-4 drop-shadow-md">
                    Feel free to explore and learn more about what we do. Thank you for
                    visiting!
                </p>
            </div>
            </div>
        </div>
    );
};

export default About;