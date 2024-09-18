import React from 'react';

type GameInstructionsProps = {
  newGameButton: React.ReactNode;
};

export const GameInstructions = ({ newGameButton }: GameInstructionsProps) => {
  return (
    <div className="grid grid-cols-4 gap-4 items-center">
      <div className="col-span-3 text-left">
        <p>
          Join the tiles, get to <strong>2048!</strong>
        </p>
        <p>
          Original game link at{' '}
          <a href="https://play2048.co/" style={{ color: 'blue' }}>
            here!
          </a>
        </p>
      </div>
      <div>{newGameButton}</div>
    </div>
  );
};
