import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProblemFraming } from './components/ProblemFraming/ProblemFraming';
import { IdeaBlitz } from './components/IdeaBlitz/IdeaBlitz';
import { ProjectContext } from './components/ProjectContext/ProjectContext';
import { ExportPanel } from './components/ExportPanel/ExportPanel';
import { useWorkshopState } from './hooks/useWorkshopState';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { workshopData, updateWorkshop, loading, error } = useWorkshopState();

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  if (loading) {
    return (
      <div className="loading-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--md-sys-color-background)'
      }}>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--md-sys-color-background)'
      }}>
        <div className="error-message" style={{ color: 'var(--md-sys-color-error)' }}>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <Router>
      <DashboardLayout
        workshopData={workshopData}
        theme={theme}
        onThemeToggle={toggleTheme}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/problem-framing" replace />} />
          <Route
            path="/problem-framing"
            element={
              <ProblemFraming
                workshopData={workshopData}
                onUpdate={(data) => updateWorkshop({ problemFraming: data })}
              />
            }
          />
          <Route
            path="/idea-blitz"
            element={
              <IdeaBlitz
                workshopData={workshopData}
                onUpdate={(concepts) => updateWorkshop({ solutionConcepts: concepts })}
              />
            }
          />
          <Route
            path="/project-context"
            element={
              <ProjectContext
                workshopData={workshopData}
                onUpdate={(context) => updateWorkshop({ projectContext: context })}
              />
            }
          />
          <Route
            path="/export"
            element={
              <ExportPanel
                workshopData={workshopData}
                onUpdate={(updates) => updateWorkshop(updates)}
              />
            }
          />
        </Routes>
      </DashboardLayout>
    </Router>
  );
}

export default App;