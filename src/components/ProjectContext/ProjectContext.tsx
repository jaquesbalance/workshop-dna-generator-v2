import { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import { Button } from '../Button/Button';
import type { WorkshopState, ProjectContext as ProjectContextType, Technology, Milestone } from '../../types';

interface ProjectContextProps {
  workshopData: WorkshopState;
  onUpdate: (context: ProjectContextType) => void;
}

export function ProjectContext({ workshopData, onUpdate }: ProjectContextProps) {
  const { projectContext } = workshopData;
  const [newTechnology, setNewTechnology] = useState({ name: '', purpose: '', category: 'frontend' });
  const [newMilestone, setNewMilestone] = useState({ title: '', description: '', dueDate: '', deliverables: '' });

  const addTechnology = () => {
    if (newTechnology.name && newTechnology.purpose) {
      const tech: Technology = {
        name: newTechnology.name,
        purpose: newTechnology.purpose,
      };

      const category = newTechnology.category as keyof typeof projectContext.techStack;
      const updatedContext = {
        ...projectContext,
        techStack: {
          ...projectContext.techStack,
          [category]: [...projectContext.techStack[category], tech],
        },
      };

      onUpdate(updatedContext);
      setNewTechnology({ name: '', purpose: '', category: 'frontend' });
    }
  };

  const addMilestone = () => {
    if (newMilestone.title && newMilestone.dueDate) {
      const milestone: Milestone = {
        id: generateId(),
        title: newMilestone.title,
        description: newMilestone.description,
        dueDate: new Date(newMilestone.dueDate),
        deliverables: newMilestone.deliverables.split(',').map(d => d.trim()).filter(d => d),
      };

      const updatedContext = {
        ...projectContext,
        timeline: {
          ...projectContext.timeline,
          milestones: [...projectContext.timeline.milestones, milestone],
        },
      };

      onUpdate(updatedContext);
      setNewMilestone({ title: '', description: '', dueDate: '', deliverables: '' });
    }
  };

  const updateTimeline = (field: 'startDate' | 'endDate', value: string) => {
    const updatedContext = {
      ...projectContext,
      timeline: {
        ...projectContext.timeline,
        [field]: new Date(value),
      },
    };
    onUpdate(updatedContext);
  };

  return (
    <div className="project-context" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <div className="phase-header" style={{ marginBottom: '32px' }}>
        <h1 className="headline-large">Project Context</h1>
        <p className="body-large">Define implementation parameters, technology stack, and timeline.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Timeline */}
        <section className="surface elevation-1" style={{ padding: '24px', borderRadius: '12px' }}>
          <h2 className="title-large" style={{ marginBottom: '16px' }}>Project Timeline</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label className="label-large" style={{ display: 'block', marginBottom: '8px' }}>Start Date</label>
              <input
                type="date"
                value={projectContext.timeline.startDate.toISOString().split('T')[0]}
                onChange={(e) => updateTimeline('startDate', e.target.value)}
                style={{ width: '100%', padding: '12px', border: '1px solid var(--md-sys-color-outline)', borderRadius: '8px' }}
              />
            </div>
            <div>
              <label className="label-large" style={{ display: 'block', marginBottom: '8px' }}>End Date</label>
              <input
                type="date"
                value={projectContext.timeline.endDate.toISOString().split('T')[0]}
                onChange={(e) => updateTimeline('endDate', e.target.value)}
                style={{ width: '100%', padding: '12px', border: '1px solid var(--md-sys-color-outline)', borderRadius: '8px' }}
              />
            </div>
          </div>

          <h3 className="label-large" style={{ marginBottom: '16px' }}>Milestones</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            {projectContext.timeline.milestones.map((milestone) => (
              <div key={milestone.id} className="surface-variant" style={{ padding: '16px', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Calendar size={16} />
                  <h4 className="label-large">{milestone.title}</h4>
                  <span style={{ marginLeft: 'auto', fontSize: '14px', color: 'var(--md-sys-color-on-surface-variant)' }}>
                    {milestone.dueDate.toLocaleDateString()}
                  </span>
                </div>
                {milestone.description && <p className="body-large" style={{ marginBottom: '8px' }}>{milestone.description}</p>}
                {milestone.deliverables.length > 0 && (
                  <div>
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>Deliverables:</span>
                    <ul style={{ marginLeft: '16px', marginTop: '4px' }}>
                      {milestone.deliverables.map((deliverable, index) => (
                        <li key={index} style={{ fontSize: '14px' }}>{deliverable}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="surface-variant" style={{ padding: '16px', borderRadius: '8px' }}>
            <h4 className="label-large" style={{ marginBottom: '12px' }}>Add Milestone</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: '12px', marginBottom: '12px' }}>
              <input
                type="text"
                placeholder="Milestone title"
                value={newMilestone.title}
                onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                style={{ padding: '10px', border: '1px solid var(--md-sys-color-outline)', borderRadius: '6px' }}
              />
              <input
                type="date"
                value={newMilestone.dueDate}
                onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
                style={{ padding: '10px', border: '1px solid var(--md-sys-color-outline)', borderRadius: '6px' }}
              />
            </div>
            <input
              type="text"
              placeholder="Description (optional)"
              value={newMilestone.description}
              onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
              style={{ width: '100%', padding: '10px', marginBottom: '12px', border: '1px solid var(--md-sys-color-outline)', borderRadius: '6px' }}
            />
            <input
              type="text"
              placeholder="Deliverables (comma-separated)"
              value={newMilestone.deliverables}
              onChange={(e) => setNewMilestone({ ...newMilestone, deliverables: e.target.value })}
              style={{ width: '100%', padding: '10px', marginBottom: '12px', border: '1px solid var(--md-sys-color-outline)', borderRadius: '6px' }}
            />
            <Button variant="tonal" onClick={addMilestone} startIcon={<Plus size={16} />}>
              Add Milestone
            </Button>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="surface elevation-1" style={{ padding: '24px', borderRadius: '12px' }}>
          <h2 className="title-large" style={{ marginBottom: '16px' }}>Technology Stack</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            {(['frontend', 'backend', 'database', 'infrastructure', 'tools'] as const).map((category) => (
              <div key={category}>
                <h3 className="label-large" style={{ marginBottom: '12px', textTransform: 'capitalize' }}>{category}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {projectContext.techStack[category].map((tech, index) => (
                    <div key={index} className="surface-variant" style={{ padding: '8px 12px', borderRadius: '6px' }}>
                      <div style={{ fontWeight: '500', fontSize: '14px' }}>{tech.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--md-sys-color-on-surface-variant)' }}>{tech.purpose}</div>
                    </div>
                  ))}
                  {projectContext.techStack[category].length === 0 && (
                    <div style={{ color: 'var(--md-sys-color-on-surface-variant)', fontSize: '14px', fontStyle: 'italic' }}>
                      No technologies added
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="surface-variant" style={{ padding: '16px', borderRadius: '8px' }}>
            <h4 className="label-large" style={{ marginBottom: '12px' }}>Add Technology</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 150px', gap: '12px', marginBottom: '12px' }}>
              <select
                value={newTechnology.category}
                onChange={(e) => setNewTechnology({ ...newTechnology, category: e.target.value })}
                style={{ padding: '10px', border: '1px solid var(--md-sys-color-outline)', borderRadius: '6px' }}
              >
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="database">Database</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="tools">Tools</option>
              </select>
              <input
                type="text"
                placeholder="Technology name"
                value={newTechnology.name}
                onChange={(e) => setNewTechnology({ ...newTechnology, name: e.target.value })}
                style={{ padding: '10px', border: '1px solid var(--md-sys-color-outline)', borderRadius: '6px' }}
              />
              <Button variant="tonal" onClick={addTechnology} size="small">
                Add
              </Button>
            </div>
            <input
              type="text"
              placeholder="Purpose/use case"
              value={newTechnology.purpose}
              onChange={(e) => setNewTechnology({ ...newTechnology, purpose: e.target.value })}
              style={{ width: '100%', padding: '10px', border: '1px solid var(--md-sys-color-outline)', borderRadius: '6px' }}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}