type HeaderProps = {
  score: number;
  bestScore: number;
};

export const Header = ({ score, bestScore }: HeaderProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-between space-y-2 sm:flex-row">
      {/* Game Title */}
      <div className="font-sans text-5xl font-extrabold">2048</div>

      {/* Score and Best Score Container */}
      <div className="flex space-x-4">
        {/* Score Block */}
        <div className="flex flex-col items-center rounded-lg bg-gray-200 p-4 shadow-md">
          <div className="text-sm font-semibold text-gray-700">SCORE</div>
          <div className="text-2xl font-bold text-gray-900">{score}</div>
        </div>
        {/* Best Score Block */}
        <div className="flex flex-col items-center rounded-lg bg-gray-200 p-4 shadow-md">
          <div className="text-sm font-semibold text-gray-700">BEST</div>
          <div className="text-2xl font-bold text-gray-900">{bestScore}</div>
        </div>
      </div>
    </div>
  );
};
