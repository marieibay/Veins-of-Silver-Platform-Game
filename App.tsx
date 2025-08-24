
import React from 'react';
import Game from './components/Game';

const App: React.FC = () => {
  return (
    <div className="font-mono bg-gradient-to-br from-[#0a0a0a] via-[#1a1a2e] to-[#16213e] text-slate-200 min-h-screen flex items-center justify-center p-4">
      <Game />
    </div>
  );
};

export default App;
