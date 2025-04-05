import React from "react";

interface HeroProps {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  backgroundImage,
}) => {
  return (
    <div
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "60vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1 style={{ fontSize: "3rem", margin: "0.5rem 0" }}>{title}</h1>
      <p style={{ fontSize: "1.5rem", margin: "0.5rem 0" }}>{subtitle}</p>
    </div>
  );
};

export default Hero;
