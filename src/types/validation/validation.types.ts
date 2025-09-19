export interface FieldValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface FieldValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ScoreBreakdown {
  problemFraming: number;
  ideaGeneration: number;
  projectContext: number;
  overall: number;
}

export interface CompletenessMetrics {
  totalFields: number;
  completedFields: number;
  requiredFields: number;
  completedRequiredFields: number;
  optionalFields: number;
  completedOptionalFields: number;
}

export interface ValidationPipelineStage {
  name: string;
  validator: (data: any) => Promise<FieldValidationResult>;
  weight: number;
  critical: boolean;
}

export interface ValidationPipelineResult {
  isValid: boolean;
  score: number;
  stages: {
    name: string;
    passed: boolean;
    score: number;
    errors: string[];
    warnings: string[];
  }[];
  summary: {
    totalErrors: number;
    totalWarnings: number;
    criticalFailures: string[];
  };
}