import { useState, useEffect, useCallback } from 'react';
import type { WorkshopState, ProblemFraming, ProjectContext } from '../types';

interface UseWorkshopStateReturn {
  workshopData: WorkshopState;
  updateWorkshop: (updates: Partial<WorkshopState>) => void;
  resetWorkshop: () => void;
  loading: boolean;
  error: string | null;
  isDirty: boolean;
  save: () => Promise<void>;
}

const initialProblemFraming: ProblemFraming = {
  problemStatement: '',
  successCriteria: [],
  constraints: [],
  stakeholders: [],
};

const initialProjectContext: ProjectContext = {
  timeline: {
    startDate: new Date(),
    endDate: new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    milestones: [],
    phases: [],
  },
  techStack: {
    frontend: [],
    backend: [],
    database: [],
    infrastructure: [],
    tools: [],
  },
  resources: [],
  dependencies: [],
  riskAssessment: [],
};

const initialWorkshopState: WorkshopState = {
  id: generateId(),
  title: 'New Workshop',
  createdAt: new Date(),
  updatedAt: new Date(),
  phase: 'problem-framing',
  participants: [
    {
      id: generateId(),
      name: 'Workshop Facilitator',
      email: 'facilitator@example.com',
      role: 'facilitator',
      lastActive: new Date(),
    },
  ],
  problemFraming: initialProblemFraming,
  solutionConcepts: [],
  projectContext: initialProjectContext,
};

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function useWorkshopState(): UseWorkshopStateReturn {
  const [workshopData, setWorkshopData] = useState<WorkshopState>(initialWorkshopState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setLoading(true);
    try {
      const saved = localStorage.getItem('workshop-data');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects
        parsed.createdAt = new Date(parsed.createdAt);
        parsed.updatedAt = new Date(parsed.updatedAt);
        if (parsed.projectContext?.timeline) {
          parsed.projectContext.timeline.startDate = new Date(parsed.projectContext.timeline.startDate);
          parsed.projectContext.timeline.endDate = new Date(parsed.projectContext.timeline.endDate);
        }
        setWorkshopData(parsed);
      }
    } catch (err) {
      console.error('Failed to load workshop data:', err);
      setError('Failed to load saved workshop data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-save to localStorage when data changes
  useEffect(() => {
    if (isDirty) {
      const timer = setTimeout(() => {
        save();
      }, 1000); // Debounce for 1 second
      return () => clearTimeout(timer);
    }
  }, [workshopData, isDirty]);

  const updateWorkshop = useCallback((updates: Partial<WorkshopState>) => {
    setWorkshopData(prev => {
      const updated = {
        ...prev,
        ...updates,
        updatedAt: new Date(),
      };

      // Update phase based on progress
      if (updates.problemFraming && prev.phase === 'problem-framing') {
        const pf = updates.problemFraming;
        if (pf.problemStatement && pf.successCriteria.length > 0) {
          updated.phase = 'idea-blitz';
        }
      } else if (updates.solutionConcepts && prev.phase === 'idea-blitz') {
        const hasSelected = updates.solutionConcepts.some(c => c.selected);
        if (hasSelected) {
          updated.phase = 'project-context';
        }
      } else if (updates.projectContext && prev.phase === 'project-context') {
        const pc = updates.projectContext;
        if (pc.timeline.milestones.length > 0 && pc.techStack.frontend.length > 0) {
          updated.phase = 'export';
        }
      }

      return updated;
    });
    setIsDirty(true);
  }, []);

  const resetWorkshop = useCallback(() => {
    setWorkshopData(initialWorkshopState);
    localStorage.removeItem('workshop-data');
    setIsDirty(false);
  }, []);

  const save = useCallback(async () => {
    try {
      localStorage.setItem('workshop-data', JSON.stringify(workshopData));
      setIsDirty(false);
    } catch (err) {
      console.error('Failed to save workshop data:', err);
      setError('Failed to save workshop data');
      throw err;
    }
  }, [workshopData]);

  return {
    workshopData,
    updateWorkshop,
    resetWorkshop,
    loading,
    error,
    isDirty,
    save,
  };
}