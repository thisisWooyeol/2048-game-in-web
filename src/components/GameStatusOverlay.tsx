import React from 'react';

type GameStatusOverlayProps = {
  status: 'win' | 'lose';
  newGameButton: React.ReactNode;
};

export const GameStatusOverlay: React.FC<GameStatusOverlayProps> = ({
  status,
  newGameButton,
}) => {
  const isWin = status === 'win';
  const bgColor = isWin
    ? 'bg-teal-300 bg-opacity-50'
    : 'bg-red-300 bg-opacity-50';
  const message = isWin ? 'You Win!' : 'Game Over!';

  return (
    <div
      className={`${bgColor} absolute inset-0 rounded-lg flex flex-col items-center justify-center`}
    >
      <p className="text-5xl font-extrabold mb-4">{message}</p>
      {newGameButton}
    </div>
  );
};
