import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Moon, Sun, Menu, X } from 'lucide-react';
import type { WorkshopState, WorkshopPhase } from '../types';
import './DashboardLayout.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
  workshopData: WorkshopState;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}

const phases: { id: WorkshopPhase; label: string; path: string }[] = [
  { id: 'problem-framing', label: 'Problem Framing', path: '/problem-framing' },
  { id: 'idea-blitz', label: 'Idea Blitz', path: '/idea-blitz' },
  { id: 'project-context', label: 'Project Context', path: '/project-context' },
  { id: 'export', label: 'Export DNA', path: '/export' },
];

export function DashboardLayout({ children, workshopData, theme, onThemeToggle }: DashboardLayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const currentPhaseIndex = phases.findIndex(p => location.pathname.includes(p.path));
  const completenessScore = calculateCompletenessScore(workshopData);

  return (
    <div className="dashboard-layout">
      {/* Header */}
      <header className="dashboard-header surface elevation-2">
        <div className="header-left">
          <button
            className="mobile-menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="headline-large">Workshop DNA Generator</h1>
        </div>
        <div className="header-right">
          <button
            className="theme-toggle"
            onClick={onThemeToggle}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <div className="user-menu">
            <div className="user-avatar">U</div>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        {/* Sidebar */}
        <aside className={`dashboard-sidebar surface-variant ${sidebarOpen ? 'open' : ''}`}>
          <div className="workshop-info">
            <h2 className="title-large">{workshopData.title || 'Untitled Workshop'}</h2>
            <div className="completeness-indicator">
              <div className="completeness-label label-large">
                Overall Progress: {completenessScore}%
              </div>
              <div className="completeness-bar">
                <div
                  className="completeness-fill primary"
                  style={{ width: `${completenessScore}%` }}
                />
              </div>
            </div>
          </div>

          <nav className="phase-navigation">
            {phases.map((phase, index) => {
              const isActive = location.pathname.includes(phase.path);
              const isCompleted = index < currentPhaseIndex;
              const isLocked = index > currentPhaseIndex + 1;

              return (
                <Link
                  key={phase.id}
                  to={phase.path}
                  className={`phase-nav-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="phase-indicator">
                    {isCompleted && <span className="checkmark">✓</span>}
                    {!isCompleted && <span className="phase-number">{index + 1}</span>}
                  </div>
                  <span className="phase-label label-large">{phase.label}</span>
                  {isActive && <ChevronRight size={20} />}
                </Link>
              );
            })}
          </nav>

          <div className="sidebar-footer">
            <div className="participants-count label-large">
              {workshopData.participants.length} Participant{workshopData.participants.length !== 1 ? 's' : ''}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          {children}
        </main>
      </div>
    </div>
  );
}

function calculateCompletenessScore(workshopData: WorkshopState): number {
  let score = 0;

  // Problem Framing (25%)
  if (workshopData.problemFraming.problemStatement) score += 0.25;

  // Solution Concepts (25%)
  if (workshopData.solutionConcepts.length > 0) score += 0.25;

  // Project Context (25%)
  if (workshopData.projectContext.timeline.startDate && workshopData.projectContext.timeline.endDate) score += 0.25;

  // Export readiness (25%)
  if (workshopData.dnaOutput) score += 0.25;

  return Math.round(score * 100);
}