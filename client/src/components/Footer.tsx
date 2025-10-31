import React from "react";

const Footer: React.FC = () => {


  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto text-center">
        <p className="text-lg">
          &copy; {new Date().getFullYear()} Fast React Movies. All rights
          reserved.
        </p>
        <p className="text-sm my-3">Built with ❤️ using React and Tailwind CSS.</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="shadow-lg px-2 py-3">
          <h4 className="text-lg font-semibold">
            Movies
          </h4>
          <p>
            Navigate through your favorite movies
          </p>
        </div>
        <div className="shadow-lg px-2 py-3">
          <h4 className="text-lg font-semibold">
            Playlist
          </h4>
          <p>
            Save your favorite movies and create watchlist
          </p>
        </div>
        <div className="shadow-lg px-2 py-3">
          <h4 className="text-lg font-semibold">
            Movies
          </h4>
          <p>
            Navigate through your favorite movies
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
