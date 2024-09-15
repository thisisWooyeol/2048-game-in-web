import './App.css';

import { useEffect, useState } from 'react';

import { getRandomPos, isGameLose, isGameWin, type Map2048, moveMapIn2048Rule, resetMap, stringDirectionMap } from './Map2048';


function App() {
  const rowLength: number = 4;
  const columnLength: number = 4;
  const [map, setMap] = useState<Map2048>(resetMap(rowLength, columnLength));

  const [keyPressed, setKeyPressed] = useState<string>('');
  const [gameStatus, setGameStatus] = useState<'playing' | 'win' | 'lose'>('playing');

  const newGameHandler = () => {
    setMap(resetMap(rowLength, columnLength));
    setGameStatus('playing');
  };
  const newGameButton = (text: string) => {
    return (
      <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
      onClick={newGameHandler}>
        {text}
      </button>
    );
  };

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
    // only move when gameState is playing
    if (gameStatus !== 'playing') return;

    const direction = stringDirectionMap[keyPressed];
    if (direction !== undefined) {
      const {result, isMoved} = moveMapIn2048Rule(map, direction);
      // Update the map state if moved
      if (isMoved) {
        const newBlockPos: number | null = getRandomPos(result);
        if (newBlockPos !== null) {
          const pos = newBlockPos;
          result[Math.floor(pos / rowLength)][pos % columnLength] = 2;
          console.info(`New block at: ${Math.floor(pos / rowLength)}, ${pos % columnLength}`);
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
  }, [gameStatus, keyPressed, map]);

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
            <p>Join the tiles, get to <strong>2048!</strong></p>
            <p>Original game link at <a href='https://play2048.co/'style={{color: 'blue'}}>here!</a></p>
          </div>
          <div>
            {newGameButton('New Game')}
          </div>
        </div>

        {/* Game 2048 board */}
        <div className='relative box-border w-full aspect-square p-4 bg-gray-400 rounded-lg'>
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

          {/* Game status */}
          {gameStatus === 'win' && 
            <div className='absolute inset-0 bg-teal-300 bg-opacity-50 rounded-lg flex flex-col items-center justify-center'>
              <p className='text-5xl font-extrabold mb-4'>You Win!</p>
              {newGameButton('Play again?')}
            </div>
          }
          {gameStatus === 'lose' &&
            <div className='absolute inset-0 bg-red-300 bg-opacity-50 rounded-lg flex flex-col items-center justify-center'>
              <p className='text-5xl font-extrabold mb-4'>You Lose!</p>
              {newGameButton('Try again?')}
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
