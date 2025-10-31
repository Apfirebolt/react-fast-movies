import React from "react";

interface ContentProps {
  title: string;
  content: string;
}

const Content: React.FC<ContentProps> = ({ title, content }) => {
  return (
    <div className="w-full mx-auto p-2">
      <h1 className="text-4xl text-tertiary text-center bg-white shadow-lg px-4 py-3">{title}</h1>
      <p className="my-2 text-lg">{content}</p>
    </div>
  );
};

export default Content;


