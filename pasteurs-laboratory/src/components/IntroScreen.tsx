import React from 'react';

export const IntroScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="fixed inset-0 bg-lab-brown flex items-center justify-center z-50">
      <div className="max-w-2xl mx-auto p-8 text-lab-cream text-center">
        <h1 className="text-5xl font-serif font-bold mb-4">Pasteur's Laboratory</h1>
        <h2 className="text-2xl mb-8">巴斯德实验室</h2>
        
        <div className="bg-lab-cream text-lab-brown p-6 rounded-lg mb-8 text-left">
          <h3 className="font-bold text-xl mb-4">游戏背景</h3>
          <p className="mb-4">
            1885年，法国科学家路易·巴斯德站在实验室里，面对着一个可怕的挑战：狂犬病。
          </p>
          <p className="mb-4">
            这种致命的疾病通过疯狗咬伤传播，一旦发病，死亡率几乎是100%。无数人因此死去，包括许多孩子。
          </p>
          <p className="mb-4">
            你将扮演巴斯德，通过科学实验找到预防狂犬病的方法。你需要：
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>观察现象，提出假设</li>
            <li>设计并进行实验</li>
            <li>分析数据，调整方案</li>
            <li>最终找到有效的疫苗制备方法</li>
          </ul>
        </div>

        <div className="bg-opacity-30 bg-black p-6 rounded-lg mb-8">
          <h3 className="font-bold text-xl mb-4 text-lab-gold">科学方法</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-bold">🔬 观察</p>
              <p>仔细记录实验现象</p>
            </div>
            <div>
              <p className="font-bold">💡 假设</p>
              <p>基于观察提出解释</p>
            </div>
            <div>
              <p className="font-bold">🧪 实验</p>
              <p>设计实验验证假设</p>
            </div>
            <div>
              <p className="font-bold">📊 结论</p>
              <p>根据结果修正理论</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-lab-gold italic">
            "科学发现来自不断提出假设、实验、观察、修正。失败实验也是有效信息。"
          </p>
          
          <button
            onClick={onStart}
            className="bg-lab-gold text-lab-brown px-8 py-4 rounded-lg font-bold text-xl hover:bg-opacity-90 transition-all"
          >
            开始实验
          </button>
        </div>

        <p className="text-sm mt-8 opacity-70">
          提示：游戏会自动保存进度。你可以随时关闭浏览器，下次继续。
        </p>
      </div>
    </div>
  );
};
