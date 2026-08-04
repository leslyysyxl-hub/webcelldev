import React from 'react';
import { useGame } from '../context/GameContext';

export const StoryPanel: React.FC = () => {
  const { state } = useGame();

  const storyEvents = [
    {
      stage: 0,
      title: '研究开始',
      description: '1885年，巴斯德已经在微生物研究领域取得了巨大成就。现在，他将目光投向了可怕的狂犬病。',
      trigger: '游戏开始',
    },
    {
      stage: 1,
      title: '初步观察',
      description: '通过观察感染动物，你发现狂犬病似乎与神经系统有关。需要进行更多实验来验证这个假设。',
      trigger: '完成3次实验',
    },
    {
      stage: 2,
      title: '减毒方法的发现',
      description: '经过多次失败，你发现将感染动物的脊髓干燥可以减弱病毒毒性，同时保留免疫原性。',
      trigger: '成功使用干燥法',
    },
    {
      stage: 3,
      title: '约瑟夫·迈斯特',
      description: '1885年7月6日，一个9岁男孩被疯狗严重咬伤。他的母亲恳求你帮助。这是第一次人体试验的机会，但风险巨大。',
      trigger: '准备就绪',
    },
    {
      stage: 4,
      title: '疫苗的成功',
      description: '迈斯特接受了13次注射，逐渐增加病毒剂量。他存活了下来！这是人类历史上第一次成功的狂犬病疫苗接种。',
      trigger: '成功治疗',
    },
  ];

  const currentEvent = storyEvents.find(e => e.stage === state.storyProgress.stage);

  return (
    <div className="bg-lab-brown text-lab-cream p-4">
      <h3 className="font-serif font-bold mb-2 border-b border-lab-gold pb-1">历史事件</h3>
      
      {currentEvent && (
        <div className="mb-4">
          <h4 className="font-bold text-lab-gold">{currentEvent.title}</h4>
          <p className="text-sm mt-1">{currentEvent.description}</p>
        </div>
      )}

      <div className="space-y-2 max-h-40 overflow-y-auto text-sm">
        {state.storyProgress.historicalEvents.map((event) => (
          <div
            key={event.id}
            className={`p-2 rounded ${event.isRead ? 'bg-opacity-50' : 'bg-lab-gold bg-opacity-30'}`}
          >
            <p className="font-bold">{event.title}</p>
            <p className="text-xs opacity-80">{event.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
