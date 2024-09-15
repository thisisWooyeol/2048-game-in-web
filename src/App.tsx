import './App.css';

import { useEffect, useState } from 'react';

import { getRandomInitPos, getRandomPos, isGameLose, isGameWin,type Map2048, moveMapIn2048Rule, stringDirectionMap } from './Map2048';


function App() {
  const rowLength: number = 4;
  const columnLength: number = 4;
  const initPos: number[][] = getRandomInitPos(rowLength, columnLength);

  const [keyPressed, setKeyPressed] = useState<string>('');
  const [gameStatus, setGameStatus] = useState<'playing' | 'win' | 'lose'>('playing');

  const [map, setMap] = useState<Map2048>(
    Array.from({ length: rowLength }, (_, rowIndex) =>
      Array.from(
        { length: columnLength },
        (_, columnIndex) => {
          if (initPos.some(pos => pos[0] === rowIndex && pos[1] === columnIndex)) {
            return 2;
          }
          return null;
        },
        ),
      )
    );

  useEffect(() => {
    const handleKeyUp = (event: WindowEventMap['keyup']) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        setKeyPressed(event.key);
        console.info(`Arrow key pressed: ${event.key}`);
      }
    };

    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const direction = stringDirectionMap[keyPressed];
    if (direction !== undefined) {
      const {result, isMoved} = moveMapIn2048Rule(map, direction);
      // Update the map state if moved
      if (isMoved) {
        const newBlockPos: [number, number] | null = getRandomPos(result);
        if (newBlockPos !== null) {
          const [rowIndex, columnIndex] = newBlockPos;
          result[rowIndex][columnIndex] = 2;
          console.info(`New block at: ${rowIndex}, ${columnIndex}`);
        }
        setMap(result);
      }
    }
    setKeyPressed('');
    
    // check if the game is over
    if (isGameWin(map)) {
      setGameStatus('win');
      console.info('You win!');
    }
    else if (isGameLose(map)) {
      setGameStatus('lose');
      console.info('You lose!');
    }
  }, [keyPressed, map]);

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='grid grid-flow-row gap-2 max-w-lg'>
        {/* Header */}
        <div className='grid grid-cols-3'>
          <div className='font-sans font-extrabold m-2 text-5xl'>
            2048
          </div>
          <div className='box-border border-2 border-black m-2'>
            <div className='font-bold'>
              Score
            </div>
            <div>
              0
            </div>
          </div>
          <div className='box-border border-2 border-black m-2'>
            <div className='font-bold'>
              Best
            </div>
            <div>
              0
            </div>
          </div>
        </div>
        
        {/* Game instructions */}
        <div className='grid grid-cols-4 gap-4'>
          <div className='col-span-3'>
            Join the tiles, get to <strong>2048!</strong> <br />
            Original game link at <a href='https://play2048.co/'style={{color: 'blue'}}>here!</a>
          </div>
          <div>
            <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
              New Game
            </button>
            </div>
        </div>

        {/* Game 2048 board */}
        <div className='box-border w-full aspect-square p-4 bg-gray-400 rounded-lg'>
          <div className='grid grid-cols-4 grid-rows-4 gap-4'>
            {Array.from({ length: rowLength}, (_, rowIndex) =>
              Array.from({ length: columnLength }, (_, columnIndex) => 
                <div 
                key={rowIndex * rowLength + columnIndex} 
                className='aspect-square bg-gray-300 rounded flex items-center justify-center text-3xl font-extrabold'>
                  {map[rowIndex]?.[columnIndex]}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
