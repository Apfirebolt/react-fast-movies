import React from "react";
import Slider from "react-slick";

const Profile: React.FC = () => {

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
          <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">Profile</h1>
          <p className="text-lg text-center max-w-2xl mt-4 drop-shadow-md">
            Feel free to explore and learn more about what we do. Thank you for
            visiting!
          </p>
        </div>

        
        <div className="w-full mt-8">
          <Slider dots={true} infinite={true} speed={500} slidesToShow={1} slidesToScroll={1}>
            {slides.map((slide, index) => (
              <div key={index} className="p-4 bg-primary text-accent rounded-lg">
                <h3 className="text-xl font-semibold mb-2">{slide.title}</h3>
                <p>{slide.content}</p>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Profile;
