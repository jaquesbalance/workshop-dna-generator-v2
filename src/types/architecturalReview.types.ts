export type AgentType =
  | 'frontend-specialist'
  | 'backend-specialist'
  | 'devops-specialist'
  | 'testing-specialist'
  | 'security-specialist'
  | 'database-specialist'
  | 'architecture-specialist';

export interface ReviewSummary {
  overallAssessment: string;
  readinessScore: number;
  estimatedSuccessRate: number;
  criticalIssues: number;
  recommendedApproach: string;
}

export interface ArchitecturalChallenge {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'architectural' | 'integration' | 'performance' | 'security' | 'scalability';
  severity: 'low' | 'medium' | 'high' | 'critical';
  impact: string;
  recommendation: string;
  relatedConcepts?: string[];
}

export interface ArchitecturalSuggestion {
  id: string;
  title: string;
  description: string;
  category: 'architecture' | 'technology' | 'process' | 'security' | 'performance';
  priority: 'low' | 'medium' | 'high' | 'critical';
  implementationEffort: 'low' | 'medium' | 'high';
  benefits: string[];
  tradeoffs?: string[];
  relatedChallenges?: string[];
}

export interface ArchitecturePattern {
  id: string;
  name: string;
  description: string;
  useCase: string;
  benefits: string[];
  drawbacks?: string[];
  exampleImplementation?: string;
  relevantFor: string[];
}

export interface RiskAssessment {
  id: string;
  description: string;
  category: 'technical' | 'business' | 'operational' | 'security' | 'compliance';
  level: 'low' | 'medium' | 'high' | 'critical';
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigationStrategies: string[];
  contingencyPlan?: string;
}

export interface AgentGuidance {
  agentType: AgentType;
  priority: number;
  estimatedEffort: string;
  specificInstructions: string[];
  techStack: {
    required: string[];
    recommended: string[];
  };
  criticalDecisions: string[];
  successCriteria?: string[];
}

export interface ArchitecturalReview {
  id: string;
  workshopId: string;
  createdAt: Date;
  summary: ReviewSummary;
  challenges: ArchitecturalChallenge[];
  suggestions: ArchitecturalSuggestion[];
  patterns: ArchitecturePattern[];
  risks: RiskAssessment[];
  agentGuidance: AgentGuidance[];
}

export interface ReviewResponse {
  acceptedSuggestions: string[];
  rejectedSuggestions: string[];
  acknowledgedRisks: string[];
  additionalNotes?: string;
}

export interface AppliedArchitecture {
  reviewId: string;
  appliedAt: Date;
  response: ReviewResponse;
  updatedWorkshopData: any; // WorkshopState type from workshop.types.ts
}