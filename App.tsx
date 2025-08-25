
import React, { useRef } from 'react';
import Game from './components/Game';
import { GameHandle } from './types';

const App: React.FC = () => {
  const gameRef = useRef<GameHandle>(null);

  const handleSkip = () => {
    gameRef.current?.skipToNextLevel();
  };

  return (
    <div className="font-mono bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] text-slate-200 min-h-screen flex flex-col items-center justify-center p-4">
       <div className="relative">
        <Game ref={gameRef} />
        <button
            onClick={handleSkip}
            className="absolute -top-10 right-0 bg-yellow-500 text-black font-bold py-1 px-3 text-xs z-50 pointer-events-auto"
        >
            Skip Level (Dev)
        </button>
       </div>
    </div>
  );
};

export default App;