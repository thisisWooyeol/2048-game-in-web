import React from 'react';

type TileProps = {
  value: number | null;
  getCellColor: (value: number | null) => string;
};

export const Tile: React.FC<TileProps> = ({ value, getCellColor }) => {
  return (
    <div
      className={`aspect-square rounded flex items-center justify-center text-3xl font-extrabold 
        ${getCellColor(value)} transition-colors duration-300`}
    >
      {value}
    </div>
  );
};
