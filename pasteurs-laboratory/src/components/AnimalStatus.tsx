import React from 'react';
import { useGame } from '../context/GameContext';

export const AnimalStatus: React.FC = () => {
  const { state } = useGame();

  return (
    <div className="lab-panel p-4">
      <h3 className="font-serif font-bold mb-3 text-lab-brown border-b border-lab-brown pb-2">
        实验动物状态
      </h3>
      
      <div className="space-y-2">
        {state.animals.map((animal) => (
          <div
            key={animal.id}
            className={`p-2 rounded border text-sm flex justify-between items-center ${
              animal.status === 'healthy' ? 'bg-green-50 border-green-300' :
              animal.status === 'infected' ? 'bg-yellow-50 border-yellow-300' :
              animal.status === 'immune' ? 'bg-blue-50 border-blue-300' :
              'bg-red-50 border-red-300'
            }`}
          >
            <span>
              {animal.type === 'rabbit' ? '🐰' : '🐕'} 
              {animal.type === 'rabbit' ? '兔子' : '狗'}
            </span>
            <span className={`font-bold ${
              animal.status === 'healthy' ? 'text-green-600' :
              animal.status === 'infected' ? 'text-yellow-600' :
              animal.status === 'immune' ? 'text-blue-600' :
              'text-red-600'
            }`}>
              {animal.status === 'healthy' ? '健康' :
               animal.status === 'infected' ? '感染' :
               animal.status === 'immune' ? '免疫' : '死亡'}
            </span>
          </div>
        ))}
      </div>

      {state.animals.length === 0 && (
        <p className="text-gray-500 text-sm text-center py-4">没有实验动物</p>
      )}
    </div>
  );
};
