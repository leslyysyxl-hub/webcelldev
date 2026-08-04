import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

export const ActionPanel: React.FC = () => {
  const { state, dispatch } = useGame();
  const [showHumanTrial, setShowHumanTrial] = useState(false);

  const canStartHumanTrial = state.currentStage === 'animal_trials' && 
    state.experiments.some(exp => exp.result?.success && exp.method.attenuationMethod === 'drying');

  const advanceToAnimalTrials = () => {
    if (state.experiments.length >= 3) {
      dispatch({ type: 'ADVANCE_STAGE', stage: 'animal_trials' });
      dispatch({
        type: 'ADD_EVENT',
        event: {
          id: Date.now().toString(),
          title: '进入动物实验阶段',
          description: '初步研究完成，现在需要进行系统的动物实验来验证假设。',
          date: `${state.year}年${state.month}月`,
          isRead: false,
        },
      });
      dispatch({
        type: 'ADD_NOTE',
        note: {
          id: Date.now().toString(),
          date: `${state.year}年${state.month}月${state.day}日`,
          title: '阶段进展',
          content: '已完成初步观察，进入动物实验阶段。需要找到有效的减毒方法。',
          type: 'conclusion',
        },
      });
    }
  };

  return (
    <div className="bg-lab-brown text-lab-cream p-4">
      <h3 className="font-serif font-bold mb-4 border-b border-lab-gold pb-2">行动</h3>

      <div className="space-y-3">
        <button
          onClick={() => dispatch({ type: 'UPDATE_RESOURCES', resources: { rabbits: state.resources.rabbits + 5, reagents: state.resources.reagents + 10 } })}
          className="w-full py-2 bg-lab-gold text-lab-brown rounded hover:bg-opacity-90 transition-all"
          disabled={state.year > 1886}
        >
          📦 补充实验材料
        </button>

        {state.currentStage === 'intro' && state.experiments.length >= 3 && (
          <button
            onClick={advanceToAnimalTrials}
            className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-all"
          >
            🔬 进入动物实验阶段
          </button>
        )}

        {state.currentStage === 'animal_trials' && canStartHumanTrial && (
          <button
            onClick={() => setShowHumanTrial(true)}
            className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-all animate-pulse"
          >
            ⚕️ 约瑟夫·迈斯特等待治疗
          </button>
        )}

        {state.currentStage === 'animal_trials' && !canStartHumanTrial && (
          <div className="text-sm opacity-80">
            <p>💡 提示：需要进行更多实验，找到有效的减毒方法才能进入人体治疗阶段。</p>
            <p className="mt-1">尝试使用「干燥法」处理病毒样本。</p>
          </div>
        )}

        <div className="pt-4 border-t border-lab-gold">
          <h4 className="font-bold text-sm mb-2">可用动物</h4>
          <div className="flex gap-4 text-sm">
            <span>🐰 兔子：{state.resources.rabbits}</span>
            <span>🐕 狗：{state.resources.dogs}</span>
          </div>
        </div>
      </div>

      {showHumanTrial && (
        <HumanTrialModalWrapper onClose={() => setShowHumanTrial(false)} />
      )}
    </div>
  );
};

// Lazy import wrapper for HumanTrialModal to avoid circular dependency
const HumanTrialModalWrapper: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const HumanTrialModal = React.lazy(() => import('./HumanTrialModal').then(module => ({ default: module.HumanTrialModal })));
  
  return (
    <React.Suspense fallback={<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"><div className="text-white">加载中...</div></div>}>
      <HumanTrialModal onClose={onClose} />
    </React.Suspense>
  );
};
