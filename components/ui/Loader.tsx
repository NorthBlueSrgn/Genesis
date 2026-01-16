import React from 'react';

const Loader: React.FC<{ text?: string }> = ({ text = "Loading System Data..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400"></div>
      <p className="mt-4 text-purple-300 font-semibold">{text}</p>
    </div>
  );
};

export default Loader;