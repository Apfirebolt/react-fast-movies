import React from "react";

interface ContentProps {
  title: string;
  content: string;
}

const Content: React.FC<ContentProps> = ({ title, content }) => {
  return (
    <div>
      <h1 className="text-4xl text-tertiary bg-white shadow-lg px-4 py-3">{title}</h1>
      <p style={{ fontSize: "1.5rem", margin: "0.5rem 0" }}>{content}</p>
    </div>
  );
};

export default Content;
