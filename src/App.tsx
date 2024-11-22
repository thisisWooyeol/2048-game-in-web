import './reset.css';
import './tailwind.css';

import { useCallback, useEffect, useState } from 'react';

import { GameBoard } from '@/components/GameBoard';
import { GameInstructions } from '@/components/GameInstructions';
import { GameStatusOverlay } from '@/components/GameStatusOverlay';
import { Header } from '@/components/Header';
import { useKeyPress } from '@/hooks/useKeyPress';
import { loadGameState, saveGameState } from '@/utils/localStorage';
import {
  addRandomBlock,
  isGameLose,
  isGameWin,
  type Map2048,
  moveMapIn2048Rule,
  resetMap,
  stringDirectionMap,
} from '@/utils/Map2048';

export const App = () => {
  const rowLength: number = 4;
  const columnLength: number = 4;

  // Initialize state with data from Local Storage or start fresh
  const [map, setMap] = useState<Map2048>(
    () => loadGameState()?.map ?? resetMap(rowLength, columnLength),
  );
  const [score, setScore] = useState<number>(loadGameState()?.score ?? 0);
  const [bestScore, setBestScore] = useState<number>(
    loadGameState()?.bestScore ?? 0,
  );
  const [gameStatus, setGameStatus] = useState<'playing' | 'win' | 'lose'>(
    loadGameState()?.gameStatus ?? 'playing',
  );

  useEffect(() => {
    saveGameState({ map, score, bestScore, gameStatus });
  }, [map, score, bestScore, gameStatus]);

  // Event Handlers
  const newGameHandler = () => {
    setMap(resetMap(rowLength, columnLength));
    setScore(0);
    setGameStatus('playing');
    console.info('New game started!');
  };
  const newGameButton = (text: string) => {
    return (
      <button
        className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        onClick={newGameHandler}
      >
        {text}
      </button>
    );
  };

  const keyPressHandler = useCallback(
    (key: string) => {
      if (gameStatus !== 'playing') return;
      console.debug('Key Pressed:', key);

      const direction = stringDirectionMap[key];
      if (direction === undefined) return;

      const { result, isMoved, newPoints } = moveMapIn2048Rule(map, direction);
      if (isMoved) {
        const updatedMap: Map2048 = addRandomBlock(result);
        setMap(updatedMap);
        setScore((prevScore) => prevScore + newPoints);
        setBestScore((prevBestScore) =>
          Math.max(prevBestScore, score + newPoints),
        );

        // check if the game is over
        if (isGameWin(updatedMap)) {
          setGameStatus('win');
          console.info('You win!');
        } else if (isGameLose(updatedMap)) {
          setGameStatus('lose');
          console.info('You lose!');
        }
      }
    },
    [gameStatus, map, score],
  );

  useKeyPress(keyPressHandler);

  return (
    <div className="flex h-dvh max-w-7xl items-center justify-center p-8">
      <div className="grid w-full max-w-lg grid-flow-row gap-5">
        <Header score={score} bestScore={bestScore} />
        <GameInstructions newGameButton={newGameButton('New Game')} />

        <div className="relative box-border aspect-square w-full rounded-lg bg-gray-400 p-4">
          <GameBoard map={map} />
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
};
