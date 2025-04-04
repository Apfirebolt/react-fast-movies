import React from "react";

const Loader: React.FC = () => {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="w-64 h-64 border-4 border-t-4 border-t-primary border-tertiary rounded-full animate-spin"></div>
        </div>
    );
};

export default Loader;