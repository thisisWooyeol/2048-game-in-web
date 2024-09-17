import './App.css';

import { useEffect, useState } from 'react';

import { GameBoard } from './components/GameBoard';
import { GameInstructions } from './components/GameInstructions';
import { GameStatusOverlay } from './components/GameStatusOverlay';
import { Header } from './components/Header';
import {
  loadGameState,
  saveGameState,
} from './utils/localStorage';
import { 
  getCellColor,
  getRandomPos, 
  isGameLose, 
  isGameWin, 
  type Map2048, 
  moveMapIn2048Rule, 
  resetMap, 
  stringDirectionMap
} from './utils/Map2048';


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
        <Header score={score} bestScore={bestScore} />
        <GameInstructions newGameButton={newGameButton('New Game')} />

        <div className='relative box-border w-full aspect-square p-4 bg-gray-400 rounded-lg'>
          <GameBoard map={map} getCellColor={getCellColor} />
          {/* Game Status Overlays */}
          { gameStatus === 'win' &&
            <GameStatusOverlay status='win' newGameButton={newGameButton('Play Again?')} />
          }
          { gameStatus === 'lose' &&
            <GameStatusOverlay status='lose' newGameButton={newGameButton('Try Again?')} />
          }
        </div>
      </div>
    </div>
  );
}

export default App;
