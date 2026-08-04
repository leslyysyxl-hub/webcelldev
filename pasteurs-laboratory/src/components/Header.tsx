import React from 'react';
import { useGame } from '../context/GameContext';

export const Header: React.FC = () => {
  const { state } = useGame();

  return (
    <header className="bg-lab-brown text-lab-cream p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif font-bold">Pasteur's Laboratory</h1>
          <p className="text-sm opacity-80">巴斯德实验室 - 狂犬病疫苗研发</p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-xs opacity-70">日期</p>
            <p className="font-serif">{state.year}年{state.month}月{state.day}日</p>
          </div>
          
          <div className="text-center">
            <p className="text-xs opacity-70">阶段</p>
            <p className="font-serif">{getStageName(state.currentStage)}</p>
          </div>
          
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <p className="text-xs opacity-70">兔子</p>
              <p>{state.resources.rabbits}</p>
            </div>
            <div className="text-center">
              <p className="text-xs opacity-70">狗</p>
              <p>{state.resources.dogs}</p>
            </div>
            <div className="text-center">
              <p className="text-xs opacity-70">病毒样本</p>
              <p>{state.resources.virusSamples}</p>
            </div>
            <div className="text-center">
              <p className="text-xs opacity-70">试剂</p>
              <p>{state.resources.reagents}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const getStageName = (stage: string): string => {
  const names: Record<string, string> = {
    intro: '研究开始',
    research: '基础研究',
    animal_trials: '动物实验',
    human_trial: '人体治疗',
    conclusion: '结论',
  };
  return names[stage] || stage;
};
