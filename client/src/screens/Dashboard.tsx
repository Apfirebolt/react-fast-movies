import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Dashboard</h1>
      <p className="text-lg text-gray-600 text-center max-w-2xl">
        Welcome to your dashboard! Here you can manage your account, track your
        favorite movies, and explore personalized recommendations.
      </p>
      <p className="text-lg text-gray-600 text-center max-w-2xl mt-4">
        Use the navigation menu to access different sections and make the most
        of your experience.
      </p>
    </div>
  );
};

export default Dashboard;
