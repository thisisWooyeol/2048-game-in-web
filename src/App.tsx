import './App.css';

import { useCallback, useEffect, useState } from 'react';

import { GameBoard } from './components/GameBoard';
import { GameInstructions } from './components/GameInstructions';
import { GameStatusOverlay } from './components/GameStatusOverlay';
import { Header } from './components/Header';
import { useKeyPress } from './hooks/useKeyPress';
import { loadGameState, saveGameState } from './utils/localStorage';
import {
  addRandomBlock,
  getCellColor,
  isGameLose,
  isGameWin,
  type Map2048,
  moveMapIn2048Rule,
  resetMap,
  stringDirectionMap,
} from './utils/Map2048';

function App() {
  const rowLength: number = 4;
  const columnLength: number = 4;

  // Initialize state with data from Local Storage or start fresh
  const [map, setMap] = useState<Map2048>(() =>
    loadGameState()?.map ?? resetMap(rowLength, columnLength)
  );
  const [score, setScore] = useState<number>(
    loadGameState()?.score ?? 0
  );
  const [bestScore, setBestScore] = useState<number>(
    loadGameState()?.bestScore ?? 0
  );
  const [gameStatus, setGameStatus] = useState<'playing' | 'win' | 'lose'>(
    loadGameState()?.gameStatus ?? 'playing'
  );

  const [keyPressed, setKeyPressed] = useState('');

  // Event Handlers
  const newGameHandler = useCallback(() => {
    setMap(resetMap(rowLength, columnLength));
    setScore(0);
    setGameStatus('playing');
    console.info('New game started!');
  }, []);
  const newGameButton = useCallback(
    (text: string) => {
      return (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={newGameHandler}
        >
          {text}
        </button>
      );
    },
    [newGameHandler],
  );

  const keyPressHandler = useCallback((key: string) => {
    setKeyPressed(key);
    console.debug(`Arrow key pressed: ${key}`);
  }, []);
  useKeyPress(keyPressHandler);

  useEffect(() => {
    // only move when gameState is playing
    if (gameStatus !== 'playing' || keyPressed === '') return;

    const direction = stringDirectionMap[keyPressed];
    if (direction === undefined) return;

    const { result, isMoved, newPoints } = moveMapIn2048Rule(map, direction);
    if (isMoved) {
      const updatedMap: Map2048 = addRandomBlock(result);
      setMap(updatedMap);
      setScore((prevScore) => prevScore + newPoints);
    }
    // Reset keyPressed state after handling
    setKeyPressed('');

    // check if the game is over
    if (isGameWin(result)) {
      setGameStatus('win');
      console.info('You win!');
    } else if (isGameLose(result)) {
      setGameStatus('lose');
      console.info('You lose!');
    }
  }, [gameStatus, keyPressed, map]);

  useEffect(() => {
    setBestScore((prevBestScore) => Math.max(prevBestScore, score));
  }, [score]);

  useEffect(() => {
    saveGameState({ map, score, bestScore, gameStatus });
  }, [map, score, bestScore, gameStatus]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="grid grid-flow-row gap-5 max-w-lg w-full">
        <Header score={score} bestScore={bestScore} />
        <GameInstructions newGameButton={newGameButton('New Game')} />

        <div className="relative box-border w-full aspect-square p-4 bg-gray-400 rounded-lg">
          <GameBoard map={map} getCellColor={getCellColor} />
          {/* Game Status Overlays */}
          {gameStatus === 'win' && (
            <GameStatusOverlay
              status="win"
              newGameButton={newGameButton('Play Again?')}
            />
          )}
          {gameStatus === 'lose' && (
            <GameStatusOverlay
              status="lose"
              newGameButton={newGameButton('Try Again?')}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
