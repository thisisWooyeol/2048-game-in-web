import './App.css';

import { useEffect, useState } from 'react';

import { 
  getCellColor,
  getRandomPos, 
  isGameLose, 
  isGameWin, 
  type Map2048, 
  moveMapIn2048Rule, 
  resetMap, 
  stringDirectionMap
} from './Map2048';
import {
  loadGameState,
  saveGameState,
} from './utils/localStorage';


function App() {
  const rowLength: number = 4;
  const columnLength: number = 4;

  // Initialize state with data from Local Storage or start fresh
  const initialState = loadGameState();
  const [map, setMap] = useState<Map2048>(
    initialState !== undefined ? initialState.map : resetMap(rowLength, columnLength)
  );
  const [score, setScore] = useState<number>(initialState !== undefined ? initialState.score : 0);
  const [bestScore, setBestScore] = useState<number>(
    initialState !== undefined ? initialState.bestScore : 0
  );
  const [gameStatus, setGameStatus] = useState<'playing' | 'win' | 'lose'>(
    initialState !== undefined ? initialState.gameStatus : 'playing'
  );

  const [keyPressed, setKeyPressed] = useState<string>('');

  const newGameHandler = () => {
    setMap(resetMap(rowLength, columnLength));
    setScore(0);
    setGameStatus('playing');
    console.info('New game started!');
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
    const handleKeyUp = (event: WindowEventMap['keydown']) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
        setKeyPressed(event.key);
        console.debug(`Arrow key pressed: ${event.key}`);
      }
    };

    window.addEventListener('keydown', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    // only move when gameState is playing
    if (gameStatus !== 'playing') return;

    const direction = stringDirectionMap[keyPressed];
    if (direction !== undefined) {
      const { result, isMoved, newPoints } = moveMapIn2048Rule(map, direction);
      // Update the map state if moved
      if (isMoved) {
        const newBlockPos: number | null = getRandomPos(result);
        if (newBlockPos !== null) {
          const pos = newBlockPos;
          const row = result[Math.floor(pos / rowLength)];
          if (row !== undefined) {
            row[pos % columnLength] = 2;
            console.debug(`New block at: ${Math.floor(pos / rowLength)}, ${pos % columnLength}`);
          }
        }
        setMap(result);
        setScore(prevScore => prevScore + newPoints);
      }
      setKeyPressed('');

      // check if the game is over
      if (isGameWin(result)) {
        setGameStatus('win');
        console.info('You win!');
      }
      else if (isGameLose(result)) {
        setGameStatus('lose');
        console.info('You lose!');
      }
    }
  }, [gameStatus, keyPressed, map]);

  useEffect(() => {
    setBestScore(prevBestScore => Math.max(prevBestScore, score));
  }, [score]);

  useEffect(() => {
    saveGameState({ map, score, bestScore, gameStatus });
  }, [map, score, bestScore, gameStatus]);

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='grid grid-flow-row gap-5 max-w-lg'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row justify-between items-center w-full space-y-2'>
          {/* Game Title */}
          <div className='font-sans font-extrabold text-7xl'>
            2048
          </div>

          {/* Score and Best Score Container */}
          <div className='flex space-x-4'>
            {/* Score Block */}
            <div className='flex flex-col items-center bg-gray-200 rounded-lg shadow-md p-4'>
              <div className='text-sm font-semibold text-gray-700'>
                SCORE
              </div>
              <div className='text-2xl font-bold text-gray-900'>
                {score}
              </div>
            </div>
            {/* Best Score Block */}
            <div className='flex flex-col items-center bg-gray-200 rounded-lg shadow-md p-4'>
              <div className='text-sm font-semibold text-gray-700'>
                BEST
              </div>
              <div className='text-2xl font-bold text-gray-900'>
                {bestScore}
              </div>
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
              Array.from({ length: columnLength }, (_, columnIndex) => {
                const cellValue = map[rowIndex]?.[columnIndex];
                return (
                  <div
                    key={rowIndex * rowLength + columnIndex}
                    className={`aspect-square rounded flex items-center justify-center text-3xl font-extrabold 
                      ${getCellColor(cellValue)} transition-colors duration-300`}
                  >
                    {cellValue}
                  </div>
                );
              })
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
              <p className='text-5xl font-extrabold mb-4'>Game Over!</p>
              {newGameButton('Try again?')}
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
