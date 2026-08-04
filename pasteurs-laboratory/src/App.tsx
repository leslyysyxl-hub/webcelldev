import React, { useState, useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/Header';
import { ExperimentPanel } from './components/ExperimentPanel';
import { NotesPanel } from './components/NotesPanel';
import { StoryPanel } from './components/StoryPanel';
import { ActionPanel } from './components/ActionPanel';
import { AnimalStatus } from './components/AnimalStatus';
import { IntroScreen } from './components/IntroScreen';
import { HumanTrialModal } from './components/HumanTrialModal';
import { GameResultModal } from './components/GameResultModal';

const GameLayout: React.FC = () => {
  const { state } = useGame();
  const [showIntro, setShowIntro] = useState(true);
  const [showHumanTrial, setShowHumanTrial] = useState(false);

  useEffect(() => {
    // Check if this is a new game or loaded game
    const isNewGame = !localStorage.getItem('pasteurs-lab-save');
    if (!isNewGame) {
      setShowIntro(false);
    }
  }, []);

  const handleStartGame = () => {
    setShowIntro(false);
  };

  const canStartHumanTrial = state.currentStage === 'animal_trials' && 
    state.experiments.some(exp => exp.result?.success && exp.method.attenuationMethod === 'drying');

  return (
    <div className="min-h-screen bg-lab-cream">
      {showIntro && <IntroScreen onStart={handleStartGame} />}
      
      {!showIntro && (
        <>
          <Header />
          
          <main className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Left Panel - Equipment & Actions */}
            <div className="space-y-4">
              <ActionPanel />
              <AnimalStatus />
              <StoryPanel />
            </div>

            {/* Center Panel - Experiment */}
            <div className="lg:col-span-1">
              <ExperimentPanel />
            </div>

            {/* Right Panel - Notes */}
            <div className="lg:col-span-1">
              <NotesPanel />
            </div>
          </main>

          {/* Human Trial Modal */}
          {canStartHumanTrial && showHumanTrial && (
            <HumanTrialModal onClose={() => setShowHumanTrial(false)} />
          )}

          {/* Trigger human trial button in ActionPanel */}
          {canStartHumanTrial && (
            <div className="fixed bottom-4 right-4 z-40">
              <button
                onClick={() => setShowHumanTrial(true)}
                className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-red-700 transition-all animate-pulse font-bold"
              >
                ⚕️ 治疗迈斯特
              </button>
            </div>
          )}

          {/* Game Result Modal */}
          <GameResultModal onRestart={() => setShowIntro(true)} />
        </>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <GameProvider>
      <GameLayout />
    </GameProvider>
  );
};

export default App;
