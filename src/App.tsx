import './App.css';

import { useState } from 'react';

import { getRandomInitPos, type Map2048 } from './Map2048';


function App() {
  const rowLength: number = 4;
  const columnLength: number = 4;
  const initPos: number[][] = getRandomInitPos(rowLength, columnLength);

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
                className='aspect-square bg-gray-300 rounded-lg flex items-center justify-center text-3xl font-bold'>
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
