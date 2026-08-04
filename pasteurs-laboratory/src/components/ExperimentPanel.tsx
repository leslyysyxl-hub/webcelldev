import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ExperimentMethod, VirusSource, TransmissionMethod, AttenuationMethod } from '../types/game';
import { calculateExperimentResult, generateId, formatDate } from '../utils/gameLogic';

export const ExperimentPanel: React.FC = () => {
  const { state, dispatch } = useGame();
  const [method, setMethod] = useState<ExperimentMethod>({
    virusSource: 'unknown',
    transmissionMethod: 'bite',
    attenuationMethod: null,
    subjectType: 'rabbit',
    exposureTime: 7,
    toxicityLevel: 0.5,
  });
  const [purpose, setPurpose] = useState('');
  const [result, setResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);

  const canExperiment = state.resources.rabbits > 0 || state.resources.dogs > 0;

  const runExperiment = () => {
    if (!canExperiment) return;

    // Consume resources
    dispatch({
      type: 'UPDATE_RESOURCES',
      resources: {
        rabbits: state.resources.rabbits - (method.subjectType === 'rabbit' ? 1 : 0),
        dogs: state.resources.dogs - (method.subjectType === 'dog' ? 1 : 0),
        reagents: state.resources.reagents - 2,
      },
    });

    const experimentResult = calculateExperimentResult(method);
    setResult(experimentResult);
    setShowResult(true);

    // Add experiment record
    const experiment = {
      id: generateId(),
      date: formatDate(state.year, state.month, state.day),
      purpose: purpose || '未指定目的',
      method,
      result: experimentResult,
    };
    dispatch({ type: 'ADD_EXPERIMENT', experiment });

    // Add observation note
    dispatch({
      type: 'ADD_NOTE',
      note: {
        id: generateId(),
        date: formatDate(state.year, state.month, state.day),
        title: `实验记录 - ${getMethodName(method)}`,
        content: `存活率：${experimentResult.survivalRate}%\n潜伏期：${experimentResult.incubationPeriod}天\n免疫效果：${experimentResult.immunityEffect ? '有' : '无'}\n副作用：${experimentResult.sideEffects.join(', ') || '无明显副作用'}`,
        type: 'experiment' as const,
      },
    });

    // Advance time
    dispatch({ type: 'ADVANCE_TIME', days: experimentResult.incubationPeriod });
  };

  const getMethodName = (m: ExperimentMethod): string => {
    return `${getVirusSourceName(m.virusSource)} + ${getTransmissionName(m.transmissionMethod)}${m.attenuationMethod ? ` + ${getAttenuationName(m.attenuationMethod)}` : ''}`;
  };

  return (
    <div className="lab-panel p-4 h-full overflow-y-auto">
      <h2 className="text-xl font-serif font-bold mb-4 text-lab-brown border-b border-lab-brown pb-2">
        实验操作台
      </h2>

      {!showResult ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold mb-1">实验目的</label>
            <input
              type="text"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="例如：测试干燥法减毒效果"
              className="w-full p-2 border border-lab-brown bg-lab-cream rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">病毒来源</label>
            <select
              value={method.virusSource}
              onChange={(e) => setMethod({ ...method, virusSource: e.target.value as VirusSource })}
              className="w-full p-2 border border-lab-brown bg-lab-cream rounded"
            >
              <option value="unknown">未知</option>
              <option value="saliva">唾液</option>
              <option value="blood">血液</option>
              <option value="nervous_tissue">神经组织</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">传播方式</label>
            <select
              value={method.transmissionMethod}
              onChange={(e) => setMethod({ ...method, transmissionMethod: e.target.value as TransmissionMethod })}
              className="w-full p-2 border border-lab-brown bg-lab-cream rounded"
            >
              <option value="bite">咬伤</option>
              <option value="injection">注射</option>
              <option value="contact">接触</option>
              <option value="airborne">空气传播</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">减毒方法</label>
            <select
              value={method.attenuationMethod || ''}
              onChange={(e) => setMethod({ ...method, attenuationMethod: e.target.value as AttenuationMethod || null })}
              className="w-full p-2 border border-lab-brown bg-lab-cream rounded"
            >
              <option value="">无</option>
              <option value="drying">干燥法（脊髓干燥）</option>
              <option value="heat">加热法</option>
              <option value="chemical">化学法</option>
              <option value="passage">传代法</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">实验对象</label>
            <select
              value={method.subjectType}
              onChange={(e) => setMethod({ ...method, subjectType: e.target.value as 'rabbit' | 'dog' })}
              className="w-full p-2 border border-lab-brown bg-lab-cream rounded"
            >
              <option value="rabbit">兔子</option>
              <option value="dog">狗</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">暴露时间：{method.exposureTime}天</label>
            <input
              type="range"
              min="1"
              max="21"
              value={method.exposureTime}
              onChange={(e) => setMethod({ ...method, exposureTime: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">病毒毒性：{(method.toxicityLevel * 100).toFixed(0)}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={method.toxicityLevel * 100}
              onChange={(e) => setMethod({ ...method, toxicityLevel: parseInt(e.target.value) / 100 })}
              className="w-full"
            />
          </div>

          <button
            onClick={runExperiment}
            disabled={!canExperiment}
            className={`w-full py-3 rounded font-bold ${
              canExperiment
                ? 'bg-lab-brown text-lab-cream hover:bg-opacity-90'
                : 'bg-gray-400 text-gray-600 cursor-not-allowed'
            }`}
          >
            开始实验
          </button>

          {!canExperiment && (
            <p className="text-red-600 text-sm text-center">没有可用的实验动物！</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className={`p-4 rounded ${result.success ? 'bg-green-100 border-green-600' : 'bg-red-100 border-red-600'} border-2`}>
            <h3 className={`font-bold text-lg ${result.success ? 'text-green-800' : 'text-red-800'}`}>
              {result.success ? '✓ 实验成功' : '✗ 实验失败'}
            </h3>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>存活率:</span>
              <span className={`font-bold ${result.survivalRate > 50 ? 'text-green-600' : 'text-red-600'}`}>
                {result.survivalRate}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>潜伏期:</span>
              <span>{result.incubationPeriod}天</span>
            </div>
            <div className="flex justify-between">
              <span>免疫效果:</span>
              <span className={result.immunityEffect ? 'text-green-600 font-bold' : 'text-red-600'}>
                {result.immunityEffect ? '✓ 产生免疫' : '✗ 无免疫'}
              </span>
            </div>
          </div>

          {result.sideEffects.length > 0 && (
            <div className="bg-yellow-100 p-3 rounded">
              <p className="font-bold text-sm">观察到的现象：</p>
              <ul className="list-disc list-inside text-sm">
                {result.sideEffects.map((effect: string, i: number) => (
                  <li key={i}>{effect}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={() => {
              setShowResult(false);
              setResult(null);
              setPurpose('');
            }}
            className="w-full btn-secondary"
          >
            继续实验
          </button>
        </div>
      )}
    </div>
  );
};

const getVirusSourceName = (source: VirusSource): string => {
  const names: Record<VirusSource, string> = {
    unknown: '未知',
    saliva: '唾液',
    blood: '血液',
    nervous_tissue: '神经组织',
  };
  return names[source];
};

const getTransmissionName = (method: TransmissionMethod): string => {
  const names: Record<TransmissionMethod, string> = {
    bite: '咬伤',
    injection: '注射',
    contact: '接触',
    airborne: '空气传播',
  };
  return names[method];
};

const getAttenuationName = (method: AttenuationMethod): string => {
  const names: Record<Exclude<AttenuationMethod, null>, string> = {
    drying: '干燥法',
    heat: '加热法',
    chemical: '化学法',
    passage: '传代法',
  };
  return method ? names[method] : '无';
};
