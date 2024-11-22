import React from 'react';

type GameStatusOverlayProps = {
  status: 'win' | 'lose';
  newGameButton: React.ReactNode;
};

export const GameStatusOverlay = ({
  status,
  newGameButton,
}: GameStatusOverlayProps) => {
  const isWin = status === 'win';
  const bgColor = isWin
    ? 'bg-teal-300 bg-opacity-50'
    : 'bg-red-300 bg-opacity-50';
  const message = isWin ? 'You Win!' : 'Game Over!';

  return (
    <div
      className={`${bgColor} absolute inset-0 flex flex-col items-center justify-center rounded-lg`}
    >
      <p className="mb-4 text-5xl font-extrabold">{message}</p>
      {newGameButton}
    </div>
  );
};
