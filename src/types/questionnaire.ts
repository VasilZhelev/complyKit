export type RiskLevel = 'UNACCEPTABLE_RISK' | 'HIGH_RISK' | 'LIMITED_RISK' | 'MINIMAL_RISK' | 'OUT_OF_SCOPE';

export interface QuestionnaireResult {
  id: string;
  userId: string;
  timestamp: string;
  answers: Record<string, string | string[]>;
  score: number;
  riskLevel: RiskLevel;
} 