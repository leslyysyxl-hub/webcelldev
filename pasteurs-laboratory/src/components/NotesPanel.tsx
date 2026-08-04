import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { generateId } from '../utils/gameLogic';

export const NotesPanel: React.FC = () => {
  const { state, dispatch } = useGame();
  const [activeTab, setActiveTab] = useState<'notes' | 'hypotheses' | 'experiments'>('notes');
  const [editingHypothesis, setEditingHypothesis] = useState<string | null>(null);
  const [newHypothesisText, setNewHypothesisText] = useState('');

  const addHypothesis = () => {
    if (!newHypothesisText.trim()) return;
    
    dispatch({
      type: 'ADD_HYPOTHESIS',
      hypothesis: {
        id: generateId(),
        statement: newHypothesisText,
        isConfirmed: false,
        isRefuted: false,
        evidence: [],
      },
    });
    setNewHypothesisText('');
  };

  const updateHypothesis = (id: string, updates: any) => {
    dispatch({ type: 'UPDATE_HYPOTHESIS', hypothesisId: id, updates });
  };

  return (
    <div className="lab-panel p-4 h-full flex flex-col">
      <h2 className="text-xl font-serif font-bold mb-4 text-lab-brown border-b border-lab-brown pb-2">
        科学笔记
      </h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-lab-brown">
        <button
          onClick={() => setActiveTab('notes')}
          className={`px-3 py-1 rounded-t ${activeTab === 'notes' ? 'bg-lab-brown text-lab-cream' : 'bg-lab-cream text-lab-brown'}`}
        >
          观察记录
        </button>
        <button
          onClick={() => setActiveTab('hypotheses')}
          className={`px-3 py-1 rounded-t ${activeTab === 'hypotheses' ? 'bg-lab-brown text-lab-cream' : 'bg-lab-cream text-lab-brown'}`}
        >
          假设
        </button>
        <button
          onClick={() => setActiveTab('experiments')}
          className={`px-3 py-1 rounded-t ${activeTab === 'experiments' ? 'bg-lab-brown text-lab-cream' : 'bg-lab-cream text-lab-brown'}`}
        >
          实验数据
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'notes' && (
          <div className="space-y-3">
            {state.notes.slice().reverse().map((note) => (
              <div key={note.id} className="bg-white p-3 rounded border border-lab-brown shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-lab-brown">{note.title}</h4>
                  <span className="text-xs text-gray-500">{note.date}</span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                <span className={`inline-block mt-2 px-2 py-0.5 text-xs rounded ${
                  note.type === 'observation' ? 'bg-blue-100 text-blue-800' :
                  note.type === 'experiment' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {note.type === 'observation' ? '观察' : note.type === 'experiment' ? '实验' : '结论'}
                </span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'hypotheses' && (
          <div className="space-y-3">
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newHypothesisText}
                onChange={(e) => setNewHypothesisText(e.target.value)}
                placeholder="提出新假设..."
                className="flex-1 p-2 border border-lab-brown bg-lab-cream rounded text-sm"
                onKeyPress={(e) => e.key === 'Enter' && addHypothesis()}
              />
              <button onClick={addHypothesis} className="btn-primary text-sm">
                添加
              </button>
            </div>

            {state.hypotheses.map((hypothesis) => (
              <div
                key={hypothesis.id}
                className={`p-3 rounded border ${
                  hypothesis.isConfirmed ? 'border-green-600 bg-green-50' :
                  hypothesis.isRefuted ? 'border-red-600 bg-red-50' :
                  'border-lab-brown bg-white'
                }`}
              >
                {editingHypothesis === hypothesis.id ? (
                  <textarea
                    value={hypothesis.statement}
                    onChange={(e) => updateHypothesis(hypothesis.id, { statement: e.target.value })}
                    onBlur={() => setEditingHypothesis(null)}
                    className="w-full p-2 border rounded text-sm"
                    autoFocus
                  />
                ) : (
                  <p
                    className="text-sm cursor-pointer hover:underline"
                    onClick={() => setEditingHypothesis(hypothesis.id)}
                  >
                    {hypothesis.statement}
                  </p>
                )}
                
                <div className="flex gap-2 mt-2">
                  {!hypothesis.isConfirmed && !hypothesis.isRefuted && (
                    <>
                      <button
                        onClick={() => updateHypothesis(hypothesis.id, { isConfirmed: true })}
                        className="text-xs text-green-600 hover:underline"
                      >
                        ✓ 证实
                      </button>
                      <button
                        onClick={() => updateHypothesis(hypothesis.id, { isRefuted: true })}
                        className="text-xs text-red-600 hover:underline"
                      >
                        ✗ 证伪
                      </button>
                    </>
                  )}
                  {(hypothesis.isConfirmed || hypothesis.isRefuted) && (
                    <button
                      onClick={() => updateHypothesis(hypothesis.id, { isConfirmed: false, isRefuted: false })}
                      className="text-xs text-gray-600 hover:underline"
                    >
                      重置
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'experiments' && (
          <div className="space-y-3">
            {state.experiments.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">暂无实验记录</p>
            ) : (
              state.experiments.slice().reverse().map((exp) => (
                <div key={exp.id} className="bg-white p-3 rounded border border-lab-brown shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lab-brown">{exp.purpose}</h4>
                    <span className="text-xs text-gray-500">{exp.date}</span>
                  </div>
                  {exp.result && (
                    <div className="text-sm space-y-1">
                      <p>存活率：<span className={exp.result.survivalRate > 50 ? 'text-green-600 font-bold' : 'text-red-600'}>{exp.result.survivalRate}%</span></p>
                      <p>潜伏期：{exp.result.incubationPeriod}天</p>
                      <p>免疫效果：<span className={exp.result.immunityEffect ? 'text-green-600' : 'text-red-600'}>{exp.result.immunityEffect ? '有' : '无'}</span></p>
                      <p className={exp.result.success ? 'text-green-600 font-bold' : 'text-red-600'}>
                        {exp.result.success ? '✓ 成功' : '✗ 失败'}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
