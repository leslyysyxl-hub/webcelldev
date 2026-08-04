import { GameState, ExperimentMethod, ExperimentResult, VirusSource, TransmissionMethod, AttenuationMethod } from '../types/game';

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const formatDate = (year: number, month: number, day: number): string => {
  return `${year}年${month}月${day}日`;
};

// 科学规律：隐藏的真相
const TRUE_SCIENCE = {
  correctVirusSource: 'nervous_tissue' as VirusSource,
  correctTransmission: 'bite' as TransmissionMethod,
  correctAttenuation: 'drying' as AttenuationMethod,
  optimalExposureTime: 7,
  optimalToxicity: 0.3,
};

export const calculateExperimentResult = (method: ExperimentMethod): ExperimentResult => {
  let success = true;
  let survivalRate = 100;
  let incubationPeriod = 14;
  let immunityEffect = false;
  const sideEffects: string[] = [];

  // 病毒来源影响
  if (method.virusSource !== TRUE_SCIENCE.correctVirusSource) {
    success = false;
    survivalRate -= 30;
    sideEffects.push('病毒来源不正确，实验效果不佳');
  }

  // 传播方式影响
  if (method.transmissionMethod !== TRUE_SCIENCE.correctTransmission) {
    success = false;
    survivalRate -= 20;
    sideEffects.push('传播方式选择错误');
  }

  // 减毒方法影响（关键）
  if (method.attenuationMethod === TRUE_SCIENCE.correctAttenuation) {
    immunityEffect = true;
    survivalRate += 40;
    incubationPeriod = 21;
  } else if (method.attenuationMethod) {
    survivalRate -= 25;
    sideEffects.push(`使用${getAttenuationName(method.attenuationMethod)}减毒效果不理想`);
  } else {
    // 没有减毒
    survivalRate -= 50;
    sideEffects.push('未进行减毒处理，动物死亡率极高');
  }

  // 暴露时间影响
  const timeDiff = Math.abs(method.exposureTime - TRUE_SCIENCE.optimalExposureTime);
  if (timeDiff > 3) {
    survivalRate -= 15;
    sideEffects.push('暴露时间不合适');
  }

  // 毒性水平影响
  if (method.toxicityLevel > 0.5) {
    survivalRate -= 20;
    sideEffects.push('病毒毒性过强');
  } else if (method.toxicityLevel < 0.2 && method.attenuationMethod) {
    immunityEffect = false;
    sideEffects.push('病毒毒性过弱，无法产生免疫');
  }

  // 确保数值在合理范围
  survivalRate = Math.max(0, Math.min(100, survivalRate));
  incubationPeriod = Math.max(3, incubationPeriod);

  return {
    survivalRate,
    incubationPeriod,
    immunityEffect,
    sideEffects,
    success: success && survivalRate > 50 && immunityEffect,
  };
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

export const getInitialGameState = (): GameState => {
  return {
    year: 1885,
    month: 3,
    day: 1,
    resources: {
      rabbits: 10,
      dogs: 3,
      virusSamples: 5,
      reagents: 20,
      reputation: 50,
    },
    experiments: [],
    notes: [
      {
        id: generateId(),
        date: '1885年3月1日',
        title: '研究开始',
        content: '今天开始研究狂犬病。这种可怕的疾病让无数人死去，我必须找到治疗方法。',
        type: 'observation',
      },
    ],
    hypotheses: [
      {
        id: generateId(),
        statement: '狂犬病可能通过唾液传播',
        isConfirmed: false,
        isRefuted: false,
        evidence: [],
      },
    ],
    storyProgress: {
      stage: 0,
      completedMilestones: [],
      unlockedExperiments: ['basic_infection'],
      historicalEvents: [
        {
          id: generateId(),
          title: '巴斯德的微生物研究',
          description: '路易·巴斯德已经成功证明了微生物导致发酵和疾病，现在他将目光投向狂犬病。',
          date: '1885年3月',
          isRead: false,
        },
      ],
    },
    animals: [
      { id: generateId(), type: 'rabbit', status: 'healthy', symptoms: [] },
      { id: generateId(), type: 'rabbit', status: 'healthy', symptoms: [] },
      { id: generateId(), type: 'rabbit', status: 'healthy', symptoms: [] },
      { id: generateId(), type: 'dog', status: 'healthy', symptoms: [] },
    ],
    currentStage: 'intro',
    gameResult: null,
  };
};

export const saveGame = (state: GameState): void => {
  localStorage.setItem('pasteurs-lab-save', JSON.stringify(state));
};

export const loadGame = (): GameState | null => {
  const saved = localStorage.getItem('pasteurs-lab-save');
  if (saved) {
    return JSON.parse(saved);
  }
  return null;
};

export const clearSave = (): void => {
  localStorage.removeItem('pasteurs-lab-save');
};
