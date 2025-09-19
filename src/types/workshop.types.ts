export type WorkshopPhase = 'problem-framing' | 'idea-blitz' | 'project-context' | 'export';

export type UserRole = 'facilitator' | 'participant' | 'observer';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  lastActive: Date;
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  influence: 'low' | 'medium' | 'high';
  interest: 'low' | 'medium' | 'high';
  expectations?: string;
}

export interface ProblemFraming {
  problemStatement: string;
  successCriteria: string[];
  constraints: string[];
  stakeholders: Stakeholder[];
}

export interface Vote {
  userId: string;
  value: number;
  timestamp: Date;
}

export interface SolutionConcept {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  votes: Vote[];
  tags: string[];
  feasibility: number;
  impact: number;
  selected: boolean;
}

export interface Technology {
  name: string;
  version?: string;
  purpose: string;
  rationale?: string;
  alternatives?: string[];
}

export interface TechStack {
  frontend: Technology[];
  backend: Technology[];
  database: Technology[];
  infrastructure: Technology[];
  tools: Technology[];
}

export interface Resource {
  id: string;
  type: 'human' | 'financial' | 'technical' | 'physical';
  name: string;
  description?: string;
  allocation: string;
  availability?: string;
  cost?: number;
  constraints?: string[];
}

export interface Dependency {
  id: string;
  type: 'internal' | 'external' | 'technical' | 'business';
  name: string;
  description?: string;
  impact: 'low' | 'medium' | 'high' | 'critical';
  status: 'identified' | 'planned' | 'in-progress' | 'resolved' | 'blocked';
  owner?: string;
  targetDate?: Date;
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'business' | 'operational' | 'external';
  probability: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  mitigationStrategy?: string;
  contingencyPlan?: string;
  owner?: string;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  deliverables: string[];
  dependencies?: string[];
}

export interface ProjectPhase {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  objectives: string[];
}

export interface Timeline {
  startDate: Date;
  endDate: Date;
  milestones: Milestone[];
  phases: ProjectPhase[];
}

export interface ProjectContext {
  timeline: Timeline;
  techStack: TechStack;
  resources: Resource[];
  dependencies: Dependency[];
  riskAssessment?: Risk[];
}

export interface OutputMetadata {
  version: string;
  generator: string;
  workshopTitle: string;
  participantCount: number;
  completenessScore: number;
  tags?: string[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationWarning {
  field: string;
  message: string;
  recommendation?: string;
}

export interface ValidationSuggestion {
  category: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  effort: 'low' | 'medium' | 'high';
}

export interface ValidationResult {
  isValid: boolean;
  score: number;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  suggestions: ValidationSuggestion[];
}

export interface DNAOutput {
  id: string;
  workshopId: string;
  generatedAt: Date;
  format: 'json' | 'markdown' | 'yaml';
  content: string;
  metadata: OutputMetadata;
  validation: ValidationResult;
}

export interface WorkshopState {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  phase: WorkshopPhase;
  participants: User[];
  problemFraming: ProblemFraming;
  solutionConcepts: SolutionConcept[];
  projectContext: ProjectContext;
  dnaOutput?: DNAOutput;
  architecturalReview?: any; // Will be defined in architecturalReview.types.ts
}