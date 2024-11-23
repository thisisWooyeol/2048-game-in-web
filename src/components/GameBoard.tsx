import { Tile } from '@/components/Tile';
import { type Map2048 } from '@/constants';

type GameBoardProps = {
  map: Map2048;
};

export const GameBoard = ({ map }: GameBoardProps) => {
  return (
    <div className="grid grid-cols-4 grid-rows-4 gap-4">
      {map.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Tile key={`${rowIndex}-${colIndex}`} value={cell} />
        )),
      )}
    </div>
  );
};
