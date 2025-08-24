
import React, { useState } from 'react';
import Game from './components/Game';
import IntroScreen from './components/IntroScreen';

const App: React.FC = () => {
  const [showGame, setShowGame] = useState(false);

  const handleStartGame = () => {
    setShowGame(true);
  };

  const baseClasses = "font-mono bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] text-slate-200 min-h-screen";
  const gameContainerClasses = "flex items-center justify-center p-4";

  return (
    <div className={`${baseClasses} ${showGame ? gameContainerClasses : ''}`}>
      {showGame ? (
        <Game />
      ) : (
        <IntroScreen onStartGame={handleStartGame} />
      )}
    </div>
  );
};

export default App;
