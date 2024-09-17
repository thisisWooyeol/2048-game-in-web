import React from 'react';

type HeaderProps = {
  score: number;
  bestScore: number;
};

export const Header: React.FC<HeaderProps> = ({ score, bestScore }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center w-full space-y-2">
      {/* Game Title */}
      <div className="font-sans font-extrabold text-5xl">2048</div>

      {/* Score and Best Score Container */}
      <div className="flex space-x-4">
        {/* Score Block */}
        <div className="flex flex-col items-center bg-gray-200 rounded-lg shadow-md p-4">
          <div className="text-sm font-semibold text-gray-700">SCORE</div>
          <div className="text-2xl font-bold text-gray-900">{score}</div>
        </div>
        {/* Best Score Block */}
        <div className="flex flex-col items-center bg-gray-200 rounded-lg shadow-md p-4">
          <div className="text-sm font-semibold text-gray-700">BEST</div>
          <div className="text-2xl font-bold text-gray-900">{bestScore}</div>
        </div>
      </div>
    </div>
  );
};
