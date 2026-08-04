import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { generateId, formatDate } from '../utils/gameLogic';

export const HumanTrialModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { state, dispatch } = useGame();
  const [step, setStep] = useState(0);
  const [treatmentComplete, setTreatmentComplete] = useState(false);
  const [patientAlive, setPatientAlive] = useState(true);

  const totalSteps = 13;
  const currentStepInfo = {
    day: step + 1,
    dosage: (step * 0.1).toFixed(1),
    virusStrength: ((1 - step / totalSteps) * 100).toFixed(0),
  };

  const proceedTreatment = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
      dispatch({ type: 'ADVANCE_TIME', days: 1 });
    } else {
      setTreatmentComplete(true);
      // Calculate success based on previous experiments
      const hasSuccessfulDryingExperiment = state.experiments.some(
        exp => exp.result?.success && exp.method.attenuationMethod === 'drying'
      );
      
      const success = hasSuccessfulDryingExperiment || Math.random() > 0.3;
      setPatientAlive(success);

      if (success) {
        dispatch({ type: 'SET_GAME_RESULT', result: 'win' });
        dispatch({
          type: 'ADD_NOTE',
          note: {
            id: generateId(),
            date: formatDate(state.year, state.month, state.day),
            title: '历史性时刻 - 疫苗成功！',
            content: '约瑟夫·迈斯特在完成全部13次注射后存活了下来！这是人类历史上第一次成功的狂犬病疫苗接种。这一成就将拯救无数生命。',
            type: 'conclusion',
          },
        });
      } else {
        dispatch({ type: 'SET_GAME_RESULT', result: 'lose' });
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-lab-cream p-6 rounded-lg max-w-md w-full lab-border shadow-2xl">
        <h2 className="text-2xl font-serif font-bold text-lab-brown mb-4">
          治疗约瑟夫·迈斯特
        </h2>

        {!treatmentComplete ? (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded border border-lab-brown">
              <p className="text-sm">第 {currentStepInfo.day} 天 / 共 {totalSteps} 天</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-lab-green h-2 rounded-full transition-all"
                  style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <p><strong>今日剂量:</strong> {currentStepInfo.dosage}ml</p>
              <p><strong>病毒强度:</strong> {currentStepInfo.virusStrength}%</p>
              <p><strong>患者状态:</strong> {patientAlive ? '稳定' : '危急'}</p>
            </div>

            <div className="bg-yellow-100 p-3 rounded text-sm">
              <p className="font-bold">伦理考量：</p>
              <p>这是第一次在人体上试验狂犬病疫苗。如果失败，可能会导致患者死亡。但如果不治疗，被疯狗咬伤的迈斯特几乎必死无疑。</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={proceedTreatment}
                className="flex-1 btn-primary"
              >
                {step < totalSteps - 1 ? '继续注射' : '完成治疗'}
              </button>
              <button onClick={onClose} className="btn-secondary">
                取消
              </button>
            </div>
          </div>
        ) : (
          <div className={`p-4 rounded text-center ${patientAlive ? 'bg-green-100' : 'bg-red-100'}`}>
            <h3 className={`text-xl font-bold ${patientAlive ? 'text-green-800' : 'text-red-800'}`}>
              {patientAlive ? '✓ 治疗成功！' : '✗ 治疗失败'}
            </h3>
            <p className="mt-2">
              {patientAlive 
                ? '迈斯特存活了下来！狂犬病疫苗研发成功！'
                : '迈斯特不幸去世...实验失败了。'}
            </p>
            <button
              onClick={onClose}
              className="mt-4 btn-primary"
            >
              查看结果
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
