export enum TrackBiasPattern {
  AUTO = 'AUTO', // AI Auto Detect
  A = 'A', // Inner/Fast
  B = 'B', // Outer/Tough
  C = 'C', // Inner/Tough (Blind Spot)
  D = 'D', // Outer/Fast (Blind Spot)
  UNKNOWN = 'UNKNOWN'
}

export interface RaceInputData {
  raceName: string; // e.g., "Tokyo 11R", "Arima Kinen"
  location?: string;
  budget: number;
  biasPattern: TrackBiasPattern;
  additionalNotes?: string;
}

export interface PredictionResult {
  markdownContent: string;
  timestamp: string;
}

export interface BiasDefinition {
  id: TrackBiasPattern;
  title: string;
  condition: string;
  advantage: string;
  description: string;
  isBlindSpot: boolean;
}