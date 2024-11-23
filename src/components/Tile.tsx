type TileProps = {
  value: number | null;
};

export const Tile = ({ value }: TileProps) => {
  const colorName = `bg-tile-${value ?? 'empty'}`;
  return (
    <div
      className={`flex aspect-square items-center justify-center rounded text-3xl font-extrabold ${colorName} transition-colors duration-300`}
    >
      {value}
    </div>
  );
};
