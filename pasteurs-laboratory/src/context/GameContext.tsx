import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { GameState } from '../types/game';
import { getInitialGameState, saveGame, loadGame } from '../utils/gameLogic';

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

type GameAction =
  | { type: 'ADVANCE_TIME'; days?: number }
  | { type: 'ADD_EXPERIMENT'; experiment: any }
  | { type: 'ADD_NOTE'; note: any }
  | { type: 'UPDATE_HYPOTHESIS'; hypothesisId: string; updates: Partial<any> }
  | { type: 'ADD_HYPOTHESIS'; hypothesis: any }
  | { type: 'UPDATE_RESOURCES'; resources: Partial<any> }
  | { type: 'UPDATE_ANIMALS'; animals: any[] }
  | { type: 'ADVANCE_STAGE'; stage: any }
  | { type: 'ADD_MILESTONE'; milestone: string }
  | { type: 'ADD_EVENT'; event: any }
  | { type: 'SET_GAME_RESULT'; result: 'win' | 'lose' | null }
  | { type: 'LOAD_GAME'; state: GameState }
  | { type: 'RESET_GAME' };

const GameContext = createContext<GameContextType | undefined>(undefined);

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'ADVANCE_TIME': {
      const days = action.days || 1;
      let newDay = state.day + days;
      let newMonth = state.month;
      let newYear = state.year;

      while (newDay > 30) {
        newDay -= 30;
        newMonth++;
        if (newMonth > 12) {
          newMonth = 1;
          newYear++;
        }
      }

      return { ...state, year: newYear, month: newMonth, day: newDay };
    }

    case 'ADD_EXPERIMENT':
      return { ...state, experiments: [...state.experiments, action.experiment] };

    case 'ADD_NOTE':
      return { ...state, notes: [...state.notes, action.note] };

    case 'UPDATE_HYPOTHESIS':
      return {
        ...state,
        hypotheses: state.hypotheses.map((h) =>
          h.id === action.hypothesisId ? { ...h, ...action.updates } : h
        ),
      };

    case 'ADD_HYPOTHESIS':
      return { ...state, hypotheses: [...state.hypotheses, action.hypothesis] };

    case 'UPDATE_RESOURCES':
      return {
        ...state,
        resources: { ...state.resources, ...action.resources },
      };

    case 'UPDATE_ANIMALS':
      return { ...state, animals: action.animals };

    case 'ADVANCE_STAGE':
      return { ...state, currentStage: action.stage };

    case 'ADD_MILESTONE':
      if (!state.storyProgress.completedMilestones.includes(action.milestone)) {
        return {
          ...state,
          storyProgress: {
            ...state.storyProgress,
            completedMilestones: [...state.storyProgress.completedMilestones, action.milestone],
            stage: state.storyProgress.stage + 1,
          },
        };
      }
      return state;

    case 'ADD_EVENT':
      return {
        ...state,
        storyProgress: {
          ...state.storyProgress,
          historicalEvents: [...state.storyProgress.historicalEvents, action.event],
        },
      };

    case 'SET_GAME_RESULT':
      return { ...state, gameResult: action.result };

    case 'LOAD_GAME':
      return action.state;

    case 'RESET_GAME':
      return getInitialGameState();

    default:
      return state;
  }
};

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, getInitialGameState());

  // Load saved game on mount
  useEffect(() => {
    const saved = loadGame();
    if (saved) {
      dispatch({ type: 'LOAD_GAME', state: saved });
    }
  }, []);

  // Save game on state change
  useEffect(() => {
    saveGame(state);
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
