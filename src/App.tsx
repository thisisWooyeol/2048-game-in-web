import './reset.css';
import './tailwind.css';

import { useCallback, useEffect, useState } from 'react';

import { GameBoard } from '@/components/GameBoard';
import { GameInstructions } from '@/components/GameInstructions';
import { GameStatusOverlay } from '@/components/GameStatusOverlay';
import { Header } from '@/components/Header';
import { type State2048, stringDirectionMap } from '@/constants';
import { useKeyPress } from '@/hooks/useKeyPress';
import { getStorage2048 } from '@/repositories/storage';
import { getRule2048 } from '@/utils/rule';

const { resetGame, isGameWin, isGameLose, move } = getRule2048({
  NUM_ROWS: 4,
  NUM_COLS: 4,
  WINNING_SCORE: 2048,
});
const { loadGameState, saveGameState } = getStorage2048();

export const App = () => {
  const [state2048, setState2048] = useState<State2048>(
    () => loadGameState() ?? resetGame(),
  );

  useEffect(() => {
    saveGameState(state2048);
  }, [state2048]);

  // Event Handlers
  const newGameHandler = () => {
    setState2048((prevState) => ({
      ...resetGame(),
      bestScore: prevState.bestScore,
    }));
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
      if (state2048.gameStatus !== 'playing') return;
      console.debug('Key Pressed:', key);

      const direction = stringDirectionMap[key];
      if (direction === undefined) return;

      const { map, newPoints } = move(state2048.map, direction);

      setState2048((prevState) => ({
        ...prevState,
        map: map,
        score: prevState.score + newPoints,
        bestScore: Math.max(prevState.bestScore, prevState.score + newPoints),
      }));

      // check if the game is over
      if (isGameWin(map)) {
        setState2048((prevState) => ({
          ...prevState,
          gameStatus: 'win',
        }));
        console.info('You win!');
      } else if (isGameLose(map)) {
        setState2048((prevState) => ({
          ...prevState,
          gameStatus: 'lose',
        }));
        console.info('You lose!');
      }
    },
    [state2048.gameStatus, state2048.map],
  );

  useKeyPress(keyPressHandler);

  return (
    <div className="flex h-dvh max-w-7xl items-center justify-center p-8">
      <div className="grid w-full max-w-lg grid-flow-row gap-5">
        <Header score={state2048.score} bestScore={state2048.bestScore} />
        <GameInstructions newGameButton={newGameButton('New Game')} />

        <div className="relative box-border aspect-square w-full rounded-lg bg-gray-400 p-4">
          <GameBoard map={state2048.map} />
          {/* Game Status Overlays */}
          {state2048.gameStatus === 'win' && (
            <GameStatusOverlay
              status="win"
              newGameButton={newGameButton('Play Again?')}
            />
          )}
          {state2048.gameStatus === 'lose' && (
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
