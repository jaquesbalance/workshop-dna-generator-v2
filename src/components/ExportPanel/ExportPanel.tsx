import { useState } from 'react';
import { Download, FileText, Code, Database } from 'lucide-react';
import { Button } from '../Button/Button';
import type { WorkshopState } from '../../types';

interface ExportPanelProps {
  workshopData: WorkshopState;
  onUpdate: (updates: Partial<WorkshopState>) => void;
}

export function ExportPanel({ workshopData, onUpdate }: ExportPanelProps) {
  const [selectedFormat, setSelectedFormat] = useState<'json' | 'markdown' | 'yaml'>('json');
  const [isExporting, setIsExporting] = useState(false);

  const calculateCompleteness = () => {
    let score = 0;
    let total = 0;

    // Problem Framing (30 points)
    total += 30;
    if (workshopData.problemFraming.problemStatement) score += 10;
    if (workshopData.problemFraming.successCriteria.length > 0) score += 10;
    if (workshopData.problemFraming.stakeholders.length > 0) score += 10;

    // Solution Concepts (30 points)
    total += 30;
    if (workshopData.solutionConcepts.length > 0) score += 15;
    if (workshopData.solutionConcepts.some(c => c.selected)) score += 15;

    // Project Context (40 points)
    total += 40;
    if (workshopData.projectContext.timeline.milestones.length > 0) score += 15;
    if (workshopData.projectContext.techStack.frontend.length > 0) score += 10;
    if (workshopData.projectContext.techStack.backend.length > 0) score += 10;
    if (workshopData.projectContext.resources.length > 0) score += 5;

    return Math.round((score / total) * 100);
  };

  const generateDNA = () => {
    const selectedConcepts = workshopData.solutionConcepts.filter(c => c.selected);

    const dnaContent = {
      metadata: {
        title: workshopData.title,
        generated: new Date().toISOString(),
        completeness: calculateCompleteness(),
        participants: workshopData.participants.length,
      },
      problemFraming: {
        problem: workshopData.problemFraming.problemStatement,
        successCriteria: workshopData.problemFraming.successCriteria,
        constraints: workshopData.problemFraming.constraints,
        stakeholders: workshopData.problemFraming.stakeholders.map(s => ({
          name: s.name,
          role: s.role,
          influence: s.influence,
          interest: s.interest,
        })),
      },
      selectedSolutions: selectedConcepts.map(c => ({
        title: c.title,
        description: c.description,
        feasibility: c.feasibility,
        impact: c.impact,
      })),
      implementation: {
        timeline: {
          start: workshopData.projectContext.timeline.startDate,
          end: workshopData.projectContext.timeline.endDate,
          milestones: workshopData.projectContext.timeline.milestones.map(m => ({
            title: m.title,
            date: m.dueDate,
            deliverables: m.deliverables,
          })),
        },
        techStack: workshopData.projectContext.techStack,
      },
      recommendations: [
        'Start with the highest impact, most feasible solutions',
        'Establish clear communication channels with all stakeholders',
        'Break down implementation into manageable milestones',
        'Regular review and adjustment of timeline based on progress',
      ],
    };

    return dnaContent;
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const dnaContent = generateDNA();
      let content: string;
      let filename: string;

      switch (selectedFormat) {
        case 'json':
          content = JSON.stringify(dnaContent, null, 2);
          filename = `workshop-dna-${Date.now()}.json`;
          break;
        case 'markdown':
          content = generateMarkdown(dnaContent);
          filename = `workshop-dna-${Date.now()}.md`;
          break;
        case 'yaml':
          content = generateYAML(dnaContent);
          filename = `workshop-dna-${Date.now()}.yaml`;
          break;
      }

      // Create and download file
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Update workshop with DNA output
      onUpdate({
        dnaOutput: {
          id: generateId(),
          workshopId: workshopData.id,
          generatedAt: new Date(),
          format: selectedFormat,
          content,
          metadata: {
            version: '1.0',
            generator: 'Workshop DNA Generator',
            workshopTitle: workshopData.title,
            participantCount: workshopData.participants.length,
            completenessScore: calculateCompleteness(),
          },
          validation: {
            isValid: true,
            score: calculateCompleteness(),
            errors: [],
            warnings: [],
            suggestions: [],
          },
        },
      });
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const completeness = calculateCompleteness();
  const canExport = completeness >= 60; // Require at least 60% completion

  return (
    <div className="export-panel" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="phase-header" style={{ marginBottom: '32px' }}>
        <h1 className="headline-large">Export DNA</h1>
        <p className="body-large">
          Generate AI-ready instructions from your workshop output.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Completeness Score */}
        <section className="surface elevation-1" style={{ padding: '24px', borderRadius: '12px' }}>
          <h2 className="title-large" style={{ marginBottom: '16px' }}>Workshop Completeness</h2>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span className="label-large">Overall Progress</span>
              <span className="label-large" style={{ fontWeight: '600' }}>{completeness}%</span>
            </div>
            <div style={{
              height: '8px',
              backgroundColor: 'var(--md-sys-color-surface-variant)',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <div
                style={{
                  width: `${completeness}%`,
                  height: '100%',
                  backgroundColor: completeness >= 60 ? 'var(--md-sys-color-primary)' : 'var(--md-sys-color-error)',
                  transition: 'width 0.3s ease'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            <div className="surface-variant" style={{ padding: '16px', borderRadius: '8px' }}>
              <h3 className="label-large" style={{ marginBottom: '8px' }}>Problem Framing</h3>
              <div style={{ fontSize: '14px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                ✓ Problem Statement: {workshopData.problemFraming.problemStatement ? 'Complete' : 'Missing'}<br/>
                ✓ Success Criteria: {workshopData.problemFraming.successCriteria.length} added<br/>
                ✓ Stakeholders: {workshopData.problemFraming.stakeholders.length} identified
              </div>
            </div>

            <div className="surface-variant" style={{ padding: '16px', borderRadius: '8px' }}>
              <h3 className="label-large" style={{ marginBottom: '8px' }}>Solution Concepts</h3>
              <div style={{ fontSize: '14px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                ✓ Concepts Generated: {workshopData.solutionConcepts.length}<br/>
                ✓ Selected for Implementation: {workshopData.solutionConcepts.filter(c => c.selected).length}<br/>
                ✓ Average Feasibility: {workshopData.solutionConcepts.length > 0 ?
                  (workshopData.solutionConcepts.reduce((sum, c) => sum + c.feasibility, 0) / workshopData.solutionConcepts.length).toFixed(1) : '0'}
              </div>
            </div>

            <div className="surface-variant" style={{ padding: '16px', borderRadius: '8px' }}>
              <h3 className="label-large" style={{ marginBottom: '8px' }}>Project Context</h3>
              <div style={{ fontSize: '14px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                ✓ Milestones: {workshopData.projectContext.timeline.milestones.length} defined<br/>
                ✓ Technologies: {Object.values(workshopData.projectContext.techStack).flat().length} selected<br/>
                ✓ Timeline: {Math.ceil((workshopData.projectContext.timeline.endDate.getTime() - workshopData.projectContext.timeline.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
              </div>
            </div>
          </div>

          {!canExport && (
            <div style={{
              marginTop: '16px',
              padding: '12px',
              backgroundColor: 'var(--md-sys-color-error-container)',
              color: 'var(--md-sys-color-on-error-container)',
              borderRadius: '8px',
              fontSize: '14px'
            }}>
              ⚠️ Workshop must be at least 60% complete to export DNA. Please fill in more details above.
            </div>
          )}
        </section>

        {/* Export Options */}
        <section className="surface elevation-1" style={{ padding: '24px', borderRadius: '12px' }}>
          <h2 className="title-large" style={{ marginBottom: '16px' }}>Export Format</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            {[
              { format: 'json' as const, icon: Code, label: 'JSON', description: 'Structured data for API consumption' },
              { format: 'markdown' as const, icon: FileText, label: 'Markdown', description: 'Human-readable documentation' },
              { format: 'yaml' as const, icon: Database, label: 'YAML', description: 'Configuration-friendly format' },
            ].map(({ format, icon: Icon, label, description }) => (
              <button
                key={format}
                onClick={() => setSelectedFormat(format)}
                style={{
                  padding: '16px',
                  border: selectedFormat === format ? '2px solid var(--md-sys-color-primary)' : '1px solid var(--md-sys-color-outline-variant)',
                  borderRadius: '8px',
                  backgroundColor: selectedFormat === format ? 'var(--md-sys-color-primary-container)' : 'var(--md-sys-color-surface)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Icon size={20} />
                  <span className="label-large">{label}</span>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--md-sys-color-on-surface-variant)', margin: 0 }}>
                  {description}
                </p>
              </button>
            ))}
          </div>

          <Button
            variant="filled"
            onClick={handleExport}
            disabled={!canExport || isExporting}
            loading={isExporting}
            startIcon={<Download size={16} />}
            size="large"
          >
            {isExporting ? 'Generating DNA...' : `Export as ${selectedFormat.toUpperCase()}`}
          </Button>
        </section>

        {/* Preview */}
        {canExport && (
          <section className="surface elevation-1" style={{ padding: '24px', borderRadius: '12px' }}>
            <h2 className="title-large" style={{ marginBottom: '16px' }}>DNA Preview</h2>
            <div style={{
              backgroundColor: 'var(--md-sys-color-surface-variant)',
              padding: '16px',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '14px',
              overflow: 'auto',
              maxHeight: '300px'
            }}>
              <pre>{JSON.stringify(generateDNA(), null, 2)}</pre>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function generateMarkdown(data: any): string {
  return `# Workshop DNA: ${data.metadata.title}

Generated: ${new Date(data.metadata.generated).toLocaleString()}
Completeness: ${data.metadata.completeness}%

## Problem Statement
${data.problemFraming.problem}

## Success Criteria
${data.problemFraming.successCriteria.map((c: string) => `- ${c}`).join('\n')}

## Selected Solutions
${data.selectedSolutions.map((s: any) => `### ${s.title}
${s.description}
- Feasibility: ${s.feasibility}/5
- Impact: ${s.impact}/5`).join('\n\n')}

## Implementation Timeline
Start: ${new Date(data.implementation.timeline.start).toLocaleDateString()}
End: ${new Date(data.implementation.timeline.end).toLocaleDateString()}

### Milestones
${data.implementation.timeline.milestones.map((m: any) => `- **${m.title}** (${new Date(m.date).toLocaleDateString()})`).join('\n')}

## Recommendations
${data.recommendations.map((r: string) => `- ${r}`).join('\n')}
`;
}

function generateYAML(data: any): string {
  return `metadata:
  title: "${data.metadata.title}"
  generated: "${data.metadata.generated}"
  completeness: ${data.metadata.completeness}

problemFraming:
  problem: "${data.problemFraming.problem}"
  successCriteria:
${data.problemFraming.successCriteria.map((c: string) => `    - "${c}"`).join('\n')}

selectedSolutions:
${data.selectedSolutions.map((s: any) => `  - title: "${s.title}"
    description: "${s.description}"
    feasibility: ${s.feasibility}
    impact: ${s.impact}`).join('\n')}

implementation:
  timeline:
    start: "${data.implementation.timeline.start}"
    end: "${data.implementation.timeline.end}"
    milestones:
${data.implementation.timeline.milestones.map((m: any) => `      - title: "${m.title}"
        date: "${m.date}"`).join('\n')}

recommendations:
${data.recommendations.map((r: string) => `  - "${r}"`).join('\n')}
`;
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}