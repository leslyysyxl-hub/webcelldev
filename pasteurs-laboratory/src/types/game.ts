export interface GameState {
  year: number;
  month: number;
  day: number;
  resources: Resources;
  experiments: Experiment[];
  notes: Note[];
  hypotheses: Hypothesis[];
  storyProgress: StoryProgress;
  animals: Animal[];
  currentStage: GameStage;
  gameResult?: 'win' | 'lose' | null;
}

export interface Resources {
  rabbits: number;
  dogs: number;
  virusSamples: number;
  reagents: number;
  reputation: number;
}

export interface Experiment {
  id: string;
  date: string;
  purpose: string;
  method: ExperimentMethod;
  result?: ExperimentResult;
  conclusion?: string;
}

export interface ExperimentMethod {
  virusSource: VirusSource;
  transmissionMethod: TransmissionMethod;
  attenuationMethod: AttenuationMethod | null;
  subjectType: SubjectType;
  exposureTime: number;
  toxicityLevel: number;
}

export interface ExperimentResult {
  survivalRate: number;
  incubationPeriod: number;
  immunityEffect: boolean;
  sideEffects: string[];
  success: boolean;
}

export interface Note {
  id: string;
  date: string;
  title: string;
  content: string;
  type: 'observation' | 'experiment' | 'conclusion';
}

export interface Hypothesis {
  id: string;
  statement: string;
  isConfirmed: boolean;
  isRefuted: boolean;
  evidence: string[];
}

export interface StoryProgress {
  stage: number;
  completedMilestones: string[];
  unlockedExperiments: string[];
  historicalEvents: HistoricalEvent[];
}

export interface HistoricalEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  isRead: boolean;
}

export interface Animal {
  id: string;
  type: 'rabbit' | 'dog';
  status: 'healthy' | 'infected' | 'immune' | 'dead';
  infectionDate?: string;
  symptoms: string[];
}

export type GameStage = 'intro' | 'research' | 'animal_trials' | 'human_trial' | 'conclusion';
export type VirusSource = 'saliva' | 'blood' | 'nervous_tissue' | 'unknown';
export type TransmissionMethod = 'bite' | 'injection' | 'contact' | 'airborne';
export type AttenuationMethod = 'drying' | 'heat' | 'chemical' | 'passage' | null;
export type SubjectType = 'rabbit' | 'dog' | 'human';
