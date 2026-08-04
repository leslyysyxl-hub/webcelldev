import React from 'react';
import { useGame } from '../context/GameContext';

export const GameResultModal: React.FC<{ onRestart: () => void }> = ({ onRestart }) => {
  const { state, dispatch } = useGame();

  if (!state.gameResult) return null;

  const isWin = state.gameResult === 'win';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className={`p-8 rounded-lg max-w-lg w-full text-center ${isWin ? 'bg-green-100' : 'bg-red-100'}`}>
        <h2 className={`text-3xl font-serif font-bold mb-4 ${isWin ? 'text-green-800' : 'text-red-800'}`}>
          {isWin ? '🏆 胜利！' : '💔 失败'}
        </h2>

        {isWin ? (
          <div className="space-y-4 text-left">
            <p className="text-lg">
              恭喜你成功研发出狂犬病疫苗！
            </p>
            <p>
              1885年7月6日，约瑟夫·迈斯特成为第一个接受狂犬病疫苗接种的人类。他存活了下来，这标志着人类战胜狂犬病的开始。
            </p>
            <div className="bg-white p-4 rounded border border-green-600">
              <h4 className="font-bold text-green-800">科学启示：</h4>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>科学发现来自不断提出假设、实验、观察、修正</li>
                <li>失败的实验也是有效信息</li>
                <li>科学家需要在不确定条件下，根据证据做决策</li>
                <li>干燥减毒法是巴斯德的关键发现</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-left">
            <p className="text-lg">
              治疗失败了...但科学的道路从来不是一帆风顺的。
            </p>
            <p>
              每一次失败都是学习的机会。巴斯德在真正的历史中也经历了无数次失败，但他从未放弃。
            </p>
            <div className="bg-white p-4 rounded border border-red-600">
              <h4 className="font-bold text-red-800">反思：</h4>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>你是否找到了正确的病毒来源？（神经组织）</li>
                <li>你是否发现了干燥减毒法？</li>
                <li>你是否进行了足够的动物实验？</li>
              </ul>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-4 justify-center">
          <button
            onClick={() => {
              dispatch({ type: 'RESET_GAME' });
              onRestart();
            }}
            className={`px-6 py-3 rounded font-bold ${isWin ? 'bg-green-600 text-white' : 'bg-red-600 text-white'} hover:opacity-90`}
          >
            重新开始
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              dispatch({ type: 'RESET_GAME' });
              onRestart();
            }}
            className="px-6 py-3 border border-lab-brown rounded hover:bg-lab-brown hover:text-white"
          >
            清除存档重来
          </button>
        </div>
      </div>
    </div>
  );
};
